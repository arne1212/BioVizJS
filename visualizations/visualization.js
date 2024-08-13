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
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found!`);
        }
    }

    /**
     * @abstract
     * 
     * @param {Object} options - visualization specific options to define it's attributes
     * 
     */
    validateAndSetOptions(options) {
        throw new Error("Abstract method 'validateAndSetOptions' can't be executed. Must be overridden in Subclass.");
    }

    /**
     * @abstract
     * 
     * draws the visualization onto the screen
     */
    draw() {
        throw new Error("Abstract method 'draw' can't be executed. Must be overridden in Subclass.");
    }

    /**
     * @abstract
     * 
     * @param {*} data - New information to be displayed in the visualization
     */
    update(data) {
        throw new Error("Abstract method 'update' can't be executed. Must be overridden in Subclass.");
    }

    // folgende zwei Methoden in utility Klasse auslagern

    /**
     * Determines wheter black of white provides more contrast considering the containers color
     * @returns black or white depending on what provides better contrast
     */
    getSVGBaseColor() {
        var containerColor = getComputedStyle(this.container).backgroundColor;
        var colorBrightness = this.getColorBrightness(containerColor);
        // bright colors will result in black being used for certain svg elements
        var svgBaseColor = colorBrightness > 0.25 ? 'black' : 'white';
        return svgBaseColor
    }

    /**
     * Determines the brightness of a given color in rgb format
     * @param {string} rgbColor the color which brightness to determine in rgb format 
     * @returns value between in [0, 1] representing the colors brightness
     */
    getColorBrightness(rgbColor) {
        let r, g, b;

        const match = rgbColor.match(/(\d+),\s*(\d+),\s*(\d+)/);
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
        
        // formula to calculate color brightness from https://www.w3.org/TR/AERT/#color-contrast
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }
}
