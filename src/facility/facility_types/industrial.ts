import { Vector2 } from "../../data_structures/vector.js";
import { Facility, FacilitySector, FacilityType } from "../facility.js";

export abstract class IndustrialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.INDUSTRIAL;
}

export class Factory extends IndustrialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.FACTORY;
    protected static readonly _NAME: string = "Factory";

    protected static readonly _BUILD_COST: number = 50000000;
    private static readonly _MAX_MAINTENANCE_COST: number = 500000;
    protected _maintenanceCost: number = 500000;
    protected static readonly _POWER_COST: number = 50;
    protected _pollution: number = 20000;
    protected _taxRevenue: number = 1000000;
    private static readonly _MAX_TAX_REVENUE: number = 5000000;
    private static readonly _GROWTH_RATE: number = 0.2;

    public override tick(): void {

    }

    private updateMaintenanceCost(): void {
 
    }
    private updateTaxRevenue() : void {

    }
}

export class Warehouse extends IndustrialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.WAREHOUSE;
    protected static readonly _NAME = "Warehouse";

    protected _maintenanceCost: number;
    protected _pollution: number;
    protected _taxRevenue: number;
}

export class EnvironmentalFacility extends IndustrialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.ENVIRONMENT;
    protected static readonly _NAME = "Environmental Facility";

    protected static readonly _BUILD_COST: number = 200000000;
    protected _taxRevenue: number = 0;
    protected _maintenanceCost: number = 3000000;
    protected static readonly _POWER_COST: number = 75;
    private static readonly _MAX_POLLUTION_REDUCTION: number = 30000;
    private static readonly _POLLUTION_REDUCTION_RADIUS: number = 10;

    protected _pollution: number;

    public reducePollution(coordinates : Vector2): void {

    }
    public override tick(): void {

    }

    public static get MAX_POLLUTION_REDUCTION(): number {
        return this._MAX_POLLUTION_REDUCTION;
    }
}
