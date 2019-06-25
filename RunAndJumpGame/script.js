let canvasWidth = 1600
let canvasHeight = 900
let playerWidth = 125
let playerHeight = 125
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
    constructor(speed, height, x) {
        this.width = ctx.canvas.width * obstacleWidth / canvasWidth;
        this.height = ctx.canvas.height * obstacleHeight / canvasHeight;
        this.x = ctx.canvas.width + x;
        this.y = ctx.canvas.height * height / canvasHeight;
        this.speed = ctx.canvas.width * speed / canvasWidth;
    }
}

class Cloud {
    constructor (x) {
        this.width = ctx.canvas.width * 300 / canvasWidth;
        this.height = ctx.canvas.height * 50 / canvasHeight;
        this.x = ctx.canvas.width - x;
        this.y = ctx.canvas.height * 100 / canvasHeight;
        this.speed = ctx.canvas.width * 10 / canvasWidth;
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
let obstacleBoolean = false;
let clouds;


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

    //Initialize the clouds
    clouds = new Array(new Cloud(0), new Cloud(300), new Cloud(600));

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
    if(obstacleBoolean) {
        ctx.fillStyle = '#ffff00';  //yellow
        ctx.fillRect(obstacle.x, obstacle.y , obstacle.width, obstacle.height);
    }

    //Draw the score
    ctx.fillStyle = 'white';
    ctx.font = scoreFontSize + "px Arial";
    ctx.textAlign = "center";
    ctx.fillText(score, ctx.canvas.width / 2, ctx.canvas.width * 40 / canvasHeight);

    //Draw the Clouds
    ctx.fillStyle = 'grey';
    for(let i = 0; i < 3; i++) {
        ctx.fillRect(clouds[i].x, clouds[i].y, clouds[i].width, clouds[i].height);
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

    if(!obstacleBoolean) {
        let speed = ctx.canvas.width / canvasWidth * (50 + Math.random() * 20);
        let height = ctx.canvas.width - ctx.canvas.height / canvasHeight * (0 + Math.random() * 150);
        let x = ctx.canvas.width / canvasWidth * (Math.random() * 100);
        console.log(speed);
        console.log(height);
        obstacle = new Obstacle(speed, height, x);
        obstacleBoolean = true;
    }

    if(obstacleBoolean) {
        obstacle.x -= obstacle.speed;
        if(obstacle.x < 0) {
            obstacleBoolean = false;
        }
    }

    //Update the Clouds
    for(let i = 0; i < 3; i++) {
        clouds[i].x -= clouds[i].speed;
        if(clouds[i].x < -clouds[i].width) {
            clouds[i] = new Cloud(0);
        }
    }

    

    //Up the score!
    score++;

    //Collision Detection

}


//PlayerJump Function
function playerJump (key) {

    if(playing === false && key.keyCode === 32) {
        playing = true;
        window.requestAnimationFrame(gameloop);
    }

    if(key.keyCode === 32 && falling === false && jumping === false) {
        jumping = true
        // alert('i pressed space');
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