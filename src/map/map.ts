import { Cell } from "./cell.js";
import { Facility, FacilityType, FacilitySector, FacilityClass } from "../facility/facility.js";
import { PowerPlant } from "../facility/facility_types/essential.js";
import { Game } from "../app/game.js";
import { Canvas } from "../app/canvas.js";
import { Vector2 } from "../data_structures/vector.js";
import { Queue } from "../data_structures/queue.js";
import { Camera } from "./camera.js";
import { ArrayList } from "../data_structures/arraylist.js";
import { assert } from "../util/util.js";
import { CommercialFacility } from "../facility/facility_types/commercial.js";
import { EnvironmentalFacility, Factory } from "../facility/facility_types/industrial.js";
import { LuxuryHome } from "../facility/facility_types/residential.js";
import { GameMenu } from "../app/game_menu.js";

/**
 * Represents the game map, which is a grid of cells.
 */
export class GameMap {
    // Create 2D array of all cells
    private readonly _CELLS: Cell[][];

    // Create ArrayList of all cells that have a facility on them
    private readonly _OCCUPIED_CELLS: ArrayList<Vector2> = new ArrayList<Vector2>(); 

    // The width of the road and the road lines in the game map, in units
    private static readonly _ROAD_WIDTH: number = 0.3;
    private static readonly _ROAD_DASH_WIDTH: number = 0.005;

