import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Vector2 } from "../../data_structures/vector.js";

export abstract class CommercialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.COMMERCIAL;
    protected static readonly _BASE_TAX_REVENUE : number;
    protected static readonly _BASE_MAINTENANCE_COST : number;

    public facilityCheck(coordinates : Vector2) : boolean {
        //Will not only check for the residential in r=6,
        //but will also check if there was a fucking residential facility in the first place
        //Fk it return the goddamn radius too y not
        return true;
    }
    public override tick(): void {
        let placeholdFacilityCheck : boolean = true;
        let residentialFacilityExists : boolean = true;
        //Omfg another NOTE TO SELF REAL FUCKING IMPORTANT: How to handle radius,
        //Radius may not necessarily be a set number bruh so what? Shortest damn route?
        let radiustoNearestResident : number = 1
        this._age++;

        //Oh this is just tax revenue btw
        if (!residentialFacilityExists) {
            this._taxRevenue = 0;
        }
        //FARTHER ffs than r>6
        else if(radiustoNearestResident > 6) {
            this._taxRevenue = 6/radiustoNearestResident * CommercialFacility._BASE_TAX_REVENUE
        }
        else {
            //Bro istg there's literally empty space for the revenue factor when r<=6
        }

        //yup that's the maint
        if (!residentialFacilityExists) {
            this._maintenanceCost = 0;
        }
        //FARTHER ffs than r>6
        else if(radiustoNearestResident > 6) {
            this._maintenanceCost = 6/radiustoNearestResident * CommercialFacility._BASE_MAINTENANCE_COST
        }
        else {
            //Bro istg there's literally empty space for the MAINT factor too when r<=6
        }

        this.GAME.money += this._taxRevenue

        this.GAME.money -= this._maintenanceCost;
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

