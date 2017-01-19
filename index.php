<?php
/* index.php:
 * This is the landing page for the experiment. Here the subject logs in.
 * Once the system verifies the username, the page reloads to display links to
 * both the Multiple Object Tracking (MOT) task and the Useful Field of View (UFOV) task,
 * as well as an additional link to a pre-determined task chosen for the subject -- this
 * is for ensuring a counterbalanced order, as the order of the tasks (MOT then UFOV or
 * UFOV then MOT) is determined based on if the subject is an even or odd numbered subject.
 * NOTE: This does NOT have anything to do with their username; instead, it is determined by
 * when they were added to the database.
 */

session_start(); //start a PHP session, or continue a current PHP session (keeping any current SESSION variables)


//default values for session information
$task="none";
$message="default";
$loggedin = false;

//check what next task needs to be completed
// will only assign a task if the subject is first logged in
if (isset($_SESSION["sid"]) && $_SESSION["sid"] != -1) {
	$loggedin = true;

	//check what row ID in the database table the subject has to determine
	// what task to start them with first
	if ($_SESSION["sid"] % 2 == 0) {
		$task = "mot"; // if an even number, start with MOT
	}
	else {
		$task = "ufov"; //else if odd, then start with UFOV
	}
}

?>

<!DOCTYPE html>

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
	<title>Cognitive Research Studies</title>
	
	<!-- CSS styling -->
	<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/themes/black-tie/jquery-ui.css"
		type="text/css" rel="stylesheet" />
	<link href="style.css" type="text/css" rel="stylesheet" />
	
	<!-- JS libraries -->
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>

	<!-- additional JS script for controlling page -->
	<script type="text/javascript" src="login.js"></script>
</head>

<body>
<div id="content" class="ui-widget ui-widget-content ui-corner-all">
<?php
// This set of php code checks if there was any returned error code after checking the username (via checkid.php).
// if so, based on the error code, it displays the relevant error message.
if (isset($_REQUEST["error"])) { ?>
<div id="error">
	<?php if ($_REQUEST["error"] == 1 && isset($_SESSION["username"])) { ?>
	<p>The username "<?php echo $_SESSION["username"]; ?>" was not found. Please check for any typos.</p>
	<?php } else if ($_REQUEST["error"] == 2 && isset($_SESSION["username"])) { ?>
	<p>The username "<?php echo $_SESSION["username"]; ?>" is already in use. Please select a different username.</p>
	<?php } else if ($_REQUEST["error"] == "calibration") { ?>
	<p>Please login before calibrating your screen.</p>
	<?php } else { ?>
	<p>Error logging in. Please try again. If you continue to have trouble, please contact us.</p>
	<?php } ?>
	</div>
<?php }  ?>

<?php 
// If the subject has successfully logged in, this will then display the available tasks for them to complete.
if ($loggedin) { ?>
	<p>Please choose the experiment you would like to participate in:</p>
	<ul>
	<li><a href="./Calibration/?task=ufov">Useful Field of View</a></li>
	<li><a href="./Calibration/?task=mot">Multiple Object Tracking</a></li>
	</ul>
	<p><a href="<?php echo "./Calibration/?task=" . $task ?>">Or start the task you have been automatically assigned to.</a></p>
<?php
// Else if the subject hasn't logged in yet, the experiment description is given and they choose their
// username in order to participate.
} else { ?>
	<p class="small-text">Data from this assignment are being used for educational research purposes. 
	Please refrain from disclosing any identifiable information in this assignment. 
	Any identifiable information will be excluded from use in educational research purposes. 
	All data from minors will be excluded from use in educational research purposes. 
	</p>

	<!-- Here is where you will need to include any potential consent form needed. For this example,
	our consent form was stored in the /docs/ directory, but this location can be changed to anything.
	<p class="small-text">
	By participating in this assignment, you agree to the following consent form:</br>
	<a href="./docs/Information_Letter.pdf" target="_blank">[Read the Consent Form]</a>
	</p>
	<br/>
	-->

	<!-- Here is where the user inputs their username. This ID, the subject's current local time,
	and potentially an already assigned task name is sent to the PHP script checkid.php.
	The subject can select whether they are a new user or if they are returning in order to complete
	all the tasks that are part of this experiment.
	-->
	<p>Please input your username:</p>
	<form id="username-form" name="username-form" method="post" action="checkid.php">
	Username: <input type="text" id="username" name="username"> 
	<input type="hidden" id="userType" name="userType" value="NA">
	<input type="hidden" id="localsec" name="localsec">
	<br/><br/>
	<button type="button" id="newUserButton" value="newUser">New User</button> <button type="button" id="loginButton" value="returningUser">Returning User</button>
	</form>
	<p class="small-text">By logging in, I affirm that I am above the age of 18.</p>
	<canvas width="1" height="1">


	<!-- This code here checks to make sure the subject is using a browser that supports the HTML5 canvas, which
	is used to displaying the stimuli in the tasks. If their browser does not support the HTML5 canvas, 
	this error message appears and suggests how they can update their browser.
	-->
	<p><strong>NOTE:</strong> If you see this message, your browser does not support the HTML5 canvas element. 
	Please update your browser to the latest version so that you can participate in these studies!</p>
	<p>Common Browsers:
	<ul>
	<li><a href="https://www.google.com/intl/en/chrome/browser/">Google Chrome</a></li>
	<li><a href="http://www.mozilla.org/en-US/firefox/update/">Mozilla Firefox</a></li>
	</ul>
	</p>
	</canvas>



<?php } ?>
</div>
</body>
</html>