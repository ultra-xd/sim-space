import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Vector2 } from "../../data_structures/vector.js";

export abstract class CommercialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.COMMERCIAL;
    protected static readonly _BASE_TAX_REVENUE : number;
    protected static readonly _BASE_MAINTENANCE_COST : number;
    protected static readonly _RESIDENTIAL_FACILITY_RADIUS : number = 6;

    public facilityCheck(origin : Vector2) : { residenceWithinSixUnits : boolean, residenceFound : boolean, distanceToNearestResidence : number } {
        let residenceWithinSixUnits : boolean;
        let residenceFound : boolean;
        let distanceToNearestResidence : number = -1;

        //If residential facility is not found within game bounds mark none found
        //Else, check if the residence is within 6 units
        if (!this.GAME.MAP.BFS(origin,this.GAME.MAP.width + this.GAME.MAP.height,(coordinates : Vector2) : boolean => {
            const CELL = this.GAME.MAP.getCell(coordinates);
                return CELL.facilitySector == FacilitySector.RESIDENTIAL
            })
        ) {
            residenceFound = false;
            residenceWithinSixUnits = false;
        }
        else {
            residenceFound = true;
            //If not within rad of 6
            if (!this.GAME.MAP.BFS(origin,CommercialFacility._RESIDENTIAL_FACILITY_RADIUS,(coordinates : Vector2, distance) : boolean => {
                const CELL = this.GAME.MAP.getCell(coordinates);
                if (CELL.facilitySector == FacilitySector.RESIDENTIAL) {
                    distanceToNearestResidence = distance as number;
                    return true;
                }
                return false;
            })
            ) {
                residenceWithinSixUnits = false;
            } else {
                residenceWithinSixUnits = true;
            }
        }
        return {
            residenceWithinSixUnits, residenceFound, distanceToNearestResidence
        };
    }
    public override tick(): void {
        if (this.GAME.monthEnded()) {
            let residenceFound : boolean = this.facilityCheck(Vector2.I_UNIT).residenceFound;
            let residenceWithinSixUnits : boolean = this.facilityCheck(Vector2.I_UNIT).residenceWithinSixUnits;
            let radiustoNearestResident : number = this.facilityCheck(Vector2.I_UNIT).distanceToNearestResidence;

            this._age++;

            //Oh this is just tax revenue btw
            if (!residenceFound) {
                this._taxRevenue = 0;
                this._maintenanceCost = 0;
            }
            //FARTHER ffs than r>6
            else if(!residenceWithinSixUnits) {
                this._taxRevenue = 6/radiustoNearestResident * CommercialFacility._BASE_TAX_REVENUE;
                this._maintenanceCost = 6/radiustoNearestResident * CommercialFacility._BASE_MAINTENANCE_COST;
            }
            else {
                this._taxRevenue = CommercialFacility._BASE_TAX_REVENUE;
                this._maintenanceCost = CommercialFacility._BASE_MAINTENANCE_COST;
            }

            this.GAME.money += this._taxRevenue
            this.GAME.money -= this._maintenanceCost;
        }
    }
}

export class Store extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.STORE;
    protected static readonly _NAME = "Store";
    protected static readonly _BUILD_COST: number = 2000000;

    protected _maintenanceCost : number = 50000;

    protected static readonly _POWER_COST: number = 5;

    protected _pollution : number = 500;	

    protected _taxRevenue : number = 200000;

    protected static readonly _BASE_TAX_REVENUE : number = 200000;

    protected static readonly _BASE_MAINTENANCE_COST : number = 50000;
}

export class Restaurant extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.RESTAURANT;
    protected static readonly _NAME = "Restaurant";

    protected static readonly _BUILD_COST: number = 250000;

    protected _maintenanceCost : number = 5000;

    protected static readonly _POWER_COST: number = 5;

    protected _pollution : number = 300;	

    protected _taxRevenue : number = 10000;

    protected static readonly _BASE_TAX_REVENUE : number = 10000;

    protected static readonly _BASE_MAINTENANCE_COST : number = 5000;

}

export class Office extends CommercialFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.OFFICE;
    protected static readonly _NAME = "Office";
    
    protected static readonly _BUILD_COST: number = 3000000;

    protected _maintenanceCost : number = 5000;

    protected static readonly _POWER_COST: number = 15;

    protected _pollution : number = 800;	

    protected _taxRevenue : number = 20000;
    
    protected static readonly _BASE_TAX_REVENUE : number = 20000;

    protected static readonly _BASE_MAINTENANCE_COST : number = 5000;

}

