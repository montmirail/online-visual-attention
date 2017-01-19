/* UFOV/practicecode.js:
 * This code controls the display of instructions to the subject, sets up the practice trials, and then presents the practice trials to
 * the subject. After completing the designated number of practice trials (see the below variables for specifics), it will allow the user 
 * to move onto the full task. The practice tria data is then saved to the database.
 *
 * The subject is taken through several stages of practice trials with increasing difficulty. The first stage is first attending to the center target.
 * The second stage is only attending to the peripheral target. The third stage is attending to both the center and the peripheral targets.
 * The final stage is attending to the center and peripheral targets, with peripheral distractors.
 */

// *********************** VARIABLES ************************** //
var UFOV = {};  //storage for all variables in this task

UFOV.exptLink = "index.php"; //link to main page of full task

// stimuli setup -------------------------------------------------------

//position of stimuli on screen
UFOV.pxperdeg = <?php echo $pxperdeg; ?>; //pixels per degree from screen calibration (via UFOV/practicecode.php)
UFOV.distEcc = new Array(2,4); // distance of peripheral targets from center of circle (visual angle in degrees); inner and outer circles
UFOV.thetaPos = new Array(45, 90, 135, 180, 225, 270, 315, 360); //position around the center of the circle (in degrees)

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
UFOV.duration = 12*UFOV.speed; //initial duration of stimulus display for a trial (frames * ms/frame)
UFOV.delay = 500; //delay before stimulus presentation
UFOV.feedbackTime = 400; //duration of displaying feedback after trial responses (ms)
UFOV.maskDur = 320; //duration of mask presentation (ms)
UFOV.feedbackDelay = 360; //time to wait before displaying feedback (ms)
UFOV.intervalID = -1; //for set/clearInterval js functions (mainly used for timing during trials)
UFOV.startWait = 0; //keeps track of timer start
UFOV.trialCounter = new Array(0,0,0,0); //keeps track of number of practice trials completed per practice stage
UFOV.maxTrials = 15; //total number of trials that can be completed per practice stage

//data variables -------------------------------------------------
UFOV.trialType = new Array(); //stores which practice stage each trial is
UFOV.cResp = new Array(); //stores center response per trial
UFOV.pResp = new Array(); //stores peripheral response per trial
UFOV.cRT = new Array(); //stores center response time per trial
UFOV.pRT = new Array(); //stores peripheral response time per trial
UFOV.cCorrect = new Array(); //stores if the center response was correct per trial
UFOV.pCorrect = new Array(); //stores if the peripheral response was correct per trial
UFOV.pX = new Array(); //stores the x-coordinate of the point the subject clicked for peripheral response for each trial
UFOV.pY = new Array(); //stores the y-coordinate of the point the subject clicked for peripheral response for each trial
UFOV.pTargetX = new Array(); //stores the actual peripheral target x-position for each trial
UFOV.pTargetY = new Array(); //stores the actual peripheral target x-position for each trial

UFOV.durations = new Array(); //stores the intended duration of stimulus presentation for each trial
UFOV.actualDurations = new Array(); //stores the actual duration of stimulus presentation (may vary from above due to limited resources of browser)
UFOV.trialStart = new Array(); //stores trial start time for each trial
UFOV.startTimes = new Array(); //stores start time of stimulus presentation for each trial
UFOV.endTimes = new Array(); //stores end time of stimulus presentation for each trial

UFOV.cStim = new Array(); //store which center target was presented for the trial
UFOV.pPos = new Array(); //store which peripheral target was presented for the trial


// setup instructions and state control ------------------------------------------------------------------
//track pages
UFOV.curPage = 0; //current page the subject is on
UFOV.highestPage = 0; //highest page the subject has actually reached

//track state during practice trials
UFOV.mode = 1; //which stimuli to show (1 = center only, 2 = peripheral only, 3 = both, 4 = both with distractors)
UFOV.isPractice = false; //keeps track if the subject is currently doing the practice trials
UFOV.state = "start"; //which state the practice trial is in; state order: start/fix, delay, stim, mask, response, feedback-delay, feedback
UFOV.stateChange = false; //keeps track if the state changed during the trial
UFOV.isScaled = false; //this scales what is drawn on the HTML5 canvas; only implemented when drawing the mask before the response period
UFOV.done = false; //keeps track if subject is done with the practice trials
UFOV.dialogOpen = false; //keeps track of whether dialog window is open or not
UFOV.demo = false; //keep track if the stimuli is only being drawn as a demonstration, not as part of a practice trial

//initialize counters, stimuli positions, and response variables --------------------------------------------
UFOV.curTrial = 0;
UFOV.cResp[0] = -1;
UFOV.pResp[0] = -1;
UFOV.cCorrect[0] = -1;
UFOV.pCorrect[0] = -1;
UFOV.pTargetX[0] = -1;
UFOV.pTargetY[0] = -1;
UFOV.pX[0] = -1;
UFOV.pY[0] = -1;
UFOV.cRT[0] = -1;
UFOV.pRT[0] = -1;

