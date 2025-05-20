import { GameMap } from "../map/map.js";
import { Canvas } from "./canvas.js";
import { Vector2 } from "../data_structures/vector.js";
import { Camera } from "../map/camera.js";
import { App } from "./app.js";
import { Facility, FacilitySector } from "../facility/facility.js";
import { GameMenu } from "./game_menu.js";
import { assert } from "../util/util.js";
import { KeyEvent, MouseEvent } from "./controller.js";

/**
 * Enum representing the different game states.
 */
export enum GameState {
    STANDARD,
    BUILD,
    DESTROY,
    PAUSED,
    END
}

/**
 * Game class managing all game logic, buildings, map, etc.
 */
export class Game {

    // Specify map dimensions
    private static readonly MAP_WIDTH: number = 25;
    private static readonly MAP_HEIGHT: number = 25;

    // Specify ticks per month, calculated as TPS x Number of Seconds in a Month
    private static readonly TICKS_PER_MONTH: number = 10 * 60;

    // Create game map, menu and camera
    private readonly _MAP: GameMap = new GameMap(this, Game.MAP_WIDTH, Game.MAP_HEIGHT);
    private readonly _CAMERA: Camera = new Camera(this);
    private readonly GAME_MENU: GameMenu = new GameMenu(this);

    // Set base stats of the game
    private _population: number = 0;
    private _happyPopulation: number = 0;
    private _contentedPopulation: number = 0;
    private _money: number = 5_000_000_000;
    private _ticks: number = 0;
    private _pollution: number = 0;

    // Set variables for selecting a cell to build, destroy, get info, etc.
    private _highlightedCell: Vector2 | null = null;
    private highlightAnimationTicks: number = 0; // Tracks the progress of the animation
    private static readonly HIGHLIGHT_ANIMATION_DURATION: number = 1; // Tracks the duration of the animation, in seconds
    private static readonly HIGHLIGHT_ANIMATION_TICK_DURATION: number = this.HIGHLIGHT_ANIMATION_DURATION * 60; // Tracks the duration of the animation, in ticks

    // Build mode: get class of facility to build
    private _selectedFacility: {
        new (GAME: Game): Facility;
        getSprite: (isometric: boolean) => HTMLImageElement; 
        NAME: string;
    } | null = null;

    // State of game (standard view mode, build, destroy, etc.)
    private _gameState: GameState = GameState.STANDARD;

    /**
     * Creates a new Game.
     */
    public constructor() {
        this.GAME_MENU.setup();
    }

    /**
     * Updates the game once, according to the ticks per second
     */
    public tick(): void {
        // Update number of ticks passed
        this._ticks++;

        // Check for mouse movement events
        if (
            App.CONTROLLER.currentMousePosition != null &&
            App.CONTROLLER.previousMousePosition != null
        ) {
            // Update highlight animation progress
            this.highlightAnimationTicks++;

            // Make sure highlight animation ticks do not exceed the max duration
            if (this.highlightAnimationTicks > Game.HIGHLIGHT_ANIMATION_TICK_DURATION) {
                this.highlightAnimationTicks = Game.HIGHLIGHT_ANIMATION_TICK_DURATION;
            }

            // Drag using right mouse button and adjust camera position accordingly
            if (App.CONTROLLER.mouseToggled(MouseEvent.RMB)) {
                // get the amount of units changed from movement from last tick to current tick
                const UNITS_CHANGE = this._CAMERA.pixelsToUnits(
                    App.CONTROLLER.previousMousePosition
                ).subtract(
                    this._CAMERA.pixelsToUnits(
                        App.CONTROLLER.currentMousePosition
                    )
                );
            
                this._CAMERA.adjustCamera(UNITS_CHANGE);
            }

            // Find cell the mouse is currently over
            const MOUSE_POS_UNITS: Vector2 = this._CAMERA.pixelsToUnits(App.CONTROLLER.currentMousePosition);
            const HIGHLIGHT: Vector2 = new Vector2(
                Math.floor(MOUSE_POS_UNITS.x),
                Math.floor(MOUSE_POS_UNITS.y)
            );

            // Reset animation ticks if the highlighted cell is different from the last one
            if (this._highlightedCell != null) {
                if (!this._highlightedCell.equals(HIGHLIGHT)) {
                    this.highlightAnimationTicks = 0;
                    this._highlightedCell = HIGHLIGHT;
                }
            } else {
                this._highlightedCell = HIGHLIGHT;
            }
            
            // Reset animation ticks if the highlighted cell is out of bounds
            if (
                HIGHLIGHT.x < 0 ||
                HIGHLIGHT.x >= Game.MAP_WIDTH ||
                HIGHLIGHT.y < 0 ||
                HIGHLIGHT.y >= Game.MAP_HEIGHT
            ) {
                this._highlightedCell = null;
            }
        }

        // Handle left click mouse events on map
        if (App.CONTROLLER.mouseClickToggled(MouseEvent.LMB) && this._highlightedCell != null) {
            switch (this._gameState) {
                case GameState.STANDARD:
                    break;
                case GameState.BUILD:
                    assert (this._selectedFacility != null);

                    // Build facility on highlighted cell, if possible
                    if (this._MAP.build(this._selectedFacility, this._highlightedCell)) {
                        this.gameState = GameState.STANDARD;
                    }

                    break;
                case GameState.DESTROY:
                    // Destroy facility on highlighted cell, if possible
                    if (this._MAP.destroy(this._highlightedCell)) {
                        this.gameState = GameState.STANDARD;
                    }

                    break;
            }
        }

        if (
            App.CONTROLLER.keyPressToggled(KeyEvent.ESC) &&
            this.gameState != GameState.STANDARD
        ) {
            this.gameState = GameState.STANDARD;
        }
        // Zoom in/out if scrolled mouse wheel
    
        // zoom in if scroll up
        if (App.CONTROLLER.mouseToggled(MouseEvent.MOUSE_SCROLL_UP)) {
            this._CAMERA.adjustZoom(0.05);
        } 
        
        // zoom out if scroll down
        else if (App.CONTROLLER.mouseToggled(MouseEvent.MOUSE_SCROLL_DOWN)) { 
            this._CAMERA.adjustZoom(-0.05);
        }

        // Update map and camera
        this._MAP.tick();
        this._CAMERA.tick();
    }

