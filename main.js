let webgl;
let canvas;
function createCanvas() {
  canvas = document.querySelector("canvas");
  if (canvas == null) {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
  }
  canvas.style.height = window.innerHeight - 3.29 + "px";
  canvas.style.width = window.innerWidth - 1 + "px";
  canvas.style.backgroundColor = "yellow";
  webgl = canvas.getContext("webgl");
  webgl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener("resize", () => {
  canvas.style.height = window.innerHeight + "px";
  canvas.style.width = window.innerWidth - 10 + "px";
});
let vertices = new Float32Array([-0.2, -0.85, 0.2, -0.85]);
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
    attribute vec2 vecposition;
    void main()
    {
        gl_Position = vec4(vecposition, 0.9, 1.0);
    }
`;
let fsShader = `
    precision mediump float;
    void main()
    {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
`;

let vShder = compileShader(webgl, vsShader, webgl.VERTEX_SHADER);
let fShader = compileShader(webgl, fsShader, webgl.FRAGMENT_SHADER);
let program = createProgram(webgl, vShder, fShader);
let Position = webgl.getAttribLocation(program, "vecposition");
webgl.enableVertexAttribArray(Position);
webgl.vertexAttribPointer(Position, 2, webgl.FLOAT, false, 0, 0);
webgl.drawArrays(webgl.LINES, 0, 2);
