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
        super(containerId);
        this.valueVisible = options.valueVisible && true
    }

    /**
     * 
     * @param {number} heartRate - the new heart rate value to visualize
     */
    update(heartRate) {
        throw new Error("Abstract method can't be executed. Must be overridden in Subclass.");
    }
}