UFOV.numCorrect = 0; //total number of consecutively correct trials a subject needs to get before moving onto the next practice stage
UFOV.correctNeeded = [3, 3, 3, 3]; //number of consecutively correct trials needed per practice stage

UFOV.cStim[UFOV.curTrial] = Math.round(Math.random()); //choose the first center target randomly
UFOV.pPos[UFOV.curTrial] = Math.ceil(Math.random()*UFOV.thetaPos.length+UFOV.thetaPos.length)-1; //choose the first periphal target randomly

//instruction text presented at each page
UFOV.text = 
["This task requires you to attend to objects presented on the screen. We will explain the process step by step.",
"In the center of the screen, a smiley face will be quickly shown. It will either have short or long hair. You must determine which one is presented.",
"When the question mark appears, press one of the following keys to report what you saw:<br/>S - Short Hair<br/>D - Long Hair",
"There will also be a star that appears at one of 8 locations around the center. You will need to remember along which line it was displayed. All 8 locations are displayed below along with the corresponding line.",
"After the star flashes, click on the line where it appeared. An X will appear where you clicked. If a question mark appears instead, it is unclear which line you selected. Re-click somewhere else along the line until an X appears.",
"In the real task, both the face and star will be shown simultaneously. Make sure you can get both right! (If you need a reminder about the controls, click the icon in the bottom right corner.)",
"For one last increase in difficulty, squares will also appear around the center. You will need to ignore them and pick out the location of the star.",
"As before, click along the line where the star appeared and also report what face you saw.",
"Make sure you are comfortable with the instructions and key/mouse responses before you begin. You can go back in the instructions if necessary. Once you're ready, click the Start button."];

//text presented for before and after each practice stage
UFOV.noticeText = 
["Try a few practice trials before continuing.",
"Great! You can continue through the instructions."];

// *********************** INITIALIZATION ************************** //

//wait until the HTML5 page is ready before setting up all the widgets
$(document).ready(init);

//this function sets up buttons, dialog windows, keyboard listener, and the first instruction page
function init() {
	//hide content before the subject starts the tutorial
	$("#reminderButton").hide();
	$("#notice").hide();
	$("#pracButton").hide();
	$("#content").hide();
	$("#exptCanvas").hide();

	//set up the continue button that allows the subject to start the tutorial
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
			
	//practice button that starts practice trials
	$("#pracButton").button();
	$("#pracButton").click(runPractice);
	

	//navigation buttons:
	//back button to go to previous instruction page
	$("#backButton").button({
		icons: {primary: "ui-icon-triangle-1-w"},
		text: false
	});
	$("#backButton").button( "option", "disabled", true );
	$("#backButton").click(goBack);
	
	//forward button to go to next instruction page
	$("#forwardButton").button({
		icons: {primary: "ui-icon-triangle-1-e"},
		text: false
	});
	$("#forwardButton").click(goForward);
	

	//set instructions for the current page
	$("#instructions").html(UFOV.text[UFOV.curPage]);

	//add keyboard listener to keep track of keys the subject presses
	window.addEventListener("keydown", keyResponse, true);

}

//this function initializes the HTML5 canvas for stimuli presentation
function initCanvas() {
	//hide fullscreen message and show tutorial content
	$("#preexpt").hide();
	$("#content").show();

	//initialize canvas
	UFOV.canvas = document.getElementById("exptCanvas");
	UFOV.c = UFOV.canvas.getContext("2d");
	UFOV.canvas.height = window.innerHeight-250; //set canvas height (the -250 px is to give room for instruction text)
	UFOV.canvas.width = UFOV.canvas.height; //make the canvas square
	UFOV.cx = Math.round(UFOV.canvas.width/2); //get center x coordinate of canvas
	UFOV.cy = Math.round(UFOV.canvas.height/2); //get center y coordinate of canvas
	convertDeg2Px(); //figure out peripheral stimuli position
 	createMask(); //create mask
 	
 	UFOV.startTime = new Date().getTime(); //get start time of practice session
 	$("#exptCanvas").click(mouseUpdate); //add mouse listener for the canvas
 	$("#exptCanvas").mousemove(mouseHover); //add mouse listener for hovering over the canvas
}


// ********************** PAGE CONTROLS ************************ //

// callback function for back button
// (go to the previous page)
function goBack() {
	UFOV.curPage--;
	updatePage();
	updateContent();
}

// callback for forward button
// (go to the next page)
function goForward() {
	if (UFOV.curPage == UFOV.highestPage) {
		UFOV.highestPage++;
	}
	UFOV.curPage++;
	updatePage();
	updateContent();
}

