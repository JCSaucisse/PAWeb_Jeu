const playerNames = ['noirs', 'blancs'];

let turnToPlay = 0;
let score = [0, 0];

let gamePhase = 'preinit';
// 'init', 'playerSelect', 'playerTarget'

let selectedHexagonInt = -1;
let selectedHexagonIntList = [];

const grid = [
        [-1,-1, 0, 1, 2, 3, 4,-1,-1],
        [-1,10,11,12,13,14,15,-1,-1],
        [-1,20,21,22,23,24,25,26,-1],
        [30,31,32,33,34,35,36,37,-1],
        [40,41,42,43,44,45,46,47,48],
        [51,52,53,54,55,56,57,58,-1],
        [-1,62,63,64,65,66,67,68,-1],
        [-1,73,74,75,76,77,78,-1,-1],
        [-1,-1,84,85,86,87,88,-1,-1]];

const neighborsPos = [
        [-1, -1],
        [-1,  0],
        [ 0, -1],
        [ 0,  1],
        [ 1,  0],
        [ 1,  1],
        ];

const neighborsGrid = [
        [ 0, 1, 2, 3, 4,-1,-1,-1,-1],
        [10,11,12,13,14,15,-1,-1,-1],
        [20,21,22,23,24,25,26,-1,-1],
        [30,31,32,33,34,35,36,37,-1],
        [40,41,42,43,44,45,46,47,48],
        [-1,51,52,53,54,55,56,57,58],
        [-1,-1,62,63,64,65,66,67,68],
        [-1,-1,-1,73,74,75,76,77,78],
        [-1,-1,-1,-1,84,85,86,87,88]];

function hexagonClicked(hexagonId) { 
    console.log("clic on : ");
    console.log(hexagonId);
    hexagon = document.getElementById(hexagonId);
    if(hexagon.classList.contains("select") && gamePhase == 'playerSelect'){
        // Selection
		console.log("selection1");
        unselectAll();
        hexagon.classList.add("select");
        let hexagonInt = parseInt(hexagonId.replace("hexagon",""));
        selectedHexagonInt = hexagonInt;
		selectedHexagonIntList.push(hexagonInt);
        let targets = getPossibleTargets(hexagonInt);
            for(let i = 0; i < targets.length; i++){
				let targetIntStr = targets[i].toString();
				targetI = document.getElementById("hexagon"+targetIntStr)
				if(isSameColor(hexagon, targetI)){
					document.getElementById("hexagon"+targetIntStr).classList.add("same");
				}
				else{
					document.getElementById("hexagon"+targetIntStr).classList.add("target");
				}
        }
        gamePhase = 'playerTarget';
    }
    else if(hexagon.classList.contains("select") && gamePhase == 'playerTarget'){
        // Deselection
		console.log("selection2");
        unselectAll();
        untargetAll();
		unsameAll();
		let hexagonInt = parseInt(hexagonId.replace("hexagon",""));
        selectedHexagonInt = hexagonInt;
		let selectedHexagonIntListBis = [];
		let isOk = false;
		while(!isOk){
			potentialSelectedHexagonInt = selectedHexagonIntList.pop();
			selectedHexagonIntListBis.push(potentialSelectedHexagonInt);
			if(potentialSelectedHexagonInt == selectedHexagonInt){
				selectedHexagonIntListBis.pop();
				isOk = true;
			}
		}
		console.log(selectedHexagonIntList);
		console.log(selectedHexagonIntListBis);
		while(selectedHexagonIntListBis.length > 0){
			selectedHexagonIntList.push(selectedHexagonIntListBis.pop());
		}
		console.log(selectedHexagonIntList);
		console.log(selectedHexagonIntListBis);
		if (selectedHexagonIntList.length == 0){
			console.log("length = 0");
			selectPlayableCases();
			gamePhase = 'playerSelect';
		}
		else{
			console.log(selectedHexagonIntList);
			for(let i=0; i<selectedHexagonIntList.length; i++){
				getTarget(selectedHexagonIntList[i])
			}
			gamePhase = 'playerTarget';
		}
    }
	else if(hexagon.classList.contains("same") && selectedHexagonIntList.length<3){
		// selection de plusieurs hexagon
		console.log("same color");
		hexagon.classList.remove("same");
		hexagon.classList.add("select");
		let hexagonInt = parseInt(hexagonId.replace("hexagon", ""));
		selectedHexagonIntList.push(hexagonInt);
		let targets = getPossibleTargets(hexagonInt);
            for(let i = 0; i < targets.length; i++){
				let targetIntStr = targets[i].toString();
				targetI = document.getElementById("hexagon"+targetIntStr)
				if(isSameColor(hexagon, targetI)){
					if (!document.getElementById("hexagon"+targetIntStr).classList.contains("select")){
						document.getElementById("hexagon"+targetIntStr).classList.add("same");
					}
				}
				else{
					document.getElementById("hexagon"+targetIntStr).classList.add("target");
				}
        }
        gamePhase = 'playerTarget';
	}
    else if(hexagon.classList.contains("target")){
        // Target = ou deplacer la bille
		console.log("target");
        unselectAll();
        untargetAll();
        let hexagonInt = parseInt(hexagonId.replace("hexagon",""));
        move(selectedHexagonInt, hexagonInt);
        beginTurn(1-turnToPlay);
    }
}