    private _pollution: number = 0;

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
        // Fill all elements of 2D of cells with empty cells
        this._CELLS = new Array<Cell[]>(this.height);
        for (let y: number = 0; y < this.height; y++) {
            this._CELLS[y] = new Array<Cell>(this.width);
            for (let x: number = 0; x < this._CELLS[y].length; x++) {
                this._CELLS[y][x] = new Cell(this._GAME, x, y, null);
            }
        }
    }

    /**
     * Determines if the map contains a facility of the specified facility type.
     * @param facilityType The specified facility type to check for.
     * @returns True if found, false otherwise.
     */
    public containsType(facilityType: FacilityType): boolean {
        // Iterate through all occupied cells and determine if facility matches facility type
        for (let i: number = 0; i < this._GAME.MAP.OCCUPIED_CELLS.length; i++) {
            const COORDINATES: Vector2 = this._GAME.MAP.OCCUPIED_CELLS.get(i);

            if (this.getCell(COORDINATES).facilityType == facilityType) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determines if the map contains multiple of a facility of the specified facility type.
     * @param facilityType The specified facility type to check for.
     * @returns True if found more than once, false otherwise.
     */
    public containsMultipleOfType(facilityType: FacilityType): boolean {
        // Iterate through all occupied cells and determine if facility is found twice
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

    /**
     * Determines if the map contains all of the facility types specified.
     * @param facilityTypes An array containing all facility types to check for.
     * @returns True if all facility types are found, false otherwise.
     */
    public containsTypes(facilityTypes: FacilityType[]): boolean {
        // Iterate through all facility types and determine if the map contains that facility type
        for (let i: number = 0; i < facilityTypes.length; i++) {
            if (!this.containsType(facilityTypes[i])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Determines if the map contains a facility of the specified facility sector.
     * @param facilitySector The specified facility sector to check for.
     * @returns True if found, false otherwise.
     */
    public containsSector(facilitySector: FacilitySector): boolean {
        // Iterate through all occupied cells and determine if facility matches facility sector
        for (let i: number = 0; i < this._GAME.MAP.OCCUPIED_CELLS.length; i++) {
            const COORDINATES: Vector2 = this._GAME.MAP.OCCUPIED_CELLS.get(i);

            if (this.getCell(COORDINATES).facilitySector == facilitySector) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determines if the map contains all of the facility sector specified.
     * @param facilitySectors An array containing all facility sector to check for.
     * @returns True if all facility sectors are found, false otherwise.
     */
    public containsSectors(facilitySectors: FacilitySector[]): boolean {
        // Iterate through all facility types and determine if the map contains that facility sectors
        for (let i: number = 0; i < facilitySectors.length; i++) {
            if (!this.containsSector(facilitySectors[i])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Searches through all cells of the map using breadth first search.
     * @param start The start to search from.
     * @param maxDistance The maximum distance from the starting cell to search from.
     * @param handleCondition Function that handles each cell searched. Returns true if the search should be ended, false otherwise.
     * @returns True if a cell is found, false otherwise.
     */
    public BFS(
        start: Vector2, 
        maxDistance: number, 
        handleCondition: (coordinates: Vector2) => boolean,
    ): boolean {
        // Create queue to store all cells
        const QUEUE: Queue<[Vector2, number]> = new Queue<[Vector2, number]>();

        // Track which coordinates have been visited or not
        const VISITED: boolean[][] = new Array<boolean[]>(this.height);

        for (let i: number = 0; i < this.height; i++) {
            VISITED[i] = new Array<boolean>(this.width);

            for (let j: number = 0; j < this.width; j++) {
                VISITED[i][j] = false;
            }
        }

        // Queue the starting position
        QUEUE.enqueue([start, 0]);
        VISITED[start.y][start.x] = true;

        // Create tuple of all neighbouring coordinates relative to one cell
        const NEIGHBOURS: [Vector2, Vector2, Vector2, Vector2] = [
            Vector2.I_UNIT,
            Vector2.J_UNIT,
            Vector2.I_UNIT.multiply(-1),
            Vector2.J_UNIT.multiply(-1)
        ];

        while (!QUEUE.isEmpty()) {
            // Get cell & distance
            const [COORDINATES, DISTANCE]: [Vector2, number] = QUEUE.dequeue()!;
            assert (COORDINATES != null && DISTANCE != null);

            // Handle the cell
            if (handleCondition(COORDINATES)) {
                return true;
            }

            // Track new distance and exit if the distance is too far
            const NEW_DISTANCE: number = DISTANCE + 1;
            if (NEW_DISTANCE > maxDistance) {
                continue;
            }

            // Iterate through all neighbours
            for (let i: number = 0; i < NEIGHBOURS.length; i++) {
                // Get neighbouring cells
                const NEIGHBOUR: Vector2 = COORDINATES.add(NEIGHBOURS[i]);

                // Exit if the neighbouring cell has been visited or is out of bounds
                if (!this.inBounds(NEIGHBOUR)) continue;
                if (VISITED[NEIGHBOUR.y][NEIGHBOUR.x]) continue;

                // Queue the neighbour coordinates
                VISITED[NEIGHBOUR.y][NEIGHBOUR.x] = true;
                QUEUE.enqueue([NEIGHBOUR, NEW_DISTANCE]);
            }

        }

        return false;
    }

    /**
     * Determines if a set of coordinates is within the map.
     * @param coordinates The coordinates on the map.
     * @returns True if the coordinates are on the map, false otherwise.
     */
    public inBounds(coordinates: Vector2): boolean {
        return (
            coordinates.x >= 0 &&
            coordinates.x < this._WIDTH &&
            coordinates.y >= 0 &&
            coordinates.y < this._HEIGHT
        );
    }
    
    /** Width of the game map in cells. */
    public get width(): number {
        return this._WIDTH;
    }
    
    /** Height of the game map in cells. */
    public get height(): number {
        return this._HEIGHT;
    }
    
    /** The game the map is part of. */
    public get GAME(): Game {
        return this._GAME;
    }
    
    /** Width of the road in the game map, in units. */
    public static get ROAD_WIDTH(): number {
        return GameMap._ROAD_WIDTH;
    }

    /** An ArrayList containing every single cell that has a facility. */
    public get OCCUPIED_CELLS(): ArrayList<Vector2> {
        return this._OCCUPIED_CELLS;
    }

    public get pollution(): number {
        return this._pollution;
    }

    /**
     * Gets the cell at specified coordinates.
     * @param coordinates The coordinates of the cell.
     * @returns The cell at the specified coordinates.
     */
    public getCell(coordinates: Vector2): Cell {
        return this._CELLS[coordinates.y][coordinates.x];
    }

    /**
     * Gets the cooridnates of all facilities that are of the specified type.
     * @param facilityType The facility type to search for.
     * @returns An array of 2D vectors containing all of the coordinates of all facilities that are of the specified type.
     */
    public getAllOfType(facilityType: FacilityType): Vector2[] {
        // Create new ArrayList storing all coordinates with specified facility type
        const LIST: ArrayList<Vector2> = new ArrayList<Vector2>();

        // Iterate through all occupied cells and add to list if matches facility type
        for (let i: number = 0; i < this._OCCUPIED_CELLS.length; i++) {
            const COORDINATES: Vector2 = this._OCCUPIED_CELLS.get(i);
            if (this.getCell(COORDINATES).facilityType == facilityType) {
                LIST.add(COORDINATES);
            }
        }

        return LIST.getArray();
    }
    
    /**
     * Gets the cooridnates of all facilities that are of the specified sector.
     * @param facilitySector The facility sector to search for.
     * @returns An array of 2D vectors containing all of the coordinates of all facilities that are of the specified sector.
     */
    public getAllOfSector(facilitySector: FacilitySector): Vector2[] {
        // Create new ArrayList storing all coordinates with specified facility sector
        const LIST: ArrayList<Vector2> = new ArrayList<Vector2>();

        // Iterate through all occupied cells and add to list if matches facility type
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
    public build<T extends FacilityClass>(FacilityClass: T, coordinates: Vector2): boolean {
        // Get the cell
        const CELL: Cell = this._CELLS[coordinates.y][coordinates.x];

        // Build the facility if possible
        if (CELL.canBuild(FacilityClass.FACILITY_SECTOR)) {
            CELL.facility = new FacilityClass(this.GAME);;
            this._OCCUPIED_CELLS.add(coordinates);
            this.updateMap();
            return true;
        }

        return false;
    }

    /**
     * Removes a facility at the specified coordinates, if possible (i.e if the facility exists and there is no other builds to depend on it).
     * @param coordinates The location to remove a facility from.
     * @returns True if the facility was removed, false otherwise.
     */
    public destroy(coordinates: Vector2): boolean {
        // Get the Cell
        const CELL: Cell = this._CELLS[coordinates.y][coordinates.x];

        // Destory facility on cell
        if (CELL.canDestroy()) {
            assert (CELL.facility != null);

            CELL.facility.resetAfterDestroy();
            CELL.facility = null;
            
            // Remove the facility from occupied cell
            for (let i: number = 0; i < this._OCCUPIED_CELLS.length; i++) {
                if (this._OCCUPIED_CELLS.get(i).equals(coordinates)) {
                    this._OCCUPIED_CELLS.delete(i);
                    break;
                }
            }

            this.updateMap();

            return true;
        }

        return false;
    }

    /** Updates all properties in which there are dependencies on facility intersections */
    private updateMap(): void {
        let cellPollution: number = 0;

        // Loop through all facilities
        for (let i: number = 0; i < this._OCCUPIED_CELLS.length; i++) {
            const FACILITY: Facility | null = this.getCell(this._OCCUPIED_CELLS.get(i)).facility;
            assert (FACILITY != null);

            // Set facility power to 0
            FACILITY.powerAvailable = 0;
            
            // Get the total pollution level of each cell
            cellPollution += FACILITY.pollution;
        }

        // Spread pollution throughout entire map
        for (let x: number = 0; x < this.width; x++) {
            for (let y: number = 0; y < this.height; y++) {
                this.getCell(new Vector2(x, y)).pollution = cellPollution / (this.width * this.height);
            }
        }

        // Get total pollution
        let totalPollution: number = cellPollution;

        // Loop through all facilities
        for (let i: number = 0; i < this._OCCUPIED_CELLS.length; i++) {
            const COORDINATES: Vector2 = this._OCCUPIED_CELLS.get(i);
            const FACILITY: Facility | null = this.getCell(COORDINATES).facility;
            assert (FACILITY != null);

            // Distribute power if it is a power plant
            if (FACILITY.FACILITY_TYPE == FacilityType.POWER) {
                (FACILITY as PowerPlant).distributePower(COORDINATES);
            }

            // Update the revenue and maintenance cost of commercial facility based on distance
            if (FACILITY.FACILITY_SECTOR == FacilitySector.COMMERCIAL) {
                (FACILITY as CommercialFacility).updateRevenueAndCost(COORDINATES);
            }

            // Update factory cost if there exists a warehouse nearby
            if (FACILITY.FACILITY_TYPE == FacilityType.FACTORY) {
                (FACILITY as Factory).checkForWarehouse(COORDINATES);
            }

            // Update luxury home max population if there exists a store and restaurant next to it
            if (FACILITY.FACILITY_TYPE == FacilityType.LUXURY_HOME) {
                (FACILITY as LuxuryHome).adjustMaxPopulation(COORDINATES);
            }

            // Mitigate pollution around environmental facility
            if (FACILITY.FACILITY_TYPE == FacilityType.ENVIRONMENT) {
                totalPollution -= (FACILITY as EnvironmentalFacility).reducePollution(COORDINATES);
            }
        }

        // get total pollution
        this._pollution = totalPollution;

        // Update game UI
        this.GAME.GAME_MENU.updateStatsDisplay();
        GameMenu.showFacilityInfo();
    }

    /**
     * Draws the game map on the specified canvas, using the specified camera.
     * @param canvas The canvas to draw on.
     * @param camera The camera to determine the view point.
     */
    public draw(canvas: Canvas, camera: Camera): void {
        // Get the bounds on the game map by taking the corners of the screen
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

        // Draw vertical lines for roads
        for (let i: number = Math.max(0, MIN_X); i <= Math.min(MAX_X, this.width); i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(i, 0)),
                camera.unitsToPixels(new Vector2(i, this.height)),
                "rgb(54, 54, 54)",
                GameMap.ROAD_WIDTH * camera.pixelsPerUnit
            );
        }

        // Draw horizontal lines for roads
        for (let i: number = Math.max(0, MIN_Y); i <= Math.min(MAX_Y, this.height); i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(0, i)),
                camera.unitsToPixels(new Vector2(this.width, i)),
                "rgb(54, 54, 54)",
                GameMap.ROAD_WIDTH * camera.pixelsPerUnit
            );
        }

        // Draw vertical lines for road dash lines
        for (let i: number = Math.max(0, MIN_X); i <= (Math.min(MAX_X, this.width)); i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(i, 0)),
                camera.unitsToPixels(new Vector2(i, this.height)),
                "rgb(208, 255, 0)",
                GameMap._ROAD_DASH_WIDTH * camera.pixelsPerUnit
            );
        }

        // Draw horizontal lines for road dash lines
        for (let i: number = Math.max(0, MIN_Y); i <= (Math.min(MAX_Y, this.height)); i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(0, i)),
                camera.unitsToPixels(new Vector2(this.width, i)),
                "rgb(208, 255, 0)",
                GameMap._ROAD_DASH_WIDTH * camera.pixelsPerUnit
            );
        }
        
        // Draw the ground of each cell
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

        // Draw the facilities on each cell
        for (let i: number = Math.max(0, MIN_Y); i <= (Math.min(MAX_Y, this.height - 1)); i++) {
            const CELL_ROW: Cell[] = this._CELLS[i];
            for (let j: number = Math.max(0, MIN_X); j <= (Math.min(MAX_X, this.width - 1)); j++) {
                CELL_ROW[j].drawFacility(canvas, camera);
            }
        }
    }

    /** Updates the game map and all its cells & facilities. */
    public tick(): void {
        // Update every cell
        for (let i: number = 0; i < this._CELLS.length; i++) {
            const CELL_ROW: Cell[] = this._CELLS[i];
            for (let j: number = 0; j < CELL_ROW.length; j++) {
                CELL_ROW[j].tick();
            }
        }
    }
}