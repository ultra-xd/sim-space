import { App, AppState } from "./app.js";
import { assert } from "../util/util.js";
import { Queue } from "../data_structures/queue.js";
import { Game, GameState } from "./game.js";
import { Facility, FacilitySector, FacilityType, FacilityClass } from "../facility/facility.js";
import { LuxuryHome, ComfortableHome, AffordableHome, ResidentialFacility } from "../facility/facility_types/residential.js";
import { DefenseFacility } from "../facility/facility_types/defense.js";
import { EmergencyBuilding, EducationCentre, MedicalCentre, Government, PowerPlant } from "../facility/facility_types/essential.js";
import { Restaurant, Store, Office } from "../facility/facility_types/commercial.js";
import { EnvironmentalFacility, Factory, Warehouse } from "../facility/facility_types/industrial.js";

/** Class that handles the game menu UI. */
export class GameMenu {
    // Get all HTML elements
    public static readonly GAME_MENU_DIV: HTMLDivElement = document.getElementById("game-menu") as HTMLDivElement;

    public static readonly GAME_STANDARD_DIV: HTMLDivElement = document.getElementById("game-standard") as HTMLDivElement;

    public static readonly GAME_CONSTRUCTION_DIV: HTMLDivElement = document.getElementById("game-construction") as HTMLDivElement;

    public static readonly GAME_PAUSED_DIV: HTMLDivElement = document.getElementById("game-paused") as HTMLDivElement;

    public static readonly GAME_END_DIV: HTMLDivElement = document.getElementById("game-end") as HTMLDivElement;

    public static readonly FACILITY_INFO_DIV: HTMLDivElement = document.getElementById("facility-info") as HTMLDivElement;

    public static readonly FACILITY_NAME_PARAGRAPH: HTMLParagraphElement = document.getElementById("facility-name") as HTMLParagraphElement;

    public static readonly FACILITY_AGE_SPAN: HTMLSpanElement = document.getElementById("facility-age") as HTMLSpanElement;

    public static readonly FACILITY_POWER_AVAILABLE_SPAN: HTMLSpanElement = document.getElementById("facility-power-consume") as HTMLSpanElement;

    public static readonly FACILITY_POWER_COST_SPAN: HTMLSpanElement = document.getElementById("facility-max-power") as HTMLSpanElement;

    public static readonly FACILITY_TAX_REVENUE_SPAN: HTMLSpanElement = document.getElementById("facility-tax-revenue") as HTMLSpanElement;

    public static readonly FACILITY_MAINTENANCE_COST_SPAN: HTMLSpanElement = document.getElementById("facility-maintenance-cost") as HTMLSpanElement;

    public static readonly FACILITY_POLLUTION_SPAN: HTMLSpanElement = document.getElementById("facility-pollution") as HTMLSpanElement;

    public static readonly FACILITY_ADDITIONAL_INFO: HTMLParagraphElement = document.getElementById("facility-additional-info") as HTMLParagraphElement;

    public static readonly FACILITY_INFO_SPRITE: HTMLImageElement = document.getElementById("facility-info-sprite") as HTMLImageElement;

    public static readonly STATS_MONEY_SPAN: HTMLSpanElement = document.getElementById("stats-money-display") as HTMLSpanElement;

    public static readonly STATS_DATE_PARAGRAPH: HTMLParagraphElement = document.getElementById("stats-date-display") as HTMLParagraphElement;

    public static readonly STATS_POPULATION_SPAN: HTMLSpanElement = document.getElementById("stats-population-display") as HTMLSpanElement;

    public static readonly STATS_SCORE_SPAN: HTMLSpanElement = document.getElementById("stats-score-display") as HTMLSpanElement;

    public static readonly STATS_POLLUTION_AT_CELL_SPAN: HTMLSpanElement = document.getElementById("stats-pollution-display") as HTMLSpanElement;

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

    public static readonly PAUSED_MENU_BUTTON: HTMLButtonElement = document.getElementById("pause-return-to-menu") as HTMLButtonElement;

    public static readonly PAUSED_CONTINUE_BUTTON: HTMLButtonElement = document.getElementById("pause-continue-game") as HTMLButtonElement;

    public static readonly END_MENU_BUTTON: HTMLButtonElement = document.getElementById("end-return-to-menu") as HTMLButtonElement;

    private static _facilityDisplayed: Facility | null = null;

