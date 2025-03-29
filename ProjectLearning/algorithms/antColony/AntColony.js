class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

// измеряет расстояние между двумя точками
function distance(point1, point2){
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
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
function pheromoneMatrix(length, pointsArray, value){
    let matrix = Array(length);
    for(let i = 0; i < length; i++){
        matrix[i] = Array(length);
    }
    
    for(let i = 0; i < length; i++){
        for(let j = 0; j < length; j++){
            matrix[i][j] = value;
        }
    }
    return matrix;
}

function visitedFalse(visited){
    for(let i = 0; i < visited.length; i++){
        if(visited[i] === true){
            return false;
        }
    }
    return true;
}

// класс муравей
class Ant{
    constructor(startPosition, countPoint){
        this.start = startPosition;
        this.currentPoint = startPosition;
        this.antWay = []; // путь муравья с условием возвращения в начальную точку
        this.antVisited = Array(countPoint).fill(false); // посещенные вершины на данном этапе
        this.antDistance = 0; // расстояние, которое прошел муравей
        this.abilityMove = true; // возможность продолжать движение
    }

    // муравей делает выбор. возвращает точку, в которую пойдет дальше
    makeChoice(matrix, pheromone, alpha, beta){
        let available = []; // массив возможных для перехода точек

        for(let i = 0; i < this.antVisited.length; i++){
            if(this.antVisited[i] === false){
                available.push(i);
            } 
        }

        // если ни одна вершина еще не посещена, иницилизируем начальную точку как посещенную и записываем ее в путь
        if(visitedFalse(this.antVisited) === true){
            this.antVisited[this.currentPoint] = true;
            this.antWay.push(this.currentPoint);
        }

        // если больше нет точек, в которые можно попасть, возвращаемся в исходную
        if (available.length === 0){
            this.abilityMove = false;
            this.antDistance += matrix[this.currentPoint][this.start];
            this.antWay.push(this.start);
            return;
        }

        // формула для подсчета вероятности перехода:
        // вероятность перехода из i в j = ((количество ферамона между i и j)^alpha * (1/расстояние между i и j)^beta) / (сумма желаний перейти из i и всеми остальными точками)
        let wish = []; // массив желания перейти из i в j
        let probability = []; // вероятность перехода из i в j
        let choseNeighbor = []; // массив для промежутков значений, куда может попасть рандомное число
        let totalWish = 0; // сумма желаний перейти из i и всеми остальными точками

        // заполняем список желаний и увеличиваем сумму желаний
        for(let i = 0; i < available.length; i++){
            let j = available[i];
            let wishValue = Math.pow(pheromone[this.currentPoint][j], alpha) * Math.pow(1 / matrix[this.currentPoint][j], beta);
            wish.push(wishValue);
            totalWish += wishValue;
        }

        // заполняем массив вероятности и создаем промежутки, куда вероятность может попасть
        for(let i = 0; i < available.length; i++){
            probability.push(wish[i] / totalWish);
            if(i === 0){
                choseNeighbor.push(probability[i]);
            }
            else{
                choseNeighbor.push(choseNeighbor[i-1] + probability[i]);
            }
        }
        let randomNumber = Math.random();
        let nextPoint;

        choseNeighbor[choseNeighbor.length - 1] = 1; // устанавливаем конечный промежуток равный 1

        // произвольное значение попадает на один из промежутков choseNeighbor. Значит, в эту точку муравей и пойдет
        for(let i = 0; i < available.length; i++){
            if(randomNumber <= choseNeighbor[i]){
                nextPoint = available[i];
                break;
            }
        }

        this.antWay.push(nextPoint);
        this.antDistance += matrix[this.currentPoint][nextPoint];
        this.antVisited[nextPoint] = true;
        this.currentPoint = nextPoint;
    }
}

function antAlgorithm(points){
    var countPoint = points.length;
    var matrix = makeMatrixDistance(countPoint, points); // матрица смежности
    var pheromone = pheromoneMatrix(countPoint, points, 0.5); // количество ферамонов на ребре
    
    const INF = 1e9;
    const alpha = 1;
    const beta = 1;
    const takePheromone = 5; // прибавка к ферамонам
    const evaporation = 0.8; // коэффициент испарения
    
    var iterationWithoutProgress = 1000; // сколько итераций допускается без развития прогресса
    var countOfProgress = 0; // счетчик итераций без прогресса
    var bestWay = []; // наилучший путь
    var bestDistance = INF; // наилучшая дистанция

    while(countOfProgress !== iterationWithoutProgress){
        var updatePheromone = pheromoneMatrix(countPoint, points, 0); // матрица для прибавки ферамонов
        var ants = []; // создаем массив муравьев

        var improved = false; // произошли ли улучшения

        for(let i = 0; i < points.length; i++){
            ants[i] = new Ant(i, countPoint);
        }

        for(let i = 0; i < ants.length; i++){
            // пока муравей может двигаться
            while(ants[i].abilityMove === true){
                ants[i].makeChoice(matrix, pheromone, alpha, beta);
            }

            // проверяем путь на корректность и изменяем лучший путь и дистанцию
            if(ants[i].antWay.length === points.length + 1){
                if (bestDistance > ants[i].antDistance){
                    bestWay = ants[i].antWay.slice();
                    bestDistance = ants[i].antDistance;
                    improved = true;
                }

                // находим прибавку ферамонов к ребрам, по которым прошелся муравей
                for(let j = 0; j < ants[i].antWay.length - 1; j++){
                    updatePheromone[ants[i].antWay[j]][ants[i].antWay[j+1]] += takePheromone / ants[i].antDistance;
                }
            }
        }

        // проверка на произошедшие улучшения
        if(improved){
            countOfProgress = 0;
        }
        else{
            ++countOfProgress;
        }
        
        // изменяем значение ферамонов (происходит испарение и прибавка к лучшим путям)
        for(let i = 0; i < points.length; i++){
            for(let j = 0; j < points.length; j++){
                pheromone[i][j] = evaporation * pheromone[i][j] + updatePheromone[i][j];
                if(pheromone[i][j] < 0.01 && i !== j){
                    pheromone[i][j] = 0.01;
                }
            }
        }
    }

    return bestWay;
}



