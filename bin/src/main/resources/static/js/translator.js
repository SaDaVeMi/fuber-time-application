
//@author Florian Bruderer & Timo Herrmann

//Translator class for german and english

//get the chosen langed on pageloadup. and translate all elemtes
$(document).ready(
	function() {

		//If the session storage is null, we prepare an empty String
		if (sessionStorage.getItem("language") === null) {
			sessionStorage.setItem("language", "");

		}
		//Load the Choosen language and refresh all Strings
		if (sessionStorage.getItem("language").length > 1) {
			loadChoosenLanguage("languages", sessionStorage.getItem("language"));
			translateLanguage(document.getElementById("languages").value);
		} else {
			//Set default english
			loadChoosenLanguage("languages", "english");
			translateLanguage(document.getElementById("languages").value);
		}

	});

//Add here all Elements you want to Translate if = German, else = english
//Becuase all Pages uses this Script, each element has a if != null statment. To prevent the code from crashing
function translateLanguage(value) {

	//German goes here
	if (value == "german") {

		if (document.getElementById("goToLogin") != null) {
			document.getElementById("goToLogin").innerHTML = "Einloggen"
		}

		if (document.getElementById("signInPara") != null) {
			document.getElementById("signInPara").innerHTML = "Einloggen"
		}

		if (document.getElementById("username") != null) {
			document.getElementById("username").placeholder = "Namen eingeben"
		}

		if (document.getElementById("userpassword") != null) {
			document.getElementById("userpassword").placeholder = "Passwort eingeben"
		}

		if (document.getElementById("userLoginButton") != null) {
			document.getElementById("userLoginButton").innerHTML = "Einloggen"
		}

		if (document.getElementById("goHomeLink") != null) {
			document.getElementById("goHomeLink").innerHTML = "Startseite"
		}

		if (document.getElementById("adminHomeHref") != null) {
			document.getElementById("adminHomeHref").innerHTML = "<i class=\"fa fa-fw fa-home\"></i>" + "Startseite"
		}

		if (document.getElementById("adminCreateUserHref") != null) {
			document.getElementById("adminCreateUserHref").innerHTML = "<i class=\"fa fa-fw fa-plus\"></i>" + "Benutzer erstellen"
		}

		if (document.getElementById("adminManageUserHref") != null) {
			document.getElementById("adminManageUserHref").innerHTML = "<i class=\"fa fa-fw fa-wrench\"></i>" + "Benutzer verwalten"
		}

		if (document.getElementById("adminMyAccountHref") != null) {
			document.getElementById("adminMyAccountHref").innerHTML = "<i class=\"fa fa-fw fa-user\"></i>" + "Mein Konto"
		}

		if (document.getElementById("adminLogoutHref") != null) {
			document.getElementById("adminLogoutHref").innerHTML = "<i class=\"fa fa-fw fa-sign-out\"></i>" + "Ausloggen"
		}

		if (document.getElementById("createUserHeadLine") != null) {
			document.getElementById("createUserHeadLine").innerHTML = "Neuen Benutzer erstellen"
		}

		if (document.getElementById("createUserPara") != null) {
			document.getElementById("createUserPara").innerHTML = "Bitte füllen sie folgendes Formular aus um einen Benutzer zu erstellen."
		}

		if (document.getElementById("createUserNameLabel") != null) {
			document.getElementById("createUserNameLabel").innerHTML = "Benutzername: "
		}

		if (document.getElementById("createUserNameField") != null) {
			document.getElementById("createUserNameField").placeholder = "Benutzername..."
		}

		if (document.getElementById("createUserPasswordLabel") != null) {
			document.getElementById("createUserPasswordLabel").innerHTML = "Passwort: "
		}

		if (document.getElementById("createUserPasswordField") != null) {
			document.getElementById("createUserPasswordField").placeholder = "Passwort..."
		}

		if (document.getElementById("createUserPasswordRepeatLabel") != null) {
			document.getElementById("createUserPasswordRepeatLabel").innerHTML = "Passwort wiederholen: "
		}

		if (document.getElementById("createUserPasswordRepeatField") != null) {
			document.getElementById("createUserPasswordRepeatField").placeholder = "Passwort wiederholen..."
		}

		if (document.getElementById("createNewUserButton") != null) {
			document.getElementById("createNewUserButton").innerHTML = "Registrieren"
		}

		if (document.getElementById("createUserDepartmentLabel") != null) {
			document.getElementById("createUserDepartmentLabel").innerHTML = "Abteilung: "
		}

		if (document.getElementById("createUserDeparmentField") != null) {
			document.getElementById("createUserDeparmentField").placeholder = "Abteilung..."
		}

		if (document.getElementById("createUserTypeLabel") != null) {
			document.getElementById("createUserTypeLabel").innerHTML = "Benutzertyp: "
		}
		if (document.getElementById("userRadioLabel") != null) {
			document.getElementById("userRadioLabel").innerHTML = "Benutzer"
		}
		if (document.getElementById("supervisorRadioLabel") != null) {
			document.getElementById("supervisorRadioLabel").innerHTML = "Vorgesetzter"
		}
		if (document.getElementById("adminRadioLabel") != null) {
			document.getElementById("adminRadioLabel").innerHTML = "Administrator"
		}

		if (document.getElementById("userClockHref") != null) {
			document.getElementById("userClockHref").innerHTML = "<i class=\"fa fa-fw fa-clock-o\"></i>" + "Zeit Service"
		}

		if (document.getElementById("userWorkedHoursHref") != null) {
			document.getElementById("userWorkedHoursHref").innerHTML = "<i class=\"fa fa-fw fa-table\"></i>" + "Meine Arbeitszeit"
		}

		if (document.getElementById("userMyAccountHref") != null) {
			document.getElementById("userMyAccountHref").innerHTML = "<i class=\"fa fa-fw fa-user\"></i>" + "Mein Account"
		}

		if (document.getElementById("userLogoutHref") != null) {
			document.getElementById("userLogoutHref").innerHTML = "<i class=\"fa fa-fw fa-sign-out\"></i>" + "Ausloggen"
		}

		if (document.getElementById("userclockinbtn") != null) {
			document.getElementById("userclockinbtn").value = "Kommen"
		}

		if (document.getElementById("userclockoutbtn") != null) {
			document.getElementById("userclockoutbtn").value = "Gehen"
		}

		if (document.getElementById("detailedHistoryBtn") != null) {
			document.getElementById("detailedHistoryBtn").innerHTML = "Detailierter Verlauf"
		}

		if (document.getElementById("timeScheduleBtn") != null) {
			document.getElementById("timeScheduleBtn").innerHTML = "Soll-Ist"
		}


		if (document.getElementById("headRequestsHref") != null) {
			document.getElementById("headRequestsHref").innerHTML = "<i class=\"fa fa-fw fa-bell\"></i>" + "Offene Anfragen"
		}


		if (document.getElementById("partTimeLabel") != null) {
			document.getElementById("partTimeLabel").innerHTML = "Vollzeit"
		}

		if (document.getElementById("fullTimeLabel") != null) {
			document.getElementById("fullTimeLabel").innerHTML = "Teilzeit"
		}

		if (document.getElementById("employmentTypeLabel") != null) {
			document.getElementById("employmentTypeLabel").innerHTML = "Anstellungsgrad:"
		}

		if (document.getElementById("adminMyAccountTile") != null) {
			document.getElementById("adminMyAccountTile").innerHTML = "Mein Konto"
		}

		if (document.getElementById("adminMyAccountSubtitle") != null) {
			document.getElementById("adminMyAccountSubtitle").innerHTML = "Bearbeiten sie ihr Konto hier"
		}

		if (document.getElementById("adminPasswordChangeButton") != null) {
			document.getElementById("adminPasswordChangeButton").innerHTML = "Passwort ändern"
		}

		if (document.getElementById("adminOldPasswordLabel") != null) {
			document.getElementById("adminOldPasswordLabel").innerHTML = "Altes Passwort"
		}

		if (document.getElementById("adminNewPasswordLabel") != null) {
			document.getElementById("adminNewPasswordLabel").innerHTML = "Neues Passwort"
		}

		if (document.getElementById("adminRepeatNewPasswordLabel") != null) {
			document.getElementById("adminRepeatNewPasswordLabel").innerHTML = "Passwort wiederholen"
		}

		if (document.getElementById("adminMyAccountSubtitleChangePassword") != null) {
			document.getElementById("adminMyAccountSubtitleChangePassword").innerHTML = "Passwort ändern"
		}


		if (document.getElementById("changeAdminPasswordButton") != null) {
			document.getElementById("changeAdminPasswordButton").value = "Passwort ändern"
		}

		if (document.getElementById("changeAdminPasswordCancelButton") != null) {
			document.getElementById("changeAdminPasswordCancelButton").value = "Abbrechen"
		}

		if (document.getElementById("adminMyAccountSubtitleChangePassword") != null) {
			document.getElementById("adminMyAccountSubtitleChangePassword").innerHTML = "Passwort ändern"
		}

		if (document.getElementById("changeUserPasswordCancelButton") != null) {
			document.getElementById("changeUserPasswordCancelButton").value = "Abbrechen"
		}

		if (document.getElementById("changeUserPasswordButton") != null) {
			document.getElementById("changeUserPasswordButton").value = "Passwort ändern"
		}

		if (document.getElementById("userPasswordChangeButton") != null) {
			document.getElementById("userPasswordChangeButton").innerHTML = "Passwort ändern"
		}

		if (document.getElementById("myWorkTimeHeader") != null) {
			document.getElementById("myWorkTimeHeader").innerHTML = "Meine Arbeitszeit"
		}

		if (document.getElementById("workBalanceBtn") != null) {
			document.getElementById("workBalanceBtn").innerHTML = "Zeitsaldo"
		}

		if (document.getElementById("showTimeBalanceText") != null) {
			document.getElementById("showTimeBalanceText").innerHTML = "Totale Arbeitszeit: "
		}

		if (document.getElementById("requestHeader") != null) {
			document.getElementById("requestHeader").innerHTML = "Offene Anfragen"
		}

		if (document.getElementById("userRequestHref") != null) {
			document.getElementById("userRequestHref").innerHTML = "<i class=\"fa fa-fw fa-bed\"></i>" + "Absenzanfrage"
		}

		if (document.getElementById("userLogoutHrefabc") != null) {
			document.getElementById("userLogoutHrefabc").innerHTML = "<i class=\"fa fa-fw fa-bed\"></i>" + "Ferien Anfrage"
		}

		if (document.getElementById("userPasswordForgotButton") != null) {
			document.getElementById("userPasswordForgotButton").value = "Passwort vergessen?"
		}


		if (document.getElementById("welcomeParaAdmin") != null) {
			document.getElementById("welcomeParaAdmin").innerHTML = "Willkommen Administrator"
		}

		if (document.getElementById("titleh1MangaeUserAdmin") != null) {
			document.getElementById("titleh1MangaeUserAdmin").innerHTML = "Benutzer verwalten"
		}

		if (document.getElementById("title_td_columnType") != null) {
			document.getElementById("title_td_columnType").innerHTML = "Benutzertyp"
		}

		if (document.getElementById("title_td_columnDepartment") != null) {
			document.getElementById("title_td_columnDepartment").innerHTML = "Abteilung"
		}

		if (document.getElementById("titleVacationRequest") != null) {
			document.getElementById("titleVacationRequest").innerHTML = "Absenz anfragen"
		}

		if (document.getElementById("requestStartDate") != null) {
			document.getElementById("requestStartDate").innerHTML = "Startdatum"
		}

		if (document.getElementById("requestEndDate") != null) {
			document.getElementById("requestEndDate").innerHTML = "Enddatum"
		}

		if (document.getElementById("unplannedAbsence") != null) {
			document.getElementById("unplannedAbsence").innerHTML = "Ungeplante Absenz"
		}

		if (document.getElementById("plannedAbsence") != null) {
			document.getElementById("plannedAbsence").innerHTML = "Geplante Absenz"
		}
		
		if (document.getElementById("sendRequest") != null) {
			document.getElementById("sendRequest").value = "Anfrage senden"
		}





		//English goes here
	} else {

		if (document.getElementById("goToLogin") != null) {
			document.getElementById("goToLogin").innerHTML = "Sign in"
		}

		if (document.getElementById("signInPara") != null) {
			document.getElementById("signInPara").innerHTML = "Sign in"
		}

		if (document.getElementById("username") != null) {
			document.getElementById("username").placeholder = "Enter Username"
		}

		if (document.getElementById("userpassword") != null) {
			document.getElementById("userpassword").placeholder = "Enter Password"
		}

		if (document.getElementById("userLoginButton") != null) {
			document.getElementById("userLoginButton").innerHTML = "Login"
		}

		if (document.getElementById("goHomeLink") != null) {
			document.getElementById("goHomeLink").innerHTML = "Home"
		}

		if (document.getElementById("adminHomeHref") != null) {
			document.getElementById("adminHomeHref").innerHTML = "<i class=\"fa fa-fw fa-home\"></i>" + "Home"
		}

		if (document.getElementById("adminCreateUserHref") != null) {
			document.getElementById("adminCreateUserHref").innerHTML = "<i class=\"fa fa-fw fa-plus\"></i>" + "Create Account"
		}

		if (document.getElementById("adminManageUserHref") != null) {
			document.getElementById("adminManageUserHref").innerHTML = "<i class=\"fa fa-fw fa-wrench\"></i>" + "Manage Users"
		}

		if (document.getElementById("adminMyAccountHref") != null) {
			document.getElementById("adminMyAccountHref").innerHTML = "<i class=\"fa fa-fw fa-user\"></i>" + "My Account"
		}

		if (document.getElementById("adminLogoutHref") != null) {
			document.getElementById("adminLogoutHref").innerHTML = "<i class=\"fa fa-fw fa-sign-out\"></i>" + "Logout"
		}

		if (document.getElementById("createUserHeadLine") != null) {
			document.getElementById("createUserHeadLine").innerHTML = "Create a new User"
		}

		if (document.getElementById("createUserPara") != null) {
			document.getElementById("createUserPara").innerHTML = "Please fill in this form to create a new user account."
		}

		if (document.getElementById("createUserNameLabel") != null) {
			document.getElementById("createUserNameLabel").innerHTML = "Username: "
		}

		if (document.getElementById("createUserNameField") != null) {
			document.getElementById("createUserNameField").placeholder = "Username..."
		}

		if (document.getElementById("createUserPasswordLabel") != null) {
			document.getElementById("createUserPasswordLabel").innerHTML = "Password: "
		}

		if (document.getElementById("createUserPasswordField") != null) {
			document.getElementById("createUserPasswordField").placeholder = "Password..."
		}

		if (document.getElementById("createUserPasswordRepeatLabel") != null) {
			document.getElementById("createUserPasswordRepeatLabel").innerHTML = "Repeat Password: "
		}

		if (document.getElementById("createUserPasswordRepeatField") != null) {
			document.getElementById("createUserPasswordRepeatField").placeholder = "Repeat Password..."
		}

		if (document.getElementById("createNewUserButton") != null) {
			document.getElementById("createNewUserButton").innerHTML = "Register"
		}

		if (document.getElementById("createUserDepartmentLabel") != null) {
			document.getElementById("createUserDepartmentLabel").innerHTML = "Department: "
		}

		if (document.getElementById("createUserDeparmentField") != null) {
			document.getElementById("createUserDeparmentField").placeholder = "Deparement..."
		}

		if (document.getElementById("createUserTypeLabel") != null) {
			document.getElementById("createUserTypeLabel").innerHTML = "Usertype: "
		}
		if (document.getElementById("userRadioLabel") != null) {
			document.getElementById("userRadioLabel").innerHTML = "User"
		}
		if (document.getElementById("supervisorRadioLabel") != null) {
			document.getElementById("supervisorRadioLabel").innerHTML = "Supervisor"
		}
		if (document.getElementById("adminRadioLabel") != null) {
			document.getElementById("adminRadioLabel").innerHTML = "Administrator"
		}

		if (document.getElementById("userClockHref") != null) {
			document.getElementById("userClockHref").innerHTML = "<i class=\"fa fa-fw fa-clock-o\"></i>" + "Time Serivce"
		}

		if (document.getElementById("userWorkedHoursHref") != null) {
			document.getElementById("userWorkedHoursHref").innerHTML = "<i class=\"fa fa-fw fa-table\"></i>" + "My Worked Hours"
		}

		if (document.getElementById("userMyAccountHref") != null) {
			document.getElementById("userMyAccountHref").innerHTML = "<i class=\"fa fa-fw fa-user\"></i>" + "My Account"
		}

		if (document.getElementById("userLogoutHref") != null) {
			document.getElementById("userLogoutHref").innerHTML = "<i class=\"fa fa-fw fa-sign-out\"></i>" + "Logout"
		}

		if (document.getElementById("userclockinbtn") != null) {
			document.getElementById("userclockinbtn").value = "Clock In"
		}

		if (document.getElementById("userclockoutbtn") != null) {
			document.getElementById("userclockoutbtn").value = "Clock Out"
		}

		if (document.getElementById("detailedHistoryBtn") != null) {
			document.getElementById("detailedHistoryBtn").innerHTML = "Detailed History"
		}

		if (document.getElementById("timeScheduleBtn") != null) {
			document.getElementById("timeScheduleBtn").innerHTML = "Time Schedule"
		}

		if (document.getElementById("headRequestsHref") != null) {
			document.getElementById("headRequestsHref").innerHTML = "<i class=\"fa fa-fw fa-bell\"></i>" + "Open Requests"
		}

		if (document.getElementById("partTimeLabel") != null) {
			document.getElementById("partTimeLabel").innerHTML = "Full Time"
		}

		if (document.getElementById("fullTimeLabel") != null) {
			document.getElementById("fullTimeLabel").innerHTML = "Part Time"
		}

		if (document.getElementById("employmentTypeLabel") != null) {
			document.getElementById("employmentTypeLabel").innerHTML = "Employment Type:"
		}

		if (document.getElementById("adminMyAccountTile") != null) {
			document.getElementById("adminMyAccountTile").innerHTML = "My Account"
		}

		if (document.getElementById("adminMyAccountSubtitle") != null) {
			document.getElementById("adminMyAccountSubtitle").innerHTML = "Change your Account settings here"
		}

		if (document.getElementById("adminPasswordChangeButton") != null) {
			document.getElementById("adminPasswordChangeButton").innerHTML = "Change Password"
		}

		if (document.getElementById("adminOldPasswordLabel") != null) {
			document.getElementById("adminOldPasswordLabel").innerHTML = "Old Password"
		}

		if (document.getElementById("adminNewPasswordLabel") != null) {
			document.getElementById("adminNewPasswordLabel").innerHTML = "New Password"
		}

		if (document.getElementById("adminRepeatNewPasswordLabel") != null) {
			document.getElementById("adminRepeatNewPasswordLabel").innerHTML = "Repeat Password"
		}

		if (document.getElementById("changeAdminPasswordButton") != null) {
			document.getElementById("changeAdminPasswordButton").value = "Change Password"
		}

		if (document.getElementById("changeAdminPasswordCancelButton") != null) {
			document.getElementById("changeAdminPasswordCancelButton").value = "Cancle"
		}

		if (document.getElementById("adminMyAccountSubtitleChangePassword") != null) {
			document.getElementById("adminMyAccountSubtitleChangePassword").innerHTML = "Change Password"
		}

		if (document.getElementById("changeUserPasswordCancelButton") != null) {
			document.getElementById("changeUserPasswordCancelButton").value = "Cancel"
		}

		if (document.getElementById("changeUserPasswordButton") != null) {
			document.getElementById("changeUserPasswordButton").value = "Change Password"
		}

		if (document.getElementById("userPasswordChangeButton") != null) {
			document.getElementById("userPasswordChangeButton").innerHTML = "Change Password"
		}

		if (document.getElementById("myWorkTimeHeader") != null) {
			document.getElementById("myWorkTimeHeader").innerHTML = "My Work Times"
		}

		if (document.getElementById("workBalanceBtn") != null) {
			document.getElementById("workBalanceBtn").innerHTML = "Time Balance"
		}

		if (document.getElementById("showTimeBalanceText") != null) {
			document.getElementById("showTimeBalanceText").innerHTML = "Total Working Time: "
		}

		if (document.getElementById("requestHeader") != null) {
			document.getElementById("requestHeader").innerHTML = "Open requests"
		}

		if (document.getElementById("userRequestHref") != null) {
			document.getElementById("userRequestHref").innerHTML = "<i class=\"fa fa-fw fa-bed\"></i>" + "Request Absence"
		}

		if (document.getElementById("userPasswordForgotButton") != null) {
			document.getElementById("userPasswordForgotButton").value = "Forgot password?"
		}

		if (document.getElementById("welcomeParaAdmin") != null) {
			document.getElementById("welcomeParaAdmin").innerHTML = "Welcome Administrator"
		}

		if (document.getElementById("titleh1MangaeUserAdmin") != null) {
			document.getElementById("titleh1MangaeUserAdmin").innerHTML = "Manage Users"
		}

		if (document.getElementById("title_td_columnType") != null) {
			document.getElementById("title_td_columnType").innerHTML = "User type"
		}

		if (document.getElementById("title_td_columnDepartment") != null) {
			document.getElementById("title_td_columnDepartment").innerHTML = "Department"
		}

		if (document.getElementById("titleVacationRequest") != null) {
			document.getElementById("titleVacationRequest").innerHTML = "Request absence"
		}

		if (document.getElementById("requestStartDate") != null) {
			document.getElementById("requestStartDate").innerHTML = "Start date"
		}

		if (document.getElementById("requestEndDate") != null) {
			document.getElementById("requestEndDate").innerHTML = "End date"
		}

		if (document.getElementById("unplannedAbsence") != null) {
			document.getElementById("unplannedAbsence").innerHTML = "Unplanned absence"
		}

		if (document.getElementById("plannedAbsence") != null) {
			document.getElementById("plannedAbsence").innerHTML = "Planned absence"
		}
		
		if (document.getElementById("sendRequest") != null) {
			document.getElementById("sendRequest").value = "Send request"
		}

	}

	sessionStorage.setItem("language", value);

}

//This method loads the choosen language given a html element and its language
function loadChoosenLanguage(id, valueToSelect) {
	let element = document.getElementById(id);
	element.value = valueToSelect;
}


