// Hand-maintained corrections for the mechanically-extracted German
// keyword database (src/keywordDatabase.de.ts). This file is NEVER
// touched or overwritten by scripts/extractKeywordDatabase.ts — edit it
// directly and your changes survive re-running the extraction at any
// time. See src/keywordDatabaseOverrides.en.ts for the English database's
// equivalent.
//
// Each entry is matched against the generated database by `name`
// (case-insensitively; keep a leading '#' for preprocessor directives,
// since "#END" and "END" are different keywords — see
// src/keywordDatabaseTypes.ts's keywordLookupKey for why).
//
//   { name: 'EXISTINGKEYWORD', description: 'A corrected description.' }
//     -> only the fields you set are replaced; anything you omit keeps
//        the mechanically-extracted value.
//
//   { name: 'NEWKEYWORD', syntax: '...', description: '...' }
//     -> if no entry with this name exists yet, this adds a brand new
//        one (useful for a real keyword the extraction missed entirely,
//        e.g. #MACRO/#EXPAND below — their own syntax is written in
//        lowercase example code in the manuals, not the ALL-CAPS
//        "Syntax:" grammar block shape the extractor looks for).
//
//   { name: 'BADKEYWORD', remove: true }
//     -> drops a bad/garbled extracted entry entirely (other fields are
//        ignored when remove is true).
//
// After editing, just reload the extension (or restart the "Extension
// Development Host") to see the change — no rebuild step, no need to
// re-run npm run extract-keywords.

import { KeywordOverride } from './keywordDatabaseTypes';

export const keywordDatabaseOverridesDe: KeywordOverride[] = [
  {
    name: '#MACRO',
    syntax: '#MACRO #<name>( <&param> ... )\n<macroinhalt>\n#ENDMACRO',
    description:
      'Definiert ein Macro: an jeder Aufrufstelle #<name>(...) wird der Macroinhalt eingesetzt, wobei &param-Platzhalter durch die übergebenen Argumente ersetzt werden (GESStabs_Makros.md).',
  },
  {
    name: '#EXPAND',
    syntax: '#EXPAND #<name> <Wert>',
    description:
      'Definiert einen Textplatzhalter: ein späteres #<name> (ohne Klammern) wird durch <Wert> ersetzt.',
  },
  {
    name: 'TABLE',
    syntax:
      'TABLE [ taboptions ] = <parts> BY <parts>;\ntaboptions ::=\n[\nADD\nNAME <tablename>\nTITLE <tabletitle>\nCELLELEMENTS ( <cellelements> )\nFRAMEELEMENTS ( <frameelements> )\nTABLEFORMATS ( <tableformats> )\nCONTENTKEY <contentkey>\nHIDDEN ( <medium> )\n]\n\nparts ::= part { part }*n\npart ::= content [ filter ] [ option ]\n\ncontent ::=\n[\n<constant> |\n<varname> |\n<cellelement> ( <varname> [ <varname> ] ) |\n<cellelement> ( <varname> [ <varname> ] BY <varname> )\n:DESCRIPTION\n:USEVARTITLE\n:FORMAT\n] \n\nfilter ::= FILTER <bedingung> |\n\noption ::= SORT sortcontent [ sortpane ] [ cut ]\n\nsortcontent ::= sorttype [ DESCEND ]\nsorttype ::= [ POSITION | ALPHA | CODE | Cellelement ]\nsortpane ::= PANE <value> CODE <value>\n\ncut ::=\n[\nTOP <value > [ SLICE <value> ] |\nBOTTOM <value> |\nEXTREME <value> |\nSLICE <value> |\nLSLICE <value> |\nRANGE <value> <value>\n]',
    description: '',
  },
];
