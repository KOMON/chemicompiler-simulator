import { MetaOp } from '../metaop';

export class MetaOperationsModule {
    private metaOps: Map<number, MetaOp[]>;

    constructor() {
        this.reset();
    }

    reset(): void {
        this.metaOps = new Map<number, MetaOp[]>([[0, []]]);
    }
    
    queueMetaOp(metaOp: MetaOp, nestingLevel: number = 0): MetaOp {
        if (!this.metaOps.has(nestingLevel)) {
            this.metaOps.set(nestingLevel, []);
        }

        this.metaOps.get(nestingLevel).push(metaOp);

        return metaOp;
    }

    dequeueMetaOp(nestingLevel: number = 0): MetaOp | null {
        if (!this.metaOps.has(nestingLevel) && nestingLevel) {
            return this.dequeueMetaOp();
        } else if (!this.metaOps.has(nestingLevel)) {
            throw new Error('No such metaOp')
        }

        return this.metaOps.get(nestingLevel).shift();
    }
}
