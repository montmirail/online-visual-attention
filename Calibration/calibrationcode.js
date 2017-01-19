/* Calibration/calibrationcode.js
 * This js code does the calculation for pixels/degree, based on the subject's screen size
 * and moves the subject along through each step. At the end, it sends the relevant calibration
 * information to a php script (addcalibration.php) so that the data can be added to the 
 * database. 
 */


// wait until the HTML page is ready before setting up all the widgets
$(window).ready(initPage);

//this limits the size of the main content container when the browser window is resized
// (mainly for aesthetic purposes)
var widthLimit = 1000;
$(window).resize(function() {
	if ($(window).width() <= widthLimit) {
	  $("body").css("width", widthLimit+"px");
	}
	else {
		$("body").css("width","100%");
	}
});

//measurements used for calibration
var cdcm = 12; //cm, diameter of CD
var cardcm = 8.6; //cm, width of credit card
var cdinch = 4.7; //inches, diameter of CD
var cardinch = 3.4; //inches, width of credit card
var distance = 50; //cm, chosen distance from screen as this approximates to an arm's length
var pxDiagonal = Math.sqrt(Math.pow(screen.width,2) + Math.pow(screen.height,2)); //get the screen's diagonal size in pixels

//set up the calibratio object images
var cdimg = new Image();
var cardimg = new Image();
var imgDir = "./img/"; //the directory where the object images are stored
cdimg.src = imgDir + "cd.png"; //location and name of the CD image file
cardimg.src = imgDir + "card.png"; //location and name of the credit card image file

//setting up initial values
var cardRatio = 0; //this will store the card's ratio of width to height
var curStep = 1; //this keeps track of the step the subject is currently on
var nextStep = 0; //this keeps track of what step will be next
var objectChosen = "none"; //this will store which object the subject chose as their calibration object
var screenMin = 10; //minimum screen size allowed for the task
var screenMax = 40; //maximum screen size allowed for the task

//slider parameters for changing the displayed object's size
//the units are inches * 10 (the * 10 helps to elongate the slider's appearances)
var sliderMin = screenMin * 10;
var sliderMax = screenMax * 10;

//once the card image is done loading, calculate the card ratio
cardimg.onload = setCardRatio;

//calculate the width to height ratio of the credit card image
function setCardRatio() {
	cardRatio = this.width/this.height;
}

//get the current value of the slider
function getSliderValue() {
	return sliderMax - $("#slider").slider("value") + sliderMin;
}

