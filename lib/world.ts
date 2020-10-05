export enum Instructions {
    INC = '+',
    DEC = '-',
    INC_P = '>',
    DEC_P = '<',
    TO_SX = '}',
    FROM_SX = '{',
    TO_TX = ')',
    FROM_TX = '(',
    TO_AX = '\'',
    FROM_AX = '^',
    LOOP_START = '[',
    LOOP_END = ']',
    MEASURE = ',',
    HEAT = '$',
    TRANSFER = '@',
    ISOLATE = '#',
    PRINT = '.',
    COMPILE = '~'
}

export enum VMErrors {
    SHUTDOWN = 'The VM is shutdown',
    ERROR = 'The VM is in an error state',
    BAD_INSTRUCTION = 'The given instruction is not a good one',
    MISSING_LOOP_START = 'Loop start is missing during backtracking',
    MISSING_LOOP_END = 'Loop end is missing while jumping',
    BAD_RESEVOIR = 'Resevoir index given does not exist',
    BAD_TEMPERATURE = 'Temperature must be between 0 and 9000 K',
    BAD_REAGENT = 'Given reagent index at given resevoir index does not exist'
}

export enum Outputs {
    PILL = 10,
    VIAL = 11,
    EJECTION_PORT = 12
}

export interface Registers {
    sx: number;
    tx: number;
    ax: number;
}

export interface Resevoir {
    label: string;
    reagents: number[];
    temperature: number;
}

export class World {
    private memory: number[];
    private registers: Registers;
    private pointer: number;
    private instructionPointer: number;
    private instructionMemory: string[];
    private printBuffer: string;
    private shutdown: boolean;
    private error: boolean;
    
    constructor(private readonly resevoirs: Resevoir[] = [], program?: string) {
        Object.values(Outputs).forEach((index: number) => {
            resevoirs[index] = { label: 'output', reagents: [], temperature: 293 }
        });

        if(program) {
            this.loadProgram(program);
        } else {
            this.reset();
        }
    }

    nextState(): void {
        if (this.shutdown) {
            throw VMErrors.SHUTDOWN;
        } else if (this.error) {
            throw VMErrors.ERROR;
        }
        try {
            this.decode(this.getI());
        } catch (err) {
            this.error = true;
        }
        this.incI();
    }

    loadProgram(program: string): void {
        this.instructionMemory = program.split('');
        this.reset();
    }

    reset(): void {
        this.memory = Array(1024).fill(0);
        this.registers = { sx: 0, tx: 0, ax: 0 }
        this.pointer = 0;
        this.instructionPointer = 0;
        this.shutdown = false;
        this.error = false;
        this.printBuffer = '';
    }

    decode(instruction: string): void {
        switch(instruction) {
            case Instructions.INC:
                this.inc(); break;
            case Instructions.DEC:
                this.dec(); break;
            case Instructions.INC_P:
                this.incP(); break;
            case Instructions.DEC_P:
                this.decP(); break;
            case Instructions.TO_SX:
                this.toSx(); break;
            case Instructions.FROM_SX:
                this.fromSx(); break;
            case Instructions.TO_TX:
                this.toTx(); break;
            case Instructions.FROM_TX:
                this.fromTx(); break;
            case Instructions.TO_AX:
                this.toAx(); break;
            case Instructions.FROM_AX:
                this.fromAx(); break;
            case Instructions.LOOP_START:
                this.loopStart(); break;
            case Instructions.LOOP_END:
                this.loopEnd(); break;
            case Instructions.MEASURE:
                this.measure(); break;
            case Instructions.HEAT:
                this.heat(); break;
            case Instructions.TRANSFER:
                this.transfer(); break;
            case Instructions.ISOLATE:
                this.isolate(); break;
            case Instructions.PRINT:
                this.print(); break;
            case Instructions.COMPILE:
                this.compile(); break;
            default:
                throw VMErrors.BAD_INSTRUCTION;
        }
    }
    
    getPointer(): number {
        return this.pointer;
    }

    getInstructionPointer(): number {
        return this.instructionPointer;
    }

    getShutdown(): boolean {
        return this.shutdown;
    }

    getError(): boolean {
        return this.error;
    }
    
    getSx(): number {
        return this.registers.sx;
    }

    setSx(value: number): number {
        return this.registers.sx = value;
    }
    
    getTx(): number {
        return this.registers.tx;
    }

    setTx(value: number): number {
        return this.registers.tx = value;
    }

    getAx(): number {
        return this.registers.ax;
    }

    setAx(value: number): number {
        return this.registers.ax = value;
    }
    
    getResevoir(index: number): Resevoir {
        if (!this.checkResevoir(index)) {
            throw VMErrors.BAD_RESEVOIR;
        }

        return this.resevoirs[index];
    }

    getPrintBuffer(): string {
        if (this.printBuffer.length === 0) {
            return this.printBuffer;
        }
        
        return this.printBuffer.match(/.{1,80}/g).join('\n');
    }
    
    getP(): number {
        return this.memory[this.pointer];
    }

    setP(value: number): number {
        return this.memory[this.pointer] = value;
    }

    // >
    incP(): number {
        if (this.pointer === this.memory.length - 1) {
            this.pointer = 0;
        } else {
            this.pointer++;
        }

        return this.getP();
    }

