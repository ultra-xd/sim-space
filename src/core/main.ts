import { App } from "../app/app.js";
import { Facility } from "../facility/facility.js";
import { FacilitySector } from "../facility/facility.js";
import { FacilityType } from "../facility/facility.js";
import { CommercialFacility } from "../facility/facility_types/commercial.js";
import { Store } from "../facility/facility_types/commercial.js";

console.log("hello world");
console.log("skull emoji");
let x : Facility = new Store();
console.log(x.FACILITY_SECTOR);
console.log(x.FACILITY_TYPE);



const APP: App = new App("canvas");