//set up all of the widgets and dialog boxes
function initPage() {

	//set the size of the content container to be no more than the width limit
	//(mainly for aesthetic purposes)
	if($(window).width() <= widthLimit) {
    	$("body").css("width", widthLimit + "px");
    }
	else {
		$("body").css("width","100%");
	}


	//hide the steps that aren't active at the beginning
	$("#adjustBar").hide();
	$("#startBar").hide();

	//setup the top navigation buttons between steps
	$("#options").buttonset();
	$("#radio1").prop("disabled", false);
	$("#radio1").prop("checked", true).button("refresh");
	$("#radio2").prop("disabled", false);
	$("#radio2").prop("checked", false).button("refresh");
	$("#radio3").prop("disabled", true);
	$("#radio3").prop("checked", false).button("refresh");
	$(".steps").click(updateStep);
	
	//setup step navigation buttons in the side panel
	$("#prevButton").button();
	$("#prevButton").button( "option", "disabled", true );
	$("#nextButton").button();
	$("#prevButton").click(updateStep);
	$("#nextButton").click(updateStep);
	
	//setup callback for radio buttons when selecting a calibration object
	$(".objectSelection").click(updateObject);
	
	//setup slider for controlling the resizing of the calibration object image
	$("#slider").slider({
	min: sliderMin,
	max: sliderMax,
	value: 250,
	slide: updateNumbers,
	stop: updateNumbers
	});
	
	//set the starting value for the pixel per inch parameter
	window.pxperinch = pxDiagonal/(getSliderValue()/10);
	
	//this button is clicked after the subject enters a screen size
	//it then updates the slider position to match the given value
	$("#sizeButton").button();
	$("#sizeButton").click(updateSlider);

	//this warning dialog appears if an invalid screen size is input
	$("#warningDialog").dialog({
	autoOpen: false,
	modal: true,
	title: "Invalid Input",
	width: 400,
	height: 100
	});
	
	//this dialog appears so that the user can confirm the screen size they input after step 1
	$("#confirmDialog").dialog({
	autoOpen: false,
	modal: true,
	title: "Confirm Monitor Size",
	buttons: {
	"Yes, let's continue.": function() {
		//close the dialog box after they confirm
		$(this).dialog("close");

		//do the calculations for pixels/degree
		getConversion(); 

		//if they are moving onto step 2 now, then setup all the navigation buttons
		//and display step 2's content
		if (nextStep == 2) {
			$("#radio2").prop("checked", true).button("refresh");
			$("#prevButton").button( "option", "disabled", false );
			$("#nextButton").button( "option", "disabled", false );
			$("#screenBar").hide(); //hide step 1's content
			$("#adjustBar").show(); //show step 2's content

			//display grayscale boxes
			grayscale();

			//don't let them move onto step 3 yet
			$("#radio3").prop("disabled", false).button("refresh");

			//update the current step
			curStep = 2;
		}

		//if the next step they are moving onto is step 3 (this is only the case if they 
		//completed step 2, but then decided to go back to step 1 and then selected step 3
		//from the top navigation bar), then update the navigation buttons and display
		//step 3's content
		else if (nextStep == 3) {
			$("#radio3").prop("checked", true).button("refresh");
			$("#prevButton").button( "option", "disabled", false );
			$("#nextButton").button( "option", "disabled", true );
			$("#screenBar").hide(); //hide step 1's content
			$("#startBar").show(); //show step 3's content
			$("#myCanvas").hide(); //hide the HTML5 canvas
			$("#startButton").show(); //show the start button that takes the subject to the tasks

			//update the current step
			curStep = 3;
		}
		
	}, 
	"No, let me fix it.": function() {
		$(this).dialog("close"); //close the dialog box and stay on step 1
	}},
	width: 400
	});
	
	//this dialog box appears after the subject has finished adjusting their screen's brightness/constrast (step 2)
	$("#confirmDialog2").dialog({
	autoOpen: false,
	modal: true,
	title: "Confirm Brightness/Contrast",
	buttons: {
	"Yes, let's continue.": function() {
		//close the dialog box after they confirm
		$(this).dialog("close");

		//If they are moving backwards to step 1, then set up all the navigation buttons to reflect the new state
		//and show step 1's content
		if (nextStep == 1) {
			$("#radio1").prop("checked", true).button("refresh");
			$("#radio2").prop("disabled", false).button("refresh");
			$("#prevButton").button( "option", "disabled", true );
			$("#nextButton").button( "option", "disabled", false );
			$("#adjustBar").hide(); //hide step 2's content
			$("#screenBar").show(); //show step 1's content
			drawObject(); //draw the calibration object that may have been selected previously

			//update the current step
			curStep = 1;

		}

		//Else if they're moving forward to step 3, then set up the navigation buttons to reflect that state
		//and show step 3's content
		else if (nextStep == 3) {
			$("#radio3").prop("checked", true).button("refresh");
			$("#prevButton").button( "option", "disabled", false );
			$("#nextButton").button( "option", "disabled", true );
			$("#adjustBar").hide(); //hide step 2's content	
			//$("#screenBar").hide(); 
			$("#startBar").show(); //show step 3's content
			$("#myCanvas").hide(); //hide the HTML5 canvas
			$("#startButton").show(); //show the start button that takes the subject to the task
			curStep = 3;
		}
		
	}, 
	"No, let me fix it.": function() {
		$(this).dialog("close"); //close the dialog box and stay on step 2
	}},
	width: 400
	});

	
	//Setup the dialog box for the help instructions for adjusting brightness/contrast
	//(The actual instructions are written in Calibration/index.php)
	$("#helpDialog").dialog({
	autoOpen: false,
	title: "Adjusting Monitor Brightness/Contrast",
	width: 400
	});
	
	//setup the button that brings up the above help dialog window
	$("#help").button();
	$("#help").click(showHelp);
	
	//setup the button that sends the user to the experiment task
	$("#startButton").button();
	$("#startButton").click( function() {

		//px/deg and monitor size are set in the HTML form
		$("#pxperdeg").val(window.pxperdeg);
		$("#monitorsize").val(window.monitorSize);

		//then add the calibration to the database
		addCalibration();
	});
	$("#startButton").button( "option", "disabled", true ); //initially diasble the start button
	
	//set callbacks for the two when the two checkboxes in step 3 when they are ticked
	$("#fullscreen").change(checkReady);
	$("#arm").change(checkReady);

	//now draw the initial content
	drawContent();
}

