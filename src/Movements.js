function computePossibleMoves(structure, field) {
    const width = structure[0].length;
    const height = structure.length;

// Find possible moves, based on blocks neighbours
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const currentBlock = field[i][j];

            // Up block
            if (i - 1 >= 0) {
                const up = field[i - 1][j];
                if (isFoodBlock(up)) {
                    currentBlock.moves[38] = up;
                }
            }

            // Down block
            if (i + 1 < height) {
                const down = field[i + 1][j];
                if (isFoodBlock(down)) {
                    currentBlock.moves[40] = down;
                }
            }

            // Left block
            if (j - 1 >= 0) {
                const left = field[i][j - 1];
                if (isFoodBlock(left)) {
                    currentBlock.moves[37] = left;
                }
            }

            // Right block
            if (j + 1 < width) {
                const right = field[i][j + 1];
                if (isFoodBlock(right)) {
                    currentBlock.moves[39] = right;
                }
            }
        }
    }

}

function isFoodBlock(block) {
    return block.type === 'f' || block.type === 's' || block.type === 'p' || block.type === 'sp';
}

function movePacman() {
    // Walk while not crashing
    if (pacman.currentBlock.moves[pacman.key] !== undefined) {
        pacman.x += pacman.xDirection * field.speed;
        pacman.z += pacman.zDirection * field.speed;
    }

    updatePacmanPosition();
    handlePacmanEating();

    // If there isn't more food, the user wins
    if (remainingFood === 1 && !gameOver) {
        endGame(true, intermissionSound);
    }
}

function updatePacmanPosition() {
    // Parse the pacman's x and z coordinates to 2 decimal places
    const x = parseFloat(pacman.x.toFixed(2));
    const z = parseFloat(pacman.z.toFixed(2));

    // Update the pacman's position, if possible
    if (x % field.xBlockSize === 0 && z % field.zBlockSize === 0) {
        // Only update the position if it is a valid move
        if (pacman.currentBlock.moves[pacman.key] !== undefined) {
            pacman.updatePosition();
        }

        // Change to the next direction, if possible
        if (Object.keys(pacman.nextDirection).length !== 0 && pacman.currentBlock.moves[pacman.nextDirection['key']] !== undefined) {
            pacman.xDirection = pacman.nextDirection['x'];
            pacman.zDirection = pacman.nextDirection['z'];
            pacman.key = pacman.nextDirection['key'];
            pacman.nextDirection = {};
        }

        // Stop if it is an invalid move
        if (pacman.currentBlock.moves[pacman.key] === undefined) {
            pacman.updateDirection(0, 0, pacman.key);
        }

        // Handle portals
        if (pacman.currentBlock.type === 'p') {
            if (pacman.teleportation) {
                pacman.teleportation = false;
            } else {
                spawnInRandomPortal(pacman);
            }
        }
    }
}

function handlePacmanEating() {
    const blockType = pacman.currentBlock.type;

    if (blockType === 's') {
        collisionSound.play();
        counter = superMode ? counter + 12 : 12;

        if (superMode) {
            clearInterval(interval);
            interval = null;
        }

        enableSuperModeEnv();
        superMode = true;
    }

    if (blockType === 'f' || blockType === 's') {
        score += (blockType === 'f') ? 1 : 5;
        pacman.currentBlock.type = '';
        eatingSound.play();
        remainingFood--;
    }
} 

function moveGhost(ghost) {
    // Check for collisions with pacman
    if (isPacmanCollision(ghost)) {
        if (superMode) {
            eatGhost(ghost);
        } else {
            handleGameLoss();
        }
    }

    // Update current position, if possible
    if (canUpdatePosition(ghost)) {
        // Only update the position if it is a valid move
        if (ghost.currentBlock.moves[ghost.key] !== undefined) {
            updateGhostPosition(ghost);
        }
        // Stop if it is an invalid move
        if (ghost.currentBlock.moves[ghost.key] === undefined) {
            changeGhostDirectionRandomly(ghost);
        }

        // Handle portals
        if (ghost.currentBlock.type === 'p') {
            handlePortal(ghost);
        }
    }

    // Walk while not crashing
    if (ghost.currentBlock.moves[ghost.key] !== undefined) {
        moveGhostInCurrentDirection(ghost);
    }

}

function isPacmanCollision(ghost) {
    return Math.abs(ghost.x.toFixed(1) - pacman.x.toFixed(1)) < field.xBlockSize / 2 && Math.abs(ghost.z.toFixed(1) - pacman.z.toFixed(1)) < field.zBlockSize;
}

function eatGhost(ghost) {
    const idx = ghosts.indexOf(ghost);
    ghosts.splice(idx, 1);
    score += 100;
    eatGhostSound.play();

// Add ghost to dead ghost array to later respawn
    const id = ghost.id;
    ghost = new CharacterConstructor(id);
    const coordinates = randomCoordinates();
    ghost.init(coordinates['x'], coordinates['z']);
    deadGhosts.push(ghost);

}

function handleGameLoss() {
    if (remainingLives === 0) {
        endGame(false, deathSound);
    } else {
        collisionSound.play();
        reduceLivesAndRespawn();
    }
}

function canUpdatePosition(ghost) {
    return parseFloat(ghost.x.toFixed(2)) % field.xBlockSize === 0 && parseFloat(ghost.z.toFixed(2)) % field.zBlockSize === 0;
}

function updateGhostPosition(ghost) {
    ghost.updatePosition();
}

function changeGhostDirectionRandomly(ghost) {
    const newDirection = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    ghost.xDirection = newDirection['x'];
    ghost.zDirection = newDirection['z'];
    ghost.key = newDirection['key'];
}

function handlePortal(ghost) {
    if (ghost.teleportation) {
        ghost.teleportation = false;
    } else {
        spawnInRandomPortal(ghost);
    }
}
//The speed of the ghost is half compared to the player
function moveGhostInCurrentDirection(ghost) {
    ghost.x += ghost.xDirection * (field.speed/2);
    ghost.z += ghost.zDirection * (field.speed/2);
}

function spawnInRandomPortal(character) {
  // Find the next portal that is not the current portal
    const nextPortal = portals.find((p) => p !== character.currentBlock) || portals[0];
    character.currentBlock = nextPortal;

    // Update position
    character.x = nextPortal.x;
    character.z = nextPortal.z;

    // Update moves
    const key = Object.keys(nextPortal.moves)[0];
    possibleMoves.forEach(function (move) {
        if (move['key'] === key) {
            // Force direction change
            character.xDirection = move['x'];
            character.zDirection = move['z'];
            character.key = move['key'];
        }
    });
    // Enable teleportation
    // character.teleportation = true;
}

function reduceLivesAndRespawn() {
    remainingLives--;
    ghosts = [];
    for (let i = 1; i <= 4; i++) {
        const ghost = new CharacterConstructor(`G${i}`);
        const coords = randomCoordinatesGhost();
        ghost.init(coords['x'], coords['z']);
        ghosts.push(ghost);
    }
}