    // <
    decP(): number {
        if (this.pointer === 0) {
            this.pointer = this.memory.length - 1
        } else {
            this.pointer--;
        }

        return this.getP();
    }

    getI(): string {
        return this.instructionMemory[this.instructionPointer];
    }
    
    // next instruction
    incI(): string | null {
        if (this.instructionPointer === this.instructionMemory.length - 1) {
            this.shutdown = true;
            return null;
        } else {
            this.instructionPointer++;
            return this.getI();
        }
    }

    // prev instruction
    decI(): string | null {
        if (this.instructionPointer !== 0) {
            this.instructionPointer--;
        }

        return this.getI();
    }

    // +
    inc(): number {
        return this.setP(this.getP() + 1);
    }

    // -
    dec(): number {
        return this.setP(this.getP() - 1);
    }

    // }
    toSx(): number {
        return this.setSx(this.getP());
    }

    // {
    fromSx(): number {
        return this.setP(this.getSx());
    }

    // )
    toTx(): number {
        return this.setTx(this.getP());
    }

    // (
    fromTx(): number {
        return this.setP(this.getTx());
    }

    // '
    toAx(): number {
        return this.setAx(this.getP());
    }

    // ^
    fromAx(): number {
        return this.setP(this.getAx());
    }

    // [
    loopStart(): void {
        if (this.getP()) {
            return;
        }

        let nestCount = 0;
        
        while (this.getI() !== Instructions.LOOP_END && nestCount !== 0) {
            if (this.getI() == Instructions.LOOP_START) {
                nestCount++;
            } else if (this.getI() === Instructions.LOOP_END) {
                nestCount--;
            } else if (this.instructionPointer === this.instructionMemory.length - 1) {
                throw VMErrors.MISSING_LOOP_END;
            }
            
            this.incI();
        }
    }

    // ]
    loopEnd(): void {
        if(!this.getP()) {
            return;
        }

        let nestCount = 0;
        this.decI();
        while (this.getI() !== Instructions.LOOP_START || nestCount !== 0) {
            if (this.getI() == Instructions.LOOP_END) {
                nestCount++;
            } else if (this.getI() == Instructions.LOOP_START) {
                nestCount--;
            } else if (this.instructionPointer === 0) {
                throw VMErrors.MISSING_LOOP_START;
            }

            this.decI();
        }
    }

    // ,
    measure(): number {
        return this.setAx(this.measureResevoir(this.getSx()));
    }

    private measureResevoir(index: number): number {
        return this.getResevoir(index)
            .reagents
            .reduce((carry: number, curr: number) => carry + curr);
    }
    
    // $
    heat(): number {
        const targetTemp = ((273 - this.getTx()) + this.getAx());
        return this.heatResevoir(this.getSx(), targetTemp);
    }

    private heatResevoir(index: number, targetTemp: number): number {
        if (targetTemp < 0 || targetTemp > 9000) {
            throw VMErrors.BAD_TEMPERATURE;
        }

        return this.getResevoir(index).temperature = targetTemp;
    }
    
    // @
    transfer(): number {
        return this.transferReagents(this.getSx(), this.getTx(), this.getAx());
    }

    private transferReagents(sourceIndex: number, targetIndex: number, amount: number): number {
        const source = this.getResevoir(sourceIndex);
        const target = this.getResevoir(targetIndex);
        const sourceVolume = this.measureResevoir(sourceIndex);
        let amountLeft = amount = amount > sourceVolume ? sourceVolume : amount;

        for (let i = 0; i < source.reagents.length && amountLeft > 0; i++) {
            if (source.reagents[i] > amountLeft) {
                source.reagents[i] -= amountLeft;
                target.reagents.push(amountLeft);
                amountLeft = 0;
            } else {
                let removed = source.reagents.shift();
                amountLeft -= removed;
                target.reagents.push(removed);
            }
        }

        return amount;
    }

    // #
    isolate(): number {
        return this.isolateReagents(this.getP(), this.getSx(), this.getTx(), this.getAx());
    }

    isolateReagents(reagentIndex: number, sourceIndex: number, targetIndex: number, amount: number): number {
        if (!this.checkReagent(sourceIndex, reagentIndex)) {
            throw VMErrors.BAD_REAGENT;
        }

        const sourceAmount = this.getResevoir(sourceIndex).reagents[reagentIndex];

        if (amount >= sourceAmount) {
            this.getResevoir(targetIndex).reagents.push(sourceAmount);
            this.getResevoir(sourceIndex).reagents.splice(reagentIndex, 1);
            return sourceAmount;
        } else {
            this.getResevoir(targetIndex).reagents.push(amount);
            this.getResevoir(sourceIndex).reagents[reagentIndex] -= amount;
            return amount;
        }
    }
    
    // .
    print(): string {
        return this.printBuffer = this.printBuffer.concat(String.fromCodePoint(this.getP()));
    }

    // ~
    compile(): void {
        //no-op
    }
    
    checkResevoir(index: number): boolean {
        return index > 0 && index <= this.resevoirs.length - 1;
    }

    checkReagent(resevoirIndex: number, reagentIndex: number): boolean {
        return this.checkResevoir(resevoirIndex)
            && reagentIndex > 0
            && reagentIndex <= this.resevoirs[resevoirIndex].reagents.length - 1;
    }
    
    checkTarget(index: number): boolean {
        return this.checkResevoir(index) || Object.values(Outputs).includes(index);
    }
}
