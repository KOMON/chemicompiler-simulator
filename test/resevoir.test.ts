import { Resevoir } from '../lib/resevoir';

describe('Feature: A representation of a chemical resevoir', () => {
    describe('Feature: Constructing a resevoir', () => {
        describe('Scenario: No reagents or temperature are specified', () => {
            const label = 'Sulfur';
            const maxVolume = 100;
            const SUT = new Resevoir(label, maxVolume);

            it('should have a matching label', () => {
                expect(SUT.label).toEqual(label);
            });

            it('should have a matching max volume', () => {
                expect(SUT.getMaxVolume()).toEqual(maxVolume);
            });
            
            it('should have no reagents', () => {
                expect(SUT.getReagents().length).toEqual(0);
            });

            it('should be at the default temperature', () => {
                expect(SUT.getTemperature()).toEqual(273); 
            });
        });

        describe('Scenario: Total reagents specified are greater than the specified max volume', () => {
            // given
            const maxVolume = 100;
            const safeReagents = [25, 50];
            const safeFinalReagentAmount = maxVolume - safeReagents.reduce((total, amount) => total + amount, 0);
            const wouldOverflowReagentAmount = safeFinalReagentAmount * 1.5;
            const unreachedReagentAmount = 25;
            const initialReagents = [
                ...safeReagents, wouldOverflowReagentAmount, unreachedReagentAmount
            ];

            // when
            const SUT = new Resevoir('Sulfur', 100, initialReagents);

            it('should max out at the max volume given', () => {
                expect(SUT.getVolume()).toEqual(maxVolume);
            });

            it('should have only have reagents up to the max volume', () => {
                expect(SUT.getReagents()).toEqual([...safeReagents, safeFinalReagentAmount]);
            });
        });
    });

    describe('Feature: Manipulating reagents', () => {
        describe('Feature: Retrieving reagents', () => {
            const reagents = [25, 50, 75];
            const SUT = new Resevoir('Sulfur', 150, reagents);

            describe('Scenario: Retrieving a non-existent reagent', () => {
                let result: Error;
                
                try {
                    SUT.getReagent(reagents.length);
                } catch(err) {
                    result = err;
                }

                it('should have thrown an error', () => {
                    expect(result).toBeDefined();
                });
            });

            describe('Scenario: Retrieving an existing reagent', () => {
                reagents.forEach((amount: number, index: number) => {
                    const result = SUT.getReagent(index);

                    it('should have retrieved the correct reagent amount', () => {
                        expect(result).toEqual(amount);
                    });
                });
            });
        });
        
        describe('Feature: Adding reagents', () => {
            describe('Scenario: Adding a reagent amount that would overflow the resevoir', () => {
                
            });

            describe('Scenario: Adding a reagent amount that is safe to add to the resevoir', () => {
                
            });
        });
        
        describe('Feature: Removing reagents', () => {});
    });
});
