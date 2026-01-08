import express from 'express';
import { load } from 'cheerio';

const router = express.Router();

// GET /api/debates
// Fetch the external debates listing page and extract debate links (id + title)
router.get('/debates', async (req, res, next) => {
  try {
    const url = 'https://filhaal.vercel.app/debates';
    const resp = await globalThis.fetch(url, { headers: { 'User-Agent': 'filhaal-proxy/1.0' } });
    if (!resp.ok) return res.status(502).json({ error: 'Failed to fetch source debates page' });

    const html = await resp.text();
    const $ = load(html);

    const items = [];
    // Find anchors that link to /debates/<id> and collect title + id
    $('a[href*="/debates/"]').each((i, el) => {
      const href = $(el).attr('href') || '';
      try {
        const u = new URL(href, url);
        if (!u.pathname.startsWith('/debates/')) return;
        const id = u.pathname.replace('/debates/', '').replace(/\/$/, '');
        const title = $(el).text().trim() || $(el).attr('title') || id;
        // avoid duplicates
        if (!items.find((it) => it.id === id)) {
          items.push({ id, title, sourceUrl: u.href });
        }
      } catch (e) {
        // ignore invalid urls
      }
    });

    return res.json({ items });
  } catch (err) {
    next(err);
  }
});

// GET /api/debate?id=<id>
// Fetch a debate detail page and try to extract an embeddable PDF URL + title
router.get('/debate', async (req, res, next) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'Missing id parameter' });

    const url = `https://filhaal.vercel.app/debates/${encodeURIComponent(id)}`;
    const resp = await globalThis.fetch(url, { headers: { 'User-Agent': 'filhaal-proxy/1.0' } });
    if (!resp.ok) return res.status(502).json({ error: 'Failed to fetch source page' });

    const html = await resp.text();
    const $ = load(html);

    let pdfUrl = '';
    const iframe = $('iframe[src]').first();
    if (iframe && iframe.attr('src')) pdfUrl = iframe.attr('src');

    if (!pdfUrl) {
      const anchor = $('a[href$=".pdf"]').first();
      if (anchor && anchor.attr('href')) pdfUrl = anchor.attr('href');
    }

    if (!pdfUrl) {
      const anyPdf = $('[src*=".pdf"], a[href*=".pdf"]').first();
      if (anyPdf && (anyPdf.attr('src') || anyPdf.attr('href'))) pdfUrl = anyPdf.attr('src') || anyPdf.attr('href');
    }

    if (pdfUrl && pdfUrl.startsWith('/')) {
      const origin = new URL(url).origin;
      pdfUrl = origin + pdfUrl;
    }

    const title = $('h1, h2, h3').first().text().trim() || $('title').text().trim() || '';

    return res.json({ id, pdfUrl: pdfUrl || null, title, sourceUrl: url });
  } catch (err) {
    next(err);
  }
});

export default router;
