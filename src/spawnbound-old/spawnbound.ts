// Import player and movement system
import { updatePlayer, drawPlayer, gun, player } from '../shared/player.ts';
// Import vector utility functions
import { vecMinus, vecAdd, vecScalar, vecNormal, type Vector } from '../shared/vector.ts';

// Get canvas and context
const canvas = document.querySelector("canvas")!; /* ! mark is typescript it asserts that something is not null */
const ctx = canvas.getContext('2d')!;/* ! mark is typescript it asserts that something is not null */

//gross stinky typescript jargin

type Jelly = {
    size: number;
    speed: number;
    damage: number;
    health: number;
    strength: number;
    color: string;
    color2: string;
    friendlyFire: boolean;
    x: number;
    y: number;
}


function distance(a: Jelly, b: Jelly) {
    // Calculate the difference vector between the two jellies
    let diff = vecMinus({ x: b.x, y: b.y }, { x: a.x, y: a.y });

    // Use Pythagorean theorem to calculate the straight-line distance
    // distance = √(dx² + dy²)
    return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
}


type JellyArray = Jelly[];

// TODO: Add your game state variables here
// Example: paddles, ball, scores, etc.

let Jellies: JellyArray = [

]



// Game state control
let gamePaused = false;

// Audio setup
const jellyDeathSound = new Audio('./sounds/pop-402324.mp3');

// Helper function to play a sound effect
function playSound(sound: HTMLAudioElement) {
    // Clone the audio element so we can play multiple instances simultaneously
    const soundClone = sound.cloneNode() as HTMLAudioElement;
    soundClone.volume = 0.1; // Adjust volume (0.0 to 1.0)
    soundClone.play().catch(error => {
        // Silently handle errors (browser may block autoplay)
        console.error('Error playing sound:', error);
    });
}


function captureJelly(jelly: Jelly) {
    // Make sure damage values exist (safety check)
    const playerDamage = player.damage || 5; // Default to 10 if undefined
    const jellyDamage = jelly.damage || 5; // Default to 5 if undefined

    jelly.health -= playerDamage;
    player.health = Math.max(0, player.health - jellyDamage);

    jelly.color = 'red';
    jelly.color2 = 'blue'
    jelly.speed = 5;
    jelly.strength = 5
    jelly.size = 2.5
    jelly.friendlyFire = true;
}


function drawLines() {
    const startX = Math.floor((player.x - 2000) / 500) * 500;
    const startY = Math.floor((player.y - 2000) / 500) * 500;
    // Add vertical lines (every 500px in x direction)
    for (let x = startX; x <= player.x + 2000; x += 500) {
        ctx.fillStyle = 'grey'
        ctx.fillRect(x, -canvas.height + player.y, 5, canvas.height * 3)
    }
    // Add horizontal lines (every 500px in y direction)
    // Draw lines both above and below the player
    for (let y = startY; y <= player.y + 2000; y += 500) {
        ctx.fillStyle = 'grey'
        ctx.fillRect(-canvas.width + player.x, y, canvas.width * 3, 5)
    }
}
//defining things-

// Calculate the center point of the canvas
const centerX = canvas.width * 0.5;
const centerY = canvas.height * 0.5;

