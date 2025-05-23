import { Vector2 } from "../../data_structures/vector.js";
import { Cell } from "../../map/cell.js";
import { Facility, FacilitySector, FacilityType } from "../facility.js";

/** Abstract base class to be used as a base by industrial facilities */
export abstract class IndustrialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.INDUSTRIAL;
}

/**
 * Represents a Factory
 * Checks for nearby warehouses that will double its revenue
 */
export class Factory extends IndustrialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.FACTORY;
    protected static readonly _NAME: string = "Factory";
    
    protected _maintenanceCost: number = 0;
    protected _pollution: number = 20000;
    protected _taxRevenue: number = 0;

    protected static readonly _POWER_COST: number = 50;
    protected static readonly _BUILD_COST: number = 50000000;

    private static readonly MAX_MAINTENANCE_COST: number = 500000;
    private static readonly MAX_TAX_REVENUE: number = 5000000;
    private static readonly _WAREHOUSE_CHECK_RADIUS: number = 5; // How far to check for a warehouse

    private nearWarehouse: boolean = false; // Stores whether facility is near warehouse
    private static readonly _GROWTH_RATE: number = 0.2; // How fast maintenance and tax revenue increase / month

    /** Called every game tick to update state if a month has ended */
    public override tick(): void {
        // Update maintenance and tax revenue every month
        if (this.GAME.monthEnded()) {
            this.updateMaintenanceCost();
            this.updateTaxRevenue();
        }

        super.tick();
    }

    /** Increases maintenance cost based on age and growth rate */
    private updateMaintenanceCost(): void {
        this._maintenanceCost = Math.min(
            Factory.MAX_MAINTENANCE_COST * (Factory._GROWTH_RATE * this._age),
            Factory.MAX_MAINTENANCE_COST
        ) * (this.nearWarehouse ? 2: 1);
    }

    /** Increases tax revenue based on age and growth rate */
    private updateTaxRevenue(): void {
        this._taxRevenue = Math.min(
            Factory.MAX_TAX_REVENUE * (Factory._GROWTH_RATE * this._age),
            Factory.MAX_TAX_REVENUE
        ) * (this.nearWarehouse ? 2: 1); // Double income if near warehouse
    }

    /**
     * Checks if there is a warehouse near the facility at required distance.
     * @param coordinates The coordinates of the facility.
     */
    public checkForWarehouse(coordinates: Vector2): void {
        // If found, augment tax revenue
        this.nearWarehouse = this.GAME.MAP.BFS(
            coordinates,
            Factory._WAREHOUSE_CHECK_RADIUS,
            (coordinates: Vector2): boolean => {
                const CELL: Cell = this.GAME.MAP.getCell(coordinates);
                return CELL.facilityType == FacilityType.WAREHOUSE;
            }
        )
    }
}

/**
 * Represents a Warehouse, a type of industrial facility
 * Provides support functionality to nearby factories
 */
export class Warehouse extends IndustrialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.WAREHOUSE;
    protected static readonly _NAME = "Warehouse";

    protected static readonly _BUILD_COST: number = 10_000_000;
    protected _maintenanceCost: number = 500000;
    protected _pollution: number = 0;
    protected _taxRevenue: number = 0;
    protected static readonly _POWER_COST: number = 10;
}

export class EnvironmentalFacility extends IndustrialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.ENVIRONMENT;
    protected static readonly _NAME = "Environmental Facility";

    protected static readonly _BUILD_COST: number = 200000000;
    protected _taxRevenue: number = 0;
    protected _maintenanceCost: number = 3000000;
    protected static readonly _POWER_COST: number = 75;
    private static readonly _MAX_POLLUTION_REDUCTION: number = 30000;
    private static readonly _POLLUTION_REDUCTION_RADIUS: number = 10;

    protected _pollution: number = 0;

    /**
     * Reduces the pollution around the facility, up to a maximum amount and up to a maximum distance.
     * @param coordinates The coordinates of the facility.
     * @returns The pollution reduced.
     */
    public reducePollution(coordinates: Vector2): number {
        // Store the amount of pollution that can be reduced
        let pollutionReductionAvailable: number = EnvironmentalFacility.MAX_POLLUTION_REDUCTION;

        // Search up to a radius, starting from the facility
        this.GAME.MAP.BFS(
            coordinates,
            EnvironmentalFacility._POLLUTION_REDUCTION_RADIUS,
            (coords: Vector2): boolean => {
                const CELL: Cell = this.GAME.MAP.getCell(coords);
                const POLLUTION: number = CELL.pollution;

                // Reduce the pollution to 0 if possible
                if (pollutionReductionAvailable > POLLUTION) {
                    pollutionReductionAvailable -= POLLUTION;
                    CELL.pollution = 0;
                } else { // if not, reduce as much as possible and stop searching
                    CELL.pollution -= pollutionReductionAvailable;
                    pollutionReductionAvailable = 0;
                    return true;
                }

                return false;
            }
        )

        return EnvironmentalFacility.MAX_POLLUTION_REDUCTION - pollutionReductionAvailable;
    }

    /** The maximum amount of pollution that can be reduced. */
    public static get MAX_POLLUTION_REDUCTION(): number {
        return this._MAX_POLLUTION_REDUCTION;
    }
}

