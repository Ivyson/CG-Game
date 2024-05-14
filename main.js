// Global Variables
let gl = null;
let shaderProgram = null;
let cubeVertexPositionBuffer = null;
let cubeVertexTextureCoordBuffer = null;
let cubeVertexIndexBuffer = null;
let cubeVertexNormalBuffer = null;

// Global transformations parameters
let globalTz = -30.0;
let globalXX = -270.0;
let globalYY = -1441;

let vsShader;
let fsShader;

// Translation vector
let tx = 0.0;
const ty = 0.0;
let tz = 0.0;

// Rotation angles in degrees
const angleXX = 0.0;
const angleYY = 0.0;
const angleZZ = 0.0;

// Sounds
const introSound = new Audio("assets/sounds/start.wav");
const eatingSound = new Audio("assets/sounds/eatfood.wav");
const eatGhostSound = new Audio("assets/sounds/pacman_eatghost.wav");
const deathSound = new Audio("assets/sounds/12.wav");
const intermissionSound = new Audio("assets/sounds/pacman_intermission.wav"); //Start up song
const collisionSound = new Audio("assets/sounds/collision_sound.wav"); //When a ghost is being eaten  by Pac man

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


function initWebGL(canvas) {
  // Get WebGL context
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  // Set viewport to canvas size with black background
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);

  // Enable face culling and depth test
  gl.enable(gl.CULL_FACE); //Cull Face Ensures that the front Face is rendered before he backface
  gl.enable(gl.DEPTH_TEST);

  if (!gl) {
    alert("Your Browser does not really support webgl");
  }
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
    const ghost = new CharacterConstructor(`G${i}`);
    const coords = randomCoordinatesGhost();
    ghost.init(coords["x"], coords["z"]);
    ghosts.push(ghost);
  }
}

function endGame(won, sound) {
  // Disable keyboard movements and stop pacman
  gameOver = true;
  gameWin = won;
  pacman.updateDirection(0, 0, pacman.key);

  // Disable ghost movements and clear ghosts array
  ghosts.map((ghost) => ghost.updateDirection(0, 0, ghost.key));
  ghosts = [];

  // Update page Data board
  const result = won ? "YOU WON." : "GAME OVER.";  //Terenary Operator, just like if statement
  document.getElementById("result").innerHTML = `${result} Score: ${score}`;
  document.getElementById("score").innerHTML = "";
  document.getElementById("remainingLives").innerHTML = "";
  document.getElementById("restart").style.display = "block";

  // Play death or winning sound
  sound.play();
}

function restartGame() {
  // Restart game mode if the game has already started
  // if(started){
    console.log("Restarting Game....");
  score = 0;
  remainingFood = 0;
  remainingLives = 3;

  // Restart game infos and super mode timer, if set
  clearInterval(interval);
  document.getElementById("super-mode").innerHTML = "";
  document.getElementById("result").innerHTML = "";

  // Start game rendering
  initField();

  // Playing intro sound first
  introSound.play();

  // Update game state
  gameOver = false;
  gameWin = false;
  superMode = false;
  // }
  // else{
    // console.log("Cannot restart if the game hasn't started");
  // }
  
}

function enableSuperModeEnv() {
    // Enable super mode timer
    interval = setInterval(function () {
        counter--;
        if (counter === 0) {
            superMode = false;

            // Respawn dead ghosts
            for (let i = 0; i < deadGhosts.length; i++)
            ghosts.push(deadGhosts[i]);
            ghosts = ghosts.concat(deadGhosts);
            deadGhosts = [];

            document.getElementById('super-mode').innerHTML = "";
            clearInterval(interval);

        } else
            document.getElementById('super-mode').innerHTML = "SUPER MODE ending in " + counter + " seconds";
    }, 1000);
}


async function tick() {
  requestAnimFrame(tick);

  // Render the viewport
  drawScene(); //the async functions ensures that the instructionsin here are run in order and they wait for each other to be done instead of being pipelined..
  await sleep(5000);

  // Compute new pacman move
  movePacman();
  // Compute new ghost moves
  ghosts.map((ghost) => moveGhost(ghost));
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function removeImage() {
  let image = document.querySelector("img");
  image.style.display = "none";
}

function setGameScreen() {
  // Game is running
  started = true;
  remainingLives = 5;
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
    field.speed = speedCopy;
    if (superMode) {
      counter = counterCopy;
      enableSuperModeEnv();
    }
    paused = false;
  } else {
    speedCopy = field.speed;
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

async function fetchShaders() {
  const responseVs = await fetch("src/vsShader.shader");
  if (!responseVs.ok) {
    throw new Error("No vs Shader Found");
  }
  vsShader = await responseVs.text();
  console.log(vsShader, "Is Vs Shader");

  const responseFs = await fetch("src/fsShader.shader");
  if (!responseFs.ok) {
    throw new Error("No fs Shader Found");
  }
  fsShader = await responseFs.text();
  console.log(fsShader, "Is Fragment");
  document.getElementById("shader-fs").innerHTML = fsShader;
  document.getElementById("shader-vs").innerHTML = vsShader;
  console.log(
    document.getElementById("shader-fs").innerHTML,
    "Inner html thing"
  );
  console.log(
    document.getElementById("shader-vs").innerHTML,
    "Inner html thing2"
  );
  initCanvas();
  setEventListeners();
  initCubeBuffer();
  initTextures();
}

function runWebGL() {
  document.querySelector("#remainingLives").innerHTML =
    "Remaining Lives : " + remainingLives;
  fetchShaders();
}

window.onload = runWebGL();
