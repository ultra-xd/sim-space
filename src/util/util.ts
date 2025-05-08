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

export function ease(t: number, min: number, max: number) {
    let a: number = (t - min) / (max - min);

    return (max - min) * (6 * (a ** 5) - 15 * (a ** 4) + 10 * (a ** 3));
}
