/**
 * ADT for arraylist
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

/**
 * arraylist data structure: can add, delete, find elements in array, etc, dynamic resizing
 */
export class ArrayList<T> implements IArrayList<T> {
    private n: number = 0; // store size of arraylist
    private max: number; // store size of array
    private array: T[]; // store array

    /**
     * initializes an arraylist
     * @param max the current maximum size of the array
     */
    public constructor(max: number = 1) {
        this.max = max;
        this.array = new Array<T>(this.max);
    }
    
    /**
     * adds a new element to the end of the arraylist
     * @param arg element to be added
     * @returns index which the element was added
     */
    public add(arg: T): number {
        // resize array to double length when too long
        if (this.n == this.max) {
            this.resize(this.max * 2);
        }

        // add element & update size
        this.array[this.n] = arg;
        this.n++;
        return this.n - 1;
    }

    /**
     * deletes an element at a specified index
     * @param index the index at which the element must be deleted
     * @returns the element that is deleted
     */
    public delete(index: number): T {
        // return undefined if index is out of bounds
        if (index < 0 || index >= this.n) {
            throw new Error("index out of bounds");
        }

        // save & delete element
        let e: T = this.array[index];
        delete this.array[index];

        // shift all elements
        for (let i: number = index + 1; i < this.n; i++) {
            this.array[i - 1] = this.array[i];
        }

        delete this.array[this.n - 1]

        // update size of array
        this.n--;

        // resize array to double length if arraylist is a quarter of array size
        if (this.n <= this.max / 4) {
            this.resize(Math.ceil(this.n * 2));
        }

        return e;
    }

    /**
     * inserts an element at any index
     * @param arg element to be inserted
     * @param index index in array at which the element should be inserted
     */
    public insert(arg: T, index: number): void {
        // return undefined if index is out of bounds
        if (index < 0 || index >= this.n) return;

        // resize array to double length when too long
        if (this.n == this.max) {
            this.resize(this.max * 2);
        }

        // shift all elements after inserted element right
        for (let i: number = this.n; i > index; i--) {
            this.array[i] = this.array[i - 1];
        }

        // insert element & update size
        this.array[index] = arg;
        this.n++;
    }

    /**
     * gets element at specific index
     * @param index index for element to be gotten
     * @returns element at index
     */
    public get(index: number): T {
        // return undefined if index is out of bounds
        if (index < 0 || index >= this.n) {
            throw new Error("index out of bounds");
        }

        return this.array[index];
    }
    
    /**
     * performs linear search to check if an element is in the arraylist
     * @param arg element to be searched
     * @returns true if element is in array, false otherwise
     */
    public contains(arg: T): boolean {
        // linear search through all elements and return true if match found
        for (let i: number = 0; i < this.n; i++) {
            if (arg == this.array[i]) return true;
        }

        return false;
    }

    /**
     * resizes array by making a deep copy of subarray
     * @param size new size of array
     */
    private resize(size: number) {
        // create new array
        let newArray: T[] = new Array(size);
        this.max = size;

        // copy all elements into new array
        for (let i: number = 0; i < this.n; i++) {
            newArray[i] = this.array[i];
        }

        this.array = newArray;
    }

    /**
     * gets the number of elements in arraylist
     * @returns the number of elements in arraylist
     */
    public get length(): number {
        return this.n;
    }

    /**
     * gets array in string format
     * @returns array in string format
     */
    public toString(): string {
        return this.array.slice(0, this.n).toString();
    }

    /**
     * sets array element at index to another element
     * @param arg new element
     * @param index index to replace
     */
    public set(arg: T, index: number): void {
        if (index < 0 || index >= this.n) {
            throw new Error("index out of bounds");
        }

        this.array[index] = arg;
    }

    /**
     * checks if array is empty
     * @returns true if array is empty, false otherwise
     */
    public isEmpty(): boolean {
        return this.n == 0;
    }  

    /**
     * clears the whole arraylist to empty
     */
    public clear(): void {
        this.n = 0;
        this.max = 1;
        this.array = new Array<T>(this.max);
    }

    /**
     * creates a new array that is a subarray of the array
     * @param begin the first element to be included in subarray, inclusive
     * @param end the last element, exclusive
     * @returns new array that is a subarray of the array from begin (inclusive) to end (exclusive)
     */
    public slice(begin: number, end: number): ArrayList<T> {
        // create new array of size of subarray
        let arr: ArrayList<T> = new ArrayList(end - begin);

        // deep copy all elements of array into new array
        for (let i: number = begin; i < end; i++) {
            arr.add(this.array[i]);
        }

        return arr;
    }

    /**
     * creates arraylist using an array, shallow copying the array
     * @param array array to be turned into arraylist
     */
    public setArray(array: T[]): void {
        this.array = array;
        this.n = this.array.length;
        this.max = this.array.length;
    }

    /**
     * turns arraylist to array
     * @returns array that the arraylist contained
     */
    public getArray(): T[] {
        let newArr: T[] = new Array<T>(this.n);

        // copy all elements of old array into new array
        for (let i: number = 0; i < this.n; i++) {
            newArr[i] = this.array[i];
        }
        
        return newArr;
    }
}

