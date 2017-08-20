

var datePicker = new DatePicker();
var slider = new Slider();
var courseSelector = new CourseSelector();
var studentLister = new StudentLister();
var fireBase = new FireBase();


$(document).ready(function() {
	$(".button-collapse").sideNav();
	$('.modal').modal();
});


function clearHistoryDialog() {
	$('#clear_history_modal').modal('open');
}

function debugDialog() {
	$('#debug_modal').modal('open');
}

function FireBase() {
	this.database = firebase.database();
	this.initialDebugLoaded = false;

	this.courseRef = this.database.ref("courses");
	this.courseRef.on('value', function(snapshot) {
		slider.buildTimes();
		slider.addRadioUpdater();
		slider.updateCurrentTime();
		courseSelector.updateCourses(snapshot.val());
		courseSelector.updateCoursePeriod(snapshot.val());
		fireBase.forceUpdate();
		this.courses = snapshot.val();
	});

	this.date = new Date();
	this.month = ((this.date.getMonth() + 1) < 10 ? '0' : '') + (this.date.getMonth() + 1);
	this.day = (this.date.getDate() < 10 ? '0' : '') + this.date.getDate();

	this.debugRef = this.database.ref("debug");
	this.debugRef.on('value', function(snapshot) {
		if (this.initialDebugLoaded) {
			debugDialog();
		} else {
			this.initialDebugLoaded = true;
		}
	});

	this.forceUpdate = function() {
		var selected_time_range = slider.getSelectedTime();
		this.updateSignInListener(selected_time_range);
	}

	this.signInListener = this.database.ref("sign-in-test");

	this.updateSignInListener = function(selected_time_range) {
		this.database.ref("sign-in-test").off();
		var startTime = selected_time_range[0];
		var endTime = selected_time_range[1];

		var startDate = datePicker.readDatePicker();
		startDate.setHours(startTime.split(":")[0]);
		startDate.setMinutes(startTime.split(":")[1]);

		var endDate = datePicker.readDatePicker();
		endDate.setHours(endTime.split(":")[0]);
		endDate.setMinutes(endTime.split(":")[1]);
		
		this.database.ref("sign-in-test").orderByChild("time").startAt(startDate.getTime()).endAt(endDate.getTime()).on('value', function(snapshot) {
			studentLister.updateLists(snapshot.val(), this.courses);
		});
	}


	this.clearHistory = function() {
		var date = datePicker.readDatePicker();
		// var month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
		// var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
		// console.log(date.getTime())
		// console.log(date.setDate(date.getDate() + 1))

		this.database.ref("sign-in-test").orderByChild("time").startAt(date.getTime()).endAt(date.setDate(date.getDate() + 1)).once('value', function(snapshot) {
			var data = snapshot.val();
			for (var key in data) {
				data[key] = null;
			}
			fireBase.database.ref().child("sign-in-test").update(data)
		});
	}
}

