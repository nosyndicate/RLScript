var Util = Util||{};

Util.math = (function() {
    return {
		randomIntFromInterval:function (min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
		}
    };
}());

Util.hash = (function() {
	function key(x,y){
		return x*10+y;
	}
	
	return{
		key:key
	};
}());


Util.rl = (function() {
	function epsilonGreedy(actionList, epsilon) {
		if(Math.random()<epsilon) {
			return Util.math.randomIntFromInterval(0, actionList.length-1);
		}
		return bestAction(actionList);
	}
	
	
	function bestActionPool(actionList) {
		var pool = [];
		var max = -10000;
		var i = 0,value;
		for(i = 0;i<actionList.length;++i) {
			value = actionList[i];
			//console.log(value);
			if(max<value){
				max = value;
				pool = [];
			}
			
			if(max===value) {
				pool.push(i);
			}
		}
		
		return pool;
	}
	
	function bestAction(actionList) {
		//console.log(actionList);
		var pool = bestActionPool(actionList);
		
		//console.log(pool);
		
		// choose randomly from the pool
		var index = Util.math.randomIntFromInterval(0, pool.length-1);
		//console.log("index is "+index);
		
		var action = pool[index];
		
		//console.log("chosen action is "+action);
		
		return action;
	}
	
	
	return {
		bestAction:bestAction,
		epsilonGreedy:epsilonGreedy
	};
	
}());
	    
