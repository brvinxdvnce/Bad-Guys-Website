function createSquareMatrix(size, value = 0) {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => value))
}

class Paint {
    constructor(cellCountInSide = 50) {
        this.canvas = document.getElementById('canvasPainting');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width  = 750;
        this.canvas.height = 750;

        this.grid = createSquareMatrix(50, 0);

        this.cellCountInSide = cellCountInSide;
        this.cellWidth = this.canvas.width /  cellCountInSide;
        this.cellHeight = this.canvas.height /  cellCountInSide;

        this.isDrawing = 0;

        this.canvas.addEventListener('mousedown', (e) => this.changeMouseState(e));
        this.canvas.addEventListener('mouseup', (e) => this.changeMouseState(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
    }

    draw() {
        for(let i = 0; i < this.cellCountInSide; i++) {
            for(let j = 0; j < this.cellCountInSide; j++) {

                this.ctx.fillStyle = this.grid[i][j] ? '#000000' : '#ffffff';

                this.ctx.fillRect(
                    j * this.cellHeight,
                    i * this.cellWidth,
                    (j + 1) * this.cellHeight,
                    (i + 1) * this.cellWidth,);
            }
        }
    }

    changeMouseState(event) {
        this.isDrawing = isDrawing ? false : true; 
    }

    // Обработка клика
    handleMove(event) {
        //if (!this.isDrawing) return;
        const rect = this.canvas.getBoundingClientRect();
        const row = Math.floor((event.clientY) / this.cellHeight);
        const col = Math.floor((event.clientX) / this.cellHeight);
        
        
        this.grid[row][col] = 1;
        
        this.draw();
    }
}





window.onload = function () {
    // Specifications
    var mouseX = 0;
    var mouseY = 0;
    context.strokeStyle = 'black'; // initial brush color
    context.lineWidth = 1; // initial brush width
    var isDrawing = false;
  
    // Mouse Down Event
    canvas.addEventListener('mousedown', function(event) {
      setMouseCoordinates(event);
      isDrawing = true;
  
      // Start Drawing
      context.beginPath();
      context.moveTo(mouseX, mouseY);
    });
  
    // Mouse Move Event
    canvas.addEventListener('mousemove', function(event) {
      setMouseCoordinates(event);
  
      if(isDrawing){
        context.lineTo(mouseX, mouseY);
        context.stroke();
      }
    });
  
    // Mouse Up Event
    canvas.addEventListener('mouseup', function(event) {
      setMouseCoordinates(event);
      isDrawing = false;
    });
  
    // Handle Mouse Coordinates
    function setMouseCoordinates(event) {
      mouseX = event.clientX - boundings.left;
      mouseY = event.clientY - boundings.top;
    }
  
    // Handle Save Button
    var saveButton = document.getElementById('save');
  
    saveButton.addEventListener('click', function() {
      var imageName = prompt('Please enter image name');
      var canvasDataURL = canvas.toDataURL();
      var a = document.createElement('a');
      a.href = canvasDataURL;
      a.download = imageName || 'drawing';
      a.click();
    });
  };
  