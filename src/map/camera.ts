import { Vector2 } from "../data_structures/vector.js";
import { Game } from "../app/game.js";
import { Canvas } from "../app/canvas.js";
import { App } from "../app/app.js";

export class Camera {

    private center: Vector2;
    private _pixelsPerUnits: number = 200;

    private static readonly MIN_PIXELS_PER_UNIT: number = 50;
    private static readonly MAX_PIXELS_PER_UNIT: number = 500;

    private isometric: boolean = true;

    public constructor(private readonly game: Game) {
        this.center = new Vector2(
            this.game.MAP.width / 2,
            this.game.MAP.height / 2
        );

        // this.center = new Vector2(2, 1);
    }

    public tick(): void {
        if (this._pixelsPerUnits < Camera.MIN_PIXELS_PER_UNIT) {
            this._pixelsPerUnits = Camera.MIN_PIXELS_PER_UNIT;
        }

        if (this._pixelsPerUnits > Camera.MAX_PIXELS_PER_UNIT) {
            this._pixelsPerUnits = Camera.MAX_PIXELS_PER_UNIT;
        }
    }

    public adjustCamera(difference: Vector2): void {
        this.center = this.center.add(difference);
    }

    public adjustZoom(difference: number): void {
        this._pixelsPerUnits *= (1 + difference);
    }

    public pixelsToUnits(pixels: Vector2): Vector2 {
        const CENTER_PIXELS: Vector2 = new Vector2(
            App.CANVAS.width / 2,
            App.CANVAS.height / 2
        );

        const differencePixels: Vector2 = pixels.subtract(CENTER_PIXELS);
        differencePixels.y = differencePixels.y * -1; // account for canvas starting from top left corner
        let differenceUnits: Vector2;

        if (this.isometric) {
            const ISOMETRIC_DIFFERENCE_PIXELS: Vector2 = new Vector2(
                Math.sqrt(3) / 3 * differencePixels.x + differencePixels.y,
                differencePixels.y - Math.sqrt(3) / 3 * differencePixels.x
            );

            differenceUnits = ISOMETRIC_DIFFERENCE_PIXELS.divide(this._pixelsPerUnits);
        } else {
            differenceUnits = differencePixels.divide(this._pixelsPerUnits);
        }

        return this.center.add(differenceUnits);
    }

    public unitsToPixels(units: Vector2): Vector2 {
        const CENTER_PIXELS: Vector2 = new Vector2(
            App.CANVAS.width / 2,
            App.CANVAS.height / 2
        );

        const DIFFERENCE_UNITS: Vector2 = units.subtract(this.center);

        let differencePixels: Vector2

        if (this.isometric) {
            //
            const ISOMETRIC_DIFFERENCE_PIXELS = DIFFERENCE_UNITS.multiply(this._pixelsPerUnits);
            differencePixels = new Vector2(
                Math.sqrt(3) / 2 * (ISOMETRIC_DIFFERENCE_PIXELS.x - ISOMETRIC_DIFFERENCE_PIXELS.y),
                0.5 * (ISOMETRIC_DIFFERENCE_PIXELS.x + ISOMETRIC_DIFFERENCE_PIXELS.y)
            );
        } else {
            differencePixels = DIFFERENCE_UNITS.multiply(this._pixelsPerUnits);
        }

        differencePixels.y = differencePixels.y * -1;

        return CENTER_PIXELS.add(differencePixels);
    }

    public get pixelsPerUnit(): number {
        return this._pixelsPerUnits;
    }

    public isIsometric(): boolean {
        return this.isometric;
    }

    public switchView(): void {
        this.isometric = !this.isometric;
    }
}