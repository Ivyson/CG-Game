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
const eatingSound = new Audio("assets/sounds/pacman_chomp.wav");
const eatGhostSound = new Audio("assets/sounds/pacman_eatghost.wav");
const deathSound = new Audio("assets/sounds/pacman_death.wav");
const intermissionSound = new Audio("assets/sounds/pacman_intermission.wav");
const collisionSound = new Audio("assets/sounds/collision_sound.wav");

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

let lastTime = 0; //Need to remove this part,Not useful anymore

function initWebGL(canvas) {
  // Get WebGL context
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  // Set viewport to canvas size with black background
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);

  // Enable face culling and depth test
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  if (!gl) {
    alert("Could not initialise WebGL, sorry! :-(");
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
  const result = won ? "YOU WON." : "GAME OVER.";
  document.getElementById("result").innerHTML = `${result} Score: ${score}`;
  document.getElementById("score").innerHTML = "";
  document.getElementById("remainingLives").innerHTML = "";
  document.getElementById("restart").style.display = "block";

  // Play death or winning sound
  sound.play();
}

function restartGame() {
  // Restart game mode
  console.log("Restarting....");
  score = 0;
  remainingFood = 0;
  remainingLives = 3;

  // Restart game infos and super mode timer, if set
  clearInterval(interval);
  document.getElementById("super-mode").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("restart").style.display = "none";

  // Start game rendering
  initField();

  // Play intro sound
  introSound.play();

  // Update game state
  gameOver = false;
  gameWin = false;
  superMode = false;
}

function enableSuperModeEnv() {

//     // Enable super mode timer
    interval = setInterval(function () {
        counter--;
        if (counter === 0) {
            superMode = false;

//             // Respawn dead ghosts
            // for (let i = 0; i < deadGhosts.length; i++)
            //     ghosts.push(deadGhosts[i]);
            ghosts = ghosts.concat(deadGhosts);
            deadGhosts = [];

            document.getElementById('super-mode').innerHTML = "";
            clearInterval(interval);

        } else
            document.getElementById('super-mode').innerHTML = "SUPER MODE ending in " + counter + " seconds";
    }, 1000);
}

function animate() {
  const timeNow = new Date().getTime();

  lastTime = timeNow;
}

async function tick() {
  requestAnimFrame(tick);

  // Render the viewport
  drawScene();
  await sleep(5000);

  // Compute new pacman move
  movePacman();
  // Compute new ghost moves
  ghosts.map((ghost) => moveGhost(ghost));

  // Animate models
  animate();
}

function setEventListeners() {
  // Pacman Movement
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
      case 37:
        pacman.updateDirection(-1, 0, key);
        break;
      // Up
      case 38:
        pacman.updateDirection(0, -1, key);
        break;
      // Right
      case 39:
        pacman.updateDirection(1, 0, key);
        break;
      // Down
      case 40:
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
  const canvas = document.querySelector("#my-canvas");
  initWebGL(canvas);
  shaderProgram = programs(gl);
}

async function fetchShaders() {
  const responseVs = await fetch("pacmanHelpers/vsShader.shader");
  if (!responseVs.ok) {
    throw new Error("No vs Shader Found");
  }
  vsShader = await responseVs.text();
  console.log(vsShader, "Is Vs Shader");

  const responseFs = await fetch("pacmanHelpers/fsShader.shader");
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
