// Canvas
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

canvas.width = 768
canvas.height = 512

// Player image
const playerImage = new Image()
playerImage.src = "../img/player.png"

// Functions

function flipInt(n){
    var digit, result = 0

    while( n ){
        digit = n % 10
        result = (result * 10) + digit 
        n = n/10|0
    }  
  
    return result
}

// Sprite class
class Sprite {
    constructor({position, image, speed, acceleration, deacceleration}) {
        this.position = position
        this.image = image
        this.speed = speed
        this.velocity_x = 0
        this.velocity_y = 0
        this.acceleration = acceleration
        this.deacceleration = deacceleration
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y)
    }
}

// Player instance
const player = new Sprite({
    position: {
        x: canvas.width / 2 - playerImage.width / 2,
        y: canvas.height / 2 - playerImage.width / 2
    },
    image: playerImage,
    speed: 10,
    acceleration: 1.1,
    deacceleration: 0.8
})

// Input values
const input = {
    x: 0,
    y: 0,
    spacebar: false
}

// Delta time setup
const perfectFrameTime = 1000 / 60;
let deltaTime = 0; 
let lastTimestamp = 0;

// Start the game loop
function start() {
    requestAnimationFrame(update);
}

// Game loop
function update(timestamp) {
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;

    if (input.x !== 0 || input.y !== 0) {
        if ((player.velocity_x < player.speed) && (player.velocity_x > flipInt(player.speed))) {
            player.velocity_x += player.acceleration * input.x
        } else {
            player.velocity_x = player.speed * input.x
        }

        if ((player.velocity_y < player.speed) && (player.velocity_y > flipInt(player.speed))) {
            player.velocity_y += player.acceleration * input.y
        } else {
            player.velocity_y = player.speed * input.y
        }
    } else {
        player.velocity_x *= player.deacceleration
        player.velocity_y *= player.deacceleration
    }
    
    player.position.x += player.velocity_x * deltaTime
    player.position.y += player.velocity_y * deltaTime
    
    if (player.position.x < 0) {
        player.position.x = 0
        player.velocity_x = 0
    }
    if (player.position.x > canvas.width - player.image.width) {
        player.position.x = canvas.width - player.image.width;
        player.velocity_x = 0
    }
    if (player.position.y < 0) {
        player.position.y = 0
        player.velocity_y = 0
    }
    if (player.position.y > canvas.height - player.image.height) {
        player.position.y = canvas.height - player.image.height;
        player.velocity_y = 0
    }

    ctx.fillStyle = "lightgrey"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
}

start();

// Handle inputs
const pressedKeys = new Set();
window.addEventListener("keydown", (e) => {
    pressedKeys.add(e.key);
    switch (e.key) {
        case "w":
            input.y = -1;
            break
        case "a":
            input.x = -1
            break
        case "s":
            input.y = 1
            break
        case "d":
            input.x = 1
            break
        case " ":
            input.spacebar = true
            break
    }
})

window.addEventListener("keyup", (e) => {
    pressedKeys.delete(e.key);

    input.x = pressedKeys.has("d") ? 1 : pressedKeys.has("a") ? -1 : 0;
    input.y = pressedKeys.has("s") ? 1 : pressedKeys.has("w") ? -1 : 0;

    input.spacebar = false
});