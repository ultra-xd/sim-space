import { Vector2 } from "../data_structures/vector.js";
import { Game } from "../app/game.js";
import { assert, ease } from "../util/util.js";
import { App } from "../app/app.js";

/** Handles conversion of units and pixels and the viewport of the map. */
export class Camera {
    public readonly _DEFAULT_CENTER: Vector2;
    private _center: Vector2; // Stores the center of the viewport
    public readonly _DEFAULT_PIXELS_PER_UNIT: number = 100; // Stores the default zoom scale of the viewport
    private _pixelsPerUnits: number = this._DEFAULT_PIXELS_PER_UNIT; // Stores the zoom scale of the viewport

    // Store maximum and minimum zoom scale
    private static readonly MIN_PIXELS_PER_UNIT: number = 20;
    private static readonly MAX_PIXELS_PER_UNIT: number = 500;

    // Store any animations occuring and their animation length, in seconds
    private zoomAnimation: InstanceType<typeof Camera.ZoomAnimation> | null = null;
    private moveAnimation: InstanceType<typeof Camera.MoveAnimation> | null = null;
    private static readonly ZOOM_ANIMATION_LENGTH: number = 0.5;
    private static readonly MOVE_ANIMATION_LENGTH: number = 2;

    // Stores whether a top-down or isometric view is used
    private isometric: boolean = true;

    /**
     * Initializes a camera.
     * @param _GAME The game the camera is looking at.
     */
    public constructor(private readonly _GAME: Game) {
        // Set viewport to be center of map
        this._center = new Vector2(
            this._GAME.MAP.width / 2,
            this._GAME.MAP.height / 2
        );

        this._DEFAULT_CENTER = this._center;
    }

    /** Updates the camera. */
    public tick(): void {
        // Update animations
        this.animateZoom();
        this.animateMove();

        // Update zooms if they are outside of bounds
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
        // Get the center of the screen in pixels
        const CENTER_PIXELS: Vector2 = new Vector2(
            App.CANVAS.width / 2,
            App.CANVAS.height / 2
        );

        // Get the difference between the center and the pixels specified
        const differencePixels: Vector2 = pixels.subtract(CENTER_PIXELS);
        differencePixels.y *= -1; // Account for canvas  coordinates starting from top left corner
        let differenceUnits: Vector2;

        /* Calculate the difference between the coordinates of the map at the center
        of the screen and the coordinates of the map at the specified pixels.
        Adjust based on whether the viewport is isometric or top-down
        */
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
        // Get the center of the screen in pixels
        const CENTER_PIXELS: Vector2 = new Vector2(
            App.CANVAS.width / 2,
            App.CANVAS.height / 2
        );

        // Get the difference between the center of the viewport and the specified coordinates 
        const DIFFERENCE_UNITS: Vector2 = units.subtract(this._center);
        let differencePixels: Vector2

        /* Calculate the difference between the center of the screen and the pixel coordinates
        of the coordinates of the map. Adjust based on whether the viewport is isometric or not */
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

        differencePixels.y *= -1; // Account for canvas  coordinates starting from top left corner

        return CENTER_PIXELS.add(differencePixels);
    }

    /**
     * Creates a new zoom animation on the map.
     * @param nextScale The zoom factor to zoom into.
     */
    public createZoomAnimation(nextScale: number): void {
        // Don't create new animation if already animating
        if (this.isAnimating()) return;

        this.zoomAnimation = new Camera.ZoomAnimation(
            this.pixelsPerUnit,
            nextScale,
            Camera.ZOOM_ANIMATION_LENGTH,
            App.TPS
        );
    }

    /** Updates the viewport according to the zoom animation. */
    public animateZoom(): void {
        // Make sure zoom animation exist
        if (this.zoomAnimation == null) return;

        // Adjust zoom level
        this._pixelsPerUnits = this.zoomAnimation.next();

        // Delete zoom animation if completed
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
        // Don't create new animation if already animating
        if (this.isAnimating()) return;

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
        // Make sure move animation exists
        if (this.moveAnimation == null) return;

        // Adjust viewport center & zoom
        [this._center, this._pixelsPerUnits] = this.moveAnimation.next();

        // Delete move animation if completed
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
        return this.zoomAnimation != null || this.moveAnimation != null;
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
        private completed: boolean = false; // Store whether animation is complete or not.
        private readonly TOTAL_ANIMATED_TICKS: number; // Store total length of animation in ticks (can be decimal)
        private readonly FINAL_TICK: number; // Store final tick of animation
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
            // Don't animate if animation is complete
            if (this.completed) {
                throw new Error("Zoom animation already completed");
            }

            // Tick and check if completed. If so, return final scale
            this.currentTick++;
            if (this.currentTick == this.FINAL_TICK) {
                this.completed = true;
                return this.NEXT_SCALE;
            }

            // Use linear interpolation and ease function to determine next scale
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

        private completed: boolean = false; // Store whether animation is complete or not.
        private readonly TOTAL_ANIMATED_TICKS: number; // Store total length of animation in ticks (can be decimal)
        private readonly FINAL_TICK: number; // Store final tick of animation
        private currentTick: number = 0;

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
            // Create zoom animation
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
         * Gets the next center and zoom scale.
         * @returns A tuple containing the next center and zoom scale.
         */
        public next(): [Vector2, number] {
            // Don't animate if animation is complete
            if (this.completed) {
                throw new Error("Move animation already completed");
            }

            // Tick and check if completed. If so, return final center of viewport & final scale
            this.currentTick++;
            if (this.currentTick == this.FINAL_TICK) {
                this.completed = true;
                return [this.NEXT_CENTER, this.ZOOM_ANIMATION.next()];
            }

            // Use linear interpolation & ease function to determine next center
            const ax: number = (this.NEXT_CENTER.x - this.CURRENT_CENTER.x) / this.TOTAL_ANIMATED_TICKS;
            const cx: number = this.CURRENT_CENTER.x;

            const ay: number = (this.NEXT_CENTER.y - this.CURRENT_CENTER.y) / this.TOTAL_ANIMATED_TICKS;
            const cy: number = this.CURRENT_CENTER.y;

            // Return next center and next zoom scale based on zoom animation
            return [new Vector2(
                ax * ease(this.currentTick, 0, this.TOTAL_ANIMATED_TICKS) + cx,
                ay * ease(this.currentTick, 0, this.TOTAL_ANIMATED_TICKS) + cy
            ), this.ZOOM_ANIMATION.next()];
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
