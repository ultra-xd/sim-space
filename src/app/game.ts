import { GameMap } from "../map/map.js";
import { Canvas } from "./canvas.js";
import { Vector2 } from "../data_structures/vector.js";
import { Camera } from "../map/camera.js";
import { App } from "./app.js";
import { Facility } from "../facility/facility.js";
import { GameMenu } from "./game_menu.js";
import { assert } from "../util/util.js";

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

    // build mode: get class of facility to build
    private _selectedFacility: {
        new (GAME: Game): Facility;
        getSprite: (isometric: boolean) => HTMLImageElement; 
        NAME: string
    } | null = null;

    private _gameState: GameState = GameState.STANDARD;

    private clicked: boolean = false;
    private holding: boolean = false;

    public constructor() {
        this.GAME_MENU.setup();
    }

    public tick(): void {
        this._ticks++;

        if (this.clicked && this.holding) {
            this.clicked = false;
        }

        if (App.mouseEvents.contains(0)) {
            if (!this.holding) {
                this.clicked = true;
                this.holding = true;           
            }
        } else {
            this.clicked = false;
            this.holding = false;
        }

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

        if (this.clicked && this.highlightedCell != null) {
            switch (this._gameState) {
                case GameState.STANDARD:
                    break;
                case GameState.BUILD:
                    assert (this._selectedFacility != null);

                    if (this._MAP.build(this._selectedFacility, this.highlightedCell)) {
                        this.gameState = GameState.STANDARD;
                    }

                    break;
                case GameState.DESTROY:
                    if (this._MAP.destroy(this.highlightedCell)) {
                        this.gameState = GameState.STANDARD;
                    }

                    break;
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

    public setSelectedFacility<T extends {
        new (GAME: Game): Facility; 
        getSprite: (isometric: boolean) => HTMLImageElement; 
        NAME: string
    }>(FacilityClass: T | null): void {
        this._selectedFacility = FacilityClass;
    }

    public get selectedFacility(): {
        new (GAME: Game): Facility; 
        getSprite: (isometric: boolean) => HTMLImageElement; 
        NAME: string
    } | null {
        return this._selectedFacility;
    }
}

