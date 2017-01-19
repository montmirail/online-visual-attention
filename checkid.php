<?php
/* checkid.php:
 * This checks the entered ID to see if it's a new subject or someone who
 * is returning. The IDs are stored in the 'subjects' table in your database.
 * Once the ID is checked, the username, task name, and the subject ID (i.e., the
 * row number associated with the username) are stored as SESSION variables
 * that are passed between pages to ensure data is saved appropriately.
 */ 

session_start(); //get access to the current session
$_SESSION['sid'] = -1; //stores status message for success/failure of adding to the database

if (isset($_REQUEST["userType"])) {
	$_SESSION["userType"] = $_REQUEST["userType"];
}
else {
	$_SESSION["userType"] = "returningUser";
}

//checks if the username and the current local time of the subject were sent
if (isset($_REQUEST["username"]) && isset($_REQUEST["localsec"])) {
	$_SESSION["username"] = $_REQUEST["username"];
	$localtime = date('Y-m-d H:i:s', $_REQUEST["localsec"]); //reformat the time information

	//initiate connection to the database, based on login credentials in connectToDB.php
	try {
		include('./php_utils/connectToDB.php'); 
	} catch (Exception $e){
		die('Error : ' . $e -> getMessage());
	}

	//retrieve the row number associated with this username
	$existquery = $bdd->prepare("SELECT sid FROM subjects WHERE username=:username");
	$existquery->bindParam(":username", $_SESSION["username"]);
	$existquery->execute();

	// If the username was found in the table, then store the subject ID in a SESSION variable.
	// However, the subject must have selected "Returning User" in order for this to be valid.
	if ($existresult = $existquery->fetch()) {
		if ($_SESSION["userType"] == "returningUser") {
			$_SESSION['sid'] = $existresult['sid'];
		}
	}

	// Otherwise, add this username to the subjects table and then retrieve the new subject ID assigned to it
	// This only is valid if the user selected "New User" when logging in.
	else if ($_SESSION["userType"] == "newUser") {
		$createquery = $bdd->prepare("INSERT INTO subjects (username, creationTime, locTime) VALUES (:username, NOW(), :loctime)");
		$createquery->bindParam(":username", $_SESSION["username"]);
		$createquery->bindParam(':loctime', $localtime);	
		$createquery->execute();

		$_SESSION['sid'] = $bdd->lastInsertId();
	}

	//close connection to the database
	unset($bdd);
	
}

// if the subject ID SESSION varaible was set (that is, they logged in successfully),
// then redirect the subject to new content
if ($_SESSION['sid'] != -1) {
	//reload index page to show the subject the updated content (which provides links to the tasks)
	header('Location: ./index.php');
}

// Otherwise, send back an error code since login was not successful
else {
	// this error indicates that the subject said they were a returning user, but they
	// were not found in the database
	if ($_SESSION["userType"] == "returningUser") {
		header('Location: ./index.php?error=1');
	}

	//this error indicates that the subject said they were a new user, but the username
	//was already found in the database
	else {
		header('Location: ./index.php?error=2');
	}
}

?>