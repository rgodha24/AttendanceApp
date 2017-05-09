var dateSlider = document.getElementById("sliderTime");

var database = firebase.database();

var current_course = "";
var current_time = [];

function timestamp(str){
    return new Date(str).getTime();   
}

console.log(new Date(0).getTime())

noUiSlider.create(dateSlider, {
// Create two timestamps to define a range.
  range: {
        min: new Date(0, 0, 0, 7, 0, 0).getTime(),
        max: new Date(0, 0, 0, 23, 0, 0).getTime()
    },

  connect: true,

// Steps of one week
  step: 5 * 60 * 1000,

  tooltips: [ false, false ],

// Two more timestamps indicate the handle starting positions.
  start: [ new Date(0, 0, 0, 8, 0, 0).getTime(), new Date(0, 0, 0, 14, 0, 0).getTime() ],

  // No decimals
  format: wNumb({
    decimals: 0
  })
});


var dateValues = [
  document.getElementById('event-start'),
  document.getElementById('event-end')
];

function formatDate(date) {
  end = "AM"
  h =  date.getHours(),
  m = (date.getMinutes()<10?'0':'') + date.getMinutes();
  if (h > 12) {
    h -= 12;
    end = "PM "
  }
  return h + ':' + m + " " + end;
}

function raw_format_date(date) {
	h = date.getHours();
	m = (date.getMinutes()<10?'0':'') + date.getMinutes();
	return h + ':' + m;
}

dateSlider.noUiSlider.on('update', function( values, handle ) {
  dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
  document.getElementById('hour7').value = '["'+raw_format_date(new Date(+values[0]))+'", "'+raw_format_date(new Date(+values[1]))+'"]';
});

dateSlider.noUiSlider.on('start', function( values, handle ){
  document.getElementById("hour7").checked = true;
});

dateSlider.noUiSlider.on('end', function( values, handle ){
  force_update();
});

times = [["8:00","8:55", "hour1"],
         ["8:55","9:50", "hour2"],
         ["9:50","11:05", "hour3"],
         ["11:05","12:05", "hour4"],
         ["12:05","13:50", "hour5"],
         ["13:50","14:45", "hour6"]]

var courseRef = firebase.database().ref();
    courseRef.on('value', function(snapshot) {
    update_courses(snapshot.val());
    update_lists(snapshot.val());
});


function update_courses(data) {
    var course_list = document.getElementById("course_select");
    course_list.innerHTML = '';
    data = data["courses"];
    for (var key in data){
        var course = data[key];

        var option_element = document.createElement("option");
        option_element.value = course["id"]
        option_element.innerHTML = course["name"] + " - Period " + course["period_num"];

        course_list.appendChild(option_element);
    }
	$('select').material_select();
}

function force_update() {

	firebase.database().ref().once('value', function(snapshot) {
	    update_lists(snapshot.val())
	});
}

$('#courses_selector_container').on('change', 'select', function(){ force_update(); });

function update_lists(data) {
	var rates = document.getElementsByName('time');
	var rate_value;
	for(var i = 0; i < rates.length; i++){
	    if(rates[i].checked){
	        rate_value = rates[i].value;
	    }
	}


	current_time = JSON.parse(rate_value);
	current_course = document.getElementById("course_select").value;

	var tbody_absent = document.getElementById("absent_table");
	var tbody_present = document.getElementById("present_table");
	tbody_absent.innerHTML = '';
	tbody_present.innerHTML = '';

	var date = new Date();
	var month = ((date.getMonth()+1)<10?'0':'') + (date.getMonth()+1);
	var day = (date.getDate()<10?'0':'') + date.getDate();

	sign_in_today = data["sign-in"][date.getFullYear()][month][day]

	// console.log(check_if_signed_in(17240, ["21:00","23:00"], sign_in_today))

	course = data["courses"][current_course]["students"];
	for (var key in course){
        var student = course[key];
        var tr = document.createElement("tr");

		var td = document.createElement("td");
        td.innerHTML = student["sortable_name"]
        tr.appendChild(td);

        if (check_if_signed_in(student["sis_user_id"], current_time, sign_in_today)) {
			var td = document.createElement("td");
	        td.innerHTML = student["sis_user_id"]
	        tr.appendChild(td);

	        var td = document.createElement("td");
	        td.innerHTML = student["sis_user_id"]
	        tr.appendChild(td);

	        tbody_present.appendChild(tr);

        } else {
        	var td = document.createElement("td");
	        td.innerHTML = student["name"]
	        tr.appendChild(td);

	        var td = document.createElement("td");
	        td.innerHTML = student["sis_user_id"]
	        tr.appendChild(td);

	        tbody_absent.appendChild(tr);
        }
    }
	
}

function check_if_signed_in(student_id, current_time, sign_in_today) {
	sign_ins_times = []
	startTime = current_time[0]
  	endTime = current_time[1]
	
	for (var key in sign_in_today){
		var sign_in_event = sign_in_today[key];
		if (sign_in_event.id == student_id) {
			sign_ins_times.push(sign_in_event.time)
		}
	}


  	startDate = new Date();
  	startDate.setHours(startTime.split(":")[0]);
  	startDate.setMinutes(startTime.split(":")[1]);
	  	
  	endDate = new Date();
  	endDate.setHours(endTime.split(":")[0]);
  	endDate.setMinutes(endTime.split(":")[1]);


	for (var i = 0; i < sign_ins_times.length; i++) {
		sign_ins_times[i];
		if (startDate < currentDate && endDate >= currentDate) {
			return true;
		}
	}
	return false;
}

$(document).ready(function() {
  for (var i = 0; i < times.length; i++) {
    if (checkBetween(times[i])) {
      document.getElementById(times[i][2]).checked = true;
      break;
    }
  }
  document.getElementById("hour7").checked = true;


  	var rad = document.getElementsByName("time");
    var prev = null;
    for(var i = 0; i < rad.length; i++) {
        rad[i].onclick = function() {
            // (prev)? console.log(prev.value):null;
            if(this !== prev) {
                prev = this;
            }
            force_update()
        };
    }
});

function checkBetween(timeArray) {
  startTime = timeArray[0]
  endTime = timeArray[1]
  currentDate = new Date()

  startDate = new Date();
  startDate.setHours(startTime.split(":")[0]);
  startDate.setMinutes(startTime.split(":")[1]);

  endDate = new Date(currentDate.getTime());
  endDate.setHours(endTime.split(":")[0]);
  endDate.setMinutes(endTime.split(":")[1]);
  return startDate < currentDate && endDate >= currentDate
}





