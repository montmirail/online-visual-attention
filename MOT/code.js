/* MOT/code.js:
 * This controls the logic and presentation of trials during the full version of the MOT task.
 * The trial order is determined by a text file (trialorder.txt) read in by MOT/code.php.
 * The calibration information from the subject's calibration is used to determine the size of the stimuli
 * on the screen.
 * 
 * During a trial, there are several dots that move around the screen. At the beginning of a trial, 1 or more dots are chosen 
 * as the dots the subject should attend to (cued dots, which appear as blue sad faces). After a set amount of time, these dots change
 * to appear like the other dots (yellow happy faces) and continue to move around with the other dots. Then after another set amount
 * of time, all the dots stop and one dot is highlighted (queried dot). The subject must respond whether the queried dot was originally
 * a cued dot or if it was a normal dot throughout the entire trial.
 */

// *********************** VARIABLES ************************ //
var MOT = {}; //storage for all variables in this task

//seed the random number generator (this is set up by js_utils/seedrandom.js)
//set up in case a subject's trial needs to be replicated later
MOT.targetSeed = new Date().getTime(); //stores seed used for the randon number generator used for initial dot setup
MOT.targetRandomizer = new Math.seedrandom(MOT.targetSeed); //set RNG with seed
MOT.trialSeed = new Array(); //stores what seed was used for each trial
MOT.drawCounter = new Array(); //stores how many frames were drawn per trial

// keyboard control variables ---------------------------------
MOT.yesKey = 66; //b for blue
MOT.noKey = 89; //y for yellow
MOT.startKey = 32; //space bar
MOT.resumeKey = 13; //enter

//stimuli, trial, and block variables ----------------------------------

//get variables from session information (via MOT/code.php)
MOT.pxperdeg = <?php echo $pxperdeg; ?>;
MOT.monitorsize = <?php echo $monitorsize; ?>;

//setting up the stimuli images
MOT.img = new Array(new Image(), new Image(), new Image());
var imgDir = "./img/"; //image directory
MOT.img[0].src =  imgDir + "happy_face.jpg"; //yellow stimulus
MOT.img[1].src =  imgDir + "sad_face.jpg"; //blue stimulus
MOT.img[2].src =  imgDir + "query.jpg"; //probe/queried stimulus

MOT.numDots = 16; //total number of dots in a trial
MOT.numAttendDots = <?php echo json_encode($order); ?>; //number of dots to attend to per trial (obtained from MOT/code.php)
MOT.numTrials = MOT.numAttendDots.length; // total number of trials
MOT.numBlocks = 3; //total number of blocks
MOT.blockCorrect = 0; //stores number of correct trials in a block
MOT.trialsPerBlock = Math.round(MOT.numTrials/MOT.numBlocks); //number of trials per block, should be equal for all blocks

MOT.dotRad = Math.round(0.4*MOT.pxperdeg); //dot radius (deg*ppd)
MOT.imgsz = MOT.dotRad*2; //dot size (diameter, in pixels)

MOT.straightProb = 0.4; //probability that a dot will move in a straight line
MOT.angSD = 0.2; //the maximum deviation from a dot's current angle of motion in order to vary dot motion, if it is not moving in a straight line

//timing variables
MOT.speed = 16; //length of time for each frame (ms/frame)
MOT.tCue = 2000; //duration of presentation of cue (ms)
MOT.tMove = 4000; //duration of dots moving (after the cue period) before asking about probed dot (ms)
MOT.dotVel = 5; //velocity of dots in degrees/sec
MOT.vel = Math.ceil(MOT.dotVel * MOT.pxperdeg / (1/(MOT.speed/1000))); //velocity of dots in pixels/frame
MOT.startWait = 0; //keeps track of timer start

//stimuli movement limits
MOT.minSep = Math.round(1.5*MOT.pxperdeg); //minimum distance allowed between dots (deg*ppd)
MOT.minFix = Math.round(3*MOT.pxperdeg); //minimum distance allowed from fixation (deg*ppd)
MOT.maxFix = Math.round(10*MOT.pxperdeg); //maximum distance allowed from fixation (deg*ppd)
MOT.minEdge = Math.ceil(2*Math.sqrt(2)*(MOT.vel+1))+MOT.dotRad+4; //minimum distance from edge


