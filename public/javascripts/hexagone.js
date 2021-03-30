const playerNames = ['noirs', 'blancs'];

let playerColor;
let turnToPlay = 0;
let score = [0, 0];

let gamePhase = 'preinit';
// 'init', 'playerSelect', 'playerTarget'

let ready = false;

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
		if (selectedHexagonIntList.length == 0){
			console.log("length = 0");
			selectPlayableCases();
			gamePhase = 'playerSelect';
		}
		else{
			for(let i=0; i<selectedHexagonIntList.length; i++){
				getTarget(selectedHexagonIntList[i])
			}
			gamePhase = 'playerTarget';
		}
    }
	else if(hexagon.classList.contains("same") && selectedHexagonIntList.length==1){
		// selection du deuxième hexagon  rajouter les target
		hexagon.classList.remove("same");
		unsameAll();
		untargetAll();
		hexagon.classList.add("select");
		let hexagonInt = parseInt(hexagonId.replace("hexagon", ""));
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
		getSame2();
        gamePhase = 'playerTarget';
	}
	else if(hexagon.classList.contains("same") && selectedHexagonIntList.length==2){
		// selection du troisième hexagon
		hexagon.classList.remove("same");
		unsameAll();
		untargetAll();
		hexagon.classList.add("select");
		let hexagonInt = parseInt(hexagonId.replace("hexagon", ""));
		selectedHexagonIntList.push(hexagonInt);
		let targets = getPossibleTargets(hexagonInt);
        for(let i = 0; i < targets.length; i++){
			let targetIntStr = targets[i].toString();
			targetI = document.getElementById("hexagon"+targetIntStr)
			if(!isSameColor(hexagon, targetI)){
				document.getElementById("hexagon"+targetIntStr).classList.add("target");
			}
        }
        gamePhase = 'playerTarget';
	}
    else if(hexagon.classList.contains("target")){
        // Target = ou deplacer la bille
        let hexagonInt = parseInt(hexagonId.replace("hexagon",""));
		deplacement = getDeplacement(hexagonInt);
		if(selectedHexagonIntList.length>1){
            let hexagonIntFromList = [];
            let hexagonIntToList = [];
			if(Math.abs(deplacement)==Math.abs(selectedHexagonIntList[0]-selectedHexagonIntList[1])){
				selectedHexagonIntC = getBilleDeplacement(deplacement);
                hexagonIntFromList.push(selectedHexagonIntC);
                hexagonIntToList.push(selectedHexagonIntC+deplacement);
			}
			else{
				for(let i=0; i<selectedHexagonIntList.length; i++){
					selectedHexagonIntC = selectedHexagonIntList[i]
                    hexagonIntFromList.push(selectedHexagonIntC);
                    hexagonIntToList.push(selectedHexagonIntC+deplacement);
				}
			}
            play(hexagonIntFromList, hexagonIntToList);
		}
		else{
			play([selectedHexagonIntList[0]], [hexagonInt]);
		}
		unselectAll();
        untargetAll();
		unsameAll();
		selectedHexagonIntList = [];
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

function getSame2(){
	hexagon = document.getElementById("hexagon"+selectedHexagonIntList[0]);
	let x = Math.abs(selectedHexagonIntList[0]-selectedHexagonIntList[1])
	let maxi = Math.max(selectedHexagonIntList[0],selectedHexagonIntList[1])+x;
	let mini = maxi-3*x;
	same1 = document.getElementById("hexagon"+maxi);
	if (same1 != null){
		if(isSameColor(hexagon, same1)){
			document.getElementById("hexagon"+maxi).classList.add("same");
		}
	}
	same2 = document.getElementById("hexagon"+mini);
	if (same2 != null){
		if(isSameColor(hexagon, same2)){
			document.getElementById("hexagon"+mini).classList.add("same");
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
    const gridInit = [
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

function init(playerColor_){
    console.log("init");
    clear();
    gamePhase = 'init';
    playerColor = playerColor_;
    document.getElementById('readyButton').innerHTML = "Quitter la partie"
    updatePlayerColorIndicator();
    createGrid();
    initBalls();
    updateScoreIndicator();
    beginTurn(0);
}

function clear(){
    gamePhase = 'preinit';
    let gridElement = document.getElementById('grid');
    while (gridElement.firstChild) {
        gridElement.removeChild(gridElement.lastChild);
    }
    score = [0,0];
    updateScoreIndicator();
    document.getElementById('playerColorIndicator').innerHTML = "";
    document.getElementById('turnToPlayIndicator').innerHTML = "";
    document.getElementById('scoreIndicator').innerHTML = "";
    document.getElementById('readyButton').innerHTML = "Prêt";
    ready = false;
    if(document.getElementById('readyButton').classList.contains('ready')){
        document.getElementById('readyButton').classList.remove('ready');
    }
    let endScene = document.getElementById('EndScene');
    endScene.innerHTML = "";
    endScene.classList = [];
}

function beginTurn(player){
    turnToPlay = player;
    document.getElementById('turnToPlayIndicator').innerHTML = playerNames[turnToPlay]; // selection du joueur

    if(turnToPlay == playerColor){
        selectPlayableCases();
        gamePhase = 'playerSelect';
    }
    else{
        gamePhase = 'opponentTurn';
    }
    updateTurnToPlayIndicator();
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

function getPossibleTargets(hexagonInt){
    neighbors = getNeighbors();

    for (let i = neighbors.length - 1; i >= 0; i--) {
        if(!isMovePossible(hexagonInt,neighbors[i]))     // on les retire la 
            neighbors.splice(i,1);
    }
    return neighbors;
}

function getNeighbors(){ // renvoie les cases sur le plateau autour de selectedHexagonIntList
    let neighbors = [];
	for(let j=0; j<selectedHexagonIntList.length; j++){
		hexagonIntJ = selectedHexagonIntList[j];
		for(i = 0; i < neighborsPos.length; i++){
			let x = Math.trunc(hexagonIntJ/10) + neighborsPos[i][0];
			let y = hexagonIntJ%10 + neighborsPos[i][1];
			if(x < 0 || x > 8 || y < 0 || y > 8)
				continue;
			if(neighborsGrid[x][y] != -1)
				neighbors.push(neighborsGrid[x][y]);
		}
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

function isVsColor(hexagonFrom, hexagonTo){
	if (hexagonFrom.classList.contains("caseW") && hexagonTo.classList.contains("caseB"))
		return true;
	if (hexagonFrom.classList.contains("caseB") && hexagonTo.classList.contains("caseW"))
		return true;
	else
		return false;
}

function isMovePossible(hexagonIntFrom, hexagonIntTo){ // move pas toujours possible
	hexagonTo = document.getElementById("hexagon"+hexagonIntTo);
	selectedHexagon = document.getElementById("hexagon"+selectedHexagonIntList[0]);
	if (selectedHexagonIntList.length == 1){
		if (isVsColor(selectedHexagon, hexagonTo)){
			return false;
		}
		else{
			return true;
		}
	}
	else if(selectedHexagonIntList.length == 2){
		let x = Math.abs(selectedHexagonIntList[0]-selectedHexagonIntList[1])
		let maxi = Math.max(selectedHexagonIntList[0],selectedHexagonIntList[1])+x;
		let mini = maxi-3*x;
		if ((hexagonIntTo == maxi) || (hexagonIntTo == mini)){	
			let sensDeplacement = -procheZero((maxi-x-hexagonIntTo), (mini+x-hexagonIntTo));
			if (isVsColor(selectedHexagon, hexagonTo) && billesAdversesAlignees(hexagonIntTo, sensDeplacement) > 1){
				return false; 
			}
			else{
				return true;
			}
		}
		else{
			sensDeplacement = hexagonIntTo - selectedHexagonIntList[0];
			if(Math.abs(sensDeplacement) == 1 || Math.abs(sensDeplacement) == 10 || Math.abs(sensDeplacement) == 11){
				return isMoveLatPossible(sensDeplacement);
			}
			else{
				return false;
			}
		}
	}
	else{
		let x = Math.abs(selectedHexagonIntList[0]-selectedHexagonIntList[1])
		let maxi = Math.max(Math.max(selectedHexagonIntList[0],selectedHexagonIntList[1]), selectedHexagonIntList[2])+x;
		let mini = maxi-4*x;
		let sensDeplacement = -procheZero((maxi-x-hexagonIntTo), (mini+x-hexagonIntTo));
		if ((hexagonIntTo == maxi) || (hexagonIntTo == mini)){
			if (isVsColor(selectedHexagon, hexagonTo) && billesAdversesAlignees(hexagonIntTo, sensDeplacement) > 2){
				return false; 
			}
			else{
				return true;
			}
		}
		else{
			sensDeplacement = hexagonIntTo - selectedHexagonIntList[0];
			if(Math.abs(sensDeplacement) == 1 || Math.abs(sensDeplacement) == 10 || Math.abs(sensDeplacement) == 11){
				return isMoveLatPossible(sensDeplacement);
			}
			else{
				return false;
			}
		}
	}
	return true;
}

function isMoveLatPossible(x){
	let ret = true;
	for(let i=0; i<selectedHexagonIntList.length;i++){
		hexagonIntTarget = selectedHexagonIntList[i]+x;
		hexagonTarget = document.getElementById("hexagon"+hexagonIntTarget);
		if (hexagonTarget != null){
			if (hexagonTarget.classList.contains("caseB") || hexagonTarget.classList.contains("caseW")){
				ret = false;
			}
		}
		else{
			ret = false;
		}
	}
	return ret;
}

function procheZero(x,y){
	z = Math.min(Math.abs(x),Math.abs(y));
	if(Math.abs(x)==z){
		return x;
	}
	else{
		return y;
	}
}

function billesAdversesAlignees(hexagonIntTo, sensDeplacement){
	let nbBillesAlignees = 0;
	hexagonIntToCons = hexagonIntTo;
	hexagonTo = document.getElementById("hexagon"+hexagonIntTo);
	hexagonTarget = document.getElementById("hexagon"+hexagonIntToCons);
	condition = true;
	while (condition){
		console.log("entree dans la boucle");
		nbBillesAlignees += 1;
		hexagonIntToCons += sensDeplacement;
		hexagonTarget = document.getElementById("hexagon"+hexagonIntToCons);
		if (hexagonTarget != null){
			if(isVsColor(hexagonTo, hexagonTarget)){
				nbBillesAlignees = 3;
				condition = false;
			}
			else if(!isSameColor(hexagonTo, hexagonTarget)){
				condition = false;
			}
		}
		else{ // on est sur un bord
			condition = false;
		}
	}
	console.log(nbBillesAlignees);
	return nbBillesAlignees;
}

function getDeplacement(hexagonIntTo){
	let n = selectedHexagonIntList.length;
	let x = Math.abs(selectedHexagonIntList[0]-selectedHexagonIntList[1])
	let maxi = 0;
	if(selectedHexagonIntList.length == 2){
		maxi = Math.max(selectedHexagonIntList[0],selectedHexagonIntList[1])+x;
	}
	else{
		maxi = Math.max(Math.max(selectedHexagonIntList[0],selectedHexagonIntList[1]), selectedHexagonIntList[2])+x;
	}
	let mini = maxi-(n+1)*x;
	let sensDeplacement = hexagonIntTo-selectedHexagonIntList[0];
	if(hexagonIntTo == maxi || hexagonIntTo == mini){
		sensDeplacement = -procheZero((maxi-x-hexagonIntTo), (mini+x-hexagonIntTo));
	}
	return sensDeplacement;
}

function getBilleDeplacement(deplacement){
	let numBille = 1;
	let billeIntDeplacement = null;
	for (let i=0; i<selectedHexagonIntList.length; i++){
		billeIntDeplacement = selectedHexagonIntList[i]+deplacement*(selectedHexagonIntList.length-1);
		billeDeplacement = document.getElementById("hexagon"+billeIntDeplacement);
		if(billeDeplacement != null){
			if(billeDeplacement.classList.contains("select")){
				numBille = i;
				console.log("ui");
			}
		}
	}
	return selectedHexagonIntList[numBille];
}

function play(hexagonIntFromList, hexagonIntToList){
    socket.emit('play', [hexagonIntFromList, hexagonIntToList]);
    move(hexagonIntFromList, hexagonIntToList);
    isItTheEnd();
}

function move(hexagonIntFromList, hexagonIntToList){
    for(let i = 0; i < hexagonIntFromList.length; i++){
        moveOne(hexagonIntFromList[i], hexagonIntToList[i]);
    }
}

function moveOne(hexagonIntFrom, hexagonIntTo){
    console.log("moveOne"+hexagonIntFrom.toString());

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
    moveOne(hexagonIntTo, nextMove);

    // On remet To
    let hexagonTo = document.getElementById("hexagon"+hexagonIntTo.toString());
    addBall(hexagonTo, colorFrom);
}

function updateScoreIndicator(){
    document.getElementById("scoreIndicator").innerHTML = "Score : noirs "+score[0].toString()+" - "+score[1].toString() + " blancs";
}

function updatePlayerColorIndicator(){
    if(playerColor != null)
        document.getElementById("playerColorIndicator").innerHTML = "Vous jouez les " + playerNames[playerColor] + ".";
}

function updateTurnToPlayIndicator(){
    document.getElementById("turnToPlayIndicator").innerHTML = "C'est aux " + playerNames[turnToPlay] + " de jouer.";
}

function isItTheEnd(){
    let won = -1;
    if(score[playerColor] == 6)
        won = 1;
    else if(score[1-playerColor] == 6)
        won = 0;
    if(won > -1){
        end(won);
        socket.emit('end', won);
    }
}

function end(won){
    console.log('end ', won);
    let endScene = document.getElementById('EndScene');
    if(won == 1){
        endScene.innerHTML = "Vous avez gagné, félicitation!";
        endScene.classList.add('victory');
    }
    else{
        endScene.innerHTML = "Vous avez perdu, dommage!";
        endScene.classList.add('defeat');
    }
    
}

function readyButtonClicked(){
    let button = document.getElementById("readyButton");
    if(ready){
        button.classList.remove('ready');
        button.innerHTML = "Prêt";
    }else{
        button.classList.add('ready');
        button.innerHTML = "En attente d'un autre joueur (annuler)";
    }
    ready = !ready;
    
    socket.emit('ready', ready);
}



var socket = io.connect('http://localhost:8080');
socket.on('init', function (playerColor) {
    init(playerColor);
});
socket.on('opponentPlay', function (hexagonIntFromAndToList) {
    console.log('socket.on opponentPlay');
    move(hexagonIntFromAndToList[0], hexagonIntFromAndToList[1]);
    beginTurn(1-turnToPlay);
});
socket.on('clear', function () {
    clear();
});
socket.on('end', function (won) {
    end(won);
});


window.onload = clear;