    /**
     * Creates a new GameMenu.
     * @param game The game instance for GameMenu to handle.
     */
    public constructor(private readonly game: Game) {};

    /** Sets up the game menu UI, including event listeners, creating buttons, etc. */
    public setup(): void {
        // Reset status of dropdowns, etc.
        GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.remove("show");
        GameMenu.FACILITY_INFO_DIV.classList.remove("show");

        // Handle event listener for building button dropdown
        GameMenu.CONSTRUCTION_BUILD_BUTTON.onclick = () => {
            // Toggle the display of the building button dropdown if not shown, otherwise hide it
            if (!GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.contains("show")) {
                GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.add("show");
                GameMenu.CONSTRUCTION_BUILD_BUTTON.classList.add("active");
            } else {
                GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.remove("show");
                GameMenu.CONSTRUCTION_BUILD_BUTTON.classList.remove("active");
            }
        };

        // Handle event listener of zoom in button
        GameMenu.MAP_ZOOM_IN_BUTTON.onclick = () => {
            // Don't zoom in if the camera is animating
            if (this.game.CAMERA.isAnimating()) return;
            
            // Create a zoom animation to zoom in by a factor of 2
            this.game.CAMERA.createZoomAnimation(
                this.game.CAMERA.pixelsPerUnit * 2
            );
        };

        // Handle event listener of zoom out button
        GameMenu.MAP_ZOOM_OUT_BUTTON.onclick = () => {
            // Don't zoom out if the camera is animating
            if (this.game.CAMERA.isAnimating()) return;

            // Create a zoom animation to zoom out by a factor of 2
            this.game.CAMERA.createZoomAnimation(
                this.game.CAMERA.pixelsPerUnit / 2
            );
        };

        // Handle event listener of reset button, which resets the camera to its default position
        GameMenu.MAP_RESET_BUTTON.onclick = () => {
            // Don't reset the camera if it is animating
            if (this.game.CAMERA.isAnimating()) return;

            // Create a move animation to move the camera to its default position
            this.game.CAMERA.createMoveAnimation(
                this.game.CAMERA.DEFAULT_CENTER,
                this.game.CAMERA.DEFAULT_PIXELS_PER_UNIT
            );
        };

        // Handle event listener of view change button, which switches between isometric and top down view
        GameMenu.MAP_VIEW_CHANGE_BUTTON.onclick = () => {
            // Switch the camera view
            this.game.CAMERA.switchView();

            // Update the button icon to reflect the view change (isometric -> top down, or vice versa)
            if (this.game.CAMERA.isIsometric()) {
                GameMenu.MAP_VIEW_CHANGE_BUTTON_IMG.src = "res/assets/icons/straight-icon.png";
            } else {
                GameMenu.MAP_VIEW_CHANGE_BUTTON_IMG.src = "res/assets/icons/isometric-icon.png";
            }
        };

        // Handle event listener of cancel button, which cancels the current construction
        GameMenu.CONSTRUCTION_CANCEL_BUTTON.onclick = () => {
            // Change game state to standard viewing
            this.game.gameState = GameState.STANDARD;
        };

        // Handle event listener of delete button, which changes the game state to destroy
        GameMenu.CONSTRUCTION_DELETE_BUTTON.onclick = () => {
            // Change game state to destroy
            this.game.gameState = GameState.DESTROY;
        };

        // Handle event listener of continue button in pause menu, which continues game
        GameMenu.PAUSED_CONTINUE_BUTTON.onclick = () => {
            // Change game state to standard viewing
            this.game.gameState = GameState.STANDARD;
        }

        // Handle event listener of menu buttons, which returns user back to start menu
        GameMenu.PAUSED_MENU_BUTTON.onclick = () => {
            // Change app state back to start menu
            App.changeAppState(AppState.START_MENU);
        }

        GameMenu.END_MENU_BUTTON.onclick = () => {
            // Change app state back to start menu
            App.changeAppState(AppState.START_MENU);
        }

        // Create all buttons for construction in the building button dropdown
        this.createFacilityButtons();

        // Reset UI back to standard viewing
        GameMenu.switchUI(GameState.STANDARD);
    }
    
    public static set facilityDisplayed(facility: Facility | null) {
        this._facilityDisplayed = facility;
        if (facility == null) {
            this.hideFacilityInfo();
        } else {
            this.showFacilityInfo();
        }
    }

