var Mountain_car = Mountain_car || {};
Mountain_car.agents = Mountain_car.agents || {};

// define the learner class (object) under TAXI module
Mountain_car.agents.sarsalambda = (function () {
	"use strict";
	
	

	function initAgent(){
		
	}




	function getAction() {
		return Util.math.randomIntFromInterval(0, 2);
	}
	
	// update the current state
	function updateCurrentState(position, velocity) {
	}
	
	
	
	function updatePolicy(reward, endGame) {
		
	}
	
	// define the q learner
    return {
		initAgent:initAgent,
		getAction:getAction,
		updateCurrentState:updateCurrentState,
		updatePolicy:updatePolicy
    };
}());

// register this agent
currentAgent =  Mountain_car.agents.sarsalambda;
