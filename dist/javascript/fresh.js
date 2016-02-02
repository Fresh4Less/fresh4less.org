/*Fresh4Less.org - Fresh4Less [ Elliot Hatch, Samuel Davidson ]*/

/* ===========================================================
 * This code is based on the work by Jason Brown (Loktar00)
 * https://github.com/loktar00/JQuery-Snowfall
 * http://www.thepetedesign.com
 * ========================================================== */

function initSnowCanvas(window) {
var snowCanvas = document.getElementById("snow-canvas");
letItSnow(snowCanvas, {
	speed: 0,
	interaction: true,
	size: 2,
	count: 200,
	opacity: 0,
	color: "#ffffff",
	windPower: 0,
	image: false
});

//var defaults = {
	//speed: 0,
	//interaction: true,
	//size: 2,
	//count: 200,
	//opacity: 0,
	//color: "#ffffff",
	//windPower: 0,
	//image: false
//};

function letItSnow(canvas, options, isCopy) {
	//var settings = $.extend({}, defaults, options),
	var settings = options;
	var flakes = [];
	var ctx = canvas.getContext("2d");
	var flakeCount = settings.count;
	var mX = -100;
	var mY = -100;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	if(isCopy !== true) {
		(function() {
			var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
		window.requestAnimationFrame = requestAnimationFrame;
		})();
	}

	function snow() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < flakeCount; i++) {
			var flake = flakes[i],
				x = mX,
				y = mY,
				minDist = 100,
				x2 = flake.x,
				y2 = flake.y;

			var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
				dx = x2 - x,
				dy = y2 - y;

			if (dist < minDist) {
				var force = minDist / (dist * dist),
					xcomp = (x - x2) / dist,
						  ycomp = (y - y2) / dist,
						  deltaV = force / 2;

				flake.velX -= deltaV * xcomp;
				flake.velY -= deltaV * ycomp;

			} else {
				flake.velX *= 0.98;
				if (flake.velY <= flake.speed) {
					flake.velY = flake.speed;
				}

				switch (settings.windPower) { 
					case false:
						flake.velX += Math.cos(flake.step += 0.05) * flake.stepSize;
						break;

					case 0:
						flake.velX += Math.cos(flake.step += 0.05) * flake.stepSize;
						break;

					default: 
						flake.velX += 0.01 + (settings.windPower/100);
				}
			}

			var s = settings.color;
			var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
			var matches = patt.exec(s);
			var rgb = parseInt(matches[1], 16)+","+parseInt(matches[2], 16)+","+parseInt(matches[3], 16);


			flake.y += flake.velY;
			flake.x += flake.velX;

			if (flake.y >= canvas.height || flake.y <= 0) {
				reset(flake);
			}


			if (flake.x >= canvas.width || flake.x <= 0) {
				reset(flake);
			}
			if (settings.image === false) {
				ctx.fillStyle = "rgba(" + rgb + "," + flake.opacity + ")";
				ctx.beginPath();
				ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
				ctx.fill();
			} else {

				//ctx.drawImage($("img#lis_flake").get(0), flake.x, flake.y, flake.size * 2, flake.size * 2);
				//ctx.drawImage($("img#lis_flake").get(0), flake.x, flake.y, flake.size * 2, flake.size * 2);
			}

		}
		requestAnimationFrame(snow);
	}


	function reset(flake) {

		if (settings.windPower === false || settings.windPower === 0) {
			flake.x = Math.floor(Math.random() * canvas.width);
			flake.y = 0;
		} else {
			var xarray;
			var yarray;
			var allarray;
			var selected_array;
			if (settings.windPower > 0) {
				xarray = Array(Math.floor(Math.random() * canvas.width), 0);
				yarray = Array(0, Math.floor(Math.random() * canvas.height));
				allarray = Array(xarray, yarray);

				selected_array = allarray[Math.floor(Math.random()*allarray.length)];

				flake.x = selected_array[0];
				flake.y = selected_array[1];
			} else {
				xarray = Array(Math.floor(Math.random() * canvas.width),0);
				yarray = Array(canvas.width, Math.floor(Math.random() * canvas.height));
				allarray = Array(xarray, yarray);

				selected_array = allarray[Math.floor(Math.random()*allarray.length)];

				flake.x = selected_array[0];
				flake.y = selected_array[1];
			}
		}

		flake.size = (Math.random() * 3) + settings.size;
		flake.speed = (Math.random() * 1) + settings.speed;
		flake.velY = flake.speed;
		flake.velX = 0;
		flake.opacity = (Math.random() * 0.5) + settings.opacity;
	}
	function init() {
		for (var i = 0; i < flakeCount; i++) {
			var x = Math.floor(Math.random() * canvas.width),
				y = Math.floor(Math.random() * canvas.height),
				  size = (Math.random() * 3)  + settings.size,
				  speed = (Math.random() * 1) + settings.speed,
				  opacity = (Math.random() * 0.5) + settings.opacity;

			flakes.push({
				speed: speed,
				velY: speed,
				velX: 0,
				x: x,
				y: y,
				size: size,
				stepSize: (Math.random()) / 30,
				step: 0,
				angle: 180,
				opacity: opacity
			});
		}

		snow();
	}

	//if (settings.image != false) {
		//$("<img src='"+settings.image+"' style='display: none' id='lis_flake'>").prependTo("body")
	//}

	init();

	if(isCopy !== true) {
	var resizeTimer = null;
		window.addEventListener('resize', function(e) {
			if(resizeTimer) clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function() {
				letItSnow(canvas, settings, true);
			}, 200);
		});
	}

	if (isCopy !== true && settings.interaction === true) {
		canvas.addEventListener("mousemove", function(e) {
			mX = e.clientX;
			mY = e.clientY;
		});
	}
}
}

