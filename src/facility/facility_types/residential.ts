import { Facility, FacilitySector, FacilityType } from "../facility.js";

export abstract class ResidentialFacility extends Facility {

}

export class LuxuryHome extends ResidentialFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}

export class ComfortableHome extends ResidentialFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}

export class AffordableHome extends ResidentialFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}
