import { Vector2 } from "../../data_structures/vector.js";
import { Facility, FacilityType, FacilitySector } from "../facility.js";
import { GameMap } from "../../map/map.js";
import { Game } from "../../app/game.js";


/**
 * Represents a Residential facility and its components.
 */
export abstract class ResidentialFacility extends Facility {

    protected static readonly _FACILITY_SECTOR = FacilitySector.RESIDENTIAL;
    protected static readonly _MAX_POPULATION: number;
    //The ratio of happy people in the residential facility
    protected static readonly _HAPPINESS_RATIO: number;
    //The tax revenue generated per 1000 residents in addition to the base tax revenue
    protected static readonly _TAX_REVENUE_PER_UNIT: number;
    //The maintenance cost added per 1000 residents in addition to the base maintenance cost
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number;
    protected static readonly _BASE_MAINTENANCE_COST: number;
    //Pollution units added per 1000 residents
    protected static readonly _POLLUTION_PER_UNIT: number;
    protected static readonly _BUILD_COST: number;
    protected static readonly _POWER_COST: number;
    //The rate (expressed as a decimal) that a residential facility's population increases each month
    protected static readonly _GROWTH_RATE: number = 0.1;
    protected _population: number = 0;
    protected _taxRevenue: number = 0;
    protected _maintenanceCost: number = (this.constructor as typeof ResidentialFacility)._BASE_MAINTENANCE_COST;
    protected _pollution: number = 0;
    
    protected updateTaxRevenue() : void {
        this._taxRevenue = Math.round(
            (this._population / 1000) * 
            (this.constructor as typeof ResidentialFacility)._TAX_REVENUE_PER_UNIT *
            100
        ) / 100;
    }
    /**
     *Assigns the maintenance according to the base maintenance cost in addition to how many thousands of people there are 
     */
    protected updateMaintenanceCost() : void {
        this._maintenanceCost = Math.round(
            (this.constructor as typeof ResidentialFacility)._BASE_MAINTENANCE_COST + 
            (this.population / 1000) * 
            (this.constructor as typeof ResidentialFacility)._MAINTENANCE_COST_PER_UNIT *
            100
        ) / 100;
    }
    /**
     * Assigns the amount pollution according to how many thousands of people there are
     */
    protected updatePollution() : void {
        this._pollution = (Math.floor(
            this._population / 1000) * 
            (this.constructor as typeof ResidentialFacility)._POLLUTION_PER_UNIT
        );
    }
    /**
     * Updates this facility when the month ends
     */
    public override tick(): void {
        super.tick();

        if (this.GAME.monthEnded()) {
            this.population = Math.min(
                (
                    (this.constructor as typeof ResidentialFacility)._MAX_POPULATION * 
                    (this.constructor as typeof ResidentialFacility)._GROWTH_RATE * 
                    this._age
                ), (this.constructor as typeof ResidentialFacility)._MAX_POPULATION
            );

            //Idk anymore just update the shit and then push it out there
            this.updateTaxRevenue();
            this.updateMaintenanceCost();
            this.updatePollution();
        }
    }

    /** The residence's population */
    public get population(): number {
        return this._population;
    }

    /** The residence's population */
    public set population(population: number) {
        const DIFFERENCE: number = population - this._population;
        this._population = population;
        this.GAME.population += DIFFERENCE;
        this.GAME.happyPopulation += DIFFERENCE * (this.constructor as typeof ResidentialFacility)._HAPPINESS_RATIO;
        this.GAME.contentedPopulation += DIFFERENCE - (DIFFERENCE * (this.constructor as typeof ResidentialFacility)._HAPPINESS_RATIO);
    }

    /** The happy population of the residence, takes the happiness ratio from a subclass */
    public get happyPopulation(): number {
        return this._population * (this.constructor as typeof ResidentialFacility)._HAPPINESS_RATIO;
    }
    /** The content population of the residence, takes the happiness ratio from a subclass */
    public get contentPopulation(): number {
        return this._population - (this._population * (this.constructor as typeof ResidentialFacility)._HAPPINESS_RATIO);
    }