;

function initWinterJam2015(window, jamEndDate, votingEndDate) {
	// countdown timer
	var jamTimeRemainingElem = $('#jam-time-remaining');
	var jamDaysElem = jamTimeRemainingElem.find('.jam-days');
	var jamHoursElem = jamTimeRemainingElem.find('.jam-hours');
	var jamMinutesElem = jamTimeRemainingElem.find('.jam-minutes');
	var jamSecondsElem = jamTimeRemainingElem.find('.jam-seconds');
	var jamPhase = 'jam'; //other values: vote, end

	//var jamEnd = new Date("2016-01-18T00:00:00.0-07:00");
	//var votingEnd = new Date("2016-02-00T00:00:00.0-07:00");
	//var jamEnd = new Date();
	//jamEnd.setTime(jamEnd.getTime() + 1000);
	//var votingEnd = new Date();
	//votingEnd.setTime(votingEnd.getTime() + 1600000);
	//votingEndDate.setTime(new Date().getTime() + 2000);

	updateCounter();
	var counterUpdate = setInterval(updateCounter, 1000);
	function updateCounter() {
		var now = new Date();
		var milliseconds = null;
		if(jamPhase === 'jam') {
			milliseconds = Math.floor(jamEndDate - now);
			if(milliseconds < 0) {
				jamPhase = 'vote';
				$('.join-jam-button').css('display', 'none');
				$('.vote-button').css('display', 'block');
				$('.jam-time-remaining-label').text('Voting time remaining:');
				$('.time-remaining').addClass('voting');
			}
		}
		if(jamPhase === 'vote') {
			milliseconds = Math.floor(votingEndDate - now);
			if(milliseconds < 0) {
				jamPhase = 'end';
				$('.vote-button').css('display', 'none');
				jamTimeRemainingElem.html('<h1>THE JAM HAS ENDED, SEE YOU IN JUNE!</h1>');
				jamTimeRemainingElem.addClass('ended');
				$('.jam-results').css('display', 'block');
				window.clearInterval(counterUpdate);
			}
		}
		if(milliseconds === null) {
			return;
		}

		var seconds = (milliseconds / 1000) | 0;
		milliseconds -= seconds * 1000;

		var minutes = (seconds / 60) | 0;
		seconds -= minutes * 60;

		var hours = (minutes / 60) | 0;
		minutes -= hours * 60;

		var days = (hours / 24) | 0;
		var hours2 = hours - days * 24;

		jamDaysElem.text(days);
		jamHoursElem.text(hours2);
		jamMinutesElem.text(minutes);
		jamSecondsElem.text(seconds);
	}

	function padZeroes(num, size) {
		var s = "000000000" + num;
		return s.substr(s.length-size);
	}

	// participants
	var jamSubmissionDuration = 24*60*60*1000; //milliseconds
	var participantsTable = $('.jam-participants-table');
	var participants = null;
	var uploadUsername = null;
	$.ajax({
		type: 'GET',
		url: '/api/winter-jam-2015/users'})
		.success(function(data, textStatus) {
			participants = data.map(function(p) {
				p.beginDate = new Date(p.beginDate); //convert string to date
				p.endDate = new Date(p.beginDate);
				p.endDate.setTime(p.beginDate.getTime() + jamSubmissionDuration);
				return p;
			});
			data.forEach(function(p) {
				participantsTable.find('tbody:last-child').append(makeParticipantsTableRow(p.name));
			});
			updateParticipantCounters();
			setInterval(updateParticipantCounters, 1000);
		})
		.fail(function(jqXHR) {
			$('#participants-error-message').text('Error: ' + jqXHR.responseText);
		});

	function makeParticipantsTableRow(name) {
		var tableRow = $('<tr><td class="jam-participant-name">' + name +
			'</td><td class="jam-participant-time"></td><td class="jam-participant-action"></td></tr>');
		var uploadButton = $('<button>Upload</button>').click(function() {uploadUsername = name; enableModal($('.upload-modal'));});
		tableRow.find('.jam-participant-action').append(uploadButton);
		return tableRow;
	}

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
						$(this).find('td.jam-participant-time').text(padZeroes(hours, 2) + ':' + padZeroes(minutes, 2) + ':' + padZeroes(seconds, 2));
					}
					else {
						$(this).addClass('jam-time-over');
						$(this).find('td.jam-participant-time').text('00:00:00');
						$(this).find('td.jam-participant-action').children().first().replaceWith($('<button>Download</button>')
							.click(function() {downloadSubmission(participants[i].name);}));
					}
				}
			});
		}
	}

	// modals
	$('.join-jam-button').click(function() {enableModal($('.join-jam-modal'));});
	$('.vote-button').click(function() {enableModal($('.vote-modal'));});
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
				var p = { name: data.name, beginDate: new Date() };
				p.endDate = new Date(p.beginDate);
				p.endDate.setTime(p.beginDate.getTime() + jamSubmissionDuration);
				participants.unshift(p);
				participantsTable.find('tbody').prepend(makeParticipantsTableRow(p.name));
				var joinJamSuccessElem = $('.join-jam-success');
				joinJamForm.css('display', 'none');
				joinJamSuccessElem.find('.secret-code').text(data.secretCode);
				joinJamSuccessElem.css('display', 'block');
				centerModalContent();

			},
			function(jqXHR) {
				joinJamErrorMessage.text('Error: ' + jqXHR.responseText);
			}));

	var uploadForm = $('.upload-form');
	var uploadSuccessMessage = uploadForm.find('.success-message');
	var uploadErrorMessage = uploadForm.find('.error-message');

	uploadForm.submit(function(e) {
		e.preventDefault();
		uploadErrorMessage.text('');
		uploadSuccessMessage.text('Uploading...');
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
				uploadErrorMessage.text('Error: ' + jqXHR.responseText);
			});
	});

	//var voteForm = #('.vote-form');
	//voteFormErrorMessage = voteForm.find('.error-message');

	function downloadSubmission(username) {
		window.location.href = '/api/winter-jam-2015/users/' + username + '/submission';
	}

	function enableModal(modal) {
		modal.fadeIn(400);
		centerModalContent(modal);
	}
	function disableModal(modal) {
		modal.fadeOut(400);
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
