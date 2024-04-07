var loggedInUserName;
var clickedOnUser;
//@author Florian Bruderer

// Here we handle stuff when the page is being loaded
$(document).ready(
	function() {

		// Hide unused Panels on page load

		$("#userDetailsPanel").hide();
		$("#createUserPanel").hide();
		$("#listUsersPanel").hide();
		$("#myAccountPanel").hide();
		$("#homePanel").show();

		// Here we access the logged in User and logged in userID
		document.getElementById("welcomepara").innerHTML = "Welcome: "
			+ sessionStorage.getItem("loggedInUserName");

		// Will trigger passwordChangeButton on enter pressed
		if (document.getElementById("repeatNewAdminPassword") != null) {
			var inputText = document.getElementById("repeatNewAdminPassword");
			inputText.addEventListener("keyup", function(event) {
				if (event.keyCode === 13) {
					event.preventDefault();
					document.getElementById("changeAdminPasswordButton").click();
					return false; // return false so other buttons cant be
					// triggered
				}
			});
		}
	});



/*
 * the following "showPanel" methods are called from the admin side bar with
 * hrefs -> adminMainView.html
 */

// Here we change to the inner HTML manage user
function showManageUsersPanel() {
	$("#userDetailsPanel").hide();
	$("#createUserPanel").hide();
	$("#homePanel").hide();
	$("#myAccountPanel").hide();
	$("#listUsersPanel").show();

	// Here we call get users to put them in a table
	$.ajax({
		type: "GET",
		url: "/api/user/users",
		success: function(users) {


			handleUserlistReply(users);
		}
	});

}
// Here we change to the inner HTML admin Home
function showHomePanel() {
	$("#userDetailsPanel").hide();
	$("#createUserPanel").hide();
	$("#listUsersPanel").hide();
	$("#myAccountPanel").hide();
	$("#homePanel").show();
}
// Here we change to the inner HTML create an new user
function showCreateUserPanel() {
	$("#userDetailsPanel").hide();
	$("#listUsersPanel").hide();
	$("#homePanel").hide();
	$("#myAccountPanel").hide();
	$("#createUserPanel").show();
}

// Here we change to the inner HTML admin my account
function showMyAccountPanel() {
	$("#userDetailsPanel").hide();
	$("#listUsersPanel").hide();
	$("#homePanel").hide();
	$("#createUserPanel").hide();
	$("#changePasswordPanel").hide();
	$("#myAccountPanel").show();

}
// here we show the password change form
function showChangePasswordPanel() {
	$("#userDetailsPanel").hide();
	$("#changePasswordPanel").show();

}
// here we hide the password change form
function cancelPasswordChange() {
	$("#userDetailsPanel").hide();
	$("#changePasswordPanel").hide();


}

// here we show user details
function showUserDetails(userID) {

	setUpUserDetailPage(userID);
	$("#listUsersPanel").hide();
	$("#changeUserNamePanel").hide();
	$("#userDetailsPanel").show();

}

function showChangeUserName() {

	$("#changeUserNamePanel").show();


}

/*
 * Change Panel Methods end here
 */


//Here we change an Username
function changeUserName() {

	if (document.getElementById("newUserNameText").value.length === 0) {

		if (sessionStorage.getItem("language") == "german") {
			alert("Neuen Benutzernamen eingeben")
		} else {
			alert("Enter a new username")
		}

		return;
	}

	$.ajax({
		type: "PUT",
		url: "/api/user/update/name/" + sessionStorage.getItem("changedUserID"),
		data: JSON.stringify({ userName: document.getElementById("newUserNameText").value }),
		success: function(data) {
			if (data == true) {
				alert("UserName changed");
				$("#changeUserNamePanel").hide();
			} else {
				alert("Cannot Change UserName");
			}
		},
		dataType: 'json',
		contentType: 'application/json'
	});


}


