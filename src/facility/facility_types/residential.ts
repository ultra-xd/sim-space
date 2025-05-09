import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Canvas } from "../../app/canvas.js";

export abstract class ResidentialFacility extends Facility {
    protected _FACILITY_SECTOR: FacilitySector = FacilitySector.RESIDENTIAL;
}

export class LuxuryHome extends ResidentialFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.LUXURY_HOME;
}

export class ComfortableHome extends ResidentialFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.COMFORTABLE_HOME;
}

export class AffordableHome extends ResidentialFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.AFFORDABLE_HOME;
}
