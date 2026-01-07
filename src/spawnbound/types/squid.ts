import { Vec2 } from "./vec2";
import { Entity } from "./entity";
import { GameState } from "./game-state";

export type Squid = {
    type: "squid";
    position: Vec2;
    hp: number;
}

export namespace Squid {
    /**
     * Updates the squid entity's state.
     * Called every frame to handle AI, movement, etc.
     * @param state - The current game state
     */
    export function update(state: GameState, squid: Squid): void {
        // TODO: Implement squid update logic
    }

    /**
     * Renders the squid entity on the canvas.
     * @param ctx - The 2D canvas rendering context
     * @param state - The current game state
     */
    export function render(ctx: CanvasRenderingContext2D, state: GameState, squid: Squid): void {
        const [x, y] = squid.position;
        const radius = 12;
        
        // Draw squid body as a purple circle
        ctx.fillStyle = '#9b59b6';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw tentacles (simple lines below the body)
        ctx.strokeStyle = '#7d3fa3';
        ctx.lineWidth = 2;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(x + i * 4, y + radius);
            ctx.lineTo(x + i * 4, y + radius + 8);
            ctx.stroke();
        }
    }

    /**
     * Handler object that encapsulates squid entity operations.
     * Used for automatic registration in the Entity routing system.
     */
    export const handler: Entity.Handler = {
        type: "squid",
        update: (state: GameState, entity: Entity) => Squid.update(state, entity as Squid),
        render: (ctx: CanvasRenderingContext2D, state: GameState, entity: Entity) => Squid.render(ctx, state, entity as Squid),
    };
}

