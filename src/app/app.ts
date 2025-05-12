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
    private static GAME: Game = new Game();
    private static readonly START_MENU: StartMenu = new StartMenu();
    private static readonly _CANVAS: Canvas = new Canvas("canvas");

    private static appState: AppState = AppState.IN_GAME;

    private static intervalLoop: number;
    private static readonly _TPS: number = 60;

    private static readonly MOUSE_EVENTS: ArrayList<number> = new ArrayList<number>();
    private static readonly KEY_EVENTS: ArrayList<string> = new ArrayList<string>();

    private static _mouseScroll: number = 0;

    private static _currentMousePosition: Vector2 | null = null;
    private static _previousMousePosition: Vector2 | null = null;

    public static setup(): void {
        document.body.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        this.CANVAS.HTMLElement.addEventListener("mousedown", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const CODE: number = event.button;

            if (!App.MOUSE_EVENTS.contains(CODE)) {
                App.MOUSE_EVENTS.add(CODE);
            }
        });

        this.CANVAS.HTMLElement.addEventListener("mouseup", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const CODE: number = event.button;

            for (let i: number = 0; i < App.MOUSE_EVENTS.length; i++) {
                let e: number = this.MOUSE_EVENTS.get(i);
                if (e == CODE) {
                    App.MOUSE_EVENTS.delete(i);
                }
            }
        });

        document.body.addEventListener("mousemove", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const RECT: DOMRect = document.body.getBoundingClientRect();
            App._currentMousePosition = new Vector2(
                event.clientX - RECT.left,
                event.clientY - RECT.top
            );
        });

        document.body.addEventListener("wheel", (event) => {
            let scroll: number = event.deltaY;
            if (scroll > 0) {
                App._mouseScroll = 1;
            } else if (scroll < 0) {
                App._mouseScroll = -1;
            }
        });

        document.body.addEventListener("keydown", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const CODE: string = event.key.toLowerCase();

            if (!App.KEY_EVENTS.contains(CODE)) {
                App.KEY_EVENTS.add(CODE);
            }
        });

        document.body.addEventListener("keyup", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const CODE: string = event.key.toLowerCase();

            for (let i: number = 0; i < App.KEY_EVENTS.length; i++) {
                let e: string = this.KEY_EVENTS.get(i);
                if (e == CODE) {
                    App.KEY_EVENTS.delete(i);
                }
            }
        });

        App.start();
    }

    public static start(): void {
        App.intervalLoop = setInterval(() => {
            App.mainloop();
        }, 1000 / App.TPS);
    }

    private static mainloop(): void {
        App.tick();
        App.draw();
    }

    public static end(): void {
        clearInterval(App.intervalLoop);
    }

    private static tick(): void {
        if (App.appState == AppState.IN_GAME) {
            App.GAME.tick();
        } else if (App.appState == AppState.START_MENU) {
            App.START_MENU.tick();
        }

        App.CANVAS.tick();

        App._previousMousePosition = App._currentMousePosition;
        App._mouseScroll = 0;
    }

    private static draw(): void {
        if (App.appState == AppState.IN_GAME) {
            App.GAME.draw(App.CANVAS);
        } else if (this.appState == AppState.START_MENU) {
            App.START_MENU.draw(App.CANVAS);
        }
    }

    public static get TPS(): number {
        return App._TPS;
    }

    public static get CANVAS(): Canvas {
        return App._CANVAS;
    }

    public static get mouseEvents(): ArrayList<number> {
        return App.MOUSE_EVENTS;
    }

    public static get mouseScroll(): number {
        return this._mouseScroll;
    }

    public static get currentMousePosition(): Vector2 | null {
        return this._currentMousePosition;
    }

    public static get previousMousePosition(): Vector2 | null {
        return this._previousMousePosition;
    }

    public static get keyEvents(): ArrayList<string> {
        return App.KEY_EVENTS;
    }
}