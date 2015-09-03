//MODULE PATTERN
var Taxi = Taxi||{};


//view class (object) under taxi module
Taxi.view = (function() {
	"use strict";
	
	var canvas;
	var ctx;
	var info;
	var blockWidth = 0,
		blockHeight = 0,
		passenger = {
			x:-1,
			y:-1, 
			radius:25,
			goalX:-1,
			goalY:-1
		};
	


	
	// functions
	function initializeView() {
		canvas = $("#taxi").get(0);
		ctx = canvas.getContext("2d");
		
		info = $("#info").get(0);
	}
	
	
	function drawBackground(){
		blockWidth = canvas.width/5;
		blockHeight = canvas.height/5;

		// add the four color place
		// red
		ctx.fillStyle = "rgb(255,0,0)";
		ctx.fillRect (0*blockWidth, 0*blockHeight, blockWidth, blockHeight);

		// green
		ctx.fillStyle = "rgb(0,255,0)";
		ctx.fillRect (4*blockWidth, 0*blockHeight, blockWidth, blockHeight);

		// yellow
		ctx.fillStyle = "rgb(255,255,0)";
		ctx.fillRect (0*blockWidth, 4*blockHeight, blockWidth, blockHeight);

		// blue
		ctx.fillStyle = "rgb(0,0,255)";
		ctx.fillRect (3*blockWidth, 4*blockHeight, blockWidth, blockHeight);

		// draw the wall 
		ctx.fillStyle = "rgb(255,255,255)";

		// first
		drawLine(ctx, 2*blockWidth, 0, 2*blockWidth, 2*blockWidth);
		drawLine(ctx, 1*blockWidth, 3*blockHeight, 1*blockWidth, 5*blockHeight);
		drawLine(ctx, 3*blockWidth, 3*blockHeight, 3*blockWidth, 5*blockHeight);
	}

	function drawLine(ctx, start_x, start_y, end_x, end_y) {
		ctx.beginPath();
		ctx.moveTo(start_x,start_y);
		ctx.lineTo(end_x,end_y);
		ctx.closePath();
		ctx.stroke();
	}

	function movement() {
		//console.log(passenger);
		var diffX = passenger.goalX - passenger.x;
		var diffY = passenger.goalY - passenger.y;

		//console.log("diffX and diffY are "+ diffX + "," + diffY);

		// if we are at the position, we stop
		if(diffX===0&&diffY===0)
			return;

		var speed = 12.5;

		// move 5 pixels
		var addX = diffX===0?0:(diffX>0?1:-1)*speed;
		var addY = diffY===0?0:(diffY>0?1:-1)*speed;
		passenger.x += addX;
		passenger.y += addY;

		ctx.clearRect(0,0,canvas.width,canvas.height);
		drawBackground();
		drawCircle(passenger.x, passenger.y, passenger.radius, true);

		// why this works?
		window.setTimeout( function() { VIEW.movement(); }, 50);
		// and this not working?
		// window.setTimeout(VIEW.movement(), 2000);
	}

	function drawPassenger(x, y) {		
		// convert the x, y location in grid world into the grid of canvas
		var goalX = x*blockWidth+0.5*blockWidth;
		var goalY = y*blockHeight+0.5*blockHeight;

		passenger.x = goalX;
		passenger.y = goalY;
		
		drawCircle(passenger.x, passenger.y, passenger.radius, true, "black");
	}
	
	/*
	function drawPassenger(x, y) {
		console.log("drawPassenger");
		console.log("x is "+x+", and y is "+y);
		
		var goalX = x*blockWidth+0.5*blockWidth;
		var goalY = y*blockHeight+0.5*blockHeight;
		// first time draw the passenger
		if(passenger.x===-1&&passenger.y===-1) {
			console.log("first time drawing");
			// convert the x, y location in grid world into the grid of canvas
			passenger.x = goalX;
			passenger.y = goalY;
			drawCircle(passenger.x, passenger.y, passenger.radius, true, "black");
		}
		else { // moving use animation
			console.log("not first time drawing");
			passenger.goalX = goalX;
			passenger.goalY = goalY;
			movement();
		}
	}*/

	function drawDestination(x,y){
		var centerX = x*blockWidth+0.5*blockWidth;
		var centerY = y*blockHeight+0.5*blockHeight;

		darwT(centerX, centerY);
	}

	function darwT(x, y) {
		ctx.font = "96px serif";
		ctx.fillStyle = "purple";
		// adjust the location of letter T
		var offsetX = -30;
		var offsetY = 30;
		ctx.fillText("T", x+offsetX, y+offsetY); 		
	}

	function drawCircle(x, y, r, filled, color) {
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.arc(x,y,r,0,2*Math.PI);
		ctx.closePath();
		if(filled)
			ctx.fill();
		else
			ctx.stroke();
	}

	function drawTaxi(x, y) {
		// convert the x, y location in grid world into the grid of canvas
		var centerX = x*blockWidth+0.5*blockWidth;
		var centerY = y*blockHeight+0.5*blockHeight;
		var radius = 40;

		drawCircle(centerX, centerY, radius, false, "black");
	}

	function reset() {
		passenger.x = -1;
		passenger.y = -1;
		passenger.goalX = -1;
		passenger.goalY = -1;
	}

	function updateStatus(status) {
		// first clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		drawBackground();
		drawDestination(status.desX, status.desY);
		drawTaxi(status.x, status.y);
		drawPassenger(status.passengerX, status.passengerY);
	}

	function initGame(agent) {
		Taxi.world.init(agent);
		updateStatus(Taxi.world.getPositionStatus());
	}

	function nextStep() {
		// make one step
		Taxi.world.update();
		
		// update the view
		updateStatus(Taxi.world.getPositionStatus());
		updateInfo();
	}
	
	function updateInfo() {
		info.innerHTML = "iteration:"+Taxi.world.getIteration();
	}
	
	
	// public method
	return {
		nextStep:nextStep,
		initializeView:initializeView,
		initGame:initGame,
		drawBackground:drawBackground,
	};
}());








