// GENERATED FILE — do not hand-edit.
// Produced by scripts/extractKeywordDatabase.ts from the local
// dokumentation/*.md manuals (git-ignored — see that script's header
// comment for what this covers, what it doesn't, and why). Re-run
// npm run extract-keywords to regenerate after documentation changes.
// Language: de. Hand corrections go in
// src/keywordDatabaseOverrides.de.ts instead — that file is
// never touched by this script.

import { KeywordEntry } from './keywordDatabaseTypes';

export const keywordDatabase: KeywordEntry[] = [
  {
    name: '#DEFINE',
    description: '',
    syntax: '#DEFINE <string>\n#UNDEFINE <string>',
    source: 'gesstabs_handbuch_52.md:875',
  },
  {
    name: '#DOMACRO',
    argsHint: '( <Macroname> <Schleifenliste> )',
    description: 'Beispiel: #tab( 1 ) #tab( 2 ) #tab( 3 ) kann man als',
    syntax: '#DOMACRO( <Macroname> <Schleifenliste> )',
    source: 'gesstabs_handbuch_52.md:745',
  },
  {
    name: '#DOMACRO2',
    argsHint: '( <Macroname> <Schleifenliste> ; <weitere parameter> )',
    description: '#DoMacro2 ist eine Erweiterung des #DOMACRO. Beispiel:',
    syntax: '#DOMACRO2( <Macroname> <Schleifenliste> ; <weitere parameter> )',
    source: 'gesstabs_handbuch_52.md:760',
  },
  {
    name: '#DOMACRO3',
    argsHint: '( <macroname> <filename> )',
    description:
      'Wie #DOMACRO und #DOMACRO2 dient das #DOMACRO3-Statement der wiederholten Abarbeitung von Macros. Die Macro-Parameter werden hierbei aus einer CSV-Datei entnommen, die am einfachsten mit einem Tabellenverarbeitungsprogramm erzeugt werden kann. Dadurch bietet es eine Schnittstelle zu MitarbeiterInnen, die nicht im Scripting versiert sind.…',
    syntax: '#DOMACRO3 ( <macroname> <filename> )',
    source: 'gesstabs_handbuch_52.md:770',
  },
  {
    name: '#DOMACRO4',
    argsHint: '( <filename> )',
    description:
      'Einen �hnlichen Hintergrund hat auch das #DOMACRO4-Statement. Der Unterschied ist, dass der Name des Macros nicht im Script festgelegt wird, sondern als erstes Feld in der CSV-Datei benannt wird. Der Aufruf',
    syntax: '#DOMACRO4 ( <filename> )',
    source: 'gesstabs_handbuch_52.md:800',
  },
  {
    name: '#END',
    description:
      'so w�rde abweichend vom normalen Ablauf eine ASCII-Druckdatei erzeugt. #IfDef und #IfNDef Mit #IFDEF bzw. #IFNDEF kann man abfragen, ob ein Name definiert ist oder nicht. Alle GESStabs-Quellzeilen und alle #DEFINE bzw. #UNDEFINE-Statements zwischen dem #IFDEF bzw. #IFNDEF und dem schlie�enden #END werden in Abh�ngigkeit vom Wahrheitswert dieses Tests durchgef�hrt.…',
    source: 'gesstabs_handbuch_52.md:889',
  },
  {
    name: '#ENDMACRO',
    description: 'kann man es anschlie�end beliebig oft aufrufen:',
    source: 'gesstabs_handbuch_52.md:719',
  },
  {
    name: '#EXPANDINC',
    description: '',
    syntax:
      '#EXPANDINC #<Name des Expands> <Wert>\nIm Kern ist dies ein #EXPAND. Das Argument <value> muss aber eine ganze Zahl sein, aus',
    source: 'gesstabs_handbuch_52.md:667',
  },
  {
    name: '#EXPANDINTOKEN',
    description: '',
    syntax:
      '#EXPANDINTOKEN &<search>& <replace>\n<search> ::= zu ersetzender text\n<replace> ::= einzuf�gender text',
    source: 'gesstabs_handbuch_52.md:683',
  },
  {
    name: '#IFDEF',
    description: '',
    syntax: '#IFDEF <Define-Name>\n<Syntax-Statement 1>',
    source: 'gesstabs_handbuch_52.md:897',
  },
  {
    name: '#IGNORECASE',
    description: '',
    syntax: '#IGNORECASE = [ YES | NO ] ;',
    source: 'gesstabs_handbuch_52.md:634',
  },
  {
    name: '#STDCOLORS',
    description:
      'GESSCHART INVERSE CELLELEMENT PHYSCOLDELTA CHARTTITLE "Effekte von Gewichtung auf Parteianteile"',
    source: 'gesstabs_handbuch_52.md:4479',
  },
  {
    name: '#TEST',
    argsHint: '( f2a f2b f2c )',
    description:
      "usw. Im ersten Aufruf wird dann 'f1a' anstelle des ersten im Makro definierten Parameters (&p1), 'f1b' anstelle des zweiten Parameter (&p2) und 'f1c' anstelle des dritten Parameters (&p3) eingesetzt. Macros k�nnen bis zu 50 Parameter haben. Die L�nge der formalen Parameternamen ist auf 10 Zeichen beschr�nkt. Die Namen von Parametern m�ssen mit dem &-Zeichen beginnen.…",
    source: 'gesstabs_handbuch_52.md:722',
  },
  {
    name: 'ABSCOLUMN',
    description:
      'PHYSICALCOLUMN. Im Standardfall einer Tabelle mit absoluten H�ufigkeiten ist von den sechs Rahmenelementen nur eines vorhanden: die Zeile mit den absoluten H�ufigkeiten, ABSROW. In unserem Fall sollen in den Zellen Spaltenprozente abgebildet werden, das hei�t als CELLELEMENTS w�hlen wir COLUMNPERCENT. Dazu passen eine Totalspalte und eine Absolutzeile.…',
    source: 'gesstabs_handbuch_52.md:9306',
  },
  {
    name: 'ABSINLABELBOX',
    description:
      'Drucke die ABSROW 417 nicht wie �blich in einem eigenen Kasten, sondern drucke die Werte am unteren Rand der Labelk�stchen.',
    source: 'gesstabs_handbuch_52.md:13555',
  },
  {
    name: 'ABSOLUTE',
    description: 'Zahl der F�lle (Summe der Gewichte)',
    source: 'gesstabs_handbuch_52.md:8252',
  },
  {
    name: 'ABSROW',
    description: 'Absolute Zahl der Nennungen/ F�lle in der Zeile',
    source: 'gesstabs_handbuch_52.md:10723',
  },
  {
    name: 'ABSZERODASH',
    description:
      'Im Standardfall wird die Null als Absolutwert als eine 0 dargestellt. Mit ABSZERODASH kann man erreichen, dass die Null in einem CELLELEMENT ABSOLUTE 419 als Dash (�-�) dargestellt wird.',
    source: 'gesstabs_handbuch_52.md:13558',
  },
  {
    name: 'ACROSS',
    description:
      'Die atomaren Elemente von zusammengesetzten CELLELEMENTS werden in PS/PDF-Ausgabe nicht untereinander, sondern nebeneinander dargestellt.',
    source: 'gesstabs_handbuch_52.md:13563',
  },
  {
    name: 'ADD',
    description:
      "Editierung bestehender Labellisten, siehe ADD 212 Wird ein LABEL/OVERCODE an eine Position eingef�gt, die so nicht 'exsitiert' (z.B. an POSTIION 5 in einer liste mit nur drei VALUELABELS, wird dieses Label einfach ans Listenende angeh�ngt - so, als ob keine POSITION angegeben w�re.",
    source: 'gesstabs_handbuch_52.md:5627',
  },
  {
    name: 'ADDNAMETOVARTITLE',
    description: '',
    syntax: 'ADDNAMETOVARTITLE = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5297',
  },
  {
    name: 'ADDOVERCODE',
    description:
      'In der Regel werden OVERCODE 262s je Fall nur einmal gez�hlt, wenn mehrere der dazugeh�renden Kategorien vorkommen, d.h. es wird ein logisches ODER gebildet. Mit ADDOVERCODE kann eine Addition der Einzelh�ufigkeiten verlangt werden. AUTOOVERSORT 647 Sortiert die OVERCODE 262s einer Tabelle und bereitet die Labels f�r die Sortierung unterhalb der Overcodes vor.…',
    source: 'gesstabs_handbuch_52.md:13567',
  },
  {
    name: 'ALIGN',
    description: '',
    syntax:
      'ALIGN <boxname> = { <hpos> | <vpos> }*n ;\n<hpos> = [ LEFT | RIGHT | HCENTER ] [ <number> ] [ TABULATOR <number> ]\n<vpos> = [ TOP | BOTTOM | VCENTER ] [ <number> ] [ TABULATOR <number> ]',
    source: 'gesstabs_handbuch_52.md:14172',
  },
  {
    name: 'ALIGNALPHA',
    description: '',
    syntax: 'ALIGNALPHA = [ LEFT | RIGHT ];',
    source: 'gesstabs_handbuch_52.md:15930',
  },
  {
    name: 'ALLOWASYMMETRY',
    description:
      'asymmetrische Ausgabe der Skala bei RISING/FALLING Analog zum TABLEFORMAT kann man die einzelnen Optionen ein- und ausschalten. Der 534 Zustand von GESSCHARTFORMAT gilt f�r alle danach stehenden Charts, bis ein weiteres GESSCHARTFORMAT dieses wieder �ndert. Mit GESSCHARTFORMAT kann man immer nur alle entsprechenden Elemente beeinflussen.…',
    source: 'gesstabs_handbuch_52.md:5022',
  },
  {
    name: 'ALPHA',
    description: '',
    syntax: 'ALPHA <varlist> = YES;',
    source: 'gesstabs_handbuch_52.md:5416',
  },
  {
    name: 'ALPHACASESENSITIVE',
    description: '',
    syntax: 'ALPHACASESENSITIVE = [ YES | NO | LOWERCASE | UPPERCASE ];',
    source: 'gesstabs_handbuch_52.md:5444',
  },
  {
    name: 'ALPHAFAMILY',
    description: '',
    syntax: 'ALPHAFAMILY <neueAlphaFamily> = { <alphavar> }*n ;',
    source: 'gesstabs_handbuch_52.md:7247',
  },
  {
    name: 'ASALPHA',
    description: '',
    syntax:
      'ASALPHA <varlist> = [ YES | NO ];\nOPENASALPHA <varlist> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5397',
  },
  {
    name: 'ASCIIOUT',
    description: '',
    syntax: 'ASCIIOUT <Varlist> = startcolumn [ width ];',
    source: 'gesstabs_handbuch_52.md:15878',
  },
  {
    name: 'ASCIIOUTDECIMALCHAR',
    description: '',
    syntax: 'ASCIIOUTDECIMALCHAR = [ . | � ];',
    source: 'gesstabs_handbuch_52.md:15916',
  },
  {
    name: 'ASCIIOUTFILE',
    description: '',
    syntax: 'ASCIIOUTFILE [ DELIMITED [ ASCIIOUT ] ] = <filename>;',
    source: 'gesstabs_handbuch_52.md:15855',
  },
  {
    name: 'ASSCOCEND',
    description: '',
    syntax: 'ASSCOCEND <filename> ;',
    source: 'gesstabs_handbuch_52.md:2361',
  },
  {
    name: 'ASSERTFILTERINASCII',
    description: '',
    syntax: 'ASSERTFILTERINASCII = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15724',
  },
  {
    name: 'ASSOCFILE',
    description: '',
    syntax: 'ASSOCFILE = <filename> KEY <varname> <startcol> <len> ;',
    source: 'gesstabs_handbuch_52.md:2256',
  },
  {
    name: 'ASSOCTOINVERT',
    description: '',
    syntax:
      'ASSOCTOINVERT = [ CSV | SPSS | DBASE | ASCIIN }*n = [ YES | NO ];\nVoreinstellung: ASSOCTOINVERT = CSV SPSS DBASE ASCIIN;',
    source: 'gesstabs_handbuch_52.md:2403',
  },
  {
    name: 'ASSOCVAR',
    description: '',
    syntax:
      "ASSOCVAR <varname> = [ ALPHA] <startcol> [ <len> [ <width> ] ] ;\nJedes ASSOCVAR-Statement erzeugt eine neue, erg�nzende Variable namens '<varname>'.",
    source: 'gesstabs_handbuch_52.md:2342',
  },
  {
    name: 'AUTO',
    description: '',
    syntax: 'AUTO : [YES | NO]',
    source: 'gesstabs_handbuch_52.md:3475',
  },
  {
    name: 'AUTOCLEAR',
    description: '',
    syntax: 'AUTOCLEAR = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:16644',
  },
  {
    name: 'AUTOCONTENTKEY',
    description: '',
    syntax:
      'AUTOCONTENTKEY = [ TABLETITLE | VARNAME | VARTEXT | VARTITLE ]\n[ YVALID | XVALID ];\nAusschalten: AUTOCONTENTKEY = NO;',
    source: 'gesstabs_handbuch_52.md:15273',
  },
  {
    name: 'AUTONOANSWER',
    description: '',
    syntax:
      'AUTONOANSWER [ <varlist> ] = [ YES "noanswertext" | NO ]\n[ LEVEL < number > ];',
    source: 'gesstabs_handbuch_52.md:6199',
  },
  {
    name: 'AUTOREPLACEOPEN',
    description: '',
    syntax: 'AUTOREPLACEOPEN = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:16748',
  },
  {
    name: 'AUTOSIGNCHAR',
    description:
      'Dieses TableFormat veranlasst eine automatische Kennzeichnung der Spalten mit Kennbuchstaben (INDEXCHARS 529) f�r spaltenorientierte Signifikanztests. Wenn TESTCOLUMNS 451 vereinbart sind, werden die Buchstaben nicht f�r die einzelnen Variablen neu vergeben, wie sonst im Standardfall.',
    source: 'gesstabs_handbuch_52.md:13575',
  },
  {
    name: 'AUTOSIGNCHARALWAYS',
    description:
      'Wie AUTOSIGNCHAR 535. AUTOSIGNCHAR enth�lt aber eine Automatik, dass nur dann die Kennzeichnung im Kopf vorgenommen wird, wenn auch mindestens ein zutreffendes CELLELEMENT 418 in der Tabelle enthalten ist. Bei AUTOSIGNCHARALWAYS unterbleibt diese Pr�fung.',
    source: 'gesstabs_handbuch_52.md:13581',
  },
  {
    name: 'AUTOSIGNFORMAT',
    description:
      '5.Protokollierung der Signifikanzberechnung 460: STATTESTDUMP Gegenstand des Signifikanztests TestColumns Gibt man keine TESTCOLUMNS an, werden je Variable alle Spalten gegeneinander getestet.',
    syntax: 'AUTOSIGNFORMAT = "<formatstring>";',
    source: 'gesstabs_handbuch_52.md:11806',
  },
  {
    name: 'AUTOSIGNIFTEXT',
    description: '',
    syntax: 'AUTOSIGNIFTEXT = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:11998',
  },
  {
    name: 'BACKGROUND',
    argsHint: '( ge 2 le 3 : $e0e0ff ge 0 le 2 : $d0d0ff )',
    description:
      'FORMAT "#,#" = <1 4> / <1 1> ; Der Ergebniswert 2 w�re ohne die obenstehende Regel nicht eindeutig zuzuordnen. so wird die Zelle mit $d0d0ff und nicht mit $e0e0ff gef�rbt. Die letzte Zeile k�nnte auch in zwei getrennten BACKGROUND-Regeln beschrieben werden, gleichbedeutend w�re: BACKGROUND ( ge 2 le 3 : $e0e0ff ) BACKGROUND ( ge 0 le 2 :…',
    syntax: 'BACKGROUND <boxtype> : <color>\nFOREGROUND <boxtype> : <color>',
    source: 'gesstabs_handbuch_52.md:14788',
  },
  {
    name: 'BENCHMARKCOLOR',
    description: '',
    syntax: 'BENCHMARKCOLOR = <color_high> <color_low> ;',
    source: 'gesstabs_handbuch_52.md:14953',
  },
  {
    name: 'BENCHMARKLEVEL',
    description: '',
    syntax: 'BENCHMARKLEVEL = [ SIGNIF90 | SIGNIF95 | SIGNIF99 | SIGNIF999 ];',
    source: 'gesstabs_handbuch_52.md:11613',
  },
  {
    name: 'BENCHMARKVALUES',
    description:
      '| 1 1:3 / 1 1:1 = 8.45 9213 | 1 1:3 / 1 2:2 = 54.33 9213 ; Die erste Zeile des Beispiels bedeutet also: F�r alle Zellen im Schnittpunkt der ersten Variablen in der X-Richtung mit den x-Werten 1 2 und 3 und der ersten Variablen in der Y-Richtung mit dem Wert 1 gilt der Benchmarkprozentwert 8.45 bei einem N von 9213.…',
    source: 'gesstabs_handbuch_52.md:11601',
  },
  {
    name: 'BINOMIALPERCENTRANGE',
    description: '',
    syntax: 'BINOMIALPERCENTRANGE = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:11014',
  },
  {
    name: 'BLANKVALUE',
    description: '',
    syntax: 'BLANKVALUE = <number>;\nBeispiel: BLANKVALUE = -1;',
    source: 'gesstabs_handbuch_52.md:15969',
  },
  {
    name: 'BOTTOM',
    description:
      'Label wird innerhalb einer Sortierklasse immer ans Ende sortiert, siehe',
    source: 'gesstabs_handbuch_52.md:5639',
  },
  {
    name: 'BOTTOMTEXT',
    description: 'Optionaler Text am Ende der Tabelle',
    syntax: 'BOTTOMTEXT = "<text>";',
    source: 'gesstabs_handbuch_52.md:13161',
  },
  {
    name: 'BOXFONT',
    description: '',
    syntax:
      'BOXFONT <boxtype> : <fontname> SIZE <number>\n[OPTION [BOLD|ITALIC|UNDERLINE]]',
    source: 'gesstabs_handbuch_52.md:2923',
  },
  {
    name: 'BOXLINEFEED',
    description: '',
    syntax: 'BOXLINEFEED <boxname> = <number> ;',
    source: 'gesstabs_handbuch_52.md:14164',
  },
  {
    name: 'BOXMINHEIGHT',
    description: '',
    syntax:
      "BOXMINHEIGHT <boxname> = <number>;\nWird wegen der Abh�ngigkeit der Boxes voneinander nicht bei allen '<boxnames>'",
    source: 'gesstabs_handbuch_52.md:14150',
  },
  {
    name: 'BY',
    description:
      'MEAN VALIDN ( a11 a12 DESCRIPTION "this was a12" USEFONT "Helvetica-Bold" size 9 a13 LEVEL 252 a14 USEWEIGHT dummyweight a15 a16 a17 FILTER a11 EQ 1 OR a12 EQ 5 | SORTCLASS -12 a18 a19 ) SORT MEAN DESCEND; ... folgende Tabelle: �bersichtstabelle mit OVERVIEW mit modifizierten Variablen Gehen wir die Bedeutung dieser Optionen der Reihenfolge nach durch:…',
    source: 'gesstabs_handbuch_52.md:10411',
  },
  {
    name: 'CALCCOLLOWACCURACY',
    description: '',
    syntax: 'CALCCOLLOWACCURACY = [ YES | NO ] ;',
    source: 'gesstabs_handbuch_52.md:16680',
  },
  {
    name: 'CALCULATECOLUMN',
    description: '',
    syntax:
      'CALCULATECOLUMN <Zielspalte> [ FORMAT <format> ]\n[ FOREGROUND <rules> ] [ BACKGROUND <rules> ]\n= <arithmetischer Spaltenausdruck>;\n<Zielspalte> ::= <varno> <code> >\n<rules> ::= ( { <rule> }*n )\n<rule> ::= [ GE | GT ] <number1> [ LT | LE ] <number2> : <color>',
    source: 'gesstabs_handbuch_52.md:8356',
  },
  {
    name: 'CARDNUMBER',
    description: '',
    syntax: 'CARDNUMBER = <STARTCOLUMN> <WIDTH>;',
    source: 'gesstabs_handbuch_52.md:15711',
  },
  {
    name: 'CASEBASESTRING',
    description:
      'Text, der bei Mehrfachnennungen in CODEBOOK 346-Tabellen auf die Prozentuierung verweist.',
    syntax:
      'CASEBASESTRING = "<text>";\nStandardtext: \'Prozentuiert auf die Zahl der F�lle\';',
    source: 'gesstabs_handbuch_52.md:13083',
  },
  {
    name: 'CASETITLE',
    description:
      'Bezeichnung der CASES-Spalte/-zeile (wenn TABLEBASE = CASES; 388 gesetzt)',
    syntax: 'CASETITLE [ X | Y ] = "<text>";',
    source: 'gesstabs_handbuch_52.md:13118',
  },
  {
    name: 'CBEXCLUDEMISSING',
    description: '',
    syntax: 'CBEXCLUDEMISSING = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:9124',
  },
  {
    name: 'CBPERCENTINTOTAL',
    description:
      'In der Totalzeile von CODEBOOK 346 werden jeweils die Zahl der F�lle oder die Zahl der Nennungen ausgewiesen. Wird das TABLEFORMAT CBPERCENTINTOTAL gesetzt, werden in den Totalspalte stattdessen Prozentwerte ausgegeben.',
    source: 'gesstabs_handbuch_52.md:13596',
  },
  {
    name: 'CELLELEMENT',
    description: '[ MINIMUM <number> ] minimale im PIE abzubildende %-Zahl',
    source: 'gesstabs_handbuch_52.md:4682',
  },
  {
    name: 'CELLELEMENTS',
    description: 'Anforderung spezifischer Zellenelemente 418 f�r dieses Label',
    syntax: 'CELLELEMENTS [ TOTALROW | TOTALCOLUMN ] = { <cellelement> }*n ;',
    source: 'gesstabs_handbuch_52.md:5668',
  },
  {
    name: 'CELLMINIMUM',
    description: '',
    syntax: 'CELLMINIMUM = <value>;',
    source: 'gesstabs_handbuch_52.md:8813',
  },
  {
    name: 'CELLSEQUENCE',
    description: '',
    syntax:
      'CELLSEQUENCE = <cellelements>;\nCLASSICCELLSEQUENCE = <cellelements>;',
    source: 'gesstabs_handbuch_52.md:13857',
  },
  {
    name: 'CELLSET',
    description: 'Statement verwendet werden.',
    source: 'GESStabs_Cellset.md:151',
  },
  {
    name: 'CHANGESPSSVARNAMES',
    description: '',
    syntax: 'CHANGESPSSVARNAMES = [ UPPERCASE | LOWERCASE | NO ];',
    source: 'gesstabs_handbuch_52.md:1703',
  },
  {
    name: 'CHAPTER',
    description: '',
    syntax: 'CHAPTER <varlist> = [ {<string>}*n ];',
    source: 'gesstabs_handbuch_52.md:16765',
  },
  {
    name: 'CHAPTERPAGE',
    description:
      'Gesellschaft für Software in der Sozialforschung mbH Waterloohain 6 - 8',
    source: 'GESStabs_Titlepage-Chapterpage.md:4',
  },
  {
    name: 'CHAPTERTITLE',
    description: '',
    syntax: 'CHAPTERTITLE = <name>;',
    source: 'gesstabs_handbuch_52.md:15485',
  },
  {
    name: 'CHARTHEADER',
    description: '',
    syntax:
      'CHARTHEADER = <string> [ TOP | BOTTOM | VCENTER |LEFT\n| RIGHT | HCENTER ] ;\nCHARTFOOTER = <string> [ TOP | BOTTOM | VCENTER |LEFT\n| RIGHT | HCENTER ] ;',
    source: 'gesstabs_handbuch_52.md:5064',
  },
  {
    name: 'CHARTTITLE',
    description:
      '"Top-2-Box horizontal nach Modellen: Bullet mit Zahlenangabe (wei�)" CHARTAREA 105 15 87 180 SAMEPAGE HORIZONTAL INVERSE = | FORM CIRCLE ROWS 1:22 COLUMNS 65002 SYMBOLSIZE 10 ; GESSCHARTFONT CHARTNUMBERS = "HELVETICA" SIZE 8; GESSCHARTFORMAT = NUMEXGRAPH NOFRAME NOSCALE; GESSCHARTCOLORS = $EE6699;',
    syntax: 'CHARTTITLE : <title>',
    source: 'gesstabs_handbuch_52.md:4058',
  },
  {
    name: 'CHECKMISSINGINMULTI',
    description: '',
    syntax: 'CHECKMISSINGINMULTI = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:6410',
  },
  {
    name: 'CHECKRECODES',
    description: '',
    syntax: 'CHECKRECODES = [ YES | NO };',
    source: 'gesstabs_handbuch_52.md:1269',
  },
  {
    name: 'CHIQU',
    description:
      'Ausgabe des Chi-Quadrats zellenweise. Das Chi-Quadrat bewertet die Abweichung der empirischen Verteilung in jeder Zelle vom anhand der Randverteilungen ermittelten Erwartungswert.',
    source: 'gesstabs_handbuch_52.md:11279',
  },
  {
    name: 'CIRCLE',
    description: 'Skalenwert mit einem Kreis markieren',
    source: 'gesstabs_handbuch_52.md:5004',
  },
  {
    name: 'CIRCLEO',
    description:
      'LineDash LINEDASH ist ein ganzzahliger Wert zwischen 1 und 10. In GESStabs sind zehn Formen gestrichelter Linien vordefiniert, die man zur Gestaltung von LINE oder RECTLINE abrufen kann. Voreinstellung: 0, das entspricht einer durchgezogenen Linie. LineWidth Die Dicke von LINE bzw. RECTLINE. Explode Ist bei anderen Formen als PIE oder PIE100 wirkungslos.…',
    source: 'gesstabs_handbuch_52.md:4883',
  },
  {
    name: 'CITEALLVARS',
    description: '',
    syntax:
      'CITEALLVARS = [ TOPTEXT | BOTTOMTEXT | NO ]\n{ XVALIDXVALID | YVALIDYVALID };',
    source: 'gesstabs_handbuch_52.md:13249',
  },
  {
    name: 'CITEFIRSTVAR',
    description: '',
    syntax:
      'CITEFIRSTVAR = [ TOPTEXT | BOTTOMTEXT | NO ] { XVALID | YVALID };\nParallel zu CITEALLVARS gibt es auch ein CITEFIRSTVAR; dann wird nur der Text der die',
    source: 'gesstabs_handbuch_52.md:13269',
  },
  {
    name: 'CITEVARTEXT',
    description: '',
    syntax: 'CITEVARTEXT [ TOPTEXT | BOTTOMTEXT ] = <Varlist> ;',
    source: 'gesstabs_handbuch_52.md:13240',
  },
  {
    name: 'CLONEVAR',
    description: '',
    syntax:
      'CLONEVAR <destinationvar> = <sourcevar>\n[ DELETELABELS [ MISSING | AUTONOANSWER | OVERCODE | {<number>}*n ] ];',
    source: 'gesstabs_handbuch_52.md:6436',
  },
  {
    name: 'CODEBOOK',
    description: '',
    syntax: 'CODEBOOK [ EXCEPT ][ <VarList> ] ;',
    source: 'gesstabs_handbuch_52.md:9092',
  },
  {
    name: 'CODEBOOKHEADER',
    description: '',
    syntax:
      'CODEBOOKHEADER =\n| CODE "Text"\n| ABSOLUTE "Text"\n| COLUMNPERCENT "Text"\n| NOMPERCENT "Text"\n| CUMPERCENT "Text"',
    source: 'gesstabs_handbuch_52.md:9196',
  },
  {
    name: 'CODEBOOKTOTAL',
    description: '',
    syntax: 'CODEBOOKTOTAL = "text";',
    source: 'gesstabs_handbuch_52.md:9191',
  },
  {
    name: 'CODEBOOKVALUES',
    description:
      'In CODEBOOK 346s wird der Labelcode jeder Variablenauspr�gung als eigene Spalte ausgegeben.',
    source: 'gesstabs_handbuch_52.md:13601',
  },
  {
    name: 'CODEBOOKZEROLINES',
    description:
      'Bewirkt die Ausgabe gelabelter Codes in CODEBOOK 346s, auch wenn die H�ufigkeit null ist.',
    source: 'gesstabs_handbuch_52.md:13604',
  },
  {
    name: 'CODEINLABELS',
    description: '',
    syntax: 'CODEINLABELS = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5356',
  },
  {
    name: 'COLBINCRLF',
    description: '',
    syntax: 'COLBINCRLF = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:16371',
  },
  {
    name: 'COLBINFORMAT',
    description: '',
    syntax: 'COLBINFORMAT = <Colbinformatname>;',
    source: 'gesstabs_handbuch_52.md:16377',
  },
  {
    name: 'COLBININ',
    description: '',
    syntax: 'COLBININ <varname> = { | value < column : code }*n };',
    source: 'gesstabs_handbuch_52.md:16190',
  },
  {
    name: 'COLBININCOLS',
    description: '',
    syntax: 'COLBININCOLS = <value>;',
    source: 'gesstabs_handbuch_52.md:16211',
  },
  {
    name: 'COLBININFILE',
    description: '',
    syntax: 'COLBININFILE = <filename>;',
    source: 'gesstabs_handbuch_52.md:16183',
  },
  {
    name: 'COLBININSWAPPED',
    description: '',
    syntax: 'COLBININSWAPPED = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:16214',
  },
  {
    name: 'COLBINOUT',
    description: '',
    syntax: 'COLBINOUT <varlist> = <start> <width>\nBITGROUP [ 10 | 12 ];',
    source: 'gesstabs_handbuch_52.md:16305',
  },
  {
    name: 'COLBINOUTCOLS',
    description: '',
    syntax: 'COLBINOUTCOLS = <value>;',
    source: 'gesstabs_handbuch_52.md:16339',
  },
  {
    name: 'COLBINOUTSWAPPED',
    description: '',
    syntax: 'COLBINOUTSWAPPED = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:16365',
  },
  {
    name: 'COLCHIQU',
    description:
      'Spaltenweise 4-Felder Chi�-Test auf Prozentwertunterschied. Um die Chi�-Pr�fgr��e und den dazu passenden Signifikanzwert zu ermitteln, wird intern eine 4-Felder-Matrix bei jedem Paarvergleich generiert, bei der in der ersten Zeile die beobachteten, absoluten F�lle des gefragten Zellenpaars stehen und in der zweiten Zeile jeweils die Differenz dieser Werte zu den Totalwerten aus der Totalzeile der…',
    source: 'gesstabs_handbuch_52.md:11091',
  },
  {
    name: 'COLDEPTTEST',
    argsHint: '(Var)',
    description: 'Abh�ngiger t-Test auf Mittelwertsunterschiede',
    source: 'gesstabs_handbuch_52.md:11101',
  },
  {
    name: 'COLMEANINVRANK',
    argsHint: '( Var )',
    description:
      'F�r die Rangplatzberechnungen werden alle Zellen in einer Tabellenspalte miteinander verglichen und es wird ein Rangplatz berechnet, in diesem Fall f�r den MEAN. Identische MEANs bekommen identische R�nge. Zwei MEAN gelten als identsich, wenn sie dieselbe Druckausgabe ergeben, d.h. es kommt auch auf die verwendeten Formate an.…',
    source: 'gesstabs_handbuch_52.md:11062',
  },
  {
    name: 'COLMEANRANK',
    argsHint: '( Var )',
    description:
      'siehe COLMEANINVRANK, aber: der niedrigste Mittelwert bekommt hier den Rang 1',
    source: 'gesstabs_handbuch_52.md:11071',
  },
  {
    name: 'COLOR',
    description:
      'Brightness) oder dem RGB-Modell (Red-Green-Blue) ausgew�hlt. Symbolnummer 1 . . . 6',
    syntax:
      'COLOR [ FOREGROUND | BACKGROUND ] =\n{ |\n[ DATABOX <number> <number> CODE [ X | Y ] <number > ]\n<cellelement> RANGE <low> <high> = <number> <number> number> }*n\n;',
    source: 'gesstabs_handbuch_52.md:16536',
  },
  {
    name: 'COLORIFBASELESS',
    description: '',
    syntax:
      'COLORIFBASELESS <place> <test> <number> [ <cellelement> ] = <color>;\n<place> ::= [ FRAMECELL X | FRAMECELL X | DATACELL ]\n<test> ::= [ ABSOLUTE PHYSICALRECORDS VALIDN VALIDPHYS ]\n<number> ::= Schwellenwert, bei dessen Unterschreitung die Farbe ge�ndert werden soll\n<cellelement> ::= Das betroffene CELLELEMENT: wird diese Angabe weggelassen,',
    source: 'gesstabs_handbuch_52.md:14905',
  },
  {
    name: 'COLPCTBENCHMARK',
    description:
      'Zum Vergleich von Spaltenprozenten mit extern festgelegten Benchmarkwerten (siehe BENCHMARKVALUES 443)',
    source: 'gesstabs_handbuch_52.md:11103',
  },
  {
    name: 'COLPERCENTDELTA',
    description: 'Deltawerte (in Prozentpunkten) zum Wert in der Totalspalte',
    source: 'gesstabs_handbuch_52.md:10818',
  },
  {
    name: 'COLPERCENTINDEX',
    description:
      'Indexwerte zu den Spaltenprozenten (100 entspricht dem Wert in der Totalspalte)',
    source: 'gesstabs_handbuch_52.md:10821',
  },
  {
    name: 'COLPERCENTINVRANK',
    description:
      'Die Rangbildung basiert auf COLPERCENT, Die Regeln zur Identit�t gelten entsprechend. Der h�chste Wert bekommt dem niedrigsten Rang.',
    source: 'gesstabs_handbuch_52.md:11074',
  },
  {
    name: 'COLPERCENTIRANK',
    description:
      'siehe COLPERCENTINVRANK, aber der niedrigste Prozentwert bekommt den Rang 1',
    source: 'gesstabs_handbuch_52.md:11078',
  },
  {
    name: 'COLPERCENTLINELIMIT',
    description: '',
    syntax: 'COLPERCENTLINELIMIT = <number>;',
    source: 'gesstabs_handbuch_52.md:8961',
  },
  {
    name: 'COLPERCENTRANK',
    description:
      'nach dem Rangplatz des Prozentwerts in der Spalte, kleinster Wert = Rang 1',
    source: 'gesstabs_handbuch_52.md:12151',
  },
  {
    name: 'COLPERCEQUAL',
    description:
      'Testet alle Spaltenprozente in der Spalte auf Gleichheit; d.h. alle Abweichungen von der Ungleichverteilung werden als signifikant betrachtet. Hier besteht nat�rlich die M�glichkeit, sehr viele unsinnige Signifikanzen zu produzieren. Bitte mit Bedacht verwenden. COLPERCT* t-Test auf Prozentwertunterschiede: Test auf Basis von ESS 446 und Spalten�berlappung',
    source: 'gesstabs_handbuch_52.md:11106',
  },
  {
    name: 'COLPERCTMINIMUM',
    description: '',
    syntax: 'COLPERCTMINIMUM = <number>;',
    source: 'gesstabs_handbuch_52.md:11275',
  },
  {
    name: 'COLPERCZ',
    description:
      'Spaltenweiser Test der Unterschiede in den erweiterte Z-Test mit Arcus-Sinus-Korrektur benutzt',
    source: 'gesstabs_handbuch_52.md:11115',
  },
  {
    name: 'COLSUMPERCENT',
    argsHint: '( Var )',
    description:
      'Ausgabe der Spaltenprozentuierung der Summe einer dritten Variablen, z.B. die Summe von Ausgaben f�r einen bestimmten Zweck in bestimmten Stadtteilen etc.',
    source: 'gesstabs_handbuch_52.md:10824',
  },
  {
    name: 'COLUMNOFFSET',
    description: '',
    syntax: 'COLUMNOFFSET = <number> ;',
    source: 'gesstabs_handbuch_52.md:15977',
  },
  {
    name: 'COLUMNPERCENT100',
    description:
      'Nach Hare-Niemeyer-Modell modifizierte Spaltenprozentwerte (Summe ergibt 100), Achtung: nicht geeignet bspw. f�r Mehrfachnennungsvariablen und OVERCODEs, Tabellen mit unterdr�ckten MISSING VALUES und selektiv gebildete Variablen',
    source: 'gesstabs_handbuch_52.md:10831',
  },
  {
    name: 'COLUMNRANGE',
    description:
      'Ausgabe einer Tabelle mit den unteren und oberen R�ndern des Konfidenzintervalls (5%) von Spaltenprozenten COLUMNPERCENTRANGE* Konfidenzintervall f�r Spaltenprozente ROWPERCENTRANGE** Konfidenzintervall f�r Zeilenprozente',
    source: 'gesstabs_handbuch_52.md:10968',
  },
  {
    name: 'COLUMNS',
    description:
      '| "M�nner": geschl eq 1 : var=&2 | "Frauen": geschl eq 2 : var=&2 #endmacro Innerhalb der Tabelle wird das Macro dann f�nfmal aufgerufen:',
    source: 'gesstabs_handbuch_52.md:17134',
  },
  {
    name: 'COLUMNSTRIPES',
    description:
      'Ist dieses TABLEFORMAT gesetzt, werden die Spalten von Tabellen farblich hinterlegt, und zwar abwechselnd mit den Farben, die in STRIPECOLORS 559 vereinbart wurden.',
    source: 'gesstabs_handbuch_52.md:13607',
  },
  {
    name: 'COLUMNSUMMARY',
    description: '',
    syntax:
      'COLUMNSUMMARY <zielspalte> [ format "#,#..." ]\n= <function> [ <option>( {<quellspalte>}*n );\n<zielspalte> ::= < varno code >\n<quellspalte> ::= < varno code >\n<function> ::= [ MEAN | SUM | MIN | MAX ]\n<option> ::= [ ZEROMISSING | DASHMISSING ]',
    source: 'gesstabs_handbuch_52.md:8418',
  },
  {
    name: 'COMPRESSCODEBOOK',
    description: '',
    syntax: 'COMPRESSCODEBOOK = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15996',
  },
  {
    name: 'COMPUT',
    description: '',
    syntax: 'COMPUT <result> = <arithmetic_expressiom>;',
    source: 'gesstabs_handbuch_52.md:7508',
  },
  {
    name: 'COMPUTE',
    description:
      'Neuberechnung atomarer Variablen COMPUTE ADD Erg�nzende Speicherung definierter Werte COMPUTE ALPHA Verkn�pfung von String-Elementen COMPUTE ASCEND/DESCEND Sortierung der Werte (vor deren �bertrag in Zielvariable) COMPUTE CONCAT Verkettung von Labels und Textkonstanten COMPUTE COPY Kopieren von Variablenbereichen COMPUTE ELIMINATE L�schen einer definierten Wertemenge COMPUTE INIT �bertrag einer…',
    syntax: 'COMPUTE ADD <zielvar> = <varlist>;',
    source: 'gesstabs_handbuch_52.md:7464',
  },
  {
    name: 'CONCATCSS',
    description: '',
    syntax: 'CONCATCSS = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15084',
  },
  {
    name: 'CONCATFILTERTEXTS',
    description: '',
    syntax: 'CONCATFILTERTEXTS = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:8781',
  },
  {
    name: 'CONCATNUMTOSTR',
    description: '',
    syntax: 'CONCATNUMTOSTR <varlist> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:7673',
  },
  {
    name: 'CONDENSESPSSGROUP',
    description: '',
    syntax: 'CONDENSESPSSGROUP = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:7059',
  },
  {
    name: 'CONFIDENCERANGE',
    argsHint: '( Var )',
    description:
      'Ausgabe der Konfidenzintervalls einer zus�tzlichen Variablen (zwei Werte auf einer Zeile)',
    source: 'gesstabs_handbuch_52.md:10909',
  },
  {
    name: 'CONNECTEXCELCELLS',
    description: '',
    syntax: 'CONNECTEXCELCELLS <boxtype> : [YES|NO]',
    source: 'gesstabs_handbuch_52.md:2989',
  },
  {
    name: 'CONTENTFILE',
    description: '',
    syntax:
      'CONTENTFILE <option> = <filename>;\noption ::= [ TABLETITLE | TOPTEXT | BOTTOMTEXT | VARIABLES X\n| VARIABLES Y ] [ option ]',
    source: 'gesstabs_handbuch_52.md:15244',
  },
  {
    name: 'CONTENTKEY',
    description: '',
    syntax:
      'CONTENTKEY = [ <text> | TABLETITLE [ [ VARNAME | VARTEXT | VARTITLE ]\n<VARIABLE> ];',
    source: 'gesstabs_handbuch_52.md:15253',
  },
  {
    name: 'CONTENTKEYTOPDF',
    description: '',
    syntax: 'CONTENTKEYTOPDF = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15284',
  },
  {
    name: 'CONTENTPAGE',
    description: '',
    syntax:
      'CONTENTPAGE = YES\nUSEFONT <font>\n[ TITLE <�berschrift> USEFONT <font> ]\nMARGINS TOP <number> LEFT <number> BOTTOM <number>\nDISTANCE <number>\n;',
    source: 'gesstabs_handbuch_52.md:15228',
  },
  {
    name: 'COPYFILE',
    description: '',
    syntax: 'COPYFILE = <path>;',
    source: 'gesstabs_handbuch_52.md:15825',
  },
  {
    name: 'COPYLABELS',
    description: '',
    syntax:
      'COPYLABELS <Varlist> = <source-variable>;\nUSELABELS <Varlist> = <source-variable>;\n[VALUE]LABELS <Varlist> COPY <source-variable>;\n[VALUE]LABELS <Varlist> AS <source-variable>;',
    source: 'gesstabs_handbuch_52.md:5326',
  },
  {
    name: 'COPYTEXT',
    description: '',
    syntax: 'COPYTEXT <VarList> = <variable>;',
    source: 'gesstabs_handbuch_52.md:5268',
  },
  {
    name: 'COPYTITLE',
    description: '',
    syntax: 'COPYTITLE <VarList> = <variable>;',
    source: 'gesstabs_handbuch_52.md:5292',
  },
  {
    name: 'COUNT',
    description: '',
    syntax:
      'COUNT <varlist> = ( <varlist> ) [ <logop> <number>\nIN [ <number> : number ] ] ;',
    source: 'gesstabs_handbuch_52.md:7420',
  },
  {
    name: 'COUNTVALID',
    description: '',
    syntax: 'COUNTVALID <resultvars> = <varlist>;',
    source: 'gesstabs_handbuch_52.md:1274',
  },
  {
    name: 'CROSSVAR',
    description: '',
    syntax: 'CROSSVAR <newvar> = <var1> <var2> ;',
    source: 'gesstabs_handbuch_52.md:7330',
  },
  {
    name: 'CSSCLASS',
    description:
      'Vergabe einer CSS-Klasse f�r die HTML-Ausgabe, siehe Formatierung 584',
    source: 'gesstabs_handbuch_52.md:5657',
  },
  {
    name: 'CSVEXPORT',
    description: '',
    syntax:
      'CSVEXPORT = [ <filename> | "" ];\nImplementierung der guten alten Ausgabe von Tabellen im CSV-Format (HG=...). Alle',
    source: 'gesstabs_handbuch_52.md:15649',
  },
  {
    name: 'CSVINALPHA',
    description: '',
    syntax: 'CSVINALPHA = <namelist>;',
    source: 'gesstabs_handbuch_52.md:1897',
  },
  {
    name: 'CSVINFILE',
    description: '',
    syntax:
      'CSVINFILE [ FILEKEY <key> ] [ <delimchar> ] [ ALLOWEMPTY ]\n= <filepath>;',
    source: 'gesstabs_handbuch_52.md:1831',
  },
  {
    name: 'CSVINPROTOCOL',
    description: '',
    syntax: 'CSVINPROTOCOL = <filename>;',
    source: 'gesstabs_handbuch_52.md:1198',
  },
  {
    name: 'CSVOUTFILE',
    description: '',
    syntax:
      'CSVOUTFILE = <name>;\n<name> kann ein vollst�ndiger Pfad oder nur ein Dateiname sein. Die Datei-Extension wird',
    source: 'gesstabs_handbuch_52.md:1949',
  },
  {
    name: 'CSVSPECIAL',
    description: '',
    syntax: 'CSVSPECIAL = <filepath>;',
    source: 'gesstabs_handbuch_52.md:1997',
  },
  {
    name: 'CSVWEIGHT',
    description: '',
    syntax: 'CSVWEIGHT = <varname>;',
    source: 'gesstabs_handbuch_52.md:1974',
  },
  {
    name: 'CUMULATIVE',
    description: 'Zeilenweise prozentuiert und kumuliert',
    source: 'gesstabs_handbuch_52.md:10838',
  },
  {
    name: 'DASHMISSING',
    description: '',
    syntax: 'DASHMISSING = <char>;\nZEROMISSING = <char>;',
    source: 'gesstabs_handbuch_52.md:8459',
  },
  {
    name: 'DATA',
    description: '',
    syntax:
      'DATA [ USEWEIGHT <weightvar> ] <method> <newvar>\n= <basevar> [ BY <groupvar> ] ;',
    source: 'gesstabs_handbuch_52.md:8245',
  },
  {
    name: 'DATABOX',
    description:
      'Kasten um alle DATACELLS, die zur Kreuzung jeweils zweier Variablen geh�ren.',
    source: 'gesstabs_handbuch_52.md:14041',
  },
  {
    name: 'DATACELL',
    description: 'Jede einzelne Datenzelle der Tabelle',
    source: 'gesstabs_handbuch_52.md:14049',
  },
  {
    name: 'DATAERRORDOCUMENTATION',
    description:
      'ERRORTYPE EXCEPT NUMERIC FILTER VARIABLES EXCEPT numtest y1 to y11 = filename; In diesem Fall w�rden alle Variablen gepr�ft, die aus dem Input gelesen werden, bis auf "numtest" und die Variablen y1 bis y11. Es w�rden alle ERRORTYPE gepr�ft bis auf NUMERIC und FILTER, d.h. die Pr�fung erstreckt sich inhaltlich auf LABELS RANGE und ALIGN.',
    syntax:
      'DATAERRORDOCUMENTATION [ VARIABLES <varlist> ]\n[errortype {<errortype>}*n ] = <filename>;\nerrortype ::= LABELS | RANGE | FILTER | NUMERIC | ALIGN',
    source: 'gesstabs_handbuch_52.md:15813',
  },
  {
    name: 'DATAFILE',
    description: '',
    syntax:
      'DATAFILE [ FILEKEY <key> ] [ ALLOWEMPTY ] = <filepath>;\nINFILE [ FILEKEY <key> ] [ ALLOWEMPTY ] = <filepath>;',
    source: 'gesstabs_handbuch_52.md:15669',
  },
  {
    name: 'DATANOINTERPOL',
    description: '',
    syntax: 'DATANOINTERPOL = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:8303',
  },
  {
    name: 'DATE',
    description:
      'aktuelles Datum in der Form YYYYMMDD als Zahl CurrentMillis aktueller Zeitpunkt in Millisekunden',
    source: 'gesstabs_handbuch_52.md:7559',
  },
  {
    name: 'DATEFORMAT',
    description: '',
    syntax: 'DATEFORMAT = <string>;',
    source: 'gesstabs_handbuch_52.md:14621',
  },
  {
    name: 'DAYOFWEEK',
    description:
      'Der Wochentag eines Datums in der Form JJJJMMTT: 1=Montag, 2=Dienstag etc., also ist z.B. DAYOFWEEK( 20061030 ) = 1. WeekOfYear(x) Wochennummer (Kalenderwoche)',
    source: 'gesstabs_handbuch_52.md:7554',
  },
  {
    name: 'DBASEIN',
    description: '',
    syntax: 'DBASEIN = <filename>;',
    source: 'gesstabs_handbuch_52.md:16167',
  },
  {
    name: 'DECIMALPERCENT',
    description: '',
    syntax: 'DECIMALPERCENT = <number>;\nVoreinstellung: DECIMALPERCENT = 0;',
    source: 'gesstabs_handbuch_52.md:14658',
  },
  {
    name: 'DECIMALS',
    description: '',
    syntax: 'DECIMALS = <number>;\nDefault: DECIMALS = 0;',
    source: 'gesstabs_handbuch_52.md:14645',
  },
  {
    name: 'DEFAULTLEVEL',
    description: '',
    syntax: 'DEFAULTLEVEL = <number>;',
    source: 'gesstabs_handbuch_52.md:590',
  },
  {
    name: 'DELTAEXPECT',
    description:
      'Ausgabe der Differenz zwischen der empirischen Zellenbesetzung und der nach der Randverteilung zu erwartenden Zellenbesetzung',
    source: 'gesstabs_handbuch_52.md:10794',
  },
  {
    name: 'DELTAPERCENT',
    argsHint: '( Var, BasisVar )',
    description:
      "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Differenz wird auf die 'BasisVar' prozentuiert.",
    source: 'gesstabs_handbuch_52.md:10840',
  },
  {
    name: 'DELTAPOINTS',
    argsHint: '( Var, BasisVar )',
    description:
      "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Differenz wird auf die Zahl der g�ltigen F�lle prozentuiert Name Beschreibung",
    source: 'gesstabs_handbuch_52.md:10844',
  },
  {
    name: 'DELTASUMPERCENT',
    argsHint: '( VarFamily )',
    description:
      'Die VarFamily 274 muss vier Einzelvariablen enthalten. Diese bezeichnen jeweils Z�hler und Nenner eines Bruches. �ber Z�hler und Nennen werden die Summen berechnet, und bei der Ausgabe wird die Differenz der Quotienten als Prozentwert ausgegeben.',
    source: 'gesstabs_handbuch_52.md:10852',
  },
  {
    name: 'DESCRIPTION',
    description:
      '�nderung der Standardtexte zur Erkl�rung des Zelleninhalts in Kreuztabellen 355.',
    syntax: 'DESCRIPTION [ CELLELEMENT ] = <text>;',
    source: 'gesstabs_handbuch_52.md:13425',
  },
  {
    name: 'DESCRIPTIONSTRING',
    description: '',
    syntax: 'DESCRIPTIONSTRING = "<DESCRIPTION 1>|...|<DESCRIPTION n>";',
    source: 'gesstabs_handbuch_52.md:13110',
  },
  {
    name: 'DICHOQ',
    description: '',
    syntax: 'DICHOQ <varname> =',
    source: 'gesstabs_handbuch_52.md:5887',
  },
  {
    name: 'DISTANCE',
    description: '',
    syntax: 'DISTANCE INTERBOX [ X | Y ] <number> = <Zahl>;',
    source: 'gesstabs_handbuch_52.md:14229',
  },
  {
    name: 'DIV',
    description: 'liefert das Ergebnis einer Integer-Division',
    source: 'gesstabs_handbuch_52.md:7575',
  },
  {
    name: 'DOCUMENT',
    description:
      'Angabe einer Dokumentkennzeichnung, die rechts unten unter den Tabellen erscheint',
    syntax: 'DOCUMENT = "<text>";',
    source: 'gesstabs_handbuch_52.md:13192',
  },
  {
    name: 'DOUBLECODEINOVERCODE',
    description: '',
    syntax: 'DOUBLECODEINOVERCODE = [YES | NO];',
    source: 'gesstabs_handbuch_52.md:6837',
  },
  {
    name: 'DRAWBOX',
    description: '',
    syntax:
      'DRAWBOX [<boxtype>] : [WEIGHT [THIN|MEDIUM|BOLD]]\n[COLOR <color>][BORDERS [TOP|LEFT|BOTTOM|RIGHT]]',
    source: 'gesstabs_handbuch_52.md:2974',
  },
  {
    name: 'DUMMYHEAD',
    description: '',
    syntax: 'DUMMYHEAD = <varname>',
    source: 'gesstabs_handbuch_52.md:10113',
  },
  {
    name: 'ELASTICITY',
    description: '',
    syntax: 'ELASTICITY = <number>;',
    source: 'gesstabs_handbuch_52.md:13940',
  },
  {
    name: 'ELEMENTFONT',
    description: '',
    syntax:
      'ELEMENTFONT <cellelement> : <fontname> SIZE <number>\n[STYLE [BOLD|ITALIC|UNDERLINE]]\nELEMENTCOLOR <cellelement> : <color>',
    source: 'gesstabs_handbuch_52.md:2950',
  },
  {
    name: 'ELLIPSIS',
    description: 'Konfidenzintervall als Ellipse anzeigen (wenn bekannt)',
    source: 'gesstabs_handbuch_52.md:4972',
  },
  {
    name: 'ELSE',
    description:
      "CONCAT neue = 'xx' '-' 'yy' '-' xx1 '-' x5; �bersichtlicher ist oft die Verwendung von IFBLOCK/ELSEBLOCK/ENDBLOCK anstelle von IF/ELSE: IFBLOCK [ 2 3 ] IN x7 THEN COMPUTE CONCAT neue = 'aa' '-' 'bb' '-' xx1 '-' x5; COMPUTE SUBSTR PART = neue 1 20;",
    source: 'gesstabs_handbuch_52.md:7661',
  },
  {
    name: 'ELSEBLOCK',
    description:
      '//hier k�nnen mehrere computes/ifs etc stehen ENDBLOCK; Die Komponente ELSEBLOCK ist optional. Von dieser Logik betroffen sind: alle COMPUTE 286s, alle Formen von IF (IF ... THEN 302, IF ... PRINT 48, IF ... LOAD 306) alle RECODE 254s, COUNT 285 und MEAN 312. Alle �brigen Statements ignorieren die IFBLOCK-Anweisungen. Mehrere IFBLOCKs k�nnen ineinander geschachtelt werden.…',
    source: 'gesstabs_handbuch_52.md:8104',
  },
  {
    name: 'EMPTYSIGNDASH',
    description:
      "Im Normalfall wird in F�llen, wo alle Signifikanztests gegen alle Spalten bzw. Zeilen fehlgeschlagen sind, nichts ausgegeben. Da kann bei einem vertikalen Alignment (ALIGN VCENTER 554) zu unerw�nschter Optik f�hren. Ist dies TABLEFORMAT gesetzt, wird in diesen F�lle ein '-' ausgegeben, damit alle Elemente auf derselben H�he stehen.",
    source: 'gesstabs_handbuch_52.md:13611',
  },
  {
    name: 'EMPTYTABLETEXT',
    description: '',
    syntax: 'EMPTYTABLETEXT = �<text>�;',
    source: 'gesstabs_handbuch_52.md:8943',
  },
  {
    name: 'ENCODING',
    description: '',
    syntax: 'ENCODING CSVOUTFILE = [ ANSI | UTF8 ];',
    source: 'gesstabs_handbuch_52.md:1981',
  },
  {
    name: 'END',
    description: '',
    syntax: 'END;',
    source: 'gesstabs_handbuch_52.md:540',
  },
  {
    name: 'ENDMACRO',
    description:
      'Dann w�rde der Aufruf von #tab( var1 ) ebenso funktionieren wie der Aufruf von #tab( var1 var2 var3 var4 ) #IfExist und #IfNExist Mit #IFEXIST und #IFNEXIST kann man abfragen, ob eine Variable dieses Namens bereits existiert. Anwendungsbeispiele Ein Include-File mit dem Namen "SETPAPER.INC" k�nnte z.B. folgende Anweisungen enthalten: #IFDEF A4 #IFDEF quer PAPER = Height 210 Width 297;',
    source: 'gesstabs_handbuch_52.md:924',
  },
  {
    name: 'ENFORCEUTF8INOPENQFILE',
    description: '',
    syntax: 'ENFORCEUTF8INOPENQFILE = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:6091',
  },
  {
    name: 'EQ',
    description: 'Equal, ist gleich',
    source: 'gesstabs_handbuch_52.md:7882',
  },
  {
    name: 'ESSCOLCHIQU',
    description:
      'Spaltenweise 4-Felder Chi�-Test auf Prozentwertunterschied nach Umrechnung aus ESS 446',
    source: 'gesstabs_handbuch_52.md:11118',
  },
  {
    name: 'ESSCOLDEPTTEST',
    description:
      'Abh�ngiger t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS 446 Name Beschreibung',
    source: 'gesstabs_handbuch_52.md:11121',
  },
  {
    name: 'ESSMCNEMAR',
    description:
      'Abh�ngiger Test auf Prozentwertunterschied nach McNemar 449 nach Umrechnung auf ESS 446',
    source: 'gesstabs_handbuch_52.md:11128',
  },
  {
    name: 'ESSROWCHIQU',
    description: 'Zeilenweiser Chi�-Test auf Basis der ESS 446-Umrechnung',
    source: 'gesstabs_handbuch_52.md:11131',
  },
  {
    name: 'ESSROWTTEST',
    description:
      'Unabh�ngiger t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS 446, zeilenweise',
    source: 'gesstabs_handbuch_52.md:11133',
  },
  {
    name: 'ESSTTEST',
    argsHint: '(Var)',
    description:
      'Unabh�ngiger t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS 446',
    source: 'gesstabs_handbuch_52.md:11136',
  },
  {
    name: 'ESSWELCHTEST',
    description:
      'Unabh�ngiger Welch 450�s t-Test auf Mittelwertsunterschiede nach Umrechnung auf ESS 446',
    source: 'gesstabs_handbuch_52.md:11139',
  },
  {
    name: 'EST',
    description:
      '|                | MEANTEST | PHYSMEANTE |            | ESSMEANTEST |             | | -------------- | -------- | ---------- | ---------- | ----------- | ----------- | | kombiniert mit |          |            | XMEANTEST  |             | HYMEANTEST  |',
    source: 'gesstabs_handbuch_52.md:11554',
  },
  {
    name: 'EVALFAMVALONCE',
    description: '',
    syntax: 'EVALFAMVALONCE <Varlist> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:7346',
  },
  {
    name: 'EXCELDOCUMENT',
    description:
      'Kennzeichnung des Tabellenbandes in Excel �bertragen. Wenn dies TABLEFORMAT gesetzt ist, werden Zahlen mit Nachkommastellen explizit auf die Zahl der Nachkommastellen',
    source: 'gesstabs_handbuch_52.md:15513',
  },
  {
    name: 'EXCELFILENAME',
    description: '',
    syntax: 'EXCELFILENAME = <dateiname>;',
    source: 'gesstabs_handbuch_52.md:15479',
  },
  {
    name: 'EXCELHIDEUPDATE',
    description: '',
    syntax: 'EXCELHIDEUPDATE = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15547',
  },
  {
    name: 'EXCELNOFONT',
    description:
      'tr�gt dies zur Performance bei. dies gilt auch bei OPENOFFICEDEVIATION. Wenn dies TABLEFORMAT gesetzt ist, wird die DOCUMENT-',
    source: 'gesstabs_handbuch_52.md:15509',
  },
  {
    name: 'EXCELNUMBERFORMAT',
    description:
      'formatiert, und damit die Automatik von Excel umgangen, Nullen als Nachkommastellen zu tilgen. EXCELFRAMES Rahmen um die Excel-Tabelle EXCELCOLOR �bernahme von COLOR FOREGROUND bzw. BACKGROUND EXCELALIGN[H/V] �bernahme horizontales/ vertikales Alignment der Zellen EXCELPAGEBREAK generiert einen Seitenwechsel am Ende der Tabelle EXCELHEADER �bernahme eines HEADER nach Excel Bewirkt, dass…',
    source: 'gesstabs_handbuch_52.md:15517',
  },
  {
    name: 'EXCELOUTACROSS',
    description:
      'Die atomaren Elemente von zusammengesetzten CELLELEMENTS werden bei EXCELOUT 605 nicht untereinander, sondern nebeneinander dargestellt.',
    source: 'gesstabs_handbuch_52.md:13618',
  },
  {
    name: 'EXCELRANGEDELIM',
    description: '',
    syntax: 'EXCELRANGEDELIM = <char>;',
    source: 'gesstabs_handbuch_52.md:15553',
  },
  {
    name: 'EXCELSTYLEFILE',
    description: '',
    syntax: 'EXCELSTYLEFILE = <filename>;',
    source: 'gesstabs_handbuch_52.md:15640',
  },
  {
    name: 'EXCLUDEVALUES',
    description: '',
    syntax:
      'EXCLUDEVALUES <varlist> = <valuelist>;\nRESTRICTVALUES <varlist> = <valuelist>;',
    source: 'gesstabs_handbuch_52.md:6388',
  },
  {
    name: 'EXP',
    description: 'inverse Funktion zu LN',
    source: 'gesstabs_handbuch_52.md:7530',
  },
  {
    name: 'EXPANDBOX',
    description:
      'Das TABLEFORMAT EXPANDBOX wird intern in EXPANDHEIGHT 537 �bersetzt. Also: TABLEFORMAT = + EXPANDBOX; bedeutet, dass die H�he der Zellen erweitert werden soll.',
    source: 'gesstabs_handbuch_52.md:13622',
  },
  {
    name: 'EXPANDHEIGHT',
    description:
      'Zeichnet man mit DRAWBOX 552 einen gemeinsamen Block um die Datenzellen, sieht es h�ufig besser aus, wenn vor der ersten und nach der letzten Datenzeile ein vertikaler Zwischenraum zum oberen und unteren Rand geschaffen wird. Diesen Rand kann man mit EXPANDHEIGHT anfordern; zu beachten ist, dass dann die DATABOX nicht deckungsgleich ist mit der Summe der DATACELLs.…',
    source: 'gesstabs_handbuch_52.md:13633',
  },
  {
    name: 'EXPANDINDOMACRO',
    description: '',
    syntax: 'EXPANDINDOMACRO = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:818',
  },
  {
    name: 'EXPANDMISSINGTEXT',
    description: '',
    syntax: 'EXPANDMISSINGTEXT = <string>;',
    source: 'gesstabs_handbuch_52.md:6245',
  },
  {
    name: 'EXPECT',
    description:
      'Ausgabe der nach der Randverteilung zu erwartenden Zellenbesetzung',
    source: 'gesstabs_handbuch_52.md:10799',
  },
  {
    name: 'EXPORTFILE',
    description: '',
    syntax: 'EXPORTFILE = [ <filename> | "" ];',
    source: 'gesstabs_handbuch_52.md:16806',
  },
  {
    name: 'EXTREME',
    description:
      'der Verteilung (EXTREME) k�nnen selektiert werden. Beispiele: TABLE = a MEAN( b ) BY c SORT MEAN PANE 2 EXTREME 20; // jeweils 20 von jedem Ende der Verteilung TABLE = a BY c SORT ABSOLUTE TOP 80; // die obersten 80',
    source: 'gesstabs_handbuch_52.md:9967',
  },
  {
    name: 'FALLING',
    description:
      'gegenl�ufige Skalen | HORIZONTAL | VERTICAL ] ] Kombination HORIZONTAL/VERTICAL XY-Plot [ COLOR <$rrggbb> ] Hexadezimaler RGB-Wert [ LINECOLOR < $rrggbb > ] [ NUMINGRAPH | NUMEXGRAPH | Numerische Beschriftung eines grafischen NUMCENTERGRAPH ] Elements innerhalb bzw, au�erhalb der Grafik oder in ihr zentriert [ AXISMINMAX <minval> <maxval> Vorbelegung der Skala mit Extremwerten ]',
    source: 'gesstabs_handbuch_52.md:4726',
  },
  {
    name: 'FCOMPUTE',
    description: '',
    syntax: 'FCOMPUTE <varname> ....',
    source: 'gesstabs_handbuch_52.md:7594',
  },
  {
    name: 'FILEPATH',
    description: '',
    syntax: 'FILEPATH "<filepath>"',
    source: 'gesstabs_handbuch_52.md:3236',
  },
  {
    name: 'FILTER',
    description:
      'Im Anschluss an jedes Tabellenelement k�nnen mit FILTER <Bedingung> | lokale Selektionen 330 vorgenommen werden, zum Beispiel: TABLE = V1 FILTER geschl EQ 1 | V1 FILTER geschl EQ 2 | BY V1 MEANTEST; SORT SORT [ DESCEND ] [ POSITION | ALPHA | CODE | Cellelement ] [ PANE <value> CODE <value> ] :…',
    syntax: 'FILTER <varlist> [ = <Bedingung> | AS <varname> ] ;',
    source: 'gesstabs_handbuch_52.md:9946',
  },
  {
    name: 'FIRSTCOLUMN',
    description: '',
    syntax: 'FIRSTCOLUMN : <number>',
    source: 'gesstabs_handbuch_52.md:2944',
  },
  {
    name: 'FIXEDPOSITION',
    description: '',
    syntax: 'FIXEDPOSITION <VarList> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:16811',
  },
  {
    name: 'FIXLABELCOLUMN',
    description: '',
    syntax: 'FIXLABELCOLUMN : [YES|NO]',
    source: 'gesstabs_handbuch_52.md:3034',
  },
  {
    name: 'FIXLABELROWS',
    description: '',
    syntax:
      'FIXLABELROWS : <number>\nFIXLABELROWS wird den <number> Zeilen-Teil der Tabelle "fix" halten, sodass diese sichtbar',
    source: 'gesstabs_handbuch_52.md:3040',
  },
  {
    name: 'FLOWTEXT',
    description: '',
    syntax: 'FLOWTEXT <boxname> : [ YES | NO ]',
    source: 'gesstabs_handbuch_52.md:3024',
  },
  {
    name: 'FOOTER',
    description: '',
    syntax: 'FOOTER = "<text>" [ LEFT | HCENTER | RIGHT ] ;',
    source: 'gesstabs_handbuch_52.md:13217',
  },
  {
    name: 'FOOTERBOX',
    description:
      'Kasten um den FOOTER 522, au�erhalb der Tabelle FRAMEBOX X Kasten um alle FRAMECELL X FRAMEBOX Y Kasten um alle FRAMECELL Y FRAMECELL X Kasten um einzelne Datenelemente der Rahmenspalten (Elemente der X-Achse) FRAMECELL Y Kasten um einzelne Datenelemente der Rahmenzeilen (Elemente der Y-Achse)',
    source: 'gesstabs_handbuch_52.md:14055',
  },
  {
    name: 'FORCOUNTS',
    description:
      'Variable ist vorrangig zur H�ufigkeitsausz�hlung (Tabellenaufriss) sinnvoll.',
    syntax:
      'FORCOUNTS <varname> = [ YES | NO ];\nFORHEADER <varname> = [ YES | NO ];\nFORMEANS <varname> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:18126',
  },
  {
    name: 'FOREGROUND',
    description:
      'Farbinformation 557 f�r Vordergrund (Schrift) und Hintergrund',
    source: 'gesstabs_handbuch_52.md:5634',
  },
  {
    name: 'FOREHEADER',
    description: 'Variable soll bevorzugt im Tabellenkopf dargestellt werden.',
    source: 'gesstabs_handbuch_52.md:18128',
  },
  {
    name: 'FORM',
    description:
      'verwendet werden. [ RECTANGLE | LINE | RECTLINE | TRIANGLE1 | TRIANGLE1O | | TRIANGLE2 | TRIANGLE2O | SQUARE1 | SQUARE1O | SQUARE2 | SQUARE2O | CIRCLE | CIRCLEO | ELLIPSIS | GAUSS | GAUSSO ] ] [ PIE | PIE100 ] [ XYPLOT ] }*n [ DIRECTION [ RISING | Kombination RISING/FALLING',
    syntax: 'FORM : [BARS | COLUMNS | LINES | PIE]',
    source: 'gesstabs_handbuch_52.md:4710',
  },
  {
    name: 'FORMAT',
    description: '',
    syntax: 'FORMAT = "<formatstring>";',
    source: 'gesstabs_handbuch_52.md:14512',
  },
  {
    name: 'FORMATIFLESS',
    description: '',
    syntax:
      'FORMATIFLESS <cellelement> [ IN <place> ] BY <typ> <number> = <formatstring>;\ntyp ::= < ABSOLUTE | PHYSICALRECORDS | VALIDN | ESS >\nplace ::= < DATACELL | FRAMECELL X | FRAMECELL Y >',
    source: 'gesstabs_handbuch_52.md:14931',
  },
  {
    name: 'FORMEANS',
    description:
      'Variable eignet sich f�r numerische Statistiken. Syntax LiveTabs F�r die Weiterverarbeitung von Datens�tzen in GESS LiveTabs ist es notwendig, dass die speziellen Variableneigenschaften f�r GESS LiveTabs auch im SYNTAX-Include-File weitergegeben werden. Hierzu dient das LIVETABS-Argument f�r das SYNTAX 42 -Statement.',
    source: 'gesstabs_handbuch_52.md:18130',
  },
  {
    name: 'FRAMECOLOR',
    description: '',
    syntax: 'FRAMECOLOR : <color>',
    source: 'gesstabs_handbuch_52.md:3527',
  },
  {
    name: 'FRAMECROSS',
    description:
      'Der Schnittpunkt von FRAMEBOX X und FRAMEBOX Y FRAMETITLE X Kasten um Bezeichnung von FRAMEELEMENTS der X-Achse (z.B. Insgesamt) FRAMETITLE Y Kasten um Bezeichnung von FRAMEELEMENTS der Y-Achse (z.B. Insgesamt) FRAMETITLEBOX X Kasten um alle FRAMETITLE-Boxes der X-Achse FRAMETITLEBOX Y Kasten um alle FRAMETITLE-Boxes der Y-Achse',
    source: 'gesstabs_handbuch_52.md:14067',
  },
  {
    name: 'FRAMEELEMENTS',
    description: '',
    syntax:
      'FRAMEELEMENTS = [ ABSCOLUMN | ABSROW | PHYSICALCOLUMN\n| PHYSICALROW | TOTALCOLUMN | TOTALROW ] ;',
    source: 'gesstabs_handbuch_52.md:10714',
  },
  {
    name: 'GAUSS',
    description: 'Konfidenzintervall als stilisierte Gausskurve anzeigen',
    source: 'gesstabs_handbuch_52.md:4975',
  },
  {
    name: 'GAUSSO',
    description:
      'Konfidenzintervall als stilisierte Gausskurve anzeigen (outline)',
    source: 'gesstabs_handbuch_52.md:4978',
  },
  {
    name: 'GENERATELABELS',
    description: '',
    syntax: 'GENERATELABELS <varname>;',
    source: 'gesstabs_handbuch_52.md:7169',
  },
  {
    name: 'GEOMETRICMEAN',
    argsHint: '( Var )',
    description:
      'Das geometrische Mittel ist die n.-Wurzel aus dem Produkt aller Einzelwerte (nur f�r positive Zahlen definiert)',
    source: 'gesstabs_handbuch_52.md:10912',
  },
  {
    name: 'GESSCHART',
    description:
      'GESStabs Artist ist ab Version 4.3.0.0 integrierter Bestandteil von GESStabs. Das Schlüsselwort zum Aufruf lautet GESSCHART. Syntaktisch ist GESSCHART eine Option zum TABLE-Statement. Mit GESSCHART-Statements kann man im Anschluss an ein TABLE-Statement die Anfertigung von Charts anfordern, die sich inhaltlich aus ausgewählten Werten und Texten der Tabelle zusammensetzen.…',
    source: 'GESStabs_GESStabs-Artist.md:29',
  },
  {
    name: 'GESSCHARTCOLORS',
    description:
      'der erste Farbwert der definierten ausgewählt werden. Anstelle eines Grüntons sollen die Säulen blau eingefärbt werden, die erste Position des bestehenden Farbschemas wird | ausgetauscht    | und anschließend |              | das Chart angefordert:…',
    syntax: 'GESSCHARTCOLORS = { <colorvalue> }*n ;\n<colorvalue> = $rrggbb',
    source: 'GESStabs_GESStabs-Artist.md:867',
  },
  {
    name: 'GESSCHARTFORMAT',
    description: '',
    syntax: 'GESSCHARTFORMAT = { + | - <option> }*n ;',
    source: 'GESStabs_GESStabs-Artist.md:825',
  },
  {
    name: 'GESSCHARTNUMFORMAT',
    description: '',
    syntax:
      "GESSCHARTNUMFORMAT = <formatstring>;\nDefault: GESSCHARTNUMFORMAT =' (#)';",
    source: 'gesstabs_handbuch_52.md:5037',
  },
  {
    name: 'GESSCHARTPRINTFILE',
    description: '',
    syntax: 'GESSCHARTPRINTFILE [ PS | PDF ] = <filename>;',
    source: 'GESStabs_GESStabs-Artist.md:817',
  },
  {
    name: 'GLOBALASALPHA',
    description: '',
    syntax: 'GLOBALASALPHA = [ YES | NO ];\nGLOBALOPENASALPHA = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5407',
  },
  {
    name: 'GLOBALSORT',
    description:
      'Normalerweise wirkt ein SORT 462-Schl�sselwort im TABLE 355- Statement nur auf die direkt vorangehende Dimension einer Tabelle angewandt, also z.B. nur die Auspr�gungen einer Variable.Mit GLOBALSORT wird der Wirkungsbereich von SORT auf die gesamte Tabelle ausgedehnt. Dies ist vor allem bei Mittelwerttabellen etc. sinnvoll.',
    source: 'gesstabs_handbuch_52.md:13641',
  },
  {
    name: 'GRAPHAREA',
    description: '',
    syntax: 'GRAPHAREA = <x> <y> <width> <height> ;',
    source: 'GESStabs_GESStabs-Artist.md:809',
  },
  {
    name: 'GRAPHBOX',
    description:
      'Kasten mit der Liniengraphik in PROFILE 637-Tabellen | HEADERBOX | Kasten um den HEADER |     |     |     | | --------- | -------------------- | --- | --- | --- | 516, au�erhalb der Tabelle | INSTITUTION | Kasten um die INSTITUTION |     | 520-Angabe |     | | ----------- | ------------------------- | --- | ---------- | --- | LABELS X |     | VALUELABELS | 211 auf der X-Achse |     |     | | ---…',
    source: 'gesstabs_handbuch_52.md:14085',
  },
  {
    name: 'GROUPCOUNTS',
    description: '',
    syntax: 'GROUPCOUNTS <Varlist> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:7089',
  },
  {
    name: 'GROUPRECODE',
    description: '',
    syntax:
      'GROUPRECODE <recode> { / <recode> }*n [ ELSE = <number> ] ;\n<recode> ::= <valuelist> = < number >\n< valuelist > ::= [ <number> | <number> : <number> | <valuelist>',
    source: 'gesstabs_handbuch_52.md:6575',
  },
  {
    name: 'GROUPS',
    description: '',
    syntax:
      'GROUPS <Varname> = { | "Labeltext ..."\n[ LEVELLEVEL <number> ]\n[ USEFONT <Fontname> [ SIZE <number> ] ]\n[ CELLELEMENTS ( { <cellelement> }*n ) ]\n: <log. Bedingung> }*n ;',
    source: 'gesstabs_handbuch_52.md:6895',
  },
  {
    name: 'GT',
    description: 'Greater Then, gr��er als',
    source: 'gesstabs_handbuch_52.md:7886',
  },
  {
    name: 'HARMONICMEAN',
    argsHint: '( Var )',
    description:
      'Das harmonische Mittel: Kehrwert aus dem Mittelwert der Kehrwerte (nur f�r positive Zahlen definiert). Findet in Name Beschreibung speziellen F�llen Anwendung, z.B. als Mittelwert �ber Geschwindigkeiten etc.',
    source: 'gesstabs_handbuch_52.md:10915',
  },
  {
    name: 'HEADER',
    description:
      'VARIABLE a1 : v1 = a2 ; ist die XTAB-Version des ganz einfachen TABLE-Statements: TABLE = a1 BY a2; Die Anweisung sieht vor allem deshalb etwas umst�ndlich aus, weil die Variable a2 �ber ein internes Konstrukt, eine lokale Tabellenvariable (v1), �bergeben wird, die vorher am Anschluss an das ROWS-Schl�sselwort vereinbart wird.…',
    syntax: 'HEADER = "<text>" [ LEFT | HCENTER | RIGHT ] ;',
    source: 'gesstabs_handbuch_52.md:17070',
  },
  {
    name: 'HIDDEN',
    argsHint: '( <medium> )',
    description:
      '] parts ::= part { part }*n part ::= content [ filter ] [ option ] content ::= [ <constant> | <varname> | <cellelement> ( <varname> [ <varname> ] ) | <cellelement> ( <varname> [ <varname> ] BY <varname> ) :DESCRIPTION :USEVARTITLE :FORMAT ] filter ::= FILTER <bedingung> | option ::= SORT sortcontent [ sortpane ] [ cut ] sortcontent ::= [ DESCEND ] sorttype sorttype ::= [ POSITION | ALPHA | CODE |…',
    source: 'gesstabs_handbuch_52.md:9806',
  },
  {
    name: 'HIDDENTOVARLIST',
    description: '',
    syntax: 'HIDDENTOVARLIST = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5953',
  },
  {
    name: 'HISTORY',
    description: '',
    syntax:
      'HISTORY =[ DATABOX <x> <y> ] FORMAT ( <Formatliste> )\nDATA [ Absliste ] { <number> : <Datenliste> }*n ;\nFormatliste ::= [ ABSROW | ABSCOLUMN | PHYSROW PHYSCOLUMN TOTALROW ]\n{ <number> }*n\nAbsliste ::= { <number> }*n\nDatenliste ::= [ <number> | ] { <string> }*n',
    source: 'gesstabs_handbuch_52.md:10211',
  },
  {
    name: 'HTML',
    description: '',
    syntax:
      'HTML = [ <filename> | "" ];\nEs wird eine HTML-Version der betreffenden Tabellen in der Datei <filename>.html abgelegt.',
    source: 'gesstabs_handbuch_52.md:2694',
  },
  {
    name: 'HTML2EXCELDECCHAR',
    description: '',
    syntax: "HTML2EXCELDECCHAR = <char>;\n<char> = '.' | ','",
    source: 'gesstabs_handbuch_52.md:15614',
  },
  {
    name: 'HTML2EXCELFLOWTEXT',
    description: '',
    syntax: 'HTML2EXCELFLOWTEXT <boxtype> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15624',
  },
  {
    name: 'HTMLCHART',
    description:
      'TITLE "alle zellen ohne overcodes, absolute" FORM COLUMNS OPTION STACKED CELLELEMENT ABSOLUTE = | COLUMNS 2/1:5 3/1:5 | ROWS POSITION 1:5 ; Technische Voraussetzung Die Charts in der GESStabs HTML-Ausgabe beruhen auf der externen Bibliothek \'Charts.min.js\'. Diese kann �ber die URL https://cdn.jsdelivr.net/npm/chart.js@2.8.0 im Internet eingebunden werden. Dies ist bislang das Standard-Verhalten.…',
    syntax:
      'HTMLCHART <options> = <cells>;\n<options> ::= [ TITLE <string> | FORM <form> | OPTION STACKED\n| LINETENSION <number> | HTMLCHARTWIDTH = <number>;\n| WIDTH <number> | CELLELEMENT <cellelement>\n| LEGENDPOSITION [ LEFT | RIGHT | TOP | BOTTOM ] ] [ INVERSE ]\n<cells> ::= [ | ROWS <rows> ] [ | COLUMNS <columns> ]',
    source: 'gesstabs_handbuch_52.md:5127',
  },
  {
    name: 'HTMLDOCUMENT',
    description:
      '�bertr�gt die Informationen der DOCUMENT 521-Box in die HTML-Ausgabe.',
    source: 'gesstabs_handbuch_52.md:13648',
  },
  {
    name: 'HTMLFLOWTEXT',
    description: '',
    syntax: 'HTMLFLOWTEXT <boxtype> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15136',
  },
  {
    name: 'HTMLFOOTER',
    description:
      '�bertr�gt die Informationen der FOOTER 522-Box in die HTML- Ausgabe.',
    source: 'gesstabs_handbuch_52.md:13651',
  },
  {
    name: 'HTMLHEADER',
    description:
      '�bertr�gt die Informationen der HEADER 516-Box in die HTML- Ausgabe.',
    source: 'gesstabs_handbuch_52.md:13654',
  },
  {
    name: 'HYCOLCHIQU',
    description: 'Hybrider 447 Chi�-Test (gewichtet und ungewichtet)',
    source: 'gesstabs_handbuch_52.md:11142',
  },
  {
    name: 'HYCOLDEPTTEST',
    description:
      'Hybrid 447 ausgestalteter t-Test f�r abh�ngige Daten. Der t- ( Var ) Wert wird auf der Basis der gewichteten Daten ermittelt, der t- Test erfolgt auf der Basis der ungewichteten Freiheitsgrade',
    source: 'gesstabs_handbuch_52.md:11144',
  },
  {
    name: 'HYMCNEMAR',
    description:
      'McNemar 449 hybrid: aus den gewichteten Daten wird der Anteil der diskordanten Paare ermittelt. Aus dem gewichtet ermittelten Anteil der diskordanten Paare werden hypothetische ungewichtete H�ufigkeiten f�r diese ermittelt. Diese bilden dann die Grundlage des McNemar-Tests.',
    source: 'gesstabs_handbuch_52.md:11149',
  },
  {
    name: 'HYPERLINK',
    description: '',
    syntax: 'HYPERLINK = <URI> <text> ;',
    source: 'gesstabs_handbuch_52.md:16824',
  },
  {
    name: 'HYROWTTEST',
    description:
      'Hybrider 447, zeilenweiser t-Test: Die t-Werte werden auf Basis der gewichteten Daten errechnet, die Freiheitsgrade zur Name Beschreibung Berechnung der p-Werte der t-Verteilung ergeben sich aus den ungewichteten H�ufigkeiten.',
    source: 'gesstabs_handbuch_52.md:11158',
  },
  {
    name: 'HYTTEST',
    argsHint: '(Var )',
    description:
      'Hybrider 447 t-Test: Die t-Werte werden auf Basis der gewichteten Daten errechnet, die Freiheitsgrade zur Berechnung der p-Werte der t-Verteilung ergeben sich aus den ungewichteten H�ufigkeiten.',
    source: 'gesstabs_handbuch_52.md:11167',
  },
  {
    name: 'HYWELCHTEST',
    description:
      'Hybrider 447 t-Test auf Mittelwerteunterschiede nach Welch 450 auf Basis der gewichteten Daten',
    source: 'gesstabs_handbuch_52.md:11172',
  },
  {
    name: 'IDENTCHIQNOSIGNIF',
    description:
      'Wenn man eine Variable gegen sich selbst tabelliert, sind die Besetzungen nat�rlich hochsignifikant, aber aussageleer. Die Ausgabe der Signifikanzkennzeichnung kann hiermit unterdr�ckt werden.',
    source: 'gesstabs_handbuch_52.md:13657',
  },
  {
    name: 'IF',
    description: '',
    syntax:
      'IF <log. Bedingung> PRINT "ErrorText" <Varlist> [ GOTO <varname> ];',
    source: 'gesstabs_handbuch_52.md:1306',
  },
  {
    name: 'IFASFIF',
    description: '',
    syntax: 'IFASFIF = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:8089',
  },
  {
    name: 'IFBLOCK',
    description: '',
    syntax: 'IFBLOCK <bedingung> THEN',
    source: 'gesstabs_handbuch_52.md:8101',
  },
  {
    name: 'IGNOREASCOUTDUPL',
    description: '',
    syntax: 'IGNOREASCOUTDUPL = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15909',
  },
  {
    name: 'IGNORECASEINCOMPARE',
    description: '',
    syntax: 'IGNORECASEINCOMPARE = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:8066',
  },
  {
    name: 'IGNOREMISSING',
    description: '',
    syntax:
      'IGNOREMISSING = [ YES | NO ];\nVoreinstellung: IGNOREMISSING = NO;',
    source: 'gesstabs_handbuch_52.md:6258',
  },
  {
    name: 'IGNOREMULTIQOVERFLOW',
    description: '',
    syntax: 'IGNOREMULTIQOVERFLOW = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1291',
  },
  {
    name: 'IGNORESETFILTER',
    description: '',
    syntax: 'IGNORESETFILTER = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:8788',
  },
  {
    name: 'IGNORESPSSMISSINGVALUES',
    description: '',
    syntax: 'IGNORESPSSMISSINGVALUES = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1587',
  },
  {
    name: 'IGNORESPSSSYSMISVAL',
    description: '',
    syntax: 'IGNORESPSSSYSMISVAL = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1593',
  },
  {
    name: 'IGNORETABINTEXT',
    description: '',
    syntax: 'IGNORETABINTEXT = [ yes | no ];',
    source: 'gesstabs_handbuch_52.md:13280',
  },
  {
    name: 'IN',
    description:
      'Einschluss von Wertemengen/-bereichen Logische Verkn�pfungen sind m�glich mit:',
    source: 'gesstabs_handbuch_52.md:7899',
  },
  {
    name: 'INCLUDE',
    description: '',
    syntax: 'INCLUDE = <filename.inc>;',
    source: 'gesstabs_handbuch_52.md:525',
  },
  {
    name: 'INCLUDETITLEINTEXT',
    description: '',
    syntax:
      'INCLUDETITLEINTEXT <varlist> = [ YES | NO ];\nF�r alle Variablen, die in <varlist> aufgef�hrt sind, wird der VARTEXT um den Inhalt von',
    source: 'gesstabs_handbuch_52.md:5273',
  },
  {
    name: 'INDENTAUTOOVERSORT',
    description: '',
    syntax: 'INDENTAUTOOVERSORT = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:16669',
  },
  {
    name: 'INDEXCHARS',
    description: '',
    syntax: 'INDEXCHARS = "<Buchstaben | Zeichen>";',
    source: 'gesstabs_handbuch_52.md:12014',
  },
  {
    name: 'INDEXSTYEFILE',
    description: '',
    syntax: 'INDEXSTYEFILE = <name>;',
    source: 'gesstabs_handbuch_52.md:15101',
  },
  {
    name: 'INDEXVAR',
    description: '',
    syntax: 'INDEXVAR <name> = <varlist> BY <variable>;',
    source: 'gesstabs_handbuch_52.md:7389',
  },
  {
    name: 'INHERITBACKGROUND',
    description: '',
    syntax:
      'INHERITBACKGROUND [ X | Y ] = [ YES | NO ];\nINHERITFOREGROUND [ X | Y ] = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:14307',
  },
  {
    name: 'INHERITFONT',
    description: '',
    syntax: 'INHERITFONT [ X | Y ] = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:14439',
  },
  {
    name: 'INSTANTEXCEL',
    description: '',
    syntax: 'INSTANTEXCEL = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15472',
  },
  {
    name: 'INSTANTPDF',
    description: '',
    syntax: 'INSTANTPDF = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:2662',
  },
  {
    name: 'INSTITUTION',
    description:
      'Angabe einer Texterg�nzung f�r den links unten eingedruckten Instituts- Namen',
    syntax: 'INSTITUTION = "<text>";',
    source: 'gesstabs_handbuch_52.md:13167',
  },
  {
    name: 'INTERVALS',
    description: '',
    syntax:
      'INTERVALS <newvar> = <sourcevar> { | <labeltext> :\n<comparison> <comparevalue> }*n;\n<comparison> ::= [ LT | GT | LE | GE ]',
    source: 'gesstabs_handbuch_52.md:6958',
  },
  {
    name: 'INVERSE',
    description:
      'CHARTTITLE "Eine GESStabsArtist Graphik auf der Basis der Mittelwerte aus der OVERVIEW-Tabelle\\CELLELEMENT MEAN" CELLELEMENT MEAN',
    syntax: 'INVERSE : [YES | NO]',
    source: 'gesstabs_handbuch_52.md:10492',
  },
  {
    name: 'INVERTFILEWEIGHTOUT',
    description: '',
    syntax: 'INVERTFILEWEIGHTOUT = <variable>;',
    source: 'gesstabs_handbuch_52.md:2492',
  },
  {
    name: 'INVERTIN',
    description: '',
    syntax: 'INVERTIN = <path>;',
    source: 'gesstabs_handbuch_52.md:2531',
  },
  {
    name: 'INVERTOUT',
    description: '',
    syntax: 'INVERTOUT = <path>;',
    source: 'gesstabs_handbuch_52.md:2456',
  },
  {
    name: 'INVERTOUTMAX',
    description: '',
    syntax: 'INVERTOUTMAX = <number>;',
    source: 'gesstabs_handbuch_52.md:2470',
  },
  {
    name: 'INVERTOUTVARS',
    description: '',
    syntax: 'INVERTOUTVARS [ KEEPVARS | DELETEVARS ] = <varlist>;',
    source: 'gesstabs_handbuch_52.md:2476',
  },
  {
    name: 'INVINDEXVAR',
    description: '',
    syntax: 'INVINDEXVAR <name> = <varlist> BY <variable>;',
    source: 'gesstabs_handbuch_52.md:7403',
  },
  {
    name: 'IOCHECK',
    description: '',
    syntax: 'IOCHECK = [ ASCIIIN | ASCIIOUT | COLBININ | COLBINOUT ] ;',
    source: 'gesstabs_handbuch_52.md:16001',
  },
  {
    name: 'KEY',
    description: '',
    syntax:
      'KEY OPENQFILE = <varname> ;\nIn der Regel wird hierzu die CASENUMBER verwendet; man kann aber beliebige Variablen als\nSchl�ssel in OpenQFiles verwenden. Diese Variable muss atomar sein; darf aber auch vom Typ',
    source: 'gesstabs_handbuch_52.md:2121',
  },
  {
    name: 'KEYWORD',
    description:
      'Syntaxstrukturen werden so aufgef�hrt: Dies ist die grunds�tzliche Syntaxstruktur einer GESStabs-Funktionalit�t. Beispielhafte Syntaxausschnitte sehen entsprechend aus: Dies ist ein beispielhafter Syntaxabschnitt Einf�hrung in die Tabellierung',
    source: 'gesstabs_handbuch_52.md:308',
  },
  {
    name: 'LABELFORMAT',
    description: '',
    syntax: 'LABELFORMAT <varlist> = <formatstring>;',
    source: 'gesstabs_handbuch_52.md:14590',
  },
  {
    name: 'LABELRECODE',
    description: '',
    syntax: 'LABELRECODE = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:6555',
  },
  {
    name: 'LABELS',
    description: '',
    syntax: 'LABELS : [0 | 1 | 2]',
    source: 'gesstabs_handbuch_52.md:3542',
  },
  {
    name: 'LABELSTOTITLE',
    description: '',
    syntax: 'LABELSTOTITLE <labelcode> = <varlist>;',
    source: 'gesstabs_handbuch_52.md:1576',
  },
  {
    name: 'LABELVALUE',
    description: '',
    syntax: 'LABELVALUE <numvariable> = <variable>;',
    source: 'gesstabs_handbuch_52.md:16982',
  },
  {
    name: 'LABELWIDTH',
    description: '',
    syntax: 'LABELWIDTH : <number>\nCOLUMNWIDTH : <number>',
    source: 'gesstabs_handbuch_52.md:3057',
  },
  {
    name: 'LANGUAGES',
    description: '',
    syntax: 'LANGUAGES = <csv-file-name>;',
    source: 'gesstabs_handbuch_52.md:5964',
  },
  {
    name: 'LEADINGZEROS',
    description: '',
    syntax: 'LEADINGZEROS = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15923',
  },
  {
    name: 'LEGENDPOSITION',
    description: '',
    syntax: 'LEGENDPOSITION : [TOP | BOTTOM | LEFT | RIGHT]',
    source: 'gesstabs_handbuch_52.md:3501',
  },
  {
    name: 'LINEFEEDCHAR',
    description:
      'Erzwingt in VALUELABELS 211 oder VARTITLE 210s einen Zeilenumbruch. Voreinstellung: \\',
    source: 'gesstabs_handbuch_52.md:13353',
  },
  {
    name: 'LINEFEEDFACTOR',
    description: '',
    syntax: 'LINEFEEDFACTOR = <number>;',
    source: 'gesstabs_handbuch_52.md:14494',
  },
  {
    name: 'LINEWIDTH',
    description: 'Die Dicke des Umrandungsstrichs. 0.0 = keine Umrandung.',
    source: 'gesstabs_handbuch_52.md:15361',
  },
  {
    name: 'LISTFILE',
    description: '',
    syntax: 'LISTFILE = <filename>;',
    source: 'gesstabs_handbuch_52.md:991',
  },
  {
    name: 'LISTON',
    description: '',
    syntax: 'LISTON = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:983',
  },
  {
    name: 'LISTVARS',
    description: '',
    syntax:
      'LISTVARS= <filename> [ options ];\noption ::= ASCIIOUT | COLBINOUT | ALL | SPSS | LABELS',
    source: 'gesstabs_handbuch_52.md:1001',
  },
  {
    name: 'LOCALCONTENT',
    description:
      'Bei der Druckausgabe wird nicht die Information aus dem FRAME, sondern der lokal ermittelte Zelleninhalt ber�cksichtigt.',
    source: 'gesstabs_handbuch_52.md:13662',
  },
  {
    name: 'LOCALTEXTFORMAT',
    description: '',
    syntax:
      'LOCALTEXTFORMAT <#<char> <option> ;\n<char> ::= frei zu w�hlender Char (case-sensitive)\n<option> ::= [ FOREGROUND <color> | USEFONT <fontname> SIZE\n<size> ]',
    source: 'gesstabs_handbuch_52.md:14455',
  },
  {
    name: 'LONGVARTITLE',
    description:
      'Sorgt daf�r, dass VARTITLE 210 in Tabellen in der Y-Achse nicht umgebrochen werden. Sollte man nur anwenden, wenn keine DRAWBOX f�r VARTITLE Y definiert ist - kann sonst bl�d aussehen. (Hat nur bei Postscript-Ausgabe Effekt).',
    source: 'gesstabs_handbuch_52.md:13671',
  },
  {
    name: 'LOWERCASE',
    description: '',
    syntax:
      'LOWERCASE <char> = <char>;\n<char> ::= [ x | �x� | "x" | <number> ]\nx ::= A .. Z, a .. z\nnumber ::= 1 .. 255',
    source: 'gesstabs_handbuch_52.md:16700',
  },
  {
    name: 'LSLICE',
    description:
      'von Einzeltabellen zerlegen. TABLE = a BY b SORT ABSOLUTE DESCEND SLICE 15; Hiermit wird eine Tabelle mit z.B. 55 Einzelitems in der Variablen b in 4 Seiten zerlegt. Falls eine Zerlegung eine Restseite mit nur einer Nennung ergeben w�rde, wird diese Nennung mit auf die Vorseite gedruckt. Eine Tabelle mit 61 Items w�rde also auf 4 und nicht auf 5 Seiten gedruckt.',
    source: 'gesstabs_handbuch_52.md:9976',
  },
  {
    name: 'LT',
    description: 'Lower Then, kleiner als',
    source: 'gesstabs_handbuch_52.md:7890',
  },
  {
    name: 'MACROPROTOCOL',
    description: '',
    syntax: 'MACROPROTOCOL = <dateiname> [ DOMACRO ] ;',
    source: 'gesstabs_handbuch_52.md:1049',
  },
  {
    name: 'MAKEFAMILY',
    description: '',
    syntax:
      'MAKEFAMILY <name> = <value>;\nMit MAKEFAMILY generiert man eine leere VARFAMILY bzw. MultiQ mit n (<value>)',
    source: 'gesstabs_handbuch_52.md:7160',
  },
  {
    name: 'MAKEGROUP',
    description: '',
    syntax:
      'MAKEGROUP <name> = <value>;\nMit MAKEGROUP wird eine leere Gruppenvariable mit n (<value>) Einzelvariablen generiert, die',
    source: 'gesstabs_handbuch_52.md:6948',
  },
  {
    name: 'MAKESINGLE',
    description: '',
    syntax: 'MAKESINGLE <newvar> [ = <arithm.expression> ];',
    source: 'gesstabs_handbuch_52.md:5779',
  },
  {
    name: 'MAKESINGLES',
    description: '',
    syntax: 'MAKESINGLES <newvarlist> [ = <sourcelist> ] ;',
    source: 'gesstabs_handbuch_52.md:5819',
  },
  {
    name: 'MARGINS',
    description: '',
    syntax:
      'MARGINS = LEFT <number> RIGHT <number> TOP <number> BOTTOM <number> ;',
    source: 'gesstabs_handbuch_52.md:13976',
  },
  {
    name: 'MARKCELLEXCELSPECIAL',
    description: '',
    syntax: 'MARKCELLEXCELSPECIAL = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:16870',
  },
  {
    name: 'MARKCELLS',
    description: '',
    syntax:
      'MARKCELLS = YES\nSIGNIFLEVEL { | [ SIGNIF90 | SIGNIF95 | SIGNIF99 | SIGNIF999 ]\n[ GT | LT ] <color> }*n ;\nAusschalten: MARKCELLS = NO;',
    source: 'gesstabs_handbuch_52.md:14803',
  },
  {
    name: 'MARKCELLSMETHOD',
    description: '',
    syntax:
      'MARKCELLSMETHOD = [ CLASSIC | COLCHIQU | ROWCHIQU\n| HYCOLCHIQU | HYROWCHIQU ];',
    source: 'gesstabs_handbuch_52.md:14829',
  },
  {
    name: 'MAX',
    description:
      'Max-Wert In der einfachsten Form lautet ein DATA-Statement z.B.: DATA MEAN GlobMeanQ1 = Q1; Die Variable Q1 in dem Beispiel muss existieren. Als Resultat steht dann im Tabellierungsprozess die neue atomare Variable "GlobMeanQ1" zur Verf�gung. Ihr Wert ist der globale Mittelwert von Q1 �ber alle eingelesenen F�lle.…',
    source: 'gesstabs_handbuch_52.md:8275',
  },
  {
    name: 'MAXCODEBOOKLINES',
    description: '',
    syntax:
      'MAXCODEBOOKLINES = <number>;\nVoreinstellung: MAXCODEBOOKLINES = 50;',
    source: 'gesstabs_handbuch_52.md:9148',
  },
  {
    name: 'MAXCOLSPERTABLEPAGE',
    description: '',
    syntax: 'MAXCOLSPERTABLEPAGE = <number>;\nMAXROWSPERTABLEPAGE = <number>;',
    source: 'gesstabs_handbuch_52.md:13896',
  },
  {
    name: 'MAXIMUMWEIGHT',
    description: '',
    syntax: 'MAXIMUMWEIGHT = <number>;\nMINIMUMWEIGHT = <number>;',
    source: 'gesstabs_handbuch_52.md:12957',
  },
  {
    name: 'MAXIMUMWFACT',
    description: '',
    syntax: 'MAXIMUMWFACT = <number>;\nMINIMUMWFACT = <number>;',
    source: 'gesstabs_handbuch_52.md:12968',
  },
  {
    name: 'MAXINDEX',
    description: '',
    syntax:
      'MAXINDEX <resultvar> = <varlist>;\nMININDEX <resultvar> = <varlist>;',
    source: 'gesstabs_handbuch_52.md:8216',
  },
  {
    name: 'MAXWEIGHTITERATIONS',
    description: '',
    syntax: 'MAXWEIGHTITERATIONS = <number>;',
    source: 'gesstabs_handbuch_52.md:12942',
  },
  {
    name: 'MCNEMAR',
    description: 'Abh�ngiger Test auf Prozentwertunterschiede nach McNemar 449',
    source: 'gesstabs_handbuch_52.md:11175',
  },
  {
    name: 'MEAN',
    description:
      'Die Auswahl der Zeile in der obenstehenden Matrix wird sich in der Regel aus der Art der zu testenden Daten ergeben. F�r einen abh�ngigen Test des Unterschieds von Prozentwerten bietet sich bspw. McNemar an; f�r einen unabh�ngigen Test der X�-Test. Vergleichbar gibt es zwei Varianten des t-Tests f�r Mittelwerte, den abh�ngigen und den unabh�ngigen.…',
    syntax: 'MEAN <varname> = <Varlist>;',
    source: 'gesstabs_handbuch_52.md:11573',
  },
  {
    name: 'MEANCOLINDEX',
    argsHint: '( Var )',
    description:
      'Spaltenweise Darstellung des Mittelwertes als Index auf der Basis 100, jeweils auf den Mittelwert in der Totalspalte bezogen',
    source: 'gesstabs_handbuch_52.md:10926',
  },
  {
    name: 'MEANCUT',
    argsHint: '( Var )',
    description:
      'Spezieller Mittelwerte: MEANCUT schneidet am unteren und oberen Ende der Verteilung die Extremwerte ab, und berechnet den Mittelwert auf der Basis der verbleibenden Verteilung je Zelle. Kann die Extremgruppe nicht aus ganzen F�llen gebildet werden, wird anteilige Gewichtung verwendet. Die Gr��e Extremabschnitte wird in Prozentpunkten definiert:…',
    source: 'gesstabs_handbuch_52.md:10930',
  },
  {
    name: 'MEANDESCRIPTION',
    description:
      'Ersetzt bei Spalten und Zeilen mit dritten Variablen (z.B. MEAN etc) den Variablennamen durch den DESCRIPTION 550-String, z.B. "Mittelwert".',
    source: 'gesstabs_handbuch_52.md:13676',
  },
  {
    name: 'MEANP',
    argsHint: '( Var )',
    description:
      "Von der Berechnung her ist MEANP (vorgesehen als: MEAN f�r Prozentwerte) exakt dasselbe wie MEAN 423. Der zweite Bezeichner dient nur dazu, dass man diesem CELLELEMENT ein abweichendes FORMAT 566 oder DESCRIPTION geben kann. Als Default hat dieses CELLELEMENT die DESCRIPTION 385 'fake%'. F�r die Tabellenausgabe wird man dies ggf. besser in '%' �ndern.",
    source: 'gesstabs_handbuch_52.md:11403',
  },
  {
    name: 'MEANQP',
    description:
      'Erg�nzend zu MEANP (also im Kern: MEAN) gibt noch eine kleine',
    source: 'gesstabs_handbuch_52.md:11410',
  },
  {
    name: 'MEANQP100',
    description:
      'Erweiterung: MEANQP. Parallel zur Summe und zur Basis (Summe der Gewichte) wird eine Summe aller negativen Werte und der dazugeh�rigen Gewichte gef�hrt. Als Resultat liefert dieses CELLELEMENT den Quotienten der Mittelwerte der positiven und der negativen Werte. MEANQP100 ist von der Berechnung her identisch, der Wert wird lediglich mit 100 multipliziert.',
    source: 'gesstabs_handbuch_52.md:11412',
  },
  {
    name: 'MEANROWINDEX',
    argsHint: '( Var )',
    description:
      'Zeilenweise Darstellung des Mittelwertes als Index, jeweils auf den Mittelwert in der Totalzeile bezogen',
    source: 'gesstabs_handbuch_52.md:10940',
  },
  {
    name: 'MEANTEST',
    description:
      ': DESCRIPTION "Mittelwert" ( item_5 ); Es entsteht die gew�nschte Tabelle: Bestandteile einer Tabelle k�nnen durch Filter bestimmt werden Makros Nun kann man nat�rlich auch den Wunsch haben, die M�nner und die Frauen nicht nebeneinander darzustellen, sondern �bereinander. Ein Weg dahin ist, f�r die f�nf Items jeweils nach dem Geschlecht gefilterte Variablen zu erstellen.…',
    source: 'gesstabs_handbuch_52.md:9648',
  },
  {
    name: 'MEDIAN',
    argsHint: '( Var )',
    description:
      'Der Median einer dritten Variable in allen Zellen. Bei Median wie bei allen Perzentilen wird innerhalb von GESStabs dann interpoliert, wenn es mit dem TABLEFORMAT PERCENTILEINTERPOL verlangt wird. MEDIAN und PCNTL1 bis PCNTL4 424 sind in einer Zelle kombinierbar; dabei wird untereinander erst PCNTL1, dann MEDIAN und zuletzt PCNTL2 ausgegeben.',
    source: 'gesstabs_handbuch_52.md:10943',
  },
  {
    name: 'MIN',
    description: '',
    syntax: 'MIN <varname> = <Varlist>;',
    source: 'gesstabs_handbuch_52.md:8208',
  },
  {
    name: 'MISSING',
    description: '',
    syntax: 'MISSING <Varlist> = { number }*n;',
    source: 'gesstabs_handbuch_52.md:6223',
  },
  {
    name: 'MISSINGCHAR',
    description: '',
    syntax: 'MISSINGCHAR = "<char>";\nVoreinstellung: MISSINGCHAR = "M";',
    source: 'gesstabs_handbuch_52.md:6240',
  },
  {
    name: 'MODIFYCSVNAMES',
    description: '',
    syntax: 'MODIFYCSVNAMES = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1915',
  },
  {
    name: 'MODIFYVARNAME',
    description:
      "Drucke bei Spalten bzw. Zeilen mit dritten Variablen (z.B. 'MEAN( Einkommen)') nicht nur den Variablennamen, sondern auch die DESCRIPTION 550 des Spalten- bzw. Zeileninhalts.",
    source: 'gesstabs_handbuch_52.md:13680',
  },
  {
    name: 'MULTIFROMSTRING',
    description: '',
    syntax:
      'MULTIFROMSTRING [ DELIMITED <delimiter> ] [ DECIMALS <decimalchar> ] <newvar>\n= <alfavar>;',
    source: 'gesstabs_handbuch_52.md:7287',
  },
  {
    name: 'MULTIQ',
    description: '',
    syntax:
      'MULTIQ <varname> =\n[NOINPUT ] [ TITLE <titlestring> ] [ ALPHA ] [ start | * ]\nlen [width] [ LABELS { AS <varname> | { value <text> }*n }\n| LABELFROMFILE <filename> ] ];\n;',
    source: 'gesstabs_handbuch_52.md:5844',
  },
  {
    name: 'MULTISTRING',
    description:
      'Text in CODEBOOK 346s, der auf m�gliche Mehrfachnennungen verweist',
    syntax: 'MULTISTRING = "<text>";',
    source: 'gesstabs_handbuch_52.md:13078',
  },
  {
    name: 'MULTITOTALX',
    description:
      'Im Normalfall wird eine TOTALROW auf der Basis von F�llen gez�hlt (siehe auch TABLEBASE 388). In vielen F�llen ist es aber bei Variablen mit Mehrfachnennungen w�nschenswert, die Totalzeile abweichend auf der Basis der Nennungen zu z�hlen. Dies kann man mit diesem TABLEFORMAT erreichen. (Z.B.…',
    source: 'gesstabs_handbuch_52.md:13684',
  },
  {
    name: 'MULTITOTALY',
    description:
      'Analog zu MULTITOTALX 538 wird eine TOTALCOLUMN im Standardfall auf der Basis von F�llen gez�hlt. Mit MULTITOTALY kann diese Z�hlung auf alle Nennungen umgestellt werden.',
    source: 'gesstabs_handbuch_52.md:13698',
  },
  {
    name: 'NE',
    description: 'Not Equal, ist ungleich',
    source: 'gesstabs_handbuch_52.md:7884',
  },
  {
    name: 'NEG',
    description:
      'negativer Wert Beispiel: COMPUTE x = ENTIER( NEG( b / 2 ) ); Arithmetische Operatoren f�r Ganze Werte Auch wenn GESStabs keine echten Ganzen Werte kennt, kann es interessant sein, den "Rest" einer Division zu kennen. Dazu stehen folgende Operatoren bereit:',
    source: 'gesstabs_handbuch_52.md:7565',
  },
  {
    name: 'NEWOPENFORMAT',
    description: '',
    syntax: 'NEWOPENFORMAT = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:2228',
  },
  {
    name: 'NEWPAGE',
    description:
      'Seitenumbruch vor dem Label (Synonym: PAGE), siehe auch Layout 543',
    source: 'gesstabs_handbuch_52.md:5659',
  },
  {
    name: 'NIL',
    description:
      'leere Variable (praktisch z.B. bei TABLE ADD 391) Der Versuch, eigene Variablen mit diesen Namen zu generieren, f�hrt zu einem Fehler. Mit HIDDENTOVARLIST kann gesteuert werden, ob Systemvariablen bei der Nennung von Variablenlisten 20 (mittels TO) mit erfasst werden sollen.',
    source: 'gesstabs_handbuch_52.md:5948',
  },
  {
    name: 'NOASCIIEXTENSION',
    description: '',
    syntax: 'NOASCIIEXTENSION = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15935',
  },
  {
    name: 'NOBODYBLANKS',
    description:
      'Unterdr�ckt Leerzeilen im Tabellenrumpf, die sonst der Lesbarkeit halber eingef�gt werden. Damit passen u.U. Tabellen',
    source: 'gesstabs_handbuch_52.md:13702',
  },
  {
    name: 'NOCONTENTBOX',
    description:
      'Unterdr�ckt den Erl�uterungskasten bei zus�tzlichen Tabellenzeilen, die z.B. Mittelwerte oder Summen enthalten etc. In diesem Fall wird vor den Werten nur der VARTITLE 210 bzw. der VARNAME 207 ausgegeben. Der/die Benutzer/in sollte dann durch eigene Texte den Tabelleninhalt erl�utern. (Ohne Effekt bei Postscript-Ausgabe).',
    source: 'gesstabs_handbuch_52.md:13712',
  },
  {
    name: 'NOCSV',
    description: '',
    syntax: 'NOCSV <varlist> = YES;',
    source: 'gesstabs_handbuch_52.md:1967',
  },
  {
    name: 'NODESCRIPTION',
    description:
      'Unterdr�ckt die Beschreibungstexte f�r die Zelleninhalte (siehe auch DESCRIPTION 550).',
    source: 'gesstabs_handbuch_52.md:13719',
  },
  {
    name: 'NOEMPTYELEMENT',
    description:
      'Leere CELLELEMENTS 418 (z.B. ein leerer Ergebnistext f�r einen Signifikanztest) werden durch den ZERODASHCHAR 529 ersetzt.',
    source: 'gesstabs_handbuch_52.md:13722',
  },
  {
    name: 'NOEXPANDAT',
    description: '',
    syntax: 'NOEXPANDAT <varlist> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5572',
  },
  {
    name: 'NOGRAPH',
    description:
      'Unterdr�ckt das, ansonsten standardm��ig dargestellte, rechtsstehende Histogramm in CODEBOOK 346s und PROFILE 637 -Tabellen.',
    source: 'gesstabs_handbuch_52.md:13725',
  },
  {
    name: 'NOGRID',
    description:
      'Unterdr�ckt die, ansonsten standardm��ig dargestellte, Skala f�r Lineingrafiken in PROFILE 637-Tabellen.',
    source: 'gesstabs_handbuch_52.md:13729',
  },
  {
    name: 'NOHEADERBLANKS',
    description: 'Unterdr�ckt Leerzeilen im Tabellenkopf. (NON-PS)',
    source: 'gesstabs_handbuch_52.md:13732',
  },
  {
    name: 'NOINHERITTEXT',
    description: '',
    syntax: 'NOINHERITTEXT = [ YES | NO ];\nNOINHERITTITLE = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:7104',
  },
  {
    name: 'NOINPUT',
    description: '',
    syntax: 'NOINPUT <varlist> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5520',
  },
  {
    name: 'NOINVERTADDON',
    description: '',
    syntax: 'NOINVERTADDON = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:2589',
  },
  {
    name: 'NOIOCHECK',
    description: '',
    syntax: 'NOIOCHECK <varlist> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:16008',
  },
  {
    name: 'NOISE',
    description: '',
    syntax: 'NOISE = <value>;',
    source: 'gesstabs_handbuch_52.md:1336',
  },
  {
    name: 'NOLOGFILES',
    description: '',
    syntax: 'NOLOGFILES = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1067',
  },
  {
    name: 'NOMINATIONTITLE',
    description:
      'Dient zu Ersetzung des Standardtextes bei TABLEBASE = RESPONSES;.',
    syntax: 'NOMINATIONTITLE [X|Y] = "<text>";',
    source: 'gesstabs_handbuch_52.md:13450',
  },
  {
    name: 'NOOUTPUT',
    description: '',
    syntax: 'NOOUTPUT <varlist> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5537',
  },
  {
    name: 'NOQUOTESINCSV',
    description: '',
    syntax: 'NOQUOTESINCSV = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1987',
  },
  {
    name: 'NORANKING',
    description:
      'Ausschluss aus Ranking, siehe Sortierungen 468 Vergabe eines Z�hllevels zur Steuerung der Ausgabe in Tabellen (relevant',
    source: 'gesstabs_handbuch_52.md:5642',
  },
  {
    name: 'NOREPORT',
    description: '',
    syntax: 'NOREPORT <varlist> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1062',
  },
  {
    name: 'NORMALIZE',
    description: '',
    syntax: 'NORMALIZE;\nNORMALIZE = <varlist>;',
    source: 'gesstabs_handbuch_52.md:7368',
  },
  {
    name: 'NOSPSS',
    description: '',
    syntax: 'NOSPSS <varlist> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5542',
  },
  {
    name: 'NOT',
    description:
      'Nicht Assoziationen m�ssen explizit durch Klammerung angegeben werden; ungeklammerte Reihungen von OR und AND werden von links nach rechts abgearbeitet. Die verbreitete abk�rzende Schreibweise (z.B. "a EQ 1 OR 2" anstelle von "a EQ 1 OR a EQ 2" etc. ist nicht erlaubt. Hierf�r gibt es die IN 303-Formulierung. Stringkonstanten sind erlaubt.…',
    source: 'gesstabs_handbuch_52.md:7906',
  },
  {
    name: 'NOVARTITLEBOX',
    description:
      'Unterdr�ckt den Kasten, der Variablen in der Y-Richtung benennt. Macht immer dann Sinn, wenn man in der Y-Richtung nur eine einzige Variable verwendet, die zudem z.B. bereits in der TOPTEXT 516-Box erl�utert wurde.',
    source: 'gesstabs_handbuch_52.md:13734',
  },
  {
    name: 'NOWRAPINTEXT',
    description: '',
    syntax: 'NOWRAPINTEXT = [ YES | NO ] ;',
    source: 'gesstabs_handbuch_52.md:13289',
  },
  {
    name: 'NOZERODASH',
    description:
      "Im Standardfall wird die echte Null in Prozenttabellen durch '-' dargestellt. Dies kann man mit NOZERODASH abschalten.",
    source: 'gesstabs_handbuch_52.md:13739',
  },
  {
    name: 'NOZEROFILLINLABEL',
    description:
      'Unterdr�ckt die Erg�nzung f�hrender Nullen im LABELFORMAT 569-Statement.',
    source: 'gesstabs_handbuch_52.md:13748',
  },
  {
    name: 'NUMBERCHAR',
    description:
      'Wird in TABLETITLE 516s durch die aktuelle Tabellennummer ersetzt. Voreinstellung: #',
    source: 'gesstabs_handbuch_52.md:13357',
  },
  {
    name: 'NUMCENTERGRAPH',
    description:
      '| FORM RECTANGLE COLUMNS 1 ROWS 2 | FORM RECTANGLE COLUMNS 2 ROWS 1 2 ; Das einfachste Chart erweitert um Optionen f�r Form und Farbe 2a: Vier Charts auf einer Seite im Querformat Im folgenden Beispiel wurden vier Charts auf Basis derselben Tabelle auf einer Seite im Querformat abgebildet.…',
    source: 'gesstabs_handbuch_52.md:3905',
  },
  {
    name: 'NUMEXGRAPH',
    description:
      'CHARTTITLE "Ehemalige Parteiw�hler von CDU, SPD und Gr�ne/GAL w�hlen:" = | COLUMNS POSITION 2:4 ROWS POSITION 1:8 ; GESSCHART PIE SAMEPAGE',
    source: 'gesstabs_handbuch_52.md:4525',
  },
  {
    name: 'OFFICEEXPORT',
    description: '',
    syntax:
      'OFFICEEXPORT = <filename>;\n<filename> muss eine der folgenden Extensionen haben : xlsx | xls | ods. �ber die Extension',
    source: 'gesstabs_handbuch_52.md:2755',
  },
  {
    name: 'OFFICEFONT',
    description: '',
    syntax:
      'OFFICEFONT <fontname> SIZE <number> [OPTION [BOLD|ITALIC|UNDERLINE]]',
    source: 'gesstabs_handbuch_52.md:3218',
  },
  {
    name: 'OFFICEFORMAT',
    description: '',
    syntax: 'OFFICEFORMAT <cellelement> : <formatstring>',
    source: 'gesstabs_handbuch_52.md:3066',
  },
  {
    name: 'OLDGROUPCLEARMETHOD',
    description: '',
    syntax: 'OLDGROUPCLEARMETHOD = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:16914',
  },
  {
    name: 'OPENASALPHA',
    description: '',
    syntax:
      'OPENASALPHA <varlist> = [ YES | NO ];\nGLOBALOPENASALPHA = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5477',
  },
  {
    name: 'OPENAUTOGENERATE',
    description: '',
    syntax:
      'OPENAUTOGENERATE = [ YES | MULTIQ <number> [ PREFIX <text> ] ]\n| ALPHA [ PREFIX <text> ] ];\nDie einfachste Version lautet: OPENAUTOGENERATE = YES;',
    source: 'gesstabs_handbuch_52.md:2180',
  },
  {
    name: 'OPENCSV',
    description: '',
    syntax: 'OPENCSV = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:2233',
  },
  {
    name: 'OPENOFFICEDEVIATION',
    description: '',
    syntax: 'OPENOFFICEDEVIATION = YES;',
    source: 'gesstabs_handbuch_52.md:15567',
  },
  {
    name: 'OPENQFILE',
    description: '',
    syntax: 'OPENQFILE = <name.opn>;',
    source: 'gesstabs_handbuch_52.md:2110',
  },
  {
    name: 'OPTION',
    description: '',
    syntax: 'OPTION : [CLUSTERED | STACKED | PERCENTSTACKED]',
    source: 'gesstabs_handbuch_52.md:3514',
  },
  {
    name: 'OR',
    argsHint: '( Alter LT 6 AND Schulbildung GT 0 )',
    description:
      'PRINT "Unplausibler Ausbildungsgrad" Alter Schulbildung; Die Meldungen erscheinen entweder im INPUT-DATA-ERROR-Fenster in der GESStabs- Oberfl�che oder ggf. im LISTFILE 38. Die zweite Syntax-Variante erzeugt eine Ausgabe in eine eigene, zugeordnete Datei. In diesem Fall wird eine �berschriftszeile mit den Variablennamen erzeugt.…',
    source: 'gesstabs_handbuch_52.md:1312',
  },
  {
    name: 'OVERCODE',
    description: 'Bildung und Benennung eines Obercodes 262',
    syntax:
      'OVERCODE [<ocname>] { :<label> }*n "<text des OVERCODEs"\n<ocname> ::= neuer eindeutiger Name des OVERCODEs',
    source: 'gesstabs_handbuch_52.md:5632',
  },
  {
    name: 'OVERLAPPED',
    description: 'Die graphischen Elemente �berlappend darstellen',
    source: 'gesstabs_handbuch_52.md:5009',
  },
  {
    name: 'OVEROVERCODE',
    description: '',
    syntax:
      'OVEROVERCODE [ SUM ] <oocname> { :<ocname> }*n\n"<text des OVEROVERCODEs"\n<oocname> ::= neuer eindeutiger Name des OVEROVERCODE\n<ocname> ::= g�ltiger Name eines bestehenden OVERCODE',
    source: 'gesstabs_handbuch_52.md:6767',
  },
  {
    name: 'OVERVIEW',
    description:
      'TITLE "Tabelle mit vererbter Sortierung, SORT AS �overbase�" SORT AS overbase = #k BY MEAN STDDEV( #domacro2 ( m_name 11:16; a ) ); Sortierung vererben: Basistabelle Tabelle mit vererbter Sortierung Die neue Implementierung von �SORT AS� erlaubt auch die Vererbung von Reihenfolgen im Kopf von Tabellen. Wir wandeln unser Beispiel kurz ab, und zeigen formal dieselbe Information in einem XOVERVIEW.…',
    syntax:
      'OVERVIEW <tableoptions> = <kopf> BY <cellelementlist> ( <varlist> )\n[ SORT <cellelement> [ DESCEND ] [ PANE <number> CODE <number> ] ] ;\n<varlist> ::= { <variable [ <varoption> ] }*n\n<varoption> ::=\n[ SORTCLASS <number> ]\n[ LEVEL <number> ]',
    source: 'gesstabs_handbuch_52.md:12723',
  },
  {
    name: 'PAGENUMBER',
    description:
      'Setzt die aktuelle Seitennummer neu, wird mit dem NUMBERCHAR 527 eingesetzt.',
    source: 'gesstabs_handbuch_52.md:13212',
  },
  {
    name: 'PAGETOTALX',
    description:
      'Hat nur Effekt bei MULTITOTALX 538: Die Nennungen aller Variablen auf der Y-Achse werden f�r die Totalzeile gez�hlt.',
    source: 'gesstabs_handbuch_52.md:13751',
  },
  {
    name: 'PAGETOTALY',
    description:
      'Hat nur Effekt bei MULTITOTALY 538: Die Nennungen aller Variablen auf der X-Achse werden f�r die Totalspalte gez�hlt.',
    source: 'gesstabs_handbuch_52.md:13754',
  },
  {
    name: 'PAPER',
    description: '',
    syntax:
      "PAPER = HEIGHT <number> WIDTH <number>;\nDie Interpretation von '<number>' richtet sich nach UNITS.",
    source: 'gesstabs_handbuch_52.md:13956',
  },
  {
    name: 'PATTERN',
    description:
      'Pattern 1 = gepunktet.) Jede Farbe wird entweder nach dem HSB-Modell (Hue-Saturation-',
    source: 'gesstabs_handbuch_52.md:16533',
  },
  {
    name: 'PCNTL1',
    argsHint: '( Var )',
    description: 'Frei w�hlbare Percentil. Voreingestellt sind f�r PCNTL1 das',
    source: 'gesstabs_handbuch_52.md:10976',
  },
  {
    name: 'PCNTL2',
    argsHint: '( Var )',
    description: '1.Quartil und f�r PCNTL2 das 3. Quartil, d.h. jeweils 25%',
    source: 'gesstabs_handbuch_52.md:10978',
  },
  {
    name: 'PCNTL3',
    argsHint: '( Var )',
    description:
      'PCNTL4 ( Var ) bzw. 75% der Zellenverteilung. Mit zus�tzlichen Statements kann die Grenze und der Text der Percentilauswertung individuell gew�hlt werden, Beispiel: PCNTL1 = 33.333% "1.Drittel"; PCNTL2 = 66.667% "2.Drittel"; Es wird dann interpoliert, wenn es mit dem TABLEFORMAT PERCENTILEINTERPOL 540 verlangt wird.',
    source: 'gesstabs_handbuch_52.md:10980',
  },
  {
    name: 'PCNTRANGE',
    argsHint: '( Var )',
    description: 'Ausgabe des 1. und 2. Perzentils als Spanne in einer Zeile',
    source: 'gesstabs_handbuch_52.md:10987',
  },
  {
    name: 'PERCENTILEDELTA',
    argsHint: '( Var )',
    description:
      'Ausgabe der Differenz zwischen dem 1. und 2. Perzentil Name Beschreibung',
    source: 'gesstabs_handbuch_52.md:10989',
  },
  {
    name: 'PERCENTILEINTERPOL',
    description:
      'Mit diesem TABLEFORMAT wird eine Interpolation eingeschaltet.',
    source: 'gesstabs_handbuch_52.md:13757',
  },
  {
    name: 'PERCENTINLABEL',
    description:
      'F�gt bei CELLELEMENT = COLUMNPERCENT; 420 in die Labelboxes der X-Achse automatisch ein %-Zeichen ein.',
    source: 'gesstabs_handbuch_52.md:13759',
  },
  {
    name: 'PHYSCOLDELTA',
    description:
      'Differenz zwischen gewichteten und ungewichteten Spaltenprozenten',
    source: 'gesstabs_handbuch_52.md:10859',
  },
  {
    name: 'PHYSCOLDEPTTEST',
    description:
      'Abh�ngiger, spaltenweiser t-Test auf Basis der gewichteten Daten',
    source: 'gesstabs_handbuch_52.md:11182',
  },
  {
    name: 'PHYSCOLPERCENT',
    description: 'Spaltenprozente, auf Basis ungewichteter Zahlen',
    source: 'gesstabs_handbuch_52.md:10862',
  },
  {
    name: 'PHYSDEPTTEST',
    argsHint: '( Var )',
    description:
      'Abh�ngiger t-Test auf Mittelwertsunterschiede auf Basis der ungewichteten Daten',
    source: 'gesstabs_handbuch_52.md:11185',
  },
  {
    name: 'PHYSICALC',
    description:
      'Physikalische Fallzahl (ohne Ber�cksichtigung von Gewichten) in der Spalte',
    source: 'gesstabs_handbuch_52.md:10725',
  },
  {
    name: 'PHYSICALNTITLE',
    description:
      'Text zur Kennzeichnung der Spalten/Zeilen mit ungewichteter Fallzahl',
    syntax: 'PHYSICALNTITLE = "<text>";',
    source: 'gesstabs_handbuch_52.md:13141',
  },
  {
    name: 'PHYSICALR',
    description:
      'Physikalische Fallzahl (ohne Ber�cksichtigung von Gewichten) in der Zeile',
    source: 'gesstabs_handbuch_52.md:10728',
  },
  {
    name: 'PHYSICALRECORDS',
    description: 'ungewichtete Zahl der F�lle',
    source: 'gesstabs_handbuch_52.md:8257',
  },
  {
    name: 'PHYSICALROW',
    description: 'und folgende drei Arten von Rahmenspalten:',
    source: 'gesstabs_handbuch_52.md:9303',
  },
  {
    name: 'PHYSMCNEMAR',
    description:
      'Abh�ngiger Test auf Prozentwertunterschied auf Basis der ungewichteten Daten nach McNemar 449',
    source: 'gesstabs_handbuch_52.md:11188',
  },
  {
    name: 'PHYSROWCHIQU',
    description: 'Zeilenweiser Chi�-Test auf Basis der ungewichteten Daten',
    source: 'gesstabs_handbuch_52.md:11191',
  },
  {
    name: 'PHYSROWDELTA',
    description:
      'Differenz zwischen den gewichteten und ungewichteten Zeilenprozenten.',
    source: 'gesstabs_handbuch_52.md:10864',
  },
  {
    name: 'PHYSROWPERCENT',
    description: 'Zeilenprozente, auf Basis einer ungewichteten Z�hlung',
    source: 'gesstabs_handbuch_52.md:10867',
  },
  {
    name: 'PHYSROWTTEST',
    description:
      'Unabh�ngiger, zeilenweiser t-Test auf Mittelwertunterschiede auf Basis der ungewichteten Daten. Name Beschreibung',
    source: 'gesstabs_handbuch_52.md:11193',
  },
  {
    name: 'PHYSTTEST',
    argsHint: '( Var )',
    description:
      'Unabh�ngiger t-Test auf Mittelwertsunterschiede auf Basis der ungewichteten Daten',
    source: 'gesstabs_handbuch_52.md:11200',
  },
  {
    name: 'PHYSWELCHTEST',
    description:
      'Unabh�ngiger t-Test auf Mittelwerteunterschiede nach Welch 450 auf Basis der ungewichteten Daten',
    source: 'gesstabs_handbuch_52.md:11203',
  },
  {
    name: 'POSITION',
    description:
      'Mit POSITION kann die Position vorgegeben werden, an der das neue Label (oder auch OVERCODE 262) in die Labelliste eingef�gt wird. Die Z�hlung ist 1-basiert. M�chte man z.B. ein Label vor allen bestehenden einf�gen, so schreibt man etwa: LABELS testvar = ADD POSITION 1',
    syntax: 'POSITION "<cellrange>"',
    source: 'gesstabs_handbuch_52.md:5616',
  },
  {
    name: 'POSTPROCESS',
    description: '',
    syntax: 'POSTPROCESS <Cellelement> : [ IF-Statement | COMPUTE-Statement ];',
    source: 'gesstabs_handbuch_52.md:8490',
  },
  {
    name: 'POSTREPLACE',
    description: '',
    syntax: 'POSTREPLACE <cellelement> : <text1> = <text2> [ IF <text3> ] ;',
    source: 'gesstabs_handbuch_52.md:8534',
  },
  {
    name: 'PRINT2LINES',
    description:
      'Bei Zeilen bzw. Spalten, die mit CELLELEMENTS gebildet werden, die zwei logische Inhalte 433 haben (z.B. ABSCOLPERCENT, ABSMEAN) kann die Darstellung in zwei Zeilen innerhalb der Zelle verlangt werden. (Hat nur bei Postscript- Ausgabe Effekt.)',
    source: 'gesstabs_handbuch_52.md:13762',
  },
  {
    name: 'PRINT2LINES2',
    description:
      'Analog zu PRINT2LINES 540, nur in umgekehrter Reihenfolge. (Hat nur bei Postscript-Ausgabe Effekt.)',
    source: 'gesstabs_handbuch_52.md:13768',
  },
  {
    name: 'PRINTALL',
    description: '',
    syntax:
      'PRINTALL <varlist> = [ YES | NO ];\nGLOBALPRINTALL = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5556',
  },
  {
    name: 'PRINTFILE',
    description: '',
    syntax: 'PRINTFILE <Druckername> = <FileName>;',
    source: 'gesstabs_handbuch_52.md:2627',
  },
  {
    name: 'PRINTSUPPRESSVALUE',
    description: '',
    syntax: 'PRINTSUPPRESSVALUE = <number>;',
    source: 'gesstabs_handbuch_52.md:8956',
  },
  {
    name: 'PRINTWEIGHTPROTOCOL',
    description: '',
    syntax: 'PRINTWEIGHTPROTOCOL = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1057',
  },
  {
    name: 'PROFILELINES',
    description: '',
    syntax:
      'PROFILELINES = { LineDef }*n ;\nLineDef ::= | <number> : { LineQualifier }*n\nLineQualifier ::=[ HIDDEN | PATTERN <number>\n| COLOR <number> <number> <number>\n| WIDTH <number> | SYMBOL <number> SYMBOLWIDTH <number> ]',
    source: 'gesstabs_handbuch_52.md:16521',
  },
  {
    name: 'PROFILESCALE',
    description: '',
    syntax: 'PROFILESCALE = <start> <end> <increment>;',
    source: 'gesstabs_handbuch_52.md:16580',
  },
  {
    name: 'PROFILESORT',
    description: '',
    syntax:
      'PROFILESORT = [ <number> ] [ DESCEND ] ;\nDie PROFILE-Tabelle wird nach der in <number> festgelegten Datenspalte sortiert, im\nNormalfall aufsteigend; mit DESCEND kann die absteigende Variante gew�hlt werden. Die',
    source: 'gesstabs_handbuch_52.md:16570',
  },
  {
    name: 'PROJECTION',
    description:
      'absolute H�ufigkeitswerte: Summe der Gewichte, multipliziert mit dem PROJECTIONFACTOR Hiermit kann man eine Stichprobe anhand der gewichteten Verteilung auf die Grundgesamtheit hochrechnen. Der PROJECTIONFACTOR kann mit der Anweisung PROJECTIONFACTOR = <Wert>; gesetzt werden. Voreinstellung: 1.0.',
    source: 'gesstabs_handbuch_52.md:10805',
  },
  {
    name: 'PROJECTIONSUM',
    argsHint: '( Var )',
    description: "Darstellung der Summe von 'Var', multipliziert mit dem",
    source: 'gesstabs_handbuch_52.md:11048',
  },
  {
    name: 'PROTOCOLPAGE',
    description: '',
    syntax: 'PROTOCOLPAGE = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1038',
  },
  {
    name: 'QU',
    description:
      '| kombiniert mit | COLPERCANDCHIQU |     |     |     | COLPERCANDHYCHIQU | | -------------- | --------------- | --- | --- | --- | ----------------- | % | z-Test | COLPERCZ  |     |     |     |     | | ------ | --------- | --- | --- | --- | --- |',
    source: 'gesstabs_handbuch_52.md:11525',
  },
  {
    name: 'QUANTUMINCHARS',
    description: '',
    syntax: 'QUANTUMINCHARS = <filename>;',
    source: 'gesstabs_handbuch_52.md:16224',
  },
  {
    name: 'RANDOM',
    description:
      'RANDOM von einer negativen Zahl ist undefiniert. Der Aufruf COMPUTE xx = RANDOM( Max) mit einem positiven Argument "Max" liefert eine ganzzahlige Zufallszahl im Range 0 .. Max-1.',
    source: 'gesstabs_handbuch_52.md:7537',
  },
  {
    name: 'RANGE',
    description:
      'Mit dem Schl�sselwort RANGE k�nnen beliebige Bereiche angefordert und so eine Tabelle mit sehr vielen Auspr�gungen zerlegt werden. Zum Beispiel: TABLE = a BY b SORT ABSOLUTE DESCEND RANGE 1 20;',
    source: 'gesstabs_handbuch_52.md:9993',
  },
  {
    name: 'RANGES',
    description: '',
    syntax: 'RANGES [<VarList>] <ValueList> ;',
    source: 'gesstabs_handbuch_52.md:6705',
  },
  {
    name: 'RAWDATASTRING',
    description:
      'Kennzeichnung, um ungewichtete Tabellen von gewichteten zu unterscheiden. Wird direkt vor dem DOCUMENT ausgegeben.',
    syntax: 'RAWDATASTRING = "<Symbol>";\nVoreinstellung: RAWDATASTRING = "*";',
    source: 'gesstabs_handbuch_52.md:13186',
  },
  {
    name: 'RECHIPREFIX',
    description: '',
    syntax: 'RECHIPREFIX = "<Zeichenfolge>";',
    source: 'gesstabs_handbuch_52.md:12385',
  },
  {
    name: 'RECODE',
    description:
      'Umkodierung 255 (Voraussetzung: LABELRECODE 256 = YES;), wird bei LABELS COPY bzw. LABELS AS vererbt Beispiel f�r eine g�ltiges VALUELABELS-Statement mit LabelProperties: VALUELABELS V1 = OVERCODE 1:3 "Norden" SORTCLASS 1',
    syntax:
      'RECODE <recode> { / <recode> }*n [ ELSE = <number> ] ;\n<recode> ::= <valuelist> = < number >\n< valuelist > ::= [ <number> | <number> : <number> | <valuelist>',
    source: 'gesstabs_handbuch_52.md:5670',
  },
  {
    name: 'RECODELASTWINS',
    description: '',
    syntax: 'RECODELASTWINS = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:6610',
  },
  {
    name: 'REMOVELINEFEEDSFORCONTENT',
    description: '',
    syntax: 'REMOVELINEFEEDSFORCONTENT = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:13293',
  },
  {
    name: 'REPRINT',
    description: '',
    syntax: 'REPRINT TABLE = <tablename>;',
    source: 'gesstabs_handbuch_52.md:10038',
  },
  {
    name: 'RESPONSESTITLE',
    description:
      'Bezeichnung der RESPONSES-Spalte/-zeile (wenn TABLEBASE = RESPONSES; 388 gesetzt)',
    syntax: 'RESPONSESTITLE [ X | Y ] = "<text>";',
    source: 'gesstabs_handbuch_52.md:13135',
  },
  {
    name: 'RGB',
    description: '',
    syntax:
      'RGB = [ YES | NO ];\nBei RGB = NO; wertet GESStabs die numerische Farbinformation nach dem Hue-Saturation-\nBrightness-Modell 560. Setzt man RGB = YES;, werden die Zahlenwerte als Rot-/Gr�n-/Blau-',
    source: 'gesstabs_handbuch_52.md:14369',
  },
  {
    name: 'ROUND',
    description:
      '1alter 1000 1.Frage "1.Frage" alter+1 2000.1 Variablenlisten Viele Anweisungen operieren mit einer Liste von Variablen, kurz Varlist. Dies ist in der Syntaxbeschreibung der jeweiligen Anweisung durch <Varlist> gekennzeichnet. Eine Variablenliste besteht im einfachsten Fall aus einer Auflistung von Variablen, z.b: var1 var2 var3 var4 Oft ist es �konomischer, mit TO zu arbeiten.…',
    source: 'gesstabs_handbuch_52.md:465',
  },
  {
    name: 'ROUNDMODE',
    description: '',
    syntax: 'ROUNDMODE = [ CLASSIC | BANKERSROUNDMODE | SIMPLE ];',
    source: 'gesstabs_handbuch_52.md:9038',
  },
  {
    name: 'ROWCELLMINIMUM',
    description: '',
    syntax: 'ROWCELLMINIMUM = <value>;',
    source: 'gesstabs_handbuch_52.md:8871',
  },
  {
    name: 'ROWCHIQU',
    description:
      'Zeilenweise 4-Felder-Chiquadrattest auf Prozentwertunterschiede. Die Kennzeichnung erfolgt analog zu COLCHIQU 428 mit alphabetischer Zeilenkennzeichnung, A ist die erste Zeile, B die zweite, usw. Man kann mit INDEXCHARS 529 eigene Kennzeichen und Reihenfolgen definieren.',
    source: 'gesstabs_handbuch_52.md:11206',
  },
  {
    name: 'ROWELEMENTWINS',
    description:
      'Dies beeinflusst die Auswahl der CELLELEMENTS an Kreuzungspunkten, an denen sowohl f�r Zeilen als auch f�r Spalten explizite CELLELEMENTS definiert sind. a) In einer Tabelle werden zwei Variablen gekreuzt, bei denen jeweils labels mit eigenen CELLELEMENTS versehen sind, z.B.: LABELS A =',
    source: 'gesstabs_handbuch_52.md:13771',
  },
  {
    name: 'ROWMEANTEST',
    argsHint: '( Var )',
    description:
      'Wie MEANTEST 430, nur werden die Werte in den Zeilen gegeneinander getestet',
    source: 'gesstabs_handbuch_52.md:11213',
  },
  {
    name: 'ROWPERCENT100',
    description:
      'Nach Hare-Niemeyer-Modell modifizierte Zeilenprozentwerte (Summe ergibt 100), Achtung: nicht geeignet bspw. f�r Mehrfachnennungsvariablen und OVERCODEs, Tabellen mit unterdr�ckten MISSING VALUES und selektiv gebildete Variablen',
    source: 'gesstabs_handbuch_52.md:10872',
  },
  {
    name: 'ROWPERCENTINDEX',
    description:
      'Indexwerte zu den Zeilenprozenten (100 entspricht dem Wert in der Totalzeile)',
    source: 'gesstabs_handbuch_52.md:10879',
  },
  {
    name: 'ROWPERCEQUAL',
    description:
      'Testet alle Zeilenprozente in der Zeile auf Gleichheit; d.h. alle Abweichungen von der Ungleichverteilung werden als signifikant betrachtet. Hier besteht nat�rlich die M�glichkeit, sehr viele unsinnige Signifikanzen zu produzieren. Bitte mit Bedacht verwenden.',
    source: 'gesstabs_handbuch_52.md:11216',
  },
  {
    name: 'ROWPERCZ',
    description:
      'Signifikanztest (zeilenweise) f�r Prozentwertsunterschiede. ROWPERCZ basiert auf dem Z-Test f�r Prozentwerte. Erweiterter Z-Test mit Arcus-Sinus-Korrektur.',
    source: 'gesstabs_handbuch_52.md:11222',
  },
  {
    name: 'ROWS',
    description: '',
    syntax:
      'ROWS : [TOTALROW | <startrow>[: <endrow>]]\nCOLUMNS : [TOTALCOLUMN | <startcol>[: <endcol>]]',
    source: 'gesstabs_handbuch_52.md:3549',
  },
  {
    name: 'ROWSTRIPES',
    description:
      'Ist dieses TABLEFORMAT gesetzt, werden die Zeilen von TABLE- Tabellen farblich hinterlegt, und zwar abwechselnd mit den Farben, die in STRIPECOLORS 559 vereinbart wurde.',
    source: 'gesstabs_handbuch_52.md:13805',
  },
  {
    name: 'ROWSUMPERCENT',
    argsHint: '( Var )',
    description:
      'Ausgabe der Zeilenprozentuierung der Summe einer dritten Variablen, z.B. die Summe von Name Beschreibung Ausgaben f�r einen bestimmten Zweck in bestimmten Stadtteilen etc.',
    source: 'gesstabs_handbuch_52.md:10882',
  },
  {
    name: 'ROWTTEST',
    description:
      'Unabh�ngiger t-Test auf Mittelwertunterschiede auf Basis der gewichteten Daten, zeilenweise',
    source: 'gesstabs_handbuch_52.md:11226',
  },
  {
    name: 'SAMEPAGE',
    description:
      '= | COLUMNS 1:5 ROWS 65002 65003 ; GESSCHARTFORMAT = STROKERECT; GESSCHARTCOLORS = $AAFFAA $FFAAAA $AAAAFF $FFFFAA $AAFFFF; GESSCHART CHARTTITLE "Skalenmittelwerte Bewertung nach Modellen (vertikal)" INVERSE CHARTAREA 195 15 87 90 SAMEPAGE VERTICAL = | COLUMNS 1:5 ROWS 2/1 AXISMINMAX 0 4 ; GESSCHART CHARTTITLE "Anteil von \'sehr schlecht\'" INVERSE CHARTAREA 195 107 87 88 SAMEPAGE VERTICAL = |…',
    source: 'GESStabs_GESStabs-Artist.md:193',
  },
  {
    name: 'SCRIPTEXPORTFILE',
    description: '',
    syntax: 'SCRIPTEXPORTFILE = [ APPEND ] <filename>;',
    source: 'gesstabs_handbuch_52.md:16946',
  },
  {
    name: 'SECONDMEAN',
    argsHint: '( Var )',
    description:
      'Zweiter Mittelwert. Wenn in einer Zelle die Mittelwerte von zwei verschiedenen Variablen ausgegeben werden sollen, muss die zweite Variable �ber SECONDMEAN angefordert werden.',
    source: 'gesstabs_handbuch_52.md:10959',
  },
  {
    name: 'SECONDSUM',
    argsHint: '( Var )',
    description:
      '2. Summe. Wenn in einer Zelle die Summen von zwei verschiedenen Variablen ausgegeben werden sollen, muss die zweite Variable �ber SECONDSUM angefordert werden.',
    source: 'gesstabs_handbuch_52.md:11051',
  },
  {
    name: 'SELECT',
    description: '',
    syntax:
      'SELECT <Bedingung>;\nAlle RECODE-, RANGES-, COMPUTE- oder IF-Anweisungen werden vor SELECT durchgef�hrt;',
    source: 'gesstabs_handbuch_52.md:8614',
  },
  {
    name: 'SETDECIMALS',
    description: '',
    syntax: 'SETDECIMALS < Varlist > = <number>;',
    source: 'gesstabs_handbuch_52.md:14669',
  },
  {
    name: 'SETFILTER',
    description: '',
    syntax:
      'SETFILTER [ <filtername> ] [ TEXT "filtertext" ] = < log. Bedingung > ;\nENDFILTER [ <filtername> ] ;\nCOPYFILTER <varname> = <varname>;',
    source: 'gesstabs_handbuch_52.md:8721',
  },
  {
    name: 'SETMISSING',
    description: '',
    syntax: 'SETMISSING <Varlist> = { number }*n;',
    source: 'gesstabs_handbuch_52.md:6227',
  },
  {
    name: 'SHADE',
    description: '',
    syntax: 'SHADE <boxname> = <number> ;',
    source: 'gesstabs_handbuch_52.md:14346',
  },
  {
    name: 'SHEETNAME',
    description:
      'die folgende Tabelle erscheint Allen Elementen kann man einen Office-Font und Farben zuordnen. NoAutoTableTitle NOAUTOTABLETITLE nimmt Einfluss auf die Voreinstellung, die jede Tabelle in eine OFFICECONTENTPAGE eintr�gt. Hierf�r wird der CONTENTKEY verwendet, und wenn dieser nicht vorhanden ist, wird als Default der TABLETITLE verwendet.…',
    source: 'gesstabs_handbuch_52.md:3393',
  },
  {
    name: 'SHEETNUMBERCHAR',
    description: '',
    syntax: 'SHEETNUMBERCHAR = <char>;',
    source: 'gesstabs_handbuch_52.md:3661',
  },
  {
    name: 'SHRINKDATAFONT',
    description:
      'Die Ausgaben von CELLELEMENTS in Tabellen werden grunds�tzlich in einer Zeile dargestellt und nicht umgebrochen. Bei sehr ausgiebigen Signifikanztests mit niedrigem Signifikanzniveau k�nnen in Abh�ngigkeit vo der Gr��e des eingestellten Fonts Aneinanderreihungen von Buchstaben entstehen, die bei schmalen Spalten den verf�gbaren Platz �berschreiten.…',
    source: 'gesstabs_handbuch_52.md:13809',
  },
  {
    name: 'SIGNIF20AND10',
    description:
      'ABC... f�r 10%-Niveau, abc.... f�r 20%-Niveau Beschreibung der Signifikanzen F�r alle oben benannten Optionen (Signifikanzniveaus) existieren Standardtexte, die das jeweilige Signifikanznivau beschreiben. SignifText Die SIGNIFTEXT-Anweisung dient dazu, diesen Standardtext anzupassen.…',
    source: 'gesstabs_handbuch_52.md:11980',
  },
  {
    name: 'SIGNIFLEVEL',
    description: '',
    syntax: 'SIGNIFLEVEL = <option>;',
    source: 'gesstabs_handbuch_52.md:11916',
  },
  {
    name: 'SIGNIFMINEFFECTCHIQ',
    description: '',
    syntax: 'SIGNIFMINEFFECTCHIQ = <value>;\nSIGNIFMINEFFECTTTEST = <value>;',
    source: 'gesstabs_handbuch_52.md:11877',
  },
  {
    name: 'SIGNIFTEXT',
    description:
      'Anpassung des Standardtextes zur Beschreibung der SIGNIFLEVEL 454-',
    syntax: 'SIGNIFTEXT <option> = "Text zur Kennzeichnung";',
    source: 'gesstabs_handbuch_52.md:13482',
  },
  {
    name: 'SINGLEFROMSTRING',
    description: '',
    syntax: 'SINGLEFROMSTRING = <newvar> = <alphavar>;',
    source: 'gesstabs_handbuch_52.md:16994',
  },
  {
    name: 'SINGLEQ',
    description: '',
    syntax: 'SINGLEQ <varname> = [ TITLE "Titelstring" ] OPEN;',
    source: 'gesstabs_handbuch_52.md:5382',
  },
  {
    name: 'SIZE',
    description:
      '; Ist die Option MISSING definiert, werden alle Variablen mit MISSING VALUES ausgegeben. Bei EXCLUDEVALUES und RESTRICTVALUES wird eine Liste der betroffenen Variablen mit den vorgefundenen EXCLUDEVALUES bzw. RESTRICTVALUES ausgegeben. POSTPONE ist ein Spezial-Option im Zusammenhang mit INVERTOUT 94 :…',
    syntax: 'SIZE X/Y <points>',
    source: 'gesstabs_handbuch_52.md:1159',
  },
  {
    name: 'SLICE',
    description:
      'Mit SLICE kann man eine Tabelle in der Y-Richtung in die erforderliche Anzahl',
    source: 'gesstabs_handbuch_52.md:9974',
  },
  {
    name: 'SLICEHEADERFIRST',
    description: '',
    syntax:
      'SLICEHEADERFIRST = [ YES | NO ];\nBei SLICEHEADERFIRST=YES; werden zun�chst alle Teile des Kopfes (in der X-Richtung',
    source: 'gesstabs_handbuch_52.md:13910',
  },
  {
    name: 'SLICELASTPAGE',
    description:
      'Bei auf der Y-Achse zusammengesetzten Tabellen mit SLICE 543 bzw. LINESLICE wird im Standardfall der Mittelwert (oder andere Werte) auf jeder Seite ausgegeben. Mit diesem',
    source: 'gesstabs_handbuch_52.md:13819',
  },
  {
    name: 'SLICESTATISTICS',
    description: '',
    syntax: 'SLICESTATISTICS = <number>;',
    source: 'gesstabs_handbuch_52.md:13879',
  },
  {
    name: 'SORT',
    description: '',
    syntax: 'SORT AS = [ XVALID | YVALID ];',
    source: 'gesstabs_handbuch_52.md:12760',
  },
  {
    name: 'SORTCLASS',
    description: 'Vergabe einer Sortierklasse, siehe Sortierungen 466',
    syntax: 'SORTCLASS <varname> LABELS <number> [ <number> ... ] = <number> ;',
    source: 'gesstabs_handbuch_52.md:5637',
  },
  {
    name: 'SPACE',
    description:
      'leere Zelle (wird z.B. ben�tigt, um leere Zeilen bzw. Spalten in Tabellen f�r Name Beschreibung PowerPoint 202 zu erzeugen) Inkompatibilit�ten unter Zellinhalten Aufgrund der internen Speicherstrukturen gibt es einige Inkompatibilit�ten unter Zellinhalten:…',
    source: 'gesstabs_handbuch_52.md:11420',
  },
  {
    name: 'SPLITCHAR',
    description:
      'Erlaubt an der Stelle eine Worttrennung (flexibel). Voreinstellung: -',
    source: 'gesstabs_handbuch_52.md:13367',
  },
  {
    name: 'SPLITCHARSTAY',
    description:
      "Erlaubt ebenfalls eine Worttrennung, wird aber auch dann als Bindestrich gedruckt, wenn er nicht am Zeilenende steht (fest). Voreinstellung: # Diese Zeichen k�nnen umdefiniert werden. Es ist allerdings zu bedenken, dass man dann ggf. auch Systemstandardtexte �ndern muss. Zum Beispiel den TOTALTITLE: 'Ins-ge-samt':…",
    source: 'gesstabs_handbuch_52.md:13370',
  },
  {
    name: 'SPSS',
    description: '',
    syntax: 'SPSS [ ASCIIOUT ] = <filename>;',
    source: 'gesstabs_handbuch_52.md:1784',
  },
  {
    name: 'SPSSALPHALENGTH',
    description: '',
    syntax: 'SPSSALPHALENGTH = <number>;',
    source: 'gesstabs_handbuch_52.md:1697',
  },
  {
    name: 'SPSSFILTERMISSING',
    description: '',
    syntax: 'SPSSFILTERMISSING = <number>;',
    source: 'gesstabs_handbuch_52.md:1673',
  },
  {
    name: 'SPSSGLOBALSEQUENCE',
    description: '',
    syntax: 'SPSSGLOBALSEQUENCE = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1807',
  },
  {
    name: 'SPSSGROUP',
    description: '',
    syntax: 'SPSSGROUP <name> = <familyvarname>;',
    source: 'gesstabs_handbuch_52.md:7045',
  },
  {
    name: 'SPSSGROUPLABELS',
    description: '',
    syntax:
      'SPSSGROUPLABELS = [ YES | NO ];\nSPSSGROUPLABEL1 = <TEXT>;\nSPSSGROUPLABEL0 = <TEXT>;',
    source: 'gesstabs_handbuch_52.md:7072',
  },
  {
    name: 'SPSSINFILE',
    description: '',
    syntax:
      'SPSSINFILE [ FILEKEY <key> ] = <filepath>;\nCSVINFILE [ FILEKEY <key> ] [ <delimchar> ] = <filepath>;\nDATAFILE [ FILEKEY <key> ] = <filepath>;\nOPENQFILE [ FILEKEY <key> ] [ ALLOWEMPTY ] = <filepath>;\nASSOCFILE [ FILEKEY <filekey> ] [ BIG DBASEIN SPSS ] =\n<filename> KEY <keyvar> [ <start> <len> ] | [ keyField ] ;',
    source: 'gesstabs_handbuch_52.md:1468',
  },
  {
    name: 'SPSSIO',
    description:
      'Dynamic Link Library-Dateien (DLL), die IBM zum Lesen, Verarbeiten und Schreiben von SPSS- Dateien bereitstellt. 3. Laden Sie die Dateien aus dem Ordner �SPSSIO� in der 32- oder 64-bit-Version aus unserem Download-Center herunter. 4. Speichern Sie die Dateien in Ihrem GESS\\tabs-Verzeichnis. Lizenzierung 5.…',
    source: 'gesstabs_handbuch_52.md:214',
  },
  {
    name: 'SPSSLONGNAMES',
    description: '',
    syntax: 'SPSSLONGNAMES = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1712',
  },
  {
    name: 'SPSSNORECODEDLABELS',
    description: '',
    syntax: 'SPSSNORECODEDLABELS = [ YES | NO ]:',
    source: 'gesstabs_handbuch_52.md:1667',
  },
  {
    name: 'SPSSOUTFILE',
    description: '',
    syntax: 'SPSSOUTFILE = <filename>;',
    source: 'gesstabs_handbuch_52.md:1619',
  },
  {
    name: 'SPSSOUTSUBFILE',
    description: '',
    syntax:
      'SPSSOUTSUBFILE <internal_name> <varnamelist> = <spss_filename> ;\nSTORESPSSSUBFILE = <internal_name> ;',
    source: 'gesstabs_handbuch_52.md:1744',
  },
  {
    name: 'SPSSPRINTFORMAT',
    description: '',
    syntax: 'SPSSPRINTFORMAT = <spss-formatcode> <width> <decimals> ;',
    source: 'gesstabs_handbuch_52.md:1717',
  },
  {
    name: 'SPSSREADMULT',
    description: '',
    syntax: 'SPSSREADMULT = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1602',
  },
  {
    name: 'SPSSVARLABTOTEXT',
    description: '',
    syntax: 'SPSSVARLABTOTEXT = [ YES | NO | COPY ];',
    source: 'gesstabs_handbuch_52.md:1564',
  },
  {
    name: 'SPSSWEIGHTOUT',
    description: '',
    syntax: 'SPSSWEIGHTOUT = <varname>;',
    source: 'gesstabs_handbuch_52.md:1654',
  },
  {
    name: 'SPSSWRITEMULT',
    description: '',
    syntax: 'SPSSWRITEMULT = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1644',
  },
  {
    name: 'SQUARE1',
    description: 'Quadrat (auf der Basis stehend)',
    source: 'gesstabs_handbuch_52.md:4996',
  },
  {
    name: 'SQUARE1O',
    description: 'Quadrat (auf der Basis stehend) als Outline',
    source: 'gesstabs_handbuch_52.md:5000',
  },
  {
    name: 'SQUARE2',
    description: 'Quadrat (auf der Spitze stehend)',
    source: 'gesstabs_handbuch_52.md:4998',
  },
  {
    name: 'SQUARE2O',
    description: 'Quadrat (auf der Spitze stehend) als Outline',
    source: 'gesstabs_handbuch_52.md:5002',
  },
  {
    name: 'STATIC',
    description: '',
    syntax: 'STATIC <varlist> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5530',
  },
  {
    name: 'STATTESTDUMP',
    description: '',
    syntax: 'STATTESTDUMP = <filename> ;',
    source: 'gesstabs_handbuch_52.md:12083',
  },
  {
    name: 'STDDEV',
    description:
      'STDDEV errechnet die Standardabweichung einer Variable oder Variablenliste �ber alle F�lle des Datensatzes.',
    syntax: 'STDDEV <varname> = <varlist>;',
    source: 'gesstabs_handbuch_52.md:8231',
  },
  {
    name: 'STDSIGNIFICANCE',
    description:
      '454 Steht dieser Schalter auf YES, dann wird immer dann, wenn ein SIGNIFLEVEL 454 gesetzt ist und ein spaltenweiser Signifikanztest vorliegt, im BOTTOMTEXT 520 der entsprechende Signifikanztext ausgegeben. Gibt es keinen BOTTOMTEXT, wird einer erzeugt.…',
    source: 'gesstabs_handbuch_52.md:12001',
  },
  {
    name: 'STOREALPHA',
    description: '',
    syntax: 'STOREALPHA <varlist> = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:5549',
  },
  {
    name: 'STORELANGUAGE',
    description: '',
    syntax: 'STORELANGUAGE <sprache> = <filename>;',
    source: 'gesstabs_handbuch_52.md:6037',
  },
  {
    name: 'STORETOCSV',
    description: '',
    syntax:
      'STORETOCSV = [ ALL | <varlist> ];\nDie als <varlist> deklarierten Variablen werden in der Reihenfolge ihrer Angabe in den',
    source: 'gesstabs_handbuch_52.md:1955',
  },
  {
    name: 'STORETOSPSS',
    description: '',
    syntax: 'STORETOSPSS = <varlist>;',
    source: 'gesstabs_handbuch_52.md:1635',
  },
  {
    name: 'STRICTINPUTCHECK',
    description: '',
    syntax: 'STRICTINPUTCHECK = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15761',
  },
  {
    name: 'STRICTVARLIST',
    description: '',
    syntax: 'STRICTVARLIST = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1241',
  },
  {
    name: 'STRIPECOLORS',
    description: '',
    syntax:
      "STRIPECOLORS = <color> <color> ;\nMit '<color>' definiert man die Farben, in denen die Zeilen bzw. Spalten in Tabellen vom Typ",
    source: 'gesstabs_handbuch_52.md:14320',
  },
  {
    name: 'STROKERECT',
    description: 'Umrandung zu RETANGLES zeichnen',
    source: 'gesstabs_handbuch_52.md:4970',
  },
  {
    name: 'STYLEFILE',
    description: '',
    syntax: 'STYLEFILE = <filename>;',
    source: 'gesstabs_handbuch_52.md:2704',
  },
  {
    name: 'SUM',
    argsHint: '( Var )',
    description: "Darstellung der Summe von 'Var'",
    syntax: 'SUM <varname> = <Varlist>;',
    source: 'gesstabs_handbuch_52.md:11055',
  },
  {
    name: 'SUMMISSING',
    description:
      'MIN, MAX 314Minimal-/ Maximalwert + Option zur Angabe der Variable mit Minimal-/Maximalwert mittels MININDEX/ MAXINDEX 314 STDDEV 315 Standardabweichung VARIANCE 315Varianz Mean MEAN erlaubt eine einfache Berechnung des Mittelwerts aus mehreren Variablen innerhalb eines Falles.',
    syntax: 'SUMMISSING = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:8166',
  },
  {
    name: 'SUMPERCENT',
    argsHint: '( Var, BasisVar )',
    description:
      "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Summe von 'Var' wird als prozentualer Anteil an der Summe von 'BasisVar' ausgegeben.",
    source: 'gesstabs_handbuch_52.md:10891',
  },
  {
    name: 'SUMQUOTIENT',
    argsHint: '( Var, BasisVar )',
    description:
      "Aus 'Var' und 'BasisVar' werden die Summen berechnet. Die Summe von 'Var' wird als Anteil an der Summe von 'BasisVar' ausgegeben.",
    source: 'gesstabs_handbuch_52.md:10896',
  },
  {
    name: 'SUPPRESSEMPTYSHEET',
    description: '',
    syntax: 'SUPPRESSEMPTYSHEET = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:3302',
  },
  {
    name: 'SUPPRESSEMPTYTABLE',
    description: '',
    syntax: 'SUPPRESSEMPTYTABLE = [ NO | YES | STRUCTURE ];',
    source: 'gesstabs_handbuch_52.md:8917',
  },
  {
    name: 'SUPPRESSGRIDLINES',
    description: '',
    syntax: 'SUPPRESSGRIDLINES : [YES|NO]',
    source: 'gesstabs_handbuch_52.md:3029',
  },
  {
    name: 'SUPPRESSIFLESS',
    description: '',
    syntax:
      'SUPPRESSIFLESS < cellelement> <place> <typ> = <value>;\nplace ::= < DATACELL | FRAMECELL X | FRAMECELL Y >\ntyp ::= < ABSOLUTE | PHYSICALRECORDS | VALIDN | VALIDPHYS | ESS >\nMan kann sich mit "<place>" dabei auf die Tabellenzelle selbst beziehen, oder auf die',
    source: 'gesstabs_handbuch_52.md:8878',
  },
  {
    name: 'SUPPRESSLABEL',
    description:
      'Wenn eine Variable eine Konstante ist (d.h. sie hat empirisch nur eine Auspr�gung), kann es aus optischen Gr�nden sinnvoll sein, den Labeltext zu unterdr�cken. Dies kann man mit SUPPRESSLABEL erreichen. (Hat nur bei Postscript-Ausgabe Effekt.)',
    source: 'gesstabs_handbuch_52.md:13831',
  },
  {
    name: 'SUPPRESSSPSSWARNINGS',
    description: '',
    syntax: 'SUPPRESSSPSSWARNINGS = [ ALPHA | VARLABEL | VALUELABELS ] ;',
    source: 'gesstabs_handbuch_52.md:1350',
  },
  {
    name: 'SWAP',
    description: 'Reihenfolge der graphischen Darstellung invertieren',
    source: 'gesstabs_handbuch_52.md:4685',
  },
  {
    name: 'SWAPLEGEND',
    description:
      'Reihenfolge der Legendentexte invertieren <alle GESSCHARTFORMAT- Alle Argumente des Argumente> GESSCHARTFORMAT 198-Statements k�nnen an dieser Stelle auch als Optionen f�r das aktuelle Chart angegeben werden. = {',
    source: 'gesstabs_handbuch_52.md:4688',
  },
  {
    name: 'SWITCHLANGUAGE',
    description: '',
    syntax: 'SWITCHLANGUAGE = <Sprachbezeichnung>;',
    source: 'gesstabs_handbuch_52.md:6045',
  },
  {
    name: 'SYMBOL',
    description: 'Die Linie wird nicht gezeigt',
    source: 'gesstabs_handbuch_52.md:16539',
  },
  {
    name: 'SYMBOLSIZE',
    description:
      '; GESSCHARTFONT CHARTNUMBERS = "Helvetica-Bold" SIZE 8; GESSCHARTFORMAT = NUMCENTERGRAPH NOFRAME NOSCALE OVERLAPPED WHITENUMBERS; GESSCHARTCOLORS = $229955 AA5577; GESSCHART CHARTTITLE "Gegenläufige Linien: Top-2-Box nach links + grün, Bottom-2-Box nach rechts + rot, Zahlen in weiß zentral in den Kreisen bzw.…',
    source: 'GESStabs_GESStabs-Artist.md:324',
  },
  {
    name: 'SYNOPSIS',
    description: '',
    syntax: 'SYNOPSIS = <filename>;',
    source: 'gesstabs_handbuch_52.md:2727',
  },
  {
    name: 'SYNTAX',
    description: '',
    syntax:
      'SYNTAX { [ POSTPONE ] [ VARIABLES | LABELS | VARTITLE\n| VALUELABELS | MISSING | EXCLUDEVALUES | RESTRICTVALUES|\nMULTIDEF | FORMAT ]}*n = <filename>;\nSYNTAXVARNAMENOQUOTES = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1078',
  },
  {
    name: 'TABLE',
    description: '',
    syntax: 'TABLE [ taboptions ] = <parts> BY <parts>;\ntaboptions ::=\n[\nADD\nNAME <tablename>\nTITLE <tabletitle>\nCELLELEMENTS ( <cellelements> )\nFRAMEELEMENTS ( <frameelements> )\nTABLEFORMATS ( <tableformats> )\nCONTENTKEY <contentkey>\nHIDDEN ( <medium> )\n]\n\nparts ::= part { part }*n\npart ::= content [ filter ] [ option ]\n\ncontent ::=\n[\n<constant> |\n<varname> |\n<cellelement> ( <varname> [ <varname> ] ) |\n<cellelement> ( <varname> [ <varname> ] BY <varname> )\n:DESCRIPTION\n:USEVARTITLE\n:FORMAT\n] \n\nfilter ::= FILTER <bedingung> |\n\noption ::= SORT sortcontent [ sortpane ] [ cut ]\n\nsortcontent ::= sorttype [ DESCEND ]\nsorttype ::= [ POSITION | ALPHA | CODE | Cellelement ]\nsortpane ::= PANE <value> CODE <value>\n\ncut ::=\n[\nTOP <value > [ SLICE <value> ] |\nBOTTOM <value> |\nEXTREME <value> |\nSLICE <value> |\nLSLICE <value> |\nRANGE <value> <value>\n]',
    source: 'gesstabs_handbuch_52.md:9513',
  },
  {
    name: 'TABLEBASE',
    description: '',
    syntax: 'TABLEBASE = [ CASES | RESPONSES ];',
    source: 'gesstabs_handbuch_52.md:10017',
  },
  {
    name: 'TABLECOUNTSWITCH',
    description: '',
    syntax:
      'TABLECOUNTSWITCH = [ NOADDINFRAMEX | NOADDINFRAMEY | NOADDINFRAMETTL ];',
    source: 'gesstabs_handbuch_52.md:10187',
  },
  {
    name: 'TABLEFILTER',
    description: '',
    syntax: 'TABLEFILTER <number> = TEXT "<text>" <Bedingung>;',
    source: 'gesstabs_handbuch_52.md:8696',
  },
  {
    name: 'TABLEFILTERBYCODE',
    description: '',
    syntax:
      'TABLEFILTERBYCODE <NUMBER> = [ <options> ] <VARIABLE> ( <CODE> ) ;\n<options> ::= [ VARTITLE | NOMISSING | SUPPRESSOVERCODES | USELABELS ] <options>',
    source: 'gesstabs_handbuch_52.md:8711',
  },
  {
    name: 'TABLEFORMAT',
    description: '',
    syntax: 'TABLEFORMAT +/- AUTOSORTTREE;',
    source: 'gesstabs_handbuch_52.md:12327',
  },
  {
    name: 'TABLEFORMATS',
    argsHint: '( <tableformats> )',
    description:
      'CONTENTKEY <text> ] rowdescriptor ::= [ VARIABLE <localvarname> [ <sortoptions> [ : <condition> ] | OVERCODE <localvarname> [ <values> ] <labeltext> | STATISTICS <text> <cellelement> ( <localvarname> ) [ <printoptions> ] ] sortoptions ::= siehe die SORT Optionen des TABLE-statements condition ::= jede nach GESS Syntax korrekte Bedingung printoptions ::= [ : USEFONT <fontname> [ SIZE <size> ] | :…',
    source: 'gesstabs_handbuch_52.md:17038',
  },
  {
    name: 'TABLENUMBER',
    description: 'Definiert die Anfangsnummer einer Tabellennumerierungsfolge.',
    syntax: 'TABLENUMBER = <number>;\nVoreinstellung: TABLENUMBER = 1;',
    source: 'gesstabs_handbuch_52.md:13516',
  },
  {
    name: 'TABLETITLE',
    description: '',
    syntax: 'TABLETITLE = "<text>";',
    source: 'gesstabs_handbuch_52.md:13051',
  },
  {
    name: 'TABSELECT',
    description: '',
    syntax: 'TABSELECT <Bedingung>;',
    source: 'gesstabs_handbuch_52.md:8638',
  },
  {
    name: 'TABSELECTBYCODE',
    description: '',
    syntax:
      'TABSELECTBYCODE [ <options> ] <VARIABLE> ( <CODE> );\n<options> ::= [ VARTITLE | NOMISSING | SUPPRESSOVERCODES\n| USELABELS ] <options>',
    source: 'gesstabs_handbuch_52.md:8655',
  },
  {
    name: 'TABULATE',
    description: '',
    syntax:
      'TABULATE [ INVERSE ] = <tablepart> { / <tablepart> }*n;\nHEADERS = <tablepart> { / <tablepart> }*n;\nAlle Elemente aus TABULATE werden gegen alle K�pfe in HEADERS tabelliert; dabei erscheinen',
    source: 'gesstabs_handbuch_52.md:10053',
  },
  {
    name: 'TESTCOLUMNS',
    description: '',
    syntax:
      'TESTCOLUMNS = { Testdefinition }*n;\nTestdefinition ::= | VARIABLE <varno> CODE <code>\n: VARIABLE <varno> CODE <code>',
    source: 'gesstabs_handbuch_52.md:11814',
  },
  {
    name: 'TEXTBOXFORMAT',
    description:
      'Dieses TABLEFORMAT schaltet die Funktionen des LOCALTEXTFORMAT 564s ein/aus.',
    source: 'gesstabs_handbuch_52.md:13837',
  },
  {
    name: 'TEXTROWHEIGHT',
    description: '',
    syntax: 'TEXTROWHEIGHT <box> : <pixels>\n<box> ::= eine Box',
    source: 'gesstabs_handbuch_52.md:3049',
  },
  {
    name: 'TEXTTABLE',
    description: '',
    syntax: 'TEXTTABLE;',
    source: 'gesstabs_handbuch_52.md:10077',
  },
  {
    name: 'TEXTTOPDISTANCE',
    description: '',
    syntax: "TEXTTOPDISTANCE = <number>;\n'<number>' = typographische Punkte",
    source: 'gesstabs_handbuch_52.md:14218',
  },
  {
    name: 'TEXTTOSPSSVARLAB',
    description: '',
    syntax: 'TEXTTOSPSSVARLAB = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:1684',
  },
  {
    name: 'TEXTWRAP',
    description:
      'Im Standardfall werden die Texte von Variablen in Tabellen genauso ausgegeben, wie man sie definiert hat. Mit TEXTWRAP kann man anfordern, dass die Zeilen in den Textboxes umgebrochen werden.',
    source: 'gesstabs_handbuch_52.md:13840',
  },
  {
    name: 'THOUSANDS',
    description: '',
    syntax: 'THOUSANDS <cellelement> : [ YES | NO ]',
    source: 'gesstabs_handbuch_52.md:3076',
  },
  {
    name: 'TITLEPAGE',
    description: '',
    syntax:
      'TITLEPAGE ::= { | element }*n ;\nCHAPTERPAGE::= { | element }*n ;\nelement ::= { text | line | drawbox | titlebox | eps }\ntext ::= TEXT { textoption }*n x y <text>\ntextoption ::= : [ font | color ]\nfont ::= USEFONT <fontname> SIZE <number>',
    source: 'gesstabs_handbuch_52.md:15321',
  },
  {
    name: 'TOP',
    description:
      'Die Tabellenausgabe kann auf bestimmte Teile beschr�nkt werden: Es k�nnen',
    source: 'gesstabs_handbuch_52.md:9963',
  },
  {
    name: 'TOPTEXT',
    description: 'Textbox am oberen Rumpf der Tabelle',
    syntax: 'TOPTEXT = "<text>";',
    source: 'gesstabs_handbuch_52.md:13061',
  },
  {
    name: 'TOTALCOLU',
    description:
      'Ausgewertete F�lle aller Werte (wie in CELLELELEMENTS 418 definiert) in der',
    source: 'gesstabs_handbuch_52.md:10731',
  },
  {
    name: 'TOTALPERCENT',
    description: 'Prozentuierung aller Zellen auf das Tabellen- Gesamt-N.',
    source: 'gesstabs_handbuch_52.md:10900',
  },
  {
    name: 'TOTALROW',
    description:
      'Ausgewertete F�lle aller Werte (wie in CELLELELEMENTS 418 definiert) in der Zeile Beispiel: FRAMEELEMENTS = ABSCOLUMN ABSROW TOTALCOLUMN; Mit FRAMEELEMENTS =; CELLELEMENTS = ABSOLUTE; wird z.B. eine Tabelle erzeugt, die zwar die absoluten H�ufigkeiten in den Zellen zeigt, die aber keinerlei Randverteilungen enth�lt.…',
    source: 'gesstabs_handbuch_52.md:10735',
  },
  {
    name: 'TOTALSUMPERCENT',
    argsHint: '( Var )',
    description:
      'Ausgabe der Prozentuierung der Summe einer dritten Variablen auf die Gesamtsumme in der Tabelle',
    source: 'gesstabs_handbuch_52.md:10903',
  },
  {
    name: 'TOTALTITLE',
    description: 'Bezeichnung der Totalspalte-/zeile',
    syntax: 'TOTALTITLE [ X | Y ] = "<text>";',
    source: 'gesstabs_handbuch_52.md:13113',
  },
  {
    name: 'TRANSFERSUPPRESSEDCONTENTKEY',
    description: '',
    syntax: 'TRANSFERSUPPRESSEDCONTENTKEY = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:15297',
  },
  {
    name: 'TRANSLATE',
    description:
      '| TRANSLATE |                          | <postcriptfontname> |     |     | :   | <excelfontname> |     |     |     |     |     |     | | --------- | ------------------------ | ------------------- | --- | --- | --- | --------------- | --- | --- | --- | --- | --- | --- | | [OPTION   | [BOLD|ITALIC|UNDERLINE]] |                     |     |     |     |                 |     |     |     |     |     |…',
    syntax:
      'TRANSLATE <postcriptfontname> : <excelfontname>\n[OPTION [BOLD|ITALIC|UNDERLINE]]',
    source: 'gesstabs_handbuch_52.md:2907',
  },
  {
    name: 'TRIANGLE1',
    description:
      'Skalenwert mit einem Dreieck markieren (auf der Basis stehend)',
    source: 'gesstabs_handbuch_52.md:4981',
  },
  {
    name: 'TRIANGLE1O',
    description: 'Dreieck (auf der Basis stehend) als Outline',
    source: 'gesstabs_handbuch_52.md:4987',
  },
  {
    name: 'TRIANGLE2',
    description:
      'Skalenwert mit einem Dreieck markieren (auf der Spitze stehend)',
    source: 'gesstabs_handbuch_52.md:4984',
  },
  {
    name: 'TRIANGLE2O',
    description: 'Dreieck (auf der Spitze stehend) als Outline',
    source: 'gesstabs_handbuch_52.md:4989',
  },
  {
    name: 'TRIMSTRINGS',
    description: '',
    syntax: 'TRIMSTRINGS = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:13303',
  },
  {
    name: 'TRUNC',
    description:
      'Vor der Berechnung werden beide Argumente mittels TRUNC in Ganze Werte gewandelt. D.h.',
    source: 'gesstabs_handbuch_52.md:7579',
  },
  {
    name: 'TRUNCATEDECIMALS',
    description: '',
    syntax: 'TRUNCATEDECIMALS <varlist> = <number>;\n<number> ::= -9 .. 9;',
    source: 'gesstabs_handbuch_52.md:14677',
  },
  {
    name: 'TTEST',
    description:
      'Unabh�ngiger t-Test auf Mittelwertunterschiede auf Basis der gewichteten Daten, spaltenweise Name Beschreibung',
    source: 'gesstabs_handbuch_52.md:11229',
  },
  {
    name: 'TTESTABSMIN',
    description: '',
    syntax: 'TTESTABSMIN = <number>;\nTTESTPHYSMIN = <number>;',
    source: 'gesstabs_handbuch_52.md:11862',
  },
  {
    name: 'TTESTCUT',
    argsHint: '( Var )',
    description:
      'Unabh�ngiger t-Test auf Mittelwertsunterschiede, berechnet auf Basis der Datenreduktion wie bei MEANCUT 423',
    source: 'gesstabs_handbuch_52.md:11236',
  },
  {
    name: 'UNITS',
    description: '',
    syntax: 'UNITS = [ MM | POINTS | INCH ];',
    source: 'gesstabs_handbuch_52.md:13921',
  },
  {
    name: 'UPDATEINVERT',
    description: '',
    syntax: 'UPDATEINVERT;',
    source: 'gesstabs_handbuch_52.md:2504',
  },
  {
    name: 'USE3D',
    description: '',
    syntax: 'USE3D : [YES | NO]',
    source: 'gesstabs_handbuch_52.md:3535',
  },
  {
    name: 'USECASES',
    description: '',
    syntax:
      'USECASES = [ ANYCASE | XANDYVALID | XORYVALID | XVALID | YVALID ] ;',
    source: 'gesstabs_handbuch_52.md:6328',
  },
  {
    name: 'USEFONT',
    description:
      'Der zu verwendende Font LEFT | RIGHT | HCENTER Horizontale Ausrichtung des Textes TOP | BOTTOM | VCENTER Vertikale Ausrichtung des Textes Jede dieser Optionen hat eine eigene Syntax: Nach einer USEFONT-Option z.B. m�ssen Name und Gr��e eines g�ltigen Fonts stehen, nach dem Schl�sselwort LINEWIDTH muss zwingend eine Zahl stehen usw..…',
    syntax:
      'USEFONT <Zielname> = <Fontname> SIZE <number>; (PS)\nUSEFONT <Zielname> = <Fontname>; (Non-PS)',
    source: 'gesstabs_handbuch_52.md:15364',
  },
  {
    name: 'USELABELS',
    description:
      "unterdr�ckt Werte von '<code>', denen kein Labeltext entspricht",
    source: 'gesstabs_handbuch_52.md:8664',
  },
  {
    name: 'USEMISSING',
    description: '',
    syntax:
      'USEMISSING = [ YES | NO ];\nVoreinstellung: USEMISSING = NO;\nDurch USEMISSING = YES; kann f�r alle folgenden Tabellen die Auswertung auch der',
    source: 'gesstabs_handbuch_52.md:6297',
  },
  {
    name: 'USEOPENASCODE',
    description: '',
    syntax:
      'USEOPENASCODE <varlist> = [ YES | NO ];\nSteht dieser Schalter auf YES, dann wird versucht, die offene Antwort f�r die in <varlist>',
    source: 'gesstabs_handbuch_52.md:17002',
  },
  {
    name: 'USEVISIBLEDIGITSNONLY',
    description: '',
    syntax: 'USEVISIBLEDIGITSNONLY = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:8478',
  },
  {
    name: 'USEWEIGHT',
    description: '',
    syntax: 'USEWEIGHT = [ YES | NO | <varname> ] ;',
    source: 'gesstabs_handbuch_52.md:12988',
  },
  {
    name: 'VALIDN',
    description:
      "Zahl der F�lle, f�r die ein g�ltiger Wert der '<bestehende_variable>' gefunden wurde",
    source: 'gesstabs_handbuch_52.md:8254',
  },
  {
    name: 'VALUELABELS',
    description:
      'ein Fehler ausgegeben, wenn man Syntaxvarianten ohne explizite Variablennennung benutzt. Zum Beispiel: COMPUTE f222 = Q17_1; VARTITLE = "ehemals Q17_1"; Das \'=\' hinter VARTITLE w�rde die Fehlermeldung ausl�sen. Zum Hintergrund: Anweisungen wie z.B. RECODE 7:88 = 4;stehen oft nach einem COMPUTE, das die zu rekodierende Variable erzeugen soll.…',
    syntax:
      'VALUELABELS <VarList> =\n{<number> "Text"}*n\n;\nLABELS <VarList> =\n{<number> "Text"}*n\n;',
    source: 'gesstabs_handbuch_52.md:1248',
  },
  {
    name: 'VARFAMILY',
    description: '',
    syntax:
      'VARFAMILY = <varlist>;\n"<varlist>" ist eine Liste von atomaren Variablen.',
    source: 'gesstabs_handbuch_52.md:7139',
  },
  {
    name: 'VARGROUP',
    description: '',
    syntax:
      'VARGROUP <name> = ( <varlist> ) EQ <valuelist>;\n<varlist> ::= Liste von atomaren Variablen\n<valuelist> ::= Liste von Einzelwerten',
    source: 'gesstabs_handbuch_52.md:6870',
  },
  {
    name: 'VARIABLES',
    description: '',
    syntax:
      'VARIABLES <varname><varnumberstart> TO <varname><varnumberend>\n= [ start | * ] [width];',
    source: 'gesstabs_handbuch_52.md:5805',
  },
  {
    name: 'VARIANCE',
    description: '',
    syntax: 'VARIANCE <varname> = <varlist>;',
    source: 'gesstabs_handbuch_52.md:8239',
  },
  {
    name: 'VARKEY',
    description: '',
    syntax: 'VARKEY <varname> = <key>;',
    source: 'gesstabs_handbuch_52.md:5233',
  },
  {
    name: 'VARLIST',
    description: '',
    syntax: 'VARLIST = <dateipfad> QST;',
    source: 'gesstabs_handbuch_52.md:16941',
  },
  {
    name: 'VARTEXT',
    description:
      'Variablentext 209, typischerweise der Frage- oder Erl�uterungstext Wird �blicherweise mit einer CITE[...]-Anweisung im TOPTEXT 516 angefordert (siehe Anzeige von Variablentexten 523).',
    syntax: 'VARTEXT [<VarList>] = "text";\nTEXT [<VarList>] = "text";',
    source: 'gesstabs_handbuch_52.md:13057',
  },
  {
    name: 'VARTITLE',
    description:
      'schreibt den VARTITLE vor den Labeltext Beispiel: TABSELECTBYCODE VARTITLE buland( 1 ) ; In diesem fall wird in der Selektionsbeschreibung vor dem Labeltext der VARTITLE ausgegeben.',
    syntax: 'VARTITLE [<VarList>] = "text";\nTITLE [<VarList>] = "text";',
    source: 'gesstabs_handbuch_52.md:8670',
  },
  {
    name: 'VERTICALALIGN',
    description: '',
    syntax:
      'VERTICALALIGN <boxtype> : [TOP|VCENTER|BOTTOM]\nHORIZONTALALIGN <boxtype> : [LEFT|HCENTER|RIGHT]',
    source: 'gesstabs_handbuch_52.md:2963',
  },
  {
    name: 'WEIGHT',
    description: '',
    syntax: 'WEIGHT = <startcolumn> <width>;\nWEIGHT = <variablenname>;',
    source: 'gesstabs_handbuch_52.md:12855',
  },
  {
    name: 'WEIGHTACCURACY',
    description: '',
    syntax: 'WEIGHTACCURACY = <number>;',
    source: 'gesstabs_handbuch_52.md:12931',
  },
  {
    name: 'WEIGHTCELLS',
    description: '',
    syntax:
      'WEIGHTCELLS [ AUTOALIGN ] <varname> = { <code> : <sollwert> % }*n\n[ MISSING : <code> : <sollwert> %]\n;',
    source: 'gesstabs_handbuch_52.md:12871',
  },
  {
    name: 'WEIGHTOUT',
    description: '',
    syntax: 'WEIGHTOUT = <startcolumn> <width>;',
    source: 'gesstabs_handbuch_52.md:16016',
  },
  {
    name: 'WEIGHTSUM',
    description: '',
    syntax: 'WEIGHTSUM = <number>;',
    source: 'gesstabs_handbuch_52.md:12978',
  },
  {
    name: 'WELCHTEST',
    description:
      'Unabh�ngiger t-Test auf Mittelwerteunterschiede nach Welch 450 auf Basis der gewichteten Daten',
    source: 'gesstabs_handbuch_52.md:11239',
  },
  {
    name: 'WHILEBLOCK',
    description: '',
    syntax: 'WHILEBLOCK <bedingung> DO',
    source: 'gesstabs_handbuch_52.md:8132',
  },
  {
    name: 'WHITENUMBERS',
    description:
      '= | FORM LINE FORM CIRCLE SYMBOLSIZE 12 ROWS 1:11 COLUMNS 1:5 ; Mit folgendem Output: GESStsabsArtist-Grafik auf Basis der Mittelwerte aus der OVERVIEW-Tabelle [X]Overview Add �hnlich wie TABLE ADD 390 kann man mit OVERVIEW ADD 406 und XOVERVIEW ADD 409 die Daten aus mehreren Vorlagen einfach in eine Tabelle integrieren. Overview Add Ein Beispiel:…',
    source: 'gesstabs_handbuch_52.md:10497',
  },
  {
    name: 'WIDTH',
    description: 'Die Breite der TITLEBOX',
    source: 'gesstabs_handbuch_52.md:15353',
  },
  {
    name: 'WORDSPLITS',
    description: '',
    syntax: 'WORDSPLITS= [ <filename> | "" ];',
    source: 'gesstabs_handbuch_52.md:13312',
  },
  {
    name: 'WRAPTEXT',
    description: '',
    syntax: 'WRAPTEXT <boxtype> : [YES|NO]',
    source: 'gesstabs_handbuch_52.md:3013',
  },
  {
    name: 'WRITESIGNALFILE',
    description: '',
    syntax: 'WRITESIGNALFILE = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:17008',
  },
  {
    name: 'XCOLCHIQU',
    description:
      'Spaltenweise 4-Felder Chiquadrat-Test auf Prozentwertunterschiede (gewichtet und ungewichtet)',
    source: 'gesstabs_handbuch_52.md:11242',
  },
  {
    name: 'XCOLDEPTTEST',
    argsHint: '( Var )',
    description:
      'Abh�ngiger t-Test auf Mittelwertsunterschiede (gewichtet und ungewichtet)',
    source: 'gesstabs_handbuch_52.md:11245',
  },
  {
    name: 'XLABELSIGNCHARBOX',
    description: '',
    syntax: 'XLABELSIGNCHARBOX LABELS X : [YES|NO]',
    source: 'gesstabs_handbuch_52.md:3004',
  },
  {
    name: 'XMCNEMAR',
    description:
      'Abh�ngiger Test auf Prozentwertunterschied (gewichtet und ungewichtet) nach McNemar 449',
    source: 'gesstabs_handbuch_52.md:11248',
  },
  {
    name: 'XOVERVIEW',
    description: '',
    syntax:
      'XOVERVIEW <tableoptions> =\n<cellelementlist>( <varlist> ) [ SORT <cellelement>\n[ DESCEND ] [ PANE <number> CODE <number> ] ] BY <kopf>;\n<varlist> ::= { <variable [ <varoption> ] }*n\n<varoption> ::=\n[ SORTCLASS <number> ]',
    source: 'gesstabs_handbuch_52.md:10439',
  },
  {
    name: 'XROWCHIQU',
    description:
      'Zeilenweise 4-Felder Chiquadrat-Test auf Prozentwertunterschiede (gewichtet und ungewichtet)',
    source: 'gesstabs_handbuch_52.md:11251',
  },
  {
    name: 'XROWTTEST',
    description:
      'Zeilenweiser, unabh�ngiger t-Test auf Mittelwerteunterschiede (gewichtet und ungewichtet)',
    source: 'gesstabs_handbuch_52.md:11254',
  },
  {
    name: 'XTTEST',
    argsHint: '(Var )',
    description:
      'Unabh�ngiger t-Test auf Mittelwerteunterschiede (gewichtet und ungewichtet)',
    source: 'gesstabs_handbuch_52.md:11257',
  },
  {
    name: 'XWELCHTEST',
    description:
      'Unabh�ngiger t-Test auf Mittelwerteunterschiede (gewichtet und ungewichtet) nach Welch 450 * zu ColPercT: ColPercTMinimum Bei der Signifikanzberechnung nach COLPERCT 428 wird die Spalten�berlappung (kann bei Mehrfachnennungsvariablen passieren) ber�cksichtig.…',
    source: 'gesstabs_handbuch_52.md:11260',
  },
  {
    name: 'YDATABOXES',
    description:
      'YDATABOXES ist eine Box, die alle DATABOXes einer Tabelle senkrecht umfasst. Sie geht auch nach oben �ber die FRAMECELLS und die LABELCELLS hinaus. Damit kann man �ber alle Elemente hinweg senkrechte Spalten schaffen, die optisch zusammen h�ngen DrawBox Zeichnung der Boxes',
    source: 'gesstabs_handbuch_52.md:14124',
  },
  {
    name: 'ZEROBASED',
    description: 'Die Skala soll immer den Nullpunkt enthalten',
    source: 'gesstabs_handbuch_52.md:5012',
  },
  {
    name: 'ZERODASHCHAR',
    description: '',
    syntax: 'ZERODASHCHAR = "<char>";',
    source: 'gesstabs_handbuch_52.md:13408',
  },
  {
    name: 'ZIPINVERTOUT',
    description: '',
    syntax: 'ZIPINVERTOUT = [ YES | NO ];',
    source: 'gesstabs_handbuch_52.md:2463',
  },
  {
    name: 'ZONEINPUT',
    description: '',
    syntax:
      'ZONEINPUT <varname> = [ MEAN | SUM | COUNT | MIN | MAX ]\n<start> <zonewidth> <end>\n<varoffset> <varwidth>\n{ SELECT <offset> <string> } *n ;',
    source: 'gesstabs_handbuch_52.md:15740',
  },
  {
    name: 'ZRANGE',
    argsHint: '( Var )',
    description:
      'Ausgabe des zentralen Bereichs einer Variablen, Mittelwert +/- Streuung * ZVALUE. Mit ZVALUE kann man diesen Faktor frei w�hlen, z.B. ZVALUE = 1.0; Voreinstellung: ZVALUE = 0.967; (2/3-Range um Mittelwert) * und **: Beide CELLELEMENTS reagieren auf den Schalter BINOMIALPERCENTRANGE: Exkurs: BiNomialPercentRange',
    source: 'gesstabs_handbuch_52.md:11007',
  },
];
