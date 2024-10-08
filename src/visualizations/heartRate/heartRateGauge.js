import { HeartRateVisualization } from "./heartRateVisualization.js";
import { isValidColor } from "../utility.js";
import { noValidColorErrorMessage } from "../utility.js";
import { findBackgroundColor } from "../utility.js";

/**
 * Gauge to visualize heart rate values
 * @class
 */
export class HeartRateGauge extends HeartRateVisualization {

    /**
     * 
     * @constructor
     * @param {string} containerId 
     * @param {object} options 
     */
    constructor(containerId, options = {}) {
        super(containerId, options);

        this.validateAndSetOptions(options);
        this.draw();
    }

    /**
     * draws an svg onto the containers canvas
     */
    draw() {
        // dynamic determination of colors to use for svg elements, depending on container color, for sufficient contrast
        const svgBaseColor = this.getContrastingBaseColor();
        const containerBackgroundColor = findBackgroundColor(this.container);
        
        // define the gradient to use for the gauge
        // either a gradient definiton is provided by the client in the form [{color: "", deg: ""}, {color: "", deg: ""} ...]
        // or a default gradient definition is used
        var referenceValueAngle = (this.referenceVal - this.minVal) / (this.maxVal - this.minVal) * 180
        var remainingAngle = 180 - referenceValueAngle;
        let def;        
        var gradientString = (def = this.parseGradientDefinition()) ? def :
        //default gradient definition
         `, deepskyblue ${referenceValueAngle / 4}deg, aqua ${2 * (referenceValueAngle / 4)}deg, mediumspringgreen ${3 * (referenceValueAngle / 4)}deg, lime ${referenceValueAngle}deg, greenyellow ${remainingAngle / 4 + referenceValueAngle}deg, yellow ${2 * (remainingAngle / 4) + referenceValueAngle}deg, orange ${3 * (remainingAngle / 4) + referenceValueAngle}deg, red 180deg`;

        /**
         * svg displaying a gauge with color gradient,
         * a value display and a needle pointing at the current value in the gauge
         * 
         * clipping and masking are used to create the caracteristic arch of the gauge
         */
        const svgCode = `
        <svg width="100%" height="100%" viewBox="-1 -1 102 60" xmlns="http://www.w3.org/2000/svg" font-size="10">
            <defs>
                <clipPath id="circle-clip">
                    <path d="M 0 50 A 50 50 0 0 1 100 50 V 50 H 0 Z" />
                </clipPath>
            </defs>

            <foreignObject width="100" height="50" clip-path="url(#circle-clip)">
                <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; background: conic-gradient(from 270deg at 50% 100% ${gradientString});"></div>
            </foreignObject>

            <path id="gauge-mask" d="M95 50 C95 25 75 5 50 5 C25 5 5 25 5 50"
                fill="none"
                stroke="${containerBackgroundColor}" 
                stroke-width="10" 
                stroke-linecap="butt"
                stroke-dasharray="141.51956176757812" 
                stroke-dashoffset="0"
                style="transition: stroke-dashoffset 0.2s ease-in-out;"
                />

            
            
            <circle id="inner-gauge" cx="50" cy="50" r="40" fill="${containerBackgroundColor}" stroke="white" stroke-width="0"/>

            
            <path id="gauge-stroke" 
                d="M 0 50 H 10 M 90 50 H 100 M 10 50 A 35 35 0 0 1 90 50 M 100 50 A 50 50 0 0 0 0 50" 
                fill="none" 
                stroke="${svgBaseColor}" 
                stroke-width="1"
                stroke-linejoin="round"
                stroke-linecap="round"
                 /> 
                 
            

            <circle id="needle-circle" cx="50" cy="50" r="3" fill="none" stroke="${svgBaseColor}" stroke-width="0.5" />
            <circle id="needle-tip-circle" cx="50" cy="50" r="0.5" fill="${svgBaseColor}" stroke="none" />
            <line id="gauge-needle" x1="50" y1="50" x2="15" y2="50" stroke="${svgBaseColor}" stroke-width="0.5" stroke-linecap="round" style="transition: transform 0.2s ease-in-out;" />
            <line id="referenceLine" x1="50" y1="45" x2="50" y2="0" stroke="${svgBaseColor}" stroke-width="1" stroke-dasharray="10 35" stroke-dashoffset="10" visibility="${this.showReferenceLine ? 'visible' : 'hidden'}"/>

            <g id="valueDisplay" visibility="${this.valueVisible ? 'visible' : 'hidden'}">
                <rect width="10" height="8" x="45" y="35" rx="2" ry="2" fill="${containerBackgroundColor}" stroke="${svgBaseColor}" stroke-width="0.5"/>
                <text id="currentVal" x="50" y="40" font-size="0.6em" text-anchor="middle" dominant-baseline="middle" fill="${svgBaseColor}" stroke="none">0</text>
            </g>

            <text id="minVal" x="17" y="55" font-size="0.8em" text-anchor="middle" fill="${svgBaseColor}" stroke="none">${this.minVal}</text>
            <text id="maxVal" x="83" y="55" font-size="0.8em" text-anchor="middle" fill="${svgBaseColor}" stroke="none">${this.maxVal}</text>
        </svg>
        `;
        // get safe reference to the svg element of the instance to avoid naming conflicts with other DOM elements
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgCode;
        const newSvg = tempDiv.firstElementChild;
        this.svg = newSvg;
        this.container.appendChild(newSvg);

        if (this.referenceVal) {
            this.setReferenceLine(this.referenceVal, this.minVal, this.maxVal);
        }
    }

