function drawModel(angleXX, angleYY, angleZZ,
                   sx, sy, sz,
                   tx, ty, tz,
                   mvMatrix,
                   texture) {


    // Apply all transformations

    mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));
    // mvMatrix = translateMat(mvMatrix,tx, ty, tz );
    // mvMatrix = rotateZ(mvMatrix, angleZZ);
    // mvMatrix = rotateY(mvMatrix, angleYY);
    // mvMatrix = rotateX(mvMatrix, angleXX);
    // mvMatrix = scale(mvMatrix, sx, sy, sz);
    mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZZ)); //Basically rotating the existing matrice towards z.
    mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYY)); // '''''''''''''''''''''''''''''''''''''''''''''''y,
    mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXX)); //''''''''''''''''''''''''''''''''''''''''''''''''x
    mvMatrix = mult(mvMatrix, scalingMatrix(sx, sy, sz));//Basically scaling the existing matrix or resizing it! 
    console.log(mvMatrix);

    // Passing the Model View Matrix to apply the current transformation
    const mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // Passing the buffers (vertices and textures)

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);


    // Apply textures

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    // Bind vertices and draw the contents of the vertex buffer

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawScene() {

    let i;
    let mvMatrix = createIdentityMatrix();
    // let mvMatrix;

    // Clear color buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const pMatrix = PerspectiveCam(12, 1, 3, -5); // Zoom in or out of the scene

    // Passing the Projection Matrix to apply the current projection
    const pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

    gl.uniformMatrix4fv(pUniform, false, new Float32Array(pMatrix));

    // Global transformations
    // mvMatrix = translationMatrix( 0, 0, globalTz);
    mvMatrix = translateMat(mvMatrix, 0, 0, globalTz);
    // mvMatrix = rotateY(mvMatrix, globalYY);
    // mvMatrix = rotateX(mvMatrix, globalXX);
    mvMatrix = mult(mvMatrix, rotationYYMatrix(globalYY));
    mvMatrix = mult(mvMatrix, rotationXXMatrix(globalXX));
    // Draw models

    drawField(mvMatrix);

    drawChar(pacman, mvMatrix);

    for (i = 0; i < ghosts.length; i++)
        drawChar(ghosts[i], mvMatrix);

    // Update page's score
    if (!gameOver) {
        document.getElementById('score').innerHTML = "Score : " + score;
        document.getElementById('remainingLives').innerHTML = "Remaining Lives : " + remainingLives;
    }
}

function drawChar(character, mvMatrix) {
    const texture = getCharacterTexture(character);
    drawModel(angleXX, angleYY, angleZZ,  sx, sy, sz,  character.x - (field.width / 2), ty, character.z - (field.height / 2),  mvMatrix,  texture);
}


function getCharacterTexture(character) {
    switch (character.id) {
        case 'Pac':
            return pacmanTexture;
        case 'G1':
            return ghost1Texture;
        case 'G2':
            return ghost2Texture;
        case 'G3':
            return ghost3Texture;
        case 'G4':
            return ghost4Texture;
        default:
            return null;
    }
}

function drawField(mvMatrix) {
    for (let i = 0; i < field.height; i++) {
        for (let j = 0; j < field.width; j++) {
            const block = field.structure[i][j];
            const xCoord = j * field.xBlockSize - tx;
            const zCoord = i * field.xBlockSize * field.zBlockSize - tz;
            switch (block.type) {
                case 'w':
                    drawWall(mvMatrix, xCoord, zCoord);
                    break;
                case 'f':
                    drawFood(mvMatrix, xCoord, zCoord, 0.4);
                    break;
                case 's':
                    drawFood(mvMatrix, xCoord, zCoord, 0.4);
                    break; 
                }
        }
    }
}

function drawWall(mvMatrix, xCoord, zCoord) {
    drawModel(angleXX, angleYY, angleZZ, sx, sy, sz, xCoord, 0, zCoord, mvMatrix, wallTexture);
}

function drawFood(mvMatrix, xCoord, zCoord, scale) {
    drawModel(angleXX, angleYY, angleZZ, sx - scale, sy - scale, sz - scale, xCoord, 0, zCoord, mvMatrix, foodTexture);
}