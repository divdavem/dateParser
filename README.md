# Date parser

This is a small date parser prototype written in JavaScript which can parse a date according to a pattern.
It uses a [pegjs](http://pegjs.majda.cz/) grammar ([this one](inputPatternParser.pegjs)) to parse the pattern.

To install globally:

```
  git clone https://github.com/divdavem/dateParser.git
  npm link
```

Usage:

```
dateParser <date> <inputPattern>
```

Examples:

```
   dateParser "Monday 03 november 2014" "EEEE dd MMMM yyyy"
   dateParser "03/11/2014" "dd/MM/yyyy"
   dateParser "03/11/2014" "MM/dd/yyyy"
```
