const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


const birdImg = new Image();
birdImg.src = "bird.png";

const pipeImg = new Image();
pipeImg.src = "pipe.png";

const bgImg = new Image();
bgImg.src = "background.png";

// Bird
let bird = {
    x: 50,
    y: 150,
    width: 80,
    height: 80,
    gravity: 0.6,
    lift: -12,
    velocity: 0
};

// Pipes
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false; 


function drawBird() {

    ctx.save();

    ctx.beginPath();
    ctx.arc(
        bird.x + bird.width/2,
        bird.y + bird.height/2,
        bird.width/2,
        0,
        Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    ctx.restore();
}


function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }
}


function createPipe() {
    let topHeight = Math.random() * 380;
    let gap = 280;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - gap,
        width: 50,
        passed: false
    });
}

function drawPipes() {
    ctx.fillStyle = "green";

    pipes.forEach(pipe => {
    ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.top);
    ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);

        pipe.x -= 2;

        // Collision detection
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top ||
            bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            gameOver = true;
        }

    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
    score++;
    pipe.passed = true;
}
    });
    
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText(score, canvas.width/2, 80);
    
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 0.25;   // transparency (0.1 – 0.4 looks good)
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;      // reset opacity

    if (!gameOver) {
        drawBird();
        updateBird();

        if (frame % 90 === 0) {
            createPipe();
        }

        drawPipes();
        drawScore();

        frame++;
    } else {
        drawBird();
        drawScore();

        ctx.font = "30px Arial";
        ctx.fillText("MACHALU! RESTART ", 90, 350);

        ctx.font = "20px Arial";
        ctx.fillText("Tap anywhere to play again ", 90, 300);

    }

    requestAnimationFrame(gameLoop);
}


function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frame = 0;
    gameOver = false;

}


document.addEventListener("keydown", () => {
    if (!gameOver) {
        bird.velocity = bird.lift;
    } else {
        resetGame();
    }
});

document.addEventListener("touchstart", () => {
    if (!gameOver) {
        bird.velocity = bird.lift;
    } else {
        resetGame();
    }
});



gameLoop();


