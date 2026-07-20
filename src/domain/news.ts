export type NewsArticle = { source: 'NHK NEWS WEB'; title: string; summary: string; url: string; publishedAt: string };

const NHK_RSS = 'https://www3.nhk.or.jp/rss/news/cat0.xml';

export async function loadJapaneseNews(): Promise<NewsArticle[]> {
  const response = await fetch(NHK_RSS); if (!response.ok) throw new Error(`NHK NEWS WEB returned ${response.status}.`);
  return parseRss(await response.text()).slice(0, 12);
}

function parseRss(xml: string): NewsArticle[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].flatMap((match) => {
    const item = match[1]; const title = readTag(item, 'title'); const url = readTag(item, 'link');
    if (!title || !url) return [];
    return [{ source: 'NHK NEWS WEB' as const, title, url, summary: readTag(item, 'description'), publishedAt: readTag(item, 'pubDate') }];
  });
}
function readTag(xml: string, tag: string) {
  const raw = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1] ?? '';
  return raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
}
