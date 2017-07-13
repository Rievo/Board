var b = new Board(10, 10);

var width = 400;
var height = 400;

var clicking = false;


var pickInitialButton;
var pickFinalButton;
var goButton;
var drawWallsButton;


var clickMode = undefined; //settingInitial, settingFinal


var initialCell = undefined;
var endCell = undefined;

var settingWalls = false;


function setup() {
	createCanvas(400, 400);

	pickInitialButton = createButton("Pick initial");
	pickInitialButton.position(10, 400);
	pickInitialButton.mousePressed(pickInitial);


	pickFinalButton = createButton("Pick Final");
	pickFinalButton.position(100, 400);
	pickFinalButton.mousePressed(pickFinal);

	goButton = createButton("GO");
	goButton.position(200, 400);
	goButton.mousePressed(doThings);


	drawWallsButton = createButton("Draw Walls");
	drawWallsButton.position(300, 400);
	drawWallsButton.mousePressed(setDrawWalls);



	textSize(32);
}

function draw() {
	background(51);

	b.display();
}

function setDrawWalls() {
	if (settingWalls == false) {
		//Change the text to cancel
		drawWallsButton.html('Cancel')
		settingWalls = true;
	} else {
		//Change the text to default
		drawWallsButton.html('Draw Walls')
		settingWalls = false;
	}
}


function pickInitial() {
	clickMode = "settingInitial";
}

function pickFinal() {
	clickMode = "settingFinal";
}



function mouseDragged() {

	for (var r = 0; r < b.rows; r++) {
		for (var c = 0; c < b.cols; c++) {
			var cell = b.cells[r][c];


			if (cell.mouseIn() == true) {
				if (settingWalls) {
					cell.hasWall = true;
				}
			} else {
				cell.highlighted = false;
			}


		}
	}
}


function mousePressed() {
	clicking = true;


	//if (settingWalls == true) {
	for (var r = 0; r < b.rows; r++) {
		for (var c = 0; c < b.cols; c++) {
			var cell = b.cells[r][c];

			if (cell.mouseIn() == true) {

				if (settingWalls == true) {
					if (cell.hasWall == true) {
						cell.hasWall = false;
					} else {
						cell.hasWall = true;
					}
				} else if (clickMode == "settingInitial") {

					if (initialCell != undefined) {
						initialCell.isInitial = undefined;
					}

					cell.isInitial = true;
					clickMode = undefined;
					initialCell = cell;
					console.log("INITIAL SET");


				} else if (clickMode == "settingFinal") {

					if (endCell != undefined) {
						endCell.isFinal = undefined;
					}

					cell.isFinal = true;
					clickMode = undefined;
					endCell = cell;
					console.log("FINAL SET");
				}

			}
		}
	}
	//}



}

function mouseReleased() {
	clicking = false;
}

function mouseMoved() {
	for (var r = 0; r < b.rows; r++) {
		for (var c = 0; c < b.cols; c++) {
			var cell = b.cells[r][c];

			if (cell.mouseIn() == true) {
				cell.highlighted = true;
			} else {
				cell.highlighted = false;
			}


		}
	}
}


function doThings() {
	if (initialCell == undefined || endCell == undefined) {
		console.log("Impossible");
	} else {
		console.log("DOING");


		//Do the A* here
		/*
			We know the start cell 	(initialCell)
			and the final cell 		(endCell)


			Do the graph now
		*/


		fillGraph();

		doAStar();
	}
}

