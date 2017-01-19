/* UFOV/code.js:
 * This controls the logic and presentation of trials during the full version of the UFOV task.
 * The calibration information from the subject's calibration is used to determine the size of the stimuli
 * on the screen.
 * 
 * During the task, the screen displays a center stimulus and a peripheral stimulus to the subject for a brief
 * period of time. A mask of white noise then flashes. Afterwards, the subject then must respond about what center target
 * they saw (a face with short hair or with long hair) and where the peripheral target appeared. The subject responds for
 * the center target via keyboard input; for the peripheral target, lines representative of possible locations appear on the screen,
 * and the subject must select the line along which the peripheral target appeared. The stimulus presentation duration is controlled
 * via a staircase procedure: the duration decreases as the subject gets trials correct, and increases when the subject gets them wrong.
 */

// *********************** VARIABLES ************************** //
var UFOV = {}; //storage for all variables in this task

// stimuli setup -------------------------------------------------------

//position of stimuli on screen
UFOV.pxperdeg = <?php echo $pxperdeg; ?>; //pixels per degree from screen calibration (via UFOV/code.php)
UFOV.monitorsize = <?php echo $monitorsize; ?>; //monitor size from screen calibration (via UFOV/code.php)
UFOV.ecc = new Array(3, 7); //distance of peripheral targets from center of circle (visual angle in degrees); inner and outer circles
UFOV.outerOnly = true; //originally this experiment was setup to present the target at both the inner and outer circles; if this is set to true, then only use the outer circle
UFOV.distEcc = new Array(3, 5, 7); //distance of peripheral distractors from center of circle (visual angle in degrees); 3 circles in total
UFOV.thetaPos = new Array(45, 90, 135, 180, 225, 270, 315, 360); //position around the center of the circle (in degrees)
UFOV.mode = 3; //which stimuli to show (1 = center only, 2 = peripheral only, 3 = both)

//set up stimuli images
var imgDir = "./img/"; //image directory
UFOV.cimg = new Array(new Image(), new Image());
UFOV.cimg[0].src = imgDir + "shorthair.jpg"; //short hair center target
UFOV.cimg[1].src = imgDir + "longhair.jpg"; //long hair center target
UFOV.ptarget = new Image();
UFOV.pdistract = new Image();
UFOV.ptarget.src = imgDir + "target.jpg"; //peripheral target
UFOV.pdistract.src = imgDir + "distractor.jpg"; //peripheral distractor

//setup feedback images
UFOV.response = new Array(new Image(), new Image());
UFOV.feedback = new Array(new Image(), new Image());
UFOV.response[0].src = imgDir + "query.png"; //image to display when no center response has been given, or an invalid peripheral location was selected 
UFOV.response[1].src = imgDir + "whitex.png"; //marker for where the subject indicated there was a peripheral target
UFOV.feedback[0].src = imgDir + "redx.png"; //feedback for getting the center or peripheral response incorrect
UFOV.feedback[1].src = imgDir + "greencheck.png"; //feedback for getting the center or peripheral response correct

//set stimuli sizes
UFOV.pimgsz = 1*UFOV.pxperdeg;
UFOV.cimgsz = 1*UFOV.pxperdeg;
UFOV.respsz = 1*UFOV.pxperdeg;

//set mask density (the mask is displayed after the stimuli are flashed on the screen)
//this sets the size of the grayscale squares in the mask
UFOV.maskDensity = 2;


// keyboard and mouse control variables ---------------------------------
UFOV.shortKey = 83; //s
UFOV.longKey = 68; //d
UFOV.cText = ["S", "D"]; //text to display in the center for center responses
UFOV.startKey = 32; //space bar

//acceptable distances for peripheral mouse click responses
UFOV.respDegLim = 120/UFOV.thetaPos.length; //acceptable angular distance from spokes
UFOV.respDegMin = 1*UFOV.pxperdeg; // minimum distance from center


//timing variables -----------------------------------------------
UFOV.speed = 16; //length of time for each frame (ms/frame)
UFOV.initDur = new Array(9, 15); //initial duration of stimulus display for a trial (frames * ms/frame); the two numbers are for the inner and outer circle, respectively
UFOV.minFrames = 1; //minimum stimulus presentation duration, in frames
UFOV.maxFrames = 99; //maximum stimulus presentation duration, in frames
UFOV.curDelay = 0; //stores the current delay duration before stimulus presentation
UFOV.minDelay = 200; //minimum delay duration before stimulus presentation
UFOV.maxDelay = 1000; //maximum delay duration before stimulus presentation
UFOV.maskDur = 320; //duration of mask presentation (ms)
UFOV.feedbackDelay = 350; //time to wait before displaying feedback (ms)
UFOV.feedbackTime = 400; //duration for displaying feedback (ms)
UFOV.startWait = 0; //keeps track of timer start
UFOV.promptTime = 5000; //gives a prompt after x time that a response is needed (if the subject is taking too long to respond to both targets)


//trial and staircase variables ------------------------------------------------------
UFOV.maxTrials = 72; //maximum number of trials the subject can complete before ending the task
UFOV.correctDec = 3; //the stimulus presentation duration will decrease after this number of trials have been answered correctly consecutively
UFOV.incorrectInc = 1; //the stimulus presentation duration will increase after this number of trials have been answered incorrectly consecutively
UFOV.initStep = 2; //initially current step size (in frames) is increased or decreased by this value (larger value to speed up reaching threshold)
UFOV.finalStep = 1; //later on, current step size (in frames) is increased or decreased by this value (smaller value to be more precise about the threshold)
UFOV.step = new Array(UFOV.initStep, UFOV.initStep); //this keeps track of the current step multiplier for the inner and outer staircase
													 //(currently defaults to only using outer staircase)
UFOV.switchReversals = 3; //how many reversals are needed in the staircase before the step multiplier changes from initStep to finalStep
UFOV.stopReversals = 8; //how many reversals are needed in the staircase before the task can end
UFOV.maxCeilTrials = 10; //the maximum number of consecutive trials that can have the same duration (only applies for the ceiling value or floor value)

//create storage for the maximum number of trials that can be completed
//(double the value if both the inner and outer circles are used for the targets -- currently only uses outer circle)
if (UFOV.outerOnly) {
	UFOV.nTrials = UFOV.maxTrials;
}
else {
	UFOV.nTrials = UFOV.maxTrials*2;
}

// *************************** TRIAL SETUP ***************************** //

