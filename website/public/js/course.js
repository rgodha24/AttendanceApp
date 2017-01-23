var course_number = document.getElementById('course_number')
var link_url = document.getElementById('link_url')

 var database = firebase.database();

course_number.oninput = function() {
   link_url.href = "https://brophyprep.instructure.com/api/v1/courses/"+course_number.value+"/users?per_page=100"
};


var fr = new FileReader();

function uploadFile() {
	var selectedFile = document.getElementById('uploaded_file').files[0];
	fr.readAsText(selectedFile)
}

function add_course(name, period_num, course_data) {
  firebase.database().ref('courses/'+name).set({
    "name": name,
    "period_num": period_num,
    "students": course_data
  });
}

fr.onload = function(e) {
    var course_data = JSON.parse(e.target.result.substring(9))
    if (course_data[0].sis_user_id == null) {
	 	Materialize.toast('Invalid course data', 4000)
	 	return
    }
    var filtered_course_data = {}
    for (var i = 0; i < course_data.length; i++) {
    	delete course_data[i].id
    	delete course_data[i].integration_id
    	delete course_data[i].login_id
    	delete course_data[i].root_account
    	delete course_data[i].short_name
    	delete course_data[i].sis_login_id
    	filtered_course_data[course_data[i].sortable_name] = course_data[i];
    }
    var course_name = document.getElementById("course_name").value
    var course_period = document.getElementById("period_number").value

    // console.log(course_name,course_period)
    add_course(course_name, course_period, filtered_course_data)

	console.log(filtered_course_data)
};

var courseRef = firebase.database().ref('courses');
courseRef.on('value', function(snapshot) {
  // updateStarCount(postElement, snapshot.val());
  console.log("Test")
});



$(document).ready(function() {
	$('select').material_select();
});