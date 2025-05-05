import { Facility, FacilitySector, FacilityType } from "../facility.js";

export abstract class IndustrialFacility extends Facility {

}

export class Factory extends IndustrialFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}

export class Warehouse extends IndustrialFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}

export class EnvironmentalFacility extends IndustrialFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}
