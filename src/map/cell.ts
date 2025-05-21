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

/**
 * Represents a cell in the game map.
 */
export class Cell {
    private _coordinates: Vector2;
    private _pollution: number;

    /**
     * Creates a new cell with the specified coordinates and facility.
     * @param game The game the cell is part of.
     * @param x The X coordinate of the cell.
     * @param y The Y coordinate of the cell.
     * @param _facility The facility the cell contains, or null if the cell is empty.
     */
    public constructor(
        private game: Game,
        x: number,
        y: number,
        private _facility: Facility | null
    ) {
        this._coordinates = new Vector2(x, y);
    }

    
    /**
     * The type of the facility in the cell, or null if the cell is empty.
     */
    public get facilityType(): FacilityType | null {
        if (this._facility == null) {
            return null;
        }

        return (this._facility.constructor as typeof Facility).FACILITY_TYPE;
    }

    
    /**
     * The sector of the facility in the cell, or null if the cell is empty.
     */
    public get facilitySector(): FacilitySector | null {
        if (this._facility == null) {
            return null;
        }

        return (this._facility.constructor as typeof Facility).FACILITY_SECTOR;
    }

    
    /**
     * The facility in the cell, or null if the cell is empty.
     */
    public set facility(facility: Facility | null) {
        this._facility = facility;
    }

    
    /**
     * The X coordinate of the cell.
     */
    public get x(): number {
        return this._coordinates.x;
    }

    
    /**
     * The Y coordinate of the cell.
     */
    public get y(): number {
        return this._coordinates.y;
    }

    
    /**
     * The coordinates of the cell.
     */
    public get coordinates(): Vector2 {
        return this._coordinates;
    }

    /**
     * Updates the cell and the facility in it, if it exists.
     */
    public tick(): void {
        this._pollution = this._facility ? this._facility.pollution : 0;
    }

    public get pollution(): number {
        return this._pollution;
    }
    public set pollution(pollution: number) {
        this._pollution = pollution;
    }

    public build(facility: Facility): boolean {
        return true;
    }

    public destroy(facility: Facility): boolean {
        return true;
    }

    /**
     * Checks if the cell is empty (i.e. has no facility).
     * @returns True if the cell is empty, false otherwise.
     */
    public isEmpty(): boolean {
        return this._facility == null;
    }

    /**
     * Draws the ground of the cell on the specified canvas, using the specified camera.
     * @param canvas The canvas to draw on.
     * @param camera The camera to determine the view point.
     */
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

    /**
     * Draws the facility in the cell on the specified canvas, using the specified camera.
     * @param canvas The canvas to draw on.
     * @param camera The camera to determine the view point.
     */
    public drawFacility(canvas: Canvas, camera: Camera): void {
        if (this._facility != null) {
            if (camera.isIsometric()) {
                canvas.drawImage(
                    this._facility.getSprite(true),
                    camera.unitsToPixels(this.coordinates.add(new Vector2(0.7, 0.7))), // adjust so building is centered
                    camera.isometricUnitWidth / 2,
                    camera.isometricUnitWidth / 2
                )
            } else {
                canvas.drawImage(
                    this._facility.getSprite(false),
                    camera.unitsToPixels(this.coordinates.add(new Vector2(0.5, 0.5))), // adjust so building is centered1
                    camera.pixelsPerUnit * (1 - GameMap.ROAD_WIDTH),
                    camera.pixelsPerUnit * (1 - GameMap.ROAD_WIDTH)
                )
            }
        }
    }

    /**
     * Determines if the cell can build a facility of the specified type.
     * @param facilityType The type of facility to build.
     * @returns True if the facility can be built, false otherwise.
     */
    public canBuild(facilityType: FacilityType) : boolean {
        return this.isEmpty();
    }

    /**
     * Determines if the facility in the cell, if it exists, can be destroyed.
     * @returns True if the facility can be destroyed, false otherwise.
     */
    public canDestroy(): boolean {
        return !this.isEmpty();
    }
}