import { Transferable } from '../transferable';

export enum Output {
    PILL = 10,
    VIAL = 11,
    EJECTION_PORT = 12
}

export type PrintCallback = (str: string) => any;

export class OutputModule {
    private printCallback: PrintCallback | null;

    reset(): void {
        this.printCallback = null;
    }
    
    get(index: Output): Transferable {
        let message: string;
        
        switch(index) {
            case Output.PILL:
                message = 'A pill is output'; break;
            case Output.VIAL:
                message = 'Reagent is output into a vial'; break;
            case Output.EJECTION_PORT:
                message = 'Reagent comes flying out of the ejection port'; break;
            default:
                message = 'The machine outputs the reagent';
        }
        const print = this.print.bind(this);
        return {
            addReagent(amount: number): number {
                print(message);
                return amount;
            }
        }
    }
    
    onPrint(callback: PrintCallback) {
        this.printCallback = callback;
    }

    print(str: string): any {
        if (!this.printCallback) {
            return;
        }
        
        return this.printCallback(str);
    }
}
