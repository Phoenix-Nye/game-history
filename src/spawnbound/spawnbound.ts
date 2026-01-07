import { Entity } from "./types/entity";
import { GameState } from "./types/game-state";

// Get canvas and context
const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext('2d')!;

// game state
const gameState = GameState.initialize();

// Update game state
function update(state: GameState) {
    for (const entity of state.entities) {
        Entity.update(state, entity);
    }
}

// Draw everything
function draw(state: GameState) {
    // Clear the canvas
    ctx.fillStyle = '#0f3460';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render all entities
    for (const entity of state.entities) {
        Entity.render(ctx, state, entity);
    }
}

// Main game loop
function gameLoop() {
    update(gameState);
    draw(gameState);
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

// Make this file a module (ESM)
export {};
