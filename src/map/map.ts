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
        // draw vertical lines
        for (let i: number = 0; i <= this.width; i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(i, 0)),
                camera.unitsToPixels(new Vector2(i, this.height)),
                "rgb(54, 54, 54)",
                0.05 * camera.pixelsPerUnit
            );
        }

        // draw horizontal lines
        for (let i: number = 0; i <= this.height; i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(0, i)),
                camera.unitsToPixels(new Vector2(this.width, i)),
                "rgb(54, 54, 54)",
                0.05 * camera.pixelsPerUnit
            );
        }

                // draw vertical lines
        for (let i: number = 0; i <= this.width; i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(i, 0)),
                camera.unitsToPixels(new Vector2(i, this.height)),
                "rgb(54, 54, 54)",
                0.1 * camera.pixelsPerUnit
            );
        }

        // draw horizontal lines
        for (let i: number = 0; i <= this.height; i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(0, i)),
                camera.unitsToPixels(new Vector2(this.width, i)),
                "rgb(54, 54, 54)",
                0.1 * camera.pixelsPerUnit
            );
        }

        // draw vertical lines
        for (let i: number = 0; i <= this.width; i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(i, 0)),
                camera.unitsToPixels(new Vector2(i, this.height)),
                "rgb(208, 255, 0)",
                0.005 * camera.pixelsPerUnit
            );
        }

        // draw horizontal lines
        for (let i: number = 0; i <= this.height; i++) {
            canvas.drawLine(
                camera.unitsToPixels(new Vector2(0, i)),
                camera.unitsToPixels(new Vector2(this.width, i)),
                "rgb(208, 255, 0)",
                0.005 * camera.pixelsPerUnit
            );
        }

        // draw large rectangle around map

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