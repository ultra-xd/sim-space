import { Vector2 } from "../../data_structures/vector.js";
import { Facility, FacilityType, FacilitySector } from "../facility.js";
import { GameMap } from "../../map/map.js";

export abstract class ResidentialFacility extends Facility {
    protected readonly _FACILITY_SECTOR = FacilitySector.RESIDENTIAL;

    protected static readonly _MAX_POPULATION: number;
    protected static readonly _HAPPINESS_RATIO: number; 
    protected static readonly _TAX_REVENUE_PER_UNIT: number;
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number;
    protected static readonly _BASE_MAINTENANCE_COST: number;
    protected static readonly _POLLUTION_PER_UNIT: number;
    protected static readonly _BUILD_COST: number;
    protected static readonly _POWER_COST: number;
    protected static readonly _GROWTH_RATE: number = 0.1;
    protected _population: number = 0;
    protected _taxRevenue: number;
    protected _maintenanceCost: number;
    protected _pollution: number;


    protected updateTaxRevenue() : void {
        this._taxRevenue = Math.floor(this.population/1000) * ResidentialFacility._TAX_REVENUE_PER_UNIT;
    }
    protected updateMaintenanceCost() : void {
        this._taxRevenue = ResidentialFacility._BASE_MAINTENANCE_COST + Math.floor(this.population/1000) * ResidentialFacility._MAINTENANCE_COST_PER_UNIT;
    }
    protected updatePollution() : void {
        this._pollution = Math.floor(this.population/1000) * ResidentialFacility._POLLUTION_PER_UNIT;
    }
    public override tick(): void {
        if (this._population >= ResidentialFacility._MAX_POPULATION) {
            this._population = ResidentialFacility._MAX_POPULATION;
        }
        else {
         this._population = ResidentialFacility._MAX_POPULATION * (ResidentialFacility._GROWTH_RATE*this._age);

        }
        //nvm above is only to get the pop, now this is the actual revenue shit

        //Increase age of the facility
        this._age++;

        //Idk anymore just update the shit and then push it out there
        this.updateTaxRevenue();
        this.updateMaintenanceCost();
        this.updatePollution();
        //tax revenue adds to money in game through setter
        this._game.money += this._taxRevenue
        //Set money to subtract mainternance cost
        this._game.money -= this._maintenanceCost;
    }
    protected get population(): number {
        return this._population;
    }
    protected get happyPopulation(): number {
        return this._population * ResidentialFacility._HAPPINESS_RATIO;
    }
    protected get contentPopulation(): number {
        return this._population - (this._population * ResidentialFacility._HAPPINESS_RATIO);
    }

}

export class LuxuryHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.LUXURY_HOME;
    protected static readonly _NAME:  string  = "Luxury Home";

    protected static readonly _MAX_POPULATION: number = 10000;
    private static readonly _MAX_UNIDEAL_POPULATION: number = 5000;
    protected static readonly _HAPPINESS_RATIO: number = 0.5;
    protected static readonly _TAX_REVENUE_PER_UNIT: number = 15000000;
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number = 1000000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 10000000;
    protected static readonly _POLLUTION_PER_UNIT: number = 500;
    protected static readonly _BUILD_COST: number= 1000000000;
    protected static readonly _POWER_COST: number = 100;
    
    public facilityCheck(coordinates : Vector2): boolean {
        /**let origin : Vector2 = coordinates;
        let storeFound : boolean = false;

        for (let i = coordinates.x - 8; i < coordinates.x + 8; i++) {
            for (let j = coordinates.y - 8; j < coordinates.y + 8; j++) {
                if (GameMap.cells[i][j].facility === )
            }
        }**/
       return true;
    }
    public override tick(): void {
        let placeholdFacilityCheck : boolean = true;
        if (placeholdFacilityCheck) {
            //if it passes the vibe check, then the growth rate will go up to the real max ppl
            if (this._population >= ResidentialFacility._MAX_POPULATION) {
                this._population = ResidentialFacility._MAX_POPULATION;
            }
            else {
                this._population = ResidentialFacility._MAX_POPULATION * (ResidentialFacility._GROWTH_RATE*this._age);
            }
        }
        //if does not pass vibe check, max pop is capped at 5000
        else {
            if (this._population >= LuxuryHome._MAX_UNIDEAL_POPULATION) {
                this._population = LuxuryHome._MAX_UNIDEAL_POPULATION;
            }
            else {
                this._population = LuxuryHome._MAX_UNIDEAL_POPULATION * (ResidentialFacility._GROWTH_RATE*this._age);
            }
        }
        //nvm above is only to get the pop, now this is the actual revenue shit

        //Increase age of the facility
        this._age++;

        //Idk anymore just update the shit and then push it out there
        this.updateTaxRevenue();
        this.updateMaintenanceCost();
        this.updatePollution();
        //tax revenue adds to money in game through setter
        this._game.money += this._taxRevenue
        //Set money to subtract mainternance cost
        this._game.money -= this._maintenanceCost;
    }

}

export class ComfortableHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.COMFORTABLE_HOME;
    protected static readonly _NAME: string = "Comfortable Home";

    protected static readonly _MAX_POPULATION: number = 15000;
    protected static readonly _HAPPINESS_RATIO: number = 0.25;
    protected static readonly _TAX_REVENUE_PER_UNIT: number = 1000000;
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number = 50000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 40000;
    protected static readonly _POLLUTION_PER_UNIT: number = 50;
    protected static readonly _BUILD_COST: number= 500000000;
    protected static readonly _POWER_COST: number = 50;

}

export class AffordableHome extends ResidentialFacility {
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.AFFORDABLE_HOME;
    protected static readonly _NAME: string = "Affordable Home";

    protected static readonly _MAX_POPULATION: number = 25000;
    protected static readonly _HAPPINESS_RATIO: number = 0.1;
    protected static readonly _TAX_REVENUE_PER_UNIT: number = 10000;
    protected static readonly _MAINTENANCE_COST_PER_UNIT: number = 2000;
    protected static readonly _BASE_MAINTENANCE_COST: number = 8000;
    protected static readonly _POLLUTION_PER_UNIT: number = 10;
    protected static readonly _BUILD_COST: number= 50000000;
    protected static readonly _POWER_COST: number = 25;

    protected override updatePollution(): void {
        if (this._population === AffordableHome._MAX_POPULATION) {
            //MARKED AS IMPORTANT FOR SELF
            // What? This makes no fucking sense, the ppu is 10, but there should be another that's 
            //for the optimized capacity or some shit. Ask tmr too damn lazy rn.
            this._pollution = Math.floor(this.population/1000) * ResidentialFacility._POLLUTION_PER_UNIT;

        }
    }
}
