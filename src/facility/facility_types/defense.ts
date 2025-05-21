import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Canvas } from "../../app/canvas.js";
import { Game } from "../../app/game.js";

export class DefenseFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.DEFENSE;
    protected static readonly _FACILITY_TYPE = FacilityType.DEFENSE;
    protected static readonly _NAME = "Planetary Defense System";
    protected static readonly _BUILD_COST = 1000000000;

    protected _maintenanceCost: number;
    protected _pollution: number;
    protected _taxRevenue: number;

    public preventDisaster() : void{
        //Where tf is the nuke everything in the game thingy? Maybe I have to add it...
        //Note to self straight up just like nuke their pc if they get hit then nothing else matters
    }
    public override tick(): void {
        //what is this supposed to fking do? Might just be a dummkopf
    }
}
