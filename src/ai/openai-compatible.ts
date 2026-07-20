import { ConnectionProfile, ConnectionResult } from './types';

type Candidate = { japanese: string; reading: string; meaning: string };
type TutorCandidate = Candidate & { text: string; practice: string };
type ChatMessage = { role: 'system' | 'user'; content: string | { type: string; text?: string; image_url?: { url: string } }[] };

const url = (endpoint: string) => `${endpoint.replace(/\/$/, '')}/chat/completions`;
const isXiaomi = (profile: ConnectionProfile) => profile.endpoint.includes('xiaomimimo.com');
const headers = (profile: ConnectionProfile) => ({ 'content-type': 'application/json', ...(isXiaomi(profile) ? { 'api-key': profile.token } : { authorization: `Bearer ${profile.token}` }) });
const imageProfile = (profile: ConnectionProfile): ConnectionProfile => profile.separateImageProvider && profile.imageEndpoint && profile.imageModel && profile.imageToken ? { ...profile, endpoint: profile.imageEndpoint, model: profile.imageModel, token: profile.imageToken } : profile;

async function chat(profile: ConnectionProfile, messages: ChatMessage[], outputTokens: number, structured = false) {
  const response = await fetch(url(profile.endpoint), { method: 'POST', headers: headers(profile), body: JSON.stringify({ model: profile.model, messages, ...(isXiaomi(profile) ? { max_completion_tokens: Math.max(outputTokens, 800) } : { max_tokens: outputTokens }), ...(structured && isXiaomi(profile) ? { response_format: { type: 'json_object' } } : {}) }) });
  if (!response.ok) throw new Error(`Provider returned ${response.status}`);
  const data = await response.json(); const message = data.choices?.[0]?.message ?? {};
  const content = typeof message.content === 'string' ? message.content.trim() : '';
  if (!content) throw new Error('The selected model did not finish its answer. Try again or choose a model with more output capacity.');
  return content;
}

export async function testConnection(profile: ConnectionProfile): Promise<ConnectionResult> {
  try { await chat(profile, [{ role: 'user', content: 'Reply with OK.' }], 16); return { ok: true, message: `Connected to ${profile.model}.` }; }
  catch (error) { return { ok: false, message: error instanceof Error && error.message.startsWith('Provider returned') ? `Connection failed (${error.message.replace('Provider returned ', '')}). Check endpoint, model, and token.` : 'Unable to reach this endpoint. It may not allow browser requests (CORS).' }; }
}
export async function testImageConnection(profile: ConnectionProfile): Promise<ConnectionResult> { return testConnection(imageProfile(profile)); }

export async function liveTutorReply(profile: ConnectionProfile, message: string) {
  return chat(profile, [{ role: 'system', content: 'You are Sensei, a concise Japanese tutor. Reply with one useful Japanese phrase, its kana reading, English meaning, and a short encouraging explanation.' }, { role: 'user', content: message }], 500);
}

export async function liveTutorCandidate(profile: ConnectionProfile, message: string): Promise<TutorCandidate> {
  const content = await chat(profile, [{ role: 'system', content: 'You are Sensei, a Japanese tutor. Return one useful Japanese phrase. Prefer JSON only: {"text":"brief encouragement","japanese":"one useful Japanese phrase","reading":"kana reading","meaning":"support-language meaning","practice":"one short practice prompt"}. If JSON is unavailable, use these exact labels on separate lines: Text:, Japanese:, Reading:, Meaning:, Practice:.' }, { role: 'user', content: message }], 700, true);
  const candidate = parseCandidate(content); const value = parseObject(content);
  return { ...candidate, text: stringField(value, ['text']) ?? 'Here is one useful phrase for your situation.', practice: stringField(value, ['practice']) ?? `Try saying: ${candidate.japanese}` };
}

export async function discoverTextCandidate(profile: ConnectionProfile, source: string): Promise<Candidate> {
  const content = await chat(profile, [{ role: 'system', content: 'You turn Japanese encountered in daily life into one practical learning card. Use the learner text as evidence and do not invent unrelated phrases. Prefer JSON only: {"japanese":"one useful word or phrase from the source","reading":"kana reading","meaning":"concise support-language meaning"}. If JSON is unavailable, use exact labels on separate lines: Japanese:, Reading:, Meaning:.' }, { role: 'user', content: `Learner source text:\n${source}` }], 500, true);
  return parseCandidate(content);
}

