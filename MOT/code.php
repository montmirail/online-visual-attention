<?php

/* MOT/code.php:
 * small helper script for converting PHP SESSION variables to JS variables
 * and for loading the the trial order .txt file that sets the trial order
 * for the task 
 */

//get current SESSION variables
session_start();

//required to get this script to play nice with the included JS code
header("Content-type: text/javascript; charset: UTF-8");
ini_set('auto_detect_line_endings', true);

//set the monitor size to the session value
if (isset($_SESSION["monitorsize"])) {
	$monitorsize = $_SESSION["monitorsize"];
}
else {
	$monitorsize = -1; //if nothing is set, then use this error value
}

//set the pixels per degree conversion value to the session value
if (isset($_SESSION["pxperdeg"])) {
	$pxperdeg = $_SESSION["pxperdeg"];
}
else {
	$pxperdeg = -1; //if nothing is set, then use this error value
}

//number of dots to attend to per trial is pre-determined;
//get the order from the given file
//trialorder.txt is a text file that has one number per line, in order of trial presentation
$order = array();
$lines = file("trialorder.txt");
for ($i = 0; $i < count($lines); $i++) {
	$order[$i] = intval(trim($lines[$i])); //make sure it's just a number
}

//now include the JS code that runs the full task page
include("code.js");
?>