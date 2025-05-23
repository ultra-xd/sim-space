import { Facility, FacilitySector, FacilityType } from "../facility/facility.js";
import { Game } from "../app/game.js";
import { Vector2 } from "../data_structures/vector.js";
import { Canvas } from "../app/canvas.js";
import { Camera } from "./camera.js";
import { GameMap } from "./map.js";
import { GameMenu } from "../app/game_menu.js";
import { assert } from "../util/util.js";

/** Represents a cell in the game map. */
export class Cell {
    private _coordinates: Vector2;
    private _pollution: number = 0;

    // Set variables for maximum distance between certain facilities
    private static readonly _MAX_DISTANCE_RESIDENCE_STORE: number = 5;
    private static readonly _MAX_DISTANCE_RESIDENCE_RESTAURANT: number = 3;
    private static readonly _MAX_DISTANCE_INDUSTRIAL_POWER: number = 6;

    /**
     * Creates a new cell with the specified coordinates and facility.
     * @param _GAME The game the cell is part of.
     * @param x The X coordinate of the cell.
     * @param y The Y coordinate of the cell.
     * @param _facility The facility the cell contains,
     * or null if the cell is empty.
     */
    public constructor(
        private readonly _GAME: Game,
        x: number,
        y: number,
        private _facility: Facility | null
    ) {
        this._coordinates = new Vector2(x, y);
    }

    /** The type of the facility in the cell, or null if the cell is empty. */
    public get facilityType(): FacilityType | null {
        if (this._facility == null) {
            return null;
        }

        return (this._facility.constructor as typeof Facility).FACILITY_TYPE;
    }

    /** The sector of the facility in the cell, or null if the cell is empty. */
    public get facilitySector(): FacilitySector | null {
        if (this._facility == null) {
            return null;
        }

        return (this._facility.constructor as typeof Facility).FACILITY_SECTOR;
    }
    
    /** The facility in the cell, or null if the cell is empty. */
    public set facility(facility: Facility | null) {
        this._facility = facility;
    }

    /** The facility in the cell, or null if the cell is empty. */
    public get facility(): Facility | null {
        return this._facility;
    }
    
    /** The X coordinate of the cell. */
    public get x(): number {
        return this._coordinates.x;
    }
    
    /** The Y coordinate of the cell. */
    public get y(): number {
        return this._coordinates.y;
    }
    
    /** The coordinates of the cell. */
    public get coordinates(): Vector2 {
        return this._coordinates;
    }

    /** Updates the cell and the facility in it, if it exists. */
    public tick(): void {
        if (this._facility != null) {
            this._facility.tick();
        }
    }

    /** The pollution level of the cell. */
    public get pollution(): number {
        return this._pollution;
    }

    /** The pollution level of the cell. */
    public set pollution(pollution: number) {
        this._pollution = pollution;
    }

    /**
     * Checks if the cell is empty (i.e. has no facility).
     * @returns True if the cell is empty, false otherwise.
     */
    public isEmpty(): boolean {
        return this._facility == null;
    }