//randomly select a delay duration before stimulus presentation for each trial
UFOV.delays = new Array();
for (var i = 0; i < UFOV.nTrials; i++) {
	UFOV.delays[i] = Math.floor((UFOV.maxDelay - UFOV.minDelay + 1)*Math.random())+UFOV.minDelay;
}

//setup starting stimulus presentation duration for both the inner and outer staircase
UFOV.duration = createEmpty2DArray();
UFOV.frames = createEmpty2DArray();
UFOV.frames[0][0] = UFOV.initDur[0];
UFOV.frames[1][0] = UFOV.initDur[1];
UFOV.duration[0][0] = UFOV.frames[0][0]*UFOV.speed;
UFOV.duration[1][0] = UFOV.frames[1][0]*UFOV.speed;

//create array with equal peripheral target location appearances across all trials
//for both the inner and outer circles
var tmpInner = new Array();
var tmpOuter = new Array();
for (var i = 0; i < Math.ceil(UFOV.maxTrials/UFOV.thetaPos.length); i++) {
	for (var j = 0; j < UFOV.thetaPos.length; j++) {
		tmpInner.push(j);
		tmpOuter.push(j);
	}
}

//now randomize the order of the arrays setup above so that they are presented in a random order
var shuffleInner = tmpInner;
var shuffleOuter = tmpOuter;
UFOV.pPos = createEmpty2DArray();
for (var i = 0; i < UFOV.maxTrials; i++) {
	var indInner = Math.floor(Math.random()*shuffleInner.length); 
	var indOuter = Math.floor(Math.random()*shuffleOuter.length); 
	UFOV.pPos[0][i] = shuffleInner[indInner];
	UFOV.pPos[1][i] = shuffleOuter[indOuter];
	shuffleInner.splice(indInner, 1);
	shuffleOuter.splice(indOuter, 1);
}

//randomize the stimulus type for the center target
//(need two separate arrays for the two different staircases, if both are being used)
UFOV.cStim = createEmpty2DArray();
for (var i = 0; i < UFOV.maxTrials; i++) {
UFOV.cStim[0][i] = Math.floor(Math.random()*2);
UFOV.cStim[1][i] = Math.floor(Math.random()*2);
}

//randomize order of staircase presentation (this only applies if more than one staircase is being used)
//if only one being used, it's only the staircase with the peripheral target at the outer circle
UFOV.sc = new Array();
if (UFOV.outerOnly) {
	for (var i = 0; i < UFOV.nTrials; i++) {
		UFOV.sc[i] = 1; //fill array with 1's
	}
}
else {
	var tmp2 = new Array();
	for (var i = 0; i < UFOV.maxTrials; i++) {
		for (var j = 0; j < 2; j++) {
			tmp2.push(j); //fill array with both 0's and 1's equally
		}
	}
	
	//randomize order
	for (var i = 0; i < UFOV.nTrials; i++) {
		var ind = Math.floor(Math.random()*tmp2.length); 
		UFOV.sc[i] = tmp2[ind];
		tmp2.splice(ind, 1);
	}
}

//response output setup ----------------------------------------------
UFOV.cResp = createEmpty2DArray(); //stores center response per trial (and per staircase if applicable)
UFOV.pResp = createEmpty2DArray(); //stores peripheral response per trial
UFOV.cRT = createEmpty2DArray(); //stores center response time per trial
UFOV.pRT = createEmpty2DArray(); //stores peripheral response time per trial
UFOV.cCorrect = createEmpty2DArray(); //stores if the center response was correct per trial
UFOV.pCorrect = createEmpty2DArray(); //stores if the peripheral response was correct per trial
UFOV.pX = createEmpty2DArray(); //stores the x-coordinate of the point the subject clicked for peripheral response for each trial
UFOV.pY = createEmpty2DArray(); //stores the y-coordinate of the point the subject clicked for peripheral response for each trial
UFOV.pTargetX = createEmpty2DArray(); //stores the actual peripheral target x-position for each trial
UFOV.pTargetY = createEmpty2DArray(); //stores the actual peripheral target x-position for each trial
UFOV.trialStart = createEmpty2DArray(); //stores when each trial started
UFOV.reversals = createEmpty2DArray(); //stores the current number of reversals in the staircase at the time of each trial

//initialize counters ------------------------------------------------
UFOV.floorCount = new Array(0, 0); //number of trials that have occurred with the stimulus presentation duration at the floor value (kept track for the inner and outer staircase)
UFOV.ceilCount = new Array(0, 0); //number of trials that have occurred with the stimulus presentation duration at the ceiling value (kept track for the inner and outer staircase)
UFOV.scTrial = new Array(0, 0); //current trial number within a staircase
UFOV.nRevs = new Array(0, 0); //current number of reversals for each staircase
UFOV.stepRising = new Array(0, 0); //state tracker for if the last step taken was an increase (used for determining when a reversal occurs); tracked for each staircase
UFOV.stepFalling = new Array(0, 0); //state tracker for if the last step taken was a decrease (used for determining when a reversal occurs); tracked for each staircase
UFOV.correctStreak = new Array(0, 0); //current number of trials that the subject has gotten correct consecutively per staircase
UFOV.incorrectStreak = new Array(0, 0); //current number of trials that the subject has gotten incorrect consecutively per staircase
UFOV.trial = 0; //current trial tracker (staircase agnostic)

//state control --------------------------------------------------------
UFOV.state = "start"; //which state the trial is in; state order: start/fix, delay, stim, mask, response, feedback-delay, feedback
UFOV.stateChange = false; //keeps track if the state changed during the trial
UFOV.isScaled = false; //this scales what is drawn on the HTML5 canvas; only implemented when drawing the mask before the response period
UFOV.curSC = [UFOV.sc[UFOV.trial]]; //this keeps track of which staircase is currently being used (either inner or outer staircase)
UFOV.done = false; //keeps track if subject is done with the task
UFOV.dialogOpen = false; //keeps track of whether dialog window is open or not
UFOV.displayPrompt = false; //keeps track of whether subject should be prompted to respond (after taking too long to response to both targets)

//time tracker variables --------------------------
UFOV.startTimes = new Array(); //stores start time of stimulus presentation (for calculating total stimulus presentation duration)
UFOV.endTimes = new Array(); //stores end time of stimulus presentation (for calculating total stimulus presentation duration)


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

