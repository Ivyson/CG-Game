== Discovered Bugs
1. The game initialisation happens way before the user presses the Start Button. This causes the game to throw errors in the console about `id` not being found
2. The Pacman facing single side is not a bug, but an intentional shortcoming. A new face Image texture needs to be rendered every time the user changes direction. This will be handled later on
3. 