// Update game state
function update() {
    // Update player movement and rotation (handles arrow keys)
    // Pass jellies array so they move with player movement
    updatePlayer();




    // TODO: Update your game objects here
    // Example: move paddles, move ball, check collisions
    if (Jellies.length < 500) {
        // Randomly pick one of 4 sides (1 = top, 2 = right, 3 = bottom, 4 = left)
        let side = Math.floor(Math.random() * 4) + 1;
        let x = 0;
        let y = 0;

        if (side === 1) {
            // Top edge
            x = player.x + (Math.random() - 0.5) * canvas.width;
            y = player.y - canvas.height / 2;
        } else if (side === 2) {
            // Right edge
            x = player.x + canvas.width / 2;
            y = player.y + (Math.random() - 0.5) * canvas.height;
        } else if (side === 3) {
            // Bottom edge
            x = player.x + (Math.random() - 0.5) * canvas.width;
            y = player.y + canvas.height / 2;
        } else {
            // Left edge
            x = player.x - canvas.width / 2;
            y = player.y + (Math.random() - 0.5) * canvas.height;
        }

        Jellies.push({ size: 5, speed: 1, damage: 5, health: 200, strength: .5, color: 'blue', color2: 'red', friendlyFire: false, x: x, y: y });
    }
    // Move jellies and check collisions in one loop for better performance

    for (let i = 0; i < Jellies.length; i++) {
        let jellyA = Jellies[i];

        // Calculate the direction vector from jelly to center
        let playerWorldPos = { x: player.x, y: player.y };
        let jellyPos = { x: jellyA.x, y: jellyA.y };
        let direction = vecMinus(playerWorldPos, jellyPos);

        // Calculate the total distance to center
        let distanceToCenter = Math.sqrt(direction.x * direction.x + direction.y * direction.y);


        // playtesting jelly death on contact
        // Check if circles overlap: distance between centers <= sum of radii
        if (distanceToCenter <= player.size + jellyA.size) {
            captureJelly(jellyA);
        }
        // Only move if not already at center (prevents division by zero)
        if (distanceToCenter > 20) {
            // Normalize the direction (make it a unit vector pointing towards center)
            // Then scale by speed to get the movement vector
            let movement = vecScalar(vecNormal(direction), jellyA.speed);

            // Add the movement vector to the jelly's position
            jellyA.x += movement.x;
            jellyA.y += movement.y;
        }

        // COLLISION: Check collisions with all jellies that come after this one
        // (using i + 1 avoids checking pairs twice and checking a jelly with itself)
        for (let k = i + 1; k < Jellies.length; k++) {
            // don't compare against yourself
            if (i === k) {
                continue;
            }

            let jellyB = Jellies[k];

            // Calculate distance between the two jellies
            let dist = distance(jellyA, jellyB);
            let minDist = jellyA.size + jellyB.size;

            // If they're overlapping, handle the collision
            if (dist < minDist && dist > 0) {
                // Get direction from jelly to jellyB, normalize it, then scale by overlap amount, apparently
                // finally scale it up
                let push = vecScalar(
                    // converts distance to a normal vector.
                    vecNormal(
                        // distance between jellies with minus
                        vecMinus(
                            { x: jellyB.x, y: jellyB.y },
                            { x: jellyA.x, y: jellyA.y }
                        )
                    ),
                    (minDist - dist) * jellyA.strength
                );

                // Push them apart in opposite directions
                jellyA.x -= push.x; jellyA.y -= push.y;
                jellyB.x += push.x; jellyB.y += push.y;

                // Only captured jellies can capture other jellies
                if (jellyA.friendlyFire === true && jellyB.friendlyFire === false) {
                    captureJelly(jellyB);
                } else if (jellyB.friendlyFire === true && jellyA.friendlyFire === false) {
                    captureJelly(jellyA);
                }
            }
        }
        if (jellyA.health <= 0) {
            // Play death sound effect
            playSound(jellyDeathSound);

            Jellies.splice(i, 1);
            i--;

            let dropChance = Math.floor(Math.random() * 4) + 1;
            if (dropChance = 4) {

            }
            continue; // Skip the rest of this iteration since the jelly is dead
        }
    }
}

// Draw everything
function draw() {
    ctx.save()
    // Clear the canvas
    ctx.fillStyle = '#0f3460';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.translate(canvas.width / 2 - player.x, canvas.height / 2 - player.y);

    drawLines();

    // Delete lines that are too far outside the view
    // Iterate backwards to safely splice during iteration


    // TODO: Draw your game objects here
    ctx.fillStyle = 'red';

    // Loop through each jelly in the array and draw it
    for (let i = 0; i < Jellies.length; i++) {
        let jelly = Jellies[i];
        ctx.beginPath(); // vision radius
        // arc(x, y, radius, startAngle, endAngle) - draws a circle
        ctx.fillStyle = jelly.color;
        ctx.arc(jelly.x, jelly.y, jelly.size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = jelly.color2;
        ctx.beginPath(); // Start a new path for drawing
        // arc(x, y, radius, startAngle, endAngle) - draws a circle
        ctx.arc(jelly.x, jelly.y, jelly.size, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(player.x - 25, player.y + player.size, 52, 5);

    let currentHealth = player.health / player.maxHealth;
    
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x - 24, player.y + player.size + 1, 50 * currentHealth, 3);
    // Draw player and gun
    drawPlayer(ctx);

    ctx.restore()
}


// Keyboard controls for pause and reset
document.addEventListener('keydown', (event) => {
    if (event.key == "0") {
        document.location.reload();
    }
    // Press 'P' to pause/unpause
    if (event.key === 'p' || event.key === 'P') {
        gamePaused = !gamePaused;
        console.log(gamePaused ? 'Game PAUSED' : 'Game RESUMED');
    }

});

// Main game loop
function gameLoop() {
    // Only update and draw if not paused
    if (!gamePaused) {
        update();
    }
    draw(); // Always draw (so you can see the paused state)

    requestAnimationFrame(gameLoop);


}

// Start the game
gameLoop();

// Make this file a module (ESM)
export { };