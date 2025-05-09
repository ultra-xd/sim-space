import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Canvas } from "../../app/canvas.js";
export abstract class IndustrialFacility extends Facility {
    protected _FACILITY_SECTOR: FacilitySector = FacilitySector.INDUSTRIAL;
}

export class Factory extends IndustrialFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.FACTORY;
}

export class Warehouse extends IndustrialFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.WAREHOUSE;
}

export class EnvironmentalFacility extends IndustrialFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.ENVIRONMENT;
}
