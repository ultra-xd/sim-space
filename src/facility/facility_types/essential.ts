import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Canvas } from "../../app/canvas.js";

export abstract class EssentialServicesFacility extends Facility {
    protected _FACILITY_SECTOR: FacilitySector = FacilitySector.ESSENTIAL;
}

export class EmergencyBuilding extends EssentialServicesFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.EMERGENCY;
}

export class EducationCentre extends EssentialServicesFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.EDUCATION;
}

export class MedicalCentre extends EssentialServicesFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.MEDICAL;
}

export class Government extends EssentialServicesFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.GOVERNMENT;
}

export class PowerPlant extends EssentialServicesFacility {
    protected _FACILITY_TYPE: FacilityType = FacilityType.POWER;
}
