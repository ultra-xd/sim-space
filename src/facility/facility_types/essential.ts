import { Facility, FacilitySector, FacilityType } from "../facility.js";

export abstract class EssentialServicesFacility extends Facility {

}

export class EmergencyBuilding extends EssentialServicesFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}

export class EducationCentre extends EssentialServicesFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}

export class MedicalCentre extends EssentialServicesFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}

export class Government extends EssentialServicesFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}

export class PowerPlant extends EssentialServicesFacility {
    protected _FACILITY_SECTOR: FacilitySector;
    protected _FACILITY_TYPE: FacilityType;
}
