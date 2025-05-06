import { Vector2 } from "../data_structures/vector.js";
import { Game } from "../app/game.js";
import { Canvas } from "../app/canvas.js";
import { App } from "../app/app.js";

export class Camera {

    private center: Vector2;
    private _pixelsPerUnits: number = 200;

    private static readonly MIN_PIXELS_PER_UNIT: number = 50;
    private static readonly MAX_PIXELS_PER_UNIT: number = 500;

    public constructor(private readonly game: Game) {
        // this.center = new Vector2(
        //     this.game.MAP.width / 2,
        //     this.game.MAP.height / 2
        // );

        this.center = new Vector2(50, 50);
    }

    public tick(): void {
        if (this._pixelsPerUnits < Camera.MIN_PIXELS_PER_UNIT) {
            this._pixelsPerUnits = Camera.MIN_PIXELS_PER_UNIT;
        }

        if (this._pixelsPerUnits > Camera.MAX_PIXELS_PER_UNIT) {
            this._pixelsPerUnits = Camera.MAX_PIXELS_PER_UNIT;
        }
    }

    public adjustCamera(pixelDifference: Vector2): void {
        const UNIT_DIFFERENCE: Vector2 = pixelDifference.divide(this._pixelsPerUnits);
        UNIT_DIFFERENCE.y = UNIT_DIFFERENCE.y * -1;

        this.center = this.center.add(UNIT_DIFFERENCE);
    }

    public pixelsToUnits(pixels: Vector2): Vector2 {
        const CENTER_PIXELS: Vector2 = new Vector2(
            App.CANVAS.width / 2,
            App.CANVAS.height / 2
        );

        const DIFFERENCE_PIXELS: Vector2 = pixels.subtract(CENTER_PIXELS);
        let differenceUnits: Vector2 = DIFFERENCE_PIXELS.divide(this._pixelsPerUnits);
        differenceUnits.y = differenceUnits.y * -1;

        return this.center.add(differenceUnits);
    }

    public unitsToPixels(units: Vector2): Vector2 {
        const CENTER_PIXELS: Vector2 = new Vector2(
            App.CANVAS.width / 2,
            App.CANVAS.height / 2
        );

        const DIFFERENCE_UNITS: Vector2 = units.subtract(this.center);
        let differencePixels: Vector2 = DIFFERENCE_UNITS.multiply(this._pixelsPerUnits);
        differencePixels.y = differencePixels.y * -1;

        return CENTER_PIXELS.add(differencePixels);
    }

    public get pixelsPerUnit(): number {
        return this._pixelsPerUnits;
    }
}