import { Memory } from '../lib/memory';

describe('Feature: Generic Memory Type', () => {
    describe('Feature: Construction', () => {
        describe('Scenario: No arguments are given', () => {
            const SUT = new Memory<any>();

            it('should have zero length', () => {
                expect(SUT.getLength()).toEqual(0);
            });
        });

        describe('Scenario: A negative length is specified', () => {
            const SUT = new Memory<any>(-1);

            it('should have zero length', () => {
                expect(SUT.getLength()).toEqual(0);
            });
        });

        describe('Scenario: A postive length is given, no default specified', () => {
            const length = 10;
            const SUT = new Memory<any>(length);

            it('should have a matching length', () => {
                expect(SUT.getLength()).toEqual(length);
            });

            it('should have values defaulting to null', () => {
                for (let value of SUT) {
                    expect(value).toEqual(null);
                }
            });
        });

        describe('Scenario: A positive length is given, a default value is specified', () => {
            const length = 10;
            const defaultValue = { hi: 'mom' };

            const SUT = new Memory<any>(length, defaultValue);

            it('should have a matching length', () => {
                expect(SUT.getLength()).toEqual(length);
            });

            it('should have values defaulting to the given default', () => {
                for (let value of SUT) {
                    expect(value).toEqual(defaultValue);
                }
            });
        });
    });

    describe('Feature: Resetting the memory to a default state', () => {
        describe('Scenario: Resetting a freshly constructed Memory', () => {
            const length = 10;
            const defaultValue = { hi: 'mom' };

            let SUT = new Memory<any>(length, defaultValue);

            SUT.reset();

            it('should have the same length after the reset', () => {
                expect(SUT.getLength()).toEqual(length);
            });

            it('should have the same default values after the reset', () => {
                for(let value of SUT) {
                    expect(value).toEqual(defaultValue);
                }
            });

            it('should have the pointer at the start of memory', () => {
                expect(SUT.isAtStart()).toEqual(true);
            });
        });

        describe('Scenario: Reseting a Memory that has been written to', () => {
            // given 
            const length = 10;
            const defaultValue = { hi: 'mom' };

            const SUT = new Memory<any>(length, defaultValue);

            SUT.setMemory([1, 2, 3, 4, 'hi', 6, 'mom', 7, [1, 2, 3], 9]);
            SUT.incrementPointer();
            SUT.incrementPointer();

            //when
            SUT.reset();

            it('should have the same length after the reset', () => {
                expect(SUT.getLength()).toEqual(length);
            });

            it('should have the same default values after the reset', () => {
                for(let value of SUT) {
                    expect(value).toEqual(defaultValue);
                }
            });

            it('should have the pointer at the start of memory', () => {
                expect(SUT.isAtStart()).toEqual(true);
            });
        });
    });

    describe('Feature: Setting internal memory state directly', () => {
        // given
        const SUT = new Memory<any>(10);
        SUT.incrementPointer();
        SUT.incrementPointer();
        SUT.incrementPointer();
        const pointerPosition = SUT.getPointer();

        // when
        const newMemory = [1, 2, 3, 'hi', 5, 'mom', 6, [7, 8, 9]];
        SUT.setMemory(newMemory);

        it('should have an internal state that matches the given memory', () => {
            expect(Array.from(SUT)).toEqual(newMemory);
        });

        it('should have a new length that matches the given memory', () => {
            expect(SUT.getLength()).toEqual(newMemory.length);
        });

        it('should have kept the original pointer position', () => {
            expect(SUT.getPointer()).toEqual(pointerPosition);
        });
    });

    describe('Feature: Moving the pointer', () => {
        describe('Feature: Incrementing the pointer', () => {
            // given
            const internalMemory = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const SUT = new Memory<number>(internalMemory.length, 0);
            SUT.setMemory(internalMemory);

            describe('Scenario: the pointer is not at the end', () => {
            
                let pointerPosition = SUT.getPointer();
                let result: number;
                
                expect(SUT.isAtStart()).toEqual(true);
                expect(SUT.get()).toEqual(internalMemory[pointerPosition]);
                
                // when
                while(!SUT.isAtEnd()) {
                    result = SUT.incrementPointer();
                    ++pointerPosition;

                    // then
                    it('should point to the next value in memory', () => {
                        expect(SUT.get()).toEqual(internalMemory[pointerPosition]);
                    });

                    it('should return a value that matches the current pointer position', () => {
                        expect(result).toEqual(SUT.getPointer());
                    });
                }

            });

            describe('Scenario: The pointer is at the end', () => {
                // given
                while(!SUT.isAtEnd()) {
                    SUT.incrementPointer();
                }

                const pointerPosition = SUT.getPointer();
                expect(SUT.isAtEnd()).toEqual(true);

                // when
                const result = SUT.incrementPointer();

                it('should keep the pointer at the end', () => {
                    expect(SUT.isAtEnd()).toEqual(true);
                });

                it('should return the same pointer position from before the increment', () => {
                    expect(result).toEqual(pointerPosition);
                });
            });
        });

        describe('Feature: Decrementing the pointer', () => {
            // given
            const internalMemory = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const SUT = new Memory<number>(internalMemory.length, 0);
            SUT.setMemory(internalMemory);

            describe('Scenario: the pointer is not at the start', () => {
                while(!SUT.isAtEnd()) {
                    SUT.incrementPointer();
                }

                let pointerPosition = SUT.getPointer();
                let result: number;
                
                expect(SUT.isAtEnd()).toEqual(true);
                expect(SUT.get()).toEqual(internalMemory[pointerPosition]);
                
                // when
                while(!SUT.isAtStart()) {
                    result = SUT.decrementPointer();
                    --pointerPosition;

                    // then
                    it('should point to the previous value in memory', () => {
                        expect(SUT.get()).toEqual(internalMemory[pointerPosition]);
                    });

                    it('should return a value that matches the current pointer position', () => {
                        expect(result).toEqual(SUT.getPointer());
                    });
                }

            });

            describe('Scenario: The pointer is at the start', () => {
                // given
                while(!SUT.isAtStart()) {
                    SUT.decrementPointer();
                }

                const pointerPosition = SUT.getPointer();
                expect(SUT.isAtStart()).toEqual(true);

                // when
                const result = SUT.decrementPointer();

                it('should keep the pointer at the start', () => {
                    expect(SUT.isAtStart()).toEqual(true);
                });

                it('should return the same pointer position from before the decrement', () => {
                    expect(result).toEqual(pointerPosition);
                });
            });
        });
        
        describe('Feature: Rewinding the pointer', () => {
            describe('Scenario: The pointer is already at the start', () => {
                const SUT = new Memory<any>(10);
                expect(SUT.isAtStart()).toEqual(true);

                SUT.rewind();
                
                it('should have the pointer remain at the start', () => {
                    expect(SUT.isAtStart()).toEqual(true);
                });
            });

            describe('Scenario: The pointer somewhere in the middle', () => {
                // given
                const SUT = new Memory<any>(10);
                SUT.incrementPointer();
                SUT.incrementPointer();
                SUT.incrementPointer();
                SUT.incrementPointer();

                expect(SUT.isAtStart()).toEqual(false);

                // when
                SUT.rewind();

                it('should move the pointer to start', () => {
                    expect(SUT.isAtStart()).toEqual(true);
                });
            });

            describe('Scenario: The pointer is at the end', () => {
                // given
                const SUT = new Memory<any>(10);
                while(!SUT.isAtEnd()) {
                    SUT.incrementPointer();
                }

                expect(SUT.isAtEnd()).toEqual(true);

                // when
                SUT.rewind();

                it('should move the pointer to start', () => {
                    expect(SUT.isAtStart()).toEqual(true);
                });
            });
        });
    });

    describe('Feature: Setting values in memory', () => {
        // given
        const expectedValues = [1, 2, 20, 30, 11, 20, 99, -1.2];
        const SUT = new Memory<number>(expectedValues.length);


        // when
        expectedValues.forEach((value: number) => {
            SUT.set(value);
            SUT.incrementPointer();
        });
        SUT.rewind();

        it('should have set the expected values in memory', () => {
            expect(Array.from(SUT)).toEqual(expectedValues);
        });
    });
});
