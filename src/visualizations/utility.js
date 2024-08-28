export function isValidColor(colorName) {
    const style = new Option().style;
    style.color = colorName;
    // if browser accepts color string it will be set as attribute
    return style.color !== '';
}

export const noValidColorErrorMessage = (color) => `${color} is not a supported color declaration`;

/**
     * helper method to find optical background color of an element
     * if background is fully transparent method will recursively iterate 
     * through parents to find optical background color.
     * @param {object} element 
     * @returns rgb value of background color
     */
export function findBackgroundColor(element) {
    // if element non existent then return white background-color
    const rgbWhite = 'rgb(255,255,255)'
    if (!element) {
        return rgbWhite;
    }

    const backgroundColor = window.getComputedStyle(element).backgroundColor;

    if (backgroundColor == 'rgba(0, 0, 0, 0)') {
        // recursively call method on parent if it is not already the root
        if (element !== document.documentElement) {
            return findBackgroundColor(element.parentElement);
        } else {
            return rgbWhite;
        }
    } else {
        // currently visible background color of input element
        return backgroundColor;
    }
};

/**
 * Determines the brightness of a given color in rgb format
 * @param {string} rgbColor the color which brightness to determine in rgb format 
 * @returns value between in [0, 1] representing the colors brightness, where 1 is the brightest
 */
export function getColorBrightness(rgbColor) {
    let r, g, b;

    const match = rgbColor.match(/(\d+),\s*(\d+),\s*(\d+)/);
    r = parseInt(match[1]);
    g = parseInt(match[2]);
    b = parseInt(match[3]);
    
    // formula to calculate color brightness from https://www.w3.org/TR/AERT/#color-contrast
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};