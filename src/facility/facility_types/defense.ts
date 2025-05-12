import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Canvas } from "../../app/canvas.js";

export class DefenseFacility extends Facility {
    protected _buildcost: number;
    protected _maintenanceCost: number;
    protected _taxRevenue: number;
    protected _powerUnits: number;
    protected _pollution: number;
    protected _name: string;
    protected static readonly _FACILITY_SECTOR = FacilitySector.DEFENSE;
    protected static readonly _FACILITY_TYPE = FacilityType.DEFENSE;
    protected static readonly _NAME = "Planetary Defense System";
}
