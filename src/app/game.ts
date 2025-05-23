import { GameMap } from "../map/map.js";
import { Canvas } from "./canvas.js";
import { Vector2 } from "../data_structures/vector.js";
import { Camera } from "../map/camera.js";
import { App } from "./app.js";
import { Facility, FacilityType, FacilityClass } from "../facility/facility.js";
import { GameMenu } from "./game_menu.js";
import { assert, randomInteger } from "../util/util.js";
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
    private static readonly MAP_WIDTH: number = 50;
    private static readonly MAP_HEIGHT: number = 50;

    // Specify ticks per month, calculated as TPS x Number of Seconds in a Month
    private static readonly TICKS_PER_MONTH: number = 10 * 60;

    // Create game map, menu and camera
    private readonly _MAP: GameMap = new GameMap(this, Game.MAP_WIDTH, Game.MAP_HEIGHT);
    private readonly _CAMERA: Camera = new Camera(this);
    private readonly _GAME_MENU: GameMenu = new GameMenu(this);

    // Set base stats of the game
    private _population: number = 0;
    private _happyPopulation: number = 0;
    private _contentedPopulation: number = 0;
    private _money: number = 5_000_000_000;
    private _ticks: number = 0;

    // Set variables for selecting a cell to build, destroy, get info, etc.
    private _highlightedCell: Vector2 | null = null;
    private highlightAnimationTicks: number = 0; // Tracks the progress of the animation
    private static readonly HIGHLIGHT_ANIMATION_DURATION: number = 1; // Tracks the duration of the animation, in seconds
    private static readonly HIGHLIGHT_ANIMATION_TICK_DURATION: number = this.HIGHLIGHT_ANIMATION_DURATION * 60; // Tracks the duration of the animation, in ticks

    // Build mode: get class of facility to build
    private _selectedFacility: FacilityClass | null = null;

    // State of game (standard view mode, build, destroy, etc.)
    private _gameState: GameState = GameState.STANDARD;

    // destroying the city yipppiiiieeee
    private static readonly DEFAULT_GAME_END_PROBABILITY: number = 0.01;
    private gameEndProbability: number = Game.DEFAULT_GAME_END_PROBABILITY;
    private isGameEnding: boolean = false;
    private static readonly GAME_ENDING_ANIMATION_LENGTH: number = 2;
    private gameEndingAnimationTicks: number = 0;
    private static readonly EXPLOSION_IMAGE: HTMLImageElement = Canvas.ImageLoader.getImage(
        "res/assets/other/nuke.png"
    );

    /** Creates a new Game. */
    public constructor() {
        this._GAME_MENU.setup();
        this._GAME_MENU.updateStatsDisplay();
    }

    /** Updates the game once, according to the ticks per second */
    public tick(): void {
        if (
            this._gameState == GameState.STANDARD ||
            this._gameState == GameState.BUILD ||
            this._gameState == GameState.DESTROY
        ) {
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
                    // If in standard view mode, show the information of the facility clicked on
                    case GameState.STANDARD:
                        if (!this._MAP.inBounds(this._highlightedCell)) break;
                        const FACILITY: Facility | null = this._MAP.getCell(this._highlightedCell).facility;
                        GameMenu.facilityDisplayed = FACILITY;

                        break;

                    // If in build mode, build a facility if capable
                    case GameState.BUILD:
                        assert (this._selectedFacility != null);

                        // Notify & decline user if not enough money
                        if (!this._selectedFacility.canBuy(this.money)) {
                            GameMenu.NotificationManager.createNotification(
                                "You don't have enough money."
                            );

                            break;
                        }

                        // Build facility on highlighted cell, if possible
                        if (
                            this._MAP.build(this._selectedFacility, this._highlightedCell) &&
                            !App.CONTROLLER.keyToggled(KeyEvent.SHIFT)
                        ) {
                            this.gameState = GameState.STANDARD;
                        }

                        break;
                    
                    // If in destroy modde, destroy the facility on the cell if it exists
                    case GameState.DESTROY:
                        // Destroy facility on highlighted cell, if possible
                        if (
                            this._MAP.destroy(this._highlightedCell) &&
                            !App.CONTROLLER.keyToggled(KeyEvent.SHIFT)
                        ) {
                            this.gameState = GameState.STANDARD;
                        }

                        break;
                }
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

            if (this.isGameEnding) {
                // Animate the game's ending
                this.gameEndingAnimationTicks++;
                if (this.gameEndingAnimationTicks == Game.GAME_ENDING_ANIMATION_LENGTH * App.TPS) {
                    this.gameState = GameState.END;
                }
            }

            // Update map and camera
            GameMenu.NotificationManager.tick();
            this._MAP.tick();
            this._CAMERA.tick();
        }

        // Handle ESCAPE keyboard key press
        if (App.CONTROLLER.keyPressToggled(KeyEvent.ESCAPE)) {
            // If in standard viewing mode, pause the game, otherwise return to standard viewing mode
            switch (this._gameState) {
                case GameState.STANDARD:
                    this.gameState = GameState.PAUSED;
                    break;
                
                case GameState.BUILD:
                case GameState.DESTROY:
                case GameState.PAUSED:
                    this.gameState = GameState.STANDARD;
                    break;
            }
        }

        // Update stats display every time month ends
        if (this.monthEnded()) {
            this._GAME_MENU.updateStatsDisplay();
            GameMenu.showFacilityInfo();
            
            if (!this.isGameEnding && !this._MAP.containsType(FacilityType.DEFENSE)) {
                const COMPARE: number = this.gameEndProbability * 100;
                let RANDOM: number = randomInteger(1, 100);
                if (RANDOM <= COMPARE) {
                    this.gameEnd();
                }
            }
        }
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
            "rgb(0, 96, 175)"
        );

        // Draw map and facilities in map
        this.MAP.draw(canvas, this._CAMERA);

        // Draw game ending animation
        if (this.isGameEnding && this._gameState != GameState.END) {
            // Determine the fraction of the animation that has completed
            const PROGRESS: number = this.gameEndingAnimationTicks / (Game.GAME_ENDING_ANIMATION_LENGTH * App.TPS);

            // Draw a nuke in the center of the map that gradually grows in size
            canvas.drawImage(
                Game.EXPLOSION_IMAGE,
                this._CAMERA.unitsToPixels(
                    new Vector2(this._MAP.width / 2, this._MAP.height / 2)
                ),
                this._MAP.width * this._CAMERA.pixelsPerUnit * PROGRESS * 2,
                this._MAP.height * this._CAMERA.pixelsPerUnit * PROGRESS * 2
            )

            // Draw an increasingly white rectangle over the city
            canvas.fillRect(
                new Vector2(canvas.width / 2, canvas.height / 2),
                canvas.width,
                canvas.height,
                `rgba(255, 0, 255, ${PROGRESS})`
            );
        }
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
        this._GAME_MENU.updateStatsDisplay();
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

    public set population(population: number) {
        this._population = population;
        this._GAME_MENU.updateStatsDisplay();
    }

    public get happyPopulation(): number {
        return this._happyPopulation;
    }

    public set happyPopulation(happyPopulation: number) {
        this._happyPopulation = happyPopulation;
        this._GAME_MENU.updateStatsDisplay();
    }

    public set contentedPopulation(contentedPopulation: number) {
        this._contentedPopulation = contentedPopulation;
        this._GAME_MENU.updateStatsDisplay();
    }

    public get contentedPopulation(): number {
        return this._contentedPopulation;
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
        return (3 * this._happyPopulation + this._contentedPopulation) - this.MAP.pollution;
    }

    /** The month number. */
    public get month(): number {
        return Math.floor(this._ticks / Game.TICKS_PER_MONTH);
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

    public get GAME_MENU(): GameMenu {
        return this._GAME_MENU;
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
        GameMenu.switchUI(gameState);
    }

    /**
     * Sets the class of the selected facility to build while in build mode.
     * @param FacilityClass The class of the facility to build.
     */
    public setSelectedFacility<T extends FacilityClass>(FacilityClass: T | null): void {
        this._selectedFacility = FacilityClass;
    }
    
    /**
     * Gets the class of the selected facility to build while in build mode.
     */
    public get selectedFacility(): {new (GAME: Game): Facility} | null {
        return this._selectedFacility;
    }

    public nullifyGameEndProbability(): void {
        this.gameEndProbability = 0;
    }

    public gameEnd(): void {
        this.isGameEnding = true;
    }
}
