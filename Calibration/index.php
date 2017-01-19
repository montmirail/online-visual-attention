<?php

/* Calibration/index.php:
 * This page contains all of the calibration steps needed before a subject completes either the MOT or UFOV task.
 * 
 * The first step requires the participant to input their screen size; however, if they do not know their screen
 * size, they can use a CD/DVD or credit card as a calibration object so that we can determine their screen size
 * that way.
 *
 * The second step asks them to adjust the brightness/contrast of their screen.
 *
 * The third step asks them to sit an arm's length away from the screen, as this is a close approximation to the
 * distance we use in the lab for subjects (50 cm). It also tells them to fullscreen their browser window, in order to
 * maximize the amount of space we can use on their screen for the tasks.
 */

session_start();

//default values for status variables
$loggedin = false;
$calibrated = false;

//if there is a valid SESSION variable for the subject ID, then the subject is logged in
if (isset($_SESSION["sid"]) && $_SESSION["sid"] != -1) {
	$loggedin = true;
}

//if a task name was passed as a URL parameter, then set the task SESSION variable to that task
if (isset($_REQUEST["task"])) {
	$_SESSION["task"] = $_REQUEST["task"];
}

//if there is no SESSION value for task, then send them back to the main index page so that they can select
//a task to complete
if (!isset($_SESSION["task"])) {
	header('Location: ../index.php');
}

//check if a calibration has already been completed and then move them onto the next task if so
//(so they don't need to do the calibration twice on the same computer)
if (isset($_SESSION["pxperdeg"]) && isset($_SESSION["monitorsize"]) && isset($_SESSION["task"])) {

	
	//connect to the database via the login credentials in connectToDB.php
	try {
		include('../php_utils/connectToDB.php'); 
	} catch (Exception $e){
		die('Error : ' . $e -> getMessage());
	}

	//check for existing calibration by subject in the calibration table
	$existquery = $bdd->prepare("SELECT * FROM calibration WHERE sid=:sid");
	$existquery->bindParam(":sid", $_SESSION["sid"]);
	$existquery->execute();
	
	//if there is a result found, then redirect them to the task's practice page
	if ($existresult = $existquery->fetch()) {
		unset($bdd); //disconnect from database first
		header('Location: ../' . strtoupper($_SESSION["task"]) . '/practice.php');
	}

	//disconnect from database when done
	unset($bdd);

}

?>

<!DOCTYPE html>

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 

	<!-- CSS styling -->
	<link href="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/themes/black-tie/jquery-ui.css"
          type="text/css" rel="stylesheet" />
	<link href="calibrationstyle.css" type="text/css" rel="stylesheet" />
          
	<title>Screen Calibration</title>

	<!-- JS libraries -->
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>

	<!-- additional JS for controlling the page, if the subject is logged in -->
	<?php if ($loggedin) { ?>
	<script type="text/javascript" src="calibrationcode.js"></script>
	<?php } ?>

</head>



