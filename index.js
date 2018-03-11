// Get a reference to the canvas element
var canvas = document.getElementById("canvas");
// Get a reference to the drawing context
var ctx = canvas.getContext("2d");

// We use a list of objects to represent the position of snake parts
var snake = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
  { x: 10, y: 13 },
  { x: 10, y: 14 },
  { x: 10, y: 15 }
];

// Position of the food
var food = {
  x: (Math.random() * 40) | 0,
  y: (Math.random() * 40) | 0
};

// Redraw the frame 
function drawFrame() {
  // Clear the canvas
  ctx.clearRect(0, 0, 400, 400);

  // Change the color to green and draw the food
  ctx.fillStyle = "#11cc11";
  ctx.fillRect(food.x * 10, food.y * 10, 9, 9);


  // Change the color to black and draw the snake
  ctx.fillStyle = "#000000";
  snake.forEach(p => { // forEach loops over the snake parts
    ctx.fillRect(p.x * 10, p.y * 10, 9, 9);
  });  
}

// Set this to false to stop the game
var gameRunning = true;

// All possible directions
var Directions = {
  UP: "U",
  LEFT: "L",
  DOWN: "D",
  RIGHT: "R"
};

// Real direction the snake is going
var snakeDir = Directions.UP;
// Direction the user pressed
var nextDir = snakeDir;

// Listen for keyboard press and grab the arrow keys in nextDir
window.addEventListener("keydown", function(event) {
  var k = event.key;

  if (k === "ArrowUp") nextDir = "U";
  else if (k === "ArrowDown") nextDir = "D";
  else if (k === "ArrowLeft") nextDir = "L";
  else if (k === "ArrowRight") nextDir = "R";
});

// Performs the game logic (Move snake, check if dead...)
function gameLogic() {

  // Check if pressed direction is opposite of current direction
  var isReverseDir =
    (nextDir === Directions.UP && snakeDir === Directions.DOWN) ||
    (nextDir === Directions.DOWN && snakeDir === Directions.UP) ||
    (nextDir === Directions.RIGHT && snakeDir === Directions.LEFT) ||
    (nextDir === Directions.LEFT && snakeDir === Directions.RIGHT);

  // Change snake dir only if pressed direction is not reverse
  if (!isReverseDir) {
    snakeDir = nextDir;
  }

  var oldHead = snake[0]; // Get the position of the head
  
  // Position new head depending on snake direction
  if (snakeDir === Directions.UP)
    var newHead = { x: oldHead.x, y: oldHead.y - 1 };
  else if (snakeDir === Directions.DOWN)
    var newHead = { x: oldHead.x, y: oldHead.y + 1 };
  else if (snakeDir === Directions.LEFT)
    var newHead = { x: oldHead.x - 1, y: oldHead.y };
  else if (snakeDir === Directions.RIGHT)
    var newHead = { x: oldHead.x + 1, y: oldHead.y };

  // Add the new head to the front of snake 
  snake.unshift(newHead)
  
  // Check if food is eaten
  var ateFood = newHead.x === food.x && newHead.y === food.y;

  if (ateFood) { // If the food is eaten then reposition food randomly
    food = {
      x: (Math.random() * 40) | 0,
      y: (Math.random() * 40) | 0
    };
  } else { 
    // Remove the last part of the snake - this moves the snake
    // if food is eaten then we skip this part. This is how the 
    // snake grows.
    snake.pop();
  }

  // Check if snake is dead
  var isDead = false; // initial value
  // Check if newHead is on any other snake part
  for (var i = 1; i < snake.length; i++) {
    if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
      isDead = true;
      break;
    }
  }


  // Check if snake is out of bounds
  if (newHead.x < 0 || newHead.y < 0 || newHead.x >= 40 || newHead.y >= 40) {
    isDead = true;
  }

  // Stop the game if player is dead
  if (isDead) gameRunning = false;
}

// Runs game logic and draws the snake every 100ms
function tick() {
  gameLogic();
  drawFrame();
  
  if (gameRunning) setTimeout(tick, 100);
}
tick(); // Call tick first time

