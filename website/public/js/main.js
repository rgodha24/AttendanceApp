var dateSlider = document.getElementById("sliderTime");

var database = firebase.database();

var current_course = "";
var current_time = [];

function timestamp(str) {
	return new Date(str).getTime();
}

var period_data = [
	[1, 2, 3, 4, 6, 7],
	[1, 5, 2, 3, 6, 7],
	[4, 4, 5, 2, 6, 7],
	[1, 3, 4, 5, 6, 7],
	[2, 3, 4, 5, 1, 1]
]

noUiSlider.create(dateSlider, {
	// Create two timestamps to define a range.
	range: {
		min: new Date(0, 0, 0, 7, 30, 0).getTime(),
		max: new Date(0, 0, 0, 15, 0, 0).getTime()
	},

	connect: true,

	// Steps of one week
	step: 5 * 60 * 1000,

	tooltips: [false, false],

	// Two more timestamps indicate the handle starting positions.
	start: [new Date(0, 0, 0, 8, 0, 0).getTime(), new Date(0, 0, 0, 14, 30, 0).getTime()],

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
	h = date.getHours(),
		m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
	if (h > 12) {
		h -= 12;
		end = "PM "
	}
	return h + ':' + m + " " + end;
}

function raw_format_date(date) {
	h = date.getHours();
	m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
	return h + ':' + m;
}

dateSlider.noUiSlider.on('update', function(values, handle) {
	dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
	document.getElementById('hour7').value = '["' + raw_format_date(new Date(+values[0])) + '", "' + raw_format_date(new Date(+values[1])) + '"]';
});

dateSlider.noUiSlider.on('start', function(values, handle) {
	document.getElementById("hour7").checked = true;
});

dateSlider.noUiSlider.on('end', function(values, handle) {
	force_update();
});

times = [
	["8:00", "8:55", "hour1"],
	["8:55", "9:50", "hour2"],
	["9:50", "11:05", "hour3"],
	["11:05", "12:05", "hour4"],
	["12:05", "13:50", "hour5"],
	["13:50", "14:45", "hour6"]
]

var courseRef = firebase.database().ref();
courseRef.on('value', function(snapshot) {
	update_courses(snapshot.val());
	update_lists(snapshot.val());
});

var date = new Date();
var month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
var initialDataLoaded = false;

var debugRef = firebase.database().ref("debug/" + date.getFullYear() + "/" + month + "/" + day);
debugRef.on('value', function(snapshot) {
	if (initialDataLoaded) {
		debug_dialog();
	} else {
		initialDataLoaded = true;
	}
});


function update_courses(data) {
	current_course = document.getElementById("course_select").value;
	var course_list = document.getElementById("course_select");
	course_list.innerHTML = '';
	data = data["courses"];
	for (var key in data) {
		var course = data[key];

		var option_element = document.createElement("option");
		option_element.value = course["id"]
		if (course["id"] == current_course) {
			option_element.setAttribute("selected", true);
		}
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

function clear_history_dialog() {
	$('#clear_history_modal').modal('open');
}


function debug_dialog() {
	$('#debug_modal').modal('open');
}

function clear_history() {
	var date = new Date();
	var month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
	var day = (date.getDate() < 10 ? '0' : '') + date.getDate();

	firebase.database().ref("sign-in/" + date.getFullYear() + "/" + month + "/" + day).remove()
}

$('#courses_selector_container').on('change', 'select', function() {
	force_update();
});

function update_lists(data) {
	var rates = document.getElementsByName('time');
	var rate_value;
	for (var i = 0; i < rates.length; i++) {
		if (rates[i].checked) {
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
	var month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
	var day = (date.getDate() < 10 ? '0' : '') + date.getDate();

	sign_in_today = data["sign-in"][date.getFullYear()][month][day]

	// console.log(check_if_signed_in(17240, ["21:00","23:00"], sign_in_today))

	course = data["courses"][current_course]["students"];
	for (var key in course) {
		var student = course[key];
		var tr = document.createElement("tr");

		var td = document.createElement("td");
		td.innerHTML = student["sortable_name"]
		tr.appendChild(td);

		var time_sign_in = check_if_signed_in(student["sis_user_id"], current_time, sign_in_today);
		if (time_sign_in != -1) {
			var td = document.createElement("td");
			td.innerHTML = student["sis_user_id"]
			tr.appendChild(td);

			var td = document.createElement("td");
			td.innerHTML = formatDate(time_sign_in);
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

	for (var key in sign_in_today) {
		var sign_in_event = sign_in_today[key];
		if (sign_in_event.id == student_id) {
			// sign_ins_times.push(sign_in_event.time * 1000)
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
		var currentTime = new Date(sign_ins_times[i]);
		// console.log(currentTime);
		// console.log(startDate);
		if (startDate < currentTime && endDate >= currentTime) {
			return currentTime;
		}
	}
	return -1;
}

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

function update_current_time() {
	for (var i = 0; i < times.length; i++) {
		if (checkBetween(times[i])) {
			document.getElementById(times[i][2]).checked = true;
			select_class(times[i]);
			break;
		} else {
			document.getElementById("hour7").checked = true;
		}
	}
}

function add_radio_updater() {
	var rad = document.getElementsByName("time");
	var prev = null;
	for (var i = 0; i < rad.length; i++) {
		rad[i].onclick = function() {
			// (prev)? console.log(prev.value):null;
			if (this !== prev) {
				prev = this;
			}
			force_update()
		};
	}
}

function select_class(times) {
	// console.log(int(times[2].slice(-1)));
}

$(document).ready(function() {
	update_current_time()
	add_radio_updater();
	$('.modal').modal();
});


