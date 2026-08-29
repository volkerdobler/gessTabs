import { expect } from 'chai';
import {
  KeywordEntry,
  KEYWORD_LANGUAGES,
  DEFAULT_KEYWORD_LANGUAGE,
  keywordLookupKey,
  keywordLookupKeyAt,
  resolveKeywordLanguage,
  buildResolvedIndex,
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

describe('resolveKeywordLanguage', () => {
  it('honors any explicit KEYWORD_LANGUAGES setting regardless of the env language', () => {
    expect(resolveKeywordLanguage('de', 'en-US')).to.equal('de');
    expect(resolveKeywordLanguage('en', 'de')).to.equal('en');
    KEYWORD_LANGUAGES.forEach((lang) => {
      expect(resolveKeywordLanguage(lang, 'zz-ZZ')).to.equal(lang);
    });
  });

  it('falls back to the env language when the setting is not a known language ("auto")', () => {
    expect(resolveKeywordLanguage('auto', 'de')).to.equal('de');
    expect(resolveKeywordLanguage('auto', 'de-DE')).to.equal('de');
    expect(resolveKeywordLanguage('auto', 'en-US')).to.equal('en');
    expect(resolveKeywordLanguage('nonsense', 'de')).to.equal('de');
  });

  it('falls back to DEFAULT_KEYWORD_LANGUAGE when nothing matches', () => {
    expect(resolveKeywordLanguage('auto', 'fr')).to.equal(
      DEFAULT_KEYWORD_LANGUAGE
    );
    expect(resolveKeywordLanguage('auto', '')).to.equal(
      DEFAULT_KEYWORD_LANGUAGE
    );
    expect(DEFAULT_KEYWORD_LANGUAGE).to.equal('en');
  });
});

describe('buildResolvedIndex', () => {
  const entries: KeywordEntry[] = [
    {
      name: 'TABLE',
      syntax: 'TABLE = a BY b;',
      description: { de: 'Deutsche Beschreibung', en: 'English description' },
    },
    { name: '#MACRO', syntax: '', description: { de: '', en: 'only in English' } },
    { name: 'MEAN', syntax: '', description: { de: 'nur auf Deutsch', en: '' } },
    { name: 'EMPTY', syntax: '', description: { de: '', en: '' } },
  ];

  it('keys entries by their lookup key, keeping # and non-# forms distinct', () => {
    const index = buildResolvedIndex(entries, 'de');
    expect(index.has('table')).to.equal(true);
    expect(index.has('#macro')).to.equal(true);
  });

  it('flattens the primary language when the entry has it', () => {
    const index = buildResolvedIndex(entries, 'de');
    const table = index.get('table');
    expect(table?.description).to.equal('Deutsche Beschreibung');
    expect(table?.syntax).to.equal('TABLE = a BY b;');
  });

  it('carries the language-independent syntax through regardless of primary', () => {
    expect(buildResolvedIndex(entries, 'de').get('table')?.syntax).to.equal(
      'TABLE = a BY b;'
    );
    expect(buildResolvedIndex(entries, 'en').get('table')?.syntax).to.equal(
      'TABLE = a BY b;'
    );
  });

  it('falls back to the other language when the primary description is missing', () => {
    const index = buildResolvedIndex(entries, 'de');
    expect(index.get('#macro')?.description).to.equal('only in English');
  });

  it('uses the primary language when it is English', () => {
    const index = buildResolvedIndex(entries, 'en');
    expect(index.get('table')?.description).to.equal('English description');
    expect(index.get('mean')?.description).to.equal('nur auf Deutsch');
  });

  it('indexes an all-empty entry with an empty resolved description and syntax', () => {
    const index = buildResolvedIndex(entries, 'de');
    expect(index.has('empty')).to.equal(true);
    expect(index.get('empty')?.description).to.equal('');
    expect(index.get('empty')?.syntax).to.equal('');
  });

  it('carries argsHint through to the resolved entry', () => {
    const index = buildResolvedIndex(
      [
        {
          name: 'COLSUMPERCENT',
          argsHint: '( a b )',
          syntax: '',
          description: { de: 'x', en: '' },
        },
      ],
      'de'
    );
    expect(index.get('colsumpercent')?.argsHint).to.equal('( a b )');
  });
});
