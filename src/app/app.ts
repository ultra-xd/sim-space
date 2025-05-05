import { Game } from "./game.js";
import { StartMenu } from "./start_menu.js";
import { Canvas } from "./canvas.js";
import { ArrayList } from "../data_structures/arraylist.js";
import { Vector2 } from "../data_structures/vector.js";

export enum AppState {
    IN_GAME,
    START_MENU
}

export class App {
    private GAME: Game = new Game();
    private readonly START_MENU: StartMenu = new StartMenu();
    private readonly _CANVAS: Canvas;

    private appState: AppState = AppState.IN_GAME;

    private intervalLoop: number;
    private static readonly _TPS: number = 60;

    private readonly MOUSE_EVENTS: ArrayList<{pressed: boolean, code: number}> = new ArrayList<{pressed: boolean, code: number}>();
    private readonly KEY_EVENTS: ArrayList<{pressed: boolean, code: number}> = new ArrayList<{pressed: boolean, code: number}>();

    private currentMousePosition: Vector2 | null = null;
    private previousMousePosition: Vector2 | null = null;

    public constructor(canvasId: string) {
        this._CANVAS = new Canvas(canvasId);
        this.setup();
        this.start();
    }

    public setup(): void {
        document.body.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        document.body.addEventListener("mousedown", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const CODE: number = event.button;
            const EVENT: {pressed: boolean, code: number} = {
                pressed: true,
                code: CODE
            };

            if (!this.MOUSE_EVENTS.contains(EVENT)) {
                this.MOUSE_EVENTS.add(EVENT);
            }
        });

        document.body.addEventListener("mouseup", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const CODE: number = event.button;
            const EVENT: {pressed: boolean, code: number} = {
                pressed: false,
                code: CODE
            };

            if (!this.MOUSE_EVENTS.contains(EVENT)) {
                this.MOUSE_EVENTS.add(EVENT);
            }
        });

        document.body.addEventListener("mousemove", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            this.previousMousePosition = this.currentMousePosition;

            const RECT: DOMRect = document.body.getBoundingClientRect();
            this.currentMousePosition = new Vector2(
                event.clientX - RECT.left,
                event.clientY - RECT.top
            );
        });

        document.body.addEventListener("wheel", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            // temp

            event.preventDefault();
        });

        document.body.addEventListener("keydown", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const CODE: number = event.key.toLowerCase().charCodeAt(0);
            const EVENT: {pressed: boolean, code: number} = {
                pressed: true,
                code: CODE
            };

            if (!this.KEY_EVENTS.contains(EVENT)) {
                this.KEY_EVENTS.add(EVENT);
            }
        });

        document.body.addEventListener("keyup", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const CODE: number = event.key.toLowerCase().charCodeAt(0);
            const EVENT: {pressed: boolean, code: number} = {
                pressed: false,
                code: CODE
            };

            if (!this.KEY_EVENTS.contains(EVENT)) {
                this.KEY_EVENTS.add(EVENT);
            }
        });
    }

    private start(): void {
        this.intervalLoop = setInterval(() => {
            this.mainloop();
        }, 1000 / App.TPS);
    }

    private mainloop(): void {
        this.tick();
        this.draw();
    }

    public end(): void {
        clearInterval(this.intervalLoop);
    }

    private tick(): void {
        if (this.appState == AppState.IN_GAME) {
            this.GAME.tick();
        } else if (this.appState == AppState.START_MENU) {
            this.START_MENU.tick();
        }

        this.KEY_EVENTS.clear();
        this.MOUSE_EVENTS.clear();

        this.CANVAS.tick();
    }

    private draw(): void {
        if (this.appState == AppState.IN_GAME) {
            this.GAME.draw(this.CANVAS);
        } else if (this.appState == AppState.START_MENU) {
            this.START_MENU.draw(this.CANVAS);
        }

        // for testing
        this.CANVAS.drawLine(
            new Vector2(0, 0),
            new Vector2(100, 100),
            "black",
            1
        );
    }

    public static get TPS(): number {
        return App._TPS;
    }

    public get CANVAS(): Canvas {
        return this._CANVAS;
    }

    public get mouseEvents(): {pressed: boolean, code: number}[] {
        return this.MOUSE_EVENTS.getArray();
    }

    public get keyEvents(): {pressed: boolean, code: number}[] {
        return this.KEY_EVENTS.getArray();
    }
}