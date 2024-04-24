let webgl;

async function loadShaders() {
  try {
    console.log(webgl);
    const vsResponse = await fetch('./pacmanHelpers/vsShader.shader');
    console.log(vsResponse.status);
    if (!vsResponse.ok) {
      throw new Error("No vs Shader file Found, check the path if it's correct...");
    }
    const vsShaderSource = await vsResponse.text();

    const vShader = compileShader(webgl, vsShaderSource, webgl.VERTEX_SHADER);
    if (vShader == null) {
      throw new Error('Vertex Shader could not compile');
    }

    const fsResponse = await fetch('./pacmanHelpers/fsShader.shader');
    console.log(fsResponse.status);
    if (!fsResponse.ok) {
      throw new Error('Fs shader file was not found');
    }
    const fsShaderSource = await fsResponse.text();

    const fShader = compileShader(webgl, fsShaderSource, webgl.FRAGMENT_SHADER);
    if (fShader == null) {
      throw new Error('Could not compile Fragment Shader');
    }

    const program = createProgram(webgl, vShader, fShader);
    console.log(program);
    if (program == null) {
      console.log('Program Failed');
      throw new Error('Program could not be linked...');
    }

    // Set up attributes and uniforms
    program.vertexPositionAttribute = webgl.getAttribLocation(program, "aVertexPosition");
    webgl.enableVertexAttribArray(program.vertexPositionAttribute);

    program.textureCoordAttribute = webgl.getAttribLocation(program, "aTextureCoord");
    webgl.enableVertexAttribArray(program.textureCoordAttribute);

    program.vertexNormalAttribute = webgl.getAttribLocation(program, "vNormal");
    webgl.enableVertexAttribArray(program.vertexNormalAttribute);

    program.pMatrixUniform = webgl.getUniformLocation(program, "uPMatrix");
    program.mvMatrixUniform = webgl.getUniformLocation(program, "uMVMatrix");

    webgl.useProgram(program);

    return program;
  } catch (error) {
    console.error(error.message);
  }
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

  return program;
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

function initShaders(gl) {
  webgl = gl;
  loadShaders();
}
