import { Game } from "../app/game.js";
import { GameMenu } from "../app/game_menu.js";
import { Canvas } from "../app/canvas.js";
import { Vector2 } from "../data_structures/vector.js";

/**
 * stores the categories of all possible facility sectors 
 */
export enum FacilitySector {
    INDUSTRIAL,
    COMMERCIAL,
    ESSENTIAL,
    DEFENSE,
    RESIDENTIAL
}

/**
 * String enum to store the type of all possible facility sectors and a corresponding string used to assist access to its sprite
 */
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

/**
 * Represents a the structure/blueprint of each facility
 */
export type FacilityClass = {
    /**
     * Constructor for instantiation
     * @param GAME Game instance the facility belongs to
     * @returns Returns a facility instanec
     */
    new (GAME: Game): Facility;
    /**
     * Gets the sprite of a facility
     * @param isometric If true, will return an isometric version of the sprite instead of 2D
     * @returns HTMLImageElement of the facility 
     */
    getSprite: (isometric: boolean) => HTMLImageElement; 
    /**
     * Name of the facility
     */
    NAME: string;
    /**
     * Cost to build the facility
     */
    BUILD_COST: number;
    /**
     * The sector and type of the facility
     */
    FACILITY_SECTOR: FacilitySector;
    FACILITY_TYPE: FacilityType;
    /**
     * Checks if player can afford the facility (brokie check)
     * @param money The amount of money the player has
     * @returns returns whether the player can afford the facility
     */
    canBuy(money: number): boolean;
};

/**
 * Abstract base class representing a facility and its components
 */
export abstract class Facility {
    /**
     * The facility's sector
     */
    protected static readonly _FACILITY_SECTOR: FacilitySector;

    /**
     * The specific facility type
     */
    protected static readonly _FACILITY_TYPE: FacilityType;

    /**
     * The facility's display name
     */
    protected static readonly _NAME: string;

    /**
     * The amount of power the facility consumes
     */
    protected static readonly _POWER_COST: number;

    /**
     * The cost to construct the facility
     */
    protected static readonly _BUILD_COST: number;

    /**
     * The recurring maintenance cost of the facility
     */
    protected abstract _maintenanceCost: number;

    /**
     * The amount of pollution the facility generates
     */
    protected abstract _pollution: number;

    /**
     * The amount of tax revenue the facility produces
     */
    protected abstract _taxRevenue: number;

    /**
     * The number of months the facility has existed
     */
    protected _age: number = 0;

    /**
     * The amount of power available to the facility
     */
    protected _powerAvailable : number = 0;

    /**
     * Deducts the build cost from the game's money on instantiation and applies the facility's pollution to every cell on the map
     * @param GAME The game instance the facility belongs to
     */
    public constructor(protected readonly GAME: Game) {
        this.GAME.money -= (this.constructor as typeof Facility)._BUILD_COST;
        for (let y = 0; y < this.GAME.MAP.height; y++) {
            for (let x = 0; x < this.GAME.MAP.width; x++) {
                this.GAME.MAP.getCell(new Vector2(x,y)).pollution += this.pollution;
            }
        }
    }

    /**
     * Static getter for the facility's sector
     */
    public static get FACILITY_SECTOR(): FacilitySector {
        return this._FACILITY_SECTOR;
    }

    /**
     * Instance getter for the facility's sector
     */
    public get FACILITY_SECTOR(): FacilitySector {
        return (this.constructor as typeof Facility)._FACILITY_SECTOR;
    }

    /**
     * Static getter for the facility's type
     */
    public static get FACILITY_TYPE(): FacilityType {
        return this._FACILITY_TYPE;
    }

    /**
     * Instance getter for the facility's type
     */
    public get FACILITY_TYPE(): FacilityType {
        return (this.constructor as typeof Facility)._FACILITY_TYPE;
    }

    /**
     * Static getter for the facility's name
     */
    public static get NAME(): string {
        return this._NAME;
    }

    /**
     * Returns the sprite image of the facility
     * @param isometric If true, returns the isometric version of the sprite.
     * @returns The facility's sprite image.
     */
    public getSprite(isometric: boolean): HTMLImageElement {
        let directory: string = `res/assets/buildings/${isometric ? "isometric": "straight"}/${(this.constructor as typeof Facility).FACILITY_TYPE}.png`;
        return Canvas.ImageLoader.getImage(directory);
    }

    /**
     * Static version of getSprite for retrieving the sprite without instantiating the class.
     * @param isometric - If true, returns the isometric version of the sprite.
     * @returns The facility's sprite image.
     */
    public static getSprite(isometric: boolean): HTMLImageElement {
        let directory: string = `res/assets/buildings/${isometric ? "isometric": "straight"}/${this.FACILITY_TYPE}.png`;
        return Canvas.ImageLoader.getImage(directory);
    }

    /**
     * Static getter for the facility's build cost
     */
    public static get BUILD_COST(): number {
        return this._BUILD_COST;
    }

    /**
     * Getter for the facility's maintenance cost
     */
    public get maintenanceCost(): number {
        return this._maintenanceCost;
    }

    /**
     * Getter for the facility's tax revenue
     */
    public get taxRevenue(): number {
        return this._taxRevenue;
    }

    /**
     * Static getter for the facility's power cost
     */
    public static get POWER_COST(): number {
        return this._POWER_COST;
    }

    /**
     * Getter for the amount of power available to this facility
     */
    public get powerAvailable(): number {
        return this._powerAvailable;
    }

    /**
     * Setter for the amount of power available to this facility
     * @param powerAvailable The amount of power availabl
     */
    public set powerAvailable(powerAvailable: number) {
        this._powerAvailable = powerAvailable;
    }

    /**
     * Getter for the amount of pollution
     */
    public get pollution(): number {
        return this._pollution;
    }

    /**
     * Getter for the facility's age
     */
    public get age(): number {
        return this._age;
    }

    /**
     * Called every game tick, only runs if month has ended
     * Increments age and updates the game's money by applying revenue and maintenance
     */
    public tick(): void {
        //NOTE TO SELF, TICK RUNS LIKE 60 TIMES A SECOND. CHECK IF MONTH ENDED, AND DON'T RUN IT EVERY TICK
        if (this.GAME.monthEnded()) {
            this._age++;
            this.GAME.money += this._taxRevenue
            this.GAME.money -= this._maintenanceCost;
        }
    }

    /**
     * Static method to determine whether the facility can be bought with the given money 
     * @param money The current amount of money available
     * @returns True if the player can afford the facility, false otherwise
     */
    public static canBuy(money: number): boolean {
        return money >= this._BUILD_COST;
    }
}