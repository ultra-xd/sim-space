import { Facility } from "../facility.js";
import { FacilitySector } from "../facility.js";
import { FacilityType } from "../facility.js";

export abstract class CommercialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.COMMERCIAL;

}

export class Store extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.STORE;
    protected static readonly _NAME = "Store";

    protected _buildcost: number = 2000000
    protected _maintenanceCost: number = 50000;
    protected _taxRevenue: number = 200000;
    protected _powerUnits: number = 5;
    protected _pollution: number = 500;
}

export class Restaurant extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.RESTAURANT;
    protected static readonly _NAME = "Restaurant";

    protected _buildcost: number = 250000
    protected _maintenanceCost: number = 5000;
    protected _taxRevenue: number = 10000;
    protected _powerUnits: number = 5;
    protected _pollution: number = 300;
}

export class Office extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.OFFICE;
    protected static readonly _NAME = "Office";

    protected _buildcost: number = 3000000
    protected _maintenanceCost: number = 5000;
    protected _taxRevenue: number = 20000;
    protected _powerUnits: number = 15;
    protected _pollution: number = 800;
}

