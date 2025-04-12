function HSVtoRGB (hue, saturation = 0.8, value = 0.9) {
    //HSV - Hue, Saturation(насыщенность), Value(яркость) 0 <= s, v <= 1
    let chroma = value * saturation;
    let x = chroma * (1 - Math.abs(hue % 2 - 1));
    let m = value - chroma;
    
    // Деление на 60 преобразует значение Hue в номер сектора (от 0 до 5), что помогает определить:
    // какой цвет доминирует (красный, зеленый, синий),
    // какие компоненты RGB будут меняться внутри сектора.
    // формулы наугад брали
    h = hue / 60;
    // прикольная штука, я типа создаю 3 переменных как элементы массива, а потом оперирую ими
    //  как блоком (кластеромс!:) ), на питоне подобное есть, типа: a, b = c, d
    let [r, g, b] = [0, 0, 0];
    switch (hue) {
        case 0:
            [r, g, b] = [chroma, x, 0];
        case 1 :
            [r, g, b] = [x, chroma, 0];
            break;
        case 2 :
            [r, g, b] = [0, chroma, x];
            break;
        case 3 :
            [r, g, b] = [0, x, chroma];
            break;
        case 4 :
            [r, g, b] = [x, 0, chroma];
            break;
        default:
            [r, g, b] = [chroma, 0, x];
            break;
                                            
    }
    [r, g, b] = [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255)
    ];
    
    return `#${r.toString(16).padStart(2, '0')}`+
           `${g.toString(16).padStart(2, '0')}`+
           `${b.toString(16).padStart(2, '0')}`;
}

class Point {
    constructor (x, y, clusterID) {
        this.x = x;
        this.y = y;
        this.clusterID = clusterID;
        this.color = "#000000";
    }
}

class ClusterData {
    constructor (cluctersCount) {
        this.canvas = document.getElementById('clustering-field');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width  = 1000;
        this.canvas.height = 1000;

        this.clustersCount = cluctersCount;
        this.points = [];

        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }
    
    handleClick (event) {
        const rect = this.canvas.getBoundingClientRect();

        let y = event.clientY - rect.top;
        let x = event.clientX - rect.left;
        
        let newPoint = new Point(x, y, 0);
        this.points.push(newPoint);
        this.drawPoint(newPoint);
    }

    //
    drawAll () {
        for (let i = 0; i < this.points.length; ++i) {
            this.drawPoint(this.points[i]);
        }
    }

    //
    drawPoint (point) {
        this.ctx.fillStyle = this.getColor(point);
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 7, 0, 2 * Math.PI); 
        this.ctx.fill();
    }

    // https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB
    // на вход дается точка и на выходе дается цвет в формате "#??????" 
    // формулы дикие
    getColor (point) {
        // получаем значние 0 <= hue < 360, по факту просто делим окружность на n зон (для каждого цвета)
        // hue - типа угла в цветовой диаграмме))) переводится как оттенок
        const hue = (point.clusterID * 360 / Math.max(this.clustersCount, 1)) % 360;
        //HSV - Hue, Saturation(насыщенность), Value(яркость)
        return HSVtoRGB(hue);
    }

    //
    geterateRandomPoints (count = 60) {
        for (let i = 0; i < count; ++i) {
            let point = new Point(
                Math.floor(Math.random() * this.canvas.width),
                Math.floor(Math.random() * this.canvas.height), 0)
            this.points.push(point);
        }
        this.drawAll();
    }

    //
    clearPoints () {
        this.points = [];
        this.draw();
    }

    //
    distance(node1, node2) {
        return Math.pow(Math.abs(node1.x - node2.x), 2)
             + Math.pow(Math.abs(node1.y - node2.y), 2);
    }
}