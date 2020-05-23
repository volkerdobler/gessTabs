# Change Log

All notable changes to the "gesstabs" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 0.0.1

- Initial release

## 0.0.2

- Slightly changes in snipped file and syntax highlighting file

## 0.0.3

- Now with an icon-picture

## 0.0.4

- Add excludevalues and include values to language
- Changed symbol search to "table = KOPF by ACHSE;"

## 0.0.6

- Changed behaviour of DocumentSymbolProvider - now all table commands are found

## 0.0.7

- test with icon - still work in progress

## 0.0.8

- added Go to Definition, Find all References and Show Symbol provider (CTRL-T) - still in beta testing!

## 0.0.9

- minor bugfix in class clComment

## 0.1.0

- Changed variable definition. Now, dots are part of a gesstabs variable name. Follows definition from manual,
  beside the fact, that variables names with quotes (and spaces) are not recognized.
- updated to minor new version, as go to definition and find all references work more stable and is usable.

## 0.1.1

- Added fix to find also files in subdirectories
- Changed tmLanguage file

## next release (0.2.0)

- Updated Symbols in tmLanguage file
- Changed how to identify comments, now the scope will be identified for each char including comments & strings
