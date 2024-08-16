import { HeartRateVisualization } from "./heartRateVisualization.js";
import { isValidColor } from "../utility.js";
import { noValidColorErrorMessage } from "../utility.js";

export class PulsatingHeart extends HeartRateVisualization {

    constructor(containerId, options={}) {
        super(containerId, options);

        this.scaleFactor;
        this.heartColor;
        this.isAnimated;

        this.validateAndSetOptions(options);
        

        this.lastHeartRate;

        this.draw();
        if (this.isAnimated) {
            this.setupAnimationListeners();
        }
    }

    validateAndSetOptions(options) {
        if ('scaleFactor' in options) {
            if (typeof options.scaleFactor !== 'number' || options.scaleFactor < 1) {
                throw new Error('scaleFactor must be a number that is at least 1');
            }
            this.scaleFactor = options.scaleFactor;
        } else {
            this.scaleFactor = 1.5;
        }

        if ('heartColor' in options) {
            if (isValidColor(options.heartColor)) {
                this.heartColor = options.heartColor;
            } else {
                throw new Error(noValidColorErrorMessage(options.heartColor));
            }
        } else {
            this.heartColor = "red"; // default value
        }

        this.isAnimated = 'animated' in options ? Boolean(options.animated) : true;        
    }

    draw() {
        const svgBaseColor = this.getSVGBaseColor();
        const viewBoxHeight = 32;
        /**
         * A heart.
         * Animation that scales the heart to ressemble a heart beat.
         * The timespan between consecutive scaling animations depends on the heart rate.
         * After three scaling animations the timespan ('dur') is updated to consider the most recent heart rate.
         */
        const svgCode = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="-14 -14 28 ${viewBoxHeight}">
            <path id="pulsatingHeart" 
                d="M3.7 -8C6.87 -8 9 -5.02 9 -2.24C9 3.39 0.16 8 0 8C-0.16 8 -9 3.39 -9 -2.24C-9 -5.02 -6.87 -8 -3.7 -8C-1.88 -8 -0.69 -7.09 0 -6.29C0.69 -7.09 1.88 -8 3.7 -8Z"
                stroke-linecap="round" stroke-linejoin="round"
                fill="${this.heartColor}">
                ${this.isAnimated ? `<animateTransform
                    id="pulseAnimation"
                    attributeName="transform"
                    attributeType="XML"
                    type="scale"
                    from="1"
                    to="${this.scaleFactor}"
                    dur=""
                    repeatCount="3"
                    keyTimes="0;0.5;1"
                    values="1;${this.scaleFactor};1"
                    begin="indefinite"
                />` : ``}               
            </path>
            <g id="valueDisplay" visibility="${this.valueVisible ? 'visible' : 'hidden'}">
                <text id="currentVal" x="0" y="${viewBoxHeight / 2}" font-size="0.3em" text-anchor="middle" dominant-baseline="middle" fill="${svgBaseColor}" stroke="none">0</text>
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
        this.lastHeartRate = heartRate;
        if (this.valueVisible) {
            this.updateValueDisplay(heartRate);
        }

        // with the receival of the first heart rate value the animation is started
        if (this.isAnimated && !this.isAnimationRunning) {
            this.restartAnimation();
        }
    }

    updateValueDisplay(heartRate) {
        if(this.svgElement) {
            const valueDisplay = this.svgElement.querySelector('#currentVal');
            if (valueDisplay) {
                valueDisplay.textContent = heartRate;
            }
        }
    }

    /**
     * restarts the animation for 3 beats with the most recent heart rate value
     */
    restartAnimation() {
        const animation = this.getAnimation();
        const newDuration = 60 / this.lastHeartRate;
        animation.endElement();
        animation.setAttribute('dur', newDuration + "s");
        animation.beginElement();
    }
    
    /**
     * creates event listeners of animation events
     */
    setupAnimationListeners() {
        const animation = this.getAnimation();
    
        // if the animation ends it must be restarted with the current heart rate value
        animation.addEventListener("endEvent", () => {
            this.restartAnimation();
        });

        animation.addEventListener('beginEvent', () => {
            this.isAnimationRunning = true;
        });
    }

    getAnimation() {
        const animation = document.getElementById('pulseAnimation')
        if (!animation) {
            console.error("Animation element not found");
            return;
        }
        return animation;
    }


}