import { Transferable } from './transferable';

export class Resevoir {
    private reagents: number[];
    private volume: number;
    constructor(
        public readonly label: string,
        private readonly maxVolume: number,
        reagents: number[] = [],
        private temperature: number = 273,
    ) {
        this.reagents = [];

        reagents.forEach((amount: number) => {
            this.safeAddReagent(amount);
        });
    }

    transferTo(target: Transferable, amount: number): number {
        const volume = this.getVolume();
        let amountLeft = amount = volume > amount ? amount : volume;

        this.reagents.forEach((_, index: number) => {
            if (!amountLeft) {
                return;
            }

            const actualRemoved = this.removeReagent(index, amountLeft);
            target.addReagent(actualRemoved);
            amountLeft -= actualRemoved;
        });

        return amount;
    }

    isolateTo(target: Transferable, index: number, amount: number) {
        const actualRemoved = this.removeReagent(index, amount);
        target.addReagent(actualRemoved);

        return actualRemoved;
    }

    getReagents(): number[] {
        return [...this.reagents];
    }
    
    getReagent(index: number): number {
        if (!this.checkReagent(index)) {
            this.throwInvalidReagent(index);
        }

        return this.reagents[index];
    }

    removeReagent(index: number, amount: number): number {
        if(!this.checkReagent(index)) {
            this.throwInvalidReagent(index);
        }
        
        if(this.reagents[index] <= amount) {
            amount = this.reagents.splice(index, 1)[0];
        } else {
            this.reagents[index] -= amount;
        }

        this.volume -= amount;
        return amount;
    }
    
    addReagent(amount: number): number {
        if (amount === 0) {
            return;
        }

        if (this.wouldOverflow(amount)){
            this.throwOverflow(amount);
        }
        
        this.reagents.push(amount);
        this.volume += amount;
        return amount;
    }

    safeAddReagent(amount: number): number {
        amount = this.wouldOverflow(amount)
            ? this.getMaxSafeAmount()
            : amount;

        return this.addReagent(amount);
    }
        
    checkReagent(index: number): boolean {
        return index >= 0 && index <= this.reagents.length -1;
    }
    
    getTemperature(): number {
        return this.temperature;
    }

    setTemperature(value: number) {
        return this.temperature = value;
    }

    getVolume(): number {
        if (!this.volume) {
            this.volume = this.reagents.reduce(
                (totalVolume, current) => totalVolume + current, 0
            );
        }

        return this.volume;
    }

    getMaxVolume(): number {
        return this.maxVolume;
    }

    wouldOverflow(amount: number): boolean {
        return amount > this.getMaxSafeAmount();
    }

    getMaxSafeAmount(): number {
        return this.getMaxVolume() - this.getVolume();
    }

    private throwOverflow(amount: number): never {
        throw new Error(`Overflow: Adding ${amount} units would overflow max volume ${this.getMaxVolume()} units`);        
    }

    private throwInvalidReagent(index: number): never {
        throw new Error(`Invalid reagent index ${index}`);
    }
}