// This is the callback funcion for the checkboxes in step 3. When both of them are ticked,
// the start button to access the task is then activated. Otherwise, the start button
// stays disabled.
function checkReady() {
	if ($("#fullscreen").prop("checked") && $("#arm").prop("checked")) {
		$("#startButton").button( "option", "disabled", false );
	}
	else {
		$("#startButton").button( "option", "disabled", true );
	}
}

// This function updates which calibration object is drawn on the screen during step 1.
function updateObject() {
	objectChosen = $(this).val(); //update the object
	drawObject(); //now make a call to draw the object
}

// This function updates the position of the bar on the slider, based on what is typed into
// the screenInput text field. If an invalid value is input, an error message pops up.
// The calibration object is also updated in size, based on the input value.
function updateSlider() {

	//default to displaying a CD if no object is selected
	if (objectChosen == "none") { 
		objectChosen = "cd";
		$("#cd").prop("checked", true).button("refresh");
	}

	//get value from the screen input field
	var inchDiagonal = parseFloat($("#screenInput").val());

	// if it's not a number, or it's outside the set minimum and maximum values,
	// pop up the warning dialog box
	if (isNaN(inchDiagonal) || inchDiagonal < screenMin || inchDiagonal > screenMax) {
		$("#warningDialog").text("Please input a number between " + screenMin + " and " + screenMax + ".");
		$("#warningDialog").dialog("open");
		return;
	}
	// otherwise calculate pixels per inch based on the given screen size
	// and update the slider to show the given input value as well
	else {
		window.pxperinch = pxDiagonal/inchDiagonal;
		$("#slider").slider("option","value", sliderMax - inchDiagonal*10 + sliderMin);
	}

	//make a call to update the calibration object image
	drawObject();

	//update the screen size output
	$("#diagsize").text($("#screenInput").val() + "\"");

}

// This is the callback function for the slider. As the slider moves, the output values
// on the screen are updated.
function updateNumbers() {

	//an object needs to be selected in order to use the slider (since the slider is meant
	//for adjusting a calibration object's size); if no object is selected, but the subject tries
	//to move the slider, a warning dialog box pops up
	if (objectChosen == "none") {
		$("#warningDialog").text("Please choose an object first.");
		$("#warningDialog").dialog("open");
	}
	else {
		var inches = getSliderValue()/10; //convert the slider value to inches
		window.pxperinch = pxDiagonal/inches; //calculate pixels per inch
		$("#diagsize").text(inches.toFixed(1) + "\""); //update screen size output
		$("#screenInput").val(inches.toFixed(1)); //update value displayed in the screen size input field
		drawObject(); //update the image size of the calibration object
	}
}

//This function sets up the HTML5 canvas
function drawContent() {
	//grab the canvas object and set it up for drawing
	var canvas=document.getElementById("myCanvas");
	var c=canvas.getContext("2d");

	//set the size of the canvas
	canvas.width = 600;
	canvas.height = 600;

	//set the background to be gray
	c.fillStyle="rgb(128, 128, 128)";
	c.fillRect(0,0,canvas.width,canvas.height);

	//now draw the initial content for step 1
	drawObject();
}

