import { Facility, FacilitySector, FacilityType } from "../facility.js";

/** Represents a Defense Facility and its components */
export class DefenseFacility extends Facility {
    protected static readonly _FACILITY_SECTOR: FacilitySector = FacilitySector.DEFENSE;
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.DEFENSE;
    protected static readonly _NAME: string = "Planetary Defense System";
    protected static readonly _BUILD_COST: number = 1_000_000_000_000;
    protected static readonly _POWER_COST: number = 0;
    protected _maintenanceCost: number = 0;
    protected _pollution: number = 0;
    protected _taxRevenue: number = 0;
}

