//generate an array x by x and fill it with the n
function createSquareMatrix(size, value = 0) {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => value))
}

//получение матрицы смежности лабиринта
function getAdjacencyMatrixFromMaze(maze) {
    let adjacencyMatrix = createSquareMatrix(maze[0].length * maze[0].length, 0)
    //0 - есть возможность пройти
    //1 - стенка
    for (let i = 0; i < maze[0].length; ++i) {
        for (let j = 0; j < maze[0].length; ++j) {
            if (maze[i][j] == 1) continue;

            if (j - 1 >= 0 && !maze[i][j-1]) {
                adjacencyMatrix
                [i*maze[0].length + j]
                [i*maze[0].length + j - 1] = 1;
            }//left
            if (i - 1 >= 0 && !maze[i-1][j]) {
                adjacencyMatrix
                [i*maze[0].length + j]
                [(i-1)*maze[0].length + j] = 1;
            }//up
            if (j + 1 < maze[0].length && !maze[i][j+1]) {
                adjacencyMatrix
                [i*maze[0].length + j]
                [i*maze[0].length + j + 1] = 1;
            }//right
            if (i + 1 < maze[0].length && !maze[i+1][j]) {    
                adjacencyMatrix
                [i*maze[0].length + j]
                [(i+1)*maze[0].length + j] = 1;
            }//down
        }
    }
    return adjacencyMatrix;
}

function squareMazeGenerator(size) {
    var maze = createSquareMatrix(size, 0);
    //TODO maze gen.
}