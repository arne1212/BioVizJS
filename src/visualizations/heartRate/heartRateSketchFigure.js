import { HeartRateVisualization } from "./heartRateVisualization.js";
import { isValidColor } from "../utility.js";
import { noValidColorErrorMessage } from "../utility.js";

/**
 * Sketch figure to visualize heart rate
 * @class
 */
export class HeartRateSketchFigure extends HeartRateVisualization {

    constructor(containerId, options={}) {
        super(containerId, options);
        this.isAnimated;
        // the percentage amount the heart rate needs to diverge from the referenceValue in order to change the color
        // multiples of 5% offset will lead to color change by default
        this.levelOffset;
        this.colorSteps;
        this.referenceColorIndex;

        // class constants for the y values of the highest and lowest level
        this.minY = 89;
        this.maxY = 176;

        this.validateAndSetOptions(options);
        this.draw();
        console.log("index" + this.referenceColorIndex)
    }

    validateAndSetOptions(options) {
        if ('levelOffset' in options) {
            if (typeof options.levelOffset !== 'number' || options.levelOffset <= 0) {
                throw new Error(`levelOffset "${options.levelOffset}" must be a positive number representing the required relative heart rate divergence from the reference value for color change.`);
            }
            this.levelOffset = options.levelOffset;
        } else {
            this.levelOffset = 0.05;
        }

        if ('colorSteps' in options && options.colorSteps.length > 0) {
            for (let color of options.colorSteps) {
                if (!isValidColor(color)) {
                    throw new Error(noValidColorErrorMessage(color));
                }
            }
            this.colorSteps = options.colorSteps;
        }
        else {
            this.colorSteps = ['darkcyan', 'forestgreen', 'khaki', 'orange', 'red'];
        }

        // - Ensure referenceColorIndex is set
        // - Confirm it's a positive integer
        // - Verify it's within the range of available color steps
        if(!options.referenceColorIndex || !(Number.isInteger(options.referenceColorIndex) && options.referenceColorIndex > 0) || options.referenceColorIndex > this.colorSteps.length - 1) {
            if(this.colorSteps.length >= 3) {
                this.referenceColorIndex = 1;
            }
            else {
                this.referenceColorIndex = 0;
            }
        }
        else {
            this.referenceColorIndex = options.referenceColorIndex
        }

        this.isAnimated = 'animated' in options ? Boolean(options.animated) : true;        
    }

    draw() {
        var y = this.maxY;
        var svgBaseColor = this.getSVGBaseColor();
        const svgCode = `
        <svg width="100%" height="100%" viewBox="128 75 36 109" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
            <clipPath id="bodyClip">
                <circle cx="146" cy="98" r="9.5"/>
                <path d="M132.244 148H133.6C135.809 148 137.6 149.791 137.6 152V178.964C137.6 182.067 140.98 183.988 143.646 182.401L143.954 182.218C145.215 181.467 146.785 181.467 148.046 182.218L148.354 182.401C151.02 183.988 154.4 182.067 154.4 178.964V152C154.4 149.791 156.191 148 158.4 148H159.756C162.058 148 163.885 146.062 163.749 143.764L161.973 113.764C161.848 111.65 160.097 110 157.98 110H134.02C131.903 110 130.152 111.65 130.027 113.764L128.251 143.764C128.115 146.062 129.942 148 132.244 148Z"/>
            </clipPath>
            </defs>

        <g id="valueDisplay" visibility="${this.valueVisible ? 'visible' : 'hidden'}">
            <text id="currentVal" x="146" y="80" font-size="0.6em" text-anchor="middle" dominant-baseline="middle" fill="${svgBaseColor}" stroke="none">0</text>
        </g>
        
        <g id="filling" clip-path="url(#bodyClip)">
            
            ${this.isAnimated ?
                `<path id="wave" fill="none">
                <animate id="waveAnimation" attributeName="d" values="
                M128,${y} C134,${y-2} 140,${y+2} 146,${y} S158,${y-2} 164,${y} L164,616 L128,616 Z;
                M128,${y-2} C134,${y} 140,${y-4} 146,${y-2} S158,${y} 164,${y-2} L164,616 L128,616 Z;
                M128,${y} C134,${y-2} 140,${y+2} 146,${y} S158,${y-2} 164,${y} L164,616 L128,616 Z"
                dur="3s" repeatCount="indefinite" fill="none"/>
                <animate attributeName="y" values="184;110;184" dur="5s" repeatCount="indefinite" />
                </path>`
                :
                `<rect id="fillBox" x="128" y="${y}" width="100%" height="100%" fill="none"></rect>`}                          
        </g>

        <g id="stick_figure" stroke="black" stroke-width="1"> 
            <circle id="head" cx="146" cy="98" r="9.5"/>
            <path id="body" d="M132.244 148H133.6C135.809 148 137.6 149.791 137.6 152V178.964C137.6 182.067 140.98 183.988 143.646 182.401L143.954 182.218C145.215 181.467 146.785 181.467 148.046 182.218L148.354 182.401C151.02 183.988 154.4 182.067 154.4 178.964V152C154.4 149.791 156.191 148 158.4 148H159.756C162.058 148 163.885 146.062 163.749 143.764L161.973 113.764C161.848 111.65 160.097 110 157.98 110H134.02C131.903 110 130.152 111.65 130.027 113.764L128.251 143.764C128.115 146.062 129.942 148 132.244 148Z"/>
        </g>
        </svg>
        `;
        // get safe reference to the svg element of the instance to avoid naming conflicts with other DOM elements
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgCode;
        const newSvg = tempDiv.firstElementChild;
        this.svgElement = newSvg;
        this.container.appendChild(newSvg);
    }

