<?php

//echo var_dump($_REQUEST);
//die();

$rows = (int)$_POST["rows"];
$cols = (int)$_POST["cols"];
$puzzlephrase = explode(",", $_POST["puzzlePhrase"]);
$puzzleFill = explode(",", $_POST["puzzleFill"]);
	
	
	function snake($rows, $cols, $puzzlephrase, $puzzleFill){
	
	$grid = array_fill(0,$rows * $cols, NULL);
	$solution_indices = [];
	
	$random_index = random_int(0,count($grid) - 1);
	$solution_indices[] = $random_index;
	$grid[$random_index] = $puzzlephrase[0];
	
	for($i=1;$i<count($puzzlephrase);$i++) {
		$neighbors = array(
			"n" => null,
			"nw" => null,
			"ne" => null,
			"e" => null,
			"se" => null,
			"s" => null,
			"sw" => null,
			"w" => null
		);
		if($random_index < $cols) {
				unset($neighbors["nw"], $neighbors["n"], $neighbors["ne"]);
		}
		if($random_index >= $cols*($rows - 1)){
				unset($neighors["sw"], $neighbors["s"], $neighbors["se"]);
		}
		if($random_index % $cols == 0){
				unset($neighbors["nw"], $neighbors["w"], $neighbors["sw"]);
		}
		if($random_index % $cols - 1){
				unset($neighbors["ne"], $neighbors["e"], $neighbors["se"]);
		}
		$possible_indices = [];
		$index = null;
		foreach($neighbors as $n => $x){
			switch($n){
				case "nw":
                	$index = $random_index-$cols-1;
                    break;
                case "n":
                	$index = $random_index-$cols;
                	break;
                case "ne":
                	$index = $random_index-$cols+1;
                	break;
                case "w":
                	$index = $random_index-1;
                	break;
                case "e":
                	$index = $random_index+1;
                	break;
                case "sw":
                	$index = $random_index+$cols-1;
                	break;
                case "s":
                	$index = $random_index+$cols;
                	break;
                case "sw":
                	$index = $random_index+$cols+1;
                	break;	
			}
			if (is_null($grid[$index])) $possible_indices[] = $index;
					
		}
		if(count($possible_indices) == 0){
			return snake($rows, $cols, $puzzlephrase, $puzzleFill);
		}
		//choose randomly from available boxes, update $random_index
      	$random_index = $possible_indices[array_rand($possible_indices)];
      	//put new $random_index into solutionIndices
      	$solution_indices[] = $random_index;
      	//put next portion of puzzlePhrase into grid
      	$grid[$random_index] = $puzzlephrase[$i];
	}
	return array($grid, $solution_indices);
	}
	
	list($grid, $solution_indices) = snake($rows, $cols, $puzzlephrase, $puzzleFill);
	/*function snake(grid, rows, cols, puzzlePhrase){
  	//solutionIndices is array with all (flat) indices of solution boxes
  	var $random_index = Math.floor(Math.random() * grid.length), //create a starting box
		solutionIndices = [$random_index]; //start with random index
  	//start putting puzzlePhrase into grid
  	grid[$random_index] = puzzlePhrase[0]; //first letter(s) of puzzlePhrase goes into grid
  
  	//loop through rest of puzzlePhrase
  	for (let i=1; i<puzzlePhrase.length; i++){
    	//see what boxes are available (nw, n, ne, w, e, sw, s, se)
      	let neighbors = new Set(["nw", "n", "ne", "w", "e", "sw", "s", "se"]);
      	//check edges, remove directions that don't exist
      	if ($random_index < cols){ //we're on top row
        	neighbors.delete("nw");
          	neighbors.delete("n");
          	neighbors.delete("ne");
        }
		if ($random_index >= cols*(rows-1)){ //we're on bottom row
         	neighbors.delete("sw");
          	neighbors.delete("s");
          	neighbors.delete("se");
        }
		if ($random_index % cols === 0){ //we're on left edge
          	neighbors.delete("nw");
          	neighbors.delete("w");
          	neighbors.delete("sw");
        }
		if ($random_index % cols === cols-1){ //we're on right edge
         	neighbors.delete("ne");
          	neighbors.delete("e");
          	neighbors.delete("se");
        }
      	//convert leftover neighbors into actual indices
      	let possibleIndices = [],
            index;
      	neighbors.forEach(n => {
        	switch (n){
                case "nw":
                	index = $random_index-cols-1;
                    break;
                case "n":
                	index = $random_index-cols;
                	break;
                case "ne":
                	index = $random_index-cols+1;
                	break;
                case "w":
                	index = $random_index-1;
                	break;
                case "e":
                	index = $random_index+1;
                	break;
                case "sw":
                	index = $random_index+cols-1;
                	break;
                case "s":
                	index = $random_index+cols;
                	break;
                case "sw":
                	index = $random_index+cols+1;
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
      	//choose randomly from available boxes, update $random_index
      	$random_index = possibleIndices[Math.floor(Math.random()*possibleIndices.length)];
      	//put new $random_index into solutionIndices
      	solutionIndices.push($random_index);
      	//put next portion of puzzlePhrase into grid
      	grid[$random_index] = puzzlePhrase[i];
    } //end for loop through puzzlePhrase
  
  	
  	return [grid, solutionIndices];
}
*/
	//}
	
	// fill empty boxes with filler
	for ($i=0;$i<count($grid);$i++){
		if (is_null($grid[$i])){
		$grid[$i] = $puzzleFill[array_rand($puzzleFill)];
		}
	}
	$html = "";
	for ($row=0;$row<$rows;$row++){
		$html .= "<tr>";
		for ($col=0;$col<$cols;$col++){
			if(in_array($col + $row * $cols, $solution_indices)){
				$html .= "<td class='solutionCell'>" . $grid[$col + $row * $cols] . "</td>";
			}
		    else {
			    $html .= "<td>" . $grid[$col + $row * $cols] . "</td>";
			}			
		}
		$html .= "</tr>";
	}
	echo $html;
?>