// update instruction page based on what should be currently displayed
// (function triggered by pressing forward or back buttons)
function updatePage() {
	//hide the notice text if it's currently visible
	$("#notice").hide();

	//turn off practice mode
	UFOV.isPractice = false;

	//set the instruction text for the current page
	$("#instructions").html(UFOV.text[UFOV.curPage]);
	
	//if the subject is on the first page
	if (UFOV.curPage == 0) {
		//disable back button
		$("#backButton").button( "option", "disabled", true );
	}
	//else if the subject is on the last page
	else if (UFOV.curPage == UFOV.text.length-1) {
		//disable forward button
		$("#forwardButton").button( "option", "disabled", true );
	}
	//else if the subject is on one of the pages with practice trials
	else if (UFOV.highestPage == UFOV.curPage &&
	(UFOV.curPage == 2 || UFOV.curPage == 4 ||
	UFOV.curPage == 5 || UFOV.curPage == 7)) { 
		//disable forward button
		$("#forwardButton").button( "option", "disabled", true );

		//display notice that the subject now needs to complete some practice trials
		$("#notice").text(UFOV.noticeText[0]);
		$("#notice").removeClass("highlight");
		$("#notice").show();
	}
	//for all other pages, default to enabling back and forward buttons
	else {
		$("#backButton").button( "option", "disabled", false );
		$("#forwardButton").button( "option", "disabled", false );
	}
	
	//check page and update practice stage type if need be
	switch (UFOV.curPage) {
	case 2:
		UFOV.mode = 1; //only center target
		break;
	case 4:
		UFOV.mode = 2; //only peripheral target
		break;
	case 5:
		UFOV.mode = 3; //center and peripheral target
		break;
	case 7:
		UFOV.mode = 4; //center and peripheral target, with distractors
		break;
	default:
		//nothing
	}
	
}


// ************************* STATE UPDATES *************************** //

//this function updates page content
// (triggered by clicking one of the navigation buttons)
function updateContent() {
	clearInterval(UFOV.intervalID); //clear current animation timer
	
		//update page based on current page number
		if (UFOV.curPage == 0) {
			//hide practice button and canvas
			$("#pracButton").hide();
			$("#exptCanvas").hide();
		}
		else if (UFOV.curPage == 1) {
			$("#pracButton").hide(); //hide pratice button
			drawFaceDemo(); //show example of the center targets
			$("#exptCanvas").show();
		}
		else if (UFOV.curPage == 2) {
			$("#pracButton").show(); //show practice button
			if (!UFOV.isPractice) { //if the practice trials haven't started yet, hide canvas
				$("#exptCanvas").hide();
			}
		}
		else if (UFOV.curPage == 3) {
			drawBlank(); //clear canvas
			$("#exptCanvas").show();
			$("#pracButton").hide(); //hide practice button
			UFOV.demo = true; //set that we are just doing a demo, not practice trials
			drawPeriphDemo(); //show all possible locations of peripheral targets
		}
		else if (UFOV.curPage == 6) {
			$("#exptCanvas").show();
			$("#pracButton").hide(); //hide practice button
			drawDistractDemo(); //show what the distractors look like as an example
		}
		//for pages 4, 5, and 7, these are all practice trial pages, so set them up for practice trials
		else if (UFOV.curPage >= 4 && UFOV.curPage <= 7 && UFOV.curPage != 6) {
			if (UFOV.curPage == 4) {
				UFOV.demo = false; //turn off demo mode
			}
			if (UFOV.highestPage > 7) {
				//reset button label to Practice if the subject went backwards after reaching the last page
				$("#pracButton").button("option", "label", "Practice");
			}
			if (UFOV.curPage != 4) {
				$("#reminderButton").show(); //show reminder button after the second practice stage
			}

			$("#pracButton").show(); //show practice button

			//if subject is done with practice trials, then hide the canvas
			if (!UFOV.isPractice) {
				$("#exptCanvas").hide();
			}
		}
		//for the last page, change the practice button to the start button for the full task
		else if (UFOV.curPage == 8) {
			$("#pracButton").button("option", "label", "Start!");
			$("#pracButton").show();
			$("#exptCanvas").hide();
		}

		else {
			//not on any valid page
		}
}

// Callback for the practice button. When the practice button is pressed, run the practice trials
//(if the subject is on the last page and clicks the button, then redirect subject to the full task)
function runPractice() {
	UFOV.isPractice = true; //turn on practice mode
	
	if (UFOV.curPage != UFOV.text.length-1) {
		//reset practice variables
		UFOV.done = false;
		UFOV.numCorrect = 0;
		UFOV.state = "start";
		UFOV.stateChange = true;
		
		//clear canvas to black
		UFOV.c.fillStyle="rgb(0, 0, 0)";
		UFOV.c.fillRect(0,0,UFOV.canvas.width,UFOV.canvas.height);
		$("#exptCanvas").show();
		
		$("#pracButton").hide(); //hide practice button
		UFOV.intervalID = setInterval(updateFrame, UFOV.speed); //update frame by using setInterval at the desired frame rate
 	}
 	else { //go onto full task since the subject is at the last page
		document.location.href = UFOV.exptLink;
 	}
}

