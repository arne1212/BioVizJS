import { findBackgroundColor } from "./utility.js";
import { getColorBrightness } from "./utility.js";

/**
 * @abstract
 * base class for Visualizations
 */
export class Visualization {

    /**
     * 
     * @param {string} containerId - the id of the html element which will contain the visualization
     */
    constructor(containerId) {
        // surpresses the instantiation of abstract class
        if (new.target === Visualization) {
            console.error("Cannot construct Abstract instances directly");
        }

        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found!`);
        }
    }

    /**
     * method to validate the configuration input of clients
     * 
     * @param {Object} options - visualization specific options to define it's attributes
     * 
     */
    validateAndSetOptions(options) {
        throw new Error("Abstract method 'validateAndSetOptions' can't be executed. Must be overridden in Subclass.");
    }

    /** 
     * draws the visualization onto the screen
     */
    draw() {
        throw new Error("Abstract method 'draw' can't be executed. Must be overridden in Subclass.");
    }

    /**
     * update the visualization to display a new datapoint
     * 
     * @param {*} data - New information to be displayed in the visualization
     */
    update(data) {
        throw new Error("Abstract method 'update' can't be executed. Must be overridden in Subclass.");
    }

    // folgende zwei Methoden in utility Klasse auslagern oder die utility Klasse umgekehrt hier integrieren

    /**
     * Determines wheter black of white provides more contrast considering the containers color
     * @returns black or white depending on what provides better contrast
     */
    getSVGBaseColor() {
        var backgroundColor = findBackgroundColor(this.container);
        var colorBrightness = getColorBrightness(backgroundColor);
        // bright colors will result in black being used for certain svg elements
        var svgBaseColor = colorBrightness > 0.25 ? 'black' : 'white';
        return svgBaseColor
    }
}
