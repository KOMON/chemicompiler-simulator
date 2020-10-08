export interface Registers {
    sx: number;
    tx: number;
    ax: number;
}

export class RegisterModule {
    private sx: number;
    private tx: number;
    private ax: number;

    constructor() {
        this.reset();
    }

    getRegisters(): Registers {
        return {
            sx: this.sx,
            tx: this.tx,
            ax: this.ax
        };
    }

    reset(): void {
        this.sx = 0;
        this.tx = 0;
        this.ax = 0;
    }
    
    getSx(): number {
        return this.sx;
    }

    setSx(value: number): number {
        return this.sx = value;
    }

    getTx(): number {
        return this.tx;
    }

    setTx(value: number): number {
        return this.tx = value;
    }

    getAx(): number {
        return this.ax;
    }

    setAx(value: number): number {
        return this.ax = value;
    }
}
