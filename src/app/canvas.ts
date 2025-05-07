import { Vector2 } from "../data_structures/vector.js";
import { assert } from "../util/util.js";

export class Canvas {
    private readonly CANVAS_ELEMENT: HTMLCanvasElement;
    private CANVAS_CTX: CanvasRenderingContext2D;

    public constructor(canvasId: string) {
        this.CANVAS_ELEMENT = document.getElementById(canvasId) as HTMLCanvasElement;
        this.CANVAS_CTX = this.CANVAS_ELEMENT.getContext("2d") as CanvasRenderingContext2D;
    }

    public tick(): void {
        this.update();
    }

    public drawLine(
        start: Vector2, 
        end: Vector2,
        colour: string,
        width: number
    ): void {
        this.CANVAS_CTX.beginPath();
        this.CANVAS_CTX.moveTo(start.x, start.y);
        this.CANVAS_CTX.lineTo(end.x, end.y);

        this.CANVAS_CTX.strokeStyle = colour;
        this.CANVAS_CTX.lineWidth = width;

        this.CANVAS_CTX.stroke();
    }

    public drawLineSequence(
        points: Vector2[],
        colour: string,
        width: number
    ): void {
        assert (points.length >= 2, "too little points");

        this.CANVAS_CTX.beginPath();
        this.CANVAS_CTX.moveTo(points[0].x, points[0].y);

        for (let i: number = 1; i < points.length; i++) {
            this.CANVAS_CTX.lineTo(points[i].x, points[i].y);
        }

        this.CANVAS_CTX.strokeStyle = colour;
        this.CANVAS_CTX.lineWidth = width;

        this.CANVAS_CTX.stroke();
    }

    public drawImage(
        image: HTMLImageElement,
        center: Vector2,
        width: number,
        height: number,
    ): void {
        this.CANVAS_CTX.drawImage(
            image,
            center.x + width / 2,
            center.y + height / 2,
            width,
            height
        );
    }

    public drawRect(
        center: Vector2, 
        width: number,
        height: number,
        colour: string,
        lineWidth: number
    ): void {
        this.CANVAS_CTX.strokeStyle = colour;
        this.CANVAS_CTX.lineWidth = lineWidth;
        
        this.CANVAS_CTX.strokeRect(
            center.x - width / 2,
            center.y - height / 2,
            width,
            height
        )
    }

    public fillRect(
        center: Vector2,
        width: number,
        height: number,
        colour: string
    ): void {
        this.CANVAS_CTX.fillStyle = colour;

        this.CANVAS_CTX.fillRect(
            center.x - width / 2,
            center.y - height / 2,
            width,
            height
        );
    }

    private update(): void {
        // chnage context so that lines drawn are not blurry
        const dpr = window.devicePixelRatio;
        const rect = this.CANVAS_ELEMENT.getBoundingClientRect();

        // scale canvas and descale to get rid of blurry lines
        this.CANVAS_ELEMENT.width = rect.width * dpr;
        this.CANVAS_ELEMENT.height = rect.height * dpr;

        this.CANVAS_CTX.scale(dpr, dpr);

        this.CANVAS_ELEMENT.style.width = `100%`;
        this.CANVAS_ELEMENT.style.height = `100%`;
    }

    public get width(): number {
        return this.CANVAS_ELEMENT.width;
    }

    public get height(): number {
        return this.CANVAS_ELEMENT.height;
    }
}