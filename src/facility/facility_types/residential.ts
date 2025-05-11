import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Canvas } from "../../app/canvas.js";

export abstract class ResidentialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.RESIDENTIAL;
}

export class LuxuryHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.LUXURY_HOME;
    protected static readonly _NAME = "Luxury Home";
}

export class ComfortableHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.COMFORTABLE_HOME;
    protected static readonly _NAME = "Comfortable Home";
}

export class AffordableHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.AFFORDABLE_HOME;
    protected static readonly _NAME = "Affordable Home";
}
