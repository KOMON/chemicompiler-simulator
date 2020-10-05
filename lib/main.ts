import { World } from './world';

function main() {
    const world = new World([
        { label: 'Sulfur', reagents: [25], temperature: 293 },
        { label: 'Mercury/Water', reagents: [10, 15], temperature: 293 },
        { label: 'Oxygen', reagents: [20], temperature: 293 }
    ]);

    world.loadProgram('++++++[>++++++++++<-]>+++++.');
    
    while(!world.getShutdown() && !world.getError()) {
        console.log(`Instruction ${world.getInstructionPointer()}: ${world.getI()}`);
        world.nextState();
        console.log(`Data ${world.getPointer()}: ${world.getP()}`);
        console.log(world['registers']);
        console.log(world.getPrintBuffer());
    }
}

main();