//counters and data arrays ----------------------------------------
MOT.trial = 0; //current trial
MOT.trialStart = new Array(); //stores start time of each trial
MOT.response = new Array();  //stores subject's responses per trial
MOT.correct = new Array(); //stores if subject was correct per trial
MOT.rt = new Array(); //response time per trial

//initial first trial values
MOT.response[0] = -1;
MOT.correct[0] = -1;
MOT.rt[0] = -1;

MOT.dotPosX = createEmptyDotArray(); //stores X position of each dot per trial (updated at each frame)
MOT.dotPosY = createEmptyDotArray(); //stores Y position of each dot per trial (updated at each frame)
MOT.dotMovAng = new Array(); //stores current angle of motion for each dot (updated at each frame)
MOT.probeTracked = new Array(); //store whether the trial asked if a dot that needed to be attended to (blue) was the dot that was queried about at the end of a trial
MOT.probedDot = new Array(); //store the identity of the probed dot (the one asked about at the end of the trial)

//state control --------------------------------------------------
MOT.state = "start"; //this keeps track of the trial state; state order: start/fix, cue, move, response, (then back to fix)
MOT.stateChange = false; //keeps track if the state changed during the trial
MOT.done = false; //keeps track if subject is done with all the trials
MOT.dialogOpen = false; //keeps track of whether dialog window is open or not
MOT.initState = false; //keeps track if the current trial needs to be initialized


// *********************** DRAWING CONTROL ************************ //

// for efficient redraw calls (from Paul Irish - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame || 
          window.oRequestAnimationFrame || 
          window.msRequestAnimationFrame || 
          function(/* function FrameRequestCallback */ callback){
            window.setTimeout(callback, 1000 / 60);
          };
})();

//controls state/canvas update
function draw(){
  requestAnimFrame(draw);
  updateFrame();
};

// *********************** INITIALIZATION ************************** //

//wait until the HTML5 page is ready before setting up all the widgets
$(document).ready(init);

//setup buttons and dialog windows
function init() { 
	//hide content before subject starts
	$("#postexpt").hide();

	//set up the continue button that allows the subject to start the task
	$("#cButton").button();
	$("#cButton").click(initCanvas);
	$("#cButton").button( "option", "disabled", true );
	
	//set up the reminder button which brings up short instructions in a dialog box
	$("#reminderButton").button({
		icons: { primary: "ui-icon-info"},
		text: false
	});	
	$("#reminderButton").click( function() {
		$("#reminder").dialog("open");
	});
	
	//set up the reminder dialog that appears with short instructions
	$("#reminder").dialog({
		autoOpen: false,
		modal: true,
		title: "Instructions & Controls",
		width: 400
	});

	//add keyboard listener to keep track of keys the subject presses
	window.addEventListener("keydown", keyResponse, true);

	//subject can now move on, now that everything is setup, so enable continue button
	$("#cButton").button( "option", "disabled", false );
}

//this function initializes the HTML5 canvas for stimuli presentation
function initCanvas() {
	//hide fullscreen message
	$("#preexpt").hide();
	
	//initialize canvas
	MOT.canvas = document.getElementById("exptCanvas");
	MOT.c = MOT.canvas.getContext("2d");
	MOT.canvas.height = window.innerHeight; //set canvas height to full browser window size for content
	MOT.canvas.width = window.innerWidth; //make the canvas square
	MOT.cx = Math.round(MOT.canvas.width/2); //get center x coordinate of canvas
	MOT.cy = Math.round(MOT.canvas.height/2); //get center y coordinate of canvas
	MOT.c.fillStyle="rgb(0, 0, 0)"; //set the canvas color to black
	MOT.c.fillRect(0,0,MOT.canvas.width,MOT.canvas.height);
	
	//update the dots' maximum distance they can be away from the fixation point
	//if the subject's screen cannot support the maximum distance originally set,
	//then set the distance to be the radius of the canvas
	MOT.maxFix = Math.min(MOT.maxFix, MOT.cy); 
	MOT.stateChange = true; //update the content to the current state
	MOT.startTime = performance.now(); //get the task start time
	draw(); //start the task
}


// ************************* STATE UPDATES *************************** //

