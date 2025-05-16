import { Game, GameState } from "./game.js";
import { Facility } from "../facility/facility.js";
import { LuxuryHome, ComfortableHome, AffordableHome } from "../facility/facility_types/residential.js";
import { DefenseFacility } from "../facility/facility_types/defense.js";
import { EmergencyBuilding, EducationCentre, MedicalCentre, Government, PowerPlant } from "../facility/facility_types/essential.js";
import { Restaurant, Store, Office } from "../facility/facility_types/commercial.js";
import { EnvironmentalFacility, Factory, Warehouse } from "../facility/facility_types/industrial.js";

/**
 * Class that handles the game menu UI.
 */
export class GameMenu {
    // Get all HTML elements
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

    /**
     * Creates a new GameMenu.
     * @param game The game instance for GameMeny to handle.
     */
    public constructor(private readonly game: Game) {};

    /**
     * Sets up the game menu UI, including event listeners, creating buttons, etc.
     */
    public setup(): void {
        // Handle event listener for building button dropdown
        GameMenu.CONSTRUCTION_BUILD_BUTTON.addEventListener("click", () => {
            // Toggle the display of the building button dropdown if not shown, otherwise hide it
            if (!GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.contains("show")) {
                GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.add("show");
                GameMenu.CONSTRUCTION_BUILD_BUTTON.classList.add("active");
            } else {
                GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.remove("show");
                GameMenu.CONSTRUCTION_BUILD_BUTTON.classList.remove("active");
            }
        });

        // Handle event listener of zoom in button
        GameMenu.MAP_ZOOM_IN_BUTTON.addEventListener("click", () => {
            // Don't zoom in if the camera is animating
            if (this.game.CAMERA.isAnimating()) return;
            
            // Create a zoom animation to zoom in by a factor of 2
            this.game.CAMERA.createZoomAnimation(
                this.game.CAMERA.pixelsPerUnit * 2
            );
        });

        // Handle event listener of zoom out button
        GameMenu.MAP_ZOOM_OUT_BUTTON.addEventListener("click", () => {
            // Don't zoom out if the camera is animating
            if (this.game.CAMERA.isAnimating()) return;

            // Create a zoom animation to zoom out by a factor of 2
            this.game.CAMERA.createZoomAnimation(
                this.game.CAMERA.pixelsPerUnit / 2
            );
        });

        // Handle event listener of reset button, which resets the camera to its default position
        GameMenu.MAP_RESET_BUTTON.addEventListener("click", () => {
            // Don't reset the camera if it is animating
            if (this.game.CAMERA.isAnimating()) return;

            // Create a move animation to move the camera to its default position
            this.game.CAMERA.createMoveAnimation(
                this.game.CAMERA.DEFAULT_CENTER,
                this.game.CAMERA.DEFAULT_PIXELS_PER_UNIT
            );
        });

        // Handle event listener of view change button, which switches between isometric and top down view
        GameMenu.MAP_VIEW_CHANGE_BUTTON.addEventListener("click", () => {
            // Switch the camera view
            this.game.CAMERA.switchView();

            // Update the button icon to reflect the view change (isometric -> top down, or vice versa)
            if (this.game.CAMERA.isIsometric()) {
                GameMenu.MAP_VIEW_CHANGE_BUTTON_IMG.src = "res/assets/icons/straight-icon.png";
            } else {
                GameMenu.MAP_VIEW_CHANGE_BUTTON_IMG.src = "res/assets/icons/isometric-icon.png";
            }
        });

        // Handle event listener of cancel button, which cancels the current construction
        GameMenu.CONSTRUCTION_CANCEL_BUTTON.addEventListener("click", () => {
            // Change game state to standard viewing
            this.game.gameState = GameState.STANDARD;
        });

        // Handle event listener of delete button, which changes the game state to destroy
        GameMenu.CONSTRUCTION_DELETE_BUTTON.addEventListener("click", () => {
            // Change game state to destroy
            this.game.gameState = GameState.DESTROY;
        });

        // Create all buttons for construction in the building button dropdown
        this.createFacilityButtons();
    }

    /**
     * Updates game menu UI with the current game state.
     * @param gameState State of game to switch to.
     */
    public switchUI(gameState: GameState): void {
        // Hide all game menu UI elements
        GameMenu.GAME_STANDARD_DIV.hidden = true;
        GameMenu.GAME_CONSTRUCTION_DIV.hidden = true;
        GameMenu.GAME_PAUSED_DIV.hidden = true;
        GameMenu.GAME_END_DIV.hidden = true;

        // Show correct game menu UI element based on the game state
        switch (gameState) {
            case GameState.STANDARD:
                GameMenu.GAME_STANDARD_DIV.hidden = false;
                break;
            case GameState.BUILD:
            case GameState.DESTROY:
                GameMenu.GAME_CONSTRUCTION_DIV.hidden = false;
                break;
            case GameState.PAUSED:
                GameMenu.GAME_PAUSED_DIV.hidden = false;
                break;
            case GameState.END:
                GameMenu.GAME_END_DIV.hidden = false;
                break;
        }
    }

    /**
     * Creates a button to build a facility type.
     * @param FacilityClass The class of the facility to create a button for.
     * @returns The button element.
     */
    private createFacilityButton<T extends {
        new (GAME: Game): Facility; 
        getSprite: (isometric: boolean) => HTMLImageElement; 
        NAME: string
    }>(FacilityClass: T): HTMLButtonElement {
        // Create button element
        const BUTTON: HTMLButtonElement = document.createElement("button");
        BUTTON.type = "button";
        BUTTON.className = "facility-button"; // Change class to style CSS properly
        
        // Create image icon of button and add to button
        const ICON: HTMLImageElement = FacilityClass.getSprite(true).cloneNode() as HTMLImageElement;
        ICON.className = "facility-icon";
        BUTTON.appendChild(ICON);

        // Create description text of facility and add to button
        const TITLE: HTMLParagraphElement = document.createElement("p");
        const TITLE_TEXT: Text = document.createTextNode(FacilityClass.NAME);
        TITLE.appendChild(TITLE_TEXT);
        BUTTON.appendChild(TITLE);

        // Add event listener to button to set the selected facility when clicked
        BUTTON.addEventListener("click", () => {
            // Hide dropdown
            GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.remove("show");
            GameMenu.CONSTRUCTION_BUILD_BUTTON.classList.remove("active");

            // Set the game state to build and set the selected facility
            this.game.gameState = GameState.BUILD;
            this.game.setSelectedFacility(FacilityClass);
        });

        return BUTTON;
    }

    /**
     * Creates buttons for all facility types.
     */
    private createFacilityButtons(): void {
        // Create array of all facility types
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

        // Create button for each facility type and add to the dropdown
        for (let i: number = 0; i < FACILITIES.length; i++) {
            GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.appendChild(
                this.createFacilityButton(FACILITIES[i])
            );
        }
    }

    public static hide(): void {
        GameMenu.GAME_MENU_DIV.hidden = true;
    }

    public static show(): void {
        GameMenu.GAME_MENU_DIV.hidden = false;
    }
}
