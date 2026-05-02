import { ELECTION_STAGES, QUICK_FACTS } from '../lib/electionData';

describe('electionData', () => {
  describe('ELECTION_STAGES', () => {
    it('should have 5 stages', () => {
      expect(ELECTION_STAGES.length).toBe(5);
    });

    it('each stage should have required fields and at least 3 steps', () => {
      ELECTION_STAGES.forEach(stage => {
        expect(stage).toHaveProperty('id');
        expect(stage).toHaveProperty('title');
        expect(stage).toHaveProperty('icon');
        expect(typeof stage.icon).toBe('string');
        expect(stage.icon.length).toBeGreaterThan(0);
        expect(stage.steps.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('should have unique stage IDs', () => {
      const ids = ELECTION_STAGES.map(stage => stage.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('QUICK_FACTS', () => {
    it('should have 8 facts', () => {
      expect(QUICK_FACTS.length).toBe(8);
    });

    it('each fact should have question, answer, and icon', () => {
      QUICK_FACTS.forEach(fact => {
        expect(fact).toHaveProperty('question');
        expect(fact).toHaveProperty('answer');
        expect(fact).toHaveProperty('icon');
      });
    });
  });
});
