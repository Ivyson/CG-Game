// Global Variables
let gl = null;
let shaderProgram = null;
let cubeVertexPositionBuffer = null;
let cubeVertexTextureCoordBuffer = null;
let cubeVertexIndexBuffer = null;
let introDelay = false;

// Global transformations parameters
let globalTz = -30.0;
let globalXX = -270.0;
let globalYY = -1441;

// Translation vector
let tx = 0.0;
const ty = 0.0;
let tz = 0.0;

// Rotation angles in degrees
let angleXX = 0.0;
let angleYY = 0.0;
let angleZZ = 0.0;
// Sounds
const introSound = new Audio("assets/sounds/start.wav");
const eatingSound = new Audio("assets/sounds/eatfood.wav");
const eatGhostSound = new Audio("assets/sounds/pacman_eatghost.wav");
const deathSound = new Audio("assets/sounds/12.wav");
const intermissionSound = new Audio("assets/sounds/pacman_intermission.wav"); // Start up song
const collisionSound = new Audio("assets/sounds/collision_sound.wav"); // When a ghost is eaten by Pac-Man

// Game flags and values
let started = false;
let score = 0;
let gameOver = false;
let gameWin = false;
let superMode = false;
let interval = null;
let paused = false;
let speedCopy = null;
let counter;
let counterCopy = null;
let remainingLives = null;
let animationFrameId = null; // Store animation frame ID for proper halt

let ghosts = []; 
let pacman = null;


function initWebGL(canvas) {
  // Get WebGL context
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    alert("Your Browser does not really support webgl");
    return null;
  }
  // Set viewport to canvas size with black background
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);

  // Enable face culling and depth test
  gl.enable(gl.CULL_FACE); //Cull Face Ensures that the front Face is rendered before he backface
  gl.enable(gl.DEPTH_TEST);

  
}

function initField() {
  // Clear portals and ghosts arrays
  portals = [];
  ghosts = [];
  deadGhosts = [];

  // Compute structure
  const createdField = createFieldStructure(field_structure);
  const height = createdField.length;
  const width = createdField[0].length;

  // Adjust field position (center in 0,0)
  tx = width / 2;
  tz = height / 2;

  // Init field attributes
  field.init(createdField, height, width);

  // Compute all possible movements
  computePossibleMoves(field_structure, field.structure);
  // Create pacman and render it in a random position
  pacman = new CharacterConstructor("Pac");
  const pacCoords = randomCoordinates();
  pacman.init(pacCoords["x"], pacCoords["z"]);
  // Eat the food under him
  pacman.currentBlock.type = "";

  // Create ghosts and render them in random positions
  for (let i = 1; i <= 4; i++) {
    if(gameWin) break;
    const ghost = new CharacterConstructor(`G${i}`);
    const coords = randomCoordinatesGhost();
    ghost.init(coords["x"], coords["z"]);
    ghosts.push(ghost);
  }
}

function endGame(won, sound) {
  // Halt game logic completely
  gameOver = true;
  gameWin = won;
  
  // Cancel animation frame to stop rendering
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  // Clear any active intervals
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }
  
  // Stop all characters
  pacman.updateDirection(0, 0, pacman.key);
  ghosts.map((ghost) => ghost.updateDirection(0, 0, ghost.key));
  ghosts = [];

  // Update page data board
  const result = won ? "🎉 YOU WON! 🎉" : "💀 GAME OVER 💀";
  document.getElementById("result").innerHTML = `${result}<br>Final Score: ${score}`;
  document.getElementById("score").innerHTML = "";
  document.getElementById("remainingLives").innerHTML = "";
  document.getElementById("restart").style.display = "block";

  // Play death or winning sound
  sound.play();
}



function restartGame() {
  score = 0;
  remainingFood = 0;
  remainingLives = 1;

  // Cancel any ongoing animation frame
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  // Restart game infos and super mode timer, if set
  clearInterval(interval);
  document.getElementById("super-mode").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("restart").style.display = "none";

  // Start game rendering
  initField();
  // Playing intro sound first
  introSound.play();
  // Update game state
  gameOver = false;
  gameWin = false;
  superMode = false;
  paused = false;
  speedCopy = null;
  counterCopy = null;
  introDelay = false; // Reset intro delay for new game
  
  // Restart the game loop
  tick();
}

