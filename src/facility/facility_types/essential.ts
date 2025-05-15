import { Facility, FacilitySector, FacilityType } from "../facility.js";
import { Canvas } from "../../app/canvas.js";

export abstract class EssentialServicesFacility extends Facility {
    protected static readonly _FACILITY_SECTOR = FacilitySector.ESSENTIAL;

    protected _taxRevenue: number = 0;
    protected _pollution: number = 0;
}

export class EmergencyBuilding extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.EMERGENCY;
    protected static readonly _NAME : string = "Emergency Service";

    protected static readonly _BUILD_COST: number = 100000000;
    protected _maintenanceCost: number = 1000000;
    protected static readonly _POWER_COST: number = 10;

}

export class EducationCentre extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.EDUCATION;
    protected static readonly _NAME = "Education Centre";

    protected static readonly _BUILD_COST : number = 500000000;
    protected _maintenanceCost : number = 50000000;
    protected static readonly _POWER_COST : number = 15;



}

export class MedicalCentre extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.MEDICAL;
    protected static readonly _NAME = "Medical Centre";

    protected static readonly _BUILD_COST: number = 1000000000;
    protected _maintenanceCost: number = 150000000;
    protected static readonly _POWER_COST: number = 20;

    
}

export class Government extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.GOVERNMENT;
    protected static readonly _NAME = "Government";

    protected static readonly _BUILD_COST: number = 100000000;
    protected _maintenanceCost: number = 1000000;
    protected static readonly _POWER_COST: number = 10;


}

export class PowerPlant extends EssentialServicesFacility {
    protected static readonly _FACILITY_TYPE = FacilityType.POWER;
    protected static readonly _NAME = "Power Plant";

    protected static readonly _BUILD_COST: number = 500000000;
    protected _maintenanceCost: number = 2000000;
    protected static readonly _POWER_COST: number = 0;

    public override tick(): void {
        
    }
}
