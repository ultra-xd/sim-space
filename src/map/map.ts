import { Cell } from "./cell.js";
import { Facility } from "../facility/facility.js";
import { Game } from "../app/game.js";
import { Canvas } from "../app/canvas.js";
import { Vector2 } from "../data_structures/vector.js";
import { Camera } from "./camera.js";
import { GameState } from "../app/game.js";

/**
 * Represents the game map, which is a grid of cells.
 */
export class GameMap {
    private readonly cells: Cell[][];

    // The width of the road and the road lines in the game map, in units
    private static readonly _ROAD_WIDTH: number = 0.3;
    private static readonly _ROAD_DASH_WIDTH: number = 0.005;

    /**
     * Creates a new game map with the specified width and height.
     * @param _game The game for the map to be part of.
     * @param _width The number of cells in the X direction of the map.
     * @param _height The number of cells in the X direction of the map
     */
    public constructor(
        private _game: Game, 
        private _width: number, 
        private _height: number
    ) {
        this.cells = new Array<Cell[]>(this.height);
        for (let y: number = 0; y < this.height; y++) {
            const CELL_ROW: Cell[] = new Array<Cell>(this.width);
            for (let x: number = 0; x < CELL_ROW.length; x++) {
                CELL_ROW[x] = new Cell(this.GAME, x, y, null);
            }

            this.cells[y] = CELL_ROW;
        }
    }

    
    /**
     * Width of the game map in cells.
     */
    public get width(): number {
        return this._width;
    }

    
    /**
     * Hedight of the game map in cells.
     */
    public get height(): number {
        return this._height;
    }

    
    /**
     * The game the map is part of.
     */
    public get GAME(): Game {
        return this._game;
    }

    
    /**
     * Width of the road in the game map, in units.
     */
    public static get ROAD_WIDTH(): number {
        return GameMap._ROAD_WIDTH;
    }

    /**
     * Builds a facility at the specified coordinates, if possible.
     * @param FacilityClass The class of the facility to build.
     * @param coordinates The location to build the facility at.
     * @returns True if the facility was built, false otherwise.
     */
    public build<T extends {
        new (GAME: Game): Facility; 
        getSprite: (isometric: boolean) => HTMLImageElement; 
        NAME: string
    }>(FacilityClass: T, coordinates: Vector2): boolean {
        const FACILITY: Facility = new FacilityClass(this.GAME);
        const CELL: Cell = this.cells[coordinates.y][coordinates.x];

        if (CELL.canBuild((FACILITY.constructor as typeof Facility).FACILITY_TYPE)) {
            CELL.facility = FACILITY;
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
        const CELL: Cell = this.cells[coordinates.y][coordinates.x];
        if (CELL.canDestroy()) {
            CELL.facility = null;
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
            const CELL_ROW: Cell[] = this.cells[i];
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
            const CELL_ROW: Cell[] = this.cells[i];
            for (let j: number = Math.max(0, MIN_X); j <= (Math.min(MAX_X, this.width - 1)); j++) {
                CELL_ROW[j].drawFacility(canvas, camera);
            }
        }
    }

    /**
     * Updates the game map and all its cells & facilities.
     */
    public tick(): void {
        for (let i: number = 0; i < this.cells.length; i++) {
            const CELL_ROW: Cell[] = this.cells[i];
            for (let j: number = 0; j < CELL_ROW.length; j++) {
                CELL_ROW[j].tick();
            }
        }
    }
}