//this function sets up buttons amd dialog windows, and the keyboard listener
function init() { 
	//hide content before the subject starts the task
	$("#postexpt").hide();

	//set up the continue button that allows the subject to start the task
	$("#cButton").button();
	$("#cButton").click(initCanvas);
	
	//set up the reminder dialog that appears with short instructions
	$("#reminder").dialog({
	autoOpen: false,
	modal: true,
	title: "Instructions & Controls",
	width: 400
	});

	//set up the reminder button which brings up short instructions in a dialog box
	$("#reminderButton").button({
	icons: { primary: "ui-icon-info"},
	text: false
	});	
	$("#reminderButton").click( function() {
	$("#reminder").dialog("open");
	});

	//add keyboard listener to keep track of keys the subject presses
	window.addEventListener("keydown", keyResponse, true);
}

//this function initializes the HTML5 canvas for stimuli presentation
function initCanvas() {
	//hide fullscreen message
	$("#preexpt").hide();
	
	//initialize canvas
	UFOV.canvas = document.getElementById("exptCanvas");
	UFOV.c = UFOV.canvas.getContext("2d");
	UFOV.canvas.height = window.innerHeight; //set canvas to take up the full width of the browser
	UFOV.canvas.width = window.innerWidth; //set canvas to take up the full height of the browser
	UFOV.cx = Math.round(UFOV.canvas.width/2); //get center x coordinate of canvas
	UFOV.cy = Math.round(UFOV.canvas.height/2); //get center y coordinate of canvas
	convertDeg2Px(); //figure out peripheral stimuli position	
	createMask(); //create mask
	UFOV.c.fillStyle="rgb(0, 0, 0)"; //fill canvas with black background
	UFOV.c.fillRect(0,0,UFOV.canvas.width,UFOV.canvas.height);
	
	$("#exptCanvas").click(mouseUpdate); //set up mouse listener for the canvas
	$("#exptCanvas").mousemove(mouseHover); //add mouse listener for hovering over the canvas

	UFOV.stateChange = true; //keeps track of when the state changed during a trial
	UFOV.startTime = new Date().getTime(); //get the start time of the task
	draw(); //start the task
}

// ************************* STATE UPDATES *************************** //

//At each frame, the frame is redrawn based on the current state
function updateFrame() {
	//check if dialog window for instructions is open
	if ($("#reminder").dialog("isOpen")) {
		UFOV.dialogOpen = true;
	}
	else {
		UFOV.dialogOpen = false;
	}
	
	
	if (UFOV.state == "start") { //first trial of the task
		if (UFOV.stateChange) {
			UFOV.stateChange = false;
			drawContent(); //update content displayed
		}
		//wait for space bar
	}
	
	else if (UFOV.state == "fix") { //start of a trial (that's not the first one)
			if (UFOV.stateChange) {
				UFOV.stateChange = false;
				drawContent(); //update content displayed
			}
		//wait for space bar	
	}

	else if (UFOV.state == "delay") { //delay before stimuli presentation
		if (UFOV.stateChange) {
			UFOV.startWait = new Date().getTime(); //get start time of the delay period
			UFOV.curDelay = UFOV.delays[UFOV.trial]; //store current delay duration
			UFOV.stateChange = false;			
			drawContent(); //update content displayed
		}
		//if the set amount of time for the delay period has passed, then switch to stim state and display stimuli
		else if (new Date().getTime() >= UFOV.startWait + UFOV.curDelay) {
			UFOV.state = "stim";
			UFOV.stateChange = true;
		}
	}	
	
	else if (UFOV.state == "stim") { //stimuli presentation
		if (UFOV.stateChange) {
			UFOV.startWait = new Date().getTime(); //get start time of stimulus presentation
			UFOV.stateChange = false;
			UFOV.startTimes[UFOV.trial] = UFOV.startWait;  //record this presentation start time
			drawContent(); //update content displayed
		}
		else {
			var curTime = new Date().getTime(); //get current time
			//if the set amount of time for the presentation period has passed, then switch to mask state and display mask
			if (curTime >= UFOV.startWait + UFOV.duration[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]) {
				UFOV.state = "mask";
				UFOV.stateChange = true;
				UFOV.endTimes[UFOV.trial] = curTime; //record end time of presentation
			}
		}
	}
		
	else if (UFOV.state == "mask") { //mask presentation
		if (UFOV.stateChange) {
			UFOV.startWait = new Date().getTime(); //get start time of mask period
			UFOV.stateChange = false;
			drawContent(); //update content displayed
		}
		//if the set amount of time for the mask period has passed, then switch to reponse state
		else if (new Date().getTime() >= UFOV.startWait + UFOV.maskDur) {
			UFOV.state = "response";
			UFOV.stateChange = true;
		}
	}
	
	else if (UFOV.state == "response") { //wait for subject's response
		if (UFOV.stateChange) {
			UFOV.startWait = new Date().getTime(); //get start time of response period
			UFOV.stateChange = false;
			drawContent(); //update content displayed
		}
		//once the subject has given a response for the trial, then move on
		//(check if the subject needs to respond to only the center (mode = 1), only the peripheral (mode = 2) or both (mode = 3))
		if ((UFOV.mode == 1 && UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] != -1)
		|| (UFOV.mode == 2 && UFOV.pResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] >= 0)
		|| (UFOV.mode == 3 && UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] != -1 
		&& UFOV.pResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] >= 0)) {
			UFOV.state = "feedback-delay"; //switch to feedback-delay state
			UFOV.stateChange = true;
		}
		
		//if enough time has passed where the subject hasn't responded to all of the required targets,
		//then display a message to note that they need to respond to both the center and peripheral targets
		else if (!UFOV.displayPrompt && new Date().getTime() >= UFOV.startWait + UFOV.promptTime) {
			UFOV.displayPrompt = true; //enable prompt message
			displayPrompt(); //now display prompt message
		}
	}
	
	else if (UFOV.state == "feedback-delay") { //delay before feedback
		if (UFOV.stateChange) {
			UFOV.displayPrompt = false;
			UFOV.startWait = new Date().getTime(); //get start time of feedback delay period
			UFOV.stateChange = false;
		}
		//once the set amount of time for the feedback delay has passed, switch to the feedback state and display feedback
		else if (new Date().getTime() >= UFOV.startWait + UFOV.feedbackDelay) {
			UFOV.state = "feedback";
			UFOV.stateChange = true;
		}
	}
	
	else if (UFOV.state == "feedback") { //feedback given
		if (UFOV.stateChange) {
			UFOV.startWait = new Date().getTime(); //get start time of feedback display
			UFOV.stateChange = false;
			drawContent(); //update content displayed
		}
		//once the set amount of time for the feedback period has passed, check if the subject is done with all the trials
		else if (new Date().getTime() >= UFOV.startWait + UFOV.feedbackTime) {
			updateStaircase(); //update the staircase based on the subject's performance
			if (UFOV.done) { //if done, then start wrapping up the task
				UFOV.state = "done";
				submitResults(); //submit the subject's results to the database
			}
			else {
				UFOV.state = "fix"; //otherwise, move onto the next trial
			}
			UFOV.stateChange = true;
		}
	}
}


