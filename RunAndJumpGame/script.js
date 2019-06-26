let canvasWidth = 1366
let canvasHeight = 768
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
    constructor(speed, y, x) {
        this.width = ctx.canvas.width * obstacleWidth / canvasWidth;
        this.height = ctx.canvas.height * obstacleHeight / canvasHeight;
        this.x = ctx.canvas.width + x;
        this.y = ctx.canvas.height * y / canvasHeight;
        this.speed = ctx.canvas.width * speed / canvasWidth;
    }
}

class Cloud {
    constructor (x) {
        this.width = ctx.canvas.width * 300 / canvasWidth;
        this.height = ctx.canvas.height * 50 / canvasHeight;
        this.x = ctx.canvas.width + ctx.canvas.width / canvasWidth * x;
        this.y = ctx.canvas.height * 100 / canvasHeight;
        this.speed = ctx.canvas.width * 10 / canvasWidth;
    }
}

let score = 0;
let gameover = false;
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
    ctx.canvas.width  = canvasWidth;
    ctx.canvas.height = canvasHeight;

    //Set Score Font size
    scoreFontSize = canvas.width / canvas.height * 20;

    player = new Player();

    //Initialize the clouds
    clouds = new Array(new Cloud(0), new Cloud(650), new Cloud(1250));

    //Handle Player Input
    document.addEventListener('keydown', playerJump);
    document.addEventListener('keydown', startF);

    console.log("CanvasWidth " + ctx.canvas.width);
    console.log("CanvasHeight " + ctx.canvas.height);

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
    ctx.fillStyle = 'purple';  //purple
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // console.log("player.x " + player.x);
    // console.log("player.y " + player.y);
    
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

    //Pause Menu
    if (paused) {
        ctx.fillStyle = 'white';
        ctx.font = 50 + "px Arial";
        ctx.fillText("Paused", canvasWidth/2, canvasHeight/2);
        alert('hi');
    }
    
}

//Update Function
function update() {

    //if jump was pressed move the player model up in the air, until it reaches maximum height
    if(jumping) {
        if(player.y > playerLevelY - ctx.canvas.height / canvasHeight * 300) {
            player.y -= 30;
        }
        else {
            jumping = false;
            falling = true;
        }
    }
    else if (falling) {
        if(player.y < playerLevelY) {
            player.y += 10;
        }
        else {
            player.y = (ctx.canvas.height - player.height);
            jumping = false;
            falling = false;
        }
    }

    if(!obstacleBoolean) {
        let speed = ctx.canvas.width / canvasWidth * (20 + Math.random() * 10);
        let y = canvasHeight - (obstacleHeight + Math.random() * 300);
        let x = ctx.canvas.width / canvasWidth * (Math.random() * 100);
        console.log("Ball Speed " + speed);
        console.log("Ball y " + y);
        console.log(ctx.canvas.width);
        obstacle = new Obstacle(speed, y, x);
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
    if(obstacleBoolean){
        if(player.x + playerWidth > obstacle.x && obstacle.x + obstacleWidth > player.x) {
            if(player.y < obstacle.y + obstacleHeight && obstacle.y < player.y + playerHeight) {
                gameover = true;
            }
        }
    }

}


//PlayerJump Function
function playerJump (key) {

    if(key.keyCode === 32 && falling === false && jumping === false && playing && paused) {
        jumping = false;
        paused = false;
    }
    else if(key.keyCode === 32 && falling === false && jumping === false && playing) {
        jumping = true
        paused = false;
    }
    else if(key.keyCode === 32 && playing && paused) {
        paused = false;
    }

    if(key.keyCode === 27 && playing) {
        paused = true;
    }

    if(key.keyCode === 32 && playing && paused) {
        paused = false;
    }

}

// Start Function
function startF(key) {
    if(key.keyCode === 32 && playing === false) {
        playing = true;
        window.requestAnimationFrame(gameloop);
    }
}

//Gameloop
function gameloop() {
    if(!paused) {
        update();
        draw();
    }

    if(!gameover) {
        requestAnimationFrame(gameloop);
    }
    else {
        ctx.fillStyle = 'white';
        ctx.font = scoreFontSize + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", ctx.canvas.width / 2, ctx.canvas.width / 2);
    }
}