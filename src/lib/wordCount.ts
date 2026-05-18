export const POST_BODY_WORD_LIMIT = 1000;

export function getPlainTextFromHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export function countWords(value: string) {
  const words = value.trim().match(/\S+/g);

  return words?.length ?? 0;
}

export function countHtmlWords(html: string) {
  return countWords(getPlainTextFromHtml(html));
}
