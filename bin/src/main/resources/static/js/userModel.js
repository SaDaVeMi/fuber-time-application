var id;

// Here we handle stuff when the page is being loaded
$(document).ready(function() {

	//Show the main panel on pageload
	$("#clockPanel").show();
	// Hide unused Panels on page load
	$("#workedHoursPanel").hide();
	$("#userAccountPanel").hide();
	$("#requestVactionPanel").hide();

	// Here we access the logged in User and logged in userID
	document.getElementById("welcomepara").innerHTML = "Welcome: "
		+ sessionStorage.getItem("loggedInUserName");

});


//*****************Following methods are to show and hide GUI elements******************************

function showClockPanel() {
	$("#workedHoursPanel").hide();
	$("#userAccountPanel").hide();
	$("#requestVactionPanel").hide();
	$("#clockPanel").show();
}

function showWorkedHoursPanel() {
	$("#userAccountPanel").hide();
	$("#clockPanel").hide();
	$("#requestVactionPanel").hide();
	$("#workedHoursPanel").show();
	showDetailedTimeHistoryTable();

	// Here we call get time Activites to put them in a table
	$.ajax({
		async: false,
		type: "GET",
		url: "/api/time/timeactivities",
		success: function(dates) {
			handleTimeActivityListReply(dates); //calls the acutal method
		}
	});
}

function showUserAccountPanel() {
	$("#clockPanel").hide();
	$("#workedHoursPanel").hide();
	$("#changePasswordPanel").hide();
	$("#requestVactionPanel").hide();
	$("#userAccountPanel").show();
}

function showVacactionRequestPanel() {
	$("#clockPanel").hide();
	$("#workedHoursPanel").hide();
	$("#changePasswordPanel").hide();
	$("#userAccountPanel").hide();
	$("#requestVactionPanel").show()
}

