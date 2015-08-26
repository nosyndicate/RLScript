var Taxi = Taxi || {};


// define the learner class (object) under TAXI module
Taxi.agent = (function () {
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
	
	// define the state class of the learner
	function State(x, y, passenger, des){
		this.x = x;
    	this.y = y;
    	this.passenger = passenger;
    	this.des = des;
	};
	
	
	State.prototype.setFeatures = function(x, y, p, d) {
		this.x = x;
		this.y = y;
		this.passenger = p;
		this.des = d;
	};
	
	
	// define hash code function for state class
	State.prototype.hashCode = function(x,y,p,d) {
		var len = arguments.length;
		var x = -1,y = -1, d = -1, p = -1;
		var ans;
		if(len===0) {
    		x = this.x;
    		y = this.y;
    		p = this.passenger;
    		d = this.des;
		} else if(len===4) {
    		x = arguments[0];
    		y = arguments[1];
    		p = arguments[2];
    		d = arguments[3];
		}

		ans = x;
		ans = ans*10+y;
		ans = ans*10+p;
		ans = ans*10+d;

		return ans;
	};
	
	
	var prevState = new State(-1,-1,-1,-1);
	var currentState = new State(-1,-1,-1,-1);
	
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
		    			qTable[new State(x,y,p,d).hashCode()] = actions;
					}
	    		}
			}
    	}
	}

	function initAgent(){
		initializeQTable();
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
		currentState = new State(x,y,passengerState,desState);
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
		}
		else{
			newValue = (1-alpha)*value+alpha*(reward+gamma*maxQ(qTable[currentState.hashCode()]));
		}
		
		
		qTable[prevState.hashCode()][action] = newValue;
	}
	
	// define the q learner
    return {
		initAgent:initAgent,
		getAction:getAction,
		updateCurrentState:updateCurrentState,
		updatePolicy:updatePolicy,
		State:State
    };
}());
