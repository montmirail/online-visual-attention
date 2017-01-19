/* login.js:
 * A helper script for index.php. Adds callback functions for the login buttons
 * and submits the form information to checkid.php.
 */

 //Make sure the HTML page is ready before adding functionality to the buttons
$(document).ready(init);

//this function initializes all of the button callbacks
function init() {
	//when the user clicks the loginButton, this indicates that the subject 
	//says they are a "returning user"
	$("#loginButton").button(); //style the button using JQuery UI
	$("#loginButton").click(function () {
		loctime = getTime(); //get the user's current local time
		$("#localsec").val(loctime); //set this value in the form on index.php

		$("#userType").val("returningUser"); //mark them as a "returning user"
		$("#username-form").submit(); //then submit the form
	});
	
	//newUserButton indicates that the subject is a new user who has not done
	//any of the tasks in the experiment
	$("#newUserButton").button();
	$("#newUserButton").click(function() {
		loctime = getTime(); //get the user's current local time
		$("#localsec").val(loctime); //set this value in the form on index.php

		$("#userType").val("newUser"); //mark them as a "new user"
		$("#username-form").submit(); //then submit the form
	});
}

// this function gets the current local time of the subject
function getTime() {
	var d = new Date();
	var localsec = Math.round(d.getTime()/1000) - d.getTimezoneOffset()*60;
	return localsec;
}
