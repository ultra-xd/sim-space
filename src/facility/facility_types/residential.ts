import { Facility } from "../facility.js";
import { FacilitySector } from "../facility.js";
import { FacilityType } from "../facility.js";

export abstract class ResidentialFacility extends Facility {
    protected readonly _FACILITY_SECTOR = FacilitySector.RESIDENTIAL;
    protected abstract _curPopulation : number;
    protected abstract _maxPopulation : number;
    protected _GROWTH_RATE : number = 0.1;

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
    protected _baseTaxRevenue: number;
    protected _taxRevenueUnits: number;
    protected _baseMaintenanceCost: number;
    protected _maintenanceCostUnits: number;
    protected _pollutionUnits: number;
    protected _basePollution: number;
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.LUXURY_HOME;

    protected _buildcost: number = 1000000000
    protected _maintenanceCost: number = 10000000;
    protected _taxRevenue: number = 15000000;
    protected _powerUnits: number = 100;
    protected _pollution: number = 500;
    protected static readonly _NAME: string = "Luxury Home";

    protected _curPopulation: number = 0;
    protected _maxPopulation: number = 10000;
    protected _happyPopulation: number = 0;
    protected _contentPopulation: number = 0;
    protected _happinessRatio: number = 0;
    


}

export class ComfortableHome extends ResidentialFacility {
    protected _curPopulation: number;
    protected _maxPopulation: number;
    protected _happyPopulation: number;
    protected _contentPopulation: number;
    protected _happinessRatio: number;
    protected _baseTaxRevenue: number;
    protected _taxRevenueUnits: number;
    protected _baseMaintenanceCost: number;
    protected _maintenanceCostUnits: number;
    protected _pollutionUnits: number;
    protected _basePollution: number;
    protected _buildcost: number;
    protected _maintenanceCost: number;
    protected _taxRevenue: number;
    protected _powerUnits: number;
    protected _pollution: number;
    protected _name: string;
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.COMFORTABLE_HOME;
    protected static readonly _NAME: string = "Comfortable Home";
}

export class AffordableHome extends ResidentialFacility {
    protected _curPopulation: number;
    protected _maxPopulation: number;
    protected _happyPopulation: number;
    protected _contentPopulation: number;
    protected _happinessRatio: number;
    protected _baseTaxRevenue: number;
    protected _taxRevenueUnits: number;
    protected _baseMaintenanceCost: number;
    protected _maintenanceCostUnits: number;
    protected _pollutionUnits: number;
    protected _basePollution: number;
    protected _buildcost: number;
    protected _maintenanceCost: number;
    protected _taxRevenue: number;
    protected _powerUnits: number;
    protected _pollution: number;
    protected _name: string;
    protected static readonly _FACILITY_TYPE: FacilityType = FacilityType.AFFORDABLE_HOME;
    protected static readonly _NAME: string = "Affordable Home";
}
