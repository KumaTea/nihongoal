export function storyFor(topic: string) {
  const subject = topic === 'Travel' ? '旅行' : topic === 'Food' ? '日本料理' : '毎日';
  return { title: `${subject}の小さな話`, japanese: `わたしは${subject}が好きです。きょう、日本語を勉強しています。`, reading: `わたし は ${subject} が すき です。きょう、にほんご を べんきょう して います。`, meaning: `I like ${topic.toLowerCase()}. Today, I am studying Japanese.`, phrase: subject === '日本料理' ? '日本料理が好きです' : '日本語を勉強しています' };
}
export function discoverFromText(text: string) {
  const japanese = text.includes('食') ? '食べたいです' : 'これは何ですか';
  const reading = text.includes('食') ? 'たべたい です' : 'これ は なん です か';
  const meaning = text.includes('食') ? 'I want to eat.' : 'What is this?';
  return { japanese, reading, meaning };
}
