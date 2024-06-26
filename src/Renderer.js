let wallTexture;
let foodTexture;
let superFoodTexture;
let pacmanTexture;
let ghost1Texture;
let ghost2Texture;
let ghost3Texture;
let ghost4Texture;

// Scaling factors
const sx = 0.5;
const sy = 0.5;
const sz = 0.5;

// Vertices defining the faces
const vertices = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0
];

// Vertex indices defining the triangles
const cubeVertexIndices = [

    0, 1, 2, 0, 2, 3,    // Front face

    4, 5, 6, 4, 6, 7,    // Back face

    8, 9, 10, 8, 10, 11,  // Top face

    12, 13, 14, 12, 14, 15, // Bottom face

    16, 17, 18, 16, 18, 19, // Right face

    20, 21, 22, 20, 22, 23  // Left face
];

// Texture coordinates for the quadrangular faces
const textureCoords = [

    // Front face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Back face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Top face
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Bottom face
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    // Right face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Left face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
];


function initCubeBuffer() {

    // Coordinates
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = vertices.length / 3;

    // Textures

    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 24;

    // Vertex indices

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;
}



function handleLoadedTexture(texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);
}


function initTextures() {

    // Wall texture
    wallTexture = createTextureWithAsset("assets/bounds-copy.jpg")

    // Food texture
    foodTexture = createTextureWithAsset("assets/super-food.png");

    // Super food texture
    superFoodTexture = createTextureWithAsset("assets/super-food.png");

    // Pacman texture
    pacmanTexture = createTextureWithAsset("assets/PacmanAvatar.png")

    // Ghosts textures
    ghost1Texture = createTextureWithAsset("assets/ghosts/gh1.png")
    ghost2Texture = createTextureWithAsset("assets/ghosts/gh2.png")
    ghost3Texture = createTextureWithAsset("assets/ghosts/gh3.png")
    ghost4Texture = createTextureWithAsset("assets/ghosts/gh4.png")
}

function createTextureWithAsset(asset) {
    let texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function () {
        handleLoadedTexture(texture)
    }

    texture.image.src = asset;

    return texture
}
function isPower(value)
{
	return( value & (value -1)) === 0;
}