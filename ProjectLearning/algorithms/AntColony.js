class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

// измеряет расстояние между двумя точками
function distance(point1, poin2){
    return Math.sqrt(Math.pow(point2.x-point1.x) + Math.pow(point2.y-point1.x));
}

// создает матрицу расстояний
function makeMatrixDistance(length, pointsArray){
    let matrix = Array(length);
    for(let i = 0; i < length; i++){
        matrix[i] = Array(length);
    }
    
    for(let i = 0; i < length; i++){
        for(let j = 0; j < length; j++){
            matrix[i][j] = distance(pointsArray[i], pointsArray[j]);
        }
    }
    return matrix;
}

// создает матрицу ферамонов
function pheromoneMatrix(length, pointsArray){
    let matrix = Array(length);
    for(let i = 0; i < length; i++){
        matrix[i] = Array(length);
    }
    
    for(let i = 0; i < length; i++){
        for(let j = 0; j < length; j++){
            matrix[i][j] = 0,5;
        }
    }
    return matrix;
}

// класс муравей
class Ant{
    constructor(startPosiziton){
        this.startPosiziton = startPosiziton;
    }
    antWay = Array(countPoint); // путь муравья с условием возвращения в начальную точку
    antVisited = Array(countPoint).fill(false); // посещенные вершины на данном этапе
    antDistance = 0; // расстояние, которое прошел муравей
    start = startPozition;
    currentPoint = startPosizitonozition;
    abilityMove = true; // возможность продолжать движение

    // муравей делает выбор. возвращает точку, в которую пойдет дальше
    makeChoice() {
        available = []; // массив возможных для перехода точек

        for(let i = 0; i < this.antVisited.length; i++){
            if(this.antVisited[i] == false){
                available.push(this.antVisited[i]);
            } 
        }

        // если ни одна вершина еще не посещена иницилизируем начальную точку как посещенную и записываем ее в путь
        if(visited.empty()){
            this.antVisited[this.currentPoint] = true;
            this.antWay.push(this.currentPoint);
        }

        // если больше нет точек в которые можно попасть, возвращаемся в исходную
        if(available.empty()){
            this.abilityMove = false;
            this.antDistance += matrix[this.currentPoint][this.startPosiziton];
            return;
        }

        // формула для подсчета вероятности перехода:
        // вероятность перехода из i в j = ((количество ферамона между i j)^alpha * (расстояние между i j)^beta)/(сумма желаний перейти из i и всеми остальными точками)

        wish = []; // массив желания перейти из i в j
        probability = []; // вероятность перехода из i в j
        choseNeighbor = []; // массив, который будет представлять промежутки значений, чтобы рандомное число попало на один из них. промежутки строятся в зависимости от вероятности перехода.
        totalWish = 0; // сумма желаний перейти из i и всеми остальными точками

        // заполняем список желаний и увеличиваем сумму желаний
        for(let i = 0; i < available.length; i++){
            wish.push(Math.pow(pheromone[this.currentPoint][i], alpha)*Math.pow(1/matrix[this.currentPoint, beta]));
            totalWish += wish.back();
        }


        // заполняем массив вероятности и создаем промежутки, куда вероятность может попасть
        for(let i = 0; i < available.length; i++){
            probability.push(wish[i]/totalWish);
            if(i == 0){
                choseNeighbor.push(probability.back());
            }
            else{
                choseNeighbor.push(choseNeighbor[i-1] + probability.back());
            }
        }
        randomNumber = Math.random();
        nextPoint;

        // произвольное значение попадает на один из промежутков choseNeighbor. Значит в эту точку муравей и пойдет
        for(let i = 0; i < available.length; i++){
            if(randomNumber <= choseNeighbor[i]){
                nextPoint = available[i];
                break;
            }
        }
        return nextPoint;
    }


}
function antAlgorithm(){
    var points = [];
    var countPoint = points.length;
    var matrix = makeMatrix(countPoint, points);
    var pheromone = pheromoneMatrix(countPoint, points);
    var alpha = 1;
    var beta = 1;






    
}