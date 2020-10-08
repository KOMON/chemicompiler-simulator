import { Resevoir } from '../resevoir';
import { Transferable } from '../transferable';

export class ResevoirModule {
    constructor(private resevoirs: Resevoir[]) {}

    getCount() {
        return this.resevoirs.length;
    }
    
    get(index: number): Resevoir {
        if (!this.check(index)) {
            throw new Error(`Invalid resevoir ${index}`);
        }

        return this.resevoirs[index];
    }

    set(index: number, resevoir: Resevoir): Resevoir {
        if (!this.check(index)) {
            throw new Error(`Invalid resevoir ${index}`);
        }

        return this.resevoirs[index] = resevoir;
    }

    measure(index: number): number {
        return this.get(index).getVolume();
    }

    heat(index: number, targetTemp: number): number {
        if(targetTemp < 0 || targetTemp > 9000) {
            throw new Error(`Bad Temperature ${targetTemp}`);
        }

        return this.get(index).setTemperature(targetTemp);
    }

    transfer(sourceIndex: number, target: Transferable, amount: number): number {
        return this.get(sourceIndex).transferTo(target, amount);
    }

    isolate(reagentIndex: number, sourceIndex: number, target: Transferable, amount: number): number {
        return this.get(sourceIndex).isolateTo(target, reagentIndex, amount);
    }

    check(index: number): boolean {
        return index >= 0 && index <= this.getCount() - 1;
    }

    relabel(index: number, resevoir: Resevoir): Resevoir {
        return this.set(index, resevoir);
    }
}
