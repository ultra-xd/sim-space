export function assert(condition: boolean, message: string = "assertion error"): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

export function randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

export function radiansToDegrees(radians: number): number {
    return radians * 180 / Math.PI;
}