    /**
     * Parses a string for a css conic-gradient passed by the client
     * @returns a string defining a conic-gradient in css syntax
     */
    parseGradientDefinition() {
        if (!this.colors) {
            // the default gradient definition is will be applied
            return null;
        }
        // arrange the gradient colors based on their degree on the gauge's arch
        try {
            this.colors.sort((a, b) => a.deg - b.deg);
            var gradientString = "";
            for (let color of this.colors) {
                if(color.color == undefined || color.deg == undefined) {
                    throw new Error(`${color} needs to be a dictionary with the keys color and deg`);
                }
                let currentColor = color.color;
                if (!isValidColor(currentColor)) {
                    throw new Error(noValidColorErrorMessage(currentColor));
                }
                let currentDeg = color.deg;
                gradientString += "," + currentColor + " " + currentDeg + "deg";
            }
        }
        catch(err) {
            console.error(`Gradient Syntax Error: The gradient definition must be in the form of 'colors = [{color: "...", deg: "..."}, {color: "...", deg: "..."}, ...]'.`)
            return null;
        }
        
        return gradientString
    }

    /**
     * calculates and adjusts the angle of the reference line on the gauge's arch
     * @param {number} referenceLineVal object attribute for the reference value
     * @param {number} minHeartRate object attribute for the min heart rate to display
     * @param {number} maxHeartRate object attribute for the max heart rate to display
     */
    setReferenceLine(referenceLineVal, minHeartRate, maxHeartRate) {
        if (this.svg) {
            const referenceLine = this.svg.querySelector('#referenceLine');
            if (referenceLine) {
                const fillPercentage = (referenceLineVal - minHeartRate) / (maxHeartRate - minHeartRate);
                const referenceLineAngle = fillPercentage * 180 - 90;
                referenceLine.setAttribute('transform', `rotate(${referenceLineAngle} 50 50)`);
            }
        }        
    }


    update(heartRate) {
        if (!this.svg) {
            return;
        }

        // keep heart rate display in the defined range
        if (heartRate > this.maxVal) {
            heartRate = this.maxVal;
        }
        if (heartRate < this.minVal) {
            heartRate = this.minVal;
        }
        // adjust the masking of the gauge by adjusting the dashoffset revealing more or less of the gradient depending on the heart rate value
        const fillPercentage = (heartRate - this.minVal) / (this.maxVal - this.minVal);
        const gaugeMask = this.svg.querySelector("#gauge-mask");
        if (gaugeMask) {
            const maskLength = gaugeMask.getTotalLength();
            const fillLength = maskLength * fillPercentage;
            const dashOffset = fillLength;
            gaugeMask.style.strokeDashoffset = dashOffset;
        }
        
        // rotate the needle
        const gaugeNeedle = this.svg.querySelector("#gauge-needle");
        if (gaugeNeedle) {
            const needleAngle = fillPercentage * 180;
            gaugeNeedle.style.transformOrigin = '50px 50px';
            gaugeNeedle.style.transform = `rotate(${needleAngle}deg)`;
        }
        
        // update the displayed value
        const currentValue = this.svg.querySelector('#currentVal');
        if (currentValue) {
            currentValue.textContent = heartRate;
        }      
    }

    validateAndSetOptions(options) {
        
        this.colors = 'colors' in options ? options.colors : null;

        if ('showReferenceLine' in options &&  typeof options.showReferenceLine == "boolean") {
            this.showReferenceLine = options.showReferenceLine;
        } else {
            this.showReferenceLine = true;
        }

        this.validateMinAndMaxValue(options);
    }

    /**
     * validate that minValue <= referenceVal <= maxValue are in the right relation
     * @param {object} options 
     */
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