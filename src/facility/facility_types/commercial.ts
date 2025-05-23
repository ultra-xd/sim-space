import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Cell } from "../../map/cell.js";
import { Vector2 } from "../../data_structures/vector.js";

/**
 * Abstract base class representing commercial facilities and their components
 */
export abstract class CommercialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.COMMERCIAL;
    protected static readonly _BASE_TAX_REVENUE: number;
    protected static readonly _BASE_MAINTENANCE_COST: number;
    protected static readonly _RESIDENTIAL_FACILITY_RADIUS: number = 6;

    /**
     * Calculates distance from the given coordinates to the nearest residential facility using BFS.
     *
     * @param coordinates The starting coordinates to search for the nearest residential facility.
     * @returns The distance to the nearest residential facility, or `Infinity` if none is found.
     */
    public facilityCheck(coordinates: Vector2): number {
        let distanceToNearestResidence: number = Infinity;
        
        // breadth first search through entire map
        this.GAME.MAP.BFS(
            coordinates,
            this.GAME.MAP.width + this.GAME.MAP.height,
            (coords: Vector2): boolean => {
                // Calculate Manhattan distance
                const DISTANCE: number = Math.abs(coords.x - coordinates.x) + Math.abs(coords.y - coordinates.y);
                const CELL: Cell = this.GAME.MAP.getCell(coords);

                // Update min distance if found a residential facility
                if (
                    CELL.facilitySector == FacilitySector.RESIDENTIAL &&
                    DISTANCE < distanceToNearestResidence
                ) {
                    distanceToNearestResidence = DISTANCE;
                }

                return false;
            }
        )
        return distanceToNearestResidence;
    }

    /**
     * Updates the facility's tax revenue and maintenance cost based on its distance from nearest residential facility.
     * If distance is infinite, both tax revenue and maintenance cost are set to 0.
     * If distance is greater than 6, both values are scaled down proportionally.
     * If distance is 6 or less, both values are set to their respective base values.
     * @param coordinates - The coordinates of the facility.
     */
    public updateRevenueAndCost(coordinates: Vector2): void {
        const DISTANCE: number = this.facilityCheck(coordinates);

        // Change tex revenue and maintenance cost based on distance
        if (DISTANCE == Infinity) {
            this._taxRevenue = 0;
            this._maintenanceCost = 0;
        } else if (DISTANCE > 6) {
            this._taxRevenue = 6 / DISTANCE * (this.constructor as typeof CommercialFacility)._BASE_TAX_REVENUE;
            this._maintenanceCost = 6 / DISTANCE * (this.constructor as typeof CommercialFacility)._BASE_MAINTENANCE_COST;
        } else {
            this._taxRevenue = (this.constructor as typeof CommercialFacility)._BASE_TAX_REVENUE;
            this._maintenanceCost = (this.constructor as typeof CommercialFacility)._BASE_MAINTENANCE_COST;
        }
    }
}


/** Represents a Store facility, a specific type of commercial facility */
export class Store extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.STORE;
    protected static readonly _NAME = "Store";
    protected static readonly _BUILD_COST: number = 2000000;
    protected _maintenanceCost: number = 50000;
    protected static readonly _POWER_COST: number = 5;
    protected _pollution: number = 500;	
    protected _taxRevenue: number = 200000;
    protected static readonly _BASE_TAX_REVENUE: number = 200000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 50000;
}

/** Represents a Restaurant facility and its respective components */
export class Restaurant extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.RESTAURANT;
    protected static readonly _NAME = "Restaurant";
    protected static readonly _BUILD_COST: number = 250000;
    protected _maintenanceCost: number = 5000;
    protected static readonly _POWER_COST: number = 5;
    protected _pollution: number = 300;	
    protected _taxRevenue: number = 10000;
    protected static readonly _BASE_TAX_REVENUE: number = 10000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 5000;
}

/**
 * Represents an Office facility and its respective components
 */
export class Office extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.OFFICE;
    protected static readonly _NAME = "Office";
    protected static readonly _BUILD_COST: number = 3000000;
    protected _maintenanceCost: number = 5000;
    protected static readonly _POWER_COST: number = 15;
    protected _pollution: number = 800;	
    protected _taxRevenue: number = 20000;
    protected static readonly _BASE_TAX_REVENUE: number = 20000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 5000;
}