import { Facility } from "../facility.js";
import { FacilitySector } from "../facility.js";
import { FacilityType } from "../facility.js";

export abstract class CommercialFacility extends Facility {
    protected readonly _FACILITY_SECTOR = FacilitySector.COMMERCIAL;
    protected checkResidentialFacility(distance : number): boolean {
        return true //placeholder
    }
}

export class Store extends CommercialFacility {
    protected readonly _FACILITY_SECTOR = FacilitySector.COMMERCIAL;
    protected readonly _FACILITY_TYPE = FacilityType.STORE;

}

export class Restaurant extends CommercialFacility {
    protected readonly _FACILITY_SECTOR = FacilitySector.COMMERCIAL;
    protected readonly _FACILITY_TYPE = FacilityType.RESTAURANT;

}

export class Office extends CommercialFacility {
    protected readonly _FACILITY_SECTOR = FacilitySector.COMMERCIAL;
    protected readonly _FACILITY_TYPE = FacilityType.OFFICE;

}

