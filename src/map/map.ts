import { Cell } from "./cell.js";
import { Facility } from "../facility/facility.js";
import { Game } from "../app/game.js";
import { Canvas } from "../app/canvas.js";
import { Vector2 } from "../data_structures/vector.js";
import { Camera } from "./camera.js";

export class GameMap {
    private readonly cells: Cell[][];

    public constructor(
        private _game: Game, 
        private _width: number, 
        private _height: number
    ) {
        this.cells = new Array<Array<Cell>>(this.height);
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

    public build(facility: Facility): void {

    }

    public draw(canvas: Canvas, camera: Camera): void {
        const PIXELS_BOTTOM_LEFT: Vector2 = camera.unitsToPixels(
            new Vector2(0, 0)
        );

        const PIXELS_TOP_RIGHT: Vector2 = camera.unitsToPixels(
            new Vector2(this.width, this.height)
        );

        const PIXELS_PER_UNIT: number = camera.pixelsPerUnit;

        // draw vertical lines
        for (let i: number = 0; i <= this.width; i++) {
            const PIXELS_X: number = PIXELS_BOTTOM_LEFT.x + (i * PIXELS_PER_UNIT);
            canvas.drawLine(
                new Vector2(PIXELS_X, PIXELS_BOTTOM_LEFT.y),
                new Vector2(PIXELS_X, PIXELS_TOP_RIGHT.y),
                "white",
                4
            );
        }

        // draw horizontal lines
        for (let i: number = 0; i <= this.height; i++) {
            const PIXELS_Y: number = PIXELS_BOTTOM_LEFT.y - (i * PIXELS_PER_UNIT);
            canvas.drawLine(
                new Vector2(PIXELS_BOTTOM_LEFT.x, PIXELS_Y),
                new Vector2(PIXELS_TOP_RIGHT.x, PIXELS_Y),
                "white",
                4
            );
        }

        // draw large rectangle around map
        canvas.drawRect(
            camera.unitsToPixels(new Vector2(this.width / 2, this.height / 2)),
            this.width * PIXELS_PER_UNIT,
            this.height * PIXELS_PER_UNIT,
            "black",
            8
        );

        for (let i: number = 0; i < this.cells.length; i++) {
            const CELL_ROW: Cell[] = this.cells[i];
            for (let j: number = 0; j < CELL_ROW.length; j++) {
                CELL_ROW[j].draw(canvas, camera);
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