import { Vector2 } from "../../data_structures/vector.js";
import { Facility, FacilityType, FacilitySector } from "../facility.js";

export abstract class ResidentialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.RESIDENTIAL;

    protected static readonly _MAX_POPULATION: number;
    protected static readonly _HAPPINESS_RATIO: number; 
    protected static readonly _TAX_REVENUE_PER_UNIT: number;
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number;
    protected static readonly _BASE_MAINTENANCE_COST: number;
    protected static readonly _POLLUTION_PER_UNIT: number;
    protected static readonly _BUILD_COST: number;
    protected static readonly _POWER_COST: number;
    protected static readonly _GROWTH_RATE: number = 0.1;
    protected _population: number = 0;

    protected updateTaxRevenue() : void {

    }
    protected updateMaintenanceCost() : void {

    }
    protected updatePollution() : void {

    }
    public override tick(): void {

    }
    protected get population(): number {
        return this._population;
    }
    protected happyPopulation(): number {
        return this._population * ResidentialFacility._HAPPINESS_RATIO;
    }
    protected contentPopulation(): number {
        return this._population - (this._population * ResidentialFacility._HAPPINESS_RATIO);
    }

}

export class LuxuryHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.LUXURY_HOME;
    protected static readonly _NAME:  string  = "Luxury Home";

    protected static readonly _MAX_POPULATION: number = 10000;
    private static readonly _MAX_UNIDEAL_POPULATION: number = 5000;
    protected static readonly _HAPPINESS_RATIO: number = 0.5;
    protected static readonly _TAX_REVENUE_PER_UNIT: number = 15000000;
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number = 1000000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 10000000;
    protected static readonly _POLLUTION_PER_UNIT: number = 500;
    protected static readonly _BUILD_COST: number= 1000000000;
    protected static readonly _POWER_COST: number = 100;

    protected _maintenanceCost: number;
    protected _pollution: number;
    protected _taxRevenue: number;
    
    public facilityCheck(coordinates : Vector2): boolean {
        return true;
    }
    public override tick(): void {

    }

}

export class ComfortableHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.COMFORTABLE_HOME;
    protected static readonly _NAME: string = "Comfortable Home";

    protected static readonly _MAX_POPULATION: number = 15000;
    protected static readonly _HAPPINESS_RATIO: number = 0.25;
    protected static readonly _TAX_REVENUE_PER_UNIT: number = 1000000;
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number = 50000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 40000;
    protected static readonly _POLLUTION_PER_UNIT: number = 50;
    protected static readonly _BUILD_COST: number= 500000000;
    protected static readonly _POWER_COST: number = 50;

    protected _maintenanceCost: number;
    protected _pollution: number;
    protected _taxRevenue: number;
}

export class AffordableHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.AFFORDABLE_HOME;
    protected static readonly _NAME: string = "Affordable Home";

    protected static readonly _MAX_POPULATION: number = 25000;
    protected static readonly _HAPPINESS_RATIO: number = 0.1;
    protected static readonly _TAX_REVENUE_PER_UNIT: number = 10000;
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number = 2000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 8000;
    protected static readonly _POLLUTION_PER_UNIT: number = 10;
    protected static readonly _BUILD_COST: number= 50000000;
    protected static readonly _POWER_COST: number = 25;

    protected _maintenanceCost: number;
    protected _pollution: number;
    protected _taxRevenue: number;

    public override updatePollution(): void {
        
    }

}
