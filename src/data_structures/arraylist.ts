/**
 * ADT for ArrayList
 */
export interface IArrayList<T> {
    add(arg: T): number;

    delete(index: number): T;

    insert(arg: T, index: number): void;

    get(index: number): T;

    set(arg: T, index: number): void;

    get length(): number;

    toString(): string;

    contains(arg: T): boolean;

    isEmpty(): boolean;

    clear(): void;

    slice(begin: number, end: number): ArrayList<T>;
}

/** ArrayList data structure: can add, delete, find elements in array, etc. Features dynamic resizing. */
export class ArrayList<T> implements IArrayList<T> {
    private n: number = 0; // Store size of arraylist
    private max: number; // Store size of array
    private array: T[]; // store array

    /**
     * Initializes an ArrayList.
     * @param max The current maximum size of the array.
     */
    public constructor(max: number = 1) {
        this.max = max;
        this.array = new Array<T>(this.max);
    }
    
    /**
     * Adds a new element to the end of the arraylist.
     * @param arg Element to be added.
     * @returns Index which the element was added.
     */
    public add(arg: T): number {
        // Resize array to double length when too long
        if (this.n == this.max) {
            this.resize(this.n * 2);
        }

        // Add element & update size
        this.array[this.n] = arg;
        this.n++;
        return this.n - 1;
    }
    
    /**
     * Deletes an element at a specified index.
     * @param index The index at which the element must be deleted.
     * @returns The element that is deleted.
     */
    public delete(index: number): T {
        // return undefined if index is out of bounds
        if (index < 0 || index >= this.n) {
            throw new Error("index out of bounds");
        }

        // Save & delete element
        let e: T = this.array[index];
        delete this.array[index];

        // Shift all elements
        for (let i: number = index + 1; i < this.n; i++) {
            this.array[i - 1] = this.array[i];
        }

        delete this.array[this.n - 1]

        // Update size of array
        this.n--;

        // Resize array to double length if ArrayList is a quarter of array size
        if (this.n <= this.max / 4) {
            this.resize(Math.ceil(this.max / 2));
        }

        return e;
    }

    /**
     * Inserts an element into the ArrayList at any index.
     * @param arg Element to be inserted.
     * @param index Index in array at which the element should be inserted.
     */
    public insert(arg: T, index: number): void {
        // Exit if index is out of bounds
        if (index < 0 || index >= this.n) return;

        // Resize array to double length when too long
        if (this.n == this.max) {
            this.resize(this.max * 2);
        }

        // Shift all elements after inserted element right
        for (let i: number = this.n; i > index; i--) {
            this.array[i] = this.array[i - 1];
        }

        // Insert element & update size
        this.array[index] = arg;
        this.n++;
    }

    /**
     * Gets element at specific index.
     * @param index Index of element to be gotten.
     * @returns Element at hte specified index.
     */
    public get(index: number): T {
        // Return undefined if index is out of bounds
        if (index < 0 || index >= this.n) {
            throw new Error("index out of bounds");
        }

        return this.array[index];
    }
    
    /**
     * Performs linear search to check if an element is in the ArrayList.
     * @param arg Element to be searched for.
     * @returns True if element is in array, false otherwise.
     */
    public contains(arg: T): boolean {
        // linear search through all elements and return true if match found
        for (let i: number = 0; i < this.n; i++) {
            if (arg == this.array[i]) return true;
        }

        return false;
    }

    /**
     * Resizes array by making a deep copy of subarray.
     * @param size New size of array.
     */
    private resize(size: number) {
        // Create new array
        let newArray: T[] = new Array(size);
        this.max = size;

        // Copy all elements into new array
        for (let i: number = 0; i < this.n; i++) {
            newArray[i] = this.array[i];
        }

        this.array = newArray;
    }

    /**
     * The number of elements in the ArrayList.
     */
    public get length(): number {
        return this.n;
    }

    /**
     * Gets ArrayList in string format.
     * @returns ArrayList in string format.
     */
    public toString(): string {
        return this.array.slice(0, this.n).toString();
    }

    /**
     * Sets array element at index to another element.
     * @param arg The new element.
     * @param index Index of element to replace.
     */
    public set(arg: T, index: number): void {
        if (index < 0 || index >= this.n) {
            throw new Error("index out of bounds");
        }

        this.array[index] = arg;
    }

    /**
     * Checks if array is empty.
     * @returns True if array is empty, false otherwise.
     */
    public isEmpty(): boolean {
        return this.n == 0;
    }  

    /**
     * Clears the whole arraylist to empty.
     */
    public clear(): void {
        this.n = 0;
        this.max = 1;
        this.array = new Array<T>(this.max);
    }

    /**
     * Creates a new ArrayList that is a subarray of the array.
     * @param begin The first element in the subarray, inclusive.
     * @param end The last element, exclusive.
     * @returns A new array that is a subarray of the array from begin (inclusive) to end (exclusive).
     */
    public slice(begin: number, end: number): ArrayList<T> {
        // Create new array of size of subarray
        let arr: ArrayList<T> = new ArrayList(end - begin);

        // Deep copy all elements of array into new array
        for (let i: number = begin; i < end; i++) {
            arr.add(this.array[i]);
        }

        return arr;
    }

    /**
     * Creates ArrayList using an array, shallow copying the array
     * @param array Array to be turned into ArrayList.
     */
    public setArray(array: T[]): void {
        this.array = array;
        this.n = this.array.length;
        this.max = this.array.length;
    }

    /**
     * Turns the ArrayList into an array.
     * @returns Array that the ArrayList contained.
     */
    public getArray(): T[] {
        let newArr: T[] = new Array<T>(this.n);

        // Copy all elements of old array into new array
        for (let i: number = 0; i < this.n; i++) {
            newArr[i] = this.array[i];
        }
        
        return newArr;
    }
}

