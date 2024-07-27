export class TestVis {

    constructor(containerId) {
        this.container = document.getElementById(containerId);
        console.log("constructor");
        this.draw();
    }

    draw() {
        let content = "test";
        this.container.innerHTML = content;
        console.log("draw");
    }
}