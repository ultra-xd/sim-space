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
    protected static readonly _FACILITY_SECTOR: FacilitySector;
    protected static readonly _FACILITY_TYPE: FacilityType;
    protected static readonly _NAME: string;

    protected abstract _buildcost : number;
    protected abstract _maintenanceCost : number ;
    protected abstract _taxRevenue : number;
    protected abstract _powerUnits : number;
    protected abstract _pollution : number;
    protected abstract _name : string;

    public constructor(protected readonly GAME: Game) {
        
    }

    public static get FACILITY_SECTOR(): FacilitySector {
        return this._FACILITY_SECTOR;
    }

    public static get FACILITY_TYPE(): FacilityType {
        return this._FACILITY_TYPE;
    }

    public static get NAME(): string {
        return this._NAME;
    }

    public getSprite(isometric: boolean): HTMLImageElement {
        let directory: string = `res/assets/buildings/${isometric ? "isometric": "straight"}/${(this.constructor as typeof Facility).FACILITY_TYPE}.png`;
        return Canvas.ImageLoader.getImage(directory);
    }
    
    public static getSprite(isometric: boolean): HTMLImageElement {
        let directory: string = `res/assets/buildings/${isometric ? "isometric": "straight"}/${this.FACILITY_TYPE}.png`;
        return Canvas.ImageLoader.getImage(directory);
    }

    public get buildCost(): number {
        return this._buildcost;
    }
    public get maintenanceCost(): number {
        return this._maintenanceCost;
    }
    public get taxRevenue(): number {
        return this._taxRevenue;
    }
    public get powerUnits(): number {
        return this._powerUnits;
    }
    public get pollution(): number {
        return this._pollution;
    }
    public get name(): string {
        return this._name;
    }
}

