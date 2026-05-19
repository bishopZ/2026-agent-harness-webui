/**
 * Rewrite relative .md hrefs in rendered HTML to in-app /doc?path= routes.
 *
 * Rules:
 * - href starting with http:// or https:// → leave unchanged
 * - href ending with .md (or .md#anchor, or .md?query) → rewrite to /doc?path=...
 * - all other hrefs (anchors, non-md links) → leave unchanged
 */
export function rewriteMarkdownLinks(html: string): string {
  // Match href="..." or href='...' in anchor tags
  return html.replace(
    /href=["']([^"']+)["']/g,
    (_match, href: string) => {
      // Leave absolute URLs unchanged
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
        return `href="${href}"`;
      }
      // Leave anchors and non-.md links unchanged
      if (href.startsWith('#')) {
        return `href="${href}"`;
      }
      // Rewrite .md links (possibly with fragment or query string)
      const mdPattern = /^([^?#]+\.md)([?#].*)?$/;
      const mdMatch = href.match(mdPattern);
      if (mdMatch) {
        const mdPath = mdMatch[1];
        const rest = mdMatch[2] ?? '';
        return `href="/doc?path=${encodeURIComponent(mdPath)}${rest}"`;
      }
      // Leave everything else unchanged
      return `href="${href}"`;
    }
  );
}
