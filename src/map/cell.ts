import { Facility, FacilitySector, FacilityType } from "../facility/facility.js";
import { Game } from "../app/game.js";
import { Vector2 } from "../data_structures/vector.js";
import { Canvas } from "../app/canvas.js";
import { Camera } from "./camera.js";
import { AffordableHome, ComfortableHome, LuxuryHome, ResidentialFacility } from "../facility/facility_types/residential.js";
import { EducationCentre, Government } from "../facility/facility_types/essential.js";
import { Restaurant, Store } from "../facility/facility_types/commercial.js";
import { EnvironmentalFacility, Factory } from "../facility/facility_types/industrial.js";
import { GameMap } from "./map.js";
import { DefenseFacility } from "../facility/facility_types/defense.js";

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

        return (this.facility.constructor as typeof Facility).FACILITY_TYPE;
    }

    public get facilitySector(): FacilitySector | null {
        if (this.facility == null) {
            return null;
        }

        return (this.facility.constructor as typeof Facility).FACILITY_SECTOR;
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

    public drawGround(canvas: Canvas, camera: Camera): void {
        if (camera.isIsometric()) {
            canvas.drawImage(
                Canvas.ImageLoader.getImage(`res/assets/map/grass_isometric.png`),
                camera.unitsToPixels(this.coordinates.add(new Vector2(0.5, 0.5))),
                camera.isometricUnitWidth * (1 - GameMap.ROAD_WIDTH),
                camera.isometricUnitHeight * (1 - GameMap.ROAD_WIDTH)
            );
        } else {
            canvas.drawImage(
                Canvas.ImageLoader.getImage(`res/assets/map/grass_straight.png`),
                camera.unitsToPixels(this.coordinates.add(new Vector2(0.5, 0.5))),
                camera.pixelsPerUnit * (1 - GameMap.ROAD_WIDTH),
                camera.pixelsPerUnit * (1 - GameMap.ROAD_WIDTH)
            );
        }
    }

    public drawFacility(canvas: Canvas, camera: Camera): void {
        if (this._facility != null) {
            if (camera.isIsometric()) {
                canvas.drawImage(
                    this._facility.getSprite(true),
                    camera.unitsToPixels(this.coordinates.add(new Vector2(0.7, 0.7))),
                    camera.isometricUnitWidth / 2,
                    camera.isometricUnitWidth / 2
                )
            } else {
                canvas.drawImage(
                    this._facility.getSprite(false),
                    camera.unitsToPixels(this.coordinates.add(new Vector2(0.5, 0.5))),
                    camera.pixelsPerUnit * (1 - GameMap.ROAD_WIDTH),
                    camera.pixelsPerUnit * (1 - GameMap.ROAD_WIDTH)
                )
            }
        }
    }

    public canBuild(facilityType: FacilityType) : boolean {
        return true; //placeholder
    }
}