function doAStar() {
	var closedSet = [];

	var openSet = [];
	openSet.push(initialCell);


	var cameFrom = {}; //Map
	var gScore = {}; //Map
	var fScore = {};

	for (var r = 0; r < b.rows; r++) {
		for (var c = 0; c < b.cols; c++) {
			var cell = b.cells[r][c];
			cameFrom[cell.identifier] = undefined;
			gScore[cell.identifier] = Infinity;
			fScore[cell.identifier] = Infinity;
		}
	}

	gScore[initialCell.identifier] = 0;

	fScore[initialCell.identifier] = costStimate(initialCell, endCell);



	console.log("Empieza el while");
	while (openSet.length != 0) {

		setTimeout(function(){
		    //do what you need here
		}, 2000);
		console.log("EH");

		var current = getNodeInOpenSetWithLowestFScore(openSet, fScore);

		current.explored = true;
		//console.log("current",current);

		if (current == endCell) {
			//Reconstruct
			console.log("END");
			reconstruct(cameFrom, current);
			return;
		}


		//openSet.remove(current)
		removeObjectFromArray(current, openSet);

		//closedSet.add(current)
		closedSet.push(current);


		//for each neighbor of current
		for (var n = 0; n < current.connecteds.length; n++) {

			var neighbor = current.connecteds[n];

			if (closedSet.includes(neighbor)) {
				break;
			}


			if (!openSet.includes(neighbor)) {
				openSet.push(neighbor);
			}


			//The distance from start to a neighbor

			var tentative_gScore = gScore[current.identifier] + 1; //dist_between(current, neighbor)

			if (tentative_gScore >= gScore[neighbor.identifier]) {
				break; //This is not a better path
			}


			//Else, this is the best path until now, save it
			cameFrom[neighbor.identifier] = current;
			gScore[neighbor.identifier] = tentative_gScore;
			fScore[neighbor.identifier] = gScore[neighbor.identifier] + costStimate(neighbor, endCell);

		}
	}

}

function reconstruct(cameFrom, current) {
	var totalpath = [];
	totalpath.push[current];
	while (cameFrom[current.identifier] != undefined) {
		current = cameFrom[current.identifier];
		totalpath.push(current);
	}
	totalpath.push(endCell);

	console.log(totalpath);



	for (var i = 0; i < totalpath.length; i++) {
		var cell = totalpath[i];
		cell.isPath = true;
	}
	return totalpath;
}

function removeObjectFromArray(obj, array) {
	var index = -1;

	for (var i = 0; i < array.length; i++) {
		if (array[i] == obj) {
			index = i;
		}
	}

	if (index != -1) {
		array.splice(index, 1);
	}
}


function getNodeInOpenSetWithLowestFScore(openSet, fScore) {

	var minValue = Infinity;
	var minCell = undefined;


	for (var i = 0; i < openSet.length; i++) {
		var cell = openSet[i];

		var fscoreForCell = fScore[cell.identifier];

		if (fscoreForCell < minValue) {
			minValue = fscoreForCell;
			minCell = cell;
		}
	}

	return minCell;
}

function costStimate(start, goal) {
	var d = 0;

	d = Math.sqrt(((goal.col - start.col) * (goal.col - start.col)) + ((goal.row - start.row) * (goal.row - start.row)));
	return d;
}

function fillGraph() {
	var other = undefined;


	for (var r = 0; r < b.rows; r++) {
		for (var c = 0; c < b.cols; c++) {
			var cell = b.cells[r][c];

			//Top neightb
			cell.connecteds = []; //Reset for this cell (maybe it has changed)

			if (cell.hasWall == false) {
				if (r > 0) { //Only check top if not the first row
					other = b.cells[r - 1][c];

					if (other.hasWall == false) {
						cell.connecteds.push(other);
					}
				}


				//Right
				if (c < b.cols - 1) { //Only check right if not the last col
					other = b.cells[r][c + 1];

					if (other.hasWall == false) {
						cell.connecteds.push(other);
					}
				}


				//Bot
				if (r < b.rows - 1) {
					other = b.cells[r + 1][c];

					if (other.hasWall == false) {
						cell.connecteds.push(other);
					}
				}


				//Left
				if (c > 0) { //Only check right if not the last col
					other = b.cells[r][c - 1];

					if (other.hasWall == false) {
						cell.connecteds.push(other);
					}
				}


				//Top left
				if (r > 0 && c > 0) { //Only check top if not the first row
					other = b.cells[r - 1][c - 1];

					if (other.hasWall == false) {
						cell.connecteds.push(other);
					}
				}


				//Top right
				if (r > 0 && c < b.cols - 1) { //Only check top if not the first row
					other = b.cells[r - 1][c + 1];

					if (other.hasWall == false) {
						cell.connecteds.push(other);
					}
				}


				//Bot right
				if (r < b.rows - 1 && c < b.cols - 1) { //Only check top if not the first row
					other = b.cells[r + 1][c + 1];

					if (other.hasWall == false) {
						cell.connecteds.push(other);
					}
				}

				//Bot left

				if (r < b.rows - 1 && c > 0) { //Only check top if not the first row
					other = b.cells[r + 1][c - 1];

					if (other.hasWall == false) {
						cell.connecteds.push(other);
					}
				}
			}

		}
	}
}