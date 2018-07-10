// Sprite Margins 
// Render bugs 20 pixles up so they appear more central
enemyYMargin = -20;
// Render player 20 pixels right
playerXMargin = 5;
// Enemies class
class Enemy {
    constructor(x=0,y=0,speed=30) {
        this.sprite = 'images/enemy-bug.png';
        this.x = x;
        this.y = y;
        this.speed = speed;
    }
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        if(this.x >= 505)
           this.x = 0;
        this.x += this.speed*dt;
    }
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y + enemyYMargin);
    }
}



// Player class
class Player {
    constructor(x=0,y=0){
        this.sprite = 'images/char-boy.png';
        this.x = x;
        this.y = y;
    }

    // Update player's position and monitor collisions with enemies
    update(dx=0,dy=0){
        // Check for bounds 
        if(this.x + dx < 0 || this.x + dx > 4*101 || this.y + dy < 0 || this.y + dy > 5*83)
           {

           }
        else
        
        {this.x += dx;
        this.y += dy;
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite),this.x + playerXMargin,this.y - 20)
    }

    handleInput(keyCode)
    {
        switch(keyCode){
            case 'up' :{
                    this.update(0,-1*83);
                    break;
            }

            case 'down' :{
                    this.update(0,83);
                    break;
            }

            case 'left' :{
                    this.update(-1*101,0);
                    break;
            }

            case 'right' :{
                    this.update(101,0);
                    break;
            }

        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let numEnemies = 6;
let allEnemies = [];
for(let i=0,row=1;i<numEnemies;i++){
    // Place enemies only on paved tiles
    if(row >= 4) row = 1;
    allEnemies.push(
        new Enemy(x=getRandomIntInclusive(0,2*101),
            y=row*83,
            speed = getRandomIntInclusive(30,100))
    );
    row++;
}

let player = new Player(x=0,y=0);

// Random integer inclusive of min and max values
// Thanks https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    // Support both arrows keys and WASD
    var allowedKeys = {
        37: 'left',  // ←
        38: 'up',    // ↑
        39: 'right', // →
        40: 'down',  // ↓
        87: 'up',    // W
        65: 'left',  // A
        83: 'down', // S
        68: 'right',  // D
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