// ****************** INPUT TRACKERS *********************** //

//this function is triggered whenever a key is pressed on the keyboard
function keyResponse(event) {

	//only respond to any key presses if the dialog window is not open
	if (!UFOV.dialogOpen) {
		//if it's time for the subject to respond, and we're waiting for a response to the center target
		if (UFOV.state == "response" && (UFOV.mode == 1 || UFOV.mode == 3)
		&& UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] == -1) {
			if (event.keyCode == UFOV.shortKey) {
				UFOV.cRT[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = new Date().getTime()-UFOV.startWait; //calculate response time
				UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = 0; //record that they responded the center target had short hair
				drawContent(); //update content displayed
		
				//Indicate which key the subject pressed by drawing the letter in the center of the screen (S)
				UFOV.c.fillStyle="white";
				UFOV.c.font="bold 30pt Arial";
				UFOV.c.textBaseline = "middle";
				UFOV.c.textAlign="center";
				UFOV.c.fillText(UFOV.cText[0], UFOV.cx, UFOV.cy);
			}
			else if (event.keyCode == UFOV.longKey) {
				UFOV.cRT[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = new Date().getTime()-UFOV.startWait; //calculate response time
				UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = 1; //record that they responded the center target had long hair
				drawContent(); //update content displayed
		
				//Indicate which key the subject pressed by drawing the letter in the center of the screen (D)
				UFOV.c.fillStyle="white";
				UFOV.c.font="bold 30pt Arial";
				UFOV.c.textBaseline = "middle";
				UFOV.c.textAlign="center";
				UFOV.c.fillText(UFOV.cText[1], UFOV.cx, UFOV.cy);
			}
		}
		//if there is already a response to the peripheral target, need to redraw the location they selected:
		//draw a question mark if the location they selected was not a valid spot to select
		if (UFOV.pResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] == -2) {
			UFOV.c.drawImage(UFOV.response[0], Math.round(UFOV.x-UFOV.respsz/2),
			Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
		}
		//otherwise, draw a white X where the subject clicked for indicating where the peripheral target was
		else if (UFOV.pResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] != -1) {
			UFOV.c.drawImage(UFOV.response[1], Math.round(UFOV.x-UFOV.respsz/2),
			Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
		}

		//if they pressed the start key at the beginning of a trial, then start the trial
		if (event.keyCode == UFOV.startKey &&
			(UFOV.state == "start" || UFOV.state == "fix")) {
			UFOV.trialStart[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = new Date().getTime()-UFOV.startTime;
			UFOV.state = "delay";
			UFOV.stateChange = true;
		}
	}
}

//this function checks for mouse input (used for recording the subject's selection of the peripheral target's location)
function mouseUpdate(event) {
	//check first that the help dialog is not open
	if (!UFOV.dialogOpen) {
		//only respond to a mouse click if when a peripheral response is needed
		if (UFOV.state == "response" && (UFOV.mode == 2 || UFOV.mode == 3)
		&& UFOV.pResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] < 0) {
			//get mouse coordinates in relation to the canvas
			UFOV.x = event.pageX - this.offsetLeft;
			UFOV.y = event.pageY - this.offsetTop;
			
			drawContent(); //update content displayed
			
			//if the subject has already responded to the center target, redraw the marker (letter) for their response
			if (UFOV.mode > 2 && UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] != -1) {
				UFOV.c.fillStyle="white";
				UFOV.c.font="bold 30pt Arial";
				UFOV.c.textBaseline = "middle";
				UFOV.c.textAlign="center";
				UFOV.c.fillText(UFOV.cText[UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]], UFOV.cx, UFOV.cy);
			}
			
			//determine which line the subject was attempting to select
			//(based on which is closest to the point they clicked on)
			var r = Math.sqrt(Math.pow(UFOV.x-UFOV.cx,2) + Math.pow(UFOV.y-UFOV.cy,2));
			var theta = (90-180*Math.atan2(UFOV.x-UFOV.cx, UFOV.cy-UFOV.y) / Math.PI) % 360;
			var respDeg = 360;
			var choice = -1;
			for (var i = 0; i < UFOV.thetaPos.length; i++) {
				var minDeg = Math.min(Math.abs(theta - UFOV.thetaPos[i]), Math.abs(360+theta - UFOV.thetaPos[i]));
				if (minDeg < respDeg) {
					respDeg = minDeg;
					choice = i;
				}
			}
			
			//check if the subject's click was close enough to a line, based on the accepted range parameters
			if (r >= UFOV.respDegMin && r <= UFOV.cy && respDeg <= UFOV.respDegLim) {
				//check if the subject's click was close enough to a line, based on the accepted range parameters
				UFOV.pRT[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = new Date().getTime()-UFOV.startWait;
				UFOV.pResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = choice;

				//record specifically where the subject clicked
				UFOV.pX[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = UFOV.x - UFOV.cx;
				UFOV.pY[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = -(UFOV.y - UFOV.cy);

				//draw an X where the subject clicked 
				UFOV.c.drawImage(UFOV.response[1], Math.round(UFOV.x-UFOV.respsz/2),
				Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
			}
			//otherwise, if the click point is outside of the accepted range, display a
			//question mark and have the subject reselect a peripheral line 
			else {
				UFOV.pResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = -2; //this response means they need to give a new response to the peripheral target
				
				UFOV.c.drawImage(UFOV.response[0], Math.round(UFOV.x-UFOV.respsz/2),
				Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
			}
			
			displayPrompt(); //check if the subject needs to be prompted to respond
		}
		
	}
}

//this function detects when the mouse pointer is hovering over a peripheral line during the
//response period, in order to give them feedback about which line they will be selecting when
//they click
function mouseHover(event) {
	//check first that the help dialog is not open
	if (!UFOV.dialogOpen) {
		//only react to the pointer hovering when a peripheral response is needed
		if (UFOV.state == "response" && UFOV.mode > 1 && 
		UFOV.pResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] < 0) {
			var mouseX = event.pageX - this.offsetLeft;
			var mouseY = event.pageY - this.offsetTop;
	
			//determine which line the subject was attempting to select
			//(based on which is closest to the point they clicked on)
			var r = Math.sqrt(Math.pow(mouseX-UFOV.cx,2) + Math.pow(mouseY-UFOV.cy,2));
			var theta = (90-180*Math.atan2(mouseX-UFOV.cx, UFOV.cy-mouseY) / Math.PI) % 360;
			var respDeg = 360;
			var choice = -1;
			for (var i = 0; i < UFOV.thetaPos.length; i++) {
				var minDeg = Math.min(Math.abs(theta - UFOV.thetaPos[i]), Math.abs(360+theta - UFOV.thetaPos[i]));
				if (minDeg < respDeg) {
					respDeg = minDeg;
					choice = i;
				}
			}
			
			var hoveredLine = -1;

			//if they are within range of a nearby line, then mark it as the one they are hovering over
			if (r >= UFOV.respDegMin && r <= UFOV.cy && respDeg <= UFOV.respDegLim) {
				hoveredLine = choice;
			}
			
			drawBlank(); //clear canvas
	
			//Highlight the line the subject is hovering over in a different color
			UFOV.c.strokeStyle="rgb(255,255,0)";
			UFOV.c.lineWidth = 3;
			UFOV.c.beginPath();	 	
			UFOV.c.moveTo(UFOV.cx+0.5, UFOV.cy+0.5);
			//draws highlighted spoke
			UFOV.c.lineTo(0.5+UFOV.pxxSpoke[hoveredLine], 0.5+UFOV.pxySpoke[hoveredLine]);
			UFOV.c.stroke();
			
			//redraw all the other peripheral lines since they were cleared out
			UFOV.c.strokeStyle="rgb(255,255,255)";
			UFOV.c.lineWidth = 1;
			UFOV.c.beginPath();
			for (var i = 0; i < UFOV.thetaPos.length; i++) {	
				if (i != hoveredLine) { 	
					UFOV.c.moveTo(UFOV.cx+0.5, UFOV.cy+0.5);
					//draws spoke edge to the edge of the circle
					UFOV.c.lineTo(0.5+UFOV.pxxSpoke[i], 0.5+UFOV.pxySpoke[i]);
				}
			}
			UFOV.c.stroke();
			
			UFOV.c.fillStyle="white";
			//add back any marker (letter) about what the subject responded for the center target
			if (UFOV.mode != 2 && UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] != -1) {
				UFOV.c.font="bold 30pt Arial";
				UFOV.c.textBaseline = "middle";
				UFOV.c.textAlign="center";
				UFOV.c.fillText(UFOV.cText[UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]], UFOV.cx, UFOV.cy);
			}
			//otherwise, add back a question mark to the center of the screen since the subject hasn't responded yet
			else if (UFOV.mode != 2 && UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] == -1) {
				UFOV.c.drawImage(UFOV.response[0], Math.round(UFOV.cx-UFOV.respsz/2),
					Math.round(UFOV.cy-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
			}

			//check if a question mark needs to be drawn if the subject clicked on an invalid spot for the peripheral target
			if (UFOV.mode != 1 && UFOV.pResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] == -2) {
				UFOV.c.drawImage(UFOV.response[0], Math.round(UFOV.x-UFOV.respsz/2),
					Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
			}

			
			displayPrompt(); //check if the subject needs to be prompted to respond
		}
 	}
}


// ********************** DRAWING METHODS ************************** //

//draw the trial content based on the current state
function drawContent() {

	//check if the canvas is currently scaling (i.e., increasing the size) of what is drawn
	if (UFOV.isScaled) {
		UFOV.c.scale(1/UFOV.maskDensity,1/UFOV.maskDensity); //set scaling back to original value
		UFOV.isScaled = false; //turn off scaling
		UFOV.c.fillStyle="rgb(0, 0, 0)"; //reset background to black
		UFOV.c.fillRect(0,0,UFOV.canvas.width,UFOV.canvas.height);
	}
	
	drawBlank(); //clear canvas
	
	if (UFOV.state == "start" || UFOV.state == "fix") { //at the start of a trial
		drawFix(); //draw fixation point

		//note that the subject needs to press the space bar in order to start the trial
		UFOV.c.fillStyle="black";
		UFOV.c.font="12pt Arial";
		UFOV.c.textAlign="center";
		UFOV.c.fillText("Press the space bar to start.", UFOV.cx, UFOV.cy+25);
	}
	else if (UFOV.state == "delay") { //delay period before stimulus presentation
		$("#exptCanvas").css({cursor: 'none'}); //hide the mouse cursor before stimulus presentation
	}
	else if (UFOV.state == "stim") { //stimulus presentation
		if (UFOV.mode != 2) { //if it's a mode with the center target, then draw it
		drawFace();
		}
		if (UFOV.mode != 1) { //if it's a mode with the peripheral target, then draw it
		drawPeriph();
		}
	}
	else if (UFOV.state == "mask") { //mask presentation
		drawMask();
	}
	else if (UFOV.state == "response") { //response period
		$("#exptCanvas").css({cursor: 'default'}); //show the mouse cursor again so that the subject can use it

		//if it's a practice mode with the peripheral target, 
		//draw lines to represent the possible locations of the target
		if (UFOV.mode > 1) {
			drawSpokes();
		}

		//draw a question mark in the middle of the screen if the subject hasn't given a response
		//to the center target yet
		if (UFOV.mode != 2 && UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] == -1) {
			UFOV.c.drawImage(UFOV.response[0], Math.round(UFOV.cx-UFOV.respsz/2),
				Math.round(UFOV.cy-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
		}

		displayPrompt(); //check if the subject needs to be prompted to respond	


	}
	else if (UFOV.state == "feedback") { //give subject feedback about their responses

		//keep lines for peripheral locations on the screen
		if (UFOV.mode > 1) {
			drawSpokes();
		}

		//give feedback for the peripheral response
		if (UFOV.mode != 1) {
			//if they gave the correct answer
			if (UFOV.pResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] == (UFOV.pPos[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] % UFOV.thetaPos.length)) {
				UFOV.c.drawImage(UFOV.feedback[1], Math.round(UFOV.x-UFOV.respsz/2),
					Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz); //display checkmark
			}
			//if they gave an incorrect answer
			else {
				UFOV.c.drawImage(UFOV.feedback[0], Math.round(UFOV.x-UFOV.respsz/2),
				Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz); //display red X
			}
		}

		//give feedback for the center response
		if (UFOV.mode != 2) {
			//if they gave the correct answer
			if (UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] == UFOV.cStim[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]) {
				UFOV.c.drawImage(UFOV.feedback[1], Math.round(UFOV.cx-UFOV.respsz/2),
					Math.round(UFOV.cy-UFOV.respsz/2), UFOV.respsz, UFOV.respsz); //display checkmark
			}
			//if they gave an incorrect answer
			else {
				UFOV.c.drawImage(UFOV.feedback[0], Math.round(UFOV.cx-UFOV.respsz/2),
					Math.round(UFOV.cy-UFOV.respsz/2), UFOV.respsz, UFOV.respsz); //display red X
			}
		}			
	}
}

//prepare the canvas for new stimuli by clearing it out and drawing a new gray circle at the center
function drawBlank() {
	UFOV.c.fillStyle="rgb(0, 0, 0)";
	UFOV.c.fillRect(0,0,UFOV.canvas.width,UFOV.canvas.height);
	UFOV.c.fillStyle="rgb(128,128,128)";
	UFOV.c.beginPath();
	UFOV.c.arc(UFOV.cx, UFOV.cy, Math.floor(UFOV.canvas.height/2),0, 2*Math.PI);
	UFOV.c.fill();	
}

//draw the center target, based on what the trial calls for
function drawFace() {
UFOV.c.drawImage(UFOV.cimg[UFOV.cStim[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]], Math.round(UFOV.cx-UFOV.cimgsz/2),
	Math.round(UFOV.cy-UFOV.cimgsz/2),
	UFOV.cimgsz, UFOV.cimgsz);
}

//draw the mask after stimulus presentation
function drawMask() {
	UFOV.c.scale(UFOV.maskDensity, UFOV.maskDensity); //scale the canvas density so the mask image appears correctly
	UFOV.c.drawImage(UFOV.mask, 0, 0);
	UFOV.isScaled = true; //note that we scaled the canvas
}

//draw fixation point
function drawFix() {
	UFOV.c.fillStyle="white";
	UFOV.c.fillRect(UFOV.cx-2, UFOV.cy-2, 5, 5);
	UFOV.c.fillStyle="black";
	UFOV.c.fillRect(UFOV.cx-1, UFOV.cy-1, 3, 3);
}

//draw the peripheral target and distractors if needed
function drawPeriph() {
	//peripheral target location holders
	var px;
	var py;

	//if it's staircase 1, then place the peripheral target at the outer circle
	if (UFOV.curSC == 1) {
		px = UFOV.pxxPos[UFOV.pPos[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]+UFOV.thetaPos.length*2];
		py = UFOV.pxyPos[UFOV.pPos[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]+UFOV.thetaPos.length*2];
	}
	//otherwise if it's staircase 0, place the peripheral target at the inner circle
	else {
		px = UFOV.pxxPos[UFOV.pPos[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]];
		py = UFOV.pxyPos[UFOV.pPos[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]];
	}
	
	//now draw the peripheral target
	UFOV.c.drawImage(UFOV.ptarget, px-Math.round(UFOV.pimgsz/2), py-Math.round(UFOV.pimgsz/2), UFOV.pimgsz, UFOV.pimgsz);

	//record where it was drawn on the canvas
	UFOV.pTargetX[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = px-UFOV.cx;
	UFOV.pTargetY[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = -(py-UFOV.cy);

	//now draw all the distractors where the peripheral target is not
	for (var i = 0; i < UFOV.pxxPos.length; i++) {
		if ((UFOV.curSC == 0 && i != UFOV.pPos[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]) ||
		(UFOV.curSC == 1 && i != UFOV.pPos[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]+UFOV.thetaPos.length*2)) {
			UFOV.c.drawImage(UFOV.pdistract, Math.round(UFOV.pxxPos[i]-UFOV.pimgsz/2),
				Math.round(UFOV.pxyPos[i]-UFOV.pimgsz/2),
				UFOV.pimgsz, UFOV.pimgsz);
		}
	}
}

//draw spoke lines that represent the locations where the peripheral target can appear
//(used during the response period of a trial)
function drawSpokes() {
	UFOV.c.strokeStyle="rgb(255,255,255)";
	UFOV.c.beginPath();
	for (var i = 0; i < UFOV.thetaPos.length; i++) {	 	
		UFOV.c.moveTo(UFOV.cx+0.5, UFOV.cy+0.5);
		//draws spoke edge to the edge of the circle
		UFOV.c.lineTo(0.5+UFOV.pxxSpoke[i], 0.5+UFOV.pxySpoke[i]);		
 	}
 	UFOV.c.stroke();
}

//if the subject hsan't responded to the targets in a set amount of time,
//prompt the subject to respond with a message displayed at the center of the screen
function displayPrompt() {
	//first check if the prompt should be showm
	if (UFOV.displayPrompt) {
		//then display message on canvas
		UFOV.c.fillStyle="black";
		UFOV.c.font="bold 12pt Arial";
		UFOV.c.textAlign="center";
		if (UFOV.mode == 1 || UFOV.mode == 2) { //if only one response is needed, note that
			UFOV.c.fillText("Please give a response.", UFOV.cx, UFOV.cy-50);
		}
		else { //otherwise, let them know they need to respond to both the center and peripheral targets
			UFOV.c.fillText("Please give both required responses.", UFOV.cx, UFOV.cy-50);
		}
	}
}

//create random black/white dot array for mask after stimulus presentation
function createMask() {
	//create blank image of the dimensions of the canvas with the set mask density
	var mask = UFOV.c.createImageData(Math.ceil(UFOV.canvas.width/UFOV.maskDensity), Math.ceil(UFOV.canvas.height/UFOV.maskDensity));
	var color;
	//randomly choose a grayscale color for each point in the image
	for (var i = 0; i < mask.width*mask.height*4; i += 4) {
		color = Math.floor(Math.random()*2)*255;
		mask.data[i+0] = color;
		mask.data[i+1] = color;
		mask.data[i+2] = color;
		mask.data[i+3] = 255;
	}
	//fill canvas with the mask image
	UFOV.mask = document.createElement("canvas");
	UFOV.mask.width = UFOV.canvas.width;
	UFOV.mask.height = UFOV.canvas.height;
	UFOV.mask.getContext("2d").putImageData(mask, 0, 0);
}



// ***********************MISCELLANEOUS FUNCTIONS ***************************** //

//the function converts the eccentricity values of the peripheral target locations to pixel coordinates
//so that we can draw the stimuli at the correct locations on the screen
function convertDeg2Px() {
	UFOV.pxxPos = new Array();
	UFOV.pxyPos = new Array();
 	var posCount = 0;
 	//determine position of peripheral stimuli
 	for (var d = 0; d < UFOV.distEcc.length; d++) { //calculate for each of the eccentricities listed (inner and outer circles)
 		for (var i = 0; i < UFOV.thetaPos.length; i++) {
 		UFOV.pxxPos[posCount] = UFOV.cx+Math.round(UFOV.pxperdeg*UFOV.distEcc[d]*Math.cos(Math.PI*UFOV.thetaPos[i]/180)); //x-xoordinate
 		UFOV.pxyPos[posCount] = UFOV.cy-Math.round(UFOV.pxperdeg*UFOV.distEcc[d]*Math.sin(Math.PI*UFOV.thetaPos[i]/180)); //y-coordinate		
 		posCount++;	
 		}
 	}
 	
 	//determine spoke outer point positions so that the lines extend all the way to the edge of the circle
 	UFOV.pxxSpoke = new Array();
	UFOV.pxySpoke = new Array();
 	for (var i = 0; i < UFOV.thetaPos.length; i++) {
 		UFOV.pxxSpoke[i] = UFOV.cx+Math.floor(UFOV.canvas.height/2*Math.cos(Math.PI*UFOV.thetaPos[i]/180));
 		UFOV.pxySpoke[i] = UFOV.cy-Math.floor(UFOV.canvas.height/2*Math.sin(Math.PI*UFOV.thetaPos[i]/180));
 	}
 	
}


//this function determines the next trial's stimulus presentation duration as it
//updates the staircase based on trial performance
function updateStaircase() {
	//check if the response is correct:
	//for the peripheral target
	if (UFOV.mode != 1) {
		if (UFOV.pResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] == UFOV.pPos[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]) {
			UFOV.pCorrect[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = 1; //correct
		}
		else {
			UFOV.pCorrect[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = 0; //incorrect
		}
	}
	//for the center target
	if (UFOV.mode != 2) {
		if (UFOV.cResp[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] == UFOV.cStim[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]) {
			UFOV.cCorrect[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = 1; //correct
		}
		else {
			UFOV.cCorrect[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = 0; //incorrect
		}
	}
	
	//check if the response given was correct
	//(for trials with both peripheral and center targets, the subject needs to get both correct in order for the trial to be considered correct)	
	if ((UFOV.mode == 1 && UFOV.cCorrect[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]) || 
	(UFOV.mode == 2 && UFOV.pCorrect[UFOV.curSC][UFOV.scTrial[UFOV.curSC]]) ||
	(UFOV.mode == 3 && UFOV.cCorrect[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] && UFOV.pCorrect[UFOV.curSC][UFOV.scTrial[UFOV.curSC]])) {
		UFOV.correctStreak[UFOV.curSC]++; //increase the number of consecutively correct trials
		UFOV.incorrectStreak[UFOV.curSC] = 0; //reset the number of consecutively incorrect trials to 0
	}
	else {
		UFOV.correctStreak[UFOV.curSC] = 0; //reset the number of consecutively correct trials to 0
		UFOV.incorrectStreak[UFOV.curSC]++; //increase the number of consecutively incorrect trials
	}
	
	//if the maxmimum number of trials hasn't been reached yet, then check if the staircase needs to be updated
	if (UFOV.scTrial[UFOV.curSC] < UFOV.maxTrials-1) {
		//first check if the staircase needs to be decreased; that is, the number of correct trials required to decrease the staircase
		//has been reached, and there is still room to decrease the staircase (the minimum hasn't been hit yet)
		if (UFOV.correctStreak[UFOV.curSC] >= UFOV.correctDec && UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] > UFOV.minFrames) {
			var stepSize = Math.round(UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] - UFOV.step[UFOV.curSC]); //decrease the simulus presentation duration (in frames)

			//if the new duration is less than the minimum allowed, change the value to the mimumum
			UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]+1] = Math.max(stepSize, UFOV.minFrames); 

			//record the new duration to be used for the next trial
			UFOV.duration[UFOV.curSC][UFOV.scTrial[UFOV.curSC]+1] = UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]+1] * UFOV.speed;
			UFOV.correctStreak[UFOV.curSC] = 0; //reset the correct streak to 0 in order to start counting for the next step
			UFOV.stepFalling[UFOV.curSC] = 1; //note that the subject is now falling in the staircase (to keep track of reversals)
			if (UFOV.stepRising[UFOV.curSC]) { //if the subject's last step was a rising step, then record that there was a reversal
				UFOV.stepRising[UFOV.curSC] = 0; //now the subject is no longer taking a rising step
				UFOV.nRevs[UFOV.curSC]++; //increase reversal count
			}
		}
		//if not a decrease, then check if the staircase needs to be increased instead; the number of incorrect trials to decrease the staircase
		//has been reached and there is still room to increase the staircase (the maximum hasn't been reached yet)
		else if (UFOV.incorrectStreak[UFOV.curSC] >= UFOV.incorrectInc && UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] < UFOV.maxFrames) {
			var stepSize = Math.round(UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] + UFOV.step[UFOV.curSC]); //increase the simulus presentation duration (in frames)

			//if the new duration is more than the maximum allowed, change the value to the maximum
			UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]+1] = Math.min(stepSize, UFOV.maxFrames);

			//record the new duration to be used for the next trial
			UFOV.duration[UFOV.curSC][UFOV.scTrial[UFOV.curSC]+1] = UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]+1] * UFOV.speed;
			UFOV.incorrectStreak[UFOV.curSC] = 0; //reset the incorrect streak to 0 in order to start counting for the next step
			UFOV.stepRising[UFOV.curSC] = 1; //note that the subject is now rising in the staircase (to keep track of reversals)
			if (UFOV.stepFalling[UFOV.curSC]) { //if the subject's last step was a falling step, then record that there was a reversal
				UFOV.stepFalling[UFOV.curSC] = 0; //now the subject is no longer taking a falling step
				UFOV.nRevs[UFOV.curSC]++; //increase reversal count
			}
		}
		//no need to make any changes to the staircase, so keep the current frame number for the stimulus presentation duration
		else {
			UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]+1] = UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]];
			UFOV.duration[UFOV.curSC][UFOV.scTrial[UFOV.curSC]+1] = UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]+1] * UFOV.speed;
		}
	}
	//otherwise, end the task
	else {
		UFOV.done = true;
	}
	
	//record number of current reversals at this point in the task
	UFOV.reversals[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] = UFOV.nRevs[UFOV.curSC];
	
	//update the counter for how many consecutive trials have had the floor stimulus presentation duration
	if (UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] == UFOV.minFrames) {
		UFOV.floorCount[UFOV.curSC]++;
	}
	else {
		UFOV.floorCount[UFOV.curSC] = 0;
	}
	
	//do the same for the ceiling counter
	if (UFOV.frames[UFOV.curSC][UFOV.scTrial[UFOV.curSC]] == UFOV.maxFrames) {
		UFOV.ceilCount[UFOV.curSC]++;
	}
	else {
		UFOV.ceilCount[UFOV.curSC] = 0;
	}
	
	//if either of the counters have reached the maximum number of trials allowed at the extremes, then end the task
	if (UFOV.floorCount[UFOV.curSC] == UFOV.maxCeilTrials || UFOV.ceilCount[UFOV.curSC] == UFOV.maxCeilTrials) {
		UFOV.done = true;
	}
	//otherwise, if the subject has reached the number of reversals in the staircase needed, then end the task
	else if ((!UFOV.outerOnly && UFOV.nRevs[0] >= UFOV.stopReversals && UFOV.nRevs[1] >= UFOV.stopReversals)
	|| UFOV.outerOnly && UFOV.nRevs[1] >= UFOV.stopReversals) {
		UFOV.done = true;
	}
	
	//check if the step size needs to be updated based on the current number of reversals
	if (!UFOV.done) {
		//continue to the next trial and get the next staircase
		UFOV.trial++;
		UFOV.scTrial[UFOV.curSC]++;
		UFOV.curSC = [UFOV.sc[UFOV.trial]];

		if (UFOV.nRevs[UFOV.curSC] >= UFOV.switchReversals) {
			UFOV.step[UFOV.curSC] = UFOV.finalStep;
		}
		else {
			UFOV.step[UFOV.curSC] = UFOV.initStep;
		}	
	}

}


 //create template for 2D array (2 x maxTrials)
