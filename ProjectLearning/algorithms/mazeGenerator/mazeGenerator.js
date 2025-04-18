function sleep(ms) {
    return new Promise(pass => setTimeout(pass, ms));
}

function getMinQuEl(q) {
    if (!q) return;
    let minElem = q[0];
    for (elem of q) minElem = elem.f < minElem.f ? elem : minElem;
    return minElem;
}

function getRandomInt(min, max) {
    if (min == max) return min;
    return Math.floor(max*Math.random() % (max - min) + min);
}

function createSquareMatrix(size, value = 0) {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => value))
}

class Cell {
    constructor(x, y, parent = null) {
      this.x = x;
      this.y = y;
      this.parent = parent;
      this.g = parent ? parent.g + 1 : 0; // Манхэттенское расстояние от старта
      this.h = 0; // Манхэттенское расстояние до финиша 
      this.f = 0; // Общая стоимость (g + h)
    }
  }

class Grid {
    constructor(cellCountInSide = 21) {
        if (cellCountInSide <= 0) cellCountInSide = 1;
        if (cellCountInSide > 250) cellCountInSide = 21;

        cellCountInSide += cellCountInSide % 2 == 0;
        
        this.canvas = document.getElementById('maze_field');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width  = 1000;
        this.canvas.height = 1000;

        this.grid = createSquareMatrix(cellCountInSide, 0);

        this.cellCountInSide = cellCountInSide;
        this.cellWidth  = this.canvas.width  / cellCountInSide;
        this.cellHeight = this.canvas.height /  cellCountInSide;
        
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        this.endPoints = [];
    }

    draw () {
        for(let i = 0; i < this.cellCountInSide; i++) {
            for(let j = 0; j < this.cellCountInSide; j++) {
                switch (this.grid[i][j]) {
                    case 0: //свободная зона
                        this.ctx.fillStyle = "rgb(255, 255, 255)";
                        break;
                    case 1: //стена
                        this.ctx.fillStyle = "rgb(0,0,0)";
                        break;
                    case 2: // free
                        this.ctx.fillStyle = "rgb(5, 177, 51)";
                        break;
                    case 3: //конец пути
                        this.ctx.fillStyle = "rgb(43, 224, 212)";
                        break;
                    case 4: //элементы, где прошелся алгоритм А*
                        this.ctx.fillStyle = "rgb(245, 208, 86)";
                        break;
                    case 5: //пограничные вершины для алгоритма А*
                        this.ctx.fillStyle = "rgb(237, 138, 0)";
                        break;
                    case 6: //путь А*
                        this.ctx.fillStyle = "rgb(238, 24, 0)";
                        break;
                }

                this.ctx.fillRect(
                    j * this.cellHeight,
                    i * this.cellWidth,
                    this.cellHeight,
                    this.cellWidth );
            }
        }
    }

    async drawWay (way) {
        let cell;
        console.log("start draw a way");
        for (let i = 0; i < way.length; ++i) {
            cell = way[i];
            this.grid[cell.y][cell.x] = 6;
            this.drawCell(cell.y, cell.x);
            await sleep(60);
        }
    }

    drawCell (i, j) {
        switch (this.grid[i][j]) {
            case 0: //свободная зона
                this.ctx.fillStyle = "rgb(255, 255, 255)";
                break;
            case 1: //стена
                this.ctx.fillStyle = "rgb(0,0,0)";
                break;
            case 2: // free
                this.ctx.fillStyle = "rgb(5, 177, 51)";
                break;
            case 3: //конец пути
                this.ctx.fillStyle = "rgb(43, 224, 212)";
                break;
            case 4: //элементы, где прошелся алгоритм А*
                this.ctx.fillStyle = "rgb(245, 208, 86)";
                break;
            case 5: //пограничные вершины для алгоритма А*
                this.ctx.fillStyle = "rgb(237, 138, 0)";
                break;
            case 6: //путь А*
                this.ctx.fillStyle = "rgb(238, 24, 0)";
                break;
        }
        this.ctx.fillRect(
            j * this.cellHeight,
            i * this.cellWidth,
            this.cellHeight,
            this.cellWidth );
    } 

    cleanWay () {
        for(let i = 0; i < this.cellCountInSide; i++) {
            for(let j = 0; j < this.cellCountInSide; j++) {
                this.grid[i][j] = (this.grid[i][j] != 1 && this.grid[i][j] != 3)? 0 : this.grid[i][j];
            }
        }
        this.draw()
    }

    clean () {
        for(let i = 0; i < this.cellCountInSide; i++) {
            for(let j = 0; j < this.cellCountInSide; j++) {
                this.grid[i][j] = 0;
            }
        }
        this.endPoints = [];
        this.draw();
    }

