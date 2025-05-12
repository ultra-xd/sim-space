import { Facility } from "../facility.js";
import { FacilitySector } from "../facility.js";
import { FacilityType } from "../facility.js";

export abstract class ResidentialFacility extends Facility {
    protected readonly _FACILITY_SECTOR = FacilitySector.RESIDENTIAL;
    protected abstract _curPopulation : number;
    protected abstract _maxPopulation : number;
    protected  _GROWTH_RATE : number = 0.1;

    protected abstract _happyPopulation : number;
    protected abstract _contentPopulation : number;
    protected abstract _happinessRatio : number;
  

    protected abstract _baseTaxRevenue : number;
    protected abstract _taxRevenueUnits : number;

    protected abstract _baseMaintenanceCost : number;
    protected abstract _maintenanceCostUnits : number;

    protected abstract _pollutionUnits : number;
    protected abstract _basePollution : number;



}

export class LuxuryHome extends ResidentialFacility {
    protected readonly _FACILITY_TYPE: FacilityType.LUXURY_HOME;

    _buildcost = 1000000000
    _maintenanceCost = 10000000;
    _taxRevenue = 15000000;
    _powerUnits = 100;
    _pollution = 500;
    _name = "Luxury Home";

    _curPopulation = 0;
    _maxPopulation = 10000;
    _happyPopulation = 0;
    _contentPopulation = 0;
    _happinessRatio = 0;
    

}

export class ComfortableHome extends ResidentialFacility {

}

export class AffordableHome extends ResidentialFacility {
    
}
