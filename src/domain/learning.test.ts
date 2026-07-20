import { describe, expect, it } from 'vitest';
import { fakeTutorReply, focusAdvice, recommendationFor, xpForFirstSavedPhrase } from './learning';

describe('deterministic learning rules', () => {
  it('teaches a food phrase for food-related input', () => expect(fakeTutorReply('I like food').japanese).toBe('日本料理が好きです'));
  it('rewards the first saved phrase more than later saves', () => { expect(xpForFirstSavedPhrase(0)).toBeGreaterThan(xpForFirstSavedPhrase(1)); });
  it('recommends a conversation before any saved items', () => expect(recommendationFor([]).action).toBe('Talk with Sensei'));
  it('recommends consolidation after several items', () => expect(focusAdvice(5)).toContain('review'));
});
