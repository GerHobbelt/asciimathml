asciimathml
===========

A new home for asciimathml

ASCIIMathML.js is a compact JavaScript program that translates
simple calculator-style math expressions on a webpage to MathML.

The resulting page can be displayed with any browser that can render MathML.
Currently that includes any recent version of Firefox (3+).


This is a fork
==============

This is a fork of the
[asciimathml](https://github.com/asciimath/asciimathml) repository
providing the conversion scripts (originally for web browsers):

* ASCIIMathML.js is a compact JavaScript program that translates
  simple calculator-style math expressions on a webpage to MathML.
* asciimath-based/ASCIIMathTeXImg.js provides utility functions
  AMTparseAMtoTeX, AMparseMath, and AMprocessNode to convert
  expressions in AsciiMath notation into LaTeX expressions.


## Dependencies

You need node.js to install the required modules.

```
npm install
```

## Usage

[Run pandoc with](http://pandoc.org/scripting.html#json-filters) this filter:

```
pandoc --filter ./path/to/asciimathfilter.js [your options ...]
```

The filter will apply conversion on any inline or block math object beginning with `:a` or `&`, e. g. `$&a^2+b^2 = c^2$`.
