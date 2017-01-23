var dateSlider = document.getElementById("sliderTime");

function timestamp(str){
    return new Date(str).getTime();   
}


console.log(new Date(0).getTime())

noUiSlider.create(dateSlider, {
// Create two timestamps to define a range.
  range: {
        min: new Date(0, 0, 0, 7, 0, 0).getTime(),
        max: new Date(0, 0, 0, 15, 0, 0).getTime()
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

dateSlider.noUiSlider.on('update', function( values, handle ) {
  dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
});

dateSlider.noUiSlider.on('start', function( values, handle ){
  document.getElementById("hour7").checked = true;
});

times = [["8:00","8:55", "hour1"],
         ["8:55","9:50", "hour2"],
         ["9:50","11:05", "hour3"],
         ["11:05","12:05", "hour4"],
         ["12:05","13:50", "hour5"],
         ["13:50","14:45", "hour6"]]

console.log(times[0][0])

for (var i = 0; i < times.length; i++) {
  if (checkBetween(times[i])) {
    document.getElementById(times[i][2]).checked = true;
    break;
  }
  document.getElementById("hour7").checked = true;
}

function checkBetween(timeArray) {

  console.log(timeArray)
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





