<?php
/* UFOV/practice.php:
 * Tutorial version of the Useful Field of View (UFOV) task. Instructions for the task are given to the subject,
 * and the subject in then taken through incrementally more difficult trials in order to learn all components of the task.
 * The subject must get a certain number of trials correct at each stage (see UFOV/practicecode.js for details) before moving
 * onto the full task.
 */

//get current SESSION variables
session_start();

//default status variable values
$loggedin = false;
$calibrated = false;

//if there is a valid subject ID value stored in the sid SESSION variable,
//then the subject has successfully logged in
if (isset($_SESSION["sid"]) && $_SESSION["sid"] != -1) {
	$loggedin = true;
	$_SESSION["task"] = "ufov"; //also make sure they have the correct task name stored in their session
}

// get values from calibration
// first check if values directly passed via form from Calibration/index.php
if (isset($_POST["monitorsize"]) && isset($_POST["pxperdeg"])) {
	$_SESSION["monitorsize"] = $_POST["monitorsize"];
	$_SESSION["pxperdeg"] = $_POST["pxperdeg"];
	$calibrated = true;
}
//otherwise, check if there are already calibration values saved in the session
else if (isset($_SESSION["monitorsize"]) && isset($_SESSION["pxperdeg"])) {
	$calibrated = true;
}

?>

<!DOCTYPE html>

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 

	<!-- CSS styling -->
	<link href="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/themes/black-tie/jquery-ui.css" type="text/css" rel="stylesheet" />
	<link href="practicestyle.css" type="text/css" rel="stylesheet" />
	<title>UFOV Tutorial</title>

	<!-- JS libraries -->
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>

	<!-- PHP script connected to more JS code for controlling the page, if the subject is logged in and has done screen calibration -->
	<?php
	if ($loggedin && $calibrated) { ?>
	<script type="text/javascript" src="practicecode.php"></script>
	<?php } ?>
</head>

<body>
	<!--only display all the practice page content if the subject is logged in and has calibrated their screen -->
	<?php if ($loggedin && $calibrated) { ?>

	<!-- the reminder button is present during the practice trials so that the subject can click on it if they
	want to bring up the instructions at any point after they have been initially explained. -->
	<button id="reminderButton">Instructions</button>

	<!-- These are the instructions that display in a pop-up dialog window when the subject clicks on the reminder button -->
	<div id="reminder">
		Press the <strong>space bar</strong> to start the trial.
		<br/><br/>
		Pay attention to the smiley face's hair and where the star appears.
		When the lines appear on the screen, this is your time to report what you saw.
		<br/><br/>
		<em>For the face:</em><br/>
		<strong>S key</strong> - indicates you saw a face with short hair<br/>
		<strong>D key</strong> - indicates you saw a face with long hair<br/>
		<br/>
		<em>For the star:</em><br/>
		Click on the line where the star appeared. You will know your response was recorded when an X is displayed.
		<br/><br/>
		You will be told whether your answers were correct or not once you give responses for both objects.
	</div>

	<!-- This message appears before the subject starts the practice section, as a reminder to keep their browser fullscreened during the task. -->
	<div id="preexpt">
		<p id="fs-check">Please fullscreen your browser window before continuing the study. (It is typically F11 for Windows or Command-Shift-F for Mac. 
		You can also check your browser's menu bar.)</p>

		<!-- button for confirming they read the above message -->
		<button id="cButton">Continue</button>
	</div>

	<!-- The step-by-step instructions will display in this content div -->
	<div id="content">
		<!-- navigation buttons to move through the instructions -->
		<button id="backButton">back button</button>
		<button id="forwardButton">forward button</button>

		<!-- placeholder for where the instruction text will go (instruction text is set in MOT/practicecode.js) -->
		<p id="instructions"></p>

		<!-- this displays feedback to the user during the practice trials -->
		<p id="notice"></p>
	</div>

	<!-- HTML5 canvas which will display all of the example stimuli and practice trials -->
	<canvas id="exptCanvas">
		Your browser does not support the canvas element.
	</canvas>

	<!-- button for starting the practice trials -->
	<button id="pracButton">Practice</button>

	<!-- if the subject hasn't logged in, then this message will appear -->
	<?php } else if (!$loggedin) { ?>
	<div> <a href="../index.php?task=ufov">Please login first before starting the task.</a> </div>
	<!-- if the subject is logged in, but hasn't calibrated their screen, then this message will appear to redirect them to the calibration page -->
	<?php } else if (!$calibrated) { ?>
	<div> <a href="../Calibration/index.php?task=ufov">Please go through our calibration steps before starting the task</a></div> 
	<?php } ?>
</body>

</html>