function getTarget(hexagonInt){
	hexagon = document.getElementById("hexagon"+hexagonInt);
	if (hexagon.classList.contains("same")){
		hexagon.classList.remove("same");
	}
    hexagon.classList.add("select");
	let targets = getPossibleTargets(hexagonInt);
    for(let i = 0; i < targets.length; i++){
		let targetIntStr = targets[i].toString();
		targetI = document.getElementById("hexagon"+targetIntStr)
		hexagon1 = document.getElementById("hexagon"+hexagonInt.toString());
		if(isSameColor(hexagon1, targetI)){
			if (!document.getElementById("hexagon"+targetIntStr).classList.contains("select")){
				document.getElementById("hexagon"+targetIntStr).classList.add("same");
			}
		}
		else{
			document.getElementById("hexagon"+targetIntStr).classList.add("target");
		}
	}
}

function createGrid(){
    let gridElement = document.getElementById('grid');
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            let newHexagon = document.createElement("div");
            if(grid[i][j] == -1){
                newHexagon.className = "hexagon empty";
            }
            else {
                newHexagon.className = "hexagon playable";
                let newHexagonInt = grid[i][j].toString();
                newHexagon.id = "hexagon"+newHexagonInt;
                newHexagon.setAttribute("onClick","hexagonClicked(this.id)");
            }
            gridElement.appendChild(newHexagon);
        }
    }
}

function initBalls(){
    let gridInit = [
        2,2,2,2,2,
        2,2,2,2,2,2,
        1,1,2,2,2,1,1,
        1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,
        1,1,3,3,3,1,1,
        3,3,3,3,3,3,
        3,3,3,3,3];

    let playableCases = document.querySelectorAll('.playable');
    for (let i = 0; i < playableCases.length; i++) {
        if(gridInit[i] == 1)
            continue;
        addBall(playableCases[i], gridInit[i]-2);
    }
}

function addBall(ballCase, color){
    console.log("add "+ballCase.id);

    let newDiv = document.createElement("div");
    ballCase.appendChild(newDiv);
    if(color == 1){
        newDiv.className = "ballW";
        ballCase.classList.add("caseW");
    }
    else if (color == 0){
        newDiv.className = "ballB";
        ballCase.classList.add("caseB");
    }
}

function removeBall(ballCase){
    console.log("removeBall "+ballCase.id);
    if(!ballCase.classList.contains("caseW") && !ballCase.classList.contains("caseB"))
        return false
    ballCase.classList.remove("caseW");
    ballCase.classList.remove("caseB");
    ballCase.firstChild.remove();
    return true;
}

