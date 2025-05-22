import { Canvas } from "./canvas.js";
import { Vector2 } from "../data_structures/vector.js";

export enum MouseEvent {
    LMB = 0,
    MMB = 1,
    RMB = 2,
    MOUSE_SCROLL_UP = 3,
    MOUSE_SCROLL_DOWN = 4
}

export enum KeyEvent {
    ESCAPE = "escape",
    SHIFT = "shift"
}

type MouseEventMap = Map<number, boolean>;
type KeyEventMap = Map<string, boolean>;

export class Controller {

    private readonly MOUSE_EVENTS: MouseEventMap = new Map<number, boolean>();
    private readonly MOUSE_CLICK_EVENTS: MouseEventMap = new Map<number, boolean>();
    private readonly KEY_EVENTS: KeyEventMap = new Map<string, boolean>();
    private readonly KEY_PRESS_EVENTS: KeyEventMap = new Map<string, boolean>();

    private _currentMousePosition: Vector2 | null = null;
    private _previousMousePosition: Vector2 | null = null;

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

    public setup(): void {
        document.body.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        this.setupMouseEvents();
        this.setupKeyEvents();
    }

    private setupMouseEvents(): void {
        this.CANVAS.HTMLElement.addEventListener("mousedown", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const CODE: number = event.button;

            if (this.MOUSE_EVENTS.has(CODE) && this.MOUSE_CLICK_EVENTS.has(CODE)) {
                this.MOUSE_EVENTS.set(CODE, true);
                this.MOUSE_CLICK_EVENTS.set(CODE, true);
            }
        });

        this.CANVAS.HTMLElement.addEventListener("mouseup", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const CODE: number = event.button;

            if (this.MOUSE_EVENTS.has(CODE) && this.MOUSE_CLICK_EVENTS.has(CODE)) {
                this.MOUSE_EVENTS.set(CODE, false);
                this.MOUSE_CLICK_EVENTS.set(CODE, false);
            }
        });

        document.body.addEventListener("mousemove", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const RECT: DOMRect = document.body.getBoundingClientRect();
            this._currentMousePosition = new Vector2(
                event.clientX - RECT.left,
                event.clientY - RECT.top
            );
        });

        document.body.addEventListener("wheel", (event) => {
            let scroll: number = event.deltaY;
            
            if (scroll > 0) {
                this.MOUSE_EVENTS.set(MouseEvent.MOUSE_SCROLL_DOWN, true);
            } else if (scroll < 0) {
                this.MOUSE_EVENTS.set(MouseEvent.MOUSE_SCROLL_UP, true);
            }
        });
    }

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

    public mouseToggled(event: MouseEvent): boolean {
        return this.MOUSE_EVENTS.get(event) ?? false;
    }

    public mouseClickToggled(event: MouseEvent): boolean {
        return this.MOUSE_CLICK_EVENTS.get(event) ?? false;
    }

    public keyToggled(event: KeyEvent): boolean {
        return this.KEY_EVENTS.get(event) ?? false;
    }

    public keyPressToggled(event: KeyEvent): boolean {
        return this.KEY_PRESS_EVENTS.get(event) ?? false;
    }

    public get currentMousePosition(): Vector2 | null {
        return this._currentMousePosition;
    }

    public get previousMousePosition(): Vector2 | null {
        return this._previousMousePosition;
    }
}
