<?php
/* UFOV/code.php:
 * small helper script for converting PHP SESSION variables to JS variables
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

//now include the JS code that runs the full task page
include("code.js");
?>