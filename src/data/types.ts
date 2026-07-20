export type Profile = {
  id: 'local';
  supportLanguage: 'en-US' | 'zh-CN' | 'ja';
  startingComfort: string;
  correctionIntensity: 'chat' | 'gentle' | 'coach';
  furiganaMode: 'all' | 'learning' | 'unknown' | 'none';
  createdAt: string;
  updatedAt: string;
};

export type LearningItem = {
  id: string;
  kind: 'word' | 'phrase' | 'grammar' | 'kanji' | 'sentence-pattern';
  japanese: string;
  reading: string | null;
  meaning: string;
  notes: string | null;
  state: 'seen' | 'recognised' | 'practised' | 'reliable' | 'needs-review';
  createdAt: string;
  updatedAt: string;
};

export type ExportBundle = { formatVersion: 1; exportedAt: string; profile: Profile | null; learningItems: LearningItem[] };
