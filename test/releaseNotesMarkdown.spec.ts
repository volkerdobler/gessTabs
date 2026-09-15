import { expect } from 'chai';
import { renderReleaseNotesMarkdown } from '../src/core/releaseNotesMarkdown';

describe('renderReleaseNotesMarkdown', () => {
  it('renders a heading with a slugified id', () => {
    expect(renderReleaseNotesMarkdown('# Title')).to.equal(
      '<h1 id="title">Title</h1>'
    );
    expect(renderReleaseNotesMarkdown('## Sub')).to.equal(
      '<h2 id="sub">Sub</h2>'
    );
    expect(renderReleaseNotesMarkdown('### SubSub')).to.equal(
      '<h3 id="subsub">SubSub</h3>'
    );
  });

  it("slugifies a heading's non-alphanumeric characters into hyphens", () => {
    expect(renderReleaseNotesMarkdown("## What's New in Version 1.0.0")).to.equal(
      '<h2 id="what-s-new-in-version-1-0-0">What\'s New in Version 1.0.0</h2>'
    );
  });

  it('disambiguates two headings that slugify to the same id', () => {
    const md = '## Notes\n\n## Notes';
    expect(renderReleaseNotesMarkdown(md)).to.equal(
      '<h2 id="notes">Notes</h2>\n<h2 id="notes-2">Notes</h2>'
    );
  });

  it('renders a bullet list, grouping consecutive bullets into one <ul>', () => {
    const md = '- one\n- two\n- three';
    expect(renderReleaseNotesMarkdown(md)).to.equal(
      '<ul><li>one</li><li>two</li><li>three</li></ul>'
    );
  });

  it('accepts "*" as a bullet marker too', () => {
    expect(renderReleaseNotesMarkdown('* only')).to.equal('<ul><li>only</li></ul>');
  });

  it('reflows a multi-line paragraph onto one <p>', () => {
    const md = 'line one\nline two';
    expect(renderReleaseNotesMarkdown(md)).to.equal('<p>line one line two</p>');
  });

  it('separates blocks on blank lines', () => {
    const md = '# Title\n\npara one\n\n- a\n- b\n\npara two';
    expect(renderReleaseNotesMarkdown(md)).to.equal(
      '<h1 id="title">Title</h1>\n<p>para one</p>\n<ul><li>a</li><li>b</li></ul>\n<p>para two</p>'
    );
  });

  it('renders inline **bold**, `code`, and [links](url)', () => {
    const md = 'a **bold** word, some `code`, and a [link](https://example.com)';
    expect(renderReleaseNotesMarkdown(md)).to.equal(
      '<p>a <strong>bold</strong> word, some <code>code</code>, and a <a href="https://example.com">link</a></p>'
    );
  });

  it('does not let a lone "*" inside one code span pair up with one inside another', () => {
    // Each code span has its own unpaired "*" (a glob pattern) — without
    // protecting code spans first, the italic pattern greedily matches
    // from the first "*" to the second, swallowing the backticks between
    // them into a single bogus <em>.
    const md = 'patterns: `main*.tab`, `*.tab`';
    expect(renderReleaseNotesMarkdown(md)).to.equal(
      '<p>patterns: <code>main*.tab</code>, <code>*.tab</code></p>'
    );
  });

  it('renders inline *italic*, distinct from **bold**', () => {
    expect(renderReleaseNotesMarkdown('an *italic* word')).to.equal(
      '<p>an <em>italic</em> word</p>'
    );
    expect(renderReleaseNotesMarkdown('**bold** and *italic*')).to.equal(
      '<p><strong>bold</strong> and <em>italic</em></p>'
    );
  });

  it('escapes raw HTML-significant characters before applying inline markup', () => {
    const md = 'IF v1 IS MULTIQ THEN a<b & c>d';
    expect(renderReleaseNotesMarkdown(md)).to.equal(
      '<p>IF v1 IS MULTIQ THEN a&lt;b &amp; c&gt;d</p>'
    );
  });

  it('escapes HTML inside a heading and a list item too', () => {
    expect(renderReleaseNotesMarkdown('# a < b')).to.equal(
      '<h1 id="a-b">a &lt; b</h1>'
    );
    expect(renderReleaseNotesMarkdown('- a < b')).to.equal(
      '<ul><li>a &lt; b</li></ul>'
    );
  });

  it('ignores blank lines between paragraphs and lists entirely', () => {
    expect(renderReleaseNotesMarkdown('\n\npara\n\n\n')).to.equal('<p>para</p>');
  });

  it('returns an empty string for empty input', () => {
    expect(renderReleaseNotesMarkdown('')).to.equal('');
  });
});
