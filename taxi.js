// create taxi module
var taxi = function() {
    var world = {
	width:5,
	height:5,

	update:function(agent) {
	    var action = agent.getAction();
	    processAction(action);
	},
	
	processAction:function(action) {
	    console.log("process action");
	}
    };


    // define the possible action for the agent
    var actionSet = {
	LEFT:"left",
	RIGHT:"right",
	UP:"up",
	DOWN:"down",
	PICKUP:"pickup",
	PUTDOWN:"putdown"
    };

    // define the possible location for destination and passenger
    var location = {
	// array indicate the location in grid world
	RED:[0,0], 
	GREEN:[4,0],
	YELLOW:[0,4],
	BLUE:[3,4],
	TAXI:"taxi"
    };
};

// define the learner module
var learner = function () {

    // define the q learner
    var qlearner = {
	alpha:0.1,
	gamma:0.9,
	epsilon:0.1,
	// the state of the learner
	state:{
	    x : -1,
	    y : -1,
	    des : -1,
	    passenger : -1
	},
	
	setLocation: function(x, y) {
	    console.log("start set location");
	    //draw on the canvas
	    taxiView.drawPassenger(x,y);
	    taxiView.drawPassenger(x+1,y+1);
	}

    }

    return qlearner;
};

var agent = learner();
//agent.setLocation(0,0);

