export class PrintBufferModule {
    private printBuffer: string;

    constructor() {
        this.printBuffer = '';
    }

    clear(): void {
        this.printBuffer = '';
    }
    
    getDisplayBuffer(): string {
        return this.printBuffer.length
            ? this.printBuffer.match(/.{1,80}/g).join('\n')
            : this.printBuffer;
    }
    
    printCodePoint(codePoint: number): string {
        const str = String.fromCodePoint(codePoint);

        return this.print(str);
    }

    print(str: string): string {
        this.printBuffer = this.printBuffer.concat(str);

        return str;
    }
}