    /**
     * Shows all info of the facility given on the game menu.
     * @param this.facilityDisplayed The facility whose info is displayed.
     */
    public static showFacilityInfo(): void {
        if (this._facilityDisplayed == null) return;

        // Showing information of facility
        GameMenu.FACILITY_NAME_PARAGRAPH.innerText = (this._facilityDisplayed.constructor as typeof Facility).NAME;
        GameMenu.FACILITY_AGE_SPAN.innerText = String(this._facilityDisplayed.age);
        GameMenu.FACILITY_POWER_AVAILABLE_SPAN.innerText = String(this._facilityDisplayed.powerAvailable);
        GameMenu.FACILITY_POWER_COST_SPAN.innerText = String((this._facilityDisplayed.constructor as typeof Facility).POWER_COST);
        GameMenu.FACILITY_TAX_REVENUE_SPAN.innerText = Intl.NumberFormat( // Format as money
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        ).format(this._facilityDisplayed.taxRevenue);

        GameMenu.FACILITY_MAINTENANCE_COST_SPAN.innerText = Intl.NumberFormat( // Format as money
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        ).format(this._facilityDisplayed.maintenanceCost);

        GameMenu.FACILITY_POLLUTION_SPAN.innerText = this._facilityDisplayed.pollution.toFixed(0);

        // Show sprite of facility, in isometric view
        GameMenu.FACILITY_INFO_SPRITE.src = this._facilityDisplayed.getSprite(true).src;

        let additionalInfoText: string = "";

        // Show populations of facility if residential
        if (this._facilityDisplayed.FACILITY_SECTOR == FacilitySector.RESIDENTIAL) {
            additionalInfoText += `Population: ${
                (this._facilityDisplayed as ResidentialFacility).population.toFixed(0)
            }\n`;

            additionalInfoText += `Happy Population: ${
                (this._facilityDisplayed as ResidentialFacility).happyPopulation.toFixed(0)
            }\n`;

            additionalInfoText += `Content Population: ${
                (this._facilityDisplayed as ResidentialFacility).contentPopulation.toFixed(0)
            }\n`;
        }

        // Show power produced if power plant
        if (this._facilityDisplayed.FACILITY_TYPE == FacilityType.POWER) {
            additionalInfoText += `Power Produced: ${PowerPlant.POWER_PRODUCED}\n`;
        }

        // Show pollution reduction if environment
        if (this._facilityDisplayed.FACILITY_TYPE == FacilityType.ENVIRONMENT) {
            additionalInfoText += `Pollution Reduced: ${EnvironmentalFacility.MAX_POLLUTION_REDUCTION}\n`;
        }

        GameMenu.FACILITY_ADDITIONAL_INFO.innerText = additionalInfoText;

        // Show info box
        if (!GameMenu.FACILITY_INFO_DIV.classList.contains("show")) {
            GameMenu.FACILITY_INFO_DIV.classList.add("show");
        }
    }

    /** Hides the facility info box. */
    public static hideFacilityInfo(): void {
        if (GameMenu.FACILITY_INFO_DIV.classList.contains("show")) {
            GameMenu.FACILITY_INFO_DIV.classList.remove("show");
        }
    }

    /**
     * Updates game menu UI with the current game state.
     * @param gameState State of game to switch to.
     */
    public static switchUI(gameState: GameState): void {
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
    private createFacilityButton<T extends FacilityClass>(FacilityClass: T): HTMLButtonElement {
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

        // Show cost of facility to build
        const COST: HTMLParagraphElement = document.createElement("p");
        const COST_TEXT: Text = document.createTextNode(Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        ).format(FacilityClass.BUILD_COST));
        COST.appendChild(COST_TEXT);
        COST.className = "cost-display";
        BUTTON.appendChild(COST);

        // Add event listener to button to set the selected facility when clicked
        BUTTON.addEventListener("click", () => {
            // Hide dropdown
            GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.classList.remove("show");
            GameMenu.CONSTRUCTION_BUILD_BUTTON.classList.remove("active");

            // Set the game state to build and set the selected facility
            this.game.setSelectedFacility(FacilityClass);
            this.game.gameState = GameState.BUILD;
        });

        return BUTTON;
    }

