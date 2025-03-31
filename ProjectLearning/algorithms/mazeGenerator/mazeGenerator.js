class MazeCell {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }
}

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

//возвращает смежные вершины (пары индексов)
function getAdjacentVertices(maze, i, j) {
    let adjacent = [];
    if (j - 1 >= 0 && !maze[i][j-1]) {
        adjacent.push(new MazeCell(i, j-1));
    }//left
    if (i - 1 >= 0 && !maze[i-1][j]) {
        adjacent.push(new MazeCell(i-1, j));
    }//up
    if (j + 1 < maze[0].length && !maze[i][j+1]) {
        adjacent.push(new MazeCell(i, j+1));
    }//right
    if (i + 1 < maze[0].length && !maze[i+1][j]) {  
        adjacent.push(new MazeCell(i+1, j));
    }//down
    return adjacent;
}

class Grid {
    constructor(cellCountInSide) {
        this.canvas = document.getElementById('maze_field');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width  = 1000;
        this.canvas.height = 1000;

        this.grid = createSquareMatrix(cellCountInSide, 0);

        this.cellCountInSide = cellCountInSide;
        this.cellWidth = this.canvas.width /  cellCountInSide;
        this.cellHeight = this.canvas.height /  cellCountInSide;
        
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    draw() {
        for(let i = 0; i < this.cellCountInSide; i++) {
            for(let j = 0; j < this.cellCountInSide; j++) {

                this.ctx.fillStyle = this.grid[i][j] ? '#000000' : '#ffffff';

                this.ctx.fillRect(
                    j * this.cellHeight,
                    i * this.cellWidth,
                    (j + 1) * this.cellHeight,
                    (i + 1) * this.cellWidth,);
            }
        }
    }

    // Обработка клика
    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        
        this.grid[row][col] = this.grid[row][col] ? 0 : 1;
        this.draw();
    }

    squareMazeGenerator() {
        for(let i = 0; i < this.cellCountInSide; i++) {
            for(let j = 0; j < this.cellCountInSide; j++) {
                this.grid[i][j] = Math.floor(Math.random() * 2);
            }
        }
        this.draw();
    }
}
