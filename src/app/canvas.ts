import { Vector2 } from "../data_structures/vector.js";
import { assert } from "../util/util.js";

/** Class to store canvas and handle its methods */
export class Canvas {
    private readonly CANVAS_ELEMENT: HTMLCanvasElement;
    private CANVAS_CTX: CanvasRenderingContext2D;

    /**
     * Initializes a new canvas.
     * @param canvasId The ID of the HTML element of the canvas.
     */
    public constructor(canvasId: string) {
        this.CANVAS_ELEMENT = document.getElementById(canvasId) as HTMLCanvasElement;
        this.CANVAS_CTX = this.CANVAS_ELEMENT.getContext("2d") as CanvasRenderingContext2D;
    }

    /** Updates canvas and canvas context. */
    public tick(): void {
        // Change context so that lines drawn are not blurry
        const DPR = window.devicePixelRatio;
        const RECT = this.CANVAS_ELEMENT.getBoundingClientRect();

        // Scale canvas and descale to get rid of blurry lines
        this.CANVAS_ELEMENT.width = RECT.width * DPR;
        this.CANVAS_ELEMENT.height = RECT.height * DPR;

        this.CANVAS_CTX.scale(DPR, DPR);

        this.CANVAS_ELEMENT.style.width = `100%`;
        this.CANVAS_ELEMENT.style.height = `100%`;
    }

    /**
     * Draws a line on the canvas.
     * @param start The start of the line (i.e one of its endpoints), in cartesian coordinates.
     * @param end  The end of the line.
     * @param colour The colour of the line.
     * @param width The width of the line, in pixels.
     */
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

    /**
     * Draws a sequence of lines given a set of points. Draws a line in between each consecutive point.
     * @param points An array of all points, in cartesian coordinates.
     * @param colour The colour of all lines.
     * @param width The width of all lines, in pixels.
     */
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

    /**
     * Fills the shape of a polygon, given a set of vertices of the polygon. Each consecutive set of points represents one line.
     * @param points An array of all points, in cartesian coordinates.
     * @param colour The colour of the polygon filled.
     */
    public fillPolygon(
        points: Vector2[],
        colour: string,
    ): void {
        assert (points.length >= 3, "too little points");
        this.CANVAS_CTX.beginPath();
        this.CANVAS_CTX.moveTo(points[0].x, points[0].y);

        for (let i: number = 1; i < points.length; i++) {
            this.CANVAS_CTX.lineTo(points[i].x, points[i].y);
        }

        this.CANVAS_CTX.closePath();
        this.CANVAS_CTX.fillStyle = colour;

        this.CANVAS_CTX.fill();
    }

    /**
     * Draws an image on the canvas.
     * @param image The image to draw.
     * @param center The coordinates of where to draw the image: the image's center will be drawn at these coordinates.
     * @param width The width of the image, in pixels.
     * @param height The height of the image, in pixels.
     */
    public drawImage(
        image: HTMLImageElement,
        center: Vector2,
        width: number,
        height: number,
    ): void {
        this.CANVAS_CTX.drawImage(
            image,
            center.x - width / 2,
            center.y - height / 2,
            width,
            height
        );
    }

    /**
     * Draws the border of a rectangle on the canvas.
     * @param center The coordinates of where to draw the rectangle: the rectangle's center will be drawn at these coordinates.
     * @param width The width of the rectangle, in pixels.
     * @param height The height of the rectangle, in pixels.
     * @param colour The colour of the border of the rectangle.
     * @param lineWidth The width of the border of the rectangle, in pixels.
     */
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

    /**
     * Fills in the area of a rectangle on the canvas.
     * @param center The coordinates of where to draw the rectangle: the rectangle's center will be drawn at these coordinates.
     * @param width The width of the rectangle, in pixels.
     * @param height The height of the rectangle, in pixels.
     * @param colour The colour of the filled-in rectangle.
     */
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

    /** The width of the canvas, in pixels. */
    public get width(): number {
        return this.CANVAS_ELEMENT.width;
    }

    /** The height of the canvas, in pixels */
    public get height(): number {
        return this.CANVAS_ELEMENT.height;
    }

    /** The HTML element of the canvas. */
    public get HTMLElement(): HTMLCanvasElement {
        return this.CANVAS_ELEMENT;
    }

    /** Class to manage all images drawn on canvas. */
    public static readonly ImageLoader = class {
        private static IMAGES: {[src: string]: HTMLImageElement} = {};

        /**
         * Gets an image based off of its source.
         * @param src The source of the image.
         * @returns The HTMLImageElement corresponding to the source.
         */
        public static getImage(src: string): HTMLImageElement {
            this.loadImage(src);
            
            return Canvas.ImageLoader.IMAGES[src];
        }

        /**
         * Loads an image and saves it.
         * @param src The source of the image
         */
        public static loadImage(src: string): void {
            if (Canvas.ImageLoader.IMAGES[src]) {
                return;
            }

            const IMAGE: HTMLImageElement = new Image();
            IMAGE.src = src;
            Canvas.ImageLoader.IMAGES[src] = IMAGE;
        }

        /**
         * Loads multiple images and saves them.
         * @param srcs An array containing all the sources of the image.
         */
        public static loadImages(srcs: string[]): void {
            for (let i: number = 0; i < srcs.length; i++) {
                Canvas.ImageLoader.loadImage(srcs[i]);
            }
        }
    }
}