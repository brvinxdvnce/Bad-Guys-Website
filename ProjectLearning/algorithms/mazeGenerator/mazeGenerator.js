class MazeCell {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }
}

function getRandomInt(min, max) {
    return Math.floor(1/Math.random() % (max - min) + min);
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
        const row = Math.floor((event.clientY - rect.top) / this.cellHeight);
        const col = Math.floor((event.clientX - rect.left) / this.cellHeight);
        
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

    // generateMaze() {
    //     //vector<vector<int>> Prima(vector<vector<int> > graph, int n, int& size)
    //     // {
    //     //     vector<vector<int> > ostov(n, vector<int>(n, 0));
    //     //     vector<int> visited(n, 0);

    //     //     visited[0] = true;
    //     //     int countVertex = 1;

    //     //     while (countVertex < n)
    //     //     {
    //     //         int beginEdge = -1;
    //     //         int endEdge = -1;
    //     //         int minEdge = INT_MAX;

    //     //         for (int i = 0; i < visited.size(); i++)
    //     //         {
    //     //             if (visited[i])
    //     //             {
    //     //                 for (int neighbor = 0; neighbor < n; neighbor++)
    //     //                 {
    //     //                     if (!visited[neighbor] && graph[i][neighbor] && graph[i][neighbor] < minEdge)
    //     //                     {
    //     //                         minEdge = graph[i][neighbor];
    //     //                         beginEdge = i;
    //     //                         endEdge = neighbor;
    //     //                     }
    //     //                 }
    //     //             }
    //     //         }
    //     //         if (minEdge != INT_MAX)
    //     //         {
    //     //             visited[endEdge] = true;
    //     //             ostov[beginEdge][endEdge] = graph[beginEdge][endEdge];
    //     //             ostov[endEdge][beginEdge] = graph[endEdge][beginEdge];
    //     //             size += minEdge;
    //     //             countVertex++;
    //     //         }
    //     //     }
    //     //     return ostov;
    //     // }



    //     // This algorithm is a randomized version of Prim's algorithm.
    //     // Start with a grid full of walls.
    //     // Pick a cell, mark it as part of the maze. Add the walls of the cell to the wall list.
    //     // While there are walls in the list:
    //     // Pick a random wall from the list. If only one of the cells that the wall divides is visited, then:
    //     // Make the wall a passage and mark the unvisited cell as part of the maze.
    //     // Add the neighboring walls of the cell to the wall list.
    //     // Remove the wall from the list.
    //     // Note that simply running classical Prim's on a graph with random edge weights would create
    //     // mazes stylistically identical to Kruskal's, because they are both minimal spanning tree algorithms.
    //     // Instead, this algorithm introduces stylistic variation because the edges closer to the starting
    //     // point have a lower effective weight.

    //     // Modified version
    //     // Although the classical Prim's algorithm keeps a list of edges, for maze generation we could instead
    //     // maintain a list of adjacent cells. If the randomly chosen cell has multiple edges that connect it
    //     // to the existing maze, select one of these edges at random. This will tend to branch slightly more
    //     // than the edge-based version above.

    //     // Simplified version
    //     // The algorithm can be simplified even further by randomly selecting cells that neighbour
    //     // already-visited cells, rather than keeping track of the weights of all cells or edges.

    //     // It will usually be relatively easy to find the way to the starting cell, but hard to find the way
    //     // anywhere else.

    //     map = createSquareMatrix(width, 1);

    //     // Удалить 1 элемент, начиная с индекса 2
    //     // arr.splice(2, 1); 

    //     //start
    //     let x = getRandomInt(0, this.cellCountInSide);
    //     let y = getRandomInt(0, this.cellCountInSide);
    //     map[x][y] = 0;

    //     // Create an array and add valid cells that are two orthogonal spaces away from the cell you just cleared.
    //     queue = [];
    //     if (y - 2 >= 0) {
    //         queue.push({x: x, y: y - 2});
    //     }
    //     if (y + 2 < height) {
    //         queue.push({x: x, y: y + 2});
    //     }
    //     if (x - 2 >= 0) {
    //         queue.push({x: x - 2, y: y});
    //     }
    //     if (x + 2 < width) {
    //         queue.push({x: x + 2, y: y});
    //     }

    //     // While there are cells in your growable array, choose choose one at random, clear it,
    //     // and remove it from the growable array.
    //     while (queue.length > 0) {
    //         let index = getRandomInt(0, queue.length);
    //         cell = queue[index];
    //         x = cell.x;
    //         y = cell.y;
    //         map[x][y] = 0;
    //         queue.splice(index);

    //         // The cell you just cleared needs to be connected with another clear cell.
    //         // Look two orthogonal spaces away from the cell you just cleared until you find one that is not a wall.
    //         // Clear the cell between them.
    //         Direction[] d = {Direction.NORTH, Direction.SOUTH, Direction.EAST, Direction.WEST};
    //         while (d.length > 0) {
    //             let dir_index = random_int(0, d.size());
    //             switch (d[dir_index]) {
    //             case Direction.NORTH:
    //                 if (y - 2 >= 0 && map[x][y - 2].is_clear()) {
    //                 map[x][y - 1].make_clear();
    //                 d.remove_all();
    //                 }
    //                 break;
    //             case Direction.SOUTH:
    //                 if (y + 2 < height && map[x][y + 2].is_clear()) {
    //                 map[x][y + 1].clear();
    //                 d.remove_all();
    //                 }
    //                 break;
    //             case Direction.EAST:
    //                 if (x - 2 >= 0 && map[x - 2][y].is_clear()) {
    //                 map[x - 1][y].make_clear();
    //                 d.remove_all();
    //                 }
    //                 break;
    //             case Direction.WEST:
    //                 if (x + 2 < width && map[x + 2][y].is_clear()) {
    //                 map[x + 1][y].make_clear();
    //                 d.remove_all();
    //                 }
    //                 break;
    //             }
    //             d.remove(dir_index);
    //         }

    //         // Add valid cells that are two orthogonal spaces away from the cell you cleared.
    //         if (y - 2 >= 0 && map[x][y - 2].is_wall()) {
    //             queue.push(new MazeCell(x, y - 2));
    //         }
    //         if (y + 2 < height && map[x][y + 2].is_wall()) {
    //             queue.push(new MazeCell(x, y + 2));
    //         }
    //         if (x - 2 >= 0 && map[x - 2][y].is_wall()) {
    //             queue.push(new MazeCell(x - 2, y));
    //         }
    //         if (x + 2 < width && map[x + 2][y].is_wall()) {
    //             queue.push(new MazeCell(x + 2, y));
    //         }
    //     }
    // }
}
