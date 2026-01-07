import { Vec2 } from "./vec2";
import { Entity } from "./entity";
import { GameState } from "./game-state";

export type Player = {
    type: "player";
    position: Vec2;
    hp: number;
}

export namespace Player {
    /**
     * Updates the player entity's state.
     * Called every frame to handle movement, input, etc.
     * @param state - The current game state
     */
    export function update(state: GameState, player: Player): void {
        // TODO: Implement player update logic
    }

    /**
     * Renders the player entity on the canvas.
     * @param ctx - The 2D canvas rendering context
     * @param state - The current game state
     */
    export function render(ctx: CanvasRenderingContext2D, state: GameState, player: Player): void {
        const [x, y] = player.position;
        const radius = 15;
        
        // Draw player as a blue circle
        ctx.fillStyle = '#4a9eff';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw a white border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /**
     * Handler object that encapsulates player entity operations.
     * Used for automatic registration in the Entity routing system.
     */
    export const handler: Entity.Handler = {
        type: "player",
        update: (state: GameState, entity: Entity) => Player.update(state, entity as Player),
        render: (ctx: CanvasRenderingContext2D, state: GameState, entity: Entity) => Player.render(ctx, state, entity as Player),
    };
}