function init(){
    console.log("init");
    gamePhase = 'init';
    createGrid();
    initBalls();
    updateScoreIndicator();
    beginTurn(1);
}

function beginTurn(player){
    turnToPlay = player;
    document.getElementById('turnToPlayIndicator').innerHTML = playerNames[turnToPlay]; // selection du joueur

    selectPlayableCases();

    gamePhase = 'playerSelect';
}

function selectPlayableCases(){
    let playableCases;
    if(turnToPlay == 0)
        playableCases = document.querySelectorAll('.caseB');
    else
        playableCases = document.querySelectorAll('.caseW');

    for(let i = 0; i < playableCases.length; i++){
        playableCases[i].classList.add("select");
    }
}

function unselectAll(){
    selectCases = document.querySelectorAll('.select');
    for(let i = 0; i < selectCases.length; i++){
        selectCases[i].classList.remove("select");
    }
}
function untargetAll(){
    targetCases = document.querySelectorAll('.target');
    for(let i = 0; i < targetCases.length; i++){
        targetCases[i].classList.remove("target");
    }
}
function unsameAll(){
	selectCases = document.querySelectorAll('.same');
	for(let i = 0; i < selectCases.length; i++){
		selectCases[i].classList.remove("same");
	}
}

function getPossibleTargets(hexagonInt){  // et si on donne une liste des hexagon selectionné
    neighbors = getNeighbors(hexagonInt);

    for (let i = neighbors.length - 1; i >= 0; i--) {
        if(!isMovePossible(hexagonInt,neighbors[i]))     // on les retire la 
            neighbors.remove(i);
    }
    return neighbors;
}

function getNeighbors(hexagonInt){ // renvoie les cases sur le plateau autour de hexagonInt
    let neighbors = [];
    for(i = 0; i < neighborsPos.length; i++){
        let x = Math.trunc(hexagonInt/10) + neighborsPos[i][0];
        let y = hexagonInt%10 + neighborsPos[i][1];
        if(x < 0 || x > 8 || y < 0 || y > 8)
            continue;
        if(neighborsGrid[x][y] != -1)
            neighbors.push(neighborsGrid[x][y]);
    }
    return neighbors;
}

function isSameColor(hexagonFrom, hexagonTo){
	if (hexagonFrom.classList.contains("caseW") && hexagonTo.classList.contains("caseW"))
		return true;
	if (hexagonFrom.classList.contains("caseB") && hexagonTo.classList.contains("caseB"))
		return true;
	else
		return false;
}

function isMovePossible(hexagonIntFrom, hexagonIntTo){ // move pas toujours possible
    return true;
}

function move(hexagonIntFrom, hexagonIntTo){
    console.log("move"+hexagonIntFrom.toString());

    // On enleve From
    let hexagonFrom = document.getElementById("hexagon"+hexagonIntFrom.toString());
    let colorFrom = hexagonFrom.classList.contains("caseW") ? 1 : 0;
    if(!removeBall(hexagonFrom))
        return;

    // Sortie de la grille = point gagné
    let xTo = Math.trunc(hexagonIntTo/10);
    let yTo = hexagonIntTo%10;
    if(xTo < 0 || xTo > 8 || yTo < 0 || yTo > 8 || neighborsGrid[xTo][yTo] == -1){
        score[1-colorFrom] += 1;
        updateScoreIndicator();
        return;
    }

    // On effectue le deplacement suivant
    let direction = hexagonIntTo - hexagonIntFrom;
    console.log("direction : ", direction);
    let nextMove = hexagonIntTo+10*(Math.trunc(direction/10))+direction%10;
    move(hexagonIntTo, nextMove);

    // On remet To
    let hexagonTo = document.getElementById("hexagon"+hexagonIntTo.toString());
    addBall(hexagonTo, colorFrom);
}

function updateScoreIndicator(){
    document.getElementById("scoreIndicator").innerHTML = score[0].toString()+" - "+score[1].toString();
}

window.onload = init();