//At each frame, the frame is redrawn based on the current state
function updateFrame() {
	//check if dialog window for instructions is open
	if ($("#reminder").dialog("isOpen")) {
		MOT.dialogOpen = true;
	}
	else {
		MOT.dialogOpen = false;
	}
	
	
	if (MOT.state == "start" || MOT.state == "fix") { //start of task or start of trial
		if (MOT.stateChange) {
			MOT.stateChange = false; //turn off state change
			MOT.trialSeed[MOT.trial] = MOT.trial; //set trial seed
			Math.seedrandom(MOT.trial); //create random number generator based on seed
			drawContent(); //draw updated content
		}
		//wait for space bar
	}
	
	else if (MOT.state == "break") { //break between blocks
			if (MOT.stateChange) {
				MOT.stateChange = false; //turn off state change
				drawContent(); //draw updated content
			}
		//wait for space bar	
	}
	
	else if (MOT.state == "cue") { //display dots that should be tracked while moving all dots around
		if (MOT.stateChange) {
			MOT.startWait = performance.now(); //get start time of cue period
			MOT.stateChange = false; //turn off state change
			MOT.initState = true; //note that the trial needs to be set up		
			drawContent(); //draw updated content
		}
		//check how much time has passed; if the full time for the cue period has passed, move onto the "move" state
		if (performance.now() >= MOT.startWait + MOT.tCue) {
			MOT.state = "move";
			MOT.stateChange = true;
		}
		else {
			//keep updating movement of dots
			drawContent();
		}
	}	
	
	else if (MOT.state == "move") { //change the target dots to normal color (dots still moving)
		if (MOT.stateChange) {
			MOT.startWait = performance.now(); //get start time of move period
			MOT.stateChange = false; //turn off state change
			drawContent(); //draw updated content
		}
		//check how much time has passed; if the full time for the cue period has passed, move onto the "response" state
		if (performance.now() >= MOT.startWait + MOT.tMove) {
			MOT.state = "response";
			MOT.stateChange = true;
		}
		else {
			//keep updating movement of dots
			drawContent();
		}
	}
	
	else if (MOT.state == "response") { //wait for subject response to the probed dot
		if (MOT.stateChange) {
			MOT.startWait = performance.now(); //get start time of response period
			MOT.stateChange = false; //turn off state change
			
			//choose randomly (~50/50) whether or not the dot selected will be an originally cued dot or not
			MOT.probeTracked[MOT.trial] = Math.round(MOT.targetRandomizer());
			if (MOT.probeTracked[MOT.trial]) { //if it is, then randomly select one of the cued dots as the queried dot
				MOT.probedDot[MOT.trial] = Math.floor(MOT.targetRandomizer()*MOT.numAttendDots[MOT.trial]);
			}
			else { //otherwise, choose any of the other dots as the queried dot
				MOT.probedDot[MOT.trial] = Math.floor(MOT.targetRandomizer()*(MOT.numDots-MOT.numAttendDots[MOT.trial]))+MOT.numAttendDots[MOT.trial];
			}
			
			drawContent(); //update the content
		}
		//once the subject has given a response for the trial, then move on
		if (MOT.response[MOT.trial] != -1) {
			updateTrial(); //update trial data
			if (MOT.done) { //if this was the last trial, then take the participant to the end of the task
				MOT.state = "done";
				submitResults(); //send data to database
			}
			else if (MOT.trial % MOT.trialsPerBlock == 0) { //if this was the last trial of a block, then let the subject take a break
				MOT.state = "break";
			}
			else { //otherwise, move onto the next trial
				MOT.state = "fix";
			}
			MOT.stateChange = true;
		}
	}
}



// ********************** DRAWING METHODS ************************** //

