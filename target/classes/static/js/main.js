var userName;
var userPassword;
var userId;
var userType;
var employmentType;

$(document).ready(function() {
	// Will trigger LoginButton on enter pressed
	var inputText = document.getElementById("userpassword");
	if (inputText != null) {
		inputText.addEventListener("keyup", function(event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				document.getElementById("userLoginButton").click();
				return false; //return false so other buttons cant be triggered
			}
		});
	}
});


//@author Florian Bruderer
//Is used to put some data to session storage
function startUserLogin() {

	var userName = document.getElementById('username').value;
	var userPassword = document.getElementById('userpassword').value;

	if (userName.length == 0 || userPassword.lenght == 0) {
		return;
	}

	$.ajax({
		async: false,
		type: "GET",
		url: "/api/user/name/" + userName,
		success: function(data) {
			if (data == "") {
				return;
			}
			userName = data['userName'];
			userPassword = data['userPassword'];
			userId = data['id'];
			userType = data['userType'];
			employmentType = data['employmentType'];
			if (userType.toUpperCase() === "ROLE_ADMIN") {
				sessionStorage.setItem("loggedInUserName", userName);
				sessionStorage.setItem("loggedInUserId", userId);
				sessionStorage.setItem("loggedInUserRole", userType);
			} else if (userType.toUpperCase() === "ROLE_USER") {
				sessionStorage.setItem("loggedInUserId", userId);
				sessionStorage.setItem("employmentType", employmentType);
				sessionStorage.setItem("loggedInUserName", userName);
			} else if (userType.toUpperCase() === "ROLE_HEAD") {
				sessionStorage.setItem("loggedInUserId", userId);
				sessionStorage.setItem("employmentType", employmentType);
				sessionStorage.setItem("loggedInUserName", userName);
			}
		}
	});



}





//Is not used in current version
function userLogout() {

	$.ajax({
		async: false,
		type: "POST",
		url: "/api/user/logout/"
			+ parseInt(sessionStorage.getItem("loggedInUserId")),
		success: function(data) {
			if (data == true) {
				window.open("http://localhost:8080/index.html", "_self");
				sessionStorage.setItem("loggedInUserId", null);
				sessionStorage.setItem("loggedInUserName", null);
			} else {
				alert("Logout failed");
			}
		},
		dataType: 'json',
		contentType: 'application/json'
	});

}

//Just for testing
function getALlUsers() {
	document.getElementById("demo").style.color = "red";
	$.ajax({
		type: "GET",
		url: "/api/user/users"
	});

}


//Just for testing if javascript is working
function myFunction() {

	document.getElementById("demo").style.color = "red";
}



//Source: Stackoverflow.com
//Clock
setInterval(showTime, 1000);
function showTime() {
	let today = new Date();
	let hours = today.getHours();
	let minutes = today.getMinutes();
	let seconds = today.getSeconds();
	const time = `${hours} : ${minutes} : ${seconds} `;
	document.getElementById('clock').innerHTML = time;

}
showTime();