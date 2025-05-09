import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Canvas } from "../../app/canvas.js";

export class DefenseFacility extends Facility {
    protected _FACILITY_SECTOR: FacilitySector = FacilitySector.DEFENSE;
    protected _FACILITY_TYPE: FacilityType = FacilityType.DEFENSE;
}
