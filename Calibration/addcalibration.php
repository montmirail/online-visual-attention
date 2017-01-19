<?php 

/* Calibration/addcalibration.php:
 * This script receives the values passed from Calibration/calibrationcode.js and adds them
 * to the database under the subject's ID #. It also keeps track of what number attempt this calibration
 * was for the subject, and for the provided task (for example, it could be the subject's second time 
 * completing the MOT task).
 */

//get access to the current SESSION variables
session_start();

//checks if the variables were sent
if (isset($_SESSION["sid"], $_SESSION["task"], $_POST["pxperdeg"], $_POST["monitorsize"], $_POST["pxwidth"], $_POST["pxheight"], $_POST["localsec"])) {
	//store info passed
	$sid = $_SESSION["sid"]; //subject ID (as in the number assigned to the subject when they logged in)
	$task = $_SESSION["task"]; //which task they will be completing next
	$monitorsize = sprintf("%.2f", $_POST["monitorsize"]); //subject's screen size (diagonally, in inches)
	$pxwidth = $_POST["pxwidth"]; //subject's screen width in pixels
	$pxheight = $_POST["pxheight"]; //subject's screen height in pixels
	$pxperdeg = sprintf("%.2f", $_POST["pxperdeg"]); //subject's calculated pixels per degree
	$localsec = $_POST["localsec"]; //subject's local time when they finished calibration
	
	//initiate connection to database using login credentials in connectToDB.php
	try {
		include('../php_utils/connectToDB.php'); 
	} catch (Exception $e){
		die('Error : ' . $e -> getMessage());
	}

	//change time to time string
	$localtime = date('Y-m-d H:i:s', $localsec);

	//check calibration table to see if this subject has completed any other screen calibrations for this particular task
	$logquery = $bdd->prepare("SELECT * FROM calibration WHERE sid=:sid AND task=:task");
	$logquery->bindParam(":sid", $sid);
	$logquery->bindParam(":task", $task);
	
	//if the query executed successfully...
	if ($logquery->execute()) {
		//check if any results were found and update the number of times the subject has attempted this calibration
		$numAttempts = $logquery->rowCount();

		//now add a new entry into the calibration table with this new calibration information
		$calibquery = $bdd->prepare("INSERT INTO calibration (sid, attempt, time, loctime, task, monitorsize, pxwidth, pxheight, pxperdeg)" .
			" VALUES (:sid, :attempt, NOW(), :loctime, :task, :monitorsize, :pxwidth, :pxheight, :pxperdeg)");
		$calibquery->bindParam(":sid", $sid);
		$calibquery->bindParam(":attempt", $numAttempts);
		$calibquery->bindParam(":loctime", $localtime);
		$calibquery->bindParam(":task", $task);
		$calibquery->bindParam(":monitorsize", $monitorsize);
		$calibquery->bindParam(":pxwidth", $pxwidth);
		$calibquery->bindParam(":pxheight", $pxheight);
		$calibquery->bindParam(":pxperdeg", $pxperdeg);
		$calibquery->execute();	
	}

	//close connection to the database
 	unset($bdd);
}

?>