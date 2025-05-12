import { GameMap } from "../map/map.js";
import { Canvas } from "./canvas.js";
import { Vector2 } from "../data_structures/vector.js";
import { Camera } from "../map/camera.js";
import { App } from "./app.js";
import { Facility } from "../facility/facility.js";
import { LuxuryHome, ComfortableHome, AffordableHome } from "../facility/facility_types/residential.js";
import { DefenseFacility } from "../facility/facility_types/defense.js";
import { EmergencyBuilding, EducationCentre, MedicalCentre, Government, PowerPlant } from "../facility/facility_types/essential.js";
import { Restaurant, Store, Office } from "../facility/facility_types/commercial.js";
import { EnvironmentalFacility, Factory, Warehouse } from "../facility/facility_types/industrial.js";

export enum GameState {
    STANDARD,
    BUILD,
    DESTROY,
    PAUSED,
    END
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

    private highlightedCell: Vector2 | null = null;
    private highlightAnimationTicks: number = 0;
    private static readonly HIGHLIGHT_ANIMATION_DURATION: number = 2;
    private static readonly HIGHLIGHT_ANIMATION_TICK_DURATION: number = this.HIGHLIGHT_ANIMATION_DURATION * 60;

    private _gameState: GameState = GameState.STANDARD;

    public constructor() {
        this.GAME_MENU.setup();
    }

