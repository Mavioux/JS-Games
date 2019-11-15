// Reference to the canvas element
let canvas;

// Context provides functions used for drawing and working with canvas
let ctx;

let DIRECTION = {
    STOPPED: 0,
    UP: 1,
    DOWN: 2,
    RIGHT: 3,
    LEFT:4
}

class Paddle {
    constructor(side, speed) {
        this.width = canvas.width * 15 / 1400;   //15
        this.height = canvas.height * 65 / 1000;     //65
        this.y = canvas.height / 2;
        if (side == "left") {
            this.x = canvas.width * 150 / 1400;     //150
        }
        else if (side == 'right'){
            this.x = canvas.width - canvas.width * 150 / 1400;  //150
        }
        this.speed = speed;
        this.score = 0;
        this.move = DIRECTION.STOPPED;
    }
} 



class Ball {
    constructor(speed) {
        this.speed = speed;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.width = canvas.width * 15 / 1400;
        this.height = canvas.height * 15 / 1000;
        this.moveX = DIRECTION.STOPPED;
        this.moveY = DIRECTION.STOPPED;
    }
}

let player;
let ai;
let ball;
let gameOver = false;
let playing = false;
let delayAmount = 100;
let targetForBall;
let beepSound;
let maxScore = 3;
let fontSize;
let startScreen = true;
let paused = false;

//Call for our function to execute when the page loads
document.addEventListener('DOMContentLoaded', SetupCanvas);

//Setup
function SetupCanvas() {

    //Reference to the html canvas
    canvas = document.getElementById('my-canvas');

    //Get methods for canvas manipulation
    ctx = canvas.getContext('2d');

    //Set the canvas dimensions
    // canvas.width = 1400;
    // canvas.height = 1000;

    //Code I found to fix scaling in smaller devices
    ctx.canvas.width  = window.innerWidth * 0.72917;
    ctx.canvas.height = window.innerHeight * 0.9259;

    //Initialize Paddles and Ball Objects
    player = new Paddle("left", canvas.width * 7 / 1400);
    ai = new Paddle("right", canvas.width * 4.8 / 1400);
    ball = new Ball(canvas.width * 5 / 1400);

    //Set the ball to target the player
    targetForBall = player;

    //Set the amount of delaytime
    delayAmount = (new Date()).getTime();

    //Set the beepSound
    beepSound = document.getElementById('beepSound');
    beepSound.src = "ofCourse.mp3";

    //Handle keyboard Inputs
    document.addEventListener('keydown', MovePlayerPaddle);
    document.addEventListener('keyup', StopPlayerPaddle);
    document.addEventListener('keydown', Pause);

    //Draw the board for the first time
    Draw();
}


//Draw
function Draw() {

    //Clear the Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw Canvas Background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Draw the Paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height);

    //Draw the Ball
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

    //Draw the Score
    fontSize = Math.round(canvas.height * 80 / 1000);
    ctx.font = fontSize + "px Arial";
    ctx.textAlign = "center";
    
    ctx.fillText(player.score.toString(), (canvas.width / 2 - canvas.width * 150 / canvas.width), canvas.height * 0.09259);
    ctx.fillText(ai.score.toString(), (canvas.width / 2 + canvas.width * 150 / canvas.width), canvas.height * 0.09259);

    //if startScreen show screen message
    if(startScreen) {
        fontSize = Math.round(canvas.height * 40 / 1000);
        ctx.font = fontSize + "px Arial";
        ctx.fillText("Press W or S to start the Game!", canvas.width / 2, canvas.height / 2 - canvas.height * 100 / 1000);
        startScreen = false;
    }

    //Escape to Pause Message
    fontSize = Math.round(canvas.height * 20 / 1000);
    ctx.font = fontSize + "px Arial";
    ctx.fillText("Esc to Pause", canvas.width / 2, canvas.height * 20 / 1000);

    //Declare a winner
    if(player.score === maxScore) {
        fontSize = Math.round(canvas.height * 70 / 1000);
        ctx.font = fontSize + "px Arial";
        ctx.fillText("Player won!", (canvas.width / 2), canvas.height * 0.27777);
        gameOver = true;
    }
    if(ai.score === maxScore) {
        fontSize = Math.round(canvas.height * 70 / 1000);
        ctx.font = fontSize + "px Arial";
        ctx.fillText("AI won!", (canvas.width / 2), canvas.height * 0.27777);
        gameOver = true;
    }

}