// this is the main function for controlling what is drawn on the canvas during the trials
function drawContent() {
	//set the background to black
	MOT.c.fillStyle="rgb(0, 0, 0)";
	MOT.c.fillRect(0,0,MOT.canvas.width,MOT.canvas.height);

	//create the gray circle that the dots move within
	//(size is the extent of the canvas)
	MOT.c.fillStyle="rgb(128,128,128)";
	MOT.c.beginPath();
	MOT.c.arc(MOT.cx, MOT.cy, Math.floor(MOT.canvas.height/2),0, 2*Math.PI);
	MOT.c.fill();	
	
	//draw on canvas based on state
	if (MOT.state == "start" || MOT.state == "fix") {
		MOT.drawCounter[MOT.trial] = 0; //reset counter for keeping track of number of frames drawn during a trial
		
		drawFix(); //draw fixation point

		//set font parameters	
		MOT.c.fillStyle="black";
		MOT.c.font="12pt Arial";
		MOT.c.textAlign="center";

		//set text displayed to subject
		MOT.c.fillText("Press the space bar to start the trial.", MOT.cx, MOT.cy+25);
	}
	else if (MOT.state == "break") {

		//set font parameters	
		MOT.c.fillStyle="black";
		MOT.c.font="12pt Arial";
		MOT.c.textAlign="center";

		//calculate percent correct for the block
		var percentCorrect = Math.round(MOT.blockCorrect/MOT.trialsPerBlock*100);

		//set feedback text displayed
		var breakText1 = "You got " + percentCorrect + 
		"% correct for this block. Time to take a break!";
		var breakText2 = "When you are ready to resume the task, press Enter.";
		MOT.c.fillText(breakText1, MOT.cx, MOT.cy+25);
		MOT.c.fillText(breakText2, MOT.cx, MOT.cy+50);
	}
	else if (MOT.state == "cue" || MOT.state == "move") {
		MOT.drawCounter[MOT.trial]++; //increment frame counter
		
		drawFix(); //draw fixation point
	
		if (MOT.initState) { //it's the initialization state, so set up all the dots
			$("#exptCanvas").css({cursor: 'none'}); //hide the cursor

			//Now draw target and distractor dots moving:
			//choose initial positions and velocities		
			for (var i = 0; i < MOT.numDots; i++) {
				var restart = 1; //keeps track if the initial dot position need to be recalculated

				while (restart) {
					restart = 0;

					//choose the initial x and y position for this dot (a valid position within the boundaries)
					MOT.dotPosX[MOT.trial][i] = Math.random() * 2 * (MOT.maxFix-MOT.minEdge) + MOT.minEdge + MOT.cx - MOT.maxFix;
					MOT.dotPosY[MOT.trial][i] = Math.random() * 2 * (MOT.maxFix-MOT.minEdge) + MOT.minEdge + MOT.cy - MOT.maxFix;
				
					// if the dot ended up outside of the boundaries, then refind a position for this dot
					var r2 = Math.pow(MOT.dotPosX[MOT.trial][i]-MOT.cx, 2) + Math.pow(MOT.dotPosY[MOT.trial][i]-MOT.cy, 2);
					if (r2 < Math.pow(MOT.minFix, 2) || r2 > Math.pow(MOT.maxFix-MOT.minEdge, 2)) {
						restart = 1;
						continue;
					}

					//then check the distances between this dot and all previously positioned dots
					if (!restart && i >= 1) {
						for (var j = 0; j < i; j++) {
							//if it starts too close to another dot, then find a new position for this current dot
							if (Math.pow(MOT.dotPosX[MOT.trial][i]-MOT.dotPosX[MOT.trial][j],2) + Math.pow(MOT.dotPosY[MOT.trial][i]-MOT.dotPosY[MOT.trial][j], 2) < Math.pow(MOT.minSep, 2)) {
								restart = 1;
								break;
							}
						}
					}
				}
			}
		
			for (var i = 0; i < MOT.numDots; i++) {
				//now randomly assign a starting angle of motion for each dot
				MOT.dotMovAng[i] = Math.random() * 2 * Math.PI;

				var faceType;
				//the first X dots in the array start as the cued dots (X = total number of dots to attend to during that trial)
				if (i < MOT.numAttendDots[MOT.trial]) {
					faceType = MOT.img[1];
				}
				else { //the rest are normal dots 
					faceType = MOT.img[0];
				}

				//now draw the dot
				MOT.c.drawImage(faceType, MOT.dotPosX[MOT.trial][i] - MOT.dotRad, MOT.dotPosY[MOT.trial][i] - MOT.dotRad, MOT.imgsz, MOT.imgsz);
			}
			
			MOT.initState = false; //turn off initialization state
		}
		else { //no longer the initialization state, so just keep the dots moving
			var posXNew = new Array();
			var posYNew = new Array(); 
			var randomize = new Array();

			//assign a random number to each dot
			for (var i = 0; i < MOT.numDots; i++) {
				randomize[i] = Math.random();
			}
			
			for (var i = 0; i < MOT.numDots; i++) {
				//if the dot's number is greater than the straight probability, then the dot's
				//current trajectory will change to a randomly selected angle within the maximum deviation
				if (randomize[i] > MOT.straightProb) {
					var randomness = Math.random() * MOT.angSD;
					if (Math.random() > 0.5) {
						randomness = -randomness;
					}
				
					MOT.dotMovAng[i] = MOT.dotMovAng[i] + randomness;
				}
	
				//predicted position change (calculated based on current position plus the calculated distance and direction based on angle and dot speed)
				posXNew[i] = MOT.dotPosX[MOT.trial][i] + Math.cos(MOT.dotMovAng[i]) * MOT.vel;
				posYNew[i] = MOT.dotPosY[MOT.trial][i] - Math.sin(MOT.dotMovAng[i]) * MOT.vel;
				
				//if the dot is past the inner or outer boundaries, then reflect the motion of the dot
				// (this makes it looks like it bounces off the boundary walls)
				var r2 = Math.pow(posXNew[i] - MOT.cx, 2) + Math.pow(posYNew[i] - MOT.cy, 2);
				if (r2 < Math.pow(MOT.minFix, 2) || r2 > Math.pow(MOT.maxFix-MOT.minEdge, 2)) {
					var temp = MOT.dotMovAng[i];
					MOT.dotMovAng[i] = 
					2 * Math.atan2(-(MOT.dotPosY[MOT.trial][i] - MOT.cy), MOT.dotPosX[MOT.trial][i] - MOT.cx) - 
					MOT.dotMovAng[i] - Math.PI;
				}
			}
			
			// check if any of the dots collide with each other; if they do, then reflect their motion
			//(similar to billiard balls hitting each other)
			for (var i = 0; i < MOT.numDots-1; i++) {
				for (var j = i+1; j < MOT.numDots; j++) {
					if (Math.pow(posXNew[i] - posXNew[j], 2) + Math.pow(posYNew[i] - posYNew[j], 2) < Math.pow(MOT.minSep, 2)) {
						var tempAngle = MOT.dotMovAng[i];
						MOT.dotMovAng[i] = MOT.dotMovAng[j];
						MOT.dotMovAng[j] = tempAngle;
					}
				}
			}
			
			
			//with these new positions, now update and draw the dots
			for (var i = 0; i < MOT.numDots; i++) {
				MOT.dotPosX[MOT.trial][i] = MOT.dotPosX[MOT.trial][i] + Math.cos(MOT.dotMovAng[i]) * MOT.vel;
				MOT.dotPosY[MOT.trial][i] = MOT.dotPosY[MOT.trial][i] - Math.sin(MOT.dotMovAng[i]) * MOT.vel;
				
				//if we're in the cue state, then make sure the dots that need to be cued dots are displayed properly
				var faceType;
				if (MOT.state == "cue" && i < MOT.numAttendDots[MOT.trial]) {
					faceType = MOT.img[1];
				}
				else {
					faceType = MOT.img[0];
				}

				//draw the dot
				MOT.c.drawImage(faceType, MOT.dotPosX[MOT.trial][i] - MOT.dotRad, MOT.dotPosY[MOT.trial][i] - MOT.dotRad, MOT.imgsz, MOT.imgsz);
			}
		}
	}
	else if (MOT.state == "response") {
		drawFix(); //draw the fixation point
		
		//now update and draw the dots (no longer moving)
		for (var i = 0; i < MOT.numDots; i++) {
			var faceType;
			//if current dot is the dot to be queried, then change it to the queried dot stimulus
			if (i == MOT.probedDot[MOT.trial]) {
				faceType = MOT.img[2];
			}
			else { //set all the other dots to the normal stimulus image
				faceType = MOT.img[0];
			}

			//draw the dot
			MOT.c.drawImage(faceType, MOT.dotPosX[MOT.trial][i] - MOT.dotRad, MOT.dotPosY[MOT.trial][i] - MOT.dotRad, MOT.imgsz, MOT.imgsz);
		}
		
		$("#exptCanvas").css({cursor: 'default'}); //reset the cursor to be visible
		
		

	}
}


