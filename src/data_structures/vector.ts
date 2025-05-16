/**
 * ADT for Vector2
 */
export interface IVector2 {
    add(other: Vector2): Vector2;

    subtract(other: Vector2): Vector2;

    multiply(constant: number): Vector2;

    divide(constant: number): Vector2;

    equals(other: Vector2): boolean;

    dot(other: Vector2): number;

    magnitude(): number;
}

/**
 * 2D vector class for handling coordinate systems
 */
export class Vector2 implements IVector2 {

    public static I_UNIT: Vector2 = new Vector2(1, 0);
    public static J_UNIT: Vector2 = new Vector2(0, 1);

    public static ISO_I_UNIT: Vector2 = new Vector2(Math.cos(Math.PI / 6), Math.sin(Math.PI / 6));
    public static ISO_J_UNIT: Vector2 = new Vector2(-Math.cos(Math.PI / 6), Math.sin(Math.PI / 6));

    /**
     * Creates new 2D vector
     * @param _x X component of vector.
     * @param _y H+Y component of vector.
     */
    public constructor(
        private _x: number,
        private _y: number
    ) {}
    
    /** X component of vector */
    public get x(): number {
        return this._x;
    }
    
    /** Y component of vector */
    public get y(): number {
        return this._y;
    }
    
    /** X component of vector */
    public set x(x: number) {
        this._x = x;
    }

    /** Y component of vector */
    public set y(y: number) {
        this._y = y;
    }

    /**
     * Adds two vectors together.
     * @param other The other vector to add.
     * @returns The two vectors added together.
     */
    public add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    /**
     * Subtracts two vectors.
     * @param other The other vector to subtract.
     * @returns The two vectors subtracted.
     */
    public subtract(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    /**
     * Multiplies the vector by a constant.
     * @param constant The constant scalar to multiply the vector by.
     * @returns The product of the scalar and the vector.
     */
    public multiply(constant: number): Vector2 {
        return new Vector2(this.x * constant, this.y * constant);
    }

    /**
     * Divides the vector by a constant, provided the constant is not 0
     * @param constant The constant scalar to divide the vector by.
     * @returns The quotient of the scalar and the vector.
     */
    public divide(constant: number): Vector2 {
        // reject division by 0
        if (constant == 0) {
            throw new Error("divide by 0");
        }
        
        return new Vector2(this.x / constant, this.y / constant);
    }

    /**
     * Checks if a vector is equal to another vector.
     * @param other The other vector.
     * @returns True if the vectors are equal, false otherwise.
     */
    public equals(other: Vector2): boolean {
        return this.x == other.x && this.y == other.y;
    }

    /**
     * Calculates the dot product of the two vectors.
     * @param other The other vector.
     * @returns The dot product of the two vectors.
     */
    public dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    /**
     * Calculates the magnitude of a vector, using Pythagorean Theorem.
     * @returns The magnitude of the vector.
     */
    public magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * Initializes a vector using polar form coordinates.
     * @param r The magnitude of the vector.
     * @param theta The angle of the vector using standard position (measured counterclockwise from the positive X axis), in radians.
     * @returns A vector with X and Y components corresponding to the polar form given.
     */
    public static fromPolarForm(r: number, theta: number) {
        return new Vector2(r * Math.cos(theta), r * Math.sin(theta));
    }

    /**
     * Represents the vector as a string.
     * @returns Vector as a string.
     */
    public toString(): string {
        return `Vector2(${this.x}, ${this.y})`;
    }
}