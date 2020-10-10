import { Memory } from '../memory';
import { Instruction } from '../instruction';

export class InstructionMemoryModule {
    private memory: Memory<Instruction>;
    private nestCount: number;
    
    constructor(program: Instruction[] = []) {
        this.memory = new Memory<Instruction>(program.length);
        this.memory.setMemory(program);
        this.nestCount = 0;
    }

    reset(): void {
        this.nestCount = 0;
        this.memory.reset();
    }
    
    loadProgram(program: string) {
        this.reset();
        this.memory.setMemory(program.split('') as Instruction[]);
    }

    get(): Instruction {
        return this.memory.get();
    }

    set(instruction: Instruction): Instruction {
        return this.memory.set(instruction);
    }

    getLength(): number {
        return this.memory.getLength();
    }

    isFinished(): boolean {
        return this.memory.isFinished();
    }

    isAtStart(): boolean {
        return this.memory.isAtStart();
    }

    incrementPointer(): number {
        if (this.get() === Instruction.LOOP_START) {
            this.nestCount++;
        }

        const pointer = this.memory.incrementPointer();

        if (this.get() === Instruction.LOOP_END && this.nestCount > 0) {
            this.nestCount--;
        }

        return pointer;
    }

    decrementPointer(): number {
        if (this.get() === Instruction.LOOP_END) {
            this.nestCount++;
        } else if (this.get() === Instruction.LOOP_START && this.nestCount > 0) {
            this.nestCount--;
        }

        return this.memory.decrementPointer();
    }

    getNestCount(): number {
        return this.nestCount;
    }
    
    seekLoopEnd(): void {
        const startingNestCount = this.getNestCount();
        while(this.get() !== Instruction.LOOP_END || this.getNestCount() !== startingNestCount) {
            if (this.isFinished()) {
                throw new Error('No Loop End');
            }

            this.incrementPointer();
        }
    }

    seekLoopStart(): void {
        const startingNestCount = this.nestCount;
        while(this.get() !== Instruction.LOOP_START || this.getNestCount() !== startingNestCount) {
            if (this.isAtStart()) {
                throw new Error('No loop start');
            }

            this.decrementPointer();
        }
    }
}
