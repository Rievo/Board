
//----------------------
//Board class
//----------------------
function Board(rows, cols){
	this.rows = rows;
	this.cols = cols;
	
	this.cells = [];
	
	for(var r = 0; r < this.rows; r++){
		this.cells[r] = [];

	}
	
	
	var wDiv = 400 / this.cols;	//Width division
	var hDiv = 400 / this.rows; //Height division
	

	//console.log(wDiv, hDiv);

	var acum = 0;
	
	for(var r = 0; r < this.rows; r++){
		for(var c = 0; c < this.cols; c++){
			var cell = new Cell(r,c, wDiv, hDiv);
			this.cells[r].push(cell);
			cell.identifier = acum;
			acum++;
		}
	}
	
}


Board.prototype.display = function(){
	//var wDiv = width / this.cols;	//Width division
	//var hDiv = height / this.rows; //Height division
	
	for(var r = 0; r < this.rows; r++){
		for(var c = 0; c < this.cols; c++){
			/*fill(255,0,0);
			stroke(0);
			rect(c * wDiv, r * hDiv, wDiv, hDiv);*/
			this.cells[r][c].display();
		}
	}
}

