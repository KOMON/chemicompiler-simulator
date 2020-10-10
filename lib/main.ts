import { World } from './world';
import { Resevoir } from './resevoir';
import { MetaOpType } from './metaop';
async function main() {
    const then_branch = '+>++>+++';
    const else_branch = '!';
    const if_= `+>+<[[-]>-<<${then_branch}>]>[-<<${else_branch}>>]<<`;
    const world = new World(
        [
            new Resevoir('Sulfur', 100, [25], 293),
            new Resevoir('Mercury/Water', 100, [10, 15], 293),
            new Resevoir('Oxygen', 100, [20], 293)
        ],
        '>+++++>+++++<[>>+>+<<<-]>>>[<<<+>>>-]<<[>>+>+<<<-]>>>[<<<+>>>-]<<[>>+<<-]>[<+>-]>[<+>-]<[<->-]<>+<[[-]>-<>]>[-<+>]<>+<[[-]>-<>]>[-<+>]<<[<->-]<'
    );

    world.queueMetaOp({
        operation: MetaOpType.PRINT,
        arguments: {
            str: "Hi mom!"
        }
    });

    let frameCount = 0;
    while(!world.getShutdown() && !world.getError()) {
        console.log(`Frame Count: ${frameCount++}`);
        console.log(`Instruction ${<any>world['instructions']['memory']['pointer']}: ${world.getCurrentInstruction()}`);
        const p = new Promise((resolve) => {
            setTimeout(() => {world.nextState(); resolve()}, 16);
        })
        await p;
        console.log(`Data ${<any>world['data']['pointer']}: ${world.getData()}`);
        console.log(world.getRegisters());
        console.log(world.getPrintBuffer());
    }
    console.log(<any>world['data']['memory'].slice(0, 5));
}

main();
