let canvasWidth = 1600
let canvasHeight = 900
let playerWidth = 50
let playerHeight = 200
let obstacleWidth = 50
let obstacleHeight = 50


// Reference to the canvas element
let canvas;

// Context provides functions used for drawing and working with canvas
let ctx;

class Player {
    constructor() {
        this.width = canvas.width * playerWidth / canvasWidth;
        this.height = canvas.height * playerHeight / canvasHeight;
        this.x = canvas.width * 50 / canvasWidth;
        this.y = canvas.height * (canvas.height - this.height) / canvasHeight;
        this.speed = canvas.height * 2 / canvasHeight;
    }
}

class Obstacle {
    constructor(speed, height) {
        this.width = canvas.width * obstacleWidth / canvasWidth;
        this.height = canvas.height * obstacleHeight / canvasHeight;
        this.x = canvas.width;
        this.y = canvas.height * height / canvasHeight;
        this.speed = canvas.width * 5 / canvasWidth;
    }
}