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

let score = 0;
let gameover = false;
let start = true;
let paused = true;
let fps = 60;
let player;
let obstacle;

//Call for our function to execute when the page loads
document.addEventListener('DOMContentLoaded', setupCanvas);

//Setup
function setupCanvas() {

    //Reference to the html canvas
    canvas = document.getElementById('my-canvas');

    //Get methods for canvas manipulation
    ctx = canvas.getContext('2d');

    //Code I found to fix scaling in smaller devices
    ctx.canvas.width  = window.innerWidth * canvasWidth / 1920;
    ctx.canvas.height = window.innerHeight * canvasHeight / 1080;

    player = new Player();

    //Initialize the player Rectanglect
    ctx.fillstyle = '#551a8b';  //purple
    ctx.fillRect

    //Handle Player Input
    document.addEventListener('keydown', playerJump);
    document.addEventListener('keydown', startF);

    //Draw the elements for the first time
    draw();
}

//Draw function
function draw() {

    //Clear the previous frame canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Black Background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    //Draw the player Rectangle
    ctx.fillstyle = 'white';  //purple
    ctx.fillRect = (300, 300 , player.width, player.height);
    
    //Draw the obstacle Rectangle if there is one
    if (obstacle != null) {
        ctx.fillstyle = '#ffff00';  //purple
        ctx.fillRect = (obstacle.x, obstacle.y , obstacle.width, obstacle.height);
    }

    
}

//PlayerJump Function
function playerJump () {
    
}

//Start Function
function startF(key) {
    if(key.keyCode === 32 && start === true) {
        start = false;
        window.requestAnimationFrame(gameloop);
    }
}

//Gameloop
function gameloop() {
    if(!paused) {
        update();
        draw();
    }
}