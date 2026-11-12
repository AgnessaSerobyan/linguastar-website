// Runs after the client and server builds (see "build" in package.json).
// 1. Renders the landing page into dist/client/index.html, so crawlers that
//    don't run scripts can read its text.
// 2. Writes robots.txt and sitemap.xml with the site's absolute address.
import { readFileSync, writeFileSync } from "node:fs";

const clientDir = new URL("../dist/client/", import.meta.url);
const { render } = await import(new URL("../dist/server/entry-server.js", import.meta.url));

const indexFile = new URL("index.html", clientDir);
const html = readFileSync(indexFile, "utf8");
const emptyRoot = '<div id="root"></div>';
if (!html.includes(emptyRoot)) throw new Error(`prerender: ${emptyRoot} not found in index.html`);
writeFileSync(indexFile, html.replace(emptyRoot, () => `<div id="root">${render()}</div>`));

// The canonical tag already holds the address the build was made for (vite.config.mjs).
const siteUrl = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
if (!siteUrl) throw new Error("prerender: canonical address not found in index.html");

// Indexable pages only; /privacypolicy/ and /termsandconditions/ are redirects.
const pages = ["", "download.html", "support/", "privacy-policy.html", "terms-and-conditions.html"];
writeFileSync(
  new URL("sitemap.xml", clientDir),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${siteUrl}${page}</loc></url>`).join("\n")}
</urlset>
`,
);
writeFileSync(new URL("robots.txt", clientDir), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);

console.log(`prerender: index.html, robots.txt and sitemap.xml written for ${siteUrl}`);
