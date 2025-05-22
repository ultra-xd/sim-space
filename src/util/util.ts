/**
 * Asserts that a condition is true.
 * @param condition The condition to assert.
 * @param message The assertion error message.
 */
export function assert(condition: boolean, message: string = "assertion error"): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

/**
 * Returns a random integer.
 * @param min The minimum, inclusive.
 * @param max The maximum, inclusive.
 * @returns A random integer between the min and max
 */
export function randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Converts angle measured in degrees to radians.
 * @param degrees The angle, in degrees.
 * @returns The angle, in radians.
 */
export function degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

/**
 * Converts angled measured in radians to degrees
 * @param radians The angle, in radians.
 * @returns The angle, in degrees.
 */
export function radiansToDegrees(radians: number): number {
    return radians * 180 / Math.PI;
}

/**
 * Eases calculations involing linear interpolation, allowing for smoother transitions.
 * @param t Value to ease.
 * @param min The minimum to ease.
 * @param max The maximum to ease.
 * @returns The eased values.
 */
export function ease(t: number, min: number, max: number) {
    let a: number = (t - min) / (max - min);
    return (max - min) * (6 * (a ** 5) - 15 * (a ** 4) + 10 * (a ** 3));
}
