// Sprite Margins 
// Render bugs 20 pixles up so they appear more central
const enemyYMargin = -20;
// Render player 20 pixels up
const playerXMargin = 0;
const playerYMargin = -20;
// Enemies class
class Enemy {
    constructor(x = 0, y = 0, speed = 30, bugnumber = 0) {
        this.sprite = 'images/enemy-bug.png';
        this.x = x;
        this.y = y;
        this.bugnumber = bugnumber;
        this.speed = speed;
    }
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        if (this.x >= canvasWidth)
            this.x = 0;
        this.x += this.speed * dt;
    }
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y + enemyYMargin);
    }

    // Get current position (in terms of tiles) of enemy


    // Returns tiles object containing dual location of an enemy
    getCurrentTile() {
        // Bug tile number 
        // Take bug.x / 101 reduce it to 1 decimal point
        // if floor == 0, first cell
        // Else these rules
        // if floor == ceil , single cell
        // if floor != ceil, double cell
        let num = (this.x / 101).toFixed(1);
        let tiles = {};
        let floor = Math.floor(num);
        let ceil = Math.ceil(num);
        if (floor == 0)
            tiles = {
                'first': 0,
                'second': 0
            };
        else
            tiles = {
                'first': floor,
                'second': ceil
            }

        tiles['first'] += Math.floor((this.y - enemyYMargin) / tileHeight) * numCols;
        tiles['second'] += Math.floor((this.y - enemyYMargin) / tileHeight) * numCols;
        return tiles;

    }
}



// Player class
class Player {
    constructor(x = 0, y = 0) {
        this.sprite = 'images/char-boy.png';
        this.x = x;
        this.y = y;
        this.score = 0;
    }

    // Update player's position and monitor collisions with enemies
    update(dx = 0, dy = 0) {
        // Check for bounds 
        if (this.x + dx < 0 || this.x + dx > (numCols - 1) * tileWidth || this.y + dy < -11 || this.y + dy > numCols * tileHeight) {
            return
        } else {
            this.x += dx;
            this.y += dy;
            //tileno.textContent = `x: ${this.x} and y: ${this.y} \n Tile number : ${(Math.floor(this.y/83) * 5 + Math.floor((Math.floor(this.x)+1)/83))+1 }`
            //tileno.textContent = `Curent tile is ${this.getCurrentTile()}`;
        }
    }

    // Get current position (in terms of tiles) of player
    getCurrentTile() {
        // If players y's position is 0, it means it have reached water 
        // Tile number y = position/tileHeight (1..n)
        // Tile number x = position/tileWidth (0..n)
        // Final position y_pos * no_of_cols + x
        if (this.y <= 0) return -1;
        else
            return Math.floor((this.y - playerYMargin) / tileHeight) * numCols + Math.floor(Math.floor(this.x) / tileWidth);
    }

    render() {
        // Draw Rectangle
        ctx.strokeStyle = "black";
        ctx.fillStyle = "rgba(255, 225, 255, 0.67)";
        roundRect(ctx, this.x + 10, this.y - 50, 80, 80, 20, true);
        // Style it again
        ctx.strokeStyle = "#0f0";
        ctx.fillStyle = "black";
        // Text styling
        ctx.font = "48px Verdana";
        ctx.textAlign = "center";

        ctx.drawImage(Resources.get(this.sprite), this.x + playerXMargin, this.y + enemyYMargin)
        ctx.fillText(this.score, this.x + 50, this.y + 10);
    }

    handleInput(keyCode) {
        switch (keyCode) {
            case 'up':
                {
                    this.update(0, -1 * tileHeight);
                    break;
                }

            case 'down':
                {
                    this.update(0, tileHeight);
                    break;
                }

            case 'left':
                {
                    this.update(-1 * tileWidth, 0);
                    break;
                }

            case 'right':
                {
                    this.update(tileWidth, 0);
                    break;
                }

        }
    }

    // Respawns player in the same column, last row with a delay specified by timeOut
    respawn(timeOut = 100, incrementScore = true, resetScore = false) {
        setTimeout(() => this.y = canvasWidth - tileWidth, timeOut);
        if (resetScore)
            this.score = 0;
        else {
            if (incrementScore)
                this.score++;
            else
                this.score--;
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
for (let i = 0, row = 1; i < numEnemies; i++) {
    // Place enemies only on paved tiles
    if (row >= 4) row = 1;
    allEnemies.push(
        new Enemy(x = getRandomIntInclusive(0, (numRows / 2) * tileWidth), // Place insect on first two tiles of a row 
            y = row * tileHeight,
            speed = getRandomIntInclusive(minSpeed, maxSpeed),
            bugnumber = i)
    );
    row++;
}

let player = new Player(x = 0, y = canvasWidth - tileWidth);

// Random integer inclusive of min and max values
// Thanks https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

// Thanks https://stackoverflow.com/a/3368118/3455743
/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }

}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    // Support both arrows keys and WASD
    var allowedKeys = {
        37: 'left', // ←
        38: 'up', // ↑
        39: 'right', // →
        40: 'down', // ↓
        87: 'up', // W
        65: 'left', // A
        83: 'down', // S
        68: 'right', // D
    };

    player.handleInput(allowedKeys[e.keyCode]);
});