
//
function distance(point1, point2) {
    return Math.sqrt(
        Math.pow(point1.x - point2.x, 2) +
        Math.pow(point1.y - point2.y, 2));
}

class Point {
    constructor (x = 0, y = 0, clusterID = 0) {
        this.x = x;
        this.y = y;
        this.clusterID = clusterID;
        this.color = "#000000";
    }
}

class Cluster {
    constructor (x = 0, y = 0, clusterID = 0) {
        this.x = x;
        this.y = y;
        this.clusterID = clusterID;
        this.clusterPoints = [];
        this.wcss = 0; //(within-cluster sum of squares)
    }
}

class DataClusters {
    constructor () {
        this.canvas = document.getElementById('clustering-field');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width  = 1000;
        this.canvas.height = 1000;

        this.clustersCount = 0;
        this.points   = [];
        this.clusters = [];
        this.colors   = new Map();

        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        this.ctx.fillStyle = "rgb(27, 27, 27)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
        this.ctx.fillStyle = "rgb(27, 27, 27)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.points.length; ++i) {
            this.drawPoint(this.points[i]);
        }
    }

    //
    drawPoint (point) {
        if (point.clusterID == 0) this.ctx.fillStyle = "#ffffff";
        else this.ctx.fillStyle = this.colors.get(point.clusterID);
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
        return this.HSVtoRGB(hue);
    }

    HSVtoRGB (hue, saturation = 0.8, value = 0.9) {
        // https://cs.stackexchange.com/questions/64549/convert-hsv-to-rgb-colors
        // https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV

        let chroma = value * saturation;
        let h = Math.floor(hue / 60);
        let m = value - chroma;
        let x = chroma * (1 - Math.abs(h % 2 - 1)); 
        let [r, g, b] = [0, 0, 0];
        switch (h) {
            case 0 : [r, g, b] = [chroma, x, 0]; break;
            case 1 : [r, g, b] = [x, chroma, 0]; break;
            case 2 : [r, g, b] = [0, chroma, x]; break;
            case 3 : [r, g, b] = [0, x, chroma]; break;
            case 4 : [r, g, b] = [x, 0, chroma]; break;
            default: [r, g, b] = [chroma, 0, x]; break;
                                                
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

    generateColors () {
        for (let i = 0; i < this.clustersCount; ++i){
            this.colors.set(i+1, this.getColor({clusterID : i }));
        }
    }

    //
    generateRandomPoints (count = 60) {
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

    // kMeansClustering(count = 8) {
    //     //https://ru.wikipedia.org/wiki/K-means%2B%2B
    //     this.clustersCount = count;
    //     if (this.clustersCount > this.points.length) return;

    //     this.clusters = [];
    //     this.generateColors();
    //     this.points.forEach(point => point.clusterID = 0);

    //     // инициализируем случайные центроиды
    //     for (let i = 0; i < this.clustersCount; ++i) {

    //         let point = this.points[Math.floor(Math.random() * this.points.length)];
    //         for (let i = 0; i < this.points.length && point.clusterID != 0; ++i)
    //             point = this.points[Math.floor(Math.random() * this.points.length)];
            
    //         let newCluster = new Cluster(point.x, point.y, i+1);

    //         this.clusters.push(newCluster);
    //     }

    //     //
    //     for (let step = 0; step < 200; ++step) {
    //         for (let i = 0; i < this.clusters.length; ++i) this.clusters[i].clusterPoints = [];

    //         // для каждой точки считаем ближайший к ней центр кластера
    //         for (let i = 0; i < this.points.length; ++i) {

    //             let nearest = {dist: 10000000000000000000000, index:0};
    //             for (let j = 0; j < this.clusters.length; ++j) {
    //                 const d = distance(this.points[i], this.clusters[j]);
    //                 if (d < nearest.dist) {
    //                     nearest = { dist: d, index: j };
    //                 }
    //             }
    //             this.points[i].clusterID = nearest.index + 1;
    //             this.clusters[nearest.index].clusterPoints.push(this.points[i]);
    //         }

    //         // пересчет позиции центра кластера (новое значение = среднее значение точек кластера)
    //         for (let clusterNumber = 0; clusterNumber < this.clustersCount; ++clusterNumber) {
    //             if (this.clusters[clusterNumber].clusterPoints.length === 0) continue;
    //             let xsum = 0, ysum = 0;
    //             for (let i = 0; i < this.clusters[clusterNumber].clusterPoints.length; ++i) {
    //                 xsum += this.clusters[clusterNumber].clusterPoints[i].x;
    //                 ysum += this.clusters[clusterNumber].clusterPoints[i].y;
    //             }
    //             this.clusters[clusterNumber].x = xsum / this.clusters[clusterNumber].clusterPoints.length;
    //             this.clusters[clusterNumber].y = ysum / this.clusters[clusterNumber].clusterPoints.length;
    //         }
    //     }

    //     for (let i = 0; i < this.points.length; ++i)
    //         this.points[i].color = this.colors.get(this.points[i].clusterID);
    //     this.drawAll();
    // }

    kMeansClustering(count = 5) {
        /* K-Means++ ! */
        //https://ru.wikipedia.org/wiki/K-means%2B%2B
        //https://habr.com/ru/articles/829202/
        this.clustersCount = count;
        if (this.clustersCount > this.points.length) return;

        this.clusters = [];
        this.generateColors();
        this.points.forEach(point => point.clusterID = 0);

        let point = this.points[Math.floor(Math.random() * this.points.length)];
        let newCluster = new Cluster(point.x, point.y, 1);
        newCluster.clusterPoints.push(point);
        this.clusters.push(newCluster);
        
        for (let clust = 1; clust < this.clustersCount; ++clust) {
            
            let distances = [];
            let sum = 0;
            for (let i = 0; i < this.points.length; ++i) {
                let minDist = {d: Infinity, pointID: i};

                for (let k = 0; k < this.clustersCount; ++k) {
                    if ((!this.clusters[k]) || this.clusters[k].clusterID == 0) continue;

                    let dist = Math.pow(distance(this.points[i], this.clusters[k]), 2); 
                    if (minDist.d > dist) {
                        minDist.d = dist;
                    }
                }
                sum += minDist.d;
                distances.push(minDist);
            }

            let threshold = Math.random() * (sum / 2) + sum/2;
            let currentSum = 0;
            let newClustData;

            for (let i = 0; currentSum < threshold; ++i) {
                currentSum += distances[i].d;
                if (currentSum > threshold) {
                    newClustData = distances[i].pointID;
                    break;
                }
            }

            let newCluster = new Cluster(
                this.points[newClustData].x,
                this.points[newClustData].y, clust + 1);
            newCluster.clusterPoints.push(this.points[newClustData]);
            this.clusters.push(newCluster);
        }


        let maxWCSS = 0;
        for (let step = 0; step < 200; ++step) {
            for (let i = 0; i < this.clusters.length; ++i) this.clusters[i].clusterPoints = [];

            // для каждой точки считаем ближайший к ней центр кластера
            for (let i = 0; i < this.points.length; ++i) {

                let nearest = {dist: Infinity, index:0};
                for (let j = 0; j < this.clusters.length; ++j) {
                    const d = distance(this.points[i], this.clusters[j]);
                    if (d < nearest.dist) {
                        nearest = { dist: d, index: j };
                    }
                }
                this.points[i].clusterID = nearest.index + 1;
                this.clusters[nearest.index].clusterPoints.push(this.points[i]);
            }

            // пересчет позиции центра кластера (новое значение = среднее значение точек кластера)
            for (let clusterNumber = 0; clusterNumber < this.clustersCount; ++clusterNumber) {
                if (this.clusters[clusterNumber].clusterPoints.length === 0) continue;
                let xsum = 0, ysum = 0;
                for (let i = 0; i < this.clusters[clusterNumber].clusterPoints.length; ++i) {
                    xsum += this.clusters[clusterNumber].clusterPoints[i].x;
                    ysum += this.clusters[clusterNumber].clusterPoints[i].y;
                }
                this.clusters[clusterNumber].x = xsum / this.clusters[clusterNumber].clusterPoints.length;
                this.clusters[clusterNumber].y = ysum / this.clusters[clusterNumber].clusterPoints.length;
            }

            //пересчет wcss
        }

        for (let i = 0; i < this.points.length; ++i)
            this.points[i].color = this.colors.get(this.points[i].clusterID);
        this.drawAll();
    }

    DBSCAN () {

    }

    clusterAnalysis (typeOfClustering) {
        switch (typeOfClustering){
            case "k-means":
                KMeansClustering();
                break;
            case "":
                break;
            case "":
                break;
            case "":
                break;
            case "":
                break;
                case "":
            break;
                case "":
            break;
        }
        
    }
}