//draw fixation point
function drawFix() {
	MOT.c.fillStyle="white";
	MOT.c.fillRect(MOT.cx-2, MOT.cy-2, 5, 5);
	MOT.c.fillStyle="black";
	MOT.c.fillRect(MOT.cx-1, MOT.cy-1, 3, 3);
}


// ****************** INPUT TRACKER *********************** //

//this function is triggered whenever a key is pressed on the keyboard
function keyResponse(event) {

	//only respond to any key presses if the dialog window for instructions is not open
	if (!MOT.dialogOpen) {

		//if we're in the response state and the subject has yet to give a response to the trial
		if (MOT.state == "response" && MOT.response[MOT.trial] == -1) {
			if (event.keyCode == MOT.noKey) { //the subject has indicated that the queried dot was not a cued dot
				MOT.rt[MOT.trial] = performance.now()-MOT.startWait; //get response time
				MOT.response[MOT.trial] = 0; //set response given by subject
			}
			else if (event.keyCode == MOT.yesKey) { //the subject has indicated the queried dot was a cued dot
				MOT.rt[MOT.trial] = performance.now()-MOT.startWait; //get response time
				MOT.response[MOT.trial] = 1; //set response given by subject
			}

			//check if the subject was correct or not, and record this
			if (MOT.response[MOT.trial] == MOT.probeTracked[MOT.trial]) {
				MOT.correct[MOT.trial] = 1;
			}
			else {
				MOT.correct[MOT.trial] = 0;
			}

			//keep track of number of trials correct for the current block
			MOT.blockCorrect = MOT.blockCorrect + MOT.correct[MOT.trial];
		
		}

		//if the trial start key was pressed and it's the start of a trial, then start the trial
		if (event.keyCode == MOT.startKey && (MOT.state == "start" || MOT.state == "fix")) {
			MOT.trialStart[MOT.trial] = performance.now()-MOT.startTime;
			MOT.state = "cue";
			MOT.stateChange = true;
		}
		//if the break end key was pressed and it's currently a break, then start the next block
		if (event.keyCode == MOT.resumeKey && MOT.state == "break") {
			MOT.blockCorrect = 0; //reset number of correct trials for this block
			MOT.state = "fix"; //change state to start a new trial
			MOT.stateChange = true;
		}
	}
}


