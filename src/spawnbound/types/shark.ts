import { Vec2 } from "./vec2";
import { Entity } from "./entity";
import { GameState } from "./game-state";

export type Shark = {
    type: "shark";
    position: Vec2;
    hp: number;
}

export namespace Shark {
    /**
     * Updates the shark entity's state.
     * Called every frame to handle AI, movement, etc.
     * @param state - The current game state
     */
    export function update(state: GameState, shark: Shark): void {
        // TODO: Implement shark update logic
    }

    /**
     * Renders the shark entity on the canvas.
     * @param ctx - The 2D canvas rendering context
     * @param state - The current game state
     */
    export function render(ctx: CanvasRenderingContext2D, state: GameState, shark: Shark): void {
        const [x, y] = shark.position;
        const size = 20;
        
        // Draw shark as a gray triangle (pointing right)
        ctx.fillStyle = '#5d6d7e';
        ctx.beginPath();
        ctx.moveTo(x - size, y); // Left point
        ctx.lineTo(x + size, y - size); // Top right
        ctx.lineTo(x + size, y + size); // Bottom right
        ctx.closePath();
        ctx.fill();
        
        // Draw a fin on top
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size * 0.5, y - size * 1.5);
        ctx.lineTo(x + size, y - size);
        ctx.fill();
    }

    /**
     * Handler object that encapsulates shark entity operations.
     * Used for automatic registration in the Entity routing system.
     */
    export const handler: Entity.Handler = {
        type: "shark",
        update: (state: GameState, entity: Entity) => Shark.update(state, entity as Shark),
        render: (ctx: CanvasRenderingContext2D, state: GameState, entity: Entity) => Shark.render(ctx, state, entity as Shark),
    };
}

