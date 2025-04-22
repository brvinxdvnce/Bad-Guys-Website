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

    /*
    async guessTheNumber () {  
        this.loadmodel();  
        const tensor = get28x28canv();
        const predictions = await model.predict(tensor).data();
        const digit = predictions.indexOf(Math.max(...predictions));
      
        this.setImage(digit);
        document.getElementById('result').innerText = `Цифра: ${digit}`;
      
        tensor.dispose();
    }

    async loadmodel() {
        this.model = await tf.loadLayersthis.model('https://storage.googleapis.com/tfjs-models/tfjs/mnist/model.json');
        console.log('Модель загружена');
    }

    async predictDigit() {
        if (!this.model) {
            alert('Модель еще загружается');
            return;
            }
          
        }
    */










        async loadModel() {
          this.model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mnist_cnn/model.json');
        }
        
        
        preprocessImage() {
            return tf.tidy(() => {
              // Конвертация изображения в тензор
                let tensor = tf.browser.fromPixels(canvas)
                .resizeBilinear([28, 28])
                .mean(2) // Конвертация в градации серого
                .expandDims(2)
                .expandDims(0);
              
              // Нормализация (0-255 → 0-1)
            return tensor.div(255.0);
            });
          }
        
          
        async __predict() {
            await this.loadModel();
            if (!this.model) return;
            
            const tensor = preprocessImage();
            const predictions = await model.predict(tensor).data();
            const digit = predictions.indexOf(Math.max(...predictions));
            
            console.log(`Предсказанная цифра: ${digit}`);
        }

        aaaa () {
            loadModel();
        
            let image = this.get28x28canv();
        }









        


        async createModel() {
            this.model = tf.sequential({
                layers: [
                    tf.layers.flatten({inputShape: [28, 28, 1]}),
                    tf.layers.dense({units: 128, activation: 'relu'}),
                    tf.layers.dense({units: 10, activation: 'softmax'})
                ]
            });
        
            model.compile({
                optimizer: 'adam',
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });
            
            // Здесь можно добавить загрузку своих данных MNIST
            // или использовать предобученную модель
        }

        preprocessCanvas() {
            return tf.tidy(() => {
                // Получаем изображение с canvas
                let image = tf.browser.fromPixels(canvas, 1)
                    .resizeBilinear([28, 28])
                    .toFloat()
                    .div(255.0);
                
                // Инвертируем цвета (если фон черный)
                image = tf.sub(1.0, image);
                
                return image.expandDims(0);
            });
        }

        async predict() {
            const image = preprocessCanvas();
            const prediction = model.predict(image);
            const results = await prediction.data();
            
            // Вывод результатов
            const maxProbability = Math.max(...results);
            const digit = results.indexOf(maxProbability);
            
            document.getElementById('result').innerHTML = `
                Цифра: ${digit}<br>
                Вероятность: ${maxProbability.toFixed(2)}
            `;
            
            tf.dispose(image);
        }

        // Для использования предобученной модели:
        async loadPretrainedModel() {
            model = await tf.loadLayersModel('https://your-model-url/model.json');
        }

        // Или создать новую модель:
        createModel();















        randomPredict () {
            this.img.src = this.images[Math.floor(Math.random() * 10)];
            console.log("пикча изменена");
        }
    }



/*
    let model;
async function loadModel() {
  model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mnist_cnn/model.json');
}
loadModel();


const canvas = document.getElementById('draw-canvas');
const ctx = canvas.getContext('2d');
*/