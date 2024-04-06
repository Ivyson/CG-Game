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
  webgl.clear(webgl.COLOR_BUFFER_BIT);
}
window.addEventListener("resize", () => {
  canvas.style.height = window.innerHeight + "px";
  canvas.style.width = window.innerWidth - 10 + "px";
});
let vertices = new Float32Array([-0.2, -0.95, 0.2, -0.95, -0.2, -1.0, 0.2, -1]);
createCanvas();
webgl.enable(webgl.DEPTH_TEST);
function Buffer() {
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
let buffer = Buffer();
let vsShader = `
    uniform float xmovement;
    attribute vec2 vecposition;

    void main()
    {
        gl_Position = vec4(vecposition.x + xmovement, vecposition.y, 0.9, 1.0);
    }
`;
let fsShader = `
    precision mediump float;
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
  webgl.uniform1f(ymove, xvalue);
  webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && xvalue > -0.8) {
      xvalue -= 0.001;
    } else if (event.key === "ArrowRight" && xvalue < 0.8) {
      xvalue = 0.001;
    }
  });
  window.requestAnimationFrame(draw);
}

draw();