function enableSuperModeEnv() {
    // Enable super mode timer
    interval = setInterval(function () {
        counter--; // Keeps track of how
        if (counter === 0) {
            superMode = false;

            // Respawn dead ghosts
            if (deadGhosts.length > 0) {
                ghosts.push(...deadGhosts);
                ghosts.sort((a, b) => a.id.localeCompare(b.id));
                deadGhosts = [];
            }

            document.getElementById('super-mode').innerHTML = "";
            clearInterval(interval);

        } else
            document.getElementById('super-mode').innerHTML = "SUPER MODE ending in " + counter + " seconds";
    }, 1000);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function tick() {
  // Stop requesting frames if game is over
  if (gameOver) {
    return;
  }
  
  animationFrameId = requestAnimationFrame(tick); // Store frame ID for cancellation
  
  // Render the viewport
  drawScene(); // Async function ensures instructions are run sequentially
  if(!introDelay){
    await sleep(5000); // Initial pause at start time
    introDelay = true;
  }
  // Compute new pacman move
  if(!paused){ // Only move characters if the game is not paused
    movePacman();
     // Compute new ghost moves
    ghosts.forEach((ghost) => moveGhost(ghost));
  }
}

function setEventListeners() {
  let moving = false;
  let xPos = 0;
  let yPos = 0;

  // Handle rotation with mouse movement when pressed
  document.addEventListener('mousedown', event => {
      xPos = event.pageX;
      yPos = event.pageY;
      moving = true;
  });

  document.addEventListener('mousemove', event => {
      if (moving) {
          globalYY -= (xPos - event.pageX) * 0.01;
          globalXX -= (yPos - event.pageY) * 0.01;
          drawScene();
      }
  });

  document.addEventListener('mouseup', () => moving = false);

  // Pacman Movement
  document.addEventListener('wheel', event => {
    globalTz += event.deltaY > 0 ? 1 : -1;
    drawScene();
});
  document.addEventListener("keydown", (event) => {
    // Getting the pressed key
    let key = event.keyCode;

    // Disable movements when game over
    if (gameOver) key = -1;

    switch (key) {
      // Enter key
      case 13:
        if (!started) {
          setGameScreen();
          removeImage();
        } else pauseOrContinuousGame();
        break;
      // Left
      case 37://I need to implement the rotation matrix according such that Pacmanturns to the right 
        pacman.updateDirection(-1, 0, key); //-1 Is for changing direction to 
        break;
      // Up
      case 38: //Pacman needs to look up 
        pacman.updateDirection(0, -1, key); //-1
        break;
      // Right
      case 39: //Pacman Needs to look to the right
        pacman.updateDirection(1, 0, key);
        break;
      // Down
      case 40: //Pacman needs to look down
        pacman.updateDirection(0, 1, key);
        break;
    }
  });
}

function removeImage() {
  let image = document.querySelector("img");
  image.style.display = "none";
}

function setGameScreen() {
  // Game is running
  started = true;
  remainingLives = 1;
  // Set game screen
  document.querySelector("#welcome-screen").style.display = "none";
  document.querySelector("#game").style.display = "block";

  // Start game rendering
  initField();
  // Play intro sound
  introSound.play();
  // Start models animation and movements
  tick();
}

function pauseOrContinuousGame() {
  if (paused) {
    field.speed = 0.25;
    if (superMode) {
      counter = counterCopy;
      enableSuperModeEnv();
    }
    paused = false;
  } else {
    field.speed = 0;
    if (superMode) {
      counterCopy = counter;
      clearInterval(interval);
      interval = null;
    }
    paused = true;
  }
}

function initCanvas() {
  let canvas = document.querySelector('canvas');
  initWebGL(canvas);
  shaderProgram = programs(gl);
}

function runWebGL() {
  document.querySelector("#remainingLives").innerHTML = "Remaining Lives : " + remainingLives;
  initCanvas();
  setEventListeners();
  initCubeBuffer();
  initTextures();
}

window.onload = runWebGL; //removed Parentheses which causes the webgl pipeline to start immediately?
