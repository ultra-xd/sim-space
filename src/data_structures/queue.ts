/** ADT for Queue. */
export interface IQueue<T> {
    enqueue(arg: T): void;

    dequeue(): T | null;

    peek(): T | null;

    contains(arg: T): boolean;

    get length(): number;

    isEmpty(): boolean;

    clear(): void;

    toString(): string;
}

/** Queue data structure: can add to ending, remove from beginning. Uses circular arrays */
export class Queue<T> implements IQueue<T> {
    private array: T[];
    private n: number = 0;
    private start: number = 0;
    private max: number = 1;

    /** Initializes a queue. */
    public constructor() {
        this.array = new Array(this.max);
    }

    /** 
     * Adds an element to the end of the queue.
     * @param arg Element to be added.
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
     * Gets the first element of queue.
     * @returns The first element of queue.
     */
    public peek(): T | null {
        if (this.n == 0) return null;
        let first: number = (this.start + this.n) % this.max;
        return this.array[first];
    }

    /**
     * Gets any element of the queue.
     * @param index The index of the element of the queue.
     * @returns The element of the queue corresponding to the index.
     */
    public get(index: number): T {
        return this.array[(this.start + index) % this.max];
    }

    public set(arg: T, index: number): void {
        this.array[(this.start + index) % this.max] = arg;
    }

    /**
     * Resizes the array by making a deep copy of subarray.
     * @param size The new size of array.
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
     * Performs a linear search to check if an element is in the Queue.
     * @param arg Element to be searched.
     * @returns True if element is in array, false otherwise.
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
     * Gets the number of elements in the Queue.
     * @returns The number of elements in Queue.
     */
    public get length(): number {
        return this.n;
    }

    /**
     * Gets the Queue in string format.
     * @returns The Queue in string format.
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
     * Checks if the Queue is empty.
     * @returns True if queue is empty, false otherwise.
     */
    public isEmpty(): boolean {
        return this.n == 0;
    }

    /** Clears the whole queue. */
    public clear(): void {
        this.n = 0;
        this.start = 0;
        this.max = 1;
        this.array = new Array(this.max);
    }
}