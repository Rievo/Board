
//----------------------
// Cell class
//----------------------
function Cell(row, col, wi, he){
	this.row = row;
	this.col = col; 
	this.width = wi;
	this.height = he;

	this.x = col * wi;
	this.y = row * he;

	this.color = new Color(235,204,162);

	this.highlightColor = new Color(204,163,106);

	this.highlighted = false;


	this.hasWall = false;

	this.connecteds = [];

	this.isPath = false;


	this.explored = false;
}


Cell.prototype.getCenter = function(){
	return {x: this.x + (this.width/2), y: this.y + (this.height/2)}
}

Cell.prototype.display = function(){

	if(this.hasWall == true){
		fill(0);
	}else if(this.highlighted == false){
		fill(this.color.r,this.color.g,this.color.b);
	}else{
		fill(this.highlightColor.r,this.highlightColor.g,this.highlightColor.b);
	}
	
	if(this.isPath == true){
		fill(144,214,178);
	}

	stroke(0);
		
	rect(this.x, 
		this.y, 
		this.width, 
		this.height);


	textSize(32);
	if(this.isInitial){
		fill(51);
		text("S", this.x + (this.width/4), this.y + this.height);
	}

	if(this.isFinal){
		fill(51);
		text("E", this.x + (this.width/4), this.y + this.height);
	}


	//textSize(12);
	//fill(0);
	//text("" + this.row + " " + this.col, this.x + (this.width/4), this.y + this.height);


	/*if(this.highlighted == true){
		this.drawConnections();
	}*/

	if(this.explored == true){
		var center = this.getCenter();
		fill(0);
		ellipse(center.x, center.y, 10, 10);
	}
	
	
	
}

Cell.prototype.drawConnections = function(){
	var myCenter = this.getCenter();
	//Draw connecteds


	stroke(200,100,100);
	if(this.connecteds ){
		for(var i = 0; i < this.connecteds.length; i++){
			var other = this.connecteds[i];

			var otherCenter = other.getCenter();
			//console.log(myCenter, otherCenter);

			line(myCenter.x, myCenter.y, otherCenter.x, otherCenter.y);
		}
	}
}

Cell.prototype.mouseIn = function(){

	if(mouseX > this.x && mouseX < this.x + this.width
		&& mouseY > this.y && mouseY < this.y + this.height){
		return true;
	}else{
		return false;
	}
}