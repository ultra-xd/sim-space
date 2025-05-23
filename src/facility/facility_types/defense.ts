import { Facility, FacilitySector, FacilityType } from "../facility.js";

/** Represents a Defense Facility and its components */
export class DefenseFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.DEFENSE;
    protected static readonly _FACILITY_TYPE = FacilityType.DEFENSE;
    protected static readonly _NAME = "Planetary Defense System";
    protected static readonly _BUILD_COST = 1000000000000;
    protected _maintenanceCost: number = 0;
    protected _pollution: number = 0;
    protected _taxRevenue: number = 0;
}

