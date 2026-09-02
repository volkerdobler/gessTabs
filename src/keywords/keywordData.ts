// Keyword database for the F1 keyword hover and keyword-completion
// providers (src/keywordProviders.ts).
//
// Hand-maintained. Originally mechanically extracted from the GESStabs
// manuals (see git history and scripts/extractKeywordDatabase.ts, now
// deprecated); the manuals are moving online and will not be re-extracted,
// so this file is edited directly from here on.
//
// One entry per keyword: { name, argsHint?, syntax, description }. Names and
// syntax are language-independent (GESStabs syntax doesn't translate); only
// `description` differs per language, as a { de, en } map. Every entry
// always has `syntax` and both `description` languages, but any of those
// strings may be '' when that piece isn't documented yet — the providers
// fall back to the other language. The German descriptions had their
// umlauts/ß destroyed
// (replaced with U+FFFD) by the manuals' original PDF-to-markdown
// conversion and were reconstructed by hand; other conversion artifacts
// (page numbers embedded mid-sentence, the odd truncated sentence) may
// still be present — fix them in place as you come across them.

import { KeywordEntry } from './keywordDatabaseTypes';

export const keywordData: KeywordEntry[] = [
  {
    name: '#DEFINE',
    syntax: '#DEFINE <string>',
    description: {
      en: 'Using functions from the group of defines, several variants of a table program can be maintained and run from a single source through "conditional compiling" mechanisms:\nWith #DEFINE, arbitrary names can be declared that can then be used as abbreviations for the DEFINE content.\n\n#DEFINEs can be defined not only in the source but also passed as a #DEFINE string on the command line with the "-D" option as a parameter.\n\nFor example: "GTC xyz.TAB -Dascii" passes the string »ascii« as a definition.',
      de: 'Mithilfe von Funktionen, die zur Gruppe der Defines gehören, können über Mechanismen des "Conditional Compiling" mehrere Varianten eines Tabellenprogramms in einer Quelle verwaltet und ausgeführt werden:\nMit #DEFINE können beliebige Namen vereinbart werden, die dann als Abkürzungen für den DEFINE-Inhalt geführt werden können.\n\n#DEFINEs kann man nicht nur in der Quelle definieren, sondern einen #DEFINE-String auch über die Kommandozeile mit der Option "-D" als Parameter übergeben.\n\nZum Beispiel: "GTC xyz.TAB -Dascii" übergibt den String »ascii« zur Definition.',
    },
  },
  {
    name: '#DOMACRO',
    argsHint: '( <macroname> <looplist> )',
    syntax: '#DOMACRO( <macroname> <looplist> )',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#DOMACRO2',
    argsHint: '( <macroname> <looplist> ; <additional parameters> )',
    syntax: '#DOMACRO2( <macroname> <looplist> ; <additional parameters> )',
    description: {
      en: '',
      de: '#DoMacro2 ist eine Erweiterung des #DOMACRO. Beispiel:',
    },
  },
  {
    name: '#DOMACRO3',
    argsHint: '( <macroname> <filename> )',
    syntax: '#DOMACRO3 ( <macroname> <filename> )',
    description: {
      en: 'Like #DOMACRO and #DOMACRO2, the #DOMACRO3 statement serves the repeated processing of macros. The macro parameters are taken from a CSV file, which is most easily created with a spreadsheet program. This provides an interface for staff who are not experienced in scripting.…',
      de: 'Wie #DOMACRO und #DOMACRO2 dient das #DOMACRO3-Statement der wiederholten Abarbeitung von Macros. Die Macro-Parameter werden hierbei aus einer CSV-Datei entnommen, die am einfachsten mit einem Tabellenverarbeitungsprogramm erzeugt werden kann. Dadurch bietet es eine Schnittstelle zu MitarbeiterInnen, die nicht im Scripting versiert sind.…',
    },
  },
  {
    name: '#DOMACRO4',
    argsHint: '( <filename> )',
    syntax: '#DOMACRO4 ( <filename> )',
    description: {
      en: 'The #DOMACRO4 statement has a similar background. The difference is that the name of the macro is not fixed in the script but is given as the first field in the CSV file. The call',
      de: 'Einen ähnlichen Hintergrund hat auch das #DOMACRO4-Statement. Der Unterschied ist, dass der Name des Macros nicht im Script festgelegt wird, sondern als erstes Feld in der CSV-Datei benannt wird. Der Aufruf',
    },
  },
  {
    name: '#ELSE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#END',
    syntax: '',
    description: {
      en: 'Pre-processor commands are processed before the GESS tabs program is translated into its internal form. Using #DEFINE names are chosen which then are taken as defined; using #UNDEFINE they can be deleted. Using #IFDEF or #IFNDEF GESS tabs checks whether a name has been defined or not.…',
      de: 'Mit #IFDEF bzw. #IFNDEF kann man abfragen, ob ein Name definiert ist oder nicht. Alle GESStabs-Quellzeilen und alle #DEFINE bzw. #UNDEFINE-Statements zwischen dem #IFDEF bzw. #IFNDEF und dem schließenden #END werden in Abhängigkeit vom Wahrheitswert dieses Tests durchgeführt.',
    },
  },
  {
    name: '#ENDEXPORT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#ENDMACRO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#EXPAND',
    syntax: '#EXPAND #<name> <value>',
    description: {
      en: 'Defines a text placeholder: a later bare #<name> (without parentheses) is replaced by <value>.',
      de: 'Definiert einen Textplatzhalter: ein späteres #<name> (ohne Klammern) wird durch <Wert> ersetzt.',
    },
  },
  {
    name: '#EXPANDINC',
    syntax:
      '#EXPANDINC #<name of the expand> <value>\nAt its core this is an #EXPAND. The argument <value> must, however, be a whole number, from',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#EXPANDINTOKEN',
    syntax:
      '#EXPANDINTOKEN &<search>& <replace>\n<search> ::= text to be replaced\n<replace> ::= text to be inserted',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#IFDEF',
    syntax: '#IFDEF <define name>\n<syntax statement 1>',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#IFEMPTY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#IFEXIST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#IFNDEF',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#IFNEMPTY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#IFNEXIST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#IGNORECASE',
    syntax: '#IGNORECASE = [ YES | NO ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#MACRO',
    syntax: '#MACRO #<name>( <&param> ... )\n<macro content>\n#ENDMACRO',
    description: {
      en: 'Defines a macro: every call site #<name>(...) is replaced by the macro content, with &param placeholders substituted by the arguments passed at the call.',
      de: 'Definiert ein Macro: an jeder Aufrufstelle #<name>(...) wird der Macroinhalt eingesetzt, wobei &param-Platzhalter durch die übergebenen Argumente ersetzt werden (GESStabs_Makros.md).',
    },
  },
  {
    name: '#MACROEND',
    syntax: '#MACROEND',
    description: {
      en: 'Closed a macro definition',
      de: 'Beendet eine Macro-Definition',
    },
  },
  {
    name: '#UNDEFINE',
    syntax: '#UNDEFINE <string>',
    description: {
      en: '',
      de: 'Gesetzte #DEFINE Steuerelemente können damit wieder zurückgenommen werden.',
    },
  },
  {
    name: '#WEIGHT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: '#WEIGHTEND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ABANDON',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ABANDONFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ABANDONOPENFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ABS',
    syntax: '',
    description: {
      en: 'DAYOFWEEK The day of the week in a date in the form YYYYMMDD 1=Monday, 2=Tuesday etc Thus e.g. DAYOFWEEK( 20061030 ) = 1. DAYOFWEEK( 0 ) is today.',
      de: '',
    },
  },
  {
    name: 'ABSCOLINHG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ABSCOLPERCENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ABSCOLUMN',
    syntax: '',
    description: {
      en: 'PHYSICALCOLUMN. In the default case of a table with absolute frequencies, only one of the six frame elements is present: the row with the absolute frequencies, ABSROW. In our case column percentages are to be shown in the cells, i.e. we choose COLUMNPERCENT as CELLELEMENTS. A total column and an absolute row fit with that.…',
      de: 'PHYSICALCOLUMN. Im Standardfall einer Tabelle mit absoluten Häufigkeiten ist von den sechs Rahmenelementen nur eines vorhanden: die Zeile mit den absoluten Häufigkeiten, ABSROW. In unserem Fall sollen in den Zellen Spaltenprozente abgebildet werden, das heißt als CELLELEMENTS wählen wir COLUMNPERCENT. Dazu passen eine Totalspalte und eine Absolutzeile.…',
    },
  },
  {
    name: 'ABSINLABEL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ABSINLABELBOX',
    syntax: '',
    description: {
      en: 'Prints the ABSOLUTEROW at the lower frame of the label box instead of as it is usually in its own box.',
      de: 'Drucke die ABSROW nicht wie üblich in einem eigenen Kasten, sondern drucke die Werte am unteren Rand der Labelkästchen.',
    },
  },
  {
    name: 'ABSMEAN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ABSMEANSUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ABSOLUTE',
    syntax: '',
    description: {
      en: 'Number of cases (sum of weights)',
      de: 'Zahl der Fälle (Summe der Gewichte)',
    },
  },
  {
    name: 'ABSROW',
    syntax: '',
    description: {
      en: 'Absolute number of responses / cases in the row',
      de: 'Absolute Zahl der Nennungen/ Fälle in der Zeile',
    },
  },
  {
    name: 'ABSROWINHG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ABSROWPERCENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ABSZERODASH',
    syntax: '',
    description: {
      en: 'Usually zero as an absolute value is represented with a "0". ABSZERODASH can be used to represent the zero in a CELLELEMENT ABSOLUTE as a dash (\'-\').',
      de: 'Im Standardfall wird die Null als Absolutwert als eine 0 dargestellt. Mit ABSZERODASH kann man erreichen, dass die Null in einem CELLELEMENT ABSOLUTE als Dash („-“) dargestellt wird.',
    },
  },
  {
    name: 'ACCOUNT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ACROSS',
    syntax: '',
    description: {
      en: 'The atomic elements of composite CELLELEMENTS are shown side by side in PS/PDF output rather than one below the other.',
      de: 'Die atomaren Elemente von zusammengesetzten CELLELEMENTS werden in PS/PDF-Ausgabe nicht untereinander, sondern nebeneinander dargestellt.',
    },
  },
  {
    name: 'ADD',
    syntax: '',
    description: {
      en: "Editing of existing label lists, see ADD. If a LABEL/OVERCODE is inserted at a position that does not 'exist' this way (e.g. at POSITION 5 in a list with only three VALUELABELS), this label is simply appended to the end of the list — as if no POSITION had been given.",
      de: "Editierung bestehender Labellisten, siehe ADD Wird ein LABEL/OVERCODE an eine Position eingefügt, die so nicht 'exsitiert' (z.B. an POSTIION 5 in einer liste mit nur drei VALUELABELS, wird dieses Label einfach ans Listenende angehängt - so, als ob keine POSITION angegeben wäre.",
    },
  },
  {
    name: 'ADDNAMETOVARTITLE',
    syntax: 'ADDNAMETOVARTITLE = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ADDOVERCODE',
    syntax: '',
    description: {
      en: 'Usually the OVERCODE is only tallied once per case if several of the relevant categories arise i.e. a logical OR is used. ADDOVERCODE requests the addition of the individual frequencies.',
      de: 'In der Regel werden OVERCODEs je Fall nur einmal gezählt, wenn mehrere der dazugehörenden Kategorien vorkommen, d.h. es wird ein logisches ODER gebildet. Mit ADDOVERCODE kann eine Addition der Einzelhäufigkeiten verlangt werden. AUTOOVERSORT Sortiert die OVERCODEs einer Tabelle und bereitet die Labels für die Sortierung unterhalb der Overcodes vor.…',
    },
  },
  {
    name: 'ADDRESSBASE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ADDRSERVER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ADDSPLITS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ADOBELATIN1',
    syntax: 'ADOBELATIN1;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ADOBENAME',
    syntax: 'ADOBENAME <char> = <name>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AFTER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AGGR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALFA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALIGN',
    syntax:
      'ALIGN <boxname> = { <hpos> | <vpos> }*n ;\n<hpos> = [ LEFT | RIGHT | HCENTER ] [ <number> ] [ TABULATOR <number> ]\n<vpos> = [ TOP | BOTTOM | VCENTER ] [ <number> ] [ TABULATOR <number> ]',
    description: {
      en: '(PS): is ignored by line printers. The text in each box can be positioned vertically as well as horizontally. The following terms are required: TOP - VCENTER - BOTTOM and LEFT - HCENTER - RIGHT. Example: ALIGN LABELS X = HCENTER VCENTER; The terms LEFT and RIGHT can also contain a command for the distance to the edge of the box:…',
      de: '',
    },
  },
  {
    name: 'ALIGNALPHA',
    syntax: 'ALIGNALPHA = [ LEFT | RIGHT ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALIGNDATA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALIGNLABELLEFT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALLOWALPHATEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALLOWASYMMETRY',
    syntax: '',
    description: {
      en: 'asymmetric output of the scale with RISING/FALLING.',
      de: 'asymmetrische Ausgabe der Skala bei RISING/FALLING',
    },
  },
  {
    name: 'ALLOWEMPTY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALLOWEXPANDINTOKEN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALLOWLINEFEED',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALLOWNOTEXTINVAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALLQUESTIONSASKED',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALLSIGNIFICANCE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALPHA',
    syntax: 'ALPHA <varlist> = YES;',
    description: {
      en: '1 100 20 ; In this case the names of politicians are punched in the fields 1-20, 21-40, etc. which makes coding by hand superfluous. If using input from a COLBIN file then the key word ALPHA can obviously not be used. Generally the use of an asterisk instead of the initial column is processed the same as in a SINGLEQ. MULTIQs can also be defined as relocatable.…',
      de: '',
    },
  },
  {
    name: 'ALPHACASESENSITIVE',
    syntax: 'ALPHACASESENSITIVE = [ YES | NO | LOWERCASE | UPPERCASE ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALPHAFAMILY',
    syntax: 'ALPHAFAMILY <newAlphaFamily> = { <alphavar> }*n ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALTXCODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ALWAYS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ANSWER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ANYCASE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'APPEND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'APPOINTCODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'APPOINTMENTWAIT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'APPOTRY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AREAS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AREAS3D',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASALPHA',
    syntax: 'ASALPHA <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASCEND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASCIIIN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASCIIOUT',
    syntax: 'ASCIIOUT <varlist> = startcolumn [ width ];',
    description: {
      en: 'Every variable which is to appear in an ASCIIOUTFILE must be included in an ASCIIOUT statement.',
      de: '',
    },
  },
  {
    name: 'ASCIIOUTCARD',
    syntax: '',
    description: {
      en: 'The number of cards and the preset of the present card for the output of variables in ASCII format in the ASCIIOUTFILE.',
      de: '',
    },
  },
  {
    name: 'ASCIIOUTCARDS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASCIIOUTDECIMALCAR',
    syntax: '',
    description: {
      en: 'Defines CHAR value which is to be used as a decimal separator in ASCIIOUT.',
      de: '',
    },
  },
  {
    name: 'ASCIIOUTDECIMALCHAR',
    syntax: 'ASCIIOUTDECIMALCHAR = [ . | , ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASCIIOUTFILE',
    syntax: 'ASCIIOUTFILE [ DELIMITED [ ASCIIOUT ] ] = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASKMULTIASSINGLES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASSCOCEND',
    syntax: 'ASSCOCEND <filename> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASSERT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASSERTFILTERINASCII',
    syntax: 'ASSERTFILTERINASCII = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASSERTFILTERVARS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASSOCEND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASSOCFILE',
    syntax:
      'ASSOCFILE [ BIG | DBASEIN ] = <filename> KEY <varname> <startcol>\n<len> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASSOCTOINVERT',
    syntax:
      'ASSOCTOINVERT = [ CSV | SPSS | DBASE | ASCIIN }*n = [ YES | NO ];\nDefault: ASSOCTOINVERT = CSV SPSS DBASE ASCIIN;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ASSOCVAR',
    syntax: 'ASSOCVAR <varname> = [ ALPHA] <startcol> [ <len> [ <width> ] ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AUTO',
    syntax: 'AUTO : [YES | NO]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AUTOALIGN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AUTOCASENUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AUTOCHARTFORMAT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AUTOCLEAR',
    syntax: 'AUTOCLEAR = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AUTOCONTENTKEY',
    syntax:
      'AUTOCONTENTKEY = [ VARNAME ] [ YVALID | XVALID | NO ];\nA CONTENTKEY (see above) is automatically allocated; if YVALID then the first variable in the Y-direction',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AUTONOANSWER',
    syntax:
      'AUTONOANSWER [ <varlist> ] = [ YES "noanswertext" | NO ] [ LEVEL <\nnumber > ;\nAUTONOANSWER is either (without <varlist>) preset or it refers to explicit variables and the preset',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AUTONOANSWERCODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AUTOOPEN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AUTOOVERSORT',
    syntax: '',
    description: {
      en: 'Sorts the OVERCODES in a table and prepares the labels for sorting within the overcode. Overcodes can hierarchically be sorted on up to five levels.',
      de: '',
    },
  },
  {
    name: 'AUTOREPLACEOPEN',
    syntax: 'AUTOREPLACEOPEN = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AUTOSIGNCHAR',
    syntax: '',
    description: {
      en: 'This TABLEFORMAT ensures an automatic identification of the column with an identifying letter (see INDEXCHARS) for significance tests per column. If TESTCOLUMNS has been set the letters are not re- allocated for each variable as is usually the case.',
      de: 'Dieses TableFormat veranlasst eine automatische Kennzeichnung der Spalten mit Kennbuchstaben (INDEXCHARS) für spaltenorientierte Signifikanztests. Wenn TESTCOLUMNS vereinbart sind, werden die Buchstaben nicht für die einzelnen Variablen neu vergeben, wie sonst im Standardfall.',
    },
  },
  {
    name: 'AUTOSIGNCHARALWAYS',
    syntax: '',
    description: {
      en: 'As AUTOSIGNCHAR but using AUTOSIGNCHAR the identification in the stub automatically only occurs if also at least one valid CELLELEMENT is present in the table. This test does not take place if using AUTOSIGNCHARALWAYS.',
      de: 'Wie AUTOSIGNCHAR. AUTOSIGNCHAR enthält aber eine Automatik, dass nur dann die Kennzeichnung im Kopf vorgenommen wird, wenn auch mindestens ein zutreffendes CELLELEMENT in der Tabelle enthalten ist. Bei AUTOSIGNCHARALWAYS unterbleibt diese Prüfung.',
    },
  },
  {
    name: 'AUTOSIGNFORMAT',
    syntax: 'AUTOSIGNFORMAT = "<formatstring>";',
    description: {
      en: '5. Logging of the significance calculation 460: STATTESTDUMP. Subject of the significance test: TestColumns. If you do not specify any TESTCOLUMNS, all columns are tested against each other per variable.',
      de: '5.Protokollierung der Signifikanzberechnung 460: STATTESTDUMP Gegenstand des Signifikanztests TestColumns Gibt man keine TESTCOLUMNS an, werden je Variable alle Spalten gegeneinander getestet.',
    },
  },
  {
    name: 'AUTOSIGNIFTEXT',
    syntax: 'AUTOSIGNIFTEXT = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AUTOSORTTREE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'AXISMINMAX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BACKGROUND',
    argsHint: '( ge 2 le 3 : $e0e0ff ge 0 le 2 : $d0d0ff )',
    syntax: 'BACKGROUND <boxname> = <hue> <saturation> <brightness>;',
    description: {
      en: 'FORMAT "#,#" = <1 4> / <1 1> ; The result value 2 could not be assigned unambiguously without the rule above. Thus the cell is coloured with $d0d0ff and not with $e0e0ff. The last line could also be described in two separate BACKGROUND rules; equivalent would be: BACKGROUND ( ge 2 le 3 : $e0e0ff ) BACKGROUND ( ge 0 le 2 :…',
      de: 'FORMAT "#,#" = <1 4> / <1 1> ; Der Ergebniswert 2 wäre ohne die obenstehende Regel nicht eindeutig zuzuordnen. so wird die Zelle mit $d0d0ff und nicht mit $e0e0ff gefärbt. Die letzte Zeile könnte auch in zwei getrennten BACKGROUND-Regeln beschrieben werden, gleichbedeutend wäre: BACKGROUND ( ge 2 le 3 : $e0e0ff ) BACKGROUND ( ge 0 le 2 :…',
    },
  },
  {
    name: 'BACKGROUNDBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BACKLIMIT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BACKTOCONTENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BANKERSROUNDMODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BARS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BARS3D',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BASEIN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BASESELECT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BCDVAR',
    syntax: 'BCDVAR <variable> = <vargroup> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BEEP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BENCHMARKCOLOR',
    syntax: 'BENCHMARKCOLOR = <color_high> <color_low> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BENCHMARKLEVEL',
    syntax: 'BENCHMARKLEVEL = [ SIGNIF90 | SIGNIF95 | SIGNIF99 | SIGNIF999 ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BENCHMARKVALUES',
    syntax: '',
    description: {
      en: 'A different subject: percentage values and bases (e.g. from other surveys) can be set in BENCHMARKVALUES. Then the column percentages in the relevant cells are compared with the benchmark values using a z-test. The BACKGROUND of the cell can then be coded with BENCHMARKCOLOR.…',
      de: '',
    },
  },
  {
    name: 'BIG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BIK001',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BINARY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BINOMIALPERCENTRANGE',
    syntax: 'BINOMIALPERCENTRANGE = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BIPOL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BIT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BITGROUP',
    syntax: 'BITGROUP <vargroup> = <varname> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BLACKLIST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BLACKLISTCODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BLACKLISTSERVER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BLANKVALUE',
    syntax: 'BLANKVALUE = <number>;\nExample: BLANKVALUE = -1;',
    description: {
      en: 'Normally an input field which only contains blanks is internally set to zero. If these values are however required then the BLANKVALUE command can define a value. Example: BLANKVALUE = -1; Preset: BLANKVALUE = 0.0;',
      de: '',
    },
  },
  {
    name: 'BOLD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BORDERS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BOTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BOTTOM',
    syntax: '',
    description: {
      en: 'The label is always sorted to the end within a sort class.',
      de: 'Label wird innerhalb einer Sortierklasse immer ans Ende sortiert.',
    },
  },
  {
    name: 'BOTTOMCUT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BOTTOMTEXT',
    syntax: 'BOTTOMTEXT = "<text>";',
    description: {
      en: 'This is an alternative method for defining text at the end of a table. BOTTOMTEXT has in contrast to the CITEVARTEXT command which refers to variables, the text to be printed as its argument. If a BOTTOMTEXT is defined any additional CITEVARTEXT or CITEALLVARS commands for the BOTTOMTEXT are ignored. Maximum text length: 1500 characters.',
      de: 'Optionaler Text am Ende der Tabelle',
    },
  },
  {
    name: 'BOXFONT',
    syntax:
      'BOXFONT <boxtype> : <fontname> SIZE <number>\n[OPTION [BOLD|ITALIC|UNDERLINE]]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BOXLINEFEED',
    syntax: 'BOXLINEFEED <boxname> = <number> ;',
    description: {
      en: '(PS): is ignored by line printers.',
      de: '',
    },
  },
  {
    name: 'BOXMINHEIGHT',
    syntax: 'BOXMINHEIGHT <boxname> = <number> ;',
    description: {
      en: '(PS): is ignored by line printers.',
      de: '',
    },
  },
  {
    name: 'BOXRADIUS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BOXTEXT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BOXTYPE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'BY',
    syntax: '<header> BY <axis>{*n}',
    description: {
      en: 'Separates the header from the axis',
      de: 'Trennt den Kopf von der Achse',
    },
  },
  {
    name: 'CALCCOLLOWACCURACY',
    syntax: 'CALCCOLLOWACCURACY = [ YES | NO ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CALCULATECOLUMN',
    syntax:
      'CALCULATECOLUMN = <targetcolumn> [ format "<format>" ] =\n<arithmetic expression>;\nThe notation for the column is: < <varno> <code> >. <varno> stands for the tally of the variables',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CAMEMBERT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CAMEMBERT3D',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CAMEMBERTANDBAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CAMEMBERTEXPLODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CAMEMBERTEXPLODE3D',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CAPI',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CARD',
    syntax: '',
    description: {
      en: 'discloses in which row or "card" the then following variables or weight is to be found. Preset is on CARD=1. CARD and CARDS refer to the DATAFILE (and thus automatically the COPYFILE). Relevant commands are also available for ASCIIOUTFILE, COLBININFILE and COLBINOUTFILE.',
      de: '',
    },
  },
  {
    name: 'CARDNUMBER',
    syntax: 'CARDNUMBER = startcolumn width;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CARDS',
    syntax: '',
    description: {
      en: 'CARDS discloses how many records or rows constitute the case. Example: CARDS = 2; Preset is CARDS=1, i.e. for data sets which comprise one row the specification is not necessary.',
      de: '',
    },
  },
  {
    name: 'CASEBASESTRING',
    syntax:
      'CASEBASESTRING = "<text>";\nDefault text: \'Percentaged on the number of cases\';',
    description: {
      en: 'Defines the text which refers to the percentaging for multi-responses CODEBOOK tables. Preset: CASEBASESTRING = "Prozentuiert auf die Zahl der Fälle"; This is valid for all tables until changed.',
      de: 'Text, der bei Mehrfachnennungen in CODEBOOK-Tabellen auf die Prozentuierung verweist.',
    },
  },
  {
    name: 'CASELIST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CASENUMBER',
    syntax: '',
    description: {
      en: 'Syntax CASENUMBER = startcolumn width; If the column definition is known for a case number then an identical value is expected at that position for all cards of a case. Divergence leads to an error log which is shown in the lower error window on screen and where necessary in the LISTFILE.',
      de: '',
    },
  },
  {
    name: 'CASES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CASESTITLE',
    syntax: '',
    description: {
      en: 'If the standard text "number of Interviewees abs." in TABLEBASE = CASES is to be replaced it can be done in this way: CASESTITLE = "Number of Inter-views (abs.)"; The CASESTITLE can be set differently for the X and Y axes Example: CASESTITLE X = "n"; CASESTITLE Y = "N"; The same separating rules are valid as for VALUELABELS and are valid for all tables until changed.',
      de: '',
    },
  },
  {
    name: 'CASETITLE',
    syntax: 'CASETITLE [ X | Y ] = "<text>";',
    description: {
      en: 'Label of the CASES column/row (when TABLEBASE = CASES; 388 is set)',
      de: 'Bezeichnung der CASES-Spalte/-zeile (wenn TABLEBASE = CASES; 388 gesetzt)',
    },
  },
  {
    name: 'CATI',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CATIDISPLAYLIST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CBEXCLUDEMISSING',
    syntax: 'CBEXCLUDEMISSING = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CBPERCENTINTOTAL',
    syntax: '',
    description: {
      en: 'In the total row of CODEBOOK, either the number of cases or the number of responses is shown. If the TABLEFORMAT CBPERCENTINTOTAL is set, percentage values are output in the total column instead.',
      de: 'In der Totalzeile von CODEBOOK werden jeweils die Zahl der Fälle oder die Zahl der Nennungen ausgewiesen. Wird das TABLEFORMAT CBPERCENTINTOTAL gesetzt, werden in den Totalspalte stattdessen Prozentwerte ausgegeben.',
    },
  },
  {
    name: 'CELLELEMENT',
    syntax: '',
    description: {
      en: '[ MINIMUM <number> ] minimum percentage value to be shown in the PIE',
      de: '[ MINIMUM <number> ] minimale im PIE abzubildende %-Zahl',
    },
  },
  {
    name: 'CELLELEMENTS',
    argsHint: '( ABSOLUTE COLUMNPERCENT )',
    syntax: 'CELLELEMENTS [ TOTALROW | TOTALCOLUMN ] = { <cellelement> }*n ;',
    description: {
      en: '',
      de: 'Anforderung spezifischer Zellenelemente 418 für dieses Label',
    },
  },
  {
    name: 'CELLMINALWAYS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CELLMINIMUM',
    syntax: 'CELLMINIMUM = <value>;',
    description: {
      en: 'The option CELLMINIMUM states as of which minimum value a table cell counts as valid and should be included. Example: CELLMINIMUM = 10; In all cells where the minimum value has not been reached there will be "-". Preset at 0.0001; CELLMINIMUM as ROWMINIMUM and COLMINIMUM are TABLE options. Options always refer to the last table requested. They are therefore always written after the TABLE command.…',
      de: '',
    },
  },
  {
    name: 'CELLSEQUENCE',
    syntax:
      'CELLSEQUENCE = <cellelements>;\nCLASSICCELLSEQUENCE = <cellelements>;',
    description: {
      en: 'If several CELLELEMENTS are required for a table the cell contents are printed underneath each other in a standard order. This standard order can be altered using the CELLSEQUENCE statement. CELLSEQUENCE defines a new order. All CELLELEMENTS which do not appear in CELLSEQUENCE are not printed.',
      de: '',
    },
  },
  {
    name: 'CELLSET',
    syntax: '',
    description: {
      en: 'The CELLELEMENTS statement can be used to combine several pieces of information in a single table cell in the parts of the table which span across both axes using LABELS. In summary tables additional summarised rows are often required where e.g. means are to be presented. Due to the syntax this is only one CELLELEMENT, if necessary this can be one that includes two values e.g.…',
      de: 'Statement verwendet werden.',
    },
  },
  {
    name: 'CHANGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHANGEKEYWORD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHANGESPSSVARNAMES',
    syntax: 'CHANGESPSSVARNAMES = [ UPPERCASE | LOWERCASE | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHAPTER',
    syntax: 'CHAPTER <varlist> = [ {<string>}*n ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHAPTERPAGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHAPTERTITLE',
    syntax: 'CHAPTERTITLE = <name>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHARTAREA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHARTCOLORS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHARTFOOTER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHARTHEADER',
    syntax:
      'CHARTHEADER = <string> [ TOP | BOTTOM | VCENTER |LEFT\n| RIGHT | HCENTER ] ;\nCHARTFOOTER = <string> [ TOP | BOTTOM | VCENTER |LEFT\n| RIGHT | HCENTER ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHARTHEIGHT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHARTLABELS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHARTLEGEND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHARTNUMBERS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHARTRANGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHARTTITLE',
    syntax: 'CHARTTITLE : <title>',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHARTWIDTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHECKALLOW',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHECKBLACKSERV',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHECKMISSINGINMULTI',
    syntax: 'CHECKMISSINGINMULTI = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHECKRECODES',
    syntax: 'CHECKRECODES = [ YES | NO };',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHIQOCOLMINIMUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHIQU',
    syntax: '',
    description: {
      en: 'Output of the chi-square per cell. The chi-square evaluates the deviation of the empirical distribution in each cell from the expected value derived from the marginal distributions.',
      de: 'Ausgabe des Chi-Quadrats zellenweise. Das Chi-Quadrat bewertet die Abweichung der empirischen Verteilung in jeder Zelle vom anhand der Randverteilungen ermittelten Erwartungswert.',
    },
  },
  {
    name: 'CHIQUCOLMINIMUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHIQUMINIMUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CHIQUROWMINIMUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CIRCLE',
    syntax: '',
    description: {
      en: 'Mark the scale value with a circle',
      de: 'Skalenwert mit einem Kreis markieren',
    },
  },
  {
    name: 'CIRCLEO',
    syntax: '',
    description: {
      en: 'LineDash: LINEDASH is an integer value between 1 and 10. GESStabs predefines ten shapes of dashed lines that can be used for designing LINE or RECTLINE. Default: 0, which corresponds to a solid line. LineWidth: the thickness of LINE or RECTLINE. Explode: has no effect on shapes other than PIE or PIE100.…',
      de: 'LineDash LINEDASH ist ein ganzzahliger Wert zwischen 1 und 10. In GESStabs sind zehn Formen gestrichelter Linien vordefiniert, die man zur Gestaltung von LINE oder RECTLINE abrufen kann. Voreinstellung: 0, das entspricht einer durchgezogenen Linie. LineWidth Die Dicke von LINE bzw. RECTLINE. Explode Ist bei anderen Formen als PIE oder PIE100 wirkungslos.…',
    },
  },
  {
    name: 'CITEALLVARS',
    syntax: 'CITEALLVARS = [ TOPTEXT | BOTTOMTEXT | NO ] { XVALID | YVALID };',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CITEFIRSTVAR',
    syntax:
      'CITEFIRSTVAR = [ TOPTEXT | BOTTOMTEXT | NO ] { XVALID | YVALID };\nIn parallel with CITEALLVARS there is also a CITEFIRSTVAR; then only the text of the',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CITEVARTEXT',
    syntax: 'CITEVARTEXT [ TOPTEXT | BOTTOMTEXT ] = <varlist> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CKONTO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CKONTOKEY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CLASSIC',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CLASSICCELLSEQUENCE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CLONEVAR',
    syntax:
      'CLONEVAR <destinationvar> = <sourcevar>\n[ DELETELABELS [ MISSING | AUTONOANSWER | OVERCODE | {<number>}*n ] ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CLOSED',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CLUSTERED',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CODEBLOCK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CODEBOOK',
    syntax: 'CODEBOOK [ <VarList> ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CODEBOOKHEADER',
    syntax:
      'CODEBOOKHEADER =\n| CODE "Text"\n| ABSOLUTE "Text"\n| COLUMNPERCENT "Text"\n| NOMPERCENT "Text"\n| CUMPERCENT "Text"',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CODEBOOKTOTAL',
    syntax: 'CODEBOOKTOTAL = "text";',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CODEBOOKVALUES',
    syntax: '',
    description: {
      en: 'Prints the numerical codes beside the VALUELABELS in CODEBOOK tables. This is particularly useful for controlling the automatic coding which is carried out by ALPHA-VARS.',
      de: 'In CODEBOOKs wird der Labelcode jeder Variablenausprägung als eigene Spalte ausgegeben.',
    },
  },
  {
    name: 'CODEBOOKZEROLINES',
    syntax: '',
    description: {
      en: 'Causes labelled codes to be output in CODEBOOK even when the frequency is zero.',
      de: 'Bewirkt die Ausgabe gelabelter Codes in CODEBOOKs, auch wenn die Häufigkeit null ist.',
    },
  },
  {
    name: 'CODEINLABELS',
    syntax: 'CODEINLABELS = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CODISISDN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLBINCRLF',
    syntax: 'COLBINCRLF = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLBINFORMAT',
    syntax: 'COLBINFORMAT = <colbinformatname>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLBINFORNAT',
    syntax: 'COLBINFORNAT = <colbinformatname>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLBININ',
    syntax: 'COLBININ <varname> = { | value < column : code }*n };',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLBININCARD',
    syntax: '',
    description: {
      en: 'Definition for the data set to be read in COLBIN format.',
      de: '',
    },
  },
  {
    name: 'COLBININCARDS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLBININCOLS',
    syntax: 'COLBININCOLS = <value>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLBININFILE',
    syntax: 'COLBININFILE = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLBININSWAPPED',
    syntax: 'COLBININSWAPPED = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLBINOUT',
    syntax: 'COLBINOUT <varlist> = <start> <width> BITGROUP [ 10 | 12 ];',
    description: {
      en: 'The counterpart of COLBININ is COLBINOUT. In the first form it is very similar to COLBININ described above: Example: COLBINOUT Alter = | 1 > 22:9 | 2 > 22:X | 3 > 22:Y | 4 > 23:0 | 5 > 23:1 | 6 > 23:3; The COLBINOUT statement is also used to build VARFAMILYs and VARGROUPs on COLBIN multi punches as the variables can be multi-response variables.…',
      de: '',
    },
  },
  {
    name: 'COLBINOUTCARD',
    syntax: '',
    description: {
      en: 'Definition for the data set to be written in COLBIN format.',
      de: '',
    },
  },
  {
    name: 'COLBINOUTCARDS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLBINOUTCOLS',
    syntax: 'COLBINOUTCOLS = <value>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLBINOUTFILE',
    syntax: '',
    description: {
      en: 'Output of data in COLumn-BINary-format. See COLBIN-Data above.',
      de: '',
    },
  },
  {
    name: 'COLBINOUTSWAPPED',
    syntax: 'COLBINOUTSWAPPED = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLCCHIQUABSMIN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLCCHIQUPHYSMIN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLCHIQU',
    syntax: '',
    description: {
      en: 'Column-wise 4-field chi-square test on percentage differences. To determine the chi-square statistic and the corresponding significance value, an internal 4-field matrix is generated for each pairwise comparison, with the observed absolute cases of the cell pair in question in the first row and, in the second row, the difference between these values and the total values from the total row of the…',
      de: 'Spaltenweise 4-Felder Chi²-Test auf Prozentwertunterschied. Um die Chi²-Prüfgröße und den dazu passenden Signifikanzwert zu ermitteln, wird intern eine 4-Felder-Matrix bei jedem Paarvergleich generiert, bei der in der ersten Zeile die beobachteten, absoluten Fälle des gefragten Zellenpaars stehen und in der zweiten Zeile jeweils die Differenz dieser Werte zu den Totalwerten aus der Totalzeile der…',
    },
  },
  {
    name: 'COLCOUNTLINES',
    syntax: '',
    description: {
      en: 'Printing of column tallies (COLUMNCOUNT) in a row-orientated format. Usually the results are printed in columns. (NON-PS) An example of an 80-Column-Tally:',
      de: '',
    },
  },
  {
    name: 'COLDEPTTEST',
    argsHint: '(Var)',
    syntax: '',
    description: {
      en: 'Dependent t-test on mean differences',
      de: 'Abhängiger t-Test auf Mittelwertsunterschiede',
    },
  },
  {
    name: 'COLLECT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLMEANINVRANK',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'For the rank calculations, all cells in a table column are compared with each other and a rank is computed, in this case for the MEAN. Identical MEANs get identical ranks. Two MEANs are considered identical if they produce the same printed output, i.e. the formats used also matter.…',
      de: 'Für die Rangplatzberechnungen werden alle Zellen in einer Tabellenspalte miteinander verglichen und es wird ein Rangplatz berechnet, in diesem Fall für den MEAN. Identische MEANs bekommen identische Ränge. Zwei MEAN gelten als identsich, wenn sie dieselbe Druckausgabe ergeben, d.h. es kommt auch auf die verwendeten Formate an.…',
    },
  },
  {
    name: 'COLMEANRANK',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'see COLMEANINVRANK, but here the lowest mean gets rank 1',
      de: 'siehe COLMEANINVRANK, aber: der niedrigste Mittelwert bekommt hier den Rang 1',
    },
  },
  {
    name: 'COLMINIMUM',
    syntax: '',
    description: {
      en: 'Option for TABLE statement. Only those columns are printed which contain at least COLMINIMUM cases, i.e., columns with very low case numbers in side group variables are suppressed. Preset at 0.0001.',
      de: '',
    },
  },
  {
    name: 'COLOR',
    syntax:
      'COLOR [ FOREGROUND | BACKGROUND ] =\n{ |\n[ DATABOX <number> <number> CODE [ X | Y ] <number > ]\n<cellelement> RANGE <low> <high> = <number> <number> number> }*n\n;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLORIFBASELESS',
    syntax:
      'COLORIFBASELESS <place> <test> <number> [ <cellelement> ] = <color>;\n<place> ::= [ FRAMECELL X | FRAMECELL X | DATACELL ]\n<test> ::= [ ABSOLUTE PHYSICALRECORDS VALIDN VALIDPHYS ]\n<number> ::= threshold below which the colour should be changed\n<cellelement> ::= the CELLELEMENT concerned: if this is omitted,',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLPCTBENCHMARK',
    syntax: '',
    description: {
      en: 'For comparing column percentages with externally defined benchmark values (see BENCHMARKVALUES)',
      de: 'Zum Vergleich von Spaltenprozenten mit extern festgelegten Benchmarkwerten (siehe BENCHMARKVALUES)',
    },
  },
  {
    name: 'COLPERCANDCHIQU',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLPERCANDHYCHIQU',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLPERCANDSIGN',
    syntax: '',
    description: {
      en: 'Column percent and COLPERCT Tests for Mean Differences:',
      de: '',
    },
  },
  {
    name: 'COLPERCENTABS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLPERCENTDELTA',
    syntax: '',
    description: {
      en: 'Delta values (in percentage points) relative to the value in the total column',
      de: 'Deltawerte (in Prozentpunkten) zum Wert in der Totalspalte',
    },
  },
  {
    name: 'COLPERCENTINDEX',
    syntax: '',
    description: {
      en: 'Index values for the column percentages (100 corresponds to the value in the total column)',
      de: 'Indexwerte zu den Spaltenprozenten (100 entspricht dem Wert in der Totalspalte)',
    },
  },
  {
    name: 'COLPERCENTINVRANK',
    syntax: '',
    description: {
      en: 'The ranking is based on COLPERCENT. The identity rules apply accordingly. The highest value gets the lowest rank.',
      de: 'Die Rangbildung basiert auf COLPERCENT, Die Regeln zur Identität gelten entsprechend. Der höchste Wert bekommt dem niedrigsten Rang.',
    },
  },
  {
    name: 'COLPERCENTIRANK',
    syntax: '',
    description: {
      en: 'see COLPERCENTINVRANK, but the lowest percentage value gets rank 1',
      de: 'siehe COLPERCENTINVRANK, aber der niedrigste Prozentwert bekommt den Rang 1',
    },
  },
  {
    name: 'COLPERCENTLINELIMIT',
    syntax:
      'COLPERCENTLINELIMIT = <number>;\nParallel to the option above, a row is suppressed if a cell has a column percent value of <number>.',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLPERCENTMEAN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLPERCENTPROJ',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLPERCENTRANK',
    syntax: '',
    description: {
      en: 'by the rank of the percentage value in the column, smallest value = rank 1',
      de: 'nach dem Rangplatz des Prozentwerts in der Spalte, kleinster Wert = Rang 1',
    },
  },
  {
    name: 'COLPERCENTSUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLPERCEQUAL',
    syntax: '',
    description: {
      en: 'Tests all column percentages in the column for equality; i.e. all deviations from the equal distribution are considered significant. This can of course produce a great many meaningless significances. Please use with care. COLPERCT* t-test on percentage differences: test based on ESS and column overlap',
      de: 'Testet alle Spaltenprozente in der Spalte auf Gleichheit; d.h. alle Abweichungen von der Ungleichverteilung werden als signifikant betrachtet. Hier besteht natürlich die Möglichkeit, sehr viele unsinnige Signifikanzen zu produzieren. Bitte mit Bedacht verwenden. COLPERCT* t-Test auf Prozentwertunterschiede: Test auf Basis von ESS und Spaltenüberlappung',
    },
  },
  {
    name: 'COLPERCHYMCNEMAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLPERCMCNEMAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLPERCSTDERR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLPERCT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLPERCTMINIMUM',
    syntax: 'COLPERCTMINIMUM = <number>;',
    description: {
      en: 'In the significance calculation using COLPERCT the column overlaps are taken into account. This method can lead to problematical significances if the number of overlaps is so high that there are only a few cases which do NOT occur in both columns which have been tested against each other.…',
      de: '',
    },
  },
  {
    name: 'COLPERCZ',
    syntax: '',
    description: {
      en: 'Column-wise test of the differences using the extended Z-test with arcsine correction',
      de: 'Spaltenweiser Test der Unterschiede in den erweiterte Z-Test mit Arcus-Sinus-Korrektur benutzt',
    },
  },
  {
    name: 'COLROWPERCENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLSFROMNAME',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLSUMPERCENT',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Output of the column percentaging of the sum of a third variable, e.g. the sum of expenditures for a particular purpose in particular city districts, etc.',
      de: 'Ausgabe der Spaltenprozentuierung der Summe einer dritten Variablen, z.B. die Summe von Ausgaben für einen bestimmten Zweck in bestimmten Stadtteilen etc.',
    },
  },
  {
    name: 'COLSUMPERCENTSUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLUMN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLUMNCOUNT',
    syntax: 'COLUMNCOUNT = <startcolumn> <endcolumn> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLUMNOFFSET',
    syntax: 'COLUMNOFFSET = <number> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLUMNPERCENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLUMNPERCENT100',
    syntax: '',
    description: {
      en: 'Column percentages modified by the Hare-Niemeyer method (sum equals 100). Note: not suitable e.g. for multiple-response variables and OVERCODEs, tables with suppressed MISSING VALUES and selectively built variables',
      de: 'Nach Hare-Niemeyer-Modell modifizierte Spaltenprozentwerte (Summe ergibt 100), Achtung: nicht geeignet bspw. für Mehrfachnennungsvariablen und OVERCODEs, Tabellen mit unterdrückten MISSING VALUES und selektiv gebildete Variablen',
    },
  },
  {
    name: 'COLUMNPERCENTRANGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLUMNPERCENTRANGELOWER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLUMNPERCENTRANGEUPPER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLUMNRANGE',
    syntax: '',
    description: {
      en: 'Output of a table with the lower and upper bounds of the confidence interval (5%) of column percentages. COLUMNPERCENTRANGE* confidence interval for column percentages. ROWPERCENTRANGE** confidence interval for row percentages',
      de: 'Ausgabe einer Tabelle mit den unteren und oberen Rändern des Konfidenzintervalls (5%) von Spaltenprozenten COLUMNPERCENTRANGE* Konfidenzintervall für Spaltenprozente ROWPERCENTRANGE** Konfidenzintervall für Zeilenprozente',
    },
  },
  {
    name: 'COLUMNS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLUMNSTRIPES',
    syntax: '',
    description: {
      en: 'If this TABLEFORMAT is set, the columns of tables are shaded, alternately with the colours declared in STRIPECOLORS.',
      de: 'Ist dieses TABLEFORMAT gesetzt, werden die Spalten von Tabellen farblich hinterlegt, und zwar abwechselnd mit den Farben, die in STRIPECOLORS vereinbart wurden.',
    },
  },
  {
    name: 'COLUMNSUMMARY',
    syntax:
      'COLUMNSUMMARY <targetcolumn> [ format "#,#..." ]\n= <function> [ <option>( {<sourcecolumn>}*n );\n<targetcolumn> ::= < varno code >\n<sourcecolumn> ::= < varno code >\n<function> ::= [ MEAN | SUM | MIN | MAX ]\n<option> ::= [ ZEROMISSING | DASHMISSING ]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COLUMNVARS',
    syntax: 'COLUMNVARS <nameprefix> = start - end [width];',
    description: {
      en: 'This is an alternative method of building a series of variables. The initial column of the variable becomes a component part of the name.',
      de: '',
    },
  },
  {
    name: 'COLUMNWIDTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMBINEDVAR',
    syntax: '',
    description: {
      en: 'COMBINEDVAR produces a VARFAMILY which contains all the individual characteristics of the individual variables next to each other. COMBINEDVAR X = Alter Geschlecht; produces for example a variable family with which a table can evaluate age and sex simultaneously next to one another. COMBINEDVAR is also suitable for allocating one variable to another including its VALUELABELS.',
      de: '',
    },
  },
  {
    name: 'COMMENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPACTADDRES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPARE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPAREVAR',
    syntax: 'COMPAREVAR <name> = <varlist> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPRESSCODEBOOK',
    syntax: 'COMPRESSCODEBOOK = [ YES | NO ];',
    description: {
      en: 'COMPRESSCODEBOOK = [ YES | NO ]; In the ASCII mode a list of CODEBOOKS can also be printed in a compressed form where a number of CODEBOOKS fit on to one page.',
      de: '',
    },
  },
  {
    name: 'COMPUT',
    syntax: 'COMPUT <result> = <arithmetic_expressiom>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE',
    syntax: 'COMPUTE LOAD <zielvar> = <varlist> ;',
    description: {
      en: 'allows the new calculation of variables by means of four basic arithmetical operations. New variables can be defined or existent variables can have their values changed. If there is a variable in the left half of the COMPUTE statement which the compiler does not yet recognise then it is produced. This is then valid as the "current" variable.…',
      de: 'Neuberechnung atomarer Variablen COMPUTE ADD Ergänzende Speicherung definierter Werte COMPUTE ALPHA Verknüpfung von String-Elementen COMPUTE ASCEND/DESCEND Sortierung der Werte (vor deren Übertrag in Zielvariable) COMPUTE CONCAT Verkettung von Labels und Textkonstanten COMPUTE COPY Kopieren von Variablenbereichen COMPUTE ELIMINATE Löschen einer definierten Wertemenge COMPUTE INIT Übertrag einer…',
    },
  },
  {
    name: 'COMPUTE ADD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE ALPHA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE ASCEND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE CONCAT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE COPY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE DESCEND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE ELIMINATE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE INIT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE LOAD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE REPLACE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE SHUFFLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE SORT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE SUBSTR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COMPUTE SWAP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONCATCSS',
    syntax: 'CONCATCSS = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONCATFILTERTEXTS',
    syntax: 'CONCATFILTERTEXTS = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONCATNUMTOSTR',
    syntax: 'CONCATNUMTOSTR <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONDENSESPSSGROUP',
    syntax: 'CONDENSESPSSGROUP = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONFIDENCERANGE',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Output of the confidence interval of an additional variable (two values on one line)',
      de: 'Ausgabe der Konfidenzintervalls einer zusätzlichen Variablen (zwei Werte auf einer Zeile)',
    },
  },
  {
    name: 'CONFIDENCERANGEPVALUE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONNECTEXCELCELLS',
    syntax: 'CONNECTEXCELCELLS <boxtype> : [YES|NO]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONTENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONTENTBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONTENTFILE',
    syntax: 'CONTENTFILE <option> = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONTENTKEY',
    syntax: 'CONTENTKEY = [ <text> | <VARIABLE> ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONTENTKEYTOPDF',
    syntax: 'CONTENTKEYTOPDF = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONTENTPAGE',
    syntax:
      'CONTENTPAGE = YES\nUSEFONT <font>\n[ TITLE <heading> USEFONT <font> ]\nMARGINS TOP <number> LEFT <number> BOTTOM <number>\nDISTANCE <number>\n;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONTINGENCY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONTINGENCYNONSTD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONTINUETITLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CONTROL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COPY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COPYCHART2POWERPOINT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COPYCHART2PP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COPYFILE',
    syntax: 'COPYFILE = <path>;',
    description: {
      en: 'The output of processed and perhaps altered data sets to an ASCII file. With exception of RECODEs, COMPUTEs etc. (see below) the content of the COPYFILE is identical to that of the DATAFILE. (for historical reasons the key word OUTFILE is accepted as a synonym.) (see also ASCIIOUT ALL;)',
      de: '',
    },
  },
  {
    name: 'COPYFILTER',
    syntax: '',
    description: {
      en: 'defines a variable (or list of variables) as filtered according to a condition: the filtered variables then never flow into the tables if the condition is FALSE. The most frequently used use is probably the filtering of questionnaires. This filtering can also be used to steer GESS input. SETFILTER is however also useful for limiting the valid range for VARGROUPS and VARFAMILY.…',
      de: '',
    },
  },
  {
    name: 'COPYLABELS',
    syntax: 'COPYLABELS <varlist> = Variable;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COPYTEXT',
    syntax: 'COPYTEXT <varlist> = <variable>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COPYTITLE',
    syntax:
      'COPYTITLE <varlist> = <variable>;\nAll variables in <varlist> (in some cases the last defined variable) contain a reference to the\nVARTITLE of <variable>.',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'COUNT',
    syntax:
      'COUNT <varlist> = ( <varlist> ) [ <logop> <number> | IN [ <number> :\nnumber ] ] ;\nlogop ::== [ EQ, NE, LT, LE, GT, GE ]',
    description: {
      en: 'tallies the frequency of preselected characteristics in a variable list.',
      de: '',
    },
  },
  {
    name: 'COUNTVALID',
    syntax: 'COUNTVALID <resultvars> = <varlist>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CPI',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CRAMERSV',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CROSS2VAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CROSSVAR',
    syntax: 'CROSSVAR <newvar> = <var1> <var2> ;',
    description: {
      en: 'Using CROSSVAR special variable families can be produced which contain all the characteristic combinations of all the variables involved. This can be used to present multiple cross tables in TABLE for example. If one were to define:…',
      de: '',
    },
  },
  {
    name: 'CSS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CSSCLASS',
    syntax: '',
    description: {
      en: 'Assignment of a CSS class for the HTML output, see Formatting 584',
      de: 'Vergabe einer CSS-Klasse für die HTML-Ausgabe, siehe Formatierung 584',
    },
  },
  {
    name: 'CSV',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CSVEXPORT',
    syntax:
      'CSVEXPORT = [ <filename> | "" ];\nNew implementation of the good old output of tables in CSV-Format (HG= ). All text components of the',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CSVEXPORTSINGLELINE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CSVINALPHA',
    syntax: 'CSVINALPHA = <namelist>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CSVINFILE',
    syntax:
      'CSVINFILE [ FILEKEY <key> ] [ <delimchar> ] [ ALLOWEMPTY ]\n= <filepath>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CSVINPROTOCOL',
    syntax: 'CSVINPROTOCOL = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CSVOUTFILE',
    syntax:
      'CSVOUTFILE = <name>;\n<name> can be a full path or just a file name. The file extension is',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CSVSPECIAL',
    syntax: 'CSVSPECIAL = <filepath>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CSVWEIGHT',
    syntax: 'CSVWEIGHT = <varname>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CSVWEIGHTOUT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CUMPERCENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CUMULATIVE',
    syntax: '',
    description: {
      en: 'Row-wise percentaged and cumulated',
      de: 'Zeilenweise prozentuiert und kumuliert',
    },
  },
  {
    name: 'CURRENTMILLIS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CXSERVER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'CXSERVERPORT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DASHMISSING',
    syntax: 'DASHMISSING = <char>;\nZEROMISSING = <char>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DATA',
    syntax:
      'DATA [ USEWEIGHT <weightvar> ] <method> <newvar>\n= <basevar> [ BY <groupvar> ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DATABOX',
    syntax: '',
    description: {
      en: 'Box around all DATACELLS that belong to the intersection of any two variables.',
      de: 'Kasten um alle DATACELLS, die zur Kreuzung jeweils zweier Variablen gehören.',
    },
  },
  {
    name: 'DATACELL',
    syntax: '',
    description: {
      en: 'Each individual data cell of the table',
      de: 'Jede einzelne Datenzelle der Tabelle',
    },
  },
  {
    name: 'DATAERRORDOCUMENTATION',
    syntax:
      'DATAERRORDOCUMENTATION [ VARIABLES <varlist> ]\n[errortype {<errortype>}*n ] = <filename>;\nerrortype ::= LABELS | RANGE | FILTER | NUMERIC | ALIGN',
    description: {
      en: 'ERRORTYPE EXCEPT NUMERIC FILTER VARIABLES EXCEPT numtest y1 to y11 = filename; In this case all variables that are read from the input would be checked, except "numtest" and the variables y1 to y11. All ERRORTYPEs would be checked except NUMERIC and FILTER, i.e. the check covers LABELS RANGE and ALIGN in terms of content.',
      de: 'ERRORTYPE EXCEPT NUMERIC FILTER VARIABLES EXCEPT numtest y1 to y11 = filename; In diesem Fall würden alle Variablen geprüft, die aus dem Input gelesen werden, bis auf "numtest" und die Variablen y1 bis y11. Es würden alle ERRORTYPE geprüft bis auf NUMERIC und FILTER, d.h. die Prüfung erstreckt sich inhaltlich auf LABELS RANGE und ALIGN.',
    },
  },
  {
    name: 'DATAFILE',
    syntax:
      'DATAFILE [ FILEKEY <key> ] [ ALLOWEMPTY ] = <filepath>;\nINFILE [ FILEKEY <key> ] [ ALLOWEMPTY ] = <filepath>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DATANOINTERPOL',
    syntax: 'DATANOINTERPOL = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DATE',
    syntax: '',
    description: {
      en: 'current date in the form YYYYMMDD as a number.',
      de: 'aktuelles Datum in der Form YYYYMMDD als Zahl.',
    },
  },
  {
    name: 'DATEFORMAT',
    syntax: 'DATEFORMAT = <string>;',
    description: {
      en: 'DATEFORMAT = <string>; In the string the letters Y, M and D are expanded to year, month and day. All other symbols are taken into the date. Thus: DATEFORMAT = "dd.mm.yyyy"; results in the standard European date: 31.10.2009',
      de: '',
    },
  },
  {
    name: 'DAYOFWEEK',
    syntax: '',
    description: {
      en: 'The weekday of a date in the form YYYYMMDD: 1=Monday, 2=Tuesday etc., so e.g. DAYOFWEEK( 20061030 ) = 1. WeekOfYear(x) week number (calendar week)',
      de: 'Der Wochentag eines Datums in der Form JJJJMMTT: 1=Montag, 2=Dienstag etc., also ist z.B. DAYOFWEEK( 20061030 ) = 1. WeekOfYear(x) Wochennummer (Kalenderwoche)',
    },
  },
  {
    name: 'DBASEIN',
    syntax: 'DBASEIN = <filename> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DEBUGSTOP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DECIMALPERCENT',
    syntax: 'DECIMALPERCENT = <number>;\nDefault: DECIMALPERCENT = 0;',
    description: {
      en: 'Defines the number of decimal places for the percentages in cross tables (TABLE) or comparative tables (COMPARE). DECIMALPERCENT settings are valid for all following tables until the next DECIMALPERCENT command. Example: DECIMALPERCENT = 1; Preset: DECIMALPERCENT = 0;',
      de: '',
    },
  },
  {
    name: 'DECIMALS',
    syntax: 'DECIMALS = <number>;\nDefault: DECIMALS = 0;',
    description: {
      en: 'The number of decimal places can be stipulated for variable output if no VALUELABEL has been allocated and PRINTALL=YES. It is also used for MEAN or SUM output. Example: DECIMALS = 2; The characteristics or rather sums or mean of all variables then defined have two decimal places after the comma. This is valid until the next DECIMALS command (see also:…',
      de: '',
    },
  },
  {
    name: 'DECRYPT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DEFAULTBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DEFAULTLEVEL',
    syntax: 'DEFAULTLEVEL = <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DELETELABELS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DELETEUNUSEDVARS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DELETEVARS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DELIMITED',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DELIMITEDIN',
    syntax:
      'DELIMITEDIN [ delim ] = <filename>;\ndelim ::= \'<char>\' | "<char>" | number [ 1..255 ]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DELTAEXPECT',
    syntax: '',
    description: {
      en: 'Output of the difference between the empirical cell count and the cell count expected from the marginal distribution',
      de: 'Ausgabe der Differenz zwischen der empirischen Zellenbesetzung und der nach der Randverteilung zu erwartenden Zellenbesetzung',
    },
  },
  {
    name: 'DELTAPERCENT',
    argsHint: '( Var, BasisVar )',
    syntax: '',
    description: {
      en: "The sums are calculated from 'Var' and 'BasisVar'. The difference is percentaged on 'BasisVar'.",
      de: "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Differenz wird auf die 'BasisVar' prozentuiert.",
    },
  },
  {
    name: 'DELTAPOINTS',
    argsHint: '( Var, BasisVar )',
    syntax: '',
    description: {
      en: "The sums are calculated from 'Var' and 'BasisVar'. The difference is percentaged on the number of valid cases.",
      de: "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Differenz wird auf die Zahl der gültigen Fälle prozentuiert",
    },
  },
  {
    name: 'DELTASUMPERCENT',
    argsHint: '( VarFamily )',
    syntax: '',
    description: {
      en: 'The VarFamily 274 must contain four individual variables. These each denote the numerator and denominator of a fraction. The sums are calculated over numerator and denominator, and on output the difference of the quotients is shown as a percentage value.',
      de: 'Die VarFamily 274 muss vier Einzelvariablen enthalten. Diese bezeichnen jeweils Zähler und Nenner eines Bruches. über Zähler und Nennen werden die Summen berechnet, und bei der Ausgabe wird die Differenz der Quotienten als Prozentwert ausgegeben.',
    },
  },
  {
    name: 'DESCEND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DESCRIPTION',
    syntax: 'DESCRIPTION [ CELLELEMENT ] = <text>;',
    description: {
      en: 'Example: DESCRIPTION MEAN = Mittel; Usually an explanation of the cell content is printed top left when using TABLE and there are standard texts for this in the system. If these texts are to be altered then the DESCRIPTION command is used, otherwise the texts can be switched off using TABLEFORMAT = NODESCRIPTION;',
      de: 'Änderung der Standardtexte zur Erklärung des Zelleninhalts in Kreuztabellen 355.',
    },
  },
  {
    name: 'DESCRIPTIONBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DESCRIPTIONSTRING',
    syntax: 'DESCRIPTIONSTRING = "<DESCRIPTION 1>|...|<DESCRIPTION n>";',
    description: {
      en: 'Alternatively a descriptive text can be explicitly set. Example: DESCRIPTIONSTRING = "Mittelwert|Absolut"; Individual rows are separated using a vertical line.',
      de: '',
    },
  },
  {
    name: 'DIALLERPROJECTKEY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DIALPREFIX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DICHOQ',
    syntax: 'DICHOQ <varname> =',
    description: {
      en: 'Variable groups can also be generated directly from the input without making the individual variables visible.',
      de: '',
    },
  },
  {
    name: 'DICTMODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DIRECTION',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DISPLAY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DISPLAYQUOTA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DISTANCE',
    syntax: 'DISTANCE INTERBOX [ X | Y ] <number> = <number>;',
    description: {
      en: '(PS): is ignored by line printers. Usually there are no gaps between the different boxes which make up the table. Spaces can however be defined in the X and the Y direction. Example: DISTANCE INTERBOX X = 13; DISTANCE INTERBOX Y = 13; In the standard form (see above) all spaces are set to the stipulated value. DISTANCE INTERBOX can also be differentiated: Valid for X:…',
      de: '',
    },
  },
  {
    name: 'DIV',
    syntax: '',
    description: {
      en: 'returns the result of an integer division',
      de: 'liefert das Ergebnis einer Integer-Division',
    },
  },
  {
    name: 'DLL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DOCODEBLOCK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DOCUMENT',
    syntax: 'DOCUMENT = "<text>";',
    description: {
      en: 'Specifies a document indicatorwhich appears at the bottom right under the tables. Example: DOCUMENT = "Demo 2009"; The key words DATE and/or TIME produce a date or time. TIME and DATE key words can be mixed with any number of strings. Example: DOCUMENT = "Auszählung vom" DATE " Zwischenstand" TIME; Valid for all tables. PS):…',
      de: 'Angabe einer Dokumentkennzeichnung, die rechts unten unter den Tabellen erscheint',
    },
  },
  {
    name: 'DOMACRO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DOSLOCKS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DOUBLECODEINOVERCODE',
    syntax: 'DOUBLECODEINOVERCODE = [YES | NO];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DOUGHNUT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'DRAWBOX',
    syntax:
      'DRAWBOX <boxname> =\n<number> { [ TOP | LEFT | RIGHT | BOTTOM | BOXRADIUS <number> ] }*n ;',
    description: {
      en: '(PS): is ignored by line printers.',
      de: '',
    },
  },
  {
    name: 'DUMMYHEAD',
    syntax: 'DUMMYHEAD = <name>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EDIT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EDITLABELINSCREEN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EDITOPENQ',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EFFECTIVEBASE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ELASTICITY',
    argsHint: '(PS)',
    syntax: 'ELASTICITY = <number>;',
    description: {
      en: 'Elasticity is a measurement of how the scaling in the X direction is allowed to differ from the scaling in the Y direction. Preset: ELASTICITY = 0.15; Background: Printing in Postscript offers the possibility to scale tables to fit which are larger than the available area on a page. This adjustment can be made independently in the X or the Y direction.…',
      de: '',
    },
  },
  {
    name: 'ELDAS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ELECTION',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ELEMENTCOLOR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ELEMENTFONT',
    syntax:
      'ELEMENTFONT <cellelement> : <fontname> SIZE <number>\n[STYLE [BOLD|ITALIC|UNDERLINE]]\nELEMENTCOLOR <cellelement> : <color>',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ELIMINATE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ELLIPSIS',
    syntax: '',
    description: {
      en: 'Show the confidence interval as an ellipse (when known)',
      de: 'Konfidenzintervall als Ellipse anzeigen (wenn bekannt)',
    },
  },
  {
    name: 'ELSE',
    syntax: '',
    description: {
      en: 'x = e / ( d + c ); The ELSE part of the command can be omitted, e.g. IF a EQ 3 THEN d = 5; Compared with the set operator IN easily allows the test for the existence of values in multi-response variables. The test can look like this: IF 4 IN famvar_01 THEN ... A variable must always be on the right side.…',
      de: "CONCAT neue = 'xx' '-' 'yy' '-' xx1 '-' x5; übersichtlicher ist oft die Verwendung von IFBLOCK/ELSEBLOCK/ENDBLOCK anstelle von IF/ELSE: IFBLOCK [ 2 3 ] IN x7 THEN COMPUTE CONCAT neue = 'aa' '-' 'bb' '-' xx1 '-' x5; COMPUTE SUBSTR PART = neue 1 20;",
    },
  },
  {
    name: 'ELSEBLOCK',
    syntax: '',
    description: {
      en: '//several computes/ifs etc. can appear here ENDBLOCK; The ELSEBLOCK component is optional. Affected by this logic are: all COMPUTE, all forms of IF (IF ... THEN, IF ... PRINT 48, IF ... LOAD), all RECODE, COUNT and MEAN. All other statements ignore the IFBLOCK directives. Several IFBLOCKs can be nested within each other.…',
      de: '//hier können mehrere computes/ifs etc stehen ENDBLOCK; Die Komponente ELSEBLOCK ist optional. Von dieser Logik betroffen sind: alle COMPUTEs, alle Formen von IF (IF ... THEN, IF ... PRINT 48, IF ... LOAD) alle RECODEs, COUNT und MEAN. Alle übrigen Statements ignorieren die IFBLOCK-Anweisungen. Mehrere IFBLOCKs können ineinander geschachtelt werden.…',
    },
  },
  {
    name: 'EMPTYSIGNDASH',
    syntax: '',
    description: {
      en: "Normally nothing is output in cases where all significance tests against all columns or rows have failed. With vertical alignment (ALIGN VCENTER) this can lead to undesirable appearance. If this TABLEFORMAT is set, a '-' is output in these cases so that all elements are at the same height.",
      de: "Im Normalfall wird in Fällen, wo alle Signifikanztests gegen alle Spalten bzw. Zeilen fehlgeschlagen sind, nichts ausgegeben. Da kann bei einem vertikalen Alignment (ALIGN VCENTER) zu unerwünschter Optik führen. Ist dies TABLEFORMAT gesetzt, wird in diesen Fälle ein '-' ausgegeben, damit alle Elemente auf derselben Höhe stehen.",
    },
  },
  {
    name: 'EMPTYTABLETEXT',
    syntax: 'EMPTYTABLETEXT = "<text>";',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ENCAPSULATED',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ENCODING',
    syntax: 'ENCODING CSVOUTFILE = [ ANSI | UTF8 ];',
    description: {
      en: 'As GESS tabs was born as a DOS program and some clients hate nothing more than a change in standard settings, the Char-Set-Encoding from DOS, i.e. IBM850 for North/Middle Europe is set as standard. This can be changed in two ways: the encoding can be explicitly defined using the ENCODING statement presented here.…',
      de: '',
    },
  },
  {
    name: 'ENCODING CSVOUTFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ENCRYPT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'END',
    syntax: 'END;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ENDBLOCK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ENDCODEBLOCK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ENDEXPORT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ENDFILTER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ENDMACRO',
    syntax: '',
    description: {
      en: 'Then the call #tab( var1 ) would work just as well as the call #tab( var1 var2 var3 var4 ). #IfExist and #IfNExist: with #IFEXIST and #IFNEXIST you can check whether a variable of this name already exists. Usage examples: an include file named "SETPAPER.INC" could e.g. contain the following instructions: #IFDEF A4 #IFDEF quer PAPER = Height 210 Width 297;',
      de: 'Dann würde der Aufruf von #tab( var1 ) ebenso funktionieren wie der Aufruf von #tab( var1 var2 var3 var4 ) #IfExist und #IfNExist Mit #IFEXIST und #IFNEXIST kann man abfragen, ob eine Variable dieses Namens bereits existiert. Anwendungsbeispiele Ein Include-File mit dem Namen "SETPAPER.INC" könnte z.B. folgende Anweisungen enthalten: #IFDEF A4 #IFDEF quer PAPER = Height 210 Width 297;',
    },
  },
  {
    name: 'ENFORCEUTF8INOPENQ',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ENFORCEUTF8INOPENQFILE',
    syntax: 'ENFORCEUTF8INOPENQFILE = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ENTIER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EPS',
    syntax:
      'EPS [ REPLACE | FOREGROUND ] = <FileName> <xPoints> <yPoints> [ [\nWIDTH | HEIGHT ] <Points> ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EQ',
    syntax: '',
    description: {
      en: 'Equal',
      de: 'Equal, ist gleich',
    },
  },
  {
    name: 'ERRORTYPE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ESS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ESSCOLCHIQU',
    syntax: '',
    description: {
      en: 'Column-wise 4-field chi-square test on percentage differences after conversion from ESS',
      de: 'Spaltenweise 4-Felder Chi²-Test auf Prozentwertunterschied nach Umrechnung aus ESS',
    },
  },
  {
    name: 'ESSCOLDEPTTEST',
    syntax: '',
    description: {
      en: 'Dependent t-test on mean differences after conversion to ESS.',
      de: 'Abhängiger t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS',
    },
  },
  {
    name: 'ESSMCNEMAR',
    syntax: '',
    description: {
      en: 'Dependent test on percentage differences per McNemar after conversion to ESS',
      de: 'Abhängiger Test auf Prozentwertunterschied nach McNemar nach Umrechnung auf ESS',
    },
  },
  {
    name: 'ESSMEANCOLDEPT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ESSMEANTEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ESSMEANWELCH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ESSROWCHICU',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ESSROWCHIQU',
    syntax: '',
    description: {
      en: 'Row-wise chi-square test based on the ESS conversion',
      de: 'Zeilenweiser Chi²-Test auf Basis der ESS-Umrechnung',
    },
  },
  {
    name: 'ESSROWMEANTEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ESSROWTTEST',
    syntax: '',
    description: {
      en: 'Independent t-test on mean differences after conversion to ESS, row-wise',
      de: 'Unabhängiger t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS, zeilenweise',
    },
  },
  {
    name: 'ESSTTEST',
    argsHint: '(Var)',
    syntax: '',
    description: {
      en: 'Independent t-test on mean differences after conversion to ESS',
      de: 'Unabhängiger t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS',
    },
  },
  {
    name: 'ESSWELCHTEST',
    syntax: '',
    description: {
      en: 'Independent Welch’s t-test on mean differences after conversion to ESS',
      de: 'Unabhängiger Welch’s t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS',
    },
  },
  {
    name: 'EST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EURO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EVALFAMVALONCE',
    syntax:
      'EVALFAMVALONCE <varlist> = YES or NO;\n(EvalFamValOnce = EVALuate FAMilyvariables VALues ONCE). Using VARFAMILYs it can make',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCEL2XLABELS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCEL2XTITLES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCEL2YLABELS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCEL2YTITLES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELALIGNH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELALIGNV',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELAXISMINMAX',
    syntax: 'EXCELAXISMINMAX = <minvalue> maxvalue> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELCALCROWHEIGHT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELCHART',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELCHARTDATA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELCHARTFORMAT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELCHARTINVERT',
    syntax: 'EXCELCHARTINVERT = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELCOLOR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELDOCUMENT',
    syntax: '',
    description: {
      en: 'Transfer the labelling of the table volume to Excel. If this TABLEFORMAT is set, numbers with decimal places are explicitly formatted to the number of decimal places',
      de: 'Kennzeichnung des Tabellenbandes in Excel übertragen. Wenn dies TABLEFORMAT gesetzt ist, werden Zahlen mit Nachkommastellen explizit auf die Zahl der Nachkommastellen',
    },
  },
  {
    name: 'EXCELFILENAME',
    syntax: 'EXCELFILENAME = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELFOOTER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELFRAMES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELGRAPHSHEETNAME',
    syntax: 'EXCELGRAPHSHEETNAME = <name>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELHEADER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELHIDEUPDATE',
    syntax: 'EXCELHIDEUPDATE = [ YES | NO ];',
    description: {
      en: 'If this option is set to YES the Excel interface is only showed by INSTANTEXCEL=YES if a table is finished. This can reduce the processing time for the transfer to Excel. To control the appearance of tables using INSTANTEXCEL: the following TABLEFORMATs are available:…',
      de: '',
    },
  },
  {
    name: 'EXCELLABELANGLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELNODISTANCE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELNOFONT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELNOWRAPTEXT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELNUMBERFORMAT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELONELINELABEL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELOUT',
    argsHint: '(out-dated)',
    syntax: 'EXCELOUT = <filename>;',
    description: {
      en: '(In many cases INSTANTEXCEL should be more practical)',
      de: '',
    },
  },
  {
    name: 'EXCELOUT AS HTML',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELOUT VIA HTML',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELOUTACROSS',
    syntax: '',
    description: {
      en: 'The atomic elements of composite CELLELEMENTS are shown side by side rather than one below the other in EXCELOUT.',
      de: 'Die atomaren Elemente von zusammengesetzten CELLELEMENTS werden bei EXCELOUT nicht untereinander, sondern nebeneinander dargestellt.',
    },
  },
  {
    name: 'EXCELPAGEBREAK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELPICTURE',
    syntax: '',
    description: {
      en: 'This key word is used to transfer an illustration (PNG-FILE or JPG-FILE) to an Excel table. This then appears above the table.',
      de: '',
    },
  },
  {
    name: 'EXCELRANGEDELIM',
    syntax: 'EXCELRANGEDELIM = <char>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELSTYLEFILE',
    syntax: 'EXCELSTYLEFILE = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELTEMPLATEFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCELUPDATEONLY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCEPT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCLUDEFROMTO',
    syntax: 'EXCLUDEFROMTO = { vartype }*n ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXCLUDEVALUES',
    syntax:
      'EXCLUDEVALUES <varlist> = <valuelist>;\nRESTRICTVALUES <varlist> = <valuelist>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXDECIMALCHAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXDELIMCHAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXECUTE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXP',
    syntax: '',
    description: {
      en: 'inverse function of LN',
      de: 'inverse Funktion zu LN',
    },
  },
  {
    name: 'EXPAND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXPANDATCHAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXPANDBOX',
    syntax: '',
    description: {
      en: 'If a shared block has been drawn around the data cells using DRAWBOX it often looks better if there is a vertical space before the first and after the last data row and the upper and lower frames. This space can be set using EXPANDHEIGHT; it should be noted that then the DATABOX is not congruent to the sum of the DATACELLs. (Only effective with Postscript-printouts). (PS)',
      de: 'Das TABLEFORMAT EXPANDBOX wird intern in EXPANDHEIGHT übersetzt. Also: TABLEFORMAT = + EXPANDBOX; bedeutet, dass die Höhe der Zellen erweitert werden soll.',
    },
  },
  {
    name: 'EXPANDHEIGHT',
    syntax: '',
    description: {
      en: 'If you draw a common block around the data cells with DRAWBOX, it often looks better if vertical space is created before the first and after the last data row towards the top and bottom edge. This margin can be requested with EXPANDHEIGHT; note that the DATABOX is then not congruent with the sum of the DATACELLs.…',
      de: 'Zeichnet man mit DRAWBOX einen gemeinsamen Block um die Datenzellen, sieht es häufig besser aus, wenn vor der ersten und nach der letzten Datenzeile ein vertikaler Zwischenraum zum oberen und unteren Rand geschaffen wird. Diesen Rand kann man mit EXPANDHEIGHT anfordern; zu beachten ist, dass dann die DATABOX nicht deckungsgleich ist mit der Summe der DATACELLs.…',
    },
  },
  {
    name: 'EXPANDINDOMACRO',
    syntax: 'EXPANDINDOMACRO = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXPANDMISSINGTEXT',
    syntax: 'EXPANDMISSINGTEXT = <string>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXPECT',
    syntax: '',
    description: {
      en: 'Output of the cell count expected from the marginal distribution',
      de: 'Ausgabe der nach der Randverteilung zu erwartenden Zellenbesetzung',
    },
  },
  {
    name: 'EXPLODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXPORTFILE',
    syntax: 'EXPORTFILE = [ <filename> | "" ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXTERNALJOB',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXTRAFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'EXTREME',
    syntax: '',
    description: {
      en: 'of the distribution (EXTREME) can be selected. Examples: TABLE = a MEAN( b ) BY c SORT MEAN PANE 2 EXTREME 20; // 20 from each end of the distribution. TABLE = a BY c SORT ABSOLUTE TOP 80; // the top 80',
      de: 'der Verteilung (EXTREME) können selektiert werden. Beispiele: TABLE = a MEAN( b ) BY c SORT MEAN PANE 2 EXTREME 20; // jeweils 20 von jedem Ende der Verteilung TABLE = a BY c SORT ABSOLUTE TOP 80; // die obersten 80',
    },
  },
  {
    name: 'FALLING',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FAMILYVAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FCOMPUTE',
    syntax: 'FCOMPUTE <varname> ....',
    description: {
      en: 'Parallel to the COMPUTE statement there is also FCOMPUTE, which tests the filters set with SETFILTER. FCOMPUTE is only used if all the filter conditions are true or if there is no filter.',
      de: '',
    },
  },
  {
    name: 'FIF',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FILEKEY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FILEPATH',
    syntax: 'FILEPATH "<filepath>"',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FILL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FILTER',
    syntax: 'FILTER <varlist> [ = <bedingung> | AS <varname> ] ;',
    description: {
      en: 'After each table element, local selections 330 can be made with FILTER <condition> |, for example: TABLE = V1 FILTER geschl EQ 1 | V1 FILTER geschl EQ 2 | BY V1 MEANTEST; SORT SORT [ DESCEND ] [ POSITION | ALPHA | CODE | Cellelement ] [ PANE <value> CODE <value> ] :…',
      de: 'Im Anschluss an jedes Tabellenelement können mit FILTER <Bedingung> | lokale Selektionen 330 vorgenommen werden, zum Beispiel: TABLE = V1 FILTER geschl EQ 1 | V1 FILTER geschl EQ 2 | BY V1 MEANTEST; SORT SORT [ DESCEND ] [ POSITION | ALPHA | CODE | Cellelement ] [ PANE <value> CODE <value> ] :…',
    },
  },
  {
    name: 'FIRSTCOLUMN',
    syntax: 'FIRSTCOLUMN : <number>',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FIXED',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FIXEDPOSITION',
    syntax: 'FIXEDPOSITION <VarList> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FIXLABELCOLUMN',
    syntax: 'FIXLABELCOLUMN : [YES|NO]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FIXLABELROWS',
    syntax:
      'FIXLABELROWS : <number>\nFIXLABELROWS will keep the <number> rows part of the table "fixed", so that it stays visible',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FLOWTEXT',
    syntax: 'FLOWTEXT <boxname> : [ YES | NO ]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FLT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FONT',
    syntax: 'FONT <fontname> CPI <number> = <ESC-String>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FONTNAME',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FOOTER',
    syntax: 'FOOTER = "text" [ LEFT | HCENTER | RIGHT | ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FOOTERBOX',
    syntax: '',
    description: {
      en: 'Box around the FOOTER, outside the table. FRAMEBOX X box around all FRAMECELL X. FRAMEBOX Y box around all FRAMECELL Y. FRAMECELL X box around individual data elements of the frame columns (elements of the X axis). FRAMECELL Y box around individual data elements of the frame rows (elements of the Y axis)',
      de: 'Kasten um den FOOTER, außerhalb der Tabelle FRAMEBOX X Kasten um alle FRAMECELL X FRAMEBOX Y Kasten um alle FRAMECELL Y FRAMECELL X Kasten um einzelne Datenelemente der Rahmenspalten (Elemente der X-Achse) FRAMECELL Y Kasten um einzelne Datenelemente der Rahmenzeilen (Elemente der Y-Achse)',
    },
  },
  {
    name: 'FORCELABELINPUT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FORCOUNTS',
    syntax:
      'FORCOUNTS <varname> = [ YES | NO ];\nFORHEADER <varname> = [ YES | NO ];\nFORMEANS <varname> = [ YES | NO ];',
    description: {
      en: 'Variable is primarily useful for frequency counts (table breakdown).',
      de: 'Variable ist vorrangig zur Häufigkeitsauszählung (Tabellenaufriss) sinnvoll.',
    },
  },
  {
    name: 'FOREGROUND',
    syntax: '',
    description: {
      en: 'Analogue to BACKGROUND and is used to shade the foreground which normally means the colour of the text.',
      de: 'Farbinformation 557 für Vordergrund (Schrift) und Hintergrund',
    },
  },
  {
    name: 'FOREHEADER',
    syntax: '',
    description: {
      en: 'Variable should preferably be shown in the table header.',
      de: 'Variable soll bevorzugt im Tabellenkopf dargestellt werden.',
    },
  },
  {
    name: 'FORHEADER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FORM',
    syntax: 'FORM : [BARS | COLUMNS | LINES | PIE]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FORMAT',
    syntax: 'FORMAT = "<formatstring>";',
    description: {
      en: 'Defines a format for the representation of a particular cell content. If for example a mean is to be a scale with an algebraic sign, a comma as decimal separator and two decimal places then the following would be written (formats should always be written in quotation marks (") ): FORMAT MEAN = "+#,##"; FORMAT recognises the following control characters:…',
      de: '',
    },
  },
  {
    name: 'FORMATIFLESS',
    syntax:
      'FORMATIFLESS <cellelement> [ IN <place> ] BY <type> <number> = <formatstring>;\ntype ::= < ABSOLUTE | PHYSICALRECORDS | VALIDN | ESS >\nplace ::= < DATACELL | FRAMECELL X | FRAMECELL Y >',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FORMEAN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FORMEANS',
    syntax: '',
    description: {
      en: 'Variable is suitable for numeric statistics. Syntax LiveTabs: for further processing of data records in GESS LiveTabs it is necessary that the special variable properties for GESS LiveTabs are also passed on in the SYNTAX include file. The LIVETABS argument for the SYNTAX 42 statement serves this purpose.',
      de: 'Variable eignet sich für numerische Statistiken. Syntax LiveTabs Für die Weiterverarbeitung von Datensätzen in GESS LiveTabs ist es notwendig, dass die speziellen Variableneigenschaften für GESS LiveTabs auch im SYNTAX-Include-File weitergegeben werden. Hierzu dient das LIVETABS-Argument für das SYNTAX 42 -Statement.',
    },
  },
  {
    name: 'FORMS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FRAMEBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FRAMECELL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FRAMECELL X',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FRAMECELL Y',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FRAMECOLOR',
    syntax: 'FRAMECOLOR : <color>',
    description: {
      en: 'The colour of the frames can also be defined using HSB or RGB as above. COLOR FOREGROUND or COLOR BACKGROUND With the COLOR statement DATACELLS and FRAMECELLS can be coloured depending on the value, e.g. all mean above a certain value are printed in red etc.',
      de: '',
    },
  },
  {
    name: 'FRAMECROSS',
    syntax: '',
    description: {
      en: 'The intersection of FRAMEBOX X and FRAMEBOX Y. FRAMETITLE X box around the label of FRAMEELEMENTS of the X axis (e.g. Total). FRAMETITLE Y box around the label of FRAMEELEMENTS of the Y axis (e.g. Total). FRAMETITLEBOX X box around all FRAMETITLE boxes of the X axis. FRAMETITLEBOX Y box around all FRAMETITLE boxes of the Y axis',
      de: 'Der Schnittpunkt von FRAMEBOX X und FRAMEBOX Y FRAMETITLE X Kasten um Bezeichnung von FRAMEELEMENTS der X-Achse (z.B. Insgesamt) FRAMETITLE Y Kasten um Bezeichnung von FRAMEELEMENTS der Y-Achse (z.B. Insgesamt) FRAMETITLEBOX X Kasten um alle FRAMETITLE-Boxes der X-Achse FRAMETITLEBOX Y Kasten um alle FRAMETITLE-Boxes der Y-Achse',
    },
  },
  {
    name: 'FRAMEELEMENTS',
    syntax:
      'FRAMEELEMENTS = [ ABSCOLUMN | ABSROW | PHYSICALCOLUMN\n| PHYSICALROW | TOTALCOLUMN | TOTALROW ] ;',
    description: {
      en: 'TABLETYPEs are allocated to specific frame elements of a table; thus e.g. a table with row percentages (TABLETYPE = ROWPERCENT;) has by default an absolute column ("No. of Cases") and a total row ("Total"). With the specification FRAMEELEMENTS frame elements can be specifically requested. The key words necessary are:',
      de: '',
    },
  },
  {
    name: 'FRAMEPOSITION',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FRAMETITLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FRAMETITLE X',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FRAMETITLE Y',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FRAMETITLEBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FREEZEALL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FREEZEFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FREEZESWITCH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FROZEN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'FROZENCODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GAMMA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GAUSS',
    syntax: '',
    description: {
      en: 'Show the confidence interval as a stylised Gauss curve',
      de: 'Konfidenzintervall als stilisierte Gausskurve anzeigen',
    },
  },
  {
    name: 'GAUSSO',
    syntax: '',
    description: {
      en: 'Show the confidence interval as a stylised Gauss curve (outline)',
      de: 'Konfidenzintervall als stilisierte Gausskurve anzeigen (outline)',
    },
  },
  {
    name: 'GE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GENERATELABELS',
    syntax: 'GENERATELABELS <varlist>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GEO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GEOMETRICMEAN',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'The geometric mean is the n-th root of the product of all individual values (defined only for positive numbers)',
      de: 'Das geometrische Mittel ist die n.-Wurzel aus dem Produkt aller Einzelwerte (nur für positive Zahlen definiert)',
    },
  },
  {
    name: 'GEORESTRICT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GESS',
    syntax:
      'GESS [ INCLUDE ] <qualifier> = <filename> [ COLSFROMNAME ]\n[ COLUMN <number> ]\n[ VARIABLES <varlist> ]\n[ CARD <number> ]\n[ BITGROUP <number> ]\n;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GESSCHART',
    syntax: '',
    description: {
      en: 'GESStabs Artist has been an integrated part of GESStabs since version 4.3.0.0. The keyword to invoke it is GESSCHART. Syntactically, GESSCHART is an option of the TABLE statement. With GESSCHART statements you can, following a TABLE statement, request the creation of charts whose content is assembled from selected values and texts of the table.…',
      de: 'GESStabs Artist ist ab Version 4.3.0.0 integrierter Bestandteil von GESStabs. Das Schlüsselwort zum Aufruf lautet GESSCHART. Syntaktisch ist GESSCHART eine Option zum TABLE-Statement. Mit GESSCHART-Statements kann man im Anschluss an ein TABLE-Statement die Anfertigung von Charts anfordern, die sich inhaltlich aus ausgewählten Werten und Texten der Tabelle zusammensetzen.…',
    },
  },
  {
    name: 'GESSCHARTCOLORS',
    syntax: 'GESSCHARTCOLORS = { <colorvalue> }*n ;\n<colorvalue> = $rrggbb',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GESSCHARTDATA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GESSCHARTFONT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GESSCHARTFORMAT',
    syntax: 'GESSCHARTFORMAT = { + | - <option> }*n ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GESSCHARTNUMFORMAT',
    syntax:
      "GESSCHARTNUMFORMAT = <formatstring>;\nDefault: GESSCHARTNUMFORMAT =' (#)';",
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GESSCHARTPRINTFILE',
    syntax: 'GESSCHARTPRINTFILE [ PS | PDF ] = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GETPRTSETUP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GETQUOTA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GETTABSETUP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GLOBALASALPHA',
    syntax: 'GLOBALASALPHA = [ YES | NO ];\nGLOBALOPENASALPHA = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GLOBALCELLMINIMUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GLOBALCOLMINIMUM',
    syntax: '',
    description: {
      en: 'Global preset for COLMINIMUM for all the following tables.',
      de: '',
    },
  },
  {
    name: 'GLOBALOPENASALPHA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GLOBALPHYSCELLMINIMUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GLOBALPRINTALL',
    syntax: '',
    description: {
      en: 'These options steer the output of unlabelled values. Usually unlabelled values are printed with a label generated from the numerical value. It can however be required to suppress outliers in the tables: unlabelled values are to be treated as outliers where necessary and not be printed. This is achieved using PRINTALL = NO or GLOBALPRINTALL = NO.…',
      de: '',
    },
  },
  {
    name: 'GLOBALROWMINIMUM',
    syntax: '',
    description: {
      en: 'Global preset for ROWMINIMUM for all following tables.',
      de: '',
    },
  },
  {
    name: 'GLOBALSORT',
    syntax: '',
    description: {
      en: 'Normally a SORT key word in a TABLE statement effects only the directly preceding dimension of a table: TABLE = #kopf by a b sort absolute descend',
      de: 'Normalerweise wirkt ein SORT-Schlüsselwort im TABLE-Statement nur auf die direkt vorangehende Dimension einer Tabelle angewandt, also z.B. nur die Ausprägungen einer Variable.Mit GLOBALSORT wird der Wirkungsbereich von SORT auf die gesamte Tabelle ausgedehnt. Dies ist vor allem bei Mittelwerttabellen etc. sinnvoll.',
    },
  },
  {
    name: 'GLOBALTABLEMINIMUM',
    syntax: 'GLOBALTABLEMINIMUM = <number>;',
    description: {
      en: 'There was a bug that caused the sub tables in TABLE ADD constructs to be individually tested against the TABLEMINIMUM. Now only the start table is tested. As the tally results of all the tables (incl. ADD) should really be taken the sum of all the FRAMECELLS is taken into account for the resultant table. More precisely:…',
      de: '',
    },
  },
  {
    name: 'GOTO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GRAPHAREA',
    syntax: 'GRAPHAREA = <x> <y> <width> <height> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GRAPHBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GRAPHLABELS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GRAPHLEGEND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GRAPHNUMBERS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GRAPHPROJECT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GRAPHTITLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GRAPHTYPE',
    syntax: 'GRAPHTYPE = <xlGraphname>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GRATAB',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GREATER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GROUP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GROUPCOUNTS',
    syntax: 'GROUPCOUNTS <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GROUPEDBARS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GROUPEDBARS3D',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GROUPEDBARSH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GROUPRECODE',
    syntax:
      'GROUPRECODE <recode> { / <recode> }*n [ ELSE = <number> ] ;\n<recode> ::= <valuelist> = <number>\n<valuelist> ::= [ <number> | <number> : <number> | <valuelist>',
    description: {
      en: 'Using GROUPRECODE group variables can also be recoded. Example: GROUPRECODE GRR 3=5; checks in the third variable of the group whether it is relevant and if yes the value of this variable is deleted and the fifth variable is set to TRUE. Instead of the constant RECODE value after the equals sign there can also be a variable name of a nuclear variable (see above).',
      de: '',
    },
  },
  {
    name: 'GROUPS',
    syntax:
      'GROUPS <varname> =\n{ | "label text ..." [ LEVEL <number> ] [ USEFONT <fontname> [ SIZE\n<number> ] ] : <logical condition> }*n ;',
    description: {
      en: 'If the individual (nuclear) variables from which the variable groups are to be formed are not yet present then the GROUPS command is often the more practical alternative as the naming and the more complex rules for forming groups can be formulated more clearly in the GROUPS command.…',
      de: '',
    },
  },
  {
    name: 'GROUPVAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'GT',
    syntax: '',
    description: {
      en: 'Greater Than',
      de: 'Greater Then, größer als',
    },
  },
  {
    name: 'HARMONICMEAN',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'The harmonic mean: the reciprocal of the mean of the reciprocals (defined only for positive numbers). Used in special cases, e.g. as a mean over speeds, etc.',
      de: 'Das harmonische Mittel: Kehrwert aus dem Mittelwert der Kehrwerte (nur für positive Zahlen definiert). Findet in speziellen Fällen Anwendung, z.B. als Mittelwert über Geschwindigkeiten etc.',
    },
  },
  {
    name: 'HCENTER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HEADER',
    syntax: 'HEADER = "<text>" [ LEFT | HCENTER | RIGHT ] ;',
    description: {
      en: 'VARIABLE a1 : v1 = a2 ; It is the XTAB version of a very simple TABLE statement: TABLE = a1 BY a2; The command looks cumbersome mainly because the variable a2 is passed on using an internal construct (a local table variable v1) which already has been allocated after the ROW key word.…',
      de: 'VARIABLE a1 : v1 = a2 ; ist die XTAB-Version des ganz einfachen TABLE-Statements: TABLE = a1 BY a2; Die Anweisung sieht vor allem deshalb etwas umständlich aus, weil die Variable a2 über ein internes Konstrukt, eine lokale Tabellenvariable (v1), übergeben wird, die vorher am Anschluss an das ROWS-Schlüsselwort vereinbart wird.…',
    },
  },
  {
    name: 'HEADERBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HEADERS',
    syntax: 'HEADERS = <tablepart> { / <tablepart> }*n;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HEIGHT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HELPTEXT',
    syntax:
      'HELPTEXT <VarList> = "text text ";\nDefines a help text which can be called up during CATI/CAPI or Data Entry (F1 = help button).',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HG',
    argsHint: '(out-dated)',
    syntax: 'HG = [ <HGFileName> | "" ];',
    description: {
      en: '(is also carried out in Postscript output)',
      de: '',
    },
  },
  {
    name: 'HGASPRINT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HGDECIMALCHAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HGDELIMCHAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HGINVERSE',
    syntax: '',
    description: {
      en: 'Preset: HGINVERSE = NO; The data rows for all tables are transferred to HG in the same form as they are in the table, apart from with COMPARE. COMPARE tables are the exception. In order to organise the values in a STACKED BAR the data matrix in the standard case is inverted before the transfer to HG.…',
      de: '',
    },
  },
  {
    name: 'HIDDEN',
    argsHint: '( <medium> )',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HIDDENTOVARLIST',
    syntax: 'HIDDENTOVARLIST = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HIGHSIGNIFICANCE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HISTORY',
    syntax:
      'HISTORY =\n[ DATABOX <x> <y> ] FORMAT ( <formatlist> ) DATA [ abslist ] {\n<number> : <datalist> }*n;\nformatlist ::= [ ABSROW | ABSCOLUMN |\nPHYSROW PHYSCOLUMN TOTALROW ] { <number> }*n\nabslist ::= { <number> }*n',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HMTL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HORIZONTAL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HORIZONTALALIGN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HOTIMPORT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HOTKEY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HSB',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HTML',
    syntax:
      'HTML = [ <filename> | "" ];\nA HTML version of the relevant tables is stored in the file <filename>.html. Additionally a file called\n<filename>_frames.html is produced. If this is represented in a browser the browser interface is',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HTML2EXCELDECCHAR',
    syntax: "HTML2EXCELDECCHAR = <char>;\n<char> = '.' | ','",
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HTML2EXCELFLOWTEXT',
    syntax: 'HTML2EXCELFLOWTEXT <boxtype> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HTMLBACKGROUND',
    syntax: '',
    description: {
      en: 'The background and foreground colours of tables in HTML can be influenced in the script using the two HTML-specific representation elements: Example: RGB = YES; HTMLBACKGROUND TABLE = <red> <green> <blue>; HTMLBACKGROUND DEFAULTBOX = <red> <green> <blue>; The RGB values are, as is usual in GESS, designated in figure ranges from 0 - 1.…',
      de: '',
    },
  },
  {
    name: 'HTMLCHART',
    syntax:
      'HTMLCHART <options> = <cells>;\n<options> ::= [ TITLE <string> | FORM <form> | OPTION STACKED\n| LINETENSION <number> | HTMLCHARTWIDTH = <number>;\n| WIDTH <number> | CELLELEMENT <cellelement>\n| LEGENDPOSITION [ LEFT | RIGHT | TOP | BOTTOM ] ] [ INVERSE ]\n<cells> ::= [ | ROWS <rows> ] [ | COLUMNS <columns> ]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HTMLCHARTWIDTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HTMLDOCUMENT',
    syntax: '',
    description: {
      en: 'transfers the information of the DOCUMENT box into the HTML output.',
      de: 'überträgt die Informationen der DOCUMENT-Box in die HTML-Ausgabe.',
    },
  },
  {
    name: 'HTMLFLOWTEXT',
    syntax: 'HTMLFLOWTEXT <boxtype> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HTMLFOOTER',
    syntax: '',
    description: {
      en: 'With these TABLEFORMATs the relevant information can be fed into the HTML output.',
      de: 'überträgt die Informationen der FOOTER-Box in die HTML- Ausgabe.',
    },
  },
  {
    name: 'HTMLFOREGROUND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HTMLHEADER',
    syntax: '',
    description: {
      en: 'transfers the information of the HEADER box into the HTML output.',
      de: 'überträgt die Informationen der HEADER-Box in die HTML- Ausgabe.',
    },
  },
  {
    name: 'HYCOLCHIQU',
    syntax: '',
    description: {
      en: 'Hybrid chi-square test (weighted and unweighted)',
      de: 'Hybrider Chi²-Test (gewichtet und ungewichtet)',
    },
  },
  {
    name: 'HYCOLDEPTTEST',
    syntax: '',
    description: {
      en: 'Hybrid t-test for dependent data. The t-value ( Var ) is determined on the basis of the weighted data; the t-test is carried out on the basis of the unweighted degrees of freedom',
      de: 'Hybrid ausgestalteter t-Test für abhängige Daten. Der t- ( Var ) Wert wird auf der Basis der gewichteten Daten ermittelt, der t- Test erfolgt auf der Basis der ungewichteten Freiheitsgrade',
    },
  },
  {
    name: 'HYCOLZ',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HYMCNEMAR',
    syntax: '',
    description: {
      en: 'McNemar hybrid: the proportion of discordant pairs is determined from the weighted data. From the weighted proportion of discordant pairs, hypothetical unweighted frequencies are derived for them. These then form the basis of the McNemar test.',
      de: 'McNemar hybrid: aus den gewichteten Daten wird der Anteil der diskordanten Paare ermittelt. Aus dem gewichtet ermittelten Anteil der diskordanten Paare werden hypothetische ungewichtete Häufigkeiten für diese ermittelt. Diese bilden dann die Grundlage des McNemar-Tests.',
    },
  },
  {
    name: 'HYMEANCOLDEPT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HYMEANTEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HYMEANWELCH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HYPERLINK',
    syntax: 'HYPERLINK = <URI> <text> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HYROWCHIQU',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HYROWMEANTEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HYROWTTEST',
    syntax: '',
    description: {
      en: 'Hybrid, row-wise t-test: the t-values are computed on the basis of the weighted data; the degrees of freedom for computing the p-values of the t-distribution are derived from the unweighted frequencies.',
      de: 'Hybrider, zeilenweiser t-Test: Die t-Werte werden auf Basis der gewichteten Daten errechnet, die Freiheitsgrade zur Berechnung der p-Werte der t-Verteilung ergeben sich aus den ungewichteten Häufigkeiten.',
    },
  },
  {
    name: 'HYROWZ',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'HYTTEST',
    argsHint: '(Var )',
    syntax: '',
    description: {
      en: 'Hybrid t-test: the t-values are computed on the basis of the weighted data; the degrees of freedom for computing the p-values of the t-distribution are derived from the unweighted frequencies.',
      de: 'Hybrider t-Test: Die t-Werte werden auf Basis der gewichteten Daten errechnet, die Freiheitsgrade zur Berechnung der p-Werte der t-Verteilung ergeben sich aus den ungewichteten Häufigkeiten.',
    },
  },
  {
    name: 'HYWELCHTEST',
    syntax: '',
    description: {
      en: 'Hybrid t-test on mean differences per Welch on the basis of the weighted data',
      de: 'Hybrider t-Test auf Mittelwerteunterschiede nach Welch auf Basis der gewichteten Daten',
    },
  },
  {
    name: 'IBMGRAPHICS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IDENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IDENTCHIQNOSIGNIF',
    syntax: '',
    description: {
      en: 'When a variable is tabulated against itself, the counts are of course highly significant but meaningless. This suppresses the output of the significance marking.',
      de: 'Wenn man eine Variable gegen sich selbst tabelliert, sind die Besetzungen natürlich hochsignifikant, aber aussageleer. Die Ausgabe der Signifikanzkennzeichnung kann hiermit unterdrückt werden.',
    },
  },
  {
    name: 'IF',
    syntax:
      'IF <logical condition> PRINT "ErrorText" <varlist> [ GOTO <varname> ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IFASFIF',
    syntax: 'IFASFIF = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IFBLOCK',
    syntax: 'IFBLOCK <condition> THEN',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IGNOREASCOUTDUPL',
    syntax: 'IGNOREASCOUTDUPL = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IGNORECASEINCOMPARE',
    syntax: 'IGNORECASEINCOMPARE = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IGNOREDOUBLECASENO',
    syntax: 'IGNOREDOUBLECASENO = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IGNOREMISSING',
    syntax: 'IGNOREMISSING = [ YES | NO ];\nPreset: IGNOREMISSING = NO;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IGNOREMULTIQOVERFLOW',
    syntax: 'IGNOREMULTIQOVERFLOW = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IGNOREPREQUOTAIFAPPO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IGNOREPREQUOTAIFFROZEN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IGNORESETFILTER',
    syntax: 'IGNORESETFILTER = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IGNORESPSSMISSINGVALUES',
    syntax: 'IGNORESPSSMISSINGVALUES = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IGNORESPSSSYSMISVAL',
    syntax: 'IGNORESPSSSYSMISVAL = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IGNORETABINTEXT',
    syntax: 'IGNORETABINTEXT = [ yes | no ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IMAGEBUTTONS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IMAGESCALE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IN',
    syntax: '',
    description: {
      en: 'Inclusion of value sets / ranges. Logical connectives are possible with:',
      de: 'Einschluss von Wertemengen/-bereichen Logische Verknüpfungen sind möglich mit:',
    },
  },
  {
    name: 'INCH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INCLUDE',
    syntax: 'INCLUDE = <filename.inc>;',
    description: {
      en: 'Defines an INCLUDE file. Commands from the INCLUDE file are interpreted as if they were in place of the INCLUDE commands. Example: INCLUDE = VARNAME.def; INCLUDE = Labels.def; This can be used for example to administrate the variable definitions and the VALUELABELS in different files so that changes in the column positions etc only have to be changed in the definition part. In the',
      de: '',
    },
  },
  {
    name: 'INCLUDETITLEINTEXT',
    syntax:
      'INCLUDETITLEINTEXT <varlist> = [ YES | NO ];\nFor all variables listed in <varlist>, the VARTEXT is extended by the content of',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INCLUDEVALUES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INDENTAUTOOVERSORT',
    syntax: 'INDENTAUTOOVERSORT = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INDEPENDENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INDEXCHARS',
    syntax: 'INDEXCHARS = "<letters | characters>";',
    description: {
      en: 'e.g. INDEXCHARS = "GEHT"; allocates a (small or large) G to the first test column, an E to the second, an H to the third and a T to the fourth. The letters A – Z are preset. TESTCOLUMNS are taken into account. The letters A – Z can initially be used as INDEXCHARS to deal with 26 columns.…',
      de: '',
    },
  },
  {
    name: 'INDEXSTYEFILE',
    syntax: 'INDEXSTYEFILE = <name>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INDEXSTYLEFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INDEXVAR',
    syntax: 'INDEXVAR <name> = <varlist> BY <variable>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INFOBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INHERITBACKGROUND',
    syntax:
      'INHERITBACKGROUND [ X | Y ] = [ YES | NO ];\nINHERITFOREGROUND [ X | Y ] = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INHERITFONT',
    syntax: 'INHERITFONT [ X | Y ] = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INHERITFOREGROUND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INIT',
    syntax: 'INIT <varlist> = <value list>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INPUTTASK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INSERT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INSTANTEXCEL',
    syntax: 'INSTANTEXCEL = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INSTANTPDF',
    syntax: 'INSTANTPDF = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INSTITUTION',
    syntax: 'INSTITUTION = "<text>";',
    description: {
      en: 'Specifies the printing of the name of the institute added at the bottom left edge. The valid text is expanded to the right. Repeated use of the INSTITUTION statements can lead to meaningless results. (PS): this text can have more than one line in output from Postscript printers with the backslash marking the end of a row.',
      de: 'Angabe einer Textergänzung für den links unten eingedruckten Instituts- Namen',
    },
  },
  {
    name: 'INTERBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INTERCELL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INTERVALS',
    syntax:
      'INTERVALS <newvar> = <sourcevar> { | <labeltext> :\n<comparison> <comparevalue> }*n;\n<comparison> ::= [ LT | GT | LE | GE ]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INTERVIEWER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INTRO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INUSECODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INVERSE',
    syntax: 'INVERSE : [YES | NO]',
    description: {
      en: '',
      de: 'CHARTTITLE "Eine GESStabsArtist Graphik auf der Basis der Mittelwerte aus der OVERVIEW-Tabelle\\CELLELEMENT MEAN" CELLELEMENT MEAN',
    },
  },
  {
    name: 'INVERTFILEWEIGHTOUT',
    syntax: 'INVERTFILEWEIGHTOUT = <variable>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INVERTIN',
    syntax: 'INVERTIN = <path>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INVERTOUT',
    syntax: 'INVERTOUT = <path>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INVERTOUTMAX',
    syntax: 'INVERTOUTMAX = <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INVERTOUTVARS',
    syntax: 'INVERTOUTVARS [ KEEPVARS | DELETEVARS ] = <varlist>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'INVINDEXVAR',
    syntax: 'INVINDEXVAR <name> = <varlist> BY <variable>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IOCHECK',
    syntax: 'IOCHECK = [ ASCIIIN | ASCIIOUT | COLBININ | COLBINOUT ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'IS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ITALIC',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ITEM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'JSON',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'KEEP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'KEEPVARS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'KEY',
    syntax:
      'KEY OPENQFILE = <varname> ;\nAs a rule the CASENUMBER is used for this; but you can use any variable as a\nkey in OpenQFiles. This variable must be atomic; it may, however, also be of type',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'KEYDUMP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'KEYWORD',
    syntax: '',
    description: {
      en: 'Syntax structures are presented as follows: this is the basic syntax structure of a GESStabs feature. Example syntax excerpts look accordingly: this is an example syntax section. Introduction to tabulation',
      de: 'Syntaxstrukturen werden so aufgeführt: Dies ist die grundsätzliche Syntaxstruktur einer GESStabs-Funktionalität. Beispielhafte Syntaxausschnitte sehen entsprechend aus: Dies ist ein beispielhafter Syntaxabschnitt Einführung in die Tabellierung',
    },
  },
  {
    name: 'KNOWN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELFORMAT',
    syntax: 'LABELFORMAT <varlist> = <string>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELFROMFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELRECODE',
    syntax: 'LABELRECODE = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELS',
    syntax: 'LABELS : [0 | 1 | 2]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELS AS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELS COPY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELS X',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELS Y',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELSET',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELSPACE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELSTOTITLE',
    syntax: 'LABELSTOTITLE <labelcode> = <varlist>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELVALUE',
    syntax: 'LABELVALUE <numvariable> = <variable>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LABELWIDTH',
    syntax: 'LABELWIDTH : <number>\nCOLUMNWIDTH : <number>',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LANDSCAPE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LANGUAGES',
    syntax: 'LANGUAGES = <csv-file-name>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LASTVERSION',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LATIN1',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LEADINGZEROS',
    syntax: 'LEADINGZEROS = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LEFT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LEFTMARGIN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LEGENDPOSITION',
    syntax: 'LEGENDPOSITION : [TOP | BOTTOM | LEFT | RIGHT]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LESS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LEVEL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LINE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LINEBUFFER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LINECOLOR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LINEDASH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LINEFEEDCHAR',
    syntax: '',
    description: {
      en: 'Forces a line break in VALUELABELS or VARTITLE. Default: \\',
      de: 'Erzwingt in VALUELABELS oder VARTITLEs einen Zeilenumbruch. Voreinstellung: \\',
    },
  },
  {
    name: 'LINEFEEDFACTOR',
    syntax: 'LINEFEEDFACTOR = <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LINES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LINES3D',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LINESWITHSYMBOLS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LINETENSION',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LINEWIDTH',
    syntax: '',
    description: {
      en: 'The thickness of the border line. 0.0 = no border.',
      de: 'Die Dicke des Umrandungsstrichs. 0.0 = keine Umrandung.',
    },
  },
  {
    name: 'LIST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LISTFILE',
    syntax: 'LISTFILE = <filename>;',
    description: {
      en: 'Normally the interpretation of the commands is logged on the screen. This log or parts of it can be directed into a file which is declared as a LISTFILE. Example: LISTFILE = Tables.Err; If the interpretation is to appear back on the screen as of a certain point this can be achieved using: LISTFILE = con;',
      de: '',
    },
  },
  {
    name: 'LISTON',
    syntax:
      'LISTON = NO;\nSwitches the log for the interpretation of commands off completely, LISTON = YES; (preset) switches it',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LISTVARS',
    syntax: 'LISTVARS= <filename> [ options ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LITERAL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LIVETABS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LOAD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LOCAL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LOCALCONTENT',
    syntax: '',
    description: {
      en: 'During printing the information is taken from the locally set cell contents and not from FRAME.',
      de: 'Bei der Druckausgabe wird nicht die Information aus dem FRAME, sondern der lokal ermittelte Zelleninhalt berücksichtigt.',
    },
  },
  {
    name: 'LOCALTEXTFORMAT',
    syntax:
      'LOCALTEXTFORMAT <#<char> <option> ;\n<char> ::= freely chosen char (case-sensitive)\n<option> ::= [ FOREGROUND <color> | USEFONT <fontname> SIZE\n<size> ]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LOCKMETHOD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LONGVARTITLE',
    syntax: '',
    description: {
      en: 'Ensures that the VARTITLE in the table Y-Axis is not broken up. Should only be used if no DRAWBOX for VARTITLE Y has been defined. Otherwise it looks stupid! (Only PS)',
      de: 'Sorgt dafür, dass VARTITLE in Tabellen in der Y-Achse nicht umgebrochen werden. Sollte man nur anwenden, wenn keine DRAWBOX für VARTITLE Y definiert ist - kann sonst blöd aussehen. (Hat nur bei Postscript-Ausgabe Effekt).',
    },
  },
  {
    name: 'LOWERCASE',
    syntax:
      'LOWERCASE <char> = <char>;\n<char> ::= [ x | \'x\' | "x" | <number> ]\nx ::= A .. Z, a .. z\nnumber ::= 1 .. 255\nNormally only the letters A – Z can be used in INDEXCHARS, as there are only signs (ASCII Code < 128)',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LOWSIGNIFICANCE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LPI',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'LSLICE',
    syntax: '',
    description: {
      en: 'split into individual tables. TABLE = a BY b SORT ABSOLUTE DESCEND SLICE 15; This splits a table with e.g. 55 individual items in the variable b into 4 pages. If a split would produce a leftover page with only one response, this response is printed on the previous page. A table with 61 items would thus be printed on 4 and not on 5 pages.',
      de: 'von Einzeltabellen zerlegen. TABLE = a BY b SORT ABSOLUTE DESCEND SLICE 15; Hiermit wird eine Tabelle mit z.B. 55 Einzelitems in der Variablen b in 4 Seiten zerlegt. Falls eine Zerlegung eine Restseite mit nur einer Nennung ergeben würde, wird diese Nennung mit auf die Vorseite gedruckt. Eine Tabelle mit 61 Items würde also auf 4 und nicht auf 5 Seiten gedruckt.',
    },
  },
  {
    name: 'LT',
    syntax: '',
    description: {
      en: 'Lower Than',
      de: 'Lower Then, kleiner als',
    },
  },
  {
    name: 'MACRO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MACROPROTOCOL',
    syntax: 'MACROPROTOCOL = <filename> [ DOMACRO ] ;',
    description: {
      en: 'Sometimes it is not so easy to find the cause of a syntax error when working with complex macros; only the macro commands can be seen in the source text and not the expanded product. For this reason it is possible to export the expanded macros into a text file where it is easier to check them.',
      de: '',
    },
  },
  {
    name: 'MACROPROTOKOLL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAKE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAKEFAMILY',
    syntax: 'MAKEFAMILY <name> = <value>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAKEFILTER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAKEGROUP',
    syntax: 'MAKEGROUP <name> = <value>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAKESELECT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAKESINGLE',
    syntax: 'MAKESINGLE <newvar> [ = <arithm.expression> ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAKESINGLES',
    syntax: 'MAKESINGLES <newvarlist> [ = <sourcelist> ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAKETABFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MARGINS',
    syntax:
      'MARGINS = LEFT <number> RIGHT <number> TOP <number> BOTTOM <number> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MARKCELLEXCELSPECIAL',
    syntax: 'MARKCELLEXCELSPECIAL = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MARKCELLS',
    syntax:
      'MARKCELLS = [ YES | NO ] [ COLOR {colors}*6 | CELLELEMENTS\n<cellelement> ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MARKCELLSLEVEL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MARKCELLSMETHOD',
    syntax:
      'MARKCELLSMETHOD = [ CLASSIC | COLCHIQU | ROWCHIQU\n| HYCOLCHIQU | HYROWCHIQU ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MARKMEANCOL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MARKMEANROW',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAX',
    syntax: 'MAX <varname> = <varlist>;',
    description: {
      en: 'Max value. In its simplest form a DATA statement reads e.g.: DATA MEAN GlobMeanQ1 = Q1; The variable Q1 in the example must exist. As a result, the new atomic variable "GlobMeanQ1" is then available in the tabulation process. Its value is the global mean of Q1 over all cases read in.…',
      de: 'Max-Wert In der einfachsten Form lautet ein DATA-Statement z.B.: DATA MEAN GlobMeanQ1 = Q1; Die Variable Q1 in dem Beispiel muss existieren. Als Resultat steht dann im Tabellierungsprozess die neue atomare Variable "GlobMeanQ1" zur Verfügung. Ihr Wert ist der globale Mittelwert von Q1 über alle eingelesenen Fälle.…',
    },
  },
  {
    name: 'MAXCODEBOOKLINES',
    syntax: 'MAXCODEBOOKLINES = <number>;\nDefault: MAXCODEBOOKLINES = 50;',
    description: {
      en: 'Determines the maximum number of rows per page in a CODEBOOK table. Preset: MAXCODEBOOKLINES = 50; The following TABLEFORMATs are valid for CODEBOOK tables:',
      de: '',
    },
  },
  {
    name: 'MAXCOLSPERTABLEPAGE',
    syntax: 'MAXCOLSPERTABLEPAGE = <number>;\nMAXROWSPERTABLEPAGE = <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAXIMUMWEIGHT',
    syntax: 'MAXIMUMWEIGHT = <number>;\nMINIMUMWEIGHT = <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAXIMUMWFACT',
    syntax: 'MAXIMUMWFACT = <number>;\nMINIMUMWFACT = <number>;',
    description: {
      en: 'Preset for the control of weighting. MINIMUMWEIGHT and MAXIMUMWEIGHT set the minimum or maximum weight of a case. MINIMUMWFACT and MAXIMUMWFACT set a limit for the factorial alteration of the weight per iteration cycle. Preset: MAXIMUMWEIGHT = 1E+20; MINIMUMWEIGHT = 0; MAXIMUMWFACT = 1E+20; MINIMUMWFACT = 0; (usually no limitations)',
      de: '',
    },
  },
  {
    name: 'MAXINDEX',
    syntax:
      'MAXINDEX <resultvar> = <varlist>;\nMININDEX <resultvar> = <varlist>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAXLABELWIDTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAXLINELENGTH',
    syntax: '',
    description: {
      en: '<historisch> Defines the maximum length of a row in the input file. Maximum: 50000. Preset: 3000. By designating a lower MAXLINELENGTH storage memory can be saved which can be used for other purposes e.g. for tables. This is particularly relevant if there is a data set in which the cases are made up of many short rows (see CARDS).…',
      de: '',
    },
  },
  {
    name: 'MAXPREQUOTATRIES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAXROWSPERTABLEPAGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAXTABLEWIDTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MAXWEIGHTITERATIONS',
    syntax: 'MAXWEIGHTITERATIONS = <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MCNEMAR',
    syntax: '',
    description: {
      en: 'Dependent test on percentage differences per McNemar',
      de: 'Abhängiger Test auf Prozentwertunterschiede nach McNemar',
    },
  },
  {
    name: 'MEAN',
    argsHint: '( … )',
    syntax: 'MEAN <varname> = <varlist>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MEAN_PHYS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MEANCOLDEPT',
    syntax: '',
    description: {
      en: 'Printing of mean and the dependant t-test in one cell (per column) For all these CELLELEMENTS described in the above table the following options are available: SIGNIFLEVEL, SIGNIFTEXT, SHOWSIGNIF, TESTCOLUMNS and INDEXCHARS. Furthermore using a special variant of the COLOR statements a cell which has been appointed a letter due to significance can also be colour-coded.',
      de: '',
    },
  },
  {
    name: 'MEANCOLINDEX',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Column-wise display of the mean as an index on the base of 100, each relative to the mean in the total column',
      de: 'Spaltenweise Darstellung des Mittelwertes als Index auf der Basis 100, jeweils auf den Mittelwert in der Totalspalte bezogen',
    },
  },
  {
    name: 'MEANCUT',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Special mean: MEANCUT cuts off the extreme values at the lower and upper end of the distribution and computes the mean on the basis of the remaining distribution per cell. If the extreme group cannot be formed from whole cases, proportional weighting is used. The size of the extreme sections is defined in percentage points:…',
      de: 'Spezieller Mittelwerte: MEANCUT schneidet am unteren und oberen Ende der Verteilung die Extremwerte ab, und berechnet den Mittelwert auf der Basis der verbleibenden Verteilung je Zelle. Kann die Extremgruppe nicht aus ganzen Fällen gebildet werden, wird anteilige Gewichtung verwendet. Die Größe Extremabschnitte wird in Prozentpunkten definiert:…',
    },
  },
  {
    name: 'MEANDESCRIPTION',
    syntax: '',
    description: {
      en: 'Replaces the variable name with a description string e.g. "mean" in columns and rows with third variables.',
      de: 'Ersetzt bei Spalten und Zeilen mit dritten Variablen (z.B. MEAN etc) den Variablennamen durch den DESCRIPTION-String, z.B. "Mittelwert".',
    },
  },
  {
    name: 'MEANINCOMPARE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MEANP',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: "In terms of calculation, MEANP (intended as: MEAN for percentage values) is exactly the same as MEAN. The second identifier only serves to allow this CELLELEMENT to be given a different FORMAT or DESCRIPTION. By default this CELLELEMENT has the DESCRIPTION 'fake%'. For table output it is often better to change this to '%'.",
      de: "Von der Berechnung her ist MEANP (vorgesehen als: MEAN für Prozentwerte) exakt dasselbe wie MEAN. Der zweite Bezeichner dient nur dazu, dass man diesem CELLELEMENT ein abweichendes FORMAT oder DESCRIPTION geben kann. Als Default hat dieses CELLELEMENT die DESCRIPTION 'fake%'. Für die Tabellenausgabe wird man dies ggf. besser in '%' ändern.",
    },
  },
  {
    name: 'MEANPHYSTTEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MEANQP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MEANQP100',
    syntax: '',
    description: {
      en: 'In parallel with the sum and the base (sum of weights), a sum of all negative values and their weights is kept. As a result, this CELLELEMENT returns the quotient of the means of the positive and the negative values. MEANQP100 is identical in calculation; the value is simply multiplied by 100.',
      de: 'Erweiterung: MEANQP. Parallel zur Summe und zur Basis (Summe der Gewichte) wird eine Summe aller negativen Werte und der dazugehörigen Gewichte geführt. Als Resultat liefert dieses CELLELEMENT den Quotienten der Mittelwerte der positiven und der negativen Werte. MEANQP100 ist von der Berechnung her identisch, der Wert wird lediglich mit 100 multipliziert.',
    },
  },
  {
    name: 'MEANROWINDEX',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Row-wise display of the mean as an index, each relative to the mean in the total row',
      de: 'Zeilenweise Darstellung des Mittelwertes als Index, jeweils auf den Mittelwert in der Totalzeile bezogen',
    },
  },
  {
    name: 'MEANTEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MEANTESTCUT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MEANWELCH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MEDIAN',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'The median of a third variable in all cells. As with the median and all percentiles, GESStabs interpolates when this is requested with the TABLEFORMAT PERCENTILEINTERPOL. MEDIAN and PCNTL1 to PCNTL4 can be combined in one cell; PCNTL1 is then output first, then MEDIAN and finally PCNTL2.',
      de: 'Der Median einer dritten Variable in allen Zellen. Bei Median wie bei allen Perzentilen wird innerhalb von GESStabs dann interpoliert, wenn es mit dem TABLEFORMAT PERCENTILEINTERPOL verlangt wird. MEDIAN und PCNTL1 bis PCNTL4 sind in einer Zelle kombinierbar; dabei wird untereinander erst PCNTL1, dann MEDIAN und zuletzt PCNTL2 ausgegeben.',
    },
  },
  {
    name: 'MEDIUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MENUFILTER',
    syntax: 'MENUFILTER <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MENUHEADER',
    syntax: 'MENUHEADER <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MENUINCLUDE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MENUMEAN',
    syntax: 'MENUMEAN <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MENUTITLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MIN',
    syntax: 'MIN <varname> = <varlist>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINCOLBASE',
    syntax: 'MINCOLBASE = <number>;\nPreset at MINCOLBASE = 0',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINCOLUMNS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINCOLWIDTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINFRAMECOLWIDTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINIMUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINIMUMWEIGHT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINIMUMWFACT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MININDEX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINLABELWIDTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINLINEHEIGHT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINMAX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINROWBASE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINTABLEHEIGHT',
    argsHint: '(PS)',
    syntax: '',
    description: {
      en: 'For line-orientated printers the width of the letters or the number of rows must be defined as the basic unit of measurement. The following syntax is valid: UNITS = CPI <number> LPI <number>; CPI means Characters Per Inch (Pitch); LPI means Lines Per Inch. Example: UNITS = CPI 10 LPI 6; During output with USEFONT GESS tabs ensures that the fonts match the chosen settings for UNITS.',
      de: '',
    },
  },
  {
    name: 'MINTABLEWIDTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINTEXTHEIGHT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINUTESASHOURSMEAN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MINVALUES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MISSING',
    syntax: 'MISSING <varlist> = { number }*n;\n(n <= 3)',
    description: {
      en: 'Allows the definition of individual characteristics of nuclear variables as MISSING values.',
      de: '',
    },
  },
  {
    name: 'MISSINGCHAR',
    syntax: 'MISSINGCHAR = "<char>";\nDefault: MISSINGCHAR = "M";',
    description: {
      en: 'defines the character used to mark MISSING values for input and output. Preset: MISSINGCHAR = "M";',
      de: '',
    },
  },
  {
    name: 'MM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MOD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MODELABEL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MODIFYCSVNAMES',
    syntax: 'MODIFYCSVNAMES = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MODIFYVARNAME',
    syntax: '',
    description: {
      en: 'Prints not only the variable name but also the DESCRIPTION of the column or row content in columns or rows with third variables (e.g. MEAN ( Einkommen) ).',
      de: "Drucke bei Spalten bzw. Zeilen mit dritten Variablen (z.B. 'MEAN( Einkommen)') nicht nur den Variablennamen, sondern auch die DESCRIPTION des Spalten- bzw. Zeileninhalts.",
    },
  },
  {
    name: 'MRSET',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MULTICOLINHG',
    syntax: '',
    description: {
      en: 'Multiple cell contents (e.g. ABSCOLPERCENT) in CSV-Data files are usually represented in several rows. Alternatively they can be presented in several columns using +MULTICOLINHG. USEFORMATINHG Formats for CELLELEMENTS are also adopted for printouts in HG.…',
      de: '',
    },
  },
  {
    name: 'MULTIDEF',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MULTIFROMSTRING',
    syntax:
      'MULTIFROMSTRING [ DELIMITED <delimiter> ] [ DECIMALS <decimalchar> ] <newvar>\n= <alfavar>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'MULTIQ',
    syntax:
      'MULTIQ <varname> = [NOINPUT ] [ TITLE <titlestring> ] [ ALPHA ] [\nstart | * ] len [width]\n[ LABELS { AS <varname> | { value <text> }*n } ] ];',
    description: {
      en: '(also FAMILYVAR) Alternatively the variable family can also be generated directly from the input. This makes the individual variables invisible to the user:',
      de: '',
    },
  },
  {
    name: 'MULTISTRING',
    syntax: 'MULTISTRING = "<text>";',
    description: {
      en: 'Defines the text in CODEBOOKs which refers to possible multi-responses. Preset: MULTISTRING= "Mehrfachnennungen möglich"; This is valid for all tables until changed.',
      de: 'Text in CODEBOOKs, der auf mögliche Mehrfachnennungen verweist',
    },
  },
  {
    name: 'MULTITOTALX',
    syntax: '',
    description: {
      en: 'Usually the TOTALROW is counted on the basis of case numbers (see also TABLEBASE). In many cases it is required to have a total different to the number of response for variables with multi-responses. This can be done using TABLEFORMAT. (e.g. 165% in the total row of a column percentage means an average of 1,65 responses per interviewee.) In this context:…',
      de: 'Im Normalfall wird eine TOTALROW auf der Basis von Fällen gezählt (siehe auch TABLEBASE). In vielen Fällen ist es aber bei Variablen mit Mehrfachnennungen wünschenswert, die Totalzeile abweichend auf der Basis der Nennungen zu zählen. Dies kann man mit diesem TABLEFORMAT erreichen. (Z.B.…',
    },
  },
  {
    name: 'MULTITOTALY',
    syntax: '',
    description: {
      en: 'Analogue to this a TOTALCOLUMN is usually tallied on the basis of number of cases. Using MULTITOTALY this tally can be converted to all responses.',
      de: 'Analog zu MULTITOTALX wird eine TOTALCOLUMN im Standardfall auf der Basis von Fällen gezählt. Mit MULTITOTALY kann diese Zählung auf alle Nennungen umgestellt werden.',
    },
  },
  {
    name: 'NAME',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NE',
    syntax: '',
    description: {
      en: 'Not Equal',
      de: 'Not Equal, ist ungleich',
    },
  },
  {
    name: 'NEG',
    syntax: '',
    description: {
      en: 'negative value. Example: COMPUTE x = ENTIER( NEG( b / 2 ) );',
      de: 'negativer Wert. Beispiel: COMPUTE x = ENTIER( NEG( b / 2 ) );',
    },
  },
  {
    name: 'NEVER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NEWOPENFORMAT',
    syntax: 'NEWOPENFORMAT = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NEWOPENQFORMAT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NEWPAGE',
    syntax: '',
    description: {
      en: 'Page break before the label (synonym: PAGE), see also Layout 543',
      de: 'Seitenumbruch vor dem Label (Synonym: PAGE), siehe auch Layout 543',
    },
  },
  {
    name: 'NEXT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NEXTVAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NIL',
    syntax: '',
    description: {
      en: 'empty variable (useful e.g. with TABLE ADD). Attempting to generate your own variables with these names results in an error. HIDDENTOVARLIST controls whether system variables should be included when naming variable lists 20 (via TO).',
      de: 'leere Variable (praktisch z.B. bei TABLE ADD) Der Versuch, eigene Variablen mit diesen Namen zu generieren, führt zu einem Fehler. Mit HIDDENTOVARLIST kann gesteuert werden, ob Systemvariablen bei der Nennung von Variablenlisten 20 (mittels TO) mit erfasst werden sollen.',
    },
  },
  {
    name: 'NO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOADDINFRAME',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOADDINFRAMETTL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOADDINFRAMEX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOADDINFRAMEY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOADRESSSERVERALERT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOASCIIEXTENSION',
    syntax: 'NOASCIIEXTENSION = [ YES | NO ];',
    description: {
      en: 'Normally ASCII data sets which have been produced by GESS tabs are finished with a right- justified *.Should this not occur it can be achieved with a switch.',
      de: '',
    },
  },
  {
    name: 'NOAUTOTABLETITLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOBODYBLANKS',
    syntax: '',
    description: {
      en: 'Suppresses blank rows in the table body that have been added to improve legibility. Tables then may for example fit on one page.',
      de: 'Unterdrückt Leerzeilen im Tabellenrumpf, die sonst der Lesbarkeit halber eingefügt werden. Damit passen u.U. Tabellen',
    },
  },
  {
    name: 'NOBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOCITATION',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOCOLCHECK',
    argsHint: '(XGI, XGC etc.)',
    syntax: '',
    description: {
      en: 'Syntax NOCOLCHECK = [ YES | NO ]; Preset: NO If using GESS input or GESS questionnaire software the allocation of columns is monitored to avoid multiple use. It can however make sense when filtering for example to use identical physical data areas repeatedly. The standard check can be switched off for this.',
      de: '',
    },
  },
  {
    name: 'NOCONTENTBOX',
    syntax: '',
    description: {
      en: 'Suppresses the explanation box in additional table rows which for example contain mean or sum etc. In this case only the VARTITLE or the VARNAME are printed in front of the value. The user should then include other texts to explain the content. (no effect on Postscript-printouts). (NON-PS)',
      de: 'Unterdrückt den Erläuterungskasten bei zusätzlichen Tabellenzeilen, die z.B. Mittelwerte oder Summen enthalten etc. In diesem Fall wird vor den Werten nur der VARTITLE bzw. der VARNAME ausgegeben. Der/die Benutzer/in sollte dann durch eigene Texte den Tabelleninhalt erläutern. (Ohne Effekt bei Postscript-Ausgabe).',
    },
  },
  {
    name: 'NOCSV',
    syntax: 'NOCSV <varlist> = YES;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NODESCRIPTION',
    syntax: '',
    description: {
      en: 'Suppresses the descriptive text for the cell contents (see DESCRIPTION.',
      de: 'Unterdrückt die Beschreibungstexte für die Zelleninhalte (siehe auch DESCRIPTION).',
    },
  },
  {
    name: 'NOEMPTYELEMENT',
    syntax: '',
    description: {
      en: 'Empty CELLELEMENTS (e.g. an empty result text for a significance test) are replaced by the ZERODASHCHAR.',
      de: 'Leere CELLELEMENTS (z.B. ein leerer Ergebnistext für einen Signifikanztest) werden durch den ZERODASHCHAR ersetzt.',
    },
  },
  {
    name: 'NOEXPANDAT',
    syntax: 'NOEXPANDAT <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOFRAME',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOFROZEN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOGRAPH',
    syntax: '',
    description: {
      en: 'Suppresses the otherwise default right-hand histogram in CODEBOOK and PROFILE tables.',
      de: 'Unterdrückt das, ansonsten standardmäßig dargestellte, rechtsstehende Histogramm in CODEBOOKs und PROFILE-Tabellen.',
    },
  },
  {
    name: 'NOGRID',
    syntax: '',
    description: {
      en: 'Suppresses the otherwise default scale for line graphics in PROFILE tables.',
      de: 'Unterdrückt die, ansonsten standardmäßig dargestellte, Skala für Lineingrafiken in PROFILE-Tabellen.',
    },
  },
  {
    name: 'NOHEADERBLANKS',
    syntax: '',
    description: {
      en: 'Suppresses blank rows in the stub. (NON-PS)',
      de: 'Unterdrückt Leerzeilen im Tabellenkopf. (NON-PS)',
    },
  },
  {
    name: 'NOINHERITTEXT',
    syntax: 'NOINHERITTEXT = [ YES | NO ];\nNOINHERITTITLE = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOINHERITTITLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOINPUT',
    syntax: 'NOINPUT <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOINSTITUTIONINCSV',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOINVERTADDON',
    syntax: 'NOINVERTADDON = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOIOCHECK',
    syntax: 'NOIOCHECK <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOISE',
    syntax:
      'NOISE = <value>;\nNOISE can be used to "add noise" with random figures to all known variables of a data set. <value>\ndefines how many measurement points are to be replaced by random values. value=1 causes a',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOLABEL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOLEGEND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOLOGFILES',
    syntax: 'NOLOGFILES = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOMINATIONS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOMINATIONTITLE',
    syntax: 'NOMINATIONTITLE [X|Y] = "<text>";',
    description: {
      en: 'In TABLEBASE = NOMINATIONS the standard text is "No. of responses abs.". This can be replaced. Example: NOMINATIONTITLE = "Nennungen"; Different texts are possible for the X and Y axes analogue to CASESTITLE (see above). It is valid for all tables until changed.',
      de: 'Dient zu Ersetzung des Standardtextes bei TABLEBASE = RESPONSES;.',
    },
  },
  {
    name: 'NOMISSING',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOMULTILINEEXPANSION',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NONOISE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOOCINHEADER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOOCINSTUB',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOOUTPUT',
    syntax: 'NOOUTPUT <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOQOUOTESINCSV',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOQUOTESINCSV',
    syntax: 'NOQUOTESINCSV = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NORANKING',
    syntax: '',
    description: {
      en: 'Exclusion from ranking, see Sortings 468. Assignment of a count level to control the output in tables (relevant',
      de: 'Ausschluss aus Ranking, siehe Sortierungen 468 Vergabe eines Zähllevels zur Steuerung der Ausgabe in Tabellen (relevant',
    },
  },
  {
    name: 'NOREPORT',
    syntax: 'NOREPORT <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NORMAL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NORMALIZE',
    syntax: 'NORMALIZE;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOSCALE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOSIGNIFMEANGREATER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOSIGNIFMEANLESS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOSPSS',
    syntax: 'NOSPSS <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOT',
    syntax: '',
    description: {
      en: 'Not. Associations must be given explicitly by bracketing; unbracketed sequences of OR and AND are processed from left to right. The common abbreviated notation (e.g. "a EQ 1 OR 2" instead of "a EQ 1 OR a EQ 2" etc.) is not allowed. The IN 303 formulation exists for this. String constants are allowed.…',
      de: 'Nicht Assoziationen müssen explizit durch Klammerung angegeben werden; ungeklammerte Reihungen von OR und AND werden von links nach rechts abgearbeitet. Die verbreitete abkürzende Schreibweise (z.B. "a EQ 1 OR 2" anstelle von "a EQ 1 OR a EQ 2" etc. ist nicht erlaubt. Hierfür gibt es die IN 303-Formulierung. Stringkonstanten sind erlaubt.…',
    },
  },
  {
    name: 'NOTHING',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOTOGGLEKEY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOVARTITLEBOX',
    syntax: '',
    description: {
      en: 'Suppresses the box which names the variables on the Y-axis. Always makes sense if only one variable is used on the Y-axis which for example already appears in the TOPTEXT box.',
      de: 'Unterdrückt den Kasten, der Variablen in der Y-Richtung benennt. Macht immer dann Sinn, wenn man in der Y-Richtung nur eine einzige Variable verwendet, die zudem z.B. bereits in der TOPTEXT-Box erläutert wurde.',
    },
  },
  {
    name: 'NOVELLLOCKS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOWHITEBACK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOWRAPINTEXT',
    syntax: 'NOWRAPINTEXT = [ YES | NO ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOXVARTITLEBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NOZERODASH',
    syntax: '',
    description: {
      en: 'Usually the real zero in percentage tables is represented by a "-". This can be switched off using NOZERODASH.',
      de: "Im Standardfall wird die echte Null in Prozenttabellen durch '-' dargestellt. Dies kann man mit NOZERODASH abschalten.",
    },
  },
  {
    name: 'NOZEROFILLINLABEL',
    syntax: '',
    description: {
      en: 'Suppresses the addition of leading zeros in the LABELFORMAT statement.',
      de: 'Unterdrückt die Ergänzung führender Nullen im LABELFORMAT-Statement.',
    },
  },
  {
    name: 'NUMBERCHAR',
    syntax: '',
    description: {
      en: 'Is replaced by the current table number in TABLETITLE. Default: #',
      de: 'Wird in TABLETITLEs durch die aktuelle Tabellennummer ersetzt. Voreinstellung: #',
    },
  },
  {
    name: 'NUMBERSINCOLOR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NUMCENTERGRAPH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NUMERIC',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'NUMEXGRAPH',
    syntax: '',
    description: {
      en: 'CHARTTITLE "Former party voters of CDU, SPD and Greens/GAL vote:" = | COLUMNS POSITION 2:4 ROWS POSITION 1:8 ; GESSCHART PIE SAMEPAGE',
      de: 'CHARTTITLE "Ehemalige Parteiwähler von CDU, SPD und Grüne/GAL wählen:" = | COLUMNS POSITION 2:4 ROWS POSITION 1:8 ; GESSCHART PIE SAMEPAGE',
    },
  },
  {
    name: 'NUMINGRAPH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OFFICECHAPTERPAGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OFFICECHART',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OFFICECHARTDEFAULTS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OFFICECONTENTPAGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OFFICEEXPORT',
    syntax:
      'OFFICEEXPORT = <filename>;\n<filename> must have one of the following extensions: xlsx | xls | ods. The output type is determined by the extension',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OFFICEEXPORTOPTIONS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OFFICEFONT',
    syntax:
      'OFFICEFONT <fontname> SIZE <number> [OPTION [BOLD|ITALIC|UNDERLINE]]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OFFICEFORMAT',
    syntax: 'OFFICEFORMAT <cellelement> : <formatstring>',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OFFICEPICTURE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OFFICETITLEPAGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OLDEXCELFORMAT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OLDGROUPCLEARMETHOD',
    syntax: 'OLDGROUPCLEARMETHOD = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ONQUESTIONNAIRE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OPEN',
    syntax: '',
    description: {
      en: 'The GESS system can also process and code the responses to open questions by designating the variables in the SINGLEQ to be OPEN. GESS questionnaire and input programmes then open a text window for the input of open responses.',
      de: '',
    },
  },
  {
    name: 'OPENASALPHA',
    syntax:
      'OPENASALPHA <varlist> = [ YES | NO ];\nGLOBALOPENASALPHA = [ YES | NO ];',
    description: {
      en: 'Usually the results of the coding are taken from the OPENQFILEs but the texts can also be used verbatim which is achieved using: OPENASALPHA <varlist> = [ YES | NO ];',
      de: '',
    },
  },
  {
    name: 'OPENAUTOGENERATE',
    syntax:
      'OPENAUTOGENERATE = [ YES | MULTIQ <number> [ PREFIX <text> ] ]\n| ALPHA [ PREFIX <text> ] ];\nThe simplest version reads: OPENAUTOGENERATE = YES;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OPENCSV',
    syntax: 'OPENCSV = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OPENOFFICEDEVIATION',
    syntax: 'OPENOFFICEDEVIATION = YES;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OPENQFILE',
    syntax: 'OPENQFILE = <name.opn>;',
    description: {
      en: 'If open questions are to be used at least one OPENQFILE must be defined. GESS tabs reads all OPENQFILEs and creates a data bank which allocates which values belong to which case numbers. The OPENQFILE statement has the same syntax as the DATAFILE statement.…',
      de: '',
    },
  },
  {
    name: 'OPENQFILES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OPENQFORMAT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OPTIMIZE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OPTION',
    syntax: 'OPTION : [CLUSTERED | STACKED | PERCENTSTACKED]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OR',
    argsHint: '( Alter LT 6 AND Schulbildung GT 0 )',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OUTFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OUTLINE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OVERCODE',
    syntax:
      'OVERCODE [<ocname>] { :<label> }*n "<text of the OVERCODE>"\n<ocname> ::= new unique name of the OVERCODE',
    description: {
      en: 'Formation and naming of an over-code 262',
      de: 'Bildung und Benennung eines Obercodes 262',
    },
  },
  {
    name: 'OVERCODE SUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OVERLAPPED',
    syntax: '',
    description: {
      en: 'Show the graphical elements overlapping',
      de: 'Die graphischen Elemente überlappend darstellen',
    },
  },
  {
    name: 'OVEROVERCODE',
    syntax:
      'OVEROVERCODE [ SUM ] <oocname> { :<ocname> }*n\n"<text of the OVEROVERCODE>"\n<oocname> ::= new unique name of the OVEROVERCODE\n<ocname> ::= valid name of an existing OVERCODE',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OVERSLICE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'OVERVIEW',
    syntax:
      'OVERVIEW <tableoptions> = <header> BY <cellelementlist> ( <varlist> )\n[ SORT <cellelement> [ DESCEND ] [ PANE <number> CODE <number> ] ] ;\n<varlist> ::= { <variable [ <varoption> ] }*n\n<varoption> ::=\n[ SORTCLASS <number> ]\n[ LEVEL <number> ]',
    description: {
      en: 'TITLE "Table with inherited sorting, SORT AS „overbase“" SORT AS overbase = #k BY MEAN STDDEV( #domacro2 ( m_name 11:16; a ) ); Inherit sorting: base table, table with inherited sorting. The new implementation of „SORT AS“ also allows the inheritance of orders in the header of tables. We modify our example briefly and show formally the same information in an XOVERVIEW.…',
      de: 'TITLE "Tabelle mit vererbter Sortierung, SORT AS „overbase“" SORT AS overbase = #k BY MEAN STDDEV( #domacro2 ( m_name 11:16; a ) ); Sortierung vererben: Basistabelle Tabelle mit vererbter Sortierung Die neue Implementierung von „SORT AS“ erlaubt auch die Vererbung von Reihenfolgen im Kopf von Tabellen. Wir wandeln unser Beispiel kurz ab, und zeigen formal dieselbe Information in einem XOVERVIEW.…',
    },
  },
  {
    name: 'OVERVIEW ADD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PAGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PAGELENGTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PAGENUMBER',
    syntax: '',
    description: {
      en: 'Resets the current page number.',
      de: 'Setzt die aktuelle Seitennummer neu, wird mit dem NUMBERCHAR eingesetzt.',
    },
  },
  {
    name: 'PAGETOTALX',
    syntax: '',
    description: {
      en: 'Only effective with MULTITOTALX: The responses of all variables on the Y-axis are tallied for the TOTALROW.',
      de: 'Hat nur Effekt bei MULTITOTALX: Die Nennungen aller Variablen auf der Y-Achse werden für die Totalzeile gezählt.',
    },
  },
  {
    name: 'PAGETOTALY',
    syntax: '',
    description: {
      en: 'Only has effect with MULTITOTALY: The responses to all variables on the X-Axis are tallied for the TOTALCOLUMN.',
      de: 'Hat nur Effekt bei MULTITOTALY: Die Nennungen aller Variablen auf der X-Achse werden für die Totalspalte gezählt.',
    },
  },
  {
    name: 'PANE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PAPER',
    syntax: 'PAPER = HEIGHT <number> WIDTH <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PASSWORD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PATTERN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PATTERNERROR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PCNTL1',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Freely selectable percentile; the default is the 1st quartile (25%).',
      de: 'Frei wählbare Percentile; voreingestellt ist das 1. Quartil (25%).',
    },
  },
  {
    name: 'PCNTL2',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Freely selectable percentile; the default is the 3rd quartile (75%).',
      de: 'Frei wählbare Percentile; voreingestellt ist das 3. Quartil (75%).',
    },
  },
  {
    name: 'PCNTL3',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'PCNTL4 ( Var ) or 75% of the cell distribution. With additional statements the boundary and the text of the percentile evaluation can be chosen individually, example: PCNTL1 = 33.333% "1st third"; PCNTL2 = 66.667% "2nd third"; Interpolation is done when requested with the TABLEFORMAT PERCENTILEINTERPOL.',
      de: 'PCNTL4 ( Var ) bzw. 75% der Zellenverteilung. Mit zusätzlichen Statements kann die Grenze und der Text der Percentilauswertung individuell gewählt werden, Beispiel: PCNTL1 = 33.333% "1.Drittel"; PCNTL2 = 66.667% "2.Drittel"; Es wird dann interpoliert, wenn es mit dem TABLEFORMAT PERCENTILEINTERPOL verlangt wird.',
    },
  },
  {
    name: 'PCNTL4',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PCNTRANGE',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Output of the 1st and 2nd percentile as a span on one line',
      de: 'Ausgabe des 1. und 2. Perzentils als Spanne in einer Zeile',
    },
  },
  {
    name: 'PDF',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PEARSONR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PERCENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PERCENTILEDELTA',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Output of the difference between the 1st and 2nd percentile.',
      de: 'Ausgabe der Differenz zwischen dem 1. und 2. Perzentil',
    },
  },
  {
    name: 'PERCENTILEINTERPOL',
    syntax: '',
    description: {
      en: 'Using this TABLEFORMAT an interpolation is switched on. Interpolation used to be standard in GESS tabs. This is however unusual if anything; we have readjusted and now interpolation has to be explicitly defined.',
      de: 'Mit diesem TABLEFORMAT wird eine Interpolation eingeschaltet.',
    },
  },
  {
    name: 'PERCENTINLABEL',
    syntax: '',
    description: {
      en: 'Automatically adds a % symbol with CELLELEMENT = COLUMNPERCENT to the label boxes on the X- axis. Incidentally is also used to add an additional row with percentaging in ColumnCount (PS).',
      de: 'Fügt bei CELLELEMENT = COLUMNPERCENT; 420 in die Labelboxes der X-Achse automatisch ein %-Zeichen ein.',
    },
  },
  {
    name: 'PERCENTSTACKED',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHI',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHONE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSCELLMIN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSCOLCHIQU',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSCOLDELTA',
    syntax: '',
    description: {
      en: 'Difference between weighted and unweighted column percentages',
      de: 'Differenz zwischen gewichteten und ungewichteten Spaltenprozenten',
    },
  },
  {
    name: 'PHYSCOLDEPTTEST',
    syntax: '',
    description: {
      en: 'Dependent, column-wise t-test on the basis of the weighted data',
      de: 'Abhängiger, spaltenweiser t-Test auf Basis der gewichteten Daten',
    },
  },
  {
    name: 'PHYSCOLINHG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSCOLPERCENT',
    syntax: '',
    description: {
      en: 'Column percentages, based on unweighted figures',
      de: 'Spaltenprozente, auf Basis ungewichteter Zahlen',
    },
  },
  {
    name: 'PHYSDEPTTEST',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Dependent t-test on mean differences on the basis of the unweighted data',
      de: 'Abhängiger t-Test auf Mittelwertsunterschiede auf Basis der ungewichteten Daten',
    },
  },
  {
    name: 'PHYSICALC',
    syntax: '',
    description: {
      en: 'Physical case count (without taking weights into account) in the column',
      de: 'Physikalische Fallzahl (ohne Berücksichtigung von Gewichten) in der Spalte',
    },
  },
  {
    name: 'PHYSICALCOLUMN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSICALNTITLE',
    syntax: 'PHYSICALNTITLE = "<text>";',
    description: {
      en: 'Serves to replace the standard text "unweighted" with the indicator of columns or rows with "unweighted n". (See FRAMEELEMENTS, PHYSICALROW or PHYSICALCOLUMN). Example: PHYSICALNTITLE = "Zahl der Be-frag-ten"; X and Y frame texts can be set differently analogue to TOTALTITLE. This is valid for all tables until changed.',
      de: 'Text zur Kennzeichnung der Spalten/Zeilen mit ungewichteter Fallzahl',
    },
  },
  {
    name: 'PHYSICALR',
    syntax: '',
    description: {
      en: 'Physical case count (without taking weights into account) in the row',
      de: 'Physikalische Fallzahl (ohne Berücksichtigung von Gewichten) in der Zeile',
    },
  },
  {
    name: 'PHYSICALRECORDS',
    syntax: '',
    description: {
      en: 'unweighted number of cases',
      de: 'ungewichtete Zahl der Fälle',
    },
  },
  {
    name: 'PHYSICALROW',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSMCNEMAR',
    syntax: '',
    description: {
      en: 'Dependent test on percentage differences on the basis of the unweighted data per McNemar',
      de: 'Abhängiger Test auf Prozentwertunterschied auf Basis der ungewichteten Daten nach McNemar',
    },
  },
  {
    name: 'PHYSMEAN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSMEANCOLDEPT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSMEANTEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSMEANWELCH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSMINCOLBASE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSMINROWBASE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSROWCHIQU',
    syntax: '',
    description: {
      en: 'Row-wise chi-square test on the basis of the unweighted data',
      de: 'Zeilenweiser Chi²-Test auf Basis der ungewichteten Daten',
    },
  },
  {
    name: 'PHYSROWDELTA',
    syntax: '',
    description: {
      en: 'Difference between the weighted and unweighted row percentages.',
      de: 'Differenz zwischen den gewichteten und ungewichteten Zeilenprozenten.',
    },
  },
  {
    name: 'PHYSROWINHG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSROWMEANTEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PHYSROWPERCENT',
    syntax: '',
    description: {
      en: 'Row percentages, based on an unweighted count',
      de: 'Zeilenprozente, auf Basis einer ungewichteten Zählung',
    },
  },
  {
    name: 'PHYSROWTTEST',
    syntax: '',
    description: {
      en: 'Independent, row-wise t-test on mean differences on the basis of the unweighted data.',
      de: 'Unabhängiger, zeilenweiser t-Test auf Mittelwertunterschiede auf Basis der ungewichteten Daten.',
    },
  },
  {
    name: 'PHYSTTEST',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Independent t-test on mean differences on the basis of the unweighted data',
      de: 'Unabhängiger t-Test auf Mittelwertsunterschiede auf Basis der ungewichteten Daten',
    },
  },
  {
    name: 'PHYSWELCHTEST',
    syntax: '',
    description: {
      en: 'Independent t-test on mean differences per Welch on the basis of the unweighted data',
      de: 'Unabhängiger t-Test auf Mittelwerteunterschiede nach Welch auf Basis der ungewichteten Daten',
    },
  },
  {
    name: 'PIE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PIE100',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PIESTARTANGLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PLAINDATAREPORT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PLAYBACK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PLUSBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'POINTBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'POINTS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'POSITION',
    syntax: 'POSITION "<cellrange>"',
    description: {
      en: 'With POSITION the position can be specified at which the new label (or also OVERCODE) is inserted into the label list. Counting is 1-based. If you want e.g. to insert a label before all existing ones, you write something like: LABELS testvar = ADD POSITION 1',
      de: 'Mit POSITION kann die Position vorgegeben werden, an der das neue Label (oder auch OVERCODE) in die Labelliste eingefügt wird. Die Zählung ist 1-basiert. Möchte man z.B. ein Label vor allen bestehenden einfügen, so schreibt man etwa: LABELS testvar = ADD POSITION 1',
    },
  },
  {
    name: 'POSTPONE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'POSTPROCESS',
    syntax: 'POSTPROCESS <Cellelement> : [ IF-Statement | COMPUTE-Statement ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'POSTREPLACE',
    syntax: 'POSTREPLACE <cellelement> : <text1> = <text2> [ IF <text3> ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'POSTSCRIPT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'POWERCHARTS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'POWERPOINTFILENAME',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PPCHART',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PPEXCHANGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PPTEMPLATES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PREQUOTA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PRETEXT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PRINT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PRINT2LINES',
    syntax: '',
    description: {
      en: 'The presentation of two rows within a cell can be achieved in rows or columns that are generated using CELLELEMENTS and have two logical contents (e.g. ABSCOLPERCENT, ABSMEAN). (Only effective with Postscript-printouts). (PS)',
      de: 'Bei Zeilen bzw. Spalten, die mit CELLELEMENTS gebildet werden, die zwei logische Inhalte 433 haben (z.B. ABSCOLPERCENT, ABSMEAN) kann die Darstellung in zwei Zeilen innerhalb der Zelle verlangt werden. (Hat nur bei Postscript- Ausgabe Effekt.)',
    },
  },
  {
    name: 'PRINT2LINES2',
    syntax: '',
    description: {
      en: 'Analogue to Print2Lines, only in the other order. (Only effective with Postscript-printouts). (PS)',
      de: 'Analog zu PRINT2LINES, nur in umgekehrter Reihenfolge. (Hat nur bei Postscript-Ausgabe Effekt.)',
    },
  },
  {
    name: 'PRINTALL',
    syntax:
      'PRINTALL <varlist> = [ YES | NO ];\nGLOBALPRINTALL = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PRINTDICTIONARY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PRINTEREXIT',
    syntax: '',
    description: {
      en: 'Control string which is written at the end of a PRINTFILE. The individual characters are defined in either decimal or ASCII code Example: PRINTEREXIT = 12 {FormFeed} 10 {LineFeed} 13 {CR}; or ASCII codes are mixed with literal strings. Character chains which are to be passed on to the printer unchanged are set in quotation marks. Example:…',
      de: '',
    },
  },
  {
    name: 'PRINTERINIT',
    syntax: '',
    description: {
      en: 'Control string which is written at the beginning of the output of a PRINTFILE. See above for coding.',
      de: '',
    },
  },
  {
    name: 'PRINTFILE',
    syntax: 'PRINTFILE <Druckername> = <FileName>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PRINTSUPPRESSVALUE',
    syntax: 'PRINTSUPPRESSVALUE = <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PRINTWEIGHTPROTOCOL',
    syntax: 'PRINTWEIGHTPROTOCOL = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PROFILE',
    syntax: '',
    description: {
      en: 'PROFILE defines a mean table with an optional graphical presentation of the mean value. In certain ways PROFILE is to mean as COMPARE is to distribution. PROFILE can also be used to present many variables cohesively.…',
      de: '',
    },
  },
  {
    name: 'PROFILEHEADERS',
    syntax: '',
    description: {
      en: 'PROFILEHEADERS is an obligatory command after a PROFILE statement and is used to define the column legends. The test elements can cover more than one row; the same hyphenation rules apply as for VALUELABELS (see above).',
      de: '',
    },
  },
  {
    name: 'PROFILELINES',
    syntax:
      'PROFILELINES = { LineDef }*n ;\nLineDef ::= | <number> : { LineQualifier }*n\nLineQualifier ::=[ HIDDEN | PATTERN <number> | COLOR <number>\n<number> <number> | WIDTH <number> | SYMBOL <number> SYMBOLWIDTH\n<number> ]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PROFILESCALE',
    syntax: 'PROFILESCALE = <start> <end> <increment> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PROFILESORT',
    syntax:
      'PROFILESORT = [ <number> ] [ DESCEND ] ;\nThe PROFILE table is sorted according to the <number> defined in the data column, usually in\nascending order; DESCEND defines the descending order. The data column results in the case of a BY\ntable from a code of characteristic. Where there are several variables per row <number> is the first',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PROJCOLPERCENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PROJECT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PROJECTION',
    syntax: '',
    description: {
      en: 'absolute frequency values: sum of weights, multiplied by the PROJECTIONFACTOR. With this you can project a sample onto the population using the weighted distribution. The PROJECTIONFACTOR can be set with the instruction PROJECTIONFACTOR = <value>; Default: 1.0.',
      de: 'absolute Häufigkeitswerte: Summe der Gewichte, multipliziert mit dem PROJECTIONFACTOR Hiermit kann man eine Stichprobe anhand der gewichteten Verteilung auf die Grundgesamtheit hochrechnen. Der PROJECTIONFACTOR kann mit der Anweisung PROJECTIONFACTOR = <Wert>; gesetzt werden. Voreinstellung: 1.0.',
    },
  },
  {
    name: 'PROJECTIONFACTOR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PROJECTIONSUM',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PROTOCOLPAGE',
    syntax: 'PROTOCOLPAGE = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'PS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'QBLOCK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'QST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'QU',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'QUALITAB',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'QUANTUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'QUANTUMINCHARS',
    syntax: 'QUANTUMINCHARS = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'QUESTION',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'QUOTA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'QUOTAINFO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RANDOM',
    syntax: '',
    description: {
      en: 'RANDOM of a negative number is undefined. The call COMPUTE xx = RANDOM( Max) with a positive argument "Max" returns an integer random number in the range 0 .. Max-1.',
      de: 'RANDOM von einer negativen Zahl ist undefiniert. Der Aufruf COMPUTE xx = RANDOM( Max) mit einem positiven Argument "Max" liefert eine ganzzahlige Zufallszahl im Range 0 .. Max-1.',
    },
  },
  {
    name: 'RANDOMGROUP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RANGE',
    syntax: '',
    description: {
      en: 'With the keyword RANGE, arbitrary ranges can be requested and a table with a great many categories can thus be split. For example: TABLE = a BY b SORT ABSOLUTE DESCEND RANGE 1 20;',
      de: 'Mit dem Schlüsselwort RANGE können beliebige Bereiche angefordert und so eine Tabelle mit sehr vielen Ausprägungen zerlegt werden. Zum Beispiel: TABLE = a BY b SORT ABSOLUTE DESCEND RANGE 1 20;',
    },
  },
  {
    name: 'RANGES',
    syntax: 'RANGES <VarList> <ValueList> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RANK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RAWDATASTRING',
    syntax: 'RAWDATASTRING = "<symbol>";\nDefault: RAWDATASTRING = "*";',
    description: {
      en: 'Indicator to differentiate between unweighted and weighted tables. Comes directly before DOCUMENT. Preset: RAWDATASTRING = "*"; This is valid for all tables until changed. Options for Printing and Layout of Tables',
      de: 'Kennzeichnung, um ungewichtete Tabellen von gewichteten zu unterscheiden. Wird direkt vor dem DOCUMENT ausgegeben.',
    },
  },
  {
    name: 'READONLY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RECHIPREFIX',
    syntax: 'RECHIPREFIX = "<string>";',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RECODE',
    syntax:
      'RECODE <recode> { / <recode> }*n [ ELSE = <number> ] ;\n<recode> ::= <valuelist> = <number>\n<valuelist> ::= [ <number> | <number> : <number> | <valuelist>',
    description: {
      en: 'allows the reprogramming of of individual variable characteristics of the variable defined last or a list of explicitly named variables. Example: RECODE 1 2 3 = 3; summarises the characteristics 1,2 and 3 of the variable defined last to 3. RECODE item1 item2 item3 1 = 4; recodes the characteristics of item1, item2 and item3 of the variable. also possible:…',
      de: 'Umkodierung (Voraussetzung: LABELRECODE = YES;), wird bei LABELS COPY bzw. LABELS AS vererbt.',
    },
  },
  {
    name: 'RECODELASTWINS',
    syntax: 'RECODELASTWINS = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RECODESMALL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RECODETASKS',
    syntax: '',
    description: {
      en: 'The effect of RECODE statements can be restricted to particular task types. Using: RECODETASKS = tabtask; recodes are only carried out by GESS tabs, and all RECODE statements from GESS input or CATI etc. are ignored.',
      de: '',
    },
  },
  {
    name: 'RECORDING',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RECTANGLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RECTLINE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'REDEFINEVARS',
    syntax: '',
    description: {
      en: 'YES or NO. Preset: NO. If REDEFINEVARS is set to YES all command rows in the INFILE appear which redefine the input definition of variables already defined. Command rows in the INFILE are identified using a dollar sign ($) in the first column of a row in the INFILE. Commands conforming to the syntax of the VARNAME or RECODE commands are permitted.…',
      de: '',
    },
  },
  {
    name: 'REMOVELINEFEEDSFORCONTENT',
    syntax: 'REMOVELINEFEEDSFORCONTENT = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'REPLACE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'REPORT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'REPRINT',
    syntax: 'REPRINT TABLE = <tablename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'REPRINT TABLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'REQ',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RESETREDEFINEVARS',
    syntax: 'RESETREDEFINEVARS = [ YES | NO ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RESPONSES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RESPONSESTITLE',
    syntax: 'RESPONSESTITLE [ X | Y ] = "<text>";',
    description: {
      en: 'Label of the RESPONSES column/row (when TABLEBASE = RESPONSES; 388 is set)',
      de: 'Bezeichnung der RESPONSES-Spalte/-zeile (wenn TABLEBASE = RESPONSES; 388 gesetzt)',
    },
  },
  {
    name: 'RESTARTFROZEN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RESTRICT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RESTRICTVALUES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RESULT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RESULTCODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RETAINOPENVERBATIMS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'REUSE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RGB',
    syntax:
      'RGB = [ YES | NO ];\nIf RGB = NO GESS tabs calculates the numerical colour information according to the HSB model. If RGB\n= YES the numerical values are interpreted according to the Red-Green-Blue model.',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RIGH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RIGHT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'RISING',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROTATE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROUND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROUNDMODE',
    syntax: 'ROUNDMODE = [ CLASSIC | BANKERSROUNDMODE | SIMPLE ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROWCELLMINIMUM',
    syntax: 'ROWCELLMINIMUM = <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROWCHIQ',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROWCHIQU',
    syntax: '',
    description: {
      en: 'Row-wise 4-field chi-square test on percentage differences. The marking is done analogously to COLCHIQU with alphabetic row marking, A is the first row, B the second, etc. With INDEXCHARS you can define your own markers and orders.',
      de: 'Zeilenweise 4-Felder-Chiquadrattest auf Prozentwertunterschiede. Die Kennzeichnung erfolgt analog zu COLCHIQU mit alphabetischer Zeilenkennzeichnung, A ist die erste Zeile, B die zweite, usw. Man kann mit INDEXCHARS eigene Kennzeichen und Reihenfolgen definieren.',
    },
  },
  {
    name: 'ROWELEMENTWINS',
    syntax: '',
    description: {
      en: 'This affects the selection of the CELLELEMENTS at intersection points where explicit CELLELEMENTS are defined for both rows and columns. a) In a table two variables are crossed whose labels are each provided with their own CELLELEMENTS, e.g.: LABELS A =',
      de: 'Dies beeinflusst die Auswahl der CELLELEMENTS an Kreuzungspunkten, an denen sowohl für Zeilen als auch für Spalten explizite CELLELEMENTS definiert sind. a) In einer Tabelle werden zwei Variablen gekreuzt, bei denen jeweils labels mit eigenen CELLELEMENTS versehen sind, z.B.: LABELS A =',
    },
  },
  {
    name: 'ROWMEANTEST',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Like MEANTEST, only the values in the rows are tested against each other',
      de: 'Wie MEANTEST, nur werden die Werte in den Zeilen gegeneinander getestet',
    },
  },
  {
    name: 'ROWMINIMUM',
    syntax: '',
    description: {
      en: 'Option for TABLE statement. Only those rows are printed which contain at least ROWMINIMUM cases, i.e., characteristics with very low case numbers in side group variables are suppressed. Preset at 0.0001.',
      de: '',
    },
  },
  {
    name: 'ROWPERCENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROWPERCENT100',
    syntax: '',
    description: {
      en: 'Row percentages modified by the Hare-Niemeyer method (sum equals 100). Note: not suitable e.g. for multiple-response variables and OVERCODEs, tables with suppressed MISSING VALUES and selectively built variables',
      de: 'Nach Hare-Niemeyer-Modell modifizierte Zeilenprozentwerte (Summe ergibt 100), Achtung: nicht geeignet bspw. für Mehrfachnennungsvariablen und OVERCODEs, Tabellen mit unterdrückten MISSING VALUES und selektiv gebildete Variablen',
    },
  },
  {
    name: 'ROWPERCENTINDEX',
    syntax: '',
    description: {
      en: 'Index values for the row percentages (100 corresponds to the value in the total row)',
      de: 'Indexwerte zu den Zeilenprozenten (100 entspricht dem Wert in der Totalzeile)',
    },
  },
  {
    name: 'ROWPERCENTRANGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROWPERCENTRANGELOWER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROWPERCENTRANGEUPPER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROWPERCEQUAL',
    syntax: '',
    description: {
      en: 'Tests all row percentages in the row for equality; i.e. all deviations from the equal distribution are considered significant. This can of course produce a great many meaningless significances. Please use with care.',
      de: 'Testet alle Zeilenprozente in der Zeile auf Gleichheit; d.h. alle Abweichungen von der Ungleichverteilung werden als signifikant betrachtet. Hier besteht natürlich die Möglichkeit, sehr viele unsinnige Signifikanzen zu produzieren. Bitte mit Bedacht verwenden.',
    },
  },
  {
    name: 'ROWPERCSTDERR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROWPERCZ',
    syntax: '',
    description: {
      en: 'Significance test (row-wise) for percentage differences. ROWPERCZ is based on the Z-test for percentage values. Extended Z-test with arcsine correction.',
      de: 'Signifikanztest (zeilenweise) für Prozentwertsunterschiede. ROWPERCZ basiert auf dem Z-Test für Prozentwerte. Erweiterter Z-Test mit Arcus-Sinus-Korrektur.',
    },
  },
  {
    name: 'ROWS',
    syntax:
      'ROWS : [TOTALROW | <startrow>[: <endrow>]]\nCOLUMNS : [TOTALCOLUMN | <startcol>[: <endcol>]]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROWSTRIPES',
    syntax: '',
    description: {
      en: 'If this TABLEFORMAT is set, the rows of TABLE tables are shaded, alternately with the colours declared in STRIPECOLORS.',
      de: 'Ist dieses TABLEFORMAT gesetzt, werden die Zeilen von TABLE- Tabellen farblich hinterlegt, und zwar abwechselnd mit den Farben, die in STRIPECOLORS vereinbart wurde.',
    },
  },
  {
    name: 'ROWSUM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ROWSUMPERCENT',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Output of the row percentaging of the sum of a third variable, e.g. the sum of expenditures for a particular purpose in particular city districts, etc.',
      de: 'Ausgabe der Zeilenprozentuierung der Summe einer dritten Variablen, z.B. die Summe von Ausgaben für einen bestimmten Zweck in bestimmten Stadtteilen etc.',
    },
  },
  {
    name: 'ROWTTEST',
    syntax: '',
    description: {
      en: 'Independent t-test on mean differences on the basis of the weighted data, row-wise',
      de: 'Unabhängiger t-Test auf Mittelwertunterschiede auf Basis der gewichteten Daten, zeilenweise',
    },
  },
  {
    name: 'SAMEPAGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SAVEPRTSETUP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SAVETABSETUP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SCALENUMBERS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SCORETAB',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SCREEN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SCRIPTEXPORTFILE',
    syntax: 'SCRIPTEXPORTFILE = [ APPEND ] <filename>;',
    description: {
      en: 'These can be used to define parts of the script as a "foreign code" to be exported. If the name of a SCRIPTEXPORTFILE is set all parts of the script between #STARTEXPORT and #ENDEXPORT are carried over into this file. These texts are also processed and modified by the Macro Expander which is the appeal of this construction. Thus it is possible to output variable names produced by nested macros.…',
      de: '',
    },
  },
  {
    name: 'SEARCHRANGE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SECONDMEAN',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Second mean. If the means of two different variables are to be output in one cell, the second variable must be requested via SECONDMEAN.',
      de: 'Zweiter Mittelwert. Wenn in einer Zelle die Mittelwerte von zwei verschiedenen Variablen ausgegeben werden sollen, muss die zweite Variable über SECONDMEAN angefordert werden.',
    },
  },
  {
    name: 'SECONDSUM',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: '2nd sum. If the sums of two different variables are to be output in one cell, the second variable must be requested via SECONDSUM.',
      de: '2. Summe. Wenn in einer Zelle die Summen von zwei verschiedenen Variablen ausgegeben werden sollen, muss die zweite Variable über SECONDSUM angefordert werden.',
    },
  },
  {
    name: 'SELECT',
    syntax:
      'SELECT <condition>;\nAll RECODE, RANGES, COMPUTE or IF instructions are carried out before SELECT;',
    description: {
      en: 'defines an import filter: only those cases which conform to this filter are processed further, i.e. all tables are produced only on the basis of this data; SELECT is a permanent filter as opposed to TABSELECT (see below). SELECT also acts on the output according to COPYFILE or SYSTEMOUT. An iterative weighting also only refers to the selected cases.…',
      de: '',
    },
  },
  {
    name: 'SETBLOCK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SETDECIMALS',
    syntax: 'SETDECIMALS <varlist> = number ;',
    description: {
      en: 'Serves to explicitly set the decimal point for variables which have already been defined.',
      de: '',
    },
  },
  {
    name: 'SETEPS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SETFILTER',
    syntax:
      'SETFILTER [ <filtername> ] [ TEXT "filtertext" ] = < logical condition >\n;\nENDFILTER [ <filtername> ] ;\nCOPYFILTER <varname> = <varname>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SETMISSING',
    syntax: 'SETMISSING <varlist> = { number }*n;',
    description: {
      en: "A MISSING value is automatically inherited on to variables which emanate from the calculation of other variables. If MISSING values go into a calculation or an 'M' is found in the input then the result is a MISSING value. The variable then receives the characteristic allocated by the user with SETMISSING. Example: SETMISSING = 9999;",
      de: '',
    },
  },
  {
    name: 'SHADE',
    syntax: 'SHADE <boxname> = <number> ;',
    description: {
      en: '(PS): is ignored by line printers.',
      de: '',
    },
  },
  {
    name: 'SHADOW',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SHARE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SHEETNAME',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SHEETNUMBERCHAR',
    syntax: 'SHEETNUMBERCHAR = <char>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SHOWHELPINTEXT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SHOWSHEETNAME',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SHOWSIGNIF',
    syntax: '',
    description: {
      en: 'Be it that a test resulted in a significant difference between column A and column D, then naturally the test between column D and column A would also show a significant difference. The identification of "A" in column D and of "D" in column A is technically correct but nonetheless redundant. In many cases it is preferable to show the significance only once for each pair.…',
      de: '',
    },
  },
  {
    name: 'SHOWSIGNIFONCE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SHOWTTMEAN',
    syntax: '',
    description: {
      en: 'Prints the mean of test variable additional to the indication of significance levels.',
      de: '',
    },
  },
  {
    name: 'SHRINKDATAFONT',
    syntax: '',
    description: {
      en: 'The output of CELLELEMENTS in tables is generally shown on one line and not wrapped. With very extensive significance tests at a low significance level, depending on the size of the chosen font, strings of letters can arise that exceed the available space in narrow columns.…',
      de: 'Die Ausgaben von CELLELEMENTS in Tabellen werden grundsätzlich in einer Zeile dargestellt und nicht umgebrochen. Bei sehr ausgiebigen Signifikanztests mit niedrigem Signifikanzniveau können in Abhängigkeit vo der Größe des eingestellten Fonts Aneinanderreihungen von Buchstaben entstehen, die bei schmalen Spalten den verfügbaren Platz überschreiten.…',
    },
  },
  {
    name: 'SHUFFLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGN3LEVELS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGN3LOWLEVELS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNIF20AND10',
    syntax: '',
    description: {
      en: 'ABC... for the 10% level, abc.... for the 20% level. Description of the significances: for all the options named above (significance levels) there are default texts that describe the respective significance level. SignifText: the SIGNIFTEXT instruction serves to adjust this default text.…',
      de: 'ABC... für 10%-Niveau, abc.... für 20%-Niveau Beschreibung der Signifikanzen Für alle oben benannten Optionen (Signifikanzniveaus) existieren Standardtexte, die das jeweilige Signifikanznivau beschreiben. SignifText Die SIGNIFTEXT-Anweisung dient dazu, diesen Standardtext anzupassen.…',
    },
  },
  {
    name: 'SIGNIF20AND5',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNIF32AND10',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNIF3LEVELS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNIF68',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNIF90',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNIF95',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNIF99',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNIF999',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNIFLEVEL',
    syntax: 'SIGNIFLEVEL = <option>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNIFMINEFFECTCHIQ',
    syntax: 'SIGNIFMINEFFECTCHIQ = <value>;\nSIGNIFMINEFFECTTTEST = <value>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNIFMINEFFECTTTEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNIFTEXT',
    syntax: 'SIGNIFTEXT <option> = "marking text";',
    description: {
      en: 'Adjustment of the default text describing the SIGNIFLEVEL',
      de: 'Anpassung des Standardtextes zur Beschreibung der SIGNIFLEVEL',
    },
  },
  {
    name: 'SIGNPERCENTALWAYS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIGNPERCENTGREATER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIMPLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIMPLEPERCENTILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIMPLEVAR',
    syntax: 'SIMPLEVAR <variable> = <vargroup> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SINGLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SINGLEFROMSTRING',
    syntax: 'SINGLEFROMSTRING = <newvar> = <alphavar>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SINGLEQ',
    syntax:
      'SINGLEQ <varname> = [ TITLE <titletext> ] [ ALPHA ] [ [ start | * ] [\nwidth | BINARY ] ]\n[ LABELS [ AS <varname > | COPY <varname> | MAKE <number> | {\nLabelEntry }*n } ]\n;\nLabelEntry ::=',
    description: {
      en: '(also: VARIABLE) The simplest way to build a question/variable is using the SINGLEQ statement.',
      de: '',
    },
  },
  {
    name: 'SINGLESCOREFILES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SIZE',
    syntax: 'SIZE X/Y <points>',
    description: {
      en: '; If the option MISSING is defined, all variables with MISSING VALUES are output. With EXCLUDEVALUES and RESTRICTVALUES a list of the affected variables with the EXCLUDEVALUES or RESTRICTVALUES found is output. POSTPONE is a special option in connection with INVERTOUT 94 :…',
      de: '; Ist die Option MISSING definiert, werden alle Variablen mit MISSING VALUES ausgegeben. Bei EXCLUDEVALUES und RESTRICTVALUES wird eine Liste der betroffenen Variablen mit den vorgefundenen EXCLUDEVALUES bzw. RESTRICTVALUES ausgegeben. POSTPONE ist ein Spezial-Option im Zusammenhang mit INVERTOUT 94 :…',
    },
  },
  {
    name: 'SLICE',
    syntax: '',
    description: {
      en: 'With SLICE you can split a table in the Y direction into the required number of pages.',
      de: 'Mit SLICE kann man eine Tabelle in der Y-Richtung in die erforderliche Anzahl Seiten zerlegen.',
    },
  },
  {
    name: 'SLICEHEADERFIRST',
    syntax:
      'SLICEHEADERFIRST = [ YES | NO ];\nWith SLICEHEADERFIRST=YES; first all parts of the header (in the X direction',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SLICELASTPAGE',
    syntax: '',
    description: {
      en: 'Tables generated on the Y-Axis SLICE or LINESLICE (e.g. TABLE = y by b SORT POSITION SLICE 10 MEAN( b );) usually have the mean (or other value) on each page. This TABLEFORMAT ensures the printout only on the last page.',
      de: 'Bei auf der Y-Achse zusammengesetzten Tabellen mit SLICE bzw. LINESLICE wird im Standardfall der Mittelwert (oder andere Werte) auf jeder Seite ausgegeben. Mit diesem',
    },
  },
  {
    name: 'SLICESTATISTICS',
    syntax: 'SLICESTATISTICS = <number>;',
    description: {
      en: 'Summary tables of the type: TABLE = #k by Mean( v1 ) Mean( v2 ) Mean( v3 ) Mean( v4 ) Mean( v5 ) Mean( v6 ) Mean( v7 ) Mean( v8 ) … Mean( v99 ) ; can be spread across several pages using the key word SLICESTATISTICS. After setting SLICESTATISTICS = 35; all the following tables of this type are always divided after 35 such rows.',
      de: '',
    },
  },
  {
    name: 'SOMERSDCOL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SOMERSDROW',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SOMERSDSYM',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SORT',
    syntax: 'SORT AS = [ XVALID | YVALID ];',
    description: {
      en: 'Normally the variable characteristics are printed in the order they are defined in VALUELABELS statement. The variable characteristics in the X or Y-Axis can however also be sorted according to other criteria. The key word SORT is written after the variable name followed by the sort criterion which are as follows: ABSOLUTE acc. to absolute cell content MEAN acc. to arithmetical mean SUM acc.…',
      de: '',
    },
  },
  {
    name: 'SORT AS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SORTCLASS',
    syntax:
      'SORTCLASS <varname> OVERCODE <name> = <number>;\nHere the OVERCODE is allocated the SORTCLASS <number> and all labels belonging to the OVERCODE\nreceive the SORTCLASS <number> + 1. In this way OVERCODEs and the relevant label positions can be',
    description: {
      en: 'Usually the SORTCLASS information is given to labels and overcodes in the VALUELABELS statement or the LABELS part of the SINGLEQ, DICHOQ or MULTIQ statement. There are however cases where it makes sense to provide the SORTCLASS information later in the text.…',
      de: 'Vergabe einer Sortierklasse, siehe Sortierungen 466',
    },
  },
  {
    name: 'SORTCODEOVERCODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SORTMEMORY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SORTPOSITION',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SORTSUMMARYALPHA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SORTSUMMARYFREQ',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPACE',
    syntax: '',
    description: {
      en: 'empty cell (needed e.g. to create empty rows or columns in tables for PowerPoint).',
      de: 'leere Zelle (wird z.B. benötigt, um leere Zeilen bzw. Spalten in Tabellen für PowerPoint zu erzeugen)',
    },
  },
  {
    name: 'SPLITCHAR',
    syntax: '',
    description: {
      en: 'Allows a word break at this position (flexible). Default: -',
      de: 'Erlaubt an der Stelle eine Worttrennung (flexibel). Voreinstellung: -',
    },
  },
  {
    name: 'SPLITCHARSTAY',
    syntax: '',
    description: {
      en: 'Preset: Linefeedchar: \\ Numberchar: # Splitchar: - Splitcharstay: # Certain symbols have a special meaning for string output. The LINEFEEDCHAR causes a return in labels or variable titles. The NUMBERCHAR is replaced in table titles by the current table number.…',
      de: "Erlaubt ebenfalls eine Worttrennung, wird aber auch dann als Bindestrich gedruckt, wenn er nicht am Zeilenende steht (fest). Voreinstellung: # Diese Zeichen können umdefiniert werden. Es ist allerdings zu bedenken, dass man dann ggf. auch Systemstandardtexte ändern muss. Zum Beispiel den TOTALTITLE: 'Ins-ge-samt':…",
    },
  },
  {
    name: 'SPLITDICTIONARY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPLITENTRIES',
    syntax: '',
    description: {
      en: 'SPLITENTRIES = <filename>; It is very easy to produce a "dividing" dictionary. If a list is constructed like so Nie~der~sachsen Bundes~land Wahl~ab~sicht Weiterfüh~ren~de Polytech~ni~sche Hoch~schul~reife Selbst~ständige Aus~zu~bil~den~de wahr~schein~lich',
      de: '',
    },
  },
  {
    name: 'SPSS',
    syntax: 'SPSS [ ASCIIOUT ] = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSS VARSTOCASES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSS__',
    syntax: 'SPSS__ = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSALPHALENGTH',
    syntax: 'SPSSALPHALENGTH = <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSFILTERMISSING',
    syntax: 'SPSSFILTERMISSING = <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSGLOBALSEQUENCE',
    syntax: 'SPSSGLOBALSEQUENCE = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSGROUP',
    syntax: 'SPSSGROUP <name> = <familyvarname>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSGROUPLABEL0',
    syntax: '',
    description: {
      en: 'A SPSSGROUP comprises a row of nuclear variables where the Code 0 or 1 shows whether the relevant value is "set". The SPSSGROUP statement has now (as of Version 4.0.2) been expanded so that these nuclear variables can be allocated information from the label of the relevant code of the source variable (MULTIQ).',
      de: '',
    },
  },
  {
    name: 'SPSSGROUPLABEL1',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSGROUPLABELS',
    syntax:
      'SPSSGROUPLABELS = [ YES | NO ];\nSPSSGROUPLABEL1 = <TEXT>;\nSPSSGROUPLABEL0 = <TEXT>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSINFILE',
    syntax: 'SPSSINFILE = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSIO',
    syntax: '',
    description: {
      en: 'Dynamic Link Library files (DLL) that IBM provides for reading, processing and writing SPSS files. 3. Download the files from the „SPSSIO“ folder in the 32- or 64-bit version from our download centre. 4. Save the files in your GESS\\tabs directory. Licensing 5.…',
      de: 'Dynamic Link Library-Dateien (DLL), die IBM zum Lesen, Verarbeiten und Schreiben von SPSS- Dateien bereitstellt. 3. Laden Sie die Dateien aus dem Ordner „SPSSIO“ in der 32- oder 64-bit-Version aus unserem Download-Center herunter. 4. Speichern Sie die Dateien in Ihrem GESS\\tabs-Verzeichnis. Lizenzierung 5.…',
    },
  },
  {
    name: 'SPSSLARGEFILELENGTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSLONGNAMES',
    syntax:
      'SPSSLONGNAMES = [ yes | no ];\nOld versions of SPSS could not use long variable names; GESS tabs shortened the names where',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSNORECODEDLABELS',
    syntax: 'SPSSNORECODEDLABELS = [ YES | NO ]:',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSOUTFILE',
    syntax: 'SPSSOUTFILE = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSOUTSUBFILE',
    syntax:
      'SPSSOUTSUBFILE <internal_name> <varnamelist> = <spss_filename> ;\nSTORESPSSSUBFILE = <internal_name> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSPRINTFORMAT',
    syntax: 'SPSSPRINTFORMAT = <spss-formatcode> <width> <decimals> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSREADMULT',
    syntax: 'SPSSREADMULT = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSSOUTFILE',
    syntax: 'SPSSSOUTFILE = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSVARLABTOTEXT',
    syntax: 'SPSSVARLABTOTEXT = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSWEIGHTOUT',
    syntax: 'SPSSWEIGHTOUT = <varname>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SPSSWRITEMULT',
    syntax: 'SPSSWRITEMULT = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SQRT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SQUARE1',
    syntax: '',
    description: {
      en: 'Square (standing on its base)',
      de: 'Quadrat (auf der Basis stehend)',
    },
  },
  {
    name: 'SQUARE1O',
    syntax: '',
    description: {
      en: 'Square (standing on its base) as outline',
      de: 'Quadrat (auf der Basis stehend) als Outline',
    },
  },
  {
    name: 'SQUARE2',
    syntax: '',
    description: {
      en: 'Square (standing on its point)',
      de: 'Quadrat (auf der Spitze stehend)',
    },
  },
  {
    name: 'SQUARE2O',
    syntax: '',
    description: {
      en: 'Square (standing on its point) as outline',
      de: 'Quadrat (auf der Spitze stehend) als Outline',
    },
  },
  {
    name: 'STACKED',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDAREAS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDAREAS100',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDAREAS3D',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDAREAS3D100',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDBARS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDBARS100',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDBARS100H',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDBARS3D',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDBARS3D100',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDBARS3D100H',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDBARSH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDLINES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDLINES100',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDLINES100WITHSYMBOLS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STACKEDLINESWITHSYMBOLS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STANDARD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STARBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'START',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STARTCOLUMN',
    syntax:
      'STARTCOLUMN = <number>;\nThe automatic designation of columns using * presumes that there is a previous variable; from this the',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STARTEXPORT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STARTLINE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STATIC',
    syntax: 'STATIC <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STATISTICS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STATTESTDUMP',
    syntax: 'STATTESTDUMP = <filename> ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STATUSVARIABLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STDDEV',
    syntax: 'STDDEV <varname> = <varlist>;',
    description: {
      en: 'STDDEV computes the standard deviation of a variable or variable list over all cases of the data set.',
      de: 'STDDEV errechnet die Standardabweichung einer Variable oder Variablenliste über alle Fälle des Datensatzes.',
    },
  },
  {
    name: 'STDERR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STDSIGNIFICANCE',
    syntax: '',
    description: {
      en: 'If this switch is set to YES, then whenever a SIGNIFLEVEL is set and a column-wise significance test is present, the corresponding significance text is output in the BOTTOMTEXT. If there is no BOTTOMTEXT, one is generated.…',
      de: 'Steht dieser Schalter auf YES, dann wird immer dann, wenn ein SIGNIFLEVEL gesetzt ist und ein spaltenweiser Signifikanztest vorliegt, im BOTTOMTEXT der entsprechende Signifikanztext ausgegeben. Gibt es keinen BOTTOMTEXT, wird einer erzeugt.…',
    },
  },
  {
    name: 'STOPONFIRSTERROR',
    syntax: '',
    description: {
      en: 'YES or NO. Preset: YES. If NO the input stream continues to be interpreted even if errors occur in as far as the parser can synchronise itself again; possibly the subsequent errors will gain the upper hand. It is recommended to produce a LISTFILE in any case in order to log the error and the erroneous input. Stays valid until the next STOPONFIRSTERROR command.…',
      de: '',
    },
  },
  {
    name: 'STOREALPHA',
    syntax: 'STOREALPHA <varlist> = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STORELANGUAGE',
    syntax: 'STORELANGUAGE <language> = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STORESPSSSUBFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STORETOBASE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STORETOCSV',
    syntax:
      'STORETOCSV = [ ALL | <varlist> ];\nThe variables declared as <varlist> are written in the order given into the',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STORETOSPSS',
    syntax: 'STORETOSPSS = <varlist>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STRICTINPUTCHECK',
    syntax: 'STRICTINPUTCHECK = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STRICTINPUTHECK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STRICTVARLIST',
    syntax: 'STRICTVARLIST = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STRIPECOLORS',
    syntax:
      "STRIPECOLORS = <color> <color> ;\nWith '<color>' you define the colours in which the rows or columns in tables of type",
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STROKERECT',
    syntax: '',
    description: {
      en: 'Draw a border for RECTANGLES',
      de: 'Umrandung zu RETANGLES zeichnen',
    },
  },
  {
    name: 'STRUCTURE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STYLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'STYLEFILE',
    syntax:
      'STYLEFILE = <filename>;\nUsing the STYLEFILE individual CSS styles can be included. The contents of <filename> are included',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SUBTITLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SUM',
    argsHint: '( Var )',
    syntax: 'SUM <varname> = <varlist>;',
    description: {
      en: "Display of the sum of 'Var'",
      de: "Darstellung der Summe von 'Var'",
    },
  },
  {
    name: 'SUMMARY',
    syntax: 'SUMMARY;',
    description: {
      en: 'The IF ... PRINT ... command in GESS tabs allows comfortable error searches and documentation. It is however often useful to use statistics for error frequency and SUMMARY tables provide just such statistics:',
      de: '',
    },
  },
  {
    name: 'SUMMISSING',
    syntax: 'SUMMISSING = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SUMPERCENT',
    argsHint: '( Var, BasisVar )',
    syntax: '',
    description: {
      en: "The sums are calculated from 'Var' and 'BasisVar'. The sum of 'Var' is output as a percentage share of the sum of 'BasisVar'.",
      de: "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Summe von 'Var' wird als prozentualer Anteil an der Summe von 'BasisVar' ausgegeben.",
    },
  },
  {
    name: 'SUMQUOTIENT',
    argsHint: '( Var, BasisVar )',
    syntax: '',
    description: {
      en: "The sums are calculated from 'Var' and 'BasisVar'. The sum of 'Var' is output as a share of the sum of 'BasisVar'.",
      de: "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Summe von 'Var' wird als Anteil an der Summe von 'BasisVar' ausgegeben.",
    },
  },
  {
    name: 'SUMSUMPERCENT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SUPPRESSEMPTYSHEET',
    syntax: 'SUPPRESSEMPTYSHEET = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SUPPRESSEMPTYTABLE',
    syntax: 'SUPPRESSEMPTYTABLE = [ NO | YES | STRUCTURE ];',
    description: {
      en: 'Usually a table where no cases are relevant is printed as an empty table. Using SUPPRESSEMPTYTABLE = YES this page is suppressed.',
      de: '',
    },
  },
  {
    name: 'SUPPRESSGRIDLINES',
    syntax: 'SUPPRESSGRIDLINES : [YES|NO]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SUPPRESSIFLESS',
    syntax:
      'SUPPRESSIFLESS < cellelement> <place> <type> = <value>;\nplace ::= < DATACELL | FRAMECELL X | FRAMECELL Y >\ntype ::= < ABSOLUTE | PHYSICALRECORDS | VALIDN | VALIDPHYS | ESS >\nWith "<place>" you can refer to the table cell itself, or to the',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SUPPRESSLABEL',
    syntax: '',
    description: {
      en: 'If a variable is a constant (i.e. it has empirically only one characteristic), it can make sense for appearances sake to suppress the label text. This can be achieved with SUPPRESSLABEL. (Only effective with Postscript-printouts). (PS)',
      de: 'Wenn eine Variable eine Konstante ist (d.h. sie hat empirisch nur eine Ausprägung), kann es aus optischen Gründen sinnvoll sein, den Labeltext zu unterdrücken. Dies kann man mit SUPPRESSLABEL erreichen. (Hat nur bei Postscript-Ausgabe Effekt.)',
    },
  },
  {
    name: 'SUPPRESSOVERCODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SUPPRESSSPSSWARNINGS',
    syntax: 'SUPPRESSSPSSWARNINGS = [ ALPHA | VARLABEL | VALUELABELS ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SUPRESSEMPTYTABLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SWAP',
    syntax: '',
    description: {
      en: 'Invert the order of the graphical display',
      de: 'Reihenfolge der graphischen Darstellung invertieren',
    },
  },
  {
    name: 'SWAPLEGEND',
    syntax: '',
    description: {
      en: 'Invert the order of the legend texts.',
      de: 'Reihenfolge der Legendentexte invertieren',
    },
  },
  {
    name: 'SWITCHLANGUAGE',
    syntax: 'SWITCHLANGUAGE = <language name>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SYMBOL',
    syntax: '',
    description: {
      en: 'The line is not shown',
      de: 'Die Linie wird nicht gezeigt',
    },
  },
  {
    name: 'SYMBOLS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SYMBOLSIZE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SYMBOLWIDTH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SYNOPSIS',
    syntax: 'SYNOPSIS = <filename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SYNTAX',
    syntax:
      'SYNTAX { [ POSTPONE ] [ VARIABLES | LABELS | VARTITLE\n| VALUELABELS | MISSING | EXCLUDEVALUES | RESTRICTVALUES|\nMULTIDEF | FORMAT ]}*n = <filename>;\nSYNTAXVARNAMENOQUOTES = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SYNTAXVARNAMENOQUOTES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SYSMISS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SYSTEMCASENO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SYSTEMFILENO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SYSTEMGROUP',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SYSTEMIN',
    syntax: '',
    description: {
      en: 'Output of a system fileto be read. It has to refer to a valid name in the system software. System files are generated with the statement SYSTEMOUT. DATAFILE, COLBININFILE and SYSTEMIN statements can not be used together in a GESS tabs run. The suffix (.TS) is generated automatically.',
      de: '',
    },
  },
  {
    name: 'SYSTEMOUT',
    syntax: 'SYSTEMOUT = <filename> [ [ KEEPVARS | DELETEVARS ] <varlist> ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'SYSTEMWEIGHT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABLE',
    syntax:
      'TABLE [ taboptions ] = <parts> BY <parts>;\ntaboptions ::=\n[\nADD\nNAME <tablename>\nTITLE <tabletitle>\nCELLELEMENTS ( <cellelements> )\nFRAMEELEMENTS ( <frameelements> )\nTABLEFORMATS ( <tableformats> )\nCONTENTKEY <contentkey>\nHIDDEN ( <medium> )\n]\n\nparts ::= part { part }*n\npart ::= content [ filter ] [ option ]\n\ncontent ::=\n[\n<constant> |\n<varname> |\n<cellelement> ( <varname> [ <varname> ] ) |\n<cellelement> ( <varname> [ <varname> ] BY <varname> )\n:DESCRIPTION\n:USEVARTITLE\n:FORMAT\n] \n\nfilter ::= FILTER <condition> |\n\noption ::= SORT sortcontent [ sortpane ] [ cut ]\n\nsortcontent ::= sorttype [ DESCEND ]\nsorttype ::= [ POSITION | ALPHA | CODE | Cellelement ]\nsortpane ::= PANE <value> CODE <value>\n\ncut ::=\n[\nTOP <value > [ SLICE <value> ] |\nBOTTOM <value> |\nEXTREME <value> |\nSLICE <value> |\nLSLICE <value> |\nRANGE <value> <value>\n]',
    description: {
      en: 'The main keyword for cross tables. In its simplest form: TABLE = <var1> BY <var2>; where <var1> is the header variable and <var2> is the variable for the side breakdown.',
      de: '',
    },
  },
  {
    name: 'TABLE ADD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABLE SORT AS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABLE STRUCTURE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABLEBASE',
    syntax: 'TABLEBASE = [ CASES | RESPONSES ];',
    description: {
      en: 'This controls the basis of percentaging in the TABLE printout. The following is preset: TABLEBASE = CASES ; i.e. usually percentaging is on the basis of the number of interviewees. Using TABLEBASE = NOMINATIONS ; the alternative of percentaging on the basis of the number of mentions can be achieved (only relevant for multiple responses).…',
      de: '',
    },
  },
  {
    name: 'TABLECOUNTSWITCH',
    syntax:
      'TABLECOUNTSWITCH = [ NOADDINFRAMEX | NOADDINFRAMEY | NOADDINFRAMETTL ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABLEFILTER',
    syntax: 'TABLEFILTER <number> = TEXT "<text>" <condition>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABLEFILTERBYCODE',
    syntax:
      'TABLEFILTERBYCODE <NUMBER> = [ <options> ] <VARIABLE> ( <CODE> ) ;\n<options> ::= [ VARTITLE | NOMISSING | SUPPRESSOVERCODES | USELABELS ] <options>',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABLEFORMAT',
    syntax: 'TABLEFORMAT = [ + | - | ] { Formatoption ... }*n ;',
    description: {
      en: 'The table appearance can further be controlled using TABLEFORMAT.',
      de: '',
    },
  },
  {
    name: 'TABLEFORMATS',
    argsHint: '( <tableformats> )',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABLEMINIMUM',
    syntax: 'TABLEMINIMUM = <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABLENUMBER',
    syntax: 'TABLENUMBER = <number>;\nDefault: TABLENUMBER = 1;',
    description: {
      en: 'Defines the first number for the tables. Preset: TABLENUMBER = 1; All tables share the same number range. The tables are only counted if there is a hash in the TABLETITLE. This is valid for all tables until changed.',
      de: 'Definiert die Anfangsnummer einer Tabellennumerierungsfolge.',
    },
  },
  {
    name: 'TABLESASJSON',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABLESTATISTICS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABLETITLE',
    syntax: 'TABLETITLE = "<text>";',
    description: {
      en: 'If the standard text "Table #:" is to be replaced it can be done as follows: TABLETITLE = "Summary Table"; If the test is not to appear at all, then: TABLETITLE = ""; If the program finds a hash "#" (more precisely: the NUMBERCHAR) in the string this character is replaced by the current table number. This is valid for all tables until it is changed.',
      de: '',
    },
  },
  {
    name: 'TABLETITLEINHG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABLETYPE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABSELECT',
    syntax: 'TABSELECT <condition>;',
    description: {
      en: 'defines a selection of cases for the following tables. TABSELECT remains valid until a new TABSELECT is defined. Should all cases be processed in the following tables then simply: TABSELECT; is written. (This condition is always true.) The syntax equates to SELECT (non permanent filter).…',
      de: '',
    },
  },
  {
    name: 'TABSELECTBYCODE',
    syntax:
      'TABSELECTBYCODE [ <options> ] <VARIABLE> ( <CODE> );\n<options> ::= [ VARTITLE | NOMISSING | SUPPRESSOVERCODES\n| USELABELS ] <options>',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABTASK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABULATE',
    syntax: 'TABULATE [ INVERSE ] = <tablepart> { / <tablepart> }*n;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TABULATOR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TAN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TAPI',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TAUB',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TAUC',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TEMPLATE',
    syntax: 'TEMPLATE = <templatename>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TERMINATED',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TESTCOLUMNS',
    syntax:
      'TESTCOLUMNS = { test definition }*n;\ntest definition ::= | VARIABLE <varno> CODE <code>\n: VARIABLE <varno> CODE <code>',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TESTCOLUMNSX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TEXT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TEXTBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TEXTBOXFORMAT',
    syntax: '',
    description: {
      en: 'This TABLEFORMAT switches the functions of LOCALTEXTFORMAT on/off.',
      de: 'Dieses TABLEFORMAT schaltet die Funktionen des LOCALTEXTFORMATs ein/aus.',
    },
  },
  {
    name: 'TEXTBOXINHG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TEXTROWHEIGHT',
    syntax: 'TEXTROWHEIGHT <box> : <pixels>\n<box> ::= a box',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TEXTTABLE',
    syntax: 'TEXTTABLE ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TEXTTOPDISTANCE',
    syntax: "TEXTTOPDISTANCE = <number>;\n'<number>' = typographic points",
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TEXTTOSPSSVARLAB',
    syntax: 'TEXTTOSPSSVARLAB = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TEXTWRAP',
    syntax: '',
    description: {
      en: 'Usually the variable texts are presented exactly as they have been defined. TEXTWRAP is used to break up the lines in text boxes.',
      de: 'Im Standardfall werden die Texte von Variablen in Tabellen genauso ausgegeben, wie man sie definiert hat. Mit TEXTWRAP kann man anfordern, dass die Zeilen in den Textboxes umgebrochen werden.',
    },
  },
  {
    name: 'THEN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'THICK',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'THIN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'THOUSANDS',
    syntax: 'THOUSANDS <cellelement> : [ YES | NO ]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TIME',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TIMER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TITLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TITLEBOX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TITLEPAGE',
    syntax:
      'TITLEPAGE ::= { | element }*n ;\nCHAPTERPAGE::= { | element }*n ;\nelement ::= { text | line | drawbox | titlebox | eps }\ntext ::= TEXT { textoption }*n x y <text>\ntextoption ::= : [ font | color ]\nfont ::= USEFONT <fontname> SIZE <number>',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TOP',
    syntax: '',
    description: {
      en: 'The table output can be restricted to certain parts.',
      de: 'Die Tabellenausgabe kann auf bestimmte Teile beschränkt werden.',
    },
  },
  {
    name: 'TOPCUT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TOPMARGIN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TOPTEXT',
    syntax: 'TOPTEXT = "<text>";',
    description: {
      en: 'Text box at the top of the table body',
      de: 'Textbox am oberen Rumpf der Tabelle',
    },
  },
  {
    name: 'TOTALCOLINHG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TOTALCOLU',
    syntax: '',
    description: {
      en: 'Evaluated cases of all values (as defined in CELLELEMENTS) in the',
      de: 'Ausgewertete Fälle aller Werte (wie in CELLELELEMENTS definiert) in der',
    },
  },
  {
    name: 'TOTALCOLUMN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TOTALCOLUMNTABLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TOTALPERCENT',
    syntax: '',
    description: {
      en: "Percentaging of all cells on the table's total N.",
      de: 'Prozentuierung aller Zellen auf das Tabellen- Gesamt-N.',
    },
  },
  {
    name: 'TOTALPERCSTDERR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TOTALROW',
    syntax: '',
    description: {
      en: 'ABSROW and ABSCOLUMN stand for rows (ROW) or columns (COLUMN) with absolute values of the cases or punches where relevant after weighting. PHYSICALROW or PHYSICALCOLUMN refer to the physical case number, i.e. without weighting. In TOTALROW or TOTALCOLUMN all the values for all the cases evaluated are printed as they have been defined in CELLELEMENTS. Example:…',
      de: 'Ausgewertete Fälle aller Werte (wie in CELLELELEMENTS definiert) in der Zeile Beispiel: FRAMEELEMENTS = ABSCOLUMN ABSROW TOTALCOLUMN; Mit FRAMEELEMENTS =; CELLELEMENTS = ABSOLUTE; wird z.B. eine Tabelle erzeugt, die zwar die absoluten Häufigkeiten in den Zellen zeigt, die aber keinerlei Randverteilungen enthält.…',
    },
  },
  {
    name: 'TOTALROWINHG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TOTALSUMPERCENT',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Output of the percentaging of the sum of a third variable on the total sum in the table',
      de: 'Ausgabe der Prozentuierung der Summe einer dritten Variablen auf die Gesamtsumme in der Tabelle',
    },
  },
  {
    name: 'TOTALTITLE',
    syntax: 'TOTALTITLE [ X | Y ] = "<text>";',
    description: {
      en: 'If the standard text "Insgesamt" is to be replaced then: TOTALTITLE = Total; The TOTALTITLE can be set differently for the X or Y axes: Example: TOTALTITLE X = "Total"; TOTALTITLE Y = "Insgesamt"; This is valid for all tables until changed.',
      de: 'Bezeichnung der Totalspalte-/zeile',
    },
  },
  {
    name: 'TRANSFERSUPPRESSEDCONTENTKEY',
    syntax: 'TRANSFERSUPPRESSEDCONTENTKEY = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TRANSLATE',
    syntax:
      'TRANSLATE <postcriptfontname> : <excelfontname>\n[OPTION [BOLD|ITALIC|UNDERLINE]]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TRIANGLE1',
    syntax: '',
    description: {
      en: 'Mark the scale value with a triangle (standing on its base)',
      de: 'Skalenwert mit einem Dreieck markieren (auf der Basis stehend)',
    },
  },
  {
    name: 'TRIANGLE1O',
    syntax: '',
    description: {
      en: 'Triangle (standing on its base) as outline',
      de: 'Dreieck (auf der Basis stehend) als Outline',
    },
  },
  {
    name: 'TRIANGLE2',
    syntax: '',
    description: {
      en: 'Mark the scale value with a triangle (standing on its point)',
      de: 'Skalenwert mit einem Dreieck markieren (auf der Spitze stehend)',
    },
  },
  {
    name: 'TRIANGLE2O',
    syntax: '',
    description: {
      en: 'Triangle (standing on its point) as outline',
      de: 'Dreieck (auf der Spitze stehend) als Outline',
    },
  },
  {
    name: 'TRIMSTRINGS',
    syntax: 'TRIMSTRINGS = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TROWTEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TRUNC',
    syntax: '',
    description: {
      en: 'Before the calculation, both arguments are converted to whole numbers via TRUNC.',
      de: 'Vor der Berechnung werden beide Argumente mittels TRUNC in Ganze Werte gewandelt. D.h.',
    },
  },
  {
    name: 'TRUNCATEDECIMALS',
    syntax: 'TRUNCATEDECIMALS <varlist> = <number>;\n<number> ::= -9 .. 9;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TRYCOUNT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TRYCOUNTCODE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TTEST',
    syntax: 'TTEST = [ INDEPENDENT ]\nTTESTINDEX <number>',
    description: {
      en: 'Independent t-test (per column) MEANTEST ROWMEANTEST Printing of mean value and t-test per column in one Printing of mean value and t-test per row in one cell. cell.',
      de: 'Unabhängiger t-Test auf Mittelwertunterschiede auf Basis der gewichteten Daten, spaltenweise',
    },
  },
  {
    name: 'TTESTABSMIN',
    syntax: 'TTESTABSMIN = <number>;\nTTESTPHYSMIN = <number>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TTESTCUT',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Independent t-test on mean differences, computed on the basis of the data reduction as with MEANCUT',
      de: 'Unabhängiger t-Test auf Mittelwertsunterschiede, berechnet auf Basis der Datenreduktion wie bei MEANCUT',
    },
  },
  {
    name: 'TTESTGREATERCHAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TTESTHEADERS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TTESTINCOMPARE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TTESTINDEX',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TTESTLESSCHAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TTESTPHYSMIN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'TWOCAMEMBERTS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'UNDEFINED',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'UNDERLINE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'UNITS',
    syntax: 'UNITS = [ MM | POINTS | INCH ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'UNIXTIME',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'UPDATEINVERT',
    syntax: 'UPDATEINVERT;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'UPPERCASE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USE3D',
    syntax: 'USE3D : [YES | NO]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USECASES',
    syntax:
      'USECASES = [ ANYCASE | XANDYVALID | XORYVALID | XVALID | YVALID ] ;',
    description: {
      en: 'USECASES controls the treatment of MISSING values in cross tables. Usually the rows and columns of cross tables are suppressed if either no VALUELABEL has been defined or if the relevant characteristic in a MISSING command has been declared a MISSING value, or if a characteristic is recognised as a MISSING value due to explicit coding (see MISSINGCHAR).…',
      de: '',
    },
  },
  {
    name: 'USECOLMAPFILE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USEEPS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USEFILTER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USEFONT',
    syntax:
      'USEFONT <targetname> = <fontname> SIZE <number>; (PS)\nUSEFONT <targetname> = <fontname>; (Non-PS)',
    description: {
      en: 'The font to be used. LEFT | RIGHT | HCENTER horizontal alignment of the text. TOP | BOTTOM | VCENTER vertical alignment of the text. Each of these options has its own syntax: after a USEFONT option, for example, the name and size of a valid font must follow; after the keyword LINEWIDTH a number must necessarily follow, etc.…',
      de: 'Der zu verwendende Font LEFT | RIGHT | HCENTER Horizontale Ausrichtung des Textes TOP | BOTTOM | VCENTER Vertikale Ausrichtung des Textes Jede dieser Optionen hat eine eigene Syntax: Nach einer USEFONT-Option z.B. müssen Name und Größe eines gültigen Fonts stehen, nach dem Schlüsselwort LINEWIDTH muss zwingend eine Zahl stehen usw..…',
    },
  },
  {
    name: 'USEFORMATINHG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USELABELS',
    syntax: '',
    description: {
      en: 'Using COPYLABELS and USELABELS variables can be allocated the VALUELABELS of other variables.',
      de: "unterdrückt Werte von '<code>', denen kein Labeltext entspricht",
    },
  },
  {
    name: 'USEMISSING',
    syntax:
      'USEMISSING = [ YES | NO ];\nDefault: USEMISSING = NO;\nWith USEMISSING = YES; the evaluation of the missing values as well can be enabled for all following tables',
    description: {
      en: 'steers the evaluation of MISSING characteristics in TABLE and COMPARE. USEMISSING = NO; is the preset; using USEMISSING = YES; the MISSING values can be called up for the evaluation of the following tables.',
      de: '',
    },
  },
  {
    name: 'USEOPENASCODE',
    syntax:
      'USEOPENASCODE <varlist> = [ YES | NO ];\nIf this switch is set to YES, an attempt is made to use the open answer for the variables in <varlist>',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USEPOSTSCRIPTALIGN',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USEPOSTSCRIPTCOLORS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USEPOSTSCRIPTFONT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USEPRINTERCOLORS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USERAWSFORSTATS',
    syntax: 'USERAWSFORSTATS = [ YES | NO ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USESCASES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USESELECT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USEVARIABLES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USEVARTITLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USEVISIBLEDIGITSNONLY',
    syntax: 'USEVISIBLEDIGITSNONLY = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USEVISIBLEDIGITSONLY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'USEWEIGHT',
    syntax: 'USEWEIGHT = [ YES | NO | <varname> ] ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'UTF16BE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'UTF16LE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'UTF8',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VALID',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VALIDN',
    syntax: '',
    description: {
      en: "Number of cases for which a valid value of '<existing_variable>' was found",
      de: "Zahl der Fälle, für die ein gültiger Wert der '<bestehende_variable>' gefunden wurde",
    },
  },
  {
    name: 'VALIDPHYS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VALUE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VALUELABELS',
    syntax:
      'VALUELABELS <VarList> = [ ADD ]\n{ LabelEntry }*n ;\nLabelEntry ::=\n[<number> "String" | OVERCODE [ SUM ] [<name>] { <number> [ :<number>\n] }*n "String" ] [ LabelOption ]\nLabelOption ::=',
    description: {
      en: 'an error is output if you use syntax variants without an explicit variable name. For example: COMPUTE f222 = Q17_1; VARTITLE = "formerly Q17_1"; The \'=\' after VARTITLE would trigger the error message. Background: instructions such as RECODE 7:88 = 4; often come after a COMPUTE that is meant to create the variable to be recoded.…',
      de: 'ein Fehler ausgegeben, wenn man Syntaxvarianten ohne explizite Variablennennung benutzt. Zum Beispiel: COMPUTE f222 = Q17_1; VARTITLE = "ehemals Q17_1"; Das \'=\' hinter VARTITLE würde die Fehlermeldung auslösen. Zum Hintergrund: Anweisungen wie z.B. RECODE 7:88 = 4;stehen oft nach einem COMPUTE, das die zu rekodierende Variable erzeugen soll.…',
    },
  },
  {
    name: 'VALUELABELS AS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VALUELABELS COPY',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VARFAMILY',
    syntax:
      'VARFAMILY = <varlist>;\n"<varlist>" is a list of atomic variables.',
    description: {
      en: 'A family is a group of variables with a shared amount of characteristics, e.g. the first, second and third response to a question. These variables can be made into a VARFAMILY which is evaluated instead of the individual variables. Example: VARFAMILY item = item1 TO item4; TABLE = item BY alter; The VARFAMILY automatically has the same VALUELABELs as the first variable used in it.…',
      de: '',
    },
  },
  {
    name: 'VARGROUP',
    syntax:
      'VARGROUP <name> = ( <varlist> ) EQ <valuelist>;\n<varlist> ::= list of atomic variables\n<valuelist> ::= list of individual values',
    description: {
      en: 'defines a group of variables which are to be evaluated together. Usually VARGROUP is used to group individual variables which build a 0/1 group of multi-responses together. Example: VARGROUP Items = ( item.1 item.2 item.3 item.4 ) EQ 1; In front of the equals sign there is the name of the variable group.…',
      de: '',
    },
  },
  {
    name: 'VARIABLE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VARIABLES',
    syntax:
      'VARIABLES <varname><varnumberstart> TO <varname><varnumberend> = [\nstart | * ] [width];',
    description: {
      en: 'Using the VARIABLES statement a series of variables can be generated which are stored together in the data set:',
      de: '',
    },
  },
  {
    name: 'VARIANCE',
    syntax: 'VARIANCE <varname> = <varlist>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VARIATION',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VARKEY',
    syntax: 'VARKEY <varname> = <key>;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VARLABELS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VARLIST',
    syntax: 'VARLIST = <filepath> QST;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VARNAME',
    syntax: '',
    description: {
      en: 'defines a variable and its position in the DATAFILE if necessary in the COPYFILE or also in the COLBININFILE. If a variable in a particular "row" is to be referred to then it is preceded by the key word CARD or COLBININCARD (see below). Example: VARNAME = Alter 101 1; Age is coded in column 101, length = 1. Example: CARD = 3; VARNAME = ITEM37 44 2; ITEM37 is coded in column 44-45 of card 3.…',
      de: '',
    },
  },
  {
    name: 'VARNAMEXINHG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VARNAMEYINHG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VARSTOCASES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VARTEXT',
    syntax: 'VARTEXT <VarList> = "text text ";',
    description: {
      en: 'Variable text 209, typically the question or explanation text. Usually requested with a CITE[...] instruction in the TOPTEXT (see Display of variable texts 523).',
      de: 'Variablentext 209, typischerweise der Frage- oder Erläuterungstext Wird üblicherweise mit einer CITE[...]-Anweisung im TOPTEXT angefordert (siehe Anzeige von Variablentexten 523).',
    },
  },
  {
    name: 'VARTITLE',
    syntax: 'VARTITLE <VarList> = "String";',
    description: {
      en: 'writes the VARTITLE in front of the label text. Example: TABSELECTBYCODE VARTITLE buland( 1 ) ; In this case the VARTITLE is output in front of the label text in the selection description.',
      de: 'schreibt den VARTITLE vor den Labeltext Beispiel: TABSELECTBYCODE VARTITLE buland( 1 ) ; In diesem fall wird in der Selektionsbeschreibung vor dem Labeltext der VARTITLE ausgegeben.',
    },
  },
  {
    name: 'VARTITLE X',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VARTITLE Y',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VCENTER',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VERBOSELOG',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VERTICAL',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VERTICALALIGN',
    syntax:
      'VERTICALALIGN <boxtype> : [TOP|VCENTER|BOTTOM]\nHORIZONTALALIGN <boxtype> : [LEFT|HCENTER|RIGHT]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VIA',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VIRGINSTART',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VOTECOUNTS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VOTES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'VT420TENOVIS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'WEEKOFYEAR',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'WEIGHT',
    syntax: 'WEIGHT = <startcolumn> <width>;\nWEIGHT = <variable name>;',
    description: {
      en: 'discloses where an externally calculated weight is in the data set: Example: WEIGHT = 62 6; (weight is in column 62, Len=6) Alternatively a known variable can be named: ... COMPUTE gewicht = ( a + c ) * 0.1; WEIGHT = Gewicht; ... Here it should be noted that the command WEIGHT= is carried out in the RunTime-Module directly before the case is fed into the tables i.e.…',
      de: '',
    },
  },
  {
    name: 'WEIGHTACCURACY',
    syntax: 'WEIGHTACCURACY = <number>;',
    description: {
      en: 'Defines the accuracy bound up to which iteration should occur. WEIGHTACCURACY is the natural logarithm of the maximum deviance of a weighting cell from the prerequisite as factor. Preset: WEIGHTACCURACY = 0.0001;',
      de: '',
    },
  },
  {
    name: 'WEIGHTCELLS',
    syntax:
      'WEIGHTCELLS [ AUTOALIGN ] <varname> =\n{ <code> : <targetvalue> % }*n\n[ MISSING : <code> : <targetvalue> %\n;',
    description: {
      en: 'Requests weighting according to the variable characteristics. As soon as at least one WEIGHTCELLS statement is found in the source text the program carries out an additional reading run of the data in which the weight factors are calculated. If there are more than one WEIGHTCELLS statement present iterative weighting continues until all the weighting conditions have been fulfilled.…',
      de: '',
    },
  },
  {
    name: 'WEIGHTEND',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'WEIGHTOUT',
    syntax: 'WEIGHTOUT = <startcolumn> <width>;',
    description: {
      en: 'defines where a newly calculated weight is to be stored in the outfile. Syntax as above. Example: WEIGHTOUT = 68 6;',
      de: '',
    },
  },
  {
    name: 'WEIGHTSUM',
    syntax: 'WEIGHTSUM = <number>;',
    description: {
      en: 'States the desired sum of the weights to be calculated. Normally weighting occurs to the number of the cases physically read.',
      de: '',
    },
  },
  {
    name: 'WELCHTEST',
    syntax: '',
    description: {
      en: 'Independent t-test on mean differences per Welch on the basis of the weighted data',
      de: 'Unabhängiger t-Test auf Mittelwerteunterschiede nach Welch auf Basis der gewichteten Daten',
    },
  },
  {
    name: 'WHILEBLOCK',
    syntax: 'WHILEBLOCK <condition> DO',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'WHILEBLOCK DO',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'WHITELIST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'WHITENUMBERS',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'WIDTH',
    syntax: '',
    description: {
      en: 'The width of the TITLEBOX',
      de: 'Die Breite der TITLEBOX',
    },
  },
  {
    name: 'WITH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'WORDSPLITS',
    syntax: 'WORDSPLITS= [ <filename> | "" ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'WRAPTEXT',
    syntax: 'WRAPTEXT <boxtype> : [YES|NO]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'WRITESIGNALFILE',
    syntax: 'WRITESIGNALFILE = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'X',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XANDYVALID',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XCOLCHIQU',
    syntax: '',
    description: {
      en: 'Column-wise 4-field chi-square test on percentage differences (weighted and unweighted)',
      de: 'Spaltenweise 4-Felder Chiquadrat-Test auf Prozentwertunterschiede (gewichtet und ungewichtet)',
    },
  },
  {
    name: 'XCOLDEPTTEST',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Dependent t-test on mean differences (weighted and unweighted)',
      de: 'Abhängiger t-Test auf Mittelwertsunterschiede (gewichtet und ungewichtet)',
    },
  },
  {
    name: 'XCOMPARE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XGC',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XLABELSIGNCHARBOX',
    syntax: 'XLABELSIGNCHARBOX LABELS X : [YES|NO]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XMCNEMAR',
    syntax: '',
    description: {
      en: 'Dependent test on percentage differences (weighted and unweighted) per McNemar',
      de: 'Abhängiger Test auf Prozentwertunterschied (gewichtet und ungewichtet) nach McNemar',
    },
  },
  {
    name: 'XMEANCOLDEPT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XMEANTEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XMEANWELCH',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XORYVALID',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XOVERVIEW',
    syntax:
      'XOVERVIEW <tableoptions> =\n<cellelementlist>( <varlist> ) [ SORT <cellelement>\n[ DESCEND ] [ PANE <number> CODE <number> ] ] BY <header>;\n<varlist> ::= { <variable [ <varoption> ] }*n\n<varoption> ::=\n[ SORTCLASS <number> ]',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XOVERVIEW ADD',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XROWCHIQU',
    syntax: '',
    description: {
      en: 'Row-wise 4-field chi-square test on percentage differences (weighted and unweighted)',
      de: 'Zeilenweise 4-Felder Chiquadrat-Test auf Prozentwertunterschiede (gewichtet und ungewichtet)',
    },
  },
  {
    name: 'XROWMEANTEST',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XROWTTEST',
    syntax: '',
    description: {
      en: 'Row-wise, independent t-test on mean differences (weighted and unweighted)',
      de: 'Zeilenweiser, unabhängiger t-Test auf Mittelwerteunterschiede (gewichtet und ungewichtet)',
    },
  },
  {
    name: 'XTAB',
    syntax: '',
    description: {
      en: 'There is a further possibility of describing cross tables. This second more complicated version makes it easier to tabulate variables next to each other and if necessary to use different weights in one table.',
      de: '',
    },
  },
  {
    name: 'XTTEST',
    argsHint: '(Var )',
    syntax: '',
    description: {
      en: 'Independent t-test on mean differences (weighted and unweighted)',
      de: 'Unabhängiger t-Test auf Mittelwerteunterschiede (gewichtet und ungewichtet)',
    },
  },
  {
    name: 'XVALID',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'XWELCHTEST',
    syntax: '',
    description: {
      en: 'Independent t-test on mean differences (weighted and unweighted) per Welch. * on ColPercT: ColPercTMinimum. In the significance calculation per COLPERCT, column overlap (which can happen with multiple-response variables) is taken into account.…',
      de: 'Unabhängiger t-Test auf Mittelwerteunterschiede (gewichtet und ungewichtet) nach Welch * zu ColPercT: ColPercTMinimum Bei der Signifikanzberechnung nach COLPERCT wird die Spaltenüberlappung (kann bei Mehrfachnennungsvariablen passieren) berücksichtig.…',
    },
  },
  {
    name: 'XYPLOT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'Y',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'YDATABOXES',
    syntax: '',
    description: {
      en: 'YDATABOXES is a box that vertically encloses all DATABOXes of a table. It also extends upwards beyond the FRAMECELLS and the LABELCELLS. With it you can create vertical columns across all elements that visually belong together. DrawBox: drawing of the boxes',
      de: 'YDATABOXES ist eine Box, die alle DATABOXes einer Tabelle senkrecht umfasst. Sie geht auch nach oben über die FRAMECELLS und die LABELCELLS hinaus. Damit kann man über alle Elemente hinweg senkrechte Spalten schaffen, die optisch zusammen hängen DrawBox Zeichnung der Boxes',
    },
  },
  {
    name: 'YDATABOXES X',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'YES',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'YSIGNIFINFRONT',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'YVALID',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ZEROBASED',
    syntax: '',
    description: {
      en: 'The scale should always contain the zero point',
      de: 'Die Skala soll immer den Nullpunkt enthalten',
    },
  },
  {
    name: 'ZERODASHCHAR',
    syntax: 'ZERODASHCHAR = "<char>";',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ZEROMISSING',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ZIPINVERTOUT',
    syntax: 'ZIPINVERTOUT = [ YES | NO ];',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ZONEINPUT',
    syntax:
      'ZONEINPUT <varname> = [ MEAN | SUM | COUNT | MIN | MAX ]\n<start> <zonewidth> <end>\n<varoffset> <varwidth>\n{ SELECT <offset> <string> } *n ;',
    description: {
      en: '',
      de: '',
    },
  },
  {
    name: 'ZRANGE',
    argsHint: '( Var )',
    syntax: '',
    description: {
      en: 'Output of the central range of a variable, mean +/- dispersion * ZVALUE. With ZVALUE you can freely choose this factor, e.g. ZVALUE = 1.0; Default: ZVALUE = 0.967; (2/3 range around the mean). * and **: both CELLELEMENTS respond to the switch BINOMIALPERCENTRANGE. Digression: BiNomialPercentRange',
      de: 'Ausgabe des zentralen Bereichs einer Variablen, Mittelwert +/- Streuung * ZVALUE. Mit ZVALUE kann man diesen Faktor frei wählen, z.B. ZVALUE = 1.0; Voreinstellung: ZVALUE = 0.967; (2/3-Range um Mittelwert) * und **: Beide CELLELEMENTS reagieren auf den Schalter BINOMIALPERCENTRANGE: Exkurs: BiNomialPercentRange',
    },
  },
  {
    name: 'ZVALUE',
    syntax: '',
    description: {
      en: '',
      de: '',
    },
  },
];
