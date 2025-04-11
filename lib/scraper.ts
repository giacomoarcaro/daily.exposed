import * as cheerio from 'cheerio';

interface ScrapedArticle {
  title: string;
  content: string;
  category: string;
  tags: string[];
  summary: string;
}

export async function scrapeArticle(url: string): Promise<ScrapedArticle> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Estrai il titolo
    const title = $('h1.entry-title').text().trim();

    // Estrai il contenuto
    const content = $(".entry-content")
      .html()
      ?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .trim() || "";

    // Estrai la categoria
    const category = $('.entry-categories a').first().text().trim();

    // Estrai i tag
    const tags = $('.entry-tags a')
      .map((_, el) => $(el).text().trim())
      .get();

    // Extract summary (first paragraph)
    const summary = $(".entry-content p").first().text().trim();

    return {
      title,
      content,
      category,
      tags,
      summary,
    };
  } catch (error) {
    console.error('Error scraping article:', error);
    throw new Error('Failed to scrape article');
  }
}

export async function getLatestArticles(): Promise<string[]> {
  try {
    const response = await fetch(process.env.BEHINDMLM_BASE_URL!);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Get all article URLs from the homepage
    const articleUrls = $('h2.entry-title a')
      .map((_, el) => $(el).attr('href'))
      .get()
      .filter((url): url is string => typeof url === 'string');

    return articleUrls;
  } catch (error) {
    console.error('Error getting latest articles:', error);
    throw new Error('Failed to get latest articles');
  }
} 