// This function updates the appearance of the calibration object in step 1
function drawObject() {
	//get the HTML% canvas and determine its center coordinates
	var canvas=document.getElementById("myCanvas");
 	var c=canvas.getContext("2d");
 	var centerX = canvas.width/2;
 	var centerY = canvas.height/2;

 	//clear the canvas and set a gray background
 	c.fillStyle="rgb(128, 128, 128)";
  	c.fillRect(0,0,canvas.width,canvas.height);
  	
  	//if the selected image is a credit card, then update the card size based on the calculated
  	//pixels per inch, and then redraw the card to display to the subject 
  	if (objectChosen == "card") {
  		var cardWidth = Math.round(window.pxperinch*cardinch);
  		var cardHeight = Math.round(cardWidth/cardRatio);
		c.drawImage(cardimg, 0, 10, cardWidth, cardHeight);
  	}

  	//if the CD was chosen, then update the CD size and redraw it
  	else if (objectChosen == "cd") {
	  	var cdDiam = Math.round(window.pxperinch*cdinch);
	  	//the CD is bigger than the credit card, so it tends to go past the HTML5 canvas limits if the screen
	  	//size is particularly small; when this happens, the canvas needs to be resized so that the CD image
	  	//does not get cropped
	  	if (cdDiam > canvas.width - 10) {
	  		//increase canvas size
	  		canvas.width = cdDiam+10;
			canvas.height = cdDiam+10;

			//update what the center coordinates are of the canvas
	  	 	centerX = canvas.width/2;
	 		centerY = canvas.height/2;

	 		//update sidebar height so that it is the same size as the canvas's height
	 		$(".sidebar").css("height", canvas.height);
	 		widthLimit = canvas.width+500; //update the width limit of the main content container
	 		if($(window).width() <= widthLimit) {
	    		$("body").css("width", widthLimit+"px");
	    	}
	  	}

	  	//now redraw the CD at the newly determined size
	  	c.drawImage(cdimg, centerX-cdDiam/2, centerY-cdDiam/2, cdDiam, cdDiam);
  	}
  	//if no object is currently selected, then draw a black question mark in the middle of the canvas
  	else {
  		c.fillStyle = "black";
  		c.textAlign = "center";
  		c.font = "bold 6em sans-serif";
  		c.fillText("?", centerX, centerY);
  	}
}

//This checks the screen size input field to make sure a value has been input
function checkValue() {
	var inchDiagonal = parseFloat($("#screenInput").val()); //get the screen size value input by subject
	
	//if the screen output is the default value, they did not enter anything in the screen size input field 
	//nor did they use the slider to estimate their screen size.
	//Display a warning dialog box if this is the case.
	if ($("#diagsize").text() == "???") {
		$("#warningDialog").text("You did not input a screen size.");
		$("#warningDialog").dialog("open");
		return;
	}
	//otherwise, check to make sure the the set value is correct according to the subject by displaying
	//a confirmation dialog window
	else {
		$("#confirmDialog").text("You have indicated your screen size is " + 
		inchDiagonal.toFixed(1) + "\". Is this OK?");
		$("#confirmDialog").dialog("open");
	}
}

// This function calculates pixels per degrees, based on the size of the monitor
function getConversion() {
	//first pixels per inch is converted to pixels per centimeter (used for drawing the brightness/contrast grayscale rectangles)
	window.pxpercm = Math.round(window.pxperinch/2.54);

	//then calculate pixels per degree
	var angle = Math.atan(screen.height/screen.width);
	var diagCM = (getSliderValue()/10)*2.54;
	var screenWidthCM = diagCM * Math.cos(angle);
	window.pxperdeg = Math.PI/180 * screen.width * distance/screenWidthCM;

	//also get the final confirmed monitor size
	window.monitorSize = parseFloat($("#screenInput").val());
}

// This draws the grayscale boxes in step 2
function grayscale() {
	//get a reference to the canvas
	var canvas=document.getElementById("myCanvas");
	var c=canvas.getContext("2d");
	
	//clear the canvas and set the background to gray
	c.fillStyle="rgb(128, 128, 128)";
	c.fillRect(0,0,canvas.width,canvas.height);
	
	//draw 12 rectangles and set the size for each individual rectangle
	var calibSteps = 12;
	var calibBoxWidth = Math.round(1*window.pxpercm); //cm
	var calibBoxHeight = Math.round(4*window.pxpercm); //cm

	//get the center coordinates of the canvas
	var centerX = Math.round(canvas.width/2);
	var centerY = Math.round(canvas.height/2);
	
	//now draw each box			
	for (var i=0; i < calibSteps; i++) {
		var grayColor = Math.round(i*(255/(calibSteps-1))); //incrementally increase the color of the box (from black to white)
		if (i == calibSteps-1) {
			grayColor = 255; //this makes sure it is a true white if the number of boxes does not evenly divide 255
		}
		//set the color of the rectangle and then draw it in the rectangle array
		c.fillStyle = "rgb(" + grayColor + "," + grayColor + "," + grayColor + ")";
		c.fillRect(centerX-(calibBoxWidth*calibSteps/2)+(i*calibBoxWidth),centerY-calibBoxHeight/2, calibBoxWidth, calibBoxHeight);
	}
}