//*****************Following methods are for clock in and out******************************
//@author Saverio Damiani
function clockIn() {
	$.ajax({
		async: false,
		type: "POST",
		url: "/api/time/clockIn",
		success: function(data) {
			if (data == true) {
				if (sessionStorage.getItem("language") == "german") {
					alert("Erfolgreich")
				} else {
					alert("Success");
				}

			} else {
				if (sessionStorage.getItem("language") == "german") {
					alert("Sie sind bereits eingestempelt");
				} else {
					alert("Already clocked in");
				}
			}
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

function clockOut() {
	$.ajax({
		async: false,
		type: "POST",
		url: "/api/time/clockOut",
		success: function(data) {
			if (data == true) {
				if (sessionStorage.getItem("language") == "german") {
					alert("Erfolgreich")
				} else {
					alert("Success");
				}
			} else {
				if (sessionStorage.getItem("language") == "german") {
					alert("Sie sind bereits ausgestempelt");
				} else {
					alert("Already clocked in");
				}
			}

		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

//************************************ Methods to send vacation request************************************

/*
* Submit form without redirection
* https://stackoverflow.com/questions/25983603/how-to-submit-an-html-form-without-redirection
*/
$('#requestVacationForm').submit(function(e) {
	e.preventDefault();
	$.ajax({
		url: "/api/request/create",
		type: "POST",
		data: $('#requestVacationForm').serialize(),
		success: function(result) {
			if (result) {
				alert("Success");
			}
			else {
				alert("Failed. Vacation Time overlaps or no Vacation Time Balance!")
			}
		}
	});
});

//************************************ Methods to change password************************************
//@author Florian Bruderer & Timo Herrmann

function showChangePasswordPanel() {

	$("#changePasswordPanel").show();

}

function cancelPasswordChange() {

	$("#changePasswordPanel").hide();

}


function changeUserPassword() {

	var oldPassword;
	var newPassword = document.getElementById('newUserPassword').value;
	var repeatNewPassword = document.getElementById('repeatNewUserPassword').value;


	$.ajax({
		async: false,
		type: "GET",
		url: "/api/user/id/" + sessionStorage.getItem("loggedInUserId"),
		success: function(user) {
			oldPassword = user.userPassword;
		}
	});

	if (document.getElementById('oldUserPassword').value != oldPassword) {

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
	
	 if (newPassword.length < 8) {
		if (sessionStorage.getItem("language") == "english") {
			alert("Password must be 8 or more characters")
		} else {
			alert("Passwort muss mindestens 8 Zeichen enthalten")
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
				document.getElementById('newUserPassword').value = "";
				document.getElementById('repeatNewUserPassword').value = "";
				document.getElementById('oldUserPassword').value = "";
				$("#changePasswordPanel").hide();

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


//*****************Following methods are to fill worked hours table******************************

//@author Florian Bruderer
//Here we handle the result from http GET time activites
function handleTimeActivityListReply(dates) {
	$("#tblWorkedHours tbody").empty();


	let datesArr = [];
	for (let date of dates) {
		if (date['activityType'] == "WORK")
			datesArr.push(date)
	}
	addTimeToWorkHourTable(datesArr);

}

//Puts houres form type work into table
function addTimeToWorkHourTable(datesArr) {

	//Clears the table head
	$("#tblWorkedHours tr").empty();
	$("#tblTimeSchedule tbody").empty();


	var rowCounter = 0;
	var columnCounter = 0;
	var tempArr = []
	//Counts rows and Colums, was needed in a later version
	//Not in use for current version
	for (var i = 0; i < datesArr.length; i++) {

		if (i + 1 != datesArr.length) {
			tempArr.push(datesArr[i + 1])
			var tempDate1 = new Date(datesArr[i]['start'])
			var tempDate2 = new Date(tempArr[i]['start'])
		} else {
			tempArr.push(datesArr[0])

			var tempDate1 = new Date(datesArr[i]['start'])
			var tempDate2 = new Date(tempArr[0]['start'])
		}

		if (tempDate1.getDate() != tempDate2.getDate()) {
			rowCounter++;
		} else {
			columnCounter++;
		}
	}

	//Creating a checkDate to find different dates
	var checkDate = new Date(datesArr[0]['start'])
	var firstColumn = true; //Checks if we are in first Column
	var columnEnd = false; //Checks if we are on Column end
	var oneDay = 60 * 60 * 1000; //Is needed to calcualte time
	var hoursWorkedPerDay = 0; //Will calcualte time per date
	//Here we get emplyment Type

	if (sessionStorage.getItem("employmentType") === "FULLTIME") {
		var targetWorkHoursPerDay = 8;
	} else {
		var targetWorkHoursPerDay = 4;
	}
	//Some variables
	var difference;
	var tempHourStart;
	var tempHourEnd;
	var oneClockPerDay = true;
	//Looping through all time Stamps 
	for (var i = 0; i < datesArr.length; i++) {

		//Getting a temporary date
		var tempDate = new Date(datesArr[i]['start'])

		//We check if the dates are the same
		//We check if we are not at the end of the array
		if (checkDate.getDate() === tempDate.getDate() && i + 1 != datesArr.length) {
			oneClockPerDay = false;
			//If we are on first column we add the date to the table
			if (firstColumn) {
				if (i === 0) {
					firstDateOfDayStart = new Date(datesArr[i]['start'])
					firstDateOfDayend = new Date(datesArr[i]['end'])
				} else {
					firstDateOfDayStart = new Date(datesArr[i - 1]['start'])
					firstDateOfDayend = new Date(datesArr[i - 1]['end'])
				}
				//Starting a new table row
				var newRow = "<tr>";
				var newRowSchedule = "<tr>";
				newRow += "<td>" + "<i class=\"fa fa-fw fa-calendar\"></i>" + dateFormmater(tempDate) + "</td>";
				newRowSchedule += "<td>" + "<i class=\"fa fa-fw fa-calendar\"></i>" + dateFormmater(tempDate) + "</td>";
				if (firstDateOfDay != null) {
					newRow += "<td>" + "<i class=\"fa fa-fw fa-play-circle\"style=\"color: #00FF00;\"></i>" + firstDateOfDayStart.getHours() + ":" + firstDateOfDayStart.getMinutes() + ":" + firstDateOfDayStart.getSeconds() + "</td>";
					newRow += "<td>" + "<i class=\"fa fa-fw fa-stop-circle\" style=\"color: #FF0000;\"></i>" + firstDateOfDayend.getHours() + ":" + firstDateOfDayend.getMinutes() + ":" + firstDateOfDayend.getSeconds() + "</td>";
				}
				firstDateOfDay = null;
				firstColumn = false;

				if (i === 0) {
					tempHourStart = new Date(datesArr[i]['start']);
					tempHourEnd = new Date(datesArr[i]['end']);

				} else {
					tempHourStart = new Date(datesArr[i - 1]['start']);
					tempHourEnd = new Date(datesArr[i - 1]['end']);

				}

				hoursWorkedPerDay += Math.abs((tempHourEnd.getTime() - tempHourStart.getTime()) / (oneDay));
			}

			//If we are not at first column, we just add the time
			tempHourStart = new Date(datesArr[i]['start']);
			tempHourEnd = new Date(datesArr[i]['end']);


			//Calcualte Work time
			hoursWorkedPerDay += Math.abs((tempHourEnd.getTime() - tempHourStart.getTime()) / (oneDay));
			newRow += "<td>" + "<i class=\"fa fa-fw fa-play-circle\"style=\"color: #00FF00;\"></i>" + tempHourStart.getHours() + ":" + tempHourStart.getMinutes() + ":" + tempHourStart.getSeconds() + "</td>";
			newRow += "<td>" + "<i class=\"fa fa-fw fa-stop-circle\" style=\"color: #FF0000;\"></i>" + tempHourEnd.getHours() + ":" + tempHourEnd.getMinutes() + ":" + tempHourEnd.getSeconds() + "</td>";


			//When the Date changes, we close the row and add the Row to the table
		} else if (checkDate.getDate() != tempDate.getDate()) {

			//If the user just clocked ones per day we go here
			if (oneClockPerDay) {
				firstDateOfDayStart = new Date(datesArr[i - 1]['start'])
				firstDateOfDayend = new Date(datesArr[i - 1]['end'])
				if (firstColumn) {
					var newRow = "<tr>";
					var newRowSchedule = "<tr>";
					newRow += "<td>" + "<i class=\"fa fa-fw fa-calendar\"></i>" + dateFormmater(firstDateOfDayStart) + "</td>";
					newRowSchedule += "<td>" + "<i class=\"fa fa-fw fa-calendar\"></i>" + dateFormmater(firstDateOfDayStart) + "</td>";

					newRow += "<td>" + "<i class=\"fa fa-fw fa-play-circle\"style=\"color: #00FF00;\"></i>" + firstDateOfDayStart.getHours() + ":" + firstDateOfDayStart.getMinutes() + ":" + firstDateOfDayStart.getSeconds() + "</td>";
					newRow += "<td>" + "<i class=\"fa fa-fw fa-stop-circle\" style=\"color: #FF0000;\"></i>" + firstDateOfDayend.getHours() + ":" + firstDateOfDayend.getMinutes() + ":" + firstDateOfDayend.getSeconds() + "</td>";
					hoursWorkedPerDay += Math.abs((firstDateOfDayStart.getTime() - firstDateOfDayend.getTime()) / (oneDay));
					firstDateOfDayStart = null;
					firstDateOfDayend = null;
					firstDateOfDay = null;
					firstColumn = false;

				}
			}

			//When Column ended we go here
			columnEnd = true;
			if (columnEnd) {
				difference = (hoursWorkedPerDay - targetWorkHoursPerDay);
				newRowSchedule += "<td>" + "<i class=\"fa fa-fw fa-history\"></i>" + convertNumToTime(hoursWorkedPerDay) + "</td>";
				newRowSchedule += "<td>" + "<i class=\"fa fa-fw fa-bullseye\"></i>" + convertNumToTime(targetWorkHoursPerDay) + "</td>";
				if (difference < 0) {
					newRowSchedule += "<td style=\"background-color:#FF0000;\">" + convertNumToTime(difference) + "</td>";
				} else {
					newRowSchedule += "<td style=\"background-color:#00FF00;\">" + convertNumToTime(difference) + "</td>";
				}
				newRow += "</tr>";
				//Add the row to HTML, and reset all var
				$("#tblWorkedHours tbody").append(newRow);
				$("#tblTimeSchedule tbody").append(newRowSchedule);
				var firstDateOfDay = tempDate;
				checkDate = tempDate;
				firstColumn = true;
				columnEnd = false;
				oneClockPerDay = true;
				hoursWorkedPerDay = 0;
			}

		}

		//We use this if the last 2 dates are the same
		if (checkDate.getDate() === tempDate.getDate() && i + 1 === datesArr.length) {

			tempHourStart = new Date(datesArr[i]['start']);
			tempHourEnd = new Date(datesArr[i]['end']);


			if (firstColumn) {
				var newRow = "<tr>";
				var newRowSchedule = "<tr>";
				newRow += "<td>" + "<i class=\"fa fa-fw fa-calendar\"></i>" + dateFormmater(tempDate) + "</td>";
				newRowSchedule += "<td>" + "<i class=\"fa fa-fw fa-calendar\"></i>" + dateFormmater(tempDate) + "</td>";
				if (datesArr.length != 1) {
					tempHourStart = new Date(datesArr[i - 1]['start']);
					tempHourEnd = new Date(datesArr[i - 1]['end']);
					tempHourStart1 = new Date(datesArr[i]['start']);
					if (tempHourStart.getDate() === tempHourStart1.getDate()) {
						newRow += "<td>" + "<i class=\"fa fa-fw fa-play-circle\"style=\"color: #00FF00;\"></i>" + tempHourStart.getHours() + ":" + tempHourStart.getMinutes() + ":" + tempHourStart.getSeconds() + "</td>";
						newRow += "<td>" + "<i class=\"fa fa-fw fa-stop-circle\" style=\"color: #FF0000;\"></i>" + tempHourEnd.getHours() + ":" + tempHourEnd.getMinutes() + ":" + tempHourEnd.getSeconds() + "</td>";
						hoursWorkedPerDay += Math.abs((tempHourEnd.getTime() - tempHourStart.getTime()) / (oneDay));
					}
				}
				firstColumn = false;
			}


			tempHourStart = new Date(datesArr[i]['start']);
			tempHourEnd = new Date(datesArr[i]['end']);


			newRow += "<td>" + "<i class=\"fa fa-fw fa-play-circle\"style=\"color: #00FF00;\"></i>" + tempHourStart.getHours() + ":" + tempHourStart.getMinutes() + ":" + tempHourStart.getSeconds() + "</td>";
			newRow += "<td>" + "<i class=\"fa fa-fw fa-stop-circle\" style=\"color: #FF0000;\"></i>" + tempHourEnd.getHours() + ":" + tempHourEnd.getMinutes() + ":" + tempHourEnd.getSeconds() + "</td>";

			hoursWorkedPerDay += Math.abs((tempHourEnd.getTime() - tempHourStart.getTime()) / (oneDay));


			columnEnd = true;
			if (columnEnd) {

				difference = (hoursWorkedPerDay - targetWorkHoursPerDay);
				newRowSchedule += "<td>" + "<i class=\"fa fa-fw fa-history\"></i>" + convertNumToTime(hoursWorkedPerDay) + "</td>";
				newRowSchedule += "<td>" + "<i class=\"fa fa-fw fa-bullseye\"></i>" + convertNumToTime(targetWorkHoursPerDay) + "</td>";
				if (difference < 0) {
					newRowSchedule += "<td style=\"background-color:#FF0000;\">" + convertNumToTime(difference) + "</td>";
				} else {
					newRowSchedule += "<td style=\"background-color:#00FF00;\">" + convertNumToTime(difference) + "</td>";
				}

				newRow += "</tr>";
				$("#tblWorkedHours tbody").append(newRow);
				$("#tblTimeSchedule tbody").append(newRowSchedule);
				checkDate = tempDate;
				firstColumn = true;
				columnEnd = false;
			}

		}

		//We Check if the last date is uniqe on its own
		//if so we add a new row
		if (checkDate.getDate() != tempDate.getDate() && (i + 1) === datesArr.length) {

			tempHourStart = new Date(datesArr[i]['start']);
			tempHourEnd = new Date(datesArr[i]['end']);
			firstColumn = true;
			if (firstColumn) {
				var newRow = "<tr>";
				var newRowSchedule = "<tr>";
				newRow += "<td>" + "<i class=\"fa fa-fw fa-calendar\"></i>" + dateFormmater(tempDate) + "</td>";
				newRowSchedule += "<td>" + "<i class=\"fa fa-fw fa-calendar\"></i>" + dateFormmater(tempDate) + "</td>";
				firstColumn = false;

			}

			hoursWorkedPerDay += Math.abs((tempHourEnd.getTime() - tempHourStart.getTime()) / (oneDay));
			newRow += "<td>" + "<i class=\"fa fa-fw fa-play-circle\"style=\"color: #00FF00;\"></i>" + tempHourStart.getHours() + ":" + tempHourStart.getMinutes() + ":" + tempHourStart.getSeconds() + "</td>";
			newRow += "<td>" + "<i class=\"fa fa-fw fa-stop-circle\" style=\"color: #FF0000;\"></i>" + tempHourEnd.getHours() + ":" + tempHourEnd.getMinutes() + ":" + tempHourEnd.getSeconds() + "</td>";

			columnEnd = true;
			if (columnEnd) {
				difference = (hoursWorkedPerDay - targetWorkHoursPerDay);
				newRowSchedule += "<td>" + hoursWorkedPerDay + "</td>";
				newRowSchedule += "<td>" + "<i class=\"fa fa-fw fa-bullseye\"></i>" + convertNumToTime(targetWorkHoursPerDay) + "</td>";
				if (difference < 0) {
					newRowSchedule += "<td style=\"background-color:#FF0000;\">" + convertNumToTime(difference) + "</td>";
				} else {
					newRowSchedule += "<td style=\"background-color:#00FF00;\">" + convertNumToTime(difference) + "</td>";
				}
				newRow += "</tr>";

				$("#tblWorkedHours tbody").append(newRow);
				$("#tblTimeSchedule tbody").append(newRowSchedule);
				checkDate = tempDate;
				firstColumn = true;
				columnEnd = false;
			}

		}

	}

}

function showDetailedTimeHistoryTable() {
	$("#tblTimeSchedule").hide();
	$("#workTimeBalanceContainer").hide();
	$("#tblWorkedHours").show();

}

function showTimeScheduleTable() {
	$("#tblWorkedHours").hide();
	$("#workTimeBalanceContainer").hide();
	$("#tblTimeSchedule").show();
}

function showWorkBalanceTable() {
	$("#tblWorkedHours").hide();
	$("#tblTimeSchedule").hide();
	$("#workTimeBalanceContainer").show();

	// Here we get the Time Balance
	$.ajax({
		async: false,
		type: "GET",
		url: "/api/time/workTimeBalance",
		success: function(time) {
			time = (time / 60)
			if (time <= 60) {
				document.getElementById('showTimeBalance').innerHTML = convertNumToTime(time) + " min";
			} else {
				document.getElementById('showTimeBalance').innerHTML = convertNumToTime(time) + " h";
			}


		}
	});

}

//Here we format a date to a better looking format
//From stackoverlow.com
function dateFormmater(date) {
	var dateString = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

	return dateString;
}


//From stackoverlow.com
function convertNumToTime(number) {
	// Check sign of given number
	var sign = (number >= 0) ? 1 : -1;

	// Set positive value of number of sign negative
	number = number * sign;

	// Separate the int from the decimal part
	var hour = Math.floor(number);
	var decpart = number - hour;

	var min = 1 / 60;
	// Round to nearest minute
	decpart = min * Math.round(decpart / min);

	var minute = Math.floor(decpart * 60) + '';

	// Add padding if need
	if (minute.length < 2) {
		minute = '0' + minute;
	}

	// Add Sign in final result
	sign = sign == 1 ? '' : '-';

	// Concate hours and minutes
	time = sign + hour + ':' + minute;

	return time;
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ +++++++++++++++++++++++++++++++++++++


/*









*/




//++++++++++++++++++++++++++++++++++ +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Might be used later

/*

	//Add "Date" to the first column of the head
	var tr = document.getElementById('tblWorkedHours').tHead.children[0],
		td = document.createElement('td');

	td.innerHTML = "<td>Date</td>"
	tr.appendChild(td);

	//Preparing the table headers
	for (var i = 0; i < (columnCounter * 2); i++) {
		var tr = document.getElementById('tblWorkedHours').tHead.children[0],
			td = document.createElement('td');
		if (i % 2 == 0) {
			if (sessionStorage.getItem("language") == "english") {
				td.innerHTML = "<td>Clock In</td>";
			} else {
				td.innerHTML = "<td>Kommen</td>";
			}

		} else {
			if (sessionStorage.getItem("language") == "english") {
				td.innerHTML = "<td>Clock Out</td>";
			} else {
				td.innerHTML = "<td>Gehen</td>";
			}
		}
		tr.appendChild(td);
	}
	var tr = document.getElementById('tblWorkedHours').tHead.children[0],
		td = document.createElement('td');
	td.innerHTML = "<td>Total</td>";
	tr.appendChild(td);

	var tr = document.getElementById('tblWorkedHours').tHead.children[0],
		td = document.createElement('td');

	if (sessionStorage.getItem("language") == "english") {
		td.innerHTML = "<td>Target</td>";
	} else {
		td.innerHTML = "<td>Soll</td>";
	}
	tr.appendChild(td);

	var tr = document.getElementById('tblWorkedHours').tHead.children[0],
		td = document.createElement('td');

	if (sessionStorage.getItem("language") == "english") {
		td.innerHTML = "<td>Difference</td>";
	} else {
		td.innerHTML = "<td>Differenz</td>";
	}
	tr.appendChild(td);
*/