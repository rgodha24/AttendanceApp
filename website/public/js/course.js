var course_number = document.getElementById('course_number')
var link_url = document.getElementById('link_url')
var database = firebase.database();
var course_to_delete = "";
var student_to_delete = "";
var student_course_to_delete = "";
var fr = new FileReader();
var date = new Date();
var initialDataLoaded = false;
var debugRef = database.ref("debug");
var user = undefined;


firebase.auth().onAuthStateChanged(function(this_user) {
  	if (this_user) {
  		user = this_user;
		document.getElementById("profile_name").innerHTML = user.displayName;
		document.getElementById("profile_img").src = user.photoURL;
		$(".dropdown-button").dropdown();

		document.getElementById("profile_name_mobile").innerHTML = user.displayName;
		document.getElementById("profile_img_mobile").src = user.photoURL;


		var courseRef = database.ref("users/" + user.uid + "/courses");
		courseRef.on('value', function(snapshot) {
			update_courses(snapshot.val());
		});
  	} else {
	    var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(provider);
	 }
});

firebase.auth().getRedirectResult().then(function(result) {
  	if (result.credential) {
    	// This gives you a Google Access Token. You can use it to access the Google API.
    	var token = result.credential.accessToken;
  	}
  	var user = result.user;
}).catch(function(error) {
  	// Handle Errors here.
  	var errorCode = error.code;
  	var errorMessage = error.message;
  	var email = error.email;
  	var credential = error.credential;
});

function sign_out() {
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	}, function(error) {
  		// An error happened.
	});
}

course_number.oninput = function() {
	link_url.href = "https://brophyprep.instructure.com/api/v1/courses/" + course_number.value + "/users?per_page=100"
};

function uploadFile() {
	var selectedFile = document.getElementById('uploaded_file').files[0];
	fr.readAsText(selectedFile)
}

function add_course(name, period_num, course_data) {
	var id = name.replace(/([^a-z0-9]+)/gi, '-');
	checkIfUserExists(id, name, period_num, course_data);
}


function userExistsCallback(id, name, period_num, course_data, exists) {
	if (exists) {
		Materialize.toast("Class Failed To Load (Already Exists)", 4000);
	} else {
		database.ref("users/" + user.uid + "/courses/" + id).set({
			"id": id,
			"name": name,
			"period_num": period_num,
			"students": course_data
		});
		Materialize.toast("Class Loaded Successfully", 4000);
	}
}

function checkIfUserExists(id, name, period_num, course_data) {
	database.ref("users/" + user.uid + "/courses/" + id).once('value', function(snapshot) {
		var exists = (snapshot.val() !== null);
		userExistsCallback(id, name, period_num, course_data, exists);
	});
}

function update_courses(data) {
	var course_list = document.getElementById("course_list");
	var active_class = course_list.getElementsByClassName("active")[0];
	var active_index = Array.prototype.indexOf.call(course_list.childNodes, active_class)

	course_list.innerHTML = '';
	if (data == null) {
		var list_element = document.createElement("li");
		var header = document.createElement("div");
		header.className = "collapsible-header";
		header.setAttribute('course_id', null);
		var name_header = document.createElement("div");
		name_header.innerHTML = "No Current Courses";
		header.appendChild(name_header);
		list_element.appendChild(header);
		course_list.appendChild(list_element);
	} else {
		for (var key in data) {
			var course = data[key];

			var list_element = document.createElement("li");

			var header = document.createElement("div");
			header.className = "collapsible-header";
			header.setAttribute('course_id', course["id"]);
			var name_header = document.createElement("div");
			name_header.innerHTML = course["name"] + " - Period " + course["period_num"];

			var delete_header = document.createElement("div");
			delete_header.innerHTML = "<i onclick='delete_course_dialog(this)' class='material-icons'>clear</i>";
			delete_header.style.float = "right";

			header.appendChild(delete_header);
			header.appendChild(name_header);


			var students = course["students"]
			var table = document.createElement("table");
			table.className = "striped"
			var thead = document.createElement("thead");
			var tr = document.createElement("tr");

			var sort_name = document.createElement("th");
			sort_name.innerHTML = "Sortable Name";
			var name = document.createElement("th");
			name.innerHTML = "Name";
			var student_id = document.createElement("th");
			student_id.innerHTML = "Student ID";
			var delete_heading = document.createElement("th");
			delete_heading.innerHTML = '<i style="cursor: pointer" onclick="add_student_dialog(this)" class="material-icons">add</i>'

			tr.appendChild(sort_name);
			tr.appendChild(name);
			tr.appendChild(student_id);
			tr.appendChild(delete_heading);

			thead.appendChild(tr);
			table.appendChild(thead);

			var tbody = document.createElement("tbody");
			for (var key in students) {
				var student = students[key];
				var tr = document.createElement("tr");

				var td = document.createElement("td");
				td.innerHTML = student["sortable_name"]
				tr.appendChild(td);

				var td = document.createElement("td");
				td.innerHTML = student["name"]
				tr.appendChild(td);

				var td = document.createElement("td");
				td.innerHTML = student["sis_user_id"]
				tr.appendChild(td);

				var delete_student = document.createElement("td");
				delete_student.innerHTML = "<i style='cursor: pointer' onclick='delete_student_dialog(this)' class='material-icons'>clear</i>";
				tr.appendChild(delete_student);

				tbody.appendChild(tr);
			}

			table.appendChild(tbody);

			var body = document.createElement("div");
			body.className = "collapsible-body";
			body.appendChild(table);

			list_element.appendChild(header);
			list_element.appendChild(body);
			course_list.appendChild(list_element);
		}
	}
	


	$('.collapsible').collapsible("open", active_index);
}

