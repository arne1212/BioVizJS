export function isValidColor(colorName) {
    const style = new Option().style;
    style.color = colorName;
    // if browser accepts color string it will be set as attribute
    return style.color !== '';
}

export const noValidColorErrorMessage = (color) => `${color} is not a supported color declaration`;