    /** Resets the game statistics once facility is destroyed. */
    public override resetAfterDestroy(): void {
        super.resetAfterDestroy();
        this.GAME.population -= this.population;
        this.GAME.happyPopulation -= this.happyPopulation;
        this.GAME.contentedPopulation -= this.contentPopulation;
    }
}

/** Represents a luxury home and its components */
export class LuxuryHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.LUXURY_HOME;
    protected static readonly _NAME:  string  = "Luxury Home";
    protected static readonly _MAX_POPULATION: number = 10000;
    //the maximum population if it's not within the requisite distance to a store and restaurant
    private static readonly _MAX_UNIDEAL_POPULATION: number = 5000;
    //The ratio of happy to content people
    protected static readonly _HAPPINESS_RATIO: number = 0.5;
    //The tax revenue generated per 1000 residents in addition to the base tax revenue
    protected static readonly _TAX_REVENUE_PER_UNIT: number = 15000000;
    //The maintenance cost added per 1000 residents in addition to the base maintenance cost
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number = 1000000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 10000000;
    //The pollution added per 1000 residents in addition to the base maintenance cost
    protected static readonly _POLLUTION_PER_UNIT: number = 500;
    protected static readonly _BUILD_COST: number = 1000000000;
    protected static readonly _POWER_COST: number = 100;

    private unideal: boolean = false;
    
    /**
     * 
     * @param coordinates The coords of the search's origin, this would be the coord of the cell the luxury home is in
     * @returns Returns true if the BFS finds both a store and a restaurant in radius of 1
     */
    private facilityCheck(coordinates: Vector2): boolean {
        return (
            this.GAME.MAP.BFS(
                coordinates,
                1,
                (coords: Vector2): boolean => {
                    return this.GAME.MAP.getCell(coords).facilityType == FacilityType.STORE;
                }
            ) &&
            this.GAME.MAP.BFS(
                coordinates,
                1,
                (coords: Vector2): boolean => {
                    return this.GAME.MAP.getCell(coords).facilityType == FacilityType.RESTAURANT;
                }
            )
        );
    }

    public adjustMaxPopulation(coordinates: Vector2): void {
        this.unideal = !this.facilityCheck(coordinates);
    }

    public override tick(): void {
        super.tick();

        const MAX: number = this.unideal ? LuxuryHome._MAX_UNIDEAL_POPULATION: LuxuryHome._MAX_POPULATION

        if (this._population > MAX) {
            this.population = MAX;
        }
    }
}

/**
 * Represents a comfortable home and its components
 */
export class ComfortableHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.COMFORTABLE_HOME;
    protected static readonly _NAME: string = "Comfortable Home";
    protected static readonly _MAX_POPULATION: number = 15000;
    //The ratio of people that will be happy in the residence
    protected static readonly _HAPPINESS_RATIO: number = 0.25;
    //Tax revenue generated per 1000 people
    protected static readonly _TAX_REVENUE_PER_UNIT: number = 1000000;
    //Mainternance cost per 1000 people
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number = 50000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 40000;
    //Pollution generated per 1000 people
    protected static readonly _POLLUTION_PER_UNIT: number = 50;
    protected static readonly _BUILD_COST: number= 500000000;
    protected static readonly _POWER_COST: number = 50;

}

/**
 * Represents an affordable home and its components
 */
export class AffordableHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.AFFORDABLE_HOME;
    protected static readonly _NAME: string = "Affordable Home";

    protected static readonly _MAX_POPULATION: number = 25000;
    //Ratio of happy people in the residence
    protected static readonly _HAPPINESS_RATIO: number = 0.1;
    //Tax revenue generated per 1000 people
    protected static readonly _TAX_REVENUE_PER_UNIT: number = 10000;
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number = 2000;
    //Maintenance cost per 1000 people
    protected static readonly _BASE_MAINTENANCE_COST: number = 8000;
    //Pollution generated per 1000 people
    protected static readonly _POLLUTION_PER_UNIT: number = 0;
    protected static readonly _BUILD_COST: number = 50000000;
    protected static readonly _POWER_COST: number = 25;

    /** if population is at max, will make the pollution 10 units per 1000 people */
    protected override updatePollution(): void {
        if (this._population === AffordableHome._MAX_POPULATION) {
            this._pollution = Math.floor(this.population/1000) * 10;
        }
    }
}
