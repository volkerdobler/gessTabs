// Keyword database for the F1 keyword hover and keyword-completion
// providers (src/keywordProviders.ts).
//
// Hand-maintained. Originally mechanically extracted from the GESStabs
// manuals (see git history and scripts/extractKeywordDatabase.ts, now
// deprecated); the manuals are moving online and will not be re-extracted,
// so this file is edited directly from here on.
//
// One entry per keyword: { name, argsHint?, de?, en? }, each language block
// being { description, syntax? }. Names are language-independent (GESStabs
// syntax doesn't translate); only the `de` / `en` blocks differ. An entry
// may carry only one language's block — the providers fall back to the
// other. The German descriptions had their umlauts/ß destroyed (replaced
// with U+FFFD) by the manuals' original PDF-to-markdown conversion and were
// reconstructed by hand; other conversion artifacts (page numbers embedded
// mid-sentence, the odd truncated sentence) may still be present — fix them
// in place as you come across them.

import { KeywordEntry } from './keywordDatabaseTypes';

export const keywordData: KeywordEntry[] = [
  {
    name: '#DEFINE',
    de: {
      description:
        'Mithilfe von Funktionen, die zur Gruppe der Defines gehören, können über Mechanismen des "Conditional Compiling" mehrere Varianten eines Tabellenprogramms in einer Quelle verwaltet und ausgeführt werden:\nMit #DEFINE können beliebige Namen vereinbart werden, die dann als Abkürzungen für den DEFINE-Inhalt geführt werden können.\n\n#DEFINEs kann man nicht nur in der Quelle definieren, sondern einen #DEFINE-String auch über die Kommandozeile mit der Option "-D" als Parameter übergeben.\n\nZum Beispiel: "GTC xyz.TAB -Dascii" übergibt den String »ascii« zur Definition.',
      syntax: '#DEFINE <string>',
    },
    en: {
      description:
        'Using functions from the group of defines, several variants of a table program can be maintained and run from a single source through "conditional compiling" mechanisms:\nWith #DEFINE, arbitrary names can be declared that can then be used as abbreviations for the DEFINE content.\n\n#DEFINEs can be defined not only in the source but also passed as a #DEFINE string on the command line with the "-D" option as a parameter.\n\nFor example: "GTC xyz.TAB -Dascii" passes the string »ascii« as a definition.',
      syntax: '#DEFINE <string>',
    },
  },
  {
    name: '#DOMACRO',
    argsHint: '( <Macroname> <Schleifenliste> )',
    de: {
      description: 'Beispiel: #tab( 1 ) #tab( 2 ) #tab( 3 ) kann man als',
      syntax: '#DOMACRO( <Macroname> <Schleifenliste> )',
    },
    en: {
      description: 'Example: #tab( 1 ) #tab( 2 ) #tab( 3 ) can be written as',
      syntax: '#DOMACRO( <macroname> <looplist> )',
    },
  },
  {
    name: '#DOMACRO2',
    argsHint: '( <Macroname> <Schleifenliste> ; <weitere parameter> )',
    de: {
      description: '#DoMacro2 ist eine Erweiterung des #DOMACRO. Beispiel:',
      syntax: '#DOMACRO2( <Macroname> <Schleifenliste> ; <weitere parameter> )',
    },
    en: {
      description: '#tab( 1 ) #tab( 2 ) #tab( 3 ) can be shortened to',
      syntax: '#DOMACRO2( <Macroname> <Schleifenliste> ; <weitere parameter> )',
    },
  },
  {
    name: '#DOMACRO3',
    argsHint: '( <macroname> <filename> )',
    de: {
      description:
        'Wie #DOMACRO und #DOMACRO2 dient das #DOMACRO3-Statement der wiederholten Abarbeitung von Macros. Die Macro-Parameter werden hierbei aus einer CSV-Datei entnommen, die am einfachsten mit einem Tabellenverarbeitungsprogramm erzeugt werden kann. Dadurch bietet es eine Schnittstelle zu MitarbeiterInnen, die nicht im Scripting versiert sind.…',
      syntax: '#DOMACRO3 ( <macroname> <filename> )',
    },
    en: {
      description:
        'Like #DOMACRO and #DOMACRO2, the #DOMACRO3 statement serves the repeated processing of macros. The macro parameters are taken from a CSV file, which is most easily created with a spreadsheet program. This provides an interface for staff who are not experienced in scripting.…',
      syntax: '#DOMACRO3 ( <macroname> <filename> )',
    },
  },
  {
    name: '#DOMACRO4',
    argsHint: '( <filename> )',
    de: {
      description:
        'Einen ähnlichen Hintergrund hat auch das #DOMACRO4-Statement. Der Unterschied ist, dass der Name des Macros nicht im Script festgelegt wird, sondern als erstes Feld in der CSV-Datei benannt wird. Der Aufruf',
      syntax: '#DOMACRO4 ( <filename> )',
    },
    en: {
      description:
        'The #DOMACRO4 statement has a similar background. The difference is that the name of the macro is not fixed in the script but is given as the first field in the CSV file. The call',
      syntax: '#DOMACRO4 ( <filename> )',
    },
  },
  {
    name: '#ELSE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: '#END',
    de: {
      description:
        'so würde abweichend vom normalen Ablauf eine ASCII-Druckdatei erzeugt. #IfDef und #IfNDef Mit #IFDEF bzw. #IFNDEF kann man abfragen, ob ein Name definiert ist oder nicht. Alle GESStabs-Quellzeilen und alle #DEFINE bzw. #UNDEFINE-Statements zwischen dem #IFDEF bzw. #IFNDEF und dem schließenden #END werden in Abhängigkeit vom Wahrheitswert dieses Tests durchgeführt.…',
    },
    en: {
      description:
        'Pre-processor commands are processed before the GESS tabs program is translated into its internal form. Using #DEFINE names are chosen which then are taken as defined; using #UNDEFINE they can be deleted. Using #IFDEF or #IFNDEF GESS tabs checks whether a name has been defined or not.…',
    },
  },
  {
    name: '#ENDEXPORT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: '#ENDMACRO',
    de: { description: 'kann man es anschließend beliebig oft aufrufen:' },
    en: { description: 'it can be called up as often as required:' },
  },
  {
    name: '#EXPAND',
    de: {
      description:
        'Definiert einen Textplatzhalter: ein späteres #<name> (ohne Klammern) wird durch <Wert> ersetzt.',
      syntax: '#EXPAND #<name> <Wert>',
    },
    en: {
      description:
        'Defines a text placeholder: a later bare #<name> (without parentheses) is replaced by <value>.',
      syntax: '#EXPAND #<name> <value>',
    },
  },
  {
    name: '#EXPANDINC',
    de: {
      description: '',
      syntax:
        '#EXPANDINC #<Name des Expands> <Wert>\nIm Kern ist dies ein #EXPAND. Das Argument <value> muss aber eine ganze Zahl sein, aus',
    },
    en: {
      description: '',
      syntax:
        '#EXPANDINC #<name of the expand> <value>\nAt its core this is an #EXPAND. The argument <value> must, however, be a whole number, from',
    },
  },
  {
    name: '#EXPANDINTOKEN',
    de: {
      description: '',
      syntax:
        '#EXPANDINTOKEN &<search>& <replace>\n<search> ::= zu ersetzender text\n<replace> ::= einzufügender text',
    },
    en: {
      description: '',
      syntax:
        '#EXPANDINTOKEN &<search>& <replace>\n<search> ::= text to be replaced\n<replace> ::= text to be inserted',
    },
  },
  {
    name: '#IFDEF',
    de: {
      description: '',
      syntax: '#IFDEF <Define-Name>\n<Syntax-Statement 1>',
    },
    en: {
      description: '',
      syntax: '#IFDEF <define name>\n<syntax statement 1>',
    },
  },
  {
    name: '#IFEMPTY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: '#IFEXIST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: '#IFNDEF',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: '#IFNEMPTY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: '#IFNEXIST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: '#IGNORECASE',
    de: { description: '', syntax: '#IGNORECASE = [ YES | NO ] ;' },
    en: { description: '', syntax: '#IGNORECASE = [ YES | NO ] ;' },
  },
  {
    name: '#MACRO',
    de: {
      description:
        'Definiert ein Macro: an jeder Aufrufstelle #<name>(...) wird der Macroinhalt eingesetzt, wobei &param-Platzhalter durch die übergebenen Argumente ersetzt werden (GESStabs_Makros.md).',
      syntax: '#MACRO #<name>( <&param> ... )\n<macroinhalt>\n#ENDMACRO',
    },
    en: {
      description:
        'Defines a macro: every call site #<name>(...) is replaced by the macro content, with &param placeholders substituted by the arguments passed at the call.',
      syntax: '#MACRO #<name>( <&param> ... )\n<macro content>\n#ENDMACRO',
    },
  },
  {
    name: '#MACROEND',
    de: { description: 'Beendet eine Macro-Definition', syntax: '#MACROEND' },
    en: { description: 'Closed a macro definition', syntax: '#MACROEND' },
  },
  {
    name: '#UNDEFINE',
    de: {
      description:
        'Gesetzte #DEFINE Steuerelemente können damit wieder zurückgenommen werden.',
      syntax: '#UNDEFINE <string>',
    },
    en: { description: '', syntax: '#UNDEFINE <string>' },
  },
  {
    name: '#WEIGHT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: '#WEIGHTEND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ABANDON',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ABANDONFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ABANDONOPENFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ABS',
    en: {
      description:
        'DAYOFWEEK The day of the week in a date in the form YYYYMMDD 1=Monday, 2=Tuesday etc Thus e.g. DAYOFWEEK( 20061030 ) = 1. DAYOFWEEK( 0 ) is today.',
    },
  },
  {
    name: 'ABSCOLINHG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ABSCOLPERCENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ABSCOLUMN',
    de: {
      description:
        'PHYSICALCOLUMN. Im Standardfall einer Tabelle mit absoluten Häufigkeiten ist von den sechs Rahmenelementen nur eines vorhanden: die Zeile mit den absoluten Häufigkeiten, ABSROW. In unserem Fall sollen in den Zellen Spaltenprozente abgebildet werden, das heißt als CELLELEMENTS wählen wir COLUMNPERCENT. Dazu passen eine Totalspalte und eine Absolutzeile.…',
    },
    en: {
      description:
        'PHYSICALCOLUMN. In the default case of a table with absolute frequencies, only one of the six frame elements is present: the row with the absolute frequencies, ABSROW. In our case column percentages are to be shown in the cells, i.e. we choose COLUMNPERCENT as CELLELEMENTS. A total column and an absolute row fit with that.…',
      syntax: '',
    },
  },
  {
    name: 'ABSINLABEL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ABSINLABELBOX',
    de: {
      description:
        'Drucke die ABSROW 417 nicht wie üblich in einem eigenen Kasten, sondern drucke die Werte am unteren Rand der Labelkästchen.',
    },
    en: {
      description:
        'Prints the ABSOLUTEROW at the lower frame of the label box instead of as it is usually in its own box.',
    },
  },
  {
    name: 'ABSMEAN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ABSMEANSUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ABSOLUTE',
    de: { description: 'Zahl der Fälle (Summe der Gewichte)' },
    en: { description: 'Number of cases (sum of weights)', syntax: '' },
  },
  {
    name: 'ABSROW',
    de: { description: 'Absolute Zahl der Nennungen/ Fälle in der Zeile' },
    en: {
      description: 'Absolute number of responses / cases in the row',
      syntax: '',
    },
  },
  {
    name: 'ABSROWINHG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ABSROWPERCENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ABSZERODASH',
    de: {
      description:
        'Im Standardfall wird die Null als Absolutwert als eine 0 dargestellt. Mit ABSZERODASH kann man erreichen, dass die Null in einem CELLELEMENT ABSOLUTE 419 als Dash („-“) dargestellt wird.',
    },
    en: {
      description:
        'Usually zero as an absolute value is represented with a "0". ABSZERODASH can be used to represent the zero in a CELLELEMENT ABSOLUTE as a dash (\'-\').',
    },
  },
  {
    name: 'ACCOUNT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ACROSS',
    de: {
      description:
        'Die atomaren Elemente von zusammengesetzten CELLELEMENTS werden in PS/PDF-Ausgabe nicht untereinander, sondern nebeneinander dargestellt.',
    },
    en: {
      description:
        'The atomic elements of composite CELLELEMENTS are shown side by side in PS/PDF output rather than one below the other.',
      syntax: '',
    },
  },
  {
    name: 'ADD',
    de: {
      description:
        "Editierung bestehender Labellisten, siehe ADD 212 Wird ein LABEL/OVERCODE an eine Position eingefügt, die so nicht 'exsitiert' (z.B. an POSTIION 5 in einer liste mit nur drei VALUELABELS, wird dieses Label einfach ans Listenende angehängt - so, als ob keine POSITION angegeben wäre.",
    },
    en: {
      description:
        "Editing of existing label lists, see ADD 212. If a LABEL/OVERCODE is inserted at a position that does not 'exist' this way (e.g. at POSITION 5 in a list with only three VALUELABELS), this label is simply appended to the end of the list — as if no POSITION had been given.",
      syntax: '',
    },
  },
  {
    name: 'ADDNAMETOVARTITLE',
    de: { description: '', syntax: 'ADDNAMETOVARTITLE = [ YES | NO ];' },
    en: { description: '', syntax: 'ADDNAMETOVARTITLE = [ YES | NO ];' },
  },
  {
    name: 'ADDOVERCODE',
    de: {
      description:
        'In der Regel werden OVERCODE 262s je Fall nur einmal gezählt, wenn mehrere der dazugehörenden Kategorien vorkommen, d.h. es wird ein logisches ODER gebildet. Mit ADDOVERCODE kann eine Addition der Einzelhäufigkeiten verlangt werden. AUTOOVERSORT 647 Sortiert die OVERCODE 262s einer Tabelle und bereitet die Labels für die Sortierung unterhalb der Overcodes vor.…',
    },
    en: {
      description:
        'Usually the OVERCODE is only tallied once per case if several of the relevant categories arise i.e. a logical OR is used. ADDOVERCODE requests the addition of the individual frequencies.',
    },
  },
  {
    name: 'ADDRESSBASE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ADDRSERVER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ADDSPLITS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ADOBELATIN1',
    en: { description: '', syntax: 'ADOBELATIN1;' },
  },
  {
    name: 'ADOBENAME',
    en: { description: '', syntax: 'ADOBENAME <char> = <name>;' },
  },
  {
    name: 'AFTER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'AGGR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALFA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALIGN',
    de: {
      description: '',
      syntax:
        'ALIGN <boxname> = { <hpos> | <vpos> }*n ;\n<hpos> = [ LEFT | RIGHT | HCENTER ] [ <number> ] [ TABULATOR <number> ]\n<vpos> = [ TOP | BOTTOM | VCENTER ] [ <number> ] [ TABULATOR <number> ]',
    },
    en: {
      description:
        '(PS): is ignored by line printers. The text in each box can be positioned vertically as well as horizontally. The following terms are required: TOP - VCENTER - BOTTOM and LEFT - HCENTER - RIGHT. Example: ALIGN LABELS X = HCENTER VCENTER; The terms LEFT and RIGHT can also contain a command for the distance to the edge of the box:…',
      syntax:
        'ALIGN <boxname> = { <hpos> | <vpos> }*n ;\n<hpos> = [ LEFT | RIGHT | HCENTER ] [ <number> ] [ TABULATOR <number> ]\n<vpos> = [ TOP | BOTTOM | VCENTER ] [ <number> ] [ TABULATOR <number> ]',
    },
  },
  {
    name: 'ALIGNALPHA',
    de: { description: '', syntax: 'ALIGNALPHA = [ LEFT | RIGHT ];' },
    en: { description: '', syntax: 'ALIGNALPHA = [ LEFT | RIGHT ];' },
  },
  {
    name: 'ALIGNDATA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALIGNLABELLEFT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALLOWALPHATEST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALLOWASYMMETRY',
    de: {
      description:
        'asymmetrische Ausgabe der Skala bei RISING/FALLING Analog zum TABLEFORMAT kann man die einzelnen Optionen ein- und ausschalten. Der 534 Zustand von GESSCHARTFORMAT gilt für alle danach stehenden Charts, bis ein weiteres GESSCHARTFORMAT dieses wieder ändert. Mit GESSCHARTFORMAT kann man immer nur alle entsprechenden Elemente beeinflussen.…',
    },
    en: {
      description:
        'asymmetric output of the scale with RISING/FALLING. As with TABLEFORMAT, the individual options can be switched on and off. The 534 state of GESSCHARTFORMAT applies to all charts that follow, until another GESSCHARTFORMAT changes it again. With GESSCHARTFORMAT you can only ever affect all corresponding elements at once.…',
      syntax: '',
    },
  },
  {
    name: 'ALLOWEMPTY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALLOWEXPANDINTOKEN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALLOWLINEFEED',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALLOWNOTEXTINVAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALLQUESTIONSASKED',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALLSIGNIFICANCE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALPHA',
    de: { description: '', syntax: 'ALPHA <varlist> = YES;' },
    en: {
      description:
        '1 100 20 ; In this case the names of politicians are punched in the fields 1-20, 21-40, etc. which makes coding by hand superfluous. If using input from a COLBIN file then the key word ALPHA can obviously not be used. Generally the use of an asterisk instead of the initial column is processed the same as in a SINGLEQ. MULTIQs can also be defined as relocatable.…',
      syntax: 'ALPHA <varlist> = YES;',
    },
  },
  {
    name: 'ALPHACASESENSITIVE',
    de: {
      description: '',
      syntax: 'ALPHACASESENSITIVE = [ YES | NO | LOWERCASE | UPPERCASE ];',
    },
    en: {
      description: '',
      syntax: 'ALPHACASESENSITIVE = [ YES | NO | LOWERCASE | UPPERCASE ];',
    },
  },
  {
    name: 'ALPHAFAMILY',
    de: {
      description: '',
      syntax: 'ALPHAFAMILY <neueAlphaFamily> = { <alphavar> }*n ;',
    },
    en: {
      description: '',
      syntax: 'ALPHAFAMILY <newAlphaFamily> = { <alphavar> }*n ;',
    },
  },
  {
    name: 'ALTXCODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ALWAYS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'AND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ANSWER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ANYCASE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'APPEND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'APPOINTCODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'APPOINTMENTWAIT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'APPOTRY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'AREAS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'AREAS3D',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'AS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ASALPHA',
    de: {
      description: '',
      syntax:
        'ASALPHA <varlist> = [ YES | NO ];\nOPENASALPHA <varlist> = [ YES | NO ];',
    },
    en: { description: '', syntax: 'ASALPHA <varlist> = [ YES | NO ];' },
  },
  {
    name: 'ASCEND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ASCIIIN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ASCIIOUT',
    de: {
      description: '',
      syntax: 'ASCIIOUT <Varlist> = startcolumn [ width ];',
    },
    en: {
      description:
        'Every variable which is to appear in an ASCIIOUTFILE must be included in an ASCIIOUT statement.',
      syntax: 'ASCIIOUT <Varlist> = startcolumn [ width ];',
    },
  },
  {
    name: 'ASCIIOUTCARD',
    en: {
      description:
        'The number of cards and the preset of the present card for the output of variables in ASCII format in the ASCIIOUTFILE.',
    },
  },
  {
    name: 'ASCIIOUTCARDS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ASCIIOUTDECIMALCAR',
    en: {
      description:
        'Defines CHAR value which is to be used as a decimal separator in ASCIIOUT.',
    },
  },
  {
    name: 'ASCIIOUTDECIMALCHAR',
    de: { description: '', syntax: 'ASCIIOUTDECIMALCHAR = [ . | , ];' },
    en: { description: '', syntax: 'ASCIIOUTDECIMALCHAR = [ . | , ];' },
  },
  {
    name: 'ASCIIOUTFILE',
    de: {
      description: '',
      syntax: 'ASCIIOUTFILE [ DELIMITED [ ASCIIOUT ] ] = <filename>;',
    },
    en: {
      description: '',
      syntax: 'ASCIIOUTFILE [ DELIMITED [ ASCIIOUT ] ] = <filename>;',
    },
  },
  {
    name: 'ASKMULTIASSINGLES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ASSCOCEND',
    de: { description: '', syntax: 'ASSCOCEND <filename> ;' },
    en: { description: '', syntax: 'ASSCOCEND <filename> ;' },
  },
  {
    name: 'ASSERT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ASSERTFILTERINASCII',
    de: { description: '', syntax: 'ASSERTFILTERINASCII = [ YES | NO ];' },
    en: { description: '', syntax: 'ASSERTFILTERINASCII = [ YES | NO ];' },
  },
  {
    name: 'ASSERTFILTERVARS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ASSOCEND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ASSOCFILE',
    de: {
      description: '',
      syntax: 'ASSOCFILE = <filename> KEY <varname> <startcol> <len> ;',
    },
    en: {
      description: '',
      syntax:
        'ASSOCFILE [ BIG | DBASEIN ] = <filename> KEY <varname> <startcol>\n<len> ;',
    },
  },
  {
    name: 'ASSOCTOINVERT',
    de: {
      description: '',
      syntax:
        'ASSOCTOINVERT = [ CSV | SPSS | DBASE | ASCIIN }*n = [ YES | NO ];\nVoreinstellung: ASSOCTOINVERT = CSV SPSS DBASE ASCIIN;',
    },
    en: {
      description: '',
      syntax:
        'ASSOCTOINVERT = [ CSV | SPSS | DBASE | ASCIIN }*n = [ YES | NO ];\nDefault: ASSOCTOINVERT = CSV SPSS DBASE ASCIIN;',
    },
  },
  {
    name: 'ASSOCVAR',
    de: {
      description: '',
      syntax:
        "ASSOCVAR <varname> = [ ALPHA] <startcol> [ <len> [ <width> ] ] ;\nJedes ASSOCVAR-Statement erzeugt eine neue, ergänzende Variable namens '<varname>'.",
    },
    en: {
      description: '',
      syntax:
        'ASSOCVAR <varname> = [ ALPHA] <startcol> [ <len> [ <width> ] ] ;',
    },
  },
  {
    name: 'AUTO',
    de: { description: '', syntax: 'AUTO : [YES | NO]' },
    en: { description: '', syntax: 'AUTO : [YES | NO]' },
  },
  {
    name: 'AUTOALIGN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'AUTOCASENUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'AUTOCHARTFORMAT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'AUTOCLEAR',
    de: { description: '', syntax: 'AUTOCLEAR = [ YES | NO ];' },
    en: { description: '', syntax: 'AUTOCLEAR = [ YES | NO ];' },
  },
  {
    name: 'AUTOCONTENTKEY',
    de: {
      description: '',
      syntax:
        'AUTOCONTENTKEY = [ TABLETITLE | VARNAME | VARTEXT | VARTITLE ]\n[ YVALID | XVALID ];\nAusschalten: AUTOCONTENTKEY = NO;',
    },
    en: {
      description: '',
      syntax:
        'AUTOCONTENTKEY = [ VARNAME ] [ YVALID | XVALID | NO ];\nA CONTENTKEY (see above) is automatically allocated; if YVALID then the first variable in the Y-direction',
    },
  },
  {
    name: 'AUTONOANSWER',
    de: {
      description: '',
      syntax:
        'AUTONOANSWER [ <varlist> ] = [ YES "noanswertext" | NO ]\n[ LEVEL < number > ];',
    },
    en: {
      description: '',
      syntax:
        'AUTONOANSWER [ <varlist> ] = [ YES "noanswertext" | NO ] [ LEVEL <\nnumber > ;\nAUTONOANSWER is either (without <varlist>) preset or it refers to explicit variables and the preset',
    },
  },
  {
    name: 'AUTONOANSWERCODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'AUTOOPEN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'AUTOOVERSORT',
    en: {
      description:
        'Sorts the OVERCODES in a table and prepares the labels for sorting within the overcode. Overcodes can hierarchically be sorted on up to five levels.',
    },
  },
  {
    name: 'AUTOREPLACEOPEN',
    de: { description: '', syntax: 'AUTOREPLACEOPEN = [ YES | NO ];' },
    en: { description: '', syntax: 'AUTOREPLACEOPEN = [ YES | NO ];' },
  },
  {
    name: 'AUTOSIGNCHAR',
    de: {
      description:
        'Dieses TableFormat veranlasst eine automatische Kennzeichnung der Spalten mit Kennbuchstaben (INDEXCHARS 529) für spaltenorientierte Signifikanztests. Wenn TESTCOLUMNS 451 vereinbart sind, werden die Buchstaben nicht für die einzelnen Variablen neu vergeben, wie sonst im Standardfall.',
    },
    en: {
      description:
        'This TABLEFORMAT ensures an automatic identification of the column with an identifying letter (see INDEXCHARS) for significance tests per column. If TESTCOLUMNS has been set the letters are not re- allocated for each variable as is usually the case.',
    },
  },
  {
    name: 'AUTOSIGNCHARALWAYS',
    de: {
      description:
        'Wie AUTOSIGNCHAR 535. AUTOSIGNCHAR enthält aber eine Automatik, dass nur dann die Kennzeichnung im Kopf vorgenommen wird, wenn auch mindestens ein zutreffendes CELLELEMENT 418 in der Tabelle enthalten ist. Bei AUTOSIGNCHARALWAYS unterbleibt diese Prüfung.',
    },
    en: {
      description:
        'As AUTOSIGNCHAR but using AUTOSIGNCHAR the identification in the stub automatically only occurs if also at least one valid CELLELEMENT is present in the table. This test does not take place if using AUTOSIGNCHARALWAYS.',
    },
  },
  {
    name: 'AUTOSIGNFORMAT',
    de: {
      description:
        '5.Protokollierung der Signifikanzberechnung 460: STATTESTDUMP Gegenstand des Signifikanztests TestColumns Gibt man keine TESTCOLUMNS an, werden je Variable alle Spalten gegeneinander getestet.',
      syntax: 'AUTOSIGNFORMAT = "<formatstring>";',
    },
    en: {
      description:
        '5. Logging of the significance calculation 460: STATTESTDUMP. Subject of the significance test: TestColumns. If you do not specify any TESTCOLUMNS, all columns are tested against each other per variable.',
      syntax: 'AUTOSIGNFORMAT = "<formatstring>";',
    },
  },
  {
    name: 'AUTOSIGNIFTEXT',
    de: { description: '', syntax: 'AUTOSIGNIFTEXT = [ YES | NO ];' },
    en: { description: '', syntax: 'AUTOSIGNIFTEXT = [ YES | NO ];' },
  },
  {
    name: 'AUTOSORTTREE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'AXISMINMAX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BACKGROUND',
    argsHint: '( ge 2 le 3 : $e0e0ff ge 0 le 2 : $d0d0ff )',
    de: {
      description:
        'FORMAT "#,#" = <1 4> / <1 1> ; Der Ergebniswert 2 wäre ohne die obenstehende Regel nicht eindeutig zuzuordnen. so wird die Zelle mit $d0d0ff und nicht mit $e0e0ff gefärbt. Die letzte Zeile könnte auch in zwei getrennten BACKGROUND-Regeln beschrieben werden, gleichbedeutend wäre: BACKGROUND ( ge 2 le 3 : $e0e0ff ) BACKGROUND ( ge 0 le 2 :…',
      syntax: 'BACKGROUND <boxtype> : <color>\nFOREGROUND <boxtype> : <color>',
    },
    en: {
      description:
        'FORMAT "#,#" = <1 4> / <1 1> ; The result value 2 could not be assigned unambiguously without the rule above. Thus the cell is coloured with $d0d0ff and not with $e0e0ff. The last line could also be described in two separate BACKGROUND rules; equivalent would be: BACKGROUND ( ge 2 le 3 : $e0e0ff ) BACKGROUND ( ge 0 le 2 :…',
      syntax: 'BACKGROUND <boxname> = <hue> <saturation> <brightness>;',
    },
  },
  {
    name: 'BACKGROUNDBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BACKLIMIT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BACKTOCONTENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BANKERSROUNDMODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BARS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BARS3D',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BASEIN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BASESELECT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BCDVAR',
    en: { description: '', syntax: 'BCDVAR <variable> = <vargroup> ;' },
  },
  {
    name: 'BEEP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BENCHMARKCOLOR',
    de: {
      description: '',
      syntax: 'BENCHMARKCOLOR = <color_high> <color_low> ;',
    },
    en: {
      description: '',
      syntax: 'BENCHMARKCOLOR = <color_high> <color_low> ;',
    },
  },
  {
    name: 'BENCHMARKLEVEL',
    de: {
      description: '',
      syntax:
        'BENCHMARKLEVEL = [ SIGNIF90 | SIGNIF95 | SIGNIF99 | SIGNIF999 ];',
    },
    en: {
      description: '',
      syntax:
        'BENCHMARKLEVEL = [ SIGNIF90 | SIGNIF95 | SIGNIF99 | SIGNIF999 ];',
    },
  },
  {
    name: 'BENCHMARKVALUES',
    de: {
      description:
        '| 1 1:3 / 1 1:1 = 8.45 9213 | 1 1:3 / 1 2:2 = 54.33 9213 ; Die erste Zeile des Beispiels bedeutet also: Für alle Zellen im Schnittpunkt der ersten Variablen in der X-Richtung mit den x-Werten 1 2 und 3 und der ersten Variablen in der Y-Richtung mit dem Wert 1 gilt der Benchmarkprozentwert 8.45 bei einem N von 9213.…',
    },
    en: {
      description:
        'A different subject: percentage values and bases (e.g. from other surveys) can be set in BENCHMARKVALUES. Then the column percentages in the relevant cells are compared with the benchmark values using a z-test. The BACKGROUND of the cell can then be coded with BENCHMARKCOLOR.…',
    },
  },
  {
    name: 'BIG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BIK001',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BINARY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BINOMIALPERCENTRANGE',
    de: { description: '', syntax: 'BINOMIALPERCENTRANGE = [ YES | NO ];' },
    en: { description: '', syntax: 'BINOMIALPERCENTRANGE = [ YES | NO ];' },
  },
  {
    name: 'BIPOL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BIT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BITGROUP',
    en: { description: '', syntax: 'BITGROUP <vargroup> = <varname> ;' },
  },
  {
    name: 'BLACKLIST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BLACKLISTCODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BLACKLISTSERVER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BLANKVALUE',
    de: {
      description: '',
      syntax: 'BLANKVALUE = <number>;\nBeispiel: BLANKVALUE = -1;',
    },
    en: {
      description:
        'Normally an input field which only contains blanks is internally set to zero. If these values are however required then the BLANKVALUE command can define a value. Example: BLANKVALUE = -1; Preset: BLANKVALUE = 0.0;',
      syntax: 'BLANKVALUE = <number>;\nExample: BLANKVALUE = -1;',
    },
  },
  {
    name: 'BOLD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BORDERS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BOTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BOTTOM',
    de: {
      description:
        'Label wird innerhalb einer Sortierklasse immer ans Ende sortiert, siehe',
    },
    en: {
      description:
        'The label is always sorted to the end within a sort class, see',
      syntax: '',
    },
  },
  {
    name: 'BOTTOMCUT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BOTTOMTEXT',
    de: {
      description: 'Optionaler Text am Ende der Tabelle',
      syntax: 'BOTTOMTEXT = "<text>";',
    },
    en: {
      description:
        'This is an alternative method for defining text at the end of a table. BOTTOMTEXT has in contrast to the CITEVARTEXT command which refers to variables, the text to be printed as its argument. If a BOTTOMTEXT is defined any additional CITEVARTEXT or CITEALLVARS commands for the BOTTOMTEXT are ignored. Maximum text length: 1500 characters.',
      syntax: 'BOTTOMTEXT = "<text>";',
    },
  },
  {
    name: 'BOXFONT',
    de: {
      description: '',
      syntax:
        'BOXFONT <boxtype> : <fontname> SIZE <number>\n[OPTION [BOLD|ITALIC|UNDERLINE]]',
    },
    en: {
      description: '',
      syntax:
        'BOXFONT <boxtype> : <fontname> SIZE <number>\n[OPTION [BOLD|ITALIC|UNDERLINE]]',
    },
  },
  {
    name: 'BOXLINEFEED',
    de: { description: '', syntax: 'BOXLINEFEED <boxname> = <number> ;' },
    en: {
      description: '(PS): is ignored by line printers.',
      syntax: 'BOXLINEFEED <boxname> = <number> ;',
    },
  },
  {
    name: 'BOXMINHEIGHT',
    de: {
      description: '',
      syntax:
        "BOXMINHEIGHT <boxname> = <number>;\nWird wegen der Abhängigkeit der Boxes voneinander nicht bei allen '<boxnames>'",
    },
    en: {
      description: '(PS): is ignored by line printers.',
      syntax: 'BOXMINHEIGHT <boxname> = <number> ;',
    },
  },
  {
    name: 'BOXRADIUS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BOXTEXT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BOXTYPE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'BY',
    de: {
      description: 'Trennt den Kopf von der Achse',
      syntax: '<kop> BY <achse>{*n}',
    },
    en: {
      description: 'Separates the header from the axis',
      syntax: '<header> BY <axis>{*n}',
    },
  },
  {
    name: 'CALCCOLLOWACCURACY',
    de: { description: '', syntax: 'CALCCOLLOWACCURACY = [ YES | NO ] ;' },
    en: { description: '', syntax: 'CALCCOLLOWACCURACY = [ YES | NO ] ;' },
  },
  {
    name: 'CALCULATECOLUMN',
    de: {
      description: '',
      syntax:
        'CALCULATECOLUMN <Zielspalte> [ FORMAT <format> ]\n[ FOREGROUND <rules> ] [ BACKGROUND <rules> ]\n= <arithmetischer Spaltenausdruck>;\n<Zielspalte> ::= <varno> <code> >\n<rules> ::= ( { <rule> }*n )\n<rule> ::= [ GE | GT ] <number1> [ LT | LE ] <number2> : <color>',
    },
    en: {
      description: '',
      syntax:
        'CALCULATECOLUMN = <zielcolumn> [ format "<format>" ] =\n<arithmetischer ausdruck>;\nThe notation for the column is: < <varno> <code> >. <varno> stands for the tally of the variables',
    },
  },
  {
    name: 'CAMEMBERT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CAMEMBERT3D',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CAMEMBERTANDBAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CAMEMBERTEXPLODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CAMEMBERTEXPLODE3D',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CAPI',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CARD',
    en: {
      description:
        'discloses in which row or "card" the then following variables or weight is to be found. Preset is on CARD=1. CARD and CARDS refer to the DATAFILE (and thus automatically the COPYFILE). Relevant commands are also available for ASCIIOUTFILE, COLBININFILE and COLBINOUTFILE.',
    },
  },
  {
    name: 'CARDNUMBER',
    de: { description: '', syntax: 'CARDNUMBER = <STARTCOLUMN> <WIDTH>;' },
    en: { description: '', syntax: 'CARDNUMBER = startcolumn width;' },
  },
  {
    name: 'CARDS',
    en: {
      description:
        'CARDS discloses how many records or rows constitute the case. Example: CARDS = 2; Preset is CARDS=1, i.e. for data sets which comprise one row the specification is not necessary.',
    },
  },
  {
    name: 'CASEBASESTRING',
    de: {
      description:
        'Text, der bei Mehrfachnennungen in CODEBOOK 346-Tabellen auf die Prozentuierung verweist.',
      syntax:
        'CASEBASESTRING = "<text>";\nStandardtext: \'Prozentuiert auf die Zahl der Fälle\';',
    },
    en: {
      description:
        'Defines the text which refers to the percentaging for multi-responses CODEBOOK tables. Preset: CASEBASESTRING = "Prozentuiert auf die Zahl der Fälle"; This is valid for all tables until changed.',
      syntax:
        'CASEBASESTRING = "<text>";\nDefault text: \'Percentaged on the number of cases\';',
    },
  },
  {
    name: 'CASELIST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CASENUMBER',
    en: {
      description:
        'Syntax CASENUMBER = startcolumn width; If the column definition is known for a case number then an identical value is expected at that position for all cards of a case. Divergence leads to an error log which is shown in the lower error window on screen and where necessary in the LISTFILE.',
    },
  },
  {
    name: 'CASES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CASESTITLE',
    en: {
      description:
        'If the standard text "number of Interviewees abs." in TABLEBASE = CASES is to be replaced it can be done in this way: CASESTITLE = "Number of Inter-views (abs.)"; The CASESTITLE can be set differently for the X and Y axes Example: CASESTITLE X = "n"; CASESTITLE Y = "N"; The same separating rules are valid as for VALUELABELS and are valid for all tables until changed.',
    },
  },
  {
    name: 'CASETITLE',
    de: {
      description:
        'Bezeichnung der CASES-Spalte/-zeile (wenn TABLEBASE = CASES; 388 gesetzt)',
      syntax: 'CASETITLE [ X | Y ] = "<text>";',
    },
    en: {
      description:
        'Label of the CASES column/row (when TABLEBASE = CASES; 388 is set)',
      syntax: 'CASETITLE [ X | Y ] = "<text>";',
    },
  },
  {
    name: 'CATI',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CATIDISPLAYLIST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CBEXCLUDEMISSING',
    de: { description: '', syntax: 'CBEXCLUDEMISSING = [ YES | NO ];' },
    en: { description: '', syntax: 'CBEXCLUDEMISSING = [ YES | NO ];' },
  },
  {
    name: 'CBPERCENTINTOTAL',
    de: {
      description:
        'In der Totalzeile von CODEBOOK 346 werden jeweils die Zahl der Fälle oder die Zahl der Nennungen ausgewiesen. Wird das TABLEFORMAT CBPERCENTINTOTAL gesetzt, werden in den Totalspalte stattdessen Prozentwerte ausgegeben.',
    },
    en: {
      description:
        'In the total row of CODEBOOK 346, either the number of cases or the number of responses is shown. If the TABLEFORMAT CBPERCENTINTOTAL is set, percentage values are output in the total column instead.',
      syntax: '',
    },
  },
  {
    name: 'CELLELEMENT',
    de: {
      description: '[ MINIMUM <number> ] minimale im PIE abzubildende %-Zahl',
    },
    en: {
      description:
        '[ MINIMUM <number> ] minimum percentage value to be shown in the PIE',
      syntax: '',
    },
  },
  {
    name: 'CELLELEMENTS',
    argsHint: '( ABSOLUTE COLUMNPERCENT )',
    de: {
      description:
        'Anforderung spezifischer Zellenelemente 418 für dieses Label',
      syntax: 'CELLELEMENTS [ TOTALROW | TOTALCOLUMN ] = { <cellelement> }*n ;',
    },
    en: {
      description:
        '; .... CELLELEMENTS = COLUMNPERCENT; TABLE = Kopf BY y SORT ABSOLUTE DESCEND; In connection with MULTITOTAL it is not necessary to stipulate an evaluation level. Normally all characteristics have LEVEL 0. If the LEVEL is set to <> 0 the relevant characteristics will be ignored when tallying the total. Level values: 0 – 127.',
      syntax: 'CELLELEMENTS [ TOTALROW | TOTALCOLUMN ] = { <cellelement> }*n ;',
    },
  },
  {
    name: 'CELLMINALWAYS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CELLMINIMUM',
    de: { description: '', syntax: 'CELLMINIMUM = <value>;' },
    en: {
      description:
        'The option CELLMINIMUM states as of which minimum value a table cell counts as valid and should be included. Example: CELLMINIMUM = 10; In all cells where the minimum value has not been reached there will be "-". Preset at 0.0001; CELLMINIMUM as ROWMINIMUM and COLMINIMUM are TABLE options. Options always refer to the last table requested. They are therefore always written after the TABLE command.…',
      syntax: 'CELLMINIMUM = <value>;',
    },
  },
  {
    name: 'CELLSEQUENCE',
    de: {
      description: '',
      syntax:
        'CELLSEQUENCE = <cellelements>;\nCLASSICCELLSEQUENCE = <cellelements>;',
    },
    en: {
      description:
        'If several CELLELEMENTS are required for a table the cell contents are printed underneath each other in a standard order. This standard order can be altered using the CELLSEQUENCE statement. CELLSEQUENCE defines a new order. All CELLELEMENTS which do not appear in CELLSEQUENCE are not printed.',
      syntax:
        'CELLSEQUENCE = <cellelements>;\nCLASSICCELLSEQUENCE = <cellelements>;',
    },
  },
  {
    name: 'CELLSET',
    de: { description: 'Statement verwendet werden.' },
    en: {
      description:
        'The CELLELEMENTS statement can be used to combine several pieces of information in a single table cell in the parts of the table which span across both axes using LABELS. In summary tables additional summarised rows are often required where e.g. means are to be presented. Due to the syntax this is only one CELLELEMENT, if necessary this can be one that includes two values e.g.…',
    },
  },
  {
    name: 'CHANGE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHANGEKEYWORD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHANGESPSSVARNAMES',
    de: {
      description: '',
      syntax: 'CHANGESPSSVARNAMES = [ UPPERCASE | LOWERCASE | NO ];',
    },
    en: {
      description: '',
      syntax: 'CHANGESPSSVARNAMES = [ UPPERCASE | LOWERCASE | NO ];',
    },
  },
  {
    name: 'CHAPTER',
    de: { description: '', syntax: 'CHAPTER <varlist> = [ {<string>}*n ];' },
    en: { description: '', syntax: 'CHAPTER <varlist> = [ {<string>}*n ];' },
  },
  {
    name: 'CHAPTERPAGE',
    de: {
      description:
        'Gesellschaft für Software in der Sozialforschung mbH Waterloohain 6 - 8',
    },
    en: {
      description:
        'Gesellschaft für Software in der Sozialforschung mbH Waterloohain 6 - 8',
      syntax: '',
    },
  },
  {
    name: 'CHAPTERTITLE',
    de: { description: '', syntax: 'CHAPTERTITLE = <name>;' },
    en: { description: '', syntax: 'CHAPTERTITLE = <name>;' },
  },
  {
    name: 'CHARTAREA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHARTCOLORS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHARTFOOTER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHARTHEADER',
    de: {
      description: '',
      syntax:
        'CHARTHEADER = <string> [ TOP | BOTTOM | VCENTER |LEFT\n| RIGHT | HCENTER ] ;\nCHARTFOOTER = <string> [ TOP | BOTTOM | VCENTER |LEFT\n| RIGHT | HCENTER ] ;',
    },
    en: {
      description: '',
      syntax:
        'CHARTHEADER = <string> [ TOP | BOTTOM | VCENTER |LEFT\n| RIGHT | HCENTER ] ;\nCHARTFOOTER = <string> [ TOP | BOTTOM | VCENTER |LEFT\n| RIGHT | HCENTER ] ;',
    },
  },
  {
    name: 'CHARTHEIGHT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHARTLABELS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHARTLEGEND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHARTNUMBERS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHARTRANGE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHARTTITLE',
    de: {
      description:
        '"Top-2-Box horizontal nach Modellen: Bullet mit Zahlenangabe (weiß)" CHARTAREA 105 15 87 180 SAMEPAGE HORIZONTAL INVERSE = | FORM CIRCLE ROWS 1:22 COLUMNS 65002 SYMBOLSIZE 10 ; GESSCHARTFONT CHARTNUMBERS = "HELVETICA" SIZE 8; GESSCHARTFORMAT = NUMEXGRAPH NOFRAME NOSCALE; GESSCHARTCOLORS = $EE6699;',
      syntax: 'CHARTTITLE : <title>',
    },
    en: {
      description:
        '"Top-2 box horizontal by models: bullet with figure (white)" CHARTAREA 105 15 87 180 SAMEPAGE HORIZONTAL INVERSE = | FORM CIRCLE ROWS 1:22 COLUMNS 65002 SYMBOLSIZE 10 ; GESSCHARTFONT CHARTNUMBERS = "HELVETICA" SIZE 8; GESSCHARTFORMAT = NUMEXGRAPH NOFRAME NOSCALE; GESSCHARTCOLORS = $EE6699;',
      syntax: 'CHARTTITLE : <title>',
    },
  },
  {
    name: 'CHARTWIDTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHECKALLOW',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHECKBLACKSERV',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHECKMISSINGINMULTI',
    de: { description: '', syntax: 'CHECKMISSINGINMULTI = [ YES | NO ];' },
    en: { description: '', syntax: 'CHECKMISSINGINMULTI = [ YES | NO ];' },
  },
  {
    name: 'CHECKRECODES',
    de: { description: '', syntax: 'CHECKRECODES = [ YES | NO };' },
    en: { description: '', syntax: 'CHECKRECODES = [ YES | NO };' },
  },
  {
    name: 'CHIQOCOLMINIMUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHIQU',
    de: {
      description:
        'Ausgabe des Chi-Quadrats zellenweise. Das Chi-Quadrat bewertet die Abweichung der empirischen Verteilung in jeder Zelle vom anhand der Randverteilungen ermittelten Erwartungswert.',
    },
    en: {
      description:
        'Output of the chi-square per cell. The chi-square evaluates the deviation of the empirical distribution in each cell from the expected value derived from the marginal distributions.',
      syntax: '',
    },
  },
  {
    name: 'CHIQUCOLMINIMUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHIQUMINIMUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CHIQUROWMINIMUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CIRCLE',
    de: { description: 'Skalenwert mit einem Kreis markieren' },
    en: { description: 'Mark the scale value with a circle', syntax: '' },
  },
  {
    name: 'CIRCLEO',
    de: {
      description:
        'LineDash LINEDASH ist ein ganzzahliger Wert zwischen 1 und 10. In GESStabs sind zehn Formen gestrichelter Linien vordefiniert, die man zur Gestaltung von LINE oder RECTLINE abrufen kann. Voreinstellung: 0, das entspricht einer durchgezogenen Linie. LineWidth Die Dicke von LINE bzw. RECTLINE. Explode Ist bei anderen Formen als PIE oder PIE100 wirkungslos.…',
    },
    en: {
      description:
        'LineDash: LINEDASH is an integer value between 1 and 10. GESStabs predefines ten shapes of dashed lines that can be used for designing LINE or RECTLINE. Default: 0, which corresponds to a solid line. LineWidth: the thickness of LINE or RECTLINE. Explode: has no effect on shapes other than PIE or PIE100.…',
      syntax: '',
    },
  },
  {
    name: 'CITEALLVARS',
    de: {
      description: '',
      syntax:
        'CITEALLVARS = [ TOPTEXT | BOTTOMTEXT | NO ]\n{ XVALIDXVALID | YVALIDYVALID };',
    },
    en: {
      description: '',
      syntax:
        'CITEALLVARS = [ TOPTEXT | BOTTOMTEXT | NO ] { XVALID | YVALID };',
    },
  },
  {
    name: 'CITEFIRSTVAR',
    de: {
      description: '',
      syntax:
        'CITEFIRSTVAR = [ TOPTEXT | BOTTOMTEXT | NO ] { XVALID | YVALID };\nParallel zu CITEALLVARS gibt es auch ein CITEFIRSTVAR; dann wird nur der Text der die',
    },
    en: {
      description: '',
      syntax:
        'CITEFIRSTVAR = [ TOPTEXT | BOTTOMTEXT | NO ] { XVALID | YVALID };\nIn parallel with CITEALLVARS there is also a CITEFIRSTVAR; then only the text of the',
    },
  },
  {
    name: 'CITEVARTEXT',
    de: {
      description: '',
      syntax: 'CITEVARTEXT [ TOPTEXT | BOTTOMTEXT ] = <Varlist> ;',
    },
    en: {
      description: '',
      syntax: 'CITEVARTEXT [ TOPTEXT | BOTTOMTEXT ] = <Varlist> ;',
    },
  },
  {
    name: 'CKONTO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CKONTOKEY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CLASSIC',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CLASSICCELLSEQUENCE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CLONEVAR',
    de: {
      description: '',
      syntax:
        'CLONEVAR <destinationvar> = <sourcevar>\n[ DELETELABELS [ MISSING | AUTONOANSWER | OVERCODE | {<number>}*n ] ];',
    },
    en: {
      description: '',
      syntax:
        'CLONEVAR <destinationvar> = <sourcevar>\n[ DELETELABELS [ MISSING | AUTONOANSWER | OVERCODE | {<number>}*n ] ];',
    },
  },
  {
    name: 'CLOSED',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CLUSTERED',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CODEBLOCK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CODEBOOK',
    de: { description: '', syntax: 'CODEBOOK [ EXCEPT ][ <VarList> ] ;' },
    en: { description: '', syntax: 'CODEBOOK [ <VarList> ] ;' },
  },
  {
    name: 'CODEBOOKHEADER',
    de: {
      description: '',
      syntax:
        'CODEBOOKHEADER =\n| CODE "Text"\n| ABSOLUTE "Text"\n| COLUMNPERCENT "Text"\n| NOMPERCENT "Text"\n| CUMPERCENT "Text"',
    },
    en: {
      description: '',
      syntax:
        'CODEBOOKHEADER =\n| CODE "Text"\n| ABSOLUTE "Text"\n| COLUMNPERCENT "Text"\n| NOMPERCENT "Text"\n| CUMPERCENT "Text"',
    },
  },
  {
    name: 'CODEBOOKTOTAL',
    de: { description: '', syntax: 'CODEBOOKTOTAL = "text";' },
    en: { description: '', syntax: 'CODEBOOKTOTAL = "text";' },
  },
  {
    name: 'CODEBOOKVALUES',
    de: {
      description:
        'In CODEBOOK 346s wird der Labelcode jeder Variablenausprägung als eigene Spalte ausgegeben.',
    },
    en: {
      description:
        'Prints the numerical codes beside the VALUELABELS in CODEBOOK tables. This is particularly useful for controlling the automatic coding which is carried out by ALPHA-VARS.',
    },
  },
  {
    name: 'CODEBOOKZEROLINES',
    de: {
      description:
        'Bewirkt die Ausgabe gelabelter Codes in CODEBOOK 346s, auch wenn die Häufigkeit null ist.',
    },
    en: {
      description:
        'Causes labelled codes to be output in CODEBOOK 346 even when the frequency is zero.',
      syntax: '',
    },
  },
  {
    name: 'CODEINLABELS',
    de: { description: '', syntax: 'CODEINLABELS = [ YES | NO ];' },
    en: { description: '', syntax: 'CODEINLABELS = [ YES | NO ];' },
  },
  {
    name: 'CODISISDN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLBINCRLF',
    de: { description: '', syntax: 'COLBINCRLF = [ YES | NO ];' },
    en: { description: '', syntax: 'COLBINCRLF = [ YES | NO ];' },
  },
  {
    name: 'COLBINFORMAT',
    de: { description: '', syntax: 'COLBINFORMAT = <Colbinformatname>;' },
    en: { description: '', syntax: 'COLBINFORMAT = <colbinformatname>;' },
  },
  {
    name: 'COLBINFORNAT',
    en: { description: '', syntax: 'COLBINFORNAT = <Colbinformatname>;' },
  },
  {
    name: 'COLBININ',
    de: {
      description: '',
      syntax: 'COLBININ <varname> = { | value < column : code }*n };',
    },
    en: {
      description: '',
      syntax: 'COLBININ <varname> = { | value < column : code }*n };',
    },
  },
  {
    name: 'COLBININCARD',
    en: {
      description: 'Definition for the data set to be read in COLBIN format.',
    },
  },
  {
    name: 'COLBININCARDS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLBININCOLS',
    de: { description: '', syntax: 'COLBININCOLS = <value>;' },
    en: { description: '', syntax: 'COLBININCOLS = <value>;' },
  },
  {
    name: 'COLBININFILE',
    de: { description: '', syntax: 'COLBININFILE = <filename>;' },
    en: { description: '', syntax: 'COLBININFILE = <filename>;' },
  },
  {
    name: 'COLBININSWAPPED',
    de: { description: '', syntax: 'COLBININSWAPPED = [ YES | NO ];' },
    en: { description: '', syntax: 'COLBININSWAPPED = [ YES | NO ];' },
  },
  {
    name: 'COLBINOUT',
    de: {
      description: '',
      syntax: 'COLBINOUT <varlist> = <start> <width>\nBITGROUP [ 10 | 12 ];',
    },
    en: {
      description:
        'The counterpart of COLBININ is COLBINOUT. In the first form it is very similar to COLBININ described above: Example: COLBINOUT Alter = | 1 > 22:9 | 2 > 22:X | 3 > 22:Y | 4 > 23:0 | 5 > 23:1 | 6 > 23:3; The COLBINOUT statement is also used to build VARFAMILYs and VARGROUPs on COLBIN multi punches as the variables can be multi-response variables.…',
      syntax: 'COLBINOUT <varlist> = <start> <width> BITGROUP [ 10 | 12 ];',
    },
  },
  {
    name: 'COLBINOUTCARD',
    en: {
      description:
        'Definition for the data set to be written in COLBIN format.',
    },
  },
  {
    name: 'COLBINOUTCARDS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLBINOUTCOLS',
    de: { description: '', syntax: 'COLBINOUTCOLS = <value>;' },
    en: { description: '', syntax: 'COLBINOUTCOLS = <value>;' },
  },
  {
    name: 'COLBINOUTFILE',
    en: {
      description:
        'Output of data in COLumn-BINary-format. See COLBIN-Data above.',
    },
  },
  {
    name: 'COLBINOUTSWAPPED',
    de: { description: '', syntax: 'COLBINOUTSWAPPED = [ YES | NO ];' },
    en: { description: '', syntax: 'COLBINOUTSWAPPED = [ YES | NO ];' },
  },
  {
    name: 'COLCCHIQUABSMIN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLCCHIQUPHYSMIN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLCHIQU',
    de: {
      description:
        'Spaltenweise 4-Felder Chi²-Test auf Prozentwertunterschied. Um die Chi²-Prüfgröße und den dazu passenden Signifikanzwert zu ermitteln, wird intern eine 4-Felder-Matrix bei jedem Paarvergleich generiert, bei der in der ersten Zeile die beobachteten, absoluten Fälle des gefragten Zellenpaars stehen und in der zweiten Zeile jeweils die Differenz dieser Werte zu den Totalwerten aus der Totalzeile der…',
    },
    en: {
      description:
        'Column-wise 4-field chi-square test on percentage differences. To determine the chi-square statistic and the corresponding significance value, an internal 4-field matrix is generated for each pairwise comparison, with the observed absolute cases of the cell pair in question in the first row and, in the second row, the difference between these values and the total values from the total row of the…',
      syntax: '',
    },
  },
  {
    name: 'COLCOUNTLINES',
    en: {
      description:
        'Printing of column tallies (COLUMNCOUNT) in a row-orientated format. Usually the results are printed in columns. (NON-PS) An example of an 80-Column-Tally:',
    },
  },
  {
    name: 'COLDEPTTEST',
    argsHint: '(Var)',
    de: { description: 'Abhängiger t-Test auf Mittelwertsunterschiede' },
    en: { description: 'Dependent t-test on mean differences', syntax: '' },
  },
  {
    name: 'COLLECT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLMEANINVRANK',
    argsHint: '( Var )',
    de: {
      description:
        'Für die Rangplatzberechnungen werden alle Zellen in einer Tabellenspalte miteinander verglichen und es wird ein Rangplatz berechnet, in diesem Fall für den MEAN. Identische MEANs bekommen identische Ränge. Zwei MEAN gelten als identsich, wenn sie dieselbe Druckausgabe ergeben, d.h. es kommt auch auf die verwendeten Formate an.…',
    },
    en: {
      description:
        'For the rank calculations, all cells in a table column are compared with each other and a rank is computed, in this case for the MEAN. Identical MEANs get identical ranks. Two MEANs are considered identical if they produce the same printed output, i.e. the formats used also matter.…',
      syntax: '',
    },
  },
  {
    name: 'COLMEANRANK',
    argsHint: '( Var )',
    de: {
      description:
        'siehe COLMEANINVRANK, aber: der niedrigste Mittelwert bekommt hier den Rang 1',
    },
    en: {
      description: 'see COLMEANINVRANK, but here the lowest mean gets rank 1',
      syntax: '',
    },
  },
  {
    name: 'COLMINIMUM',
    en: {
      description:
        'Option for TABLE statement. Only those columns are printed which contain at least COLMINIMUM cases, i.e., columns with very low case numbers in side group variables are suppressed. Preset at 0.0001.',
    },
  },
  {
    name: 'COLOR',
    de: {
      description:
        'Brightness) oder dem RGB-Modell (Red-Green-Blue) ausgewählt. Symbolnummer 1 . . . 6',
      syntax:
        'COLOR [ FOREGROUND | BACKGROUND ] =\n{ |\n[ DATABOX <number> <number> CODE [ X | Y ] <number > ]\n<cellelement> RANGE <low> <high> = <number> <number> number> }*n\n;',
    },
    en: {
      description:
        'Brightness) or the RGB model (Red-Green-Blue) is used for selection. Symbol number 1 . . . 6',
      syntax:
        'COLOR [ FOREGROUND | BACKGROUND ] =\n{ |\n[ DATABOX <number> <number> CODE [ X | Y ] <number > ]\n<cellelement> RANGE <low> <high> = <number> <number> number> }*n\n;',
    },
  },
  {
    name: 'COLORIFBASELESS',
    de: {
      description: '',
      syntax:
        'COLORIFBASELESS <place> <test> <number> [ <cellelement> ] = <color>;\n<place> ::= [ FRAMECELL X | FRAMECELL X | DATACELL ]\n<test> ::= [ ABSOLUTE PHYSICALRECORDS VALIDN VALIDPHYS ]\n<number> ::= Schwellenwert, bei dessen Unterschreitung die Farbe geändert werden soll\n<cellelement> ::= Das betroffene CELLELEMENT: wird diese Angabe weggelassen,',
    },
    en: {
      description: '',
      syntax:
        'COLORIFBASELESS <place> <test> <number> [ <cellelement> ] = <color>;\n<place> ::= [ FRAMECELL X | FRAMECELL X | DATACELL ]\n<test> ::= [ ABSOLUTE PHYSICALRECORDS VALIDN VALIDPHYS ]\n<number> ::= threshold below which the colour should be changed\n<cellelement> ::= the CELLELEMENT concerned: if this is omitted,',
    },
  },
  {
    name: 'COLPCTBENCHMARK',
    de: {
      description:
        'Zum Vergleich von Spaltenprozenten mit extern festgelegten Benchmarkwerten (siehe BENCHMARKVALUES 443)',
    },
    en: {
      description:
        'For comparing column percentages with externally defined benchmark values (see BENCHMARKVALUES 443)',
      syntax: '',
    },
  },
  {
    name: 'COLPERCANDCHIQU',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLPERCANDHYCHIQU',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLPERCANDSIGN',
    en: {
      description: 'Column percent and COLPERCT Tests for Mean Differences:',
    },
  },
  {
    name: 'COLPERCENTABS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLPERCENTDELTA',
    de: {
      description: 'Deltawerte (in Prozentpunkten) zum Wert in der Totalspalte',
    },
    en: {
      description:
        'Delta values (in percentage points) relative to the value in the total column',
      syntax: '',
    },
  },
  {
    name: 'COLPERCENTINDEX',
    de: {
      description:
        'Indexwerte zu den Spaltenprozenten (100 entspricht dem Wert in der Totalspalte)',
    },
    en: {
      description:
        'Index values for the column percentages (100 corresponds to the value in the total column)',
      syntax: '',
    },
  },
  {
    name: 'COLPERCENTINVRANK',
    de: {
      description:
        'Die Rangbildung basiert auf COLPERCENT, Die Regeln zur Identität gelten entsprechend. Der höchste Wert bekommt dem niedrigsten Rang.',
    },
    en: {
      description:
        'The ranking is based on COLPERCENT. The identity rules apply accordingly. The highest value gets the lowest rank.',
      syntax: '',
    },
  },
  {
    name: 'COLPERCENTIRANK',
    de: {
      description:
        'siehe COLPERCENTINVRANK, aber der niedrigste Prozentwert bekommt den Rang 1',
    },
    en: {
      description:
        'see COLPERCENTINVRANK, but the lowest percentage value gets rank 1',
      syntax: '',
    },
  },
  {
    name: 'COLPERCENTLINELIMIT',
    de: { description: '', syntax: 'COLPERCENTLINELIMIT = <number>;' },
    en: {
      description: '',
      syntax:
        'COLPERCENTLINELIMIT = <number>;\nParallel to the option above, a row is suppressed if a cell has a column percent value of <number>.',
    },
  },
  {
    name: 'COLPERCENTMEAN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLPERCENTPROJ',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLPERCENTRANK',
    de: {
      description:
        'nach dem Rangplatz des Prozentwerts in der Spalte, kleinster Wert = Rang 1',
    },
    en: {
      description:
        'by the rank of the percentage value in the column, smallest value = rank 1',
      syntax: '',
    },
  },
  {
    name: 'COLPERCENTSUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLPERCEQUAL',
    de: {
      description:
        'Testet alle Spaltenprozente in der Spalte auf Gleichheit; d.h. alle Abweichungen von der Ungleichverteilung werden als signifikant betrachtet. Hier besteht natürlich die Möglichkeit, sehr viele unsinnige Signifikanzen zu produzieren. Bitte mit Bedacht verwenden. COLPERCT* t-Test auf Prozentwertunterschiede: Test auf Basis von ESS 446 und Spaltenüberlappung',
    },
    en: {
      description:
        'Tests all column percentages in the column for equality; i.e. all deviations from the equal distribution are considered significant. This can of course produce a great many meaningless significances. Please use with care. COLPERCT* t-test on percentage differences: test based on ESS 446 and column overlap',
      syntax: '',
    },
  },
  {
    name: 'COLPERCHYMCNEMAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLPERCMCNEMAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLPERCSTDERR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLPERCT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLPERCTMINIMUM',
    de: { description: '', syntax: 'COLPERCTMINIMUM = <number>;' },
    en: {
      description:
        'In the significance calculation using COLPERCT the column overlaps are taken into account. This method can lead to problematical significances if the number of overlaps is so high that there are only a few cases which do NOT occur in both columns which have been tested against each other.…',
      syntax: 'COLPERCTMINIMUM = <number>;',
    },
  },
  {
    name: 'COLPERCZ',
    de: {
      description:
        'Spaltenweiser Test der Unterschiede in den erweiterte Z-Test mit Arcus-Sinus-Korrektur benutzt',
    },
    en: {
      description:
        'Column-wise test of the differences using the extended Z-test with arcsine correction',
      syntax: '',
    },
  },
  {
    name: 'COLROWPERCENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLSFROMNAME',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLSUMPERCENT',
    argsHint: '( Var )',
    de: {
      description:
        'Ausgabe der Spaltenprozentuierung der Summe einer dritten Variablen, z.B. die Summe von Ausgaben für einen bestimmten Zweck in bestimmten Stadtteilen etc.',
    },
    en: {
      description:
        'Output of the column percentaging of the sum of a third variable, e.g. the sum of expenditures for a particular purpose in particular city districts, etc.',
      syntax: '',
    },
  },
  {
    name: 'COLSUMPERCENTSUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLUMN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLUMNCOUNT',
    en: {
      description: '',
      syntax: 'COLUMNCOUNT = <startcolumn> <endcolumn> ;',
    },
  },
  {
    name: 'COLUMNOFFSET',
    de: { description: '', syntax: 'COLUMNOFFSET = <number> ;' },
    en: { description: '', syntax: 'COLUMNOFFSET = <number> ;' },
  },
  {
    name: 'COLUMNPERCENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLUMNPERCENT100',
    de: {
      description:
        'Nach Hare-Niemeyer-Modell modifizierte Spaltenprozentwerte (Summe ergibt 100), Achtung: nicht geeignet bspw. für Mehrfachnennungsvariablen und OVERCODEs, Tabellen mit unterdrückten MISSING VALUES und selektiv gebildete Variablen',
    },
    en: {
      description:
        'Column percentages modified by the Hare-Niemeyer method (sum equals 100). Note: not suitable e.g. for multiple-response variables and OVERCODEs, tables with suppressed MISSING VALUES and selectively built variables',
      syntax: '',
    },
  },
  {
    name: 'COLUMNPERCENTRANGE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLUMNPERCENTRANGELOWER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLUMNPERCENTRANGEUPPER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COLUMNRANGE',
    de: {
      description:
        'Ausgabe einer Tabelle mit den unteren und oberen Rändern des Konfidenzintervalls (5%) von Spaltenprozenten COLUMNPERCENTRANGE* Konfidenzintervall für Spaltenprozente ROWPERCENTRANGE** Konfidenzintervall für Zeilenprozente',
    },
    en: {
      description:
        'Output of a table with the lower and upper bounds of the confidence interval (5%) of column percentages. COLUMNPERCENTRANGE* confidence interval for column percentages. ROWPERCENTRANGE** confidence interval for row percentages',
      syntax: '',
    },
  },
  {
    name: 'COLUMNS',
    de: {
      description:
        '| "Männer": geschl eq 1 : var=&2 | "Frauen": geschl eq 2 : var=&2 #endmacro Innerhalb der Tabelle wird das Macro dann fünfmal aufgerufen:',
    },
    en: {
      description:
        '| "Männer": geschl eq 1 : var=&2 | "Frauen": geschl eq 2 : var=&2 #endmacro This macro is then called up five times within the table:',
    },
  },
  {
    name: 'COLUMNSTRIPES',
    de: {
      description:
        'Ist dieses TABLEFORMAT gesetzt, werden die Spalten von Tabellen farblich hinterlegt, und zwar abwechselnd mit den Farben, die in STRIPECOLORS 559 vereinbart wurden.',
    },
    en: {
      description:
        'If this TABLEFORMAT is set, the columns of tables are shaded, alternately with the colours declared in STRIPECOLORS 559.',
      syntax: '',
    },
  },
  {
    name: 'COLUMNSUMMARY',
    de: {
      description: '',
      syntax:
        'COLUMNSUMMARY <zielspalte> [ format "#,#..." ]\n= <function> [ <option>( {<quellspalte>}*n );\n<zielspalte> ::= < varno code >\n<quellspalte> ::= < varno code >\n<function> ::= [ MEAN | SUM | MIN | MAX ]\n<option> ::= [ ZEROMISSING | DASHMISSING ]',
    },
    en: {
      description: '',
      syntax:
        'COLUMNSUMMARY <targetcolumn> [ format "#,#..." ]\n= <function> [ <option>( {<sourcecolumn>}*n );\n<targetcolumn> ::= < varno code >\n<sourcecolumn> ::= < varno code >\n<function> ::= [ MEAN | SUM | MIN | MAX ]\n<option> ::= [ ZEROMISSING | DASHMISSING ]',
    },
  },
  {
    name: 'COLUMNVARS',
    en: {
      description:
        'This is an alternative method of building a series of variables. The initial column of the variable becomes a component part of the name.',
      syntax: 'COLUMNVARS <nameprefix> = start - end [width];',
    },
  },
  {
    name: 'COLUMNWIDTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMBINEDVAR',
    en: {
      description:
        'COMBINEDVAR produces a VARFAMILY which contains all the individual characteristics of the individual variables next to each other. COMBINEDVAR X = Alter Geschlecht; produces for example a variable family with which a table can evaluate age and sex simultaneously next to one another. COMBINEDVAR is also suitable for allocating one variable to another including its VALUELABELS.',
    },
  },
  {
    name: 'COMMENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPACTADDRES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPARE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPAREVAR',
    en: { description: '', syntax: 'COMPAREVAR <name> = <Varlist> ;' },
  },
  {
    name: 'COMPRESSCODEBOOK',
    de: { description: '', syntax: 'COMPRESSCODEBOOK = [ YES | NO ];' },
    en: {
      description:
        'COMPRESSCODEBOOK = [ YES | NO ]; In the ASCII mode a list of CODEBOOKS can also be printed in a compressed form where a number of CODEBOOKS fit on to one page.',
      syntax: 'COMPRESSCODEBOOK = [ YES | NO ];',
    },
  },
  {
    name: 'COMPUT',
    de: {
      description: '',
      syntax: 'COMPUT <result> = <arithmetic_expressiom>;',
    },
    en: {
      description: '',
      syntax: 'COMPUT <result> = <arithmetic_expressiom>;',
    },
  },
  {
    name: 'COMPUTE',
    de: {
      description:
        'Neuberechnung atomarer Variablen COMPUTE ADD Ergänzende Speicherung definierter Werte COMPUTE ALPHA Verknüpfung von String-Elementen COMPUTE ASCEND/DESCEND Sortierung der Werte (vor deren Übertrag in Zielvariable) COMPUTE CONCAT Verkettung von Labels und Textkonstanten COMPUTE COPY Kopieren von Variablenbereichen COMPUTE ELIMINATE Löschen einer definierten Wertemenge COMPUTE INIT Übertrag einer…',
      syntax: 'COMPUTE ADD <zielvar> = <varlist>;',
    },
    en: {
      description:
        'allows the new calculation of variables by means of four basic arithmetical operations. New variables can be defined or existent variables can have their values changed. If there is a variable in the left half of the COMPUTE statement which the compiler does not yet recognise then it is produced. This is then valid as the "current" variable.…',
      syntax: 'COMPUTE LOAD <zielvar> = <varlist> ;',
    },
  },
  {
    name: 'COMPUTE ADD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE ALPHA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE ASCEND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE CONCAT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE COPY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE DESCEND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE ELIMINATE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE INIT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE LOAD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE REPLACE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE SHUFFLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE SORT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE SUBSTR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COMPUTE SWAP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CONCATCSS',
    de: { description: '', syntax: 'CONCATCSS = [ YES | NO ];' },
    en: { description: '', syntax: 'CONCATCSS = [ YES | NO ];' },
  },
  {
    name: 'CONCATFILTERTEXTS',
    de: { description: '', syntax: 'CONCATFILTERTEXTS = [ YES | NO ];' },
    en: { description: '', syntax: 'CONCATFILTERTEXTS = [ YES | NO ];' },
  },
  {
    name: 'CONCATNUMTOSTR',
    de: { description: '', syntax: 'CONCATNUMTOSTR <varlist> = [ YES | NO ];' },
    en: { description: '', syntax: 'CONCATNUMTOSTR <varlist> = [ YES | NO ];' },
  },
  {
    name: 'CONDENSESPSSGROUP',
    de: { description: '', syntax: 'CONDENSESPSSGROUP = [ YES | NO ];' },
    en: { description: '', syntax: 'CONDENSESPSSGROUP = [ YES | NO ];' },
  },
  {
    name: 'CONFIDENCERANGE',
    argsHint: '( Var )',
    de: {
      description:
        'Ausgabe der Konfidenzintervalls einer zusätzlichen Variablen (zwei Werte auf einer Zeile)',
    },
    en: {
      description:
        'Output of the confidence interval of an additional variable (two values on one line)',
      syntax: '',
    },
  },
  {
    name: 'CONFIDENCERANGEPVALUE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CONNECTEXCELCELLS',
    de: { description: '', syntax: 'CONNECTEXCELCELLS <boxtype> : [YES|NO]' },
    en: { description: '', syntax: 'CONNECTEXCELCELLS <boxtype> : [YES|NO]' },
  },
  {
    name: 'CONTENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CONTENTBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CONTENTFILE',
    de: {
      description: '',
      syntax:
        'CONTENTFILE <option> = <filename>;\noption ::= [ TABLETITLE | TOPTEXT | BOTTOMTEXT | VARIABLES X\n| VARIABLES Y ] [ option ]',
    },
    en: { description: '', syntax: 'CONTENTFILE <option> = <filename>;' },
  },
  {
    name: 'CONTENTKEY',
    de: {
      description: '',
      syntax:
        'CONTENTKEY = [ <text> | TABLETITLE [ [ VARNAME | VARTEXT | VARTITLE ]\n<VARIABLE> ];',
    },
    en: { description: '', syntax: 'CONTENTKEY = [ <text> | <VARIABLE> ];' },
  },
  {
    name: 'CONTENTKEYTOPDF',
    de: { description: '', syntax: 'CONTENTKEYTOPDF = [ YES | NO ];' },
    en: { description: '', syntax: 'CONTENTKEYTOPDF = [ YES | NO ];' },
  },
  {
    name: 'CONTENTPAGE',
    de: {
      description: '',
      syntax:
        'CONTENTPAGE = YES\nUSEFONT <font>\n[ TITLE <Überschrift> USEFONT <font> ]\nMARGINS TOP <number> LEFT <number> BOTTOM <number>\nDISTANCE <number>\n;',
    },
    en: {
      description: '',
      syntax:
        'CONTENTPAGE = YES\nUSEFONT <font>\n[ TITLE <heading> USEFONT <font> ]\nMARGINS TOP <number> LEFT <number> BOTTOM <number>\nDISTANCE <number>\n;',
    },
  },
  {
    name: 'CONTINGENCY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CONTINGENCYNONSTD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CONTINUETITLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CONTROL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COPY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COPYCHART2POWERPOINT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COPYCHART2PP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COPYFILE',
    de: { description: '', syntax: 'COPYFILE = <path>;' },
    en: {
      description:
        'The output of processed and perhaps altered data sets to an ASCII file. With exception of RECODEs, COMPUTEs etc. (see below) the content of the COPYFILE is identical to that of the DATAFILE. (for historical reasons the key word OUTFILE is accepted as a synonym.) (see also ASCIIOUT ALL;)',
      syntax: 'COPYFILE = <path>;',
    },
  },
  {
    name: 'COPYFILTER',
    en: {
      description:
        'defines a variable (or list of variables) as filtered according to a condition: the filtered variables then never flow into the tables if the condition is FALSE. The most frequently used use is probably the filtering of questionnaires. This filtering can also be used to steer GESS input. SETFILTER is however also useful for limiting the valid range for VARGROUPS and VARFAMILY.…',
    },
  },
  {
    name: 'COPYLABELS',
    de: {
      description: '',
      syntax:
        'COPYLABELS <Varlist> = <source-variable>;\nUSELABELS <Varlist> = <source-variable>;\n[VALUE]LABELS <Varlist> COPY <source-variable>;\n[VALUE]LABELS <Varlist> AS <source-variable>;',
    },
    en: { description: '', syntax: 'COPYLABELS <Varlist> = Variable;' },
  },
  {
    name: 'COPYTEXT',
    de: { description: '', syntax: 'COPYTEXT <VarList> = <variable>;' },
    en: { description: '', syntax: 'COPYTEXT <varlist> = <variable>;' },
  },
  {
    name: 'COPYTITLE',
    de: { description: '', syntax: 'COPYTITLE <VarList> = <variable>;' },
    en: {
      description: '',
      syntax:
        'COPYTITLE <varlist> = <variable>;\nAll variables in <varlist> (in some cases the last defined variable) contain a reference to the\nVARTITLE of <variable>.',
    },
  },
  {
    name: 'COS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'COUNT',
    de: {
      description: '',
      syntax:
        'COUNT <varlist> = ( <varlist> ) [ <logop> <number>\nIN [ <number> : number ] ] ;',
    },
    en: {
      description:
        'tallies the frequency of preselected characteristics in a variable list.',
      syntax:
        'COUNT <varlist> = ( <varlist> ) [ <logop> <number> | IN [ <number> :\nnumber ] ] ;\nlogop ::== [ EQ, NE, LT, LE, GT, GE ]',
    },
  },
  {
    name: 'COUNTVALID',
    de: { description: '', syntax: 'COUNTVALID <resultvars> = <varlist>;' },
    en: { description: '', syntax: 'COUNTVALID <resultvars> = <varlist>;' },
  },
  {
    name: 'CPI',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CRAMERSV',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CROSS2VAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CROSSVAR',
    de: { description: '', syntax: 'CROSSVAR <newvar> = <var1> <var2> ;' },
    en: {
      description:
        'Using CROSSVAR special variable families can be produced which contain all the characteristic combinations of all the variables involved. This can be used to present multiple cross tables in TABLE for example. If one were to define:…',
      syntax: 'CROSSVAR <newvar> = <var1> <var2> ;',
    },
  },
  {
    name: 'CSS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CSSCLASS',
    de: {
      description:
        'Vergabe einer CSS-Klasse für die HTML-Ausgabe, siehe Formatierung 584',
    },
    en: {
      description:
        'Assignment of a CSS class for the HTML output, see Formatting 584',
      syntax: '',
    },
  },
  {
    name: 'CSV',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CSVEXPORT',
    de: {
      description: '',
      syntax:
        'CSVEXPORT = [ <filename> | "" ];\nImplementierung der guten alten Ausgabe von Tabellen im CSV-Format (HG=...). Alle',
    },
    en: {
      description: '',
      syntax:
        'CSVEXPORT = [ <filename> | "" ];\nNew implementation of the good old output of tables in CSV-Format (HG= ). All text components of the',
    },
  },
  {
    name: 'CSVEXPORTSINGLELINE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CSVINALPHA',
    de: { description: '', syntax: 'CSVINALPHA = <namelist>;' },
    en: { description: '', syntax: 'CSVINALPHA = <namelist>;' },
  },
  {
    name: 'CSVINFILE',
    de: {
      description: '',
      syntax:
        'CSVINFILE [ FILEKEY <key> ] [ <delimchar> ] [ ALLOWEMPTY ]\n= <filepath>;',
    },
    en: {
      description: '',
      syntax:
        'CSVINFILE [ FILEKEY <key> ] [ <delimchar> ] [ ALLOWEMPTY ]\n= <filepath>;',
    },
  },
  {
    name: 'CSVINPROTOCOL',
    de: { description: '', syntax: 'CSVINPROTOCOL = <filename>;' },
    en: { description: '', syntax: 'CSVINPROTOCOL = <filename>;' },
  },
  {
    name: 'CSVOUTFILE',
    de: {
      description: '',
      syntax:
        'CSVOUTFILE = <name>;\n<name> kann ein vollständiger Pfad oder nur ein Dateiname sein. Die Datei-Extension wird',
    },
    en: {
      description: '',
      syntax:
        'CSVOUTFILE = <name>;\n<name> can be a full path or just a file name. The file extension is',
    },
  },
  {
    name: 'CSVSPECIAL',
    de: { description: '', syntax: 'CSVSPECIAL = <filepath>;' },
    en: { description: '', syntax: 'CSVSPECIAL = <filepath>;' },
  },
  {
    name: 'CSVWEIGHT',
    de: { description: '', syntax: 'CSVWEIGHT = <varname>;' },
    en: { description: '', syntax: 'CSVWEIGHT = <varname>;' },
  },
  {
    name: 'CSVWEIGHTOUT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CUMPERCENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CUMULATIVE',
    de: { description: 'Zeilenweise prozentuiert und kumuliert' },
    en: { description: 'Row-wise percentaged and cumulated', syntax: '' },
  },
  {
    name: 'CURRENTMILLIS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CXSERVER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'CXSERVERPORT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DASHMISSING',
    de: {
      description: '',
      syntax: 'DASHMISSING = <char>;\nZEROMISSING = <char>;',
    },
    en: {
      description: '',
      syntax: 'DASHMISSING = <char>;\nZEROMISSING = <char>;',
    },
  },
  {
    name: 'DATA',
    de: {
      description: '',
      syntax:
        'DATA [ USEWEIGHT <weightvar> ] <method> <newvar>\n= <basevar> [ BY <groupvar> ] ;',
    },
    en: {
      description: '',
      syntax:
        'DATA [ USEWEIGHT <weightvar> ] <method> <newvar>\n= <basevar> [ BY <groupvar> ] ;',
    },
  },
  {
    name: 'DATABOX',
    de: {
      description:
        'Kasten um alle DATACELLS, die zur Kreuzung jeweils zweier Variablen gehören.',
    },
    en: {
      description:
        'Box around all DATACELLS that belong to the intersection of any two variables.',
      syntax: '',
    },
  },
  {
    name: 'DATACELL',
    de: { description: 'Jede einzelne Datenzelle der Tabelle' },
    en: { description: 'Each individual data cell of the table', syntax: '' },
  },
  {
    name: 'DATAERRORDOCUMENTATION',
    de: {
      description:
        'ERRORTYPE EXCEPT NUMERIC FILTER VARIABLES EXCEPT numtest y1 to y11 = filename; In diesem Fall würden alle Variablen geprüft, die aus dem Input gelesen werden, bis auf "numtest" und die Variablen y1 bis y11. Es würden alle ERRORTYPE geprüft bis auf NUMERIC und FILTER, d.h. die Prüfung erstreckt sich inhaltlich auf LABELS RANGE und ALIGN.',
      syntax:
        'DATAERRORDOCUMENTATION [ VARIABLES <varlist> ]\n[errortype {<errortype>}*n ] = <filename>;\nerrortype ::= LABELS | RANGE | FILTER | NUMERIC | ALIGN',
    },
    en: {
      description:
        'ERRORTYPE EXCEPT NUMERIC FILTER VARIABLES EXCEPT numtest y1 to y11 = filename; In this case all variables that are read from the input would be checked, except "numtest" and the variables y1 to y11. All ERRORTYPEs would be checked except NUMERIC and FILTER, i.e. the check covers LABELS RANGE and ALIGN in terms of content.',
      syntax:
        'DATAERRORDOCUMENTATION [ VARIABLES <varlist> ]\n[errortype {<errortype>}*n ] = <filename>;\nerrortype ::= LABELS | RANGE | FILTER | NUMERIC | ALIGN',
    },
  },
  {
    name: 'DATAFILE',
    de: {
      description: '',
      syntax:
        'DATAFILE [ FILEKEY <key> ] [ ALLOWEMPTY ] = <filepath>;\nINFILE [ FILEKEY <key> ] [ ALLOWEMPTY ] = <filepath>;',
    },
    en: {
      description: '',
      syntax:
        'DATAFILE [ FILEKEY <key> ] [ ALLOWEMPTY ] = <filepath>;\nINFILE [ FILEKEY <key> ] [ ALLOWEMPTY ] = <filepath>;',
    },
  },
  {
    name: 'DATANOINTERPOL',
    de: { description: '', syntax: 'DATANOINTERPOL = [ YES | NO ];' },
    en: { description: '', syntax: 'DATANOINTERPOL = [ YES | NO ];' },
  },
  {
    name: 'DATE',
    de: {
      description:
        'aktuelles Datum in der Form YYYYMMDD als Zahl CurrentMillis aktueller Zeitpunkt in Millisekunden',
    },
    en: {
      description:
        'current date in the form YYYYMMDD as a number. CurrentMillis: current point in time in milliseconds',
      syntax: '',
    },
  },
  {
    name: 'DATEFORMAT',
    de: { description: '', syntax: 'DATEFORMAT = <string>;' },
    en: {
      description:
        'DATEFORMAT = <string>; In the string the letters Y, M and D are expanded to year, month and day. All other symbols are taken into the date. Thus: DATEFORMAT = "dd.mm.yyyy"; results in the standard European date: 31.10.2009',
      syntax: 'DATEFORMAT = <string>;',
    },
  },
  {
    name: 'DAYOFWEEK',
    de: {
      description:
        'Der Wochentag eines Datums in der Form JJJJMMTT: 1=Montag, 2=Dienstag etc., also ist z.B. DAYOFWEEK( 20061030 ) = 1. WeekOfYear(x) Wochennummer (Kalenderwoche)',
    },
    en: {
      description:
        'The weekday of a date in the form YYYYMMDD: 1=Monday, 2=Tuesday etc., so e.g. DAYOFWEEK( 20061030 ) = 1. WeekOfYear(x) week number (calendar week)',
      syntax: '',
    },
  },
  {
    name: 'DBASEIN',
    de: { description: '', syntax: 'DBASEIN = <filename>;' },
    en: { description: '', syntax: 'DBASEIN = <filename> ;' },
  },
  {
    name: 'DEBUGSTOP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DECIMALPERCENT',
    de: {
      description: '',
      syntax: 'DECIMALPERCENT = <number>;\nVoreinstellung: DECIMALPERCENT = 0;',
    },
    en: {
      description:
        'Defines the number of decimal places for the percentages in cross tables (TABLE) or comparative tables (COMPARE). DECIMALPERCENT settings are valid for all following tables until the next DECIMALPERCENT command. Example: DECIMALPERCENT = 1; Preset: DECIMALPERCENT = 0;',
      syntax: 'DECIMALPERCENT = <number>;\nDefault: DECIMALPERCENT = 0;',
    },
  },
  {
    name: 'DECIMALS',
    de: {
      description: '',
      syntax: 'DECIMALS = <number>;\nDefault: DECIMALS = 0;',
    },
    en: {
      description:
        'The number of decimal places can be stipulated for variable output if no VALUELABEL has been allocated and PRINTALL=YES. It is also used for MEAN or SUM output. Example: DECIMALS = 2; The characteristics or rather sums or mean of all variables then defined have two decimal places after the comma. This is valid until the next DECIMALS command (see also:…',
      syntax: 'DECIMALS = <number>;\nDefault: DECIMALS = 0;',
    },
  },
  {
    name: 'DECRYPT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DEFAULTBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DEFAULTLEVEL',
    de: { description: '', syntax: 'DEFAULTLEVEL = <number>;' },
    en: { description: '', syntax: 'DEFAULTLEVEL = <number>;' },
  },
  {
    name: 'DELETELABELS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DELETEUNUSEDVARS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DELETEVARS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DELIMITED',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DELIMITEDIN',
    en: {
      description: '',
      syntax:
        'DELIMITEDIN [ delim ] = <filename>;\ndelim ::= \'<char>\' | "<char>" | number [ 1..255 ]',
    },
  },
  {
    name: 'DELTAEXPECT',
    de: {
      description:
        'Ausgabe der Differenz zwischen der empirischen Zellenbesetzung und der nach der Randverteilung zu erwartenden Zellenbesetzung',
    },
    en: {
      description:
        'Output of the difference between the empirical cell count and the cell count expected from the marginal distribution',
      syntax: '',
    },
  },
  {
    name: 'DELTAPERCENT',
    argsHint: '( Var, BasisVar )',
    de: {
      description:
        "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Differenz wird auf die 'BasisVar' prozentuiert.",
    },
    en: {
      description:
        "The sums are calculated from 'Var' and 'BasisVar'. The difference is percentaged on 'BasisVar'.",
      syntax: '',
    },
  },
  {
    name: 'DELTAPOINTS',
    argsHint: '( Var, BasisVar )',
    de: {
      description:
        "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Differenz wird auf die Zahl der gültigen Fälle prozentuiert Name Beschreibung",
    },
    en: {
      description:
        "The sums are calculated from 'Var' and 'BasisVar'. The difference is percentaged on the number of valid cases. Name Description",
      syntax: '',
    },
  },
  {
    name: 'DELTASUMPERCENT',
    argsHint: '( VarFamily )',
    de: {
      description:
        'Die VarFamily 274 muss vier Einzelvariablen enthalten. Diese bezeichnen jeweils Zähler und Nenner eines Bruches. über Zähler und Nennen werden die Summen berechnet, und bei der Ausgabe wird die Differenz der Quotienten als Prozentwert ausgegeben.',
    },
    en: {
      description:
        'The VarFamily 274 must contain four individual variables. These each denote the numerator and denominator of a fraction. The sums are calculated over numerator and denominator, and on output the difference of the quotients is shown as a percentage value.',
      syntax: '',
    },
  },
  {
    name: 'DESCEND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DESCRIPTION',
    de: {
      description:
        'Änderung der Standardtexte zur Erklärung des Zelleninhalts in Kreuztabellen 355.',
      syntax: 'DESCRIPTION [ CELLELEMENT ] = <text>;',
    },
    en: {
      description:
        'Example: DESCRIPTION MEAN = Mittel; Usually an explanation of the cell content is printed top left when using TABLE and there are standard texts for this in the system. If these texts are to be altered then the DESCRIPTION command is used, otherwise the texts can be switched off using TABLEFORMAT = NODESCRIPTION;',
      syntax: 'DESCRIPTION [ CELLELEMENT ] = <text>;',
    },
  },
  {
    name: 'DESCRIPTIONBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DESCRIPTIONSTRING',
    de: {
      description: '',
      syntax: 'DESCRIPTIONSTRING = "<DESCRIPTION 1>|...|<DESCRIPTION n>";',
    },
    en: {
      description:
        'Alternatively a descriptive text can be explicitly set. Example: DESCRIPTIONSTRING = "Mittelwert|Absolut"; Individual rows are separated using a vertical line.',
      syntax: 'DESCRIPTIONSTRING = "<DESCRIPTION 1>|...|<DESCRIPTION n>";',
    },
  },
  {
    name: 'DIALLERPROJECTKEY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DIALPREFIX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DICHOQ',
    de: { description: '', syntax: 'DICHOQ <varname> =' },
    en: {
      description:
        'also: GROUPVAR Variable groups can also be generated directly from the input without making the individual variables visible.',
      syntax: 'DICHOQ <varname> =',
    },
  },
  {
    name: 'DICTMODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DIRECTION',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DISPLAY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DISPLAYQUOTA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DISTANCE',
    de: {
      description: '',
      syntax: 'DISTANCE INTERBOX [ X | Y ] <number> = <Zahl>;',
    },
    en: {
      description:
        '(PS): is ignored by line printers. Usually there are no gaps between the different boxes which make up the table. Spaces can however be defined in the X and the Y direction. Example: DISTANCE INTERBOX X = 13; DISTANCE INTERBOX Y = 13; In the standard form (see above) all spaces are set to the stipulated value. DISTANCE INTERBOX can also be differentiated: Valid for X:…',
      syntax: 'DISTANCE INTERBOX [ X | Y ] <number> = <number>;',
    },
  },
  {
    name: 'DIV',
    de: { description: 'liefert das Ergebnis einer Integer-Division' },
    en: {
      description: 'returns the result of an integer division',
      syntax: '',
    },
  },
  {
    name: 'DLL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DOCODEBLOCK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DOCUMENT',
    de: {
      description:
        'Angabe einer Dokumentkennzeichnung, die rechts unten unter den Tabellen erscheint',
      syntax: 'DOCUMENT = "<text>";',
    },
    en: {
      description:
        'Specifies a document indicatorwhich appears at the bottom right under the tables. Example: DOCUMENT = "Demo 2009"; The key words DATE and/or TIME produce a date or time. TIME and DATE key words can be mixed with any number of strings. Example: DOCUMENT = "Auszählung vom" DATE " Zwischenstand" TIME; Valid for all tables. PS):…',
      syntax: 'DOCUMENT = "<text>";',
    },
  },
  {
    name: 'DOMACRO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DOSLOCKS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DOUBLECODEINOVERCODE',
    de: { description: '', syntax: 'DOUBLECODEINOVERCODE = [YES | NO];' },
    en: { description: '', syntax: 'DOUBLECODEINOVERCODE = [YES | NO];' },
  },
  {
    name: 'DOUGHNUT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'DRAWBOX',
    de: {
      description: '',
      syntax:
        'DRAWBOX [<boxtype>] : [WEIGHT [THIN|MEDIUM|BOLD]]\n[COLOR <color>][BORDERS [TOP|LEFT|BOTTOM|RIGHT]]',
    },
    en: {
      description: '(PS): is ignored by line printers.',
      syntax:
        'DRAWBOX <boxname> =\n<number> { [ TOP | LEFT | RIGHT | BOTTOM | BOXRADIUS <number> ] }*n ;',
    },
  },
  {
    name: 'DUMMYHEAD',
    de: { description: '', syntax: 'DUMMYHEAD = <varname>' },
    en: { description: '', syntax: 'DUMMYHEAD = <name>;' },
  },
  {
    name: 'EDIT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EDITLABELINSCREEN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EDITOPENQ',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EFFECTIVEBASE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ELASTICITY',
    argsHint: '(PS)',
    de: { description: '', syntax: 'ELASTICITY = <number>;' },
    en: {
      description:
        'Elasticity is a measurement of how the scaling in the X direction is allowed to differ from the scaling in the Y direction. Preset: ELASTICITY = 0.15; Background: Printing in Postscript offers the possibility to scale tables to fit which are larger than the available area on a page. This adjustment can be made independently in the X or the Y direction.…',
      syntax: 'ELASTICITY = <number>;',
    },
  },
  {
    name: 'ELDAS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ELECTION',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ELEMENTCOLOR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ELEMENTFONT',
    de: {
      description: '',
      syntax:
        'ELEMENTFONT <cellelement> : <fontname> SIZE <number>\n[STYLE [BOLD|ITALIC|UNDERLINE]]\nELEMENTCOLOR <cellelement> : <color>',
    },
    en: {
      description: '',
      syntax:
        'ELEMENTFONT <cellelement> : <fontname> SIZE <number>\n[STYLE [BOLD|ITALIC|UNDERLINE]]\nELEMENTCOLOR <cellelement> : <color>',
    },
  },
  {
    name: 'ELIMINATE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ELLIPSIS',
    de: {
      description: 'Konfidenzintervall als Ellipse anzeigen (wenn bekannt)',
    },
    en: {
      description: 'Show the confidence interval as an ellipse (when known)',
      syntax: '',
    },
  },
  {
    name: 'ELSE',
    de: {
      description:
        "CONCAT neue = 'xx' '-' 'yy' '-' xx1 '-' x5; übersichtlicher ist oft die Verwendung von IFBLOCK/ELSEBLOCK/ENDBLOCK anstelle von IF/ELSE: IFBLOCK [ 2 3 ] IN x7 THEN COMPUTE CONCAT neue = 'aa' '-' 'bb' '-' xx1 '-' x5; COMPUTE SUBSTR PART = neue 1 20;",
    },
    en: {
      description:
        'x = e / ( d + c ); The ELSE part of the command can be omitted, e.g. IF a EQ 3 THEN d = 5; Compared with the set operator IN easily allows the test for the existence of values in multi-response variables. The test can look like this: IF 4 IN famvar_01 THEN ... A variable must always be on the right side.…',
    },
  },
  {
    name: 'ELSEBLOCK',
    de: {
      description:
        '//hier können mehrere computes/ifs etc stehen ENDBLOCK; Die Komponente ELSEBLOCK ist optional. Von dieser Logik betroffen sind: alle COMPUTE 286s, alle Formen von IF (IF ... THEN 302, IF ... PRINT 48, IF ... LOAD 306) alle RECODE 254s, COUNT 285 und MEAN 312. Alle übrigen Statements ignorieren die IFBLOCK-Anweisungen. Mehrere IFBLOCKs können ineinander geschachtelt werden.…',
    },
    en: {
      description:
        '//several computes/ifs etc. can appear here ENDBLOCK; The ELSEBLOCK component is optional. Affected by this logic are: all COMPUTE 286, all forms of IF (IF ... THEN 302, IF ... PRINT 48, IF ... LOAD 306), all RECODE 254, COUNT 285 and MEAN 312. All other statements ignore the IFBLOCK directives. Several IFBLOCKs can be nested within each other.…',
      syntax: '',
    },
  },
  {
    name: 'EMPTYSIGNDASH',
    de: {
      description:
        "Im Normalfall wird in Fällen, wo alle Signifikanztests gegen alle Spalten bzw. Zeilen fehlgeschlagen sind, nichts ausgegeben. Da kann bei einem vertikalen Alignment (ALIGN VCENTER 554) zu unerwünschter Optik führen. Ist dies TABLEFORMAT gesetzt, wird in diesen Fälle ein '-' ausgegeben, damit alle Elemente auf derselben Höhe stehen.",
    },
    en: {
      description:
        "Normally nothing is output in cases where all significance tests against all columns or rows have failed. With vertical alignment (ALIGN VCENTER 554) this can lead to undesirable appearance. If this TABLEFORMAT is set, a '-' is output in these cases so that all elements are at the same height.",
      syntax: '',
    },
  },
  {
    name: 'EMPTYTABLETEXT',
    de: { description: '', syntax: 'EMPTYTABLETEXT = "<text>";' },
    en: { description: '', syntax: 'EMPTYTABLETEXT = "<text>";' },
  },
  {
    name: 'ENCAPSULATED',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ENCODING',
    de: { description: '', syntax: 'ENCODING CSVOUTFILE = [ ANSI | UTF8 ];' },
    en: {
      description:
        'As GESS tabs was born as a DOS program and some clients hate nothing more than a change in standard settings, the Char-Set-Encoding from DOS, i.e. IBM850 for North/Middle Europe is set as standard. This can be changed in two ways: the encoding can be explicitly defined using the ENCODING statement presented here.…',
      syntax: 'ENCODING CSVOUTFILE = [ ANSI | UTF8 ];',
    },
  },
  {
    name: 'ENCODING CSVOUTFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ENCRYPT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'END',
    de: { description: '', syntax: 'END;' },
    en: { description: '', syntax: 'END;' },
  },
  {
    name: 'ENDBLOCK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ENDCODEBLOCK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ENDEXPORT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ENDFILTER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ENDMACRO',
    de: {
      description:
        'Dann würde der Aufruf von #tab( var1 ) ebenso funktionieren wie der Aufruf von #tab( var1 var2 var3 var4 ) #IfExist und #IfNExist Mit #IFEXIST und #IFNEXIST kann man abfragen, ob eine Variable dieses Namens bereits existiert. Anwendungsbeispiele Ein Include-File mit dem Namen "SETPAPER.INC" könnte z.B. folgende Anweisungen enthalten: #IFDEF A4 #IFDEF quer PAPER = Height 210 Width 297;',
    },
    en: {
      description:
        'Then the call #tab( var1 ) would work just as well as the call #tab( var1 var2 var3 var4 ). #IfExist and #IfNExist: with #IFEXIST and #IFNEXIST you can check whether a variable of this name already exists. Usage examples: an include file named "SETPAPER.INC" could e.g. contain the following instructions: #IFDEF A4 #IFDEF quer PAPER = Height 210 Width 297;',
      syntax: '',
    },
  },
  {
    name: 'ENFORCEUTF8INOPENQ',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ENFORCEUTF8INOPENQFILE',
    de: { description: '', syntax: 'ENFORCEUTF8INOPENQFILE = [ YES | NO ];' },
    en: { description: '', syntax: 'ENFORCEUTF8INOPENQFILE = [ YES | NO ];' },
  },
  {
    name: 'ENTIER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EPS',
    en: {
      description: '',
      syntax:
        'EPS [ REPLACE | FOREGROUND ] = <FileName> <xPoints> <yPoints> [ [\nWIDTH | HEIGHT ] <Points> ] ;',
    },
  },
  {
    name: 'EQ',
    de: { description: 'Equal, ist gleich' },
    en: { description: 'Equal', syntax: '' },
  },
  {
    name: 'ERRORTYPE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ESS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ESSCOLCHIQU',
    de: {
      description:
        'Spaltenweise 4-Felder Chi²-Test auf Prozentwertunterschied nach Umrechnung aus ESS 446',
    },
    en: {
      description:
        'Column-wise 4-field chi-square test on percentage differences after conversion from ESS 446',
      syntax: '',
    },
  },
  {
    name: 'ESSCOLDEPTTEST',
    de: {
      description:
        'Abhängiger t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS 446 Name Beschreibung',
    },
    en: {
      description:
        'Dependent t-test on mean differences after conversion to ESS 446. Name Description',
      syntax: '',
    },
  },
  {
    name: 'ESSMCNEMAR',
    de: {
      description:
        'Abhängiger Test auf Prozentwertunterschied nach McNemar 449 nach Umrechnung auf ESS 446',
    },
    en: {
      description:
        'Dependent test on percentage differences per McNemar 449 after conversion to ESS 446',
      syntax: '',
    },
  },
  {
    name: 'ESSMEANCOLDEPT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ESSMEANTEST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ESSMEANWELCH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ESSROWCHICU',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ESSROWCHIQU',
    de: {
      description: 'Zeilenweiser Chi²-Test auf Basis der ESS 446-Umrechnung',
    },
    en: {
      description: 'Row-wise chi-square test based on the ESS 446 conversion',
      syntax: '',
    },
  },
  {
    name: 'ESSROWMEANTEST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ESSROWTTEST',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS 446, zeilenweise',
    },
    en: {
      description:
        'Independent t-test on mean differences after conversion to ESS 446, row-wise',
      syntax: '',
    },
  },
  {
    name: 'ESSTTEST',
    argsHint: '(Var)',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS 446',
    },
    en: {
      description:
        'Independent t-test on mean differences after conversion to ESS 446',
      syntax: '',
    },
  },
  {
    name: 'ESSWELCHTEST',
    de: {
      description:
        'Unabhängiger Welch 450’s t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS 446',
    },
    en: {
      description:
        'Independent Welch’s t-test on mean differences after conversion to ESS 446',
      syntax: '',
    },
  },
  {
    name: 'EST',
    de: {
      description:
        '|                | MEANTEST | PHYSMEANTE |            | ESSMEANTEST |             | | -------------- | -------- | ---------- | ---------- | ----------- | ----------- | | kombiniert mit |          |            | XMEANTEST  |             | HYMEANTEST  |',
    },
    en: {
      description:
        '|                | MEANTEST | PHYSMEANTE |            | ESSMEANTEST |             | | -------------- | -------- | ---------- | ---------- | ----------- | ----------- | | combined with  |          |            | XMEANTEST  |             | HYMEANTEST  |',
      syntax: '',
    },
  },
  {
    name: 'EURO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EVALFAMVALONCE',
    de: { description: '', syntax: 'EVALFAMVALONCE <Varlist> = [ YES | NO ];' },
    en: {
      description: '',
      syntax:
        'EVALFAMVALONCE <Varlist> = YES or NO;\n(EvalFamValOnce = EVALuate FAMilyvariables VALues ONCE). Using VARFAMILYs it can make',
    },
  },
  {
    name: 'EXCEL2XLABELS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCEL2XTITLES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCEL2YLABELS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCEL2YTITLES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELALIGNH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELALIGNV',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELAXISMINMAX',
    en: { description: '', syntax: 'EXCELAXISMINMAX = <minvalue> maxvalue> ;' },
  },
  {
    name: 'EXCELCALCROWHEIGHT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELCHART',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELCHARTDATA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELCHARTFORMAT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELCHARTINVERT',
    en: { description: '', syntax: 'EXCELCHARTINVERT = [ YES | NO ];' },
  },
  {
    name: 'EXCELCOLOR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELDOCUMENT',
    de: {
      description:
        'Kennzeichnung des Tabellenbandes in Excel übertragen. Wenn dies TABLEFORMAT gesetzt ist, werden Zahlen mit Nachkommastellen explizit auf die Zahl der Nachkommastellen',
    },
    en: {
      description:
        'Transfer the labelling of the table volume to Excel. If this TABLEFORMAT is set, numbers with decimal places are explicitly formatted to the number of decimal places',
      syntax: '',
    },
  },
  {
    name: 'EXCELFILENAME',
    de: { description: '', syntax: 'EXCELFILENAME = <dateiname>;' },
    en: { description: '', syntax: 'EXCELFILENAME = <filename>;' },
  },
  {
    name: 'EXCELFOOTER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELFRAMES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELGRAPHSHEETNAME',
    en: { description: '', syntax: 'EXCELGRAPHSHEETNAME = <name>;' },
  },
  {
    name: 'EXCELHEADER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELHIDEUPDATE',
    de: { description: '', syntax: 'EXCELHIDEUPDATE = [ YES | NO ];' },
    en: {
      description:
        'If this option is set to YES the Excel interface is only showed by INSTANTEXCEL=YES if a table is finished. This can reduce the processing time for the transfer to Excel. To control the appearance of tables using INSTANTEXCEL: the following TABLEFORMATs are available:…',
      syntax: 'EXCELHIDEUPDATE = [ YES | NO ];',
    },
  },
  {
    name: 'EXCELLABELANGLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELNODISTANCE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELNOFONT',
    de: {
      description:
        'trägt dies zur Performance bei. dies gilt auch bei OPENOFFICEDEVIATION. Wenn dies TABLEFORMAT gesetzt ist, wird die DOCUMENT-',
    },
    en: {
      description:
        'this contributes to performance. This also applies with OPENOFFICEDEVIATION. If this TABLEFORMAT is set, the DOCUMENT',
      syntax: '',
    },
  },
  {
    name: 'EXCELNOWRAPTEXT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELNUMBERFORMAT',
    de: {
      description:
        'formatiert, und damit die Automatik von Excel umgangen, Nullen als Nachkommastellen zu tilgen. EXCELFRAMES Rahmen um die Excel-Tabelle EXCELCOLOR Übernahme von COLOR FOREGROUND bzw. BACKGROUND EXCELALIGN[H/V] Übernahme horizontales/ vertikales Alignment der Zellen EXCELPAGEBREAK generiert einen Seitenwechsel am Ende der Tabelle EXCELHEADER Übernahme eines HEADER nach Excel Bewirkt, dass…',
    },
    en: {
      description:
        "formatted, thereby bypassing Excel's automatic removal of zeros as decimal places. EXCELFRAMES box around the Excel table. EXCELCOLOR adoption of COLOR FOREGROUND or BACKGROUND. EXCELALIGN[H/V] adoption of horizontal/vertical alignment of the cells. EXCELPAGEBREAK generates a page break at the end of the table. EXCELHEADER adoption of a HEADER into Excel. Causes…",
      syntax: '',
    },
  },
  {
    name: 'EXCELONELINELABEL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELOUT',
    argsHint: '(out-dated)',
    en: {
      description: '(In many cases INSTANTEXCEL should be more practical)',
      syntax: 'EXCELOUT = <filename>;',
    },
  },
  {
    name: 'EXCELOUT AS HTML',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELOUT VIA HTML',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELOUTACROSS',
    de: {
      description:
        'Die atomaren Elemente von zusammengesetzten CELLELEMENTS werden bei EXCELOUT 605 nicht untereinander, sondern nebeneinander dargestellt.',
    },
    en: {
      description:
        'The atomic elements of composite CELLELEMENTS are shown side by side rather than one below the other in EXCELOUT 605.',
      syntax: '',
    },
  },
  {
    name: 'EXCELPAGEBREAK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELPICTURE',
    en: {
      description:
        'This key word is used to transfer an illustration (PNG-FILE or JPG-FILE) to an Excel table. This then appears above the table.',
    },
  },
  {
    name: 'EXCELRANGEDELIM',
    de: { description: '', syntax: 'EXCELRANGEDELIM = <char>;' },
    en: { description: '', syntax: 'EXCELRANGEDELIM = <char>;' },
  },
  {
    name: 'EXCELSTYLEFILE',
    de: { description: '', syntax: 'EXCELSTYLEFILE = <filename>;' },
    en: { description: '', syntax: 'EXCELSTYLEFILE = <filename>;' },
  },
  {
    name: 'EXCELTEMPLATEFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCELUPDATEONLY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCEPT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXCLUDEFROMTO',
    en: { description: '', syntax: 'EXCLUDEFROMTO = { vartype }*n ;' },
  },
  {
    name: 'EXCLUDEVALUES',
    de: {
      description: '',
      syntax:
        'EXCLUDEVALUES <varlist> = <valuelist>;\nRESTRICTVALUES <varlist> = <valuelist>;',
    },
    en: {
      description: '',
      syntax:
        'EXCLUDEVALUES <varlist> = <valuelist>;\nRESTRICTVALUES <varlist> = <valuelist>;',
    },
  },
  {
    name: 'EXDECIMALCHAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXDELIMCHAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXECUTE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXP',
    de: { description: 'inverse Funktion zu LN' },
    en: { description: 'inverse function of LN', syntax: '' },
  },
  {
    name: 'EXPAND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXPANDATCHAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXPANDBOX',
    de: {
      description:
        'Das TABLEFORMAT EXPANDBOX wird intern in EXPANDHEIGHT 537 übersetzt. Also: TABLEFORMAT = + EXPANDBOX; bedeutet, dass die Höhe der Zellen erweitert werden soll.',
    },
    en: {
      description:
        'If a shared block has been drawn around the data cells using DRAWBOX it often looks better if there is a vertical space before the first and after the last data row and the upper and lower frames. This space can be set using EXPANDHEIGHT; it should be noted that then the DATABOX is not congruent to the sum of the DATACELLs. (Only effective with Postscript-printouts). (PS)',
    },
  },
  {
    name: 'EXPANDHEIGHT',
    de: {
      description:
        'Zeichnet man mit DRAWBOX 552 einen gemeinsamen Block um die Datenzellen, sieht es häufig besser aus, wenn vor der ersten und nach der letzten Datenzeile ein vertikaler Zwischenraum zum oberen und unteren Rand geschaffen wird. Diesen Rand kann man mit EXPANDHEIGHT anfordern; zu beachten ist, dass dann die DATABOX nicht deckungsgleich ist mit der Summe der DATACELLs.…',
    },
    en: {
      description:
        'If you draw a common block around the data cells with DRAWBOX 552, it often looks better if vertical space is created before the first and after the last data row towards the top and bottom edge. This margin can be requested with EXPANDHEIGHT; note that the DATABOX is then not congruent with the sum of the DATACELLs.…',
      syntax: '',
    },
  },
  {
    name: 'EXPANDINDOMACRO',
    de: { description: '', syntax: 'EXPANDINDOMACRO = [ YES | NO ];' },
    en: { description: '', syntax: 'EXPANDINDOMACRO = [ YES | NO ];' },
  },
  {
    name: 'EXPANDMISSINGTEXT',
    de: { description: '', syntax: 'EXPANDMISSINGTEXT = <string>;' },
    en: { description: '', syntax: 'EXPANDMISSINGTEXT = <string>;' },
  },
  {
    name: 'EXPECT',
    de: {
      description:
        'Ausgabe der nach der Randverteilung zu erwartenden Zellenbesetzung',
    },
    en: {
      description:
        'Output of the cell count expected from the marginal distribution',
      syntax: '',
    },
  },
  {
    name: 'EXPLODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXPORTFILE',
    de: { description: '', syntax: 'EXPORTFILE = [ <filename> | "" ];' },
    en: { description: '', syntax: 'EXPORTFILE = [ <filename> | "" ];' },
  },
  {
    name: 'EXTERNALJOB',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXTRAFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'EXTREME',
    de: {
      description:
        'der Verteilung (EXTREME) können selektiert werden. Beispiele: TABLE = a MEAN( b ) BY c SORT MEAN PANE 2 EXTREME 20; // jeweils 20 von jedem Ende der Verteilung TABLE = a BY c SORT ABSOLUTE TOP 80; // die obersten 80',
    },
    en: {
      description:
        'of the distribution (EXTREME) can be selected. Examples: TABLE = a MEAN( b ) BY c SORT MEAN PANE 2 EXTREME 20; // 20 from each end of the distribution. TABLE = a BY c SORT ABSOLUTE TOP 80; // the top 80',
      syntax: '',
    },
  },
  {
    name: 'FALLING',
    de: {
      description:
        'gegenläufige Skalen | HORIZONTAL | VERTICAL ] ] Kombination HORIZONTAL/VERTICAL XY-Plot [ COLOR <$rrggbb> ] Hexadezimaler RGB-Wert [ LINECOLOR < $rrggbb > ] [ NUMINGRAPH | NUMEXGRAPH | Numerische Beschriftung eines grafischen NUMCENTERGRAPH ] Elements innerhalb bzw, außerhalb der Grafik oder in ihr zentriert [ AXISMINMAX <minval> <maxval> Vorbelegung der Skala mit Extremwerten ]',
    },
    en: {
      description:
        'opposing scales | HORIZONTAL | VERTICAL ] ] combination HORIZONTAL/VERTICAL XY plot [ COLOR <$rrggbb> ] hexadecimal RGB value [ LINECOLOR < $rrggbb > ] [ NUMINGRAPH | NUMEXGRAPH | numeric labelling of a graphical NUMCENTERGRAPH ] element inside, outside or centred within the graphic [ AXISMINMAX <minval> <maxval> preset the scale with extreme values ]',
      syntax: '',
    },
  },
  {
    name: 'FAMILYVAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FCOMPUTE',
    de: { description: '', syntax: 'FCOMPUTE <varname> ....' },
    en: {
      description:
        'Parallel to the COMPUTE statement there is also FCOMPUTE, which tests the filters set with SETFILTER. FCOMPUTE is only used if all the filter conditions are true or if there is no filter.',
      syntax: 'FCOMPUTE <varname> ....',
    },
  },
  {
    name: 'FIF',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FILEKEY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FILEPATH',
    de: { description: '', syntax: 'FILEPATH "<filepath>"' },
    en: { description: '', syntax: 'FILEPATH "<filepath>"' },
  },
  {
    name: 'FILL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FILTER',
    de: {
      description:
        'Im Anschluss an jedes Tabellenelement können mit FILTER <Bedingung> | lokale Selektionen 330 vorgenommen werden, zum Beispiel: TABLE = V1 FILTER geschl EQ 1 | V1 FILTER geschl EQ 2 | BY V1 MEANTEST; SORT SORT [ DESCEND ] [ POSITION | ALPHA | CODE | Cellelement ] [ PANE <value> CODE <value> ] :…',
      syntax: 'FILTER <varlist> [ = <Bedingung> | AS <varname> ] ;',
    },
    en: {
      description:
        'After each table element, local selections 330 can be made with FILTER <condition> |, for example: TABLE = V1 FILTER geschl EQ 1 | V1 FILTER geschl EQ 2 | BY V1 MEANTEST; SORT SORT [ DESCEND ] [ POSITION | ALPHA | CODE | Cellelement ] [ PANE <value> CODE <value> ] :…',
      syntax: 'FILTER <varlist> [ = <bedingung> | AS <varname> ] ;',
    },
  },
  {
    name: 'FIRSTCOLUMN',
    de: { description: '', syntax: 'FIRSTCOLUMN : <number>' },
    en: { description: '', syntax: 'FIRSTCOLUMN : <number>' },
  },
  {
    name: 'FIXED',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FIXEDPOSITION',
    de: { description: '', syntax: 'FIXEDPOSITION <VarList> = [ YES | NO ];' },
    en: { description: '', syntax: 'FIXEDPOSITION <VarList> = [ YES | NO ];' },
  },
  {
    name: 'FIXLABELCOLUMN',
    de: { description: '', syntax: 'FIXLABELCOLUMN : [YES|NO]' },
    en: { description: '', syntax: 'FIXLABELCOLUMN : [YES|NO]' },
  },
  {
    name: 'FIXLABELROWS',
    de: {
      description: '',
      syntax:
        'FIXLABELROWS : <number>\nFIXLABELROWS wird den <number> Zeilen-Teil der Tabelle "fix" halten, sodass diese sichtbar',
    },
    en: {
      description: '',
      syntax:
        'FIXLABELROWS : <number>\nFIXLABELROWS will keep the <number> rows part of the table "fixed", so that it stays visible',
    },
  },
  {
    name: 'FLOWTEXT',
    de: { description: '', syntax: 'FLOWTEXT <boxname> : [ YES | NO ]' },
    en: { description: '', syntax: 'FLOWTEXT <boxname> : [ YES | NO ]' },
  },
  {
    name: 'FLT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FONT',
    en: {
      description: '',
      syntax: 'FONT <Fontname> CPI <number> = <ESC-String>;',
    },
  },
  {
    name: 'FONTNAME',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FOOTER',
    de: {
      description: '',
      syntax: 'FOOTER = "<text>" [ LEFT | HCENTER | RIGHT ] ;',
    },
    en: {
      description: '',
      syntax: 'FOOTER = "text" [ LEFT | HCENTER | RIGHT | ] ;',
    },
  },
  {
    name: 'FOOTERBOX',
    de: {
      description:
        'Kasten um den FOOTER 522, außerhalb der Tabelle FRAMEBOX X Kasten um alle FRAMECELL X FRAMEBOX Y Kasten um alle FRAMECELL Y FRAMECELL X Kasten um einzelne Datenelemente der Rahmenspalten (Elemente der X-Achse) FRAMECELL Y Kasten um einzelne Datenelemente der Rahmenzeilen (Elemente der Y-Achse)',
    },
    en: {
      description:
        'Box around the FOOTER 522, outside the table. FRAMEBOX X box around all FRAMECELL X. FRAMEBOX Y box around all FRAMECELL Y. FRAMECELL X box around individual data elements of the frame columns (elements of the X axis). FRAMECELL Y box around individual data elements of the frame rows (elements of the Y axis)',
      syntax: '',
    },
  },
  {
    name: 'FORCELABELINPUT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FORCOUNTS',
    de: {
      description:
        'Variable ist vorrangig zur Häufigkeitsauszählung (Tabellenaufriss) sinnvoll.',
      syntax:
        'FORCOUNTS <varname> = [ YES | NO ];\nFORHEADER <varname> = [ YES | NO ];\nFORMEANS <varname> = [ YES | NO ];',
    },
    en: {
      description:
        'Variable is primarily useful for frequency counts (table breakdown).',
      syntax:
        'FORCOUNTS <varname> = [ YES | NO ];\nFORHEADER <varname> = [ YES | NO ];\nFORMEANS <varname> = [ YES | NO ];',
    },
  },
  {
    name: 'FOREGROUND',
    de: {
      description:
        'Farbinformation 557 für Vordergrund (Schrift) und Hintergrund',
    },
    en: {
      description:
        'Analogue to BACKGROUND and is used to shade the foreground which normally means the colour of the text.',
    },
  },
  {
    name: 'FOREHEADER',
    de: {
      description:
        'Variable soll bevorzugt im Tabellenkopf dargestellt werden.',
    },
    en: {
      description: 'Variable should preferably be shown in the table header.',
      syntax: '',
    },
  },
  {
    name: 'FORHEADER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FORM',
    de: {
      description:
        'verwendet werden. [ RECTANGLE | LINE | RECTLINE | TRIANGLE1 | TRIANGLE1O | | TRIANGLE2 | TRIANGLE2O | SQUARE1 | SQUARE1O | SQUARE2 | SQUARE2O | CIRCLE | CIRCLEO | ELLIPSIS | GAUSS | GAUSSO ] ] [ PIE | PIE100 ] [ XYPLOT ] }*n [ DIRECTION [ RISING | Kombination RISING/FALLING',
      syntax: 'FORM : [BARS | COLUMNS | LINES | PIE]',
    },
    en: {
      description:
        'can be used. [ RECTANGLE | LINE | RECTLINE | TRIANGLE1 | TRIANGLE1O | | TRIANGLE2 | TRIANGLE2O | SQUARE1 | SQUARE1O | SQUARE2 | SQUARE2O | CIRCLE | CIRCLEO | ELLIPSIS | GAUSS | GAUSSO ] ] [ PIE | PIE100 ] [ XYPLOT ] }*n [ DIRECTION [ RISING | combination RISING/FALLING',
      syntax: 'FORM : [BARS | COLUMNS | LINES | PIE]',
    },
  },
  {
    name: 'FORMAT',
    de: { description: '', syntax: 'FORMAT = "<formatstring>";' },
    en: {
      description:
        'Defines a format for the representation of a particular cell content. If for example a mean is to be a scale with an algebraic sign, a comma as decimal separator and two decimal places then the following would be written (formats should always be written in quotation marks (") ): FORMAT MEAN = "+#,##"; FORMAT recognises the following control characters:…',
      syntax: 'FORMAT = "<formatstring>";',
    },
  },
  {
    name: 'FORMATIFLESS',
    de: {
      description: '',
      syntax:
        'FORMATIFLESS <cellelement> [ IN <place> ] BY <typ> <number> = <formatstring>;\ntyp ::= < ABSOLUTE | PHYSICALRECORDS | VALIDN | ESS >\nplace ::= < DATACELL | FRAMECELL X | FRAMECELL Y >',
    },
    en: {
      description: '',
      syntax:
        'FORMATIFLESS <cellelement> [ IN <place> ] BY <type> <number> = <formatstring>;\ntype ::= < ABSOLUTE | PHYSICALRECORDS | VALIDN | ESS >\nplace ::= < DATACELL | FRAMECELL X | FRAMECELL Y >',
    },
  },
  {
    name: 'FORMEAN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FORMEANS',
    de: {
      description:
        'Variable eignet sich für numerische Statistiken. Syntax LiveTabs Für die Weiterverarbeitung von Datensätzen in GESS LiveTabs ist es notwendig, dass die speziellen Variableneigenschaften für GESS LiveTabs auch im SYNTAX-Include-File weitergegeben werden. Hierzu dient das LIVETABS-Argument für das SYNTAX 42 -Statement.',
    },
    en: {
      description:
        'Variable is suitable for numeric statistics. Syntax LiveTabs: for further processing of data records in GESS LiveTabs it is necessary that the special variable properties for GESS LiveTabs are also passed on in the SYNTAX include file. The LIVETABS argument for the SYNTAX 42 statement serves this purpose.',
      syntax: '',
    },
  },
  {
    name: 'FORMS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FRAMEBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FRAMECELL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FRAMECELL X',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FRAMECELL Y',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FRAMECOLOR',
    de: { description: '', syntax: 'FRAMECOLOR : <color>' },
    en: {
      description:
        'The colour of the frames can also be defined using HSB or RGB as above. COLOR FOREGROUND or COLOR BACKGROUND With the COLOR statement DATACELLS and FRAMECELLS can be coloured depending on the value, e.g. all mean above a certain value are printed in red etc.',
      syntax: 'FRAMECOLOR : <color>',
    },
  },
  {
    name: 'FRAMECROSS',
    de: {
      description:
        'Der Schnittpunkt von FRAMEBOX X und FRAMEBOX Y FRAMETITLE X Kasten um Bezeichnung von FRAMEELEMENTS der X-Achse (z.B. Insgesamt) FRAMETITLE Y Kasten um Bezeichnung von FRAMEELEMENTS der Y-Achse (z.B. Insgesamt) FRAMETITLEBOX X Kasten um alle FRAMETITLE-Boxes der X-Achse FRAMETITLEBOX Y Kasten um alle FRAMETITLE-Boxes der Y-Achse',
    },
    en: {
      description:
        'The intersection of FRAMEBOX X and FRAMEBOX Y. FRAMETITLE X box around the label of FRAMEELEMENTS of the X axis (e.g. Total). FRAMETITLE Y box around the label of FRAMEELEMENTS of the Y axis (e.g. Total). FRAMETITLEBOX X box around all FRAMETITLE boxes of the X axis. FRAMETITLEBOX Y box around all FRAMETITLE boxes of the Y axis',
      syntax: '',
    },
  },
  {
    name: 'FRAMEELEMENTS',
    de: {
      description: '',
      syntax:
        'FRAMEELEMENTS = [ ABSCOLUMN | ABSROW | PHYSICALCOLUMN\n| PHYSICALROW | TOTALCOLUMN | TOTALROW ] ;',
    },
    en: {
      description:
        'TABLETYPEs are allocated to specific frame elements of a table; thus e.g. a table with row percentages (TABLETYPE = ROWPERCENT;) has by default an absolute column ("No. of Cases") and a total row ("Total"). With the specification FRAMEELEMENTS frame elements can be specifically requested. The key words necessary are:',
      syntax:
        'FRAMEELEMENTS = [ ABSCOLUMN | ABSROW | PHYSICALCOLUMN\n| PHYSICALROW | TOTALCOLUMN | TOTALROW ] ;',
    },
  },
  {
    name: 'FRAMEPOSITION',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FRAMETITLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FRAMETITLE X',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FRAMETITLE Y',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FRAMETITLEBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FREEZEALL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FREEZEFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FREEZESWITCH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FROZEN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'FROZENCODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GAMMA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GAUSS',
    de: {
      description: 'Konfidenzintervall als stilisierte Gausskurve anzeigen',
    },
    en: {
      description: 'Show the confidence interval as a stylised Gauss curve',
      syntax: '',
    },
  },
  {
    name: 'GAUSSO',
    de: {
      description:
        'Konfidenzintervall als stilisierte Gausskurve anzeigen (outline)',
    },
    en: {
      description:
        'Show the confidence interval as a stylised Gauss curve (outline)',
      syntax: '',
    },
  },
  {
    name: 'GE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GENERATELABELS',
    de: { description: '', syntax: 'GENERATELABELS <varname>;' },
    en: { description: '', syntax: 'GENERATELABELS <varlist>;' },
  },
  {
    name: 'GEO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GEOMETRICMEAN',
    argsHint: '( Var )',
    de: {
      description:
        'Das geometrische Mittel ist die n.-Wurzel aus dem Produkt aller Einzelwerte (nur für positive Zahlen definiert)',
    },
    en: {
      description:
        'The geometric mean is the n-th root of the product of all individual values (defined only for positive numbers)',
      syntax: '',
    },
  },
  {
    name: 'GEORESTRICT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GESS',
    en: {
      description: '',
      syntax:
        'GESS [ INCLUDE ] <qualifier> = <filename> [ COLSFROMNAME ]\n[ COLUMN <number> ]\n[ VARIABLES <varlist> ]\n[ CARD <number> ]\n[ BITGROUP <number> ]\n;',
    },
  },
  {
    name: 'GESSCHART',
    de: {
      description:
        'GESStabs Artist ist ab Version 4.3.0.0 integrierter Bestandteil von GESStabs. Das Schlüsselwort zum Aufruf lautet GESSCHART. Syntaktisch ist GESSCHART eine Option zum TABLE-Statement. Mit GESSCHART-Statements kann man im Anschluss an ein TABLE-Statement die Anfertigung von Charts anfordern, die sich inhaltlich aus ausgewählten Werten und Texten der Tabelle zusammensetzen.…',
    },
    en: {
      description:
        'GESStabs Artist has been an integrated part of GESStabs since version 4.3.0.0. The keyword to invoke it is GESSCHART. Syntactically, GESSCHART is an option of the TABLE statement. With GESSCHART statements you can, following a TABLE statement, request the creation of charts whose content is assembled from selected values and texts of the table.…',
      syntax: '',
    },
  },
  {
    name: 'GESSCHARTCOLORS',
    de: {
      description:
        'der erste Farbwert der definierten ausgewählt werden. Anstelle eines Grüntons sollen die Säulen blau eingefärbt werden, die erste Position des bestehenden Farbschemas wird | ausgetauscht    | und anschließend |              | das Chart angefordert:…',
      syntax: 'GESSCHARTCOLORS = { <colorvalue> }*n ;\n<colorvalue> = $rrggbb',
    },
    en: {
      description:
        'the first colour value of the ones defined is selected. Instead of a green tone the bars are to be coloured blue; the first position of the existing colour scheme is replaced and then the chart is requested:…',
      syntax: 'GESSCHARTCOLORS = { <colorvalue> }*n ;\n<colorvalue> = $rrggbb',
    },
  },
  {
    name: 'GESSCHARTDATA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GESSCHARTFONT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GESSCHARTFORMAT',
    de: { description: '', syntax: 'GESSCHARTFORMAT = { + | - <option> }*n ;' },
    en: { description: '', syntax: 'GESSCHARTFORMAT = { + | - <option> }*n ;' },
  },
  {
    name: 'GESSCHARTNUMFORMAT',
    de: {
      description: '',
      syntax:
        "GESSCHARTNUMFORMAT = <formatstring>;\nDefault: GESSCHARTNUMFORMAT =' (#)';",
    },
    en: {
      description: '',
      syntax:
        "GESSCHARTNUMFORMAT = <formatstring>;\nDefault: GESSCHARTNUMFORMAT =' (#)';",
    },
  },
  {
    name: 'GESSCHARTPRINTFILE',
    de: {
      description: '',
      syntax: 'GESSCHARTPRINTFILE [ PS | PDF ] = <filename>;',
    },
    en: {
      description: '',
      syntax: 'GESSCHARTPRINTFILE [ PS | PDF ] = <filename>;',
    },
  },
  {
    name: 'GETPRTSETUP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GETQUOTA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GETTABSETUP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GLOBALASALPHA',
    de: {
      description: '',
      syntax:
        'GLOBALASALPHA = [ YES | NO ];\nGLOBALOPENASALPHA = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax:
        'GLOBALASALPHA = [ YES | NO ];\nGLOBALOPENASALPHA = [ YES | NO ];',
    },
  },
  {
    name: 'GLOBALCELLMINIMUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GLOBALCOLMINIMUM',
    en: {
      description: 'Global preset for COLMINIMUM for all the following tables.',
    },
  },
  {
    name: 'GLOBALOPENASALPHA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GLOBALPHYSCELLMINIMUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GLOBALPRINTALL',
    en: {
      description:
        'These options steer the output of unlabelled values. Usually unlabelled values are printed with a label generated from the numerical value. It can however be required to suppress outliers in the tables: unlabelled values are to be treated as outliers where necessary and not be printed. This is achieved using PRINTALL = NO or GLOBALPRINTALL = NO.…',
    },
  },
  {
    name: 'GLOBALROWMINIMUM',
    en: {
      description: 'Global preset for ROWMINIMUM for all following tables.',
    },
  },
  {
    name: 'GLOBALSORT',
    de: {
      description:
        'Normalerweise wirkt ein SORT 462-Schlüsselwort im TABLE 355- Statement nur auf die direkt vorangehende Dimension einer Tabelle angewandt, also z.B. nur die Ausprägungen einer Variable.Mit GLOBALSORT wird der Wirkungsbereich von SORT auf die gesamte Tabelle ausgedehnt. Dies ist vor allem bei Mittelwerttabellen etc. sinnvoll.',
    },
    en: {
      description:
        'Normally a SORT key word in a TABLE statement effects only the directly preceding dimension of a table: TABLE = #kopf by a b sort absolute descend',
    },
  },
  {
    name: 'GLOBALTABLEMINIMUM',
    en: {
      description:
        'There was a bug that caused the sub tables in TABLE ADD constructs to be individually tested against the TABLEMINIMUM. Now only the start table is tested. As the tally results of all the tables (incl. ADD) should really be taken the sum of all the FRAMECELLS is taken into account for the resultant table. More precisely:…',
      syntax: 'GLOBALTABLEMINIMUM = <number>;',
    },
  },
  {
    name: 'GOTO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GRAPHAREA',
    de: { description: '', syntax: 'GRAPHAREA = <x> <y> <width> <height> ;' },
    en: { description: '', syntax: 'GRAPHAREA = <x> <y> <width> <height> ;' },
  },
  {
    name: 'GRAPHBOX',
    de: {
      description:
        'Kasten mit der Liniengraphik in PROFILE 637-Tabellen | HEADERBOX | Kasten um den HEADER |     |     |     | | --------- | -------------------- | --- | --- | --- | 516, außerhalb der Tabelle | INSTITUTION | Kasten um die INSTITUTION |     | 520-Angabe |     | | ----------- | ------------------------- | --- | ---------- | --- | LABELS X |     | VALUELABELS | 211 auf der X-Achse |     |     | | ---…',
    },
    en: {
      description:
        'Box with the line graphic in PROFILE 637 tables | HEADERBOX | box around the HEADER 516, outside the table | INSTITUTION | box around the INSTITUTION 520 line | LABELS X | box around VALUELABELS 211 on the X axis |…',
      syntax: '',
    },
  },
  {
    name: 'GRAPHLABELS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GRAPHLEGEND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GRAPHNUMBERS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GRAPHPROJECT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GRAPHTITLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GRAPHTYPE',
    en: { description: '', syntax: 'GRAPHTYPE = <xlGraphname>;' },
  },
  {
    name: 'GRATAB',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GREATER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GROUP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GROUPCOUNTS',
    de: { description: '', syntax: 'GROUPCOUNTS <Varlist> = [ YES | NO ];' },
    en: { description: '', syntax: 'GROUPCOUNTS <Varlist> = [ YES | NO ];' },
  },
  {
    name: 'GROUPEDBARS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GROUPEDBARS3D',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GROUPEDBARSH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GROUPRECODE',
    de: {
      description: '',
      syntax:
        'GROUPRECODE <recode> { / <recode> }*n [ ELSE = <number> ] ;\n<recode> ::= <valuelist> = < number >\n< valuelist > ::= [ <number> | <number> : <number> | <valuelist>',
    },
    en: {
      description:
        'Using GROUPRECODE group variables can also be recoded. Example: GROUPRECODE GRR 3=5; checks in the third variable of the group whether it is relevant and if yes the value of this variable is deleted and the fifth variable is set to TRUE. Instead of the constant RECODE value after the equals sign there can also be a variable name of a nuclear variable (see above).',
      syntax:
        'GROUPRECODE <recode> { / <recode> }*n [ ELSE = <number> ] ;\n<recode> ::= <valuelist> = < number >\n< valuelist > ::= [ <number> | <number> : <number> | <valuelist>',
    },
  },
  {
    name: 'GROUPS',
    de: {
      description: '',
      syntax:
        'GROUPS <Varname> = { | "Labeltext ..."\n[ LEVELLEVEL <number> ]\n[ USEFONT <Fontname> [ SIZE <number> ] ]\n[ CELLELEMENTS ( { <cellelement> }*n ) ]\n: <log. Bedingung> }*n ;',
    },
    en: {
      description:
        'If the individual (nuclear) variables from which the variable groups are to be formed are not yet present then the GROUPS command is often the more practical alternative as the naming and the more complex rules for forming groups can be formulated more clearly in the GROUPS command.…',
      syntax:
        'GROUPS <Varname> =\n{ | "Labeltext ..." [ LEVEL <number> ] [ USEFONT <Fontname> [ SIZE\n<number> ] ] : <log. Bedingung> }*n ;',
    },
  },
  {
    name: 'GROUPVAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'GT',
    de: { description: 'Greater Then, größer als' },
    en: { description: 'Greater Than', syntax: '' },
  },
  {
    name: 'HARMONICMEAN',
    argsHint: '( Var )',
    de: {
      description:
        'Das harmonische Mittel: Kehrwert aus dem Mittelwert der Kehrwerte (nur für positive Zahlen definiert). Findet in Name Beschreibung speziellen Fällen Anwendung, z.B. als Mittelwert über Geschwindigkeiten etc.',
    },
    en: {
      description:
        'The harmonic mean: the reciprocal of the mean of the reciprocals (defined only for positive numbers). Used in special cases, e.g. as a mean over speeds, etc.',
      syntax: '',
    },
  },
  {
    name: 'HCENTER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HEADER',
    de: {
      description:
        'VARIABLE a1 : v1 = a2 ; ist die XTAB-Version des ganz einfachen TABLE-Statements: TABLE = a1 BY a2; Die Anweisung sieht vor allem deshalb etwas umständlich aus, weil die Variable a2 über ein internes Konstrukt, eine lokale Tabellenvariable (v1), übergeben wird, die vorher am Anschluss an das ROWS-Schlüsselwort vereinbart wird.…',
      syntax: 'HEADER = "<text>" [ LEFT | HCENTER | RIGHT ] ;',
    },
    en: {
      description:
        'VARIABLE a1 : v1 = a2 ; It is the XTAB version of a very simple TABLE statement: TABLE = a1 BY a2; The command looks cumbersome mainly because the variable a2 is passed on using an internal construct (a local table variable v1) which already has been allocated after the ROW key word.…',
      syntax: 'HEADER = "<text>" [ LEFT | HCENTER | RIGHT ] ;',
    },
  },
  {
    name: 'HEADERBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HEADERS',
    en: {
      description: '',
      syntax: 'HEADERS = <tablepart> { / <tablepart> }*n;',
    },
  },
  {
    name: 'HEIGHT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HELPTEXT',
    en: {
      description: '',
      syntax:
        'HELPTEXT <VarList> = "text text ";\nDefines a help text which can be called up during CATI/CAPI or Data Entry (F1 = help button).',
    },
  },
  {
    name: 'HG',
    argsHint: '(out-dated)',
    en: {
      description: '(is also carried out in Postscript output)',
      syntax: 'HG = [ <HGFileName> | "" ];',
    },
  },
  {
    name: 'HGASPRINT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HGDECIMALCHAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HGDELIMCHAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HGINVERSE',
    en: {
      description:
        'Preset: HGINVERSE = NO; The data rows for all tables are transferred to HG in the same form as they are in the table, apart from with COMPARE. COMPARE tables are the exception. In order to organise the values in a STACKED BAR the data matrix in the standard case is inverted before the transfer to HG.…',
    },
  },
  {
    name: 'HIDDEN',
    argsHint: '( <medium> )',
    de: {
      description:
        '] parts ::= part { part }*n part ::= content [ filter ] [ option ] content ::= [ <constant> | <varname> | <cellelement> ( <varname> [ <varname> ] ) | <cellelement> ( <varname> [ <varname> ] BY <varname> ) :DESCRIPTION :USEVARTITLE :FORMAT ] filter ::= FILTER <bedingung> | option ::= SORT sortcontent [ sortpane ] [ cut ] sortcontent ::= [ DESCEND ] sorttype sorttype ::= [ POSITION | ALPHA | CODE |…',
    },
    en: {
      description:
        '] parts ::= part { part }*n part ::= content [ filter ] [ option ] content ::= [ <constant> | <varname> | <cellelement> ( <varname> [ <varname> ] ) | <cellelement> ( <varname> [ <varname> ] BY <varname> ) :DESCRIPTION :USEVARTITLE :FORMAT ] filter ::= FILTER <condition> | option ::= SORT sortcontent [ sortpane ] [ cut ] sortcontent ::= [ DESCEND ] sorttype sorttype ::= [ POSITION | ALPHA | CODE |…',
      syntax: '',
    },
  },
  {
    name: 'HIDDENTOVARLIST',
    de: { description: '', syntax: 'HIDDENTOVARLIST = [ YES | NO ];' },
    en: { description: '', syntax: 'HIDDENTOVARLIST = [ YES | NO ];' },
  },
  {
    name: 'HIGHSIGNIFICANCE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HISTORY',
    de: {
      description: '',
      syntax:
        'HISTORY =[ DATABOX <x> <y> ] FORMAT ( <Formatliste> )\nDATA [ Absliste ] { <number> : <Datenliste> }*n ;\nFormatliste ::= [ ABSROW | ABSCOLUMN | PHYSROW PHYSCOLUMN TOTALROW ]\n{ <number> }*n\nAbsliste ::= { <number> }*n\nDatenliste ::= [ <number> | ] { <string> }*n',
    },
    en: {
      description: '',
      syntax:
        'HISTORY =\n[ DATABOX <x> <y> ] FORMAT ( <Formatliste> ) DATA [ Absliste ] {\n<number> : <Dataliste> }*n;\nFormatliste ::= [ ABSROW | ABSCOLUMN |\nPHYSROW PHYSCOLUMN TOTALROW ] { <number> }*n\nAbsliste ::= { <number> }*n',
    },
  },
  {
    name: 'HMTL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HORIZONTAL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HORIZONTALALIGN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HOTIMPORT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HOTKEY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HSB',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HTML',
    de: {
      description: '',
      syntax:
        'HTML = [ <filename> | "" ];\nEs wird eine HTML-Version der betreffenden Tabellen in der Datei <filename>.html abgelegt.',
    },
    en: {
      description: '',
      syntax:
        'HTML = [ <filename> | "" ];\nA HTML version of the relevant tables is stored in the file <filename>.html. Additionally a file called\n<filename>_frames.html is produced. If this is represented in a browser the browser interface is',
    },
  },
  {
    name: 'HTML2EXCELDECCHAR',
    de: {
      description: '',
      syntax: "HTML2EXCELDECCHAR = <char>;\n<char> = '.' | ','",
    },
    en: {
      description: '',
      syntax: "HTML2EXCELDECCHAR = <char>;\n<char> = '.' | ','",
    },
  },
  {
    name: 'HTML2EXCELFLOWTEXT',
    de: {
      description: '',
      syntax: 'HTML2EXCELFLOWTEXT <boxtype> = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'HTML2EXCELFLOWTEXT <boxtype> = [ YES | NO ];',
    },
  },
  {
    name: 'HTMLBACKGROUND',
    en: {
      description:
        'The background and foreground colours of tables in HTML can be influenced in the script using the two HTML-specific representation elements: Example: RGB = YES; HTMLBACKGROUND TABLE = <red> <green> <blue>; HTMLBACKGROUND DEFAULTBOX = <red> <green> <blue>; The RGB values are, as is usual in GESS, designated in figure ranges from 0 - 1.…',
    },
  },
  {
    name: 'HTMLCHART',
    de: {
      description:
        'TITLE "alle zellen ohne overcodes, absolute" FORM COLUMNS OPTION STACKED CELLELEMENT ABSOLUTE = | COLUMNS 2/1:5 3/1:5 | ROWS POSITION 1:5 ; Technische Voraussetzung Die Charts in der GESStabs HTML-Ausgabe beruhen auf der externen Bibliothek \'Charts.min.js\'. Diese kann über die URL https://cdn.jsdelivr.net/npm/chart.js@2.8.0 im Internet eingebunden werden. Dies ist bislang das Standard-Verhalten.…',
      syntax:
        'HTMLCHART <options> = <cells>;\n<options> ::= [ TITLE <string> | FORM <form> | OPTION STACKED\n| LINETENSION <number> | HTMLCHARTWIDTH = <number>;\n| WIDTH <number> | CELLELEMENT <cellelement>\n| LEGENDPOSITION [ LEFT | RIGHT | TOP | BOTTOM ] ] [ INVERSE ]\n<cells> ::= [ | ROWS <rows> ] [ | COLUMNS <columns> ]',
    },
    en: {
      description:
        'TITLE "all cells without overcodes, absolute" FORM COLUMNS OPTION STACKED CELLELEMENT ABSOLUTE = | COLUMNS 2/1:5 3/1:5 | ROWS POSITION 1:5 ; Technical prerequisite: the charts in the GESStabs HTML output are based on the external library \'Charts.min.js\'. This can be embedded from the internet via the URL https://cdn.jsdelivr.net/npm/chart.js@2.8.0. This has been the standard behaviour so far.…',
      syntax:
        'HTMLCHART <options> = <cells>;\n<options> ::= [ TITLE <string> | FORM <form> | OPTION STACKED\n| LINETENSION <number> | HTMLCHARTWIDTH = <number>;\n| WIDTH <number> | CELLELEMENT <cellelement>\n| LEGENDPOSITION [ LEFT | RIGHT | TOP | BOTTOM ] ] [ INVERSE ]\n<cells> ::= [ | ROWS <rows> ] [ | COLUMNS <columns> ]',
    },
  },
  {
    name: 'HTMLCHARTWIDTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HTMLDOCUMENT',
    de: {
      description:
        'überträgt die Informationen der DOCUMENT 521-Box in die HTML-Ausgabe.',
    },
    en: {
      description:
        'transfers the information of the DOCUMENT 521 box into the HTML output.',
      syntax: '',
    },
  },
  {
    name: 'HTMLFLOWTEXT',
    de: { description: '', syntax: 'HTMLFLOWTEXT <boxtype> = [ YES | NO ];' },
    en: { description: '', syntax: 'HTMLFLOWTEXT <boxtype> = [ YES | NO ];' },
  },
  {
    name: 'HTMLFOOTER',
    de: {
      description:
        'überträgt die Informationen der FOOTER 522-Box in die HTML- Ausgabe.',
    },
    en: {
      description:
        'With these TABLEFORMATs the relevant information can be fed into the HTML output.',
    },
  },
  {
    name: 'HTMLFOREGROUND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HTMLHEADER',
    de: {
      description:
        'überträgt die Informationen der HEADER 516-Box in die HTML- Ausgabe.',
    },
    en: {
      description:
        'transfers the information of the HEADER 516 box into the HTML output.',
      syntax: '',
    },
  },
  {
    name: 'HYCOLCHIQU',
    de: { description: 'Hybrider 447 Chi²-Test (gewichtet und ungewichtet)' },
    en: {
      description: 'Hybrid 447 chi-square test (weighted and unweighted)',
      syntax: '',
    },
  },
  {
    name: 'HYCOLDEPTTEST',
    de: {
      description:
        'Hybrid 447 ausgestalteter t-Test für abhängige Daten. Der t- ( Var ) Wert wird auf der Basis der gewichteten Daten ermittelt, der t- Test erfolgt auf der Basis der ungewichteten Freiheitsgrade',
    },
    en: {
      description:
        'Hybrid 447 t-test for dependent data. The t-value ( Var ) is determined on the basis of the weighted data; the t-test is carried out on the basis of the unweighted degrees of freedom',
      syntax: '',
    },
  },
  {
    name: 'HYCOLZ',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HYMCNEMAR',
    de: {
      description:
        'McNemar 449 hybrid: aus den gewichteten Daten wird der Anteil der diskordanten Paare ermittelt. Aus dem gewichtet ermittelten Anteil der diskordanten Paare werden hypothetische ungewichtete Häufigkeiten für diese ermittelt. Diese bilden dann die Grundlage des McNemar-Tests.',
    },
    en: {
      description:
        'McNemar 449 hybrid: the proportion of discordant pairs is determined from the weighted data. From the weighted proportion of discordant pairs, hypothetical unweighted frequencies are derived for them. These then form the basis of the McNemar test.',
      syntax: '',
    },
  },
  {
    name: 'HYMEANCOLDEPT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HYMEANTEST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HYMEANWELCH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HYPERLINK',
    de: { description: '', syntax: 'HYPERLINK = <URI> <text> ;' },
    en: { description: '', syntax: 'HYPERLINK = <URI> <text> ;' },
  },
  {
    name: 'HYROWCHIQU',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HYROWMEANTEST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HYROWTTEST',
    de: {
      description:
        'Hybrider 447, zeilenweiser t-Test: Die t-Werte werden auf Basis der gewichteten Daten errechnet, die Freiheitsgrade zur Name Beschreibung Berechnung der p-Werte der t-Verteilung ergeben sich aus den ungewichteten Häufigkeiten.',
    },
    en: {
      description:
        'Hybrid 447, row-wise t-test: the t-values are computed on the basis of the weighted data; the degrees of freedom for computing the p-values of the t-distribution are derived from the unweighted frequencies.',
      syntax: '',
    },
  },
  {
    name: 'HYROWZ',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'HYTTEST',
    argsHint: '(Var )',
    de: {
      description:
        'Hybrider 447 t-Test: Die t-Werte werden auf Basis der gewichteten Daten errechnet, die Freiheitsgrade zur Berechnung der p-Werte der t-Verteilung ergeben sich aus den ungewichteten Häufigkeiten.',
    },
    en: {
      description:
        'Hybrid 447 t-test: the t-values are computed on the basis of the weighted data; the degrees of freedom for computing the p-values of the t-distribution are derived from the unweighted frequencies.',
      syntax: '',
    },
  },
  {
    name: 'HYWELCHTEST',
    de: {
      description:
        'Hybrider 447 t-Test auf Mittelwerteunterschiede nach Welch 450 auf Basis der gewichteten Daten',
    },
    en: {
      description:
        'Hybrid 447 t-test on mean differences per Welch 450 on the basis of the weighted data',
      syntax: '',
    },
  },
  {
    name: 'IBMGRAPHICS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'IDENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'IDENTCHIQNOSIGNIF',
    de: {
      description:
        'Wenn man eine Variable gegen sich selbst tabelliert, sind die Besetzungen natürlich hochsignifikant, aber aussageleer. Die Ausgabe der Signifikanzkennzeichnung kann hiermit unterdrückt werden.',
    },
    en: {
      description:
        'When a variable is tabulated against itself, the counts are of course highly significant but meaningless. This suppresses the output of the significance marking.',
      syntax: '',
    },
  },
  {
    name: 'IF',
    de: {
      description: '',
      syntax:
        'IF <log. Bedingung> PRINT "ErrorText" <Varlist> [ GOTO <varname> ];',
    },
    en: {
      description: '',
      syntax:
        'IF <log. Bedingung> PRINT "ErrorText" <Varlist> [ GOTO <varname> ];',
    },
  },
  {
    name: 'IFASFIF',
    de: { description: '', syntax: 'IFASFIF = [ YES | NO ];' },
    en: { description: '', syntax: 'IFASFIF = [ YES | NO ];' },
  },
  {
    name: 'IFBLOCK',
    de: { description: '', syntax: 'IFBLOCK <bedingung> THEN' },
    en: { description: '', syntax: 'IFBLOCK <condition> THEN' },
  },
  {
    name: 'IGNOREASCOUTDUPL',
    de: { description: '', syntax: 'IGNOREASCOUTDUPL = [ YES | NO ];' },
    en: { description: '', syntax: 'IGNOREASCOUTDUPL = [ YES | NO ];' },
  },
  {
    name: 'IGNORECASEINCOMPARE',
    de: { description: '', syntax: 'IGNORECASEINCOMPARE = [ YES | NO ];' },
    en: { description: '', syntax: 'IGNORECASEINCOMPARE = [ YES | NO ];' },
  },
  {
    name: 'IGNOREDOUBLECASENO',
    en: { description: '', syntax: 'IGNOREDOUBLECASENO = [ YES | NO ];' },
  },
  {
    name: 'IGNOREMISSING',
    de: {
      description: '',
      syntax:
        'IGNOREMISSING = [ YES | NO ];\nVoreinstellung: IGNOREMISSING = NO;',
    },
    en: {
      description: '',
      syntax: 'IGNOREMISSING = [ YES | NO ];\nPreset: IGNOREMISSING = NO;',
    },
  },
  {
    name: 'IGNOREMULTIQOVERFLOW',
    de: { description: '', syntax: 'IGNOREMULTIQOVERFLOW = [ YES | NO ];' },
    en: { description: '', syntax: 'IGNOREMULTIQOVERFLOW = [ YES | NO ];' },
  },
  {
    name: 'IGNOREPREQUOTAIFAPPO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'IGNOREPREQUOTAIFFROZEN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'IGNORESETFILTER',
    de: { description: '', syntax: 'IGNORESETFILTER = [ YES | NO ];' },
    en: { description: '', syntax: 'IGNORESETFILTER = [ YES | NO ];' },
  },
  {
    name: 'IGNORESPSSMISSINGVALUES',
    de: { description: '', syntax: 'IGNORESPSSMISSINGVALUES = [ YES | NO ];' },
    en: { description: '', syntax: 'IGNORESPSSMISSINGVALUES = [ YES | NO ];' },
  },
  {
    name: 'IGNORESPSSSYSMISVAL',
    de: { description: '', syntax: 'IGNORESPSSSYSMISVAL = [ YES | NO ];' },
    en: { description: '', syntax: 'IGNORESPSSSYSMISVAL = [ YES | NO ];' },
  },
  {
    name: 'IGNORETABINTEXT',
    de: { description: '', syntax: 'IGNORETABINTEXT = [ yes | no ];' },
    en: { description: '', syntax: 'IGNORETABINTEXT = [ yes | no ];' },
  },
  {
    name: 'IMAGEBUTTONS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'IMAGESCALE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'IN',
    de: {
      description:
        'Einschluss von Wertemengen/-bereichen Logische Verknüpfungen sind möglich mit:',
    },
    en: {
      description:
        'Inclusion of value sets / ranges. Logical connectives are possible with:',
      syntax: '',
    },
  },
  {
    name: 'INCH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INCLUDE',
    de: { description: '', syntax: 'INCLUDE = <filename.inc>;' },
    en: {
      description:
        'Defines an INCLUDE file. Commands from the INCLUDE file are interpreted as if they were in place of the INCLUDE commands. Example: INCLUDE = VARNAME.def; INCLUDE = Labels.def; This can be used for example to administrate the variable definitions and the VALUELABELS in different files so that changes in the column positions etc only have to be changed in the definition part. In the',
      syntax: 'INCLUDE = <filename.inc>;',
    },
  },
  {
    name: 'INCLUDETITLEINTEXT',
    de: {
      description: '',
      syntax:
        'INCLUDETITLEINTEXT <varlist> = [ YES | NO ];\nFür alle Variablen, die in <varlist> aufgeführt sind, wird der VARTEXT um den Inhalt von',
    },
    en: {
      description: '',
      syntax:
        'INCLUDETITLEINTEXT <varlist> = [ YES | NO ];\nFor all variables listed in <varlist>, the VARTEXT is extended by the content of',
    },
  },
  {
    name: 'INCLUDEVALUES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INDENTAUTOOVERSORT',
    de: { description: '', syntax: 'INDENTAUTOOVERSORT = [ YES | NO ];' },
    en: { description: '', syntax: 'INDENTAUTOOVERSORT = [ YES | NO ];' },
  },
  {
    name: 'INDEPENDENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INDEXCHARS',
    de: { description: '', syntax: 'INDEXCHARS = "<Buchstaben | Zeichen>";' },
    en: {
      description:
        'e.g. INDEXCHARS = "GEHT"; allocates a (small or large) G to the first test column, an E to the second, an H to the third and a T to the fourth. The letters A – Z are preset. TESTCOLUMNS are taken into account. The letters A – Z can initially be used as INDEXCHARS to deal with 26 columns.…',
      syntax: 'INDEXCHARS = "<letters | characters>";',
    },
  },
  {
    name: 'INDEXSTYEFILE',
    de: { description: '', syntax: 'INDEXSTYEFILE = <name>;' },
    en: { description: '', syntax: 'INDEXSTYEFILE = <name>;' },
  },
  {
    name: 'INDEXSTYLEFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INDEXVAR',
    de: {
      description: '',
      syntax: 'INDEXVAR <name> = <varlist> BY <variable>;',
    },
    en: {
      description: '',
      syntax: 'INDEXVAR <name> = <varlist> BY <variable>;',
    },
  },
  {
    name: 'INFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INFOBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INHERITBACKGROUND',
    de: {
      description: '',
      syntax:
        'INHERITBACKGROUND [ X | Y ] = [ YES | NO ];\nINHERITFOREGROUND [ X | Y ] = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax:
        'INHERITBACKGROUND [ X | Y ] = [ YES | NO ];\nINHERITFOREGROUND [ X | Y ] = [ YES | NO ];',
    },
  },
  {
    name: 'INHERITFONT',
    de: { description: '', syntax: 'INHERITFONT [ X | Y ] = [ YES | NO ];' },
    en: { description: '', syntax: 'INHERITFONT [ X | Y ] = [ YES | NO ];' },
  },
  {
    name: 'INHERITFOREGROUND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INIT',
    en: { description: '', syntax: 'INIT <varlist> = <value list>;' },
  },
  {
    name: 'INPUTTASK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INSERT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INSTANTEXCEL',
    de: { description: '', syntax: 'INSTANTEXCEL = [ YES | NO ];' },
    en: { description: '', syntax: 'INSTANTEXCEL = [ YES | NO ];' },
  },
  {
    name: 'INSTANTPDF',
    de: { description: '', syntax: 'INSTANTPDF = [ YES | NO ];' },
    en: { description: '', syntax: 'INSTANTPDF = [ YES | NO ];' },
  },
  {
    name: 'INSTITUTION',
    de: {
      description:
        'Angabe einer Textergänzung für den links unten eingedruckten Instituts- Namen',
      syntax: 'INSTITUTION = "<text>";',
    },
    en: {
      description:
        'Specifies the printing of the name of the institute added at the bottom left edge. The valid text is expanded to the right. Repeated use of the INSTITUTION statements can lead to meaningless results. (PS): this text can have more than one line in output from Postscript printers with the backslash marking the end of a row.',
      syntax: 'INSTITUTION = "<text>";',
    },
  },
  {
    name: 'INTERBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INTERCELL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INTERVALS',
    de: {
      description: '',
      syntax:
        'INTERVALS <newvar> = <sourcevar> { | <labeltext> :\n<comparison> <comparevalue> }*n;\n<comparison> ::= [ LT | GT | LE | GE ]',
    },
    en: {
      description: '',
      syntax:
        'INTERVALS <newvar> = <sourcevar> { | <labeltext> :\n<comparison> <comparevalue> }*n;\n<comparison> ::= [ LT | GT | LE | GE ]',
    },
  },
  {
    name: 'INTERVIEWER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INTRO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INUSECODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'INVERSE',
    de: {
      description:
        'CHARTTITLE "Eine GESStabsArtist Graphik auf der Basis der Mittelwerte aus der OVERVIEW-Tabelle\\CELLELEMENT MEAN" CELLELEMENT MEAN',
      syntax: 'INVERSE : [YES | NO]',
    },
    en: {
      description:
        'CHARTTITLE "A GESStabs Artist graphic based on the means from the OVERVIEW table\\CELLELEMENT MEAN" CELLELEMENT MEAN',
      syntax: 'INVERSE : [YES | NO]',
    },
  },
  {
    name: 'INVERTFILEWEIGHTOUT',
    de: { description: '', syntax: 'INVERTFILEWEIGHTOUT = <variable>;' },
    en: { description: '', syntax: 'INVERTFILEWEIGHTOUT = <variable>;' },
  },
  {
    name: 'INVERTIN',
    de: { description: '', syntax: 'INVERTIN = <path>;' },
    en: { description: '', syntax: 'INVERTIN = <path>;' },
  },
  {
    name: 'INVERTOUT',
    de: { description: '', syntax: 'INVERTOUT = <path>;' },
    en: { description: '', syntax: 'INVERTOUT = <path>;' },
  },
  {
    name: 'INVERTOUTMAX',
    de: { description: '', syntax: 'INVERTOUTMAX = <number>;' },
    en: { description: '', syntax: 'INVERTOUTMAX = <number>;' },
  },
  {
    name: 'INVERTOUTVARS',
    de: {
      description: '',
      syntax: 'INVERTOUTVARS [ KEEPVARS | DELETEVARS ] = <varlist>;',
    },
    en: {
      description: '',
      syntax: 'INVERTOUTVARS [ KEEPVARS | DELETEVARS ] = <varlist>;',
    },
  },
  {
    name: 'INVINDEXVAR',
    de: {
      description: '',
      syntax: 'INVINDEXVAR <name> = <varlist> BY <variable>;',
    },
    en: {
      description: '',
      syntax: 'INVINDEXVAR <name> = <varlist> BY <variable>;',
    },
  },
  {
    name: 'IOCHECK',
    de: {
      description: '',
      syntax: 'IOCHECK = [ ASCIIIN | ASCIIOUT | COLBININ | COLBINOUT ] ;',
    },
    en: {
      description: '',
      syntax: 'IOCHECK = [ ASCIIIN | ASCIIOUT | COLBININ | COLBINOUT ] ;',
    },
  },
  {
    name: 'IS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ITALIC',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ITEM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'JSON',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'KEEP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'KEEPVARS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'KEY',
    de: {
      description: '',
      syntax:
        'KEY OPENQFILE = <varname> ;\nIn der Regel wird hierzu die CASENUMBER verwendet; man kann aber beliebige Variablen als\nSchlüssel in OpenQFiles verwenden. Diese Variable muss atomar sein; darf aber auch vom Typ',
    },
    en: {
      description: '',
      syntax:
        'KEY OPENQFILE = <varname> ;\nAs a rule the CASENUMBER is used for this; but you can use any variable as a\nkey in OpenQFiles. This variable must be atomic; it may, however, also be of type',
    },
  },
  {
    name: 'KEYDUMP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'KEYWORD',
    de: {
      description:
        'Syntaxstrukturen werden so aufgeführt: Dies ist die grundsätzliche Syntaxstruktur einer GESStabs-Funktionalität. Beispielhafte Syntaxausschnitte sehen entsprechend aus: Dies ist ein beispielhafter Syntaxabschnitt Einführung in die Tabellierung',
    },
    en: {
      description:
        'Syntax structures are presented as follows: this is the basic syntax structure of a GESStabs feature. Example syntax excerpts look accordingly: this is an example syntax section. Introduction to tabulation',
      syntax: '',
    },
  },
  {
    name: 'KNOWN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LABELFORMAT',
    de: { description: '', syntax: 'LABELFORMAT <varlist> = <formatstring>;' },
    en: { description: '', syntax: 'LABELFORMAT <varlist> = <string>;' },
  },
  {
    name: 'LABELFROMFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LABELRECODE',
    de: { description: '', syntax: 'LABELRECODE = [ YES | NO ];' },
    en: { description: '', syntax: 'LABELRECODE = [ YES | NO ];' },
  },
  {
    name: 'LABELS',
    de: { description: '', syntax: 'LABELS : [0 | 1 | 2]' },
    en: {
      description:
        '1 "18#24" 2 "25#30" 3 "31#45" 4 "46#60" 5 "61 and älter"; SINGLEQ Bezirk = 43',
      syntax: 'LABELS : [0 | 1 | 2]',
    },
  },
  {
    name: 'LABELS AS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LABELS COPY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LABELS X',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LABELS Y',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LABELSET',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LABELSPACE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LABELSTOTITLE',
    de: { description: '', syntax: 'LABELSTOTITLE <labelcode> = <varlist>;' },
    en: { description: '', syntax: 'LABELSTOTITLE <labelcode> = <varlist>;' },
  },
  {
    name: 'LABELVALUE',
    de: { description: '', syntax: 'LABELVALUE <numvariable> = <variable>;' },
    en: { description: '', syntax: 'LABELVALUE <numvariable> = <variable>;' },
  },
  {
    name: 'LABELWIDTH',
    de: {
      description: '',
      syntax: 'LABELWIDTH : <number>\nCOLUMNWIDTH : <number>',
    },
    en: {
      description: '',
      syntax: 'LABELWIDTH : <number>\nCOLUMNWIDTH : <number>',
    },
  },
  {
    name: 'LANDSCAPE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LANGUAGES',
    de: { description: '', syntax: 'LANGUAGES = <csv-file-name>;' },
    en: { description: '', syntax: 'LANGUAGES = <csv-file-name>;' },
  },
  {
    name: 'LASTVERSION',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LATIN1',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LEADINGZEROS',
    de: { description: '', syntax: 'LEADINGZEROS = [ YES | NO ];' },
    en: { description: '', syntax: 'LEADINGZEROS = [ YES | NO ];' },
  },
  {
    name: 'LEFT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LEFTMARGIN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LEGENDPOSITION',
    de: {
      description: '',
      syntax: 'LEGENDPOSITION : [TOP | BOTTOM | LEFT | RIGHT]',
    },
    en: {
      description: '',
      syntax: 'LEGENDPOSITION : [TOP | BOTTOM | LEFT | RIGHT]',
    },
  },
  {
    name: 'LESS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LEVEL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LINE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LINEBUFFER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LINECOLOR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LINEDASH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LINEFEEDCHAR',
    de: {
      description:
        'Erzwingt in VALUELABELS 211 oder VARTITLE 210s einen Zeilenumbruch. Voreinstellung: \\',
    },
    en: {
      description:
        'Forces a line break in VALUELABELS 211 or VARTITLE 210. Default: \\',
      syntax: '',
    },
  },
  {
    name: 'LINEFEEDFACTOR',
    de: { description: '', syntax: 'LINEFEEDFACTOR = <number>;' },
    en: { description: '', syntax: 'LINEFEEDFACTOR = <number>;' },
  },
  {
    name: 'LINES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LINES3D',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LINESWITHSYMBOLS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LINETENSION',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LINEWIDTH',
    de: {
      description: 'Die Dicke des Umrandungsstrichs. 0.0 = keine Umrandung.',
    },
    en: {
      description: 'The thickness of the border line. 0.0 = no border.',
      syntax: '',
    },
  },
  {
    name: 'LIST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LISTFILE',
    de: { description: '', syntax: 'LISTFILE = <filename>;' },
    en: {
      description:
        'Normally the interpretation of the commands is logged on the screen. This log or parts of it can be directed into a file which is declared as a LISTFILE. Example: LISTFILE = Tables.Err; If the interpretation is to appear back on the screen as of a certain point this can be achieved using: LISTFILE = con;',
      syntax: 'LISTFILE = <filename>;',
    },
  },
  {
    name: 'LISTON',
    de: { description: '', syntax: 'LISTON = [ YES | NO ];' },
    en: {
      description: '',
      syntax:
        'LISTON = NO;\nSwitches the log for the interpretation of commands off completely, LISTON = YES; (preset) switches it',
    },
  },
  {
    name: 'LISTVARS',
    de: {
      description: '',
      syntax:
        'LISTVARS= <filename> [ options ];\noption ::= ASCIIOUT | COLBINOUT | ALL | SPSS | LABELS',
    },
    en: { description: '', syntax: 'LISTVARS= <filename> [ options ];' },
  },
  {
    name: 'LITERAL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LIVETABS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LOAD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LOCAL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LOCALCONTENT',
    de: {
      description:
        'Bei der Druckausgabe wird nicht die Information aus dem FRAME, sondern der lokal ermittelte Zelleninhalt berücksichtigt.',
    },
    en: {
      description:
        'During printing the information is taken from the locally set cell contents and not from FRAME.',
    },
  },
  {
    name: 'LOCALTEXTFORMAT',
    de: {
      description: '',
      syntax:
        'LOCALTEXTFORMAT <#<char> <option> ;\n<char> ::= frei zu wählender Char (case-sensitive)\n<option> ::= [ FOREGROUND <color> | USEFONT <fontname> SIZE\n<size> ]',
    },
    en: {
      description: '',
      syntax:
        'LOCALTEXTFORMAT <#<char> <option> ;\n<char> ::= freely chosen char (case-sensitive)\n<option> ::= [ FOREGROUND <color> | USEFONT <fontname> SIZE\n<size> ]',
    },
  },
  {
    name: 'LOCKMETHOD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LONGVARTITLE',
    de: {
      description:
        'Sorgt dafür, dass VARTITLE 210 in Tabellen in der Y-Achse nicht umgebrochen werden. Sollte man nur anwenden, wenn keine DRAWBOX für VARTITLE Y definiert ist - kann sonst blöd aussehen. (Hat nur bei Postscript-Ausgabe Effekt).',
    },
    en: {
      description:
        'Ensures that the VARTITLE in the table Y-Axis is not broken up. Should only be used if no DRAWBOX for VARTITLE Y has been defined. Otherwise it looks stupid! (Only PS)',
    },
  },
  {
    name: 'LOWERCASE',
    de: {
      description: '',
      syntax:
        'LOWERCASE <char> = <char>;\n<char> ::= [ x | \'x\' | "x" | <number> ]\nx ::= A .. Z, a .. z\nnumber ::= 1 .. 255',
    },
    en: {
      description: '',
      syntax:
        'LOWERCASE <char> = <char>;\n<char> ::= [ x | \'x\' | "x" | <number> ]\nx ::= A .. Z, a .. z\nnumber ::= 1 .. 255\nNormally only the letters A – Z can be used in INDEXCHARS, as there are only signs (ASCII Code < 128)',
    },
  },
  {
    name: 'LOWSIGNIFICANCE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LPI',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'LSLICE',
    de: {
      description:
        'von Einzeltabellen zerlegen. TABLE = a BY b SORT ABSOLUTE DESCEND SLICE 15; Hiermit wird eine Tabelle mit z.B. 55 Einzelitems in der Variablen b in 4 Seiten zerlegt. Falls eine Zerlegung eine Restseite mit nur einer Nennung ergeben würde, wird diese Nennung mit auf die Vorseite gedruckt. Eine Tabelle mit 61 Items würde also auf 4 und nicht auf 5 Seiten gedruckt.',
    },
    en: {
      description:
        'split into individual tables. TABLE = a BY b SORT ABSOLUTE DESCEND SLICE 15; This splits a table with e.g. 55 individual items in the variable b into 4 pages. If a split would produce a leftover page with only one response, this response is printed on the previous page. A table with 61 items would thus be printed on 4 and not on 5 pages.',
      syntax: '',
    },
  },
  {
    name: 'LT',
    de: { description: 'Lower Then, kleiner als' },
    en: { description: 'Lower Than', syntax: '' },
  },
  {
    name: 'MACRO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MACROPROTOCOL',
    de: {
      description: '',
      syntax: 'MACROPROTOCOL = <dateiname> [ DOMACRO ] ;',
    },
    en: {
      description:
        'Sometimes it is not so easy to find the cause of a syntax error when working with complex macros; only the macro commands can be seen in the source text and not the expanded product. For this reason it is possible to export the expanded macros into a text file where it is easier to check them.',
      syntax: 'MACROPROTOCOL = <filename> [ DOMACRO ] ;',
    },
  },
  {
    name: 'MACROPROTOKOLL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MAKE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MAKEFAMILY',
    de: {
      description: '',
      syntax:
        'MAKEFAMILY <name> = <value>;\nMit MAKEFAMILY generiert man eine leere VARFAMILY bzw. MultiQ mit n (<value>)',
    },
    en: { description: '', syntax: 'MAKEFAMILY <name> = <value>;' },
  },
  {
    name: 'MAKEFILTER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MAKEGROUP',
    de: {
      description: '',
      syntax:
        'MAKEGROUP <name> = <value>;\nMit MAKEGROUP wird eine leere Gruppenvariable mit n (<value>) Einzelvariablen generiert, die',
    },
    en: { description: '', syntax: 'MAKEGROUP <name> = <value>;' },
  },
  {
    name: 'MAKESELECT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MAKESINGLE',
    de: {
      description: '',
      syntax: 'MAKESINGLE <newvar> [ = <arithm.expression> ];',
    },
    en: {
      description: '',
      syntax: 'MAKESINGLE <newvar> [ = <arithm.expression> ];',
    },
  },
  {
    name: 'MAKESINGLES',
    de: {
      description: '',
      syntax: 'MAKESINGLES <newvarlist> [ = <sourcelist> ] ;',
    },
    en: {
      description: '',
      syntax: 'MAKESINGLES <newvarlist> [ = <sourcelist> ] ;',
    },
  },
  {
    name: 'MAKETABFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MARGINS',
    de: {
      description: '',
      syntax:
        'MARGINS = LEFT <number> RIGHT <number> TOP <number> BOTTOM <number> ;',
    },
    en: {
      description: '',
      syntax:
        'MARGINS = LEFT <number> RIGHT <number> TOP <number> BOTTOM <number> ;',
    },
  },
  {
    name: 'MARKCELLEXCELSPECIAL',
    de: { description: '', syntax: 'MARKCELLEXCELSPECIAL = [ YES | NO ];' },
    en: { description: '', syntax: 'MARKCELLEXCELSPECIAL = [ YES | NO ];' },
  },
  {
    name: 'MARKCELLS',
    de: {
      description: '',
      syntax:
        'MARKCELLS = YES\nSIGNIFLEVEL { | [ SIGNIF90 | SIGNIF95 | SIGNIF99 | SIGNIF999 ]\n[ GT | LT ] <color> }*n ;\nAusschalten: MARKCELLS = NO;',
    },
    en: {
      description: '',
      syntax:
        'MARKCELLS = [ YES | NO ] [ COLOR {colors}*6 | CELLELEMENTS\n<cellelement> ];',
    },
  },
  {
    name: 'MARKCELLSLEVEL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MARKCELLSMETHOD',
    de: {
      description: '',
      syntax:
        'MARKCELLSMETHOD = [ CLASSIC | COLCHIQU | ROWCHIQU\n| HYCOLCHIQU | HYROWCHIQU ];',
    },
    en: {
      description: '',
      syntax:
        'MARKCELLSMETHOD = [ CLASSIC | COLCHIQU | ROWCHIQU\n| HYCOLCHIQU | HYROWCHIQU ];',
    },
  },
  {
    name: 'MARKMEANCOL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MARKMEANROW',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MAX',
    de: {
      description:
        'Max-Wert In der einfachsten Form lautet ein DATA-Statement z.B.: DATA MEAN GlobMeanQ1 = Q1; Die Variable Q1 in dem Beispiel muss existieren. Als Resultat steht dann im Tabellierungsprozess die neue atomare Variable "GlobMeanQ1" zur Verfügung. Ihr Wert ist der globale Mittelwert von Q1 über alle eingelesenen Fälle.…',
    },
    en: {
      description:
        'Max value. In its simplest form a DATA statement reads e.g.: DATA MEAN GlobMeanQ1 = Q1; The variable Q1 in the example must exist. As a result, the new atomic variable "GlobMeanQ1" is then available in the tabulation process. Its value is the global mean of Q1 over all cases read in.…',
      syntax: 'MAX <varname> = <Varlist>;',
    },
  },
  {
    name: 'MAXCODEBOOKLINES',
    de: {
      description: '',
      syntax:
        'MAXCODEBOOKLINES = <number>;\nVoreinstellung: MAXCODEBOOKLINES = 50;',
    },
    en: {
      description:
        'Determines the maximum number of rows per page in a CODEBOOK table. Preset: MAXCODEBOOKLINES = 50; The following TABLEFORMATs are valid for CODEBOOK tables:',
      syntax: 'MAXCODEBOOKLINES = <number>;\nDefault: MAXCODEBOOKLINES = 50;',
    },
  },
  {
    name: 'MAXCOLSPERTABLEPAGE',
    de: {
      description: '',
      syntax:
        'MAXCOLSPERTABLEPAGE = <number>;\nMAXROWSPERTABLEPAGE = <number>;',
    },
    en: {
      description: '',
      syntax:
        'MAXCOLSPERTABLEPAGE = <number>;\nMAXROWSPERTABLEPAGE = <number>;',
    },
  },
  {
    name: 'MAXIMUMWEIGHT',
    de: {
      description: '',
      syntax: 'MAXIMUMWEIGHT = <number>;\nMINIMUMWEIGHT = <number>;',
    },
    en: {
      description: '',
      syntax: 'MAXIMUMWEIGHT = <number>;\nMINIMUMWEIGHT = <number>;',
    },
  },
  {
    name: 'MAXIMUMWFACT',
    de: {
      description: '',
      syntax: 'MAXIMUMWFACT = <number>;\nMINIMUMWFACT = <number>;',
    },
    en: {
      description:
        'Preset for the control of weighting. MINIMUMWEIGHT and MAXIMUMWEIGHT set the minimum or maximum weight of a case. MINIMUMWFACT and MAXIMUMWFACT set a limit for the factorial alteration of the weight per iteration cycle. Preset: MAXIMUMWEIGHT = 1E+20; MINIMUMWEIGHT = 0; MAXIMUMWFACT = 1E+20; MINIMUMWFACT = 0; (usually no limitations)',
      syntax: 'MAXIMUMWFACT = <number>;\nMINIMUMWFACT = <number>;',
    },
  },
  {
    name: 'MAXINDEX',
    de: {
      description: '',
      syntax:
        'MAXINDEX <resultvar> = <varlist>;\nMININDEX <resultvar> = <varlist>;',
    },
    en: {
      description: '',
      syntax:
        'MAXINDEX <resultvar> = <varlist>;\nMININDEX <resultvar> = <varlist>;',
    },
  },
  {
    name: 'MAXLABELWIDTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MAXLINELENGTH',
    en: {
      description:
        '<historisch> Defines the maximum length of a row in the input file. Maximum: 50000. Preset: 3000. By designating a lower MAXLINELENGTH storage memory can be saved which can be used for other purposes e.g. for tables. This is particularly relevant if there is a data set in which the cases are made up of many short rows (see CARDS).…',
    },
  },
  {
    name: 'MAXPREQUOTATRIES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MAXROWSPERTABLEPAGE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MAXTABLEWIDTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MAXWEIGHTITERATIONS',
    de: { description: '', syntax: 'MAXWEIGHTITERATIONS = <number>;' },
    en: { description: '', syntax: 'MAXWEIGHTITERATIONS = <number>;' },
  },
  {
    name: 'MCNEMAR',
    de: {
      description:
        'Abhängiger Test auf Prozentwertunterschiede nach McNemar 449',
    },
    en: {
      description: 'Dependent test on percentage differences per McNemar 449',
      syntax: '',
    },
  },
  {
    name: 'MEAN',
    argsHint: '( … )',
    de: {
      description:
        'Die Auswahl der Zeile in der obenstehenden Matrix wird sich in der Regel aus der Art der zu testenden Daten ergeben. Für einen abhängigen Test des Unterschieds von Prozentwerten bietet sich bspw. McNemar an; für einen unabhängigen Test der X²-Test. Vergleichbar gibt es zwei Varianten des t-Tests für Mittelwerte, den abhängigen und den unabhängigen.…',
      syntax: 'MEAN <varname> = <Varlist>;',
    },
    en: {
      description:
        'are permitted. Additionally the key word RANGE can be used to generate whatever areas are necessary to break down a table with many characteristics:',
      syntax: 'MEAN <varname> = <Varlist>;',
    },
  },
  {
    name: 'MEAN_PHYS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MEANCOLDEPT',
    en: {
      description:
        'Printing of mean and the dependant t-test in one cell (per column) For all these CELLELEMENTS described in the above table the following options are available: SIGNIFLEVEL, SIGNIFTEXT, SHOWSIGNIF, TESTCOLUMNS and INDEXCHARS. Furthermore using a special variant of the COLOR statements a cell which has been appointed a letter due to significance can also be colour-coded.',
    },
  },
  {
    name: 'MEANCOLINDEX',
    argsHint: '( Var )',
    de: {
      description:
        'Spaltenweise Darstellung des Mittelwertes als Index auf der Basis 100, jeweils auf den Mittelwert in der Totalspalte bezogen',
    },
    en: {
      description:
        'Column-wise display of the mean as an index on the base of 100, each relative to the mean in the total column',
      syntax: '',
    },
  },
  {
    name: 'MEANCUT',
    argsHint: '( Var )',
    de: {
      description:
        'Spezieller Mittelwerte: MEANCUT schneidet am unteren und oberen Ende der Verteilung die Extremwerte ab, und berechnet den Mittelwert auf der Basis der verbleibenden Verteilung je Zelle. Kann die Extremgruppe nicht aus ganzen Fällen gebildet werden, wird anteilige Gewichtung verwendet. Die Größe Extremabschnitte wird in Prozentpunkten definiert:…',
    },
    en: {
      description:
        'Special mean: MEANCUT cuts off the extreme values at the lower and upper end of the distribution and computes the mean on the basis of the remaining distribution per cell. If the extreme group cannot be formed from whole cases, proportional weighting is used. The size of the extreme sections is defined in percentage points:…',
      syntax: '',
    },
  },
  {
    name: 'MEANDESCRIPTION',
    de: {
      description:
        'Ersetzt bei Spalten und Zeilen mit dritten Variablen (z.B. MEAN etc) den Variablennamen durch den DESCRIPTION 550-String, z.B. "Mittelwert".',
    },
    en: {
      description:
        'Replaces the variable name with a description string e.g. "mean" in columns and rows with third variables.',
    },
  },
  {
    name: 'MEANINCOMPARE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MEANP',
    argsHint: '( Var )',
    de: {
      description:
        "Von der Berechnung her ist MEANP (vorgesehen als: MEAN für Prozentwerte) exakt dasselbe wie MEAN 423. Der zweite Bezeichner dient nur dazu, dass man diesem CELLELEMENT ein abweichendes FORMAT 566 oder DESCRIPTION geben kann. Als Default hat dieses CELLELEMENT die DESCRIPTION 385 'fake%'. Für die Tabellenausgabe wird man dies ggf. besser in '%' ändern.",
    },
    en: {
      description:
        "In terms of calculation, MEANP (intended as: MEAN for percentage values) is exactly the same as MEAN 423. The second identifier only serves to allow this CELLELEMENT to be given a different FORMAT 566 or DESCRIPTION. By default this CELLELEMENT has the DESCRIPTION 385 'fake%'. For table output it is often better to change this to '%'.",
      syntax: '',
    },
  },
  {
    name: 'MEANPHYSTTEST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MEANQP',
    de: {
      description:
        'Ergänzend zu MEANP (also im Kern: MEAN) gibt noch eine kleine',
    },
    en: {
      description:
        'In addition to MEANP (at its core: MEAN) there is also a small',
      syntax: '',
    },
  },
  {
    name: 'MEANQP100',
    de: {
      description:
        'Erweiterung: MEANQP. Parallel zur Summe und zur Basis (Summe der Gewichte) wird eine Summe aller negativen Werte und der dazugehörigen Gewichte geführt. Als Resultat liefert dieses CELLELEMENT den Quotienten der Mittelwerte der positiven und der negativen Werte. MEANQP100 ist von der Berechnung her identisch, der Wert wird lediglich mit 100 multipliziert.',
    },
    en: {
      description:
        'extension: MEANQP. In parallel with the sum and the base (sum of weights), a sum of all negative values and their weights is kept. As a result, this CELLELEMENT returns the quotient of the means of the positive and the negative values. MEANQP100 is identical in calculation; the value is simply multiplied by 100.',
      syntax: '',
    },
  },
  {
    name: 'MEANROWINDEX',
    argsHint: '( Var )',
    de: {
      description:
        'Zeilenweise Darstellung des Mittelwertes als Index, jeweils auf den Mittelwert in der Totalzeile bezogen',
    },
    en: {
      description:
        'Row-wise display of the mean as an index, each relative to the mean in the total row',
      syntax: '',
    },
  },
  {
    name: 'MEANTEST',
    de: {
      description:
        ': DESCRIPTION "Mittelwert" ( item_5 ); Es entsteht die gewünschte Tabelle: Bestandteile einer Tabelle können durch Filter bestimmt werden Makros Nun kann man natürlich auch den Wunsch haben, die Männer und die Frauen nicht nebeneinander darzustellen, sondern übereinander. Ein Weg dahin ist, für die fünf Items jeweils nach dem Geschlecht gefilterte Variablen zu erstellen.…',
    },
    en: {
      description:
        ': DESCRIPTION "Mean" ( item_5 ); The desired table results. Parts of a table can be determined by filters. Macros: now you may of course also wish not to show the men and the women side by side but one above the other. One way to do this is to create variables filtered by sex for each of the five items.…',
      syntax: '',
    },
  },
  {
    name: 'MEANTESTCUT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MEANWELCH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MEDIAN',
    argsHint: '( Var )',
    de: {
      description:
        'Der Median einer dritten Variable in allen Zellen. Bei Median wie bei allen Perzentilen wird innerhalb von GESStabs dann interpoliert, wenn es mit dem TABLEFORMAT PERCENTILEINTERPOL verlangt wird. MEDIAN und PCNTL1 bis PCNTL4 424 sind in einer Zelle kombinierbar; dabei wird untereinander erst PCNTL1, dann MEDIAN und zuletzt PCNTL2 ausgegeben.',
    },
    en: {
      description:
        'The median of a third variable in all cells. As with the median and all percentiles, GESStabs interpolates when this is requested with the TABLEFORMAT PERCENTILEINTERPOL. MEDIAN and PCNTL1 to PCNTL4 424 can be combined in one cell; PCNTL1 is then output first, then MEDIAN and finally PCNTL2.',
      syntax: '',
    },
  },
  {
    name: 'MEDIUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MENUFILTER',
    en: { description: '', syntax: 'MENUFILTER <varlist> = [ YES | NO ];' },
  },
  {
    name: 'MENUHEADER',
    en: { description: '', syntax: 'MENUHEADER <varlist> = [ YES | NO ];' },
  },
  {
    name: 'MENUINCLUDE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MENUMEAN',
    en: { description: '', syntax: 'MENUMEAN <varlist> = [ YES | NO ];' },
  },
  {
    name: 'MENUTITLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MIN',
    de: { description: '', syntax: 'MIN <varname> = <Varlist>;' },
    en: { description: '', syntax: 'MIN <varname> = <Varlist>;' },
  },
  {
    name: 'MINCOLBASE',
    en: {
      description: '',
      syntax: 'MINCOLBASE = <number>;\nPreset at MINCOLBASE = 0',
    },
  },
  {
    name: 'MINCOLUMNS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINCOLWIDTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINFRAMECOLWIDTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINIMUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINIMUMWEIGHT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINIMUMWFACT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MININDEX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINLABELWIDTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINLINEHEIGHT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINMAX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINROWBASE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINTABLEHEIGHT',
    argsHint: '(PS)',
    en: {
      description:
        'For line-orientated printers the width of the letters or the number of rows must be defined as the basic unit of measurement. The following syntax is valid: UNITS = CPI <number> LPI <number>; CPI means Characters Per Inch (Pitch); LPI means Lines Per Inch. Example: UNITS = CPI 10 LPI 6; During output with USEFONT GESS tabs ensures that the fonts match the chosen settings for UNITS.',
    },
  },
  {
    name: 'MINTABLEWIDTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINTEXTHEIGHT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINUTESASHOURSMEAN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MINVALUES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MISSING',
    de: { description: '', syntax: 'MISSING <Varlist> = { number }*n;' },
    en: {
      description:
        'Allows the definition of individual characteristics of nuclear variables as MISSING values.',
      syntax: 'MISSING <Varlist> = { number }*n;\n(n <= 3)',
    },
  },
  {
    name: 'MISSINGCHAR',
    de: {
      description: '',
      syntax: 'MISSINGCHAR = "<char>";\nVoreinstellung: MISSINGCHAR = "M";',
    },
    en: {
      description:
        'defines the character used to mark MISSING values for input and output. Preset: MISSINGCHAR = "M";',
      syntax: 'MISSINGCHAR = "<char>";\nDefault: MISSINGCHAR = "M";',
    },
  },
  {
    name: 'MM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MOD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MODELABEL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MODIFYCSVNAMES',
    de: { description: '', syntax: 'MODIFYCSVNAMES = [ YES | NO ];' },
    en: { description: '', syntax: 'MODIFYCSVNAMES = [ YES | NO ];' },
  },
  {
    name: 'MODIFYVARNAME',
    de: {
      description:
        "Drucke bei Spalten bzw. Zeilen mit dritten Variablen (z.B. 'MEAN( Einkommen)') nicht nur den Variablennamen, sondern auch die DESCRIPTION 550 des Spalten- bzw. Zeileninhalts.",
    },
    en: {
      description:
        'Prints not only the variable name but also the DESCRIPTION of the column or row content in columns or rows with third variables (e.g. MEAN ( Einkommen) ).',
    },
  },
  {
    name: 'MRSET',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MULTICOLINHG',
    en: {
      description:
        'Multiple cell contents (e.g. ABSCOLPERCENT) in CSV-Data files are usually represented in several rows. Alternatively they can be presented in several columns using +MULTICOLINHG. USEFORMATINHG Formats for CELLELEMENTS are also adopted for printouts in HG.…',
    },
  },
  {
    name: 'MULTIDEF',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'MULTIFROMSTRING',
    de: {
      description: '',
      syntax:
        'MULTIFROMSTRING [ DELIMITED <delimiter> ] [ DECIMALS <decimalchar> ] <newvar>\n= <alfavar>;',
    },
    en: {
      description: '',
      syntax:
        'MULTIFROMSTRING [ DELIMITED <delimiter> ] [ DECIMALS <decimalchar> ] <newvar>\n= <alfavar>;',
    },
  },
  {
    name: 'MULTIQ',
    de: {
      description: '',
      syntax:
        'MULTIQ <varname> =\n[NOINPUT ] [ TITLE <titlestring> ] [ ALPHA ] [ start | * ]\nlen [width] [ LABELS { AS <varname> | { value <text> }*n }\n| LABELFROMFILE <filename> ] ];\n;',
    },
    en: {
      description:
        '(also FAMILYVAR) Alternatively the variable family can also be generated directly from the input. This makes the individual variables invisible to the user:',
      syntax:
        'MULTIQ <varname> = [NOINPUT ] [ TITLE <titlestring> ] [ ALPHA ] [\nstart | * ] len [width]\n[ LABELS { AS <varname> | { value <text> }*n } ] ];',
    },
  },
  {
    name: 'MULTISTRING',
    de: {
      description:
        'Text in CODEBOOK 346s, der auf mögliche Mehrfachnennungen verweist',
      syntax: 'MULTISTRING = "<text>";',
    },
    en: {
      description:
        'Defines the text in CODEBOOKs which refers to possible multi-responses. Preset: MULTISTRING= "Mehrfachnennungen möglich"; This is valid for all tables until changed.',
      syntax: 'MULTISTRING = "<text>";',
    },
  },
  {
    name: 'MULTITOTALX',
    de: {
      description:
        'Im Normalfall wird eine TOTALROW auf der Basis von Fällen gezählt (siehe auch TABLEBASE 388). In vielen Fällen ist es aber bei Variablen mit Mehrfachnennungen wünschenswert, die Totalzeile abweichend auf der Basis der Nennungen zu zählen. Dies kann man mit diesem TABLEFORMAT erreichen. (Z.B.…',
    },
    en: {
      description:
        'Usually the TOTALROW is counted on the basis of case numbers (see also TABLEBASE). In many cases it is required to have a total different to the number of response for variables with multi-responses. This can be done using TABLEFORMAT. (e.g. 165% in the total row of a column percentage means an average of 1,65 responses per interviewee.) In this context:…',
    },
  },
  {
    name: 'MULTITOTALY',
    de: {
      description:
        'Analog zu MULTITOTALX 538 wird eine TOTALCOLUMN im Standardfall auf der Basis von Fällen gezählt. Mit MULTITOTALY kann diese Zählung auf alle Nennungen umgestellt werden.',
    },
    en: {
      description:
        'Analogue to this a TOTALCOLUMN is usually tallied on the basis of number of cases. Using MULTITOTALY this tally can be converted to all responses.',
    },
  },
  {
    name: 'NAME',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NE',
    de: { description: 'Not Equal, ist ungleich' },
    en: { description: 'Not Equal', syntax: '' },
  },
  {
    name: 'NEG',
    de: {
      description:
        'negativer Wert Beispiel: COMPUTE x = ENTIER( NEG( b / 2 ) ); Arithmetische Operatoren für Ganze Werte Auch wenn GESStabs keine echten Ganzen Werte kennt, kann es interessant sein, den "Rest" einer Division zu kennen. Dazu stehen folgende Operatoren bereit:',
    },
    en: {
      description:
        'negative value. Example: COMPUTE x = ENTIER( NEG( b / 2 ) ); Arithmetic operators for whole numbers: even though GESStabs has no true whole-number type, it can be useful to know the "remainder" of a division. The following operators are available for this:',
      syntax: '',
    },
  },
  {
    name: 'NEVER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NEWOPENFORMAT',
    de: { description: '', syntax: 'NEWOPENFORMAT = [ YES | NO ];' },
    en: { description: '', syntax: 'NEWOPENFORMAT = [ YES | NO ];' },
  },
  {
    name: 'NEWOPENQFORMAT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NEWPAGE',
    de: {
      description:
        'Seitenumbruch vor dem Label (Synonym: PAGE), siehe auch Layout 543',
    },
    en: {
      description:
        'Page break before the label (synonym: PAGE), see also Layout 543',
      syntax: '',
    },
  },
  {
    name: 'NEXT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NEXTVAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NIL',
    de: {
      description:
        'leere Variable (praktisch z.B. bei TABLE ADD 391) Der Versuch, eigene Variablen mit diesen Namen zu generieren, führt zu einem Fehler. Mit HIDDENTOVARLIST kann gesteuert werden, ob Systemvariablen bei der Nennung von Variablenlisten 20 (mittels TO) mit erfasst werden sollen.',
    },
    en: {
      description:
        'empty variable (useful e.g. with TABLE ADD 391). Attempting to generate your own variables with these names results in an error. HIDDENTOVARLIST controls whether system variables should be included when naming variable lists 20 (via TO).',
      syntax: '',
    },
  },
  {
    name: 'NO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOADDINFRAME',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOADDINFRAMETTL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOADDINFRAMEX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOADDINFRAMEY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOADRESSSERVERALERT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOASCIIEXTENSION',
    de: { description: '', syntax: 'NOASCIIEXTENSION = [ YES | NO ];' },
    en: {
      description:
        'Normally ASCII data sets which have been produced by GESS tabs are finished with a right- justified *.Should this not occur it can be achieved with a switch.',
      syntax: 'NOASCIIEXTENSION = [ YES | NO ];',
    },
  },
  {
    name: 'NOAUTOTABLETITLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOBODYBLANKS',
    de: {
      description:
        'Unterdrückt Leerzeilen im Tabellenrumpf, die sonst der Lesbarkeit halber eingefügt werden. Damit passen u.U. Tabellen',
    },
    en: {
      description:
        'Suppresses blank rows in the table body that have been added to improve legibility. Tables then may for example fit on one page.',
    },
  },
  {
    name: 'NOBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOCITATION',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOCOLCHECK',
    argsHint: '(XGI, XGC etc.)',
    en: {
      description:
        'Syntax NOCOLCHECK = [ YES | NO ]; Preset: NO If using GESS input or GESS questionnaire software the allocation of columns is monitored to avoid multiple use. It can however make sense when filtering for example to use identical physical data areas repeatedly. The standard check can be switched off for this.',
    },
  },
  {
    name: 'NOCONTENTBOX',
    de: {
      description:
        'Unterdrückt den Erläuterungskasten bei zusätzlichen Tabellenzeilen, die z.B. Mittelwerte oder Summen enthalten etc. In diesem Fall wird vor den Werten nur der VARTITLE 210 bzw. der VARNAME 207 ausgegeben. Der/die Benutzer/in sollte dann durch eigene Texte den Tabelleninhalt erläutern. (Ohne Effekt bei Postscript-Ausgabe).',
    },
    en: {
      description:
        'Suppresses the explanation box in additional table rows which for example contain mean or sum etc. In this case only the VARTITLE or the VARNAME are printed in front of the value. The user should then include other texts to explain the content. (no effect on Postscript-printouts). (NON-PS)',
    },
  },
  {
    name: 'NOCSV',
    de: { description: '', syntax: 'NOCSV <varlist> = YES;' },
    en: { description: '', syntax: 'NOCSV <varlist> = YES;' },
  },
  {
    name: 'NODESCRIPTION',
    de: {
      description:
        'Unterdrückt die Beschreibungstexte für die Zelleninhalte (siehe auch DESCRIPTION 550).',
    },
    en: {
      description:
        'Suppresses the descriptive text for the cell contents (see DESCRIPTION.',
    },
  },
  {
    name: 'NOEMPTYELEMENT',
    de: {
      description:
        'Leere CELLELEMENTS 418 (z.B. ein leerer Ergebnistext für einen Signifikanztest) werden durch den ZERODASHCHAR 529 ersetzt.',
    },
    en: {
      description:
        'Empty CELLELEMENTS 418 (e.g. an empty result text for a significance test) are replaced by the ZERODASHCHAR 529.',
      syntax: '',
    },
  },
  {
    name: 'NOEXPANDAT',
    de: { description: '', syntax: 'NOEXPANDAT <varlist> = [ YES | NO ];' },
    en: { description: '', syntax: 'NOEXPANDAT <varlist> = [ YES | NO ];' },
  },
  {
    name: 'NOFRAME',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOFROZEN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOGRAPH',
    de: {
      description:
        'Unterdrückt das, ansonsten standardmäßig dargestellte, rechtsstehende Histogramm in CODEBOOK 346s und PROFILE 637 -Tabellen.',
    },
    en: {
      description:
        'Suppresses the otherwise default right-hand histogram in CODEBOOK 346 and PROFILE 637 tables.',
      syntax: '',
    },
  },
  {
    name: 'NOGRID',
    de: {
      description:
        'Unterdrückt die, ansonsten standardmäßig dargestellte, Skala für Lineingrafiken in PROFILE 637-Tabellen.',
    },
    en: {
      description:
        'Suppresses the otherwise default scale for line graphics in PROFILE 637 tables.',
      syntax: '',
    },
  },
  {
    name: 'NOHEADERBLANKS',
    de: { description: 'Unterdrückt Leerzeilen im Tabellenkopf. (NON-PS)' },
    en: { description: 'Suppresses blank rows in the stub. (NON-PS)' },
  },
  {
    name: 'NOINHERITTEXT',
    de: {
      description: '',
      syntax: 'NOINHERITTEXT = [ YES | NO ];\nNOINHERITTITLE = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'NOINHERITTEXT = [ YES | NO ];\nNOINHERITTITLE = [ YES | NO ];',
    },
  },
  {
    name: 'NOINHERITTITLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOINPUT',
    de: { description: '', syntax: 'NOINPUT <varlist> = [ YES | NO ];' },
    en: { description: '', syntax: 'NOINPUT <varlist> = [ YES | NO ];' },
  },
  {
    name: 'NOINSTITUTIONINCSV',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOINVERTADDON',
    de: { description: '', syntax: 'NOINVERTADDON = [ YES | NO ];' },
    en: { description: '', syntax: 'NOINVERTADDON = [ YES | NO ];' },
  },
  {
    name: 'NOIOCHECK',
    de: { description: '', syntax: 'NOIOCHECK <varlist> = [ YES | NO ];' },
    en: { description: '', syntax: 'NOIOCHECK <varlist> = [ YES | NO ];' },
  },
  {
    name: 'NOISE',
    de: { description: '', syntax: 'NOISE = <value>;' },
    en: {
      description: '',
      syntax:
        'NOISE = <value>;\nNOISE can be used to "add noise" with random figures to all known variables of a data set. <value>\ndefines how many measurement points are to be replaced by random values. value=1 causes a',
    },
  },
  {
    name: 'NOLABEL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOLEGEND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOLOGFILES',
    de: { description: '', syntax: 'NOLOGFILES = [ YES | NO ];' },
    en: { description: '', syntax: 'NOLOGFILES = [ YES | NO ];' },
  },
  {
    name: 'NOMINATIONS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOMINATIONTITLE',
    de: {
      description:
        'Dient zu Ersetzung des Standardtextes bei TABLEBASE = RESPONSES;.',
      syntax: 'NOMINATIONTITLE [X|Y] = "<text>";',
    },
    en: {
      description:
        'In TABLEBASE = NOMINATIONS the standard text is "No. of responses abs.". This can be replaced. Example: NOMINATIONTITLE = "Nennungen"; Different texts are possible for the X and Y axes analogue to CASESTITLE (see above). It is valid for all tables until changed.',
      syntax: 'NOMINATIONTITLE [X|Y] = "<text>";',
    },
  },
  {
    name: 'NOMISSING',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOMULTILINEEXPANSION',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NONOISE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOOCINHEADER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOOCINSTUB',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOOUTPUT',
    de: { description: '', syntax: 'NOOUTPUT <varlist> = [ YES | NO ];' },
    en: { description: '', syntax: 'NOOUTPUT <varlist> = [ YES | NO ];' },
  },
  {
    name: 'NOQOUOTESINCSV',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOQUOTESINCSV',
    de: { description: '', syntax: 'NOQUOTESINCSV = [ YES | NO ];' },
    en: { description: '', syntax: 'NOQUOTESINCSV = [ YES | NO ];' },
  },
  {
    name: 'NORANKING',
    de: {
      description:
        'Ausschluss aus Ranking, siehe Sortierungen 468 Vergabe eines Zähllevels zur Steuerung der Ausgabe in Tabellen (relevant',
    },
    en: {
      description:
        'Exclusion from ranking, see Sortings 468. Assignment of a count level to control the output in tables (relevant',
      syntax: '',
    },
  },
  {
    name: 'NOREPORT',
    de: { description: '', syntax: 'NOREPORT <varlist> = [ YES | NO ];' },
    en: { description: '', syntax: 'NOREPORT <varlist> = [ YES | NO ];' },
  },
  {
    name: 'NORMAL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NORMALIZE',
    de: { description: '', syntax: 'NORMALIZE;\nNORMALIZE = <varlist>;' },
    en: { description: '', syntax: 'NORMALIZE;' },
  },
  {
    name: 'NOSCALE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOSIGNIFMEANGREATER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOSIGNIFMEANLESS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOSPSS',
    de: { description: '', syntax: 'NOSPSS <varlist> = [ YES | NO ];' },
    en: { description: '', syntax: 'NOSPSS <varlist> = [ YES | NO ];' },
  },
  {
    name: 'NOT',
    de: {
      description:
        'Nicht Assoziationen müssen explizit durch Klammerung angegeben werden; ungeklammerte Reihungen von OR und AND werden von links nach rechts abgearbeitet. Die verbreitete abkürzende Schreibweise (z.B. "a EQ 1 OR 2" anstelle von "a EQ 1 OR a EQ 2" etc. ist nicht erlaubt. Hierfür gibt es die IN 303-Formulierung. Stringkonstanten sind erlaubt.…',
    },
    en: {
      description:
        'Not. Associations must be given explicitly by bracketing; unbracketed sequences of OR and AND are processed from left to right. The common abbreviated notation (e.g. "a EQ 1 OR 2" instead of "a EQ 1 OR a EQ 2" etc.) is not allowed. The IN 303 formulation exists for this. String constants are allowed.…',
      syntax: '',
    },
  },
  {
    name: 'NOTHING',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOTOGGLEKEY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOVARTITLEBOX',
    de: {
      description:
        'Unterdrückt den Kasten, der Variablen in der Y-Richtung benennt. Macht immer dann Sinn, wenn man in der Y-Richtung nur eine einzige Variable verwendet, die zudem z.B. bereits in der TOPTEXT 516-Box erläutert wurde.',
    },
    en: {
      description:
        'Suppresses the box which names the variables on the Y-axis. Always makes sense if only one variable is used on the Y-axis which for example already appears in the TOPTEXT box.',
    },
  },
  {
    name: 'NOVELLLOCKS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOWHITEBACK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOWRAPINTEXT',
    de: { description: '', syntax: 'NOWRAPINTEXT = [ YES | NO ] ;' },
    en: { description: '', syntax: 'NOWRAPINTEXT = [ YES | NO ] ;' },
  },
  {
    name: 'NOXVARTITLEBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NOZERODASH',
    de: {
      description:
        "Im Standardfall wird die echte Null in Prozenttabellen durch '-' dargestellt. Dies kann man mit NOZERODASH abschalten.",
    },
    en: {
      description:
        'Usually the real zero in percentage tables is represented by a "-". This can be switched off using NOZERODASH.',
    },
  },
  {
    name: 'NOZEROFILLINLABEL',
    de: {
      description:
        'Unterdrückt die Ergänzung führender Nullen im LABELFORMAT 569-Statement.',
    },
    en: {
      description:
        'Suppresses the addition of leading zeros in the LABELFORMAT 569 statement.',
      syntax: '',
    },
  },
  {
    name: 'NUMBERCHAR',
    de: {
      description:
        'Wird in TABLETITLE 516s durch die aktuelle Tabellennummer ersetzt. Voreinstellung: #',
    },
    en: {
      description:
        'Is replaced by the current table number in TABLETITLE 516. Default: #',
      syntax: '',
    },
  },
  {
    name: 'NUMBERSINCOLOR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NUMCENTERGRAPH',
    de: {
      description:
        '| FORM RECTANGLE COLUMNS 1 ROWS 2 | FORM RECTANGLE COLUMNS 2 ROWS 1 2 ; Das einfachste Chart erweitert um Optionen für Form und Farbe 2a: Vier Charts auf einer Seite im Querformat Im folgenden Beispiel wurden vier Charts auf Basis derselben Tabelle auf einer Seite im Querformat abgebildet.…',
    },
    en: {
      description:
        '| FORM RECTANGLE COLUMNS 1 ROWS 2 | FORM RECTANGLE COLUMNS 2 ROWS 1 2 ; The simplest chart extended with options for shape and colour. 2a: Four charts on one page in landscape format. In the following example, four charts based on the same table were arranged on one page in landscape format.…',
      syntax: '',
    },
  },
  {
    name: 'NUMERIC',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'NUMEXGRAPH',
    de: {
      description:
        'CHARTTITLE "Ehemalige Parteiwähler von CDU, SPD und Grüne/GAL wählen:" = | COLUMNS POSITION 2:4 ROWS POSITION 1:8 ; GESSCHART PIE SAMEPAGE',
    },
    en: {
      description:
        'CHARTTITLE "Former party voters of CDU, SPD and Greens/GAL vote:" = | COLUMNS POSITION 2:4 ROWS POSITION 1:8 ; GESSCHART PIE SAMEPAGE',
      syntax: '',
    },
  },
  {
    name: 'NUMINGRAPH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OFFICECHAPTERPAGE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OFFICECHART',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OFFICECHARTDEFAULTS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OFFICECONTENTPAGE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OFFICEEXPORT',
    de: {
      description: '',
      syntax:
        'OFFICEEXPORT = <filename>;\n<filename> muss eine der folgenden Extensionen haben : xlsx | xls | ods. über die Extension',
    },
    en: {
      description: '',
      syntax:
        'OFFICEEXPORT = <filename>;\n<filename> must have one of the following extensions: xlsx | xls | ods. The output type is determined by the extension',
    },
  },
  {
    name: 'OFFICEEXPORTOPTIONS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OFFICEFONT',
    de: {
      description: '',
      syntax:
        'OFFICEFONT <fontname> SIZE <number> [OPTION [BOLD|ITALIC|UNDERLINE]]',
    },
    en: {
      description: '',
      syntax:
        'OFFICEFONT <fontname> SIZE <number> [OPTION [BOLD|ITALIC|UNDERLINE]]',
    },
  },
  {
    name: 'OFFICEFORMAT',
    de: {
      description: '',
      syntax: 'OFFICEFORMAT <cellelement> : <formatstring>',
    },
    en: {
      description: '',
      syntax: 'OFFICEFORMAT <cellelement> : <formatstring>',
    },
  },
  {
    name: 'OFFICEPICTURE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OFFICETITLEPAGE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OLDEXCELFORMAT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OLDGROUPCLEARMETHOD',
    de: { description: '', syntax: 'OLDGROUPCLEARMETHOD = [ YES | NO ];' },
    en: { description: '', syntax: 'OLDGROUPCLEARMETHOD = [ YES | NO ];' },
  },
  {
    name: 'ONQUESTIONNAIRE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OPEN',
    en: {
      description:
        'The GESS system can also process and code the responses to open questions by designating the variables in the SINGLEQ to be OPEN. GESS questionnaire and input programmes then open a text window for the input of open responses.',
    },
  },
  {
    name: 'OPENASALPHA',
    de: {
      description: '',
      syntax:
        'OPENASALPHA <varlist> = [ YES | NO ];\nGLOBALOPENASALPHA = [ YES | NO ];',
    },
    en: {
      description:
        'Usually the results of the coding are taken from the OPENQFILEs but the texts can also be used verbatim which is achieved using: OPENASALPHA <varlist> = [ YES | NO ];',
      syntax:
        'OPENASALPHA <varlist> = [ YES | NO ];\nGLOBALOPENASALPHA = [ YES | NO ];',
    },
  },
  {
    name: 'OPENAUTOGENERATE',
    de: {
      description: '',
      syntax:
        'OPENAUTOGENERATE = [ YES | MULTIQ <number> [ PREFIX <text> ] ]\n| ALPHA [ PREFIX <text> ] ];\nDie einfachste Version lautet: OPENAUTOGENERATE = YES;',
    },
    en: {
      description: '',
      syntax:
        'OPENAUTOGENERATE = [ YES | MULTIQ <number> [ PREFIX <text> ] ]\n| ALPHA [ PREFIX <text> ] ];\nThe simplest version reads: OPENAUTOGENERATE = YES;',
    },
  },
  {
    name: 'OPENCSV',
    de: { description: '', syntax: 'OPENCSV = [ YES | NO ];' },
    en: { description: '', syntax: 'OPENCSV = [ YES | NO ];' },
  },
  {
    name: 'OPENOFFICEDEVIATION',
    de: { description: '', syntax: 'OPENOFFICEDEVIATION = YES;' },
    en: { description: '', syntax: 'OPENOFFICEDEVIATION = YES;' },
  },
  {
    name: 'OPENQFILE',
    de: { description: '', syntax: 'OPENQFILE = <name.opn>;' },
    en: {
      description:
        'If open questions are to be used at least one OPENQFILE must be defined. GESS tabs reads all OPENQFILEs and creates a data bank which allocates which values belong to which case numbers. The OPENQFILE statement has the same syntax as the DATAFILE statement.…',
      syntax: 'OPENQFILE = <name.opn>;',
    },
  },
  {
    name: 'OPENQFILES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OPENQFORMAT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OPTIMIZE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OPTION',
    de: {
      description: '',
      syntax: 'OPTION : [CLUSTERED | STACKED | PERCENTSTACKED]',
    },
    en: {
      description: '',
      syntax: 'OPTION : [CLUSTERED | STACKED | PERCENTSTACKED]',
    },
  },
  {
    name: 'OR',
    argsHint: '( Alter LT 6 AND Schulbildung GT 0 )',
    de: {
      description:
        'PRINT "Unplausibler Ausbildungsgrad" Alter Schulbildung; Die Meldungen erscheinen entweder im INPUT-DATA-ERROR-Fenster in der GESStabs- Oberfläche oder ggf. im LISTFILE 38. Die zweite Syntax-Variante erzeugt eine Ausgabe in eine eigene, zugeordnete Datei. In diesem Fall wird eine Überschriftszeile mit den Variablennamen erzeugt.…',
    },
    en: {
      description:
        'PRINT "Unplausibler Ausbildungsgrad" Alter Schulbildung; The messages either appear in the INPUT-DATA-ERROR window on screen or where applicable in the LISTFILE (see above). A summary table of all the errors can be requested using SUMMARY. During the program run in GESS input or GESS CAPI an error window appears.…',
    },
  },
  {
    name: 'OS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OUTFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OUTLINE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OVERCODE',
    de: {
      description: 'Bildung und Benennung eines Obercodes 262',
      syntax:
        'OVERCODE [<ocname>] { :<label> }*n "<text des OVERCODEs"\n<ocname> ::= neuer eindeutiger Name des OVERCODEs',
    },
    en: {
      description: 'Formation and naming of an over-code 262',
      syntax:
        'OVERCODE [<ocname>] { :<label> }*n "<text of the OVERCODE>"\n<ocname> ::= new unique name of the OVERCODE',
    },
  },
  {
    name: 'OVERCODE SUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OVERLAPPED',
    de: { description: 'Die graphischen Elemente überlappend darstellen' },
    en: { description: 'Show the graphical elements overlapping', syntax: '' },
  },
  {
    name: 'OVEROVERCODE',
    de: {
      description: '',
      syntax:
        'OVEROVERCODE [ SUM ] <oocname> { :<ocname> }*n\n"<text des OVEROVERCODEs"\n<oocname> ::= neuer eindeutiger Name des OVEROVERCODE\n<ocname> ::= gültiger Name eines bestehenden OVERCODE',
    },
    en: {
      description: '',
      syntax:
        'OVEROVERCODE [ SUM ] <oocname> { :<ocname> }*n\n"<text of the OVEROVERCODE>"\n<oocname> ::= new unique name of the OVEROVERCODE\n<ocname> ::= valid name of an existing OVERCODE',
    },
  },
  {
    name: 'OVERSLICE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'OVERVIEW',
    de: {
      description:
        'TITLE "Tabelle mit vererbter Sortierung, SORT AS „overbase“" SORT AS overbase = #k BY MEAN STDDEV( #domacro2 ( m_name 11:16; a ) ); Sortierung vererben: Basistabelle Tabelle mit vererbter Sortierung Die neue Implementierung von „SORT AS“ erlaubt auch die Vererbung von Reihenfolgen im Kopf von Tabellen. Wir wandeln unser Beispiel kurz ab, und zeigen formal dieselbe Information in einem XOVERVIEW.…',
      syntax:
        'OVERVIEW <tableoptions> = <kopf> BY <cellelementlist> ( <varlist> )\n[ SORT <cellelement> [ DESCEND ] [ PANE <number> CODE <number> ] ] ;\n<varlist> ::= { <variable [ <varoption> ] }*n\n<varoption> ::=\n[ SORTCLASS <number> ]\n[ LEVEL <number> ]',
    },
    en: {
      description:
        'TITLE "Table with inherited sorting, SORT AS „overbase“" SORT AS overbase = #k BY MEAN STDDEV( #domacro2 ( m_name 11:16; a ) ); Inherit sorting: base table, table with inherited sorting. The new implementation of „SORT AS“ also allows the inheritance of orders in the header of tables. We modify our example briefly and show formally the same information in an XOVERVIEW.…',
      syntax:
        'OVERVIEW <tableoptions> = <header> BY <cellelementlist> ( <varlist> )\n[ SORT <cellelement> [ DESCEND ] [ PANE <number> CODE <number> ] ] ;\n<varlist> ::= { <variable [ <varoption> ] }*n\n<varoption> ::=\n[ SORTCLASS <number> ]\n[ LEVEL <number> ]',
    },
  },
  {
    name: 'OVERVIEW ADD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PAGE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PAGELENGTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PAGENUMBER',
    de: {
      description:
        'Setzt die aktuelle Seitennummer neu, wird mit dem NUMBERCHAR 527 eingesetzt.',
    },
    en: { description: 'Resets the current page number.' },
  },
  {
    name: 'PAGETOTALX',
    de: {
      description:
        'Hat nur Effekt bei MULTITOTALX 538: Die Nennungen aller Variablen auf der Y-Achse werden für die Totalzeile gezählt.',
    },
    en: {
      description:
        'Only effective with MULTITOTALX: The responses of all variables on the Y-axis are tallied for the TOTALROW.',
    },
  },
  {
    name: 'PAGETOTALY',
    de: {
      description:
        'Hat nur Effekt bei MULTITOTALY 538: Die Nennungen aller Variablen auf der X-Achse werden für die Totalspalte gezählt.',
    },
    en: {
      description:
        'Only has effect with MULTITOTALY: The responses to all variables on the X-Axis are tallied for the TOTALCOLUMN.',
    },
  },
  {
    name: 'PANE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PAPER',
    de: {
      description: '',
      syntax:
        "PAPER = HEIGHT <number> WIDTH <number>;\nDie Interpretation von '<number>' richtet sich nach UNITS.",
    },
    en: { description: '', syntax: 'PAPER = HEIGHT <number> WIDTH <number>;' },
  },
  {
    name: 'PASSWORD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PATTERN',
    de: {
      description:
        'Pattern 1 = gepunktet.) Jede Farbe wird entweder nach dem HSB-Modell (Hue-Saturation-',
    },
    en: {
      description:
        'Pattern 1 = dotted.) Each colour is chosen either by the HSB model (Hue-Saturation-',
      syntax: '',
    },
  },
  {
    name: 'PATTERNERROR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PCNTL1',
    argsHint: '( Var )',
    de: {
      description:
        'Frei wählbare Percentil. Voreingestellt sind für PCNTL1 das',
    },
    en: {
      description:
        'Freely selectable percentile. For PCNTL1 the default is the',
      syntax: '',
    },
  },
  {
    name: 'PCNTL2',
    argsHint: '( Var )',
    de: {
      description: '1.Quartil und für PCNTL2 das 3. Quartil, d.h. jeweils 25%',
    },
    en: {
      description:
        '1st quartile and for PCNTL2 the 3rd quartile, i.e. 25% each',
      syntax: '',
    },
  },
  {
    name: 'PCNTL3',
    argsHint: '( Var )',
    de: {
      description:
        'PCNTL4 ( Var ) bzw. 75% der Zellenverteilung. Mit zusätzlichen Statements kann die Grenze und der Text der Percentilauswertung individuell gewählt werden, Beispiel: PCNTL1 = 33.333% "1.Drittel"; PCNTL2 = 66.667% "2.Drittel"; Es wird dann interpoliert, wenn es mit dem TABLEFORMAT PERCENTILEINTERPOL 540 verlangt wird.',
    },
    en: {
      description:
        'PCNTL4 ( Var ) or 75% of the cell distribution. With additional statements the boundary and the text of the percentile evaluation can be chosen individually, example: PCNTL1 = 33.333% "1st third"; PCNTL2 = 66.667% "2nd third"; Interpolation is done when requested with the TABLEFORMAT PERCENTILEINTERPOL 540.',
      syntax: '',
    },
  },
  {
    name: 'PCNTL4',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PCNTRANGE',
    argsHint: '( Var )',
    de: {
      description: 'Ausgabe des 1. und 2. Perzentils als Spanne in einer Zeile',
    },
    en: {
      description: 'Output of the 1st and 2nd percentile as a span on one line',
      syntax: '',
    },
  },
  {
    name: 'PDF',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PEARSONR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PERCENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PERCENTILEDELTA',
    argsHint: '( Var )',
    de: {
      description:
        'Ausgabe der Differenz zwischen dem 1. und 2. Perzentil Name Beschreibung',
    },
    en: {
      description:
        'Output of the difference between the 1st and 2nd percentile. Name Description',
      syntax: '',
    },
  },
  {
    name: 'PERCENTILEINTERPOL',
    de: {
      description:
        'Mit diesem TABLEFORMAT wird eine Interpolation eingeschaltet.',
    },
    en: {
      description:
        'Using this TABLEFORMAT an interpolation is switched on. Interpolation used to be standard in GESS tabs. This is however unusual if anything; we have readjusted and now interpolation has to be explicitly defined.',
    },
  },
  {
    name: 'PERCENTINLABEL',
    de: {
      description:
        'Fügt bei CELLELEMENT = COLUMNPERCENT; 420 in die Labelboxes der X-Achse automatisch ein %-Zeichen ein.',
    },
    en: {
      description:
        'Automatically adds a % symbol with CELLELEMENT = COLUMNPERCENT to the label boxes on the X- axis. Incidentally is also used to add an additional row with percentaging in ColumnCount (PS).',
    },
  },
  {
    name: 'PERCENTSTACKED',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHI',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHONE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSCELLMIN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSCOLCHIQU',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSCOLDELTA',
    de: {
      description:
        'Differenz zwischen gewichteten und ungewichteten Spaltenprozenten',
    },
    en: {
      description:
        'Difference between weighted and unweighted column percentages',
      syntax: '',
    },
  },
  {
    name: 'PHYSCOLDEPTTEST',
    de: {
      description:
        'Abhängiger, spaltenweiser t-Test auf Basis der gewichteten Daten',
    },
    en: {
      description:
        'Dependent, column-wise t-test on the basis of the weighted data',
      syntax: '',
    },
  },
  {
    name: 'PHYSCOLINHG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSCOLPERCENT',
    de: { description: 'Spaltenprozente, auf Basis ungewichteter Zahlen' },
    en: {
      description: 'Column percentages, based on unweighted figures',
      syntax: '',
    },
  },
  {
    name: 'PHYSDEPTTEST',
    argsHint: '( Var )',
    de: {
      description:
        'Abhängiger t-Test auf Mittelwertsunterschiede auf Basis der ungewichteten Daten',
    },
    en: {
      description:
        'Dependent t-test on mean differences on the basis of the unweighted data',
      syntax: '',
    },
  },
  {
    name: 'PHYSICALC',
    de: {
      description:
        'Physikalische Fallzahl (ohne Berücksichtigung von Gewichten) in der Spalte',
    },
    en: {
      description:
        'Physical case count (without taking weights into account) in the column',
      syntax: '',
    },
  },
  {
    name: 'PHYSICALCOLUMN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSICALNTITLE',
    de: {
      description:
        'Text zur Kennzeichnung der Spalten/Zeilen mit ungewichteter Fallzahl',
      syntax: 'PHYSICALNTITLE = "<text>";',
    },
    en: {
      description:
        'Serves to replace the standard text "unweighted" with the indicator of columns or rows with "unweighted n". (See FRAMEELEMENTS, PHYSICALROW or PHYSICALCOLUMN). Example: PHYSICALNTITLE = "Zahl der Be-frag-ten"; X and Y frame texts can be set differently analogue to TOTALTITLE. This is valid for all tables until changed.',
      syntax: 'PHYSICALNTITLE = "<text>";',
    },
  },
  {
    name: 'PHYSICALR',
    de: {
      description:
        'Physikalische Fallzahl (ohne Berücksichtigung von Gewichten) in der Zeile',
    },
    en: {
      description:
        'Physical case count (without taking weights into account) in the row',
      syntax: '',
    },
  },
  {
    name: 'PHYSICALRECORDS',
    de: { description: 'ungewichtete Zahl der Fälle' },
    en: { description: 'unweighted number of cases', syntax: '' },
  },
  {
    name: 'PHYSICALROW',
    de: { description: 'und folgende drei Arten von Rahmenspalten:' },
    en: {
      description: 'and the following three kinds of frame columns:',
      syntax: '',
    },
  },
  {
    name: 'PHYSMCNEMAR',
    de: {
      description:
        'Abhängiger Test auf Prozentwertunterschied auf Basis der ungewichteten Daten nach McNemar 449',
    },
    en: {
      description:
        'Dependent test on percentage differences on the basis of the unweighted data per McNemar 449',
      syntax: '',
    },
  },
  {
    name: 'PHYSMEAN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSMEANCOLDEPT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSMEANTEST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSMEANWELCH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSMINCOLBASE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSMINROWBASE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSROWCHIQU',
    de: {
      description: 'Zeilenweiser Chi²-Test auf Basis der ungewichteten Daten',
    },
    en: {
      description:
        'Row-wise chi-square test on the basis of the unweighted data',
      syntax: '',
    },
  },
  {
    name: 'PHYSROWDELTA',
    de: {
      description:
        'Differenz zwischen den gewichteten und ungewichteten Zeilenprozenten.',
    },
    en: {
      description:
        'Difference between the weighted and unweighted row percentages.',
      syntax: '',
    },
  },
  {
    name: 'PHYSROWINHG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSROWMEANTEST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PHYSROWPERCENT',
    de: {
      description: 'Zeilenprozente, auf Basis einer ungewichteten Zählung',
    },
    en: {
      description: 'Row percentages, based on an unweighted count',
      syntax: '',
    },
  },
  {
    name: 'PHYSROWTTEST',
    de: {
      description:
        'Unabhängiger, zeilenweiser t-Test auf Mittelwertunterschiede auf Basis der ungewichteten Daten. Name Beschreibung',
    },
    en: {
      description:
        'Independent, row-wise t-test on mean differences on the basis of the unweighted data. Name Description',
      syntax: '',
    },
  },
  {
    name: 'PHYSTTEST',
    argsHint: '( Var )',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwertsunterschiede auf Basis der ungewichteten Daten',
    },
    en: {
      description:
        'Independent t-test on mean differences on the basis of the unweighted data',
      syntax: '',
    },
  },
  {
    name: 'PHYSWELCHTEST',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwerteunterschiede nach Welch 450 auf Basis der ungewichteten Daten',
    },
    en: {
      description:
        'Independent t-test on mean differences per Welch 450 on the basis of the unweighted data',
      syntax: '',
    },
  },
  {
    name: 'PIE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PIE100',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PIESTARTANGLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PLAINDATAREPORT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PLAYBACK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PLUSBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'POINTBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'POINTS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'POSITION',
    de: {
      description:
        'Mit POSITION kann die Position vorgegeben werden, an der das neue Label (oder auch OVERCODE 262) in die Labelliste eingefügt wird. Die Zählung ist 1-basiert. Möchte man z.B. ein Label vor allen bestehenden einfügen, so schreibt man etwa: LABELS testvar = ADD POSITION 1',
      syntax: 'POSITION "<cellrange>"',
    },
    en: {
      description:
        'With POSITION the position can be specified at which the new label (or also OVERCODE 262) is inserted into the label list. Counting is 1-based. If you want e.g. to insert a label before all existing ones, you write something like: LABELS testvar = ADD POSITION 1',
      syntax: 'POSITION "<cellrange>"',
    },
  },
  {
    name: 'POSTPONE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'POSTPROCESS',
    de: {
      description: '',
      syntax:
        'POSTPROCESS <Cellelement> : [ IF-Statement | COMPUTE-Statement ];',
    },
    en: {
      description: '',
      syntax:
        'POSTPROCESS <Cellelement> : [ IF-Statement | COMPUTE-Statement ];',
    },
  },
  {
    name: 'POSTREPLACE',
    de: {
      description: '',
      syntax: 'POSTREPLACE <cellelement> : <text1> = <text2> [ IF <text3> ] ;',
    },
    en: {
      description: '',
      syntax: 'POSTREPLACE <cellelement> : <text1> = <text2> [ IF <text3> ] ;',
    },
  },
  {
    name: 'POSTSCRIPT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'POWERCHARTS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'POWERPOINTFILENAME',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PPCHART',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PPEXCHANGE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PPTEMPLATES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PREQUOTA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PRETEXT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PRINT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PRINT2LINES',
    de: {
      description:
        'Bei Zeilen bzw. Spalten, die mit CELLELEMENTS gebildet werden, die zwei logische Inhalte 433 haben (z.B. ABSCOLPERCENT, ABSMEAN) kann die Darstellung in zwei Zeilen innerhalb der Zelle verlangt werden. (Hat nur bei Postscript- Ausgabe Effekt.)',
    },
    en: {
      description:
        'The presentation of two rows within a cell can be achieved in rows or columns that are generated using CELLELEMENTS and have two logical contents (e.g. ABSCOLPERCENT, ABSMEAN). (Only effective with Postscript-printouts). (PS)',
    },
  },
  {
    name: 'PRINT2LINES2',
    de: {
      description:
        'Analog zu PRINT2LINES 540, nur in umgekehrter Reihenfolge. (Hat nur bei Postscript-Ausgabe Effekt.)',
    },
    en: {
      description:
        'Analogue to Print2Lines, only in the other order. (Only effective with Postscript-printouts). (PS)',
    },
  },
  {
    name: 'PRINTALL',
    de: {
      description: '',
      syntax:
        'PRINTALL <varlist> = [ YES | NO ];\nGLOBALPRINTALL = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax:
        'PRINTALL <varlist> = [ YES | NO ];\nGLOBALPRINTALL = [ YES | NO ];',
    },
  },
  {
    name: 'PRINTDICTIONARY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PRINTEREXIT',
    en: {
      description:
        'Control string which is written at the end of a PRINTFILE. The individual characters are defined in either decimal or ASCII code Example: PRINTEREXIT = 12 {FormFeed} 10 {LineFeed} 13 {CR}; or ASCII codes are mixed with literal strings. Character chains which are to be passed on to the printer unchanged are set in quotation marks. Example:…',
    },
  },
  {
    name: 'PRINTERINIT',
    en: {
      description:
        'Control string which is written at the beginning of the output of a PRINTFILE. See above for coding.',
    },
  },
  {
    name: 'PRINTFILE',
    de: { description: '', syntax: 'PRINTFILE <Druckername> = <FileName>;' },
    en: { description: '', syntax: 'PRINTFILE <Druckername> = <FileName>;' },
  },
  {
    name: 'PRINTSUPPRESSVALUE',
    de: { description: '', syntax: 'PRINTSUPPRESSVALUE = <number>;' },
    en: { description: '', syntax: 'PRINTSUPPRESSVALUE = <number>;' },
  },
  {
    name: 'PRINTWEIGHTPROTOCOL',
    de: { description: '', syntax: 'PRINTWEIGHTPROTOCOL = [ YES | NO ];' },
    en: { description: '', syntax: 'PRINTWEIGHTPROTOCOL = [ YES | NO ];' },
  },
  {
    name: 'PROFILE',
    en: {
      description:
        'PROFILE defines a mean table with an optional graphical presentation of the mean value. In certain ways PROFILE is to mean as COMPARE is to distribution. PROFILE can also be used to present many variables cohesively.…',
    },
  },
  {
    name: 'PROFILEHEADERS',
    en: {
      description:
        'PROFILEHEADERS is an obligatory command after a PROFILE statement and is used to define the column legends. The test elements can cover more than one row; the same hyphenation rules apply as for VALUELABELS (see above).',
    },
  },
  {
    name: 'PROFILELINES',
    de: {
      description: '',
      syntax:
        'PROFILELINES = { LineDef }*n ;\nLineDef ::= | <number> : { LineQualifier }*n\nLineQualifier ::=[ HIDDEN | PATTERN <number>\n| COLOR <number> <number> <number>\n| WIDTH <number> | SYMBOL <number> SYMBOLWIDTH <number> ]',
    },
    en: {
      description: '',
      syntax:
        'PROFILELINES = { LineDef }*n ;\nLineDef ::= | <number> : { LineQualifier }*n\nLineQualifier ::=[ HIDDEN | PATTERN <number> | COLOR <number>\n<number> <number> | WIDTH <number> | SYMBOL <number> SYMBOLWIDTH\n<number> ]',
    },
  },
  {
    name: 'PROFILESCALE',
    de: {
      description: '',
      syntax: 'PROFILESCALE = <start> <end> <increment>;',
    },
    en: {
      description: '',
      syntax: 'PROFILESCALE = <start> <end> <increment> ;',
    },
  },
  {
    name: 'PROFILESORT',
    de: {
      description: '',
      syntax:
        'PROFILESORT = [ <number> ] [ DESCEND ] ;\nDie PROFILE-Tabelle wird nach der in <number> festgelegten Datenspalte sortiert, im\nNormalfall aufsteigend; mit DESCEND kann die absteigende Variante gewählt werden. Die',
    },
    en: {
      description: '',
      syntax:
        'PROFILESORT = [ <number> ] [ DESCEND ] ;\nThe PROFILE table is sorted according to the <number> defined in the data column, usually in\nascending order; DESCEND defines the descending order. The data column results in the case of a BY\ntable from a code of characteristic. Where there are several variables per row <number> is the first',
    },
  },
  {
    name: 'PROJCOLPERCENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PROJECT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PROJECTION',
    de: {
      description:
        'absolute Häufigkeitswerte: Summe der Gewichte, multipliziert mit dem PROJECTIONFACTOR Hiermit kann man eine Stichprobe anhand der gewichteten Verteilung auf die Grundgesamtheit hochrechnen. Der PROJECTIONFACTOR kann mit der Anweisung PROJECTIONFACTOR = <Wert>; gesetzt werden. Voreinstellung: 1.0.',
    },
    en: {
      description:
        'absolute frequency values: sum of weights, multiplied by the PROJECTIONFACTOR. With this you can project a sample onto the population using the weighted distribution. The PROJECTIONFACTOR can be set with the instruction PROJECTIONFACTOR = <value>; Default: 1.0.',
      syntax: '',
    },
  },
  {
    name: 'PROJECTIONFACTOR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'PROJECTIONSUM',
    argsHint: '( Var )',
    de: {
      description: "Darstellung der Summe von 'Var', multipliziert mit dem",
    },
    en: {
      description: "Display of the sum of 'Var', multiplied by the",
      syntax: '',
    },
  },
  {
    name: 'PROTOCOLPAGE',
    de: { description: '', syntax: 'PROTOCOLPAGE = [ YES | NO ];' },
    en: { description: '', syntax: 'PROTOCOLPAGE = [ YES | NO ];' },
  },
  {
    name: 'PS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'QBLOCK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'QST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'QU',
    de: {
      description:
        '| kombiniert mit | COLPERCANDCHIQU |     |     |     | COLPERCANDHYCHIQU | | -------------- | --------------- | --- | --- | --- | ----------------- | % | z-Test | COLPERCZ  |     |     |     |     | | ------ | --------- | --- | --- | --- | --- |',
    },
    en: {
      description:
        '| combined with | COLPERCANDCHIQU |     |     |     | COLPERCANDHYCHIQU | | -------------- | --------------- | --- | --- | --- | ----------------- | % | z-test | COLPERCZ  |     |     |     |     | | ------ | --------- | --- | --- | --- | --- |',
      syntax: '',
    },
  },
  {
    name: 'QUALITAB',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'QUANTUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'QUANTUMINCHARS',
    de: { description: '', syntax: 'QUANTUMINCHARS = <filename>;' },
    en: { description: '', syntax: 'QUANTUMINCHARS = <filename>;' },
  },
  {
    name: 'QUESTION',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'QUOTA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'QUOTAINFO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RANDOM',
    de: {
      description:
        'RANDOM von einer negativen Zahl ist undefiniert. Der Aufruf COMPUTE xx = RANDOM( Max) mit einem positiven Argument "Max" liefert eine ganzzahlige Zufallszahl im Range 0 .. Max-1.',
    },
    en: {
      description:
        'RANDOM of a negative number is undefined. The call COMPUTE xx = RANDOM( Max) with a positive argument "Max" returns an integer random number in the range 0 .. Max-1.',
      syntax: '',
    },
  },
  {
    name: 'RANDOMGROUP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RANGE',
    de: {
      description:
        'Mit dem Schlüsselwort RANGE können beliebige Bereiche angefordert und so eine Tabelle mit sehr vielen Ausprägungen zerlegt werden. Zum Beispiel: TABLE = a BY b SORT ABSOLUTE DESCEND RANGE 1 20;',
    },
    en: {
      description:
        'With the keyword RANGE, arbitrary ranges can be requested and a table with a great many categories can thus be split. For example: TABLE = a BY b SORT ABSOLUTE DESCEND RANGE 1 20;',
      syntax: '',
    },
  },
  {
    name: 'RANGES',
    de: { description: '', syntax: 'RANGES [<VarList>] <ValueList> ;' },
    en: { description: '', syntax: 'RANGES <VarList> <ValueList> ;' },
  },
  {
    name: 'RANK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RAWDATASTRING',
    de: {
      description:
        'Kennzeichnung, um ungewichtete Tabellen von gewichteten zu unterscheiden. Wird direkt vor dem DOCUMENT ausgegeben.',
      syntax:
        'RAWDATASTRING = "<Symbol>";\nVoreinstellung: RAWDATASTRING = "*";',
    },
    en: {
      description:
        'Indicator to differentiate between unweighted and weighted tables. Comes directly before DOCUMENT. Preset: RAWDATASTRING = "*"; This is valid for all tables until changed. Options for Printing and Layout of Tables',
      syntax: 'RAWDATASTRING = "<symbol>";\nDefault: RAWDATASTRING = "*";',
    },
  },
  {
    name: 'READONLY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RECHIPREFIX',
    de: { description: '', syntax: 'RECHIPREFIX = "<Zeichenfolge>";' },
    en: { description: '', syntax: 'RECHIPREFIX = "<string>";' },
  },
  {
    name: 'RECODE',
    de: {
      description:
        'Umkodierung 255 (Voraussetzung: LABELRECODE 256 = YES;), wird bei LABELS COPY bzw. LABELS AS vererbt Beispiel für eine gültiges VALUELABELS-Statement mit LabelProperties: VALUELABELS V1 = OVERCODE 1:3 "Norden" SORTCLASS 1',
      syntax:
        'RECODE <recode> { / <recode> }*n [ ELSE = <number> ] ;\n<recode> ::= <valuelist> = < number >\n< valuelist > ::= [ <number> | <number> : <number> | <valuelist>',
    },
    en: {
      description:
        'allows the reprogramming of of individual variable characteristics of the variable defined last or a list of explicitly named variables. Example: RECODE 1 2 3 = 3; summarises the characteristics 1,2 and 3 of the variable defined last to 3. RECODE item1 item2 item3 1 = 4; recodes the characteristics of item1, item2 and item3 of the variable. also possible:…',
      syntax:
        'RECODE <recode> { / <recode> }*n [ ELSE = <number> ] ;\n<recode> ::= <valuelist> = < number >\n< valuelist > ::= [ <number> | <number> : <number> | <valuelist>',
    },
  },
  {
    name: 'RECODELASTWINS',
    de: { description: '', syntax: 'RECODELASTWINS = [ YES | NO ];' },
    en: { description: '', syntax: 'RECODELASTWINS = [ YES | NO ];' },
  },
  {
    name: 'RECODESMALL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RECODETASKS',
    en: {
      description:
        'The effect of RECODE statements can be restricted to particular task types. Using: RECODETASKS = tabtask; recodes are only carried out by GESS tabs, and all RECODE statements from GESS input or CATI etc. are ignored.',
    },
  },
  {
    name: 'RECORDING',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RECTANGLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RECTLINE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'REDEFINEVARS',
    en: {
      description:
        'YES or NO. Preset: NO. If REDEFINEVARS is set to YES all command rows in the INFILE appear which redefine the input definition of variables already defined. Command rows in the INFILE are identified using a dollar sign ($) in the first column of a row in the INFILE. Commands conforming to the syntax of the VARNAME or RECODE commands are permitted.…',
    },
  },
  {
    name: 'REMOVELINEFEEDSFORCONTENT',
    de: {
      description: '',
      syntax: 'REMOVELINEFEEDSFORCONTENT = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'REMOVELINEFEEDSFORCONTENT = [ YES | NO ];',
    },
  },
  {
    name: 'REPLACE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'REPORT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'REPRINT',
    de: { description: '', syntax: 'REPRINT TABLE = <tablename>;' },
    en: { description: '', syntax: 'REPRINT TABLE = <tablename>;' },
  },
  {
    name: 'REPRINT TABLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'REQ',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RESETREDEFINEVARS',
    en: { description: '', syntax: 'RESETREDEFINEVARS = [ YES | NO ] ;' },
  },
  {
    name: 'RESPONSES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RESPONSESTITLE',
    de: {
      description:
        'Bezeichnung der RESPONSES-Spalte/-zeile (wenn TABLEBASE = RESPONSES; 388 gesetzt)',
      syntax: 'RESPONSESTITLE [ X | Y ] = "<text>";',
    },
    en: {
      description:
        'Label of the RESPONSES column/row (when TABLEBASE = RESPONSES; 388 is set)',
      syntax: 'RESPONSESTITLE [ X | Y ] = "<text>";',
    },
  },
  {
    name: 'RESTARTFROZEN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RESTRICT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RESTRICTVALUES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RESULT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RESULTCODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RETAINOPENVERBATIMS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'REUSE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RGB',
    de: {
      description: '',
      syntax:
        'RGB = [ YES | NO ];\nBei RGB = NO; wertet GESStabs die numerische Farbinformation nach dem Hue-Saturation-\nBrightness-Modell 560. Setzt man RGB = YES;, werden die Zahlenwerte als Rot-/Grün-/Blau-',
    },
    en: {
      description: '',
      syntax:
        'RGB = [ YES | NO ];\nIf RGB = NO GESS tabs calculates the numerical colour information according to the HSB model. If RGB\n= YES the numerical values are interpreted according to the Red-Green-Blue model.',
    },
  },
  {
    name: 'RIGH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RIGHT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'RISING',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ROTATE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ROUND',
    de: {
      description:
        '1alter 1000 1.Frage "1.Frage" alter+1 2000.1 Variablenlisten Viele Anweisungen operieren mit einer Liste von Variablen, kurz Varlist. Dies ist in der Syntaxbeschreibung der jeweiligen Anweisung durch <Varlist> gekennzeichnet. Eine Variablenliste besteht im einfachsten Fall aus einer Auflistung von Variablen, z.b: var1 var2 var3 var4 Oft ist es ökonomischer, mit TO zu arbeiten.…',
    },
    en: {
      description:
        '1 alter 1000 1.Frage "1.Frage" alter+1 2000.1 Variable lists: many instructions operate with a list of variables, Varlist for short. In the syntax description of the respective instruction this is marked by <Varlist>. In the simplest case a variable list consists of an enumeration of variables, e.g.: var1 var2 var3 var4. Often it is more economical to work with TO.…',
      syntax: '',
    },
  },
  {
    name: 'ROUNDMODE',
    de: {
      description: '',
      syntax: 'ROUNDMODE = [ CLASSIC | BANKERSROUNDMODE | SIMPLE ];',
    },
    en: {
      description: '',
      syntax: 'ROUNDMODE = [ CLASSIC | BANKERSROUNDMODE | SIMPLE ];',
    },
  },
  {
    name: 'ROWCELLMINIMUM',
    de: { description: '', syntax: 'ROWCELLMINIMUM = <value>;' },
    en: { description: '', syntax: 'ROWCELLMINIMUM = <number>;' },
  },
  {
    name: 'ROWCHIQ',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ROWCHIQU',
    de: {
      description:
        'Zeilenweise 4-Felder-Chiquadrattest auf Prozentwertunterschiede. Die Kennzeichnung erfolgt analog zu COLCHIQU 428 mit alphabetischer Zeilenkennzeichnung, A ist die erste Zeile, B die zweite, usw. Man kann mit INDEXCHARS 529 eigene Kennzeichen und Reihenfolgen definieren.',
    },
    en: {
      description:
        'Row-wise 4-field chi-square test on percentage differences. The marking is done analogously to COLCHIQU 428 with alphabetic row marking, A is the first row, B the second, etc. With INDEXCHARS 529 you can define your own markers and orders.',
      syntax: '',
    },
  },
  {
    name: 'ROWELEMENTWINS',
    de: {
      description:
        'Dies beeinflusst die Auswahl der CELLELEMENTS an Kreuzungspunkten, an denen sowohl für Zeilen als auch für Spalten explizite CELLELEMENTS definiert sind. a) In einer Tabelle werden zwei Variablen gekreuzt, bei denen jeweils labels mit eigenen CELLELEMENTS versehen sind, z.B.: LABELS A =',
    },
    en: {
      description:
        'This affects the selection of the CELLELEMENTS at intersection points where explicit CELLELEMENTS are defined for both rows and columns. a) In a table two variables are crossed whose labels are each provided with their own CELLELEMENTS, e.g.: LABELS A =',
      syntax: '',
    },
  },
  {
    name: 'ROWMEANTEST',
    argsHint: '( Var )',
    de: {
      description:
        'Wie MEANTEST 430, nur werden die Werte in den Zeilen gegeneinander getestet',
    },
    en: {
      description:
        'Like MEANTEST 430, only the values in the rows are tested against each other',
      syntax: '',
    },
  },
  {
    name: 'ROWMINIMUM',
    en: {
      description:
        'Option for TABLE statement. Only those rows are printed which contain at least ROWMINIMUM cases, i.e., characteristics with very low case numbers in side group variables are suppressed. Preset at 0.0001.',
    },
  },
  {
    name: 'ROWPERCENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ROWPERCENT100',
    de: {
      description:
        'Nach Hare-Niemeyer-Modell modifizierte Zeilenprozentwerte (Summe ergibt 100), Achtung: nicht geeignet bspw. für Mehrfachnennungsvariablen und OVERCODEs, Tabellen mit unterdrückten MISSING VALUES und selektiv gebildete Variablen',
    },
    en: {
      description:
        'Row percentages modified by the Hare-Niemeyer method (sum equals 100). Note: not suitable e.g. for multiple-response variables and OVERCODEs, tables with suppressed MISSING VALUES and selectively built variables',
      syntax: '',
    },
  },
  {
    name: 'ROWPERCENTINDEX',
    de: {
      description:
        'Indexwerte zu den Zeilenprozenten (100 entspricht dem Wert in der Totalzeile)',
    },
    en: {
      description:
        'Index values for the row percentages (100 corresponds to the value in the total row)',
      syntax: '',
    },
  },
  {
    name: 'ROWPERCENTRANGE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ROWPERCENTRANGELOWER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ROWPERCENTRANGEUPPER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ROWPERCEQUAL',
    de: {
      description:
        'Testet alle Zeilenprozente in der Zeile auf Gleichheit; d.h. alle Abweichungen von der Ungleichverteilung werden als signifikant betrachtet. Hier besteht natürlich die Möglichkeit, sehr viele unsinnige Signifikanzen zu produzieren. Bitte mit Bedacht verwenden.',
    },
    en: {
      description:
        'Tests all row percentages in the row for equality; i.e. all deviations from the equal distribution are considered significant. This can of course produce a great many meaningless significances. Please use with care.',
      syntax: '',
    },
  },
  {
    name: 'ROWPERCSTDERR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ROWPERCZ',
    de: {
      description:
        'Signifikanztest (zeilenweise) für Prozentwertsunterschiede. ROWPERCZ basiert auf dem Z-Test für Prozentwerte. Erweiterter Z-Test mit Arcus-Sinus-Korrektur.',
    },
    en: {
      description:
        'Significance test (row-wise) for percentage differences. ROWPERCZ is based on the Z-test for percentage values. Extended Z-test with arcsine correction.',
      syntax: '',
    },
  },
  {
    name: 'ROWS',
    de: {
      description: '',
      syntax:
        'ROWS : [TOTALROW | <startrow>[: <endrow>]]\nCOLUMNS : [TOTALCOLUMN | <startcol>[: <endcol>]]',
    },
    en: {
      description: '',
      syntax:
        'ROWS : [TOTALROW | <startrow>[: <endrow>]]\nCOLUMNS : [TOTALCOLUMN | <startcol>[: <endcol>]]',
    },
  },
  {
    name: 'ROWSTRIPES',
    de: {
      description:
        'Ist dieses TABLEFORMAT gesetzt, werden die Zeilen von TABLE- Tabellen farblich hinterlegt, und zwar abwechselnd mit den Farben, die in STRIPECOLORS 559 vereinbart wurde.',
    },
    en: {
      description:
        'If this TABLEFORMAT is set, the rows of TABLE tables are shaded, alternately with the colours declared in STRIPECOLORS 559.',
      syntax: '',
    },
  },
  {
    name: 'ROWSUM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ROWSUMPERCENT',
    argsHint: '( Var )',
    de: {
      description:
        'Ausgabe der Zeilenprozentuierung der Summe einer dritten Variablen, z.B. die Summe von Name Beschreibung Ausgaben für einen bestimmten Zweck in bestimmten Stadtteilen etc.',
    },
    en: {
      description:
        'Output of the row percentaging of the sum of a third variable, e.g. the sum of expenditures for a particular purpose in particular city districts, etc. Name Description',
      syntax: '',
    },
  },
  {
    name: 'ROWTTEST',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwertunterschiede auf Basis der gewichteten Daten, zeilenweise',
    },
    en: {
      description:
        'Independent t-test on mean differences on the basis of the weighted data, row-wise',
      syntax: '',
    },
  },
  {
    name: 'SAMEPAGE',
    de: {
      description:
        '= | COLUMNS 1:5 ROWS 65002 65003 ; GESSCHARTFORMAT = STROKERECT; GESSCHARTCOLORS = $AAFFAA $FFAAAA $AAAAFF $FFFFAA $AAFFFF; GESSCHART CHARTTITLE "Skalenmittelwerte Bewertung nach Modellen (vertikal)" INVERSE CHARTAREA 195 15 87 90 SAMEPAGE VERTICAL = | COLUMNS 1:5 ROWS 2/1 AXISMINMAX 0 4 ; GESSCHART CHARTTITLE "Anteil von \'sehr schlecht\'" INVERSE CHARTAREA 195 107 87 88 SAMEPAGE VERTICAL = |…',
    },
    en: {
      description:
        '= | COLUMNS 1:5 ROWS 65002 65003 ; GESSCHARTFORMAT = STROKERECT; GESSCHARTCOLORS = $AAFFAA $FFAAAA $AAAAFF $FFFFAA $AAFFFF; GESSCHART CHARTTITLE "Scale means rating by models (vertical)" INVERSE CHARTAREA 195 15 87 90 SAMEPAGE VERTICAL = | COLUMNS 1:5 ROWS 2/1 AXISMINMAX 0 4 ; GESSCHART CHARTTITLE "Share of \'very poor\'" INVERSE CHARTAREA 195 107 87 88 SAMEPAGE VERTICAL = |…',
      syntax: '',
    },
  },
  {
    name: 'SAVEPRTSETUP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SAVETABSETUP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SCALENUMBERS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SCORETAB',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SCREEN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SCRIPTEXPORTFILE',
    de: {
      description: '',
      syntax: 'SCRIPTEXPORTFILE = [ APPEND ] <filename>;',
    },
    en: {
      description:
        'These can be used to define parts of the script as a "foreign code" to be exported. If the name of a SCRIPTEXPORTFILE is set all parts of the script between #STARTEXPORT and #ENDEXPORT are carried over into this file. These texts are also processed and modified by the Macro Expander which is the appeal of this construction. Thus it is possible to output variable names produced by nested macros.…',
      syntax: 'SCRIPTEXPORTFILE = [ APPEND ] <filename>;',
    },
  },
  {
    name: 'SEARCHRANGE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SECONDMEAN',
    argsHint: '( Var )',
    de: {
      description:
        'Zweiter Mittelwert. Wenn in einer Zelle die Mittelwerte von zwei verschiedenen Variablen ausgegeben werden sollen, muss die zweite Variable über SECONDMEAN angefordert werden.',
    },
    en: {
      description:
        'Second mean. If the means of two different variables are to be output in one cell, the second variable must be requested via SECONDMEAN.',
      syntax: '',
    },
  },
  {
    name: 'SECONDSUM',
    argsHint: '( Var )',
    de: {
      description:
        '2. Summe. Wenn in einer Zelle die Summen von zwei verschiedenen Variablen ausgegeben werden sollen, muss die zweite Variable über SECONDSUM angefordert werden.',
    },
    en: {
      description:
        '2nd sum. If the sums of two different variables are to be output in one cell, the second variable must be requested via SECONDSUM.',
      syntax: '',
    },
  },
  {
    name: 'SELECT',
    de: {
      description: '',
      syntax:
        'SELECT <Bedingung>;\nAlle RECODE-, RANGES-, COMPUTE- oder IF-Anweisungen werden vor SELECT durchgeführt;',
    },
    en: {
      description:
        'defines an import filter: only those cases which conform to this filter are processed further, i.e. all tables are produced only on the basis of this data; SELECT is a permanent filter as opposed to TABSELECT (see below). SELECT also acts on the output according to COPYFILE or SYSTEMOUT. An iterative weighting also only refers to the selected cases.…',
      syntax:
        'SELECT <condition>;\nAll RECODE, RANGES, COMPUTE or IF instructions are carried out before SELECT;',
    },
  },
  {
    name: 'SETBLOCK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SETDECIMALS',
    de: { description: '', syntax: 'SETDECIMALS < Varlist > = <number>;' },
    en: {
      description:
        'Serves to explicitly set the decimal point for variables which have already been defined.',
      syntax: 'SETDECIMALS < Varlist > = number ;',
    },
  },
  {
    name: 'SETEPS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SETFILTER',
    de: {
      description: '',
      syntax:
        'SETFILTER [ <filtername> ] [ TEXT "filtertext" ] = < log. Bedingung > ;\nENDFILTER [ <filtername> ] ;\nCOPYFILTER <varname> = <varname>;',
    },
    en: {
      description: '',
      syntax:
        'SETFILTER [ <filtername> ] [ TEXT "filtertext" ] = < log. Bedingung >\n;\nENDFILTER [ <filtername> ] ;\nCOPYFILTER <varname> = <varname>;',
    },
  },
  {
    name: 'SETMISSING',
    de: { description: '', syntax: 'SETMISSING <Varlist> = { number }*n;' },
    en: {
      description:
        "A MISSING value is automatically inherited on to variables which emanate from the calculation of other variables. If MISSING values go into a calculation or an 'M' is found in the input then the result is a MISSING value. The variable then receives the characteristic allocated by the user with SETMISSING. Example: SETMISSING = 9999;",
      syntax: 'SETMISSING <varlist> = { number }*n;',
    },
  },
  {
    name: 'SHADE',
    de: { description: '', syntax: 'SHADE <boxname> = <number> ;' },
    en: {
      description: '(PS): is ignored by line printers.',
      syntax: 'SHADE <boxname> = <number> ;',
    },
  },
  {
    name: 'SHADOW',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SHARE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SHEETNAME',
    de: {
      description:
        'die folgende Tabelle erscheint Allen Elementen kann man einen Office-Font und Farben zuordnen. NoAutoTableTitle NOAUTOTABLETITLE nimmt Einfluss auf die Voreinstellung, die jede Tabelle in eine OFFICECONTENTPAGE einträgt. Hierfür wird der CONTENTKEY verwendet, und wenn dieser nicht vorhanden ist, wird als Default der TABLETITLE verwendet.…',
    },
    en: {
      description:
        'the following table appears. All elements can be assigned an Office font and colours. NoAutoTableTitle: NOAUTOTABLETITLE influences the default that enters each table into an OFFICECONTENTPAGE. The CONTENTKEY is used for this, and if it is not present, the TABLETITLE is used as the default.…',
      syntax: '',
    },
  },
  {
    name: 'SHEETNUMBERCHAR',
    de: { description: '', syntax: 'SHEETNUMBERCHAR = <char>;' },
    en: { description: '', syntax: 'SHEETNUMBERCHAR = <char>;' },
  },
  {
    name: 'SHOWHELPINTEXT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SHOWSHEETNAME',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SHOWSIGNIF',
    en: {
      description:
        'Be it that a test resulted in a significant difference between column A and column D, then naturally the test between column D and column A would also show a significant difference. The identification of "A" in column D and of "D" in column A is technically correct but nonetheless redundant. In many cases it is preferable to show the significance only once for each pair.…',
    },
  },
  {
    name: 'SHOWSIGNIFONCE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SHOWTTMEAN',
    en: {
      description:
        'Prints the mean of test variable additional to the indication of significance levels.',
    },
  },
  {
    name: 'SHRINKDATAFONT',
    de: {
      description:
        'Die Ausgaben von CELLELEMENTS in Tabellen werden grundsätzlich in einer Zeile dargestellt und nicht umgebrochen. Bei sehr ausgiebigen Signifikanztests mit niedrigem Signifikanzniveau können in Abhängigkeit vo der Größe des eingestellten Fonts Aneinanderreihungen von Buchstaben entstehen, die bei schmalen Spalten den verfügbaren Platz überschreiten.…',
    },
    en: {
      description:
        'The output of CELLELEMENTS in tables is generally shown on one line and not wrapped. With very extensive significance tests at a low significance level, depending on the size of the chosen font, strings of letters can arise that exceed the available space in narrow columns.…',
      syntax: '',
    },
  },
  {
    name: 'SHUFFLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGN3LEVELS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGN3LOWLEVELS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGNIF20AND10',
    de: {
      description:
        'ABC... für 10%-Niveau, abc.... für 20%-Niveau Beschreibung der Signifikanzen Für alle oben benannten Optionen (Signifikanzniveaus) existieren Standardtexte, die das jeweilige Signifikanznivau beschreiben. SignifText Die SIGNIFTEXT-Anweisung dient dazu, diesen Standardtext anzupassen.…',
    },
    en: {
      description:
        'ABC... for the 10% level, abc.... for the 20% level. Description of the significances: for all the options named above (significance levels) there are default texts that describe the respective significance level. SignifText: the SIGNIFTEXT instruction serves to adjust this default text.…',
      syntax: '',
    },
  },
  {
    name: 'SIGNIF20AND5',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGNIF32AND10',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGNIF3LEVELS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGNIF68',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGNIF90',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGNIF95',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGNIF99',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGNIF999',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGNIFLEVEL',
    de: { description: '', syntax: 'SIGNIFLEVEL = <option>;' },
    en: { description: '', syntax: 'SIGNIFLEVEL = <option>;' },
  },
  {
    name: 'SIGNIFMINEFFECTCHIQ',
    de: {
      description: '',
      syntax: 'SIGNIFMINEFFECTCHIQ = <value>;\nSIGNIFMINEFFECTTTEST = <value>;',
    },
    en: {
      description: '',
      syntax: 'SIGNIFMINEFFECTCHIQ = <value>;\nSIGNIFMINEFFECTTTEST = <value>;',
    },
  },
  {
    name: 'SIGNIFMINEFFECTTTEST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGNIFTEXT',
    de: {
      description:
        'Anpassung des Standardtextes zur Beschreibung der SIGNIFLEVEL 454-',
      syntax: 'SIGNIFTEXT <option> = "Text zur Kennzeichnung";',
    },
    en: {
      description:
        'Adjustment of the default text describing the SIGNIFLEVEL 454',
      syntax: 'SIGNIFTEXT <option> = "marking text";',
    },
  },
  {
    name: 'SIGNPERCENTALWAYS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIGNPERCENTGREATER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIMPLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIMPLEPERCENTILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIMPLEVAR',
    en: { description: '', syntax: 'SIMPLEVAR <variable> = <vargroup> ;' },
  },
  {
    name: 'SIN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SINGLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SINGLEFROMSTRING',
    de: {
      description: '',
      syntax: 'SINGLEFROMSTRING = <newvar> = <alphavar>;',
    },
    en: {
      description: '',
      syntax: 'SINGLEFROMSTRING = <newvar> = <alphavar>;',
    },
  },
  {
    name: 'SINGLEQ',
    de: {
      description: '',
      syntax: 'SINGLEQ <varname> = [ TITLE "Titelstring" ] OPEN;',
    },
    en: {
      description:
        '(also: VARIABLE) The simplest way to build a question/variable is using the SINGLEQ statement.',
      syntax:
        'SINGLEQ <varname> = [ TITLE <titletext> ] [ ALPHA ] [ [ start | * ] [\nwidth | BINARY ] ]\n[ LABELS [ AS <varname > | COPY <varname> | MAKE <number> | {\nLabelEntry }*n } ]\n;\nLabelEntry ::=',
    },
  },
  {
    name: 'SINGLESCOREFILES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SIZE',
    de: {
      description:
        '; Ist die Option MISSING definiert, werden alle Variablen mit MISSING VALUES ausgegeben. Bei EXCLUDEVALUES und RESTRICTVALUES wird eine Liste der betroffenen Variablen mit den vorgefundenen EXCLUDEVALUES bzw. RESTRICTVALUES ausgegeben. POSTPONE ist ein Spezial-Option im Zusammenhang mit INVERTOUT 94 :…',
      syntax: 'SIZE X/Y <points>',
    },
    en: {
      description:
        '; If the option MISSING is defined, all variables with MISSING VALUES are output. With EXCLUDEVALUES and RESTRICTVALUES a list of the affected variables with the EXCLUDEVALUES or RESTRICTVALUES found is output. POSTPONE is a special option in connection with INVERTOUT 94 :…',
      syntax: 'SIZE X/Y <points>',
    },
  },
  {
    name: 'SLICE',
    de: {
      description:
        'Mit SLICE kann man eine Tabelle in der Y-Richtung in die erforderliche Anzahl',
    },
    en: {
      description:
        'With SLICE you can split a table in the Y direction into the required number',
      syntax: '',
    },
  },
  {
    name: 'SLICEHEADERFIRST',
    de: {
      description: '',
      syntax:
        'SLICEHEADERFIRST = [ YES | NO ];\nBei SLICEHEADERFIRST=YES; werden zunächst alle Teile des Kopfes (in der X-Richtung',
    },
    en: {
      description: '',
      syntax:
        'SLICEHEADERFIRST = [ YES | NO ];\nWith SLICEHEADERFIRST=YES; first all parts of the header (in the X direction',
    },
  },
  {
    name: 'SLICELASTPAGE',
    de: {
      description:
        'Bei auf der Y-Achse zusammengesetzten Tabellen mit SLICE 543 bzw. LINESLICE wird im Standardfall der Mittelwert (oder andere Werte) auf jeder Seite ausgegeben. Mit diesem',
    },
    en: {
      description:
        'Tables generated on the Y-Axis SLICE or LINESLICE (e.g. TABLE = y by b SORT POSITION SLICE 10 MEAN( b );) usually have the mean (or other value) on each page. This TABLEFORMAT ensures the printout only on the last page.',
    },
  },
  {
    name: 'SLICESTATISTICS',
    de: { description: '', syntax: 'SLICESTATISTICS = <number>;' },
    en: {
      description:
        'Summary tables of the type: TABLE = #k by Mean( v1 ) Mean( v2 ) Mean( v3 ) Mean( v4 ) Mean( v5 ) Mean( v6 ) Mean( v7 ) Mean( v8 ) … Mean( v99 ) ; can be spread across several pages using the key word SLICESTATISTICS. After setting SLICESTATISTICS = 35; all the following tables of this type are always divided after 35 such rows.',
      syntax: 'SLICESTATISTICS = <number>;',
    },
  },
  {
    name: 'SOMERSDCOL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SOMERSDROW',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SOMERSDSYM',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SORT',
    de: { description: '', syntax: 'SORT AS = [ XVALID | YVALID ];' },
    en: {
      description:
        'Normally the variable characteristics are printed in the order they are defined in VALUELABELS statement. The variable characteristics in the X or Y-Axis can however also be sorted according to other criteria. The key word SORT is written after the variable name followed by the sort criterion which are as follows: ABSOLUTE acc. to absolute cell content MEAN acc. to arithmetical mean SUM acc.…',
      syntax: 'SORT AS = [ XVALID | YVALID ];',
    },
  },
  {
    name: 'SORT AS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SORTCLASS',
    de: {
      description: 'Vergabe einer Sortierklasse, siehe Sortierungen 466',
      syntax:
        'SORTCLASS <varname> LABELS <number> [ <number> ... ] = <number> ;',
    },
    en: {
      description:
        'Usually the SORTCLASS information is given to labels and overcodes in the VALUELABELS statement or the LABELS part of the SINGLEQ, DICHOQ or MULTIQ statement. There are however cases where it makes sense to provide the SORTCLASS information later in the text.…',
      syntax:
        'SORTCLASS <varname> OVERCODE <name> = <number>;\nHere the OVERCODE is allocated the SORTCLASS <number> and all labels belonging to the OVERCODE\nreceive the SORTCLASS <number> + 1. In this way OVERCODEs and the relevant label positions can be',
    },
  },
  {
    name: 'SORTCODEOVERCODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SORTMEMORY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SORTPOSITION',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SORTSUMMARYALPHA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SORTSUMMARYFREQ',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SPACE',
    de: {
      description:
        'leere Zelle (wird z.B. benötigt, um leere Zeilen bzw. Spalten in Tabellen für Name Beschreibung PowerPoint 202 zu erzeugen) Inkompatibilitäten unter Zellinhalten Aufgrund der internen Speicherstrukturen gibt es einige Inkompatibilitäten unter Zellinhalten:…',
    },
    en: {
      description:
        'empty cell (needed e.g. to create empty rows or columns in tables for PowerPoint 202). Incompatibilities among cell contents: due to the internal storage structures there are some incompatibilities among cell contents:…',
      syntax: '',
    },
  },
  {
    name: 'SPLITCHAR',
    de: {
      description:
        'Erlaubt an der Stelle eine Worttrennung (flexibel). Voreinstellung: -',
    },
    en: {
      description:
        'Allows a word break at this position (flexible). Default: -',
      syntax: '',
    },
  },
  {
    name: 'SPLITCHARSTAY',
    de: {
      description:
        "Erlaubt ebenfalls eine Worttrennung, wird aber auch dann als Bindestrich gedruckt, wenn er nicht am Zeilenende steht (fest). Voreinstellung: # Diese Zeichen können umdefiniert werden. Es ist allerdings zu bedenken, dass man dann ggf. auch Systemstandardtexte ändern muss. Zum Beispiel den TOTALTITLE: 'Ins-ge-samt':…",
    },
    en: {
      description:
        'Preset: Linefeedchar: \\ Numberchar: # Splitchar: - Splitcharstay: # Certain symbols have a special meaning for string output. The LINEFEEDCHAR causes a return in labels or variable titles. The NUMBERCHAR is replaced in table titles by the current table number.…',
    },
  },
  {
    name: 'SPLITDICTIONARY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SPLITENTRIES',
    en: {
      description:
        'SPLITENTRIES = <filename>; It is very easy to produce a "dividing" dictionary. If a list is constructed like so Nie~der~sachsen Bundes~land Wahl~ab~sicht Weiterfüh~ren~de Polytech~ni~sche Hoch~schul~reife Selbst~ständige Aus~zu~bil~den~de wahr~schein~lich',
    },
  },
  {
    name: 'SPSS',
    de: { description: '', syntax: 'SPSS [ ASCIIOUT ] = <filename>;' },
    en: { description: '', syntax: 'SPSS [ ASCIIOUT ] = <filename>;' },
  },
  {
    name: 'SPSS VARSTOCASES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SPSS__',
    en: { description: '', syntax: 'SPSS__ = [ YES | NO ];' },
  },
  {
    name: 'SPSSALPHALENGTH',
    de: { description: '', syntax: 'SPSSALPHALENGTH = <number>;' },
    en: { description: '', syntax: 'SPSSALPHALENGTH = <number>;' },
  },
  {
    name: 'SPSSFILTERMISSING',
    de: { description: '', syntax: 'SPSSFILTERMISSING = <number>;' },
    en: { description: '', syntax: 'SPSSFILTERMISSING = <number>;' },
  },
  {
    name: 'SPSSGLOBALSEQUENCE',
    de: { description: '', syntax: 'SPSSGLOBALSEQUENCE = [ YES | NO ];' },
    en: { description: '', syntax: 'SPSSGLOBALSEQUENCE = [ YES | NO ];' },
  },
  {
    name: 'SPSSGROUP',
    de: { description: '', syntax: 'SPSSGROUP <name> = <familyvarname>;' },
    en: { description: '', syntax: 'SPSSGROUP <name> = <familyvarname>;' },
  },
  {
    name: 'SPSSGROUPLABEL0',
    en: {
      description:
        'A SPSSGROUP comprises a row of nuclear variables where the Code 0 or 1 shows whether the relevant value is "set". The SPSSGROUP statement has now (as of Version 4.0.2) been expanded so that these nuclear variables can be allocated information from the label of the relevant code of the source variable (MULTIQ).',
    },
  },
  {
    name: 'SPSSGROUPLABEL1',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SPSSGROUPLABELS',
    de: {
      description: '',
      syntax:
        'SPSSGROUPLABELS = [ YES | NO ];\nSPSSGROUPLABEL1 = <TEXT>;\nSPSSGROUPLABEL0 = <TEXT>;',
    },
    en: {
      description: '',
      syntax:
        'SPSSGROUPLABELS = [ YES | NO ];\nSPSSGROUPLABEL1 = <TEXT>;\nSPSSGROUPLABEL0 = <TEXT>;',
    },
  },
  {
    name: 'SPSSINFILE',
    de: {
      description: '',
      syntax:
        'SPSSINFILE [ FILEKEY <key> ] = <filepath>;\nCSVINFILE [ FILEKEY <key> ] [ <delimchar> ] = <filepath>;\nDATAFILE [ FILEKEY <key> ] = <filepath>;\nOPENQFILE [ FILEKEY <key> ] [ ALLOWEMPTY ] = <filepath>;\nASSOCFILE [ FILEKEY <filekey> ] [ BIG DBASEIN SPSS ] =\n<filename> KEY <keyvar> [ <start> <len> ] | [ keyField ] ;',
    },
    en: { description: '', syntax: 'SPSSINFILE = <filename>;' },
  },
  {
    name: 'SPSSIO',
    de: {
      description:
        'Dynamic Link Library-Dateien (DLL), die IBM zum Lesen, Verarbeiten und Schreiben von SPSS- Dateien bereitstellt. 3. Laden Sie die Dateien aus dem Ordner „SPSSIO“ in der 32- oder 64-bit-Version aus unserem Download-Center herunter. 4. Speichern Sie die Dateien in Ihrem GESS\\tabs-Verzeichnis. Lizenzierung 5.…',
    },
    en: {
      description:
        'Dynamic Link Library files (DLL) that IBM provides for reading, processing and writing SPSS files. 3. Download the files from the „SPSSIO“ folder in the 32- or 64-bit version from our download centre. 4. Save the files in your GESS\\tabs directory. Licensing 5.…',
      syntax: '',
    },
  },
  {
    name: 'SPSSLARGEFILELENGTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SPSSLONGNAMES',
    de: { description: '', syntax: 'SPSSLONGNAMES = [ YES | NO ];' },
    en: {
      description: '',
      syntax:
        'SPSSLONGNAMES = [ yes | no ];\nOld versions of SPSS could not use long variable names; GESS tabs shortened the names where',
    },
  },
  {
    name: 'SPSSNORECODEDLABELS',
    de: { description: '', syntax: 'SPSSNORECODEDLABELS = [ YES | NO ]:' },
    en: { description: '', syntax: 'SPSSNORECODEDLABELS = [ YES | NO ]:' },
  },
  {
    name: 'SPSSOUTFILE',
    de: { description: '', syntax: 'SPSSOUTFILE = <filename>;' },
    en: { description: '', syntax: 'SPSSOUTFILE = <filename>;' },
  },
  {
    name: 'SPSSOUTSUBFILE',
    de: {
      description: '',
      syntax:
        'SPSSOUTSUBFILE <internal_name> <varnamelist> = <spss_filename> ;\nSTORESPSSSUBFILE = <internal_name> ;',
    },
    en: {
      description: '',
      syntax:
        'SPSSOUTSUBFILE <internal_name> <varnamelist> = <spss_filename> ;\nSTORESPSSSUBFILE = <internal_name> ;',
    },
  },
  {
    name: 'SPSSPRINTFORMAT',
    de: {
      description: '',
      syntax: 'SPSSPRINTFORMAT = <spss-formatcode> <width> <decimals> ;',
    },
    en: {
      description: '',
      syntax: 'SPSSPRINTFORMAT = <spss-formatcode> <width> <decimals> ;',
    },
  },
  {
    name: 'SPSSREADMULT',
    de: { description: '', syntax: 'SPSSREADMULT = [ YES | NO ];' },
    en: { description: '', syntax: 'SPSSREADMULT = [ YES | NO ];' },
  },
  {
    name: 'SPSSSOUTFILE',
    en: { description: '', syntax: 'SPSSSOUTFILE = <filename>;' },
  },
  {
    name: 'SPSSVARLABTOTEXT',
    de: { description: '', syntax: 'SPSSVARLABTOTEXT = [ YES | NO | COPY ];' },
    en: { description: '', syntax: 'SPSSVARLABTOTEXT = [ YES | NO ];' },
  },
  {
    name: 'SPSSWEIGHTOUT',
    de: { description: '', syntax: 'SPSSWEIGHTOUT = <varname>;' },
    en: { description: '', syntax: 'SPSSWEIGHTOUT = <varname>;' },
  },
  {
    name: 'SPSSWRITEMULT',
    de: { description: '', syntax: 'SPSSWRITEMULT = [ YES | NO ];' },
    en: { description: '', syntax: 'SPSSWRITEMULT = [ YES | NO ];' },
  },
  {
    name: 'SQRT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SQUARE1',
    de: { description: 'Quadrat (auf der Basis stehend)' },
    en: { description: 'Square (standing on its base)', syntax: '' },
  },
  {
    name: 'SQUARE1O',
    de: { description: 'Quadrat (auf der Basis stehend) als Outline' },
    en: { description: 'Square (standing on its base) as outline', syntax: '' },
  },
  {
    name: 'SQUARE2',
    de: { description: 'Quadrat (auf der Spitze stehend)' },
    en: { description: 'Square (standing on its point)', syntax: '' },
  },
  {
    name: 'SQUARE2O',
    de: { description: 'Quadrat (auf der Spitze stehend) als Outline' },
    en: {
      description: 'Square (standing on its point) as outline',
      syntax: '',
    },
  },
  {
    name: 'STACKED',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDAREAS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDAREAS100',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDAREAS3D',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDAREAS3D100',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDBARS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDBARS100',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDBARS100H',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDBARS3D',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDBARS3D100',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDBARS3D100H',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDBARSH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDLINES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDLINES100',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDLINES100WITHSYMBOLS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STACKEDLINESWITHSYMBOLS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STANDARD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STARBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'START',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STARTCOLUMN',
    en: {
      description: '',
      syntax:
        'STARTCOLUMN = <number>;\nThe automatic designation of columns using * presumes that there is a previous variable; from this the',
    },
  },
  {
    name: 'STARTEXPORT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STARTLINE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STATIC',
    de: { description: '', syntax: 'STATIC <varlist> = [ YES | NO ];' },
    en: { description: '', syntax: 'STATIC <varlist> = [ YES | NO ];' },
  },
  {
    name: 'STATISTICS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STATTESTDUMP',
    de: { description: '', syntax: 'STATTESTDUMP = <filename> ;' },
    en: { description: '', syntax: 'STATTESTDUMP = <filename> ;' },
  },
  {
    name: 'STATUSVARIABLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STDDEV',
    de: {
      description:
        'STDDEV errechnet die Standardabweichung einer Variable oder Variablenliste über alle Fälle des Datensatzes.',
      syntax: 'STDDEV <varname> = <varlist>;',
    },
    en: {
      description:
        'STDDEV computes the standard deviation of a variable or variable list over all cases of the data set.',
      syntax: 'STDDEV <varname> = <varlist>;',
    },
  },
  {
    name: 'STDERR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STDSIGNIFICANCE',
    de: {
      description:
        '454 Steht dieser Schalter auf YES, dann wird immer dann, wenn ein SIGNIFLEVEL 454 gesetzt ist und ein spaltenweiser Signifikanztest vorliegt, im BOTTOMTEXT 520 der entsprechende Signifikanztext ausgegeben. Gibt es keinen BOTTOMTEXT, wird einer erzeugt.…',
    },
    en: {
      description:
        '454 If this switch is set to YES, then whenever a SIGNIFLEVEL 454 is set and a column-wise significance test is present, the corresponding significance text is output in the BOTTOMTEXT 520. If there is no BOTTOMTEXT, one is generated.…',
      syntax: '',
    },
  },
  {
    name: 'STOPONFIRSTERROR',
    en: {
      description:
        'YES or NO. Preset: YES. If NO the input stream continues to be interpreted even if errors occur in as far as the parser can synchronise itself again; possibly the subsequent errors will gain the upper hand. It is recommended to produce a LISTFILE in any case in order to log the error and the erroneous input. Stays valid until the next STOPONFIRSTERROR command.…',
    },
  },
  {
    name: 'STOREALPHA',
    de: { description: '', syntax: 'STOREALPHA <varlist> = [ YES | NO ];' },
    en: { description: '', syntax: 'STOREALPHA <varlist> = [ YES | NO ];' },
  },
  {
    name: 'STORELANGUAGE',
    de: { description: '', syntax: 'STORELANGUAGE <sprache> = <filename>;' },
    en: { description: '', syntax: 'STORELANGUAGE <language> = <filename>;' },
  },
  {
    name: 'STORESPSSSUBFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STORETOBASE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STORETOCSV',
    de: {
      description: '',
      syntax:
        'STORETOCSV = [ ALL | <varlist> ];\nDie als <varlist> deklarierten Variablen werden in der Reihenfolge ihrer Angabe in den',
    },
    en: {
      description: '',
      syntax:
        'STORETOCSV = [ ALL | <varlist> ];\nThe variables declared as <varlist> are written in the order given into the',
    },
  },
  {
    name: 'STORETOSPSS',
    de: { description: '', syntax: 'STORETOSPSS = <varlist>;' },
    en: { description: '', syntax: 'STORETOSPSS = <varlist>;' },
  },
  {
    name: 'STRICTINPUTCHECK',
    de: { description: '', syntax: 'STRICTINPUTCHECK = [ YES | NO ];' },
    en: { description: '', syntax: 'STRICTINPUTCHECK = [ YES | NO ];' },
  },
  {
    name: 'STRICTINPUTHECK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STRICTVARLIST',
    de: { description: '', syntax: 'STRICTVARLIST = [ YES | NO ];' },
    en: { description: '', syntax: 'STRICTVARLIST = [ YES | NO ];' },
  },
  {
    name: 'STRIPECOLORS',
    de: {
      description: '',
      syntax:
        "STRIPECOLORS = <color> <color> ;\nMit '<color>' definiert man die Farben, in denen die Zeilen bzw. Spalten in Tabellen vom Typ",
    },
    en: {
      description: '',
      syntax:
        "STRIPECOLORS = <color> <color> ;\nWith '<color>' you define the colours in which the rows or columns in tables of type",
    },
  },
  {
    name: 'STROKERECT',
    de: { description: 'Umrandung zu RETANGLES zeichnen' },
    en: { description: 'Draw a border for RECTANGLES', syntax: '' },
  },
  {
    name: 'STRUCTURE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STYLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'STYLEFILE',
    de: { description: '', syntax: 'STYLEFILE = <filename>;' },
    en: {
      description: '',
      syntax:
        'STYLEFILE = <filename>;\nUsing the STYLEFILE individual CSS styles can be included. The contents of <filename> are included',
    },
  },
  {
    name: 'SUBTITLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SUM',
    argsHint: '( Var )',
    de: {
      description: "Darstellung der Summe von 'Var'",
      syntax: 'SUM <varname> = <Varlist>;',
    },
    en: {
      description: "Display of the sum of 'Var'",
      syntax: 'SUM <varname> = <Varlist>;',
    },
  },
  {
    name: 'SUMMARY',
    en: {
      description:
        'The IF ... PRINT ... command in GESS tabs allows comfortable error searches and documentation. It is however often useful to use statistics for error frequency and SUMMARY tables provide just such statistics:',
      syntax: 'SUMMARY;',
    },
  },
  {
    name: 'SUMMISSING',
    de: {
      description:
        'MIN, MAX 314Minimal-/ Maximalwert + Option zur Angabe der Variable mit Minimal-/Maximalwert mittels MININDEX/ MAXINDEX 314 STDDEV 315 Standardabweichung VARIANCE 315Varianz Mean MEAN erlaubt eine einfache Berechnung des Mittelwerts aus mehreren Variablen innerhalb eines Falles.',
      syntax: 'SUMMISSING = [ YES | NO ];',
    },
    en: {
      description:
        'MIN, MAX 314 minimum/maximum value + option to specify the variable with the minimum/maximum value via MININDEX/ MAXINDEX 314. STDDEV 315 standard deviation. VARIANCE 315 variance. Mean: MEAN allows a simple calculation of the mean from several variables within one case.',
      syntax: 'SUMMISSING = [ YES | NO ];',
    },
  },
  {
    name: 'SUMPERCENT',
    argsHint: '( Var, BasisVar )',
    de: {
      description:
        "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Summe von 'Var' wird als prozentualer Anteil an der Summe von 'BasisVar' ausgegeben.",
    },
    en: {
      description:
        "The sums are calculated from 'Var' and 'BasisVar'. The sum of 'Var' is output as a percentage share of the sum of 'BasisVar'.",
      syntax: '',
    },
  },
  {
    name: 'SUMQUOTIENT',
    argsHint: '( Var, BasisVar )',
    de: {
      description:
        "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Summe von 'Var' wird als Anteil an der Summe von 'BasisVar' ausgegeben.",
    },
    en: {
      description:
        "The sums are calculated from 'Var' and 'BasisVar'. The sum of 'Var' is output as a share of the sum of 'BasisVar'.",
      syntax: '',
    },
  },
  {
    name: 'SUMSUMPERCENT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SUPPRESSEMPTYSHEET',
    de: { description: '', syntax: 'SUPPRESSEMPTYSHEET = [ YES | NO ];' },
    en: { description: '', syntax: 'SUPPRESSEMPTYSHEET = [ YES | NO ];' },
  },
  {
    name: 'SUPPRESSEMPTYTABLE',
    de: {
      description: '',
      syntax: 'SUPPRESSEMPTYTABLE = [ NO | YES | STRUCTURE ];',
    },
    en: {
      description:
        'Usually a table where no cases are relevant is printed as an empty table. Using SUPPRESSEMPTYTABLE = YES this page is suppressed.',
      syntax: 'SUPPRESSEMPTYTABLE = [ NO | YES | STRUCTURE ];',
    },
  },
  {
    name: 'SUPPRESSGRIDLINES',
    de: { description: '', syntax: 'SUPPRESSGRIDLINES : [YES|NO]' },
    en: { description: '', syntax: 'SUPPRESSGRIDLINES : [YES|NO]' },
  },
  {
    name: 'SUPPRESSIFLESS',
    de: {
      description: '',
      syntax:
        'SUPPRESSIFLESS < cellelement> <place> <typ> = <value>;\nplace ::= < DATACELL | FRAMECELL X | FRAMECELL Y >\ntyp ::= < ABSOLUTE | PHYSICALRECORDS | VALIDN | VALIDPHYS | ESS >\nMan kann sich mit "<place>" dabei auf die Tabellenzelle selbst beziehen, oder auf die',
    },
    en: {
      description: '',
      syntax:
        'SUPPRESSIFLESS < cellelement> <place> <type> = <value>;\nplace ::= < DATACELL | FRAMECELL X | FRAMECELL Y >\ntype ::= < ABSOLUTE | PHYSICALRECORDS | VALIDN | VALIDPHYS | ESS >\nWith "<place>" you can refer to the table cell itself, or to the',
    },
  },
  {
    name: 'SUPPRESSLABEL',
    de: {
      description:
        'Wenn eine Variable eine Konstante ist (d.h. sie hat empirisch nur eine Ausprägung), kann es aus optischen Gründen sinnvoll sein, den Labeltext zu unterdrücken. Dies kann man mit SUPPRESSLABEL erreichen. (Hat nur bei Postscript-Ausgabe Effekt.)',
    },
    en: {
      description:
        'If a variable is a constant (i.e. it has empirically only one characteristic), it can make sense for appearances sake to suppress the label text. This can be achieved with SUPPRESSLABEL. (Only effective with Postscript-printouts). (PS)',
    },
  },
  {
    name: 'SUPPRESSOVERCODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SUPPRESSSPSSWARNINGS',
    de: {
      description: '',
      syntax: 'SUPPRESSSPSSWARNINGS = [ ALPHA | VARLABEL | VALUELABELS ] ;',
    },
    en: {
      description: '',
      syntax: 'SUPPRESSSPSSWARNINGS = [ ALPHA | VARLABEL | VALUELABELS ] ;',
    },
  },
  {
    name: 'SUPRESSEMPTYTABLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SWAP',
    de: { description: 'Reihenfolge der graphischen Darstellung invertieren' },
    en: {
      description: 'Invert the order of the graphical display',
      syntax: '',
    },
  },
  {
    name: 'SWAPLEGEND',
    de: {
      description:
        'Reihenfolge der Legendentexte invertieren <alle GESSCHARTFORMAT- Alle Argumente des Argumente> GESSCHARTFORMAT 198-Statements können an dieser Stelle auch als Optionen für das aktuelle Chart angegeben werden. = {',
    },
    en: {
      description:
        'Invert the order of the legend texts. <all GESSCHARTFORMAT arguments> all arguments of the GESSCHARTFORMAT 198 statement can also be given here as options for the current chart. = {',
      syntax: '',
    },
  },
  {
    name: 'SWITCHLANGUAGE',
    de: { description: '', syntax: 'SWITCHLANGUAGE = <Sprachbezeichnung>;' },
    en: { description: '', syntax: 'SWITCHLANGUAGE = <language name>;' },
  },
  {
    name: 'SYMBOL',
    de: { description: 'Die Linie wird nicht gezeigt' },
    en: { description: 'The line is not shown', syntax: '' },
  },
  {
    name: 'SYMBOLS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SYMBOLSIZE',
    de: {
      description:
        '; GESSCHARTFONT CHARTNUMBERS = "Helvetica-Bold" SIZE 8; GESSCHARTFORMAT = NUMCENTERGRAPH NOFRAME NOSCALE OVERLAPPED WHITENUMBERS; GESSCHARTCOLORS = $229955 AA5577; GESSCHART CHARTTITLE "Gegenläufige Linien: Top-2-Box nach links + grün, Bottom-2-Box nach rechts + rot, Zahlen in weiß zentral in den Kreisen bzw.…',
    },
    en: {
      description:
        '; GESSCHARTFONT CHARTNUMBERS = "Helvetica-Bold" SIZE 8; GESSCHARTFORMAT = NUMCENTERGRAPH NOFRAME NOSCALE OVERLAPPED WHITENUMBERS; GESSCHARTCOLORS = $229955 AA5577; GESSCHART CHARTTITLE "Opposing lines: Top-2 box to the left + green, Bottom-2 box to the right + red, numbers in white centred in the circles or…',
      syntax: '',
    },
  },
  {
    name: 'SYMBOLWIDTH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SYNOPSIS',
    de: { description: '', syntax: 'SYNOPSIS = <filename>;' },
    en: { description: '', syntax: 'SYNOPSIS = <filename>;' },
  },
  {
    name: 'SYNTAX',
    de: {
      description: '',
      syntax:
        'SYNTAX { [ POSTPONE ] [ VARIABLES | LABELS | VARTITLE\n| VALUELABELS | MISSING | EXCLUDEVALUES | RESTRICTVALUES|\nMULTIDEF | FORMAT ]}*n = <filename>;\nSYNTAXVARNAMENOQUOTES = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax:
        'SYNTAX { [ POSTPONE ] [ VARIABLES | LABELS | VARTITLE\n| VALUELABELS | MISSING | EXCLUDEVALUES | RESTRICTVALUES|\nMULTIDEF | FORMAT ]}*n = <filename>;\nSYNTAXVARNAMENOQUOTES = [ YES | NO ];',
    },
  },
  {
    name: 'SYNTAXVARNAMENOQUOTES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SYSMISS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SYSTEMCASENO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SYSTEMFILENO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SYSTEMGROUP',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'SYSTEMIN',
    en: {
      description:
        'Output of a system fileto be read. It has to refer to a valid name in the system software. System files are generated with the statement SYSTEMOUT. DATAFILE, COLBININFILE and SYSTEMIN statements can not be used together in a GESS tabs run. The suffix (.TS) is generated automatically.',
    },
  },
  {
    name: 'SYSTEMOUT',
    en: {
      description: '',
      syntax:
        'SYSTEMOUT = <filename> [ [ KEEPVARS | DELETEVARS ] <varlist> ] ;',
    },
  },
  {
    name: 'SYSTEMWEIGHT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TABLE',
    de: {
      description: '',
      syntax:
        'TABLE [ taboptions ] = <parts> BY <parts>;\ntaboptions ::=\n[\nADD\nNAME <tablename>\nTITLE <tabletitle>\nCELLELEMENTS ( <cellelements> )\nFRAMEELEMENTS ( <frameelements> )\nTABLEFORMATS ( <tableformats> )\nCONTENTKEY <contentkey>\nHIDDEN ( <medium> )\n]\n\nparts ::= part { part }*n\npart ::= content [ filter ] [ option ]\n\ncontent ::=\n[\n<constant> |\n<varname> |\n<cellelement> ( <varname> [ <varname> ] ) |\n<cellelement> ( <varname> [ <varname> ] BY <varname> )\n:DESCRIPTION\n:USEVARTITLE\n:FORMAT\n] \n\nfilter ::= FILTER <bedingung> |\n\noption ::= SORT sortcontent [ sortpane ] [ cut ]\n\nsortcontent ::= sorttype [ DESCEND ]\nsorttype ::= [ POSITION | ALPHA | CODE | Cellelement ]\nsortpane ::= PANE <value> CODE <value>\n\ncut ::=\n[\nTOP <value > [ SLICE <value> ] |\nBOTTOM <value> |\nEXTREME <value> |\nSLICE <value> |\nLSLICE <value> |\nRANGE <value> <value>\n]',
    },
    en: {
      description:
        'The main keyword for cross tables. In its simplest form: TABLE = <var1> BY <var2>; where <var1> is the header variable and <var2> is the variable for the side breakdown.',
      syntax:
        'TABLE [ taboptions ] = <parts> BY <parts>;\ntaboptions ::=\n[\nADD\nNAME <tablename>\nTITLE <tabletitle>\nCELLELEMENTS ( <cellelements> )\nFRAMEELEMENTS ( <frameelements> )\nTABLEFORMATS ( <tableformats> )\nCONTENTKEY <contentkey>\nHIDDEN ( <medium> )\n]\n\nparts ::= part { part }*n\npart ::= content [ filter ] [ option ]\n\ncontent ::=\n[\n<constant> |\n<varname> |\n<cellelement> ( <varname> [ <varname> ] ) |\n<cellelement> ( <varname> [ <varname> ] BY <varname> )\n:DESCRIPTION\n:USEVARTITLE\n:FORMAT\n] \n\nfilter ::= FILTER <condition> |\n\noption ::= SORT sortcontent [ sortpane ] [ cut ]\n\nsortcontent ::= sorttype [ DESCEND ]\nsorttype ::= [ POSITION | ALPHA | CODE | Cellelement ]\nsortpane ::= PANE <value> CODE <value>\n\ncut ::=\n[\nTOP <value > [ SLICE <value> ] |\nBOTTOM <value> |\nEXTREME <value> |\nSLICE <value> |\nLSLICE <value> |\nRANGE <value> <value>\n]',
    },
  },
  {
    name: 'TABLE ADD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TABLE SORT AS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TABLE STRUCTURE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TABLEBASE',
    de: { description: '', syntax: 'TABLEBASE = [ CASES | RESPONSES ];' },
    en: {
      description:
        'This controls the basis of percentaging in the TABLE printout. The following is preset: TABLEBASE = CASES ; i.e. usually percentaging is on the basis of the number of interviewees. Using TABLEBASE = NOMINATIONS ; the alternative of percentaging on the basis of the number of mentions can be achieved (only relevant for multiple responses).…',
      syntax: 'TABLEBASE = [ CASES | RESPONSES ];',
    },
  },
  {
    name: 'TABLECOUNTSWITCH',
    de: {
      description: '',
      syntax:
        'TABLECOUNTSWITCH = [ NOADDINFRAMEX | NOADDINFRAMEY | NOADDINFRAMETTL ];',
    },
    en: {
      description: '',
      syntax:
        'TABLECOUNTSWITCH = [ NOADDINFRAMEX | NOADDINFRAMEY | NOADDINFRAMETTL ];',
    },
  },
  {
    name: 'TABLEFILTER',
    de: {
      description: '',
      syntax: 'TABLEFILTER <number> = TEXT "<text>" <Bedingung>;',
    },
    en: {
      description: '',
      syntax: 'TABLEFILTER <number> = TEXT "<text>" <condition>;',
    },
  },
  {
    name: 'TABLEFILTERBYCODE',
    de: {
      description: '',
      syntax:
        'TABLEFILTERBYCODE <NUMBER> = [ <options> ] <VARIABLE> ( <CODE> ) ;\n<options> ::= [ VARTITLE | NOMISSING | SUPPRESSOVERCODES | USELABELS ] <options>',
    },
    en: {
      description: '',
      syntax:
        'TABLEFILTERBYCODE <NUMBER> = [ <options> ] <VARIABLE> ( <CODE> ) ;\n<options> ::= [ VARTITLE | NOMISSING | SUPPRESSOVERCODES | USELABELS ] <options>',
    },
  },
  {
    name: 'TABLEFORMAT',
    de: { description: '', syntax: 'TABLEFORMAT +/- AUTOSORTTREE;' },
    en: {
      description:
        'The table appearance can further be controlled using TABLEFORMAT.',
      syntax: 'TABLEFORMAT = [ + | - | ] { Formatoption ... }*n ;',
    },
  },
  {
    name: 'TABLEFORMATS',
    argsHint: '( <tableformats> )',
    de: {
      description:
        'CONTENTKEY <text> ] rowdescriptor ::= [ VARIABLE <localvarname> [ <sortoptions> [ : <condition> ] | OVERCODE <localvarname> [ <values> ] <labeltext> | STATISTICS <text> <cellelement> ( <localvarname> ) [ <printoptions> ] ] sortoptions ::= siehe die SORT Optionen des TABLE-statements condition ::= jede nach GESS Syntax korrekte Bedingung printoptions ::= [ : USEFONT <fontname> [ SIZE <size> ] | :…',
    },
    en: {
      description:
        'CONTENTKEY <contentkey> ] parts ::= part { part }*n part ::= content [ filter ] [ option ] content ::= [ <constant> | <varname> | <cellelement> ( <varname> [ <varname> ) | <cellelement> ( <varname> [ <varname> ] BY <varname> ) ] filter ::= FILTER <bedingung> | option ::= SORT sortcontent [ sortpane ] [ cut ] sortcontent ::= [ DESCEND ] sorttype sortpane ::= PANE <value> CODE <value> cut ::= [ TOP…',
    },
  },
  {
    name: 'TABLEMINIMUM',
    en: { description: '', syntax: 'TABLEMINIMUM = <number>;' },
  },
  {
    name: 'TABLENUMBER',
    de: {
      description:
        'Definiert die Anfangsnummer einer Tabellennumerierungsfolge.',
      syntax: 'TABLENUMBER = <number>;\nVoreinstellung: TABLENUMBER = 1;',
    },
    en: {
      description:
        'Defines the first number for the tables. Preset: TABLENUMBER = 1; All tables share the same number range. The tables are only counted if there is a hash in the TABLETITLE. This is valid for all tables until changed.',
      syntax: 'TABLENUMBER = <number>;\nDefault: TABLENUMBER = 1;',
    },
  },
  {
    name: 'TABLESASJSON',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TABLESTATISTICS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TABLETITLE',
    de: { description: '', syntax: 'TABLETITLE = "<text>";' },
    en: {
      description:
        'If the standard text "Table #:" is to be replaced it can be done as follows: TABLETITLE = "Summary Table"; If the test is not to appear at all, then: TABLETITLE = ""; If the program finds a hash "#" (more precisely: the NUMBERCHAR) in the string this character is replaced by the current table number. This is valid for all tables until it is changed.',
      syntax: 'TABLETITLE = "<text>";',
    },
  },
  {
    name: 'TABLETITLEINHG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TABLETYPE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TABSELECT',
    de: { description: '', syntax: 'TABSELECT <Bedingung>;' },
    en: {
      description:
        'defines a selection of cases for the following tables. TABSELECT remains valid until a new TABSELECT is defined. Should all cases be processed in the following tables then simply: TABSELECT; is written. (This condition is always true.) The syntax equates to SELECT (non permanent filter).…',
      syntax: 'TABSELECT <condition>;',
    },
  },
  {
    name: 'TABSELECTBYCODE',
    de: {
      description: '',
      syntax:
        'TABSELECTBYCODE [ <options> ] <VARIABLE> ( <CODE> );\n<options> ::= [ VARTITLE | NOMISSING | SUPPRESSOVERCODES\n| USELABELS ] <options>',
    },
    en: {
      description: '',
      syntax:
        'TABSELECTBYCODE [ <options> ] <VARIABLE> ( <CODE> );\n<options> ::= [ VARTITLE | NOMISSING | SUPPRESSOVERCODES\n| USELABELS ] <options>',
    },
  },
  {
    name: 'TABTASK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TABULATE',
    de: {
      description: '',
      syntax:
        'TABULATE [ INVERSE ] = <tablepart> { / <tablepart> }*n;\nHEADERS = <tablepart> { / <tablepart> }*n;\nAlle Elemente aus TABULATE werden gegen alle Köpfe in HEADERS tabelliert; dabei erscheinen',
    },
    en: {
      description: '',
      syntax: 'TABULATE [ INVERSE ] = <tablepart> { / <tablepart> }*n;',
    },
  },
  {
    name: 'TABULATOR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TAN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TAPI',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TAUB',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TAUC',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TEMPLATE',
    en: { description: '', syntax: 'TEMPLATE = <templatename>;' },
  },
  {
    name: 'TERMINATED',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TESTCOLUMNS',
    de: {
      description: '',
      syntax:
        'TESTCOLUMNS = { Testdefinition }*n;\nTestdefinition ::= | VARIABLE <varno> CODE <code>\n: VARIABLE <varno> CODE <code>',
    },
    en: {
      description: '',
      syntax:
        'TESTCOLUMNS = { test definition }*n;\ntest definition ::= | VARIABLE <varno> CODE <code>\n: VARIABLE <varno> CODE <code>',
    },
  },
  {
    name: 'TESTCOLUMNSX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TEXT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TEXTBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TEXTBOXFORMAT',
    de: {
      description:
        'Dieses TABLEFORMAT schaltet die Funktionen des LOCALTEXTFORMAT 564s ein/aus.',
    },
    en: {
      description:
        'This TABLEFORMAT switches the functions of LOCALTEXTFORMAT 564 on/off.',
      syntax: '',
    },
  },
  {
    name: 'TEXTBOXINHG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TEXTROWHEIGHT',
    de: {
      description: '',
      syntax: 'TEXTROWHEIGHT <box> : <pixels>\n<box> ::= eine Box',
    },
    en: {
      description: '',
      syntax: 'TEXTROWHEIGHT <box> : <pixels>\n<box> ::= a box',
    },
  },
  {
    name: 'TEXTTABLE',
    de: { description: '', syntax: 'TEXTTABLE;' },
    en: { description: '', syntax: 'TEXTTABLE ;' },
  },
  {
    name: 'TEXTTOPDISTANCE',
    de: {
      description: '',
      syntax: "TEXTTOPDISTANCE = <number>;\n'<number>' = typographische Punkte",
    },
    en: {
      description: '',
      syntax: "TEXTTOPDISTANCE = <number>;\n'<number>' = typographic points",
    },
  },
  {
    name: 'TEXTTOSPSSVARLAB',
    de: { description: '', syntax: 'TEXTTOSPSSVARLAB = [ YES | NO ];' },
    en: { description: '', syntax: 'TEXTTOSPSSVARLAB = [ YES | NO ];' },
  },
  {
    name: 'TEXTWRAP',
    de: {
      description:
        'Im Standardfall werden die Texte von Variablen in Tabellen genauso ausgegeben, wie man sie definiert hat. Mit TEXTWRAP kann man anfordern, dass die Zeilen in den Textboxes umgebrochen werden.',
    },
    en: {
      description:
        'Usually the variable texts are presented exactly as they have been defined. TEXTWRAP is used to break up the lines in text boxes.',
    },
  },
  {
    name: 'THEN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'THICK',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'THIN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'THOUSANDS',
    de: { description: '', syntax: 'THOUSANDS <cellelement> : [ YES | NO ]' },
    en: { description: '', syntax: 'THOUSANDS <cellelement> : [ YES | NO ]' },
  },
  {
    name: 'TIME',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TIMER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TITLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TITLEBOX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TITLEPAGE',
    de: {
      description: '',
      syntax:
        'TITLEPAGE ::= { | element }*n ;\nCHAPTERPAGE::= { | element }*n ;\nelement ::= { text | line | drawbox | titlebox | eps }\ntext ::= TEXT { textoption }*n x y <text>\ntextoption ::= : [ font | color ]\nfont ::= USEFONT <fontname> SIZE <number>',
    },
    en: {
      description: '',
      syntax:
        'TITLEPAGE ::= { | element }*n ;\nCHAPTERPAGE::= { | element }*n ;\nelement ::= { text | line | drawbox | titlebox | eps }\ntext ::= TEXT { textoption }*n x y <text>\ntextoption ::= : [ font | color ]\nfont ::= USEFONT <fontname> SIZE <number>',
    },
  },
  {
    name: 'TO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TOP',
    de: {
      description:
        'Die Tabellenausgabe kann auf bestimmte Teile beschränkt werden: Es können',
    },
    en: {
      description:
        'The table output can be restricted to certain parts: it is possible to',
      syntax: '',
    },
  },
  {
    name: 'TOPCUT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TOPMARGIN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TOPTEXT',
    de: {
      description: 'Textbox am oberen Rumpf der Tabelle',
      syntax: 'TOPTEXT = "<text>";',
    },
    en: {
      description: 'Text box at the top of the table body',
      syntax: 'TOPTEXT = "<text>";',
    },
  },
  {
    name: 'TOTALCOLINHG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TOTALCOLU',
    de: {
      description:
        'Ausgewertete Fälle aller Werte (wie in CELLELELEMENTS 418 definiert) in der',
    },
    en: {
      description:
        'Evaluated cases of all values (as defined in CELLELEMENTS 418) in the',
      syntax: '',
    },
  },
  {
    name: 'TOTALCOLUMN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TOTALCOLUMNTABLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TOTALPERCENT',
    de: {
      description: 'Prozentuierung aller Zellen auf das Tabellen- Gesamt-N.',
    },
    en: {
      description: "Percentaging of all cells on the table's total N.",
      syntax: '',
    },
  },
  {
    name: 'TOTALPERCSTDERR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TOTALROW',
    de: {
      description:
        'Ausgewertete Fälle aller Werte (wie in CELLELELEMENTS 418 definiert) in der Zeile Beispiel: FRAMEELEMENTS = ABSCOLUMN ABSROW TOTALCOLUMN; Mit FRAMEELEMENTS =; CELLELEMENTS = ABSOLUTE; wird z.B. eine Tabelle erzeugt, die zwar die absoluten Häufigkeiten in den Zellen zeigt, die aber keinerlei Randverteilungen enthält.…',
    },
    en: {
      description:
        'ABSROW and ABSCOLUMN stand for rows (ROW) or columns (COLUMN) with absolute values of the cases or punches where relevant after weighting. PHYSICALROW or PHYSICALCOLUMN refer to the physical case number, i.e. without weighting. In TOTALROW or TOTALCOLUMN all the values for all the cases evaluated are printed as they have been defined in CELLELEMENTS. Example:…',
    },
  },
  {
    name: 'TOTALROWINHG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TOTALSUMPERCENT',
    argsHint: '( Var )',
    de: {
      description:
        'Ausgabe der Prozentuierung der Summe einer dritten Variablen auf die Gesamtsumme in der Tabelle',
    },
    en: {
      description:
        'Output of the percentaging of the sum of a third variable on the total sum in the table',
      syntax: '',
    },
  },
  {
    name: 'TOTALTITLE',
    de: {
      description: 'Bezeichnung der Totalspalte-/zeile',
      syntax: 'TOTALTITLE [ X | Y ] = "<text>";',
    },
    en: {
      description:
        'If the standard text "Insgesamt" is to be replaced then: TOTALTITLE = Total; The TOTALTITLE can be set differently for the X or Y axes: Example: TOTALTITLE X = "Total"; TOTALTITLE Y = "Insgesamt"; This is valid for all tables until changed.',
      syntax: 'TOTALTITLE [ X | Y ] = "<text>";',
    },
  },
  {
    name: 'TRANSFERSUPPRESSEDCONTENTKEY',
    de: {
      description: '',
      syntax: 'TRANSFERSUPPRESSEDCONTENTKEY = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'TRANSFERSUPPRESSEDCONTENTKEY = [ YES | NO ];',
    },
  },
  {
    name: 'TRANSLATE',
    de: {
      description:
        '| TRANSLATE |                          | <postcriptfontname> |     |     | :   | <excelfontname> |     |     |     |     |     |     | | --------- | ------------------------ | ------------------- | --- | --- | --- | --------------- | --- | --- | --- | --- | --- | --- | | [OPTION   | [BOLD|ITALIC|UNDERLINE]] |                     |     |     |     |                 |     |     |     |     |     |…',
      syntax:
        'TRANSLATE <postcriptfontname> : <excelfontname>\n[OPTION [BOLD|ITALIC|UNDERLINE]]',
    },
    en: {
      description:
        '| TRANSLATE |                          | <postcriptfontname> |     |     | :   | <excelfontname> |     |     |     |     |     |     | | --------- | ------------------------ | ------------------- | --- | --- | --- | --------------- | --- | --- | --- | --- | --- | --- | | [OPTION   | [BOLD|ITALIC|UNDERLINE]] |                     |     |     |     |                 |     |     |     |     |     |…',
      syntax:
        'TRANSLATE <postcriptfontname> : <excelfontname>\n[OPTION [BOLD|ITALIC|UNDERLINE]]',
    },
  },
  {
    name: 'TRIANGLE1',
    de: {
      description:
        'Skalenwert mit einem Dreieck markieren (auf der Basis stehend)',
    },
    en: {
      description:
        'Mark the scale value with a triangle (standing on its base)',
      syntax: '',
    },
  },
  {
    name: 'TRIANGLE1O',
    de: { description: 'Dreieck (auf der Basis stehend) als Outline' },
    en: {
      description: 'Triangle (standing on its base) as outline',
      syntax: '',
    },
  },
  {
    name: 'TRIANGLE2',
    de: {
      description:
        'Skalenwert mit einem Dreieck markieren (auf der Spitze stehend)',
    },
    en: {
      description:
        'Mark the scale value with a triangle (standing on its point)',
      syntax: '',
    },
  },
  {
    name: 'TRIANGLE2O',
    de: { description: 'Dreieck (auf der Spitze stehend) als Outline' },
    en: {
      description: 'Triangle (standing on its point) as outline',
      syntax: '',
    },
  },
  {
    name: 'TRIMSTRINGS',
    de: { description: '', syntax: 'TRIMSTRINGS = [ YES | NO ];' },
    en: { description: '', syntax: 'TRIMSTRINGS = [ YES | NO ];' },
  },
  {
    name: 'TROWTEST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TRUNC',
    de: {
      description:
        'Vor der Berechnung werden beide Argumente mittels TRUNC in Ganze Werte gewandelt. D.h.',
    },
    en: {
      description:
        'Before the calculation, both arguments are converted to whole numbers via TRUNC. That is,',
      syntax: '',
    },
  },
  {
    name: 'TRUNCATEDECIMALS',
    de: {
      description: '',
      syntax: 'TRUNCATEDECIMALS <varlist> = <number>;\n<number> ::= -9 .. 9;',
    },
    en: {
      description: '',
      syntax: 'TRUNCATEDECIMALS <varlist> = <number>;\n<number> ::= -9 .. 9;',
    },
  },
  {
    name: 'TRYCOUNT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TRYCOUNTCODE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TTEST',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwertunterschiede auf Basis der gewichteten Daten, spaltenweise Name Beschreibung',
    },
    en: {
      description:
        'Independent t-test (per column) MEANTEST ROWMEANTEST Printing of mean value and t-test per column in one Printing of mean value and t-test per row in one cell. cell.',
      syntax: 'TTEST = [ INDEPENDENT ]\nTTESTINDEX <number>',
    },
  },
  {
    name: 'TTESTABSMIN',
    de: {
      description: '',
      syntax: 'TTESTABSMIN = <number>;\nTTESTPHYSMIN = <number>;',
    },
    en: {
      description: '',
      syntax: 'TTESTABSMIN = <number>;\nTTESTPHYSMIN = <number>;',
    },
  },
  {
    name: 'TTESTCUT',
    argsHint: '( Var )',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwertsunterschiede, berechnet auf Basis der Datenreduktion wie bei MEANCUT 423',
    },
    en: {
      description:
        'Independent t-test on mean differences, computed on the basis of the data reduction as with MEANCUT 423',
      syntax: '',
    },
  },
  {
    name: 'TTESTGREATERCHAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TTESTHEADERS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TTESTINCOMPARE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TTESTINDEX',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TTESTLESSCHAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TTESTPHYSMIN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'TWOCAMEMBERTS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'UNDEFINED',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'UNDERLINE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'UNITS',
    de: { description: '', syntax: 'UNITS = [ MM | POINTS | INCH ];' },
    en: { description: '', syntax: 'UNITS = [ MM | POINTS | INCH ];' },
  },
  {
    name: 'UNIXTIME',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'UPDATEINVERT',
    de: { description: '', syntax: 'UPDATEINVERT;' },
    en: { description: '', syntax: 'UPDATEINVERT;' },
  },
  {
    name: 'UPPERCASE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USE3D',
    de: { description: '', syntax: 'USE3D : [YES | NO]' },
    en: { description: '', syntax: 'USE3D : [YES | NO]' },
  },
  {
    name: 'USECASES',
    de: {
      description: '',
      syntax:
        'USECASES = [ ANYCASE | XANDYVALID | XORYVALID | XVALID | YVALID ] ;',
    },
    en: {
      description:
        'USECASES controls the treatment of MISSING values in cross tables. Usually the rows and columns of cross tables are suppressed if either no VALUELABEL has been defined or if the relevant characteristic in a MISSING command has been declared a MISSING value, or if a characteristic is recognised as a MISSING value due to explicit coding (see MISSINGCHAR).…',
      syntax:
        'USECASES = [ ANYCASE | XANDYVALID | XORYVALID | XVALID | YVALID ] ;',
    },
  },
  {
    name: 'USECOLMAPFILE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USEEPS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USEFILTER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USEFONT',
    de: {
      description:
        'Der zu verwendende Font LEFT | RIGHT | HCENTER Horizontale Ausrichtung des Textes TOP | BOTTOM | VCENTER Vertikale Ausrichtung des Textes Jede dieser Optionen hat eine eigene Syntax: Nach einer USEFONT-Option z.B. müssen Name und Größe eines gültigen Fonts stehen, nach dem Schlüsselwort LINEWIDTH muss zwingend eine Zahl stehen usw..…',
      syntax:
        'USEFONT <Zielname> = <Fontname> SIZE <number>; (PS)\nUSEFONT <Zielname> = <Fontname>; (Non-PS)',
    },
    en: {
      description:
        'The font to be used. LEFT | RIGHT | HCENTER horizontal alignment of the text. TOP | BOTTOM | VCENTER vertical alignment of the text. Each of these options has its own syntax: after a USEFONT option, for example, the name and size of a valid font must follow; after the keyword LINEWIDTH a number must necessarily follow, etc.…',
      syntax:
        'USEFONT <targetname> = <fontname> SIZE <number>; (PS)\nUSEFONT <targetname> = <fontname>; (Non-PS)',
    },
  },
  {
    name: 'USEFORMATINHG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USELABELS',
    de: {
      description:
        "unterdrückt Werte von '<code>', denen kein Labeltext entspricht",
    },
    en: {
      description:
        'Using COPYLABELS and USELABELS variables can be allocated the VALUELABELS of other variables.',
    },
  },
  {
    name: 'USEMISSING',
    de: {
      description: '',
      syntax:
        'USEMISSING = [ YES | NO ];\nVoreinstellung: USEMISSING = NO;\nDurch USEMISSING = YES; kann für alle folgenden Tabellen die Auswertung auch der',
    },
    en: {
      description:
        'steers the evaluation of MISSING characteristics in TABLE and COMPARE. USEMISSING = NO; is the preset; using USEMISSING = YES; the MISSING values can be called up for the evaluation of the following tables.',
      syntax:
        'USEMISSING = [ YES | NO ];\nDefault: USEMISSING = NO;\nWith USEMISSING = YES; the evaluation of the missing values as well can be enabled for all following tables',
    },
  },
  {
    name: 'USEOPENASCODE',
    de: {
      description: '',
      syntax:
        'USEOPENASCODE <varlist> = [ YES | NO ];\nSteht dieser Schalter auf YES, dann wird versucht, die offene Antwort für die in <varlist>',
    },
    en: {
      description: '',
      syntax:
        'USEOPENASCODE <varlist> = [ YES | NO ];\nIf this switch is set to YES, an attempt is made to use the open answer for the variables in <varlist>',
    },
  },
  {
    name: 'USEPOSTSCRIPTALIGN',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USEPOSTSCRIPTCOLORS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USEPOSTSCRIPTFONT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USEPRINTERCOLORS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USERAWSFORSTATS',
    en: { description: '', syntax: 'USERAWSFORSTATS = [ YES | NO ] ;' },
  },
  {
    name: 'USESCASES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USESELECT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USEVARIABLES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USEVARTITLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USEVISIBLEDIGITSNONLY',
    de: { description: '', syntax: 'USEVISIBLEDIGITSNONLY = [ YES | NO ];' },
    en: { description: '', syntax: 'USEVISIBLEDIGITSNONLY = [ YES | NO ];' },
  },
  {
    name: 'USEVISIBLEDIGITSONLY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'USEWEIGHT',
    de: { description: '', syntax: 'USEWEIGHT = [ YES | NO | <varname> ] ;' },
    en: { description: '', syntax: 'USEWEIGHT = [ YES | NO | <varname> ] ;' },
  },
  {
    name: 'UTF16BE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'UTF16LE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'UTF8',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VALID',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VALIDN',
    de: {
      description:
        "Zahl der Fälle, für die ein gültiger Wert der '<bestehende_variable>' gefunden wurde",
    },
    en: {
      description:
        "Number of cases for which a valid value of '<existing_variable>' was found",
      syntax: '',
    },
  },
  {
    name: 'VALIDPHYS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VALUE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VALUELABEL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VALUELABELS',
    de: {
      description:
        'ein Fehler ausgegeben, wenn man Syntaxvarianten ohne explizite Variablennennung benutzt. Zum Beispiel: COMPUTE f222 = Q17_1; VARTITLE = "ehemals Q17_1"; Das \'=\' hinter VARTITLE würde die Fehlermeldung auslösen. Zum Hintergrund: Anweisungen wie z.B. RECODE 7:88 = 4;stehen oft nach einem COMPUTE, das die zu rekodierende Variable erzeugen soll.…',
      syntax:
        'VALUELABELS <VarList> =\n{<number> "Text"}*n\n;\nLABELS <VarList> =\n{<number> "Text"}*n\n;',
    },
    en: {
      description:
        'an error is output if you use syntax variants without an explicit variable name. For example: COMPUTE f222 = Q17_1; VARTITLE = "formerly Q17_1"; The \'=\' after VARTITLE would trigger the error message. Background: instructions such as RECODE 7:88 = 4; often come after a COMPUTE that is meant to create the variable to be recoded.…',
      syntax:
        'VALUELABELS <VarList> = [ ADD ]\n{ LabelEntry }*n ;\nLabelEntry ::=\n[<number> "String" | OVERCODE [ SUM ] [<name>] { <number> [ :<number>\n] }*n "String" ] [ LabelOption ]\nLabelOption ::=',
    },
  },
  {
    name: 'VALUELABELS AS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VALUELABELS COPY',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VARFAMILY',
    de: {
      description: '',
      syntax:
        'VARFAMILY = <varlist>;\n"<varlist>" ist eine Liste von atomaren Variablen.',
    },
    en: {
      description:
        'A family is a group of variables with a shared amount of characteristics, e.g. the first, second and third response to a question. These variables can be made into a VARFAMILY which is evaluated instead of the individual variables. Example: VARFAMILY item = item1 TO item4; TABLE = item BY alter; The VARFAMILY automatically has the same VALUELABELs as the first variable used in it.…',
      syntax:
        'VARFAMILY = <varlist>;\n"<varlist>" is a list of atomic variables.',
    },
  },
  {
    name: 'VARGROUP',
    de: {
      description: '',
      syntax:
        'VARGROUP <name> = ( <varlist> ) EQ <valuelist>;\n<varlist> ::= Liste von atomaren Variablen\n<valuelist> ::= Liste von Einzelwerten',
    },
    en: {
      description:
        'defines a group of variables which are to be evaluated together. Usually VARGROUP is used to group individual variables which build a 0/1 group of multi-responses together. Example: VARGROUP Items = ( item.1 item.2 item.3 item.4 ) EQ 1; In front of the equals sign there is the name of the variable group.…',
      syntax:
        'VARGROUP <name> = ( <varlist> ) EQ <valuelist>;\n<varlist> ::= list of atomic variables\n<valuelist> ::= list of individual values',
    },
  },
  {
    name: 'VARIABLE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VARIABLES',
    de: {
      description: '',
      syntax:
        'VARIABLES <varname><varnumberstart> TO <varname><varnumberend>\n= [ start | * ] [width];',
    },
    en: {
      description:
        'Using the VARIABLES statement a series of variables can be generated which are stored together in the data set:',
      syntax:
        'VARIABLES <varname><varnumberstart> TO <varname><varnumberend> = [\nstart | * ] [width];',
    },
  },
  {
    name: 'VARIANCE',
    de: { description: '', syntax: 'VARIANCE <varname> = <varlist>;' },
    en: { description: '', syntax: 'VARIANCE <varname> = <varlist>;' },
  },
  {
    name: 'VARIATION',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VARKEY',
    de: { description: '', syntax: 'VARKEY <varname> = <key>;' },
    en: { description: '', syntax: 'VARKEY <varname> = <key>;' },
  },
  {
    name: 'VARLABELS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VARLIST',
    de: { description: '', syntax: 'VARLIST = <dateipfad> QST;' },
    en: { description: '', syntax: 'VARLIST = <filepath> QST;' },
  },
  {
    name: 'VARNAME',
    en: {
      description:
        'defines a variable and its position in the DATAFILE if necessary in the COPYFILE or also in the COLBININFILE. If a variable in a particular "row" is to be referred to then it is preceded by the key word CARD or COLBININCARD (see below). Example: VARNAME = Alter 101 1; Age is coded in column 101, length = 1. Example: CARD = 3; VARNAME = ITEM37 44 2; ITEM37 is coded in column 44-45 of card 3.…',
    },
  },
  {
    name: 'VARNAMEXINHG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VARNAMEYINHG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VARSTOCASES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VARTEXT',
    de: {
      description:
        'Variablentext 209, typischerweise der Frage- oder Erläuterungstext Wird üblicherweise mit einer CITE[...]-Anweisung im TOPTEXT 516 angefordert (siehe Anzeige von Variablentexten 523).',
      syntax: 'VARTEXT [<VarList>] = "text";\nTEXT [<VarList>] = "text";',
    },
    en: {
      description:
        'Variable text 209, typically the question or explanation text. Usually requested with a CITE[...] instruction in the TOPTEXT 516 (see Display of variable texts 523).',
      syntax: 'VARTEXT <VarList> = "text text ";',
    },
  },
  {
    name: 'VARTITLE',
    de: {
      description:
        'schreibt den VARTITLE vor den Labeltext Beispiel: TABSELECTBYCODE VARTITLE buland( 1 ) ; In diesem fall wird in der Selektionsbeschreibung vor dem Labeltext der VARTITLE ausgegeben.',
      syntax: 'VARTITLE [<VarList>] = "text";\nTITLE [<VarList>] = "text";',
    },
    en: {
      description:
        'writes the VARTITLE in front of the label text. Example: TABSELECTBYCODE VARTITLE buland( 1 ) ; In this case the VARTITLE is output in front of the label text in the selection description.',
      syntax: 'VARTITLE <VarList> = "String";',
    },
  },
  {
    name: 'VARTITLE X',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VARTITLE Y',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VCENTER',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VERBOSELOG',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VERTICAL',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VERTICALALIGN',
    de: {
      description: '',
      syntax:
        'VERTICALALIGN <boxtype> : [TOP|VCENTER|BOTTOM]\nHORIZONTALALIGN <boxtype> : [LEFT|HCENTER|RIGHT]',
    },
    en: {
      description: '',
      syntax:
        'VERTICALALIGN <boxtype> : [TOP|VCENTER|BOTTOM]\nHORIZONTALALIGN <boxtype> : [LEFT|HCENTER|RIGHT]',
    },
  },
  {
    name: 'VIA',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VIRGINSTART',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VOTECOUNTS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VOTES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'VT420TENOVIS',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'WEEKOFYEAR',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'WEIGHT',
    de: {
      description: '',
      syntax: 'WEIGHT = <startcolumn> <width>;\nWEIGHT = <variablenname>;',
    },
    en: {
      description:
        'discloses where an externally calculated weight is in the data set: Example: WEIGHT = 62 6; (weight is in column 62, Len=6) Alternatively a known variable can be named: ... COMPUTE gewicht = ( a + c ) * 0.1; WEIGHT = Gewicht; ... Here it should be noted that the command WEIGHT= is carried out in the RunTime-Module directly before the case is fed into the tables i.e.…',
      syntax: 'WEIGHT = <startcolumn> <width>;\nWEIGHT = <variable name>;',
    },
  },
  {
    name: 'WEIGHTACCURACY',
    de: { description: '', syntax: 'WEIGHTACCURACY = <number>;' },
    en: {
      description:
        'Defines the accuracy bound up to which iteration should occur. WEIGHTACCURACY is the natural logarithm of the maximum deviance of a weighting cell from the prerequisite as factor. Preset: WEIGHTACCURACY = 0.0001;',
      syntax: 'WEIGHTACCURACY = <number>;',
    },
  },
  {
    name: 'WEIGHTCELLS',
    de: {
      description: '',
      syntax:
        'WEIGHTCELLS [ AUTOALIGN ] <varname> = { <code> : <sollwert> % }*n\n[ MISSING : <code> : <sollwert> %]\n;',
    },
    en: {
      description:
        'Requests weighting according to the variable characteristics. As soon as at least one WEIGHTCELLS statement is found in the source text the program carries out an additional reading run of the data in which the weight factors are calculated. If there are more than one WEIGHTCELLS statement present iterative weighting continues until all the weighting conditions have been fulfilled.…',
      syntax:
        'WEIGHTCELLS [ AUTOALIGN ] <varname> =\n{ <code> : <sollwert> % }*n\n[ MISSING : <code> : <sollwert> %\n;',
    },
  },
  {
    name: 'WEIGHTEND',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'WEIGHTOUT',
    de: { description: '', syntax: 'WEIGHTOUT = <startcolumn> <width>;' },
    en: {
      description:
        'defines where a newly calculated weight is to be stored in the outfile. Syntax as above. Example: WEIGHTOUT = 68 6;',
      syntax: 'WEIGHTOUT = <startcolumn> <width>;',
    },
  },
  {
    name: 'WEIGHTSUM',
    de: { description: '', syntax: 'WEIGHTSUM = <number>;' },
    en: {
      description:
        'States the desired sum of the weights to be calculated. Normally weighting occurs to the number of the cases physically read.',
      syntax: 'WEIGHTSUM = <number>;',
    },
  },
  {
    name: 'WELCHTEST',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwerteunterschiede nach Welch 450 auf Basis der gewichteten Daten',
    },
    en: {
      description:
        'Independent t-test on mean differences per Welch 450 on the basis of the weighted data',
      syntax: '',
    },
  },
  {
    name: 'WHILEBLOCK',
    de: { description: '', syntax: 'WHILEBLOCK <bedingung> DO' },
    en: { description: '', syntax: 'WHILEBLOCK <condition> DO' },
  },
  {
    name: 'WHILEBLOCK DO',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'WHITELIST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'WHITENUMBERS',
    de: {
      description:
        '= | FORM LINE FORM CIRCLE SYMBOLSIZE 12 ROWS 1:11 COLUMNS 1:5 ; Mit folgendem Output: GESStsabsArtist-Grafik auf Basis der Mittelwerte aus der OVERVIEW-Tabelle [X]Overview Add ähnlich wie TABLE ADD 390 kann man mit OVERVIEW ADD 406 und XOVERVIEW ADD 409 die Daten aus mehreren Vorlagen einfach in eine Tabelle integrieren. Overview Add Ein Beispiel:…',
    },
    en: {
      description:
        '= | FORM LINE FORM CIRCLE SYMBOLSIZE 12 ROWS 1:11 COLUMNS 1:5 ; With the following output: GESStabs Artist graphic based on the means from the OVERVIEW table. [X]Overview Add: similar to TABLE ADD 390, with OVERVIEW ADD 406 and XOVERVIEW ADD 409 you can easily integrate the data from several templates into one table. Overview Add: an example:…',
      syntax: '',
    },
  },
  {
    name: 'WIDTH',
    de: { description: 'Die Breite der TITLEBOX' },
    en: { description: 'The width of the TITLEBOX', syntax: '' },
  },
  {
    name: 'WITH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'WORDSPLITS',
    de: { description: '', syntax: 'WORDSPLITS= [ <filename> | "" ];' },
    en: { description: '', syntax: 'WORDSPLITS= [ <filename> | "" ];' },
  },
  {
    name: 'WRAPTEXT',
    de: { description: '', syntax: 'WRAPTEXT <boxtype> : [YES|NO]' },
    en: { description: '', syntax: 'WRAPTEXT <boxtype> : [YES|NO]' },
  },
  {
    name: 'WRITESIGNALFILE',
    de: { description: '', syntax: 'WRITESIGNALFILE = [ YES | NO ];' },
    en: { description: '', syntax: 'WRITESIGNALFILE = [ YES | NO ];' },
  },
  {
    name: 'X',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'XANDYVALID',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'XCOLCHIQU',
    de: {
      description:
        'Spaltenweise 4-Felder Chiquadrat-Test auf Prozentwertunterschiede (gewichtet und ungewichtet)',
    },
    en: {
      description:
        'Column-wise 4-field chi-square test on percentage differences (weighted and unweighted)',
      syntax: '',
    },
  },
  {
    name: 'XCOLDEPTTEST',
    argsHint: '( Var )',
    de: {
      description:
        'Abhängiger t-Test auf Mittelwertsunterschiede (gewichtet und ungewichtet)',
    },
    en: {
      description:
        'Dependent t-test on mean differences (weighted and unweighted)',
      syntax: '',
    },
  },
  {
    name: 'XCOMPARE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'XGC',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'XLABELSIGNCHARBOX',
    de: { description: '', syntax: 'XLABELSIGNCHARBOX LABELS X : [YES|NO]' },
    en: { description: '', syntax: 'XLABELSIGNCHARBOX LABELS X : [YES|NO]' },
  },
  {
    name: 'XMCNEMAR',
    de: {
      description:
        'Abhängiger Test auf Prozentwertunterschied (gewichtet und ungewichtet) nach McNemar 449',
    },
    en: {
      description:
        'Dependent test on percentage differences (weighted and unweighted) per McNemar 449',
      syntax: '',
    },
  },
  {
    name: 'XMEANCOLDEPT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'XMEANTEST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'XMEANWELCH',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'XORYVALID',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'XOVERVIEW',
    de: {
      description: '',
      syntax:
        'XOVERVIEW <tableoptions> =\n<cellelementlist>( <varlist> ) [ SORT <cellelement>\n[ DESCEND ] [ PANE <number> CODE <number> ] ] BY <kopf>;\n<varlist> ::= { <variable [ <varoption> ] }*n\n<varoption> ::=\n[ SORTCLASS <number> ]',
    },
    en: {
      description: '',
      syntax:
        'XOVERVIEW <tableoptions> =\n<cellelementlist>( <varlist> ) [ SORT <cellelement>\n[ DESCEND ] [ PANE <number> CODE <number> ] ] BY <header>;\n<varlist> ::= { <variable [ <varoption> ] }*n\n<varoption> ::=\n[ SORTCLASS <number> ]',
    },
  },
  {
    name: 'XOVERVIEW ADD',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'XROWCHIQU',
    de: {
      description:
        'Zeilenweise 4-Felder Chiquadrat-Test auf Prozentwertunterschiede (gewichtet und ungewichtet)',
    },
    en: {
      description:
        'Row-wise 4-field chi-square test on percentage differences (weighted and unweighted)',
      syntax: '',
    },
  },
  {
    name: 'XROWMEANTEST',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'XROWTTEST',
    de: {
      description:
        'Zeilenweiser, unabhängiger t-Test auf Mittelwerteunterschiede (gewichtet und ungewichtet)',
    },
    en: {
      description:
        'Row-wise, independent t-test on mean differences (weighted and unweighted)',
      syntax: '',
    },
  },
  {
    name: 'XTAB',
    en: {
      description:
        'There is a further possibility of describing cross tables. This second more complicated version makes it easier to tabulate variables next to each other and if necessary to use different weights in one table.',
    },
  },
  {
    name: 'XTTEST',
    argsHint: '(Var )',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwerteunterschiede (gewichtet und ungewichtet)',
    },
    en: {
      description:
        'Independent t-test on mean differences (weighted and unweighted)',
      syntax: '',
    },
  },
  {
    name: 'XVALID',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'XWELCHTEST',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwerteunterschiede (gewichtet und ungewichtet) nach Welch 450 * zu ColPercT: ColPercTMinimum Bei der Signifikanzberechnung nach COLPERCT 428 wird die Spaltenüberlappung (kann bei Mehrfachnennungsvariablen passieren) berücksichtig.…',
    },
    en: {
      description:
        'Independent t-test on mean differences (weighted and unweighted) per Welch 450. * on ColPercT: ColPercTMinimum. In the significance calculation per COLPERCT 428, column overlap (which can happen with multiple-response variables) is taken into account.…',
      syntax: '',
    },
  },
  {
    name: 'XYPLOT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'Y',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'YDATABOXES',
    de: {
      description:
        'YDATABOXES ist eine Box, die alle DATABOXes einer Tabelle senkrecht umfasst. Sie geht auch nach oben über die FRAMECELLS und die LABELCELLS hinaus. Damit kann man über alle Elemente hinweg senkrechte Spalten schaffen, die optisch zusammen hängen DrawBox Zeichnung der Boxes',
    },
    en: {
      description:
        'YDATABOXES is a box that vertically encloses all DATABOXes of a table. It also extends upwards beyond the FRAMECELLS and the LABELCELLS. With it you can create vertical columns across all elements that visually belong together. DrawBox: drawing of the boxes',
      syntax: '',
    },
  },
  {
    name: 'YDATABOXES X',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'YES',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'YSIGNIFINFRONT',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'YVALID',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ZEROBASED',
    de: { description: 'Die Skala soll immer den Nullpunkt enthalten' },
    en: {
      description: 'The scale should always contain the zero point',
      syntax: '',
    },
  },
  {
    name: 'ZERODASHCHAR',
    de: { description: '', syntax: 'ZERODASHCHAR = "<char>";' },
    en: { description: '', syntax: 'ZERODASHCHAR = "<char>";' },
  },
  {
    name: 'ZEROMISSING',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
  {
    name: 'ZIPINVERTOUT',
    de: { description: '', syntax: 'ZIPINVERTOUT = [ YES | NO ];' },
    en: { description: '', syntax: 'ZIPINVERTOUT = [ YES | NO ];' },
  },
  {
    name: 'ZONEINPUT',
    de: {
      description: '',
      syntax:
        'ZONEINPUT <varname> = [ MEAN | SUM | COUNT | MIN | MAX ]\n<start> <zonewidth> <end>\n<varoffset> <varwidth>\n{ SELECT <offset> <string> } *n ;',
    },
    en: {
      description: '',
      syntax:
        'ZONEINPUT <varname> = [ MEAN | SUM | COUNT | MIN | MAX ]\n<start> <zonewidth> <end>\n<varoffset> <varwidth>\n{ SELECT <offset> <string> } *n ;',
    },
  },
  {
    name: 'ZRANGE',
    argsHint: '( Var )',
    de: {
      description:
        'Ausgabe des zentralen Bereichs einer Variablen, Mittelwert +/- Streuung * ZVALUE. Mit ZVALUE kann man diesen Faktor frei wählen, z.B. ZVALUE = 1.0; Voreinstellung: ZVALUE = 0.967; (2/3-Range um Mittelwert) * und **: Beide CELLELEMENTS reagieren auf den Schalter BINOMIALPERCENTRANGE: Exkurs: BiNomialPercentRange',
    },
    en: {
      description:
        'Output of the central range of a variable, mean +/- dispersion * ZVALUE. With ZVALUE you can freely choose this factor, e.g. ZVALUE = 1.0; Default: ZVALUE = 0.967; (2/3 range around the mean). * and **: both CELLELEMENTS respond to the switch BINOMIALPERCENTRANGE. Digression: BiNomialPercentRange',
      syntax: '',
    },
  },
  {
    name: 'ZVALUE',
    de: { description: '', syntax: '' },
    en: { description: '', syntax: '' },
  },
];
