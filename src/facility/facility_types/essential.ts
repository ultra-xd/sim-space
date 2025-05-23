import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Queue } from "../../data_structures/queue.js";
import { Vector2 } from "../../data_structures/vector.js";
import { assert } from "../../util/util.js";
import { Canvas } from "../../app/canvas.js";

/**
 * Abstract class for essential services facilities to use as a base
 */
export abstract class EssentialServicesFacility extends Facility {
    /**
     * Sector of the facility
     */
    protected static readonly _FACILITY_SECTOR = FacilitySector.ESSENTIAL;

    /**
     * Tax revenue generated
     */
    protected _taxRevenue: number = 0;

    /**
     * Pollution generated
     */
    protected _pollution: number = 0;
}


/**
 * Represents an Emergency Service building and its facility type, name, build cost, maintenance cost, and power cost
 */
export class EmergencyBuilding extends EssentialServicesFacility {
    /**
     * Type of facility (emergency)
     */
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.EMERGENCY;

    /**
     * Facility Name
     */
    protected static readonly _NAME: string = "Emergency Service";

    /**
     * The cost to build 
     */
    protected static readonly _BUILD_COST: number = 100000000;

    /**
     * The current maintenance cost
     */
    protected _maintenanceCost: number = 1000000;

    /**
     * Power consumption of the building
     */
    protected static readonly _POWER_COST: number = 10;
}

/**
 * Represents an Education Centre's facility type, name, build cost, maintenance cost, and power cost
 */
export class EducationCentre extends EssentialServicesFacility {
    /**
     * The specific facility type (educationing)
     */
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.EDUCATION;

    /**
     * The name of the facility
     */
    protected static readonly _NAME: string = "Education Centre";

    /**
     * The cost to build this facility
     */
    protected static readonly _BUILD_COST: number = 500000000;

    /**
     * The current maintenance cost
     */
    protected _maintenanceCost: number = 50000000;

    /**
     * The power consumption of the center
     */
    protected static readonly _POWER_COST: number = 15;
}

/**
 * Represents a Medical Centre's facility type, name, build cost, maintenance cost, and power cost
 */
export class MedicalCentre extends EssentialServicesFacility {
    /**
     * The specific facility type
     */
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.MEDICAL;

    /**
     * The name of the facility
     */
    protected static readonly _NAME: string = "Medical Centre";

    /**
     * The cost to build the medical centre
     */
    protected static readonly _BUILD_COST: number = 1000000000;

    /**
     * The current maintenance cost of the medical centre
     */
    protected _maintenanceCost: number = 150000000;

    /**
     * The amount of power the medical centre consumes
     */
    protected static readonly _POWER_COST: number = 20;
}

/**
 * Represents a Government building's facility type, name, build cost, maintenance cost, and power cost
 */
export class Government extends EssentialServicesFacility {
    /**
     * The specific facility type (governmenting)
     */
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.GOVERNMENT;

    /**
     * The name of the facility
     */
    protected static readonly _NAME: string = "Government";

    /**
     * The cost to build the building
     */
    protected static readonly _BUILD_COST: number = 100000000;

    /**
     * The current maintenance cost of the building
     */
    protected _maintenanceCost: number = 1000000;

    /**
     * The amount of power the building consumes
     */
    protected static readonly _POWER_COST: number = 10;
}

/**
 * Represents a Power plant facility and its components
 */
export class PowerPlant extends EssentialServicesFacility {
    /**
     * The facility's type
     */
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.POWER;

    /**
     * The name of the facility
     */
    protected static readonly _NAME: string = "Power Plant";

    /**
     * The cost to build the power plant
     */
    protected static readonly _BUILD_COST: number = 500000000;

    /**
     * The current maintenance cost of the power plant
     */
    protected _maintenanceCost: number = 2000000;

    /**
     * The power cost for operation of the plant
     */
    protected static readonly _POWER_COST: number = 0;

    /**
     * The amount of power produced by the plant
     */
    private static readonly _POWER_PRODUCED: number = 100;

    /**
     * Update the facility's finances and increment age using the tick method from facility.ts 
     * And also distribute power to the closest facilities
     */
    public override tick(): void {
        super.tick();
        this.distributePower(Vector2.I_UNIT);
    }
    
    /** 
     * Uses BFS to distribute power to the closest facilities
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

    /**
     * Gets the total power produced
     * @returns The power produced
     */
    public static get POWER_PRODUCED(): number {
        return PowerPlant._POWER_PRODUCED;
    }
}
