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

    private appState: AppState = AppState.START_MENU;

    private intervalLoop: number;
    private static readonly _TPS: number = 60;

    private readonly MOUSE_EVENTS: ArrayList<number> = new ArrayList<number>();
    private readonly KEY_EVENTS: ArrayList<number> = new ArrayList<number>();

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

            // handle event

            event.preventDefault();
        });

        document.body.addEventListener("mouseup", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            // handle event

            event.preventDefault();
        });

        document.body.addEventListener("mousemove", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            // handle event

            event.preventDefault();
        });

        document.body.addEventListener("wheel", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            // handle event

            event.preventDefault();
        });

        document.body.addEventListener("keydown", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            // handle event

            // event.preventDefault();
        });

        document.body.addEventListener("keyup", (event) => {
            if (event.defaultPrevented) {
                return;
            }

            // handle event

            // event.preventDefault();
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
        this.CANVAS.tick();
    }

    private draw(): void {

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
}