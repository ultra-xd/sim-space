import { Facility, FacilitySector, FacilityType } from "../facility/facility.js";
import { Game } from "../app/game.js";
import { Vector2 } from "../data_structures/vector.js";
import { Canvas } from "../app/canvas.js";
import { Camera } from "./camera.js";
import { GameMap } from "./map.js";
import { GameMenu } from "../app/game_menu.js";

/**
 * Represents a cell in the game map.
 */
export class Cell {
    private _coordinates: Vector2;
    private _pollution: number;

    /**
     * Creates a new cell with the specified coordinates and facility.
     * @param _GAME The game the cell is part of.
     * @param x The X coordinate of the cell.
     * @param y The Y coordinate of the cell.
     * @param _facility The facility the cell contains, or null if the cell is empty.
     */
    public constructor(
        private readonly _GAME: Game,
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

    public get facility(): Facility | null {
        return this._facility;
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
        if (this._facility != null) {
            this._facility.tick();
        }
    }

    public get pollution(): number {
        return this._pollution;
    }

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
                    camera.unitsToPixels(this.coordinates.add(new Vector2(0.5, 0.5))), // adjust so building is centered
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
    public canBuild(facilitySector: FacilitySector) : boolean {
        if (this.isEmpty()) {
            if (facilitySector == FacilitySector.ESSENTIAL) {
                return true;
            }

            else if (facilitySector == FacilitySector.RESIDENTIAL) {
                if (!this._GAME.MAP.containsTypes([
                    FacilityType.EMERGENCY,
                    FacilityType.EDUCATION,
                    FacilityType.MEDICAL,
                    FacilityType.GOVERNMENT,
                    FacilityType.POWER
                ])) {
                    GameMenu.NotificationManager.createNotification("Residential facilities require an emergency building, education centre, medical centre, a government and a power plant to be built.");
                    return false;
                }

                if (!this._GAME.MAP.BFS(
                        this.coordinates,
                        5,
                        (coordinates: Vector2): boolean => {
                            return this._GAME.MAP.getCell(coordinates).facilityType == FacilityType.STORE;
                        }
                    )
                ) {
                    GameMenu.NotificationManager.createNotification("Residential facilities must be built 5 units of a store.");
                    return false;
                }

                else if (!this._GAME.MAP.BFS(
                        this.coordinates,
                        3,
                        (coordinates: Vector2): boolean => {
                            return this._GAME.MAP.getCell(coordinates).facilityType == FacilityType.RESTAURANT;
                        }
                    )
                ) {
                    GameMenu.NotificationManager.createNotification("Residential facilities must be built 3 units of a restaurant.");
                    return false;
                }

                return true;
            }

            else if (facilitySector == FacilitySector.INDUSTRIAL) {
                if (!this._GAME.MAP.BFS(
                    this.coordinates,
                    6,
                    (coordinates: Vector2): boolean => {
                        return this._GAME.MAP.getCell(coordinates).facilityType == FacilityType.POWER;
                    }
                )) {
                    GameMenu.NotificationManager.createNotification("Industrial facilities must be built within 6 units of a power plant.");
                    return false;
                }

                return true;
            }

            return true;
        } else {
            GameMenu.NotificationManager.createNotification("This cell is already occupied by a facility.");
            return false;
        }
    }

    /**
     * Determines if the facility in the cell, if it exists, can be destroyed.
     * @returns True if the facility can be destroyed, false otherwise.
     */
    public canDestroy(): boolean {
        return !this.isEmpty();
    }
}