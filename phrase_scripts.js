//wait for all the HTML to load into memory before manipulating tags
document.addEventListener("DOMContentLoaded", main);

function main(){ //runs ONCE on page load (like Java's main())
  
  	//"listen" for form submission ("Generate" button click)
  	document.querySelector("button[name='generate_btn']").addEventListener("click", generate);
	document.querySelector("button[name='generate_php']").addEventListener("click", generate_php);
}

function generate(e){
  	e.preventDefault(); //form will not be submitted automatically
	e.stopPropagation();
  		//Number() casts the string as a number
	var rows = Number(document.querySelector("label[name='height'] + select").value);
    var cols = Number(document.querySelector("label[name='width'] + select").value);
        //split converts a string into an array (wherever there's a comma)
    var puzzlePhrase = document.querySelector("#puzzlephrase").value.split(",");
    var puzzleFill = document.querySelector("#puzzlewords").value.split(",");
	
  	console.log(rows, cols, puzzlePhrase, puzzleFill);
  
  	//create a single-dimension grid
	var grid = Array(rows * cols).fill(undefined); //JS weirdness...fill grid with undefined values
  
  	/* call the snaking algorithm */
  	//es6 version:
  	[grid, solutionIndices] = snake(grid, rows, cols, puzzlePhrase);
  	//es5 version:
  	//var returnArray = snake(grid, rows, cols, puzzlePhrase);
  	//grid = returnArray[0];
  	//let solutionIndices = returnArray[1];
  
  	//fill empty boxes with filler
  	for (let i=0; i<grid.length; i++){
    	if (grid[i] === undefined){ //grid[i] has undefined as a value -- JS weirdness...undefined = false
        	let randomIndex = Math.floor(Math.random() * puzzleFill.length),
                randomFill = puzzleFill[randomIndex];
          	grid[i] = randomFill;
        }
    }

	//convert to table rows and cells
  	var html = "";
  	for (let row=0; row<rows; row++){
      	html += "<tr>";
    	for (let col=0; col<cols; col++){
          	//dev version
       		if (solutionIndices.includes(col + row * cols)){
            	html += "<td class='solutionCell'>" + grid[col + row * cols] + "</td>"; //single-dimension array to grid algorithm
            }
          	else { 
            	html += "<td>" + grid[col + row * cols] + "</td>"; //single-dimension array to grid algorithm
			}
		}
      	html += "</tr>";
    }

  	//insert into HTML
  	document.querySelectorAll("table").forEach(table => {
    	table.innerHTML = html; //innerHTML converts a JS string into actual HTML!!!
    });
}

function snake(grid, rows, cols, puzzlePhrase){
  	//solutionIndices is array with all (flat) indices of solution boxes
  	var randomIndex = Math.floor(Math.random() * grid.length), //create a starting box
		solutionIndices = [randomIndex]; //start with random index
  	//start putting puzzlePhrase into grid
  	grid[randomIndex] = puzzlePhrase[0]; //first letter(s) of puzzlePhrase goes into grid
  
  	//loop through rest of puzzlePhrase
  	for (let i=1; i<puzzlePhrase.length; i++){
    	//see what boxes are available (nw, n, ne, w, e, sw, s, se)
      	let neighbors = new Set(["nw", "n", "ne", "w", "e", "sw", "s", "se"]);
      	//check edges, remove directions that don't exist
      	if (randomIndex < cols){ //we're on top row
        	neighbors.delete("nw");
          	neighbors.delete("n");
          	neighbors.delete("ne");
        }
		if (randomIndex >= cols*(rows-1)){ //we're on bottom row
         	neighbors.delete("sw");
          	neighbors.delete("s");
          	neighbors.delete("se");
        }
		if (randomIndex % cols === 0){ //we're on left edge
          	neighbors.delete("nw");
          	neighbors.delete("w");
          	neighbors.delete("sw");
        }
		if (randomIndex % cols === cols-1){ //we're on right edge
         	neighbors.delete("ne");
          	neighbors.delete("e");
          	neighbors.delete("se");
        }
      	//convert leftover neighbors into actual indices
      	let possibleIndices = [],
            index = undefined;
      	neighbors.forEach(n => {
        	switch (n){
                case "nw":
                	index = randomIndex-cols-1;
                    break;
                case "n":
                	index = randomIndex-cols;
                	break;
                case "ne":
                	index = randomIndex-cols+1;
                	break;
                case "w":
                	index = randomIndex-1;
                	break;
                case "e":
                	index = randomIndex+1;
                	break;
                case "sw":
                	index = randomIndex+cols-1;
                	break;
                case "s":
                	index = randomIndex+cols;
                	break;
                case "sw":
                	index = randomIndex+cols+1;
                	break;
            }
          	//make sure box is empty
          	if (grid[index] === undefined) possibleIndices.push(index);
        });
      	//edge case!!!!
      	//what happens if there are NO possibleIndices?
      	if (possibleIndices.length === 0){
          	//return grid to all undefined values
          	grid = grid.fill(undefined);
          	//restart with semi recursive action
        	return snake(grid, rows, cols, puzzlePhrase);
        }
      	//choose randomly from available boxes, update randomIndex
      	randomIndex = possibleIndices[Math.floor(Math.random()*possibleIndices.length)];
      	//put new randomIndex into solutionIndices
      	solutionIndices.push(randomIndex);
      	//put next portion of puzzlePhrase into grid
      	grid[randomIndex] = puzzlePhrase[i];
    } //end for loop through puzzlePhrase
  
  	/*
    	if (x < cols) we're on top row
		if (x >= cols*(rows-1)) we're on bottom row
		if (x%cols === 0) we're on left edge
		if (x%cols === cols-1) we're on right edge
    */
  	
  	return [grid, solutionIndices];
}


function generate_php(e){
	e.preventDefault();
	e.stopPropagation();
	var rows = Number(document.querySelector("label[name='height'] + select").value);
    var cols = Number(document.querySelector("label[name='width'] + select").value);
        //split converts a string into an array (wherever there's a comma)
    var puzzlePhrase = document.querySelector("#puzzlephrase").value; //.split(",");
    var puzzleFill = document.querySelector("#puzzlewords").value; //.split(",");
	
	var data = JSON.stringify({rows, cols, puzzlePhrase, puzzleFill});
	
	fetch("Generate.php", {
		method: 'POST',
		headers: {
			//'Accept': 'application/json',
			//'Content-Type': 'application/json'
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: `rows=${rows}&cols=${cols}&puzzlePhrase=${puzzlePhrase}&puzzleFill=${puzzleFill}`
	}).then(res => res.text()).then(res => {
		// everything inside here happens only after a response has come back from the server
		console.log(res);
		//insert into HTML
		document.querySelectorAll("table").forEach(table => {
			table.innerHTML = res; //innerHTML converts a JS string into actual HTML!!!
		});
	});
	
}