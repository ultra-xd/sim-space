import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Canvas } from "../../app/canvas.js";

export abstract class CommercialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.COMMERCIAL;
}

export class Store extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.STORE;
    protected static readonly _NAME = "Store";
}

export class Restaurant extends CommercialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.RESTAURANT;
    protected static readonly _NAME = "Restaurant";
}

export class Office extends CommercialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.OFFICE;
    protected static readonly _NAME = "Office";
}
