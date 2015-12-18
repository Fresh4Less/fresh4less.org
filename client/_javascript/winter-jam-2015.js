
function initWinterJam2015(window) {
	var jamTimeRemainingElem = window.document.getElementById('jam-time-remaining');
	var jamDaysElem = null;
	var jamHoursElem = null;
	var jamMinutesElem = null;
	var jamSecondsElem = null;
	for(var i = 0; i < jamTimeRemainingElem.childNodes.length; i++) {
		var node = jamTimeRemainingElem.childNodes[i];
		console.log(node);
		switch(node.className) {
			case 'jam-days':
				jamDaysElem = node;
				break;
			case 'jam-hours':
				jamHoursElem = node;
				break;
			case 'jam-minutes':
				jamMinutesElem = node;
				break;
			case 'jam-seconds':
				jamSecondsElem = node;
				break;
			default:
				break;
		}
	}


	var end = new Date("2016-01-01T00:00:00.0-07:00");

	updateCounter();
	setInterval(updateCounter, 1000);
	function updateCounter() {
		var now = new Date();
		var milliseconds = Math.floor(end - now);
		var seconds = (milliseconds / 1000) | 0;
		milliseconds -= seconds * 1000;

		var minutes = (seconds / 60) | 0;
		seconds -= minutes * 60;

		var hours = (minutes / 60) | 0;
		minutes -= hours * 60;

		var days = (hours / 24) | 0;
		var hours2 = hours - days * 24;

		//var secondsStr = padZeroes(seconds, 2);
		//var minutesStr = padZeroes(minutes, 2);
		//var hoursStr = padZeroes(hours2, 2);

		jamDaysElem.textContent = days;
		jamHoursElem.textContent = hours2;
		jamMinutesElem.textContent = minutes;
		jamSecondsElem.textContent = seconds;
	}
	function padZeroes(num, size) {
		var s = "000000000" + num;
		return s.substr(s.length-size);
	}

}
