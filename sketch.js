let t = 0;
let f = 0.4;
let r = 15;
let points = 0;
let timer = 7;
let ball;
let player;
let gameOver = false;
let restartButton;
let highScore = 0;
let level = 1;
let targetPoints = 10;
let gameSpeed = 0.7;
let levelComplete = false;
let nextLevelButton;
let speedIncrease = 0.05;

let colorPairs = [
  ["#FF69B4", "#FFFF00"],
  ["#00CED1", "#FFA500"],
  ["#9370DB", "#32CD32"],
  ["#FFD700", "#800080"],
  ["#00FF7F", "#DC143C"]
];
let currentColorPair;

let star;
let starSize = 30;
let starSpawnInterval = 12 * 60;
let gameStarted = false;

function setup() {
  createCanvas(windowWidth, windowHeight); // Use windowWidth and windowHeight
  frameRate(60);
  colorMode(RGB, 255);
  background(0);

  ball = createVector(random(r, width - r), random(r, height - r));

  restartButton = createButton("Start Game");
  restartButton.position(width / 2 - 75, height / 2 + 100);
  restartButton.size(150, 50);
  restartButton.style("background-color", colorPairs[0][1]);
  restartButton.style("color", colorPairs[0][0]);
  restartButton.style("font-size", "20px");
  restartButton.mousePressed(startGame);
  restartButton.show();

  nextLevelButton = createButton("Next Level");
  nextLevelButton.position(width / 2 - 75, height / 2 + 75);
  nextLevelButton.size(150, 50);
  nextLevelButton.style("background-color", colorPairs[0][1]);
  nextLevelButton.style("color", colorPairs[0][0]);
  nextLevelButton.style("font-size", "20px");
  nextLevelButton.mousePressed(goToNextLevel);
  nextLevelButton.hide();

  currentColorPair = colorPairs[0];
  noLoop();
}

function draw() {
  background(0);

  if (!gameStarted) {
    // Start Screen
    fill(currentColorPair[0]);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("Happy Blob Game", width / 2, height / 2 - 100);

    textSize(20);
    text("Catch the blobs before time runs out!", width / 2, height / 2 - 40);
    text("Click the star for bonus time.", width / 2, height / 2 - 10);
    text("Reach level 5 for a special surprise!", width / 2, height / 2 + 20);

    return;
  }

  t += 0.01 * gameSpeed;
  for (let i = 222; i--; ) {
    let a = 35 + 80 * sin(5 * sin(t) * sin(i * f));
    fill(currentColorPair[0]);
    stroke(currentColorPair[1]);
    arc(350 + 160 * sin(t + i * f), 360 + 160 * cos(t + i * f), a, a, 0, 6.28);
  }

  if (!gameOver && !levelComplete) {
    player = createVector(mouseX, mouseY);
    fill(currentColorPair[0]);
    ellipse(ball.x, ball.y, r * 2);

    if (timer > 0 && points > 0) {
      timer -= (1 / 60) * gameSpeed;
    }

    let len = map(timer, 0, 10, 0, 200);
    rect(15, 70, 20, len);

    if (points >= targetPoints) {
      levelComplete = true;
      nextLevelButton.show();
    }

    if (timer < 0) {
      gameOver = true;
      restartButton.show();
      if (highScore < level) {
        highScore = level;
      }
    }

    if (frameCount % starSpawnInterval === 0 && !star) {
      star = createVector(random(starSize / 2, width - starSize / 2), -starSize);
    }

    if (star) {
      fill("#FFFF00");
      drawStar(star.x, star.y, starSize / 2, starSize);
      star.y += 2;

      if (star.y > height + starSize) {
        star = null;
      }
    }
  }

  if (gameOver) {
    textAlign(CENTER);
    textSize(50);
    fill(currentColorPair[0]);
    text("GAME OVER", width / 2, height / 2 - 25);
  }

  if (levelComplete) {
    fill(currentColorPair[1]);
    rect(width / 2 - 150, height / 2 - 100, 300, 150);
    fill(currentColorPair[0]);
    textAlign(CENTER, CENTER);
    textSize(25);
    text("Level " + (level - 1) + " Completed!", width / 2, height / 2 - 25);
  }

  textSize(20);
  fill(currentColorPair[0]);
  textAlign(LEFT);
  text("Points: " + points, 20, 30);
  text("Level: " + level, 20, 50);
  textAlign(RIGHT);
  text("High Score: " + highScore, width - 20, 30);
}

function mousePressed() {
  if (gameStarted && !gameOver && !levelComplete) {
    let d = p5.Vector.dist(player, ball);
    if (d < r) {
      ball = createVector(random(r, width - r), random(r, height - r));
      points++;
      if (points > 1) {
        timer += 0.5;
      }
    }

    if (star && dist(mouseX, mouseY, star.x, star.y) < starSize / 2) {
      timer = 7;
      star = null;
    }
  }
}

function startGame() {
  gameStarted = true;
  restartButton.hide();
  loop();
}

function restartGame() {
  points = 0;
  timer = 7;
  ball = createVector(random(r, width - r), random(r, height - r));
  gameOver = false;
  level = 1;
  targetPoints = 10;
  levelComplete = false;
  gameSpeed = 0.7;
  currentColorPair = colorPairs[0];
  restartButton.style("background-color", currentColorPair[1]);
  restartButton.style("color", currentColorPair[0]);
  nextLevelButton.style("background-color", currentColorPair[1]);
  nextLevelButton.style("color", currentColorPair[0]);
  star = null;
  starSpawnInterval = 12 * 60;
  loop();
  restartButton.hide();
  nextLevelButton.hide();
}

function goToNextLevel() {
  level++;
  points = 0;
  timer = 7;
  targetPoints += 5;
  levelComplete = false;
  nextLevelButton.hide();
  gameSpeed += speedIncrease;
  currentColorPair = colorPairs[(level - 1) % colorPairs.length];
  restartButton.style("background-color", currentColorPair[1]);
  restartButton.style("color", currentColorPair[0]);
  nextLevelButton.style("background-color", currentColorPair[1]);
  nextLevelButton.style("color", currentColorPair[0]);
  star = null;
  starSpawnInterval = 12 * 60;
}

function drawStar(x, y, radius1, radius2) {
  let angle = TWO_PI / 5;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  restartButton.position(width / 2 - 75, height / 2 + 100);
  nextLevelButton.position(width / 2 - 75, height / 2 + 75);
}
