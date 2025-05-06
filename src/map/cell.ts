import { Facility, FacilitySector, FacilityType } from "../facility/facility.js";
import { Game } from "../app/game.js";
import { Vector2 } from "../data_structures/vector.js";
import { Canvas } from "../app/canvas.js";
import { Camera } from "./camera.js";

export class Cell {

    private _coordinates: Vector2;

    public constructor(
        private game: Game,
        x: number,
        y: number,
        private _facility: Facility | null
    ) {
        this._coordinates = new Vector2(x, y);
    }

    public get facilityType(): FacilityType | null {
        if (this.facility == null) {
            return null;
        }

        return this.facility.FACILITY_TYPE;
    }

    public get facilitySector(): FacilitySector | null {
        if (this.facility == null) {
            return null;
        }

        return this.facility.FACILITY_SECTOR;
    }

    public set facility(facility: Facility | null) {
        this._facility = facility;
    }

    public get x(): number {
        return this._coordinates.x;
    }

    public get y(): number {
        return this._coordinates.y;
    }

    public get coordinates(): Vector2 {
        return this._coordinates;
    }

    public build(facility: Facility): boolean {
        return true;
    }

    public destroy(facility: Facility): boolean {
        return true;
    }

    public tick(): void {

    }

    public isEmpty(): boolean {
        return this.facility == null;
    }

    public draw(canvas: Canvas, camera: Camera): void {

    }
}