    /**
     * Draws all components of the game that should be displayed on the canvas.
     * @param canvas The canvas to draw on.
     */
    public draw(canvas: Canvas): void {
        // Fill bg with green
        canvas.fillRect(
            new Vector2(canvas.width / 2, canvas.height / 2),
            canvas.width,
            canvas.height,
            "rgb(0, 96, 175)",
        );

        // Draw map and facilities in map
        this.MAP.draw(canvas, this._CAMERA);

        
    }

    /**
     * Checks if the month has been ended on the current tick the game is on.
     * @returns True if the month has ended, false otherwise.
     */
    public monthEnded(): boolean {
        return this._ticks % Game.TICKS_PER_MONTH == 0;
    }

    /**
     * Amount of money the player has.
     * @param money The amount of money to set.
     */
    public set money(money: number) {
        this._money = money;
    }
    
    /** Amount of money the player has. */
    public get money(): number {
        return this._money;
    }

    /**
     * The map of the game.
     */
    public get MAP(): GameMap {
        return this._MAP;
    }

    /**
     * The number of people living in the game
     */
    public get population(): number {
        return this._population;
    }
    
    /**
     * The number of ticks that have passed since the start of the game.`
     */
    public get ticks(): number {
        return this._ticks;
    }

    /**
     * The score of the game.
     * Calculated as: (3 x Happy Population + Contented Population) - Pollution
     */
    public get score(): number {
        return (3 * this._happyPopulation + this._contentedPopulation) - this._pollution;
    }

    /**
     * Gets the camera controlling the viewpoint
     */
    public get CAMERA(): Camera {
        return this._CAMERA;
    }

    /**
     * The state of the game (in standard viewing, building, destroying, etc.)
     */
    public get gameState(): GameState {
        return this._gameState;
    }

    
    /**
     * The cell currently highlighted by the mouse.
     */
    public get highlightedCell(): Vector2 | null {
        return this._highlightedCell;
    }
    
    public get highlightedColour(): string {
        let colour: String;

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
        return `rgba(${colour}, ${this.highlightAnimationTicks / Game.HIGHLIGHT_ANIMATION_TICK_DURATION / 4})`
    }

    /** The state of the game (in standard viewing, building, destroying, etc.) */
    public set gameState(gameState: GameState) {
        this._gameState = gameState;
        this.GAME_MENU.switchUI(gameState);
    }

    /**
     * Sets the class of the selected facility to build while in build mode.
     * @param FacilityClass The class of the facility to build.
     */
    public setSelectedFacility<T extends {
        new (GAME: Game): Facility; 
        getSprite: (isometric: boolean) => HTMLImageElement; 
        NAME: string;
    }>(FacilityClass: T | null): void {
        this._selectedFacility = FacilityClass;
    }
    
    /**
     * Gets the class of the selected facility to build while in build mode.
     */
    public get selectedFacility(): {
        new (GAME: Game): Facility; 
        getSprite: (isometric: boolean) => HTMLImageElement; 
        NAME: string
    } | null {
        return this._selectedFacility;
    }
}

