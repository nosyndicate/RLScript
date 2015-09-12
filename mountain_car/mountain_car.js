//MODULE PATTERN
var Mountain_car = Mountain_car||{}; // define Taxi namespace

//state class (object) under taxi module
Mountain_car.world = (function() {
	
	"use strict";
	var workingAgent;
	var car_position = -0.5;
	var car_velocity = 0;
	var car_last_action = 1;
	
	var car_min_position = -1.2;
	var car_max_position = 0.6;
	var car_max_velocity = 0.07;
	var car_goal_position = 0.5;
	
	var random_start = false;
	
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
		if(!random_start) {
			car_position = -0.5;
			car_velocity = 0.0;
		}
    	//console.log(x+","+y+","+passenger+","+des);

    	// set the status for the agent
    	//workingAgent.updateCurrentState(car_position, car_velocity);
		
    	
	}
	
	function update() {
		iterationCounter++;
    	var action = workingAgent.getAction();
    	var reward = processAction(action);
    	workingAgent.updateCurrentState(car_position, car_velocity);
    	workingAgent.updatePolicy(reward);
    	
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
			case "still":
				direction = 0;
			case "forward":
				direction = 1;
			default:
				console.error("This should never happen");
		}
		var temp = car_velocity + 0.001 * direction - 0.0025 * Math.cos(3*car_position);
		car_velocity = limit_range(temp, car_max_velocity);
		temp = car_position + car_velocity;
		car_position = limit_range2(temp, car_min_position, car_max_position);
		
		if((car_position===car_min_position)&&(car_velocity < 0)) {
			car_velocity = 0;
		}
		
		if(car_position >= car_goal_position)
			endGame = true;
		
		return regular;
	}


	function getCarPosition() {
		return car_position;
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
		getCarPosition:getCarPosition
    };

    
}());




