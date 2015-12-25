
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

	// participants
	var participantsTable = $('.jam-participants-table');
	var participants = null;
	var uploadUsername = null;
	$.ajax({
		type: 'GET',
		url: '/api/winter-jam-2015/users'})
		.success(function(data, textStatus) {
			participants = data.map(function(p) {
				p.beginDate = new Date(p.beginDate);
				p.endDate = new Date(p.beginDate);
				p.endDate.setTime(p.beginDate.getTime() + 24*60*60*1000);
				return p;
			});
			data.forEach(function(p) {
			participantsTable.find('tbody:last-child').append(
				$('<tr><td class="jam-participant-name">' + p.name +
				'</td><td class="jam-participant-time"></td><td class="jam-participant-action"><button>Upload</button></td></tr>')
				.click(function() {uploadUsername = p.name; enableModal($('.upload-modal'));}));
			});
			updateParticipantCounters();
			setInterval(updateParticipantCounters, 100);
		})
		.fail(function(jqXHR) {
			$('#participants-error-message').text(jqXHR.responseText);
		});

	function updateParticipantCounters() {
		if(participants) {
			var now = new Date();
			participantsTable.find('tbody').find('tr').each(function(i) {
				if(!$(this).hasClass('jam-time-over')) {
					var milliseconds = Math.floor(participants[i].endDate - now);
					if(milliseconds > 0) {
						var seconds = (milliseconds / 1000) | 0;
						milliseconds -= seconds * 1000;

						var minutes = (seconds / 60) | 0;
						seconds -= minutes * 60;

						var hours = (minutes / 60) | 0;
						minutes -= hours * 60;
						$(this).find('td.jam-participant-time').text(hours + ':' + minutes + ':' + seconds);
					}
					else {
						$(this).addClass('jam-time-over');
						$(this).find('td.jam-participant-time').text('00:00:00');
						$(this).find('td.jam-participant-action').html('<button>Download</button>');
					}
				}
			});
		}
	}

	// modals
	$('.join-jam-button').click(function() {enableModal($('.join-jam-modal'));});
	$('.modal').click(function(e) {
		if(this === e.target) {
			disableModal($(this));
		}
	});

	$(window).resize(centerModalContent);

	function centerModalContent() {
		$('.modal').each(function(i) {
			var modal = $(this);
			if(modal.css('display') === 'none') {
				return;
			}
			var modalContent = modal.find('.modal-content');
			if(window.innerHeight - modalContent.height() > 500) {
				modalContent.css('top', window.innerHeight / 3 - modalContent.height() / 2);
			}
			else {
				modalContent.css('top', window.innerHeight / 2 - modalContent.height() / 2);
			}
			modalContent.css('left', window.innerWidth / 2 - modalContent.width() / 2);
		});
	}

	var joinJamForm = $('.join-jam-form');
	var joinJamErrorMessage = joinJamForm.find('.error-message');
	joinJamForm.submit(
		makeSubmitFormAsJson(
			function(data, textStatus) {
				var joinJamSuccessElem = $('.join-jam-success');
				joinJamForm.css('display', 'none');
				joinJamSuccessElem.find('.secret-code').text(data.secretCode);
				joinJamSuccessElem.css('display', 'block');
				centerModalContent();

			},
			function(jqXHR) {
				joinJamErrorMessage.text(jqXHR.responseText);
			}));

	var uploadForm = $('.upload-form');
	var uploadSuccessMessage = uploadForm.find('.success-message');
	var uploadErrorMessage = uploadForm.find('.error-message');

	uploadForm.submit(function(e) {
		e.preventDefault();
		var formData = new FormData(this);
		$.ajax({
			url: '/api/winter-jam-2015/users/' + uploadUsername + '/submission',
			type: 'POST',
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		})
		.success(function(data, textStatus) {
			uploadErrorMessage.text('');
			uploadSuccessMessage.text('Upload successful!');
			})
		.fail(function(jqXHR) {
				uploadSuccessMessage.text('');
				uploadErrorMessage.text(jqXHR.responseText);
			});
	});

	function enableModal(modal) {
		modal.css('display', 'block');
		centerModalContent(modal);
	}
	function disableModal(modal) {
		modal.css('display', 'none');
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
