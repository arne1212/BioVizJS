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
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found!`);
        }
    }

    /**
     * @abstract
     * 
     * @param {*} data - New information to be displayed in the visualization
     */
    update(data) {
        throw new Error("Abstract method can't be executed. Must be overridden in Subclass.");
    }
}
