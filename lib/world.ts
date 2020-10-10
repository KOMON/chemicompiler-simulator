import { Resevoir } from './resevoir';
import { Transferable } from './transferable';
import {
    ResevoirModule,
    RegisterModule, Registers,
    PrintBufferModule,
    MetaOperationsModule,
    InstructionMemoryModule,
    OutputModule, Output
} from './modules';
import {
    MetaOp,
    isPrintMetaOp,
    isRelabelMetaOp
} from './metaop';
import { Memory } from './memory';
import { Instruction } from './instruction';

export enum VMErrors {
    SHUTDOWN = 'The VM is shutdown',
    ERROR = 'The VM is in an error state',
    BAD_INSTRUCTION = 'The given instruction is not a good one',
    MISSING_LOOP_START = 'Loop start is missing during backtracking',
    MISSING_LOOP_END = 'Loop end is missing while jumping',
    BAD_RESEVOIR = 'Resevoir index given does not exist',
    BAD_TEMPERATURE = 'Temperature must be between 0 and 9000 K',
    BAD_REAGENT = 'Given reagent index at given resevoir index does not exist',
    BAD_TARGET = 'Given target index does not exist'
}

export class World {
    private data: Memory<number>;
    private instructions: InstructionMemoryModule;
    private resevoirs: ResevoirModule;
    private outputs: OutputModule;
    private registers: RegisterModule;
    private printBuffer: PrintBufferModule;
    private metaOps: MetaOperationsModule;
    private shutdown: boolean;
    private error: boolean;
    
    constructor(resevoirs: Resevoir[] = [], program?: string) {
        this.data = new Memory<number>(1024, 0);
        this.instructions = new InstructionMemoryModule();
        this.resevoirs = new ResevoirModule(resevoirs);
        this.registers = new RegisterModule();
        this.outputs = new OutputModule();
        this.printBuffer = new PrintBufferModule();        
        this.metaOps = new MetaOperationsModule();
        this.outputs.onPrint((str: string) => this.printBuffer.print(str));

        this.reset();

        if(program) {
            this.instructions.loadProgram(program);
        }
    }

    nextState(): void {
        if (this.shutdown) {
            this.throwError(VMErrors.SHUTDOWN);
        } else if (this.error) {
            this.throwError(VMErrors.ERROR);
        }

        try {
            this.decode(this.instructions.get());
        } catch (err) {
            this.error = true;
            console.log(err);
        }

        if (this.instructions.isFinished()) {
            this.shutdown = true;
        } else {
            this.instructions.incrementPointer();
        }
    }

    reset(): void {
        this.data.reset();
        this.instructions.reset();
        this.registers.reset();
        this.printBuffer.clear();
        this.shutdown = false;
        this.error = false;
    }

    decode(instruction: string): void {
        switch(instruction) {
            case Instruction.INC:
                this.inc(); break;
            case Instruction.DEC:
                this.dec(); break;
            case Instruction.INC_P:
                this.data.incrementPointer(); break;
            case Instruction.DEC_P:
                this.data.decrementPointer(); break;
            case Instruction.TO_SX:
                this.toSx(); break;
            case Instruction.FROM_SX:
                this.fromSx(); break;
            case Instruction.TO_TX:
                this.toTx(); break;
            case Instruction.FROM_TX:
                this.fromTx(); break;
            case Instruction.TO_AX:
                this.toAx(); break;
            case Instruction.FROM_AX:
                this.fromAx(); break;
            case Instruction.LOOP_START:
                this.loopStart(); break;
            case Instruction.LOOP_END:
                this.loopEnd(); break;
            case Instruction.MEASURE:
                this.measure(); break;
            case Instruction.HEAT:
                this.heat(); break;
            case Instruction.TRANSFER:
                this.transfer(); break;
            case Instruction.ISOLATE:
                this.isolate(); break;
            case Instruction.PRINT:
                this.print(); break;
            case Instruction.COMPILE:
                this.compile(); break;
            case Instruction.META:
                this.meta(); break;
            default:
                this.throwError(VMErrors.BAD_INSTRUCTION);
        }
    }

