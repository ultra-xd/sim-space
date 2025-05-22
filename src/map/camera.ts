import { Vector2 } from "../data_structures/vector.js";
import { Game } from "../app/game.js";
import { assert, ease } from "../util/util.js";
import { App } from "../app/app.js";

/** Handles conversion of units and pixels and the viewport of the map. */
export class Camera {

    private _center: Vector2;
    public readonly _DEFAULT_PIXELS_PER_UNIT: number = 100;
    private _pixelsPerUnits: number = this._DEFAULT_PIXELS_PER_UNIT;

    private static readonly MIN_PIXELS_PER_UNIT: number = 20;
    private static readonly MAX_PIXELS_PER_UNIT: number = 500;

    private zoomAnimation: InstanceType<typeof Camera.ZoomAnimation> | null = null;
    private moveAnimation: InstanceType<typeof Camera.MoveAnimation> | null = null;
    private static readonly ZOOM_ANIMATION_LENGTH: number = 0.5;
    private static readonly MOVE_ANIMATION_LENGTH: number = 2;

    public readonly _DEFAULT_CENTER: Vector2;

    private isometric: boolean = true;

    /**
     * Initializes a camera.
     * @param _GAME The game the camera is looking at.
     */
    public constructor(private readonly _GAME: Game) {
        this._center = new Vector2(
            this._GAME.MAP.width / 2,
            this._GAME.MAP.height / 2
        );

        this._DEFAULT_CENTER = this._center;
    }

    /** Updates the camera. */
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

    /**
     * Adjusts the camera position.
     * @param difference The number of units to change the camera position by.
     */
    public adjustCamera(difference: Vector2): void {
        this._center = this._center.add(difference);
    }

    /**
     * Adjusts the camera zoom level.
     * @param difference The decimal ratio to adjust the zoom factor by.
     */
    public adjustZoom(difference: number): void {
        this._pixelsPerUnits *= (1 + difference);
    }

    /**
     * Converts pixels coordinates to unit coordinates on the map.
     * @param pixels The pixel coordinates to convert to.
     * @returns The corresponding coordinates on the map.
     */
    public pixelsToUnits(pixels: Vector2): Vector2 {
        const CENTER_PIXELS: Vector2 = new Vector2(
            App.CANVAS.width / 2,
            App.CANVAS.height / 2
        );

        const differencePixels: Vector2 = pixels.subtract(CENTER_PIXELS);
        differencePixels.y *= -1; // account for canvas starting from top left corner
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

    /**
     * Converts unit coordinates on the map to a pixel position on the canvas.
     * @param units The map coordinates.
     * @returns The corresponding location on the screen
     */
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

        differencePixels.y *= -1;

        return CENTER_PIXELS.add(differencePixels);
    }

    /**
     * Creates a new zoom animation on the map.
     * @param nextScale The zoom factor to zoom into.
     */
    public createZoomAnimation(nextScale: number): void {
        if (this.zoomAnimation != null || this.moveAnimation != null) return;

        this.zoomAnimation = new Camera.ZoomAnimation(
            this.pixelsPerUnit,
            nextScale,
            Camera.ZOOM_ANIMATION_LENGTH,
            App.TPS
        );
    }

    /** Updates the viewport according to the zoom animation. */
    public animateZoom(): void {
        if (this.zoomAnimation == null) return;

        assert (this.zoomAnimation != null);

        this._pixelsPerUnits = this.zoomAnimation.next();

        if (this.zoomAnimation.isCompleted()) {
            this.zoomAnimation = null;
        }
    }

    /**
     * Creates a new movement animation on the map
     * @param nextCenter The new center of the camera.
     * @param nextScale The zoom factor to zoom into.
     */
    public createMoveAnimation(nextCenter: Vector2, nextScale: number): void {
        if (this.zoomAnimation != null || this.moveAnimation != null) return;

        this.moveAnimation = new Camera.MoveAnimation(
            this._center,
            nextCenter,
            this.pixelsPerUnit,
            nextScale,
            Camera.MOVE_ANIMATION_LENGTH,
            App.TPS
        );
    }

    /** Updates the viewport according to the move animation. */
    public animateMove(): void {
        if (this.moveAnimation == null) return;

        assert (this.moveAnimation != null);

        this._pixelsPerUnits = this.moveAnimation.nextZoom();
        this._center = this.moveAnimation.nextPosition();

        if (this.moveAnimation.isCompleted()) {
            this.moveAnimation = null;
        }
    }

