import { GameMap } from "../map/map.js";
import { Canvas } from "./canvas.js";

export class Game {

    private static readonly MAP_WIDTH: number = 50;
    private static readonly MAP_HEIGHT: number = 50;

    private readonly _map: GameMap = new GameMap(this, Game.MAP_WIDTH, Game.MAP_HEIGHT);

    public constructor() {

    }

    public tick(): void {

    }

    public draw(canvas: Canvas): void {

    }

    public get map(): GameMap {
        return this._map;
    }
}

export class GameMenu {
    
}
