import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Canvas } from "../../app/canvas.js";

export abstract class EssentialServicesFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.ESSENTIAL;
}

export class EmergencyBuilding extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.EMERGENCY;
    protected static readonly _NAME = "Emergency Service";

    protected _buildcost: number;
    protected _maintenanceCost: number;
    protected _taxRevenue: number;
    protected _powerUnits: number;
    protected _pollution: number;
    protected _name: string;
}

export class EducationCentre extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.EDUCATION;
    protected static readonly _NAME = "Education Centre";

    protected _buildcost: number;
    protected _maintenanceCost: number;
    protected _taxRevenue: number;
    protected _powerUnits: number;
    protected _pollution: number;
    protected _name: string;
}

export class MedicalCentre extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.MEDICAL;
    protected static readonly _NAME = "Medical Centre";

    protected _buildcost: number;
    protected _maintenanceCost: number;
    protected _taxRevenue: number;
    protected _powerUnits: number;
    protected _pollution: number;
    protected _name: string;
}

export class Government extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.GOVERNMENT;
    protected static readonly _NAME = "Government";

    protected _buildcost: number;
    protected _maintenanceCost: number;
    protected _taxRevenue: number;
    protected _powerUnits: number;
    protected _pollution: number;
    protected _name: string;
}

export class PowerPlant extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.POWER;
    protected static readonly _NAME = "Power Plant";
    
    protected _buildcost: number;
    protected _maintenanceCost: number;
    protected _taxRevenue: number;
    protected _powerUnits: number;
    protected _pollution: number;
    protected _name: string;
}
