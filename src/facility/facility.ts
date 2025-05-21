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

    protected static readonly _POWER_COST: number;

    protected static readonly _BUILD_COST: number;

    protected abstract _maintenanceCost: number;

    protected abstract _pollution: number;

    protected abstract _taxRevenue: number;

    protected _age: number = 0;

    protected _powerAvailable : number = 0;

    public constructor(protected readonly GAME: Game) {
        
    }

    public static get FACILITY_SECTOR(): FacilitySector {
        return this._FACILITY_SECTOR;
    }

    public get FACILITY_SECTOR(): FacilitySector {
        return (this.constructor as typeof Facility)._FACILITY_SECTOR;
    }

    public static get FACILITY_TYPE(): FacilityType {
        return this._FACILITY_TYPE;
    }

    public get FACILITY_TYPE(): FacilityType {
        return (this.constructor as typeof Facility)._FACILITY_TYPE;
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

    public static get BUILD_COST(): number {
        return this._BUILD_COST;
        //cell will get the buildcost and suubstract muney
    }
    public get maintenanceCost(): number {
        return this._maintenanceCost;
    }
    public get taxRevenue(): number {
        return this._taxRevenue;
    }
    public static get POWER_COST(): number {
        return this._POWER_COST;
    }

    public get powerAvailable(): number {
        return this._powerAvailable;
    }

    public set powerAvailable(powerAvailable: number) {
        this._powerAvailable = powerAvailable;
    }

    public get pollution(): number {
        return this._pollution;
    }

    public get age(): number {
        return this._age;
    }

    public tick(): void {
        this._age++;
        //tax revenue subtracts from money in game through setter
        //Set money to subtract mainternance cost
        //Update pollution units using what subclasses provide
        //
        
    }
}

