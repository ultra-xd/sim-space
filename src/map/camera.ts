import { Vector2 } from "../data_structures/vector.js";
import { Game } from "../app/game.js";
import { assert, ease } from "../util/util.js";
import { App } from "../app/app.js";

export class Camera {

    private _center: Vector2;
    public readonly _DEFAULT_PIXELS_PER_UNIT: number = 200;
    private _pixelsPerUnits: number = this._DEFAULT_PIXELS_PER_UNIT;

    private static readonly MIN_PIXELS_PER_UNIT: number = 20;
    private static readonly MAX_PIXELS_PER_UNIT: number = 500;

    private zoomAnimation: ZoomAnimation | null = null;
    private moveAnimation: MoveAnimation | null = null;
    private static readonly ZOOM_ANIMATION_LENGTH: number = 0.5;
    private static readonly MOVE_ANIMATION_LENGTH: number = 2;

    public readonly _DEFAULT_CENTER: Vector2;

    private isometric: boolean = true;

    public constructor(private readonly game: Game) {
        this._center = new Vector2(
            this.game.MAP.width / 2,
            this.game.MAP.height / 2
        );

        this._DEFAULT_CENTER = this._center;
    }

    public tick(): void {
        this.animateZoom();
        this.animateMove();

        if (this._pixelsPerUnits < Camera.MIN_PIXELS_PER_UNIT) {
            this._pixelsPerUnits = Camera.MIN_PIXELS_PER_UNIT;
        }

        if (this._pixelsPerUnits > Camera.MAX_PIXELS_PER_UNIT) {
            this._pixelsPerUnits = Camera.MAX_PIXELS_PER_UNIT;
        }
    }

    public adjustCamera(difference: Vector2): void {
        this._center = this._center.add(difference);
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

        return this._center.add(differenceUnits);
    }

    public unitsToPixels(units: Vector2): Vector2 {
        const CENTER_PIXELS: Vector2 = new Vector2(
            App.CANVAS.width / 2,
            App.CANVAS.height / 2
        );

        const DIFFERENCE_UNITS: Vector2 = units.subtract(this._center);

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

    public createZoomAnimation(nextScale: number): void {
        if (this.zoomAnimation != null || this.moveAnimation != null) return;

        this.zoomAnimation = new ZoomAnimation(
            this.pixelsPerUnit,
            nextScale,
            Camera.ZOOM_ANIMATION_LENGTH,
            App.TPS
        );
    }

    public animateZoom(): void {
        if (this.zoomAnimation == null) return;

        assert (this.zoomAnimation != null);

        this._pixelsPerUnits = this.zoomAnimation.next();

        if (this.zoomAnimation.isCompleted()) {
            this.zoomAnimation = null;
        }
    }

    public createMoveAnimation(nextCenter: Vector2, nextScale: number): void {
        if (this.zoomAnimation != null || this.moveAnimation != null) return;

        this.moveAnimation = new MoveAnimation(
            this._center,
            nextCenter,
            this.pixelsPerUnit,
            nextScale,
            Camera.MOVE_ANIMATION_LENGTH,
            App.TPS
        );
    }

    public animateMove(): void {
        if (this.moveAnimation == null) return;

        assert (this.moveAnimation != null);

        this._pixelsPerUnits = this.moveAnimation.nextZoom();
        this._center = this.moveAnimation.nextPosition();

        if (this.moveAnimation.isCompleted()) {
            this.moveAnimation = null;
        }
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

    public isAnimating(): boolean {
        return this.zoomAnimation != null && this.moveAnimation != null;
    }

    public get center(): Vector2 {
        return this._center;
    }

    public get DEFAULT_CENTER(): Vector2 {
        return this._DEFAULT_CENTER;
    }

    public get DEFAULT_PIXELS_PER_UNIT(): number {
        return this._DEFAULT_PIXELS_PER_UNIT;
    }
}

class ZoomAnimation {

    private completed: boolean = false;
    private readonly TOTAL_ANIMATED_TICKS: number;
    private readonly FINAL_TICK: number;
    private currentTick: number = 0;

    public constructor(
        private readonly CURRENT_SCALE: number,
        private readonly NEXT_SCALE: number,
        duration: number = 1,
        TPS: number = 60
    ) {
        this.TOTAL_ANIMATED_TICKS = duration * TPS;
        this.FINAL_TICK = Math.floor(this.TOTAL_ANIMATED_TICKS + 1);
    }

    public next(): number {
        if (this.completed) {
            throw new Error("animation already completed");
        }

        this.currentTick++;
        if (this.currentTick == this.FINAL_TICK) {
            this.completed = true;
            return this.NEXT_SCALE;
        }

        const a: number = (this.NEXT_SCALE - this.CURRENT_SCALE) / this.TOTAL_ANIMATED_TICKS;
        const c: number = this.CURRENT_SCALE;

        return a * ease(this.currentTick, 0, this.TOTAL_ANIMATED_TICKS) + c;
    }

    public isCompleted(): boolean {
        return this.completed;
    }
}

class MoveAnimation {
    private readonly ZOOM_ANIMATION: ZoomAnimation;

    private currentTick: number = 0;
    private readonly TOTAL_ANIMATED_TICKS: number;
    private readonly FINAL_TICK: number;
    private completed: boolean = false;

    public constructor(
        private readonly CURRENT_CENTER: Vector2,
        private readonly NEXT_CENTER: Vector2,
        private readonly CURRENT_SCALE: number,
        private readonly NEXT_SCALE: number,
        duration: number = 1,
        TPS: number = 60
    ) {
        this.ZOOM_ANIMATION = new ZoomAnimation(
            this.CURRENT_SCALE,
            this.NEXT_SCALE,
            duration,
            TPS
        );

        this.TOTAL_ANIMATED_TICKS = duration * TPS;
        this.FINAL_TICK = Math.floor(this.TOTAL_ANIMATED_TICKS + 1);
    }

    public nextZoom(): number {
        return this.ZOOM_ANIMATION.next();
    }

    public nextPosition(): Vector2 {
        if (this.completed) {
            throw new Error("animation already completed");
        }

        this.currentTick++;
        if (this.currentTick == this.FINAL_TICK) {
            this.completed = true;
            return this.NEXT_CENTER;
        }

        const ax: number = (this.NEXT_CENTER.x - this.CURRENT_CENTER.x) / this.TOTAL_ANIMATED_TICKS;
        const cx: number = this.CURRENT_CENTER.x;

        const ay: number = (this.NEXT_CENTER.y - this.CURRENT_CENTER.y) / this.TOTAL_ANIMATED_TICKS;
        const cy: number = this.CURRENT_CENTER.y;

        return new Vector2(
            ax * ease(this.currentTick, 0, this.TOTAL_ANIMATED_TICKS) + cx,
            ay * ease(this.currentTick, 0, this.TOTAL_ANIMATED_TICKS) + cy
        );
    }

    public isCompleted(): boolean {
        return this.completed;
    }
}