<body>

	<!--only display all the calibration content if the subject is logged in -->
	<?php if ($loggedin) { ?>

		<!-- these radio buttons control the navigation at the top of the page -->
		<div id="options" class="center-stuff">
			<input type="radio" id="radio1" class="steps" name="steps" value=1 checked="checked"/><label for="radio1">Step 1: Measure</label>
			<input type="radio" id="radio2" class="steps" name="steps" value=2 /><label for="radio2">Step 2: Adjust</label>
			<input type="radio" id="radio3" class="steps" name="steps" value=3 /><label for="radio3">Step 3: Start</label>
		</div>

		<!-- this is the main container for the calibration content -->
		<div id="content" class="ui-widget ui-widget-content ui-corner-all">

		<div class="sidebar ui-widget ui-widget-content ui-corner-left">
			<!-- this displays the instructions and widgets for step #1, where the subject must
			input their screen size or use a CD/DVD or credit card to measure their screen -->
			<div id="screenBar">
				<h3 id="header1" class="ui-state-default ui-corner-tl">Step 1: Measure Your Screen</h3>
				<p>
				First, we need to know the size of your monitor.<br/><br/>
				If you know your diagonal monitor size, enter it in the box below.
				</p>

				<!-- Here the subject can input their screen size if they know it -->
				<p class="bottom-border center-stuff"><strong>Diagonal monitor size (inches):</strong> <input type="text" size=5 name="screenInput" id="screenInput" />
				<button id="sizeButton">Enter Value</button>
				</p>

				<!-- Otherwise, they can select from the two options below which object they want to use to determine the size of their screen -->
				<p>
				If not, please find one of the following objects to help with 
				the measuring process before continuing.<br/><br/>
				<strong>Select the physical object you will use:</strong><br/>
				<input type="radio" id="cd" name="object" value="cd" class="objectSelection"/><label for="cd">CD or DVD</label><br/>
				<input type="radio" id="card" name="object" value="card" class="objectSelection"/><label for="card">credit or debit card</label>
				</p>
				
				<!-- They then use the slider to resize the image of the object on the screen until it matches the size of the physical object. -->
				<p>
				Place your
				chosen object against your screen and move the slider until the image 
				is the same size as the object.<br/></br>
				</p>
				<div class="slider-wrapper"><div id="slider" class="sliders"></div></div>
				<br/>

				<!-- This outputs the current estimated screen size, based on the size of the image -->
				<p class="center-stuff"><strong>Your diagonal monitor size is:</strong>
				<p id="diagsize" class="center-stuff">???</p>

				<p class="center-stuff">Once you are finished, continue to Step 2.<br/></p>
			</div>
			
			<!-- This displays the instructions for the step #2. 12 grayscale boxes are displayed, and the subject
			must adjust their screen's brightness/contrast so that they can clearly see the 12 different colors. -->
			<div id="adjustBar">
				<h3 id="header2" class="ui-state-default ui-corner-tl">Step 2: Adjust Your Brightness/Contrast</h3>
				<p>Please take the time to adjust your monitor's brightness and contrast settings
				until you can distinguish the 12 boxes below and the black and white are true.
				Continue to Step 3 when you are satisfied with your adjustments.</p>

				<!-- help button if they don't know how to adjust brightness/contrast-->
				<p class="center-stuff"><button id="help">Need help with monitor calibration?</button></p>
				<br/>
				<br/>
				
				<!--this is a pop-up help dialog box that gives instructions on how they can adjust their screen's brightness/contrast -->
				<div id="helpDialog">
				<dl>
				<dt><strong>For Windows users:</strong><dt>
				<dd>Go to Start > Control Panel and look for your graphics card's control panel (ex. NVIDIA)
				or there may be buttons located directly on your monitor/laptop to adjust the brightness and contrast</dd>
				</dl>
				
				<dt><strong>For Mac users:</strong><dt>
				<dd>Use these keyboard shortcuts:
				<br/><br/>
				<em>Decrease Brightness:</em> F1<br/>
				<em>Increase Brightness:</em> F2<br/>
				<em>Decrease Contrast:</em> Ctrl-Option-Command-,<br/>
				<em>Increase Constrast:</em> Ctrl-Option-Command-.<br/>
				</dd>
				<br/>
				</div>
			</div>

			<!-- This displays the instructions for step #3. It tells the subject to fullscreen their browser window and to sit
			at an arm's distance away from their screen. -->
			<div id="startBar">
				<h3 id="header3" class="ui-state-default ui-corner-tl">Step 3: Start the Experiment</h3>
				<p>Almost there! Before you begin, please do the following tasks and check them off the list:<br/><br/>
				<label><input type="checkbox" id = "fullscreen" name="fullscreen" value="fullscreen"/> Increase your browser window to the largest size possible, 
				preferably by enabling the "full screen" or "presentation" mode of your browser. (It is typically F11 for Windows or Command-Shift-F for Mac. 
				You can also check your browser's menu bar.)</label><br/><br/>
				<label><input type="checkbox" id="arm" name="arm" value="arm"/> Sit at arm's length from your monitor for the duration of the task</label><br/><br/>
				Click the Start button when you are ready.</p>
			</div>
			
			<!-- These are additional navigation buttons between steps -->
			<div class="center-stuff">
			<button id="prevButton"><span class="ui-icon ui-icon-triangle-1-w"></span></button> <button id="nextButton"><span class="ui-icon ui-icon-triangle-1-e"></span></button>
			</div>
			</div>

			<!-- This is the HTML5 canvas used for displaying the calibration object images, and also the grayscale boxes -->
			<canvas id="myCanvas">
				<!-- The message below appears if the subject's browser does not support the HTML5 canvas -->
				Your browser does not support the canvas element.
			</canvas>

			<!-- Once the subject is done with all 3 steps, the Start button is activated -->
			<button id="startButton">Start!</button>
		</div>


		<!-- pop-up dialog windows to either let the subject know they are missing information, or to check
		they input the correct information.-->
		<div id="warningDialog">Please input a number.</div>
		<div id="confirmDialog"></div>
		<div id="confirmDialog2">Did you adjust your brightness and contrast correctly?</div>

	<!--if the subject is not logged in, they'll see the message below instead. -->
	<?php } else { ?>
		<a href="./index.php">Please log in to continue</a>
	<?php } ?>

	<!-- This controls where the subject is redirected once they hit the Start button -->
	<?php if ($_SESSION["task"] == 'mot') { ?>
		<form id="go2expt" method="post" action="../MOT/practice.php">
	<?php } else if ($_SESSION["task"] == 'ufov') { ?>
		<form id="go2expt" method="post" action="../UFOV/practice.php">
	<?php } else { ?>
		<form id="go2expt" method="post" action="../index.php">
	<?php } ?>

			<!-- When starting a task, the monitor size (in inches) and the estimated pixels per degree value
			for that screen is passed to the task page. These values are used for drawing the stimuli. -->
			<input type="hidden" id="monitorsize" name="monitorsize" value="0"/>
			<input type="hidden" id="pxperdeg" name="pxperdeg" value="0"/>
		</form>

</body>

</html>