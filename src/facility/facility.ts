export enum FacilitySector {
    INDUSTRIAL,
    COMMERCIAL,
    ESSENTIAL,
    DEFENSE,
    RESIDENTIAL
}

export enum FacilityType {
    EMERGENCY,
    EDUCATION,
    MEDICAL,
    GOVERNMENT,
    POWER,
    LUXURY_HOME,
    COMFORTABLE_HOME,
    AFFORDABLE_HOME,
    FACTORY,
    OFFICE,
    STORE,
    RESTAURANT
}

export abstract class Facility {
    protected abstract readonly _FACILITY_SECTOR: FacilitySector;
    protected abstract readonly _FACILITY_TYPE: FacilityType;


    protected abstract _buildcost : number;
    protected abstract _maintenanceCost : number ;
    protected abstract _taxRevenue : number;
    protected abstract _powerUnits : number;
    protected abstract _pollution : number;
    protected abstract _name : string;

        

    public get FACILITY_SECTOR(): FacilitySector {
        return this._FACILITY_SECTOR;
    }

    public get FACILITY_TYPE(): FacilityType {
        return this._FACILITY_TYPE;
    }

    public get FacilityType(): FacilityType {
        return this._FACILITY_TYPE;
    }
    public get FacilitySector(): FacilitySector {
        return this._FACILITY_SECTOR;
    }
    public get buildCost(): number {
        return this._buildcost;
    }
    public get maintenanceCost(): number {
        return this._maintenanceCost;
    }
    public get taxRevenue(): number {
        return this._taxRevenue;
    }
    public get powerUnits(): number {
        return this._powerUnits;
    }
    public get pollution(): number {
        return this._pollution;
    }
    public get name(): string {
        return this._name;
    }

}

