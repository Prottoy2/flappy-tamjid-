// Selecting HTML elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameMenu = document.getElementById('gameMenu');
const levelMenu = document.getElementById('levelMenu');
const instructionsMenu = document.getElementById('instructionsMenu');
const gameOverScreen = document.getElementById('gameOverScreen');
const startGameBtn = document.getElementById('startGameBtn');
const chooseLevelBtn = document.getElementById('chooseLevelBtn');
const instructionsBtn = document.getElementById('instructionsBtn');
const restartBtn = document.getElementById('restartBtn');
const backBtn = document.getElementById('backBtn');
const levelButtons = document.querySelectorAll('.levelBtn');

let birdY = 250;
let birdSpeedY = 0;
let gravity = 0.25;
let pipeSpeed = 2;
let score = 0;
let pipes = [];
let isGameOver = false;
let pipeGap = 300; // Default pipe gap
let backgroundX = 0;
let frameCount = 0;
let level = 1; // Default game level

// Load images
const backgroundImg = new Image();
const birdImg = new Image();
const pipeTopImg = new Image();
const pipeBottomImg = new Image();

backgroundImg.src = "https://i.postimg.cc/j2bnHpkR/images.jpg";
birdImg.src = "https://i.postimg.cc/PC0hN0r8/flappy-bird-bird.png"; // Bird image
pipeTopImg.src = "https://i.postimg.cc/XJMyn9F7/tutuuut.png"; // Pipe image
pipeBottomImg.src = "https://i.postimg.cc/DZs3BjwB/352623976f385231904afd5cf51772da-removebg-preview.png"; // Pipe image

// Bird properties
const bird = {
    x: 50,
    y: birdY,
    width: 108, // 3 times original width (68)
    height: 78, // 3 times original height (48)
};

// Pipe properties
function createPipe() {
    // Generate random height for the top pipe
    const pipeTopHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 150)) + 50; // Ensure enough height for the gap

    pipes.push({
        x: canvas.width,
        topPipeHeight: pipeTopHeight,   // Height of the top pipe
        bottomPipeY: pipeTopHeight + pipeGap,  // Position of the bottom pipe
        width: 52,   // Standard pipe width
        passed: false,  // Track if bird has passed the pipe (to count score)
    });
}

// Draw background
function drawBackground() {
    ctx.drawImage(backgroundImg, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);
    backgroundX -= 1;
    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }
}

// Draw bird
function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// Draw pipes
function drawPipes() {
    pipes.forEach(pipe => {
        const pipeTopY = pipe.topPipeHeight - pipeTopImg.height;
        ctx.drawImage(pipeTopImg, pipe.x, pipeTopY, pipe.width, 400);
        const pipeBottomY = pipe.bottomPipeY;
        ctx.drawImage(pipeBottomImg, pipe.x, pipeBottomY, pipe.width, 400);
    });
}

// Move pipes and check for score
function movePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            score++;
            pipe.passed = true;
        }
    });
    if (pipes.length && pipes[0].x + pipes[0].width < 0) {
        pipes.shift();
    }
}

// Check for collisions
function checkCollision() {
    pipes.forEach(pipe => {
        const pipeTopY = pipe.topPipeHeight - pipeTopImg.height;
        const pipeBottomY = pipe.bottomPipeY;
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width &&
            (bird.y < pipeTopY + 400 || bird.y + bird.height > pipeBottomY)) {
            gameOver();
        }
    });
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver();
    }
}

// Handle game over
function gameOver() {
    isGameOver = true;
    gameOverScreen.style.display = 'block';
    canvas.style.display = 'none';
    document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
    cancelAnimationFrame(animationFrame);
}

// Restart game
function restartGame() {
    birdY = 250;
    bird.y = birdY;
    birdSpeedY = 0;
    score = 0;
    pipes = [];
    isGameOver = false;
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';
    startGame();
}

// Game loop
function gameLoop() {
    drawBackground();
    drawBird();
    drawPipes();
    movePipes();
    checkCollision();
    birdSpeedY += gravity;
    bird.y += birdSpeedY;
    if (frameCount % 100 === 0) {
        createPipe();
    }
    frameCount++;
    if (!isGameOver) {
        animationFrame = requestAnimationFrame(gameLoop);
    }
}

// Start game logic
function startGame() {
    frameCount = 0;
    gravity = 0.25 + (level * 0.05); // Gravity based on level
    pipeSpeed = 2 + (level * 0.5); // Pipe speed based on level
    pipeGap = 150 - (level * 20); // Pipe gap decreases with higher levels
    gameLoop();
}

// Event listeners for keys and buttons
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isGameOver) {
        birdSpeedY = -6;
    }
});

canvas.addEventListener('touchstart', () => {
    if (!isGameOver) {
        birdSpeedY = -6;
    }
});

// Menu interactions
startGameBtn.addEventListener('click', () => {
    gameMenu.style.display = 'none';
    canvas.style.display = 'block';
    startGame();
});

chooseLevelBtn.addEventListener('click', () => {
    gameMenu.style.display = 'none';
    levelMenu.style.display = 'block';
});

instructionsBtn.addEventListener('click', () => {
    gameMenu.style.display = 'none';
    instructionsMenu.style.display = 'block';
});

backBtn.addEventListener('click', () => {
    levelMenu.style.display = 'none';
    instructionsMenu.style.display = 'none';
    gameMenu.style.display = 'block';
});

levelButtons.forEach(button => {
    button.addEventListener('click', () => {
        level = parseInt(button.getAttribute('data-level'));
        levelMenu.style.display = 'none';
        canvas.style.display = 'block';
        startGame();
    });
});

restartBtn.addEventListener('click', restartGame);