// This is the callback function for the help button in step 2 when the subject 
// requests help to know how to adjust their screen's brightness/contrast
function showHelp() {
	$("#helpDialog").dialog("open");
	return false;
}

// This callback function updates the content on the page to the next step that should
// be displayed, after one of the navigation buttons is pressed
function updateStep() {
	var goTo = -1; //this will store which step is the next one
	if ($(this).attr('id') == "prevButton") {
		goTo = curStep-1; //go to the previous step
		$("#radio"+goTo).prop("checked", true).button("refresh"); //update the appearance of the top navigation menu
	}
	else if ($(this).attr('id') == "nextButton") {
		goTo = curStep+1; //go to the next step
		$("#radio"+goTo).prop("checked", true).button("refresh"); //update the appearance of the top navigation menu
	}
	else {
		goTo = $(this).val(); //stay at the current step
	}

	//if it's step 1, then show only step 1's content
	if (goTo == 1) {
		//update navigation buttons
		$("#prevButton").button( "option", "disabled", true );
		$("#nextButton").button( "option", "disabled", false );

		$("#adjustBar").hide(); //hide step 2 content
		if (curStep == 3) { //but if subject came from step 3, then hide step 3 content
			$("#myCanvas").show(); //show canvas again
			$("#startButton").hide();
			$("#startBar").hide();
		}

		$("#screenBar").show();  //show step 1 content

		drawObject(); //draw calibration object if one was previously selected
		curStep = 1; //update current step
	}

	//show step 2's content
	else if (goTo == 2) {
		 //if going from step 1 to step 2, need to first confirm that the subject
		 //input a valid value for screen size
		if (curStep == 1) {
			nextStep = 2; //store where the subject wants to go next
			$("#radio1").prop("checked", true).button("refresh");
			checkValue(); //check the screen size value input (either typed in or via slider)
		}
		//otherwise they are going from step 3 to 2, so no need to confirm any values
		else {
			//update navigation buttons
			$("#prevButton").button( "option", "disabled", false );
			$("#nextButton").button( "option", "disabled", false );

			//hide step 3 content
			$("#startBar").hide();
			$("#startButton").hide();

			//show step 2 content
			$("#adjustBar").show();
			$("#myCanvas").show();
			grayscale();

			//update current step
			curStep = 2;
		}
	}

	//show step 3's content
	else if (goTo == 3) {
		//if going from step 1 to step 3, then need to confirm the screen size input from step 1 is valid
		if (curStep == 1) {
			nextStep = 3; //store where the subject wants to go next
			$("#radio1").prop("checked", true).button("refresh");
			checkValue(); //check the screen size value input (either typed in or via slider)
		}
		//also need to confirm the subject is content with screen brightness/contrast if going from step 2 to step 3
		else if (curStep == 2) {
			nextStep = 3; //store where the subject wants to go next
			$("#radio2").prop("checked", true).button("refresh");
			$("#confirmDialog2").dialog("open"); //show the confirmation dialog box
		}	
	}
}

// This function sends the calibration information to the database. This function is called when
// the Start button is pressed.
function addCalibration() {
	//get the subject's current local time
	var d = new Date();
	var localsec = Math.round(d.getTime()/1000) - d.getTimezoneOffset()*60;

	//now send all the calibration info to the addcalibration.php script
	$.ajax({
			type: "POST",
			url: "addcalibration.php",
			data: { 
				monitorsize: monitorSize, //screen size in inches
				pxwidth: screen.width, //screen width in pixels
				pxheight: screen.height, //screen height in pixels
				pxperdeg: window.pxperdeg, //pixels per degree conversion value for this screen
				localsec: localsec //subject's current time
			}
		}).done(function(message) {
				$("#go2expt").submit(); //submit the HTML form to the task page
		});
}