    public tick(): void {
        this._ticks++;

        // shift map position if mouse moved and dragged
        if (
            App.currentMousePosition != null &&
            App.previousMousePosition != null
        ) {
            this.highlightAnimationTicks++;
            if (this.highlightAnimationTicks > Game.HIGHLIGHT_ANIMATION_TICK_DURATION) {
                this.highlightAnimationTicks = Game.HIGHLIGHT_ANIMATION_TICK_DURATION;
            }

            if (App.mouseEvents.contains(2)) {
                // get the amount of units changed from movement from last tick to current tick
                const UNITS_CHANGE = this._CAMERA.pixelsToUnits(App.previousMousePosition).subtract(
                    this._CAMERA.pixelsToUnits(App.currentMousePosition)
                );
            
                this._CAMERA.adjustCamera(UNITS_CHANGE);
            }

            const MOUSE_POS_UNITS: Vector2 = this._CAMERA.pixelsToUnits(App.currentMousePosition);
            const HIGHLIGHT: Vector2 = new Vector2(
                Math.floor(MOUSE_POS_UNITS.x),
                Math.floor(MOUSE_POS_UNITS.y)
            );

            if (this.highlightedCell != null) {
                if (!this.highlightedCell.equals(HIGHLIGHT)) {
                    this.highlightAnimationTicks = 0;
                    this.highlightedCell = HIGHLIGHT;
                }
            } else {
                this.highlightedCell = HIGHLIGHT;
            }
            
            if (
                HIGHLIGHT.x < 0 ||
                HIGHLIGHT.x >= Game.MAP_WIDTH ||
                HIGHLIGHT.y < 0 ||
                HIGHLIGHT.y >= Game.MAP_HEIGHT
            ) {
                this.highlightedCell = null;
            }
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
            "rgb(0, 96, 175)",
        );

        this.MAP.draw(canvas, this._CAMERA);

        let colour: string;

        switch (this._gameState) {
            case GameState.BUILD:
                colour = "0, 255, 0";
                break;
            case GameState.DESTROY:
                colour = "255, 0, 0";
                break;
            default:
                colour = "255, 255, 255";
                break;
        }
        
        if (this.highlightedCell != null) {
            canvas.fillPolygon(
                [
                    this._CAMERA.unitsToPixels(this.highlightedCell),
                    this._CAMERA.unitsToPixels(this.highlightedCell.add(Vector2.I_UNIT)),
                    this._CAMERA.unitsToPixels(this.highlightedCell.add(Vector2.I_UNIT).add(Vector2.J_UNIT)),
                    this._CAMERA.unitsToPixels(this.highlightedCell.add(Vector2.J_UNIT))
                ],
                `rgba(${colour}, ${this.highlightAnimationTicks / Game.HIGHLIGHT_ANIMATION_TICK_DURATION / 4})`
            );
        }
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

    public get gameState(): GameState {
        return this._gameState;
    }

    public set gameState(gameState: GameState) {
        this._gameState = gameState;
        this.GAME_MENU.switchUI(gameState);
    }
}

export class GameMenu {
    public static readonly GAME_MENU_DIV: HTMLDivElement = document.getElementById("game-menu") as HTMLDivElement;
    public static readonly GAME_STANDARD_DIV: HTMLDivElement = document.getElementById("game-standard") as HTMLDivElement;
    public static readonly GAME_CONSTRUCTION_DIV: HTMLDivElement = document.getElementById("game-construction") as HTMLDivElement;
    public static readonly GAME_PAUSED_DIV: HTMLDivElement = document.getElementById("game-paused") as HTMLDivElement;
    public static readonly GAME_END_DIV: HTMLDivElement = document.getElementById("game-end") as HTMLDivElement;
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
    public static readonly MAP_VIEW_CHANGE_BUTTON: HTMLButtonElement = document.getElementById("map-view-change") as HTMLButtonElement;
    public static readonly MAP_VIEW_CHANGE_BUTTON_IMG: HTMLImageElement = document.getElementById("map-view-change-icon") as HTMLImageElement;
    public static readonly CONSTRUCTION_CANCEL_BUTTON: HTMLButtonElement = document.getElementById("view-cancel") as HTMLButtonElement;

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
        });

        GameMenu.MAP_VIEW_CHANGE_BUTTON.addEventListener("click", () => {
            this.game.CAMERA.switchView();
            if (this.game.CAMERA.isIsometric()) {
                GameMenu.MAP_VIEW_CHANGE_BUTTON_IMG.src = "res/assets/icons/straight-icon.png";
            } else {
                GameMenu.MAP_VIEW_CHANGE_BUTTON_IMG.src = "res/assets/icons/isometric-icon.png";
            }
        });

        GameMenu.CONSTRUCTION_CANCEL_BUTTON.addEventListener("click", () => {
            this.game.gameState = GameState.STANDARD;
        });

        GameMenu.CONSTRUCTION_DELETE_BUTTON.addEventListener("click", () => {
            this.game.gameState = GameState.DESTROY;
        });

        this.createFacilityButtons();
    }

    public switchUI(gameState: GameState): void {
        switch (gameState) {
            case GameState.STANDARD:
                GameMenu.GAME_STANDARD_DIV.hidden = false;
                GameMenu.GAME_CONSTRUCTION_DIV.hidden = true;
                GameMenu.GAME_PAUSED_DIV.hidden = true;
                GameMenu.GAME_END_DIV.hidden = true;
                break;
            case GameState.BUILD:
            case GameState.DESTROY:
                GameMenu.GAME_STANDARD_DIV.hidden = true;
                GameMenu.GAME_CONSTRUCTION_DIV.hidden = false;
                GameMenu.GAME_PAUSED_DIV.hidden = true;
                GameMenu.GAME_END_DIV.hidden = true;
                break;
            case GameState.PAUSED:
                GameMenu.GAME_STANDARD_DIV.hidden = true;
                GameMenu.GAME_CONSTRUCTION_DIV.hidden = true;
                GameMenu.GAME_PAUSED_DIV.hidden = false;
                GameMenu.GAME_END_DIV.hidden = true;
                break;
            case GameState.END:
                GameMenu.GAME_STANDARD_DIV.hidden = true;
                GameMenu.GAME_CONSTRUCTION_DIV.hidden = true;
                GameMenu.GAME_PAUSED_DIV.hidden = true;
                GameMenu.GAME_END_DIV.hidden = false;
                break;
        }
    }

    private createFacilityButton<T extends {
        new (GAME: Game): Facility; 
        getSprite: (isometric: boolean) => HTMLImageElement; 
        NAME: string
    }>(FacilityClass: T): HTMLButtonElement {
        const BUTTON: HTMLButtonElement = document.createElement("button");
        BUTTON.type = "button";
        BUTTON.className = "facility-button";
        
        const ICON: HTMLImageElement = FacilityClass.getSprite(true).cloneNode() as HTMLImageElement;
        ICON.className = "facility-icon";

        BUTTON.appendChild(ICON);

        const TITLE: HTMLParagraphElement = document.createElement("p");
        const TITLE_TEXT: Text = document.createTextNode(FacilityClass.NAME);
        TITLE.appendChild(TITLE_TEXT);
        BUTTON.appendChild(TITLE);

        BUTTON.addEventListener("click", () => {
            GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.remove("show");
            GameMenu.CONSTRUCTION_BUILD_BUTTON.classList.remove("active");
            this.game.gameState = GameState.BUILD;
        });

        return BUTTON;
    }

    private createFacilityButtons(): void {
        const FACILITIES: ({
            new (GAME: Game): Facility; 
            getSprite: (isometric: boolean) => HTMLImageElement; 
            NAME: string
        })[] = [
            EmergencyBuilding,
            EducationCentre,
            MedicalCentre,
            Government,
            PowerPlant,
            LuxuryHome,
            ComfortableHome,
            AffordableHome,
            Restaurant,
            Store,
            Office,
            EnvironmentalFacility,
            Factory,
            Warehouse,
            DefenseFacility
        ];

        for (let i: number = 0; i < FACILITIES.length; i++) {
            GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.appendChild(
                this.createFacilityButton(FACILITIES[i])
            );
        }
    }
}
