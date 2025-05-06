import { Facility } from "../facility.js";
import { FacilitySector } from "../facility.js";
import { FacilityType } from "../facility.js";

export abstract class ResidentialFacility extends Facility {
    protected readonly _FACILITY_SECTOR = FacilitySector.RESIDENTIAL;
    protected _curPopulation : number;
    protected _maxPopulation : number;
    protected _populationGrowthFactor : number;
    protected _happyPopulation : number;
    protected _contentPopulation : number;
    protected _baseTaxRevenue : number;
    protected _baseMaintenanceCost : number;
    protected _taxRevenueUnits : number;
    protected _maintenanceCostUnits : number;
    protected _populationRatio : number;
    protected _basePollution : number;
    protected _pollutionUnits : number;


    
    protected checkResidentialFacility(distance : number): boolean {
        return true //placeholder
    }
}

export class LuxuryHome extends ResidentialFacility {
    protected readonly _FACILITY_TYPE: FacilityType.LUXURY_HOME;
    public constructor() {
        super();

        this._curPopulation = 0;
        this._maxPopulation = 10000;
        this._populationGrowthFactor = 0.1;
        this._happyPopulation = 0;
        this._contentPopulation = 0;
        this._baseTaxRevenue = 15000000 + (1000000 * Math.floor(this._curPopulation/1000));
        this._baseMaintenanceCost = 5000;
        this._taxRevenueUnits = 1000;
        this._maintenanceCostUnits = 500;
        this._populationRatio = 0.5;
        this._basePollution = 500 * Math.floor(this._curPopulation/1000);
        this._pollutionUnits = 5;

    }

    protected fancyCheckResidentialFacility(distance : number): boolean {
        return true //placeholder
    }
}

export class ComfortableHome extends ResidentialFacility {

}

export class AffordableHome extends ResidentialFacility {
    
}