// ***************** TRIAL UPDATE ********************* //

//this function prepares the state of the next trial
function updateTrial() {
	MOT.trial++;
	if (MOT.trial >= MOT.numTrials) {
		MOT.done = true;
	}
	else {
		MOT.response[MOT.trial] = -1;
	}
}

// ***********************MISCELLANEOUS FUNCTIONS ***************************** //

//Once the subject is done with all the trials, send all the data at once to the database 
//via the MOT/save.php script; data is passed with semicolons separating each trial's data
function submitResults() {
	//get the subject's current local time
	var d = new Date();
	var localsec = Math.round(d.getTime()/1000) - d.getTimezoneOffset()*60;

	//send data asynchronously
	$.ajax({
		type: "POST",
		url: "save.php",
		data: {
			trialStart: MOT.trialStart.join(";"), //trial numbers
		 	numAttendDots: MOT.numAttendDots.join(";"), // number of dots attended for each trial
		 	probeTracked: MOT.probeTracked.join(";"), //if the queried dot for each trial was initially a cued dot
		 	response: MOT.response.join(";"), //the subject's response for each trial
		 	correct: MOT.correct.join(";"), //if the subject was correct for each trial
		 	rt: MOT.rt.join(";"),  //the subject's response time for each trial
		 	targetSeed: MOT.targetSeed, // the seed used for dot setup in the RNG
		 	trialSeed: MOT.trialSeed.join(";"), //the seed used for each trial for target movement in the RNG
		 	numDrawCalls: MOT.drawCounter.join(";"), //the number of frames drawn for each trial
		 	canvasWidth: MOT.canvas.width, //the canvas's height (px)
		 	canvasHeight: MOT.canvas.height, //the canvas's width (px)
		 	pxperdeg: MOT.pxperdeg, //the pixels per degree used for determining stimuli size
		 	localsec: localsec} //the subject's current local time
	}).done(endExpt); //once the script is done, then go to the end of the task

}

//this executes the end of the task, which displays the percent correct for the final block
//and displays an end message (set in MOT/index.php)
function endExpt() {
	$("#exptCanvas").hide();
	var percentCorrect = Math.round(MOT.blockCorrect/MOT.trialsPerBlock*100);
	var finalText = "Done! You got " + percentCorrect + "% correct for this final block.";
	$("#postexpt-result").text(finalText);
	$("#postexpt").show();
}

//create empty template for 2D array (2 x numTrials)
function createEmptyDotArray() {
	var emptyDotArray = new Array();
	for (var i = 0; i < MOT.numTrials; i++) {
		emptyDotArray[i] = new Array();
		for (var j = 0; j < MOT.numDots; j++) {
			emptyDotArray[i][j] = -1;
		}
	}
	return emptyDotArray;
}




