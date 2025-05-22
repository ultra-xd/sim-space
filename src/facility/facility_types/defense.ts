import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Canvas } from "../../app/canvas.js";
import { Game } from "../../app/game.js";

export class DefenseFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.DEFENSE;
    protected static readonly _FACILITY_TYPE = FacilityType.DEFENSE;
    protected static readonly _NAME = "Planetary Defense System";
    protected static readonly _BUILD_COST = 1000000000000;

    protected _maintenanceCost: number;
    protected _pollution: number;
    protected _taxRevenue: number;
}
