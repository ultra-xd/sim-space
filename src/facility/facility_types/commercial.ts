import { Vector2 } from "../../data_structures/vector.js";
import { Facility } from "../facility.js";
import { FacilitySector } from "../facility.js";
import { FacilityType } from "../facility.js";

export abstract class CommercialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.COMMERCIAL;

    public facilityCheck(coordinates : Vector2) : boolean {
        return true;
    }
    public override tick(): void {

    }
}

export class Store extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.STORE;
    protected static readonly _NAME = "Store";

    protected static readonly _BUILD_COST: number = 2000000;

    protected _maintenanceCost : number = 50000;

    protected static readonly _POWER_COST: number = 5;

    protected _pollution : number = 500;	

    protected _taxRevenue : number = 200000;

}

export class Restaurant extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.RESTAURANT;
    protected static readonly _NAME = "Restaurant";

    protected static readonly _BUILD_COST: number = 250000;

    protected _maintenanceCost : number = 5000;

    protected static readonly _POWER_COST: number = 5;

    protected _pollution : number = 300;	

    protected _taxRevenue : number = 10000;

    
}

export class Office extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.OFFICE;
    protected static readonly _NAME = "Office";
    
    protected static readonly _BUILD_COST: number = 3000000;

    protected _maintenanceCost : number = 5000;

    protected static readonly _POWER_COST: number = 15;

    protected _pollution : number = 800;	

    protected _taxRevenue : number = 20000;
}

