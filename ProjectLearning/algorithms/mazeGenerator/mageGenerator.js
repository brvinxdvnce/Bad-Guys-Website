//generate an array x by x and fill it with the n
function createSquareMatrix(x, n) {
    return Array.from({ length: x }, () => Array(x).fill(n));
}

function squareMazeGenerator(size) {
    var maze = createSquareMatrix(size, 0);
    
}

var mazeSize = 10;
var rows = mazeSize;
var columns = mazeSize;
var maze = createSquareMatrix(mazeSize, 0);