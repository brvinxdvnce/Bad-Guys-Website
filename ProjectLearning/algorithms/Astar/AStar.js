
// vector<int> dijkstra(vector<vector<pair <int, int>>> &graph, int start) {
//     vector<int> dist(graph.size(), INT_MAX);
//     vector<int> visited(graph.size(), 0);

//     dist[start] = 0;
//     for (int i = 0; i < graph.size(); ++i)
//     {
//         let nearest = -1;

//         for (let j = 0; j < graph.size(); ++j)
//         {
//             if (!visited[j] && (nearest == -1 || dist[nearest] > dist[j]))
//             {
//                 nearest = j;
//             }
//         }
//         visited[nearest] = 1;

//         for (auto & temp : graph[nearest])
//         {
//             int to = temp.first;
//             int we = temp.second;

//             if (dist[to] > dist[nearest] + we)
//             {
//                 dist[to] = dist[nearest] + we;
//             }
//         }
//     }
//     return dist;
// }

// A* Search Algorithm
// 1.  Initialize the open list
// 2.  Initialize the closed list
//     put the starting node on the open 
//     list (you can leave its f at zero)
// 3.  while the open list is not empty
//     a) find the node with the least f on 
//        the open list, call it "q"
//     b) pop q off the open list
  
//     c) generate q's 8 successors and set their 
//        parents to q
   
//     d) for each successor
//         i) if successor is the goal, stop search
        
//         ii) else, compute both g and h for successor
//           successor.g = q.g + distance between 
//                               successor and q
//           successor.h = distance from goal to 
//           successor (This can be done using many 
//           ways, we will discuss three heuristics- 
//           Manhattan, Diagonal and Euclidean 
//           Heuristics)
          
//           successor.f = successor.g + successor.h
//         iii) if a node with the same position as 
//             successor is in the OPEN list which has a 
//            lower f than successor, skip this successor
//         iV) if a node with the same position as 
//             successor  is in the CLOSED list which has
//             a lower f than successor, skip this successor
//             otherwise, add  the node to the open list
//      end (for loop)
  
//     e) push q on the closed list
//     end (while loop)

class Node
{
    constructor(y, x) {
        this.cord_x = x;
        this.cord_y = y;
        this.pointNumber = x + y * 1;
    }
}

//ячейка лабиринта
class mazeCell {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }
}

function astar(mazeMap, startPoint_x, startPoint_y, endPoint_x, endPoint_y) {
    let adjacencyMatrix = getAdjacencyMatrixFromMaze(mazeMap);
    let queue = []; //текущая очередь на рассмотрение
    let closedSet = []; //то, где мы уже были
    let finalWay = [];//путь от старта до финиша

    let start = new mazeCell(startPoint_y, startPoint_x);
    let end = new mazeCell(endPoint_y, endPoint_x);

    queue.push(start);
    while (queue || queue.length) {
        let p = queue[0];
        queue.shift();

        if (x in clodedSet) continue;

        if (x == end) return p;

        for (vertex of getAdjacentVertices(mazeMap, i, j)){
            queue.push(vertex);
        }
    }
    return -1;
}