import { Cell } from "./cell.js";
import { Facility } from "../facility/facility.js";
import { Game } from "../app/game.js";
import { Canvas } from "../app/canvas.js";
import { Vector2 } from "../data_structures/vector.js";
import { Camera } from "./camera.js";
import { LuxuryHome } from "../facility/facility_types/residential.js";
import { EmergencyBuilding } from "../facility/facility_types/essential.js";

export class GameMap {
    private readonly cells: Cell[][];
    private static readonly _ROAD_WIDTH: number = 0.3;
    private static readonly _ROAD_DASH_WIDTH: number = 0.005;

    public constructor(
        private _game: Game, 
        private _width: number, 
        private _height: number
    ) {
        this.cells = new Array<Cell[]>(this.height);
        for (let y: number = 0; y < this.height; y++) {
            const CELL_ROW: Cell[] = new Array<Cell>(this.width);
            for (let x: number = 0; x < CELL_ROW.length; x++) {
                CELL_ROW[x] = new Cell(this.game, x, y, null);
            }

            this.cells[y] = CELL_ROW;
        }
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get game(): Game {
        return this._game;
    }

    public static get ROAD_WIDTH(): number {
        return GameMap._ROAD_WIDTH;
    }

    public build<T extends {
        new (GAME: Game): Facility; 
        getSprite: (isometric: boolean) => HTMLImageElement; 
        NAME: string
    }>(FacilityClass: T, coordinates: Vector2): boolean {
        const FACILITY: Facility = new FacilityClass(this.game);
        const CELL: Cell = this.cells[coordinates.y][coordinates.x];

        if (CELL.canBuild((FACILITY.constructor as typeof Facility).FACILITY_TYPE)) {
            CELL.facility = FACILITY;
            return true;
        }

        return false;
    }

    public destroy(coordinates: Vector2): boolean {
        const CELL: Cell = this.cells[coordinates.y][coordinates.x];
        if (CELL.canDestroy()) {
            CELL.facility = null;
            return true;
        }

        return false;
    }

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

        for (let i: number = Math.max(0, MIN_Y); i <= (Math.min(MAX_Y, this.width - 1)); i++) {
            const CELL_ROW: Cell[] = this.cells[i];
            for (let j: number = Math.max(0, MIN_X); j <= (Math.min(MAX_X, this.height - 1)); j++) {
                CELL_ROW[j].drawGround(canvas, camera);
            }
        }

        for (let i: number = Math.max(0, MIN_Y); i <= (Math.min(MAX_Y, this.width - 1)); i++) {
            const CELL_ROW: Cell[] = this.cells[i];
            for (let j: number = Math.max(0, MIN_X); j <= (Math.min(MAX_X, this.height - 1)); j++) {
                CELL_ROW[j].drawFacility(canvas, camera);
            }
        }
    }

    public tick(): void {
        for (let i: number = 0; i < this.cells.length; i++) {
            const CELL_ROW: Cell[] = this.cells[i];
            for (let j: number = 0; j < CELL_ROW.length; j++) {
                CELL_ROW[j].tick();
            }
        }
    }
}