    /**
     * Draws the ground of the cell on the specified canvas,
     * using the specified camera.
     * @param canvas The canvas to draw on.
     * @param camera The camera to determine the view point.
     */
    public drawGround(canvas: Canvas, camera: Camera): void {
        if (camera.isIsometric()) {
            // Draw isometric view of ground
            canvas.drawImage(
                Canvas.ImageLoader.getImage(`res/assets/map/grass_isometric.png`),
                camera.unitsToPixels(this.coordinates.add(new Vector2(0.5, 0.5))),
                camera.isometricUnitWidth * (1 - GameMap.ROAD_WIDTH),
                camera.isometricUnitHeight * (1 - GameMap.ROAD_WIDTH)
            );
        } else {
            // Draw top-down view of grass
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
        if (this._facility == null) return; // Draw nothing if no facility exists

        if (camera.isIsometric()) {
            // Draw isometric view of building
            canvas.drawImage(
                this._facility.getSprite(true),
                camera.unitsToPixels(this.coordinates.add(new Vector2(0.7, 0.7))), // adjust so building is centered
                camera.isometricUnitWidth / 2,
                camera.isometricUnitWidth / 2
            )
        } else {
            // Draw top down view of building
            canvas.drawImage(
                this._facility.getSprite(false),
                camera.unitsToPixels(this.coordinates.add(new Vector2(0.5, 0.5))), // adjust so building is centered
                camera.pixelsPerUnit * (1 - GameMap.ROAD_WIDTH),
                camera.pixelsPerUnit * (1 - GameMap.ROAD_WIDTH)
            )
        }
    }

    /**
     * Determines if the cell can build a facility of the specified type.
     * @param facilityType The type of facility to build.
     * @returns True if the facility can be built, false otherwise.
     */
    public canBuild(facilitySector: FacilitySector) : boolean {
        // Don't build if cell is already occupied
        if (!this.isEmpty()) {
            GameMenu.NotificationManager.createNotification(
                "This cell is already occupied by a facility."
            );
            return false;
        }

        /* Before a residential facility is built there must already be ALL of the 5 different
        Essential Service facilities within 8 units of where the residential facility is to be 
        built on the grid. They also need to be within 5 units of a store, and 3 units of a
        restaurant. */
        if (facilitySector == FacilitySector.RESIDENTIAL) {
            // Check if all essential service facilities exist
            if (!this._GAME.MAP.containsTypes([
                FacilityType.EMERGENCY,
                FacilityType.EDUCATION,
                FacilityType.MEDICAL,
                FacilityType.GOVERNMENT,
                FacilityType.POWER
            ])) {
                GameMenu.NotificationManager.createNotification(
                    "Residential facilities require an emergency building, education centre, medical centre, a government and a power plant to be built."
                );
                return false;
            }

            // Check if store exists within 5 units
            if (!this._GAME.MAP.BFS(
                    this.coordinates,
                    Cell._MAX_DISTANCE_RESIDENCE_STORE,
                    (coordinates: Vector2): boolean => {
                        return this._GAME.MAP.getCell(coordinates).facilityType == FacilityType.STORE;
                    }
                )
            ) {
                GameMenu.NotificationManager.createNotification(
                    `Residential facilities must be built ${
                    Cell._MAX_DISTANCE_RESIDENCE_STORE
                    } units of a store.`
                );

                return false;
            }

            // Check if restaurant exists within 3 units
            else if (!this._GAME.MAP.BFS(
                    this.coordinates,
                    Cell._MAX_DISTANCE_RESIDENCE_RESTAURANT,
                    (coordinates: Vector2): boolean => {
                        return this._GAME.MAP.getCell(coordinates).facilityType == FacilityType.RESTAURANT;
                    }
                )
            ) {
                GameMenu.NotificationManager.createNotification(
                    `Residential facilities must be built ${
                    Cell._MAX_DISTANCE_RESIDENCE_RESTAURANT
                    } units of a restaurant.`
                );
                return false;
            }

            return true;
        }

        // Industrial facilities must be built 6 units within a power plant.
        else if (facilitySector == FacilitySector.INDUSTRIAL) {
            // Check if power plant exists within 6 units
            if (!this._GAME.MAP.BFS(
                this.coordinates,
                Cell._MAX_DISTANCE_INDUSTRIAL_POWER,
                (coordinates: Vector2): boolean => {
                    return this._GAME.MAP.getCell(coordinates).facilityType == FacilityType.POWER;
                }
            )) {
                GameMenu.NotificationManager.createNotification(
                    `Industrial facilities must be built within ${
                        Cell._MAX_DISTANCE_INDUSTRIAL_POWER
                    } units of a power plant.`
                );
                return false;
            }

            return true;
        }

        return true;
    }

    /**
     * Determines if the facility in the cell, if it exists, can be destroyed.
     * @returns True if the facility can be destroyed, false otherwise.
     */
    public canDestroy(): boolean {
        // Don't delete if cell is empty
        if (this.isEmpty()) {
            GameMenu.NotificationManager.createNotification(
                "There is nothing in this space."
            );
            return false;
        }

        // Get facility type and sector of facility on building
        const FACILITY_SECTOR: FacilitySector | null = this.facilitySector;
        const FACILITY_TYPE: FacilityType | null = this.facilityType;
        assert (FACILITY_SECTOR != null && FACILITY_TYPE != null);

        if (FACILITY_SECTOR == FacilitySector.ESSENTIAL) {
            /* Cannot delete if facility is essential and there is a residential
            facility since residential facilities can only be built if there exists
            all 5 essential facilities*/
            if (
                !this._GAME.MAP.containsMultipleOfType(FACILITY_TYPE) &&
                this._GAME.MAP.containsSector(FacilitySector.RESIDENTIAL)
            ) {
                GameMenu.NotificationManager.createNotification(
                    "This facility is essential for building a residential facility: you must have at least one of these."
                );
                return false;
            }
        }

        // Cannot delete store if there is a residential facility dependent on it
        if (FACILITY_TYPE == FacilityType.STORE) {
            if (!this.facilityDeleteCheck(
                FacilitySector.RESIDENTIAL,
                FacilityType.STORE,
                Cell._MAX_DISTANCE_RESIDENCE_STORE
            )) {
                GameMenu.NotificationManager.createNotification(
                    "A residential facility is dependent on this facility: remove that facility before proceeding."
                );
                return false;
            }
        }

        // Cannot delete restaurant if there is a residential facility dependent on it
        if (FACILITY_TYPE == FacilityType.RESTAURANT) {
            if (!this.facilityDeleteCheck(
                FacilitySector.RESIDENTIAL,
                FacilityType.RESTAURANT,
                Cell._MAX_DISTANCE_RESIDENCE_RESTAURANT
            )) {
                GameMenu.NotificationManager.createNotification(
                    "A residential facility is dependent on this facility: remove that facility before proceeding."
                );
                return false;
            }
        }

        // Cannot delete power plant if an industrial facility is dependent on it
        if (FACILITY_TYPE == FacilityType.POWER) {
            if (!this.facilityDeleteCheck(
                FacilitySector.INDUSTRIAL,
                FacilityType.POWER,
                Cell._MAX_DISTANCE_INDUSTRIAL_POWER
            )) {
                GameMenu.NotificationManager.createNotification(
                    "An industrial facility is dependent on this facility: remove that facility before proceeding."
                );

                return false;
            }
        }

        return true;
    }

    /**
     * Determines if a facility of the specified sector can be deleted,
     * dependent on its distance to another facility type.
     * @param facilitySector The specified facility sector.
     * @param facilityType The specified facility type.
     * @param distance The maximum distance between the two facilities.
     * @returns True if can be deleted, false otherwise.
     */
    private facilityDeleteCheck(
        facilitySector: FacilitySector, 
        facilityType: FacilityType,
        distance: number
    ): boolean {
        const SECTOR_CELLS: Vector2[] = this._GAME.MAP.getAllOfSector(facilitySector);

        const TYPE_CELLS: Vector2[] = this._GAME.MAP.getAllOfType(facilityType).filter(
            (coordinates: Vector2): boolean => {
                return !coordinates.equals(this._coordinates);
            } 
        );
        
        if (TYPE_CELLS.length == 0 && SECTOR_CELLS.length != 0) return false;

        return this.distanceCheck(SECTOR_CELLS, TYPE_CELLS, distance);
    }
    
    /**
     * Checks if all coordinates in one array are less than or equal to a 
     * distance from another coordinate array.
     * @param arr1 The first coordinate array.
     * @param arr2 The second coordinate array.
     * @param distance The maximum distance from one coordinate to another.
     * @returns True if all coordinates in one array are less than or equal to
     * a distance from another coordinate array, false otherwise.
     */
    private distanceCheck(
        arr1: Vector2[],
        arr2: Vector2[],
        distance: number
    ): boolean {
        for (let i: number = 0; i < arr1.length; i++) {
            let close: boolean = false;
            const COORDINATES1: Vector2 = arr1[i];

            for (let j: number = 0; j < arr2.length; j++) {
                const COORDINATES2: Vector2 = arr2[j];
                const DISTANCE: number = Math.abs(COORDINATES1.x - COORDINATES2.x) + Math.abs(COORDINATES1.y - COORDINATES2.y);
                if (DISTANCE <= distance) {
                    close = true;
                    break;
                }
            }

            if (!close) return false;
        }

        return true;
    }
}