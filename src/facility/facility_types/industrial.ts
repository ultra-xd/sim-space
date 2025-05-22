import { Vector2 } from "../../data_structures/vector.js";
import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Game } from "../../app/game.js";
import { GameMap } from "../../map/map.js";
import { Cell } from "../../map/cell.js";

export abstract class IndustrialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.INDUSTRIAL;
}

export class Factory extends IndustrialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.FACTORY;
    protected static readonly _NAME: string = "Factory";

    protected static readonly _BUILD_COST: number = 50000000;
    private _maxMaintenanceCost: number = 500000;
    protected _maintenanceCost : number = 0;
    protected static readonly _POWER_COST: number = 50;
    protected _pollution: number = 20000;
    protected _taxRevenue: number = 0;
    private  _maxTaxRevenue : number = 5000000;
    private static readonly _BASE_MAX_MAINTENANCE_COST : number = 500000;
    private static readonly _BASE_MAX_TAX_REVENUE : number = 5000000
    private static readonly _WAREHOUSE_CHECK_RADIUS : number = 5

    private static readonly _GROWTH_RATE: number = 0.2;

    public override tick(): void {
        if (this.GAME.monthEnded()) {
            this.updateMaintenanceCost();
            this.updateTaxRevenue();
            this.checkForWarehouse(Vector2.I_UNIT);
            this._age++;
            if (this._taxRevenue >= this._maxTaxRevenue) {
                this.GAME.money += this._maxTaxRevenue;
            }
            else {
                this.GAME.money += this._taxRevenue;
            }

            if (this._maintenanceCost >= this._maxMaintenanceCost) {
                this.GAME.money -= this._maxMaintenanceCost;
            }
            else {
                this.GAME.money -= this._maintenanceCost;
            }
        }
    }

    private updateMaintenanceCost(): void {
        this._maintenanceCost += this._maxMaintenanceCost * (Factory._GROWTH_RATE * this._age);
    }
    private updateTaxRevenue() : void {
        this._taxRevenue += this._maxTaxRevenue * (Factory._GROWTH_RATE * this._age);
    }

    private checkForWarehouse(origin : Vector2) : boolean {
        //if found, augment tax revenue
        if (this.GAME.MAP.BFS(origin,Factory._WAREHOUSE_CHECK_RADIUS,(coordinates : Vector2) : boolean => {
            const CELL = this.GAME.MAP.getCell(coordinates);
                return CELL.facilitySector == FacilitySector.RESIDENTIAL
            })
        ) {
            this._maxTaxRevenue *= 2;
            this.updateTaxRevenue();
            return true;
        }
        else {
            this._maxTaxRevenue = Factory._BASE_MAX_TAX_REVENUE
            this.updateTaxRevenue();
            return false;
        }
    }
}

export class Warehouse extends IndustrialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.WAREHOUSE;
    protected static readonly _NAME = "Warehouse";

    protected _maintenanceCost: number = 500000;
    protected _pollution: number = 0;   
    protected _taxRevenue: number = 0;
    protected _POWER_COST: number = 10;

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

    public reducePollution(origin : Vector2): void {
        let pollutionReduced : number = 0;
        if (this.GAME.MAP.BFS(origin,EnvironmentalFacility._POLLUTION_REDUCTION_RADIUS,(coordinates : Vector2) : boolean => {
            const CELL = this.GAME.MAP.getCell(coordinates);
            if (CELL.pollution > 0) {
                let reduce : number = Math.min(CELL.pollution,EnvironmentalFacility.MAX_POLLUTION_REDUCTION-pollutionReduced);
                CELL.pollution -= reduce;
                pollutionReduced += reduce;
            }
            if (pollutionReduced >= 30000) {
                return true;
            }
            return false;
        })) {

        }
    }

    public override tick(): void {
        if (this.GAME.monthEnded()) {
            super.tick();
            //Again, all this is handleded later when I give a fuck
            this.reducePollution(Vector2.I_UNIT)
        }
    }

    public static get MAX_POLLUTION_REDUCTION(): number {
        return this._MAX_POLLUTION_REDUCTION;
    }
}

