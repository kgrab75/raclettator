import { describe, it, expect } from 'vitest';
import { calculateQuantities, ParticipantInput } from './calculator-logic';

describe('calculateQuantities', () => {
  it('should calculate correctly for 4 MEDIUM eaters (no restrictions)', () => {
    const participants: ParticipantInput[] = Array(4).fill({
      eaterSize: 'MEDIUM',
      isVeggie: false,
      noPork: false,
      noAlcohol: false,
    });

    const result = calculateQuantities(participants);

    expect(result.cheese).toBe(800);
    expect(result.potatoes).toBe(1500);
    expect(result.charcuterie).toBe(600);
    expect(result.charcuterieVeggieAlt).toBe(0);
    expect(result.charcuterieNoPork).toBe(0);
    expect(result.soft).toBe(1);
    expect(result.wine).toBe(2);
    expect(result.machine).toBe(1);
  });

  it('should handle special diets correctly', () => {
    const participants: ParticipantInput[] = [
      { eaterSize: 'SMALL', isVeggie: true, noPork: false, noAlcohol: true },
      { eaterSize: 'XL', isVeggie: false, noPork: true, noAlcohol: false },
    ];

    const result = calculateQuantities(participants);

    expect(result.cheese).toBe(400);
    expect(result.charcuterie).toBe(0);
    expect(result.charcuterieVeggieAlt).toBeGreaterThan(0);
    expect(result.charcuterieNoPork).toBeGreaterThan(0);
    expect(result.wine).toBe(1);
  });
});
