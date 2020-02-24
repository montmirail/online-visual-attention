<?php
/* MOT/savePractice.php:
 * This script receives practice trial data from MOT/practicecode.js and saves it in the database
 */

session_start(); //get the current SESSION variables
$message = "default"; //stores status message for success/failure of adding to the database (used for debugging)

//checks if the variables were sent
if (isset($_SESSION["sid"], $_SESSION["task"], $_POST["trial"], $_POST["numAttendDots"], $_POST["probeTracked"], $_POST["response"], 
	$_POST["correct"], $_POST["rt"], $_POST["trialStart"], $_POST["pxperdeg"], $_POST["localsec"])) {

	//store values sent
	$sid = $_SESSION["sid"]; //subject ID (the number assigned when the subject logged in)
	$username = $_SESSION["username"];
	$trial = $_POST["trial"]; //current trial number
	$numAttendDots = $_POST["numAttendDots"]; //number of cued dots for that trial
	$probeTracked = $_POST["probeTracked"]; // if the queried dot was originally a cued dot
	$response = $_POST["response"]; //subject's response for the trial
	$correct = $_POST["correct"]; //if the subject was correct or not
	$rt = $_POST["rt"]; //subject's response time for the trial
	$trialStart = $_POST["trialStart"]; //trial start time
	$pxperdeg = $_POST["pxperdeg"]; //the pixels per degree value used for the subject's setup
	$localsec = $_POST["localsec"]; //the subject's current local time

	//initiate connection to the database using the login credentials in connectToDB.php
	try {
		include('../php_utils/connectToDB.php'); 
	} catch (Exception $e){
		die('Error : ' . $e -> getMessage());
	}
  
	//change time to time string
	$localtime = date('Y-m-d H:i:s', $localsec);
	
	//add trial data to the mot practice table
	$trialquery = $bdd->prepare("INSERT INTO motpractice (sid, username, time, loctime, trial, trialStart, numAttendDots, probeTracked, response, correct, rt, pxperdeg) " .
		"VALUES (:sid, :username, NOW(), :loctime, :trial, :trialStart, :numAttendDots, :probeTracked, :response, :correct, :rt, :pxperdeg)");
		
	//setup parameters		 
	$trialquery->bindParam(":sid", $sid);
	$trialquery->bindParam(":username", $username);
	$trialquery->bindParam(":loctime", $localtime);
	$trialquery->bindParam(":trial", $trial);
	$trialquery->bindParam(":trialStart", $trialStart);
	$trialquery->bindParam(":numAttendDots", $numAttendDots);
	$trialquery->bindParam(":probeTracked", $probeTracked);
	$trialquery->bindParam(":response", $response);
	$trialquery->bindParam(":correct", $correct);
	$trialquery->bindParam(":rt", $rt);	  
	$trialquery->bindParam(":pxperdeg", $pxperdeg);	 
	
	//execute query
	if ($trialquery->execute()) {
		$message = "Trial successfully added.";
	}
	else {
		$message = print_r($bdd->errorInfo());
	}
 	
 	//close connection to database
 	unset($bdd);
}
//only used for debugging
//exit($message);

?>
