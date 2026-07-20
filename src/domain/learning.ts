import { LearningItem } from '@/data/types';

export type TutorReply = { text: string; japanese: string; reading: string; meaning: string; practice: string };

export function fakeTutorReply(message: string): TutorReply {
  const lower = message.toLowerCase();
  if (lower.includes('food') || lower.includes('eat') || lower.includes('食')) return { text: 'Great starting point. Here is a natural way to say that.', japanese: '日本料理が好きです', reading: 'にほんりょうり が すき です', meaning: 'I like Japanese food.', practice: 'Tell Sensei about a food you enjoy.' };
  return { text: 'Nice. Here is a useful phrase you can use as you begin.', japanese: '日本語を勉強しています', reading: 'にほんご を べんきょう して います', meaning: 'I am studying Japanese.', practice: 'Try using this phrase in a sentence about yourself.' };
}

export function itemFromReply(reply: TutorReply): Omit<LearningItem, 'id' | 'createdAt' | 'updatedAt'> {
  return { kind: 'phrase', japanese: reply.japanese, reading: reply.reading, meaning: reply.meaning, notes: null, state: 'practised' };
}

export function recommendationFor(items: LearningItem[]) {
  const item = items[0];
  if (!item) return { title: 'Learn and use one useful phrase today.', detail: 'Start anywhere—Sensei will adapt as you go.', action: 'Talk with Sensei' };
  return { title: `Use ${item.japanese} once more today.`, detail: `You saved it recently. A short conversation will help it stick.`, action: 'Practise with Sensei' };
}

export function xpForFirstSavedPhrase(itemCountBeforeSave: number) { return itemCountBeforeSave === 0 ? 15 : 5; }
export function focusAdvice(itemCount: number) { return itemCount >= 5 ? 'A short review may help your recent phrases stick.' : 'You have room for one small new learning moment.'; }