//At each frame for the practice trial, the frame is redrawn based on the current state
// (this is called via setInterval)
function updateFrame() {
	//check if dialog window for instructions is open
	if ($("#reminder").dialog("isOpen")) {
		UFOV.dialogOpen = true;
	}
	else {
		UFOV.dialogOpen = false;
	}

	if (UFOV.state == "start") { //start of practice stage
		if (UFOV.stateChange) {
			UFOV.stateChange = false;
			drawPractice(); //update content displayed
		}
		//wait for space bar...
	}
	else if (UFOV.state == "fix") { //start of a practice trial (not the first one in the practice stage)
		if (UFOV.stateChange) {
			UFOV.stateChange = false;
			drawPractice(); //update content displayed
		}
		//wait for space bar...	
	}
	
	else if (UFOV.state == "delay") { //delay before stimuli presentation
		if (UFOV.stateChange) {
			UFOV.startWait = new Date().getTime(); //get start time of the delay period
			UFOV.stateChange = false;
			
			drawPractice(); //update content displayed
		}
		//if the set amount of time for the delay period has passed, then switch to stim state and display stimuli
		if (new Date().getTime() >= UFOV.startWait + UFOV.delay) {
			UFOV.state = "stim";
			UFOV.stateChange = true;
		}
	}
	
	else if (UFOV.state == "stim") { //stimulus presentation
		if (UFOV.stateChange) {
			UFOV.startWait = new Date().getTime(); //get start time of stimulus presentation
			UFOV.startTimes[UFOV.curTrial] = UFOV.startWait; //record this presentation start time
			
			UFOV.stateChange = false;
			drawPractice(); //update content displayed
		}
		var curTime = new Date().getTime(); //get current time
		//if the set amount of time for the presentation period has passed, then switch to mask state and display mask
		if (curTime >= UFOV.startWait + UFOV.duration) {
			UFOV.state = "mask";
			UFOV.stateChange = true;
			UFOV.endTimes[UFOV.curTrial] = curTime; //record end time of presentation
		}
	}
	
	else if (UFOV.state == "mask") { //mask presentation
		if (UFOV.stateChange) {
			UFOV.startWait = new Date().getTime(); //get start time of mask period
			UFOV.stateChange = false;
			drawPractice(); //update content displayed
		}
		//if the set amount of time for the mask period has passed, then switch to reponse state
		if (new Date().getTime() >= UFOV.startWait + UFOV.maskDur) {
			UFOV.state = "response";
			UFOV.stateChange = true;
		}
	}
	
	else if (UFOV.state == "response") { //wait for subject's response
		if (UFOV.stateChange) {
			UFOV.startWait = new Date().getTime(); //get start time of response period
			UFOV.stateChange = false;
			drawPractice(); //update content displayed
		}
		//once the subject has given a response for the trial, then move on
		//there are different response conditions required for each practice stage
		//(e.g., the first stage only requires a center target response)
		if ((UFOV.mode == 1 && UFOV.cResp[UFOV.curTrial] != -1)
		|| (UFOV.mode == 2 && UFOV.pResp[UFOV.curTrial] >= 0)
		|| (UFOV.mode > 2 && UFOV.cResp[UFOV.curTrial] != -1 && UFOV.pResp[UFOV.curTrial] >= 0)) {
			UFOV.state = "feedback-delay"; //switch to feedback-delay state
			UFOV.stateChange = true;
		}
	}
	
	else if (UFOV.state == "feedback-delay") { //delay before feedback
		if (UFOV.stateChange) {
			UFOV.startWait = new Date().getTime(); //get start time of feedback delay period
			UFOV.stateChange = false;
		}
		//once the set amount of time for the feedback delay has passed, switch to the feedback state and display feedback
		if (new Date().getTime() >= UFOV.startWait + UFOV.feedbackDelay) {		
			UFOV.state = "feedback";
			UFOV.stateChange = true;
		}
	}
	
	else if (UFOV.state == "feedback") { //feedback given
		if (UFOV.stateChange) {
			UFOV.startWait = new Date().getTime(); //get start time of feedback display
			UFOV.stateChange = false;
			drawPractice(); //update content displayed
		}
		//once the set amount of time for the feedback period has passed, check if the subject is done with all the practice trials for this stage
		if (new Date().getTime() >= UFOV.startWait + UFOV.feedbackTime) {
			updateCount(); //update number of trials completed
			if (UFOV.done) { //if done, end this practice stage
				endPractice(); //show end message
				UFOV.state = "endPractice";
				UFOV.stateChange = true;
			}
			else { //otherwise, move onto the next trial
				UFOV.state = "fix";
				UFOV.stateChange = true;
			}
		}
	}
	else if (UFOV.state == "endPractice") { //show additional end stage message
		UFOV.stateChange = false;
		drawPractice(); //update content displayed
	}
}


//allow subject to move onto next page after practice demo is complete
function endPractice() {
	$("#notice").text(UFOV.noticeText[1]);
	$("#notice").addClass("highlight");
	$("#forwardButton").button( "option", "disabled", false );
}


// ****************** INPUT TRACKERS *********************** //

