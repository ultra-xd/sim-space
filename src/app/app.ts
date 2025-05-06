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

    private static readonly MOUSE_EVENTS: ArrayList<{pressed: boolean, code: number}> = new ArrayList<{pressed: boolean, code: number}>();
    private static readonly KEY_EVENTS: ArrayList<{pressed: boolean, code: number}> = new ArrayList<{pressed: boolean, code: number}>();

    private static currentMousePosition: Vector2 | null = null;
    private static previousMousePosition: Vector2 | null = null;

    public static setup(): void {
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

            if (!App.MOUSE_EVENTS.contains(EVENT)) {
                App.MOUSE_EVENTS.add(EVENT);
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

            if (!App.MOUSE_EVENTS.contains(EVENT)) {
                App.MOUSE_EVENTS.add(EVENT);
            }
        });

        document.body.addEventListener("mousemove", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            App.previousMousePosition = App.currentMousePosition;

            const RECT: DOMRect = document.body.getBoundingClientRect();
            App.currentMousePosition = new Vector2(
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

            if (!App.KEY_EVENTS.contains(EVENT)) {
                App.KEY_EVENTS.add(EVENT);
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

            if (!App.KEY_EVENTS.contains(EVENT)) {
                App.KEY_EVENTS.add(EVENT);
            }
        });

        App.start();
    }

    public static start(): void {
        App.intervalLoop = setInterval(() => {
            App.mainloop();
        }, 1000 / App.TPS);
    }

    public static mainloop(): void {
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

        App.KEY_EVENTS.clear();
        App.MOUSE_EVENTS.clear();

        App.CANVAS.tick();
    }

    private static draw(): void {
        if (App.appState == AppState.IN_GAME) {
            App.GAME.draw(App.CANVAS);
        } else if (this.appState == AppState.START_MENU) {
            App.START_MENU.draw(App.CANVAS);
        }

        // for testing
        App.CANVAS.drawLine(
            new Vector2(0, 0),
            new Vector2(100, 100),
            "black",
            1
        );
    }

    public static get TPS(): number {
        return App._TPS;
    }

    public static get CANVAS(): Canvas {
        return App._CANVAS;
    }

    public static get mouseEvents(): {pressed: boolean, code: number}[] {
        return App.MOUSE_EVENTS.getArray();
    }

    public static get keyEvents(): {pressed: boolean, code: number}[] {
        return App.KEY_EVENTS.getArray();
    }
}