function StudentLister() {
	this.updateLists = function(sign_ins, courses) {

		var selectedCourse = courseSelector.getSelectedCourse();
		var students = courses[selectedCourse]["students"];

		var absent_array = [];
		var present_array = [];	

		if (sign_ins == null) {
			for (var key in students) {
				var student = students[key];
				absent_array.push([student["sortable_name"], student["name"], student["sis_user_id"]]);
			}
		} else {
			for (var key in students) {
				var student = students[key];

				var student_sign_in = undefined;
				for (var key in sign_ins) {
					if (sign_ins[key]["id"] == student["sis_user_id"]) {
						student_sign_in = sign_ins[key]["time"];
					}
				}
				
				if (student_sign_in != undefined) {
					present_array.push([student["sortable_name"], student["sis_user_id"], student_sign_in]);
				} else {
					absent_array.push([student["sortable_name"], student["name"], student["sis_user_id"]]);
				}
			}
		}
		

		present_array.sort(function(a,b) {return a[2] - b[2]});
		present_array = present_array.map(function(x) {
			return [x[0], x[1], slider.formatDate(new Date(x[2]))];
		})
		this.buildTable(present_array, absent_array);
	}

	this.buildRows = function(table, student_array) {
		for (var i = 0; i < student_array.length; i++) {
			var student_entry = student_array[i];
			var tr = document.createElement("tr");
			for (var j = 0; j < student_entry.length; j++) {
				var td = document.createElement("td");
				td.innerHTML = student_entry[j];
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
	}

	this.buildTable = function(present_array, absent_array) {
		var tbody_absent = document.getElementById("absent_table");
		var tbody_present = document.getElementById("present_table");
		tbody_absent.innerHTML = '';
		tbody_present.innerHTML = '';
		
		this.buildRows(tbody_present, present_array);
		this.buildRows(tbody_absent, absent_array);
	}
}

function DatePicker() {
	this.initialPickerLoaded = false;

	$('.datepicker').pickadate({
		selectMonths: true, // Creates a dropdown to control month
		selectYears: 5, // Creates a dropdown of 15 years to control year
		closeOnSelect: true,
		closeOnClear: true,
		onSet: function() {
			this.close(true);
			if (this.initialPickerLoaded) {
				slider.buildTimes();
				slider.addRadioUpdater();
				slider.updateCurrentTime();
				fireBase.forceUpdate();
			} else {
				this.initialPickerLoaded = true;
			}
		    $(document.activeElement).blur();
		},
		onClose: function() {
		    $(document.activeElement).blur();
		},
		onStart: function() {
			this.set('select', new Date());
		}
	});


	this.readDatePicker = function() {
		var $input = $('.datepicker').pickadate();
		var picker = $input.pickadate('picker');
		return new Date(picker.get('select')["obj"]);
	}
}

function CourseSelector() {
	$('#courses_selector_container').on('change', 'select', function() {
		fireBase.forceUpdate();
	});

	this.updateCourses = function(data) {
		var current_course = document.getElementById("course_select").value;
		var course_list = document.getElementById("course_select");
		course_list.innerHTML = '';
		for (var key in data) {
			var course = data[key];

			var option_element = document.createElement("option");
			option_element.value = course["id"];
			if (course["id"] == current_course) {
				option_element.setAttribute("selected", true);
			}
			option_element.innerHTML = course["name"] + " - Period " + course["period_num"];

			course_list.appendChild(option_element);
		}
		$('select').material_select();
	}

	this.getSelectedCourse = function() {
		return document.getElementById("course_select").value;;
	}

	this.updateCoursePeriod = function(data) {
		var courseList = document.getElementById("course_select");
		var periodNum = slider.getSelectedPeriod();

		courses = data;
		for (var key in courses) {
			var course = courses[key];
			if (course["period_num"] == periodNum) {
				for (var i = 0; i < courseList.length; i++) {
					if (courseList[i].value == course["id"]) {
						courseList[i].setAttribute("selected", true);
						$('select').material_select();
					}
				}
			}
		}
	}
}

function Slider() {

	this.periodNumberData = [
		[1, 2, 3, 4, 6, 7],
		[1, 5, 2, 3, 6, 7],
		[4, 5, 2, 6, 7],
		[1, 3, 4, 5, 6, 7],
		[2, 3, 4, 5, 1]
	]

	this.periodTimeData = {
		"default": [
			["8:00", "8:55", "hour1"],
			["8:55", "9:50", "hour2"],
			["10:10", "11:05", "hour3"],
			["11:05", "12:05", "hour4"],
			["12:50", "13:50", "hour5"],
			["13:50", "14:45", "hour6"]],
		"wednesday": [
			["8:55", "9:50", "hour1"],
			["10:10", "11:05", "hour2"],
			["11:05", "12:05", "hour3"],
			["12:50", "13:50", "hour4"],
			["13:50", "14:45", "hour5"]],
		"friday": [
			["8:00", "8:55", "hour1"],
			["8:55", "9:50", "hour2"],
			["10:10", "11:05", "hour3"],
			["11:05", "12:05", "hour4"],
			["12:05", "13:00", "hour5"],
		]
	}


	this.buildTimes = function() {
		var dayOfWeek = datePicker.readDatePicker().getDay() - 1;
		if (dayOfWeek < 0 || dayOfWeek > 4){
			dayOfWeek = 0;
		} 
		if (dayOfWeek == 2) {
			var timeData = this.periodTimeData["wednesday"];
		} else if (dayOfWeek == 4) {
			var timeData = this.periodTimeData["friday"];
		} else {
			var timeData = this.periodTimeData["default"];
		}
		var numberData = this.periodNumberData[dayOfWeek];

		var timeRadio = document.getElementById("timeRadio");
		timeRadio.innerHTML = "";
		for (var i = 0; i < numberData.length; i++) {
			var radio = document.createElement('p');
			var input = document.createElement('input');
			var label = document.createElement('label');
			input.type = "radio";
			input.className = "with-gap";
			input.name = "time";
			input.id = timeData[i][2];
			input.value = '["'+timeData[i][0]+'","'+timeData[i][1]+'"]';
			input.setAttribute('period', numberData[i]);

			label.setAttribute('for',timeData[i][2]);
			label.innerHTML = "Period " + numberData[i] + ": " + this.formatTime(timeData[i][0]) + " - " + this.formatTime(timeData[i][1])
			radio.appendChild(input);
			radio.appendChild(label);
			timeRadio.appendChild(radio);
			// periodData[i]
		}
		document.getElementById("custom-slider").removeAttribute("hidden");

	}

	this.formatTime = function(time) {
		end = "AM"
		h = parseInt(time.split(":")[0]),
			m = (parseInt(time.split(":")[1]) < 10 ? '0' : '') + parseInt(time.split(":")[1]);
		if (h > 12) {
			h -= 12;
			end = "PM "
		}
		return h + ':' + m + " " + end;
	}

	this.dateSlider = document.getElementById("sliderTime");

	noUiSlider.create(this.dateSlider, {
		// Create two timestamps to define a range.
		range: {
			min: new Date(0, 0, 0, 0, 0, 0).getTime(),
			max: new Date(0, 0, 0, 23, 59, 0).getTime()
			// min: new Date(0, 0, 0, 7, 30, 0).getTime(),
			// max: new Date(0, 0, 0, 15, 15, 0).getTime()
		},
		connect: true,
		// Steps of one week
		step: 5 * 60 * 1000,
		tooltips: [false, false],
		// Two more timestamps indicate the handle starting positions.
		start: [new Date(0, 0, 0, 8, 0, 0).getTime(), new Date(0, 0, 0, 14, 45, 0).getTime()],
		// start: [new Date(0, 0, 0, 0, 0, 0).getTime(), new Date(0, 0, 0, 5, 30, 0).getTime()],
		// No decimals
		format: wNumb({
			decimals: 0
		}),
	});

	this.dateValues = [
		document.getElementById('event-start'),
		document.getElementById('event-end')
	];

	this.times = [
		["8:00", "8:55", "hour1"],
		["8:55", "9:50", "hour2"],
		["9:50", "11:05", "hour3"],
		["11:05", "12:05", "hour4"],
		["12:05", "13:50", "hour5"],
		["13:50", "14:45", "hour6"]
	]



	this.formatDate = function(date) {
		end = "AM"
		h = date.getHours(),
			m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
		if (h > 12) {
			h -= 12;
			end = "PM "
		}
		return h + ':' + m + " " + end;
	}

	this.rawFormatDate = function(date) {
		h = date.getHours();
		m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
		return h + ':' + m;
	}

	this.getSelectedTime = function() {
		var all_times = document.getElementsByName('time');
		var time_value;
		for (var i = 0; i < all_times.length; i++) {
			if (all_times[i].checked) {
				time_value = all_times[i].value;
				break;
			}
		}
		return JSON.parse(time_value);
	}

	this.getSelectedPeriod = function() {
		var all_times = document.getElementsByName('time');

		var period_value;
		for (var i = 0; i < all_times.length; i++) {
			if (all_times[i].checked) {
				period_value = all_times[i].getAttribute('period');
				break;
			}
		}
		return period_value;

	}

	this.updateCurrentTime = function() {
		for (var i = 0; i < this.times.length; i++) {
			if (this.checkBetweenTimes(this.times[i])) {
				document.getElementById(this.times[i][2]).checked = true;
				break;
			} else {
				document.getElementById("hour7").checked = true;
			}
		}
	}

	this.checkBetweenTimes = function(timeArray) {
		var startTime = timeArray[0];
		var endTime = timeArray[1];
		var currentDate = datePicker.readDatePicker();
		var newDate = new Date();
		currentDate.setHours(newDate.getHours());
		currentDate.setMinutes(newDate.getMinutes());

		var startDate = datePicker.readDatePicker();
		startDate.setHours(startTime.split(":")[0]);
		startDate.setMinutes(startTime.split(":")[1]);

		var endDate = datePicker.readDatePicker();
		endDate.setHours(endTime.split(":")[0]);
		endDate.setMinutes(endTime.split(":")[1]);
		return startDate < currentDate && endDate >= currentDate;
	}

	this.addRadioUpdater = function() {
		var radio = document.getElementsByName("time");
		var prev = null;
		for (var i = 0; i < radio.length; i++) {
			radio[i].onclick = function() {
				// (prev)? console.log(prev.value):null;
				if (this !== prev) {
					prev = this;
				}
				fireBase.forceUpdate()
			};
		}
	}

	this.dateSlider.noUiSlider.slider = this;

	this.dateSlider.noUiSlider.on('start', function(values, handle) {
		document.getElementById("hour7").checked = true;
	});

	this.dateSlider.noUiSlider.on('end', function(values, handle) {
		fireBase.forceUpdate();
	});

	this.dateSlider.noUiSlider.on('update', function(values, handle) {
		this.slider.dateValues[handle].innerHTML = this.slider.formatDate(new Date(+values[handle]));
		document.getElementById('hour7').value = '["' + this.slider.rawFormatDate(new Date(+values[0])) + '", "' + this.slider.rawFormatDate(new Date(+values[1])) + '"]';
	});

}



