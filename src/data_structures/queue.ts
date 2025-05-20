/**
 * ADT for queue
 */
export interface IQueue<T> {
    enqueue(arg: T): void;

    dequeue(): T | null;

    peek(): T | null;

    contains(arg: T): boolean;

    size(): number;

    isEmpty(): boolean;

    clear(): void;

    toString(): string;
}

/**
 * queue data structure: can add to ending, remove from beginning. uses circular arrays
 */
export class Queue<T> implements IQueue<T> {
    private array: T[];
    private n: number = 0;
    private start: number = 0;
    private max: number = 1;

    /**
     * initializes queue
     * @timecomplexity: O(1), since max of queue is initially always 1
     */
    public constructor() {
        this.array = new Array(this.max);
    }

    /**
     * adds an element to the end of the queue
     * @param arg element to be added
     * @timecomplexity O(1) amortized: adding is O(1), however dynamic resizing is O(n). this resize is spread across all enqueue events, leading to overall O(1 + a).
     */
    public enqueue(arg: T): void {
        // resize array by doubling if too long
        if (this.n == this.max) {
            this.resize(this.max * 2);
        }

        // add item to end of queue & update size
        let last: number = (this.start + this.n) % this.max;
        this.array[last] = arg;
        this.n++;
    }
    
    /**
     * removes first element of queue
     * @returns first element of queue
     * @timecomplexity O(1) amortized: removing is O(1) thanks to circular arrays, however dynamic resizing is O(n). this resize is spread across all dequeue events, leading to overall O(1 + a).
     */
    public dequeue(): T | null {
        if (this.n == 0) return null;

        // delete first item of queue
        let e: T = this.array[this.start];
        delete this.array[this.start];

        // update size of queue & start position
        this.start = (this.start + 1) % this.max;
        this.n--;

        // resize array by half if size of queue is a quarter of the array
        if (this.n <= this.max / 4) {
            this.resize(Math.ceil(Math.max(this.n * 2, 1)));
        }

        return e;
    }

    /**
     * gets the first element of queue
     * @returns first element of queue
     * @timecomplexity: O(1)
     */
    public peek(): T | null {
        if (this.n == 0) return null;
        let first: number = (this.start + this.n) % this.max;
        return this.array[first];
    }

    public get(index: number): T {
        return this.array[(this.start + index) % this.max];
    }

    public set(arg: T, index: number): void {
        this.array[(this.start + index) % this.max] = arg;
    }

    /**
     * resizes array by making a deep copy of subarray
     * @param size new size of array
     * @timecomplexity O(n): each element of array must be individually copied into another array
     */
    private resize(size: number) {
        // create a new array half original size
        let newArray: T[] = new Array(size);

        // copy all items of array into new array
        // the start of circular array is reset to 0
        for (let i: number = 0; i < this.n; i++) {
            let index: number = (this.start + i) % this.max;
            newArray[i] = this.array[index];
        }

        this.max = size;
        this.start = 0;
        this.array = newArray;
    }

    /**
     * performs linear search to check if an element is in the queue
     * @param arg element to be searched
     * @returns true if element is in array, false otherwise
     * @timecomplexity O(n): linear search searches through all elements until it finds a match, meaning it may have to search the whole queue
     */
    public contains(arg: T): boolean {
        // linear search through array and return true if a match is found
        for (let i: number = 0; i < this.n; i++) {
            let index: number = (this.start + i) % this.max;
            if (this.array[index] == arg) {
                return true;
            }
        }

        return false;
    }

    /**
     * gets the number of elements in queue
     * @returns the number of elements in queue
     * @timecomplexity O(1)
     */
    public size(): number {
        return this.n;
    }

    /**
     * gets queue in string format
     * @returns queue in string format
     * @timecomplexity O(n): each element must be individually added to a string
     */
    public toString(): string {
        // iterate through all elements & add to a string
        let str: string = "[";
        for (let i: number = 0; i < this.n; i++) {
            let index: number = (this.start + i) % this.max;
            str += `${this.array[index]}` + ((i == this.n - 1) ? "": ",");
        }
        
        return str + "]";
    }

    /**
     * checks if queue is empty
     * @returns true if queue is empty, false otherwise
     * @timecomplexity O(1)
     */
    public isEmpty(): boolean {
        return this.n == 0;
    }

    /**
     * clears the whole queue
     * @timecomplexity O(1): a whole new array is created instead of deleting each individual element
     */
    public clear(): void {
        this.n = 0;
        this.start = 0;
        this.max = 1;
        this.array = new Array(this.max);
    }
}