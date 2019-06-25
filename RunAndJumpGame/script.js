let canvasWidth = 1600
let canvasHeight = 900
let playerWidth = 50
let playerHeight = 200
let obstacleWidth = 50
let obstacleHeight = 50
let playerLevelY;


// Reference to the canvas element
let canvas;

// Context provides functions used for drawing and working with canvas
let ctx;

class Player {
    constructor() {
        this.width = ctx.canvas.width * playerWidth / canvasWidth;
        this.height = ctx.canvas.height * playerHeight / canvasHeight;
        this.x = ctx.canvas.width * 200 / canvasWidth;
        this.y = (ctx.canvas.height - this.height);
        this.speed = ctx.canvas.height * 2 / canvasHeight;
        playerLevelY = (ctx.canvas.height - this.height);
    }
}

class Obstacle {
    constructor(speed, height) {
        this.width = ctx.canvas.width * obstacleWidth / canvasWidth;
        this.height = ctx.canvas.height * obstacleHeight / canvasHeight;
        this.x = ctx.canvas.width;
        this.y = ctx.canvas.height * height / canvasHeight;
        this.speed = ctx.canvas.width * 5 / canvasWidth;
    }
}

let score = 0;
let gameover = false;
// let start = true;
let paused = false;
let fps = 60;
let player;
let obstacle;
let scoreFontSize;
let jumping = false;
let falling = false;
let playing = false;

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

    //Set Score Font size
    scoreFontSize = canvas.width / canvas.height * 20;

    player = new Player();

    //Handle Player Input
    document.addEventListener('keydown', playerJump);
    // document.addEventListener('keydown', startF);

    //Draw the elements for the first time
    draw();
}

//Draw function
function draw() {

    //Clear the previous frame canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //Black Background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    //Draw the player Rectangle
    ctx.fillStyle = 'white';  //purple
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    //Draw the obstacle Rectangle if there is one
    if (obstacle != null) {
        ctx.fillStyle = '#ffff00';  //yellow
        ctx.fillRect(obstacle.x, obstacle.y , obstacle.width, obstacle.height);
    }

    //Draw the score
    ctx.fillStyle = 'white';
    ctx.font = scoreFontSize + "px Arial";
    ctx.textAlign = "center";
    ctx.fillText(score, ctx.canvas.width / 2, ctx.canvas.width * 40 / canvasHeight);
    
}

//PlayerJump Function
function playerJump (key) {

    if(playing === false) {
        playing = true;
        window.requestAnimationFrame(gameloop);
    }

    if(key.keyCode === 32 && falling === false && jumping === false) {
        jumping = true
        // alert('i pressed space');
    }
}

//Update Function
function update() {

    //if jump was pressed move the player model up in the air, until it reaches maximum height
    if(jumping) {
        // alert('hi');
        if(player.y > playerLevelY - ctx.canvas.height / canvasHeight * 500) {
            player.y -= 30;
        }
        else {
            jumping = false;
            falling = true;
        }
    }
    else if (falling) {
        if(player.y < playerLevelY) {
            player.y += 20;
        }
        else {
            jumping = false;
            falling = false;
        }
    }

}

//Start Function
// function startF(key) {
//     if(key.keyCode === 32 && start === true) {
//         start = false;
//         window.requestAnimationFrame(gameloop);
//     }
// }

//Gameloop
function gameloop() {
    if(!paused) {
        update();
        draw();
    }

    if(!gameover) {
        requestAnimationFrame(gameloop);
    }
}