    /** Gets the number of pixels per cell. */
    public get pixelsPerUnit(): number {
        return this._pixelsPerUnits;
    }

    /** Gets the diagonal width of one cell, horizontally, when in isometric view. */
    public get isometricUnitWidth(): number {
        return this.pixelsPerUnit * Math.cos(Math.PI / 6) * 2;
    }

    /** Gets the diagonal height of one cell, vertically, when in isometric view. */
    public get isometricUnitHeight(): number {
        return this.pixelsPerUnit * Math.sin(Math.PI / 6) * 2;
    }
    
    /**
     * Determines if the camera viewport is in isometric mode.
     * @returns True if in isometric mode, false otherwise.
     */
    public isIsometric(): boolean {
        return this.isometric;
    }

    /** Switchs from top-down view and isometric view. */
    public switchView(): void {
        this.isometric = !this.isometric;
    }

    /**
     * Determines if the map is currently animating (zooming or moving)
     * @returns True if animating, false otherwise.
     */
    public isAnimating(): boolean {
        return this.zoomAnimation != null && this.moveAnimation != null;
    }

    /** Gets the center of the viewport. */
    public get center(): Vector2 {
        return this._center;
    }

    /** Gets the center of the viewport, by default. */
    public get DEFAULT_CENTER(): Vector2 {
        return this._DEFAULT_CENTER;
    }

    /** Gets the scale/zoom factor of the view port. by default. */
    public get DEFAULT_PIXELS_PER_UNIT(): number {
        return this._DEFAULT_PIXELS_PER_UNIT;
    }

    /** Handles a zoom animation. */
    private static ZoomAnimation = class {
        private completed: boolean = false;
        private readonly TOTAL_ANIMATED_TICKS: number;
        private readonly FINAL_TICK: number;
        private currentTick: number = 0;

        /**
         * Initializes zoom animation.
         * @param CURRENT_SCALE The current zoom scale of the viewport.
         * @param NEXT_SCALE The zoom scale to animate to.
         * @param duration The duration of the animation, in seconds.
         * @param TPS The number of ticks per second.
         */
        public constructor(
            private readonly CURRENT_SCALE: number,
            private readonly NEXT_SCALE: number,
            duration: number = 1,
            TPS: number = 60
        ) {
            this.TOTAL_ANIMATED_TICKS = duration * TPS;
            this.FINAL_TICK = Math.floor(this.TOTAL_ANIMATED_TICKS + 1);
        }

        /**
         * Gets the next zoom scale.
         * @returns The next zoom scale in the animation.
         */
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

        /**
         * Determines if the animation is completed or not.
         * @returns True if the animation is completed, false otherwise.
         */
        public isCompleted(): boolean {
            return this.completed;
        }
    }

    /** Handles a movement animation. */
    private static MoveAnimation = class {
        private readonly ZOOM_ANIMATION: InstanceType<typeof Camera.ZoomAnimation>;

        private currentTick: number = 0;
        private readonly TOTAL_ANIMATED_TICKS: number;
        private readonly FINAL_TICK: number;
        private completed: boolean = false;

        /**
         * Initializes movement animation.
         * @param CURRENT_CENTER The current center of the viewport.
         * @param NEXT_CENTER The new center to animate to.
         * @param CURRENT_SCALE The current zoom scale of the viewport.
         * @param NEXT_SCALE The zoom scale to animate to.
         * @param duration The duration of the animation, in seconds.
         * @param TPS The number of ticks per second.
         */
        public constructor(
            private readonly CURRENT_CENTER: Vector2,
            private readonly NEXT_CENTER: Vector2,
            private readonly CURRENT_SCALE: number,
            private readonly NEXT_SCALE: number,
            duration: number = 1,
            TPS: number = 60
        ) {
            this.ZOOM_ANIMATION = new Camera.ZoomAnimation(
                this.CURRENT_SCALE,
                this.NEXT_SCALE,
                duration,
                TPS
            );

            this.TOTAL_ANIMATED_TICKS = duration * TPS;
            this.FINAL_TICK = Math.floor(this.TOTAL_ANIMATED_TICKS + 1);
        }

        /**
         * Gets the next zoom scale.
         * @returns The next zoom scale in the animation.
         */
        public nextZoom(): number {
            return this.ZOOM_ANIMATION.next();
        }

        /**
         * Gets the next center of the viewport.
         * @returns The next center of the viewport.
         */
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
        
        /**
         * Determines if the animation is completed or not.
         * @returns True if the animation is completed, false otherwise.
         */
        public isCompleted(): boolean {
            return this.completed;
        }
    }
}
