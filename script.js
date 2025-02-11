const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
let spaceship = { x: 375, y: 500, width: 50, height: 50, speed: 10 };
let bullets = [];
let aliens = [];
let score = 0;
let gameOver = false;

// Load assets
const spaceshipImg = new Image();
spaceshipImg.src = 'assets/spaceship.png';

const alienImg = new Image();
alienImg.src = 'assets/alien.png';

const explosionImg = new Image();
explosionImg.src = 'assets/explosion.png';

// Play background music
const backgroundMusic = document.getElementById('background-music');
backgroundMusic.play();

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && spaceship.x > 0) spaceship.x -= spaceship.speed;
    if (e.key === 'ArrowRight' && spaceship.x < canvas.width - spaceship.width) spaceship.x += spaceship.speed;
    if (e.key === ' ') shootBullet(); // Spacebar to shoot
});

function shootBullet() {
    bullets.push({ x: spaceship.x + spaceship.width / 2 - 2.5, y: spaceship.y, width: 5, height: 10, speed: 7 });
}

function drawSpaceship() {
    ctx.drawImage(spaceshipImg, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Move bullet upwards
        bullet.y -= bullet.speed;

        // Remove bullet if it goes off-screen
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

function drawAliens() {
    aliens.forEach((alien, index) => {
        ctx.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

        // Move alien downwards
        alien.y += alien.speed;

        // Check for collision with spaceship
        if (
            alien.x < spaceship.x + spaceship.width &&
            alien.x + alien.width > spaceship.x &&
            alien.y < spaceship.y + spaceship.height &&
            alien.y + alien.height > spaceship.y
        ) {
            gameOver = true;
        }

        // Remove alien if it goes off-screen
        if (alien.y > canvas.height) aliens.splice(index, 1);
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        aliens.forEach((alien, aIndex) => {
            if (
                bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.y + bullet.height > alien.y
            ) {
                // Explosion effect
                ctx.drawImage(explosionImg, alien.x, alien.y, alien.width, alien.height);

                // Remove bullet and alien
                bullets.splice(bIndex, 1);
                aliens.splice(aIndex, 1);

                // Increase score
                score += 10;
                document.getElementById('score').textContent = score;
            }
        });
    });
}

function spawnAliens() {
    setInterval(() => {
        const x = Math.random() * (canvas.width - 50);
        aliens.push({ x, y: 0, width: 50, height: 50, speed: 2 });
    }, 1000);
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawSpaceship();
    drawBullets();
    drawAliens();

    // Check collisions
    checkCollisions();

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Start the game
spawnAliens();
gameLoop();