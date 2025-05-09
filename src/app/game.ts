import { GameMap } from "../map/map.js";
import { Canvas } from "./canvas.js";
import { Vector2 } from "../data_structures/vector.js";
import { Camera } from "../map/camera.js";
import { App } from "./app.js";

export enum GameState {
    STANDARD,
    BUILD,
    DESTROY,
    VIEW,
    PAUSED,
    GAME_OVER
}

export class Game {

    private static readonly MAP_WIDTH: number = 50;
    private static readonly MAP_HEIGHT: number = 50;

    private static readonly TICKS_PER_MONTH: number = 10 * 60;

    private readonly _MAP: GameMap = new GameMap(this, Game.MAP_WIDTH, Game.MAP_HEIGHT);
    private readonly _CAMERA: Camera = new Camera(this);

    private readonly GAME_MENU: GameMenu = new GameMenu(this);

    private _population: number = 0;
    private _money: number = 5_000_000_000;
    private _ticks: number = 0;
    private _score: number = 0;

    private gameState: GameState = GameState.STANDARD;

    public constructor() {
        this.GAME_MENU.setup();
    }

    public tick(): void {
        this._ticks++;

        // shift map position if mouse moved and dragged
        if (
            App.currentMousePosition != null &&
            App.previousMousePosition != null &&
            App.mouseEvents.contains(2)
        ) {
            // get the amount of units changed from movement from last tick to current tick
            const UNITS_CHANGE = this._CAMERA.pixelsToUnits(App.previousMousePosition).subtract(
                this._CAMERA.pixelsToUnits(App.currentMousePosition)
            );
            
            this._CAMERA.adjustCamera(UNITS_CHANGE);
        }

        // zoom in/out if scrolled mouse wheel
        let scroll: number = App.mouseScroll;

        if (scroll > 0) { // zoom in if scroll up
            this._CAMERA.adjustZoom(-0.05);
        } else if (scroll < 0) { // zoom out if scroll down
            this._CAMERA.adjustZoom(0.05);
        }

        this._MAP.tick();
        this._CAMERA.tick();
    }

    public draw(canvas: Canvas): void {
        // fill bg with green
        canvas.fillRect(
            new Vector2(canvas.width / 2, canvas.height / 2),
            canvas.width,
            canvas.height,
            "rgb(0, 255, 0)",
        );

        this.MAP.draw(canvas, this._CAMERA);
    }

    public monthEnded(): boolean {
        return this._ticks % Game.TICKS_PER_MONTH == 0;
    }

    public changeMoney(change: number): void {
        this._money += change;
    }

    public get MAP(): GameMap {
        return this._MAP;
    }

    public get money(): number {
        return this._money;
    }

    public get population(): number {
        return this._population;
    }

    public get ticks(): number {
        return this._ticks;
    }

    public get score(): number {
        return 0;
    }

    public get CAMERA(): Camera {
        return this._CAMERA;
    }
}

export class GameMenu {
    public static readonly GAME_MENU_DIV: HTMLDivElement = document.getElementById("game-menu") as HTMLDivElement;
    public static readonly STATS_MONEY_PARAGRAPH: HTMLParagraphElement = document.getElementById("stats-money-display") as HTMLParagraphElement;
    public static readonly STATS_DATE_PARAGRAPH: HTMLParagraphElement = document.getElementById("stats-date-display") as HTMLParagraphElement;
    public static readonly STATS_POPULATION_PARAGRAPH: HTMLParagraphElement = document.getElementById("stats-population-display") as HTMLParagraphElement;
    public static readonly STATS_SCORE_PARAGRAPH: HTMLParagraphElement = document.getElementById("stats-score-display") as HTMLParagraphElement;
    public static readonly STATS_DIV: HTMLDivElement = document.getElementById("stats-display") as HTMLDivElement;
    public static readonly CONSTRUCTION_DELETE_BUTTON: HTMLButtonElement = document.getElementById("construction-delete") as HTMLButtonElement;
    public static readonly CONSTRUCTION_BUILD_BUTTON: HTMLButtonElement = document.getElementById("construction-build") as HTMLButtonElement;
    public static readonly CONSTRUCTION_BUILDINGS_DISPLAY_DIV: HTMLDivElement = document.getElementById("buildings-display") as HTMLDivElement;
    public static readonly MAP_ZOOM_IN_BUTTON: HTMLButtonElement = document.getElementById("map-zoom-in") as HTMLButtonElement;
    public static readonly MAP_ZOOM_OUT_BUTTON: HTMLButtonElement = document.getElementById("map-zoom-out") as HTMLButtonElement;
    public static readonly MAP_RESET_BUTTON: HTMLButtonElement = document.getElementById("map-reset") as HTMLButtonElement;

    public constructor(private readonly game: Game) {};

    public setup(): void {
        GameMenu.CONSTRUCTION_BUILD_BUTTON.addEventListener("click", () => {
            if (!GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.contains("show")) {
                GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.add("show");
                GameMenu.CONSTRUCTION_BUILD_BUTTON.classList.add("active");
            } else {
                GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.remove("show");
                GameMenu.CONSTRUCTION_BUILD_BUTTON.classList.remove("active");
            }
        });

        GameMenu.MAP_ZOOM_IN_BUTTON.addEventListener("click", () => {
            if (this.game.CAMERA.isAnimating()) return;
            
            this.game.CAMERA.createZoomAnimation(
                this.game.CAMERA.pixelsPerUnit * 2
            );
        });

        GameMenu.MAP_ZOOM_OUT_BUTTON.addEventListener("click", () => {
            if (this.game.CAMERA.isAnimating()) return;

            this.game.CAMERA.createZoomAnimation(
                this.game.CAMERA.pixelsPerUnit / 2
            );
        });

        GameMenu.MAP_RESET_BUTTON.addEventListener("click", () => {
            if (this.game.CAMERA.isAnimating()) return;

            this.game.CAMERA.createMoveAnimation(
                this.game.CAMERA.DEFAULT_CENTER,
                this.game.CAMERA.DEFAULT_PIXELS_PER_UNIT
            );
        })
    }
}
