var rl = rl || {};
rl.agents = rl.agents || {};

rl.agents.tabular = (function() {

	// Q-Learning
	function q(game, alpha, gamma, initQ, exploration) {
		this.alpha = alpha;
		this.exploration = exploration;
		this.qTable = {};
		this.action = -1;
		this.currentState = null;
		this.prevState = null;
	}

	q.prototype.maxQ = function(actionList) {
		var max = -10000;
		var i = 0, value;
		for (i = 0; i < actionList.length; ++i) {
			value = actionList[i];
			max = Math.max(max, value);
		}
		return max;
	};

	q.prototype.updatePolicy = function(reward, endGame) {
		//console.log("update policy");
		var value = qTable[this.prevState.hashCode()][action];
		
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
	};

	q.prototype.getAction = function(state) {
		var actionList = qTable[state.hashCode()];
		this.action = exploration(actionList);
		return this.action;
	};

	return {
		q : q
	};

}());