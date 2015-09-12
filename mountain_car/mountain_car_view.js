//MODULE PATTERN
var Mountain_car = Mountain_car||{};


//view class (object) under taxi module
Mountain_car.view = (function() {
	"use strict";
	
	var canvas;
	var ctx;
	var info;
	
	
	// functions
	function initializeView() {
		canvas = $("#car").get(0);
		ctx = canvas.getContext("2d");
		
		info = $("#info").get(0);
	}
	
	
	function drawSlope() {
		
	}
	
	function drawBackground(){
		drawSlope();
	}


	function updatePosition(position) {
		// first compute the height
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
	};
}());








