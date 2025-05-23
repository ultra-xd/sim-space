import { Vector2 } from "../../data_structures/vector.js";
import { Facility, FacilityType, FacilitySector } from "../facility.js";

/** Represents a Residential facility and its components. */
export abstract class ResidentialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.RESIDENTIAL;
    protected static readonly _MAX_POPULATION: number;

    // The ratio of happy people in the residential facility
    protected static readonly _HAPPINESS_RATIO: number;

    // The tax revenue generated per 1000 residents in addition to the base tax revenue
    protected static readonly _TAX_REVENUE_PER_UNIT: number;

    // The maintenance cost added per 1000 residents in addition to the base maintenance cost
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number;
    protected static readonly _BASE_MAINTENANCE_COST: number;

    // Pollution units added per 1000 residents
    protected static readonly _POLLUTION_PER_UNIT: number;
    protected static readonly _BUILD_COST: number;
    protected static readonly _POWER_COST: number;

    // The rate (expressed as a decimal) that a residential facility's population increases each month
    protected static readonly _GROWTH_RATE: number = 0.1;
    protected _population: number = 0;
    protected _taxRevenue: number = 0;
    protected _maintenanceCost: number = (this.constructor as typeof ResidentialFacility)._BASE_MAINTENANCE_COST;
    protected _pollution: number = 0;

    /** Updates tax revenue of facility based on how many people live there */
    protected updateTaxRevenue(): void {
        this._taxRevenue = Math.round(
            (this._population / 1000) * 
            (this.constructor as typeof ResidentialFacility)._TAX_REVENUE_PER_UNIT *
            100
        ) / 100;
    }

    /** 
     * Assigns the maintenance according to the base maintenance
     * cost in addition to how many thousands of people there are 
     * */
    protected updateMaintenanceCost(): void {
        this._maintenanceCost = Math.round(
            (this.constructor as typeof ResidentialFacility)._BASE_MAINTENANCE_COST + 
            (this.population / 1000) * 
            (this.constructor as typeof ResidentialFacility)._MAINTENANCE_COST_PER_UNIT *
            100
        ) / 100;
    }

    /** Assigns the amount pollution according to how many thousands of people there are */
    protected updatePollution(): void {
        this._pollution = (Math.floor(
            this._population / 1000) * 
            (this.constructor as typeof ResidentialFacility)._POLLUTION_PER_UNIT
        );
    }

    /** Updates this facility when the month ends */
    public override tick(): void {
        super.tick();

        if (this.GAME.monthEnded()) {
            // Cap the population at max
            this.population = Math.min(
                (
                    (this.constructor as typeof ResidentialFacility)._MAX_POPULATION * 
                    (this.constructor as typeof ResidentialFacility)._GROWTH_RATE * 
                    this._age
                ), (this.constructor as typeof ResidentialFacility)._MAX_POPULATION
            );

            // Update tax revenue, pollution and maintenance cost
            this.updateTaxRevenue();
            this.updateMaintenanceCost();
            this.updatePollution();
        }
    }

    /** Resets the game population after destroyed as well. */
    public override resetAfterDestroy(): void {
        super.resetAfterDestroy();
        this.GAME.population -= this.population;

        // Also update happy and content populations
        this.GAME.happyPopulation -= this.happyPopulation;
        this.GAME.contentedPopulation -= this.contentPopulation;
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
}

/** Represents a luxury home and its components */
export class LuxuryHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.LUXURY_HOME;
    protected static readonly _NAME:  string  = "Luxury Home";
    protected static readonly _MAX_POPULATION: number = 10000;

    // The maximum population if it's not within the requisite distance to a store and restaurant
    private static readonly _MAX_UNIDEAL_POPULATION: number = 5000;

    protected static readonly _HAPPINESS_RATIO: number = 0.5;
    protected static readonly _TAX_REVENUE_PER_UNIT: number = 15000000;
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number = 1000000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 10000000;
    protected static readonly _POLLUTION_PER_UNIT: number = 500;
    protected static readonly _BUILD_COST: number = 1000000000;
    protected static readonly _POWER_COST: number = 100;

    // Stores whether facility is within the requisite distance to a store and restaurant
    private unideal: boolean = false;
    
    /**
     * Checks if a store and a restaurant are next to the facility
     * @param coordinates The coords of the search's origin, 
     * this would be the coord of the cell the luxury home is in
     * @returns True if found both a store and a restaurant in radius of 1, false otherwise
     */
    private facilityCheck(coordinates: Vector2): boolean {
        return (
            // Find a store within 1 unit
            this.GAME.MAP.BFS(
                coordinates,
                1,
                (coords: Vector2): boolean => {
                    return this.GAME.MAP.getCell(coords).facilityType == FacilityType.STORE;
                }
            ) &&

            // Find a restaurant within 1 unit
            this.GAME.MAP.BFS(
                coordinates,
                1,
                (coords: Vector2): boolean => {
                    return this.GAME.MAP.getCell(coords).facilityType == FacilityType.RESTAURANT;
                }
            )
        );
    }

    /**
     * Stores whether a store and a restaurant are next to the facility
     * @param coordinates The coordinates of the facility
     */
    public adjustMaxPopulation(coordinates: Vector2): void {
        this.unideal = !this.facilityCheck(coordinates);
    }

    /** Updates the facility */
    public override tick(): void {
        super.tick();

        // Change max depending on if in ideal conditions
        const MAX: number = this.unideal ? LuxuryHome._MAX_UNIDEAL_POPULATION: LuxuryHome._MAX_POPULATION

        // Adjust population if over max
        if (this._population > MAX) {
            this.population = MAX;
        }
    }
}

/** Represents a comfortable home and its components */
export class ComfortableHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.COMFORTABLE_HOME;
    protected static readonly _NAME: string = "Comfortable Home";

    protected static readonly _MAX_POPULATION: number = 15000;
    protected static readonly _HAPPINESS_RATIO: number = 0.25;
    protected static readonly _TAX_REVENUE_PER_UNIT: number = 1000000;
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number = 50000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 40000;
    protected static readonly _POLLUTION_PER_UNIT: number = 50;
    protected static readonly _BUILD_COST: number = 500000000;
    protected static readonly _POWER_COST: number = 50;
}

/**
 * Represents an affordable home and its components
 */
export class AffordableHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.AFFORDABLE_HOME;
    protected static readonly _NAME: string = "Affordable Home";

    protected static readonly _MAX_POPULATION: number = 25000;
    protected static readonly _HAPPINESS_RATIO: number = 0.1;
    protected static readonly _TAX_REVENUE_PER_UNIT: number = 10000;
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number = 2000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 8000;
    protected static readonly _POLLUTION_PER_UNIT: number = 0;
    protected static readonly _BUILD_COST: number = 50000000;
    protected static readonly _POWER_COST: number = 25;

    /** If population is at max, will make the pollution 10 units per 1000 people */
    protected override updatePollution(): void {
        if (this._population === AffordableHome._MAX_POPULATION) {
            this._pollution = Math.floor(this.population / 1000) * 10;
        }
    }
}
