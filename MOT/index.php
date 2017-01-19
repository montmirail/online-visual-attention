<?php

/* MOT/index.php:
 * Main page for the Multiple Object Tracking (MOT) task. This presents the full task to the subject,
 * and the subject gets here after finishing the practice session (MOT/practice.php).
 */

//get the current SESSION variables
session_start();

//default status variable values
$calibrated = false;
$loggedin = false;


//if there is a valid subject ID value stored in the sid SESSION variable,
//then the subject has successfully logged in
if (isset($_SESSION["sid"]) && $_SESSION["sid"] != -1) {
	$loggedin = true;
	$_SESSION["task"] = "mot"; //also make sure they have the correct task name stored in their session
}

//check that calibration has been completed (relevant values saved in the session)
if (isset($_SESSION["monitorsize"]) && isset($_SESSION["pxperdeg"])) {
	$calibrated = true;
}

?>

<!DOCTYPE html>

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 

	<!-- CSS styling -->
	<link href="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/themes/black-tie/jquery-ui.css" type="text/css" rel="stylesheet" />
	<link href="./exptstyle.css" type="text/css" rel="stylesheet" /> 

	<title>Multiple Object Tracking</title>
	
	<!-- JS libraries -->
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>

	<!-- only include the remaining code if the subject is logged in and has completed screen calibration -->
	<?php if ($loggedin && $calibrated) { ?>

	<!-- This is code that applies a seed to the random number generator -->
	<script type="text/javascript" src="../js_utils/seedrandom.js"></script>

	<!-- PHP script connected to more JS code for controlling the page -->
	<script type="text/javascript" src="./code.php"></script>

	<?php } ?>
</head>

<body>
	<!--only display all the practice page content if the subject is logged in and has calibrated their screen -->
	<?php if ($loggedin && $calibrated) { ?>


	<!-- the reminder button is present during the practice trials so that the subject can click on it if they
	want to bring up the instructions at any point after they have been initially explained. -->
	<button id="reminderButton">Information</button>
	
	<!-- These are the instructions that display in a pop-up dialog window when the subject clicks on the reminder button -->
	<div id="reminder">
		Press the <strong>space bar</strong> to start the trial.
		<br/><br/>
		Pay attention to the sad faces and remember which ones they are once they become happy faces.
		When one of the faces changes into a question mark, respond with one of the following keys:
		<br/><br/>
		<strong>B key</strong> - indicates you think this face started as a blue face<br/>
		<strong>Y key</strong> - indicates you think this face was always a yellow face<br/>
	</div>
	
	<!-- This message appears before the subject starts the full task. It points them to the practice trials if they'd like to redo them, and also 
	gives them a reminder to keep their browser fullscreened during the task. -->
	<div id="preexpt">
		<p>If you need to review the instructions, you can click on the icon in the bottom right corner or <a href=./practice.php>return to the tutorial</a>.</p>
		<p id="fs-check">Please fullscreen your browser window before continuing the study. (It is typically F11 for Windows or Command-Shift-F for Mac. 
				You can also check your browser's menu bar.)</p>

		<!-- button for confirming they read the above message -->
		<button id="cButton">Continue</button>
	</div>
	
	<div>
		<!-- HTML5 canvas which displays the task -->
		<canvas id="exptCanvas">
			Your browser does not support the canvas element.
		</canvas>
	</div>
	
	<!-- message that appears after the subject is done with the task, suggests they complete the UFOV task if they haven't already -->
	<div id="postexpt">
		<p id="postexpt-result"></p>
		<p>Thank you for participating!</p>
		<p>If you haven't completed the Useful Field of View task yet, you can start it by 
			<a href="../UFOV/practice.php">clicking here.</a></p>
	</div>

	<!-- if the subject hasn't logged in, then this message will appear -->
	<?php } else if (!$loggedin) { ?>
	<div> <a href="../index.php?task=mot">Please login first before starting the task.</a> </div>
	<!-- if the subject is logged in, but hasn't calibrated their screen, then this message will appear to redirect them to the calibration page -->
	<?php } else if (!$calibrated) { ?>
	<div> <a href="../calibration/index.php?task=mot">Please go through our calibration steps before starting the task</a></div> 
	<?php } ?>
</body>

</html>