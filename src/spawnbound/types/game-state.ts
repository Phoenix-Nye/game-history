import { Entity } from "./entity"
import { Player } from "./player";
import { Shark } from "./shark";
import { Squid } from "./squid";

export type GameState = {
    entities: Entity[];
    // map
    // timer
    // paused
}

export namespace GameState {
    /**
     * Creates and returns an initial game state.
     * Use this function to initialize the game state at startup.
     * Initializes with a player and several random sharks and squids.
     */
    export function initialize(): GameState {
        const entities: Entity[] = [];
        const canvasWidth = 800;
        const canvasHeight = 600;

        // Create player at center of canvas
        const player: Player = {
            type: "player",
            position: [canvasWidth / 2, canvasHeight / 2],
            hp: 100,
        };
        entities.push(player);

        // Create random sharks
        const numSharks = 5;
        for (let i = 0; i < numSharks; i++) {
            const shark: Shark = {
                type: "shark",
                position: [Math.random() * canvasWidth, Math.random() * canvasHeight],
                hp: 50,
            };
            entities.push(shark);
        }

        // Create random squids
        const numSquids = 5;
        for (let i = 0; i < numSquids; i++) {
            const squid: Squid = {
                type: "squid",
                position: [Math.random() * canvasWidth, Math.random() * canvasHeight],
                hp: 30,
            };
            entities.push(squid);
        }

        return {
            entities,
        };
    }
}