    // Обработка клика
    handleClick (event) {
        const rect = this.canvas.getBoundingClientRect();
        const row = Math.floor((event.clientY - rect.top) / this.cellHeight);
        const col = Math.floor((event.clientX - rect.left) / this.cellHeight);
        
        let isChecked = document.getElementById('checkbox').checked;
        
        if (isChecked) {
            this.endPoints.push({x: col, y: row});
            this.grid[row][col] = 3;
            while (this.endPoints.length > 2) {
                this.grid[this.endPoints[0].y][this.endPoints[0].x] = 0;
                this.endPoints.splice(0, 1);
            }
            this.draw();
        }
        else {
            this.grid[row][col] = this.grid[row][col] == 1 ? 0 : 1;
            this.draw();
        }
    }

    randomMazeGenerator() {
        for(let i = 0; i < this.cellCountInSide; i++) {
            for(let j = 0; j < this.cellCountInSide; j++) {
                this.grid[i][j] = Math.floor(Math.random() * 2);
            }
        }
        this.draw();
    }

    async generateMaze() {
        // для норм отображения сторона либиринта должна быть нечетной длины, иначе
        // получается некрасиво

        this.grid = createSquareMatrix(this.cellCountInSide, 1);
        let startX = getRandomInt(0, this.cellCountInSide);
        let startY = getRandomInt(0, this.cellCountInSide);
        startX += startX % 2;
        startY += startY % 2;
        this.grid[startX][startY] = 0;
        
        let queue = [];
        let visited = [];
        
        const addToQueue = (x, y) => {
            if (x >= 0 && y >= 0 &&
                x < this.cellCountInSide &&
                y < this.cellCountInSide &&
                !visited.includes(`${x},${y}`) && this.grid[x][y] >= 1) {
                queue.push({x : x, y : y });    
                visited.push(`${x},${y}`);
            }
        };

        addToQueue(startX, startY - 2);
        addToQueue(startX, startY + 2);
        addToQueue(startX - 2, startY);
        addToQueue(startX + 2, startY);

        this.draw();
        await sleep(10);
        while (queue.length > 0) {
            let index = getRandomInt(0, queue.length);
            let cell = queue[index];
            queue.splice(index, 1); // Удалить 1 элемент, начиная с индекса
            let x = cell.x;
            let y = cell.y;
            this.grid[x][y] = 0;
            this.drawCell(x, y);
            await sleep(0.5);

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
            this.drawCell(randNeighbor.x, randNeighbor.y);
            await sleep(0.5);

            // Добавляем соседние клетки в очередь
            addToQueue(x, y - 2);
            addToQueue(x, y + 2);
            addToQueue(x - 2, y);
            addToQueue(x + 2, y);
        
        }
        console.log("maze has been genered");
        this.draw();
    }

    //манхэттенское расстояние, по сути, длина треугольника, где start и end - это вершины
    // на концах гипотенузы прямоугольного треугольника, а расстояние - длина катетов
    manhattanDistance(node1, node2) {
        return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
    }

    async goAStar() {
        if (this.endPoints.length < 2) return;
        let startPoint = this.endPoints[0];
        let endPoint = this.endPoints[1];

        let startCell = new Cell(startPoint.x, startPoint.y);
        let endCell = new Cell(endPoint.x, endPoint.y);
        

        // очередь - все пограничные вершины. на поле она немного напоминает очередь в обходе в ширину
        let queue = [];
        queue.push(startCell);

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
            // найти узел с минимальной стоимостью в очереди -> изьять его -> отметить как посещенный
            let currentNode = getMinQuEl(queue);
            queue.splice(queue.indexOf(currentNode), 1);
            this.grid[currentNode.y][currentNode.x] = 4;
            this.drawCell(currentNode.y, currentNode.x);
            await sleep(10);
            //this.draw();

            // проверка достижения цели
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
            //смотрим на клетки по кресту и ищем подходящие (куда можно пойти дальше)
            for (const dir of directions) {
                const x = currentNode.x + dir.dx;
                const y = currentNode.y + dir.dy;

                if (y < 0 || y >= this.cellCountInSide ||
                    x < 0 || x >= this.cellCountInSide) continue;
                if (this.grid[y][x] === 1) continue;
                if (this.grid[y][x] === 4) continue;
                if (this.grid[y][x] === 5) continue;
                const neighbor = new Cell(x, y, currentNode);

                // вычислить стоимости
                neighbor.g = currentNode.g + 1;
                neighbor.h = this.manhattanDistance({x: x, y: y}, endPoint);
                neighbor.f = neighbor.g + neighbor.h;

                // проверить случай, когда текущий элемент уже существует в очереди 
                // новые данные могут прокладывать более короткий путь
                const existingNode = queue.find(n => n.x === x && n.y === y);
                if (existingNode && this.grid[y][x] !== 4) {
                    if (neighbor.f < existingNode.f) {
                        existingNode.g = neighbor.g;
                        existingNode.f = neighbor.f;
                        existingNode.parent = currentNode;
                    }
                } else {
                    queue.push(neighbor);
                    this.grid[neighbor.y][neighbor.x] = 5;
                    this.drawCell(neighbor.y, neighbor.x);
                    await sleep(10);
                }
            }
        }
        return; // Путь не найден
        }
    }