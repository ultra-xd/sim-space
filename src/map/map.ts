import { Cell } from "./cell.js";
import { Facility, FacilityType, FacilitySector } from "../facility/facility.js";
import { PowerPlant } from "../facility/facility_types/essential.js";
import { Game } from "../app/game.js";
import { Canvas } from "../app/canvas.js";
import { Vector2 } from "../data_structures/vector.js";
import { Queue } from "../data_structures/queue.js";
import { Camera } from "./camera.js";
import { ArrayList } from "../data_structures/arraylist.js";
import { assert } from "../util/util.js";

/**
 * Represents the game map, which is a grid of cells.
 */
export class GameMap {
    private readonly _CELLS: Cell[][];
    private readonly _OCCUPIED_CELLS: ArrayList<Vector2> = new ArrayList<Vector2>();

    // The width of the road and the road lines in the game map, in units
    private static readonly _ROAD_WIDTH: number = 0.3;
    private static readonly _ROAD_DASH_WIDTH: number = 0.005;

    /**
     * Creates a new game map with the specified width and height.
     * @param _GAME The game for the map to be part of.
     * @param _WIDTH The number of cells in the X direction of the map.
     * @param _HEIGHT The number of cells in the X direction of the map
     */
    public constructor(
        private readonly _GAME: Game, 
        private readonly _WIDTH: number, 
        private readonly _HEIGHT: number
    ) {
        this._CELLS = new Array<Cell[]>(this.height);
        for (let y: number = 0; y < this.height; y++) {
            const CELL_ROW: Cell[] = new Array<Cell>(this.width);
            for (let x: number = 0; x < CELL_ROW.length; x++) {
                CELL_ROW[x] = new Cell(this.GAME, x, y, null);
            }

            this._CELLS[y] = CELL_ROW;
        }
    }

    public containsType(facilityType: FacilityType): boolean {
        for (let i: number = 0; i < this._GAME.MAP.OCCUPIED_CELLS.length; i++) {
            const COORDINATES: Vector2 = this._GAME.MAP.OCCUPIED_CELLS.get(i);

            if (this.getCell(COORDINATES).facilityType == facilityType) {
                return true;
            }
        }

        return false;
    }

    public containsMultipleOfType(facilityType: FacilityType): boolean {
        let found: boolean = false;
        for (let i: number = 0; i < this._GAME.MAP.OCCUPIED_CELLS.length; i++) {
            const COORDINATES: Vector2 = this._GAME.MAP.OCCUPIED_CELLS.get(i);

            if (this.getCell(COORDINATES).facilityType == facilityType) {
                if (found) return true;
                found = true;
            }
        }

        return false;
    }

    public containsTypes(facilityTypes: FacilityType[]): boolean {
        for (let i: number = 0; i < facilityTypes.length; i++) {
            if (!this.containsType(facilityTypes[i])) {
                return false;
            }
        }

        return true;
    }

    public containsSector(facilitySector: FacilitySector): boolean {
        for (let i: number = 0; i < this._GAME.MAP.OCCUPIED_CELLS.length; i++) {
            const COORDINATES: Vector2 = this._GAME.MAP.OCCUPIED_CELLS.get(i);

            if (this.getCell(COORDINATES).facilitySector == facilitySector) {
                return true;
            }
        }

        return false;
    }

    public containsSectors(facilitySectors: FacilitySector[]): boolean {
        for (let i: number = 0; i < facilitySectors.length; i++) {
            if (!this.containsSector(facilitySectors[i])) {
                return false;
            }
        }

        return true;
    }

    public BFS(
        start: Vector2, 
        maxDistance: number, 
        handleCondition: (coordinates: Vector2, distance?: number) => boolean,
    ): boolean {
        const QUEUE: Queue<[Vector2, number]> = new Queue<[Vector2, number]>();
        const VISITED: boolean[][] = new Array<boolean[]>(this.height);

        for (let i: number = 0; i < this.height; i++) {
            VISITED[i] = new Array<boolean>(this.width);

            for (let j: number = 0; j < this.width; j++) {
                VISITED[i][j] = false;
            }
        }

        QUEUE.enqueue([start, 0]);
        VISITED[start.y][start.x] = true;

        const NEIGHBOURS: [Vector2, Vector2, Vector2, Vector2] = [
            Vector2.I_UNIT,
            Vector2.J_UNIT,
            Vector2.I_UNIT.multiply(-1),
            Vector2.J_UNIT.multiply(-1)
        ];

        while (!QUEUE.isEmpty()) {
            const [COORDINATES, DISTANCE]: [Vector2, number] = QUEUE.dequeue()!;
            assert (COORDINATES != null && DISTANCE != null);

            if (handleCondition(COORDINATES, DISTANCE)) {
                return true;
            }

            const NEW_DISTANCE: number = DISTANCE + 1;
            if (NEW_DISTANCE > maxDistance) {
                continue;
            }

            for (let i: number = 0; i < NEIGHBOURS.length; i++) {
                const NEIGHBOUR: Vector2 = COORDINATES.add(NEIGHBOURS[i]);

                if (!this.inBounds(NEIGHBOUR)) continue;
                if (VISITED[NEIGHBOUR.y][NEIGHBOUR.x]) continue;

                VISITED[NEIGHBOUR.y][NEIGHBOUR.x] = true;
                QUEUE.enqueue([NEIGHBOUR, NEW_DISTANCE]);
            }

        }

        return false;
    }

