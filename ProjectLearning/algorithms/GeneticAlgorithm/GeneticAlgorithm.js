class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

function dictanceAllWay(array, matrixWay){
    let dictanceWay = 0;
    for(let i = 0; i < array.length-1; i++){
        dictanceWay += matrixWay[array[i]][array[i+1]];
    }
    return dictanceWay + matrixWay[array[array.length-1]][array[0]];
}

class Chromosome{
    constructor(way, matrixWay){
        this.way = way;
        this.dictance = dictanceAllWay(way, matrixWay);
    }
}

// дистанция между точками
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

// сравнение двух массивов
function arraysEqual(a, b) {
    return a.every((val, i) => val === b[i]);
}

// алгоритм шафла. генерация нового массива
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// создание уникальной хромосомы
function uniqueChromosome(points, arrayPopulation, matrix){
    // Создадим первую хромосому
    var newChrom = new Chromosome(shuffle(points), matrix);
    // Пока в популяции есть хромосома с таким же путем, генерируем новую
    while(arrayPopulation.some(chromosome => arraysEqual(chromosome.way, newChrom.way))){
        newChrom = new Chromosome(shuffle(points), matrix);
    }
    return newChrom;
}

class Population{
    constructor(sizePopulation, points, matrix, percentMutation){
        this.matrix = matrix;
        this.percentMutation = percentMutation;
        
        this.arrayPopulation = Array.from({ length: sizePopulation }, () =>
            uniqueChromosome(points, this.arrayPopulation, this.matrix));
    }

    mutation(array, percentMutation){
        let mutationProb = Math.random();
        if(mutationProb > percentMutation){
            return array;
        }
        else{
            let index1 = Math.floor(Math.random() * array.length);
            // Исправлено: убрана переменная start, которая не определена
            let index2 = Math.floor(Math.random() * (array.length - index1)) + index1;
            [array[index1], array[index2]] = [array[index2], array[index1]];
            return array;
        }
    }

    crossover(){
        const arrayPopulationOldLength = this.arrayPopulation.length;
        const parent1 = this.arrayPopulation[Math.floor(Math.random() * this.arrayPopulation.length)].way;
        let parent2 = parent1;

        while(arraysEqual(parent1, parent2)){
            parent2 = this.arrayPopulation[Math.floor(Math.random() * this.arrayPopulation.length)].way;
        } 
    
        const length = parent1.length;
        
        const start = Math.floor(Math.random() * length);
        const end = Math.floor(Math.random() * (length - start)) + start;
    
        let childWay1 = new Array(length).fill(null);
        let childWay2 = new Array(length).fill(null);

        for(let i = start; i <= end; i++){
            childWay1[i] = parent1[i];
            childWay2[i] = parent2[i];
        }

        let index1 = (end + 1) % length;
        for(let i = 0; i < length; i++){
            let newItem = parent2[(end + 1 + i) % length];
            if(!childWay1.includes(newItem)){
                childWay1[index1] = newItem;
                index1 = (index1 + 1) % length;
            }
        }

        let index2 = (end + 1) % length;
        for(let i = 0; i < length; i++){
            let newItem = parent1[(end + 1 + i) % length];
            if(!childWay2.includes(newItem)){
                childWay2[index2] = newItem;
                index2 = (index2 + 1) % length;
            }
        }

       
        let child1 = new Chromosome(this.mutation(childWay1, this.percentMutation), this.matrix);
        let child2 = new Chromosome(this.mutation(childWay2, this.percentMutation), this.matrix);

        this.arrayPopulation.push(child1, child2);

       
        this.arrayPopulation.sort((cromosome1, cromosome2) => cromosome1.dictance - cromosome2.dictance);

        this.arrayPopulation.splice(-(this.arrayPopulation.length - arrayPopulationOldLength));
    }
}

function geneticAlgorithm(points){
    var countPoint = points.length;
    const sizePopulation = 20; 
    const percentMutation = 0.4;
    const countPopulation = 50;

    let matrix = makeMatrixDistance(countPoint, points);

    let population = new Population(sizePopulation, points, matrix, percentMutation);

    for(let i = 0; i < countPopulation; i ++){
        population.crossover();
    }

    return population.arrayPopulation[0];
}
