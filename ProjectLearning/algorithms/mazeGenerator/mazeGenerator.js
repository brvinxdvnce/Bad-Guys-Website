function getMinQuEl(q) {
    if (!q) return;
    let minElem = q[0];
    for (elem of q) minElem = elem.f < minElem.f ? elem : minElem;
    return minElem;
}

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

class Cell {
    constructor(x, y, parent = null) {
      this.x = x;
      this.y = y;
      this.parent = parent;
      this.g = 0; // Манхэттенское расстояние от старта
      this.h = 0; // Манхэттенское расстояние до финиша 
      this.f = 0; // Общая стоимость (g + h)
    }
  }

class Grid {
    constructor(cellCountInSide = 21) {
        document.getElementById('size_input').value
        
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
                    case 3: //конец пути
                        this.ctx.fillStyle = "rgb(207, 44, 44)";
                        break;
                    case 4: //элементы, где прошелся алгоритм А*
                        this.ctx.fillStyle = "rgb(245, 208, 86)";
                        break;
                    case 5: //пограничные вершины для алгоритма А*
                        this.ctx.fillStyle = "rgb(237, 138, 0)";
                        break;
                    case 6: //путь А*
                        this.ctx.fillStyle = "rgb(85, 124, 216)";
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

    drawWay(way) {
        let cell;
        for (cell of way) {
            this.grid[cell.y][cell.x] = 6;
            this.draw();
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
        // для норм отображения сторона либиринта должна быть нечетной длины, иначе
        //получается некрасиво
        this.grid = createSquareMatrix(this.cellCountInSide, 1);
        let startX = getRandomInt(0, this.cellCountInSide);
        startX += startX % 2;
        let startY = getRandomInt(0, this.cellCountInSide);
        startY += startY % 2;
        this.grid[startX][startY] = 0;
        this.draw();
        
        let queue = [];
        let inQueue = createSquareMatrix(this.cellCountInSide, 0);
        
        const addToQueue = (x, y) => {
            if (x >= 0 && y >= 0 &&
                x < this.cellCountInSide &&
                y < this.cellCountInSide &&
                !inQueue[x][y] && this.grid[x][y] >= 1) {
                queue.push({x : x, y : y });
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

            let randNeighbor = neighbors[getRandomInt(0, neighbors.length)];
            this.grid[randNeighbor.x][randNeighbor.y] = 0;
            this.grid[x][y] = 0; // Добавляем клетку в лабиринт только после соединения

            // Добавляем соседние клетки в очередь
            addToQueue(x, y - 2);
            addToQueue(x, y + 2);
            addToQueue(x - 2, y);
            addToQueue(x + 2, y);
        
        }
        this.draw();
    }

    //манхэттенское расстояние, по сути, длина треугольника, где start и end - это вершины
    // на концах гипотенузы прямоугольного треугольника, а расстояние - длина катетов
    distance(node1, node2) {
        return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
    }

    goAStar(startPoint, endPoint) {
        let startCell = new Cell(startPoint.x, startPoint.y);
        let endCell = new Cell(endPoint.x, endPoint.y);
        
        // очередь - все пограничные вершины. на поле она немного напоминает очередь в обходе в ширину
        let queue = [];
        queue.push(startCell)

        const visited = new Set();
        // направления движения (вверх, вниз, влево, вправо)
        const directions = [
            { dx:  0, dy: -1},
            { dx:  0, dy:  1},
            { dx: -1, dy:  0},
            { dx:  1, dy:  0},
        ];

        // как это работает? из граничной очереди берется ближайшая к финишу точка,
        // проверяется на финиш : если да, то строится путь start - end, иначе берутся
        // соседи этой точки, добавляются в очередь и процесс начинается заново
        // если очередь опустела (буквально, проверили всю компоненту),
        // но финиша не было - лютый анлак, значит пути нет

        while (queue.length > 0 ) {
            // Найти узел с минимальной стоимостью в очереди -> изьять его -> отметить в visited (как строку!)
            let currentNode = getMinQuEl(queue);
            queue.splice(queue.indexOf(currentNode), 1);
            visited.add(`${currentNode.x},${currentNode.y}`);
            this.grid[currentNode.y][currentNode.x] = 4;

            // Проверка достижения цели
            if (currentNode.x === endPoint.x && currentNode.y === endPoint.y) {
                const way = [];
                let current = currentNode;
                while (current !== null) {
                    way.push({ x: current.x, y: current.y });
                    current = current.parent;
                }
                this.drawWay(way);
                return;
            }

            for (const dir of directions) {
                const x = currentNode.x + dir.dx;
                const y = currentNode.y + dir.dy;

                if (y < 0 || y >= this.cellCountInSide ||
                    x < 0 || x >= this.cellCountInSide) continue;
                if (this.grid[y][x] === 1) continue;
                if (visited.has(`${x},${y}`)) continue;
                const neighbor = new Cell(x, y, currentNode);

                // Вычислить стоимости
                neighbor.g = currentNode.g + 1;
                neighbor.h = this.distance(neighbor, endPoint);
                neighbor.f = neighbor.g + neighbor.h;

                // Проверить, есть ли сосед в queue с лучшим g
                const existingNode = queue.find(n => n.x === x && n.y === y);
                if (existingNode) {
                    if (neighbor.g < existingNode.g) {
                        existingNode.g = neighbor.g;
                        existingNode.f = neighbor.f;
                        existingNode.parent = currentNode;
                    }
                } else {
                    queue.push(neighbor);
                    this.grid[neighbor.y][neighbor.x] = 5;
                }
            }
        }
        return; // Путь не найден
        }
    }


    // let startPoint_x = startPoint.x;
    // let startPoint_y = startPoint.y;
    // let endPoint_x = endPoint.x;
    // let endPoint_y = endPoint.y;
    
    // let adjacencyMatrix = getAdjacencyMatrixFromMaze(this.grid);
    // let queue = []; //текущая очередь на рассмотрение
    // let closedSet = []; //то, где мы уже были
    // let finalWay = [];//путь от старта до финиша

    // let start = new MazeCell(startPoint_y, startPoint_x);
    // let end = new MazeCell(endPoint_y, endPoint_x);

    // queue.push(start);
    // while (queue || queue.length) {
    //     let p = queue[0];
    //     queue.shift();

    //     if (x in clodedSet) continue;

    //     if (x == end) return p;

    //     for (vertex of getAdjacentVertices(this.grid, i, j)){
    //         queue.push(vertex);
    //     }
    // }
    // return -1;
    // }



    // function sss() {
    //     let size = parseInt(document.getElementById('size_input').value) || 21;
    //     canv = new Grid(size || 21);
    //     canv.draw();
    //     canv.generateMaze();
    //}