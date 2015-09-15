var Util = Util||{};

Util.math = (function() {
    return {
		randomIntFromInterval:function (min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
		}
    };
}());

Util.util = (function() {
	
	// left padding s with c to a total of n chars
	function paddingLeft(s, c, n) {
		console.log("paddingLeft");
	    if (! s || ! c || s.length >= n) {
	        return s;
	    }

	    var max = (n - s.length)/c.length;
	    for (var i = 0; i < max; i++) {
	        s = c + s;
	    }

	    return s;
	}

	// right padding s with c to a total of n chars
	function paddingRight(s, c, n) {
	    if (! s || ! c || s.length >= n) {
	        return s;
	    }

	    var max = (n - s.length)/c.length;
	    for (var i = 0; i < max; i++) {
	        s += c;
	    }

	    return s;
	}
	
	
	
	function hash(x,y){
		return x*10+y;
	}
	
	function binarySearch(element, array) {
		var low = 0;
		var high = array.length-1;
		var mid,midValue;
		while(low <= high) {
			mid = Math.floor((low+high)/2); // could be float index
			midValue = array[mid];
			
			if(midValue < element)
				low = mid + 1;
			else if(midValue > element)
				high = mid-1;
			else 
				return mid;
		}
		
		return -(low+1);
	}
	
	return{
		hash:hash,
		binarySearch:binarySearch,
		paddingLeft:paddingLeft,
		paddingRight:paddingRight
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
	
	function boltzmannSelection(temperature, actionList) {
		var sum = 0;
		var i = 0,value;
		var prob = [];
		for(i = 0;i<actionList.length;++i) {
			value = actionList[i];
			value = value/temperature;
			value = Math.exp(value);
			sum += value;
			prob.push(sum);
		}
		
		// normalized it so we have a cumulative probability distribution
		for(i = 0;i<prob.length;++i) {
			value = prob[i];
			value = value/sum;
			prob[i] = value;
			
			if(isNan(value))
				System.err.print("we have a NaN value");
		}
		
		return selectFrom(prob);
	}
	
	
	function selectFrom(probList) {
		var val = Math.random();
		var index = Util.util.binarySearch(prob, val);
		
		if (index < 0)
		{
			index = -(index + 1);		// binarySearch(...) returns (-(insertion point) - 1) if the key isn't found
		}
		
		if (index == prob.length)
			console.error("Error in Boltzmann selection");
		
		return index;
	}
	
	
	
	return {
		bestAction:bestAction,
		epsilonGreedy:epsilonGreedy,
		boltzmannSelection:boltzmannSelection
	};
	
}());
	    
