import { Transferable } from './transferable';

export class Resevoir {
    constructor(
        public readonly label: string,
        private readonly maxVolume: number,
        private reagents: number[] = [],
        private temperature: number = 273,
    ) {}

    transferTo(target: Transferable, amount: number): number {
        const volume = this.getVolume();
        let amountLeft = amount = volume > amount ? amount : volume;

        this.reagents.forEach((_, index: number) => {
            if (!amountLeft) {
                return;
            }

            const actualRemoved = this.decreaseReagent(index, amountLeft);
            target.addReagent(actualRemoved);
            amountLeft -= actualRemoved;
        });

        return amount;
    }

    isolateTo(target: Transferable, index: number, amount: number) {
        const actualRemoved = this.decreaseReagent(index, amount);
        target.addReagent(actualRemoved);

        return actualRemoved;
    }
    
    getReagent(index: number): number {
        if (!this.checkReagent(index)) {
            throw new Error(`Invalid reagent index ${index}`);
        }

        return this.reagents[index];
    }

    increaseReagent(index: number, amount: number): number {
        const volume = this.getVolume();

        if(!this.checkReagent(index)) {
            throw new Error(`Invalid reagent index ${index}`);
        } else if (volume + amount > this.getMaxVolume()) {
            throw new Error(`Overflow: ${volume + amount} > ${this.getMaxVolume()}`);
        }

        return this.reagents[index] += amount;
    }

    decreaseReagent(index: number, amount: number): number {
        if(!this.checkReagent(index)) {
            throw new Error(`Invalid reagent index ${index}`);
        }

        if(this.reagents[index] <= amount) {
            return this.removeReagent(index);
        } else {
            return this.reagents[index] -= amount;
        }
    }
    
    addReagent(amount: number): number {
        const volume = this.getVolume();
        if (volume + amount > this.getMaxVolume()){
            throw new Error(`Overflow: ${volume + amount} > ${this.getMaxVolume()}`);
        }
        
        this.reagents.push(amount);
        return amount;
    }

    removeReagent(index: number): number {
        const removed = this.reagents.splice(index, 1);
        return removed[0];
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
        return this.reagents.reduce((totalVolume, current) => totalVolume + current, 0);
    }

    getMaxVolume(): number {
        return this.maxVolume;
    }
}
