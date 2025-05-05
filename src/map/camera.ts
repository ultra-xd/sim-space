import { Vector2 } from "../data_structures/vector.js";
import { Game } from "../app/game.js";

export class Camera {

    private center: Vector2;
    private pixelsPerUnits: number = 200;

    private static readonly MIN_PIXELS_PER_UNIT: number = 50;
    private static readonly MAX_PIXELS_PER_UNIT: number = 500;

    public constructor(private readonly game: Game) {
        this.center = new Vector2(
            this.game.map.width / 2,
            this.game.map.height / 2
        );
    }

    public tick(): void {
        if (this.pixelsPerUnits < Camera.MIN_PIXELS_PER_UNIT) {
            this.pixelsPerUnits = Camera.MIN_PIXELS_PER_UNIT;
        }

        if (this.pixelsPerUnits > Camera.MAX_PIXELS_PER_UNIT) {
            this.pixelsPerUnits = Camera.MAX_PIXELS_PER_UNIT;
        }
    }

    public adjustCamera(pixelDifference: Vector2): void {
        const UNIT_DIFFERENCE: Vector2 = pixelDifference.divide(this.pixelsPerUnits);
        UNIT_DIFFERENCE.y = UNIT_DIFFERENCE.y * -1;

        this.center = this.center.add(UNIT_DIFFERENCE);
    }
}