// select canvas element
const canvas = document.getElementById("garbauge");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

// Load Textures
var _img = document.getElementById('id1');

// Game variables
let gameover = false;
const winningScore = 7;

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------- Load textures & sound -----------------------------------//

// Textures
var gPlayer = new Image;
gPlayer.src = 'resource/player.png';

// Sounds
let sScore = new Audio();
sScore.src = "resource/snd_time.wav";

//------------------------------- Load textures & sound -----------------------------------//
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------- Create classes --------------------------------------//

// Create a rectangle class
class Rect {
    constructor(x, y, w, h) {
        this.x = x; 
        this.y = y; 
        this.w = w; 
        this.h = h; 
    }
}

// Create a 'User' class
const user = {

    // Variables
    x : canvas.width * 0.25,      // left side of canvas
    y : canvas.height * 0.50,     // -100 the height of paddle
    w : 24,
    h : 24,
    width : 24,
    height : 24,
    alive : true,
    lives : 10,
    color : "WHITE",

    // Movement
    moveLeft : false,
    moveRight : false,
    moveUp : false,
    moveDown : false,
    moving : false,
    vX : 0.0,
    vY : 0.0,
    vMax : 12,
    speed : 6,

    // Update the user
    Update: function () {
        // User movement
        if (this.moveLeft && !this.attack) {
            this.vX -= this.speed;
            this.moving = true;
        }
        if (this.moveRight && !this.attack) {
            this.vX += this.speed;
            this.moving = true;
        }
        if (this.moveUp && !this.attack) {
            this.vY -= this.speed;
            this.moving = true;
        }
        if (this.moveDown && !this.attack) {
            this.vY += this.speed;
            this.moving = true;
        }

        // User not moving in X position
        if (!this.moveleft && !this.moveright) {
            this.vX = this.vX - this.vX * 0.2;
        }

        // User not moving in Y position
        if (!this.moveup && !this.movedown) {
            this.vY = this.vY - this.vY * 0.2;
        }
        
        // User not moving at all
        if (!this.moveUp && !this.moveDown && !this.moveLeft && !this.moveRight) {
            this.moving = false;
        }

        // Movement max
        if (this.vX > this.vMax) {
            this.vX = this.vMax;
        }
        if (this.vX < -this.vMax) {
            this.vX = -this.vMax;
        }
        if (this.vY > this.vMax) {
            this.vY = this.vMax;
        }
        if (this.vY < -this.vMax) {
            this.vY = -this.vMax;
        }

        // Movement
        this.x += this.vX;
        this.y += this.vY;

        // Movement decay
        this.vX = this.vX - this.vX * 0.7;
        this.vY = this.vY - this.vY * 0.7;

        // User level boundaries
        if(this.x < 0 ){
            this.x = 0;
        }
        if(this.y < 0 ){
            this.y = 0;
        }
        if(this.x+this.w > canvas.width ){
            this.x = canvas.width-this.w;
        }
        if(this.y+this.h > canvas.height){
            this.y = canvas.height-this.h;
        }
    }

}   // end User class

//----------------------------------- Create classes --------------------------------------//
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------------- Functions -----------------------------------------//

// Create a function to check collision between 2 objects
function checkCollision( x,  y,  w,  h,  x2,  y2,  w2,  h2) {
	var collide = false;

	if (x+w > x2 && x < x2 + w2 && 
        y+h > y2 && y < y2 + h2) {
		collide = true;
	}

	return collide;
}

// Create a function to draw a rectangle
function drawRect(x, y, w, h, color)
{
    // Set color
    ctx.fillStyle = color;

    // Render the rectangle
    ctx.fillRect(x, y, w, h);
}

// Create a function to draw text
function drawText(text,x,y, alignment)
{
    // Set alignment
    if (alignment == "center") {
        ctx.textAlign = "center";
    }

    // Set fill color
    ctx.fillStyle = "#FFF";

    // Set font size and font
    ctx.font = "75px fantasy";

    // Render the text
    ctx.fillText(text, x, y);
}

// Create a function to render an image
function RenderImg(img, x, y, w, h)
{
    // Render the image
    ctx.drawImage(img, x, y, w, h);
}

// Reset the game
function resetGame(){
    user.x = canvas.width * 0.25;
    user.y = canvas.height * 0.50;
}

//------------------------------------- Functions -----------------------------------------//
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------- User controls ---------------------------------------//

// Keyboard press down events
document.addEventListener('keydown', (event)=> {
    if (event.key == "a") {
         user.moveLeft = true;
    }
    if (event.key == "d") {
         user.moveRight = true;
    }
    if (event.key == "w") {
         user.moveUp = true;
    }
    if (event.key == "s") {
         user.moveDown = true;
    }

    // If Spacebar pressed
    if (event.key == " ") {
         if (gameover) {
            gameover = false;
            user.lives = 10;
            resetGame();
         }
    }
 });
 
// Keyboard press up events
document.addEventListener('keyup', (event) => {
    if (event.key == "a") {
        user.moveLeft = false;
    }
    if (event.key == "d") {
        user.moveRight = false;
    }
    if (event.key == "w") {
        user.moveUp = false;
    }
    if (event.key == "s") {
        user.moveDown = false;
    }
});

//----------------------------------- User controls ---------------------------------------//
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
//---------------------------------- Update everything ------------------------------------//
// Update every frame
function UpdateAll()
{
    // If not game over, continue game
    if (!gameover)
    {
        // Update the User
        user.Update();
    }
}

//---------------------------------- Update everything ------------------------------------//
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
//---------------------------------- Render everything ------------------------------------//

// Function that does all the drawing
function RenderAll(){
    
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    // Render the User
    RenderImg(gPlayer, user.x, user.y, user.w, user.h);

    //-- Draw UI Text ---//
    {
        // Set text position for number of lives
        let textX = canvas.width * 0.50;
        let textY = canvas.height * 0.15;

        // Render the text for number of lives
        drawText(user.lives, textX, textY);

        // If game over, draw game over screen
        if (gameover) {
            
            // If use has no more lives
            if (user.lives <= 0) {

                // Render text
                drawText("You ran out of lives!", canvas.width * 0.50, canvas.height * 0.75, "center");
            }

            // Render text
            drawText("Press 'Spacebar' to restart game.", canvas.width * 0.50, canvas.height * 0.90, "center");
        }
    }
}

//---------------------------------- Render everything ------------------------------------//
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// Main function
function game(){
    UpdateAll();
    RenderAll();
}

// number of frames per second
let framePerSecond = 60;

// call the game function 50 times every 1 Sec
let loop = setInterval(game,1000/framePerSecond);


