var Taxi = Taxi || {};
Taxi.agents = Taxi.agents || {};

// define the learner class (object) under TAXI module
Taxi.agents.sarsa = (function () {
	"use strict";
	
	var alpha = 0.1;
	var gamma = 1;
	var counter = 0;
	var action = -1;
	
	var initQ = 0;
	// freeze the value of initQ
	Object.freeze(initQ);
	// 
	var qTable = {};
	
	var prevState = new Taxi.world.State(-1,-1,-1,-1);
	var currentState = new Taxi.world.State(-1,-1,-1,-1);
	
	// initialize the q table
	function initializeQTable() {
    	var x,y,p,d;
    	var actions;
    	for(x = 0;x<5;++x){ 
			for(y = 0;y<5;++y) {
				for(p = 0;p<5;++p) {
					for(d = 0;d<4;++d) {
		    			// create a array for new state
		    			actions = [initQ,initQ,initQ,initQ,initQ,initQ];
		    			// add it to the table;
		    			qTable[new Taxi.world.State(x,y,p,d).hashCode()] = actions;
					}
	    		}
			}
    	}
	}

	function initAgent(){
		// first initialize the q-table
		initializeQTable();
		counter = 0;
		
		// then start to pick the first action with respect to this table
		var actionList = qTable[currentState.hashCode()];
		action = Util.rl.epsilonGreedy(actionList, 1/(1+counter));
	}




	function getAction() {
		counter++;
		return action;
	}
	
	// update the current state
	function updateCurrentState(x,y,passengerState,desState) {
		prevState = currentState;
		currentState = new Taxi.world.State(x,y,passengerState,desState);
	}
	
	
	
	function updatePolicy(reward, endGame) {
		//console.log("update policy");
		var value = qTable[prevState.hashCode()][action];
		
		// first sample what's gonna be the next action
		var nextActionList = qTable[currentState.hashCode()];
		var nextAction = Util.rl.epsilonGreedy(nextActionList, 1/(1+counter));

		
		//console.log("old value is "+value);
		var newValue = 0;
		if(endGame){
			newValue = (1-alpha)*value+alpha*reward;
		} else {
			newValue = (1-alpha)*value+alpha*(reward+gamma*qTable[currentState.hashCode()][nextAction]);
		}
		
		
		qTable[prevState.hashCode()][action] = newValue;
		action = nextAction;
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
currentAgent =  Taxi.agents.sarsa;
