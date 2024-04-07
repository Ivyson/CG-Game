// import {drawCircle} from "./circledrawing.js";
let webgl;
let canvas;
function createCanvas() {
  canvas = document.querySelector("canvas");
  if (canvas == null) {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
  }
  canvas.style.height = window.innerHeight + "px";
  canvas.style.width = window.innerWidth + 1 + "px";
  canvas.style.backgroundColor = "black";
  webgl = canvas.getContext("webgl");
  //   webgl.viewport(0, 0, canvas.style.width, canvas.sy height);
  webgl.clearColor(0.0, 0.0, 0.0, 1.0);
  //   webgl.clear(webgl.COLOR_BUFFER_BIT);
}
window.addEventListener("resize", () => {
  canvas.style.height = window.innerHeight + "px";
  canvas.style.width = window.innerWidth - 10 + "px";
});
let vertices = new Float32Array([-0.1, -0.95, 0.1, -0.95, -0.1, -1.0, 0.1, -1]);
let theta = 2 * Math.PI;
let segments = 60;
let x, y;
let cvertices = [];
for (let i = 0; i < segments; i += theta / segments) {
  x = 0.1 * Math.cos(i);
  y = 0.1 * Math.sin(i);
  // console.log(cvertices);
  cvertices.push(x, y);
}
createCanvas();
webgl.enable(webgl.DEPTH_TEST);
function Buffer(vertices) {
  console.log(webgl);
  let buffer = webgl.createBuffer();
  console.log(buffer, "Hello");
  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
  webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);
  const errors = webgl.getError();
  //if no errors present then webgl.getError() should return the same value as webgl.NO_ERROR
  if (errors !== webgl.NO_ERROR) {
    //There is an error with a buffer binding
    console.log("There was an error", errors);
    return null;
  }
  return buffer;
}
function compileShader(webgl, source, type) {
  const shader = webgl.createShader(type);
  webgl.shaderSource(shader, source);
  webgl.compileShader(shader);

  if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
    console.error(`Error compiling shader: ${webgl.getShaderInfoLog(shader)}`);
    webgl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(webgl, vertexShader, fragmentShader) {
  const program = webgl.createProgram();
  webgl.attachShader(program, vertexShader);
  webgl.attachShader(program, fragmentShader);
  webgl.linkProgram(program);

  if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
    console.error(`Error linking program: ${webgl.getProgramInfoLog(program)}`);
    webgl.deleteProgram(program);
    return null;
  }
  webgl.useProgram(program);
  return program;
}
let buffer = Buffer(vertices);
let vsShader = `
    precision highp float;
    uniform float xmovement;
    attribute vec2 vecposition;

    void main()
    {
        gl_Position = vec4(vecposition.x + xmovement, vecposition.y, 0.9, 1.0);
    }
`;
let fsShader = `
    precision highp float;
    void main()
    {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

let vShder = compileShader(webgl, vsShader, webgl.VERTEX_SHADER);
let fShader = compileShader(webgl, fsShader, webgl.FRAGMENT_SHADER);
let program = createProgram(webgl, vShder, fShader);
let Position = webgl.getAttribLocation(program, "vecposition");
let ymove = webgl.getUniformLocation(program, "xmovement");
webgl.enableVertexAttribArray(Position);
webgl.vertexAttribPointer(Position, 2, webgl.FLOAT, false, 0, 0);
let xvalue = 0;
function draw() {
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.useProgram(program);
  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
  webgl.enableVertexAttribArray(Position);
  webgl.vertexAttribPointer(Position, 2, webgl.FLOAT, false, 0, 0);
  webgl.uniform1f(ymove, xvalue);
  webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);
}
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && xvalue > -0.9) {
    xvalue -= 0.1;
  } else if (event.key === "ArrowRight" && xvalue < 0.9) {
    xvalue += 0.1;
  }
  console.log(xvalue);
});

let circlebuffer = Buffer(new Float32Array(cvertices));
let cvVertices = `
precision highp float;
attribute vec2 pos;
uniform vec2 shift;
uniform mat4 translate;
void main()
{
    gl_Position = vec4(0.2*pos+shift, 0.0, 1.0);
}
`;
let myShader = compileShader(webgl, cvVertices, webgl.VERTEX_SHADER);
let cProgram = createProgram(webgl, myShader, fShader);
let cPosition = webgl.getAttribLocation(cProgram, "pos");
webgl.enableVertexAttribArray(cPosition);
webgl.vertexAttribPointer(cPosition, 2, webgl.FLOAT, false, 0, 0);

let circloc = webgl.getUniformLocation(cProgram, "shift");
let xcirc = 0,
  ycirc = 0;
let indexmovex = Math.random() * 0.02;
let indexmovey = 0.01;
let timegame = 0;
function drawCircle() {
  webgl.useProgram(cProgram);
  webgl.bindBuffer(webgl.ARRAY_BUFFER, circlebuffer);
  webgl.uniform2f(circloc, xcirc, ycirc);
  webgl.vertexAttribPointer(cPosition, 2, webgl.FLOAT, false, 0, 0);
  webgl.drawArrays(webgl.TRIANGLE_FAN, 0, 120);
  xcirc += indexmovex;
  ycirc += indexmovey;
  if (xcirc > 1) {
    indexmovex *= -1;
  } else if (xcirc < -1) {
    indexmovex *= -1;
  }
  if (ycirc > 1) {
    indexmovey *= -1;
  } else if (ycirc < -1) {
    indexmovey *= -1;
  }
  console.log(timegame);
  timegame++;
  if (timegame % 2000 == 0) {
    indexmovex *= 2;
    indexmovey *= 2;
  }
}

function animate() {
  draw(); //This is for sketching the paddle
  drawCircle(); //For circle drawing.
  requestAnimationFrame(animate);
}
animate();
