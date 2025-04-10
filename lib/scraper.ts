import * as cheerio from 'cheerio';

interface ScrapedArticle {
  title: string;
  content: string;
  publishedAt: Date;
  sourceUrl: string;
  category: string;
  tags: string[];
}

export async function scrapeBehindMLM(url: string): Promise<ScrapedArticle> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract title
    const title = $('h1.entry-title').text().trim();

    // Extract content
    const content = $('.entry-content')
      .clone()    // Clone the element
      .children() // Select all children
      .remove()   // Remove all children
      .end()      // Go back to selected element
      .text()     // Get the text content
      .trim();    // Remove whitespace

    // Extract date
    const dateStr = $('.entry-date').first().attr('datetime') || '';
    const publishedAt = new Date(dateStr);

    // Extract categories
    const category = $('.cat-links a').first().text().trim() || 'Uncategorized';

    // Extract tags
    const tags = $('.tags-links a')
      .map((_, el) => $(el).text().trim())
      .get();

    return {
      title,
      content,
      publishedAt,
      sourceUrl: url,
      category,
      tags,
    };
  } catch (error) {
    console.error('Error scraping BehindMLM:', error);
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