    /** Creates buttons for all facility types and stores them in the construction menu. */
    private createFacilityButtons(): void {
        GameMenu.CONSTRUCTION_BUILDINGS_DISPLAY_DIV.innerHTML = "";
        // Create array of all facility types
        const FACILITIES: FacilityClass[] = [
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

    /** Updates the statistics of the game onto the game menu. */
    public updateStatsDisplay(): void {
        GameMenu.STATS_MONEY_SPAN.innerText = Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        ).format(this.game.money);
        GameMenu.STATS_DATE_PARAGRAPH.innerText = `Month ${this.game.month}`;
        GameMenu.STATS_POPULATION_SPAN.innerText = this.game.population.toFixed(0);
        GameMenu.STATS_SCORE_SPAN.innerText = this.game.score.toFixed(0);
    }

    public static updatePollutionDisplay(pollution: number): void {
        GameMenu.STATS_POLLUTION_AT_CELL_SPAN.innerText = pollution.toFixed(2);
    }

    /** Hides all HTML elements on the game menu. */
    public static hide(): void {
        GameMenu.GAME_MENU_DIV.hidden = true;
    }

    /** Shows all HTML elements on the game menu. */
    public static show(): void {
        GameMenu.GAME_MENU_DIV.hidden = false;
    }

    /** Handles all that appear in the bottom right corner of the screen. */
    public static NotificationManager = class {
        private static readonly NOTIFICATION_QUEUE: Queue<string> = new Queue<string>(); // Create queue to store all notifications
        private static readonly NOTIFICATION_LENGTH: number = 3; // Store length that notifications are shown on screen in seconds
        private static readonly COOLDOWN_LENGTH: number = 1; // Store length between each notification
        private static tickCycle: number = 0;

        private static showing: boolean = false; // Store if a notification is being display on screen
        private static inCycle: boolean = false; // Store if notifications are being cycled in the queue

        // Store elements displaying the notification
        private static readonly NOTIFICATION_DIV: HTMLDivElement = document.getElementById("notification-box") as HTMLDivElement;
        private static readonly NOTIFICATION_PARAGRAPH: HTMLParagraphElement = document.getElementById("notification-text") as HTMLParagraphElement;
        
        /**
         * Creates a notification to display to the screen.
         * @param message The message to display to the screen.
         */
        public static createNotification(message: string): void {
            // Enqueuethe message into the notification queue
            GameMenu.NotificationManager.NOTIFICATION_QUEUE.enqueue(message);
        }

        /** Updates the notification manager. */
        public static tick(): void {
            if (GameMenu.NotificationManager.inCycle) {
                GameMenu.NotificationManager.tickCycle++;

                // Hide notification if it is showing and it should be hidden
                if (
                    GameMenu.NotificationManager.showing &&
                    GameMenu.NotificationManager.tickCycle / App.TPS >= GameMenu.NotificationManager.NOTIFICATION_LENGTH
                ) {
                    GameMenu.NotificationManager.hideNotification();
                }

                // Reset notification cycle if at end of queue
                if (GameMenu.NotificationManager.tickCycle / App.TPS >= GameMenu.NotificationManager.NOTIFICATION_LENGTH + GameMenu.NotificationManager.COOLDOWN_LENGTH) {
                    GameMenu.NotificationManager.inCycle = false;
                    GameMenu.NotificationManager.tickCycle = 0;
                }
            } else {
                // Show new notification if it can
                if (!GameMenu.NotificationManager.NOTIFICATION_QUEUE.isEmpty()) {
                    GameMenu.NotificationManager.showNotification();
                }
            }
        }

        /** Updates the notification message shows the notification box on screen. */
        public static showNotification(): void {
            // Get the oldest notification message
            const NOTIFICATION_MESSAGE: string | null = GameMenu.NotificationManager.NOTIFICATION_QUEUE.dequeue();
            assert (NOTIFICATION_MESSAGE != null);

            // Update cycle information
            GameMenu.NotificationManager.showing = true;
            GameMenu.NotificationManager.inCycle = true;

            // Update notification text
            GameMenu.NotificationManager.NOTIFICATION_PARAGRAPH.innerText = NOTIFICATION_MESSAGE;

            // Show notification box
            if (!GameMenu.NotificationManager.NOTIFICATION_DIV.classList.contains("show")) {
                GameMenu.NotificationManager.NOTIFICATION_DIV.classList.add("show");
            }
        }

        /** Hides the notification box from the screen. */
        public static hideNotification(): void {
            // Update cycle information
            GameMenu.NotificationManager.showing = false;

            // Hide notification box
            if (GameMenu.NotificationManager.NOTIFICATION_DIV.classList.contains("show")) {
                GameMenu.NotificationManager.NOTIFICATION_DIV.classList.remove("show");
            }
        }
    }
}
