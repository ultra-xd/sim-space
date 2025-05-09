import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Canvas } from "../../app/canvas.js";

export abstract class CommercialFacility extends Facility {
    protected _FACILITY_SECTOR: FacilitySector = FacilitySector.COMMERCIAL;
}

export class Store extends CommercialFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.STORE;
}

export class Restaurant extends CommercialFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.RESTAURANT;
}

export class Office extends CommercialFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.OFFICE;
}