    public inBounds(coordinates: Vector2): boolean {
        return (
            coordinates.x >= 0 &&
            coordinates.x < this._WIDTH &&
            coordinates.y >= 0 &&
            coordinates.y < this._HEIGHT
        );
    }
    
    /**
     * Width of the game map in cells.
     */
    public get width(): number {
        return this._WIDTH;
    }
    
    /**
     * Hedight of the game map in cells.
     */
    public get height(): number {
        return this._HEIGHT;
    }
    
    /**
     * The game the map is part of.
     */
    public get GAME(): Game {
        return this._GAME;
    }
    
    /**
     * Width of the road in the game map, in units.
     */
    public static get ROAD_WIDTH(): number {
        return GameMap._ROAD_WIDTH;
    }

    public get OCCUPIED_CELLS(): ArrayList<Vector2> {
        return this._OCCUPIED_CELLS;
    }

    public getCell(coordinates: Vector2): Cell {
        return this._CELLS[coordinates.y][coordinates.x];
    }

    public getAllOfType(facilityType: FacilityType): Vector2[] {
        const LIST: ArrayList<Vector2> = new ArrayList<Vector2>();

        for (let i: number = 0; i < this._OCCUPIED_CELLS.length; i++) {
            const COORDINATES: Vector2 = this._OCCUPIED_CELLS.get(i);
            if (this.getCell(COORDINATES).facilityType == facilityType) {
                LIST.add(COORDINATES);
            }
        }

        return LIST.getArray();
    }

    public getAllOfSector(facilitySector: FacilitySector): Vector2[] {
        const LIST: ArrayList<Vector2> = new ArrayList<Vector2>();

        for (let i: number = 0; i < this._OCCUPIED_CELLS.length; i++) {
            const COORDINATES: Vector2 = this._OCCUPIED_CELLS.get(i);
            if (this.getCell(COORDINATES).facilitySector == facilitySector) {
                LIST.add(COORDINATES);
            }
        }

        return LIST.getArray();
    }

    /**
     * Builds a facility at the specified coordinates, if possible.
     * @param FacilityClass The class of the facility to build.
     * @param coordinates The location to build the facility at.
     * @returns True if the facility was built, false otherwise.
     */
    public build<T extends {new (GAME: Game): Facility}>(FacilityClass: T, coordinates: Vector2): boolean {
        const FACILITY: Facility = new FacilityClass(this.GAME);
        const CELL: Cell = this._CELLS[coordinates.y][coordinates.x];

        if (CELL.canBuild(FACILITY.FACILITY_SECTOR)) {
            CELL.facility = FACILITY;
            this._OCCUPIED_CELLS.add(coordinates);
            this.redistributePower();
            return true;
        }

        return false;
    }

    public redistributePower(): void {
        for (let i: number = 0; i < this._OCCUPIED_CELLS.length; i++) {
            const FACILITY: Facility | null = this.getCell(this._OCCUPIED_CELLS.get(i)).facility;
            assert (FACILITY != null);

            FACILITY.powerAvailable = 0;
        }

        for (let i: number = 0; i < this._OCCUPIED_CELLS.length; i++) {
            const COORDINATES: Vector2 = this._OCCUPIED_CELLS.get(i);
            const FACILITY: Facility | null = this.getCell(COORDINATES).facility;
            assert (FACILITY != null);

            if (FACILITY.FACILITY_TYPE == FacilityType.POWER) {
                (FACILITY as PowerPlant).distributePower(COORDINATES);
            }
        }
        // debug
        console.log("__________________________________________");
        for (let i: number = 0; i < this._OCCUPIED_CELLS.length; i++) {
            const FACILITY: Facility | null = this.getCell(this._OCCUPIED_CELLS.get(i)).facility;
            assert (FACILITY != null);
            console.log(FACILITY.FACILITY_TYPE, FACILITY.powerAvailable, (FACILITY.constructor as typeof Facility).POWER_COST);
        }
    }

    /**
     * Removes a facility at the specified coordinates, if possible (i.e if the facility exists and there is no other builds to depend on it).
     * @param coordinates The location to remove a facility from.
     * @returns True if the facility was removed, false otherwise.
     */
    public destroy(coordinates: Vector2): boolean {
        const CELL: Cell = this._CELLS[coordinates.y][coordinates.x];
        if (CELL.canDestroy()) {
            CELL.facility = null;
            
            for (let i: number = 0; i < this._OCCUPIED_CELLS.length; i++) {
                if (this._OCCUPIED_CELLS.get(i).equals(coordinates)) {
                    this._OCCUPIED_CELLS.delete(i);
                    break;
                }
            }

            this.redistributePower();

            return true;
        }

        return false;
    }

