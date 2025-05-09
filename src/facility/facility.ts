import { Game } from "../app/game.js";
import { Canvas } from "../app/canvas.js";

export enum FacilitySector {
    INDUSTRIAL,
    COMMERCIAL,
    ESSENTIAL,
    DEFENSE,
    RESIDENTIAL
}

export enum FacilityType {
    EMERGENCY = "emergency",
    EDUCATION = "education",
    MEDICAL = "medical",
    GOVERNMENT = "government",
    POWER = "power",
    LUXURY_HOME = "luxury_home",
    COMFORTABLE_HOME = "comfortable_home",
    AFFORDABLE_HOME = "affordable_home",
    FACTORY = "factory",
    WAREHOUSE = "warehouse",
    ENVIRONMENT = "environment",
    STORE = "store",
    RESTAURANT = "restaurant",
    OFFICE = "office",
    DEFENSE = "defense"
}

export abstract class Facility {
    protected abstract readonly _FACILITY_SECTOR: FacilitySector;
    protected abstract readonly _FACILITY_TYPE: FacilityType;

    public constructor(protected readonly GAME: Game) {
        
    }

    public get FACILITY_SECTOR(): FacilitySector {
        return this._FACILITY_SECTOR;
    }

    public get FACILITY_TYPE(): FacilityType {
        return this._FACILITY_TYPE;
    }

    public getSprite(isometric: boolean): HTMLImageElement {
        let directory: string = `res/assets/buildings/${isometric ? "isometric": "straight"}/${this.FACILITY_TYPE}.png`;
        return Canvas.ImageLoader.getImage(directory);
    }
}
