function getRandomInt(min, max) {
    if (min == max) return min;
    return Math.floor(1/Math.random() % (max - min) + min);
}

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
            } //left
            if (i - 1 >= 0 && !maze[i-1][j]) {
                adjacencyMatrix
                [i*maze[0].length + j]
                [(i-1)*maze[0].length + j] = 1;
            } //up
            if (j + 1 < maze[0].length && !maze[i][j+1]) {
                adjacencyMatrix
                [i*maze[0].length + j]
                [i*maze[0].length + j + 1] = 1;
            } //right
            if (i + 1 < maze[0].length && !maze[i+1][j]) {    
                adjacencyMatrix
                [i*maze[0].length + j]
                [(i+1)*maze[0].length + j] = 1;
            } //down
        }
    }
    return adjacencyMatrix;
}

class Grid {
    constructor(cellCountInSide) {
        this.canvas = document.getElementById('maze_field');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width  = 1000;
        this.canvas.height = 1000;

        this.grid = createSquareMatrix(cellCountInSide, 0);

        this.cellCountInSide = cellCountInSide;
        this.cellWidth  = this.canvas.width  / cellCountInSide;
        this.cellHeight = this.canvas.height /  cellCountInSide;
        
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    draw() {
        for(let i = 0; i < this.cellCountInSide; i++) {
            for(let j = 0; j < this.cellCountInSide; j++) {

                switch (this.grid[i][j]) {
                    case 0:
                        this.ctx.fillStyle = "rgb(255, 255, 255)";
                        break;
                    case 1:
                        this.ctx.fillStyle = "rgb(0,0,0)";
                        break;
                    case 2:
                        this.ctx.fillStyle = "rgb(5, 177, 51)";
                        break;
                    case 3:
                        this.ctx.fillStyle = "rgb(207, 44, 44)";
                        break;
                }

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
        const row = Math.floor((event.clientY - rect.top) / this.cellHeight);
        const col = Math.floor((event.clientX - rect.left) / this.cellHeight);
        
        this.grid[row][col] = this.grid[row][col] ? 0 : 1;
        this.draw();
    }
    
    //возвращает смежные вершины (пары индексов-координат)
    getAdjacentVertices(i, j) {
        let adjacent = [];
        if (j - 1 >= 0 && !this.grid[i][j-1]) {
            adjacent.push({y: i, x: j-1});
        }//left
        if (i - 1 >= 0 && !this.grid[i-1][j]) {
            adjacent.push({y: i-1, x: j});
        }//up
        if (j + 1 < maze[0].length && !this.grid[i][j+1]) {
            adjacent.push({y: i, x: j+1});
        }//right
        if (i + 1 < maze[0].length && !this.grid[i+1][j]) {  
            adjacent.push({y: i+1, x: j});
        }//down
        return adjacent;
    }

    squareMazeGenerator() {
        for(let i = 0; i < this.cellCountInSide; i++) {
            for(let j = 0; j < this.cellCountInSide; j++) {
                this.grid[i][j] = Math.floor(Math.random() * 2);
            }
        }
        this.draw();
    }

    generateMaze() {
        this.grid = createSquareMatrix(this.cellCountInSide, 1);
        let x = getRandomInt(0, this.cellCountInSide);
        let y = getRandomInt(0, this.cellCountInSide);
        this.grid[x][y] = 0;
        this.draw();
        
        queue = [];
        if (y - 2 >= 0) {
            queue.push({x: x, y: y - 1});
        }
        if (y + 2 < this.cellCountInSide) {
            queue.push({x: x, y: y + 1});
        }
        if (x - 2 >= 0) {
            queue.push({x: x - 1, y: y});
        }
        if (x + 2 < this.cellCountInSide) { 
            queue.push({x: x + 1, y: y});
        }

        while (queue.length > 0) {
            let index = getRandomInt(0, queue.length);
            cell = queue[index];
            queue.splice(index, 1); // Удалить 1 элемент, начиная с индекса
            x = cell.x;
            y = cell.y;
            this.grid[x][y] = 0;

            // The cell you just cleared needs to be connected with another clear cell.
            // Look two orthogonal spaces away from the cell you just cleared until you find one that is not a wall.
            // Clear the cell between them.
            let directions =
            [
                {x: x, y: y - 1, direct: up},
                {x: x, y: y + 1, direct: down},
                {x: x + 1, y: y, direct: right },
                {x: x - 1   , y: y, direct: left }
            ];
            
            while (directions.length > 0) {
                let dir_index = getRandomInt(0, directions.length);

                switch (directions[dir_index].direct) {
                case up:
                    if (y - 2 >= 0 && grid[x][y - 2] == 0) {
                        this.grid[x][y - 1] = 0;
                        directions = [];
                    }
                    break;
                case down:
                    if (y + 2 < this.cellCountInSide && grid[x][y + 2] == 0) {
                        this.grid[x][y + 1] = 0;
                        directions = [];
                    }
                    break;
                case right:
                    if (x - 2 >= 0 && grid[x - 2][y] == 0) {
                        this.grid[x - 1][y] = 0;
                        directions = [];
                    }
                    break;
                case left:
                    if (x + 2 < this.cellCountInSide && grid[x + 2][y] == 0) {
                        this.grid[x + 1][y] = 0;
                        directions = [];
                    }
                    break;
                }
                directions.remove(dir_index, 1);
            }

            // Add valid cells that are two orthogonal spaces away from the cell you cleared.
            if (y - 2 >= 0 && grid[x][y - 2] == 1) {
                queue.push({x: x, y : y - 1});
            }
            if (y + 2 < height && grid[x][y + 2] == 1) {
                queue.push({x: x, y : y + 1});
            }
            if (x - 2 >= 0 && grid[x - 2][y] == 1) {
                queue.push({x: x - 1, y : y});
            }
            if (x + 2 < width && grid[x + 2][y] == 1) {
                queue.push({x: x + 1, y : y});
            }
        }
        draw();
    }
}