import { expect } from 'chai';
import { renderReleaseNotesMarkdown } from '../src/core/releaseNotesMarkdown';

describe('renderReleaseNotesMarkdown', () => {
  it('renders a heading', () => {
    expect(renderReleaseNotesMarkdown('# Title')).to.equal('<h1>Title</h1>');
    expect(renderReleaseNotesMarkdown('## Sub')).to.equal('<h2>Sub</h2>');
    expect(renderReleaseNotesMarkdown('### SubSub')).to.equal('<h3>SubSub</h3>');
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
      '<h1>Title</h1>\n<p>para one</p>\n<ul><li>a</li><li>b</li></ul>\n<p>para two</p>'
    );
  });

  it('renders inline **bold**, `code`, and [links](url)', () => {
    const md = 'a **bold** word, some `code`, and a [link](https://example.com)';
    expect(renderReleaseNotesMarkdown(md)).to.equal(
      '<p>a <strong>bold</strong> word, some <code>code</code>, and a <a href="https://example.com">link</a></p>'
    );
  });

  it('escapes raw HTML-significant characters before applying inline markup', () => {
    const md = 'IF v1 IS MULTIQ THEN a<b & c>d';
    expect(renderReleaseNotesMarkdown(md)).to.equal(
      '<p>IF v1 IS MULTIQ THEN a&lt;b &amp; c&gt;d</p>'
    );
  });

  it('escapes HTML inside a heading and a list item too', () => {
    expect(renderReleaseNotesMarkdown('# a < b')).to.equal('<h1>a &lt; b</h1>');
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
