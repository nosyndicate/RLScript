var rl = rl||{};

rl.domain = (function() {
	"use strict";
	
	function CartPole(agent) {
		this.gravity = 9.8;  //gravitional constant
		this.cartMass = 1.0;  // unit:kg
		this.poleMass = 0.1;  // unit:kg
		this.totalMass = this.cartMass + this.poleMass;
		this.halfPoleLength = 0.5; // unit:meter
		
		this.fourThirdsConstant = 4.0/3.0; //constant used in equation
		this.interval = 0.02; // second between state update
		
		this.leftCartBound = -2.4;   // unit : meter
		this.rightCartBound = 2.4;
		
		this.cartFriction = 0.0005;   // the friction between the cart and ground
		this.poleFriction = 0.000002; // the friction between the pole and the joint on the cart
		
		this.forceMagnatude = 10;
		// convert to radians 
		this.leftAngleBound = -12/180*Math.PI;
		this.rightAngleBound = 12/180*Math.PI;
		
		this.x = 0;         // cart position, meters
		this.xDot = 0;      // cart velocity
		this.theta = 0;     // pole angle, in radians
		this.thetaDot = 0;  // pole angular velocity
		
		
		this.useFriction = true;
		this.useCorrectedModel = true;
		
		this.endGame = false;
	
		this.workingAgent = agent;
		this.lastAction = -1;
		
	}
	
	
	CartPole.prototype.initialModel = function() {
		this.x = 0;        
		this.xDot = 0;     
		this.theta = 0;    
		this.thetaDot = 0; 
		
		this.endGame = false;
		this.lastAction = -1;
	};
	
	
	CartPole.prototype.classicalModelUpdate = function(direction, friction) {
		var x = this.x;
		var xDot = this.xDot;
		var theta = this.theta;
		var thetaDot = this.thetaDot;
		
		var f = direction*this.forceMagnatude;
		
		var thetaNumeratorCosTerm = -f - (this.poleMass*this.halfPoleLength*thetaDot*thetaDot*Math.sin(theta));
		
		if(friction) {
			thetaNumberatorCosTerm += (this.cartFriction * Math.sign(xDot));
		}
		
		var poleFrictionTerm = 0;
		if(friction) {
			poleFrictionTerm = (this.poleFriction * thetaDot)/(this.poleMass*this.halfPoleLength);
		}
		
		var thetaNumerator = this.gravity*Math.sin(theta)+Math.cos(theta)*thetaNumeratorCosTerm-poleFrictionTerm;
		
		var thetaDenominatorTerm = this.halfPoleLength * 
			(this.fourThirdsConstant-((this.poleMass*Math.cos(theta)*Math.cos(theta))/this.totalMass));
		
		var thetaAcc = thetaNumerator/thetaDenominatorTerm;
		
		var xNumerator = f + this.poleMass*this.halfPoleLength*(thetaDot*thetaDot*Math.sin(theta)-thetaAcc*Math.cos(theta));
		
		if(friction)
			xNumerator -= this.cartFriction*Math.sign(xDot);
		
		var xAcc = xNumerator/this.totalMass;
		
		this.x = x + this.interval * xDot;
		this.xDot = xDot + this.interval * xAcc;
		this.theta = theta + this.interval * thetaDot;
		this.thetaDot = thetaDot + this.interval * thetaAcc;
	};
	
	
	CartPole.prototype.correctedModelUpdate = function(direction, friction) {
		var x = this.x;
		var xDot = this.xDot;
		var theta = this.theta;
		var thetaDot = this.thetaDot;
		
		var f = direction*this.forceMagnatude;
		
		var thetaNumeratorCosTerm = -f - (this.poleMass*this.halfPoleLength*thetaDot*thetaDot*Math.sin(theta));
		
		if(friction) {
			thetaNumberatorCosTerm += (this.cartFriction * Math.sign(xDot));
		}
		
		var poleFrictionTerm = 0;
		if(friction) {
			poleFrictionTerm = (this.poleFriction * thetaDot)/(this.poleMass*this.halfPoleLength);
		}
		
		var thetaNumerator = this.gravity*Math.sin(theta)+Math.cos(theta)*thetaNumeratorCosTerm-poleFrictionTerm;
		
		var thetaDenominatorTerm = this.halfPoleLength * 
			(this.fourThirdsConstant-((this.poleMass*Math.cos(theta)*Math.cos(theta))/this.totalMass));
		
		var thetaAcc = thetaNumerator/thetaDenominatorTerm;
		
		var xNumerator = f + this.poleMass*this.halfPoleLength*(thetaDot*thetaDot*Math.sin(theta)-thetaAcc*Math.cos(theta));
		
		if(friction)
			xNumerator -= this.cartFriction*Math.sign(xDot);
		
		var xAcc = xNumerator/this.totalMass;
		
		this.x = x + this.interval * xDot;
		this.xDot = xDot + this.interval * xAcc;
		this.theta = theta + this.interval * thetaDot;
		this.thetaDot = thetaDot + this.interval * thetaAcc;
	};
	
	
	CartPole.prototype.update = function() {
		
		
		var action = workingAgent.getAction();
		var direction = action===1?1:-1;
		
		if(this.useCorrectedModel) {
			this.correctedModelUpdate(direction, this.useFriction);
		}
		else{
			this.classicalModelUpdate(direction, this.useFriction);
		}
		
		workingAgent.updateCurrentState(new State(this.x, this.xDot, this.theta, this.thetaDot));
		this.endGame = this.gameFailed();
		if(this.endGame) {
	    	workingAgent.updatePolicy(-1, endGame); // -1 if failed
		}
		else {
			workingAgent.updatePolicy(1, endGame);  // otherwise, received a reward of 1 every step
		}
		
		this.lastAction = action;
		
		if(this.endGame) {
			this.restartGame();
		}
		
	};
	
	CartPole.prototype.gameFailed = function() {
		if(this.x<this.leftCartBound || x > this.rightCartBound || this.theta < this.leftAngleBound || this.theta > this.rightAngleBound) {
			return true;
		}
		
		return false;
	};
	
	
	function Taxi() {
		this.workingAgent = null;
		this.width = 5;
		this.height = 5;
		this.taxiX = -1;  // position on the canvas of agent
		this.taxiY = -1;
		this.passengerX = -1;  // position on the canvas of passenger
		this.passengerY = -1;
		this.desX = -1; // position on the canvas of destination
		this.desY = -1;
		this.passengerState = -1;
		this.desState = -1;
		this.endGame = false;
		
		
		
		this.iterationCounter = 0;
		this.currentGameSteps = 0;
		this.currentGame = 1;
		this.perGameSteps = [];
		this.gameStepsArrayLimit = 500;
		
		
		// define the possible action for the agent
		this.actionSet = [
			"left",
	    	"right",
	    	"up",
	    	"down",
	    	"pickup",
	    	"putdown"
		];

		this.LocState = {"red":0,"green":1,"yellow":2,"blue":3,"taxi":4};
		
		this.illegalMove = {};
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
		this.location = [
	    	[0,0], //RED 
	    	[4,0], //GREEN
	    	[0,4], //YELLOW
	    	[3,4], // BLUE,
		];
		
		
		
	
		
		
		
		
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
		
	}
	
	Taxi.prototype.update = function() {
		this.iterationCounter++;
		this.currentGameSteps++;
		
    	var action = this.workingAgent.getAction();
    	var reward = this.processAction(action);
    	this.workingAgent.updateCurrentState(taxiX,taxiY,passengerState,desState);
    	this.workingAgent.updatePolicy(reward, endGame);
    	
    	// if the game is ended, we start a new one
    	if(this.endGame)
    	{
    		// put the data in array
    		this.perGameSteps.push([this.currentGame++,this.currentGameSteps]);
    		if(this.perGameSteps.length>this.gameStepsArrayLimit) {
    			// get rid of the first one if the data is too much
    			this.perGameSteps = this.perGameSteps.slice(1);
    		}
    		
    		this.restartGame();
    	}
	};
	
	Taxi.prototype.checkIllegalMovement = function(action){		
		var key = Util.util.hash(taxiX, taxiY);
		if(this.illegalMove[key]===action) {
			//console.log("illegal movement");
			return false;
		}
		//console.log("legal movement");
		return true;
	};
	
	Taxi.prototype.movePassenger = function() {
		if(this.passengerState === this.LocState["taxi"]) {
			this.passengerX = this.taxiX;
			this.passengerY = this.taxiY;
		}
	};
	
	
	Taxi.prototype.setPassengerLocation = function(position) {
    	this.passengerX = this.location[position][0];
    	this.passengerY = this.location[position][1];
	};

	Taxi.prototype.setDestination = function(position) {
		this.desX = this.location[position][0];
    	this.desY = this.location[position][1];
	};
	
	Taxi.prototype.init = function(agent) {
		this.workingAgent = agent;
		this.iterationCounter = 0;
		this.perGameSteps = [];
		this.restartGame();
		agent.initAgent();
	};
	

	Taxi.prototype.processAction = function(action) {
		var regular = -1;
		var illegal = -10;
		var success = 20;
		// console.log(actionSet[action]);
		switch (this.actionSet[action]) {
		case "left":
			if (this.checkIllegalMovement(this.actionSet[action])) {
				if (this.taxiX - 1 >= 0)
					this.taxiX = this.taxiX - 1;
				this.movePassenger();
			}
			return regular;
		case "right":
			if (this.checkIllegalMovement(this.actionSet[action])) {
				if (this.taxiX + 1 < this.width)
					this.taxiX = this.taxiX + 1;
				this.movePassenger();
			}
			return regular;
		case "up":
			if (this.checkIllegalMovement(this.actionSet[action])) {
				if (this.taxiY - 1 >= 0)
					this.taxiY = this.taxiY - 1;
				this.movePassenger();
			}
			return regular;
		case "down":
			if (this.checkIllegalMovement(this.actionSet[action])) {
				if (this.taxiY + 1 < this.height)
					this.taxiY = this.taxiY + 1;
				this.movePassenger();
			}
			return regular;
		case "pickup":
			if (this.passengerState !== this.LocState["taxi"]
					&& this.passengerX === this.taxiX
					&& this.passengerY === this.taxiY) {
				this.passengerState = this.LocState["taxi"];
				return regular;
			}
			return illegal;
		case "putdown":
			if (this.passengerState === this.LocState["taxi"]) {
				// end of the game
				if (this.desX === this.taxiX && this.desY === this.taxiY) {
					this.endGame = true;
					return success + regular;
				}
			}
			return illegal;
		default:
			console.error("This should never happen");
		}
	};


	Taxi.prototype.restartGame = function() {
		// start a new game, set the flag
		this.endGame = false;
		this.currentGameSteps = 0;
		
    	// initialize the game, set the position of agent, passenger and destination
		this.taxiX = Util.math.randomIntFromInterval(0,4);
		this.taxiY = Util.math.randomIntFromInterval(0,4);
		this.passengerState = Util.math.randomIntFromInterval(0,3);
		this.desState = Util.math.randomIntFromInterval(0,3);
    
    	//console.log(x+","+y+","+passenger+","+des);

    	// set the status for the three objects
		this.workingAgent.updateCurrentState(taxiX,taxiY,passengerState,desState);
		
		this.setPassengerLocation(passengerState);
		this.setDestination(desState);
	};
	
	Taxi.prototype.getPositionStatus = function() {
		var status = {
			x:this.taxiX,
			y:this.taxiY,
			desX:this.desX,
			desY:this.desY,
			passengerX:this.passengerX,
			passengerY:this.passengerY
		};
		
		return status;
	};
	

	
	


	
	return{
		CartPole:CartPole,
		Taxi:Taxi
	};
	
}());