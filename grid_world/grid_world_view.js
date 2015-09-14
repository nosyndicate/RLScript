//MODULE PATTERN
var Mountain_car = Mountain_car||{};


//view class (object) under taxi module
Mountain_car.view = (function() {
	"use strict";
	
	var canvas;
	var ctx;
	var info;
	
	var lower = Mountain_car.world.getCarMinPosition;
	var upper = Mountain_car.world.getCarMaxPosition;
	var resolution = -1;
	var base = 250, scale = 120;

	
	// functions
	function initializeView() {
		canvas = $("#car").get(0);
		ctx = canvas.getContext("2d");
	
		info = $("#info").get(0);
		
		
		// for each pixel on the canvas, what is the increment we need for our curve
		resolution = (upper-lower)/canvas.width;
		
	}
	
	
	function drawSlope(width, height) {
		// alway use beginPath, otherwise the canvas can be very slow
		ctx.beginPath();
		ctx.strokeStyle="grey";
		
		var p = lower;
		
		// first draw the "mountain"
		// position on the canvas
		var x = 0, y = -Math.sin(3*p) * scale + base; 
		ctx.moveTo(x,y);
		for(var i = 0; i<width; i++){
		    x = i;
		    // y value is bigger for lower pixel on the screen, thus we need negative value here
		    // use the scale and base to adjust the location on the screen 
		    y = -Math.sin(3*p) * scale + base; 
		    p += resolution;
		     
		    ctx.lineTo(x,y);
		}
		ctx.stroke();
		
		ctx.beginPath();
		// then draw the goal position
		var goalPosition = Mountain_car.world.getGoalPosition;
		x = (goalPosition - lower) / resolution;
		y = -Math.sin(3*goalPosition) * scale + base;
		
		ctx.moveTo(x,y-10);
		ctx.lineTo(x,y+10);
		ctx.stroke();
	}
	
	function drawCar(position) {
		
		var x = (position - lower) / resolution;
		var y = -Math.sin(3*position) * scale + base;
		
		var radius = 6;
		ctx.fillStyle = "red";
		
		ctx.beginPath();
		ctx.arc(x,y,radius,0,2*Math.PI);
		ctx.closePath();
		ctx.fill();
	}
	
	function drawBackground(){
		var width = canvas.width;
		var height = canvas.height;
		
		drawSlope(width, height);
	}


	function updatePosition(position) {
		// first clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		drawBackground();
		drawCar(position);
	}

	function initGame(agent) {
		Mountain_car.world.init(agent);
		updatePosition(Mountain_car.world.getCarPosition());
	}

	function nextStep() {
		// make one step
		Mountain_car.world.update();
		
		// update the view
		updatePosition(Mountain_car.world.getCarPosition());
		updateInfo();
	}
	
	function updateInfo() {
		info.innerHTML = "iteration:"+Mountain_car.world.getIteration();
	}
	
	
	// public method
	return {
		nextStep:nextStep,
		initializeView:initializeView,
		initGame:initGame,
		drawBackground:drawBackground,
		drawCar:drawCar
	};
}());








