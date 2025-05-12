import { Game, GameState } from "./game.js";
import { Facility } from "../facility/facility.js";
import { LuxuryHome, ComfortableHome, AffordableHome } from "../facility/facility_types/residential.js";
import { DefenseFacility } from "../facility/facility_types/defense.js";
import { EmergencyBuilding, EducationCentre, MedicalCentre, Government, PowerPlant } from "../facility/facility_types/essential.js";
import { Restaurant, Store, Office } from "../facility/facility_types/commercial.js";
import { EnvironmentalFacility, Factory, Warehouse } from "../facility/facility_types/industrial.js";

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
            this.game.setSelectedFacility(FacilityClass);
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
