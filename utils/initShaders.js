function getShaderType(gl, typeString) {
    switch (typeString) {
        case "x-shader/x-fragment": return gl.FRAGMENT_SHADER;
        case "x-shader/x-vertex": return gl.VERTEX_SHADER;
        default: return null;
    }
}

function getShaderSource(id) {
    const shaderScript = document.getElementById(id);
    return shaderScript ? shaderScript.textContent || shaderScript.innerText : null;
}

function getShader(gl, id) {
    const shaderTypeString = document.getElementById(id).type;
    const shaderType = getShaderType(gl, shaderTypeString);
    const shaderSource = getShaderSource(id);

    return shaderType && shaderSource ? compileShader(gl, shaderSource, shaderType) : null;
}

function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(`Error linking program: ${gl.getProgramInfoLog(program)}`);
        gl.deleteProgram(program);
        return null;
    }

    gl.useProgram(program);
    return program;
}

function initShaders(gl) {
    const vertexShader = getShader(gl, "shader-vs");
    const fragmentShader = getShader(gl, "shader-fs");

    const shaderProgram = createProgram(gl, vertexShader, fragmentShader);
    if (!shaderProgram) {
        alert("Could not initialise shaders");
        return null;
    }

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    return shaderProgram;
}
