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
    FACTORY
}

export abstract class Facility {
    protected abstract readonly _FACILITY_SECTOR: FacilitySector;
    protected abstract readonly _FACILITY_TYPE: FacilityType;

    public get FACILITY_SECTOR(): FacilitySector {
        return this._FACILITY_SECTOR;
    }

    public get FACILITY_TYPE(): FacilityType {
        return this._FACILITY_TYPE;
    }
}
