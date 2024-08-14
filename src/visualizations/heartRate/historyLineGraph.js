import { HeartRateVisualization } from "./heartRateVisualization.js";
import { isValidColor } from "../utility.js";
import { noValidColorErrorMessage } from "../utility.js";

export class HistoryLineGraph extends HeartRateVisualization {
    constructor(containerId, options={}) {
        super(containerId, options)
        this.minVal;
        this.maxVal;
        this.graphLineColor;
        this.refLineColor;
        this.numberTimestamps;
        this.numberYIntercepts;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.container.appendChild(this.canvas);
        
        this.data = []; // container for the data points

        this.minTime = new Date();
        this.maxTime = new Date();
        
        this.validateAndSetOptions(options);
        this.draw();
    }

    draw() {
        // adjust canvas size to container size
        this.updateCanvasSize();

        const paddingFraction = 0.1; // 10% of the canvas height is used for padding
        const padding = this.canvas.height * paddingFraction;
        const zero = 0 + padding;   // redfine zero of coordinate system to consider padding
        const graphWidth = this.canvas.width - padding * 2;
        const graphHeight = this.canvas.height - padding * 2;

        const fontSize = graphHeight * 0.05; // font size is relative to canvas size to enhance responsitiviy

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw axis
        this.ctx.beginPath();
        this.ctx.moveTo(zero, zero);
        this.ctx.lineTo(zero, zero + graphHeight);
        this.ctx.lineTo(zero + graphWidth, zero + graphHeight);
        this.ctx.stroke();

        // draw reference line
        const refY = zero + graphHeight * (1 -(this.referenceVal - this.minVal) / (this.maxVal - this.minVal));
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.refLineColor;
        this.ctx.setLineDash([2, 2]);
        this.ctx.moveTo(zero, refY);
        this.ctx.lineTo(zero + graphWidth, refY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // calculate timestamps
        const numberTimestamps = this.numberTimestamps;
        const timestamps = []
        const timeDifference = this.maxTime.getTime() - this.minTime.getTime();
        for (let i = 0; i < numberTimestamps; i++) {
            const milliSecondOffset  = i * timeDifference / (numberTimestamps - 1);
            timestamps.push(new Date(this.minTime.getTime() + milliSecondOffset));
        }
        // draw timestamps on x axis
        timestamps.forEach((timestamp, index) => {
            const y = zero + graphHeight + fontSize * 0.5
            const x = zero + index * (graphWidth / (numberTimestamps - 1))

            this.ctx.fillStyle = 'black';
            this.ctx.font = `${fontSize}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(timestamp.toTimeString().split(' ')[0], x, y);
        })

        // draw y axis sections
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        for (let i = 0; i < this.numberYIntercepts; i++) {
            const value = this.minVal + (this.maxVal - this.minVal) * i / (this.numberYIntercepts - 1);
            const y = zero + graphHeight - (value - this.minVal) / (this.maxVal - this.minVal) * graphHeight;
            this.ctx.fillText(parseInt(value), zero - fontSize * 0.5, y);
        }

        // draw data points
        this.ctx.beginPath();
        this.data.forEach((point, index) => {
            // calculate coordinates for each point
            const x = zero + (point.time - this.minTime) / (this.maxTime - this.minTime) * graphWidth;
            const y = zero + graphHeight - (point.value - this.minVal) / (this.maxVal - this.minVal) * graphHeight;

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.strokeStyle = `${this.graphLineColor}`;
        this.ctx.stroke();
    }

    updateCanvasSize() {
        var rect = this.canvas.parentNode.getBoundingClientRect();
        // size of y axis is 70% of the size of x axis as a fixed proportion
        this.canvas.height = Math.min(0.7 * rect.width, rect.height);
        this.canvas.width = this.canvas.height / 0.7;
    }

    

    update(heartRate) {
        if(this.data.length == 0) {
            this.minTime = new Date();
        }
        // each value get's a time stamp attatched to it
        const now = new Date();
        this.maxTime = now;
        this.data.push({value: heartRate, time: now})
        this.draw();
    }

    // section of methods that validate the user input

    /**
     * Method to validate the user input
     * @param {Object} options 
     */
    validateAndSetOptions(options) { 
        if (options.numberTimestamps) {
            if (Number.isInteger(options.numberTimestamps)) {
                this.numberTimestamps = options.numberTimestamps
            } else {
                this.numberTimestamps = 5;
                console.error(`Parameter numberTimestamps must be integer. Input was '${options.numberTimestamps}'. Value is set to default value 5.`)
            }
        }
        else {
            this.numberTimestamps = 5;
        }

        if (options.numberYIntercepts) {
            if (Number.isInteger(options.numberYIntercepts)) {
                this.numberYIntercepts = options.numberYIntercepts
            } else {
                this.numberYIntercepts = 5;
                console.error(`Parameter numberYIntercepts must be integer. Input was '${options.numberYIntercepts}'. Value is set to default value 5.`)
            }
        }
        else {
            this.numberYIntercepts = 5;
        }

        this.validateColors(options);
        this.validateMinAndMaxValue(options);
    }

    validateColors(options) {
        if ('referenceLineColor' in options) {
            if (isValidColor(options.referenceLineColor)) {
                this.refLineColor = options.referenceLineColor;
            } else {
                console.error(noValidColorErrorMessage(options.referenceLineColor));
            }
        } else {
            this.refLineColor = "red"; // default value
        }

        if ('graphLineColor' in options) {
            if (isValidColor(options.graphLineColor)) {
                this.graphLineColor = options.graphLineColor;
            } else {
                console.error(noValidColorErrorMessage(options.graphLineColor));
            }
        } else {
            this.graphLineColor = "blue"; // default value
        }
    }

    validateMinAndMaxValue(options) {
        const defaultMinVal = 40;
        const defaultMaxVal = 180;

        if ('minValue' in options) {
            if (typeof options.minValue !== 'number' || options.minValue < 0) {
                console.error('minValue must be a number that is at least 0');
            }
            this.minVal = options.minValue 
        } else {
            this.minVal = defaultMinVal
        }

        if ('maxValue' in options) {
            if (typeof options.minValue !== 'number' || options.maxValue < 1) {
                console.error('maxValue must be a number that is at least 1');
            }
            this.maxVal = options.maxValue 
        } else {
            this.maxVal = defaultMaxVal
        }

        if (this.minVal > this.maxVal) {
            var errorMessage = `Minimum value ${this.minVal} must not be larger than maximum value ${this.maxVal}. Minimum value is set to default=${defaultMinVal} and maximum value to default=${defaultMaxVal}`;
            this.minVal = defaultMinVal;
            this.maxVal = defaultMaxVal;
            console.error(errorMessage);     
        }
        if (this.referenceVal < this.minVal  || this.referenceVal > this.maxVal) {
            var errorMessage = `Reference value ${this.referenceVal} must be between minimum value ${this.minVal} and maximum value ${this.maxVal}`;
            this.referenceVal = this.minVal + (this.maxVal - this.minVal) / 2;  // set reference value right in the middle
            console.error(errorMessage);
        }
    }
}