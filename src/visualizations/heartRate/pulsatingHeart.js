import { HeartRateVisualization } from "./heartRateVisualization.js";
import { isValidColor } from "../utility.js";
import { noValidColorErrorMessage } from "../utility.js";

/**
 * svg visualization of a beating heart
 */
export class PulsatingHeart extends HeartRateVisualization {
    constructor(containerId, options={}) {
        super(containerId, options);
        console.log('is constructing');
        this.scaleFactor;
        this.heartColor;
        this.isAnimated;
        this.validateAndSetOptions(options);

        this.isAnimationRunning = false;
       
        this.animation = null; // Will store the Web Animations API animation object
        
        this.draw();
    }

    validateAndSetOptions(options) {

        if ('scaleFactor' in options) {
            if (typeof options.scaleFactor !== 'number' || options.scaleFactor < 1) {
                options.scaleFactor = 1.5;
                throw console.error(`scaleFactor must be a number that is at least 1. Input was ${options.scaleFactor}. Default value 1.5 is applied.`);
            } else {
                this.scaleFactor = options.scaleFactor;
            }
        } else {
            this.scaleFactor = 1.5;
        }

        if ('heartColor' in options) {
            if (isValidColor(options.heartColor)) {
                this.heartColor = options.heartColor;
            } else {
                this.heartColor = "red";
                console.error(noValidColorErrorMessage(options.heartColor));
            }
        } else {
            this.heartColor = "red";
        }

        this.isAnimated = 'animated' in options ? Boolean(options.animated) : true;        
    }

    draw() {
        const svgBaseColor = this.getContrastingBaseColor();
        const viewBoxHeight = 32;
        /**
         * svg with a path enclosing the shape of a heart and below a value display
         */
        const svgCode = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="-14 -14 28 ${viewBoxHeight}">
            <path id="pulsatingHeart"
                d="M3.7 -8C6.87 -8 9 -5.02 9 -2.24C9 3.39 0.16 8 0 8C-0.16 8 -9 3.39 -9 -2.24C-9 -5.02 -6.87 -8 -3.7 -8C-1.88 -8 -0.69 -7.09 0 -6.29C0.69 -7.09 1.88 -8 3.7 -8Z"
                stroke-linecap="round" stroke-linejoin="round"
                fill="${this.heartColor}">
            </path>
            <g id="valueDisplay" visibility="${this.valueVisible ? 'visible' : 'hidden'}">
                <text id="currentVal" x="0" y="${viewBoxHeight / 2}" font-size="0.3em" text-anchor="middle" dominant-baseline="middle" fill="${svgBaseColor}" stroke="none">0</text>
            </g>
        </svg>
        `;
        // get safe reference to the svg element of the instance to avoid naming conflicts with other DOM elements
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgCode;
        this.svg = tempDiv.firstElementChild;
        this.container.appendChild(this.svg);
        this.heartElement = this.svg.querySelector('#pulsatingHeart');
    }

    update(heartRate) {
        this.lastHeartRate = heartRate;

        //start animation on the first call of update method
        if (this.isAnimated && !this.isAnimationRunning) {
            this.isAnimationRunning = true;
            this.startAnimation();
        }

        if (this.valueVisible) {
            const valueDisplay = this.svg.querySelector('#currentVal');
            valueDisplay.textContent = heartRate;
        }
    }

    /**
     * start the animation with the animation speed (pulse motion) based on the lastHeartRate
     * @returns void
     */
    startAnimation() {
        if (!this.heartElement) return;
        
        const animationDuration = 60 / Math.max(this.lastHeartRate, 20); // Prevent division by zero or very small numbers
       
        // define animation
        const keyframes = [
            { transform: 'scale(1)' },
            { transform: `scale(${this.scaleFactor})` },
            { transform: 'scale(1)' }
        ];
        
        const options = {
            duration: animationDuration * 1000, // Convert to milliseconds
            // after three beats the animation is restarted with a new duration depending on the lastHeartRate
            iterations: 3,
            easing: 'ease-in-out'
        };
        
        this.animation = this.heartElement.animate(keyframes, options);
        
        this.animation.onfinish = () => {
            this.startAnimation(); // restart the animation
        };
        
    }
}