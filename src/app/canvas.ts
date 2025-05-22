import { Vector2 } from "../data_structures/vector.js";
import { assert } from "../util/util.js";

type ImageMap = Map<string, HTMLImageElement>;

/** Class to store canvas and handle its methods */
export class Canvas {
    private readonly CANVAS_ELEMENT: HTMLCanvasElement;
    private CANVAS_CTX: CanvasRenderingContext2D;

    /**
     * Initializes a new canvas.
     * @param canvasId The ID of the HTML element of the canvas.
     */
    public constructor(canvasId: string) {
        // Get HTML element of canvas
        this.CANVAS_ELEMENT = document.getElementById(canvasId) as HTMLCanvasElement;

        // Get rendering context of canvas
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
        // Draw line
        this.CANVAS_CTX.beginPath();
        this.CANVAS_CTX.moveTo(start.x, start.y);
        this.CANVAS_CTX.lineTo(end.x, end.y);

        // Adjust line colour and width
        this.CANVAS_CTX.strokeStyle = colour;
        this.CANVAS_CTX.lineWidth = width;

        // Display on canvas
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
        // Cannot draw lines if there are less than two points
        assert (points.length >= 2, "Too little points");

        // Start at first point
        this.CANVAS_CTX.beginPath();
        this.CANVAS_CTX.moveTo(points[0].x, points[0].y);

        // Draw lines to next points
        for (let i: number = 1; i < points.length; i++) {
            this.CANVAS_CTX.lineTo(points[i].x, points[i].y);
        }

        // Set line colour & width
        this.CANVAS_CTX.strokeStyle = colour;
        this.CANVAS_CTX.lineWidth = width;

        // Display on canvas
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
        // Polygons with less than 3 vertices don't exist: check
        assert (points.length >= 3, "too little points");

        // Move to first vertex
        this.CANVAS_CTX.beginPath();
        this.CANVAS_CTX.moveTo(points[0].x, points[0].y);

        // Draw line
        for (let i: number = 1; i < points.length; i++) {
            this.CANVAS_CTX.lineTo(points[i].x, points[i].y);
        }

        // Close the polygon (return to first point)
        this.CANVAS_CTX.closePath();

        // Adjust colour
        this.CANVAS_CTX.fillStyle = colour;

        // Fill polygon
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
        // Draw image at specified coordinates and size
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
        // Adjust border width and colour
        this.CANVAS_CTX.strokeStyle = colour;
        this.CANVAS_CTX.lineWidth = lineWidth;
        
        // Draw rectangle at specified size and coordinates
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
        // Adjust colour
        this.CANVAS_CTX.fillStyle = colour;

        // Fill in rectangle at specified coordinates and size
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
        // Stores the sources of the images and their respective HTML image element
        private static IMAGES: ImageMap = new Map<string, HTMLImageElement>();

        /**
         * Gets an image based off of its source.
         * @param src The source of the image.
         * @returns The HTMLImageElement corresponding to the source.
         */
        public static getImage(src: string): HTMLImageElement {
            // Load the image first, if not already loaded
            this.loadImage(src);

            // Get and return image
            const IMAGE: HTMLImageElement | undefined = Canvas.ImageLoader.IMAGES.get(src);
            assert (IMAGE != null, "Image doesn't exist");
            return IMAGE;
        }

        /**
         * Loads an image and saves it.
         * @param src The source of the image
         */
        public static loadImage(src: string): void {
            // Don't load a new image if it already exists
            if (Canvas.ImageLoader.IMAGES.get(src)) {
                return;
            }

            // Create and store the image
            const IMAGE: HTMLImageElement = new Image();
            IMAGE.src = src;
            Canvas.ImageLoader.IMAGES.set(src, IMAGE);
        }

        /**
         * Loads multiple images and saves them.
         * @param srcs An array containing all the sources of the image.
         */
        public static loadImages(srcs: string[]): void {
            // Load all images in array
            for (let i: number = 0; i < srcs.length; i++) {
                Canvas.ImageLoader.loadImage(srcs[i]);
            }
        }
    }
}