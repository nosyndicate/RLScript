//MODULE PATTERN
var Taxi = Taxi||{}; // define Taxi namespace

//state class (object) under taxi module
Taxi.world = (function() {
	
	"use strict";
	
	var width = 5;
	var height = 5;
	var taxiX = -1;  // position on the canvas of agent
	var taxiY = -1;
	var passengerX = -1;  // position on the canvas of passenger
	var passengerY = -1;
	var desX = -1; // position on the canvas of destination
	var desY = -1;
	var passengerState = -1;
	var desState = -1;
	var endGame = false;
	var iterationCounter = 0;
/*	var grid = [[0,0,0,0,0],
	            [0,0,0,0,0],
	            [0,0,0,0,0],
	            [0,0,0,0,0],
	            [0,0,0,0,0]]; */
	
	
	// define the possible action for the agent
	var actionSet = [
		"left",
    	"right",
    	"up",
    	"down",
    	"pickup",
    	"putdown"
	];

	var LocState = {"red":0,"green":1,"yellow":2,"blue":3,"taxi":4};
	
	var illegalMove = {};
	illegalMove[Util.util.hash(1,0)] = "right";
	illegalMove[Util.util.hash(1,1)] = "right";
	illegalMove[Util.util.hash(2,0)] = "left";
	illegalMove[Util.util.hash(2,1)] = "left";
	illegalMove[Util.util.hash(0,3)] = "right";
	illegalMove[Util.util.hash(0,4)] = "right";
	illegalMove[Util.util.hash(1,3)] = "left";
	illegalMove[Util.util.hash(1,4)] = "left";
	illegalMove[Util.util.hash(2,3)] = "right";
	illegalMove[Util.util.hash(2,4)] = "right";
	illegalMove[Util.util.hash(3,3)] = "left";
	illegalMove[Util.util.hash(3,4)] = "left";
	
	// define the possible location for destination and passenger
	var location = [
    	[0,0], //RED 
    	[4,0], //GREEN
    	[0,4], //YELLOW
    	[3,4], // BLUE,
	];
	
	function update(agent) {
		iterationCounter++;
    	var action = agent.getAction();
    	var reward = processAction(action);
    	agent.updateCurrentState(taxiX,taxiY,passengerState,desState);
    	agent.updatePolicy(reward);
    	
    	// if the game is ended, we start a new one
    	if(endGame)
    	{
    		restartGame();
    	}
	}
	
	function checkIllegalMovement(action){		
		var key = Util.util.hash(taxiX, taxiY);
		if(illegalMove[key]===action) {
			//console.log("illegal movement");
			return false;
		}
		//console.log("legal movement");
		return true;
	}
	
	function movePassenger() {
		if(passengerState === LocState["taxi"]) {
			passengerX = taxiX;
			passengerY = taxiY;
		}
	}

	function processAction(action) {
		var regular = -1;
		var illegal = -10;
		var success = 20;
		//console.log(actionSet[action]);
		switch(actionSet[action])
		{
			case "left":
				if(checkIllegalMovement(actionSet[action])) {
					if(taxiX-1>=0)
						taxiX = taxiX-1;
					movePassenger();
				}
				return regular;
			case "right":
				if(checkIllegalMovement(actionSet[action])) {
					if(taxiX+1<width)
						taxiX = taxiX+1;
					movePassenger();
				}
				return regular;
			case "up":
				if(checkIllegalMovement(actionSet[action])) {
					if(taxiY-1>=0)
						taxiY = taxiY-1;
					movePassenger();
				}
				return regular;
			case "down":
				if(checkIllegalMovement(actionSet[action])) {
					if(taxiY+1<height)
						taxiY = taxiY+1;
					movePassenger();
				}
				return regular;
			case "pickup":
				if(passengerState!==LocState["taxi"]&&passengerX===taxiX&&passengerY===taxiY) {
					passengerState = LocState["taxi"];
					return regular;
				}
				return illegal;
			case "putdown":
				if(passengerState===LocState["taxi"]) {
					// end of the game
					if(desX===taxiX&&desY===taxiY) {
						endGame = true;
						return success + regular;
					}
				}
				return illegal;
			default:
				console.error("This should never happen");
		}
	}


	function restartGame() {
		// start a new game, set the flag
		endGame = false;
		
    	// initialize the game, set the position of agent, passenger and destination
    	taxiX = Util.math.randomIntFromInterval(0,4);
    	taxiY = Util.math.randomIntFromInterval(0,4);
    	passengerState = Util.math.randomIntFromInterval(0,3);
    	desState = Util.math.randomIntFromInterval(0,3);
    
    	//console.log(x+","+y+","+passenger+","+des);

    	// set the status for the three objects
    	Taxi.agents.q.updateCurrentState(taxiX,taxiY,passengerState,desState);
		
    	setPassengerLocation(passengerState);
    	setDestination(desState);
	}
	

	function init(agent) {
		agent.initAgent();
		iterationCounter = 0;
		restartGame();
	}
	

	function setPassengerLocation(position) {
    	passengerX = location[position][0];
    	passengerY = location[position][1];
	}

	function setDestination(position) {
		desX = location[position][0];
    	desY = location[position][1];
	}
	
	function getPositionStatus() {
		var status = {
			x:taxiX,
			y:taxiY,
			desX:desX,
			desY:desY,
			passengerX:passengerX,
			passengerY:passengerY
		};
		
		return status;
	}
	
	function getIteration() {
		return iterationCounter;
	}
	
	
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
	
	
	// public methods
    return {
		init:init,
		getPositionStatus:getPositionStatus,
		update:update,
		getIteration:getIteration,
		State:State
    };

    
}());




