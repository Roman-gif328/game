const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 50,
    size: 30,
    color: 'green',
    speed: 5
};

const enemy = {
    x: 300,
    y: 300,
    size: 30,
    color: 'blue',
    dx: 2,
    dy: 2

};
    const enemy2 = {
    x: 100,
    y: 100,
    size: 30,
    color: 'blue',
    dx: 2.5,
    dy: 2.5
};



let score = 0;
let lives = 3;
let gameOver = false;

function drawBox(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clearCanvas();
    drawBox(player.x, player.y, player.size, player.color);
    drawBox(enemy.x, enemy.y, enemy.size, enemy.color);
    drawBox(enemy2.x, enemy2.y, enemy2.size, enemy2.color); // Nuevo enemigo
}

function updateEnemy() {
    // Movimiento del primer enemigo
    enemy.x += enemy.dx;
    enemy.y += enemy.dy;

    if (enemy.x < 0 || enemy.x + enemy.size > canvas.width) {
        enemy.dx *= -1;
    }

    if (enemy.y < 0 || enemy.y + enemy.size > canvas.height) {
        enemy.dy *= -1;
    }

    // Movimiento del segundo enemigo
    enemy2.x += enemy2.dx;
    enemy2.y += enemy2.dy;

    if (enemy2.x < 0 || enemy2.x + enemy2.size > canvas.width) {
        enemy2.dx *= -1;
    }

    if (enemy2.y < 0 || enemy2.y + enemy2.size > canvas.height) {
        enemy2.dy *= -1;
    }
}

function checkCollision() {
    const enemies = [enemy, enemy2]; // Lista de enemigos

    enemies.forEach((e) => {
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.size) {
            score++;
            document.getElementById('score').textContent = score;

            // Evitar que el enemigo reaparezca sobre el jugador
            do {
                e.x = Math.random() * (canvas.width - e.size);
                e.y = Math.random() * (canvas.height - e.size);
            } while (Math.abs(player.x - e.x) < player.size && Math.abs(player.y - e.y) < player.size);

            e.dx *= 1.05;
            e.dy *= 1.05;
        }
    });
}
function loseLife() {
    lives--;
    document.getElementById('lives').textContent = lives;

    if (lives <= 0) {
        document.getElementById('game-over').style.display = 'block';
        gameOver = true;
        setTimeout(resetGame, 3000);
    }
}

function update() {
    if (gameOver) return;

    draw();
    updateEnemy();
    checkCollision();

    if (
        player.x < 0 || player.x + player.size > canvas.width ||
        player.y < 0 || player.y + player.size > canvas.height
    ) {
        loseLife();
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
    }

    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    switch (e.key) {
        case 'ArrowUp': player.y -= player.speed; break;
        case 'ArrowDown': player.y += player.speed; break;
        case 'ArrowLeft': player.x -= player.speed; break;
        case 'ArrowRight': player.x += player.speed; break;
    }
});

function resetGame() {
    score = 0;
    lives = 3;
    player.x = 50;
    player.y = 50;
    enemy.x = 300;
    enemy.y = 300;
    enemy.dx = 2;
    enemy.dy = 2;
    gameOver = false;

    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('game-over').style.display = 'none';

    update();
}

update();