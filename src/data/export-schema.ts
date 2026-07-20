import { z } from 'zod';

export const exportBundleSchema = z.object({
  formatVersion: z.literal(1), exportedAt: z.string(),
  profile: z.object({ id: z.literal('local'), supportLanguage: z.enum(['en-US', 'zh-CN', 'ja']), startingComfort: z.string(), correctionIntensity: z.enum(['chat', 'gentle', 'coach']), furiganaMode: z.enum(['all', 'learning', 'unknown', 'none']), createdAt: z.string(), updatedAt: z.string() }).nullable(),
  learningItems: z.array(z.object({ id: z.string(), kind: z.enum(['word', 'phrase', 'grammar', 'kanji', 'sentence-pattern']), japanese: z.string(), reading: z.string().nullable(), meaning: z.string(), notes: z.string().nullable(), state: z.enum(['seen', 'recognised', 'practised', 'reliable', 'needs-review']), createdAt: z.string(), updatedAt: z.string() })),
});
