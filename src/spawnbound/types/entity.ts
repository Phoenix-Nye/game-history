import { Player } from "./player";
import { Squid } from "./squid";
import { Shark } from "./shark";
import { GameState } from "./game-state";
import * as PlayerModule from "./player";
import * as SquidModule from "./squid";
import * as SharkModule from "./shark";

export type Entity = Player | Squid | Shark;

export namespace Entity {
    /**
     * Derives the entity type string from the Entity union type.
     * This extracts the "type" field from each entity variant.
     */
    export type Type = Entity["type"];

    /**
     * Type for entity handler objects.
     * Each entity namespace exports a handler that implements this interface.
     */
    export type Handler = {
        type: Type;
        update: (state: GameState, entity: Entity) => void;
        render: (ctx: CanvasRenderingContext2D, state: GameState, entity: Entity) => void;
    };

    /**
     * Collection of all entity handlers.
     * To add a new entity type, simply import its namespace and add its handler to this array.
     */
    const handlers: Handler[] = [
        PlayerModule.Player.handler,
        SquidModule.Squid.handler,
        SharkModule.Shark.handler,
    ];

    /**
     * Routing map for entity update functions.
     * Automatically built from the handlers array.
     */
    const updateMap: Record<Type, (state: GameState, entity: Entity) => void> = Object.fromEntries(
        handlers.map(handler => [handler.type, handler.update])
    ) as Record<Type, (state: GameState, entity: Entity) => void>;

    /**
     * Routing map for entity render functions.
     * Automatically built from the handlers array.
     */
    const renderMap: Record<Type, (ctx: CanvasRenderingContext2D, state: GameState, entity: Entity) => void> = Object.fromEntries(
        handlers.map(handler => [handler.type, handler.render])
    ) as Record<Type, (ctx: CanvasRenderingContext2D, state: GameState, entity: Entity) => void>;

    /**
     * Updates an entity by routing to the appropriate update function based on its type.
     * Uses data-oriented routing via Record lookup.
     * @param state - The current game state
     */
    export function update(state: GameState, entity: Entity): void {
        updateMap[entity.type](state, entity);
    }

    /**
     * Renders an entity by routing to the appropriate render function based on its type.
     * Uses data-oriented routing via Record lookup.
     * @param ctx - The 2D canvas rendering context
     * @param state - The current game state
     */
    export function render(ctx: CanvasRenderingContext2D, state: GameState, entity: Entity): void {
        renderMap[entity.type](ctx, state, entity);
    }
}



