export class Memory<T> {
    private memory: T[];
    private pointer: number;
    
    constructor(private size: number = 0, private defaultValue: T = null) {
        this.reset();
    }

    reset(): void {
        this.memory = Array(this.size).fill(this.defaultValue);
        this.pointer = 0;
    }
    
    getLength(): number {
        return this.memory.length;
    }

    isFinished(): boolean {
        return this.pointer === this.memory.length - 1;
    }

    isAtStart(): boolean {
        return this.pointer === 0;
    }
    
    setMemory(arr: T[]) {
        this.memory = arr;
    }
    
    incrementPointer(): number {
        return ++this.pointer;
    }

    decrementPointer(): number {
        return --this.pointer;
    }

    get(): T {
        return this.memory[this.pointer];
    }

    set(value: T): T {
        return this.memory[this.pointer] = value;
    }
}
