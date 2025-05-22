import { Game } from "./game.js";
import { StartMenu } from "./start_menu.js";
import { GameMenu } from "./game_menu.js";
import { Canvas } from "./canvas.js";
import { Controller } from "./controller.js";

/** Enum storing the state of the app. */
export enum AppState {
    IN_GAME,
    START_MENU
}

/** Class to manage the whole app. */
export class App {
    private static game: Game | null = null;
    private static readonly _CANVAS: Canvas = new Canvas("canvas");
    private static readonly _CONTROLLER: Controller = new Controller(App._CANVAS);

    private static appState: AppState = AppState.START_MENU;

    private static intervalLoop: number;
    private static readonly _TPS: number = 60;

    /** Sets up the app, including the controller, canvas, resources. Starts the app. */
    public static setup(): void {
        App._CONTROLLER.setup();
        StartMenu.setup();

        Canvas.ImageLoader.loadImages(
            [
                "res/assets/buildings/isometric/affordable_home.png",
                "res/assets/buildings/isometric/comfortable_home.png",
                "res/assets/buildings/isometric/defense.png",
                "res/assets/buildings/isometric/education.png",
                "res/assets/buildings/isometric/emergency.png",
                "res/assets/buildings/isometric/environment.png",
                "res/assets/buildings/isometric/factory.png",
                "res/assets/buildings/isometric/government.png",
                "res/assets/buildings/isometric/luxury_home.png",
                "res/assets/buildings/isometric/medical.png",
                "res/assets/buildings/isometric/office.png",
                "res/assets/buildings/isometric/power.png",
                "res/assets/buildings/isometric/restaurant.png",
                "res/assets/buildings/isometric/store.png",
                "res/assets/buildings/isometric/warehouse.png",
                "res/assets/buildings/straight/affordable_home.png",
                "res/assets/buildings/straight/comfortable_home.png",
                "res/assets/buildings/straight/defense.png",
                "res/assets/buildings/straight/education.png",
                "res/assets/buildings/straight/emergency.png",
                "res/assets/buildings/straight/environment.png",
                "res/assets/buildings/straight/factory.png",
                "res/assets/buildings/straight/government.png",
                "res/assets/buildings/straight/luxury_home.png",
                "res/assets/buildings/straight/medical.png",
                "res/assets/buildings/straight/office.png",
                "res/assets/buildings/straight/power.png",
                "res/assets/buildings/straight/restaurant.png",
                "res/assets/buildings/straight/store.png",
                "res/assets/buildings/straight/warehouse.png",
                "res/assets/map/grass_isometric.png",
                "res/assets/map/grass_straight.png",
                "res/assets/title/title_background.jpg",
                "res/assets/title/title_text.png",
                "res/assets/title/pidjeon.png",
                "res/assets/other/nuke.png"
            ]
        );

        App.start();
    }

    /** Starts the mainloop of the app. */
    public static start(): void {
        App.intervalLoop = setInterval(() => {
            App.mainloop();
        }, 1000 / App.TPS);
    }

    /** Runs the mainloop. */
    private static mainloop(): void {
        App.tick();
        App.draw();
    }

    /** Ends the mainloop. */
    public static end(): void {
        clearInterval(App.intervalLoop);
    }

    /** Updates the app. */
    private static tick(): void {
        if (App.appState == AppState.IN_GAME && App.game != null) {
            App.game.tick();
        }

        App._CANVAS.tick();
        App._CONTROLLER.tick();
    }

    /** Draws the app on the canvas. */
    private static draw(): void {
        if (App.appState == AppState.IN_GAME && App.game != null) {
            App.game.draw(App.CANVAS);
        } else if (this.appState == AppState.START_MENU) {
            StartMenu.draw(App.CANVAS);
        }
    }

    /** The number of ticks that are run per second in the mainloop. */
    public static get TPS(): number {
        return App._TPS;
    }

    /** The canvas of the app. */
    public static get CANVAS(): Canvas {
        return App._CANVAS;
    }

    /** The controller handling all mouse and keyboard inputs. */
    public static get CONTROLLER(): Controller {
        return App._CONTROLLER;
    }

    /**
     * Changes whether the app is playing a game or on its title page.
     * @param state The app state.
     */
    public static changeAppState(state: AppState): void {
        App.appState = state;

        if (state == AppState.IN_GAME) {
            StartMenu.hide();
            GameMenu.show();
        } else if (state == AppState.START_MENU) {
            StartMenu.show();
            GameMenu.hide();
        }
    }

    /** Creates a new game. */
    public static createNewGame(): void {
        App.game = new Game();
    }
}
