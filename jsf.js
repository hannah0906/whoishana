'use strict'; // Enforce strict mode to catch common coding errors

// Declare and initialize game-related variables
var gameStart = {}, // Element for starting the game
  gameSpeed = {}, // Element for selecting game speed
  gameArea = {}, // Canvas element for the game area
  gameAreaContext = {}, // 2D context of the canvas
  snake = [], // Array to hold the snake's body segments
  gameAreaWidth = 0, // Width of the game area
  gameAreaHeight = 0, // Height of the game area
  cellWidth = 0, // Width of each cell in the game area
  playerScore = 0, // Player's score
  snakeFood = {}, // Object to hold the food's position
  snakeDirection = '', // Current direction of the snake's movement
  speedSize = 0, // Speed of the snake
  timer = {}; // Timer for game updates

// Function to initialize game elements
function initElement() {
  gameStart = document.querySelector('#gameStart'); // Get the game start button element
  gameSpeed = document.querySelector('#gameSpeed'); // Get the game speed input element
  gameArea = document.querySelector('#gameArea'); // Get the game area canvas element

  gameAreaContext = gameArea.getContext('2d'); // Get the 2D context of the game area
  gameAreaWidth = 1200; // Set the game area width
  gameAreaHeight = 350; // Set the game area height
  cellWidth = 20; // Set the width of each cell in the game area
  gameArea.width = gameAreaWidth; // Apply the width to the canvas
  gameArea.height = gameAreaHeight; // Apply the height to the canvas
}

// Function to create food at a random position
function createFood() {
  snakeFood = {
    x: Math.floor(Math.random() * (gameAreaWidth / cellWidth)), // Random x position
    y: Math.floor(Math.random() * (gameAreaHeight / cellWidth)), // Random y position
  };
}

// Function to check if the snake collides with itself
function control(x, y, array) {
  for (var index = 0, length = array.length; index < length; index++) {
    if (array[index].x == x && array[index].y == y) return true; // Collision detected
  }
  return false; // No collision
}

// Function to display the player's score
function writeScore() {
  gameAreaContext.font = '50px times new roman'; // Set font for score display
  gameAreaContext.fillStyle = '#5f6f52'; // Set color for score text
  gameAreaContext.fillText('Score: ' + playerScore, (gameAreaWidth / 2) - 100, gameAreaHeight / 2); // Display score
}

// Function to create a square at the specified position
function createSquare(x, y) {
  gameAreaContext.fillStyle = '#5f6f52'; // Set color for the square
  gameAreaContext.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth); // Draw the square
}

// Function to update the game area
function createGameArea() {
  var snakeX = snake[0].x; // Get the x position of the snake's head
  var snakeY = snake[0].y; // Get the y position of the snake's head

  // Clear the game area
  gameAreaContext.fillStyle = '#f9ebc7';
  gameAreaContext.fillRect(0, 0, gameAreaWidth, gameAreaHeight);

  // Draw the game area border
  gameAreaContext.strokeStyle = '#000000';
  gameAreaContext.strokeRect(0, 0, gameAreaWidth, gameAreaHeight);

  // Update the snake's position based on the current direction
  if (snakeDirection == 'right') {
    snakeX++;
  } else if (snakeDirection == 'left') {
    snakeX--;
  } else if (snakeDirection == 'down') {
    snakeY++;
  } else if (snakeDirection == 'up') {
    snakeY--;
  }

  // Check for collisions with the game area boundaries or the snake itself
  if (
    snakeX < 0 || 
    snakeX >= gameAreaWidth / cellWidth || 
    snakeY < 0 || 
    snakeY >= gameAreaHeight / cellWidth || 
    control(snakeX, snakeY, snake)
  ) {
    writeScore(); // Display the score
    clearInterval(timer); // Stop the game timer
    gameStart.disabled = false; // Enable the start button
    return; // Exit the function
  }

  // Check if the snake has eaten the food
  if (snakeX == snakeFood.x && snakeY == snakeFood.y) {
    var newHead = { x: snakeX, y: snakeY }; // Create a new head for the snake
    playerScore += speedSize; // Increase the score
    createFood(); // Create new food
  } else {
    var newHead = snake.pop(); // Remove the last segment of the snake
    newHead.x = snakeX; // Update the new head's x position
    newHead.y = snakeY; // Update the new head's y position
  }

  snake.unshift(newHead); // Add the new head to the front of the snake

  // Draw the snake
  for (var index = 0, length = snake.length; index < length; index++) {
    createSquare(snake[index].x, snake[index].y);
  }

  // Draw the food
  createSquare(snakeFood.x, snakeFood.y);
}

// Function to start the game
function startGame() {
  snake = []; // Reset the snake array
  snake.push({ x: 0, y: cellWidth / cellWidth }); // Add the initial snake segment

  createFood(); // Create the initial food

  clearInterval(timer); // Clear any existing timers
  timer = setInterval(createGameArea, 500 / speedSize); // Set the game update interval
}

// Function to handle the start game button click event
function onStartGame() {
  this.disabled = true; // Disable the start button

  playerScore = 0; // Reset the player's score
  snakeDirection = 'right'; // Set the initial snake direction
  speedSize = parseInt(gameSpeed.value); // Get the speed from the input

  // Ensure the speed is within the valid range
  if (speedSize > 9) {
    speedSize = 9;
  } else if (speedSize < 0) {
    speedSize = 1;
  }

  startGame(); // Start the game
}

// Function to change the snake's direction based on keyboard input
function changeDirection(e) {
  var keys = e.which; // Get the key code of the pressed key
  if (keys == '40' && snakeDirection != 'up') snakeDirection = 'down'; // Down arrow key
  else if (keys == '39' && snakeDirection != 'left') snakeDirection = 'right'; // Right arrow key
  else if (keys == '38' && snakeDirection != 'down') snakeDirection = 'up'; // Up arrow key
  else if (keys == '37' && snakeDirection != 'right') snakeDirection = 'left'; // Left arrow key
}

// Function to initialize event listeners
function initEvent() {
  gameStart.addEventListener('click', onStartGame); // Add click event listener to the start button
  window.addEventListener('keydown', changeDirection); // Add keydown event listener to the window
}

// Function to initialize the game
function init() {
  initElement(); // Initialize game elements
  initEvent(); // Initialize event listeners
}

// Add event listener for DOM content loaded to initialize the game
window.addEventListener('DOMContentLoaded', init);
