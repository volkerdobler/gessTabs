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
      description: '',
      syntax: '#DEFINE <string>\n#UNDEFINE <string>',
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
      description:
        'and so on is also possible. This is not restricted to numerical uses as list constructs can also be used. Example:',
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
  },
  {
    name: '#DOMACRO4',
    argsHint: '( <filename> )',
    de: {
      description:
        'Einen ähnlichen Hintergrund hat auch das #DOMACRO4-Statement. Der Unterschied ist, dass der Name des Macros nicht im Script festgelegt wird, sondern als erstes Feld in der CSV-Datei benannt wird. Der Aufruf',
      syntax: '#DOMACRO4 ( <filename> )',
    },
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
    name: '#ENDMACRO',
    de: {
      description: 'kann man es anschließend beliebig oft aufrufen:',
    },
    en: {
      description: 'it can be called up as often as required:',
    },
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
  },
  {
    name: '#EXPANDINTOKEN',
    de: {
      description: '',
      syntax:
        '#EXPANDINTOKEN &<search>& <replace>\n<search> ::= zu ersetzender text\n<replace> ::= einzufügender text',
    },
  },
  {
    name: '#IFDEF',
    de: {
      description: '',
      syntax: '#IFDEF <Define-Name>\n<Syntax-Statement 1>',
    },
  },
  {
    name: '#IGNORECASE',
    de: {
      description: '',
      syntax: '#IGNORECASE = [ YES | NO ] ;',
    },
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
    name: '#STDCOLORS',
    de: {
      description:
        'GESSCHART INVERSE CELLELEMENT PHYSCOLDELTA CHARTTITLE "Effekte von Gewichtung auf Parteianteile"',
    },
  },
  {
    name: '#TEST',
    argsHint: '( f2a f2b f2c )',
    de: {
      description:
        "usw. Im ersten Aufruf wird dann 'f1a' anstelle des ersten im Makro definierten Parameters (&p1), 'f1b' anstelle des zweiten Parameter (&p2) und 'f1c' anstelle des dritten Parameters (&p3) eingesetzt. Macros können bis zu 50 Parameter haben. Die Länge der formalen Parameternamen ist auf 10 Zeichen beschränkt. Die Namen von Parametern müssen mit dem &-Zeichen beginnen.…",
    },
    en: {
      description:
        'etc. Macros can have up to 50 parameters. The length of the formal parameter names is restricted to 10 symbols. The names of parameter must begin with an ampersand (&). The key word #ENDMACRO means the same as #MACROEND. The replacements made by a macro are purely text; the order of symbols that conform to the formal parameter names are replaced within the strings or as part of the token.…',
    },
  },
  {
    name: 'ABS',
    en: {
      description:
        'DAYOFWEEK The day of the week in a date in the form YYYYMMDD 1=Monday, 2=Tuesday etc Thus e.g. DAYOFWEEK( 20061030 ) = 1. DAYOFWEEK( 0 ) is today.',
    },
  },
  {
    name: 'ABSCOLUMN',
    de: {
      description:
        'PHYSICALCOLUMN. Im Standardfall einer Tabelle mit absoluten Häufigkeiten ist von den sechs Rahmenelementen nur eines vorhanden: die Zeile mit den absoluten Häufigkeiten, ABSROW. In unserem Fall sollen in den Zellen Spaltenprozente abgebildet werden, das heißt als CELLELEMENTS wählen wir COLUMNPERCENT. Dazu passen eine Totalspalte und eine Absolutzeile.…',
    },
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
    name: 'ABSOLUTE',
    de: {
      description: 'Zahl der Fälle (Summe der Gewichte)',
    },
  },
  {
    name: 'ABSROW',
    de: {
      description: 'Absolute Zahl der Nennungen/ Fälle in der Zeile',
    },
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
    name: 'ACROSS',
    de: {
      description:
        'Die atomaren Elemente von zusammengesetzten CELLELEMENTS werden in PS/PDF-Ausgabe nicht untereinander, sondern nebeneinander dargestellt.',
    },
  },
  {
    name: 'ADD',
    de: {
      description:
        "Editierung bestehender Labellisten, siehe ADD 212 Wird ein LABEL/OVERCODE an eine Position eingefügt, die so nicht 'exsitiert' (z.B. an POSTIION 5 in einer liste mit nur drei VALUELABELS, wird dieses Label einfach ans Listenende angehängt - so, als ob keine POSITION angegeben wäre.",
    },
  },
  {
    name: 'ADDNAMETOVARTITLE',
    de: {
      description: '',
      syntax: 'ADDNAMETOVARTITLE = [ YES | NO ];',
    },
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
    name: 'ADOBELATIN1',
    en: {
      description: '',
      syntax: 'ADOBELATIN1;',
    },
  },
  {
    name: 'ADOBENAME',
    en: {
      description: '',
      syntax: 'ADOBENAME <char> = <name>;',
    },
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
    },
  },
  {
    name: 'ALIGNALPHA',
    de: {
      description: '',
      syntax: 'ALIGNALPHA = [ LEFT | RIGHT ];',
    },
    en: {
      description: '',
      syntax: 'ALIGNALPHA = [ LEFT | RIGHT ];',
    },
  },
  {
    name: 'ALLOWASYMMETRY',
    de: {
      description:
        'asymmetrische Ausgabe der Skala bei RISING/FALLING Analog zum TABLEFORMAT kann man die einzelnen Optionen ein- und ausschalten. Der 534 Zustand von GESSCHARTFORMAT gilt für alle danach stehenden Charts, bis ein weiteres GESSCHARTFORMAT dieses wieder ändert. Mit GESSCHARTFORMAT kann man immer nur alle entsprechenden Elemente beeinflussen.…',
    },
  },
  {
    name: 'ALPHA',
    de: {
      description: '',
      syntax: 'ALPHA <varlist> = YES;',
    },
    en: {
      description:
        '1 100 20 ; In this case the names of politicians are punched in the fields 1-20, 21-40, etc. which makes coding by hand superfluous. If using input from a COLBIN file then the key word ALPHA can obviously not be used. Generally the use of an asterisk instead of the initial column is processed the same as in a SINGLEQ. MULTIQs can also be defined as relocatable.…',
    },
  },
  {
    name: 'ALPHACASESENSITIVE',
    de: {
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
  },
  {
    name: 'ASALPHA',
    de: {
      description: '',
      syntax:
        'ASALPHA <varlist> = [ YES | NO ];\nOPENASALPHA <varlist> = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'ASALPHA <varlist> = [ YES | NO ];',
    },
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
    name: 'ASCIIOUTDECIMALCAR',
    en: {
      description:
        'Defines CHAR value which is to be used as a decimal separator in ASCIIOUT.',
    },
  },
  {
    name: 'ASCIIOUTDECIMALCHAR',
    de: {
      description: '',
      syntax: 'ASCIIOUTDECIMALCHAR = [ . | , ];',
    },
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
    name: 'ASSCOCEND',
    de: {
      description: '',
      syntax: 'ASSCOCEND <filename> ;',
    },
    en: {
      description: '',
      syntax: 'ASSCOCEND <filename> ;',
    },
  },
  {
    name: 'ASSERTFILTERINASCII',
    de: {
      description: '',
      syntax: 'ASSERTFILTERINASCII = [ YES | NO ];',
    },
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
    de: {
      description: '',
      syntax: 'AUTO : [YES | NO]',
    },
  },
  {
    name: 'AUTOCLEAR',
    de: {
      description: '',
      syntax: 'AUTOCLEAR = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'AUTOCLEAR = [ YES | NO ];',
    },
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
    name: 'AUTOOVERSORT',
    en: {
      description:
        'Sorts the OVERCODES in a table and prepares the labels for sorting within the overcode. Overcodes can hierarchically be sorted on up to five levels.',
    },
  },
  {
    name: 'AUTOREPLACEOPEN',
    de: {
      description: '',
      syntax: 'AUTOREPLACEOPEN = [ YES | NO ];',
    },
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
      description: '',
      syntax: 'AUTOSIGNFORMAT = "<formatstring>";',
    },
  },
  {
    name: 'AUTOSIGNIFTEXT',
    de: {
      description: '',
      syntax: 'AUTOSIGNIFTEXT = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'AUTOSIGNIFTEXT = [ YES | NO ];',
    },
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
      description: '',
      syntax: 'BACKGROUND <boxname> = <hue> <saturation> <brightness>;',
    },
  },
  {
    name: 'BCDVAR',
    en: {
      description: '',
      syntax: 'BCDVAR <variable> = <vargroup> ;',
    },
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
    name: 'BINOMIALPERCENTRANGE',
    de: {
      description: '',
      syntax: 'BINOMIALPERCENTRANGE = [ YES | NO ];',
    },
  },
  {
    name: 'BITGROUP',
    en: {
      description: '',
      syntax: 'BITGROUP <vargroup> = <varname> ;',
    },
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
    },
  },
  {
    name: 'BOTTOM',
    de: {
      description:
        'Label wird innerhalb einer Sortierklasse immer ans Ende sortiert, siehe',
    },
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
    },
  },
  {
    name: 'BOXFONT',
    de: {
      description: '',
      syntax:
        'BOXFONT <boxtype> : <fontname> SIZE <number>\n[OPTION [BOLD|ITALIC|UNDERLINE]]',
    },
  },
  {
    name: 'BOXLINEFEED',
    de: {
      description: '',
      syntax: 'BOXLINEFEED <boxname> = <number> ;',
    },
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
    name: 'BY',
    de: {
      description:
        'MEAN VALIDN ( a11 a12 DESCRIPTION "this was a12" USEFONT "Helvetica-Bold" size 9 a13 LEVEL 252 a14 USEWEIGHT dummyweight a15 a16 a17 FILTER a11 EQ 1 OR a12 EQ 5 | SORTCLASS -12 a18 a19 ) SORT MEAN DESCEND; ... folgende Tabelle: Übersichtstabelle mit OVERVIEW mit modifizierten Variablen Gehen wir die Bedeutung dieser Optionen der Reihenfolge nach durch:…',
    },
  },
  {
    name: 'CALCCOLLOWACCURACY',
    de: {
      description: '',
      syntax: 'CALCCOLLOWACCURACY = [ YES | NO ] ;',
    },
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
    name: 'CARD',
    en: {
      description:
        'discloses in which row or "card" the then following variables or weight is to be found. Preset is on CARD=1. CARD and CARDS refer to the DATAFILE (and thus automatically the COPYFILE). Relevant commands are also available for ASCIIOUTFILE, COLBININFILE and COLBINOUTFILE.',
    },
  },
  {
    name: 'CARDNUMBER',
    de: {
      description: '',
      syntax: 'CARDNUMBER = <STARTCOLUMN> <WIDTH>;',
    },
    en: {
      description: '',
      syntax: 'CARDNUMBER = startcolumn width;',
    },
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
    },
  },
  {
    name: 'CASENUMBER',
    en: {
      description:
        'Syntax CASENUMBER = startcolumn width; If the column definition is known for a case number then an identical value is expected at that position for all cards of a case. Divergence leads to an error log which is shown in the lower error window on screen and where necessary in the LISTFILE.',
    },
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
  },
  {
    name: 'CBEXCLUDEMISSING',
    de: {
      description: '',
      syntax: 'CBEXCLUDEMISSING = [ YES | NO ];',
    },
  },
  {
    name: 'CBPERCENTINTOTAL',
    de: {
      description:
        'In der Totalzeile von CODEBOOK 346 werden jeweils die Zahl der Fälle oder die Zahl der Nennungen ausgewiesen. Wird das TABLEFORMAT CBPERCENTINTOTAL gesetzt, werden in den Totalspalte stattdessen Prozentwerte ausgegeben.',
    },
  },
  {
    name: 'CELLELEMENT',
    de: {
      description: '[ MINIMUM <number> ] minimale im PIE abzubildende %-Zahl',
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
    name: 'CELLMINIMUM',
    de: {
      description: '',
      syntax: 'CELLMINIMUM = <value>;',
    },
    en: {
      description:
        'The option CELLMINIMUM states as of which minimum value a table cell counts as valid and should be included. Example: CELLMINIMUM = 10; In all cells where the minimum value has not been reached there will be "-". Preset at 0.0001; CELLMINIMUM as ROWMINIMUM and COLMINIMUM are TABLE options. Options always refer to the last table requested. They are therefore always written after the TABLE command.…',
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
    },
  },
  {
    name: 'CELLSET',
    de: {
      description: 'Statement verwendet werden.',
    },
    en: {
      description:
        'The CELLELEMENTS statement can be used to combine several pieces of information in a single table cell in the parts of the table which span across both axes using LABELS. In summary tables additional summarised rows are often required where e.g. means are to be presented. Due to the syntax this is only one CELLELEMENT, if necessary this can be one that includes two values e.g.…',
    },
  },
  {
    name: 'CHANGESPSSVARNAMES',
    de: {
      description: '',
      syntax: 'CHANGESPSSVARNAMES = [ UPPERCASE | LOWERCASE | NO ];',
    },
  },
  {
    name: 'CHAPTER',
    de: {
      description: '',
      syntax: 'CHAPTER <varlist> = [ {<string>}*n ];',
    },
  },
  {
    name: 'CHAPTERPAGE',
    de: {
      description:
        'Gesellschaft für Software in der Sozialforschung mbH Waterloohain 6 - 8',
    },
  },
  {
    name: 'CHAPTERTITLE',
    de: {
      description: '',
      syntax: 'CHAPTERTITLE = <name>;',
    },
    en: {
      description: '',
      syntax: 'CHAPTERTITLE = <name>;',
    },
  },
  {
    name: 'CHARTHEADER',
    de: {
      description: '',
      syntax:
        'CHARTHEADER = <string> [ TOP | BOTTOM | VCENTER |LEFT\n| RIGHT | HCENTER ] ;\nCHARTFOOTER = <string> [ TOP | BOTTOM | VCENTER |LEFT\n| RIGHT | HCENTER ] ;',
    },
  },
  {
    name: 'CHARTTITLE',
    de: {
      description:
        '"Top-2-Box horizontal nach Modellen: Bullet mit Zahlenangabe (weiß)" CHARTAREA 105 15 87 180 SAMEPAGE HORIZONTAL INVERSE = | FORM CIRCLE ROWS 1:22 COLUMNS 65002 SYMBOLSIZE 10 ; GESSCHARTFONT CHARTNUMBERS = "HELVETICA" SIZE 8; GESSCHARTFORMAT = NUMEXGRAPH NOFRAME NOSCALE; GESSCHARTCOLORS = $EE6699;',
      syntax: 'CHARTTITLE : <title>',
    },
  },
  {
    name: 'CHECKMISSINGINMULTI',
    de: {
      description: '',
      syntax: 'CHECKMISSINGINMULTI = [ YES | NO ];',
    },
  },
  {
    name: 'CHECKRECODES',
    de: {
      description: '',
      syntax: 'CHECKRECODES = [ YES | NO };',
    },
  },
  {
    name: 'CHIQU',
    de: {
      description:
        'Ausgabe des Chi-Quadrats zellenweise. Das Chi-Quadrat bewertet die Abweichung der empirischen Verteilung in jeder Zelle vom anhand der Randverteilungen ermittelten Erwartungswert.',
    },
  },
  {
    name: 'CIRCLE',
    de: {
      description: 'Skalenwert mit einem Kreis markieren',
    },
  },
  {
    name: 'CIRCLEO',
    de: {
      description:
        'LineDash LINEDASH ist ein ganzzahliger Wert zwischen 1 und 10. In GESStabs sind zehn Formen gestrichelter Linien vordefiniert, die man zur Gestaltung von LINE oder RECTLINE abrufen kann. Voreinstellung: 0, das entspricht einer durchgezogenen Linie. LineWidth Die Dicke von LINE bzw. RECTLINE. Explode Ist bei anderen Formen als PIE oder PIE100 wirkungslos.…',
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
    name: 'CLONEVAR',
    de: {
      description: '',
      syntax:
        'CLONEVAR <destinationvar> = <sourcevar>\n[ DELETELABELS [ MISSING | AUTONOANSWER | OVERCODE | {<number>}*n ] ];',
    },
  },
  {
    name: 'CODEBOOK',
    de: {
      description: '',
      syntax: 'CODEBOOK [ EXCEPT ][ <VarList> ] ;',
    },
    en: {
      description: '',
      syntax: 'CODEBOOK [ <VarList> ] ;',
    },
  },
  {
    name: 'CODEBOOKHEADER',
    de: {
      description: '',
      syntax:
        'CODEBOOKHEADER =\n| CODE "Text"\n| ABSOLUTE "Text"\n| COLUMNPERCENT "Text"\n| NOMPERCENT "Text"\n| CUMPERCENT "Text"',
    },
  },
  {
    name: 'CODEBOOKTOTAL',
    de: {
      description: '',
      syntax: 'CODEBOOKTOTAL = "text";',
    },
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
  },
  {
    name: 'CODEINLABELS',
    de: {
      description: '',
      syntax: 'CODEINLABELS = [ YES | NO ];',
    },
  },
  {
    name: 'COLBINCRLF',
    de: {
      description: '',
      syntax: 'COLBINCRLF = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'COLBINCRLF = [ YES | NO ];',
    },
  },
  {
    name: 'COLBINFORMAT',
    de: {
      description: '',
      syntax: 'COLBINFORMAT = <Colbinformatname>;',
    },
  },
  {
    name: 'COLBINFORNAT',
    en: {
      description: '',
      syntax: 'COLBINFORNAT = <Colbinformatname>;',
    },
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
    name: 'COLBININCOLS',
    de: {
      description: '',
      syntax: 'COLBININCOLS = <value>;',
    },
    en: {
      description: '',
      syntax: 'COLBININCOLS = <value>;',
    },
  },
  {
    name: 'COLBININFILE',
    de: {
      description: '',
      syntax: 'COLBININFILE = <filename>;',
    },
    en: {
      description: '',
      syntax: 'COLBININFILE = <filename>;',
    },
  },
  {
    name: 'COLBININSWAPPED',
    de: {
      description: '',
      syntax: 'COLBININSWAPPED = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'COLBININSWAPPED = [ YES | NO ];',
    },
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
    name: 'COLBINOUTCOLS',
    de: {
      description: '',
      syntax: 'COLBINOUTCOLS = <value>;',
    },
    en: {
      description: '',
      syntax: 'COLBINOUTCOLS = <value>;',
    },
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
    de: {
      description: '',
      syntax: 'COLBINOUTSWAPPED = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'COLBINOUTSWAPPED = [ YES | NO ];',
    },
  },
  {
    name: 'COLCHIQU',
    de: {
      description:
        'Spaltenweise 4-Felder Chi²-Test auf Prozentwertunterschied. Um die Chi²-Prüfgröße und den dazu passenden Signifikanzwert zu ermitteln, wird intern eine 4-Felder-Matrix bei jedem Paarvergleich generiert, bei der in der ersten Zeile die beobachteten, absoluten Fälle des gefragten Zellenpaars stehen und in der zweiten Zeile jeweils die Differenz dieser Werte zu den Totalwerten aus der Totalzeile der…',
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
    de: {
      description: 'Abhängiger t-Test auf Mittelwertsunterschiede',
    },
  },
  {
    name: 'COLMEANINVRANK',
    argsHint: '( Var )',
    de: {
      description:
        'Für die Rangplatzberechnungen werden alle Zellen in einer Tabellenspalte miteinander verglichen und es wird ein Rangplatz berechnet, in diesem Fall für den MEAN. Identische MEANs bekommen identische Ränge. Zwei MEAN gelten als identsich, wenn sie dieselbe Druckausgabe ergeben, d.h. es kommt auch auf die verwendeten Formate an.…',
    },
  },
  {
    name: 'COLMEANRANK',
    argsHint: '( Var )',
    de: {
      description:
        'siehe COLMEANINVRANK, aber: der niedrigste Mittelwert bekommt hier den Rang 1',
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
      description: '',
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
  },
  {
    name: 'COLPCTBENCHMARK',
    de: {
      description:
        'Zum Vergleich von Spaltenprozenten mit extern festgelegten Benchmarkwerten (siehe BENCHMARKVALUES 443)',
    },
  },
  {
    name: 'COLPERCANDSIGN',
    en: {
      description: 'Column percent and COLPERCT Tests for Mean Differences:',
    },
  },
  {
    name: 'COLPERCENTDELTA',
    de: {
      description: 'Deltawerte (in Prozentpunkten) zum Wert in der Totalspalte',
    },
  },
  {
    name: 'COLPERCENTINDEX',
    de: {
      description:
        'Indexwerte zu den Spaltenprozenten (100 entspricht dem Wert in der Totalspalte)',
    },
  },
  {
    name: 'COLPERCENTINVRANK',
    de: {
      description:
        'Die Rangbildung basiert auf COLPERCENT, Die Regeln zur Identität gelten entsprechend. Der höchste Wert bekommt dem niedrigsten Rang.',
    },
  },
  {
    name: 'COLPERCENTIRANK',
    de: {
      description:
        'siehe COLPERCENTINVRANK, aber der niedrigste Prozentwert bekommt den Rang 1',
    },
  },
  {
    name: 'COLPERCENTLINELIMIT',
    de: {
      description: '',
      syntax: 'COLPERCENTLINELIMIT = <number>;',
    },
    en: {
      description: '',
      syntax:
        'COLPERCENTLINELIMIT = <number>;\nParallel to the option above, a row is suppressed if a cell has a column percent value of <number>.',
    },
  },
  {
    name: 'COLPERCENTRANK',
    de: {
      description:
        'nach dem Rangplatz des Prozentwerts in der Spalte, kleinster Wert = Rang 1',
    },
  },
  {
    name: 'COLPERCEQUAL',
    de: {
      description:
        'Testet alle Spaltenprozente in der Spalte auf Gleichheit; d.h. alle Abweichungen von der Ungleichverteilung werden als signifikant betrachtet. Hier besteht natürlich die Möglichkeit, sehr viele unsinnige Signifikanzen zu produzieren. Bitte mit Bedacht verwenden. COLPERCT* t-Test auf Prozentwertunterschiede: Test auf Basis von ESS 446 und Spaltenüberlappung',
    },
  },
  {
    name: 'COLPERCTMINIMUM',
    de: {
      description: '',
      syntax: 'COLPERCTMINIMUM = <number>;',
    },
    en: {
      description:
        'In the significance calculation using COLPERCT the column overlaps are taken into account. This method can lead to problematical significances if the number of overlaps is so high that there are only a few cases which do NOT occur in both columns which have been tested against each other.…',
    },
  },
  {
    name: 'COLPERCZ',
    de: {
      description:
        'Spaltenweiser Test der Unterschiede in den erweiterte Z-Test mit Arcus-Sinus-Korrektur benutzt',
    },
  },
  {
    name: 'COLSUMPERCENT',
    argsHint: '( Var )',
    de: {
      description:
        'Ausgabe der Spaltenprozentuierung der Summe einer dritten Variablen, z.B. die Summe von Ausgaben für einen bestimmten Zweck in bestimmten Stadtteilen etc.',
    },
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
    de: {
      description: '',
      syntax: 'COLUMNOFFSET = <number> ;',
    },
    en: {
      description: '',
      syntax: 'COLUMNOFFSET = <number> ;',
    },
  },
  {
    name: 'COLUMNPERCENT100',
    de: {
      description:
        'Nach Hare-Niemeyer-Modell modifizierte Spaltenprozentwerte (Summe ergibt 100), Achtung: nicht geeignet bspw. für Mehrfachnennungsvariablen und OVERCODEs, Tabellen mit unterdrückten MISSING VALUES und selektiv gebildete Variablen',
    },
  },
  {
    name: 'COLUMNRANGE',
    de: {
      description:
        'Ausgabe einer Tabelle mit den unteren und oberen Rändern des Konfidenzintervalls (5%) von Spaltenprozenten COLUMNPERCENTRANGE* Konfidenzintervall für Spaltenprozente ROWPERCENTRANGE** Konfidenzintervall für Zeilenprozente',
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
  },
  {
    name: 'COLUMNSUMMARY',
    de: {
      description: '',
      syntax:
        'COLUMNSUMMARY <zielspalte> [ format "#,#..." ]\n= <function> [ <option>( {<quellspalte>}*n );\n<zielspalte> ::= < varno code >\n<quellspalte> ::= < varno code >\n<function> ::= [ MEAN | SUM | MIN | MAX ]\n<option> ::= [ ZEROMISSING | DASHMISSING ]',
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
    name: 'COMBINEDVAR',
    en: {
      description:
        'COMBINEDVAR produces a VARFAMILY which contains all the individual characteristics of the individual variables next to each other. COMBINEDVAR X = Alter Geschlecht; produces for example a variable family with which a table can evaluate age and sex simultaneously next to one another. COMBINEDVAR is also suitable for allocating one variable to another including its VALUELABELS.',
    },
  },
  {
    name: 'COMPAREVAR',
    en: {
      description: '',
      syntax: 'COMPAREVAR <name> = <Varlist> ;',
    },
  },
  {
    name: 'COMPRESSCODEBOOK',
    de: {
      description: '',
      syntax: 'COMPRESSCODEBOOK = [ YES | NO ];',
    },
    en: {
      description:
        'COMPRESSCODEBOOK = [ YES | NO ]; In the ASCII mode a list of CODEBOOKS can also be printed in a compressed form where a number of CODEBOOKS fit on to one page.',
    },
  },
  {
    name: 'COMPUT',
    de: {
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
    name: 'CONCATCSS',
    de: {
      description: '',
      syntax: 'CONCATCSS = [ YES | NO ];',
    },
  },
  {
    name: 'CONCATFILTERTEXTS',
    de: {
      description: '',
      syntax: 'CONCATFILTERTEXTS = [ YES | NO ];',
    },
  },
  {
    name: 'CONCATNUMTOSTR',
    de: {
      description: '',
      syntax: 'CONCATNUMTOSTR <varlist> = [ YES | NO ];',
    },
  },
  {
    name: 'CONDENSESPSSGROUP',
    de: {
      description: '',
      syntax: 'CONDENSESPSSGROUP = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'CONDENSESPSSGROUP = [ YES | NO ];',
    },
  },
  {
    name: 'CONFIDENCERANGE',
    argsHint: '( Var )',
    de: {
      description:
        'Ausgabe der Konfidenzintervalls einer zusätzlichen Variablen (zwei Werte auf einer Zeile)',
    },
  },
  {
    name: 'CONNECTEXCELCELLS',
    de: {
      description: '',
      syntax: 'CONNECTEXCELCELLS <boxtype> : [YES|NO]',
    },
  },
  {
    name: 'CONTENTFILE',
    de: {
      description: '',
      syntax:
        'CONTENTFILE <option> = <filename>;\noption ::= [ TABLETITLE | TOPTEXT | BOTTOMTEXT | VARIABLES X\n| VARIABLES Y ] [ option ]',
    },
    en: {
      description: '',
      syntax: 'CONTENTFILE <option> = <filename>;',
    },
  },
  {
    name: 'CONTENTKEY',
    de: {
      description: '',
      syntax:
        'CONTENTKEY = [ <text> | TABLETITLE [ [ VARNAME | VARTEXT | VARTITLE ]\n<VARIABLE> ];',
    },
    en: {
      description: '',
      syntax: 'CONTENTKEY = [ <text> | <VARIABLE> ];',
    },
  },
  {
    name: 'CONTENTKEYTOPDF',
    de: {
      description: '',
      syntax: 'CONTENTKEYTOPDF = [ YES | NO ];',
    },
  },
  {
    name: 'CONTENTPAGE',
    de: {
      description: '',
      syntax:
        'CONTENTPAGE = YES\nUSEFONT <font>\n[ TITLE <Überschrift> USEFONT <font> ]\nMARGINS TOP <number> LEFT <number> BOTTOM <number>\nDISTANCE <number>\n;',
    },
  },
  {
    name: 'COPYFILE',
    de: {
      description: '',
      syntax: 'COPYFILE = <path>;',
    },
    en: {
      description:
        'The output of processed and perhaps altered data sets to an ASCII file. With exception of RECODEs, COMPUTEs etc. (see below) the content of the COPYFILE is identical to that of the DATAFILE. (for historical reasons the key word OUTFILE is accepted as a synonym.) (see also ASCIIOUT ALL;)',
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
    en: {
      description: '',
      syntax: 'COPYLABELS <Varlist> = Variable;',
    },
  },
  {
    name: 'COPYTEXT',
    de: {
      description: '',
      syntax: 'COPYTEXT <VarList> = <variable>;',
    },
    en: {
      description: '',
      syntax: 'COPYTEXT <varlist> = <variable>;',
    },
  },
  {
    name: 'COPYTITLE',
    de: {
      description: '',
      syntax: 'COPYTITLE <VarList> = <variable>;',
    },
    en: {
      description: '',
      syntax:
        'COPYTITLE <varlist> = <variable>;\nAll variables in <varlist> (in some cases the last defined variable) contain a reference to the\nVARTITLE of <variable>.',
    },
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
    de: {
      description: '',
      syntax: 'COUNTVALID <resultvars> = <varlist>;',
    },
  },
  {
    name: 'CROSSVAR',
    de: {
      description: '',
      syntax: 'CROSSVAR <newvar> = <var1> <var2> ;',
    },
    en: {
      description:
        'Using CROSSVAR special variable families can be produced which contain all the characteristic combinations of all the variables involved. This can be used to present multiple cross tables in TABLE for example. If one were to define:…',
    },
  },
  {
    name: 'CSSCLASS',
    de: {
      description:
        'Vergabe einer CSS-Klasse für die HTML-Ausgabe, siehe Formatierung 584',
    },
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
    name: 'CSVINALPHA',
    de: {
      description: '',
      syntax: 'CSVINALPHA = <namelist>;',
    },
  },
  {
    name: 'CSVINFILE',
    de: {
      description: '',
      syntax:
        'CSVINFILE [ FILEKEY <key> ] [ <delimchar> ] [ ALLOWEMPTY ]\n= <filepath>;',
    },
  },
  {
    name: 'CSVINPROTOCOL',
    de: {
      description: '',
      syntax: 'CSVINPROTOCOL = <filename>;',
    },
  },
  {
    name: 'CSVOUTFILE',
    de: {
      description: '',
      syntax:
        'CSVOUTFILE = <name>;\n<name> kann ein vollständiger Pfad oder nur ein Dateiname sein. Die Datei-Extension wird',
    },
  },
  {
    name: 'CSVSPECIAL',
    de: {
      description: '',
      syntax: 'CSVSPECIAL = <filepath>;',
    },
  },
  {
    name: 'CSVWEIGHT',
    de: {
      description: '',
      syntax: 'CSVWEIGHT = <varname>;',
    },
  },
  {
    name: 'CUMULATIVE',
    de: {
      description: 'Zeilenweise prozentuiert und kumuliert',
    },
  },
  {
    name: 'DASHMISSING',
    de: {
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
  },
  {
    name: 'DATABOX',
    de: {
      description:
        'Kasten um alle DATACELLS, die zur Kreuzung jeweils zweier Variablen gehören.',
    },
  },
  {
    name: 'DATACELL',
    de: {
      description: 'Jede einzelne Datenzelle der Tabelle',
    },
  },
  {
    name: 'DATAERRORDOCUMENTATION',
    de: {
      description:
        'ERRORTYPE EXCEPT NUMERIC FILTER VARIABLES EXCEPT numtest y1 to y11 = filename; In diesem Fall würden alle Variablen geprüft, die aus dem Input gelesen werden, bis auf "numtest" und die Variablen y1 bis y11. Es würden alle ERRORTYPE geprüft bis auf NUMERIC und FILTER, d.h. die Prüfung erstreckt sich inhaltlich auf LABELS RANGE und ALIGN.',
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
  },
  {
    name: 'DATANOINTERPOL',
    de: {
      description: '',
      syntax: 'DATANOINTERPOL = [ YES | NO ];',
    },
  },
  {
    name: 'DATE',
    de: {
      description:
        'aktuelles Datum in der Form YYYYMMDD als Zahl CurrentMillis aktueller Zeitpunkt in Millisekunden',
    },
  },
  {
    name: 'DATEFORMAT',
    de: {
      description: '',
      syntax: 'DATEFORMAT = <string>;',
    },
    en: {
      description:
        'DATEFORMAT = <string>; In the string the letters Y, M and D are expanded to year, month and day. All other symbols are taken into the date. Thus: DATEFORMAT = "dd.mm.yyyy"; results in the standard European date: 31.10.2009',
    },
  },
  {
    name: 'DAYOFWEEK',
    de: {
      description:
        'Der Wochentag eines Datums in der Form JJJJMMTT: 1=Montag, 2=Dienstag etc., also ist z.B. DAYOFWEEK( 20061030 ) = 1. WeekOfYear(x) Wochennummer (Kalenderwoche)',
    },
  },
  {
    name: 'DBASEIN',
    de: {
      description: '',
      syntax: 'DBASEIN = <filename>;',
    },
    en: {
      description: '',
      syntax: 'DBASEIN = <filename> ;',
    },
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
    },
  },
  {
    name: 'DEFAULTLEVEL',
    de: {
      description: '',
      syntax: 'DEFAULTLEVEL = <number>;',
    },
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
  },
  {
    name: 'DELTAPERCENT',
    argsHint: '( Var, BasisVar )',
    de: {
      description:
        "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Differenz wird auf die 'BasisVar' prozentuiert.",
    },
  },
  {
    name: 'DELTAPOINTS',
    argsHint: '( Var, BasisVar )',
    de: {
      description:
        "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Differenz wird auf die Zahl der gültigen Fälle prozentuiert Name Beschreibung",
    },
  },
  {
    name: 'DELTASUMPERCENT',
    argsHint: '( VarFamily )',
    de: {
      description:
        'Die VarFamily 274 muss vier Einzelvariablen enthalten. Diese bezeichnen jeweils Zähler und Nenner eines Bruches. über Zähler und Nennen werden die Summen berechnet, und bei der Ausgabe wird die Differenz der Quotienten als Prozentwert ausgegeben.',
    },
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
    },
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
    },
  },
  {
    name: 'DICHOQ',
    de: {
      description: '',
      syntax: 'DICHOQ <varname> =',
    },
    en: {
      description:
        'also: GROUPVAR Variable groups can also be generated directly from the input without making the individual variables visible.',
      syntax: 'DICHOQ <varname> =',
    },
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
    },
  },
  {
    name: 'DIV',
    de: {
      description: 'liefert das Ergebnis einer Integer-Division',
    },
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
    },
  },
  {
    name: 'DOUBLECODEINOVERCODE',
    de: {
      description: '',
      syntax: 'DOUBLECODEINOVERCODE = [YES | NO];',
    },
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
    de: {
      description: '',
      syntax: 'DUMMYHEAD = <varname>',
    },
    en: {
      description: '',
      syntax: 'DUMMYHEAD = <name>;',
    },
  },
  {
    name: 'ELASTICITY',
    argsHint: '(PS)',
    de: {
      description: '',
      syntax: 'ELASTICITY = <number>;',
    },
    en: {
      description:
        'Elasticity is a measurement of how the scaling in the X direction is allowed to differ from the scaling in the Y direction. Preset: ELASTICITY = 0.15; Background: Printing in Postscript offers the possibility to scale tables to fit which are larger than the available area on a page. This adjustment can be made independently in the X or the Y direction.…',
    },
  },
  {
    name: 'ELEMENTFONT',
    de: {
      description: '',
      syntax:
        'ELEMENTFONT <cellelement> : <fontname> SIZE <number>\n[STYLE [BOLD|ITALIC|UNDERLINE]]\nELEMENTCOLOR <cellelement> : <color>',
    },
  },
  {
    name: 'ELLIPSIS',
    de: {
      description: 'Konfidenzintervall als Ellipse anzeigen (wenn bekannt)',
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
  },
  {
    name: 'EMPTYSIGNDASH',
    de: {
      description:
        "Im Normalfall wird in Fällen, wo alle Signifikanztests gegen alle Spalten bzw. Zeilen fehlgeschlagen sind, nichts ausgegeben. Da kann bei einem vertikalen Alignment (ALIGN VCENTER 554) zu unerwünschter Optik führen. Ist dies TABLEFORMAT gesetzt, wird in diesen Fälle ein '-' ausgegeben, damit alle Elemente auf derselben Höhe stehen.",
    },
  },
  {
    name: 'EMPTYTABLETEXT',
    de: {
      description: '',
      syntax: 'EMPTYTABLETEXT = "<text>";',
    },
  },
  {
    name: 'ENCODING',
    de: {
      description: '',
      syntax: 'ENCODING CSVOUTFILE = [ ANSI | UTF8 ];',
    },
    en: {
      description:
        'As GESS tabs was born as a DOS program and some clients hate nothing more than a change in standard settings, the Char-Set-Encoding from DOS, i.e. IBM850 for North/Middle Europe is set as standard. This can be changed in two ways: the encoding can be explicitly defined using the ENCODING statement presented here.…',
    },
  },
  {
    name: 'END',
    de: {
      description: '',
      syntax: 'END;',
    },
  },
  {
    name: 'ENDMACRO',
    de: {
      description:
        'Dann würde der Aufruf von #tab( var1 ) ebenso funktionieren wie der Aufruf von #tab( var1 var2 var3 var4 ) #IfExist und #IfNExist Mit #IFEXIST und #IFNEXIST kann man abfragen, ob eine Variable dieses Namens bereits existiert. Anwendungsbeispiele Ein Include-File mit dem Namen "SETPAPER.INC" könnte z.B. folgende Anweisungen enthalten: #IFDEF A4 #IFDEF quer PAPER = Height 210 Width 297;',
    },
  },
  {
    name: 'ENFORCEUTF8INOPENQFILE',
    de: {
      description: '',
      syntax: 'ENFORCEUTF8INOPENQFILE = [ YES | NO ];',
    },
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
    de: {
      description: 'Equal, ist gleich',
    },
  },
  {
    name: 'ESSCOLCHIQU',
    de: {
      description:
        'Spaltenweise 4-Felder Chi²-Test auf Prozentwertunterschied nach Umrechnung aus ESS 446',
    },
  },
  {
    name: 'ESSCOLDEPTTEST',
    de: {
      description:
        'Abhängiger t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS 446 Name Beschreibung',
    },
  },
  {
    name: 'ESSMCNEMAR',
    de: {
      description:
        'Abhängiger Test auf Prozentwertunterschied nach McNemar 449 nach Umrechnung auf ESS 446',
    },
  },
  {
    name: 'ESSROWCHIQU',
    de: {
      description: 'Zeilenweiser Chi²-Test auf Basis der ESS 446-Umrechnung',
    },
  },
  {
    name: 'ESSROWTTEST',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS 446, zeilenweise',
    },
  },
  {
    name: 'ESSTTEST',
    argsHint: '(Var)',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS 446',
    },
  },
  {
    name: 'ESSWELCHTEST',
    de: {
      description:
        'Unabhängiger Welch 450’s t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS 446',
    },
  },
  {
    name: 'EST',
    de: {
      description:
        '|                | MEANTEST | PHYSMEANTE |            | ESSMEANTEST |             | | -------------- | -------- | ---------- | ---------- | ----------- | ----------- | | kombiniert mit |          |            | XMEANTEST  |             | HYMEANTEST  |',
    },
  },
  {
    name: 'EVALFAMVALONCE',
    de: {
      description: '',
      syntax: 'EVALFAMVALONCE <Varlist> = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax:
        'EVALFAMVALONCE <Varlist> = YES or NO;\n(EvalFamValOnce = EVALuate FAMilyvariables VALues ONCE). Using VARFAMILYs it can make',
    },
  },
  {
    name: 'EXCELAXISMINMAX',
    en: {
      description: '',
      syntax: 'EXCELAXISMINMAX = <minvalue> maxvalue> ;',
    },
  },
  {
    name: 'EXCELCHARTINVERT',
    en: {
      description: '',
      syntax: 'EXCELCHARTINVERT = [ YES | NO ];',
    },
  },
  {
    name: 'EXCELDOCUMENT',
    de: {
      description:
        'Kennzeichnung des Tabellenbandes in Excel übertragen. Wenn dies TABLEFORMAT gesetzt ist, werden Zahlen mit Nachkommastellen explizit auf die Zahl der Nachkommastellen',
    },
  },
  {
    name: 'EXCELFILENAME',
    de: {
      description: '',
      syntax: 'EXCELFILENAME = <dateiname>;',
    },
    en: {
      description: '',
      syntax: 'EXCELFILENAME = <filename>;',
    },
  },
  {
    name: 'EXCELGRAPHSHEETNAME',
    en: {
      description: '',
      syntax: 'EXCELGRAPHSHEETNAME = <name>;',
    },
  },
  {
    name: 'EXCELHIDEUPDATE',
    de: {
      description: '',
      syntax: 'EXCELHIDEUPDATE = [ YES | NO ];',
    },
    en: {
      description:
        'If this option is set to YES the Excel interface is only showed by INSTANTEXCEL=YES if a table is finished. This can reduce the processing time for the transfer to Excel. To control the appearance of tables using INSTANTEXCEL: the following TABLEFORMATs are available:…',
    },
  },
  {
    name: 'EXCELNOFONT',
    de: {
      description:
        'trägt dies zur Performance bei. dies gilt auch bei OPENOFFICEDEVIATION. Wenn dies TABLEFORMAT gesetzt ist, wird die DOCUMENT-',
    },
  },
  {
    name: 'EXCELNUMBERFORMAT',
    de: {
      description:
        'formatiert, und damit die Automatik von Excel umgangen, Nullen als Nachkommastellen zu tilgen. EXCELFRAMES Rahmen um die Excel-Tabelle EXCELCOLOR Übernahme von COLOR FOREGROUND bzw. BACKGROUND EXCELALIGN[H/V] Übernahme horizontales/ vertikales Alignment der Zellen EXCELPAGEBREAK generiert einen Seitenwechsel am Ende der Tabelle EXCELHEADER Übernahme eines HEADER nach Excel Bewirkt, dass…',
    },
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
    name: 'EXCELOUTACROSS',
    de: {
      description:
        'Die atomaren Elemente von zusammengesetzten CELLELEMENTS werden bei EXCELOUT 605 nicht untereinander, sondern nebeneinander dargestellt.',
    },
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
    de: {
      description: '',
      syntax: 'EXCELRANGEDELIM = <char>;',
    },
    en: {
      description: '',
      syntax: 'EXCELRANGEDELIM = <char>;',
    },
  },
  {
    name: 'EXCELSTYLEFILE',
    de: {
      description: '',
      syntax: 'EXCELSTYLEFILE = <filename>;',
    },
  },
  {
    name: 'EXCLUDEFROMTO',
    en: {
      description: '',
      syntax: 'EXCLUDEFROMTO = { vartype }*n ;',
    },
  },
  {
    name: 'EXCLUDEVALUES',
    de: {
      description: '',
      syntax:
        'EXCLUDEVALUES <varlist> = <valuelist>;\nRESTRICTVALUES <varlist> = <valuelist>;',
    },
  },
  {
    name: 'EXP',
    de: {
      description: 'inverse Funktion zu LN',
    },
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
  },
  {
    name: 'EXPANDINDOMACRO',
    de: {
      description: '',
      syntax: 'EXPANDINDOMACRO = [ YES | NO ];',
    },
  },
  {
    name: 'EXPANDMISSINGTEXT',
    de: {
      description: '',
      syntax: 'EXPANDMISSINGTEXT = <string>;',
    },
  },
  {
    name: 'EXPECT',
    de: {
      description:
        'Ausgabe der nach der Randverteilung zu erwartenden Zellenbesetzung',
    },
  },
  {
    name: 'EXPORTFILE',
    de: {
      description: '',
      syntax: 'EXPORTFILE = [ <filename> | "" ];',
    },
    en: {
      description: '',
      syntax: 'EXPORTFILE = [ <filename> | "" ];',
    },
  },
  {
    name: 'EXTREME',
    de: {
      description:
        'der Verteilung (EXTREME) können selektiert werden. Beispiele: TABLE = a MEAN( b ) BY c SORT MEAN PANE 2 EXTREME 20; // jeweils 20 von jedem Ende der Verteilung TABLE = a BY c SORT ABSOLUTE TOP 80; // die obersten 80',
    },
  },
  {
    name: 'FALLING',
    de: {
      description:
        'gegenläufige Skalen | HORIZONTAL | VERTICAL ] ] Kombination HORIZONTAL/VERTICAL XY-Plot [ COLOR <$rrggbb> ] Hexadezimaler RGB-Wert [ LINECOLOR < $rrggbb > ] [ NUMINGRAPH | NUMEXGRAPH | Numerische Beschriftung eines grafischen NUMCENTERGRAPH ] Elements innerhalb bzw, außerhalb der Grafik oder in ihr zentriert [ AXISMINMAX <minval> <maxval> Vorbelegung der Skala mit Extremwerten ]',
    },
  },
  {
    name: 'FCOMPUTE',
    de: {
      description: '',
      syntax: 'FCOMPUTE <varname> ....',
    },
    en: {
      description:
        'Parallel to the COMPUTE statement there is also FCOMPUTE, which tests the filters set with SETFILTER. FCOMPUTE is only used if all the filter conditions are true or if there is no filter.',
    },
  },
  {
    name: 'FILEPATH',
    de: {
      description: '',
      syntax: 'FILEPATH "<filepath>"',
    },
  },
  {
    name: 'FILTER',
    de: {
      description:
        'Im Anschluss an jedes Tabellenelement können mit FILTER <Bedingung> | lokale Selektionen 330 vorgenommen werden, zum Beispiel: TABLE = V1 FILTER geschl EQ 1 | V1 FILTER geschl EQ 2 | BY V1 MEANTEST; SORT SORT [ DESCEND ] [ POSITION | ALPHA | CODE | Cellelement ] [ PANE <value> CODE <value> ] :…',
      syntax: 'FILTER <varlist> [ = <Bedingung> | AS <varname> ] ;',
    },
    en: {
      description: '',
      syntax: 'FILTER <varlist> [ = <bedingung> | AS <varname> ] ;',
    },
  },
  {
    name: 'FIRSTCOLUMN',
    de: {
      description: '',
      syntax: 'FIRSTCOLUMN : <number>',
    },
  },
  {
    name: 'FIXEDPOSITION',
    de: {
      description: '',
      syntax: 'FIXEDPOSITION <VarList> = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'FIXEDPOSITION <VarList> = [ YES | NO ];',
    },
  },
  {
    name: 'FIXLABELCOLUMN',
    de: {
      description: '',
      syntax: 'FIXLABELCOLUMN : [YES|NO]',
    },
  },
  {
    name: 'FIXLABELROWS',
    de: {
      description: '',
      syntax:
        'FIXLABELROWS : <number>\nFIXLABELROWS wird den <number> Zeilen-Teil der Tabelle "fix" halten, sodass diese sichtbar',
    },
  },
  {
    name: 'FLOWTEXT',
    de: {
      description: '',
      syntax: 'FLOWTEXT <boxname> : [ YES | NO ]',
    },
  },
  {
    name: 'FONT',
    en: {
      description: '',
      syntax: 'FONT <Fontname> CPI <number> = <ESC-String>;',
    },
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
  },
  {
    name: 'FORCOUNTS',
    de: {
      description:
        'Variable ist vorrangig zur Häufigkeitsauszählung (Tabellenaufriss) sinnvoll.',
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
  },
  {
    name: 'FORM',
    de: {
      description:
        'verwendet werden. [ RECTANGLE | LINE | RECTLINE | TRIANGLE1 | TRIANGLE1O | | TRIANGLE2 | TRIANGLE2O | SQUARE1 | SQUARE1O | SQUARE2 | SQUARE2O | CIRCLE | CIRCLEO | ELLIPSIS | GAUSS | GAUSSO ] ] [ PIE | PIE100 ] [ XYPLOT ] }*n [ DIRECTION [ RISING | Kombination RISING/FALLING',
      syntax: 'FORM : [BARS | COLUMNS | LINES | PIE]',
    },
  },
  {
    name: 'FORMAT',
    de: {
      description: '',
      syntax: 'FORMAT = "<formatstring>";',
    },
    en: {
      description:
        'Defines a format for the representation of a particular cell content. If for example a mean is to be a scale with an algebraic sign, a comma as decimal separator and two decimal places then the following would be written (formats should always be written in quotation marks (") ): FORMAT MEAN = "+#,##"; FORMAT recognises the following control characters:…',
    },
  },
  {
    name: 'FORMATIFLESS',
    de: {
      description: '',
      syntax:
        'FORMATIFLESS <cellelement> [ IN <place> ] BY <typ> <number> = <formatstring>;\ntyp ::= < ABSOLUTE | PHYSICALRECORDS | VALIDN | ESS >\nplace ::= < DATACELL | FRAMECELL X | FRAMECELL Y >',
    },
  },
  {
    name: 'FORMEANS',
    de: {
      description:
        'Variable eignet sich für numerische Statistiken. Syntax LiveTabs Für die Weiterverarbeitung von Datensätzen in GESS LiveTabs ist es notwendig, dass die speziellen Variableneigenschaften für GESS LiveTabs auch im SYNTAX-Include-File weitergegeben werden. Hierzu dient das LIVETABS-Argument für das SYNTAX 42 -Statement.',
    },
  },
  {
    name: 'FRAMECOLOR',
    de: {
      description: '',
      syntax: 'FRAMECOLOR : <color>',
    },
    en: {
      description:
        'The colour of the frames can also be defined using HSB or RGB as above. COLOR FOREGROUND or COLOR BACKGROUND With the COLOR statement DATACELLS and FRAMECELLS can be coloured depending on the value, e.g. all mean above a certain value are printed in red etc.',
    },
  },
  {
    name: 'FRAMECROSS',
    de: {
      description:
        'Der Schnittpunkt von FRAMEBOX X und FRAMEBOX Y FRAMETITLE X Kasten um Bezeichnung von FRAMEELEMENTS der X-Achse (z.B. Insgesamt) FRAMETITLE Y Kasten um Bezeichnung von FRAMEELEMENTS der Y-Achse (z.B. Insgesamt) FRAMETITLEBOX X Kasten um alle FRAMETITLE-Boxes der X-Achse FRAMETITLEBOX Y Kasten um alle FRAMETITLE-Boxes der Y-Achse',
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
    },
  },
  {
    name: 'GAUSS',
    de: {
      description: 'Konfidenzintervall als stilisierte Gausskurve anzeigen',
    },
  },
  {
    name: 'GAUSSO',
    de: {
      description:
        'Konfidenzintervall als stilisierte Gausskurve anzeigen (outline)',
    },
  },
  {
    name: 'GENERATELABELS',
    de: {
      description: '',
      syntax: 'GENERATELABELS <varname>;',
    },
    en: {
      description: '',
      syntax: 'GENERATELABELS <varlist>;',
    },
  },
  {
    name: 'GEOMETRICMEAN',
    argsHint: '( Var )',
    de: {
      description:
        'Das geometrische Mittel ist die n.-Wurzel aus dem Produkt aller Einzelwerte (nur für positive Zahlen definiert)',
    },
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
  },
  {
    name: 'GESSCHARTCOLORS',
    de: {
      description:
        'der erste Farbwert der definierten ausgewählt werden. Anstelle eines Grüntons sollen die Säulen blau eingefärbt werden, die erste Position des bestehenden Farbschemas wird | ausgetauscht    | und anschließend |              | das Chart angefordert:…',
      syntax: 'GESSCHARTCOLORS = { <colorvalue> }*n ;\n<colorvalue> = $rrggbb',
    },
  },
  {
    name: 'GESSCHARTFORMAT',
    de: {
      description: '',
      syntax: 'GESSCHARTFORMAT = { + | - <option> }*n ;',
    },
  },
  {
    name: 'GESSCHARTNUMFORMAT',
    de: {
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
  },
  {
    name: 'GLOBALASALPHA',
    de: {
      description: '',
      syntax:
        'GLOBALASALPHA = [ YES | NO ];\nGLOBALOPENASALPHA = [ YES | NO ];',
    },
  },
  {
    name: 'GLOBALCOLMINIMUM',
    en: {
      description: 'Global preset for COLMINIMUM for all the following tables.',
    },
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
    name: 'GRAPHAREA',
    de: {
      description: '',
      syntax: 'GRAPHAREA = <x> <y> <width> <height> ;',
    },
  },
  {
    name: 'GRAPHBOX',
    de: {
      description:
        'Kasten mit der Liniengraphik in PROFILE 637-Tabellen | HEADERBOX | Kasten um den HEADER |     |     |     | | --------- | -------------------- | --- | --- | --- | 516, außerhalb der Tabelle | INSTITUTION | Kasten um die INSTITUTION |     | 520-Angabe |     | | ----------- | ------------------------- | --- | ---------- | --- | LABELS X |     | VALUELABELS | 211 auf der X-Achse |     |     | | ---…',
    },
  },
  {
    name: 'GRAPHTYPE',
    en: {
      description: '',
      syntax: 'GRAPHTYPE = <xlGraphname>;',
    },
  },
  {
    name: 'GROUPCOUNTS',
    de: {
      description: '',
      syntax: 'GROUPCOUNTS <Varlist> = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'GROUPCOUNTS <Varlist> = [ YES | NO ];',
    },
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
    name: 'GT',
    de: {
      description: 'Greater Then, größer als',
    },
  },
  {
    name: 'HARMONICMEAN',
    argsHint: '( Var )',
    de: {
      description:
        'Das harmonische Mittel: Kehrwert aus dem Mittelwert der Kehrwerte (nur für positive Zahlen definiert). Findet in Name Beschreibung speziellen Fällen Anwendung, z.B. als Mittelwert über Geschwindigkeiten etc.',
    },
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
    },
  },
  {
    name: 'HEADERS',
    en: {
      description: '',
      syntax: 'HEADERS = <tablepart> { / <tablepart> }*n;',
    },
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
  },
  {
    name: 'HIDDENTOVARLIST',
    de: {
      description: '',
      syntax: 'HIDDENTOVARLIST = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'HIDDENTOVARLIST = [ YES | NO ];',
    },
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
  },
  {
    name: 'HTML2EXCELFLOWTEXT',
    de: {
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
  },
  {
    name: 'HTMLDOCUMENT',
    de: {
      description:
        'überträgt die Informationen der DOCUMENT 521-Box in die HTML-Ausgabe.',
    },
  },
  {
    name: 'HTMLFLOWTEXT',
    de: {
      description: '',
      syntax: 'HTMLFLOWTEXT <boxtype> = [ YES | NO ];',
    },
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
    name: 'HTMLHEADER',
    de: {
      description:
        'überträgt die Informationen der HEADER 516-Box in die HTML- Ausgabe.',
    },
  },
  {
    name: 'HYCOLCHIQU',
    de: {
      description: 'Hybrider 447 Chi²-Test (gewichtet und ungewichtet)',
    },
  },
  {
    name: 'HYCOLDEPTTEST',
    de: {
      description:
        'Hybrid 447 ausgestalteter t-Test für abhängige Daten. Der t- ( Var ) Wert wird auf der Basis der gewichteten Daten ermittelt, der t- Test erfolgt auf der Basis der ungewichteten Freiheitsgrade',
    },
  },
  {
    name: 'HYMCNEMAR',
    de: {
      description:
        'McNemar 449 hybrid: aus den gewichteten Daten wird der Anteil der diskordanten Paare ermittelt. Aus dem gewichtet ermittelten Anteil der diskordanten Paare werden hypothetische ungewichtete Häufigkeiten für diese ermittelt. Diese bilden dann die Grundlage des McNemar-Tests.',
    },
  },
  {
    name: 'HYPERLINK',
    de: {
      description: '',
      syntax: 'HYPERLINK = <URI> <text> ;',
    },
  },
  {
    name: 'HYROWTTEST',
    de: {
      description:
        'Hybrider 447, zeilenweiser t-Test: Die t-Werte werden auf Basis der gewichteten Daten errechnet, die Freiheitsgrade zur Name Beschreibung Berechnung der p-Werte der t-Verteilung ergeben sich aus den ungewichteten Häufigkeiten.',
    },
  },
  {
    name: 'HYTTEST',
    argsHint: '(Var )',
    de: {
      description:
        'Hybrider 447 t-Test: Die t-Werte werden auf Basis der gewichteten Daten errechnet, die Freiheitsgrade zur Berechnung der p-Werte der t-Verteilung ergeben sich aus den ungewichteten Häufigkeiten.',
    },
  },
  {
    name: 'HYWELCHTEST',
    de: {
      description:
        'Hybrider 447 t-Test auf Mittelwerteunterschiede nach Welch 450 auf Basis der gewichteten Daten',
    },
  },
  {
    name: 'IDENTCHIQNOSIGNIF',
    de: {
      description:
        'Wenn man eine Variable gegen sich selbst tabelliert, sind die Besetzungen natürlich hochsignifikant, aber aussageleer. Die Ausgabe der Signifikanzkennzeichnung kann hiermit unterdrückt werden.',
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
    de: {
      description: '',
      syntax: 'IFASFIF = [ YES | NO ];',
    },
  },
  {
    name: 'IFBLOCK',
    de: {
      description: '',
      syntax: 'IFBLOCK <bedingung> THEN',
    },
  },
  {
    name: 'IGNOREASCOUTDUPL',
    de: {
      description: '',
      syntax: 'IGNOREASCOUTDUPL = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'IGNOREASCOUTDUPL = [ YES | NO ];',
    },
  },
  {
    name: 'IGNORECASEINCOMPARE',
    de: {
      description: '',
      syntax: 'IGNORECASEINCOMPARE = [ YES | NO ];',
    },
  },
  {
    name: 'IGNOREDOUBLECASENO',
    en: {
      description: '',
      syntax: 'IGNOREDOUBLECASENO = [ YES | NO ];',
    },
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
    de: {
      description: '',
      syntax: 'IGNOREMULTIQOVERFLOW = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'IGNOREMULTIQOVERFLOW = [ YES | NO ];',
    },
  },
  {
    name: 'IGNORESETFILTER',
    de: {
      description: '',
      syntax: 'IGNORESETFILTER = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'IGNORESETFILTER = [ YES | NO ];',
    },
  },
  {
    name: 'IGNORESPSSMISSINGVALUES',
    de: {
      description: '',
      syntax: 'IGNORESPSSMISSINGVALUES = [ YES | NO ];',
    },
  },
  {
    name: 'IGNORESPSSSYSMISVAL',
    de: {
      description: '',
      syntax: 'IGNORESPSSSYSMISVAL = [ YES | NO ];',
    },
  },
  {
    name: 'IGNORETABINTEXT',
    de: {
      description: '',
      syntax: 'IGNORETABINTEXT = [ yes | no ];',
    },
    en: {
      description: '',
      syntax: 'IGNORETABINTEXT = [ yes | no ];',
    },
  },
  {
    name: 'IN',
    de: {
      description:
        'Einschluss von Wertemengen/-bereichen Logische Verknüpfungen sind möglich mit:',
    },
  },
  {
    name: 'INCLUDE',
    de: {
      description: '',
      syntax: 'INCLUDE = <filename.inc>;',
    },
    en: {
      description:
        'Defines an INCLUDE file. Commands from the INCLUDE file are interpreted as if they were in place of the INCLUDE commands. Example: INCLUDE = VARNAME.def; INCLUDE = Labels.def; This can be used for example to administrate the variable definitions and the VALUELABELS in different files so that changes in the column positions etc only have to be changed in the definition part. In the',
    },
  },
  {
    name: 'INCLUDETITLEINTEXT',
    de: {
      description: '',
      syntax:
        'INCLUDETITLEINTEXT <varlist> = [ YES | NO ];\nFür alle Variablen, die in <varlist> aufgeführt sind, wird der VARTEXT um den Inhalt von',
    },
  },
  {
    name: 'INDENTAUTOOVERSORT',
    de: {
      description: '',
      syntax: 'INDENTAUTOOVERSORT = [ YES | NO ];',
    },
  },
  {
    name: 'INDEXCHARS',
    de: {
      description: '',
      syntax: 'INDEXCHARS = "<Buchstaben | Zeichen>";',
    },
    en: {
      description:
        'e.g. INDEXCHARS = "GEHT"; allocates a (small or large) G to the first test column, an E to the second, an H to the third and a T to the fourth. The letters A – Z are preset. TESTCOLUMNS are taken into account. The letters A – Z can initially be used as INDEXCHARS to deal with 26 columns.…',
    },
  },
  {
    name: 'INDEXSTYEFILE',
    de: {
      description: '',
      syntax: 'INDEXSTYEFILE = <name>;',
    },
    en: {
      description: '',
      syntax: 'INDEXSTYEFILE = <name>;',
    },
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
    name: 'INHERITBACKGROUND',
    de: {
      description: '',
      syntax:
        'INHERITBACKGROUND [ X | Y ] = [ YES | NO ];\nINHERITFOREGROUND [ X | Y ] = [ YES | NO ];',
    },
  },
  {
    name: 'INHERITFONT',
    de: {
      description: '',
      syntax: 'INHERITFONT [ X | Y ] = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'INHERITFONT [ X | Y ] = [ YES | NO ];',
    },
  },
  {
    name: 'INIT',
    en: {
      description: '',
      syntax: 'INIT <varlist> = <value list>;',
    },
  },
  {
    name: 'INSTANTEXCEL',
    de: {
      description: '',
      syntax: 'INSTANTEXCEL = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'INSTANTEXCEL = [ YES | NO ];',
    },
  },
  {
    name: 'INSTANTPDF',
    de: {
      description: '',
      syntax: 'INSTANTPDF = [ YES | NO ];',
    },
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
    },
  },
  {
    name: 'INTERVALS',
    de: {
      description: '',
      syntax:
        'INTERVALS <newvar> = <sourcevar> { | <labeltext> :\n<comparison> <comparevalue> }*n;\n<comparison> ::= [ LT | GT | LE | GE ]',
    },
  },
  {
    name: 'INVERSE',
    de: {
      description:
        'CHARTTITLE "Eine GESStabsArtist Graphik auf der Basis der Mittelwerte aus der OVERVIEW-Tabelle\\CELLELEMENT MEAN" CELLELEMENT MEAN',
      syntax: 'INVERSE : [YES | NO]',
    },
  },
  {
    name: 'INVERTFILEWEIGHTOUT',
    de: {
      description: '',
      syntax: 'INVERTFILEWEIGHTOUT = <variable>;',
    },
  },
  {
    name: 'INVERTIN',
    de: {
      description: '',
      syntax: 'INVERTIN = <path>;',
    },
  },
  {
    name: 'INVERTOUT',
    de: {
      description: '',
      syntax: 'INVERTOUT = <path>;',
    },
  },
  {
    name: 'INVERTOUTMAX',
    de: {
      description: '',
      syntax: 'INVERTOUTMAX = <number>;',
    },
  },
  {
    name: 'INVERTOUTVARS',
    de: {
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
    name: 'KEY',
    de: {
      description: '',
      syntax:
        'KEY OPENQFILE = <varname> ;\nIn der Regel wird hierzu die CASENUMBER verwendet; man kann aber beliebige Variablen als\nSchlüssel in OpenQFiles verwenden. Diese Variable muss atomar sein; darf aber auch vom Typ',
    },
  },
  {
    name: 'KEYWORD',
    de: {
      description:
        'Syntaxstrukturen werden so aufgeführt: Dies ist die grundsätzliche Syntaxstruktur einer GESStabs-Funktionalität. Beispielhafte Syntaxausschnitte sehen entsprechend aus: Dies ist ein beispielhafter Syntaxabschnitt Einführung in die Tabellierung',
    },
  },
  {
    name: 'LABELFORMAT',
    de: {
      description: '',
      syntax: 'LABELFORMAT <varlist> = <formatstring>;',
    },
    en: {
      description: '',
      syntax: 'LABELFORMAT <varlist> = <string>;',
    },
  },
  {
    name: 'LABELRECODE',
    de: {
      description: '',
      syntax: 'LABELRECODE = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'LABELRECODE = [ YES | NO ];',
    },
  },
  {
    name: 'LABELS',
    de: {
      description: '',
      syntax: 'LABELS : [0 | 1 | 2]',
    },
    en: {
      description:
        '1 "18#24" 2 "25#30" 3 "31#45" 4 "46#60" 5 "61 and älter"; SINGLEQ Bezirk = 43',
    },
  },
  {
    name: 'LABELSTOTITLE',
    de: {
      description: '',
      syntax: 'LABELSTOTITLE <labelcode> = <varlist>;',
    },
    en: {
      description: '',
      syntax: 'LABELSTOTITLE <labelcode> = <varlist>;',
    },
  },
  {
    name: 'LABELVALUE',
    de: {
      description: '',
      syntax: 'LABELVALUE <numvariable> = <variable>;',
    },
  },
  {
    name: 'LABELWIDTH',
    de: {
      description: '',
      syntax: 'LABELWIDTH : <number>\nCOLUMNWIDTH : <number>',
    },
  },
  {
    name: 'LANGUAGES',
    de: {
      description: '',
      syntax: 'LANGUAGES = <csv-file-name>;',
    },
  },
  {
    name: 'LEADINGZEROS',
    de: {
      description: '',
      syntax: 'LEADINGZEROS = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'LEADINGZEROS = [ YES | NO ];',
    },
  },
  {
    name: 'LEGENDPOSITION',
    de: {
      description: '',
      syntax: 'LEGENDPOSITION : [TOP | BOTTOM | LEFT | RIGHT]',
    },
  },
  {
    name: 'LINEFEEDCHAR',
    de: {
      description:
        'Erzwingt in VALUELABELS 211 oder VARTITLE 210s einen Zeilenumbruch. Voreinstellung: \\',
    },
  },
  {
    name: 'LINEFEEDFACTOR',
    de: {
      description: '',
      syntax: 'LINEFEEDFACTOR = <number>;',
    },
    en: {
      description: '',
      syntax: 'LINEFEEDFACTOR = <number>;',
    },
  },
  {
    name: 'LINEWIDTH',
    de: {
      description: 'Die Dicke des Umrandungsstrichs. 0.0 = keine Umrandung.',
    },
  },
  {
    name: 'LISTFILE',
    de: {
      description: '',
      syntax: 'LISTFILE = <filename>;',
    },
    en: {
      description:
        'Normally the interpretation of the commands is logged on the screen. This log or parts of it can be directed into a file which is declared as a LISTFILE. Example: LISTFILE = Tables.Err; If the interpretation is to appear back on the screen as of a certain point this can be achieved using: LISTFILE = con;',
    },
  },
  {
    name: 'LISTON',
    de: {
      description: '',
      syntax: 'LISTON = [ YES | NO ];',
    },
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
    en: {
      description: '',
      syntax: 'LISTVARS= <filename> [ options ];',
    },
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
    name: 'LSLICE',
    de: {
      description:
        'von Einzeltabellen zerlegen. TABLE = a BY b SORT ABSOLUTE DESCEND SLICE 15; Hiermit wird eine Tabelle mit z.B. 55 Einzelitems in der Variablen b in 4 Seiten zerlegt. Falls eine Zerlegung eine Restseite mit nur einer Nennung ergeben würde, wird diese Nennung mit auf die Vorseite gedruckt. Eine Tabelle mit 61 Items würde also auf 4 und nicht auf 5 Seiten gedruckt.',
    },
  },
  {
    name: 'LT',
    de: {
      description: 'Lower Then, kleiner als',
    },
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
    name: 'MAKEFAMILY',
    de: {
      description: '',
      syntax:
        'MAKEFAMILY <name> = <value>;\nMit MAKEFAMILY generiert man eine leere VARFAMILY bzw. MultiQ mit n (<value>)',
    },
    en: {
      description: '',
      syntax: 'MAKEFAMILY <name> = <value>;',
    },
  },
  {
    name: 'MAKEGROUP',
    de: {
      description: '',
      syntax:
        'MAKEGROUP <name> = <value>;\nMit MAKEGROUP wird eine leere Gruppenvariable mit n (<value>) Einzelvariablen generiert, die',
    },
    en: {
      description: '',
      syntax: 'MAKEGROUP <name> = <value>;',
    },
  },
  {
    name: 'MAKESINGLE',
    de: {
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
    de: {
      description: '',
      syntax: 'MARKCELLEXCELSPECIAL = [ YES | NO ];',
    },
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
    name: 'MARKCELLSMETHOD',
    de: {
      description: '',
      syntax:
        'MARKCELLSMETHOD = [ CLASSIC | COLCHIQU | ROWCHIQU\n| HYCOLCHIQU | HYROWCHIQU ];',
    },
  },
  {
    name: 'MAX',
    de: {
      description:
        'Max-Wert In der einfachsten Form lautet ein DATA-Statement z.B.: DATA MEAN GlobMeanQ1 = Q1; Die Variable Q1 in dem Beispiel muss existieren. Als Resultat steht dann im Tabellierungsprozess die neue atomare Variable "GlobMeanQ1" zur Verfügung. Ihr Wert ist der globale Mittelwert von Q1 über alle eingelesenen Fälle.…',
    },
    en: {
      description: '',
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
    },
  },
  {
    name: 'MAXCOLSPERTABLEPAGE',
    de: {
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
    },
  },
  {
    name: 'MAXINDEX',
    de: {
      description: '',
      syntax:
        'MAXINDEX <resultvar> = <varlist>;\nMININDEX <resultvar> = <varlist>;',
    },
  },
  {
    name: 'MAXLINELENGTH',
    en: {
      description:
        '<historisch> Defines the maximum length of a row in the input file. Maximum: 50000. Preset: 3000. By designating a lower MAXLINELENGTH storage memory can be saved which can be used for other purposes e.g. for tables. This is particularly relevant if there is a data set in which the cases are made up of many short rows (see CARDS).…',
    },
  },
  {
    name: 'MAXWEIGHTITERATIONS',
    de: {
      description: '',
      syntax: 'MAXWEIGHTITERATIONS = <number>;',
    },
  },
  {
    name: 'MCNEMAR',
    de: {
      description:
        'Abhängiger Test auf Prozentwertunterschiede nach McNemar 449',
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
  },
  {
    name: 'MEANCUT',
    argsHint: '( Var )',
    de: {
      description:
        'Spezieller Mittelwerte: MEANCUT schneidet am unteren und oberen Ende der Verteilung die Extremwerte ab, und berechnet den Mittelwert auf der Basis der verbleibenden Verteilung je Zelle. Kann die Extremgruppe nicht aus ganzen Fällen gebildet werden, wird anteilige Gewichtung verwendet. Die Größe Extremabschnitte wird in Prozentpunkten definiert:…',
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
    name: 'MEANP',
    argsHint: '( Var )',
    de: {
      description:
        "Von der Berechnung her ist MEANP (vorgesehen als: MEAN für Prozentwerte) exakt dasselbe wie MEAN 423. Der zweite Bezeichner dient nur dazu, dass man diesem CELLELEMENT ein abweichendes FORMAT 566 oder DESCRIPTION geben kann. Als Default hat dieses CELLELEMENT die DESCRIPTION 385 'fake%'. Für die Tabellenausgabe wird man dies ggf. besser in '%' ändern.",
    },
  },
  {
    name: 'MEANQP',
    de: {
      description:
        'Ergänzend zu MEANP (also im Kern: MEAN) gibt noch eine kleine',
    },
  },
  {
    name: 'MEANQP100',
    de: {
      description:
        'Erweiterung: MEANQP. Parallel zur Summe und zur Basis (Summe der Gewichte) wird eine Summe aller negativen Werte und der dazugehörigen Gewichte geführt. Als Resultat liefert dieses CELLELEMENT den Quotienten der Mittelwerte der positiven und der negativen Werte. MEANQP100 ist von der Berechnung her identisch, der Wert wird lediglich mit 100 multipliziert.',
    },
  },
  {
    name: 'MEANROWINDEX',
    argsHint: '( Var )',
    de: {
      description:
        'Zeilenweise Darstellung des Mittelwertes als Index, jeweils auf den Mittelwert in der Totalzeile bezogen',
    },
  },
  {
    name: 'MEANTEST',
    de: {
      description:
        ': DESCRIPTION "Mittelwert" ( item_5 ); Es entsteht die gewünschte Tabelle: Bestandteile einer Tabelle können durch Filter bestimmt werden Makros Nun kann man natürlich auch den Wunsch haben, die Männer und die Frauen nicht nebeneinander darzustellen, sondern übereinander. Ein Weg dahin ist, für die fünf Items jeweils nach dem Geschlecht gefilterte Variablen zu erstellen.…',
    },
  },
  {
    name: 'MEDIAN',
    argsHint: '( Var )',
    de: {
      description:
        'Der Median einer dritten Variable in allen Zellen. Bei Median wie bei allen Perzentilen wird innerhalb von GESStabs dann interpoliert, wenn es mit dem TABLEFORMAT PERCENTILEINTERPOL verlangt wird. MEDIAN und PCNTL1 bis PCNTL4 424 sind in einer Zelle kombinierbar; dabei wird untereinander erst PCNTL1, dann MEDIAN und zuletzt PCNTL2 ausgegeben.',
    },
  },
  {
    name: 'MENUFILTER',
    en: {
      description: '',
      syntax: 'MENUFILTER <varlist> = [ YES | NO ];',
    },
  },
  {
    name: 'MENUHEADER',
    en: {
      description: '',
      syntax: 'MENUHEADER <varlist> = [ YES | NO ];',
    },
  },
  {
    name: 'MENUMEAN',
    en: {
      description: '',
      syntax: 'MENUMEAN <varlist> = [ YES | NO ];',
    },
  },
  {
    name: 'MIN',
    de: {
      description: '',
      syntax: 'MIN <varname> = <Varlist>;',
    },
    en: {
      description: '',
      syntax: 'MIN <varname> = <Varlist>;',
    },
  },
  {
    name: 'MINCOLBASE',
    en: {
      description: '',
      syntax: 'MINCOLBASE = <number>;\nPreset at MINCOLBASE = 0',
    },
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
    name: 'MISSING',
    de: {
      description: '',
      syntax: 'MISSING <Varlist> = { number }*n;',
    },
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
    },
  },
  {
    name: 'MODIFYCSVNAMES',
    de: {
      description: '',
      syntax: 'MODIFYCSVNAMES = [ YES | NO ];',
    },
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
    name: 'MULTICOLINHG',
    en: {
      description:
        'Multiple cell contents (e.g. ABSCOLPERCENT) in CSV-Data files are usually represented in several rows. Alternatively they can be presented in several columns using +MULTICOLINHG. USEFORMATINHG Formats for CELLELEMENTS are also adopted for printouts in HG.…',
    },
  },
  {
    name: 'MULTIFROMSTRING',
    de: {
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
    name: 'NE',
    de: {
      description: 'Not Equal, ist ungleich',
    },
  },
  {
    name: 'NEG',
    de: {
      description:
        'negativer Wert Beispiel: COMPUTE x = ENTIER( NEG( b / 2 ) ); Arithmetische Operatoren für Ganze Werte Auch wenn GESStabs keine echten Ganzen Werte kennt, kann es interessant sein, den "Rest" einer Division zu kennen. Dazu stehen folgende Operatoren bereit:',
    },
  },
  {
    name: 'NEWOPENFORMAT',
    de: {
      description: '',
      syntax: 'NEWOPENFORMAT = [ YES | NO ];',
    },
  },
  {
    name: 'NEWPAGE',
    de: {
      description:
        'Seitenumbruch vor dem Label (Synonym: PAGE), siehe auch Layout 543',
    },
  },
  {
    name: 'NIL',
    de: {
      description:
        'leere Variable (praktisch z.B. bei TABLE ADD 391) Der Versuch, eigene Variablen mit diesen Namen zu generieren, führt zu einem Fehler. Mit HIDDENTOVARLIST kann gesteuert werden, ob Systemvariablen bei der Nennung von Variablenlisten 20 (mittels TO) mit erfasst werden sollen.',
    },
  },
  {
    name: 'NOASCIIEXTENSION',
    de: {
      description: '',
      syntax: 'NOASCIIEXTENSION = [ YES | NO ];',
    },
    en: {
      description:
        'Normally ASCII data sets which have been produced by GESS tabs are finished with a right- justified *.Should this not occur it can be achieved with a switch.',
    },
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
    de: {
      description: '',
      syntax: 'NOCSV <varlist> = YES;',
    },
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
  },
  {
    name: 'NOEXPANDAT',
    de: {
      description: '',
      syntax: 'NOEXPANDAT <varlist> = [ YES | NO ];',
    },
  },
  {
    name: 'NOGRAPH',
    de: {
      description:
        'Unterdrückt das, ansonsten standardmäßig dargestellte, rechtsstehende Histogramm in CODEBOOK 346s und PROFILE 637 -Tabellen.',
    },
  },
  {
    name: 'NOGRID',
    de: {
      description:
        'Unterdrückt die, ansonsten standardmäßig dargestellte, Skala für Lineingrafiken in PROFILE 637-Tabellen.',
    },
  },
  {
    name: 'NOHEADERBLANKS',
    de: {
      description: 'Unterdrückt Leerzeilen im Tabellenkopf. (NON-PS)',
    },
    en: {
      description: 'Suppresses blank rows in the stub. (NON-PS)',
    },
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
    name: 'NOINPUT',
    de: {
      description: '',
      syntax: 'NOINPUT <varlist> = [ YES | NO ];',
    },
  },
  {
    name: 'NOINVERTADDON',
    de: {
      description: '',
      syntax: 'NOINVERTADDON = [ YES | NO ];',
    },
  },
  {
    name: 'NOIOCHECK',
    de: {
      description: '',
      syntax: 'NOIOCHECK <varlist> = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'NOIOCHECK <varlist> = [ YES | NO ];',
    },
  },
  {
    name: 'NOISE',
    de: {
      description: '',
      syntax: 'NOISE = <value>;',
    },
    en: {
      description: '',
      syntax:
        'NOISE = <value>;\nNOISE can be used to "add noise" with random figures to all known variables of a data set. <value>\ndefines how many measurement points are to be replaced by random values. value=1 causes a',
    },
  },
  {
    name: 'NOLOGFILES',
    de: {
      description: '',
      syntax: 'NOLOGFILES = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'NOLOGFILES = [ YES | NO ];',
    },
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
    },
  },
  {
    name: 'NOOUTPUT',
    de: {
      description: '',
      syntax: 'NOOUTPUT <varlist> = [ YES | NO ];',
    },
  },
  {
    name: 'NOQUOTESINCSV',
    de: {
      description: '',
      syntax: 'NOQUOTESINCSV = [ YES | NO ];',
    },
  },
  {
    name: 'NORANKING',
    de: {
      description:
        'Ausschluss aus Ranking, siehe Sortierungen 468 Vergabe eines Zähllevels zur Steuerung der Ausgabe in Tabellen (relevant',
    },
  },
  {
    name: 'NOREPORT',
    de: {
      description: '',
      syntax: 'NOREPORT <varlist> = [ YES | NO ];',
    },
  },
  {
    name: 'NORMALIZE',
    de: {
      description: '',
      syntax: 'NORMALIZE;\nNORMALIZE = <varlist>;',
    },
    en: {
      description: '',
      syntax: 'NORMALIZE;',
    },
  },
  {
    name: 'NOSPSS',
    de: {
      description: '',
      syntax: 'NOSPSS <varlist> = [ YES | NO ];',
    },
  },
  {
    name: 'NOT',
    de: {
      description:
        'Nicht Assoziationen müssen explizit durch Klammerung angegeben werden; ungeklammerte Reihungen von OR und AND werden von links nach rechts abgearbeitet. Die verbreitete abkürzende Schreibweise (z.B. "a EQ 1 OR 2" anstelle von "a EQ 1 OR a EQ 2" etc. ist nicht erlaubt. Hierfür gibt es die IN 303-Formulierung. Stringkonstanten sind erlaubt.…',
    },
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
    name: 'NOWRAPINTEXT',
    de: {
      description: '',
      syntax: 'NOWRAPINTEXT = [ YES | NO ] ;',
    },
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
  },
  {
    name: 'NUMBERCHAR',
    de: {
      description:
        'Wird in TABLETITLE 516s durch die aktuelle Tabellennummer ersetzt. Voreinstellung: #',
    },
  },
  {
    name: 'NUMCENTERGRAPH',
    de: {
      description:
        '| FORM RECTANGLE COLUMNS 1 ROWS 2 | FORM RECTANGLE COLUMNS 2 ROWS 1 2 ; Das einfachste Chart erweitert um Optionen für Form und Farbe 2a: Vier Charts auf einer Seite im Querformat Im folgenden Beispiel wurden vier Charts auf Basis derselben Tabelle auf einer Seite im Querformat abgebildet.…',
    },
  },
  {
    name: 'NUMEXGRAPH',
    de: {
      description:
        'CHARTTITLE "Ehemalige Parteiwähler von CDU, SPD und Grüne/GAL wählen:" = | COLUMNS POSITION 2:4 ROWS POSITION 1:8 ; GESSCHART PIE SAMEPAGE',
    },
  },
  {
    name: 'OFFICEEXPORT',
    de: {
      description: '',
      syntax:
        'OFFICEEXPORT = <filename>;\n<filename> muss eine der folgenden Extensionen haben : xlsx | xls | ods. über die Extension',
    },
  },
  {
    name: 'OFFICEFONT',
    de: {
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
  },
  {
    name: 'OLDGROUPCLEARMETHOD',
    de: {
      description: '',
      syntax: 'OLDGROUPCLEARMETHOD = [ YES | NO ];',
    },
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
    },
  },
  {
    name: 'OPENAUTOGENERATE',
    de: {
      description: '',
      syntax:
        'OPENAUTOGENERATE = [ YES | MULTIQ <number> [ PREFIX <text> ] ]\n| ALPHA [ PREFIX <text> ] ];\nDie einfachste Version lautet: OPENAUTOGENERATE = YES;',
    },
  },
  {
    name: 'OPENCSV',
    de: {
      description: '',
      syntax: 'OPENCSV = [ YES | NO ];',
    },
  },
  {
    name: 'OPENOFFICEDEVIATION',
    de: {
      description: '',
      syntax: 'OPENOFFICEDEVIATION = YES;',
    },
    en: {
      description: '',
      syntax: 'OPENOFFICEDEVIATION = YES;',
    },
  },
  {
    name: 'OPENQFILE',
    de: {
      description: '',
      syntax: 'OPENQFILE = <name.opn>;',
    },
    en: {
      description:
        'If open questions are to be used at least one OPENQFILE must be defined. GESS tabs reads all OPENQFILEs and creates a data bank which allocates which values belong to which case numbers. The OPENQFILE statement has the same syntax as the DATAFILE statement.…',
    },
  },
  {
    name: 'OPTION',
    de: {
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
    name: 'OVERCODE',
    de: {
      description: 'Bildung und Benennung eines Obercodes 262',
      syntax:
        'OVERCODE [<ocname>] { :<label> }*n "<text des OVERCODEs"\n<ocname> ::= neuer eindeutiger Name des OVERCODEs',
    },
  },
  {
    name: 'OVERLAPPED',
    de: {
      description: 'Die graphischen Elemente überlappend darstellen',
    },
  },
  {
    name: 'OVEROVERCODE',
    de: {
      description: '',
      syntax:
        'OVEROVERCODE [ SUM ] <oocname> { :<ocname> }*n\n"<text des OVEROVERCODEs"\n<oocname> ::= neuer eindeutiger Name des OVEROVERCODE\n<ocname> ::= gültiger Name eines bestehenden OVERCODE',
    },
  },
  {
    name: 'OVERVIEW',
    de: {
      description:
        'TITLE "Tabelle mit vererbter Sortierung, SORT AS „overbase“" SORT AS overbase = #k BY MEAN STDDEV( #domacro2 ( m_name 11:16; a ) ); Sortierung vererben: Basistabelle Tabelle mit vererbter Sortierung Die neue Implementierung von „SORT AS“ erlaubt auch die Vererbung von Reihenfolgen im Kopf von Tabellen. Wir wandeln unser Beispiel kurz ab, und zeigen formal dieselbe Information in einem XOVERVIEW.…',
      syntax:
        'OVERVIEW <tableoptions> = <kopf> BY <cellelementlist> ( <varlist> )\n[ SORT <cellelement> [ DESCEND ] [ PANE <number> CODE <number> ] ] ;\n<varlist> ::= { <variable [ <varoption> ] }*n\n<varoption> ::=\n[ SORTCLASS <number> ]\n[ LEVEL <number> ]',
    },
  },
  {
    name: 'PAGENUMBER',
    de: {
      description:
        'Setzt die aktuelle Seitennummer neu, wird mit dem NUMBERCHAR 527 eingesetzt.',
    },
    en: {
      description: 'Resets the current page number.',
    },
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
    name: 'PAPER',
    de: {
      description: '',
      syntax:
        "PAPER = HEIGHT <number> WIDTH <number>;\nDie Interpretation von '<number>' richtet sich nach UNITS.",
    },
    en: {
      description: '',
      syntax: 'PAPER = HEIGHT <number> WIDTH <number>;',
    },
  },
  {
    name: 'PATTERN',
    de: {
      description:
        'Pattern 1 = gepunktet.) Jede Farbe wird entweder nach dem HSB-Modell (Hue-Saturation-',
    },
  },
  {
    name: 'PCNTL1',
    argsHint: '( Var )',
    de: {
      description:
        'Frei wählbare Percentil. Voreingestellt sind für PCNTL1 das',
    },
  },
  {
    name: 'PCNTL2',
    argsHint: '( Var )',
    de: {
      description: '1.Quartil und für PCNTL2 das 3. Quartil, d.h. jeweils 25%',
    },
  },
  {
    name: 'PCNTL3',
    argsHint: '( Var )',
    de: {
      description:
        'PCNTL4 ( Var ) bzw. 75% der Zellenverteilung. Mit zusätzlichen Statements kann die Grenze und der Text der Percentilauswertung individuell gewählt werden, Beispiel: PCNTL1 = 33.333% "1.Drittel"; PCNTL2 = 66.667% "2.Drittel"; Es wird dann interpoliert, wenn es mit dem TABLEFORMAT PERCENTILEINTERPOL 540 verlangt wird.',
    },
  },
  {
    name: 'PCNTRANGE',
    argsHint: '( Var )',
    de: {
      description: 'Ausgabe des 1. und 2. Perzentils als Spanne in einer Zeile',
    },
  },
  {
    name: 'PERCENTILEDELTA',
    argsHint: '( Var )',
    de: {
      description:
        'Ausgabe der Differenz zwischen dem 1. und 2. Perzentil Name Beschreibung',
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
    name: 'PHYSCOLDELTA',
    de: {
      description:
        'Differenz zwischen gewichteten und ungewichteten Spaltenprozenten',
    },
  },
  {
    name: 'PHYSCOLDEPTTEST',
    de: {
      description:
        'Abhängiger, spaltenweiser t-Test auf Basis der gewichteten Daten',
    },
  },
  {
    name: 'PHYSCOLPERCENT',
    de: {
      description: 'Spaltenprozente, auf Basis ungewichteter Zahlen',
    },
  },
  {
    name: 'PHYSDEPTTEST',
    argsHint: '( Var )',
    de: {
      description:
        'Abhängiger t-Test auf Mittelwertsunterschiede auf Basis der ungewichteten Daten',
    },
  },
  {
    name: 'PHYSICALC',
    de: {
      description:
        'Physikalische Fallzahl (ohne Berücksichtigung von Gewichten) in der Spalte',
    },
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
    },
  },
  {
    name: 'PHYSICALR',
    de: {
      description:
        'Physikalische Fallzahl (ohne Berücksichtigung von Gewichten) in der Zeile',
    },
  },
  {
    name: 'PHYSICALRECORDS',
    de: {
      description: 'ungewichtete Zahl der Fälle',
    },
  },
  {
    name: 'PHYSICALROW',
    de: {
      description: 'und folgende drei Arten von Rahmenspalten:',
    },
  },
  {
    name: 'PHYSMCNEMAR',
    de: {
      description:
        'Abhängiger Test auf Prozentwertunterschied auf Basis der ungewichteten Daten nach McNemar 449',
    },
  },
  {
    name: 'PHYSROWCHIQU',
    de: {
      description: 'Zeilenweiser Chi²-Test auf Basis der ungewichteten Daten',
    },
  },
  {
    name: 'PHYSROWDELTA',
    de: {
      description:
        'Differenz zwischen den gewichteten und ungewichteten Zeilenprozenten.',
    },
  },
  {
    name: 'PHYSROWPERCENT',
    de: {
      description: 'Zeilenprozente, auf Basis einer ungewichteten Zählung',
    },
  },
  {
    name: 'PHYSROWTTEST',
    de: {
      description:
        'Unabhängiger, zeilenweiser t-Test auf Mittelwertunterschiede auf Basis der ungewichteten Daten. Name Beschreibung',
    },
  },
  {
    name: 'PHYSTTEST',
    argsHint: '( Var )',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwertsunterschiede auf Basis der ungewichteten Daten',
    },
  },
  {
    name: 'PHYSWELCHTEST',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwerteunterschiede nach Welch 450 auf Basis der ungewichteten Daten',
    },
  },
  {
    name: 'POSITION',
    de: {
      description:
        'Mit POSITION kann die Position vorgegeben werden, an der das neue Label (oder auch OVERCODE 262) in die Labelliste eingefügt wird. Die Zählung ist 1-basiert. Möchte man z.B. ein Label vor allen bestehenden einfügen, so schreibt man etwa: LABELS testvar = ADD POSITION 1',
      syntax: 'POSITION "<cellrange>"',
    },
  },
  {
    name: 'POSTPROCESS',
    de: {
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
    de: {
      description: '',
      syntax: 'PRINTFILE <Druckername> = <FileName>;',
    },
    en: {
      description: '',
      syntax: 'PRINTFILE <Druckername> = <FileName>;',
    },
  },
  {
    name: 'PRINTSUPPRESSVALUE',
    de: {
      description: '',
      syntax: 'PRINTSUPPRESSVALUE = <number>;',
    },
  },
  {
    name: 'PRINTWEIGHTPROTOCOL',
    de: {
      description: '',
      syntax: 'PRINTWEIGHTPROTOCOL = [ YES | NO ];',
    },
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
    name: 'PROJECTION',
    de: {
      description:
        'absolute Häufigkeitswerte: Summe der Gewichte, multipliziert mit dem PROJECTIONFACTOR Hiermit kann man eine Stichprobe anhand der gewichteten Verteilung auf die Grundgesamtheit hochrechnen. Der PROJECTIONFACTOR kann mit der Anweisung PROJECTIONFACTOR = <Wert>; gesetzt werden. Voreinstellung: 1.0.',
    },
  },
  {
    name: 'PROJECTIONSUM',
    argsHint: '( Var )',
    de: {
      description: "Darstellung der Summe von 'Var', multipliziert mit dem",
    },
  },
  {
    name: 'PROTOCOLPAGE',
    de: {
      description: '',
      syntax: 'PROTOCOLPAGE = [ YES | NO ];',
    },
  },
  {
    name: 'QU',
    de: {
      description:
        '| kombiniert mit | COLPERCANDCHIQU |     |     |     | COLPERCANDHYCHIQU | | -------------- | --------------- | --- | --- | --- | ----------------- | % | z-Test | COLPERCZ  |     |     |     |     | | ------ | --------- | --- | --- | --- | --- |',
    },
  },
  {
    name: 'QUANTUMINCHARS',
    de: {
      description: '',
      syntax: 'QUANTUMINCHARS = <filename>;',
    },
  },
  {
    name: 'RANDOM',
    de: {
      description:
        'RANDOM von einer negativen Zahl ist undefiniert. Der Aufruf COMPUTE xx = RANDOM( Max) mit einem positiven Argument "Max" liefert eine ganzzahlige Zufallszahl im Range 0 .. Max-1.',
    },
  },
  {
    name: 'RANGE',
    de: {
      description:
        'Mit dem Schlüsselwort RANGE können beliebige Bereiche angefordert und so eine Tabelle mit sehr vielen Ausprägungen zerlegt werden. Zum Beispiel: TABLE = a BY b SORT ABSOLUTE DESCEND RANGE 1 20;',
    },
  },
  {
    name: 'RANGES',
    de: {
      description: '',
      syntax: 'RANGES [<VarList>] <ValueList> ;',
    },
    en: {
      description: '',
      syntax: 'RANGES <VarList> <ValueList> ;',
    },
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
    },
  },
  {
    name: 'RECHIPREFIX',
    de: {
      description: '',
      syntax: 'RECHIPREFIX = "<Zeichenfolge>";',
    },
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
    },
  },
  {
    name: 'RECODELASTWINS',
    de: {
      description: '',
      syntax: 'RECODELASTWINS = [ YES | NO ];',
    },
  },
  {
    name: 'RECODETASKS',
    en: {
      description:
        'The effect of RECODE statements can be restricted to particular task types. Using: RECODETASKS = tabtask; recodes are only carried out by GESS tabs, and all RECODE statements from GESS input or CATI etc. are ignored.',
    },
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
  },
  {
    name: 'REPRINT',
    de: {
      description: '',
      syntax: 'REPRINT TABLE = <tablename>;',
    },
  },
  {
    name: 'RESETREDEFINEVARS',
    en: {
      description: '',
      syntax: 'RESETREDEFINEVARS = [ YES | NO ] ;',
    },
  },
  {
    name: 'RESPONSESTITLE',
    de: {
      description:
        'Bezeichnung der RESPONSES-Spalte/-zeile (wenn TABLEBASE = RESPONSES; 388 gesetzt)',
      syntax: 'RESPONSESTITLE [ X | Y ] = "<text>";',
    },
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
    name: 'ROUND',
    de: {
      description:
        '1alter 1000 1.Frage "1.Frage" alter+1 2000.1 Variablenlisten Viele Anweisungen operieren mit einer Liste von Variablen, kurz Varlist. Dies ist in der Syntaxbeschreibung der jeweiligen Anweisung durch <Varlist> gekennzeichnet. Eine Variablenliste besteht im einfachsten Fall aus einer Auflistung von Variablen, z.b: var1 var2 var3 var4 Oft ist es ökonomischer, mit TO zu arbeiten.…',
    },
  },
  {
    name: 'ROUNDMODE',
    de: {
      description: '',
      syntax: 'ROUNDMODE = [ CLASSIC | BANKERSROUNDMODE | SIMPLE ];',
    },
  },
  {
    name: 'ROWCELLMINIMUM',
    de: {
      description: '',
      syntax: 'ROWCELLMINIMUM = <value>;',
    },
    en: {
      description: '',
      syntax: 'ROWCELLMINIMUM = <number>;',
    },
  },
  {
    name: 'ROWCHIQU',
    de: {
      description:
        'Zeilenweise 4-Felder-Chiquadrattest auf Prozentwertunterschiede. Die Kennzeichnung erfolgt analog zu COLCHIQU 428 mit alphabetischer Zeilenkennzeichnung, A ist die erste Zeile, B die zweite, usw. Man kann mit INDEXCHARS 529 eigene Kennzeichen und Reihenfolgen definieren.',
    },
  },
  {
    name: 'ROWELEMENTWINS',
    de: {
      description:
        'Dies beeinflusst die Auswahl der CELLELEMENTS an Kreuzungspunkten, an denen sowohl für Zeilen als auch für Spalten explizite CELLELEMENTS definiert sind. a) In einer Tabelle werden zwei Variablen gekreuzt, bei denen jeweils labels mit eigenen CELLELEMENTS versehen sind, z.B.: LABELS A =',
    },
  },
  {
    name: 'ROWMEANTEST',
    argsHint: '( Var )',
    de: {
      description:
        'Wie MEANTEST 430, nur werden die Werte in den Zeilen gegeneinander getestet',
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
    name: 'ROWPERCENT100',
    de: {
      description:
        'Nach Hare-Niemeyer-Modell modifizierte Zeilenprozentwerte (Summe ergibt 100), Achtung: nicht geeignet bspw. für Mehrfachnennungsvariablen und OVERCODEs, Tabellen mit unterdrückten MISSING VALUES und selektiv gebildete Variablen',
    },
  },
  {
    name: 'ROWPERCENTINDEX',
    de: {
      description:
        'Indexwerte zu den Zeilenprozenten (100 entspricht dem Wert in der Totalzeile)',
    },
  },
  {
    name: 'ROWPERCEQUAL',
    de: {
      description:
        'Testet alle Zeilenprozente in der Zeile auf Gleichheit; d.h. alle Abweichungen von der Ungleichverteilung werden als signifikant betrachtet. Hier besteht natürlich die Möglichkeit, sehr viele unsinnige Signifikanzen zu produzieren. Bitte mit Bedacht verwenden.',
    },
  },
  {
    name: 'ROWPERCZ',
    de: {
      description:
        'Signifikanztest (zeilenweise) für Prozentwertsunterschiede. ROWPERCZ basiert auf dem Z-Test für Prozentwerte. Erweiterter Z-Test mit Arcus-Sinus-Korrektur.',
    },
  },
  {
    name: 'ROWS',
    de: {
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
  },
  {
    name: 'ROWSUMPERCENT',
    argsHint: '( Var )',
    de: {
      description:
        'Ausgabe der Zeilenprozentuierung der Summe einer dritten Variablen, z.B. die Summe von Name Beschreibung Ausgaben für einen bestimmten Zweck in bestimmten Stadtteilen etc.',
    },
  },
  {
    name: 'ROWTTEST',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwertunterschiede auf Basis der gewichteten Daten, zeilenweise',
    },
  },
  {
    name: 'SAMEPAGE',
    de: {
      description:
        '= | COLUMNS 1:5 ROWS 65002 65003 ; GESSCHARTFORMAT = STROKERECT; GESSCHARTCOLORS = $AAFFAA $FFAAAA $AAAAFF $FFFFAA $AAFFFF; GESSCHART CHARTTITLE "Skalenmittelwerte Bewertung nach Modellen (vertikal)" INVERSE CHARTAREA 195 15 87 90 SAMEPAGE VERTICAL = | COLUMNS 1:5 ROWS 2/1 AXISMINMAX 0 4 ; GESSCHART CHARTTITLE "Anteil von \'sehr schlecht\'" INVERSE CHARTAREA 195 107 87 88 SAMEPAGE VERTICAL = |…',
    },
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
    },
  },
  {
    name: 'SECONDMEAN',
    argsHint: '( Var )',
    de: {
      description:
        'Zweiter Mittelwert. Wenn in einer Zelle die Mittelwerte von zwei verschiedenen Variablen ausgegeben werden sollen, muss die zweite Variable über SECONDMEAN angefordert werden.',
    },
  },
  {
    name: 'SECONDSUM',
    argsHint: '( Var )',
    de: {
      description:
        '2. Summe. Wenn in einer Zelle die Summen von zwei verschiedenen Variablen ausgegeben werden sollen, muss die zweite Variable über SECONDSUM angefordert werden.',
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
    },
  },
  {
    name: 'SETDECIMALS',
    de: {
      description: '',
      syntax: 'SETDECIMALS < Varlist > = <number>;',
    },
    en: {
      description:
        'Serves to explicitly set the decimal point for variables which have already been defined.',
      syntax: 'SETDECIMALS < Varlist > = number ;',
    },
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
    de: {
      description: '',
      syntax: 'SETMISSING <Varlist> = { number }*n;',
    },
    en: {
      description:
        "A MISSING value is automatically inherited on to variables which emanate from the calculation of other variables. If MISSING values go into a calculation or an 'M' is found in the input then the result is a MISSING value. The variable then receives the characteristic allocated by the user with SETMISSING. Example: SETMISSING = 9999;",
    },
  },
  {
    name: 'SHADE',
    de: {
      description: '',
      syntax: 'SHADE <boxname> = <number> ;',
    },
    en: {
      description: '(PS): is ignored by line printers.',
      syntax: 'SHADE <boxname> = <number> ;',
    },
  },
  {
    name: 'SHEETNAME',
    de: {
      description:
        'die folgende Tabelle erscheint Allen Elementen kann man einen Office-Font und Farben zuordnen. NoAutoTableTitle NOAUTOTABLETITLE nimmt Einfluss auf die Voreinstellung, die jede Tabelle in eine OFFICECONTENTPAGE einträgt. Hierfür wird der CONTENTKEY verwendet, und wenn dieser nicht vorhanden ist, wird als Default der TABLETITLE verwendet.…',
    },
  },
  {
    name: 'SHEETNUMBERCHAR',
    de: {
      description: '',
      syntax: 'SHEETNUMBERCHAR = <char>;',
    },
  },
  {
    name: 'SHOWSIGNIF',
    en: {
      description:
        'Be it that a test resulted in a significant difference between column A and column D, then naturally the test between column D and column A would also show a significant difference. The identification of "A" in column D and of "D" in column A is technically correct but nonetheless redundant. In many cases it is preferable to show the significance only once for each pair.…',
    },
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
  },
  {
    name: 'SIGNIF20AND10',
    de: {
      description:
        'ABC... für 10%-Niveau, abc.... für 20%-Niveau Beschreibung der Signifikanzen Für alle oben benannten Optionen (Signifikanzniveaus) existieren Standardtexte, die das jeweilige Signifikanznivau beschreiben. SignifText Die SIGNIFTEXT-Anweisung dient dazu, diesen Standardtext anzupassen.…',
    },
  },
  {
    name: 'SIGNIFLEVEL',
    de: {
      description: '',
      syntax: 'SIGNIFLEVEL = <option>;',
    },
    en: {
      description: '',
      syntax: 'SIGNIFLEVEL = <option>;',
    },
  },
  {
    name: 'SIGNIFMINEFFECTCHIQ',
    de: {
      description: '',
      syntax: 'SIGNIFMINEFFECTCHIQ = <value>;\nSIGNIFMINEFFECTTTEST = <value>;',
    },
  },
  {
    name: 'SIGNIFTEXT',
    de: {
      description:
        'Anpassung des Standardtextes zur Beschreibung der SIGNIFLEVEL 454-',
      syntax: 'SIGNIFTEXT <option> = "Text zur Kennzeichnung";',
    },
  },
  {
    name: 'SIMPLEVAR',
    en: {
      description: '',
      syntax: 'SIMPLEVAR <variable> = <vargroup> ;',
    },
  },
  {
    name: 'SINGLEFROMSTRING',
    de: {
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
    name: 'SIZE',
    de: {
      description:
        '; Ist die Option MISSING definiert, werden alle Variablen mit MISSING VALUES ausgegeben. Bei EXCLUDEVALUES und RESTRICTVALUES wird eine Liste der betroffenen Variablen mit den vorgefundenen EXCLUDEVALUES bzw. RESTRICTVALUES ausgegeben. POSTPONE ist ein Spezial-Option im Zusammenhang mit INVERTOUT 94 :…',
      syntax: 'SIZE X/Y <points>',
    },
  },
  {
    name: 'SLICE',
    de: {
      description:
        'Mit SLICE kann man eine Tabelle in der Y-Richtung in die erforderliche Anzahl',
    },
  },
  {
    name: 'SLICEHEADERFIRST',
    de: {
      description: '',
      syntax:
        'SLICEHEADERFIRST = [ YES | NO ];\nBei SLICEHEADERFIRST=YES; werden zunächst alle Teile des Kopfes (in der X-Richtung',
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
    de: {
      description: '',
      syntax: 'SLICESTATISTICS = <number>;',
    },
    en: {
      description:
        'Summary tables of the type: TABLE = #k by Mean( v1 ) Mean( v2 ) Mean( v3 ) Mean( v4 ) Mean( v5 ) Mean( v6 ) Mean( v7 ) Mean( v8 ) … Mean( v99 ) ; can be spread across several pages using the key word SLICESTATISTICS. After setting SLICESTATISTICS = 35; all the following tables of this type are always divided after 35 such rows.',
    },
  },
  {
    name: 'SORT',
    de: {
      description: '',
      syntax: 'SORT AS = [ XVALID | YVALID ];',
    },
    en: {
      description:
        'Normally the variable characteristics are printed in the order they are defined in VALUELABELS statement. The variable characteristics in the X or Y-Axis can however also be sorted according to other criteria. The key word SORT is written after the variable name followed by the sort criterion which are as follows: ABSOLUTE acc. to absolute cell content MEAN acc. to arithmetical mean SUM acc.…',
    },
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
    name: 'SPACE',
    de: {
      description:
        'leere Zelle (wird z.B. benötigt, um leere Zeilen bzw. Spalten in Tabellen für Name Beschreibung PowerPoint 202 zu erzeugen) Inkompatibilitäten unter Zellinhalten Aufgrund der internen Speicherstrukturen gibt es einige Inkompatibilitäten unter Zellinhalten:…',
    },
  },
  {
    name: 'SPLITCHAR',
    de: {
      description:
        'Erlaubt an der Stelle eine Worttrennung (flexibel). Voreinstellung: -',
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
    name: 'SPLITENTRIES',
    en: {
      description:
        'SPLITENTRIES = <filename>; It is very easy to produce a "dividing" dictionary. If a list is constructed like so Nie~der~sachsen Bundes~land Wahl~ab~sicht Weiterfüh~ren~de Polytech~ni~sche Hoch~schul~reife Selbst~ständige Aus~zu~bil~den~de wahr~schein~lich',
    },
  },
  {
    name: 'SPSS',
    de: {
      description: '',
      syntax: 'SPSS [ ASCIIOUT ] = <filename>;',
    },
    en: {
      description: '',
      syntax: 'SPSS [ ASCIIOUT ] = <filename>;',
    },
  },
  {
    name: 'SPSS__',
    en: {
      description: '',
      syntax: 'SPSS__ = [ YES | NO ];',
    },
  },
  {
    name: 'SPSSALPHALENGTH',
    de: {
      description: '',
      syntax: 'SPSSALPHALENGTH = <number>;',
    },
  },
  {
    name: 'SPSSFILTERMISSING',
    de: {
      description: '',
      syntax: 'SPSSFILTERMISSING = <number>;',
    },
  },
  {
    name: 'SPSSGLOBALSEQUENCE',
    de: {
      description: '',
      syntax: 'SPSSGLOBALSEQUENCE = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'SPSSGLOBALSEQUENCE = [ YES | NO ];',
    },
  },
  {
    name: 'SPSSGROUP',
    de: {
      description: '',
      syntax: 'SPSSGROUP <name> = <familyvarname>;',
    },
    en: {
      description: '',
      syntax: 'SPSSGROUP <name> = <familyvarname>;',
    },
  },
  {
    name: 'SPSSGROUPLABEL0',
    en: {
      description:
        'A SPSSGROUP comprises a row of nuclear variables where the Code 0 or 1 shows whether the relevant value is "set". The SPSSGROUP statement has now (as of Version 4.0.2) been expanded so that these nuclear variables can be allocated information from the label of the relevant code of the source variable (MULTIQ).',
    },
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
    en: {
      description: '',
      syntax: 'SPSSINFILE = <filename>;',
    },
  },
  {
    name: 'SPSSIO',
    de: {
      description:
        'Dynamic Link Library-Dateien (DLL), die IBM zum Lesen, Verarbeiten und Schreiben von SPSS- Dateien bereitstellt. 3. Laden Sie die Dateien aus dem Ordner „SPSSIO“ in der 32- oder 64-bit-Version aus unserem Download-Center herunter. 4. Speichern Sie die Dateien in Ihrem GESS\\tabs-Verzeichnis. Lizenzierung 5.…',
    },
  },
  {
    name: 'SPSSLONGNAMES',
    de: {
      description: '',
      syntax: 'SPSSLONGNAMES = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax:
        'SPSSLONGNAMES = [ yes | no ];\nOld versions of SPSS could not use long variable names; GESS tabs shortened the names where',
    },
  },
  {
    name: 'SPSSNORECODEDLABELS',
    de: {
      description: '',
      syntax: 'SPSSNORECODEDLABELS = [ YES | NO ]:',
    },
  },
  {
    name: 'SPSSOUTFILE',
    de: {
      description: '',
      syntax: 'SPSSOUTFILE = <filename>;',
    },
  },
  {
    name: 'SPSSOUTSUBFILE',
    de: {
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
  },
  {
    name: 'SPSSREADMULT',
    de: {
      description: '',
      syntax: 'SPSSREADMULT = [ YES | NO ];',
    },
  },
  {
    name: 'SPSSSOUTFILE',
    en: {
      description: '',
      syntax: 'SPSSSOUTFILE = <filename>;',
    },
  },
  {
    name: 'SPSSVARLABTOTEXT',
    de: {
      description: '',
      syntax: 'SPSSVARLABTOTEXT = [ YES | NO | COPY ];',
    },
    en: {
      description: '',
      syntax: 'SPSSVARLABTOTEXT = [ YES | NO ];',
    },
  },
  {
    name: 'SPSSWEIGHTOUT',
    de: {
      description: '',
      syntax: 'SPSSWEIGHTOUT = <varname>;',
    },
  },
  {
    name: 'SPSSWRITEMULT',
    de: {
      description: '',
      syntax: 'SPSSWRITEMULT = [ YES | NO ];',
    },
  },
  {
    name: 'SQUARE1',
    de: {
      description: 'Quadrat (auf der Basis stehend)',
    },
  },
  {
    name: 'SQUARE1O',
    de: {
      description: 'Quadrat (auf der Basis stehend) als Outline',
    },
  },
  {
    name: 'SQUARE2',
    de: {
      description: 'Quadrat (auf der Spitze stehend)',
    },
  },
  {
    name: 'SQUARE2O',
    de: {
      description: 'Quadrat (auf der Spitze stehend) als Outline',
    },
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
    name: 'STATIC',
    de: {
      description: '',
      syntax: 'STATIC <varlist> = [ YES | NO ];',
    },
    en: {
      description: '',
      syntax: 'STATIC <varlist> = [ YES | NO ];',
    },
  },
  {
    name: 'STATTESTDUMP',
    de: {
      description: '',
      syntax: 'STATTESTDUMP = <filename> ;',
    },
  },
  {
    name: 'STDDEV',
    de: {
      description:
        'STDDEV errechnet die Standardabweichung einer Variable oder Variablenliste über alle Fälle des Datensatzes.',
      syntax: 'STDDEV <varname> = <varlist>;',
    },
  },
  {
    name: 'STDSIGNIFICANCE',
    de: {
      description:
        '454 Steht dieser Schalter auf YES, dann wird immer dann, wenn ein SIGNIFLEVEL 454 gesetzt ist und ein spaltenweiser Signifikanztest vorliegt, im BOTTOMTEXT 520 der entsprechende Signifikanztext ausgegeben. Gibt es keinen BOTTOMTEXT, wird einer erzeugt.…',
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
    de: {
      description: '',
      syntax: 'STOREALPHA <varlist> = [ YES | NO ];',
    },
  },
  {
    name: 'STORELANGUAGE',
    de: {
      description: '',
      syntax: 'STORELANGUAGE <sprache> = <filename>;',
    },
  },
  {
    name: 'STORETOCSV',
    de: {
      description: '',
      syntax:
        'STORETOCSV = [ ALL | <varlist> ];\nDie als <varlist> deklarierten Variablen werden in der Reihenfolge ihrer Angabe in den',
    },
  },
  {
    name: 'STORETOSPSS',
    de: {
      description: '',
      syntax: 'STORETOSPSS = <varlist>;',
    },
  },
  {
    name: 'STRICTINPUTCHECK',
    de: {
      description: '',
      syntax: 'STRICTINPUTCHECK = [ YES | NO ];',
    },
  },
  {
    name: 'STRICTVARLIST',
    de: {
      description: '',
      syntax: 'STRICTVARLIST = [ YES | NO ];',
    },
  },
  {
    name: 'STRIPECOLORS',
    de: {
      description: '',
      syntax:
        "STRIPECOLORS = <color> <color> ;\nMit '<color>' definiert man die Farben, in denen die Zeilen bzw. Spalten in Tabellen vom Typ",
    },
  },
  {
    name: 'STROKERECT',
    de: {
      description: 'Umrandung zu RETANGLES zeichnen',
    },
  },
  {
    name: 'STYLEFILE',
    de: {
      description: '',
      syntax: 'STYLEFILE = <filename>;',
    },
    en: {
      description: '',
      syntax:
        'STYLEFILE = <filename>;\nUsing the STYLEFILE individual CSS styles can be included. The contents of <filename> are included',
    },
  },
  {
    name: 'SUM',
    argsHint: '( Var )',
    de: {
      description: "Darstellung der Summe von 'Var'",
      syntax: 'SUM <varname> = <Varlist>;',
    },
    en: {
      description: '',
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
  },
  {
    name: 'SUMPERCENT',
    argsHint: '( Var, BasisVar )',
    de: {
      description:
        "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Summe von 'Var' wird als prozentualer Anteil an der Summe von 'BasisVar' ausgegeben.",
    },
  },
  {
    name: 'SUMQUOTIENT',
    argsHint: '( Var, BasisVar )',
    de: {
      description:
        "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Summe von 'Var' wird als Anteil an der Summe von 'BasisVar' ausgegeben.",
    },
  },
  {
    name: 'SUPPRESSEMPTYSHEET',
    de: {
      description: '',
      syntax: 'SUPPRESSEMPTYSHEET = [ YES | NO ];',
    },
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
    },
  },
  {
    name: 'SUPPRESSGRIDLINES',
    de: {
      description: '',
      syntax: 'SUPPRESSGRIDLINES : [YES|NO]',
    },
  },
  {
    name: 'SUPPRESSIFLESS',
    de: {
      description: '',
      syntax:
        'SUPPRESSIFLESS < cellelement> <place> <typ> = <value>;\nplace ::= < DATACELL | FRAMECELL X | FRAMECELL Y >\ntyp ::= < ABSOLUTE | PHYSICALRECORDS | VALIDN | VALIDPHYS | ESS >\nMan kann sich mit "<place>" dabei auf die Tabellenzelle selbst beziehen, oder auf die',
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
    name: 'SUPPRESSSPSSWARNINGS',
    de: {
      description: '',
      syntax: 'SUPPRESSSPSSWARNINGS = [ ALPHA | VARLABEL | VALUELABELS ] ;',
    },
  },
  {
    name: 'SWAP',
    de: {
      description: 'Reihenfolge der graphischen Darstellung invertieren',
    },
  },
  {
    name: 'SWAPLEGEND',
    de: {
      description:
        'Reihenfolge der Legendentexte invertieren <alle GESSCHARTFORMAT- Alle Argumente des Argumente> GESSCHARTFORMAT 198-Statements können an dieser Stelle auch als Optionen für das aktuelle Chart angegeben werden. = {',
    },
  },
  {
    name: 'SWITCHLANGUAGE',
    de: {
      description: '',
      syntax: 'SWITCHLANGUAGE = <Sprachbezeichnung>;',
    },
  },
  {
    name: 'SYMBOL',
    de: {
      description: 'Die Linie wird nicht gezeigt',
    },
  },
  {
    name: 'SYMBOLSIZE',
    de: {
      description:
        '; GESSCHARTFONT CHARTNUMBERS = "Helvetica-Bold" SIZE 8; GESSCHARTFORMAT = NUMCENTERGRAPH NOFRAME NOSCALE OVERLAPPED WHITENUMBERS; GESSCHARTCOLORS = $229955 AA5577; GESSCHART CHARTTITLE "Gegenläufige Linien: Top-2-Box nach links + grün, Bottom-2-Box nach rechts + rot, Zahlen in weiß zentral in den Kreisen bzw.…',
    },
  },
  {
    name: 'SYNOPSIS',
    de: {
      description: '',
      syntax: 'SYNOPSIS = <filename>;',
    },
  },
  {
    name: 'SYNTAX',
    de: {
      description: '',
      syntax:
        'SYNTAX { [ POSTPONE ] [ VARIABLES | LABELS | VARTITLE\n| VALUELABELS | MISSING | EXCLUDEVALUES | RESTRICTVALUES|\nMULTIDEF | FORMAT ]}*n = <filename>;\nSYNTAXVARNAMENOQUOTES = [ YES | NO ];',
    },
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
    name: 'TABLE',
    de: {
      description: '',
      syntax:
        'TABLE [ taboptions ] = <parts> BY <parts>;\ntaboptions ::=\n[\nADD\nNAME <tablename>\nTITLE <tabletitle>\nCELLELEMENTS ( <cellelements> )\nFRAMEELEMENTS ( <frameelements> )\nTABLEFORMATS ( <tableformats> )\nCONTENTKEY <contentkey>\nHIDDEN ( <medium> )\n]\n\nparts ::= part { part }*n\npart ::= content [ filter ] [ option ]\n\ncontent ::=\n[\n<constant> |\n<varname> |\n<cellelement> ( <varname> [ <varname> ] ) |\n<cellelement> ( <varname> [ <varname> ] BY <varname> )\n:DESCRIPTION\n:USEVARTITLE\n:FORMAT\n] \n\nfilter ::= FILTER <bedingung> |\n\noption ::= SORT sortcontent [ sortpane ] [ cut ]\n\nsortcontent ::= sorttype [ DESCEND ]\nsorttype ::= [ POSITION | ALPHA | CODE | Cellelement ]\nsortpane ::= PANE <value> CODE <value>\n\ncut ::=\n[\nTOP <value > [ SLICE <value> ] |\nBOTTOM <value> |\nEXTREME <value> |\nSLICE <value> |\nLSLICE <value> |\nRANGE <value> <value>\n]',
    },
    en: {
      description:
        'The main keyword for cross tables. In its simplest form: TABLE = <var1> BY <var2>; where <var1> is the header variable and <var2> is the variable for the side breakdown.',
    },
  },
  {
    name: 'TABLEBASE',
    de: {
      description: '',
      syntax: 'TABLEBASE = [ CASES | RESPONSES ];',
    },
    en: {
      description:
        'This controls the basis of percentaging in the TABLE printout. The following is preset: TABLEBASE = CASES ; i.e. usually percentaging is on the basis of the number of interviewees. Using TABLEBASE = NOMINATIONS ; the alternative of percentaging on the basis of the number of mentions can be achieved (only relevant for multiple responses).…',
    },
  },
  {
    name: 'TABLECOUNTSWITCH',
    de: {
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
  },
  {
    name: 'TABLEFORMAT',
    de: {
      description: '',
      syntax: 'TABLEFORMAT +/- AUTOSORTTREE;',
    },
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
    en: {
      description: '',
      syntax: 'TABLEMINIMUM = <number>;',
    },
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
    },
  },
  {
    name: 'TABLETITLE',
    de: {
      description: '',
      syntax: 'TABLETITLE = "<text>";',
    },
    en: {
      description:
        'If the standard text "Table #:" is to be replaced it can be done as follows: TABLETITLE = "Summary Table"; If the test is not to appear at all, then: TABLETITLE = ""; If the program finds a hash "#" (more precisely: the NUMBERCHAR) in the string this character is replaced by the current table number. This is valid for all tables until it is changed.',
    },
  },
  {
    name: 'TABSELECT',
    de: {
      description: '',
      syntax: 'TABSELECT <Bedingung>;',
    },
    en: {
      description:
        'defines a selection of cases for the following tables. TABSELECT remains valid until a new TABSELECT is defined. Should all cases be processed in the following tables then simply: TABSELECT; is written. (This condition is always true.) The syntax equates to SELECT (non permanent filter).…',
    },
  },
  {
    name: 'TABSELECTBYCODE',
    de: {
      description: '',
      syntax:
        'TABSELECTBYCODE [ <options> ] <VARIABLE> ( <CODE> );\n<options> ::= [ VARTITLE | NOMISSING | SUPPRESSOVERCODES\n| USELABELS ] <options>',
    },
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
    name: 'TEMPLATE',
    en: {
      description: '',
      syntax: 'TEMPLATE = <templatename>;',
    },
  },
  {
    name: 'TESTCOLUMNS',
    de: {
      description: '',
      syntax:
        'TESTCOLUMNS = { Testdefinition }*n;\nTestdefinition ::= | VARIABLE <varno> CODE <code>\n: VARIABLE <varno> CODE <code>',
    },
  },
  {
    name: 'TEXTBOXFORMAT',
    de: {
      description:
        'Dieses TABLEFORMAT schaltet die Funktionen des LOCALTEXTFORMAT 564s ein/aus.',
    },
  },
  {
    name: 'TEXTROWHEIGHT',
    de: {
      description: '',
      syntax: 'TEXTROWHEIGHT <box> : <pixels>\n<box> ::= eine Box',
    },
  },
  {
    name: 'TEXTTABLE',
    de: {
      description: '',
      syntax: 'TEXTTABLE;',
    },
    en: {
      description: '',
      syntax: 'TEXTTABLE ;',
    },
  },
  {
    name: 'TEXTTOPDISTANCE',
    de: {
      description: '',
      syntax: "TEXTTOPDISTANCE = <number>;\n'<number>' = typographische Punkte",
    },
  },
  {
    name: 'TEXTTOSPSSVARLAB',
    de: {
      description: '',
      syntax: 'TEXTTOSPSSVARLAB = [ YES | NO ];',
    },
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
    name: 'THOUSANDS',
    de: {
      description: '',
      syntax: 'THOUSANDS <cellelement> : [ YES | NO ]',
    },
  },
  {
    name: 'TITLEPAGE',
    de: {
      description: '',
      syntax:
        'TITLEPAGE ::= { | element }*n ;\nCHAPTERPAGE::= { | element }*n ;\nelement ::= { text | line | drawbox | titlebox | eps }\ntext ::= TEXT { textoption }*n x y <text>\ntextoption ::= : [ font | color ]\nfont ::= USEFONT <fontname> SIZE <number>',
    },
  },
  {
    name: 'TOP',
    de: {
      description:
        'Die Tabellenausgabe kann auf bestimmte Teile beschränkt werden: Es können',
    },
  },
  {
    name: 'TOPTEXT',
    de: {
      description: 'Textbox am oberen Rumpf der Tabelle',
      syntax: 'TOPTEXT = "<text>";',
    },
  },
  {
    name: 'TOTALCOLU',
    de: {
      description:
        'Ausgewertete Fälle aller Werte (wie in CELLELELEMENTS 418 definiert) in der',
    },
  },
  {
    name: 'TOTALPERCENT',
    de: {
      description: 'Prozentuierung aller Zellen auf das Tabellen- Gesamt-N.',
    },
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
    name: 'TOTALSUMPERCENT',
    argsHint: '( Var )',
    de: {
      description:
        'Ausgabe der Prozentuierung der Summe einer dritten Variablen auf die Gesamtsumme in der Tabelle',
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
    },
  },
  {
    name: 'TRANSFERSUPPRESSEDCONTENTKEY',
    de: {
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
  },
  {
    name: 'TRIANGLE1',
    de: {
      description:
        'Skalenwert mit einem Dreieck markieren (auf der Basis stehend)',
    },
  },
  {
    name: 'TRIANGLE1O',
    de: {
      description: 'Dreieck (auf der Basis stehend) als Outline',
    },
  },
  {
    name: 'TRIANGLE2',
    de: {
      description:
        'Skalenwert mit einem Dreieck markieren (auf der Spitze stehend)',
    },
  },
  {
    name: 'TRIANGLE2O',
    de: {
      description: 'Dreieck (auf der Spitze stehend) als Outline',
    },
  },
  {
    name: 'TRIMSTRINGS',
    de: {
      description: '',
      syntax: 'TRIMSTRINGS = [ YES | NO ];',
    },
  },
  {
    name: 'TRUNC',
    de: {
      description:
        'Vor der Berechnung werden beide Argumente mittels TRUNC in Ganze Werte gewandelt. D.h.',
    },
  },
  {
    name: 'TRUNCATEDECIMALS',
    de: {
      description: '',
      syntax: 'TRUNCATEDECIMALS <varlist> = <number>;\n<number> ::= -9 .. 9;',
    },
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
  },
  {
    name: 'TTESTCUT',
    argsHint: '( Var )',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwertsunterschiede, berechnet auf Basis der Datenreduktion wie bei MEANCUT 423',
    },
  },
  {
    name: 'UNITS',
    de: {
      description: '',
      syntax: 'UNITS = [ MM | POINTS | INCH ];',
    },
    en: {
      description: '',
      syntax: 'UNITS = [ MM | POINTS | INCH ];',
    },
  },
  {
    name: 'UPDATEINVERT',
    de: {
      description: '',
      syntax: 'UPDATEINVERT;',
    },
  },
  {
    name: 'USE3D',
    de: {
      description: '',
      syntax: 'USE3D : [YES | NO]',
    },
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
    },
  },
  {
    name: 'USEFONT',
    de: {
      description:
        'Der zu verwendende Font LEFT | RIGHT | HCENTER Horizontale Ausrichtung des Textes TOP | BOTTOM | VCENTER Vertikale Ausrichtung des Textes Jede dieser Optionen hat eine eigene Syntax: Nach einer USEFONT-Option z.B. müssen Name und Größe eines gültigen Fonts stehen, nach dem Schlüsselwort LINEWIDTH muss zwingend eine Zahl stehen usw..…',
      syntax:
        'USEFONT <Zielname> = <Fontname> SIZE <number>; (PS)\nUSEFONT <Zielname> = <Fontname>; (Non-PS)',
    },
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
    },
  },
  {
    name: 'USEOPENASCODE',
    de: {
      description: '',
      syntax:
        'USEOPENASCODE <varlist> = [ YES | NO ];\nSteht dieser Schalter auf YES, dann wird versucht, die offene Antwort für die in <varlist>',
    },
  },
  {
    name: 'USERAWSFORSTATS',
    en: {
      description: '',
      syntax: 'USERAWSFORSTATS = [ YES | NO ] ;',
    },
  },
  {
    name: 'USEVISIBLEDIGITSNONLY',
    de: {
      description: '',
      syntax: 'USEVISIBLEDIGITSNONLY = [ YES | NO ];',
    },
  },
  {
    name: 'USEWEIGHT',
    de: {
      description: '',
      syntax: 'USEWEIGHT = [ YES | NO | <varname> ] ;',
    },
    en: {
      description: '',
      syntax: 'USEWEIGHT = [ YES | NO | <varname> ] ;',
    },
  },
  {
    name: 'VALIDN',
    de: {
      description:
        "Zahl der Fälle, für die ein gültiger Wert der '<bestehende_variable>' gefunden wurde",
    },
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
      description: '',
      syntax:
        'VALUELABELS <VarList> = [ ADD ]\n{ LabelEntry }*n ;\nLabelEntry ::=\n[<number> "String" | OVERCODE [ SUM ] [<name>] { <number> [ :<number>\n] }*n "String" ] [ LabelOption ]\nLabelOption ::=',
    },
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
    },
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
    de: {
      description: '',
      syntax: 'VARIANCE <varname> = <varlist>;',
    },
  },
  {
    name: 'VARKEY',
    de: {
      description: '',
      syntax: 'VARKEY <varname> = <key>;',
    },
  },
  {
    name: 'VARLIST',
    de: {
      description: '',
      syntax: 'VARLIST = <dateipfad> QST;',
    },
  },
  {
    name: 'VARNAME',
    en: {
      description:
        'defines a variable and its position in the DATAFILE if necessary in the COPYFILE or also in the COLBININFILE. If a variable in a particular "row" is to be referred to then it is preceded by the key word CARD or COLBININCARD (see below). Example: VARNAME = Alter 101 1; Age is coded in column 101, length = 1. Example: CARD = 3; VARNAME = ITEM37 44 2; ITEM37 is coded in column 44-45 of card 3.…',
    },
  },
  {
    name: 'VARTEXT',
    de: {
      description:
        'Variablentext 209, typischerweise der Frage- oder Erläuterungstext Wird üblicherweise mit einer CITE[...]-Anweisung im TOPTEXT 516 angefordert (siehe Anzeige von Variablentexten 523).',
      syntax: 'VARTEXT [<VarList>] = "text";\nTEXT [<VarList>] = "text";',
    },
    en: {
      description: '',
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
      description: '',
      syntax: 'VARTITLE <VarList> = "String";',
    },
  },
  {
    name: 'VERTICALALIGN',
    de: {
      description: '',
      syntax:
        'VERTICALALIGN <boxtype> : [TOP|VCENTER|BOTTOM]\nHORIZONTALALIGN <boxtype> : [LEFT|HCENTER|RIGHT]',
    },
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
    },
  },
  {
    name: 'WEIGHTACCURACY',
    de: {
      description: '',
      syntax: 'WEIGHTACCURACY = <number>;',
    },
    en: {
      description:
        'Defines the accuracy bound up to which iteration should occur. WEIGHTACCURACY is the natural logarithm of the maximum deviance of a weighting cell from the prerequisite as factor. Preset: WEIGHTACCURACY = 0.0001;',
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
    name: 'WEIGHTOUT',
    de: {
      description: '',
      syntax: 'WEIGHTOUT = <startcolumn> <width>;',
    },
    en: {
      description:
        'defines where a newly calculated weight is to be stored in the outfile. Syntax as above. Example: WEIGHTOUT = 68 6;',
    },
  },
  {
    name: 'WEIGHTSUM',
    de: {
      description: '',
      syntax: 'WEIGHTSUM = <number>;',
    },
    en: {
      description:
        'States the desired sum of the weights to be calculated. Normally weighting occurs to the number of the cases physically read.',
    },
  },
  {
    name: 'WELCHTEST',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwerteunterschiede nach Welch 450 auf Basis der gewichteten Daten',
    },
  },
  {
    name: 'WHILEBLOCK',
    de: {
      description: '',
      syntax: 'WHILEBLOCK <bedingung> DO',
    },
  },
  {
    name: 'WHITENUMBERS',
    de: {
      description:
        '= | FORM LINE FORM CIRCLE SYMBOLSIZE 12 ROWS 1:11 COLUMNS 1:5 ; Mit folgendem Output: GESStsabsArtist-Grafik auf Basis der Mittelwerte aus der OVERVIEW-Tabelle [X]Overview Add ähnlich wie TABLE ADD 390 kann man mit OVERVIEW ADD 406 und XOVERVIEW ADD 409 die Daten aus mehreren Vorlagen einfach in eine Tabelle integrieren. Overview Add Ein Beispiel:…',
    },
  },
  {
    name: 'WIDTH',
    de: {
      description: 'Die Breite der TITLEBOX',
    },
  },
  {
    name: 'WORDSPLITS',
    de: {
      description: '',
      syntax: 'WORDSPLITS= [ <filename> | "" ];',
    },
  },
  {
    name: 'WRAPTEXT',
    de: {
      description: '',
      syntax: 'WRAPTEXT <boxtype> : [YES|NO]',
    },
  },
  {
    name: 'WRITESIGNALFILE',
    de: {
      description: '',
      syntax: 'WRITESIGNALFILE = [ YES | NO ];',
    },
  },
  {
    name: 'XCOLCHIQU',
    de: {
      description:
        'Spaltenweise 4-Felder Chiquadrat-Test auf Prozentwertunterschiede (gewichtet und ungewichtet)',
    },
  },
  {
    name: 'XCOLDEPTTEST',
    argsHint: '( Var )',
    de: {
      description:
        'Abhängiger t-Test auf Mittelwertsunterschiede (gewichtet und ungewichtet)',
    },
  },
  {
    name: 'XLABELSIGNCHARBOX',
    de: {
      description: '',
      syntax: 'XLABELSIGNCHARBOX LABELS X : [YES|NO]',
    },
  },
  {
    name: 'XMCNEMAR',
    de: {
      description:
        'Abhängiger Test auf Prozentwertunterschied (gewichtet und ungewichtet) nach McNemar 449',
    },
  },
  {
    name: 'XOVERVIEW',
    de: {
      description: '',
      syntax:
        'XOVERVIEW <tableoptions> =\n<cellelementlist>( <varlist> ) [ SORT <cellelement>\n[ DESCEND ] [ PANE <number> CODE <number> ] ] BY <kopf>;\n<varlist> ::= { <variable [ <varoption> ] }*n\n<varoption> ::=\n[ SORTCLASS <number> ]',
    },
  },
  {
    name: 'XROWCHIQU',
    de: {
      description:
        'Zeilenweise 4-Felder Chiquadrat-Test auf Prozentwertunterschiede (gewichtet und ungewichtet)',
    },
  },
  {
    name: 'XROWTTEST',
    de: {
      description:
        'Zeilenweiser, unabhängiger t-Test auf Mittelwerteunterschiede (gewichtet und ungewichtet)',
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
  },
  {
    name: 'XWELCHTEST',
    de: {
      description:
        'Unabhängiger t-Test auf Mittelwerteunterschiede (gewichtet und ungewichtet) nach Welch 450 * zu ColPercT: ColPercTMinimum Bei der Signifikanzberechnung nach COLPERCT 428 wird die Spaltenüberlappung (kann bei Mehrfachnennungsvariablen passieren) berücksichtig.…',
    },
  },
  {
    name: 'YDATABOXES',
    de: {
      description:
        'YDATABOXES ist eine Box, die alle DATABOXes einer Tabelle senkrecht umfasst. Sie geht auch nach oben über die FRAMECELLS und die LABELCELLS hinaus. Damit kann man über alle Elemente hinweg senkrechte Spalten schaffen, die optisch zusammen hängen DrawBox Zeichnung der Boxes',
    },
  },
  {
    name: 'ZEROBASED',
    de: {
      description: 'Die Skala soll immer den Nullpunkt enthalten',
    },
  },
  {
    name: 'ZERODASHCHAR',
    de: {
      description: '',
      syntax: 'ZERODASHCHAR = "<char>";',
    },
  },
  {
    name: 'ZIPINVERTOUT',
    de: {
      description: '',
      syntax: 'ZIPINVERTOUT = [ YES | NO ];',
    },
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
  },
];
