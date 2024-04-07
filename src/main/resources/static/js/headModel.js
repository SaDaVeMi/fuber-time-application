var requests = [];
var isActive = true
var id;

$(document).ready(function() {

	//Show the main panel on pageload
	$("#clockPanel").show();
	// Hide unused Panels on page load
	$("#workedHoursPanel").hide();
	$("#userAccountPanel").hide();
	$("#requestsPanel").hide();
	$("#requestVactionPanel").hide();

	pollServer();
	
	// Here we access the logged in User and logged in userID
	document.getElementById("welcomepara").innerHTML = "Welcome: "
		+ sessionStorage.getItem("loggedInUserName");
});

//@author Saverio Damiani
//*****************Following methods are to do polling operations and show requests data in real time******************************


//Sends all 5 min an HTTP-Request to refresh request list
function pollServer() {
	if (isActive) {
		window.setTimeout(function() {
			$.ajax({
				url: "/api/request/requests",
				type: "GET",
				success: function(result) {
					requestsHandler(result)
					pollServer();
				},
				error: function() {
					//ERROR HANDLING
					pollServer();
				}
			});
		}, 300000);
	}
}

//Adds list elements in list
function requestsHandler(result) {
	$("#requestList").empty();
	for (i = 0; i < result.length; i++) {
		//Creates array with all requests
		requests.push(i, result[i]);

		// Formatting: Replace "T" and ":" of the form date (datetime-local input) with "-"
		// So the date is more readable
		var start =  result[i].timeActivity.start.replace(/[:T+.]/g,'-');
		var end =  result[i].timeActivity.end.replace(/[:T+.]/g,'-');
		var splittedStart = start.split("-");
		var splittedEnd = end.split("-");	
		var activityType = result[i].timeActivity.activityType.charAt(0).toUpperCase() + 
			result[i].timeActivity.activityType.slice(1).toLowerCase();
	
		$("#requestList").append(
			'<li>' +
			'<p>' + activityType + ' Request ID: ' + '#' + result[i].id + '<span style="display:inline-block; width: 5%;"></span>' +
			'User: ' + '"'+ result[i].user.userName + '"' + '</p>' +
			'<i class="fa fa-fw fa-caret-left" style="position:absolute; left:95%; margin-top:18px;"></i>' +
			'<p style="display:block;"> Start: ' + splittedStart[2] + '.' + splittedStart[1] + '.' + splittedStart[0] + ' ' +
			' '+ splittedStart[3] + ':' + splittedStart[4] +
			'<span style="display:inline-block; width: 5%;"></span>End: '  + splittedEnd[2] + '.' + splittedEnd[1] + '.' + splittedEnd[0] + ' ' +
			' '+ splittedEnd[3] + ':' + splittedEnd[4] +
			'</p>' +
			'</li>'
		);

	}

	//Index number of list to find request in array
	$('#requestList li').click(function() {
		var index = $(this).index();
		var htmlElement = $(this);
		openRequest(htmlElement, index, result);
	});
}

function openRequest(htmlElement, index, result) {
	//Changes unicode arrow icon when request element is expanded
	$(htmlElement).find('i').replaceWith(
		'<i class="fa fa-fw fa-caret-down" style="position:absolute; left:95%; margin-top:18px;"></i>');

	//Collapse request element when clicking again
	$(htmlElement).off('click');
	$(htmlElement).click(function() {
		closeRequest(htmlElement, index, result);
	});

	//Add Buttons
	htmlElement.append(
		'<br>' +
		'<button class="acceptRequest">Genehmigen</button>' +
		'<button class="declineRequest">Ablehnen</button>');

	$('.acceptRequest').click(function() {
		var approved = true;
		processRequest(result[index].id, approved);
	});

	$('.declineRequest').click(function() {
		var approved = false;
		processRequest(result[index].id, approved);
	});
}

function closeRequest(htmlElement, index, result) {
	//Changes unicode arrow icon when request element is collapsed
	$(htmlElement).find('i').replaceWith(
		'<i class="fa fa-fw fa-caret-left" style="position:absolute; left:95%; margin-top:18px;"></i>');

	//Remove buttons and <br>
	$(htmlElement).find('button, br').remove();

	//Change click event again
	$(htmlElement).off('click');
	$(htmlElement).click(function() {
		openRequest(htmlElement, index, result);
	});
}

function processRequest(id, approved) {
	$.ajax({
		url: "/api/request/process/" + id + "/" + approved,
		type: "PUT",
		success: function(result) {
			if (result) {
				alert("Success");
			}
			else {
				alert("Failed");
			}
			//Refresh List
			showRequestPanel();
		},
		error: function() {
			//ERROR HANDLING
			showRequestPanel();
		}
	});
}

