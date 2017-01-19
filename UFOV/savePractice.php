<?php
/* UFOV/savePractice.php:
 * Saves the practice trial data of the UFOV task to the database.
 * Data is passed from UFOV/practicecode.js
 */

session_start(); //get the current SESSION variables
$message = "default"; //stores status message for success/failure of adding to the database (used for debugging)

//checks if the variables were sent
if (isset($_SESSION["sid"], $_SESSION["task"], $_POST["trial"], $_POST["duration"], $_POST["actualDuration"], $_POST["cStim"], $_POST["cResp"], $_POST["cRT"], $_POST["cCorrect"], 
	$_POST["pPos"], $_POST["pTargetX"], $_POST["pTargetY"], $_POST["pResp"], $_POST["pX"], $_POST["pY"], $_POST["pRT"], $_POST["pCorrect"], 
	$_POST["trialStart"], $_POST["trialType"], $_POST["pxperdeg"], $_POST["localsec"]) ) {

	//store values sent
	$sid = $_SESSION["sid"]; //subject ID (the number assigned when the subject logged in)
	$trial = $_POST["trial"]; //current trial number
	$duration = $_POST["duration"]; //planned duration of stimulus presentation
	$actualDuration = $_POST["actualDuration"]; //actual duration that occurred during the trial
	$cStim = $_POST["cStim"]; //which center target was presented
	$cResp = $_POST["cResp"]; //what the subject's response was to the center target
	$cRT = $_POST["cRT"]; //subject's response time for the center target
	$cCorrect = $_POST["cCorrect"]; //if the subject was correct for the center target
	$pPos = $_POST["pPos"]; //where the peripheral target was presented
	$pTargetX = $_POST["pTargetX"]; //the corresponding x-coordinate on the canvas for the peripheral target location
	$pTargetY = $_POST["pTargetY"]; //the corresponding y-coordinate on the canvas for the peripheral target location
	$pResp = $_POST["pResp"]; //which section of the circle the subject selected as where they saw the peripheral target
	$pX = $_POST["pX"]; //the corresponding x-coordinate where the subject clicked for their peripheral target response
	$pY = $_POST["pY"]; //the corresponding y-coordinate where the subject clicked for their peripheral target response
	$pRT = $_POST["pRT"]; //subject's response time for the peripheral target location
	$pCorrect = $_POST["pCorrect"]; //if the subject was correct for the peripheral target location
	$trialStart = $_POST["trialStart"]; //when the trial started
	$trialType = $_POST["trialType"]; //which practice mode the subject was in
	$pxperdeg = $_POST["pxperdeg"]; //the pixels per degree used for determining stimuli size
	$localsec = $_POST["localsec"]; //the subject's current local time


	//initiate connection to the database using the login credentials in connectToDB.php
	try {
		include('../php_utils/connectToDB.php'); 
	} catch (Exception $e){
		die('Error : ' . $e -> getMessage());
	}

	//change time to time string
	$localtime = date('Y-m-d H:i:s', $localsec);
	
	//add trial data to the ufov practice table
	$trialquery = $bdd->prepare("INSERT INTO ufovpractice (sid, time, loctime, trial, trialStart, trialType, duration, actualDuration, cStim, cResp, cRT, cCorrect, pPos, pTargetX, pTargetY, pResp, pX, pY, pRT, pCorrect, pxperdeg) " .
  			"VALUES (:sid,NOW(),:loctime,:trial,:trialStart,:trialType,:duration,:actualDuration,:cStim,:cResp,:cRT,:cCorrect,:pPos,:pTargetX,:pTargetY,:pResp,:pX,:pY,:pRT,:pCorrect, :pxperdeg)");
	
	//setup parameters	
	$trialquery->bindParam(":sid", $sid);
	$trialquery->bindParam(":loctime", $localtime);
	$trialquery->bindParam(":trial", $trial);
	$trialquery->bindParam(":trialStart", $trialStart);
	$trialquery->bindParam(":trialType", $trialType);
	$trialquery->bindParam(":duration", $duration);
	$trialquery->bindParam(":actualDuration", $actualDuration);
	$trialquery->bindParam(":cStim", $cStim);
	$trialquery->bindParam(":cResp", $cResp);
	$trialquery->bindParam(":cRT", $cRT);
	$trialquery->bindParam(":cCorrect", $cCorrect);
	$trialquery->bindParam(":pPos", $pPos);
	$trialquery->bindParam(":pTargetX", $pTargetX);
	$trialquery->bindParam(":pTargetY", $pTargetY);
	$trialquery->bindParam(":pResp", $pResp);
	$trialquery->bindParam(":pX", $pX);
	$trialquery->bindParam(":pY", $pY);
	$trialquery->bindParam(":pRT", $pRT);
	$trialquery->bindParam(":pCorrect", $pCorrect);
	$trialquery->bindParam(":pxperdeg", $pxperdeg);
		  
	//execute query
	if ($trialquery->execute()) {
		$message = "Trial successfully added.";
	}
	else {
		$message = print_r($trialquery->errorInfo());
	}
 	
 	//close connection to database
 	unset($bdd);
}
//not used for debugging
//exit($message);
?>