    update(heartRate) {
        if (!this.svgElement) {
            return;
        }
        const fillLevelY = this.calculateFillLevel(heartRate);
        const fillColor = this.calculateFillColor(heartRate);
        var animatedPath = `M128,${fillLevelY} C134,${fillLevelY-2} 140,${fillLevelY+2} 146,${fillLevelY} S158,${fillLevelY-2} 164,${fillLevelY} L164,616 L128,616 Z;
                M128,${fillLevelY-2} C134,${fillLevelY} 140,${fillLevelY-4} 146,${fillLevelY-2} S158,${fillLevelY} 164,${fillLevelY-2} L164,616 L128,616 Z;
                M128,${fillLevelY} C134,${fillLevelY-2} 140,${fillLevelY+2} 146,${fillLevelY} S158,${fillLevelY-2} 164,${fillLevelY} L164,616 L128,616 Z`;
        if (this.isAnimated) {
            var waveElement = this.svgElement.querySelector("#wave");
            waveElement.style.fill = fillColor;
            var animatedWave = wave.querySelector("#waveAnimation");
            animatedWave.setAttribute("values", animatedPath);
        }
        else {
            var fillRect = this.svgElement.querySelector("#fillBox");
            fillRect.setAttribute("y", fillLevelY);
            fillRect.setAttribute("fill", fillColor);
        }
        // update the displayed value
        const currentValue = this.svgElement.querySelector('#currentVal');
        currentValue.textContent = heartRate;
        this.playHeartbeatSound(heartRate);
    }

    /**
     * Calculates the y coordinate for drawing the fill level.
     * 
     * @param {number} heartRate the value to calculate the fill level for.
     * @returns the y coordinate for the fill level
     */
    calculateFillLevel(heartRate) {
        // Using the number of levels and the offset needed to reach the next level
        // the maximum and minimum heart rates that can be visualized are calculated.
        var stepsAboveReference = this.colorSteps.length - 1 - this.referenceColorIndex;
        var stepsBelowReference = this.referenceColorIndex;
        var maxVisualizableHeartRate = this.referenceVal + this.referenceVal * this.levelOffset * (stepsAboveReference + 1);
        var minVisualizableHeartRate = this.referenceVal - this.referenceVal * this.levelOffset * (stepsBelowReference + 1);
        // now we can calculate the ratio of coordinates per heart rate divergence from reference
        var heartRateRange = maxVisualizableHeartRate - minVisualizableHeartRate;
        var coordinateRange = this.maxY - this.minY;
        var coordinatePerHeartRate = coordinateRange / heartRateRange;
        // the y value is calculated by using the determined ranges
        var y = Math.min(Math.max(this.maxY - (heartRate - minVisualizableHeartRate) * coordinatePerHeartRate, this.minY), this.maxY);
        return y 
    }

    calculateFillColor(heartRate) {
        var offset;
        var steps;
        var color;
        if (heartRate <= this.referenceVal) {
            offset = (this.referenceVal - heartRate) / this.referenceVal;
            steps = Math.floor(offset / this.levelOffset);
            color = this.colorSteps[Math.max(this.referenceColorIndex - steps, 0)];
        }
        else {
            offset = (heartRate - this.referenceVal) / this.referenceVal;
            steps = Math.floor(offset / this.levelOffset);
            color = this.colorSteps[Math.min(this.referenceColorIndex + steps, this.colorSteps.length - 1)];           
        }
        return color;
    }
}