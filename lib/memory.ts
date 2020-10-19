export class Memory<T> {

    private memory: T[];
    private pointer: number;
    
    constructor(private length: number = 0, private defaultValue: T = null) {
        if (this.length < 0) {
            this.length = 0;
        }
        
        this.reset();
    }
    
    reset(): void {
        this.setMemory(Array(this.length).fill(this.defaultValue));
        this.rewind();
    }

    rewind(): void {
        this.pointer = 0;
    }
    
    getLength(): number {
        return this.length
    }

    isAtEnd(): boolean {
        return this.pointer === this.length - 1
    }

    isAtStart(): boolean {
        return this.pointer === 0;
    }
    
    setMemory(arr: T[]) {
        this.length = arr.length;
        this.memory = arr;
    }
    
    incrementPointer(): number {
        if (this.isAtEnd()) {
            return this.pointer;
        }
        
        return ++this.pointer;
    }

    decrementPointer(): number {
        if (this.isAtStart()) {
            return this.pointer;
        }
        
        return --this.pointer;
    }
    
    get(): T {
        return this.memory[this.pointer];
    }

    set(value: T): T {
        return this.memory[this.pointer] = value;
    }

    getPointer(): number {
        return this.pointer;
    }
}
