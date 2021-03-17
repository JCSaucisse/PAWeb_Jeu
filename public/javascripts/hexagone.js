function clicked() { 
    document.getElementById('myButton').className = "hexagon playable"; 
}

function createGrid(){
    let grid = [
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,0,0],
        [0,0,1,1,1,1,1,0,0]];

    let gridElement = document.getElementById('grid');
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            let newHexagon = document.createElement("div");
            if(grid[i][j] == 0){
                newHexagon.className = "hexagon empty";
            }
            else {
                newHexagon.className = "hexagon playable";
            }
            gridElement.appendChild(newHexagon);
        }
    }
}

function placeBalls(){
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
        let newDiv = document.createElement("div");
        playableCases[i].appendChild(newDiv);
        if(gridInit[i] == 2)
            newDiv.className = "ballW";
        else if (gridInit[i] == 3)
            newDiv.className = "ballB";
    }
}
window.onload = createGrid(), placeBalls();