//Update
//All the Game Logic goes here
function Update() {

    if(!gameOver) {
        //Handle if AI scores against Player
        if(ball.x <= 0) {
            ai.score++;
            ResetBall(player);
        }

        //Handle if Player scores against AI
        if (ball.x + ball.width >= canvas.width) {
            player.score++;
            ResetBall(ai);
        }

        //Handle if ball hits up or bottom
        if(ball.y <= 0) {
            ball.moveY = DIRECTION.DOWN;
        }
        if(ball.y + ball.height >= canvas.height) {
            ball.moveY = DIRECTION.UP
        }

        //Move Player Paddle if they are pressing the buttons
        if(player.move === DIRECTION.UP) {
            player.y += player.speed;
        }
        if(player.move === DIRECTION.DOWN) {
            player.y -= player.speed;
        }

        //if the player tries to move off canvas prevent him
        if(player.y <= 0) {
            player.y = 0;
        }
        else if (player.y + player.height >= canvas.height) {
            player.y = canvas.height - player.height;
        }

        //Add a delay and only if a current target is set move the ball
        if (targetForBall) {
            
            if(targetForBall === player) {
                ball.moveX = DIRECTION.LEFT;
            }
            else {
                ball.moveX = DIRECTION.RIGHT;
            }

            ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];

            //Ball starts from the center
            ball.y = canvas.height / 2;
            ball.x = canvas.width / 2;

            //Paddles start from the center
            player.y = canvas.height / 2;

            ai.y = canvas.height / 2;            

            //No more need for targetForBall
            targetForBall = null;
        }

        //Move ball depending on the aforementioned values
        if(ball.moveY === DIRECTION.UP) {
            ball.y -= ball.speed;
        }
        else if(ball.moveY === DIRECTION.DOWN) {
            ball.y += ball.speed;
        }

        if(ball.moveX === DIRECTION.LEFT) {
            ball.x -= ball.speed;
        }
        else if(ball.moveX === DIRECTION.RIGHT) {
            ball.x += ball.speed
        }

        //Handle AI movements
        if(ball.y + ball.height / 2 >= ai.y + ai.height / 2) {
            if(ball.move === DIRECTION.RIGHT){
                    ai.y += ai.speed;
            }
            else {
                    ai.y += ai.speed;
            }
           
        }
        else {
            if(ball.move === DIRECTION.RIGHT){
                ai.y -= ai.speed;
            }
            else {
                ai.y -= ai.speed;
            }
        }

        //Prevent AI from leaving the canvas
        if(ai.y <= 0) {
            ai.y = 0;
        }
        else if(ai.y + ai.height >= canvas.height) {
            ai.y = canvas.height - ai.height;
        }


        //Handle Ball Collision with player
        if(ball.x <= player.x + player.width && ball.x >= player.x) {
            if(ball.y + ball.height >= player.y && ball.y <= player.y + player.height) {
                //Move the ball to the edge of the paddle
                ball.x = player.x + player.width;
                ball.moveX = DIRECTION.RIGHT;
                beepSound.play();
            }
        }

        //Handle Ball Collision with AI
        if(ball.x + ai.width >= ai.x && ball.x <= ai.x + ball.width) {
            if(ball.y + ball.height >= ai.y && ball.y <= ai.y + ai.height) {
                ball.x = ai.x - ball.width;
                ball.moveX = DIRECTION.LEFT;
                beepSound.play();
            }
        }

        //Make the ball move slightly faster when time goes by
        ball.speed += canvas.width * 0.00009 / 1400

    }
}


//MovePlayerPaddle
function MovePlayerPaddle(key) {
    if(playing === false && (key.keyCode === 38 || key.keyCode === 87 || key.keyCode === 40 || key.keyCode === 83)) {
        playing = true;
        window.requestAnimationFrame(GameLoop);
    }

    //Handle W and up arrow input
    if(key.keyCode === 38 || key.keyCode === 87) {
        player.move = DIRECTION.DOWN;
        paused = false;
    }

    //Handle S and down arrow input
    if(key.keyCode === 40 || key.keyCode === 83) {
        player.move = DIRECTION.UP;
        paused = false;
    }
}


//StopPlayerPaddle
function StopPlayerPaddle(evt) {
    player.move = DIRECTION.STOPPED;
}

//Pause Game
function Pause(key) {
    if (key.keyCode === 27) {
        paused = true;
    }
}


//AddDelay
function AddDelay() {
    return ((new Date()).getTime() - delayAmount >= 1000);
}


//ResetBall
function ResetBall(loser) {
    targetForBall = loser;
    delayAmount = (new Date()).getTime();
    ball.speed = canvas.width * 5 / 1400;
}


//GameLoop
function GameLoop() {
    if(!paused) {
        Update();
        Draw();
    }
    else {
        //Paused Message
        fontSize = Math.round(canvas.height * 60 / 1000);
        ctx.font = fontSize + "px Arial";
        ctx.fillText("Paused", canvas.width / 2, canvas.height / 2 - canvas.height * 100 / 1000);
        
        //Unpaused Message
        fontSize = Math.round(canvas.height * 25 / 1000);
        ctx.font = fontSize + "px Arial";
        ctx.fillText("Press W or S to unpause", canvas.width / 2, canvas.height / 2 - canvas.height * 0 / 1000);
    }
    
    if(!gameOver) {
        requestAnimationFrame(GameLoop);
    }
}

//Pending: 
//Meddle with the settings for optimal game -> Kinda Done
//Fix the delay -> No idea how to do that...
//Implement an angle system when the ball hits the pad