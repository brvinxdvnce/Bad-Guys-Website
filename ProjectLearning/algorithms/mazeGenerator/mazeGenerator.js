
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
                    case 0: //свободная зона
                        this.ctx.fillStyle = "rgb(255, 255, 255)";
                        break;
                    case 1: //стена
                        this.ctx.fillStyle = "rgb(0,0,0)";
                        break;
                    case 2: //старт пути
                        this.ctx.fillStyle = "rgb(5, 177, 51)";
                        break;
                    case 3: //конец пути (в генерации лабиринта - вершина в очереди, для красоты)
                        this.ctx.fillStyle = "rgb(207, 44, 44)";
                        break;
                    case 4: //элементы, где прошелся алгоритм А*
                        this.ctx.fillStyle = "rgb(245, 208, 86)";
                        break;
                    case 5: //пограничные вершины для алгоритма А*
                        this.ctx.fillStyle = "rgb(237, 138, 0)";
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

    randomMazeGenerator() {
        for(let i = 0; i < this.cellCountInSide; i++) {
            for(let j = 0; j < this.cellCountInSide; j++) {
                this.grid[i][j] = Math.floor(Math.random() * 2);
            }
        }
        this.draw();
    }

    generateMaze() {
        this.grid = createSquareMatrix(this.cellCountInSide, 1);
        let startX = getRandomInt(0, this.cellCountInSide);
        let startY = getRandomInt(0, this.cellCountInSide);
        this.grid[startX][startY] = 0;
        this.draw();
        
        let queue = [];
        let inQueue = createSquareMatrix(this.cellCountInSide, 0);
        
        const addToQueue = (x, y) => {
            if (x >= 0 && y >= 0 &&
                x < this.cellCountInSide &&
                y < this.cellCountInSide &&
                !inQueue[x][y] && this.grid[x][y] === 1) {
                queue.push({ x, y });
                inQueue[x][y] = true;
            }
        };

        addToQueue(startX, startY - 2);
        addToQueue(startX, startY + 2);
        addToQueue(startX - 2, startY);
        addToQueue(startX + 2, startY);

        while (queue.length > 0) {
            let index = getRandomInt(0, queue.length);
            let cell = queue[index];
            queue.splice(index, 1); // Удалить 1 элемент, начиная с индекса
            let x = cell.x;
            let y = cell.y;
            this.grid[x][y] = 0;

            let neighbors = [];
            if (y - 2 >= 0 &&
                this.grid[x][y - 2] == 0) {
                neighbors.push({x: x, y: y - 1});
            }
            if (y + 2 < this.cellCountInSide &&
                this.grid[x][y + 2] == 0) {
                neighbors.push({x: x, y: y + 1});
            }
            if (x - 2 >= 0 &&
                this.grid[x - 2][y] == 0) {
                neighbors.push({x: x - 1, y: y});
            }
            if (x + 2 < this.cellCountInSide &&
                this.grid[x + 2][y] == 0) {
                neighbors.push({x: x + 1, y: y});
            }
    
            if (neighbors.length > 0) {
                let randNeighbor = neighbors[getRandomInt(0, neighbors.length)];
                this.grid[randNeighbor.x][randNeighbor.y] = 0;
                this.grid[x][y] = 0; // Добавляем клетку в лабиринт только после соединения
    
                // Добавляем соседние клетки в очередь
                addToQueue(x, y - 2);
                addToQueue(x, y + 2);
                addToQueue(x - 2, y);
                addToQueue(x + 2, y);
            }
        }
        this.draw();
    }
}
