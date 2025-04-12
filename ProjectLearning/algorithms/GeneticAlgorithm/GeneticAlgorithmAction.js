const points = [];
var isWorking = false;

function clickTable(){
    const $tableNode = document.querySelector("#table");
    const ctx = $tableNode.getContext("2d");
    $tableNode.addEventListener(`click`, (event) => {
        if (points.length >= 30) {
            alert('Превышено количество точек: 30');
            return;
        }
      const rect = $tableNode.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      points.push({ x, y });
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      console.log("Точка добавлена:", { x, y });
    })
}

function drawPath(bestWay){
    const $tableNode = document.querySelector("#table");
    const ctx = $tableNode.getContext("2d");
    ctx.clearRect(0, 0, $tableNode.width, $tableNode.height);

    // Рисуем ВСЕ точки
    for(let p = 0; p < points.length; p++){
        const x = points[p].x;
        const y = points[p].y;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
    }

   
    ctx.beginPath();
    if (bestWay.length > 0) {
        ctx.moveTo(bestWay[0].x, bestWay[0].y); 
        for(let i = 1; i < bestWay.length; i++){ 
            const nextPoint = bestWay[i];
            ctx.lineTo(nextPoint.x, nextPoint.y);
        }
        ctx.closePath(); 
    }
    ctx.stroke();
    console.log("Линия добавлена");
}

async function startAlgorithm(){
    const $startButton = document.querySelector("#start");
    const $tableNode = document.querySelector("#table");
    const ctx = $tableNode.getContext("2d");
    $startButton.addEventListener(`click`, async (event) => {
        if(isWorking){
            return;
        }
        if (points.length == 0 || points.length == 1 ){
            alert('Нужно больше точек');
            return;
        }
        isWorking = true;
        console.log("Алгоритм запущен")
        await geneticAlgorithm(points, drawPath);
        console.log("Алгоритм завершен")
        isWorking = false;
        
    })
}

function clearAlgorithm(){
    const $clearButton = document.querySelector("#clear");
    const $tableNode = document.querySelector("#table");
    const ctx = $tableNode.getContext("2d");
    $clearButton.addEventListener(`click`, (event) => {
        if(isWorking){
            alert('Алгоритм еще не завершил работу');
            return;
        }
        ctx.clearRect(0, 0, $tableNode.width, $tableNode.height);
        console.log("Все очищено");
        points.splice(0, points.length);
    })
}