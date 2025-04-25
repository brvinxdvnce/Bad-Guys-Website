function createSquareMatrix(size, value = 0) {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => value))
}

function ReLU(a) {
    // rectified linear unit
    // функция активации нейронов 
    return a > 0 ? a : 0;
}

class Paint {
    constructor(cellCountInSide = 50) {
        this.canvas = document.getElementById('dwaring-board');
        this.ctx = this.canvas.getContext('2d');

        //var brain = require('brain.js');
        //var net = new brain.NeuralNetwork();
        
        this.model;

        this.canvas.width  = 750;
        this.canvas.height = 750;

        this.grid = createSquareMatrix(50, 0);

        this.cellCountInSide = cellCountInSide;
        this.cellWidth = this.canvas.width /  cellCountInSide;
        this.cellHeight = this.canvas.height /  cellCountInSide;

        this.isDrawing = false;
        // this.lineWidth = 1;

        this.img = document.getElementById('ans_pic');
        this.images = [
            "numbers_images/number_0.png",
            "numbers_images/number_1.png",
            "numbers_images/number_2.png",
            "numbers_images/number_3.png",
            "numbers_images/number_4.png",
            "numbers_images/number_5.png",
            "numbers_images/number_6.png",
            "numbers_images/number_7.png",
            "numbers_images/number_8.png",
            "numbers_images/number_9.png",
        ]; 
        this.img.src = "numbers_images/default.jpg";

        this.canvas.addEventListener('mousedown', (e) => {
           this.isDrawing = true;
        });
        
        this.canvas.addEventListener('mouseup'  , (e) => {
            this.isDrawing = false;
        });

        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        
        this.canvas.addEventListener('click'    , (e) => {
            this.isDrawing = true; this.draw(e); this.isDrawing=false;
        });
    }

    //получение изображения 28х28
    get28x28canv () {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        tempCanvas.width = 28;
        tempCanvas.height = 28;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.canvas, 0, 0, 28, 28);

        const imageData = ctx.getImageData(0, 0, 28, 28);
        const data = imageData.data; // Массив вида [R, G, B, A, ...]

        // скачивание 28х28 пикчи   :
        // let dataurl = tempCanvas.toDataURL('image/png');

        // const link = document.createElement('a');
        // link.href = dataurl;
        // link.download = "default1.png";

        // // Запускаем скачивание
        // link.click();

        const grayPixels = [];
        for (let i = 0; i < data.length; i += 4) {
            const inverted = (
                0.299 * data[i + 0] + 
                0.587 * data[i + 1] + 
                0.114 * data[i + 2]); // Формула яркости
                inverted = 255 - inverted;
            grayPixels.push(inverted / 255); // Нормализация в [0, 1]
        }
        console.log(grayPixels);
        return grayPixels;
    }

    //рисует квадрат 3х3
    draw (event) {
    if (!this.isDrawing) return;
    const rect = this.canvas.getBoundingClientRect();
    const row = Math.floor((event.clientY - rect.top) / this.cellHeight);
    const col = Math.floor((event.clientX - rect.left) / this.cellHeight);

    for (let i = row-1; i <= row+1; ++i) {
        for (let j = col-1; j <= col+1; ++j) {
            if (i >= 0 && j >= 0 &&
                i < this.cellCountInSide &&
                j < this.cellCountInSide) {
                    this.grid[row][col] = 1;
                    this.ctx.fillStyle = '#000000';
                    this.ctx.fillRect(
                        j * this.cellHeight,
                        i * this.cellWidth,
                        this.cellHeight,
                        this.cellWidth,);
                }
            }
        }
    }

    clearField () {
        this.grid = createSquareMatrix(50, 0);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setImage (predict) {
        if (predict === parseInt(predict))
            this.currentImage = this.images[i];
        else this.currentImage = "error_picture";   
    }

    randomPredict () {
        this.img.src = this.images[Math.floor(Math.random() * 10)];
        console.log("пикча изменена");
    }



    }