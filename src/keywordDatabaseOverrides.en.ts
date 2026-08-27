// Hand-maintained corrections for the mechanically-extracted English
// keyword database (src/keywordDatabase.en.ts). This file is NEVER
// touched or overwritten by scripts/extractKeywordDatabase.ts — edit it
// directly and your changes survive re-running the extraction at any
// time. See src/keywordDatabaseOverrides.de.ts for the format this
// follows and the German database's equivalent.

import { KeywordOverride } from './keywordDatabaseTypes';

export const keywordDatabaseOverridesEn: KeywordOverride[] = [
  {
    name: '#MACRO',
    syntax: '#MACRO #<name>( <&param> ... )\n<macro content>\n#ENDMACRO',
    description:
      'Defines a macro: every call site #<name>(...) is replaced by the macro content, with &param placeholders substituted by the arguments passed at the call.',
  },
  {
    name: '#EXPAND',
    syntax: '#EXPAND #<name> <value>',
    description:
      'Defines a text placeholder: a later bare #<name> (without parentheses) is replaced by <value>.',
  },
  {
    name: 'TABLE',
    description:
      'The main keyword for cross tables. In its simplest form: TABLE = <var1> BY <var2>; where <var1> is the header variable and <var2> is the variable for the side breakdown.',
  },
];
