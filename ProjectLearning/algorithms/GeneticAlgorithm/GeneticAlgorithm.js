class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

function distanceAllWay(array){
    let distanceWay = 0;
    for(let i = 0; i < array.length-1; i++){
        distanceWay += distance(array[i],array[i+1]);
    }
    return distanceWay + distance(array[array.length-1],array[0]);
}

class Chromosome{
    constructor(way){
        this.way = way; // массив точек
        this.distance = distanceAllWay(way); // дистанция пути комивояжора
    }
}

// дистанция между точками
function distance(point1, point2){
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
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
function uniqueChromosome(points, arrayPopulation){
    // Создадим первую хромосому
    var newChrom = new Chromosome(shuffle(points.slice()));
    // Пока в популяции есть хромосома с таким же путем, генерируем новую
    let uniqueChromosomeCount = 0; // количество уникальных хромосом
    while(arrayPopulation.some(chromosome => arraysEqual(chromosome.way, newChrom.way))){
        newChrom = new Chromosome(shuffle(points.slice()));
        uniqueChromosomeCount++;
        // если невозможно создать новую комбинацию, добавляем то что получилось (копию)
        if(uniqueChromosomeCount > 5){
            break;
        }
    }
    return newChrom;
}

class Population{
    constructor(sizePopulation, points, percentMutation, countChild){
        this.sizePopulation = sizePopulation; // размер популяции
        this.countChild = countChild; // сколько особей получится в результате одного скрещивания
        this.points = points;
        this.percentMutation = percentMutation;
        let arrayPopulation = []; // список всех особей в популяции(массив Chromosome)
        for (let i = 0; i < sizePopulation; i++) {
            arrayPopulation.push(uniqueChromosome(points, arrayPopulation));
        }
        arrayPopulation.sort((c1, c2) => c1.distance - c2.distance);
        this.arrayPopulation = arrayPopulation;
    }

    // проверка на мутацию
    mutation(array, percentMutation){
        let mutationProb = Math.random();
        if(mutationProb > percentMutation){
            return array;
        }
        else{
            // если процент мутации выше установленного меняем рандомные индексы местами
            let index1 = Math.floor(Math.random() * array.length);
            let index2 = Math.floor(Math.random() * (array.length - index1)) + index1;
            [array[index1], array[index2]] = [array[index2], array[index1]];
            return array;
        }
    }

    // выбор особи для скрещивания методом турнира
    makeTournament(){
        let tournament = [];
        let tournamentSize = 50;
        for(let i = 0; i < tournamentSize; i++){
            tournament.push(this.arrayPopulation[Math.floor(Math.random() * this.arrayPopulation.length)]);
        }
        tournament.sort((cromosome1, cromosome2) => cromosome1.distance - cromosome2.distance);
        return tournament[0].way;
    }

    // когда изменения лучший особи в популяции не происходит, принудительно удаляем
    // самых непригодных особей и создаем вместо них новых
    genocide(){
        let sizeGenocide = Math.floor(this.arrayPopulation.length / 5);
        this.arrayPopulation.splice(-sizeGenocide); // удаляем с конца, так как самые непригодные будут в конце массива после отсортировки
        for(let i = 0; i < sizeGenocide; i++){
            this.arrayPopulation.push(uniqueChromosome(this.points, this.arrayPopulation));
        }
        this.arrayPopulation.sort((cromosome1, cromosome2) => cromosome1.distance - cromosome2.distance);
    }

    // скрещивание
    crossover(){
        const eliteCount = 30; // размер элитной группы
        // элитная группа, которая содержит лучших особей, которых нельзя подвергать изменениям
        const elites = this.arrayPopulation.slice(0, eliteCount).map(chrom => new Chromosome(chrom.way.slice()));

        const arrayPopulationOldLength = this.arrayPopulation.length;

        for(let i = 0; i < this.countChild; i++){

            // определяем первого родителя методом турнира
            const parent1 = this.makeTournament();
            let parent2 = parent1;
            let attempts = 0;
            const maxAttempts = 10;
            while(arraysEqual(parent1, parent2) && attempts < maxAttempts){
                parent2 = this.makeTournament();
                attempts++;
                }
        
            const length = parent1.length;
            
            const start = Math.floor(Math.random() * length); // задаем начальный индекс, с которого будут начинаться изменения в ребенке
            const end = Math.floor(Math.random() * (length - start)) + start; // задаем последний индекс, с которого будут начинаться изменения в ребенке
        
            // создаем массив для будущих дочерних особей
            let childWay1 = new Array(length).fill(null);
            let childWay2 = new Array(length).fill(null);
            
            // заполняем от start до end элемнтами родительских особей
            for(let i = start; i <= end; i++){
                childWay1[i] = parent1[i];
                childWay2[i] = parent2[i];
            }
            
            // дозаполняем оставшееся для первого
            let index1 = (end + 1) % length;
            for(let i = 0; i < length; i++){
                let newItem = parent2[(end + 1 + i) % length];
                if(!childWay1.includes(newItem)){
                    childWay1[index1] = newItem;
                    index1 = (index1 + 1) % length;
                }
            }

             // дозаполняем оставшееся для второго
            let index2 = (end + 1) % length;
            for(let i = 0; i < length; i++){
                let newItem = parent1[(end + 1 + i) % length];
                if(!childWay2.includes(newItem)){
                    childWay2[index2] = newItem;
                    index2 = (index2 + 1) % length;
                }
            }
    
            //создаем дочерние особи на основе полученных массивов
            let child1 = new Chromosome(this.mutation(childWay1, this.percentMutation));
            let child2 = new Chromosome(this.mutation(childWay2, this.percentMutation));
    
            this.arrayPopulation.push(child1, child2);
        }

        this.arrayPopulation.sort((cromosome1, cromosome2) => cromosome1.distance - cromosome2.distance);
        
        //убираем последних менее приспособленных особей, оставляя место для элиты
         this.arrayPopulation.splice(this.sizePopulation - eliteCount);

         // вставляем нашу элиту
         this.arrayPopulation = elites.concat(this.arrayPopulation);

         this.arrayPopulation.sort((cromosome1, cromosome2) => cromosome1.distance - cromosome2.distance);

    }
}

async function geneticAlgorithm(points, drawPath){

    const sizePopulation = 100; // размер популяции
    const percentMutation = 0.15; // процент мутации
    const countPopulation = 5000; // количество изменения популяции
    const countChild = 10; // количество скрещиваний на каждой итерации
    let countNoImproved = 0; // счетчик количества итераций без изменения
    const notImproved = 30; // сколько итераций может быть без изменений
    
    let population = new Population(sizePopulation, points, percentMutation, countChild); // создаем популяцию
    
    let bestChromosome = population.arrayPopulation[0]; // устанавливаем первое значение лучшей особи

    if(drawPath){
        drawPath(bestChromosome.way);
    }

    // проводим развитие популяции
    for(let i = 0; i < countPopulation; i++){
        population.crossover();
        let newBestChromosome = population.arrayPopulation[0];
        // если старая особь до сих пор лучше новой увеличиваем счетчик
        if(newBestChromosome.distance < bestChromosome.distance){
            bestChromosome = newBestChromosome;
            countNoImproved = 0;
            if(drawPath){
                drawPath(bestChromosome.way);
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        } else {
            countNoImproved++;
        }

        // если количество итераций без изменений достигло максимума, начинаем перезагрузку популяции
        if(countNoImproved >= notImproved){
            population.genocide();
            countNoImproved = 0;
        }
    }
    console.log(bestChromosome.distance);
    return;
}