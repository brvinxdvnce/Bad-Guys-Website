function createSquareMatrix(size, value = 0) {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => value))
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
        this.lineWidth = 1;

        this.images = []; 

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

    async guessTheNumber () {  
        loadmodel();  
        const tensor = preprocessCanvas();
        const predictions = await model.predict(tensor).data();
        const digit = predictions.indexOf(Math.max(...predictions));
      
        document.getElementById('result').innerText = `Цифра: ${digit}`;
      
        tensor.dispose();
    }

    
async loadmodel() {
    this.this.model = await tf.loadLayersthis.this.model('https://storage.googleapis.com/tfjs-models/tfjs/mnist/model.json');
    console.log('Модель загружена!');
}


    async predictDigit() {
        if (!this.model) {
            alert('Модель еще загружается!');
            return;
            }
          
        }
    }

