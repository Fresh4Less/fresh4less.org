
function initWinterJam2015(window) {
	// countdown timer
	var jamTimeRemainingElem = window.document.getElementById('jam-time-remaining');
	var jamDaysElem = null;
	var jamHoursElem = null;
	var jamMinutesElem = null;
	var jamSecondsElem = null;
	for(var i = 0; i < jamTimeRemainingElem.childNodes.length; i++) {
		var node = jamTimeRemainingElem.childNodes[i];
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
	//var end = new Date();
	//end.setTime(end.getTime() + 2000);

	updateCounter();
	var counterUpdate = setInterval(updateCounter, 1000);
	function updateCounter() {
		var now = new Date();
		var milliseconds = Math.floor(end - now);
		if(milliseconds < 0) {
			window.clearInterval(counterUpdate);
			jamTimeRemainingElem.textContent = 'THE JAM HAS ENDED, SEE YOU IN JUNE!';
			jamTimeRemainingElem.className = jamTimeRemainingElem.className + ' ended';
			$('.join-jam-button').css('display', 'none');
		}
		else {
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
	}
	function padZeroes(num, size) {
		var s = "000000000" + num;
		return s.substr(s.length-size);
	}

	// modal
	$('.join-jam-button').click(enableJamModal);
	var joinJamModal = $('.join-jam-modal');
	var joinJamModalContent = joinJamModal.find('.modal-content');
	joinJamModal.click(function(e) {
		if(this === e.target) {
			disableJamModal();
		}
	});
	joinJamModalContent.css('top', window.innerHeight / 3 - joinJamModalContent.height() / 2);
	joinJamModalContent.css('left', window.innerWidth / 2 - joinJamModalContent.width() / 2);

	var joinJamForm = $('.join-jam-form');
	joinJamForm.submit(
		makeSubmitFormAsJson(
			function(data, textStatus) {
				console.log('success!', data, textStatus);
				var joinJamSuccessElem = $('.join-jam-success');
				joinJamForm.css('display', 'none');
				joinJamSuccessElem.find('.secret-code').text(data.secretCode);
				joinJamSuccessElem.css('display', 'block');

			},
			function(jqXHR) {
				console.log('fail :(');
				console.log(jqXHR);
				console.log(jqXHR.statusText);
				console.log(jqXHR.responseText);
			}));

	function enableJamModal() {
		joinJamModal.css('display', 'block');
	}
	function disableJamModal() {
		joinJamModal.css('display', 'none');
	}
	function makeSubmitFormAsJson(onSuccess, onFail) {
		return function(e) {
			submitFormAsJson(e)
				.success(onSuccess)
				.fail(onFail);
		};
	}

	function submitFormAsJson(e) {
		e.preventDefault();
		var formElem = $(e.target);
		var payload = formElem.serializeArray().reduce(function(obj, entry) {
			obj[entry.name] = entry.value;
			return obj;
		}, {});
		return $.ajax({
			type: formElem.attr('method'),
			url: formElem.attr('action'),
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(payload)});
	}
}
