import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Vector2 } from "../../data_structures/vector.js";;

export abstract class EssentialServicesFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.ESSENTIAL;

    protected _taxRevenue: number = 0;
    protected _pollution: number = 0;
}

export class EmergencyBuilding extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.EMERGENCY;
    protected static readonly _NAME: string = "Emergency Service";

    protected static readonly _BUILD_COST: number = 100000000;
    protected _maintenanceCost: number = 1000000;
    protected static readonly _POWER_COST: number = 10;

}

export class EducationCentre extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.EDUCATION;
    protected static readonly _NAME: string = "Education Centre";

    protected static readonly _BUILD_COST: number = 500000000;
    protected _maintenanceCost: number = 50000000;
    protected static readonly _POWER_COST: number = 15;



}

export class MedicalCentre extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.MEDICAL;
    protected static readonly _NAME: string = "Medical Centre";

    protected static readonly _BUILD_COST: number = 1000000000;
    protected _maintenanceCost: number = 150000000;
    protected static readonly _POWER_COST: number = 20;

    
}

export class Government extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.GOVERNMENT;
    protected static readonly _NAME: string= "Government";

    protected static readonly _BUILD_COST: number = 100000000;
    protected _maintenanceCost: number = 1000000;
    protected static readonly _POWER_COST: number = 10;


}

export class PowerPlant extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.POWER;
    protected static readonly _NAME: string = "Power Plant";

    protected static readonly _BUILD_COST: number = 500000000;
    protected _maintenanceCost: number = 2000000;
    protected static readonly _POWER_COST: number = 0;

    private static readonly _POWER_PRODUCED: number = 100;

    /** 
     * Uses BFS to distribute power to the closest facilities. 
     * @param coordinates The coordinates of the facility to start at
     */
    public distributePower(coordinates: Vector2): void {
        let powerAvailable: number = PowerPlant._POWER_PRODUCED;

        this.GAME.MAP.BFS(
            coordinates,
            this.GAME.MAP.width + this.GAME.MAP.height,
            (coords: Vector2): boolean => {
                if (coordinates.equals(coords)) return false;

                const FACILITY: Facility | null = this.GAME.MAP.getCell(coords).facility;
                if (FACILITY != null) {
                    const USED_POWER: number = (FACILITY.constructor as typeof Facility).POWER_COST - FACILITY.powerAvailable;
                    if (USED_POWER < powerAvailable) {
                        FACILITY.powerAvailable = (FACILITY.constructor as typeof Facility).POWER_COST;
                        powerAvailable -= USED_POWER;
                    } else {
                        FACILITY.powerAvailable = powerAvailable;
                        return true;
                    }
                }

                return false;
            }
        )
    }

    public static get POWER_PRODUCED(): number {
        return PowerPlant._POWER_PRODUCED;
    }
}
