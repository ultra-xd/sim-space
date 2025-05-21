import { Vector2 } from "../../data_structures/vector.js";
import { Facility, FacilitySector, FacilityType } from "../facility.js";

export abstract class IndustrialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.INDUSTRIAL;
}

export class Factory extends IndustrialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.FACTORY;
    protected static readonly _NAME : string = "Factory";

    protected static readonly _BUILD_COST: number = 50000000;

    private static readonly _MAX_MAINTENANCE_COST: number = 500000;

    protected _maintenanceCost : number = 0;

    protected static readonly _POWER_COST: number = 50;

    protected _pollution: number = 20000;

    protected _taxRevenue: number = 0;

    private static readonly _MAX_TAX_REVENUE : number = 5000000;

    private static readonly _GROWTH_RATE: number = 0.2;

    public override tick(): void {
        this.updateMaintenanceCost();
        this.updateTaxRevenue();
        this._age++;
        if (this._taxRevenue >= Factory._MAX_TAX_REVENUE) {
            this._game.money += Factory._MAX_TAX_REVENUE;
        }
        else {
            this._game.money += this._taxRevenue;
        }

        if (this._maintenanceCost >= Factory._MAX_MAINTENANCE_COST) {
            this._game.money += Factory._MAX_MAINTENANCE_COST;
        }
        else {
            this._game.money -= this._maintenanceCost;
        }
    }

    private updateMaintenanceCost(): void {
        this._maintenanceCost += Factory._MAX_MAINTENANCE_COST * (Factory._GROWTH_RATE * this._age);

    }
    private updateTaxRevenue() : void {
        this._taxRevenue += Factory._MAX_TAX_REVENUE * (Factory._GROWTH_RATE * this._age);

    }

    private checkForWarehouse() : boolean {
        return true;
        //Just a placeholder until I ascertain the search logic oh and the MFKing radius
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

    public reducePollution(coordinates : Vector2): void {
        //God save the queen (not), and maybe Joe Biden from prostate cancer too. He didn't save the pope tho wtf man?
    }
    public override tick(): void {
        //Increase age of the facility
        this._age++;
        //tax revenue adds to money in game through setter
        this._game.money += this._taxRevenue
        //Set money to subtract mainternance cost
        this._game.money -= this._maintenanceCost;
        //Pollution handled in cell
        //Again, all this is handleded later when I give a fuck
        // this.reducePollution()
    }
}

