# Change Log

All notable changes to the "gesstabs" extension will be documented in this file (last change first).

## 0.2.8

Updated tmLanguage file to json format

## 0.2.7

Updated tmLanguage files to show all commands mentioned in https://help.gessgroup.de/gesstabs-help/ (Stand Mai 2023)

## 0.2.6

New feature: folding region is now available for Pre-Processor commands and comments

## 0.2.5

Bug fix: Language file optimization

## 0.2.4

Internal release

## 0.2.3

Bug fix: only variables with a length of 2 or more had been recognized as variable.

## 0.2.2

Showing all variables only got container "variables" which was not very
informative. Now shows type of variable again.

Minor bug fix for word boundaries (did not work with quotations)

## 0.2.1

Bug fix missing word boundary in getWordDefinition
Changed CHANGELOG.md to have last fix on top

## 0.2.0

- Updated Symbols in tmLanguage file
- Changed how to identify comments and strings, now the scope will be identified for each char in a text file

## 0.1.1

- Added fix to find also files in subdirectories
- Changed tmLanguage file

## 0.1.0

- Changed variable definition. Now, dots are part of a gesstabs variable name. Follows definition from manual,
  beside the fact, that variables names with quotes (and spaces) are not recognized.
- updated to minor new version, as go to definition and find all references work more stable and is usable.

## 0.0.9

- minor bugfix in class clComment

## 0.0.8

- added Go to Definition, Find all References and Show Symbol provider (CTRL-T) - still in beta testing!

## 0.0.7

- test with icon - still work in progress

## 0.0.6

- Changed behaviour of DocumentSymbolProvider - now all table commands are found

## 0.0.4

- Add excludevalues and include values to language
- Changed symbol search to "table = KOPF by ACHSE;"

## 0.0.3

- Now with an icon-picture

## 0.0.2

- Slightly changes in snipped file and syntax highlighting file

## 0.0.1

- Initial release
