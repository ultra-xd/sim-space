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

    protected abstract _cost : number;
    protected abstract _maintenance : number;
    protected abstract _taxRevenue : number;
    protected abstract _powerUsage : number;
    protected abstract _pollution : number;
        

    public get FACILITY_SECTOR(): FacilitySector {
        return this._FACILITY_SECTOR;
    }

    public get FACILITY_TYPE(): FacilityType {
        return this._FACILITY_TYPE;
    }
}

