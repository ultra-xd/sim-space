import { Facility } from "../facility.js";

export abstract class IndustrialFacility extends Facility {

}

export class Factory extends IndustrialFacility {

}

export class Warehouse extends IndustrialFacility {

}

export class EnvironmentalFacility extends IndustrialFacility {
    
}
