// A deliberately small Markdown-to-HTML renderer for the release-notes
// webview (src/providers/releaseNotesProvider.ts) — not a general
// CommonMark engine, just the handful of constructs a release-notes file
// actually uses: headings, bullet lists, paragraphs, and inline
// **bold**/`code`/[links](url). Kept in its own pure module (no vscode
// import) so it's unit-testable like the rest of this codebase's parsers.
//
// Every raw text run is HTML-escaped before any markup is applied, so
// literal `<`/`>`/`&` in release notes (e.g. "IF v1 IS MULTIQ THEN") can
// never be misread as real tags, and the inline patterns below only ever
// introduce tags this module itself controls.

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Applied to already-escaped text, so the only "<"/">" characters present
// are the ones these patterns introduce themselves.
function renderInline(escaped: string): string {
  return escaped
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function renderInlineText(raw: string): string {
  return renderInline(escapeHtml(raw));
}

const headingRe = /^(#{1,3})\s+(.*)$/;
const bulletRe = /^[-*]\s+(.*)$/;

export function renderReleaseNotesMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().length === 0) {
      i += 1;
      continue;
    }

    const heading = line.match(headingRe);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${renderInlineText(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (bulletRe.test(line)) {
      const items: string[] = [];
      while (i < lines.length && bulletRe.test(lines[i])) {
        const m = lines[i].match(bulletRe) as RegExpMatchArray;
        items.push(`<li>${renderInlineText(m[1])}</li>`);
        i += 1;
      }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // Paragraph: a run of non-blank, non-heading, non-bullet lines,
    // reflowed onto one line the way a Markdown viewer would.
    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim().length > 0 &&
      !headingRe.test(lines[i]) &&
      !bulletRe.test(lines[i])
    ) {
      paragraph.push(lines[i]);
      i += 1;
    }
    html.push(`<p>${renderInlineText(paragraph.join(' '))}</p>`);
  }

  return html.join('\n');
}
