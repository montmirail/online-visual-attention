<?php
/* MOT/practicecode.php:
 * small helper script for converting php SESSION variables to JS variables 
 */

//get access to current SESSION variables
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

//now include the JS code that runs the practice page
include("practicecode.js");
?>