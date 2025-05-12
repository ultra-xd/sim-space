import { Facility } from "../facility.js";
import { FacilitySector } from "../facility.js";
import { FacilityType } from "../facility.js";

export abstract class CommercialFacility extends Facility {
    protected readonly _FACILITY_SECTOR = FacilitySector.COMMERCIAL;

}

export class Store extends CommercialFacility {
    protected readonly _FACILITY_TYPE = FacilityType.STORE;
    _buildcost = 2000000
    _maintenanceCost = 50000;
    _taxRevenue = 200000;
    _powerUnits = 5;
    _pollution = 500;
    _name = "Store";
}

export class Restaurant extends CommercialFacility {
    protected readonly _FACILITY_TYPE = FacilityType.RESTAURANT;
        _buildcost = 250000
    _maintenanceCost = 5000;
    _taxRevenue = 10000;
    _powerUnits = 5;
    _pollution = 300;
    _name = "Restaurant";
}

export class Office extends CommercialFacility {
    protected readonly _FACILITY_TYPE = FacilityType.OFFICE;
    _buildcost = 3000000
    _maintenanceCost = 5000;
    _taxRevenue = 20000;
    _powerUnits = 15;
    _pollution = 800;
    _name = "Office";
}