//*****************Following methods are to show and hide GUI elements******************************

function showClockPanel() {
	$("#userAccountPanel").hide();
	$("#requestVactionPanel").hide();
	$("#requestsPanel").hide();
	$("#workedHoursPanel").hide()
	$("#clockPanel").show();
}

function showWorkedHoursPanel() {
	$("#userAccountPanel").hide();
	$("#clockPanel").hide();
	$("#requestVactionPanel").hide();
	$("#requestsPanel").hide();
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

function showVacactionRequestPanel() {
	$("#clockPanel").hide();
	$("#workedHoursPanel").hide();
	$("#requestsPanel").hide();
	$("#userAccountPanel").hide();
	$("#requestVactionPanel").show()
}

function showUserAccountPanel() {
	$("#clockPanel").hide();
	$("#workedHoursPanel").hide();
	$("#requestsPanel").hide();
	$("#changePasswordPanel").hide();
	$("#requestVactionPanel").hide();
	$("#userAccountPanel").show();
}

// here we hide the password change form
function cancelPasswordChange() {
	$("#userDetailsPanel").hide();
	$("#changePasswordPanel").hide();
}

// here we show the password change form
function showChangePasswordPanel() {
	$("#userDetailsPanel").hide();
	$("#changePasswordPanel").show();

}

// Add requests in array and html list
function showRequestPanel() {
	$("#clockPanel").hide();
	$("#workedHoursPanel").hide();
	$("#requestVactionPanel").hide();
	$("#userAccountPanel").hide();
	$.ajax({
		url: "/api/request/requests",
		type: "GET",
		success: function(result) {
			requestsHandler(result);
		},
		error: function() {
			//ERROR HANDLING
			alert("No requests");
		}
	});
	$("#requestsPanel").show();
}


//*****************Following methods are for clock in and out******************************

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

//@author Saverio Damiani
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

//https://stackoverflow.com/questions/47873960/how-to-check-datetime-local-input-field-is-not-less-than-other-datetime-local-fi
function checkDate() {
	var stringStart = $('#startDate').val();
 	var stringEnd = $('#endDate').val();
 	var start = new Date(stringStart);
  	var end = new Date(stringEnd);
  	
	if (start > end) {
		alert("End date cannot be less than Start date.");
		$('#startDate').val('');
		$('#endDate').val('');
	}
}

///*****************Following methods are to fill worked hours table******************************

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
	var firstColumn = true;
	var columnEnd = false;
	var oneDay = 60 * 60 * 1000;
	var hoursWorkedPerDay = 0;
	if (sessionStorage.getItem("employmentType") === "FULLTIME") {
		var targetWorkHoursPerDay = 8;
	} else {
		var targetWorkHoursPerDay = 4;
	}
	var difference;
	var tempHourStart;
	var tempHourEnd;
	var oneClockPerDay = true;;
	for (var i = 0; i < datesArr.length; i++) {

		var tempDate = new Date(datesArr[i]['start'])


		if (checkDate.getDate() === tempDate.getDate() && i + 1 != datesArr.length) {
			oneClockPerDay = false;
			if (firstColumn) {
				if (i === 0) {
					firstDateOfDayStart = new Date(datesArr[i]['start'])
					firstDateOfDayend = new Date(datesArr[i]['end'])
				} else {
					firstDateOfDayStart = new Date(datesArr[i - 1]['start'])
					firstDateOfDayend = new Date(datesArr[i - 1]['end'])
				}
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

			tempHourStart = new Date(datesArr[i]['start']);
			tempHourEnd = new Date(datesArr[i]['end']);



			hoursWorkedPerDay += Math.abs((tempHourEnd.getTime() - tempHourStart.getTime()) / (oneDay));
			newRow += "<td>" + "<i class=\"fa fa-fw fa-play-circle\"style=\"color: #00FF00;\"></i>" + tempHourStart.getHours() + ":" + tempHourStart.getMinutes() + ":" + tempHourStart.getSeconds() + "</td>";
			newRow += "<td>" + "<i class=\"fa fa-fw fa-stop-circle\" style=\"color: #FF0000;\"></i>" + tempHourEnd.getHours() + ":" + tempHourEnd.getMinutes() + ":" + tempHourEnd.getSeconds() + "</td>";


			//When the Date changes, we add the Row to the table
		} else if (checkDate.getDate() != tempDate.getDate()) {

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
				document.getElementById('showTimeBalance').innerHTML = convertNumToTime(time) + " h";
			} else {
				document.getElementById('showTimeBalance').innerHTML = convertNumToTime(time) + " h";
			}


		}
	});

}

//************************************ Methods to change password************************************


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



