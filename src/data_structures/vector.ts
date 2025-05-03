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
    /**
     * creates new vector
     * @param _x x component of vector
     * @param _y y component of vector
     */
    public constructor(
        private _x: number,
        private _y: number
    ) {}

    /**
     * gets x component of vector
     * @returns x component of vector
     */
    public get x(): number {
        return this._x;
    }

    /**
     * gets y component of vector
     * @returns y component of vector
     */
    public get y(): number {
        return this._y;
    }

    /**
     * set x component of vector
     * @param x new x component of vector
     */
    public set x(x: number) {
        this._x = x;
    }

    /**
     * set y component of vector
     * @param y new y component of vector
     */
    public set y(y: number) {
        this._y = y;
    }

    /**
     * add two vectors together
     * @param other vector to add to
     * @returns the two vectors added together
     */
    public add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    /**
     * subtract two vectors
     * @param other vector to subtract
     * @returns the two vectors subtracted
     */
    public subtract(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    /**
     * multiply the vector by a constant
     * @param constant the constant scalar to multiply the vector by
     * @returns the multiplication of the scalar and the vector
     */
    public multiply(constant: number): Vector2 {
        return new Vector2(this.x * constant, this.y * constant);
    }

    /**
     * divide the vector by a constant, provided the constant is not 0
     * @param constant the constant scalar to divide the vector by
     * @returns the division of the scalar and the vector
     */
    public divide(constant: number): Vector2 {
        // reject division by 0
        if (constant == 0) {
            throw new Error("divide by 0");
        }
        
        return new Vector2(this.x / constant, this.y / constant);
    }

    /**
     * check if a vector is equal to another vector
     * @param other the other vector
     * @returns true if the vectors are equal, false otherwise
     */
    public equals(other: Vector2): boolean {
        return this.x == other.x && this.y == other.y;
    }

    /**
     * calculates the dot product of the two vectors
     * @param other the other vector
     * @returns the dot product of the two vectors
     */
    public dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    /**
     * calculates the magnitude of a vector, using pythagorean theorem
     * @returns the magnitude of the vector
     */
    public magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * initializes a vector using polar form coordinates
     * @param r the magnitude of the vector
     * @param theta the angle of the vector using standard position
     * @returns a vector with x and y components corresponding to the polar form given
     */
    public static fromPolarForm(r: number, theta: number) {
        return new Vector2(r * Math.cos(theta), r * Math.sin(theta));
    }

    /**
     * represents the vector as a string
     * @returns vector as a string
     */
    public toString(): string {
        return `Vector2(${this.x}, ${this.y})`;
    }
}