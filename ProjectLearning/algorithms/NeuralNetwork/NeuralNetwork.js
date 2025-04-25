function createSquareMatrix(size, value = 0) {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => value))
}

function ReLU(a) {
    // rectified linear unit
    return a > 0 ? a : 0;
}

class Paint {
    constructor(cellCountInSide = 50) {
        this.canvas = document.getElementById('dwaring-board');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width  = 600;
        this.canvas.height = 600;

        this.grid = createSquareMatrix(50, 0);

        this.cellCountInSide = cellCountInSide;
        this.cellWidth = this.canvas.width /  cellCountInSide;
        this.cellHeight = this.canvas.height /  cellCountInSide;

        this.isDrawing = false;

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
        this.img.src = "numbers_images/default.png";

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


        const grayPixels = [];
        for (let i = 0; i < data.length; i += 4) {
            let inverted = (
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
    }

    async createModel() {
        const model = tf.sequential();
        
        // первый скрытый слой (784 -> 200)
        model.add(tf.layers.dense({
            units: 200,
            inputShape: [784],
            activation: 'relu',
            name: 'hidden_layer'
        }));
        
        // выходной слой (200 -> 10)
        model.add(tf.layers.dense({
            units: 10,
            activation: 'softmax',
            name: 'output_layer'
        }));

        // загрузка весов
        const [weights200, bias200, weights10, bias10] = await Promise.all([
            fetch('weights_200.json').then(res => res.json()),
            fetch('biases_200.json').then(res => res.json()),
            fetch('weights_10.json').then(res => res.json()),
            fetch('biases_10.json').then(res => res.json())
        ]);
        
        // преобразуем JSON в тензоры
        // kernel - по сути, матрица. где для каждого элемента текущего слоя создаются
        // значения для каждогоиз нейронов следующего слоя 
        // bias - смещение для каждого нейрона

        const kernel1 = tf.tensor2d(weights200, [784, 200]);
        const bias1   = tf.tensor1d(bias200);
        const kernel2 = tf.tensor2d(weights10, [200, 10]);
        const bias2   = tf.tensor1d(bias10);
        
        // устанавливаем веса в модель
        model.setWeights([kernel1, bias1, kernel2, bias2]);

        return model;
    }

    async predict(image) {
        const model = await this.createModel();
        
        // Предсказание
        const output = model.predict(image);
        const predictedDigit = output.argMax(1).dataSync()[0];
        
        // Очистка памяти
        image.dispose();
        output.dispose();
        
        return predictedDigit;
    }

    async runDredict() {
        let image = tf.tensor2d(this.get28x28canv(), [1, 784]);
        let res = await this.predict(image);
        this.img.src = this.images[res];
        console.log("цыфра ",res);
    }
}