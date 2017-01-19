<?php
/* UFOV/save.php:
 * Saves all the trial data of the full UFOV task to the database.
 * Data is passed from UFOV/code.js
 */

session_start(); //get the current SESSION variables
$message = "default"; //stores status message for success/failure of adding to the database (used for debugging)

//checks if the variables were sent
if (isset($_SESSION["sid"], $_SESSION["task"], $_POST["frames"], $_POST["duration"], $_POST["actualDuration"], $_POST["cStim"], $_POST["cResp"], $_POST["cRT"], $_POST["cCorrect"],
	$_POST["pPos"], $_POST["pTargetX"], $_POST["pTargetY"], $_POST["pResp"], $_POST["pX"], $_POST["pY"], $_POST["pRT"], $_POST["pCorrect"], 
	$_POST["trialStart"], $_POST["reversals"], $_POST["pxperdeg"], $_POST["localsec"]) ) {

	//store values sent, putting the values for each trial into arrays
	$sid = $_SESSION["sid"]; //subject ID (the number assigned when the subject logged in)
	$frames = explode(";", $_POST["frames"]); //number of frames to use for the stimulus presentation duration per trial
	$duration = explode(";", $_POST["duration"]); //planned duration of stimulus presentation
	$actualDuration = explode(";", $_POST["actualDuration"]); //actual duration that occurred during the trial
	$cStim = explode(";", $_POST["cStim"]); //which center target was presented
	$cResp = explode(";", $_POST["cResp"]); //what the subject's response was to the center target
	$cRT = explode(";", $_POST["cRT"]); //subject's response time for the center target
	$cCorrect = explode(";", $_POST["cCorrect"]); //if the subject was correct for the center target
	$pPos = explode(";", $_POST["pPos"]); //where the peripheral target was presented (position 0-7)
	$pTargetX = explode(";", $_POST["pTargetX"]); //the corresponding x-coordinate on the canvas for the peripheral target location
	$pTargetY = explode(";", $_POST["pTargetY"]); //the corresponding y-coordinate on the canvas for the peripheral target location
	$pResp = explode(";", $_POST["pResp"]); //which section of the circle the subject selected as where they saw the peripheral target
	$pX = explode(";", $_POST["pX"]); //the corresponding x-coordinate where the subject clicked for their peripheral target response
	$pY = explode(";", $_POST["pY"]); //the corresponding y-coordinate where the subject clicked for their peripheral target response
	$pRT = explode(";", $_POST["pRT"]); //subject's response time for the peripheral target location
	$pCorrect = explode(";", $_POST["pCorrect"]); //if the subject was correct for the peripheral target location
	$trialStart = explode(";", $_POST["trialStart"]); //when the trial started
	$reversals = explode(";", $_POST["reversals"]); //the number of reversals that had occurred in the staircase
	$pxperdeg = $_POST["pxperdeg"]; //the pixels per degree used for determining stimuli size
	$localsec = $_POST["localsec"]; //the subject's current local time
	
	$numTrials = count($duration); //determine total number of trials

	//initiate connection to the database using the login credentials in connectToDB.php
	try {
		include('../php_utils/connectToDB.php'); 
	} catch (Exception $e){
		die('Error : ' . $e -> getMessage());
	}

	//change time to time string
	$localtime = date('Y-m-d H:i:s', $localsec);
	
	//add trial data to the ufov table
	$trialquery = $bdd->prepare("INSERT INTO ufov (sid, time, loctime, trial, trialStart, frames, duration, actualDuration, cStim, cResp, cRT, cCorrect, pPos, pTargetX, pTargetY, pResp, pX, pY, pRT, pCorrect, reversals, pxperdeg) " .
  			"VALUES (:sid,NOW(),:loctime,:trial,:trialStart,:frames,:duration,:actualDuration,:cStim,:cResp,:cRT,:cCorrect,:pPos,:pTargetX,:pTargetY,:pResp,:pX,:pY,:pRT,:pCorrect,:reversals, :pxperdeg)");
	
	//setup parameters
	$trial_i = -1;
	$trialStart_i = -1;
	$frames_i = -1;
	$duration_i = -1;
	$actualDuration_i = -1;
	$cStim_i = -1;
	$cResp_i = -1;
	$cRT_i = -1;
	$cCorrect_i = -1;
	$pPos_i = -1;
	$pTargetX_i = -1;
	$pTargetY_i = -1;
	$pResp_i = -1;
	$pX_i = -1;
	$pY_i = -1;
	$pRT_i = -1;
	$pCorrect_i = -1;
	$reversals_i = -1;
	
	$trialquery->bindParam(":sid", $sid);
	$trialquery->bindParam(":loctime", $localtime);
	$trialquery->bindParam(":trial", $trial_i);
	$trialquery->bindParam(":trialStart", $trialStart_i);
	$trialquery->bindParam(":frames", $frames_i);
	$trialquery->bindParam(":duration", $duration_i);
	$trialquery->bindParam(":actualDuration", $actualDuration_i);
	$trialquery->bindParam(":cStim", $cStim_i);
	$trialquery->bindParam(":cResp", $cResp_i);
	$trialquery->bindParam(":cRT", $cRT_i);
	$trialquery->bindParam(":cCorrect", $cCorrect_i);
	$trialquery->bindParam(":pPos", $pPos_i);
	$trialquery->bindParam(":pTargetX", $pTargetX_i);
	$trialquery->bindParam(":pTargetY", $pTargetY_i);
	$trialquery->bindParam(":pResp", $pResp_i);
	$trialquery->bindParam(":pX", $pX_i);
	$trialquery->bindParam(":pY", $pY_i);
	$trialquery->bindParam(":pRT", $pRT_i);
	$trialquery->bindParam(":pCorrect", $pCorrect_i);
	$trialquery->bindParam(":reversals", $reversals_i);
	$trialquery->bindParam(":pxperdeg", $pxperdeg);
		  
	for ($i = 0; $i < $numTrials; $i++) {
		$trial_i = $i+1;
		$trialStart_i = $trialStart[$i];
		$frames_i = $frames[$i];
		$duration_i = $duration[$i];
		$actualDuration_i = $actualDuration[$i];
		$cStim_i = $cStim[$i];
		$cResp_i = $cResp[$i];
		$cRT_i = $cRT[$i];
		$cCorrect_i = $cCorrect[$i];
		$pPos_i = $pPos[$i];
		$pTargetX_i = $pTargetX[$i];
		$pTargetY_i = $pTargetY[$i];
		$pResp_i = $pResp[$i];
		$pX_i = $pX[$i];
		$pY_i = $pY[$i];
		$pRT_i = $pRT[$i];
		$pCorrect_i = $pCorrect[$i];
		$reversals_i = $reversals[$i];
		
		//add each trial's data as a separate row in the table
		if ($trialquery->execute()) {
			$message = "Trial successfully added.";
		}
		else {
			$message = print_r($trialquery->errorInfo());
		}
	}  
 	
 	//close connection to database
 	unset($bdd);
}
//only used for debugging
//exit($message);
?>