function createEmpty2DArray() {
	var empty2DArray = new Array();
	empty2DArray[0] = new Array();
	empty2DArray[1] = new Array();
	for (var i = 0; i < UFOV.maxTrials; i++) {
		empty2DArray[0][i] = -1;
		empty2DArray[1][i] = -1;
	}
	return empty2DArray;
}



// End of Task Functions -----------------------------
// this executes the end of the task, which displays an end message (set in UFOV/index.php)
function endExpt() {
	$("#exptCanvas").hide();
	$("#postexpt").show();
}

//send all of the trial data at once to the database via the UFOV/save.php script;
function submitResults() {
	//keep track of trials per staircase
	var scCount = new Array(0,0);

	//condense all data from both staircases into one array for each variable
	var frames = new Array();
	var duration = new Array();
	var actualDuration = new Array();
	var cStim = new Array();
	var cResp = new Array();
	var cRT = new Array();
	var cCorrect = new Array();
	var pPos = new Array();
	var pTargetX = new Array();
	var pTargetY = new Array();
	var pResp = new Array();
	var pX = new Array();
	var pY = new Array();
	var pRT = new Array();
	var pCorrect = new Array();
	var trialStart = new Array();
	var reversals = new Array();

	//get subject's current local time
	var d = new Date();
	var localsec = Math.round(d.getTime()/1000) - d.getTimezoneOffset()*60;

	//now combine both staircases data together
	for (var i = 0; i <= UFOV.trial; i++) {
		var sc = UFOV.sc[i];
		var t = scCount[sc];
		
		frames.push(UFOV.frames[sc][t]);
		duration.push(UFOV.duration[sc][t]);
		actualDuration.push(UFOV.endTimes[i]-UFOV.startTimes[i]); //calculate actual duration of stimulus presentation
		cStim.push(UFOV.cStim[sc][t]);
		cResp.push(UFOV.cResp[sc][t]);
		cRT.push(UFOV.cRT[sc][t]);
		cCorrect.push(UFOV.cCorrect[sc][t]);
		pPos.push(UFOV.pPos[sc][t]);
		pTargetX.push(UFOV.pTargetX[sc][t]);
		pTargetY.push(UFOV.pTargetY[sc][t]);
		pResp.push(UFOV.pResp[sc][t]);
		pX.push(UFOV.pX[sc][t]);
		pY.push(UFOV.pY[sc][t]);
		pRT.push(UFOV.pRT[sc][t]);
		pCorrect.push(UFOV.pCorrect[sc][t]);
		trialStart.push(UFOV.trialStart[sc][t]);
		reversals.push(UFOV.reversals[sc][t]);
		scCount[sc]++;
	}
	
	//send data asynchronously
	//(data is passed with semicolons separating each trial's data)
	$.ajax({
		type: "POST",
		url: "save.php",
		data: {frames: frames.join(";"), //number of frames to use for the stimulus presentation duration per trial
		 duration: duration.join(";"), //planned duration of stimulus presentation
		 actualDuration: actualDuration.join(";"), //actual duration that occurred during the trial
		 cStim: cStim.join(";"), //which center target was presented
		 cResp: cResp.join(";"), //what the subject's response was to the center target
		 cRT: cRT.join(";"), //subject's response time for the center target
		 cCorrect: cCorrect.join(";"), //if the subject was correct for the center target
		 pPos: pPos.join(";"), //where the peripheral target was presented (position 0-7)
		 pTargetX: pTargetX.join(";"), //the corresponding x-coordinate on the canvas for the peripheral target location
		 pTargetY: pTargetY.join(";"), //the corresponding y-coordinate on the canvas for the peripheral target location
		 pResp: pResp.join(";"), //which section of the circle the subject selected as where they saw the peripheral target
		 pX: pX.join(";"), //the corresponding x-coordinate where the subject clicked for their peripheral target response
		 pY: pY.join(";"), //the corresponding y-coordinate where the subject clicked for their peripheral target response
		 pRT: pRT.join(";"), //subject's response time for the peripheral target location
		 pCorrect: pCorrect.join(";"), //if the subject was correct for the peripheral target location
		 trialStart: trialStart.join(";"), //when the trial started
		 reversals: reversals.join(";"), //the number of reversals that had occurred in the staircase
		 pxperdeg: UFOV.pxperdeg, //the pixels per degree used for determining stimuli size
		 localsec: localsec //the subject's current local time
		}
	}).done(endExpt); //after sending the data, show the subject the end of the task
}
