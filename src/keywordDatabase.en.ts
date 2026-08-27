// GENERATED FILE — do not hand-edit.
// Produced by scripts/extractKeywordDatabase.ts from the local
// dokumentation/*.md manuals (git-ignored — see that script's header
// comment for what this covers, what it doesn't, and why). Re-run
// npm run extract-keywords to regenerate after documentation changes.
// Language: en. Hand corrections go in
// src/keywordDatabaseOverrides.en.ts instead — that file is
// never touched by this script.

import { KeywordEntry } from './keywordDatabaseTypes';

export const keywordDatabase: KeywordEntry[] = [
  {
    "name": "#DOMACRO",
    "argsHint": "( tab 1:3 5 6 11:23 )",
    "description": "and so on is also possible. This is not restricted to numerical uses as list constructs can also be used. Example:",
    "source": "GESStabs-Handbuch_engl.md:6540"
  },
  {
    "name": "#DOMACRO2",
    "argsHint": "( <Macroname> <Schleifenliste> )",
    "description": "#tab( 1 ) #tab( 2 ) #tab( 3 ) can be shortened to",
    "syntax": "#DOMACRO2( <Macroname> <Schleifenliste> ; <weitere parameter> )",
    "source": "GESStabs-Handbuch_engl.md:6532"
  },
  {
    "name": "#END",
    "description": "Pre-processor commands are processed before the GESS tabs program is translated into its internal form. Using #DEFINE names are chosen which then are taken as defined; using #UNDEFINE they can be deleted. Using #IFDEF or #IFNDEF GESS tabs checks whether a name has been defined or not.…",
    "source": "GESStabs-Handbuch_engl.md:6416"
  },
  {
    "name": "#ENDMACRO",
    "description": "it can be called up as often as required:",
    "source": "GESStabs-Handbuch_engl.md:6513"
  },
  {
    "name": "#MACRO",
    "description": "#ENDMACRO or #MACROEND",
    "source": "GESStabs-Handbuch_engl.md:6409"
  },
  {
    "name": "#TEST",
    "argsHint": "( f2a f2b f2c )",
    "description": "etc. Macros can have up to 50 parameters. The length of the formal parameter names is restricted to 10 symbols. The names of parameter must begin with an ampersand (&). The key word #ENDMACRO means the same as #MACROEND. The replacements made by a macro are purely text; the order of symbols that conform to the formal parameter names are replaced within the strings or as part of the token.…",
    "source": "GESStabs-Handbuch_engl.md:6516"
  },
  {
    "name": "ABS",
    "description": "DAYOFWEEK The day of the week in a date in the form YYYYMMDD 1=Monday, 2=Tuesday etc Thus e.g. DAYOFWEEK( 20061030 ) = 1. DAYOFWEEK( 0 ) is today.",
    "source": "GESStabs-Handbuch_engl.md:4342"
  },
  {
    "name": "ABSINLABELBOX",
    "description": "Prints the ABSOLUTEROW at the lower frame of the label box instead of as it is usually in its own box.",
    "source": "GESStabs-Handbuch_engl.md:1830"
  },
  {
    "name": "ABSZERODASH",
    "description": "Usually zero as an absolute value is represented with a \"0\". ABSZERODASH can be used to represent the zero in a CELLELEMENT ABSOLUTE as a dash ('-').",
    "source": "GESStabs-Handbuch_engl.md:1892"
  },
  {
    "name": "ADDOVERCODE",
    "description": "Usually the OVERCODE is only tallied once per case if several of the relevant categories arise i.e. a logical OR is used. ADDOVERCODE requests the addition of the individual frequencies.",
    "source": "GESStabs-Handbuch_engl.md:1872"
  },
  {
    "name": "ADOBELATIN1",
    "description": "",
    "syntax": "ADOBELATIN1;",
    "source": "GESStabs-Handbuch_engl.md:5551"
  },
  {
    "name": "ADOBENAME",
    "description": "",
    "syntax": "ADOBENAME <char> = <name>;",
    "source": "GESStabs-Handbuch_engl.md:5567"
  },
  {
    "name": "ALIGN",
    "description": "(PS): is ignored by line printers. The text in each box can be positioned vertically as well as horizontally. The following terms are required: TOP - VCENTER - BOTTOM and LEFT - HCENTER - RIGHT. Example: ALIGN LABELS X = HCENTER VCENTER; The terms LEFT and RIGHT can also contain a command for the distance to the edge of the box:…",
    "source": "GESStabs-Handbuch_engl.md:5392"
  },
  {
    "name": "ALIGNALPHA",
    "description": "",
    "syntax": "ALIGNALPHA = [ LEFT | RIGHT ];",
    "source": "GESStabs-Handbuch_engl.md:6001"
  },
  {
    "name": "ALPHA",
    "description": "1 100 20 ; In this case the names of politicians are punched in the fields 1-20, 21-40, etc. which makes coding by hand superfluous. If using input from a COLBIN file then the key word ALPHA can obviously not be used. Generally the use of an asterisk instead of the initial column is processed the same as in a SINGLEQ. MULTIQs can also be defined as relocatable.…",
    "source": "GESStabs-Handbuch_engl.md:3463"
  },
  {
    "name": "ASALPHA",
    "description": "",
    "syntax": "ASALPHA <varlist> = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:3702"
  },
  {
    "name": "ASCIIOUT",
    "description": "Every variable which is to appear in an ASCIIOUTFILE must be included in an ASCIIOUT statement.",
    "syntax": "ASCIIOUT <Varlist> = startcolumn [ width ];",
    "source": "GESStabs-Handbuch_engl.md:4183"
  },
  {
    "name": "ASCIIOUTCARD",
    "description": "The number of cards and the preset of the present card for the output of variables in ASCII format in the ASCIIOUTFILE.",
    "source": "GESStabs-Handbuch_engl.md:3745"
  },
  {
    "name": "ASCIIOUTDECIMALCAR",
    "description": "Defines CHAR value which is to be used as a decimal separator in ASCIIOUT.",
    "source": "GESStabs-Handbuch_engl.md:6343"
  },
  {
    "name": "ASCIIOUTFILE",
    "description": "",
    "syntax": "ASCIIOUTFILE [ DELIMITED [ ASCIIOUT ] ] = <filename>;",
    "source": "GESStabs-Handbuch_engl.md:3144"
  },
  {
    "name": "ASSCOCEND",
    "description": "",
    "syntax": "ASSCOCEND <filename> ;",
    "source": "GESStabs-Handbuch_engl.md:3044"
  },
  {
    "name": "ASSOCFILE",
    "description": "",
    "syntax": "ASSOCFILE [ BIG | DBASEIN ] = <filename> KEY <varname> <startcol>\n<len> ;",
    "source": "GESStabs-Handbuch_engl.md:3007"
  },
  {
    "name": "ASSOCVAR",
    "description": "",
    "syntax": "ASSOCVAR <varname> = [ ALPHA] <startcol> [ <len> [ <width> ] ] ;",
    "source": "GESStabs-Handbuch_engl.md:3030"
  },
  {
    "name": "AUTOCLEAR",
    "description": "",
    "syntax": "AUTOCLEAR = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:4846"
  },
  {
    "name": "AUTOCONTENTKEY",
    "description": "",
    "syntax": "AUTOCONTENTKEY = [ VARNAME ] [ YVALID | XVALID | NO ];\nA CONTENTKEY (see above) is automatically allocated; if YVALID then the first variable in the Y-direction",
    "source": "GESStabs-Handbuch_engl.md:6099"
  },
  {
    "name": "AUTONOANSWER",
    "description": "",
    "syntax": "AUTONOANSWER [ <varlist> ] = [ YES \"noanswertext\" | NO ] [ LEVEL <\nnumber > ;\nAUTONOANSWER is either (without <varlist>) preset or it refers to explicit variables and the preset",
    "source": "GESStabs-Handbuch_engl.md:4857"
  },
  {
    "name": "AUTOOVERSORT",
    "description": "Sorts the OVERCODES in a table and prepares the labels for sorting within the overcode. Overcodes can hierarchically be sorted on up to five levels.",
    "source": "GESStabs-Handbuch_engl.md:1886"
  },
  {
    "name": "AUTOSIGNCHAR",
    "description": "This TABLEFORMAT ensures an automatic identification of the column with an identifying letter (see INDEXCHARS) for significance tests per column. If TESTCOLUMNS has been set the letters are not re- allocated for each variable as is usually the case.",
    "source": "GESStabs-Handbuch_engl.md:1801"
  },
  {
    "name": "AUTOSIGNCHARALWAYS",
    "description": "As AUTOSIGNCHAR but using AUTOSIGNCHAR the identification in the stub automatically only occurs if also at least one valid CELLELEMENT is present in the table. This test does not take place if using AUTOSIGNCHARALWAYS.",
    "source": "GESStabs-Handbuch_engl.md:1805"
  },
  {
    "name": "AUTOSIGNFORMAT",
    "description": "",
    "syntax": "AUTOSIGNFORMAT = \"<formatstring>\";",
    "source": "GESStabs-Handbuch_engl.md:1498"
  },
  {
    "name": "AUTOSIGNIFTEXT",
    "description": "",
    "syntax": "AUTOSIGNIFTEXT = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:1387"
  },
  {
    "name": "BACKGROUND",
    "description": "",
    "syntax": "BACKGROUND <boxname> = <hue> <saturation> <brightness>;",
    "source": "GESStabs-Handbuch_engl.md:5323"
  },
  {
    "name": "BCDVAR",
    "description": "",
    "syntax": "BCDVAR <variable> = <vargroup> ;",
    "source": "GESStabs-Handbuch_engl.md:4497"
  },
  {
    "name": "BENCHMARKCOLOR",
    "description": "",
    "syntax": "BENCHMARKCOLOR = <color_high> <color_low> ;",
    "source": "GESStabs-Handbuch_engl.md:1529"
  },
  {
    "name": "BENCHMARKLEVEL",
    "description": "",
    "syntax": "BENCHMARKLEVEL = [ SIGNIF90 | SIGNIF95 | SIGNIF99 | SIGNIF999 ];",
    "source": "GESStabs-Handbuch_engl.md:1539"
  },
  {
    "name": "BENCHMARKVALUES",
    "description": "A different subject: percentage values and bases (e.g. from other surveys) can be set in BENCHMARKVALUES. Then the column percentages in the relevant cells are compared with the benchmark values using a z-test. The BACKGROUND of the cell can then be coded with BENCHMARKCOLOR.…",
    "source": "GESStabs-Handbuch_engl.md:1503"
  },
  {
    "name": "BITGROUP",
    "description": "",
    "syntax": "BITGROUP <vargroup> = <varname> ;",
    "source": "GESStabs-Handbuch_engl.md:4503"
  },
  {
    "name": "BLANKVALUE",
    "description": "Normally an input field which only contains blanks is internally set to zero. If these values are however required then the BLANKVALUE command can define a value. Example: BLANKVALUE = -1; Preset: BLANKVALUE = 0.0;",
    "source": "GESStabs-Handbuch_engl.md:5858"
  },
  {
    "name": "BOTTOMTEXT",
    "description": "This is an alternative method for defining text at the end of a table. BOTTOMTEXT has in contrast to the CITEVARTEXT command which refers to variables, the text to be printed as its argument. If a BOTTOMTEXT is defined any additional CITEVARTEXT or CITEALLVARS commands for the BOTTOMTEXT are ignored. Maximum text length: 1500 characters.",
    "source": "GESStabs-Handbuch_engl.md:2924"
  },
  {
    "name": "BOXLINEFEED",
    "description": "(PS): is ignored by line printers.",
    "syntax": "BOXLINEFEED <boxname> = <number> ;",
    "source": "GESStabs-Handbuch_engl.md:5308"
  },
  {
    "name": "BOXMINHEIGHT",
    "description": "(PS): is ignored by line printers.",
    "syntax": "BOXMINHEIGHT <boxname> = <number> ;",
    "source": "GESStabs-Handbuch_engl.md:5295"
  },
  {
    "name": "CALCULATECOLUMN",
    "description": "",
    "syntax": "CALCULATECOLUMN = <zielcolumn> [ format \"<format>\" ] =\n<arithmetischer ausdruck>;\nThe notation for the column is: < <varno> <code> >. <varno> stands for the tally of the variables",
    "source": "GESStabs-Handbuch_engl.md:2102"
  },
  {
    "name": "CARD",
    "description": "discloses in which row or \"card\" the then following variables or weight is to be found. Preset is on CARD=1. CARD and CARDS refer to the DATAFILE (and thus automatically the COPYFILE). Relevant commands are also available for ASCIIOUTFILE, COLBININFILE and COLBINOUTFILE.",
    "source": "GESStabs-Handbuch_engl.md:3739"
  },
  {
    "name": "CARDNUMBER",
    "description": "",
    "syntax": "CARDNUMBER = startcolumn width;",
    "source": "GESStabs-Handbuch_engl.md:5881"
  },
  {
    "name": "CARDS",
    "description": "CARDS discloses how many records or rows constitute the case. Example: CARDS = 2; Preset is CARDS=1, i.e. for data sets which comprise one row the specification is not necessary.",
    "source": "GESStabs-Handbuch_engl.md:3734"
  },
  {
    "name": "CASEBASESTRING",
    "description": "Defines the text which refers to the percentaging for multi-responses CODEBOOK tables. Preset: CASEBASESTRING = \"Prozentuiert auf die Zahl der F�lle\"; This is valid for all tables until changed.",
    "source": "GESStabs-Handbuch_engl.md:5235"
  },
  {
    "name": "CASENUMBER",
    "description": "Syntax CASENUMBER = startcolumn width; If the column definition is known for a case number then an identical value is expected at that position for all cards of a case. Divergence leads to an error log which is shown in the lower error window on screen and where necessary in the LISTFILE.",
    "source": "GESStabs-Handbuch_engl.md:5887"
  },
  {
    "name": "CASESTITLE",
    "description": "If the standard text \"number of Interviewees abs.\" in TABLEBASE = CASES is to be replaced it can be done in this way: CASESTITLE = \"Number of Inter-views (abs.)\"; The CASESTITLE can be set differently for the X and Y axes Example: CASESTITLE X = \"n\"; CASESTITLE Y = \"N\"; The same separating rules are valid as for VALUELABELS and are valid for all tables until changed.",
    "source": "GESStabs-Handbuch_engl.md:5170"
  },
  {
    "name": "CELLELEMENTS",
    "argsHint": "( ABSOLUTE COLUMNPERCENT )",
    "description": "; .... CELLELEMENTS = COLUMNPERCENT; TABLE = Kopf BY y SORT ABSOLUTE DESCEND; In connection with MULTITOTAL it is not necessary to stipulate an evaluation level. Normally all characteristics have LEVEL 0. If the LEVEL is set to <> 0 the relevant characteristics will be ignored when tallying the total. Level values: 0 � 127.",
    "syntax": "CELLELEMENTS [ TOTALROW | TOTALCOLUMN ] = { <cellelement> }*n ;",
    "source": "GESStabs-Handbuch_engl.md:4006"
  },
  {
    "name": "CELLMINIMUM",
    "description": "The option CELLMINIMUM states as of which minimum value a table cell counts as valid and should be included. Example: CELLMINIMUM = 10; In all cells where the minimum value has not been reached there will be \"-\". Preset at 0.0001; CELLMINIMUM as ROWMINIMUM and COLMINIMUM are TABLE options. Options always refer to the last table requested. They are therefore always written after the TABLE command.…",
    "source": "GESStabs-Handbuch_engl.md:1750"
  },
  {
    "name": "CELLSEQUENCE",
    "description": "If several CELLELEMENTS are required for a table the cell contents are printed underneath each other in a standard order. This standard order can be altered using the CELLSEQUENCE statement. CELLSEQUENCE defines a new order. All CELLELEMENTS which do not appear in CELLSEQUENCE are not printed.",
    "source": "GESStabs-Handbuch_engl.md:1200"
  },
  {
    "name": "CELLSET",
    "description": "The CELLELEMENTS statement can be used to combine several pieces of information in a single table cell in the parts of the table which span across both axes using LABELS. In summary tables additional summarised rows are often required where e.g. means are to be presented. Due to the syntax this is only one CELLELEMENT, if necessary this can be one that includes two values e.g.…",
    "source": "GESStabs-Handbuch_engl.md:1207"
  },
  {
    "name": "CHAPTERTITLE",
    "description": "",
    "syntax": "CHAPTERTITLE = <name>;",
    "source": "GESStabs-Handbuch_engl.md:6191"
  },
  {
    "name": "CITEALLVARS",
    "description": "",
    "syntax": "CITEALLVARS = [ TOPTEXT | BOTTOMTEXT | NO ] { XVALID | YVALID };",
    "source": "GESStabs-Handbuch_engl.md:2911"
  },
  {
    "name": "CITEVARTEXT",
    "description": "",
    "syntax": "CITEVARTEXT [ TOPTEXT | BOTTOMTEXT ] = <Varlist> ;",
    "source": "GESStabs-Handbuch_engl.md:2902"
  },
  {
    "name": "CODEBOOK",
    "description": "",
    "syntax": "CODEBOOK [ <VarList> ] ;",
    "source": "GESStabs-Handbuch_engl.md:2735"
  },
  {
    "name": "CODEBOOKVALUES",
    "description": "Prints the numerical codes beside the VALUELABELS in CODEBOOK tables. This is particularly useful for controlling the automatic coding which is carried out by ALPHA-VARS.",
    "source": "GESStabs-Handbuch_engl.md:2774"
  },
  {
    "name": "COLBINCRLF",
    "description": "",
    "syntax": "COLBINCRLF = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:3221"
  },
  {
    "name": "COLBINFORNAT",
    "description": "",
    "syntax": "COLBINFORNAT = <Colbinformatname>;",
    "source": "GESStabs-Handbuch_engl.md:3226"
  },
  {
    "name": "COLBININ",
    "description": "",
    "syntax": "COLBININ <varname> = { | value < column : code }*n };",
    "source": "GESStabs-Handbuch_engl.md:4109"
  },
  {
    "name": "COLBININCARD",
    "description": "Definition for the data set to be read in COLBIN format.",
    "source": "GESStabs-Handbuch_engl.md:3749"
  },
  {
    "name": "COLBININCOLS",
    "description": "",
    "syntax": "COLBININCOLS = <value>;",
    "source": "GESStabs-Handbuch_engl.md:3183"
  },
  {
    "name": "COLBININFILE",
    "description": "",
    "syntax": "COLBININFILE = <filename>;",
    "source": "GESStabs-Handbuch_engl.md:3178"
  },
  {
    "name": "COLBININSWAPPED",
    "description": "",
    "syntax": "COLBININSWAPPED = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:3207"
  },
  {
    "name": "COLBINOUT",
    "description": "The counterpart of COLBININ is COLBINOUT. In the first form it is very similar to COLBININ described above: Example: COLBINOUT Alter = | 1 > 22:9 | 2 > 22:X | 3 > 22:Y | 4 > 23:0 | 5 > 23:1 | 6 > 23:3; The COLBINOUT statement is also used to build VARFAMILYs and VARGROUPs on COLBIN multi punches as the variables can be multi-response variables.…",
    "syntax": "COLBINOUT <varlist> = <start> <width> BITGROUP [ 10 | 12 ];",
    "source": "GESStabs-Handbuch_engl.md:4125"
  },
  {
    "name": "COLBINOUTCARD",
    "description": "Definition for the data set to be written in COLBIN format.",
    "source": "GESStabs-Handbuch_engl.md:3752"
  },
  {
    "name": "COLBINOUTCOLS",
    "description": "",
    "syntax": "COLBINOUTCOLS = <value>;",
    "source": "GESStabs-Handbuch_engl.md:3186"
  },
  {
    "name": "COLBINOUTFILE",
    "description": "Output of data in COLumn-BINary-format. See COLBIN-Data above.",
    "source": "GESStabs-Handbuch_engl.md:3212"
  },
  {
    "name": "COLBINOUTSWAPPED",
    "description": "",
    "syntax": "COLBINOUTSWAPPED = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:3215"
  },
  {
    "name": "COLCOUNTLINES",
    "description": "Printing of column tallies (COLUMNCOUNT) in a row-orientated format. Usually the results are printed in columns. (NON-PS) An example of an 80-Column-Tally:",
    "source": "GESStabs-Handbuch_engl.md:2808"
  },
  {
    "name": "COLMINIMUM",
    "description": "Option for TABLE statement. Only those columns are printed which contain at least COLMINIMUM cases, i.e., columns with very low case numbers in side group variables are suppressed. Preset at 0.0001.",
    "source": "GESStabs-Handbuch_engl.md:1766"
  },
  {
    "name": "COLOR",
    "description": "",
    "syntax": "COLOR [ FOREGROUND | BACKGROUND ] =\n{ |\n[ DATABOX <number> <number> CODE [ X | Y ] <number > ]\n<cellelement> RANGE <low> <high> = <number> <number> number> }*n\n;",
    "source": "GESStabs-Handbuch_engl.md:5346"
  },
  {
    "name": "COLPERCANDSIGN",
    "description": "Column percent and COLPERCT Tests for Mean Differences:",
    "source": "GESStabs-Handbuch_engl.md:1323"
  },
  {
    "name": "COLPERCENTLINELIMIT",
    "description": "",
    "syntax": "COLPERCENTLINELIMIT = <number>;\nParallel to the option above, a row is suppressed if a cell has a column percent value of <number>.",
    "source": "GESStabs-Handbuch_engl.md:1775"
  },
  {
    "name": "COLPERCTMINIMUM",
    "description": "In the significance calculation using COLPERCT the column overlaps are taken into account. This method can lead to problematical significances if the number of overlaps is so high that there are only a few cases which do NOT occur in both columns which have been tested against each other.…",
    "source": "GESStabs-Handbuch_engl.md:1444"
  },
  {
    "name": "COLUMNCOUNT",
    "description": "",
    "syntax": "COLUMNCOUNT = <startcolumn> <endcolumn> ;",
    "source": "GESStabs-Handbuch_engl.md:2783"
  },
  {
    "name": "COLUMNOFFSET",
    "description": "",
    "syntax": "COLUMNOFFSET = <number> ;",
    "source": "GESStabs-Handbuch_engl.md:5689"
  },
  {
    "name": "COLUMNS",
    "description": "| \"M�nner\": geschl eq 1 : var=&2 | \"Frauen\": geschl eq 2 : var=&2 #endmacro This macro is then called up five times within the table:",
    "source": "GESStabs-Handbuch_engl.md:2401"
  },
  {
    "name": "COLUMNVARS",
    "description": "This is an alternative method of building a series of variables. The initial column of the variable becomes a component part of the name.",
    "syntax": "COLUMNVARS <nameprefix> = start - end [width];",
    "source": "GESStabs-Handbuch_engl.md:3720"
  },
  {
    "name": "COMBINEDVAR",
    "description": "COMBINEDVAR produces a VARFAMILY which contains all the individual characteristics of the individual variables next to each other. COMBINEDVAR X = Alter Geschlecht; produces for example a variable family with which a table can evaluate age and sex simultaneously next to one another. COMBINEDVAR is also suitable for allocating one variable to another including its VALUELABELS.",
    "source": "GESStabs-Handbuch_engl.md:3532"
  },
  {
    "name": "COMPAREVAR",
    "description": "",
    "syntax": "COMPAREVAR <name> = <Varlist> ;",
    "source": "GESStabs-Handbuch_engl.md:2450"
  },
  {
    "name": "COMPRESSCODEBOOK",
    "description": "COMPRESSCODEBOOK = [ YES | NO ]; In the ASCII mode a list of CODEBOOKS can also be printed in a compressed form where a number of CODEBOOKS fit on to one page.",
    "source": "GESStabs-Handbuch_engl.md:5244"
  },
  {
    "name": "COMPUTE",
    "description": "allows the new calculation of variables by means of four basic arithmetical operations. New variables can be defined or existent variables can have their values changed. If there is a variable in the left half of the COMPUTE statement which the compiler does not yet recognise then it is produced. This is then valid as the \"current\" variable.…",
    "syntax": "COMPUTE LOAD <zielvar> = <varlist> ;",
    "source": "GESStabs-Handbuch_engl.md:4302"
  },
  {
    "name": "CONDENSESPSSGROUP",
    "description": "",
    "syntax": "CONDENSESPSSGROUP = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:3648"
  },
  {
    "name": "CONTENTFILE",
    "description": "",
    "syntax": "CONTENTFILE <option> = <filename>;",
    "source": "GESStabs-Handbuch_engl.md:5867"
  },
  {
    "name": "CONTENTKEY",
    "description": "",
    "syntax": "CONTENTKEY = [ <text> | <VARIABLE> ];",
    "source": "GESStabs-Handbuch_engl.md:6093"
  },
  {
    "name": "COPYFILE",
    "description": "The output of processed and perhaps altered data sets to an ASCII file. With exception of RECODEs, COMPUTEs etc. (see below) the content of the COPYFILE is identical to that of the DATAFILE. (for historical reasons the key word OUTFILE is accepted as a synonym.) (see also ASCIIOUT ALL;)",
    "source": "GESStabs-Handbuch_engl.md:3138"
  },
  {
    "name": "COPYFILTER",
    "description": "defines a variable (or list of variables) as filtered according to a condition: the filtered variables then never flow into the tables if the condition is FALSE. The most frequently used use is probably the filtering of questionnaires. This filtering can also be used to steer GESS input. SETFILTER is however also useful for limiting the valid range for VARGROUPS and VARFAMILY.…",
    "source": "GESStabs-Handbuch_engl.md:4762"
  },
  {
    "name": "COPYLABELS",
    "description": "",
    "syntax": "COPYLABELS <Varlist> = Variable;",
    "source": "GESStabs-Handbuch_engl.md:4026"
  },
  {
    "name": "COPYTEXT",
    "description": "",
    "syntax": "COPYTEXT <varlist> = <variable>;",
    "source": "GESStabs-Handbuch_engl.md:2898"
  },
  {
    "name": "COPYTITLE",
    "description": "",
    "syntax": "COPYTITLE <varlist> = <variable>;\nAll variables in <varlist> (in some cases the last defined variable) contain a reference to the\nVARTITLE of <variable>.",
    "source": "GESStabs-Handbuch_engl.md:3837"
  },
  {
    "name": "COUNT",
    "description": "tallies the frequency of preselected characteristics in a variable list.",
    "syntax": "COUNT <varlist> = ( <varlist> ) [ <logop> <number> | IN [ <number> :\nnumber ] ] ;\nlogop ::== [ EQ, NE, LT, LE, GT, GE ]",
    "source": "GESStabs-Handbuch_engl.md:4282"
  },
  {
    "name": "CROSSVAR",
    "description": "Using CROSSVAR special variable families can be produced which contain all the characteristic combinations of all the variables involved. This can be used to present multiple cross tables in TABLE for example. If one were to define:…",
    "source": "GESStabs-Handbuch_engl.md:3522"
  },
  {
    "name": "CSVEXPORT",
    "description": "",
    "syntax": "CSVEXPORT = [ <filename> | \"\" ];\nNew implementation of the good old output of tables in CSV-Format (HG= ). All text components of the",
    "source": "GESStabs-Handbuch_engl.md:6063"
  },
  {
    "name": "DATEFORMAT",
    "description": "DATEFORMAT = <string>; In the string the letters Y, M and D are expanded to year, month and day. All other symbols are taken into the date. Thus: DATEFORMAT = \"dd.mm.yyyy\"; results in the standard European date: 31.10.2009",
    "source": "GESStabs-Handbuch_engl.md:5149"
  },
  {
    "name": "DBASEIN",
    "description": "",
    "syntax": "DBASEIN = <filename> ;",
    "source": "GESStabs-Handbuch_engl.md:3132"
  },
  {
    "name": "DECIMALPERCENT",
    "description": "Defines the number of decimal places for the percentages in cross tables (TABLE) or comparative tables (COMPARE). DECIMALPERCENT settings are valid for all following tables until the next DECIMALPERCENT command. Example: DECIMALPERCENT = 1; Preset: DECIMALPERCENT = 0;",
    "source": "GESStabs-Handbuch_engl.md:4992"
  },
  {
    "name": "DECIMALS",
    "description": "The number of decimal places can be stipulated for variable output if no VALUELABEL has been allocated and PRINTALL=YES. It is also used for MEAN or SUM output. Example: DECIMALS = 2; The characteristics or rather sums or mean of all variables then defined have two decimal places after the comma. This is valid until the next DECIMALS command (see also:…",
    "source": "GESStabs-Handbuch_engl.md:4999"
  },
  {
    "name": "DELIMITEDIN",
    "description": "",
    "syntax": "DELIMITEDIN [ delim ] = <filename>;\ndelim ::= '<char>' | \"<char>\" | number [ 1..255 ]",
    "source": "GESStabs-Handbuch_engl.md:3119"
  },
  {
    "name": "DESCRIPTION",
    "description": "Example: DESCRIPTION MEAN = Mittel; Usually an explanation of the cell content is printed top left when using TABLE and there are standard texts for this in the system. If these texts are to be altered then the DESCRIPTION command is used, otherwise the texts can be switched off using TABLEFORMAT = NODESCRIPTION;",
    "source": "GESStabs-Handbuch_engl.md:5159"
  },
  {
    "name": "DESCRIPTIONSTRING",
    "description": "Alternatively a descriptive text can be explicitly set. Example: DESCRIPTIONSTRING = \"Mittelwert|Absolut\"; Individual rows are separated using a vertical line.",
    "source": "GESStabs-Handbuch_engl.md:5165"
  },
  {
    "name": "DICHOQ",
    "description": "also: GROUPVAR Variable groups can also be generated directly from the input without making the individual variables visible.",
    "syntax": "DICHOQ <varname> =",
    "source": "GESStabs-Handbuch_engl.md:3554"
  },
  {
    "name": "DISTANCE",
    "description": "(PS): is ignored by line printers. Usually there are no gaps between the different boxes which make up the table. Spaces can however be defined in the X and the Y direction. Example: DISTANCE INTERBOX X = 13; DISTANCE INTERBOX Y = 13; In the standard form (see above) all spaces are set to the stipulated value. DISTANCE INTERBOX can also be differentiated: Valid for X:…",
    "source": "GESStabs-Handbuch_engl.md:5423"
  },
  {
    "name": "DOCUMENT",
    "description": "Specifies a document indicatorwhich appears at the bottom right under the tables. Example: DOCUMENT = \"Demo 2009\"; The key words DATE and/or TIME produce a date or time. TIME and DATE key words can be mixed with any number of strings. Example: DOCUMENT = \"Ausz�hlung vom\" DATE \" Zwischenstand\" TIME; Valid for all tables. PS):…",
    "source": "GESStabs-Handbuch_engl.md:5138"
  },
  {
    "name": "DRAWBOX",
    "description": "(PS): is ignored by line printers.",
    "syntax": "DRAWBOX <boxname> =\n<number> { [ TOP | LEFT | RIGHT | BOTTOM | BOXRADIUS <number> ] }*n ;",
    "source": "GESStabs-Handbuch_engl.md:5248"
  },
  {
    "name": "DUMMYHEAD",
    "description": "",
    "syntax": "DUMMYHEAD = <name>;",
    "source": "GESStabs-Handbuch_engl.md:2261"
  },
  {
    "name": "ELASTICITY",
    "argsHint": "(PS)",
    "description": "Elasticity is a measurement of how the scaling in the X direction is allowed to differ from the scaling in the Y direction. Preset: ELASTICITY = 0.15; Background: Printing in Postscript offers the possibility to scale tables to fit which are larger than the available area on a page. This adjustment can be made independently in the X or the Y direction.…",
    "source": "GESStabs-Handbuch_engl.md:5071"
  },
  {
    "name": "ELSE",
    "description": "x = e / ( d + c ); The ELSE part of the command can be omitted, e.g. IF a EQ 3 THEN d = 5; Compared with the set operator IN easily allows the test for the existence of values in multi-response variables. The test can look like this: IF 4 IN famvar_01 THEN ... A variable must always be on the right side.…",
    "source": "GESStabs-Handbuch_engl.md:4550"
  },
  {
    "name": "ENCODING",
    "description": "As GESS tabs was born as a DOS program and some clients hate nothing more than a change in standard settings, the Char-Set-Encoding from DOS, i.e. IBM850 for North/Middle Europe is set as standard. This can be changed in two ways: the encoding can be explicitly defined using the ENCODING statement presented here.…",
    "source": "GESStabs-Handbuch_engl.md:5663"
  },
  {
    "name": "EPS",
    "description": "",
    "syntax": "EPS [ REPLACE | FOREGROUND ] = <FileName> <xPoints> <yPoints> [ [\nWIDTH | HEIGHT ] <Points> ] ;",
    "source": "GESStabs-Handbuch_engl.md:5617"
  },
  {
    "name": "EVALFAMVALONCE",
    "description": "",
    "syntax": "EVALFAMVALONCE <Varlist> = YES or NO;\n(EvalFamValOnce = EVALuate FAMilyvariables VALues ONCE). Using VARFAMILYs it can make",
    "source": "GESStabs-Handbuch_engl.md:3486"
  },
  {
    "name": "EXCELAXISMINMAX",
    "description": "",
    "syntax": "EXCELAXISMINMAX = <minvalue> maxvalue> ;",
    "source": "GESStabs-Handbuch_engl.md:6207"
  },
  {
    "name": "EXCELCHARTINVERT",
    "description": "",
    "syntax": "EXCELCHARTINVERT = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:6210"
  },
  {
    "name": "EXCELFILENAME",
    "description": "",
    "syntax": "EXCELFILENAME = <filename>;",
    "source": "GESStabs-Handbuch_engl.md:6174"
  },
  {
    "name": "EXCELGRAPHSHEETNAME",
    "description": "",
    "syntax": "EXCELGRAPHSHEETNAME = <name>;",
    "source": "GESStabs-Handbuch_engl.md:6202"
  },
  {
    "name": "EXCELHIDEUPDATE",
    "description": "If this option is set to YES the Excel interface is only showed by INSTANTEXCEL=YES if a table is finished. This can reduce the processing time for the transfer to Excel. To control the appearance of tables using INSTANTEXCEL: the following TABLEFORMATs are available:…",
    "source": "GESStabs-Handbuch_engl.md:6142"
  },
  {
    "name": "EXCELOUT",
    "argsHint": "(out-dated)",
    "description": "(In many cases INSTANTEXCEL should be more practical)",
    "syntax": "EXCELOUT = <filename>;",
    "source": "GESStabs-Handbuch_engl.md:6213"
  },
  {
    "name": "EXCELPICTURE",
    "description": "This key word is used to transfer an illustration (PNG-FILE or JPG-FILE) to an Excel table. This then appears above the table.",
    "source": "GESStabs-Handbuch_engl.md:6187"
  },
  {
    "name": "EXCELRANGEDELIM",
    "description": "",
    "syntax": "EXCELRANGEDELIM = <char>;",
    "source": "GESStabs-Handbuch_engl.md:6179"
  },
  {
    "name": "EXCLUDEFROMTO",
    "description": "",
    "syntax": "EXCLUDEFROMTO = { vartype }*n ;",
    "source": "GESStabs-Handbuch_engl.md:5732"
  },
  {
    "name": "EXPANDBOX",
    "description": "If a shared block has been drawn around the data cells using DRAWBOX it often looks better if there is a vertical space before the first and after the last data row and the upper and lower frames. This space can be set using EXPANDHEIGHT; it should be noted that then the DATABOX is not congruent to the sum of the DATACELLs. (Only effective with Postscript-printouts). (PS)",
    "source": "GESStabs-Handbuch_engl.md:1861"
  },
  {
    "name": "EXPORTFILE",
    "description": "",
    "syntax": "EXPORTFILE = [ <filename> | \"\" ];",
    "source": "GESStabs-Handbuch_engl.md:6069"
  },
  {
    "name": "FCOMPUTE",
    "description": "Parallel to the COMPUTE statement there is also FCOMPUTE, which tests the filters set with SETFILTER. FCOMPUTE is only used if all the filter conditions are true or if there is no filter.",
    "source": "GESStabs-Handbuch_engl.md:4484"
  },
  {
    "name": "FILTER",
    "description": "",
    "syntax": "FILTER <varlist> [ = <bedingung> | AS <varname> ] ;",
    "source": "GESStabs-Handbuch_engl.md:4814"
  },
  {
    "name": "FIXEDPOSITION",
    "description": "",
    "syntax": "FIXEDPOSITION <VarList> = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:5894"
  },
  {
    "name": "FONT",
    "description": "",
    "syntax": "FONT <Fontname> CPI <number> = <ESC-String>;",
    "source": "GESStabs-Handbuch_engl.md:5595"
  },
  {
    "name": "FOOTER",
    "description": "",
    "syntax": "FOOTER = \"text\" [ LEFT | HCENTER | RIGHT | ] ;",
    "source": "GESStabs-Handbuch_engl.md:5123"
  },
  {
    "name": "FOREGROUND",
    "description": "Analogue to BACKGROUND and is used to shade the foreground which normally means the colour of the text.",
    "source": "GESStabs-Handbuch_engl.md:5336"
  },
  {
    "name": "FORMAT",
    "description": "Defines a format for the representation of a particular cell content. If for example a mean is to be a scale with an algebraic sign, a comma as decimal separator and two decimal places then the following would be written (formats should always be written in quotation marks (\") ): FORMAT MEAN = \"+#,##\"; FORMAT recognises the following control characters:…",
    "source": "GESStabs-Handbuch_engl.md:5631"
  },
  {
    "name": "FRAMECOLOR",
    "description": "The colour of the frames can also be defined using HSB or RGB as above. COLOR FOREGROUND or COLOR BACKGROUND With the COLOR statement DATACELLS and FRAMECELLS can be coloured depending on the value, e.g. all mean above a certain value are printed in red etc.",
    "source": "GESStabs-Handbuch_engl.md:5339"
  },
  {
    "name": "FRAMEELEMENTS",
    "description": "TABLETYPEs are allocated to specific frame elements of a table; thus e.g. a table with row percentages (TABLETYPE = ROWPERCENT;) has by default an absolute column (\"No. of Cases\") and a total row (\"Total\"). With the specification FRAMEELEMENTS frame elements can be specifically requested. The key words necessary are:",
    "source": "GESStabs-Handbuch_engl.md:1263"
  },
  {
    "name": "GENERATELABELS",
    "description": "",
    "syntax": "GENERATELABELS <varlist>;",
    "source": "GESStabs-Handbuch_engl.md:4065"
  },
  {
    "name": "GESS",
    "description": "",
    "syntax": "GESS [ INCLUDE ] <qualifier> = <filename> [ COLSFROMNAME ]\n[ COLUMN <number> ]\n[ VARIABLES <varlist> ]\n[ CARD <number> ]\n[ BITGROUP <number> ]\n;",
    "source": "GESStabs-Handbuch_engl.md:5788"
  },
  {
    "name": "GLOBALCOLMINIMUM",
    "description": "Global preset for COLMINIMUM for all the following tables.",
    "source": "GESStabs-Handbuch_engl.md:1787"
  },
  {
    "name": "GLOBALPRINTALL",
    "description": "These options steer the output of unlabelled values. Usually unlabelled values are printed with a label generated from the numerical value. It can however be required to suppress outliers in the tables: unlabelled values are to be treated as outliers where necessary and not be printed. This is achieved using PRINTALL = NO or GLOBALPRINTALL = NO.…",
    "source": "GESStabs-Handbuch_engl.md:5014"
  },
  {
    "name": "GLOBALROWMINIMUM",
    "description": "Global preset for ROWMINIMUM for all following tables.",
    "source": "GESStabs-Handbuch_engl.md:1764"
  },
  {
    "name": "GLOBALSORT",
    "description": "Normally a SORT key word in a TABLE statement effects only the directly preceding dimension of a table: TABLE = #kopf by a b sort absolute descend",
    "source": "GESStabs-Handbuch_engl.md:1916"
  },
  {
    "name": "GLOBALTABLEMINIMUM",
    "description": "There was a bug that caused the sub tables in TABLE ADD constructs to be individually tested against the TABLEMINIMUM. Now only the start table is tested. As the tally results of all the tables (incl. ADD) should really be taken the sum of all the FRAMECELLS is taken into account for the resultant table. More precisely:…",
    "syntax": "GLOBALTABLEMINIMUM = <number>;",
    "source": "GESStabs-Handbuch_engl.md:2254"
  },
  {
    "name": "GRAPHTYPE",
    "description": "",
    "syntax": "GRAPHTYPE = <xlGraphname>;",
    "source": "GESStabs-Handbuch_engl.md:6231"
  },
  {
    "name": "GROUPCOUNTS",
    "description": "",
    "syntax": "GROUPCOUNTS <Varlist> = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:3657"
  },
  {
    "name": "GROUPRECODE",
    "description": "Using GROUPRECODE group variables can also be recoded. Example: GROUPRECODE GRR 3=5; checks in the third variable of the group whether it is relevant and if yes the value of this variable is deleted and the fifth variable is set to TRUE. Instead of the constant RECODE value after the equals sign there can also be a variable name of a nuclear variable (see above).",
    "source": "GESStabs-Handbuch_engl.md:4262"
  },
  {
    "name": "GROUPS",
    "description": "If the individual (nuclear) variables from which the variable groups are to be formed are not yet present then the GROUPS command is often the more practical alternative as the naming and the more complex rules for forming groups can be formulated more clearly in the GROUPS command.…",
    "syntax": "GROUPS <Varname> =\n{ | \"Labeltext ...\" [ LEVEL <number> ] [ USEFONT <Fontname> [ SIZE\n<number> ] ] : <log. Bedingung> }*n ;",
    "source": "GESStabs-Handbuch_engl.md:3674"
  },
  {
    "name": "HEADER",
    "description": "VARIABLE a1 : v1 = a2 ; It is the XTAB version of a very simple TABLE statement: TABLE = a1 BY a2; The command looks cumbersome mainly because the variable a2 is passed on using an internal construct (a local table variable v1) which already has been allocated after the ROW key word.…",
    "source": "GESStabs-Handbuch_engl.md:2343"
  },
  {
    "name": "HEADERS",
    "description": "",
    "syntax": "HEADERS = <tablepart> { / <tablepart> }*n;",
    "source": "GESStabs-Handbuch_engl.md:2269"
  },
  {
    "name": "HELPTEXT",
    "description": "",
    "syntax": "HELPTEXT <VarList> = \"text text \";\nDefines a help text which can be called up during CATI/CAPI or Data Entry (F1 = help button).",
    "source": "GESStabs-Handbuch_engl.md:2873"
  },
  {
    "name": "HG",
    "argsHint": "(out-dated)",
    "description": "(is also carried out in Postscript output)",
    "syntax": "HG = [ <HGFileName> | \"\" ];",
    "source": "GESStabs-Handbuch_engl.md:6315"
  },
  {
    "name": "HGINVERSE",
    "description": "Preset: HGINVERSE = NO; The data rows for all tables are transferred to HG in the same form as they are in the table, apart from with COMPARE. COMPARE tables are the exception. In order to organise the values in a STACKED BAR the data matrix in the standard case is inverted before the transfer to HG.…",
    "source": "GESStabs-Handbuch_engl.md:6333"
  },
  {
    "name": "HIDDENTOVARLIST",
    "description": "",
    "syntax": "HIDDENTOVARLIST = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:5727"
  },
  {
    "name": "HISTORY",
    "description": "",
    "syntax": "HISTORY =\n[ DATABOX <x> <y> ] FORMAT ( <Formatliste> ) DATA [ Absliste ] {\n<number> : <Dataliste> }*n;\nFormatliste ::= [ ABSROW | ABSCOLUMN |\nPHYSROW PHYSCOLUMN TOTALROW ] { <number> }*n\nAbsliste ::= { <number> }*n",
    "source": "GESStabs-Handbuch_engl.md:1934"
  },
  {
    "name": "HTML",
    "description": "",
    "syntax": "HTML = [ <filename> | \"\" ];\nA HTML version of the relevant tables is stored in the file <filename>.html. Additionally a file called\n<filename>_frames.html is produced. If this is represented in a browser the browser interface is",
    "source": "GESStabs-Handbuch_engl.md:6077"
  },
  {
    "name": "HTMLBACKGROUND",
    "description": "The background and foreground colours of tables in HTML can be influenced in the script using the two HTML-specific representation elements: Example: RGB = YES; HTMLBACKGROUND TABLE = <red> <green> <blue>; HTMLBACKGROUND DEFAULTBOX = <red> <green> <blue>; The RGB values are, as is usual in GESS, designated in figure ranges from 0 - 1.…",
    "source": "GESStabs-Handbuch_engl.md:6107"
  },
  {
    "name": "HTMLFOOTER",
    "description": "With these TABLEFORMATs the relevant information can be fed into the HTML output.",
    "source": "GESStabs-Handbuch_engl.md:6085"
  },
  {
    "name": "IF",
    "description": "",
    "syntax": "IF <log. Bedingung> PRINT \"ErrorText\" <Varlist> [ GOTO <varname> ];",
    "source": "GESStabs-Handbuch_engl.md:5951"
  },
  {
    "name": "IGNOREASCOUTDUPL",
    "description": "",
    "syntax": "IGNOREASCOUTDUPL = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:4210"
  },
  {
    "name": "IGNOREDOUBLECASENO",
    "description": "",
    "syntax": "IGNOREDOUBLECASENO = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:5696"
  },
  {
    "name": "IGNOREMISSING",
    "description": "",
    "syntax": "IGNOREMISSING = [ YES | NO ];\nPreset: IGNOREMISSING = NO;",
    "source": "GESStabs-Handbuch_engl.md:5708"
  },
  {
    "name": "IGNOREMULTIQOVERFLOW",
    "description": "",
    "syntax": "IGNOREMULTIQOVERFLOW = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:3497"
  },
  {
    "name": "IGNORESETFILTER",
    "description": "",
    "syntax": "IGNORESETFILTER = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:5702"
  },
  {
    "name": "IGNORETABINTEXT",
    "description": "",
    "syntax": "IGNORETABINTEXT = [ yes | no ];",
    "source": "GESStabs-Handbuch_engl.md:2867"
  },
  {
    "name": "INCLUDE",
    "description": "Defines an INCLUDE file. Commands from the INCLUDE file are interpreted as if they were in place of the INCLUDE commands. Example: INCLUDE = VARNAME.def; INCLUDE = Labels.def; This can be used for example to administrate the variable definitions and the VALUELABELS in different files so that changes in the column positions etc only have to be changed in the definition part. In the",
    "source": "GESStabs-Handbuch_engl.md:5984"
  },
  {
    "name": "INDEXCHARS",
    "description": "e.g. INDEXCHARS = \"GEHT\"; allocates a (small or large) G to the first test column, an E to the second, an H to the third and a T to the fourth. The letters A � Z are preset. TESTCOLUMNS are taken into account. The letters A � Z can initially be used as INDEXCHARS to deal with 26 columns.…",
    "source": "GESStabs-Handbuch_engl.md:1468"
  },
  {
    "name": "INDEXSTYEFILE",
    "description": "",
    "syntax": "INDEXSTYEFILE = <name>;",
    "source": "GESStabs-Handbuch_engl.md:6128"
  },
  {
    "name": "INDEXVAR",
    "description": "",
    "syntax": "INDEXVAR <name> = <varlist> BY <variable>;",
    "source": "GESStabs-Handbuch_engl.md:3504"
  },
  {
    "name": "INHERITFONT",
    "description": "",
    "syntax": "INHERITFONT [ X | Y ] = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:5609"
  },
  {
    "name": "INIT",
    "description": "",
    "syntax": "INIT <varlist> = <value list>;",
    "source": "GESStabs-Handbuch_engl.md:3668"
  },
  {
    "name": "INSTANTEXCEL",
    "description": "",
    "syntax": "INSTANTEXCEL = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:6132"
  },
  {
    "name": "INSTITUTION",
    "description": "Specifies the printing of the name of the institute added at the bottom left edge. The valid text is expanded to the right. Repeated use of the INSTITUTION statements can lead to meaningless results. (PS): this text can have more than one line in output from Postscript printers with the backslash marking the end of a row.",
    "source": "GESStabs-Handbuch_engl.md:5133"
  },
  {
    "name": "INVINDEXVAR",
    "description": "",
    "syntax": "INVINDEXVAR <name> = <varlist> BY <variable>;",
    "source": "GESStabs-Handbuch_engl.md:3518"
  },
  {
    "name": "IOCHECK",
    "description": "",
    "syntax": "IOCHECK = [ ASCIIIN | ASCIIOUT | COLBININ | COLBINOUT ] ;",
    "source": "GESStabs-Handbuch_engl.md:5752"
  },
  {
    "name": "LABELFORMAT",
    "description": "",
    "syntax": "LABELFORMAT <varlist> = <string>;",
    "source": "GESStabs-Handbuch_engl.md:4050"
  },
  {
    "name": "LABELRECODE",
    "description": "",
    "syntax": "LABELRECODE = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:4019"
  },
  {
    "name": "LABELS",
    "description": "1 \"18#24\" 2 \"25#30\" 3 \"31#45\" 4 \"46#60\" 5 \"61 and �lter\"; SINGLEQ Bezirk = 43",
    "source": "GESStabs-Handbuch_engl.md:146"
  },
  {
    "name": "LABELSTOTITLE",
    "description": "",
    "syntax": "LABELSTOTITLE <labelcode> = <varlist>;",
    "source": "GESStabs-Handbuch_engl.md:3104"
  },
  {
    "name": "LEADINGZEROS",
    "description": "",
    "syntax": "LEADINGZEROS = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:6006"
  },
  {
    "name": "LINEFEEDFACTOR",
    "description": "",
    "syntax": "LINEFEEDFACTOR = <number>;",
    "source": "GESStabs-Handbuch_engl.md:5458"
  },
  {
    "name": "LISTFILE",
    "description": "Normally the interpretation of the commands is logged on the screen. This log or parts of it can be directed into a file which is declared as a LISTFILE. Example: LISTFILE = Tables.Err; If the interpretation is to appear back on the screen as of a certain point this can be achieved using: LISTFILE = con;",
    "source": "GESStabs-Handbuch_engl.md:5918"
  },
  {
    "name": "LISTON",
    "description": "",
    "syntax": "LISTON = NO;\nSwitches the log for the interpretation of commands off completely, LISTON = YES; (preset) switches it",
    "source": "GESStabs-Handbuch_engl.md:5980"
  },
  {
    "name": "LISTVARS",
    "description": "",
    "syntax": "LISTVARS= <filename> [ options ];",
    "source": "GESStabs-Handbuch_engl.md:5768"
  },
  {
    "name": "LOCALCONTENT",
    "description": "During printing the information is taken from the locally set cell contents and not from FRAME.",
    "source": "GESStabs-Handbuch_engl.md:1910"
  },
  {
    "name": "LONGVARTITLE",
    "description": "Ensures that the VARTITLE in the table Y-Axis is not broken up. Should only be used if no DRAWBOX for VARTITLE Y has been defined. Otherwise it looks stupid! (Only PS)",
    "source": "GESStabs-Handbuch_engl.md:1875"
  },
  {
    "name": "LOWERCASE",
    "description": "",
    "syntax": "LOWERCASE <char> = <char>;\n<char> ::= [ x | 'x' | \"x\" | <number> ]\nx ::= A .. Z, a .. z\nnumber ::= 1 .. 255\nNormally only the letters A � Z can be used in INDEXCHARS, as there are only signs (ASCII Code < 128)",
    "source": "GESStabs-Handbuch_engl.md:1478"
  },
  {
    "name": "MACROPROTOCOL",
    "description": "Sometimes it is not so easy to find the cause of a syntax error when working with complex macros; only the macro commands can be seen in the source text and not the expanded product. For this reason it is possible to export the expanded macros into a text file where it is easier to check them.",
    "syntax": "MACROPROTOCOL = <filename> [ DOMACRO ] ;",
    "source": "GESStabs-Handbuch_engl.md:6553"
  },
  {
    "name": "MAKEFAMILY",
    "description": "",
    "syntax": "MAKEFAMILY <name> = <value>;",
    "source": "GESStabs-Handbuch_engl.md:3482"
  },
  {
    "name": "MAKEGROUP",
    "description": "",
    "syntax": "MAKEGROUP <name> = <value>;",
    "source": "GESStabs-Handbuch_engl.md:3616"
  },
  {
    "name": "MARGINS",
    "description": "",
    "syntax": "MARGINS = LEFT <number> RIGHT <number> TOP <number> BOTTOM <number> ;",
    "source": "GESStabs-Handbuch_engl.md:5099"
  },
  {
    "name": "MARKCELLS",
    "description": "",
    "syntax": "MARKCELLS = [ YES | NO ] [ COLOR {colors}*6 | CELLELEMENTS\n<cellelement> ];",
    "source": "GESStabs-Handbuch_engl.md:1715"
  },
  {
    "name": "MAX",
    "description": "",
    "syntax": "MAX <varname> = <Varlist>;",
    "source": "GESStabs-Handbuch_engl.md:4536"
  },
  {
    "name": "MAXCODEBOOKLINES",
    "description": "Determines the maximum number of rows per page in a CODEBOOK table. Preset: MAXCODEBOOKLINES = 50; The following TABLEFORMATs are valid for CODEBOOK tables:",
    "source": "GESStabs-Handbuch_engl.md:2769"
  },
  {
    "name": "MAXIMUMWFACT",
    "description": "Preset for the control of weighting. MINIMUMWEIGHT and MAXIMUMWEIGHT set the minimum or maximum weight of a case. MINIMUMWFACT and MAXIMUMWFACT set a limit for the factorial alteration of the weight per iteration cycle. Preset: MAXIMUMWEIGHT = 1E+20; MINIMUMWEIGHT = 0; MAXIMUMWFACT = 1E+20; MINIMUMWFACT = 0; (usually no limitations)",
    "source": "GESStabs-Handbuch_engl.md:4972"
  },
  {
    "name": "MAXLINELENGTH",
    "description": "<historisch> Defines the maximum length of a row in the input file. Maximum: 50000. Preset: 3000. By designating a lower MAXLINELENGTH storage memory can be saved which can be used for other purposes e.g. for tables. This is particularly relevant if there is a data set in which the cases are made up of many short rows (see CARDS).…",
    "source": "GESStabs-Handbuch_engl.md:6012"
  },
  {
    "name": "MEAN",
    "argsHint": "( � )",
    "description": "are permitted. Additionally the key word RANGE can be used to generate whatever areas are necessary to break down a table with many characteristics:",
    "syntax": "MEAN <varname> = <Varlist>;",
    "source": "GESStabs-Handbuch_engl.md:2059"
  },
  {
    "name": "MEANCOLDEPT",
    "description": "Printing of mean and the dependant t-test in one cell (per column) For all these CELLELEMENTS described in the above table the following options are available: SIGNIFLEVEL, SIGNIFTEXT, SHOWSIGNIF, TESTCOLUMNS and INDEXCHARS. Furthermore using a special variant of the COLOR statements a cell which has been appointed a letter due to significance can also be colour-coded.",
    "source": "GESStabs-Handbuch_engl.md:1333"
  },
  {
    "name": "MEANDESCRIPTION",
    "description": "Replaces the variable name with a description string e.g. \"mean\" in columns and rows with third variables.",
    "source": "GESStabs-Handbuch_engl.md:1854"
  },
  {
    "name": "MENUFILTER",
    "description": "",
    "syntax": "MENUFILTER <varlist> = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:4820"
  },
  {
    "name": "MENUHEADER",
    "description": "",
    "syntax": "MENUHEADER <varlist> = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:4833"
  },
  {
    "name": "MENUMEAN",
    "description": "",
    "syntax": "MENUMEAN <varlist> = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:4825"
  },
  {
    "name": "MIN",
    "description": "",
    "syntax": "MIN <varname> = <Varlist>;",
    "source": "GESStabs-Handbuch_engl.md:4528"
  },
  {
    "name": "MINCOLBASE",
    "description": "",
    "syntax": "MINCOLBASE = <number>;\nPreset at MINCOLBASE = 0",
    "source": "GESStabs-Handbuch_engl.md:1781"
  },
  {
    "name": "MINTABLEHEIGHT",
    "argsHint": "(PS)",
    "description": "For line-orientated printers the width of the letters or the number of rows must be defined as the basic unit of measurement. The following syntax is valid: UNITS = CPI <number> LPI <number>; CPI means Characters Per Inch (Pitch); LPI means Lines Per Inch. Example: UNITS = CPI 10 LPI 6; During output with USEFONT GESS tabs ensures that the fonts match the chosen settings for UNITS.",
    "source": "GESStabs-Handbuch_engl.md:5061"
  },
  {
    "name": "MISSING",
    "description": "Allows the definition of individual characteristics of nuclear variables as MISSING values.",
    "syntax": "MISSING <Varlist> = { number }*n;\n(n <= 3)",
    "source": "GESStabs-Handbuch_engl.md:4740"
  },
  {
    "name": "MISSINGCHAR",
    "description": "defines the character used to mark MISSING values for input and output. Preset: MISSINGCHAR = \"M\";",
    "source": "GESStabs-Handbuch_engl.md:4756"
  },
  {
    "name": "MODIFYVARNAME",
    "description": "Prints not only the variable name but also the DESCRIPTION of the column or row content in columns or rows with third variables (e.g. MEAN ( Einkommen) ).",
    "source": "GESStabs-Handbuch_engl.md:1851"
  },
  {
    "name": "MULTICOLINHG",
    "description": "Multiple cell contents (e.g. ABSCOLPERCENT) in CSV-Data files are usually represented in several rows. Alternatively they can be presented in several columns using +MULTICOLINHG. USEFORMATINHG Formats for CELLELEMENTS are also adopted for printouts in HG.…",
    "source": "GESStabs-Handbuch_engl.md:1895"
  },
  {
    "name": "MULTIQ",
    "description": "(also FAMILYVAR) Alternatively the variable family can also be generated directly from the input. This makes the individual variables invisible to the user:",
    "syntax": "MULTIQ <varname> = [NOINPUT ] [ TITLE <titlestring> ] [ ALPHA ] [\nstart | * ] len [width]\n[ LABELS { AS <varname> | { value <text> }*n } ] ];",
    "source": "GESStabs-Handbuch_engl.md:3436"
  },
  {
    "name": "MULTISTRING",
    "description": "Defines the text in CODEBOOKs which refers to possible multi-responses. Preset: MULTISTRING= \"Mehrfachnennungen m�glich\"; This is valid for all tables until changed.",
    "source": "GESStabs-Handbuch_engl.md:5229"
  },
  {
    "name": "MULTITOTALX",
    "description": "Usually the TOTALROW is counted on the basis of case numbers (see also TABLEBASE). In many cases it is required to have a total different to the number of response for variables with multi-responses. This can be done using TABLEFORMAT. (e.g. 165% in the total row of a column percentage means an average of 1,65 responses per interviewee.) In this context:…",
    "source": "GESStabs-Handbuch_engl.md:1812"
  },
  {
    "name": "MULTITOTALY",
    "description": "Analogue to this a TOTALCOLUMN is usually tallied on the basis of number of cases. Using MULTITOTALY this tally can be converted to all responses.",
    "source": "GESStabs-Handbuch_engl.md:1824"
  },
  {
    "name": "NOASCIIEXTENSION",
    "description": "Normally ASCII data sets which have been produced by GESS tabs are finished with a right- justified *.Should this not occur it can be achieved with a switch.",
    "source": "GESStabs-Handbuch_engl.md:3161"
  },
  {
    "name": "NOBODYBLANKS",
    "description": "Suppresses blank rows in the table body that have been added to improve legibility. Tables then may for example fit on one page.",
    "source": "GESStabs-Handbuch_engl.md:1837"
  },
  {
    "name": "NOCOLCHECK",
    "argsHint": "(XGI, XGC etc.)",
    "description": "Syntax NOCOLCHECK = [ YES | NO ]; Preset: NO If using GESS input or GESS questionnaire software the allocation of columns is monitored to avoid multiple use. It can however make sense when filtering for example to use identical physical data areas repeatedly. The standard check can be switched off for this.",
    "source": "GESStabs-Handbuch_engl.md:5760"
  },
  {
    "name": "NOCONTENTBOX",
    "description": "Suppresses the explanation box in additional table rows which for example contain mean or sum etc. In this case only the VARTITLE or the VARNAME are printed in front of the value. The user should then include other texts to explain the content. (no effect on Postscript-printouts). (NON-PS)",
    "source": "GESStabs-Handbuch_engl.md:1845"
  },
  {
    "name": "NODESCRIPTION",
    "description": "Suppresses the descriptive text for the cell contents (see DESCRIPTION.",
    "source": "GESStabs-Handbuch_engl.md:1849"
  },
  {
    "name": "NOHEADERBLANKS",
    "description": "Suppresses blank rows in the stub. (NON-PS)",
    "source": "GESStabs-Handbuch_engl.md:1840"
  },
  {
    "name": "NOINHERITTEXT",
    "description": "",
    "syntax": "NOINHERITTEXT = [ YES | NO ];\nNOINHERITTITLE = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:3475"
  },
  {
    "name": "NOIOCHECK",
    "description": "",
    "syntax": "NOIOCHECK <varlist> = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:5757"
  },
  {
    "name": "NOISE",
    "description": "",
    "syntax": "NOISE = <value>;\nNOISE can be used to \"add noise\" with random figures to all known variables of a data set. <value>\ndefines how many measurement points are to be replaced by random values. value=1 causes a",
    "source": "GESStabs-Handbuch_engl.md:5926"
  },
  {
    "name": "NOLOGFILES",
    "description": "",
    "syntax": "NOLOGFILES = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:5844"
  },
  {
    "name": "NOMINATIONTITLE",
    "description": "In TABLEBASE = NOMINATIONS the standard text is \"No. of responses abs.\". This can be replaced. Example: NOMINATIONTITLE = \"Nennungen\"; Different texts are possible for the X and Y axes analogue to CASESTITLE (see above). It is valid for all tables until changed.",
    "source": "GESStabs-Handbuch_engl.md:5179"
  },
  {
    "name": "NORMALIZE",
    "description": "",
    "syntax": "NORMALIZE;",
    "source": "GESStabs-Handbuch_engl.md:5938"
  },
  {
    "name": "NOVARTITLEBOX",
    "description": "Suppresses the box which names the variables on the Y-axis. Always makes sense if only one variable is used on the Y-axis which for example already appears in the TOPTEXT box.",
    "source": "GESStabs-Handbuch_engl.md:1842"
  },
  {
    "name": "NOZERODASH",
    "description": "Usually the real zero in percentage tables is represented by a \"-\". This can be switched off using NOZERODASH.",
    "source": "GESStabs-Handbuch_engl.md:1889"
  },
  {
    "name": "OPEN",
    "description": "The GESS system can also process and code the responses to open questions by designating the variables in the SINGLEQ to be OPEN. GESS questionnaire and input programmes then open a text window for the input of open responses.",
    "source": "GESStabs-Handbuch_engl.md:3383"
  },
  {
    "name": "OPENASALPHA",
    "description": "Usually the results of the coding are taken from the OPENQFILEs but the texts can also be used verbatim which is achieved using: OPENASALPHA <varlist> = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:3003"
  },
  {
    "name": "OPENOFFICEDEVIATION",
    "description": "",
    "syntax": "OPENOFFICEDEVIATION = YES;",
    "source": "GESStabs-Handbuch_engl.md:6137"
  },
  {
    "name": "OPENQFILE",
    "description": "If open questions are to be used at least one OPENQFILE must be defined. GESS tabs reads all OPENQFILEs and creates a data bank which allocates which values belong to which case numbers. The OPENQFILE statement has the same syntax as the DATAFILE statement.…",
    "source": "GESStabs-Handbuch_engl.md:2995"
  },
  {
    "name": "OR",
    "argsHint": "( Alter LT 6 AND Schulbildung GT 0 )",
    "description": "PRINT \"Unplausibler Ausbildungsgrad\" Alter Schulbildung; The messages either appear in the INPUT-DATA-ERROR window on screen or where applicable in the LISTFILE (see above). A summary table of all the errors can be requested using SUMMARY. During the program run in GESS input or GESS CAPI an error window appears.…",
    "source": "GESStabs-Handbuch_engl.md:5955"
  },
  {
    "name": "PAGENUMBER",
    "description": "Resets the current page number.",
    "source": "GESStabs-Handbuch_engl.md:5131"
  },
  {
    "name": "PAGETOTALX",
    "description": "Only effective with MULTITOTALX: The responses of all variables on the Y-axis are tallied for the TOTALROW.",
    "source": "GESStabs-Handbuch_engl.md:1821"
  },
  {
    "name": "PAGETOTALY",
    "description": "Only has effect with MULTITOTALY: The responses to all variables on the X-Axis are tallied for the TOTALCOLUMN.",
    "source": "GESStabs-Handbuch_engl.md:1827"
  },
  {
    "name": "PAPER",
    "description": "",
    "syntax": "PAPER = HEIGHT <number> WIDTH <number>;",
    "source": "GESStabs-Handbuch_engl.md:5082"
  },
  {
    "name": "PERCENTILEINTERPOL",
    "description": "Using this TABLEFORMAT an interpolation is switched on. Interpolation used to be standard in GESS tabs. This is however unusual if anything; we have readjusted and now interpolation has to be explicitly defined.",
    "source": "GESStabs-Handbuch_engl.md:1882"
  },
  {
    "name": "PERCENTINLABEL",
    "description": "Automatically adds a % symbol with CELLELEMENT = COLUMNPERCENT to the label boxes on the X- axis. Incidentally is also used to add an additional row with percentaging in ColumnCount (PS).",
    "source": "GESStabs-Handbuch_engl.md:1832"
  },
  {
    "name": "PHYSICALNTITLE",
    "description": "Serves to replace the standard text \"unweighted\" with the indicator of columns or rows with \"unweighted n\". (See FRAMEELEMENTS, PHYSICALROW or PHYSICALCOLUMN). Example: PHYSICALNTITLE = \"Zahl der Be-frag-ten\"; X and Y frame texts can be set differently analogue to TOTALTITLE. This is valid for all tables until changed.",
    "source": "GESStabs-Handbuch_engl.md:5222"
  },
  {
    "name": "PRINT2LINES",
    "description": "The presentation of two rows within a cell can be achieved in rows or columns that are generated using CELLELEMENTS and have two logical contents (e.g. ABSCOLPERCENT, ABSMEAN). (Only effective with Postscript-printouts). (PS)",
    "source": "GESStabs-Handbuch_engl.md:1866"
  },
  {
    "name": "PRINT2LINES2",
    "description": "Analogue to Print2Lines, only in the other order. (Only effective with Postscript-printouts). (PS)",
    "source": "GESStabs-Handbuch_engl.md:1870"
  },
  {
    "name": "PRINTEREXIT",
    "description": "Control string which is written at the end of a PRINTFILE. The individual characters are defined in either decimal or ASCII code Example: PRINTEREXIT = 12 {FormFeed} 10 {LineFeed} 13 {CR}; or ASCII codes are mixed with literal strings. Character chains which are to be passed on to the printer unchanged are set in quotation marks. Example:…",
    "source": "GESStabs-Handbuch_engl.md:6019"
  },
  {
    "name": "PRINTERINIT",
    "description": "Control string which is written at the beginning of the output of a PRINTFILE. See above for coding.",
    "source": "GESStabs-Handbuch_engl.md:6033"
  },
  {
    "name": "PRINTFILE",
    "description": "",
    "syntax": "PRINTFILE <Druckername> = <FileName>;",
    "source": "GESStabs-Handbuch_engl.md:3251"
  },
  {
    "name": "PROFILE",
    "description": "PROFILE defines a mean table with an optional graphical presentation of the mean value. In certain ways PROFILE is to mean as COMPARE is to distribution. PROFILE can also be used to present many variables cohesively.…",
    "source": "GESStabs-Handbuch_engl.md:2524"
  },
  {
    "name": "PROFILEHEADERS",
    "description": "PROFILEHEADERS is an obligatory command after a PROFILE statement and is used to define the column legends. The test elements can cover more than one row; the same hyphenation rules apply as for VALUELABELS (see above).",
    "source": "GESStabs-Handbuch_engl.md:2624"
  },
  {
    "name": "PROFILELINES",
    "description": "",
    "syntax": "PROFILELINES = { LineDef }*n ;\nLineDef ::= | <number> : { LineQualifier }*n\nLineQualifier ::=[ HIDDEN | PATTERN <number> | COLOR <number>\n<number> <number> | WIDTH <number> | SYMBOL <number> SYMBOLWIDTH\n<number> ]",
    "source": "GESStabs-Handbuch_engl.md:2629"
  },
  {
    "name": "PROFILESCALE",
    "description": "",
    "syntax": "PROFILESCALE = <start> <end> <increment> ;",
    "source": "GESStabs-Handbuch_engl.md:2662"
  },
  {
    "name": "PROFILESORT",
    "description": "",
    "syntax": "PROFILESORT = [ <number> ] [ DESCEND ] ;\nThe PROFILE table is sorted according to the <number> defined in the data column, usually in\nascending order; DESCEND defines the descending order. The data column results in the case of a BY\ntable from a code of characteristic. Where there are several variables per row <number> is the first",
    "source": "GESStabs-Handbuch_engl.md:2653"
  },
  {
    "name": "RANGES",
    "description": "",
    "syntax": "RANGES <VarList> <ValueList> ;",
    "source": "GESStabs-Handbuch_engl.md:4271"
  },
  {
    "name": "RAWDATASTRING",
    "description": "Indicator to differentiate between unweighted and weighted tables. Comes directly before DOCUMENT. Preset: RAWDATASTRING = \"*\"; This is valid for all tables until changed. Options for Printing and Layout of Tables",
    "source": "GESStabs-Handbuch_engl.md:5239"
  },
  {
    "name": "RECODE",
    "description": "allows the reprogramming of of individual variable characteristics of the variable defined last or a list of explicitly named variables. Example: RECODE 1 2 3 = 3; summarises the characteristics 1,2 and 3 of the variable defined last to 3. RECODE item1 item2 item3 1 = 4; recodes the characteristics of item1, item2 and item3 of the variable. also possible:…",
    "source": "GESStabs-Handbuch_engl.md:4221"
  },
  {
    "name": "RECODETASKS",
    "description": "The effect of RECODE statements can be restricted to particular task types. Using: RECODETASKS = tabtask; recodes are only carried out by GESS tabs, and all RECODE statements from GESS input or CATI etc. are ignored.",
    "source": "GESStabs-Handbuch_engl.md:5683"
  },
  {
    "name": "REDEFINEVARS",
    "description": "YES or NO. Preset: NO. If REDEFINEVARS is set to YES all command rows in the INFILE appear which redefine the input definition of variables already defined. Command rows in the INFILE are identified using a dollar sign ($) in the first column of a row in the INFILE. Commands conforming to the syntax of the VARNAME or RECODE commands are permitted.…",
    "source": "GESStabs-Handbuch_engl.md:6360"
  },
  {
    "name": "RESETREDEFINEVARS",
    "description": "",
    "syntax": "RESETREDEFINEVARS = [ YES | NO ] ;",
    "source": "GESStabs-Handbuch_engl.md:6389"
  },
  {
    "name": "RGB",
    "description": "",
    "syntax": "RGB = [ YES | NO ];\nIf RGB = NO GESS tabs calculates the numerical colour information according to the HSB model. If RGB\n= YES the numerical values are interpreted according to the Red-Green-Blue model.",
    "source": "GESStabs-Handbuch_engl.md:5380"
  },
  {
    "name": "ROWCELLMINIMUM",
    "description": "",
    "syntax": "ROWCELLMINIMUM = <number>;",
    "source": "GESStabs-Handbuch_engl.md:1770"
  },
  {
    "name": "ROWMINIMUM",
    "description": "Option for TABLE statement. Only those rows are printed which contain at least ROWMINIMUM cases, i.e., characteristics with very low case numbers in side group variables are suppressed. Preset at 0.0001.",
    "source": "GESStabs-Handbuch_engl.md:1761"
  },
  {
    "name": "SCRIPTEXPORTFILE",
    "description": "These can be used to define parts of the script as a \"foreign code\" to be exported. If the name of a SCRIPTEXPORTFILE is set all parts of the script between #STARTEXPORT and #ENDEXPORT are carried over into this file. These texts are also processed and modified by the Macro Expander which is the appeal of this construction. Thus it is possible to output variable names produced by nested macros.…",
    "source": "GESStabs-Handbuch_engl.md:6563"
  },
  {
    "name": "SELECT",
    "description": "defines an import filter: only those cases which conform to this filter are processed further, i.e. all tables are produced only on the basis of this data; SELECT is a permanent filter as opposed to TABSELECT (see below). SELECT also acts on the output according to COPYFILE or SYSTEMOUT. An iterative weighting also only refers to the selected cases.…",
    "source": "GESStabs-Handbuch_engl.md:4652"
  },
  {
    "name": "SETDECIMALS",
    "description": "Serves to explicitly set the decimal point for variables which have already been defined.",
    "syntax": "SETDECIMALS < Varlist > = number ;",
    "source": "GESStabs-Handbuch_engl.md:5008"
  },
  {
    "name": "SETFILTER",
    "description": "",
    "syntax": "SETFILTER [ <filtername> ] [ TEXT \"filtertext\" ] = < log. Bedingung >\n;\nENDFILTER [ <filtername> ] ;\nCOPYFILTER <varname> = <varname>;",
    "source": "GESStabs-Handbuch_engl.md:4773"
  },
  {
    "name": "SETMISSING",
    "description": "A MISSING value is automatically inherited on to variables which emanate from the calculation of other variables. If MISSING values go into a calculation or an 'M' is found in the input then the result is a MISSING value. The variable then receives the characteristic allocated by the user with SETMISSING. Example: SETMISSING = 9999;",
    "source": "GESStabs-Handbuch_engl.md:4745"
  },
  {
    "name": "SHADE",
    "description": "(PS): is ignored by line printers.",
    "syntax": "SHADE <boxname> = <number> ;",
    "source": "GESStabs-Handbuch_engl.md:5315"
  },
  {
    "name": "SHOWSIGNIF",
    "description": "Be it that a test resulted in a significant difference between column A and column D, then naturally the test between column D and column A would also show a significant difference. The identification of \"A\" in column D and of \"D\" in column A is technically correct but nonetheless redundant. In many cases it is preferable to show the significance only once for each pair.…",
    "source": "GESStabs-Handbuch_engl.md:1419"
  },
  {
    "name": "SHOWTTMEAN",
    "description": "Prints the mean of test variable additional to the indication of significance levels.",
    "source": "GESStabs-Handbuch_engl.md:2730"
  },
  {
    "name": "SIGNIFLEVEL",
    "description": "",
    "syntax": "SIGNIFLEVEL = <option>;",
    "source": "GESStabs-Handbuch_engl.md:1341"
  },
  {
    "name": "SIMPLEVAR",
    "description": "",
    "syntax": "SIMPLEVAR <variable> = <vargroup> ;",
    "source": "GESStabs-Handbuch_engl.md:4488"
  },
  {
    "name": "SINGLEQ",
    "description": "(also: VARIABLE) The simplest way to build a question/variable is using the SINGLEQ statement.",
    "syntax": "SINGLEQ <varname> = [ TITLE <titletext> ] [ ALPHA ] [ [ start | * ] [\nwidth | BINARY ] ]\n[ LABELS [ AS <varname > | COPY <varname> | MAKE <number> | {\nLabelEntry }*n } ]\n;\nLabelEntry ::=",
    "source": "GESStabs-Handbuch_engl.md:3310"
  },
  {
    "name": "SLICELASTPAGE",
    "description": "Tables generated on the Y-Axis SLICE or LINESLICE (e.g. TABLE = y by b SORT POSITION SLICE 10 MEAN( b );) usually have the mean (or other value) on each page. This TABLEFORMAT ensures the printout only on the last page.",
    "source": "GESStabs-Handbuch_engl.md:1912"
  },
  {
    "name": "SLICESTATISTICS",
    "description": "Summary tables of the type: TABLE = #k by Mean( v1 ) Mean( v2 ) Mean( v3 ) Mean( v4 ) Mean( v5 ) Mean( v6 ) Mean( v7 ) Mean( v8 ) �.. Mean( v99 ) ; can be spread across several pages using the key word SLICESTATISTICS. After setting SLICESTATISTICS = 35; all the following tables of this type are always divided after 35 such rows.",
    "source": "GESStabs-Handbuch_engl.md:2085"
  },
  {
    "name": "SORT",
    "description": "Normally the variable characteristics are printed in the order they are defined in VALUELABELS statement. The variable characteristics in the X or Y-Axis can however also be sorted according to other criteria. The key word SORT is written after the variable name followed by the sort criterion which are as follows: ABSOLUTE acc. to absolute cell content MEAN acc. to arithmetical mean SUM acc.…",
    "source": "GESStabs-Handbuch_engl.md:2007"
  },
  {
    "name": "SORTCLASS",
    "description": "Usually the SORTCLASS information is given to labels and overcodes in the VALUELABELS statement or the LABELS part of the SINGLEQ, DICHOQ or MULTIQ statement. There are however cases where it makes sense to provide the SORTCLASS information later in the text.…",
    "syntax": "SORTCLASS <varname> OVERCODE <name> = <number>;\nHere the OVERCODE is allocated the SORTCLASS <number> and all labels belonging to the OVERCODE\nreceive the SORTCLASS <number> + 1. In this way OVERCODEs and the relevant label positions can be",
    "source": "GESStabs-Handbuch_engl.md:4073"
  },
  {
    "name": "SPLITCHARSTAY",
    "description": "Preset: Linefeedchar: \\ Numberchar: # Splitchar: - Splitcharstay: # Certain symbols have a special meaning for string output. The LINEFEEDCHAR causes a return in labels or variable titles. The NUMBERCHAR is replaced in table titles by the current table number.…",
    "source": "GESStabs-Handbuch_engl.md:5197"
  },
  {
    "name": "SPLITENTRIES",
    "description": "SPLITENTRIES = <filename>; It is very easy to produce a \"dividing\" dictionary. If a list is constructed like so Nie~der~sachsen Bundes~land Wahl~ab~sicht Weiterf�h~ren~de Polytech~ni~sche Hoch~schul~reife Selbst~st�ndige Aus~zu~bil~den~de wahr~schein~lich",
    "source": "GESStabs-Handbuch_engl.md:3950"
  },
  {
    "name": "SPSS",
    "description": "",
    "syntax": "SPSS [ ASCIIOUT ] = <filename>;",
    "source": "GESStabs-Handbuch_engl.md:5809"
  },
  {
    "name": "SPSS__",
    "description": "",
    "syntax": "SPSS__ = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:5840"
  },
  {
    "name": "SPSSGLOBALSEQUENCE",
    "description": "",
    "syntax": "SPSSGLOBALSEQUENCE = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:5832"
  },
  {
    "name": "SPSSGROUP",
    "description": "",
    "syntax": "SPSSGROUP <name> = <familyvarname>;",
    "source": "GESStabs-Handbuch_engl.md:3620"
  },
  {
    "name": "SPSSGROUPLABEL0",
    "description": "A SPSSGROUP comprises a row of nuclear variables where the Code 0 or 1 shows whether the relevant value is \"set\". The SPSSGROUP statement has now (as of Version 4.0.2) been expanded so that these nuclear variables can be allocated information from the label of the relevant code of the source variable (MULTIQ).",
    "source": "GESStabs-Handbuch_engl.md:3627"
  },
  {
    "name": "SPSSGROUPLABELS",
    "description": "",
    "syntax": "SPSSGROUPLABELS = [ YES | NO ];\nSPSSGROUPLABEL1 = <TEXT>;\nSPSSGROUPLABEL0 = <TEXT>;",
    "source": "GESStabs-Handbuch_engl.md:3632"
  },
  {
    "name": "SPSSINFILE",
    "description": "",
    "syntax": "SPSSINFILE = <filename>;",
    "source": "GESStabs-Handbuch_engl.md:3081"
  },
  {
    "name": "SPSSLONGNAMES",
    "description": "",
    "syntax": "SPSSLONGNAMES = [ yes | no ];\nOld versions of SPSS could not use long variable names; GESS tabs shortened the names where",
    "source": "GESStabs-Handbuch_engl.md:5826"
  },
  {
    "name": "SPSSSOUTFILE",
    "description": "",
    "syntax": "SPSSSOUTFILE = <filename>;",
    "source": "GESStabs-Handbuch_engl.md:3096"
  },
  {
    "name": "SPSSVARLABTOTEXT",
    "description": "",
    "syntax": "SPSSVARLABTOTEXT = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:3112"
  },
  {
    "name": "STARTCOLUMN",
    "description": "",
    "syntax": "STARTCOLUMN = <number>;\nThe automatic designation of columns using * presumes that there is a previous variable; from this the",
    "source": "GESStabs-Handbuch_engl.md:5875"
  },
  {
    "name": "STATIC",
    "description": "",
    "syntax": "STATIC <varlist> = [ YES | NO ];",
    "source": "GESStabs-Handbuch_engl.md:4838"
  },
  {
    "name": "STOPONFIRSTERROR",
    "description": "YES or NO. Preset: YES. If NO the input stream continues to be interpreted even if errors occur in as far as the parser can synchronise itself again; possibly the subsequent errors will gain the upper hand. It is recommended to produce a LISTFILE in any case in order to log the error and the erroneous input. Stays valid until the next STOPONFIRSTERROR command.…",
    "source": "GESStabs-Handbuch_engl.md:6054"
  },
  {
    "name": "STYLEFILE",
    "description": "",
    "syntax": "STYLEFILE = <filename>;\nUsing the STYLEFILE individual CSS styles can be included. The contents of <filename> are included",
    "source": "GESStabs-Handbuch_engl.md:6088"
  },
  {
    "name": "SUM",
    "description": "",
    "syntax": "SUM <varname> = <Varlist>;",
    "source": "GESStabs-Handbuch_engl.md:4520"
  },
  {
    "name": "SUMMARY",
    "description": "The IF ... PRINT ... command in GESS tabs allows comfortable error searches and documentation. It is however often useful to use statistics for error frequency and SUMMARY tables provide just such statistics:",
    "syntax": "SUMMARY;",
    "source": "GESStabs-Handbuch_engl.md:2817"
  },
  {
    "name": "SUPPRESSEMPTYTABLE",
    "description": "Usually a table where no cases are relevant is printed as an empty table. Using SUPPRESSEMPTYTABLE = YES this page is suppressed.",
    "source": "GESStabs-Handbuch_engl.md:6039"
  },
  {
    "name": "SUPPRESSLABEL",
    "description": "If a variable is a constant (i.e. it has empirically only one characteristic), it can make sense for appearances sake to suppress the label text. This can be achieved with SUPPRESSLABEL. (Only effective with Postscript-printouts). (PS)",
    "source": "GESStabs-Handbuch_engl.md:1857"
  },
  {
    "name": "SYSTEMIN",
    "description": "Output of a system fileto be read. It has to refer to a valid name in the system software. System files are generated with the statement SYSTEMOUT. DATAFILE, COLBININFILE and SYSTEMIN statements can not be used together in a GESS tabs run. The suffix (.TS) is generated automatically.",
    "source": "GESStabs-Handbuch_engl.md:3164"
  },
  {
    "name": "SYSTEMOUT",
    "description": "",
    "syntax": "SYSTEMOUT = <filename> [ [ KEEPVARS | DELETEVARS ] <varlist> ] ;",
    "source": "GESStabs-Handbuch_engl.md:3169"
  },
  {
    "name": "TABLE",
    "description": "= Marke_1 by g_sto_1 MEAN :DESCRIPTION �Mittelwert� ( sto_1 ); TABLE ADD = Marke_2 by g_sto_2 MEAN :DESCRIPTION �Mittelwert� ( sto_2 ); In order to demonstrate how easily logos can be integrated into the tables, the GESS logo has been added four times. The instructions are as follows:…",
    "source": "GESStabs-Handbuch_engl.md:437"
  },
  {
    "name": "TABLEBASE",
    "description": "This controls the basis of percentaging in the TABLE printout. The following is preset: TABLEBASE = CASES ; i.e. usually percentaging is on the basis of the number of interviewees. Using TABLEBASE = NOMINATIONS ; the alternative of percentaging on the basis of the number of mentions can be achieved (only relevant for multiple responses).…",
    "source": "GESStabs-Handbuch_engl.md:1544"
  },
  {
    "name": "TABLEFILTER",
    "description": "",
    "syntax": "TABLEFILTER <number> = TEXT \"<text>\" <condition>;",
    "source": "GESStabs-Handbuch_engl.md:4682"
  },
  {
    "name": "TABLEFORMAT",
    "description": "The table appearance can further be controlled using TABLEFORMAT.",
    "syntax": "TABLEFORMAT = [ + | - | ] { Formatoption ... }*n ;",
    "source": "GESStabs-Handbuch_engl.md:1792"
  },
  {
    "name": "TABLEFORMATS",
    "argsHint": "( <tableformats> )",
    "description": "CONTENTKEY <contentkey> ] parts ::= part { part }*n part ::= content [ filter ] [ option ] content ::= [ <constant> | <varname> | <cellelement> ( <varname> [ <varname> ) | <cellelement> ( <varname> [ <varname> ] BY <varname> ) ] filter ::= FILTER <bedingung> | option ::= SORT sortcontent [ sortpane ] [ cut ] sortcontent ::= [ DESCEND ] sorttype sortpane ::= PANE <value> CODE <value> cut ::= [ TOP…",
    "source": "GESStabs-Handbuch_engl.md:926"
  },
  {
    "name": "TABLEMINIMUM",
    "description": "",
    "syntax": "TABLEMINIMUM = <number>;",
    "source": "GESStabs-Handbuch_engl.md:6043"
  },
  {
    "name": "TABLENUMBER",
    "description": "Defines the first number for the tables. Preset: TABLENUMBER = 1; All tables share the same number range. The tables are only counted if there is a hash in the TABLETITLE. This is valid for all tables until changed.",
    "source": "GESStabs-Handbuch_engl.md:5210"
  },
  {
    "name": "TABLETITLE",
    "description": "If the standard text \"Table #:\" is to be replaced it can be done as follows: TABLETITLE = \"Summary Table\"; If the test is not to appear at all, then: TABLETITLE = \"\"; If the program finds a hash \"#\" (more precisely: the NUMBERCHAR) in the string this character is replaced by the current table number. This is valid for all tables until it is changed.",
    "source": "GESStabs-Handbuch_engl.md:5185"
  },
  {
    "name": "TABSELECT",
    "description": "defines a selection of cases for the following tables. TABSELECT remains valid until a new TABSELECT is defined. Should all cases be processed in the following tables then simply: TABSELECT; is written. (This condition is always true.) The syntax equates to SELECT (non permanent filter).…",
    "source": "GESStabs-Handbuch_engl.md:4671"
  },
  {
    "name": "TABULATE",
    "description": "",
    "syntax": "TABULATE [ INVERSE ] = <tablepart> { / <tablepart> }*n;",
    "source": "GESStabs-Handbuch_engl.md:2277"
  },
  {
    "name": "TEMPLATE",
    "description": "",
    "syntax": "TEMPLATE = <templatename>;",
    "source": "GESStabs-Handbuch_engl.md:6224"
  },
  {
    "name": "TEXTTABLE",
    "description": "",
    "syntax": "TEXTTABLE ;",
    "source": "GESStabs-Handbuch_engl.md:2841"
  },
  {
    "name": "TEXTWRAP",
    "description": "Usually the variable texts are presented exactly as they have been defined. TEXTWRAP is used to break up the lines in text boxes.",
    "source": "GESStabs-Handbuch_engl.md:1809"
  },
  {
    "name": "TOTALROW",
    "description": "ABSROW and ABSCOLUMN stand for rows (ROW) or columns (COLUMN) with absolute values of the cases or punches where relevant after weighting. PHYSICALROW or PHYSICALCOLUMN refer to the physical case number, i.e. without weighting. In TOTALROW or TOTALCOLUMN all the values for all the cases evaluated are printed as they have been defined in CELLELEMENTS. Example:…",
    "source": "GESStabs-Handbuch_engl.md:1273"
  },
  {
    "name": "TOTALTITLE",
    "description": "If the standard text \"Insgesamt\" is to be replaced then: TOTALTITLE = Total; The TOTALTITLE can be set differently for the X or Y axes: Example: TOTALTITLE X = \"Total\"; TOTALTITLE Y = \"Insgesamt\"; This is valid for all tables until changed.",
    "source": "GESStabs-Handbuch_engl.md:5214"
  },
  {
    "name": "TTEST",
    "description": "Independent t-test (per column) MEANTEST ROWMEANTEST Printing of mean value and t-test per column in one Printing of mean value and t-test per row in one cell. cell.",
    "syntax": "TTEST = [ INDEPENDENT ]\nTTESTINDEX <number>",
    "source": "GESStabs-Handbuch_engl.md:1326"
  },
  {
    "name": "UNITS",
    "description": "",
    "syntax": "UNITS = [ MM | POINTS | INCH ];",
    "source": "GESStabs-Handbuch_engl.md:5049"
  },
  {
    "name": "USECASES",
    "description": "USECASES controls the treatment of MISSING values in cross tables. Usually the rows and columns of cross tables are suppressed if either no VALUELABEL has been defined or if the relevant characteristic in a MISSING command has been declared a MISSING value, or if a characteristic is recognised as a MISSING value due to explicit coding (see MISSINGCHAR).…",
    "source": "GESStabs-Handbuch_engl.md:1552"
  },
  {
    "name": "USELABELS",
    "description": "Using COPYLABELS and USELABELS variables can be allocated the VALUELABELS of other variables.",
    "source": "GESStabs-Handbuch_engl.md:4024"
  },
  {
    "name": "USEMISSING",
    "description": "steers the evaluation of MISSING characteristics in TABLE and COMPARE. USEMISSING = NO; is the preset; using USEMISSING = YES; the MISSING values can be called up for the evaluation of the following tables.",
    "source": "GESStabs-Handbuch_engl.md:4751"
  },
  {
    "name": "USERAWSFORSTATS",
    "description": "",
    "syntax": "USERAWSFORSTATS = [ YES | NO ] ;",
    "source": "GESStabs-Handbuch_engl.md:1709"
  },
  {
    "name": "USEWEIGHT",
    "description": "",
    "syntax": "USEWEIGHT = [ YES | NO | <varname> ] ;",
    "source": "GESStabs-Handbuch_engl.md:4907"
  },
  {
    "name": "VALUELABELS",
    "description": "",
    "syntax": "VALUELABELS <VarList> = [ ADD ]\n{ LabelEntry }*n ;\nLabelEntry ::=\n[<number> \"String\" | OVERCODE [ SUM ] [<name>] { <number> [ :<number>\n] }*n \"String\" ] [ LabelOption ]\nLabelOption ::=",
    "source": "GESStabs-Handbuch_engl.md:3842"
  },
  {
    "name": "VARFAMILY",
    "description": "A family is a group of variables with a shared amount of characteristics, e.g. the first, second and third response to a question. These variables can be made into a VARFAMILY which is evaluated instead of the individual variables. Example: VARFAMILY item = item1 TO item4; TABLE = item BY alter; The VARFAMILY automatically has the same VALUELABELs as the first variable used in it.…",
    "source": "GESStabs-Handbuch_engl.md:3419"
  },
  {
    "name": "VARGROUP",
    "description": "defines a group of variables which are to be evaluated together. Usually VARGROUP is used to group individual variables which build a 0/1 group of multi-responses together. Example: VARGROUP Items = ( item.1 item.2 item.3 item.4 ) EQ 1; In front of the equals sign there is the name of the variable group.…",
    "source": "GESStabs-Handbuch_engl.md:3541"
  },
  {
    "name": "VARIABLES",
    "description": "Using the VARIABLES statement a series of variables can be generated which are stored together in the data set:",
    "syntax": "VARIABLES <varname><varnumberstart> TO <varname><varnumberend> = [\nstart | * ] [width];",
    "source": "GESStabs-Handbuch_engl.md:3709"
  },
  {
    "name": "VARNAME",
    "description": "defines a variable and its position in the DATAFILE if necessary in the COPYFILE or also in the COLBININFILE. If a variable in a particular \"row\" is to be referred to then it is preceded by the key word CARD or COLBININCARD (see below). Example: VARNAME = Alter 101 1; Age is coded in column 101, length = 1. Example: CARD = 3; VARNAME = ITEM37 44 2; ITEM37 is coded in column 44-45 of card 3.…",
    "source": "GESStabs-Handbuch_engl.md:3754"
  },
  {
    "name": "VARTEXT",
    "description": "",
    "syntax": "VARTEXT <VarList> = \"text text \";",
    "source": "GESStabs-Handbuch_engl.md:2877"
  },
  {
    "name": "VARTITLE",
    "description": "",
    "syntax": "VARTITLE <VarList> = \"String\";",
    "source": "GESStabs-Handbuch_engl.md:3823"
  },
  {
    "name": "WEIGHT",
    "description": "discloses where an externally calculated weight is in the data set: Example: WEIGHT = 62 6; (weight is in column 62, Len=6) Alternatively a known variable can be named: ... COMPUTE gewicht = ( a + c ) * 0.1; WEIGHT = Gewicht; ... Here it should be noted that the command WEIGHT= is carried out in the RunTime-Module directly before the case is fed into the tables i.e.…",
    "source": "GESStabs-Handbuch_engl.md:4893"
  },
  {
    "name": "WEIGHTACCURACY",
    "description": "Defines the accuracy bound up to which iteration should occur. WEIGHTACCURACY is the natural logarithm of the maximum deviance of a weighting cell from the prerequisite as factor. Preset: WEIGHTACCURACY = 0.0001;",
    "source": "GESStabs-Handbuch_engl.md:4963"
  },
  {
    "name": "WEIGHTCELLS",
    "description": "Requests weighting according to the variable characteristics. As soon as at least one WEIGHTCELLS statement is found in the source text the program carries out an additional reading run of the data in which the weight factors are calculated. If there are more than one WEIGHTCELLS statement present iterative weighting continues until all the weighting conditions have been fulfilled.…",
    "syntax": "WEIGHTCELLS [ AUTOALIGN ] <varname> =\n{ <code> : <sollwert> % }*n\n[ MISSING : <code> : <sollwert> %\n;",
    "source": "GESStabs-Handbuch_engl.md:4921"
  },
  {
    "name": "WEIGHTOUT",
    "description": "defines where a newly calculated weight is to be stored in the outfile. Syntax as above. Example: WEIGHTOUT = 68 6;",
    "source": "GESStabs-Handbuch_engl.md:4915"
  },
  {
    "name": "WEIGHTSUM",
    "description": "States the desired sum of the weights to be calculated. Normally weighting occurs to the number of the cases physically read.",
    "source": "GESStabs-Handbuch_engl.md:4960"
  },
  {
    "name": "XTAB",
    "description": "There is a further possibility of describing cross tables. This second more complicated version makes it easier to tabulate variables next to each other and if necessary to use different weights in one table.",
    "source": "GESStabs-Handbuch_engl.md:2287"
  },
  {
    "name": "ZONEINPUT",
    "description": "",
    "syntax": "ZONEINPUT <varname> = [ MEAN | SUM | COUNT | MIN | MAX ]\n<start> <zonewidth> <end>\n<varoffset> <varwidth>\n{ SELECT <offset> <string> } *n ;",
    "source": "GESStabs-Handbuch_engl.md:4089"
  }
];
