var Taxi = Taxi || {};
Taxi.agents = Taxi.agents || {};

// define the learner class (object) under TAXI module
Taxi.agents.q = (function () {
	"use strict";
		
	var alpha = 0.1;
	var gamma = 1;
	var epsilon = 0.1;
	var action = -1;
	
	var initQ = 0;
	// freeze the value of initQ
	Object.freeze(initQ);
	// 
	var qTable = {};
	
	
	var prevState = new Taxi.world.State(-1,-1,-1,-1);
	var currentState = new Taxi.world.State(-1,-1,-1,-1);
	
	
	var lastActionQValueBeforeUpdate = 0;
	var lastActionQValueAfterUpdate = 0;

	
	
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
		initializeQTable();
	}

	function getLastAction(){
		return action;
	}


	function getAction() {
		//console.log("select action");
		var actionList = qTable[currentState.hashCode()];
		action = Util.rl.epsilonGreedy(actionList, epsilon);
		
		return action;
	}
	
	// update the current state
	function updateCurrentState(x,y,passengerState,desState) {
		prevState = currentState;
		currentState = new Taxi.world.State(x,y,passengerState,desState);
	}
	
	function maxQ(actionList) {
		var max = -10000;
		var i = 0,value;
		for(i = 0;i<actionList.length;++i) {
			value = actionList[i];
			max = Math.max(max,value);
		}
		
		return max;
	}
	
	function updatePolicy(reward, endGame) {
		//console.log("update policy");
		var value = qTable[prevState.hashCode()][action];
		
		//console.log("old value is "+value);
		var newValue = 0;
		if(endGame){
			newValue = (1-alpha)*value+alpha*reward;
		} else {
			newValue = (1-alpha)*value+alpha*(reward+gamma*maxQ(qTable[currentState.hashCode()]));
		}
		
		
		qTable[prevState.hashCode()][action] = newValue;
		lastActionQValueBeforeUpdate = value;
		lastActionQValueAfterUpdate = newValue;
	}
	
	
	// define the view object for plotting
	function view(info) {
	}
	
	
	function getLastActionQValueBeforeUpdate() {
		return lastActionQValueBeforeUpdate;
	}
	
	function getLastActionQValueAfterUpdate() {
		return lastActionQValueAfterUpdate;
	}
	
	
	// define the q learner
    return {
		initAgent:initAgent,
		getAction:getAction,
		updateCurrentState:updateCurrentState,
		updatePolicy:updatePolicy,
		getLastAction:getLastAction,
		getLastActionQValueBeforeUpdate:getLastActionQValueBeforeUpdate,
		getLastActionQValueAfterUpdate:getLastActionQValueAfterUpdate,
		view:view
    };
}());



// register this agent
currentAgent =  Taxi.agents.q;
