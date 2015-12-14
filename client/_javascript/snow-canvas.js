/* ===========================================================
 * This code is based on the work by Jason Brown (Loktar00)
 * https://github.com/loktar00/JQuery-Snowfall
 * http://www.thepetedesign.com
 * ========================================================== */

(function(window) {
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

var defaults = {
	speed: 0,
	interaction: true,
	size: 2,
	count: 200,
	opacity: 0,
	color: "#ffffff",
	windPower: 0,
	image: false
};

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
})(window);

