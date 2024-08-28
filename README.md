![VitaSight_logo](https://github.com/user-attachments/assets/10e6f62e-485f-4bc6-8245-7f29b01b1e03)

<br>

VitaSight is an open-source JavaScript library for visualizing physiological data in web browsers. It is designed to be easily integrated into oTree experiments, empowering researchers with easy-to-use visualization solutions.

<br>

# Table of Contents


1. [Usage](#usage)
   - [`HeartRateGauge`](#heartrategauge)
   - [`HistoryLineGraph`](#historylinegraph)
   - [`HeartRateSketchFigure`](#heartratesketchfigure)
   - [`PulsatingHeart`](#pulsatingheart)
   - [`ScreenOverlay`](#screenoverlay)
   - [Incorporating VitaSight in oTree Experiments with Frisbee](#incorporating-vitasight-in-otree-experiments-with-frisbee)

2. [Contributing](#contributing)
   - [Installation](#installation)
   - [Architecture](#architecture)
   - [3rd Party Libraries](#3rd-party-libraries)

3. [Known Issues](#known-issues---work-in-progress)

<br>

# Usage

VitaSight offers visualizations for physiological data in JavaScript.
All the source code of the library is bundled into the file [dist/vitasight.js](dist/vitasight.js).

To make use of the library, copy the contents of vitasight into a .js file in your working directory.
For usage in HTML files simple include the .js file via a script tag.

Alternatively the library can be directly included without the need to create a own local file by using the link <https://cdn.jsdelivr.net/gh/arne1212/BioVizJS/dist/vitasight.js> via the Content Delivery Network [jsDelivr](https://www.jsdelivr.com/).

```
project/
└── src/
    ├── test.html
    └── javascript/
        └── vitasight.js
```

Suppose the above is the structure of your working directory and we want to use the visualizations in the test.html file.
First of all we need to create an HTML Element to bind the visualization to and secondly the VitaSight library is included:

```html
<body>
    <div id="someElem" style="width: 30%"></div>

   <!-- Alt. 1: Using local copy of vitasight.js -->
    <script src="./javascript/vitasight.js"></script>
   <!-- Alt. 2: Using jsdelivr to directly fetch the library from the web -->
   <script src="https://cdn.jsdelivr.net/gh/arne1212/BioVizJS/dist/vitasight.js"></script>
    <script>
        // instanitation goes here
    </script>
</body>
```

In the following subchapters the different visualizations are presented with an example on how to instantiate them.

<br>

## HeartRateGauge


https://github.com/user-attachments/assets/aee89c37-8672-42b0-a3bf-cb11b3775945

<br>

|   Configuration Option  |                                                                              Description                                                                              |                                                                                                   Default Value                                                                                                  |
|:-----------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| referenceValue: int     | Defines a reference value that will determine the reference line's position  and the color gradient if the default colors are used.                                   | 70                                                                                                                                                                                                               |
| minValue: int           | Defines the lower bound of the gauge. Values below will be displayed as the minValue.                                                                                 | 40                                                                                                                                                                                                               |
| maxValue: int           | Defines the upper bound of the gauge. Values above will be displayed as the maxValue.                                                                                 | 180                                                                                                                                                                                                              |
| showReferenceLine: bool | Flag to turn the reference line on or off.                                                                                                                            | true                                                                                                                                                                                                             |
| valueVisible: bool      | Flag to turn the value display on or off.                                                                                                                             | true                                                                                                                                                                                                             |
| colors: [object]        | Array in the form [{color: "green", deg: "50"}, {color: "yellow", deg: "86"}, ...], specifying the colors of the gradient and their degree on the arch of the gauge.  | color-values: (deepskyblue, mediumspringgreen, lime, greenyellow, yellow, orange, red); With the deg-values calculated based on the referenceValue, so that the reference line is on the same deg as color lime; |

<br>

```javascript
const vis = new vitasight.HeartRateGauge("someElem", {
  referenceValue: 70,
  valueVisible: true,
  minValue: 50,
  maxValue: 100,
  colors: [
    {color: "cyan", deg: 0},
    {color: "green", deg: 72},
    // green area around reference Value: (180 / (maxValue-minValue)) * (referenceValue-minValue)
    {color: "yellow", deg: 120},
    {color: "red", deg: 180}
  ]
});
```

<br>

## HistoryLineGraph


https://github.com/user-attachments/assets/f72b3afb-a6e5-4034-ab48-8287b53b282f

<br>

|    Configuration Option    |                                                             Description                                                             | Default Value |
|:--------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------:|:-------------:|
| referenceValue: int        | Defines a reference value that will determine the reference line's position  and the color gradient if the default colors are used. | 70            |
| minValue: int              | Defines the lower bound of the gauge. Values below will be displayed as the minValue.                                               | 40            |
| maxValue: int              | Defines the upper bound of the gauge. Values above will be displayed as the maxValue.                                               | 180           |
| showReferenceLine: bool    | Flag to turn the reference line on or off.                                                                                          | true          |
| referenceLineColor: string | Definition of the color to use for the reference line. Can be rgb, hex, hsl or simple color names.                                  | "red"         |
| graphLineColor: string     | Definition of the color to use for the graph line. Can be rgb, hex, hsl or simple color names.                                      | "steelblue"   |
| xAxisLabel: string         | The label for the x-axis.                                                                                                           | Zeit          |
| yAxisLabel: string         | The label for the y-axis.                                                                                                           | Herzfrequenz  |
| numberTimestamps: int      | The number of timestamps to show on the x-axis.                                                                                     | 5             |

<br>

```javascript
const vis = new vitasight.HistoryLineGraph('someElem', {
    minValue: 40,
    maxValue: 160,
    referenceValue: 65,
    numberTimestamps: 4,
    xAxisLabel: 'Time',
    yAxisLabel: 'Heart Rate',
    showRefrenceLine: true,
    referenceLineColor: 'green',
    graphLineColor: 'blue',
});
```

<br>

## HeartRateSketchFigure


https://github.com/user-attachments/assets/865a69bf-eb22-47c5-8da2-3c0b19ecade4

<br>

|   Configuration Option   |                                                                         Description                                                                         |                     Default Value                     |
|:------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------:|
| referenceValue: int      | Defines a reference value that will determine the reference line's position  and the color gradient if the default colors are used.                         | 70                                                    |
| levelOffset: number      | Defines the percentage value the (heart rate) value needs to diverge from the referenceValue to be classified as a different step with corresponding color. | 0.05                                                  |
| colorSteps: [string]     | Explicitly defines the different color steps.                                                                                                               | ["darkcyan", "forestgreen", "khaki", "orange", "red"] |
| referenceColorIndex: int | Defines which color in colorStep is used as the color for values around the referenceValue. Values of the array can be rgb, hex, hsl or simple color names. | 1 if length of colorSteps >= 3; 0 else                |
| isAnimated: bool         | Flag to turn the wave animation of the fill level on or off.                                                                                                | true                                                  |
| valueVisible: bool       | Flag to turn the value display on or off.                                                                                                                   | true                                                  |

<br>

```javascript
const vis = new vitasight.HeartRateGauge("someElem", {
  referenceValue: 70,
  valueVisible: true,
  minValue: 50,
  maxValue: 100,
  colors: [
    {color: "cyan", deg: 0},
    {color: "green", deg: 72},
    // green area around reference Value: (180 / (maxValue-minValue)) * (referenceValue-minValue)
    {color: "yellow", deg: 120},
    {color: "red", deg: 180}
  ]
});
```

<br>

## PulsatingHeart


https://github.com/user-attachments/assets/9ddd6635-4770-496d-8399-9384c0c5e5a2

<br>

| Configuration Option |                                Description                                | Default Value |
|:--------------------:|:-------------------------------------------------------------------------:|:-------------:|
| heartColor           | The fill color of the heart. Can be rgb, hex, hsl or a simple color names.| "red"         |
| isAnimated: bool     | Flag to turn the pulse animation on or off.                               | true          |
| valueVisible: bool   | Flag to turn the value display on or off.                                 | true          |
| scaleFactor          | The factor the heart scales by during the pulse animation.                | 1.5           |

<br>

```javascript
const vis = new vitasight.PulsatingHeart("someElem", {
    valueVisible: true,
    isAnimated: true,
    scaleFactor: 1.5,
    heartColor: "yellow",
});
```

<br>

## ScreenOverlay


https://github.com/user-attachments/assets/a900a0bf-ac2c-42c0-83fe-ea0c1e2048e3

<br>

|   Configuration Option  |                                                             Description                                                            |          Default Value         |
|:-----------------------:|:----------------------------------------------------------------------------------------------------------------------------------:|:------------------------------:|
| referenceValue: int     | Defines a reference value that will determine the reference line's position and the color gradient if the default colors are used. | 70                             |
| color: string           | The color of the vignette shade. Can be rgb, hex, hsl or a simple color name.                                                      | "red"                          |
| maxValue: int           | Maximum value to track. If this value is reached the vignette effect will have it's maximum extend.                                | max {referenceValue + 20, 140} |
| tunnelIntensity: number | A value from the interval [0,1] to determine the intensity of the tunnel effect caused by the vignette shade, where 1 is the strongest.     | 0.1                            |

<br>

```javascript
const vis = new vitasight.ScreenOverlay("someElem", {
    color: "red",
    referenceValue: 65,
    maxValue: 100,
    tunnelIntensity: 0.1,
});
```

<br>

The instantiated Visualizations don't do much on their own. They should now be used to visualize data by calling their `update` method, be it with an artificial data source or sensor data in an oTree experiment.

```javascript
// example for artificial data source that can be included in the html script
setInterval(() => {
    // generate random heart rate between 40 and 139 each second
    const heartRate = Math.floor(Math.random() * 100) + 40;
    vis.update(heartRate);
}, 1000);
```

<br>

## Incorporating VitaSight in oTree Experiments with Frisbee
[oTree](https://otree.readthedocs.io/en/latest/) and [Frisbee](https://github.com/fabianwuest/frisbee-otree-extension) are Open-Source software libraries. oTree is a framework for creating web-based experiments while Frisbee facilitates the inclusion of sensor in these experiments.
VitaSight augments Frisbee by visualizing the sensor data on the webpages of the participants. For a reference on how to include Frisbee in oTree experiments visit <https://github.com/fabianwuest/frisbee-otree-extension>.
Once Frisbee is included VitaSight can be used to enhance the HTML pages with visualizations.

If a vitasight.js file with the code from this library was created in the static folder of oTree, an example page could look like this:

```html
{{ block title }}Example{{ endblock }}
{{ block content }}

<div id="dataVis" style="width: 30%; height: 30%"></div>

<script src="{{ static 'vitasight.js' }}"></script>
<script>
    const vis = new vitasight.PulsatingHeart("dataVis", {
        valueVisible: true,
        isAnimated: true,
        scaleFactor: 1.5,
        heartColor: "orange",
    });

    document.addEventListener("DOMContentLoaded", () => {
        setInterval(() => {
            liveSend("");
        }, 1000);
    });

    function liveRecv(data) {
        vis.update(data)
    }
</script>

    {{ next_button }}
{{ endblock }}
```

<br>

# Contributing

VitaSight is an Open-Source-Community-Project. Feel encouraged to contribute visualizations for sensors that are important for your work or that you simply care about.

## Installation

1. To work with this project Node.js must be installed on the machine. In type in the following command in your working directory too check whether Node.js is already installed.
```bash
node -v
```

<br>

2. To install Node.js refer to <https://nodejs.org/en/download/package-manager>.

<br>

3. Clone VitaSight into your working directory.
```bash
git clone https://github.com/arne1212/VitaSight.git
```

<br>

4. Naviagte into the project directory and type in the following command to download all the necessary dependencies. Now you are ready to go.
```bash
npm install
```

<br>

## Architecture

The source code is structured as an object-oriented inheritance hierarchie. Different visualization are encapsulated into classes.
These are all imported into the [index.js](src/index.js) file which acts as the entry point to the library.

<br>

<div align="center">
  <img src="https://github.com/user-attachments/assets/e2838443-f1c9-4cc6-b274-dea16fa14624" width="40%">
</div>


<br>

The `Visualization` class can be specified into Visualizations of a certain type e.g. `HeartRateVisualization` which itself can be superclass for specific classes.
This structure allows for easy addition of further visualizations into the inheritance tree.

<br>

## 3rd Party Libraries

VitaSight uses [webpack](https://webpack.js.org/) to bundle the classes into the vitasight.js file to enhance usability.
Bundles can also be build for test purposes with the command: 
```bash
npx webpack
```
For each commit on the main branch a new bundle is build with a GitHub [workflow](.github/workflows/webpack-bundle.yml) to ensure the availability of the newest changes.

Furthermore the transpiler [Babel](https://babeljs.io/) is integrated into the webpack bundling processes to translate the source code into older syntax of JavaScript to enhance backward compatibility with older browsers. The visualization library [D3](https://d3js.org/) is used for the implementation of `HistoryLineGraph`.

<br>

# Known Issues - Work in Progress

- reference line display of `HeartRateGauge` differs in Safari 17 on macOS Ventura, resulting in it being almost fully hidden (recomendation to set the option ```showReferenceLine = false``` when using this combination)