    getShutdown(): boolean {
        return this.shutdown;
    }

    getError(): boolean {
        return this.error;
    }
    
    getPrintBuffer(): string {
        return this.printBuffer.getDisplayBuffer();
    }
    
    getData(): number {
        return this.data.get();
    }

    getCurrentInstruction(): Instruction {
        return this.instructions.get();
    }

    queueMetaOp(metaOp: MetaOp): MetaOp {
        return this.metaOps.queueMetaOp(metaOp);
    }
    
    // +
    inc(): number {
        return this.data.set(this.data.get() + 1);
    }

    // -
    dec(): number {
        if (!this.data.get()) {
            return 0;
        }
        return this.data.set(this.data.get() - 1);
    }

    getRegisters(): Registers {
        return this.registers.getRegisters();
    }

    // }
    toSx(): number {
        return this.registers.setSx(this.data.get());
    }

    // {
    fromSx(): number {
        return this.data.set(this.registers.getSx());
    }

    // )
    toTx(): number {
        return this.registers.setTx(this.data.get());
    }

    // (
    fromTx(): number {
        return this.data.set(this.registers.getTx());
    }

    // '
    toAx(): number {
        return this.registers.setAx(this.data.get());
    }

    // ^
    fromAx(): number {
        return this.data.set(this.registers.getAx());
    }


    // [
    loopStart(): void {
        if (this.data.get()) {
            return;
        }

        try {
            this.instructions.seekLoopEnd();
        } catch (err) {
            this.throwError(VMErrors.MISSING_LOOP_END);
        }
    }

    // ]
    loopEnd(): void {
        if(!this.data.get()) {
            return;
        }

        this.instructions.decrementPointer();
        try {
            this.instructions.seekLoopStart();
        } catch (err) {
            this.throwError(VMErrors.MISSING_LOOP_START);
        }
    }

    // ,
    measure(): number {
        return this.registers.setAx(this.resevoirs.measure(this.registers.getSx()));
    }

    // $
    heat(): number {
        const targetTemp = ((273 - this.registers.getTx()) + this.registers.getAx());
        return this.resevoirs.heat(this.registers.getSx(), targetTemp);
    }

    // @
    transfer(): number {
        return this.resevoirs.transfer(
            this.registers.getSx(),
            this.getTarget(this.registers.getTx()),
            this.registers.getAx()
        );
    }

    // #
    isolate(): number {
        return this.resevoirs.isolate(
            this.data.get(),
            this.registers.getSx(),
            this.getTarget(this.registers.getTx()),
            this.registers.getAx()
        );
    }

    // .
    print(): string {
        return this.printBuffer.printCodePoint(this.data.get());
    }

    // ~
    compile(): void {
        //no-op
    }

    // !
    meta(): void {
        const nestCount = this.instructions.getNestCount();
        const metaOp: MetaOp = this.metaOps.dequeueMetaOp(nestCount);

        this.decodeMetaOp(metaOp);

        if (nestCount) {
            this.metaOps.queueMetaOp(metaOp, nestCount);
        }
    }

    decodeMetaOp(metaOp: MetaOp) {
        if (isPrintMetaOp(metaOp)) {
            this.printBuffer.print(metaOp.arguments.str);
        } else if (isRelabelMetaOp(metaOp)) {
            this.resevoirs.relabel(metaOp.arguments.resevoirIndex, metaOp.arguments.resevoir);
        } else {
            this.throwError(VMErrors.BAD_INSTRUCTION);
        }
    }

    private throwError(error: VMErrors) {
        this.error = true;
        throw new Error(error);
    }
    
    checkTarget(index: number): boolean {
        return this.resevoirs.check(index) || Object.values(Output).includes(index);
    }

    getTarget(index: number): Transferable {
        if (!this.checkTarget(index)) {
            this.throwError(VMErrors.BAD_TARGET);
        }

        if (this.resevoirs.check(index)) {
            return this.resevoirs.get(index);
        } else {
            return this.outputs.get(index);
        }
    }
}
