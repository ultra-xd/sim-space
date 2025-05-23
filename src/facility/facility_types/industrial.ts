import { Vector2 } from "../../data_structures/vector.js";
import { Cell } from "../../map/cell.js";
import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Game } from "../../app/game.js";
import { GameMap } from "../../map/map.js";

/**
 * Abstract base class to be used as a base by industrial facilities
 */
export abstract class IndustrialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.INDUSTRIAL;
}

/**
 * Represents a Factory's maintenance, tax revenue, and checks for nearby warehouses that will double its revenue
 */
export class Factory extends IndustrialFacility {

    protected static readonly _FACILITY_TYPE = FacilityType.FACTORY;
    protected static readonly _NAME: string = "Factory";
    protected static readonly _BUILD_COST: number = 50000000;
    private static readonly MAX_MAINTENANCE_COST: number = 500000;
    protected _maintenanceCost : number = 0;
    protected static readonly _POWER_COST: number = 50;
    protected _pollution: number = 20000;
    protected _taxRevenue: number = 0;
    private static readonly MAX_TAX_REVENUE : number = 5000000;
    private static readonly _WAREHOUSE_CHECK_RADIUS : number = 5;
    private nearWarehouse: boolean = false;
    private static readonly _GROWTH_RATE: number = 0.2;

    /**
     * Called every game tick to update state if a month has ended
     */
    public override tick(): void {
        if (this.GAME.monthEnded()) {
            this.updateMaintenanceCost();
            this.updateTaxRevenue();
        }

        super.tick();
    }

    /**
     * Increases maintenance cost based on age and growth rate
     */
    private updateMaintenanceCost(): void {
        this._maintenanceCost = Math.min(
            Factory.MAX_MAINTENANCE_COST * (Factory._GROWTH_RATE * this._age),
            Factory.MAX_MAINTENANCE_COST
        ) * (this.nearWarehouse ? 2 : 1);
    }

    /**
     * Increases tax revenue based on age and growth rate
     */
    private updateTaxRevenue() : void {
        this._taxRevenue = Math.min(
            Factory.MAX_TAX_REVENUE * (Factory._GROWTH_RATE * this._age),
            Factory.MAX_TAX_REVENUE
        ) * (this.nearWarehouse ? 2 : 1);
    }

    public checkForWarehouse(origin: Vector2) : void {
        //if found, augment tax revenue
        this.nearWarehouse = this.GAME.MAP.BFS(
            origin,
            Factory._WAREHOUSE_CHECK_RADIUS,
            (coordinates : Vector2) : boolean => {
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
    /**
     * The facility type
     */
    protected static readonly _FACILITY_TYPE = FacilityType.WAREHOUSE;

    /**
     * The name of the facility
     */
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

    public reducePollution(coordinates: Vector2): number {
        //God save the queen (not), and maybe Joe Biden from prostate cancer too. He didn't save the pope tho wtf man?
        // im keeping this comment LMAOOO
        let pollutionReductionAvailable: number = EnvironmentalFacility.MAX_POLLUTION_REDUCTION;

        this.GAME.MAP.BFS(
            coordinates,
            EnvironmentalFacility._POLLUTION_REDUCTION_RADIUS,
            (coords: Vector2): boolean => {
                const CELL: Cell = this.GAME.MAP.getCell(coords);
                const POLLUTION: number = CELL.pollution;

                if (pollutionReductionAvailable > POLLUTION) {
                    pollutionReductionAvailable -= POLLUTION;
                    CELL.pollution = 0;
                } else {
                    CELL.pollution -= pollutionReductionAvailable;
                    pollutionReductionAvailable = 0;
                    return true;
                }

                return false;
            }
        )

        return EnvironmentalFacility.MAX_POLLUTION_REDUCTION - pollutionReductionAvailable;
    }

    public static get MAX_POLLUTION_REDUCTION(): number {
        return this._MAX_POLLUTION_REDUCTION;
    }
}