//this function is triggered whenever a key is pressed on the keyboard
function keyResponse(event) {
	//only respond to any key presses if it's made during a practice trial and the dialog window is not open
	if (UFOV.isPractice && !UFOV.dialogOpen) {
		//if it's time for the subject to respond, and we're waiting for a response to the center target (practice modes 1, 3, and 4)
		if (UFOV.state == "response" && (UFOV.mode == 1 || UFOV.mode > 2)
		&& UFOV.cResp[UFOV.curTrial] == -1) {
			if (event.keyCode == UFOV.shortKey) {
				UFOV.cRT[UFOV.curTrial] = new Date().getTime()-UFOV.startWait; //calculate response time
				UFOV.cResp[UFOV.curTrial] = 0; //record that they responded the center target had short hair
				
				drawPractice(); //update content displayed

				//Indicate which key the subject pressed by drawing the letter in the center of the screen (S)
				UFOV.c.fillStyle="white";
				UFOV.c.font="bold 30pt Arial";
				UFOV.c.textBaseline = "middle";
				UFOV.c.textAlign="center";
				UFOV.c.fillText(UFOV.cText[0], UFOV.cx, UFOV.cy);
			}
			else if (event.keyCode == UFOV.longKey) {
				UFOV.cRT[UFOV.curTrial] = new Date().getTime()-UFOV.startWait; //calculate response time
				UFOV.cResp[UFOV.curTrial] = 1; //record that they responded the center target had long hair
				
				drawPractice(); //update content displayed

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
		if (UFOV.pResp[UFOV.curTrial] == -2) {
			UFOV.c.drawImage(UFOV.response[0], Math.round(UFOV.x-UFOV.respsz/2),
			Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
		}
		//if there is already a response to the peripheral target, need to redraw the location they selected
		else if (UFOV.pResp[UFOV.curTrial] != -1) { 
			UFOV.c.drawImage(UFOV.response[1], Math.round(UFOV.x-UFOV.respsz/2),
			Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
		}

		//if they pressed the start key at the beginning of a trial, then start the trial
		if (event.keyCode == UFOV.startKey &&
			(UFOV.state == "start" || UFOV.state == "fix")) {
			UFOV.trialStart[UFOV.curTrial] = new Date().getTime() - UFOV.startTime;
			
			UFOV.state = "delay";
			UFOV.stateChange = true;
		}
	}
}


//this function checks for mouse input (used for recording the subject's selection of the peripheral target's location)
function mouseUpdate(event) {
	//check first that the subject is currently doing practice trials and that the help dialog is not open
	if (UFOV.isPractice && !UFOV.dialogOpen) {
		//only respond to a mouse click if it's during a practice mode where a peripheral response is needed (modes 2, 3, and 4)
		if (UFOV.state == "response" && UFOV.mode > 1 && UFOV.pResp[UFOV.curTrial] < 0) {
			//get mouse coordinates in relation to the canvas
			UFOV.x = event.pageX - this.offsetLeft;
			UFOV.y = event.pageY - this.offsetTop;
			
			drawPractice(); //update content displayed
			
			//if it's a practice mode that includes the center stimulus and the subject already gave a response
			//for the center, make sure to redraw their response
			if (UFOV.mode > 2 && UFOV.cResp[UFOV.curTrial] != -1) {
				UFOV.c.fillStyle="white";
				UFOV.c.font="bold 30pt Arial";
				UFOV.c.textBaseline = "middle";
				UFOV.c.textAlign="center";
				UFOV.c.fillText(UFOV.cText[UFOV.cResp[UFOV.curTrial]], UFOV.cx, UFOV.cy);
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

				//if so, record the response time and the line selected
				UFOV.pRT[UFOV.curTrial] = new Date().getTime()-UFOV.startWait;
				UFOV.pResp[UFOV.curTrial] = choice;
				
				//record the peripheral target's location and specifically where the subject clicked
				UFOV.pTargetX[UFOV.curTrial] = UFOV.pxxPos[UFOV.pPos[UFOV.curTrial]]-UFOV.cx;
				UFOV.pTargetY[UFOV.curTrial] = -(UFOV.pxyPos[UFOV.pPos[UFOV.curTrial]]-UFOV.cy);
				UFOV.pX[UFOV.curTrial] = UFOV.x - UFOV.cx;
				UFOV.pY[UFOV.curTrial] = UFOV.y - UFOV.cy;
				
				//draw an X where the subject clicked 
				UFOV.c.drawImage(UFOV.response[1], Math.round(UFOV.x-UFOV.respsz/2),
				Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
			}
			//otherwise, if the click point is outside of the accepted range, display a
			//question mark and have the subject reselect a peripheral line 
			else {
				UFOV.pResp[UFOV.curTrial] = -2; //this response means they need to give a new response to the peripheral target
			
				UFOV.c.drawImage(UFOV.response[0], Math.round(UFOV.x-UFOV.respsz/2),
				Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
			}	
		}
	}
}

//this function detects when the mouse pointer is hovering over a peripheral line during the
//response period, in order to give them feedback about which line they will be selecting when
//they click
function mouseHover(event) {
	//check first that the subject is currently doing practice trials and that the help dialog is not open
	if (UFOV.isPractice && !UFOV.dialogOpen) {
		//only react to the pointer hovering if it's during a practice mode where a peripheral response is needed (modes 2, 3, and 4)
		if (UFOV.state == "response" && UFOV.mode > 1 && UFOV.pResp[UFOV.curTrial] == -1) {
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
			if (UFOV.mode != 2 && UFOV.cResp[UFOV.curTrial] != -1) {
				UFOV.c.fillText(UFOV.cText[UFOV.cResp[UFOV.curTrial]], UFOV.cx, UFOV.cy);
			}
			//otherwise, add back a question mark to the center of the screen since the subject hasn't responded yet
			else if (UFOV.mode != 2 && UFOV.cResp[UFOV.curTrial] == -1) {
				UFOV.c.drawImage(UFOV.response[0], Math.round(UFOV.cx-UFOV.respsz/2),
				Math.round(UFOV.cy-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
			}

			//check if a question mark needs to be drawn if the subject clicked on an invalid spot for the peripheral target
			if (UFOV.mode != 1 && UFOV.pResp[UFOV.curTrial] == -2) {
				UFOV.c.drawImage(UFOV.response[0], Math.round(UFOV.x-UFOV.respsz/2),
					Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
			}
		}
 	}
}


// ********************** DRAWING METHODS ************************** //

//draw practice demo based on current state
function drawPractice() {
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
		//do nothing...
	}
	else if (UFOV.state == "stim") { //stimulus presentation
		if (UFOV.mode != 2) { //if it's a practice mode with the center target, then draw it
		drawFace();
		}
		if (UFOV.mode != 1) { //if it's a practice mode with the peripheral target, then draw it
		drawPeriph();
		}
	}
	else if (UFOV.state == "mask") { //mask presentation
		drawMask();
	}
	else if (UFOV.state == "response") { //response period
		//if it's a practice mode with the peripheral target, 
		//draw lines to represent the possible locations of the target
		if (UFOV.mode > 1) { 
			drawSpokes();
		}

		//draw a question mark in the middle of the screen if the subject hasn't given a response
		//to the center target yet
		if (UFOV.mode != 2 && UFOV.cResp[UFOV.curTrial] == -1) {
			UFOV.c.drawImage(UFOV.response[0], Math.round(UFOV.cx-UFOV.respsz/2),
			Math.round(UFOV.cy-UFOV.respsz/2), UFOV.respsz, UFOV.respsz);
		}
	}
	else if (UFOV.state == "feedback") { //give subject feedback about their responses
		//keep lines for peripheral locations on the screen
		if (UFOV.mode > 1) {
			drawSpokes();
		}

		//give feedback for the peripheral response
		if (UFOV.mode != 1) {
			if (UFOV.pResp[UFOV.curTrial] == (UFOV.pPos[UFOV.curTrial] % UFOV.thetaPos.length)) {
				UFOV.pCorrect[UFOV.curTrial] = 1; //gave correct answer
				UFOV.c.drawImage(UFOV.feedback[1], Math.round(UFOV.x-UFOV.respsz/2),
					Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz); //display checkmark
			}
			else {
				UFOV.pCorrect[UFOV.curTrial] = 0; //gave incorrect answer
				UFOV.c.drawImage(UFOV.feedback[0], Math.round(UFOV.x-UFOV.respsz/2),
					Math.round(UFOV.y-UFOV.respsz/2), UFOV.respsz, UFOV.respsz); //display red X
			}
		}

		//give feedback for the center response
		if (UFOV.mode != 2) {
			if (UFOV.cResp[UFOV.curTrial] == UFOV.cStim[UFOV.curTrial]) {
				UFOV.cCorrect[UFOV.curTrial] = 1; //gave correct answer
				UFOV.c.drawImage(UFOV.feedback[1], Math.round(UFOV.cx-UFOV.respsz/2),
					Math.round(UFOV.cy-UFOV.respsz/2), UFOV.respsz, UFOV.respsz); //display checkmark
			}
			else {
				UFOV.cCorrect[UFOV.curTrial] = 0; //gave incorrect answer
				UFOV.c.drawImage(UFOV.feedback[0], Math.round(UFOV.cx-UFOV.respsz/2),
					Math.round(UFOV.cy-UFOV.respsz/2), UFOV.respsz, UFOV.respsz); //display red X
			}
		}	
	}
	else if (UFOV.state == "endPractice") { //done with all practice trials for this block
		//let subject know that they're done via a message at the center of the screen
		UFOV.c.fillStyle="black";
		UFOV.c.font="16pt Arial";
		UFOV.c.textAlign="center";
		UFOV.c.fillText("Practice Round Complete!", UFOV.cx, UFOV.cy);
	}
}


//display examples of the two differernt center target stimuli
//(used for demonstration purposes only before the practice trials)
function drawFaceDemo() {
	UFOV.c.fillStyle="rgb(128,128,128)";
	UFOV.c.fillRect(0,0,UFOV.canvas.width,UFOV.canvas.height);
	UFOV.c.drawImage(UFOV.cimg[0], Math.round(UFOV.cx/2-UFOV.cimgsz/2),
	Math.round(UFOV.cy-UFOV.cimgsz/2), UFOV.cimgsz, UFOV.cimgsz);
	
	UFOV.c.drawImage(UFOV.cimg[1], Math.round(UFOV.cx+UFOV.cx/2-UFOV.cimgsz/2),
	Math.round(UFOV.cy-UFOV.cimgsz/2), UFOV.cimgsz, UFOV.cimgsz);
	
	UFOV.c.fillStyle="black";
	UFOV.c.font="16pt Arial";
	UFOV.c.textAlign="center";
	UFOV.c.fillText("Short", UFOV.cx/2, UFOV.cy-UFOV.cimgsz/2+75);
	UFOV.c.fillText("Long", UFOV.cx+UFOV.cx/2, UFOV.cy-UFOV.cimgsz/2+75);
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
	UFOV.c.drawImage(UFOV.cimg[UFOV.cStim[UFOV.curTrial]], Math.round(UFOV.cx-UFOV.cimgsz/2),
	Math.round(UFOV.cy-UFOV.cimgsz/2), UFOV.cimgsz, UFOV.cimgsz);
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
	//draw the peripheral target at a sample location (in this case it's the position at 3 o'clock on the circle)
	//this is only for the demonstration period before the practice trials
	if (UFOV.demo) {
		UFOV.c.drawImage(UFOV.ptarget, Math.round(UFOV.pxxPos[(UFOV.thetaPos.length*2)-1]-UFOV.pimgsz/2),
			Math.round(UFOV.pxyPos[(UFOV.thetaPos.length*2)-1]-UFOV.pimgsz/2),
			UFOV.pimgsz, UFOV.pimgsz);	
	}
	//if we're in practice mode, then draw the peripheral target where it has been decided to go for the trial
	else {
		UFOV.c.drawImage(UFOV.ptarget, Math.round(UFOV.pxxPos[UFOV.pPos[UFOV.curTrial]]-UFOV.pimgsz/2),
			Math.round(UFOV.pxyPos[UFOV.pPos[UFOV.curTrial]]-UFOV.pimgsz/2),
			UFOV.pimgsz, UFOV.pimgsz);		
	}
	
	//if we're in the last practice mode with distractors, then draw all the distractors at all
	//locations where the target is not
	if (UFOV.mode == 4) {
		for (var i = 0; i < UFOV.pxxPos.length; i++) {
			if (i != UFOV.pPos[UFOV.curTrial]) {
				UFOV.c.drawImage(UFOV.pdistract, Math.round(UFOV.pxxPos[i]-UFOV.pimgsz/2),
					Math.round(UFOV.pxyPos[i]-UFOV.pimgsz/2),
					UFOV.pimgsz, UFOV.pimgsz);
			}
		}
	}
}

//for the demonstration period, draw where all the distractor locations are
function drawDistractDemo() {
	drawBlank(); //clear canvas

	//draw an example peripheral target at location 10 (randomly chosen)
	UFOV.c.drawImage(UFOV.ptarget, Math.round(UFOV.pxxPos[10]-UFOV.pimgsz/2),
		Math.round(UFOV.pxyPos[10]-UFOV.pimgsz/2), UFOV.pimgsz, UFOV.pimgsz);
				
	//draw distractors at every other available position for a peripheral target
	for (var i = 0; i < UFOV.pxxPos.length; i++) {
		if (i != 10) {
			UFOV.c.drawImage(UFOV.pdistract, Math.round(UFOV.pxxPos[i]-UFOV.pimgsz/2),
				Math.round(UFOV.pxyPos[i]-UFOV.pimgsz/2), UFOV.pimgsz, UFOV.pimgsz);
		}
	}
	
	//add an example center target as well
	UFOV.c.drawImage(UFOV.cimg[0], Math.round(UFOV.cx-UFOV.cimgsz/2),
		Math.round(UFOV.cy-UFOV.cimgsz/2), UFOV.cimgsz, UFOV.cimgsz);
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


//add numbered labels for spokes
//(used during the demonstration period to indicate how many potential locations there are
//for the peripheral target)
function labelSpokes() {
	UFOV.c.fillStyle="black";
	UFOV.c.font="bold 20pt Arial";
	//start labeling them in reverse order so that they are going clockwise, starting from
	//the position of 3 o'clock
	for (var i = 0; i < UFOV.thetaPos.length; i++) {	
		UFOV.c.fillText(UFOV.thetaPos.length-i, 0.5+UFOV.pxxPos[i],
		0.5+UFOV.pxyPos[i]);
	}
}

//draw display of all spokes with an example peripheral target and the spokes labeled
//(used during the demonstration period)
function drawPeriphDemo() {
	drawSpokes();
	labelSpokes();
	drawPeriph();
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
 		UFOV.pxxSpoke[i] = UFOV.cx+Math.floor(UFOV.canvas.width/2*Math.cos(Math.PI*UFOV.thetaPos[i]/180));
 		UFOV.pxySpoke[i] = UFOV.cy-Math.floor(UFOV.canvas.width/2*Math.sin(Math.PI*UFOV.thetaPos[i]/180));
 	}
}

//update number of correct answers per practice mode and setup for the next trial
function updateCount() {
	if (UFOV.mode == 1 && UFOV.cCorrect[UFOV.curTrial] == 1) {
		UFOV.numCorrect++;
	}
	else if (UFOV.mode == 2 && UFOV.pCorrect[UFOV.curTrial] == 1) {
		UFOV.numCorrect++;
	} 
	else if (UFOV.mode > 2 && UFOV.cCorrect[UFOV.curTrial] == 1 && UFOV.pCorrect[UFOV.curTrial] == 1) {
		UFOV.numCorrect++;
	}
	else {
		UFOV.numCorrect = 0; //reset the count to 0 if the response was wrong
	}
	
	//send trial data to the database
	sendTrialData();

	//update trial number and reset all variables for the next trial
	UFOV.curTrial++;
	UFOV.trialCounter[UFOV.mode-1] = UFOV.trialCounter[UFOV.mode-1] + 1;
	UFOV.cResp[UFOV.curTrial] = -1;
	UFOV.pResp[UFOV.curTrial] = -1;
	UFOV.cCorrect[UFOV.curTrial] = -1;
	UFOV.pCorrect[UFOV.curTrial] = -1;
	UFOV.cRT[UFOV.curTrial] = -1;
	UFOV.pRT[UFOV.curTrial] = -1;
	UFOV.pX[UFOV.curTrial] = -1;
	UFOV.pY[UFOV.curTrial] = -1;
	UFOV.pTargetX[UFOV.curTrial] = -1;
	UFOV.pTargetY[UFOV.curTrial] = -1;
	
	//randomly choose the center stimulus to present
	UFOV.cStim[UFOV.curTrial] = Math.round(Math.random());
	
	//ensure that the same center target doesn't appear more than twice in a row
	//(force the target to be different for the trial after two trials that are the same)
	if (UFOV.curTrial >= 2) {
		if (UFOV.cStim[UFOV.curTrial-1] == UFOV.cStim[UFOV.curTrial-2]) { 
			if (UFOV.cStim[UFOV.curTrial-1] == 1) {
				UFOV.cStim[UFOV.curTrial] = 0;
			}
			else {
				UFOV.cStim[UFOV.curTrial] = 1;
			}
		}
	}

	//randomly choose a peripheral target location
	UFOV.pPos[UFOV.curTrial] = Math.ceil(Math.random()*(UFOV.thetaPos.length)+UFOV.thetaPos.length)-1;
	
	//check if the subject has reached the end of a practice mode;
	//they need to have either gotten the indicated number of trials correct consecutively,
	//or they reached the maximum trials to complete
	if (UFOV.numCorrect == UFOV.correctNeeded[UFOV.mode-1] || UFOV.trialCounter[UFOV.mode-1] == UFOV.maxTrials) {
		UFOV.done = true;
	}
}


//send the practice trial results to the database via the UFOV/savePractice.php script
// (this is called after the completion of each individual trial)
function sendTrialData() {
	t = UFOV.curTrial; //get data for only the current trial
	UFOV.durations[t] = UFOV.duration; //get planned duration
	UFOV.actualDurations[t] = UFOV.endTimes[t] - UFOV.startTimes[t]; //calculate actual duration of stimulus presentation
	UFOV.trialType[t] = UFOV.mode; //get practice mode

	//get subject's current local time
	var d = new Date();
	var localsec = Math.round(d.getTime()/1000) - d.getTimezoneOffset()*60;

	//send data asynchronously
	$.ajax({
		type: "POST",
		url: "savePractice.php",
		data: {trial: t+1, //MOT.trial starts at 0, so just shifting trials to start at 1
		 duration: UFOV.durations[t], //planned duration of stimulus presentation
		 actualDuration: UFOV.actualDurations[t], //actual duration that occurred during the trial
		 cStim: UFOV.cStim[t], //which center target was presented
		 cResp: UFOV.cResp[t], //what the subject's response was to the center target
		 cRT: UFOV.cRT[t], //subject's response time for the center target
		 cCorrect: UFOV.cCorrect[t], //if the subject was correct for the center target
		 pPos: UFOV.pPos[t] - UFOV.thetaPos.length, //where the peripheral target was presented
		 											//(subtracting in order to get the values to be from 0-7, rather than 8-15, as we're ignoring inner circle positions)
		 pTargetX: UFOV.pTargetX[t], //the corresponding x-coordinate on the canvas for the peripheral target location
		 pTargetY: UFOV.pTargetY[t], //the corresponding y-coordinate on the canvas for the peripheral target location
		 pResp: UFOV.pResp[t], //which section of the circle the subject selected as where they saw the peripheral target
		 pX: UFOV.pX[t], //the corresponding x-coordinate where the subject clicked for their peripheral target response
		 pY: UFOV.pY[t], //the corresponding y-coordinate where the subject clicked for their peripheral target response
		 pRT: UFOV.pRT[t], //subject's response time for the peripheral target location
		 pCorrect: UFOV.pCorrect[t], //if the subject was correct for the peripheral target location
		 trialStart: UFOV.trialStart[t], //when the trial started
		 trialType: UFOV.trialType[t], //which practice mode the subject was in
		 pxperdeg: UFOV.pxperdeg, //the pixels per degree used for determining stimuli size
		 localsec: localsec //the subject's current local time
		}
	});

}
