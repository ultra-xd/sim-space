import { Cell } from "./cell.js";
import { Facility } from "../facility/facility.js";
import { Game } from "../app/game.js";

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
}