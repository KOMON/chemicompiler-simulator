import { World } from './world';
import { Resevoir } from './resevoir';
import { MetaOpType } from './metaop';
function main() {
    const world = new World(
        [
            new Resevoir('Sulfur', 100, [25], 293),
            new Resevoir('Mercury/Water', 100, [10, 15], 293),
            new Resevoir('Oxygen', 100, [20], 293)
        ],
        "}+)>++[>++++++++++<-]>+++++'@!<<}++++++++++)->+++++[<++++++++++>-]<'@"
    );

    world.queueMetaOp({
        operation: MetaOpType.RELABEL,
        arguments: {
            resevoirIndex: 1,
            resevoir: new Resevoir('Boom stuff', 100, [60], 293)
        }
    });
    
    while(!world.getShutdown() && !world.getError()) {
        console.log(`Instruction: ${world.getCurrentInstruction()}`);
        world.nextState();
        console.log(`Data: ${world.getData()}`);
        console.log(world.getRegisters());
        console.log(world.getPrintBuffer());
    }
}

main();
