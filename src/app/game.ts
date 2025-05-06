import { GameMap } from "../map/map.js";
import { Canvas } from "./canvas.js";
import { Vector2 } from "../data_structures/vector.js";
import { Camera } from "../map/camera.js";
import { App } from "./app.js";

export class Game {

    private static readonly MAP_WIDTH: number = 50;
    private static readonly MAP_HEIGHT: number = 50;

    private readonly _MAP: GameMap = new GameMap(this, Game.MAP_WIDTH, Game.MAP_HEIGHT);
    private readonly CAMERA: Camera = new Camera(this);

    public constructor() {}

    public tick(): void {
        if (
            App.currentMousePosition != null &&
            App.previousMousePosition != null &&
            App.mouseEvents.contains(0)
        ) {
            const UNITS_CHANGE = this.CAMERA.pixelsToUnits(App.previousMousePosition).subtract(
                this.CAMERA.pixelsToUnits(App.currentMousePosition)
            );
            
            this.CAMERA.adjustCamera(UNITS_CHANGE);
        }

        this._MAP.tick();
    }

    public draw(canvas: Canvas): void {
        // testing
        canvas.fillRect(
            new Vector2(canvas.width / 2, canvas.height / 2),
            canvas.width,
            canvas.height,
            "rgb(0, 255, 0)",
        );

        this.MAP.draw(canvas, this.CAMERA);
    }

    public get MAP(): GameMap {
        return this._MAP;
    }
}

export class GameMenu {
    
}
