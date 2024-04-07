
//@author Timo Herrmann & Florian Bruderer
//In this class we handle design change logic

//get the Choosen design
$(document).ready(
	function() {

		//If the session storage is null, we prepare an empty String
		if (sessionStorage.getItem("design") === null) {
			sessionStorage.setItem("design", "");

		}
		//Load the Choosen design
		if (sessionStorage.getItem("design").length > 1) {
			changeCSS(sessionStorage.getItem("design"));
				loadChoosenDesign("designs", sessionStorage.getItem("design"))
		} else {
			//Set default design
		changeCSS("normalDesign");
		loadChoosenDesign("designs", normalDesign)
		}


	});



function changeCSS(design) {

	if (design === "normalDesign") {
		if (document.getElementById('mainNormal') != null) {
			document.getElementById('mainNormal').href = 'css/main.css';
		}

		if (document.getElementById('indexViewNormal') != null) {
			document.getElementById('indexViewNormal').href = 'css/indexView.css';
		}

		if (document.getElementById('adminMainViewNormal') != null) {
			document.getElementById('adminMainViewNormal').href = 'css/adminMainView.css';
		}

		if (document.getElementById('userMainViewNormal') != null) {
			document.getElementById('userMainViewNormal').href = 'css/userMainView.css';
		}



	} else if (document.getElementById('mainNormal') != null) {
		document.getElementById('mainNormal').href = 'css/mainDark.css';

		if (document.getElementById('indexViewNormal') != null) {
			document.getElementById('indexViewNormal').href = 'css/indexViewDark.css';
		}

		if (document.getElementById('adminMainViewNormal') != null) {
			document.getElementById('adminMainViewNormal').href = 'css/adminMainViewDark.css';
		}

		if (document.getElementById('userMainViewNormal') != null) {
			document.getElementById('userMainViewNormal').href = 'css/userMainViewDark.css';
		}

	}

	sessionStorage.setItem("design", design);
}

//load a design given a HTML id and the value normal or dark
function loadChoosenDesign(id, valueToSelect) {
	let element = document.getElementById(id);
	element.value = valueToSelect;
}


