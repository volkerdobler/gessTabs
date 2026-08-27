import { expect } from 'chai';
import {
  keywordLookupKey,
  keywordLookupKeyAt,
  buildKeywordIndex,
  applyKeywordOverrides,
  resolveKeywordLanguage,
  buildIndexWithFallback,
} from '../src/keywordDatabaseTypes';

describe('keywordLookupKey', () => {
  it('lowercases but keeps a leading # (distinct from the bare name)', () => {
    expect(keywordLookupKey('TABLEFORMAT')).to.equal('tableformat');
    expect(keywordLookupKey('#MACRO')).to.equal('#macro');
    expect(keywordLookupKey('END')).to.equal('end');
    expect(keywordLookupKey('#END')).to.equal('#end');
  });
});

describe('keywordLookupKeyAt', () => {
  it('reinstates the # when the word is immediately preceded by one', () => {
    const line = 'compute x = 1; #END';
    const wordStart = line.indexOf('END');
    expect(keywordLookupKeyAt(line, wordStart, 'END')).to.equal('#end');
  });

  it('does not add a # for a plain word', () => {
    const line = 'END;';
    expect(keywordLookupKeyAt(line, 0, 'END')).to.equal('end');
  });

  it('does not add a # when the word is at the very start of the line', () => {
    expect(keywordLookupKeyAt('END', 0, 'END')).to.equal('end');
  });
});

describe('buildKeywordIndex', () => {
  it('keys entries by their lookup key, keeping # and non-# forms distinct', () => {
    const index = buildKeywordIndex([
      { name: 'END', description: 'ends the script', source: 'x:1' },
      { name: '#END', description: 'closes a preprocessor block', source: 'x:2' },
    ]);
    expect(index.get('end')?.description).to.equal('ends the script');
    expect(index.get('#end')?.description).to.equal('closes a preprocessor block');
  });
});

describe('applyKeywordOverrides', () => {
  const base = [
    { name: 'MAX', description: 'garbled extracted text', source: 'x:1' },
    { name: 'EQ', description: 'Equal, ist gleich', source: 'x:2' },
  ];

  it('replaces only the fields an override sets, keeping the rest', () => {
    const merged = applyKeywordOverrides(base, [
      { name: 'MAX', description: 'Der Maximalwert einer Variablen.' },
    ]);
    const entry = merged.find((e) => e.name === 'MAX');
    expect(entry?.description).to.equal('Der Maximalwert einer Variablen.');
    expect(entry?.source).to.equal('x:1');
  });

  it('leaves an entry with no matching override untouched', () => {
    const merged = applyKeywordOverrides(base, [
      { name: 'MAX', description: 'corrected' },
    ]);
    const entry = merged.find((e) => e.name === 'EQ');
    expect(entry?.description).to.equal('Equal, ist gleich');
  });

  it('adds a brand new entry for a name with no existing match', () => {
    const merged = applyKeywordOverrides(base, [
      { name: '#MACRO', syntax: '#MACRO #<name>( &param )', description: 'defines a macro' },
    ]);
    const entry = merged.find((e) => e.name === '#MACRO');
    expect(entry?.syntax).to.equal('#MACRO #<name>( &param )');
    expect(entry?.source).to.equal('manual override');
  });

  it('removes an entry entirely when remove is true', () => {
    const merged = applyKeywordOverrides(base, [{ name: 'MAX', remove: true }]);
    expect(merged.find((e) => e.name === 'MAX')).to.be.undefined;
    expect(merged.find((e) => e.name === 'EQ')).to.exist;
  });

  it('matches case-insensitively, keeping # and non-# forms distinct', () => {
    const merged = applyKeywordOverrides(
      [{ name: 'END', description: 'old', source: 'x:1' }],
      [{ name: 'end', description: 'new' }]
    );
    expect(merged[0].description).to.equal('new');
  });
});

describe('resolveKeywordLanguage', () => {
  it('honors an explicit "de" or "en" setting regardless of the env language', () => {
    expect(resolveKeywordLanguage('de', 'en-US')).to.equal('de');
    expect(resolveKeywordLanguage('en', 'de')).to.equal('en');
  });

  it('falls back to the env language when set to "auto"', () => {
    expect(resolveKeywordLanguage('auto', 'de')).to.equal('de');
    expect(resolveKeywordLanguage('auto', 'de-DE')).to.equal('de');
  });

  it('defaults to English for any non-German env language', () => {
    expect(resolveKeywordLanguage('auto', 'en-US')).to.equal('en');
    expect(resolveKeywordLanguage('auto', 'fr')).to.equal('en');
  });
});

describe('buildIndexWithFallback', () => {
  const de = [{ name: 'TABLE', description: 'Deutsche Beschreibung', source: 'x:1' }];
  const en = [
    { name: 'TABLE', description: 'English description', source: 'y:1' },
    { name: '#MACRO', description: 'only in English', source: 'y:2' },
  ];

  it('prefers the primary language when both have the keyword', () => {
    const index = buildIndexWithFallback(de, en);
    expect(index.get('table')?.description).to.equal('Deutsche Beschreibung');
  });

  it('falls back to the other language when the primary is missing it', () => {
    const index = buildIndexWithFallback(de, en);
    expect(index.get('#macro')?.description).to.equal('only in English');
  });
});
