import { Canvas } from "./canvas.js";
import { Vector2 } from "../data_structures/vector.js";

/** Enum storing all mouse buttons the game will need. */
export enum MouseEvent {
    LMB = 0,
    MMB = 1,
    RMB = 2,
    MOUSE_SCROLL_UP = 3,
    MOUSE_SCROLL_DOWN = 4
}

/** Enum storing all keys on the keyboard the game will need. */
export enum KeyEvent {
    ESCAPE = "escape",
    SHIFT = "shift"
}

type MouseEventMap = Map<number, boolean>;
type KeyEventMap = Map<string, boolean>;

/** Handles and tracks all key events. */
export class Controller {

    private readonly MOUSE_EVENTS: MouseEventMap = new Map<number, boolean>();
    private readonly MOUSE_CLICK_EVENTS: MouseEventMap = new Map<number, boolean>();
    private readonly KEY_EVENTS: KeyEventMap = new Map<string, boolean>();
    private readonly KEY_PRESS_EVENTS: KeyEventMap = new Map<string, boolean>();

    private _currentMousePosition: Vector2 | null = null;
    private _previousMousePosition: Vector2 | null = null;

    /**
     * Initializes a controller.
     * @param CANVAS The canvas for which the mouse events are tracked.
     */
    public constructor(private readonly CANVAS: Canvas) {
        for (let i: number = 0; i < Object.keys(MouseEvent).length; i++) {
            this.MOUSE_EVENTS.set(i, false);
            this.MOUSE_CLICK_EVENTS.set(i, false);
        }

        for (let keyEvent of Object.keys(KeyEvent)) {
            this.KEY_EVENTS.set(keyEvent.toLowerCase(), false);
            this.KEY_PRESS_EVENTS.set(keyEvent.toLowerCase(), false);
        }
    }

    /** Sets up all event listeners. */
    public setup(): void {
        // Prevent the right click menu from opening
        document.body.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        this.setupMouseEvents();
        this.setupKeyEvents();
    }

    /** Sets up all mouse event listeners. */
    private setupMouseEvents(): void {
        // Connect mouse down event listener (press)
        this.CANVAS.HTMLElement.addEventListener("mousedown", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            // Get button clicked on mouse
            const CODE: number = event.button;

            // Store that mouse button has been clicked
            if (this.MOUSE_EVENTS.has(CODE) && this.MOUSE_CLICK_EVENTS.has(CODE)) {
                this.MOUSE_EVENTS.set(CODE, true);
                this.MOUSE_CLICK_EVENTS.set(CODE, true);
            }
        });

        // Connect mouse up event listener (release)
        this.CANVAS.HTMLElement.addEventListener("mouseup", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            // Get button released on mouse
            const CODE: number = event.button;

            // Store that mouse button has been released
            if (this.MOUSE_EVENTS.has(CODE) && this.MOUSE_CLICK_EVENTS.has(CODE)) {
                this.MOUSE_EVENTS.set(CODE, false);
                this.MOUSE_CLICK_EVENTS.set(CODE, false);
            }
        });

        // Connect mouse movement even listener
        document.body.addEventListener("mousemove", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            // Store current mouse position
            const RECT: DOMRect = document.body.getBoundingClientRect();
            this._currentMousePosition = new Vector2(
                event.clientX - RECT.left,
                event.clientY - RECT.top
            );
        });

        // Connect mouse wheel event listener
        document.body.addEventListener("wheel", (event) => {
            // Store scroll value
            let scroll: number = event.deltaY;
            
            // Change mouse scroll values in mouse event map
            if (scroll > 0) {
                this.MOUSE_EVENTS.set(MouseEvent.MOUSE_SCROLL_DOWN, true);
            } else if (scroll < 0) {
                this.MOUSE_EVENTS.set(MouseEvent.MOUSE_SCROLL_UP, true);
            }
        });
    }

    /** Sets up all key event listeners. */
    private setupKeyEvents(): void {
        document.body.addEventListener("keydown", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const CODE: string = event.key.toLowerCase();
            if (this.KEY_EVENTS.has(CODE) && this.KEY_PRESS_EVENTS.has(CODE)) {
                this.KEY_EVENTS.set(CODE, true);
                this.KEY_PRESS_EVENTS.set(CODE, true);
            }
        });

        document.body.addEventListener("keyup", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const CODE: string = event.key.toLowerCase();
            if (this.KEY_EVENTS.has(CODE) && this.KEY_PRESS_EVENTS.has(CODE)) {
                this.KEY_EVENTS.set(CODE, false);
                this.KEY_PRESS_EVENTS.set(CODE, false);
            }
        });
    }

    /** Updates all mouse and key events. */
    public tick(): void {
        this._previousMousePosition = this._currentMousePosition;
        this.MOUSE_EVENTS.set(MouseEvent.MOUSE_SCROLL_DOWN, false);
        this.MOUSE_EVENTS.set(MouseEvent.MOUSE_SCROLL_UP, false);

        for (let i: number = 0; i < Object.keys(MouseEvent).length; i++) {
            this.MOUSE_CLICK_EVENTS.set(i, false);
        }

        for (let keyEvent of Object.keys(KeyEvent)) {
            this.KEY_PRESS_EVENTS.set(keyEvent.toLowerCase(), false);
        }
    }

    /**
     * Tracks if a mouse button is being pressed.
     * @param event The mouse button being tracked.
     * @returns True if the mouse button is pressed, false otherwise.
     */
    public mouseToggled(event: MouseEvent): boolean {
        return this.MOUSE_EVENTS.get(event) ?? false;
    }

    /**
     * Tracks if a mouse button has just been pressed (i.e it is pressed but not held down).
     * @param event The mouse button being tracked.
     * @returns True if the mouse button has just been pressed, false otherwise.
     */
    public mouseClickToggled(event: MouseEvent): boolean {
        return this.MOUSE_CLICK_EVENTS.get(event) ?? false;
    }

    /**
     * Tracks if a key is being pressed.
     * @param event The key being tracked.
     * @returns True if the key is pressed, false otherwise.
     */
    public keyToggled(event: KeyEvent): boolean {
        return this.KEY_EVENTS.get(event) ?? false;
    }

    /**
     * Tracks if a key has just been pressed (i.e it is pressed but not held down).
     * @param event The key being tracks
     * @returns true if the key has just been pressed, false otherwise.
     */
    public keyPressToggled(event: KeyEvent): boolean {
        return this.KEY_PRESS_EVENTS.get(event) ?? false;
    }

    /** Gets the current cursor position relative to the canvas. */
    public get currentMousePosition(): Vector2 | null {
        return this._currentMousePosition;
    }

    /** Gets the cursor position of the mouse on the last tick relative to the canvas. */
    public get previousMousePosition(): Vector2 | null {
        return this._previousMousePosition;
    }
}
