import { Visualization } from "../visualization.js";

/**
 * @abstract
 * base class for heart rate visualizations
 */
export class HeartRateVisualization extends Visualization {

    /**
     * 
     * @param {string} containerId - the id of the html element which will contain the heart rate visualization
     */
    constructor(containerId, options = {}) {

        // surpresses the instantiation of abstract class
        if (new.target === HeartRateVisualization) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        super(containerId);
        this.valueVisible;
        this.referenceVal;
        this.svgElement;

        if ('referenceValue' in options) {
            if (typeof options.referenceValue !== 'number' || options.referenceValue < 0) {
                throw new Error('referenceValue must be a number that is at least 0');
            }
            this.referenceVal = options.referenceValue;
        } else {
            this.referenceVal = 70; //default value
        }

        this.valueVisible = 'valueVisible' in options ? Boolean(options.valueVisible) : true;
    }

    /**
     * @abstract
     * 
     * draws the heart rate visualization onto the screen
     */
    draw() {
        throw new Error("Abstract method 'draw' can't be executed. Must be overridden in Subclass.");
    }

    /**
     * 
     * @param {number} heartRate - the new heart rate value to visualize
     */
    update(heartRate) {
        throw new Error("Abstract method can't be executed. Must be overridden in Subclass.");
    }
}