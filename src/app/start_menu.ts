import { Vector2 } from "../data_structures/vector.js";
import { Canvas } from "./canvas.js";
import { App, AppState } from "./app.js";

/** Manages the start screen of the app. */
export class StartMenu {

    private static readonly START_MENU_DIV: HTMLDivElement = document.getElementById("start-menu") as HTMLDivElement;
    private static readonly TITLE_BACKGROUND: HTMLImageElement = Canvas.ImageLoader.getImage("res/assets/title/title_background.jpg");
    private static readonly TITLE_TEXT: HTMLImageElement = Canvas.ImageLoader.getImage("res/assets/title/title_text.png");
    private static readonly TITLE_PIDGEON: HTMLImageElement = Canvas.ImageLoader.getImage("res/assets/title/pidjeon.png");
    private static readonly START_BUTTON: HTMLButtonElement = document.getElementById("start-game") as HTMLButtonElement;

    /** Sets up all the event listeners on the start menu. */
    public static setup(): void {
        StartMenu.START_BUTTON.addEventListener("click", () => {
            App.createNewGame();
            App.changeAppState(AppState.IN_GAME);
        });
    }

    /**
     * Draws all componenets of the start screen that are on the canvas.
     * @param canvas The canvas to draw on.
     */
    public static draw(canvas: Canvas): void {
        const BACKGROUND_DIMENSION_RATIO: number = StartMenu.TITLE_BACKGROUND.width / StartMenu.TITLE_BACKGROUND.height;
        const TITLE_TEXT_DIMENSION_RATIO: number = StartMenu.TITLE_TEXT.width / StartMenu.TITLE_TEXT.height;
        const WINDOW_DIMENSION_RATIO: number = canvas.width / canvas.height;
        
        let backgroundWidth: number;
        let backgroundHeight: number;

        if (BACKGROUND_DIMENSION_RATIO > WINDOW_DIMENSION_RATIO) {
            backgroundWidth = canvas.height * BACKGROUND_DIMENSION_RATIO;
            backgroundHeight = canvas.height;
        } else {
            backgroundWidth = canvas.width;
            backgroundHeight = canvas.width / BACKGROUND_DIMENSION_RATIO;
        }

        canvas.drawImage(
            StartMenu.TITLE_BACKGROUND,
            new Vector2(canvas.width / 2, canvas.height / 2),
            backgroundWidth,
            backgroundHeight
        );

        canvas.fillRect(
            new Vector2(canvas.width / 2, canvas.height / 2),
            canvas.width,
            canvas.height,
            "rgba(0, 0, 0, 0.3)"
        );
        
        canvas.drawImage(
            StartMenu.TITLE_TEXT,
            new Vector2(canvas.width / 2, canvas.height / 3),
            canvas.width * 0.3,
            canvas.width * 0.3 / TITLE_TEXT_DIMENSION_RATIO
        );

        canvas.drawImage(
            StartMenu.TITLE_PIDGEON,
            new Vector2(
                canvas.width - StartMenu.TITLE_PIDGEON.width / 12,
                canvas.height - StartMenu.TITLE_PIDGEON.height / 12
            ),
            StartMenu.TITLE_PIDGEON.width / 6,
            StartMenu.TITLE_PIDGEON.height / 6
        );
    }

    /** Hides all HTML elements of the start menu. */
    public static hide(): void {
        this.START_MENU_DIV.hidden = true;
    }

    /** Shows all HTML elements of the start menu. */
    public static show(): void {
        this.START_MENU_DIV.hidden = false;
    }
}
