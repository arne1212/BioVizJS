import { HeartRateVisualization } from "./heartRateVisualization.js";
import { isValidColor } from "../utility.js";
import { noValidColorErrorMessage } from "../utility.js";

const FULL_SCREEN_DIV_ID = 'vignetteFullScreen';

export class ScreenOverlay extends HeartRateVisualization {

    constructor(containerId = null ,options = {}) {
        if(containerId) {
            super(containerId, options)
        }
        else {
            const div = document.createElement('div');
            div.setAttribute('id', FULL_SCREEN_DIV_ID);
            div.setAttribute('style', 
                `position:fixed;
                top:0;
                left:0;
                width:100%;
                height:100%;
                pointer-events:none;`);

            document.body.appendChild(div);
            super(div.getAttribute('id'), options)
        }
        
        this.color;
        this.maxVal;
        this.tunnelIntensity;

        // how much the shadow fades as opposed to sharp edges
        this.shadowBlur;

        this.validateAndSetOptions(options);
    }

    getFullScreenDiv() {
        const div = document.createElement('div');
        div.setAttribute('id', FULL_SCREEN_DIV_ID);
        div.setAttribute('style', 
            `position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            pointer-events:none; 
            z-index:9999;`);
            // high z-index to make sure the div is lowest element and doesn't hide other divs
        return div;
    }

    validateAndSetOptions(options) {
        if ('color' in options) {
            if(!isValidColor(options.color)) {
                this.color = "rgba(0,0,0,";
                console.error(noValidColorErrorMessage + ". Default color is black.");
            }
            else {
                this.color = this.transformColor(options.color);
            }
        }
        else {
            this.color = "red"
        }

        if ('maxValue' in options) {
            if (options.maxValue <= this.referenceVal) {
                this.maxVal = Math.max(this.referenceVal + 20, 140);
                console.error(`maxValue '${options.maxValue}' must not be smaller than referenceValue '${this.referenceVal}' and is therefore set to '${this.maxVal}'.`);
            }
            else {
                this.maxVal = options.maxValue;
            }
        }
        else {
            this.maxVal = Math.max(this.referenceVal + 20, 140);
            console.info(`maxValue must be set to determine the extent of the tunnel effect and is set to '${this.maxVal}' by default.`)
        }

        const tunnelIntensityDefault = 0.1;
        if ('tunnelIntensity' in options) {
            if(typeof options.tunnelIntensity !== "number" || options.tunnelIntensity < 0 || options.tunnelIntensity > 1) {
                this.tunnelIntensity = tunnelIntensityDefault;
                console.error(`tunnelIntensity '${options.tunnelIntensity}' must be a input between 0 and 1. It is now set to the default value 0.1`);
            }
            else {
                // user has the posibility to declare intuitiv values between 0 and 1
                // but only values in (0, 0.1] are usefull
                this.tunnelIntensity = options.tunnelIntensity / 10;
            }
        }
        else {
            this.tunnelIntensity = tunnelIntensityDefault;
        }
    }
    
    /**
     * Converts a color into rgb and than fills the rgb values in an rgba template,
     * which is necessary to set opacity of background-shadow.
     * @param {*} color 
     * @returns rgba template with rgb color values prefilled.
     */
    transformColor(color) {
        const tempDiv = document.createElement("div");
        tempDiv.style.color = color;
        document.body.appendChild(tempDiv);

        // Get rgb color value of div
        const cs = getComputedStyle(tempDiv);
        const rgbColor = cs.getPropertyValue("color");

        // Remove div after obtaining desired color value
        document.body.removeChild(tempDiv);

        let r, g, b;

        const match = rgbColor.match(/(\d+),\s*(\d+),\s*(\d+)/);
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
        return `rgba(${r}, ${g}, ${b},`
    }

    draw() {
        return;
    }

    update(heartRate) {
        const containerWidth = this.getContainerWidth();
        const containerDiv = this.container;
        const shadowSpread = this.calculateShadowSpread(heartRate, containerWidth);
        const shadowBlur = this.calculateShadowBlur(containerWidth);
        const shadowOpacity = this.calculateShadowOpacity(heartRate);
        const def = `0 0 ${shadowBlur}em ${shadowSpread}px ${this.color + shadowOpacity}) inset`
        containerDiv.style.boxShadow = def;
    }

    getContainerWidth() {
        const containerSize = this.container.getBoundingClientRect();
        const conatinerWidth = containerSize.width;
        return conatinerWidth;
    }

    calculateShadowBlur(containerWidth) {
        const shadowBlur = Math.pow(containerWidth, 0.8) * 0.02;
        return shadowBlur;        
    }

    calculateShadowSpread(heartRate, containerWidth) {
        const positiveRelativeOffset = Math.max(0, (heartRate - this.referenceVal) / (this.maxVal - this.referenceVal));
        const shadowSpread = positiveRelativeOffset * containerWidth * this.tunnelIntensity;
        return shadowSpread;
    }

    calculateShadowOpacity(heartRate) {
        const positiveRelativeOffset = Math.max(0, (heartRate - this.referenceVal) / (this.maxVal - this.referenceVal));
        const shadowOpacity = positiveRelativeOffset;
        return shadowOpacity;
    }
}