export async function adaptiveReading(profile: ConnectionProfile, input: { headline: string; summary: string; topic: string; supportLanguage: string; level: string; }) {
  const content = await chat(profile, [{ role: 'system', content: 'You create original short Japanese reading practice from a news headline and summary. Do not reproduce the article. Use 3–4 short Japanese sentences suitable for the learner. Prefer JSON only: {"title":"Japanese title","japanese":"original adapted reading","reading":"kana reading with spaces","meaning":"support-language explanation","phrase":"one useful phrase from your reading","phraseReading":"kana","phraseMeaning":"support-language meaning"}. If JSON is unavailable, use the exact labels Title:, Japanese:, Reading:, Meaning:, Phrase:, PhraseReading:, PhraseMeaning:.' }, { role: 'user', content: `Topic: ${input.topic}\nLearner level: ${input.level}\nSupport language: ${input.supportLanguage}\nNews headline: ${input.headline}\nNews summary: ${input.summary}` }], 1600, true);
  const value = parseObject(content); const required = ['title', 'japanese', 'reading', 'meaning', 'phrase', 'phraseReading', 'phraseMeaning'];
  const result = Object.fromEntries(required.map((key) => [key, stringField(value, [key]) ?? labelledField(content, key)]));
  if (required.some((key) => !result[key])) throw new Error('Sensei returned an incomplete reading.');
  return result as { title: string; japanese: string; reading: string; meaning: string; phrase: string; phraseReading: string; phraseMeaning: string; };
}

export async function analyseImage(profile: ConnectionProfile, dataUri: string) {
  profile = imageProfile(profile);
  const content = await chat(profile, [{ role: 'system', content: 'Identify exactly one useful Japanese phrase for a visible everyday object. Prefer JSON only: {"japanese":"...","reading":"kana","meaning":"English meaning"}. If JSON is unavailable, use exact labels Japanese:, Reading:, Meaning:.' }, { role: 'user', content: [{ type: 'text', text: 'Suggest one useful Japanese learning item from this image.' }, { type: 'image_url', image_url: { url: dataUri } }] }], 500, true);
  return parseCandidate(content);
}

function parseObject(content: string): Record<string, unknown> {
  for (const candidate of jsonCandidates(content)) { try { const parsed = JSON.parse(candidate); if (parsed && typeof parsed === 'object') return parsed as Record<string, unknown>; } catch { /* try the next JSON object */ } }
  return {};
}
function jsonCandidates(content: string) {
  const stripped = content.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim(); const found: string[] = [stripped];
  for (let start = stripped.indexOf('{'); start >= 0; start = stripped.indexOf('{', start + 1)) for (let end = stripped.lastIndexOf('}'); end > start; end = stripped.lastIndexOf('}', end - 1)) found.push(stripped.slice(start, end + 1));
  return found;
}
function stringField(value: Record<string, unknown>, keys: string[]) {
  for (const key of keys) { const candidate = value[key]; if (typeof candidate === 'string' && candidate.trim()) return candidate.trim(); }
  return undefined;
}
function labelledField(content: string, key: string) {
  const labels: Record<string, string[]> = { title: ['Title'], japanese: ['Japanese', '日本語'], reading: ['Reading', 'Kana', '読み'], meaning: ['Meaning', '意味'], phrase: ['Phrase'], phraseReading: ['PhraseReading', 'Phrase Reading'], phraseMeaning: ['PhraseMeaning', 'Phrase Meaning'], text: ['Text'], practice: ['Practice'] };
  const names = labels[key] ?? [key]; const expression = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return content.match(new RegExp(`(?:^|\\n)\\s*(?:${expression})\\s*[:：]\s*([^\\n]+)`, 'i'))?.[1]?.trim();
}
function parseCandidate(content: string): Candidate {
  const value = parseObject(content); const japanese = stringField(value, ['japanese']) ?? labelledField(content, 'japanese'); const reading = stringField(value, ['reading']) ?? labelledField(content, 'reading'); const meaning = stringField(value, ['meaning']) ?? labelledField(content, 'meaning');
  if (!japanese || !reading || !meaning) throw new Error('Sensei returned an incomplete learning candidate.');
  return { japanese, reading, meaning };
}
