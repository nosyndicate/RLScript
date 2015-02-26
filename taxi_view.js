var canvas;
var ctx;

var view = function() {
    var draw = {

	blockWidth:0,
	blockHeight:0,

	taxiBackground: function(){

	    console.log("background method");
	    canvas = document.getElementById("taxi");
	    if (canvas.getContext){
		ctx = canvas.getContext('2d');
		
		this.blockWidth = canvas.width/5;
		this.blockHeight = canvas.height/5;

		// add the four color place
		// red
		ctx.fillStyle = "rgb(255,0,0)";
		ctx.fillRect (0*this.blockWidth, 0*this.blockHeight, this.blockWidth, this.blockHeight);
		
		// green
		ctx.fillStyle = "rgb(0,255,0)";
		ctx.fillRect (4*this.blockWidth, 0*this.blockHeight, this.blockWidth, this.blockHeight);
		
		// yellow
		ctx.fillStyle = "rgb(255,255,0)";
		ctx.fillRect (0*this.blockWidth, 4*this.blockHeight, this.blockWidth, this.blockHeight);
		
		// blue
		ctx.fillStyle = "rgb(0,0,255)";
		ctx.fillRect (3*this.blockWidth, 4*this.blockHeight, this.blockWidth, this.blockHeight);
		
		// draw the wall 
		ctx.fillStyle = "rgb(255,255,255)";
		
		// first
		this.drawline(ctx, 2*this.blockWidth, 0, 2*this.blockWidth, 2*this.blockWidth);
		this.drawline(ctx, 1*this.blockWidth, 3*this.blockHeight, 1*this.blockWidth, 5*this.blockHeight);
		this.drawline(ctx, 3*this.blockWidth, 3*this.blockHeight, 3*this.blockWidth, 5*this.blockHeight);
	    }
	},

	drawline: function(ctx, start_x, start_y, end_x, end_y) {
	    ctx.beginPath();
	    ctx.moveTo(start_x,start_y);
	    ctx.lineTo(end_x,end_y);
	    ctx.closePath();
	    ctx.stroke();
	},

	drawPassenger: function(x, y) {
	    // convert the x, y location in grid world into the grid of canvas
	    var centerX = x*this.blockWidth+0.5*this.blockWidth;
	    var centerY = y*this.blockHeight+0.5*this.blockHeight;
	    var radius = 25;
	    
	    ctx.fillStyle = "black";
	    ctx.beginPath();
	    ctx.arc(centerX,centerY,radius,0,2*Math.PI);
	    ctx.closePath();
	    ctx.fill();
	},

	drawTaxi: function(x, y) {
	    // convert the x, y location in grid world into the grid of canvas
	    var centerX = x*this.blockWidth+0.5*this.blockWidth;
	    var centerY = y*this.blockHeight+0.5*this.blockHeight;
	    var radius = 40;
	    
	    ctx.fillStyle = "black";
	    ctx.beginPath();
	    ctx.arc(centerX,centerY,radius,0,2*Math.PI);
	    ctx.closePath();
	    ctx.stroke();
	}

    };	

    return draw;
};

var taxiView = view();






