//MODULE PATTERN
var Mountain_car = Mountain_car||{}; // define Taxi namespace

//state class (object) under taxi module
Mountain_car.world = (function() {
	
	"use strict";
	var workingAgent;
	var position = -0.5;
	var velocity = 0;
	var carLastAction = 1;
	
	var carMinPosition = -1.2;
	var carMaxPosition = 0.6;
	var carMaxVelocity = 0.07;
	var carGoalPosition = 0.5;
	
	var randomStart = false;
	var iterationCounter = 0;
	var endGame = false;
	
	// define the possible action for the agent
	var actionSet = [
		"backward",
		"still",
		"forward"
	];
	
	function restartGame() {
		// start a new game, set the flag
		endGame = false;
		
    	// initialize the game, set the position and velocity of agent
		if(!randomStart) {
			position = -0.5;
			velocity = 0.0;
		}
    	//console.log(x+","+y+","+passenger+","+des);

    	// set the status for the agent
    	//workingAgent.updateCurrentState(car_position, car_velocity);
		
    	
	}
	
	function update() {
		iterationCounter++;
    	var action = workingAgent.getAction();
    	var reward = processAction(action);
    	workingAgent.updateCurrentState(position, velocity);
    	workingAgent.updatePolicy(reward, endGame);
    	
    	// if the game is ended, we start a new one
    	if(endGame)
    	{
    		restartGame();
    	}
	}
	
	function limit_range(value, limit) {
		return limit_range2(value, -limit, limit);
	}
	
	function limit_range2(value, lower, upper) {
		return Math.max(Math.min(value, upper), lower);
	}

	function processAction(action) {

		
		var regular = -1;
		var direction = -1;
		//console.log(actionSet[action]);
		switch(actionSet[action])
		{
			case "backward":
				direction = -1;
				break;
			case "still":
				direction = 0;
				break;
			case "forward":
				direction = 1;
				break;
			default:
				console.error("This should never happen");
		}
		var temp = velocity + 0.001 * direction - 0.0025 * Math.cos(3*position);
		velocity = limit_range(temp, carMaxVelocity);
		temp = position + velocity;
		position = limit_range2(temp, carMinPosition, carMaxPosition);
		
		if((position===carMinPosition)&&(velocity < 0)) {
			velocity = 0;
		}
		
		if(position >= carGoalPosition)
			endGame = true;
		
		return regular;
	}


	function getCarPosition() {
		return position;
	}
	

	function init(agent) {
		workingAgent = agent;
		iterationCounter = 0;
		restartGame();
		agent.initAgent();
	}
	

	
	
	function getIteration() {
		return iterationCounter;
	}
	
	
	// public methods
    return {
		init:init,
		update:update,
		getIteration:getIteration,
		getCarPosition:getCarPosition,
		getCarMinPosition:carMinPosition,
		getCarMaxPosition:carMaxPosition,
		getGoalPosition:carGoalPosition
    };

    
}());




