import { Facility, FacilitySector, FacilityType } from "../facility.js";

export abstract class CommercialFacility extends Facility {

}

export class Store extends CommercialFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}

export class Restaurant extends CommercialFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}

export class Office extends CommercialFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}