    /**
     * Draws the game map on the specified canvas, using the specified camera.
     * @param canvas The canvas to draw on.
     * @param camera The camera to determine the view point.
     */
    public draw(canvas: Canvas, camera: Camera): void {
        const TOP_LEFT_COORDS: Vector2 = camera.pixelsToUnits(new Vector2(0, 0));
        const TOP_RIGHT_COORDS: Vector2 = camera.pixelsToUnits(new Vector2(canvas.width, 0));
        const BOTTOM_LEFT_COORDS: Vector2 = camera.pixelsToUnits(new Vector2(0, canvas.height));
        const BOTTOM_RIGHT_COORDS: Vector2 = camera.pixelsToUnits(new Vector2(canvas.width, canvas.height));

        const MIN_X: number = Math.floor(Math.min(
            TOP_LEFT_COORDS.x,
            TOP_RIGHT_COORDS.x,
            BOTTOM_LEFT_COORDS.x,
            BOTTOM_RIGHT_COORDS.x
        ));

        const MAX_X: number = Math.ceil(Math.max(
            TOP_LEFT_COORDS.x,
            TOP_RIGHT_COORDS.x,
            BOTTOM_LEFT_COORDS.x,
            BOTTOM_RIGHT_COORDS.x
        ));

        const MIN_Y: number = Math.floor(Math.min(
            TOP_LEFT_COORDS.y,
            TOP_RIGHT_COORDS.y,
            BOTTOM_LEFT_COORDS.y,
            BOTTOM_RIGHT_COORDS.y
        ))

        const MAX_Y: number = Math.ceil(Math.max(
            TOP_LEFT_COORDS.y,
            TOP_RIGHT_COORDS.y,
            BOTTOM_LEFT_COORDS.y,
            BOTTOM_RIGHT_COORDS.y
        ));

        // draw vertical lines
        for (let i: number = Math.max(0, MIN_X); i <= Math.min(MAX_X, this.width); i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(i, 0)),
                camera.unitsToPixels(new Vector2(i, this.height)),
                "rgb(54, 54, 54)",
                GameMap.ROAD_WIDTH * camera.pixelsPerUnit
            );
        }

        // draw horizontal lines
        for (let i: number = Math.max(0, MIN_Y); i <= Math.min(MAX_Y, this.height); i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(0, i)),
                camera.unitsToPixels(new Vector2(this.width, i)),
                "rgb(54, 54, 54)",
                GameMap.ROAD_WIDTH * camera.pixelsPerUnit
            );
        }

        // draw vertical lines
        for (let i: number = Math.max(0, MIN_X); i <= (Math.min(MAX_X, this.width)); i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(i, 0)),
                camera.unitsToPixels(new Vector2(i, this.height)),
                "rgb(208, 255, 0)",
                GameMap._ROAD_DASH_WIDTH * camera.pixelsPerUnit
            );
        }

        // draw horizontal lines
        for (let i: number = Math.max(0, MIN_Y); i <= (Math.min(MAX_Y, this.height)); i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(0, i)),
                camera.unitsToPixels(new Vector2(this.width, i)),
                "rgb(208, 255, 0)",
                GameMap._ROAD_DASH_WIDTH * camera.pixelsPerUnit
            );
        }

        for (let i: number = Math.max(0, MIN_Y); i <= (Math.min(MAX_Y, this.height - 1)); i++) {
            const CELL_ROW: Cell[] = this._CELLS[i];
            for (let j: number = Math.max(0, MIN_X); j <= (Math.min(MAX_X, this.width - 1)); j++) {
                CELL_ROW[j].drawGround(canvas, camera);
            }
        }

        // Draw transparent shade for highlighted cell
        if (this.GAME.highlightedCell != null) {
            canvas.fillPolygon(
                [
                    this.GAME.CAMERA.unitsToPixels(this.GAME.highlightedCell),
                    this.GAME.CAMERA.unitsToPixels(this.GAME.highlightedCell.add(Vector2.I_UNIT)),
                    this.GAME.CAMERA.unitsToPixels(this.GAME.highlightedCell.add(Vector2.I_UNIT).add(Vector2.J_UNIT)),
                    this.GAME.CAMERA.unitsToPixels(this.GAME.highlightedCell.add(Vector2.J_UNIT))
                ],
                this.GAME.highlightedColour
            );
        }

        for (let i: number = Math.max(0, MIN_Y); i <= (Math.min(MAX_Y, this.height - 1)); i++) {
            const CELL_ROW: Cell[] = this._CELLS[i];
            for (let j: number = Math.max(0, MIN_X); j <= (Math.min(MAX_X, this.width - 1)); j++) {
                CELL_ROW[j].drawFacility(canvas, camera);
            }
        }
    }

    /**
     * Updates the game map and all its cells & facilities.
     */
    public tick(): void {
        for (let i: number = 0; i < this._CELLS.length; i++) {
            const CELL_ROW: Cell[] = this._CELLS[i];
            for (let j: number = 0; j < CELL_ROW.length; j++) {
                CELL_ROW[j].tick();
            }
        }
    }
}