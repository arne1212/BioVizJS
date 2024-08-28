![VitaSight_logo](https://github.com/user-attachments/assets/10e6f62e-485f-4bc6-8245-7f29b01b1e03)

Einleitungstext! ca. 3 Sätze

# Table of Contents
1. [Usage](#usage)
   1. [`HeartRateGauge`](#heartrategauge)
   2. [`HistoryLineGraph`](#historylinegraph)
   
3. [Contributing](#contributing)
4. [Known Issues](#known-issues)

# Usage

VitaSight offers Visualizations for physiological Data in JavaScript.
All the source code of the library is bundled in the file dist/vitasight.js.
To make use of the library, copy the contents of vitasight into a .js file in your working directory.
For usage in HTML files simple include the .js file via a script tag.
In the following the different visualizations and their interfaces are illustrated.

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

    <script src="./javascript/vitasight.js"></script>
    <script>
        // instanitation goes here
    </script>
</body>
```

In the following the different visualizations are presented with an example on how to instantiate them.

## HeartRateGauge

https://github.com/user-attachments/assets/aee89c37-8672-42b0-a3bf-cb11b3775945

|   Configuration Option  |                                                                              Description                                                                              |                                                                                                   Default Value                                                                                                  |
|:-----------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| referenceValue: int     | Defines a reference value that will determine the reference line's position  and the color gradient if the default colors are used.                                   | 70                                                                                                                                                                                                               |
| minValue: int           | Defines the lower bound of the gauge. Values below will be displayed as the minValue.                                                                                 | 40                                                                                                                                                                                                               |
| maxValue: int           | Defines the upper bound of the gauge. Values above will be displayed as the maxValue.                                                                                 | 180                                                                                                                                                                                                              |
| showReferenceLine: bool | Flag to turn the reference line on or off.                                                                                                                            | true                                                                                                                                                                                                             |
| valueVisible: bool      | Flag to turn the value display on or off.                                                                                                                             | true                                                                                                                                                                                                             |
| colors: [object]        | Array in the form [{color: "green", deg: "50"}, {color: "yellow", deg: "86"}, ...], specifying the colors of the gradient and their degree on the arch of the gauge.  | color-values: (deepskyblue, mediumspringgreen, lime, greenyellow, yellow, orange, red); With the deg-values calculated based on the referenceValue, so that the reference line is on the same deg as color lime; |

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

## HistoryLineGraph

https://github.com/user-attachments/assets/f72b3afb-a6e5-4034-ab48-8287b53b282f

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

## HeartRateSketchFigure

https://github.com/user-attachments/assets/865a69bf-eb22-47c5-8da2-3c0b19ecade4

|   Configuration Option   |                                                                         Description                                                                         |                     Default Value                     |
|:------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------:|
| referenceValue: int      | Defines a reference value that will determine the reference line's position  and the color gradient if the default colors are used.                         | 70                                                    |
| levelOffset: number      | Defines the percentage value the (heart rate) value needs to diverge from the referenceValue to be classified as a different step with corresponding color. | 0.05                                                  |
| colorSteps: [string]     | Explicitly defines the different color steps.                                                                                                               | ["darkcyan", "forestgreen", "khaki", "orange", "red"] |
| referenceColorIndex: int | Defines which color in colorStep is used as the color for values around the referenceValue. Values of the array can be rgb, hex, hsl or simple color names. | 1 if length of colorSteps >= 3; 0 else                |
| isAnimated: bool         | Flag to turn the wave animation of the fill level on or off.                                                                                                | true                                                  |
| valueVisible: bool       | Flag to turn the value display on or off.                                                                                                                   | true                                                  |

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

## PulsatingHeart

https://github.com/user-attachments/assets/9ddd6635-4770-496d-8399-9384c0c5e5a2

| Configuration Option |                                Description                                | Default Value |
|:--------------------:|:-------------------------------------------------------------------------:|:-------------:|
| heartColor           | The fill color of the heart. Can be rgb, hex, hsl or a simple color names.| "red"         |
| isAnimated: bool     | Flag to turn the pulse animation on or off.                               | true          |
| valueVisible: bool   | Flag to turn the value display on or off.                                 | true          |
| scaleFactor          | The factor the heart scales by during the pulse animation.                | 1.5           |

```javascript
const vis = new vitasight.PulsatingHeart("someElem", {
    valueVisible: true,
    isAnimated: true,
    scaleFactor: 1.5,
    heartColor: "yellow",
});
```

## ScreenOverlay

https://github.com/user-attachments/assets/a900a0bf-ac2c-42c0-83fe-ea0c1e2048e3

|   Configuration Option  |                                                             Description                                                            |          Default Value         |
|:-----------------------:|:----------------------------------------------------------------------------------------------------------------------------------:|:------------------------------:|
| referenceValue: int     | Defines a reference value that will determine the reference line's position and the color gradient if the default colors are used. | 70                             |
| color: string           | The color of the vignette shade. Can be rgb, hex, hsl or a simple color name.                                                      | "red"                          |
| maxValue: int           | Maximum value to track. If this value is reached the vignette effect will have it's maximum extend.                                | max {referenceValue + 20, 140} |
| tunnelIntensity: number | A value out of [0,1] to determine the intensity of the tunnel effect caused by the vignette shade, where one is the strongest.     | 0.1                            |

```javascript
const vis = new vitasight.ScreenOverlay("someElem", {
    color: "red",
    referenceValue: 65,
    maxValue: 100,
    tunnelIntensity: 0.1,
});
```

The instantiated Visualizations don't do much. They can now be used to visualize data by calling their `update` method, be it with an artificial data source or sensor data in an oTree experiment.

```javascript
// example for artificial data source that can be included in the html script
setInterval(() => {
    // generate random heart rate between 40 and 139 each second
    const heartRate = Math.floor(Math.random() * 100) + 40;
    vis.update(heartRate);
}, 1000);
```

# Incorporate VitaSight in oTree+Frisbee Experiments
[oTree](https://otree.readthedocs.io/en/latest/) and [Frisbee](https://github.com/fabianwuest/frisbee-otree-extension) are Open-Source software libraries. oTree is a framework for creating web-based experiments while Frisbee facilitates the inclusion of sensor in these experiments.
VitaSight augments Frisbee by visualizing the sensor data on the webpages of the participants. For a reference on how to include Frisbee in oTree experiments visit <https://github.com/fabianwuest/frisbee-otree-extension>.
Once Frisbee is included VitaSight can be used to enhance the HTML pages with visualizations. If a vitasight.js file with the code from this library was created in the static folder of oTree,
an example page could look like this:

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

## API Reference
Detailed API documentation.

# Contributing
Explain how others can contribute to the project.

## Installation

```bash
npm install my-project
```

## Architecture

## 3rd Party Libraries


# Known Issues