//Here we rest a password from an user
function resetUserPassword() {

	$.ajax({
		type: "PUT",
		url: "/api/user/reset/password/" + sessionStorage.getItem("changedUserID"),
		success: function(data) {
			if (data == true) {
				if (sessionStorage.getItem("language") == "german") {
					alert("Password wurde auf \"password\" zurückgesetzt.\Bitte so schnell wie möglich ändern")
				} else {
					alert("Password has been restet to \"password\"\nPlease change it as soon as possible");
				}
			} else {
				if (sessionStorage.getItem("language") == "german") {
					alert("Passwort kann nicht zurückgesetzt werden")
				} else {
					alert("Password cannot be reseted")
				}
			}
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}


//Here we get some details about the picked Username from the table 
function setUpUserDetailPage(userID) {

	$.ajax({
		type: "GET",
		url: "/api/user/id/" + userID,
		success: function(user) {
			document.getElementById("pickedUserNameParagraph").innerHTML = "You will edit: "
				+ user['userName'];
			sessionStorage.setItem("changedUserID", userID);

		}
	});



}

//@author Florian Bruderer
// Here we create new users
function createUser() {

	var department = document.getElementById('departmentDropDown').value;
	var userName = document.getElementById('createUserNameField').value;
	var userPassword = document.getElementById('createUserPasswordField').value;
	var userPasswordRepeat = document
		.getElementById('createUserPasswordRepeatField').value;

	var userType;
	var employmentType;

	if (document.getElementById('userRadio').checked) {
		userType = "ROLE_USER"
	}
	if (document.getElementById('supervisorRadio').checked) {
		userType = "ROLE_HEAD"
	}
	if (document.getElementById('adminRadio').checked) {
		userType = "ROLE_ADMIN"
	}

	if (document.getElementById('fullTimeRadio').checked) {
		employmentType = "FULLTIME"
	}
	if (document.getElementById('partTimeRadio').checked) {
		employmentType = "PARTTIME"
	}


	if (department.length == 0) {
		if (sessionStorage.getItem("language") == "english") {
			alert("Enter a Department")
		} else {
			alert("Abteilung eingeben")
		}

		return;

	} else if (userName.length == 0) {
		if (sessionStorage.getItem("language") == "english") {
			alert("Enter an username")
		} else {
			alert("Benutzernamen eingeben")
		}

		return;
	} else if (userPassword.length < 8) {
		if (sessionStorage.getItem("language") == "english") {
			alert("Password must be 8 or more characters")
		} else {
			alert("Passwort muss mindestens 8 Zeichen enthalten")
		}
		return;
	}


	if (userPassword !== userPasswordRepeat) {
		if (sessionStorage.getItem("language") == "english") {
			alert("Passwords don't match")
		} else {
			alert("Passwörter stimmen nicht überein")
		}
		return;
	}

	$.ajax({
		async: false,
		type: "POST",
		url: "/api/user/createUser/",
		data: JSON.stringify({
			userName: userName,
			userPassword: userPassword,
			department: department,
			userType: userType,
			employmentType: employmentType
		}),
		success: function(data) {

			if (data) {
				alert("New User created")
				document.getElementById('createUserNameField').value = "";
				document.getElementById('createUserPasswordField').value = "";
				document.getElementById('createUserPasswordRepeatField').value = "";
				showManageUsersPanel();
			} else {
					if (sessionStorage.getItem("language") == "english") {
			alert("Failed, user already exists\nOr Passowrd is too short\nPassword must be longer than 8 characters")
		} else {
			alert("Fehlgeschlagen, Benutzer existiert bereits oder Passwort ist zu kurz (muss mindestens 8 Zeichen enthalten) ")
		}
				
				
			}

		},
		dataType: 'json',
		contentType: 'application/json'
	});

}


/*
 * Following methods are for fill up a table with registerd users
 */

// Here we handle the reply when we get the user List
function handleUserlistReply(users) {

	$("#tblUserList tbody").empty();

	for (let user of users) {
		addUserToList(user);
	}
}

//@author Florian Bruderer
// Here we add Users to the user Table
// We call showUserDetails(userName) when clicked on an username
function addUserToList(user) {

	var newRow = "<tr>";
	newRow += "<td><a href=\"" + "javascript:showUserDetails(" + user['id'] + ")" + "\">" + user['userName'] + "</a></td>";
	newRow += "<td>" + user['id'] + "</td>";

	if (user['userType'] === "ROLE_ADMIN") {
		newRow += "<td>" + "Administrator" + "</td>";
	} else if (user['userType'] === "ROLE_HEAD") {
		if (sessionStorage.getItem("language") == "english") {
			newRow += "<td>" + "Supervisor" + "</td>";
		} else {
			newRow += "<td>" + "Vorgesetzter" + "</td>";
		}

	} else {

		if (sessionStorage.getItem("language") == "english") {
			newRow += "<td>" + "User" + "</td>";
		} else {
			newRow += "<td>" + "Benutzer" + "</td>";
		}

	}

	if (user['department'] == null) {
		newRow += "<td>" + "-" + "</td>";
	} else {
		newRow += "<td>" + user['department']['name'] + "</td>";
	}

	newRow += "</tr>";

	$("#tblUserList tbody").append(newRow);

}



//@author Florian Bruderer
// here we can set filters for the user list
function applyFilter() {
	var filter = $("#inputFilterUsers").val();
	var counter = 0;
	$.ajax({
		async: false,
		type: "GET",
		url: "/api/user/users",
		success: function(users) {

			for (let user of users) {

				if (user['userName'] === filter) {
					$("#tblUserList tbody").empty();
					addUserToList(user);
					counter++;
				}
			}
			if (filter === "") {
				alert("Enter an User");
				$.ajax({
					type: "GET",
					url: "/api/user/users",
					success: function(users) {

						handleUserlistReply(users);
					}
				});

			} else if (counter === 0) {
				alert("User not found");
				$("#inputFilterUsers").val("");
				$.ajax({
					type: "GET",
					url: "/api/user/users",
					success: function(users) {
						;

						handleUserlistReply(users);
					}
				});
			}
			counter = 0;
		}
	});

}
/*
 * Methods for user table end here
 */

/*
 * Admin Crud Methods start here
 */
// here we change the admin password
function changeAdminPassword() {

	var oldPassword;
	var newPassword = document.getElementById('newAdminPassword').value;
	var repeatNewPassword = document.getElementById('repeatNewAdminPassword').value;


	$.ajax({
		async: false,
		type: "GET",
		url: "/api/user/id/" + sessionStorage.getItem("loggedInUserId"),
		success: function(user) {
			oldPassword = user.userPassword;
		}
	});

	if (document.getElementById('oldAdminPassword').value != oldPassword) {

		if (sessionStorage.getItem("language") == "english") {
			alert("Old password is wrong")
		} else {
			alert("Altes Passwort stimmt nicht")
		}

		return;
	}

	if (!(newPassword === repeatNewPassword)) {
		if (sessionStorage.getItem("language") == "english") {
			alert("Passwords don't match")
		} else {
			alert("Passwörter stimmen nicht überein")
		}
		return;
	}

	$.ajax({
		async: false,
		type: "PUT",
		url: "/api/user/update/password/" + sessionStorage.getItem("loggedInUserId"),
		data: JSON.stringify({ userName: sessionStorage.getItem("loggedInUserName"), userPassword: newPassword }),
		success: function(data) {
			if (data == true) {

				if (sessionStorage.getItem("language") == "english") {
					alert("Password changed");
				} else {
					alert("Passwort wurde geändert");
				}
				showMyAccountPanel();

			} else {
				if (sessionStorage.getItem("language") == "english") {
					alert("Password cannot be changed");
				} else {
					alert("Passwort has been changed");
				}
			}
		},
		dataType: 'json',
		contentType: 'application/json'
	});

}

function deleteUser() {

	if (sessionStorage.getItem("changedUserID") === sessionStorage.getItem("loggedInUserId")) {

		if (sessionStorage.getItem("language") == "german") {
			alert("Eigenes Konto kann nicht gelöscht werden")
		} else {
			alert("Own account cannot be deleted")
		}
		return;
	}

	$.ajax({
		async: false,
		type: "DELETE",
		url: "/api/user/" + sessionStorage.getItem("changedUserID"),
		success: function(data) {
			if (data === true) {
				if (sessionStorage.getItem("language") == "german") {
					alert("Benutzer wurde gelöscht")
				} else {
					alert("User has been deleted")
				}



			} else {
				if (sessionStorage.getItem("language") == "german") {
					alert("Benutzer kann nicht gelöscht werden")
				} else {
					alert("User cannot be deleted")
				}
			}

		},
		dataType: 'json',
		contentType: 'application/json'
	});

	showManageUsersPanel();
}

/*
 * Admin Crud Methods end here
 */


