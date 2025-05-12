import { Facility, FacilitySector, FacilityType } from "../facility.js";

export abstract class IndustrialFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.INDUSTRIAL;
}

export class Factory extends IndustrialFacility {
    protected _buildcost: number;
    protected _maintenanceCost: number;
    protected _taxRevenue: number;
    protected _powerUnits: number;
    protected _pollution: number;
    protected _name: string;
    protected static readonly _FACILITY_TYPE = FacilityType.FACTORY;
    protected static readonly _NAME = "Factory";
}

export class Warehouse extends IndustrialFacility {
    protected _buildcost: number;
    protected _maintenanceCost: number;
    protected _taxRevenue: number;
    protected _powerUnits: number;
    protected _pollution: number;
    protected _name: string;
    protected static readonly _FACILITY_TYPE = FacilityType.WAREHOUSE;
    protected static readonly _NAME = "Warehouse";
}

export class EnvironmentalFacility extends IndustrialFacility {
    protected _buildcost: number;
    protected _maintenanceCost: number;
    protected _taxRevenue: number;
    protected _powerUnits: number;
    protected _pollution: number;
    protected _name: string;
    protected static readonly _FACILITY_TYPE = FacilityType.ENVIRONMENT;
    protected static readonly _NAME = "Environmental Facility";
}