function delete_course_dialog(element) {
	element.parentElement.click();
	$('#delete_course_modal').modal('open');
	course_to_delete = element.parentElement.parentElement.getAttribute("course_id")
}

function delete_course() {
	console.log('courses/' + course_to_delete);
	database.ref("users/" + user.uid + "/courses/" + course_to_delete).remove();
	Materialize.toast("Course Successfully Deleted", 4000);
}

function delete_student_dialog(element) {
	$('#delete_student_modal').modal('open');
	student_course_to_delete = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.getAttribute("course_id");
	student_to_delete = element.parentElement.parentElement.childNodes[2].innerHTML;
}

function delete_student() {
	console.log('courses/' + student_course_to_delete);
	database.ref("users/" + user.uid + "/courses/" + student_course_to_delete + "/students/" + student_to_delete).remove();
	Materialize.toast("Student Successfully Deleted", 4000);
}

function add_student_dialog(element) {
	$('#add_student_modal').modal('open');
	student_course_to_add = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.getAttribute("course_id");
	Materialize.updateTextFields();
}

function add_student() {
	console.log("users/" + user.uid + "/courses/" + student_course_to_add);

	var sortable_name_element = document.getElementById("add_sortable_name");
	var name_element = document.getElementById("add_name");
	var student_id_element = document.getElementById("add_student_id");

	student_info = {
		sortable_name: sortable_name_element.value,
		name: name_element.value,
		sis_user_id: student_id_element.value,
	}

	sortable_name_element.value = '';
	name_element.value = '';
	student_id_element.value = '';

	console.log(student_info);

	database.ref("users/" + user.uid + "/courses/" + student_course_to_add + "/students/" + student_info["sis_user_id"]).set(student_info);
	Materialize.toast("Student Successfully Added", 4000);
}

fr.onload = function(e) {
	var fileInput = document.getElementById('uploaded_file');
	var fileString = fileInput.files[0].name;
	var fileType = fileInput.files[0].type;
	console.log(fileType)
	var course_name = document.getElementById("course_name").value;
	var course_period = document.getElementById("period_number").value;
	if (fileType == "application/json") {
		var course_data = JSON.parse(e.target.result.substring(9));
		if (course_data[0].sis_user_id == null) {
			Materialize.toast('Invalid course data', 4000)
			return
		}
		var filtered_course_data = {}
		for (var i = 0; i < course_data.length; i++) {
			delete course_data[i].id;
			delete course_data[i].integration_id;
			delete course_data[i].login_id;
			delete course_data[i].root_account;
			delete course_data[i].short_name;
			delete course_data[i].sis_login_id;
			filtered_course_data[course_data[i].sis_user_id] = course_data[i];
		}

		// console.log(course_name,course_period)
		add_course(course_name, course_period, filtered_course_data);
	} else if (fileType == "text/csv") {
		var csv = e.target.result;
		var data = Papa.parse(csv, {
			// delimiter: "\t",	// auto-detect
			// newline: "\n",
		}).data;
		var courseData = {}

		for (var i = 0; i < data.length; i++) {
			console.log(data[i][2])
			courseData[parseInt(data[i][2])] = {
									"sis_user_id": data[i][2].replace(/(\r\n|\n|\r)/gm,""),
									"name": data[i][1],
									"sortable_name": data[i][0]
									};
		}

		add_course(course_name, course_period, courseData);
		console.log(data);
	} else if (fileType == "application/vnd.ms-excel") {
		var csv = e.target.result;
		var data = Papa.parse(csv, {
			// delimiter: "\t",	// auto-detect
			newline: "\r\r",
		}).data;
		var courseData = {}

		for (var i = 0; i < data.length; i++) {
			if (data[i][2] != undefined) {
				courseData[parseInt(data[i][2])] = {
									"sis_user_id": data[i][2],
									"name": data[i][1],
									"sortable_name": data[i][0]
									};
			}
		}
		// console.log(courseData[courseData.length - 1]["sis_user_id"]);
		// if (courseData[courseData.length - 1]["sis_user_id"] == undefined) {
		// 	console.log("Yes");
		// 	courseData.splice(courseData.length - 1, 1);
		// }
		add_course(course_name, course_period, courseData);
		console.log(data); 
	} else {
		Materialize.toast("Invalid File Format (Please use CSV or JSON file)");
	}

	// console.log(filtered_course_data)
};

debugRef.on('value', function(snapshot) {
	if (initialDataLoaded) {
		debug_dialog();
	} else {
		initialDataLoaded = true;
	}
});

function debug_dialog() {
	$('#debug_modal').modal('open');
}

$(document).ready(function() {
	$(".button-collapse").sideNav();
	$('select').material_select();
	$('.modal').modal();
});