/*
ASCIIMathTeXImg.js
==================
Based on ASCIIMathML, Version 1.4.7 Aug 30, 2005, (c) Peter Jipsen http://www.chapman.edu/~jipsen
Modified with TeX conversion for IMG rendering Sept 6, 2006 (c) David Lippman http://www.pierce.ctc.edu/dlippman
  Updated to match ver 2.2 Mar 3, 2014

This file contains JavaScript functions to convert ASCII math notation
and (some) LaTeX to image-rendered LaTeX. The conversion is done while the
HTML page loads and should work with all browsers while the (local or remote)
mimeTeX service is accessible and available to render the produced LaTeX to IMG.

Just add the next lines to your HTML page with this file in the same folder:

    <script type="text/javascript">
    var asciimath = {
      config: {
        AMTcgiloc: 'http://www.imathas.com/cgi-bin/mimetex.cgi',
        // displaystyle: true,
        // debug: true,
      },
    };
    </script>
    <script type="text/javascript" src="ASCIIMathTeXImg.js"></script>

Latest version at https://github.com/mathjax/asciimathml
If you use it on a webpage, please send the URL to jipsen@chapman.edu

Copyright (c) 2014 Peter Jipsen and other ASCIIMathML.js contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// Import/export only one global var! All configuration items reside under `asciimath.config`.
var asciimath = (function (asciimath) {
  var config = {
    AMTcgiloc: "",                 // set to the URL of your LaTeX renderer, e.g.
    // http://www.imathas.com/cgi-bin/mimetex.cgi
    mathcolor: "",                 // defaults to black, or specify another color
    mathfontsize: "1em",           // change to e.g. 1.2em for larger math
    mathfontfamily: "serif",       // change to "" to inherit (works in IE)
    // or another family (e.g. "arial")
    mathbg: "",                    // set to 'dark' when you have a dark background
    debug: false,                  // true: print some progress and diagnostics info lines in the console
    automathrecognize: false,      // writing "amath" on page makes this true
    checkForMathML: true,          // check if browser can display MathML
    notifyIfNoMathML: true,        // display note if no MathML capability
    alertIfNoMathML: false,        // show alert box if no MathML capability
    translateOnLoad: true,         // set to `false` to do call translators from js,
    // set to `true` to autotranslate
    translateASCIIMath: true,      // false to preserve `..`
    displaystyle: true,            // puts limits above and below large operators
    showasciiformulaonhover: true, // helps students learn ASCIIMath
    decimalsign: ".",              // if "," then when writing lists or matrices put
    // a space after the "," like `(1, 2)` not `(1,2)`
    decimalsignAlternative: ".",   // if "," then when writing lists or matrices put
    // a space after the "," like `(1, 2)` not `(1,2)`
    AMdelimiter1: "`",             // can use other characters
    AMescape1: "\\\\`",            // can use other characters
    AMusedelimiter2: true,         // whether to use second delimiter below
    AMdelimiter2: "$",
    AMescape2: "\\\\\\$",
    AMdelimiter2regexp: "\\$",
    AMdocumentId: "wikitext",      // PmWiki element containing math (default=body)
    doubleblankmathdelimiter: false, // if true,  x+1  is equal to `x+1`
    fixphi: true                  // false to return to legacy phi/varphi mapping
  };

  // set up global var and mix config object:
  asciimath = asciimath || {};
  if (asciimath.config) {
  // special callback: this is invoked before any ASCIImath data is set up;
  // not even the configuration settings have been initialized!
    if (typeof asciimath.config.preInitConfig === "function") {
      var data = {
        defaultConfig: config,
        asciimath: asciimath
      };
      asciimath.config.preInitConfig(data);      
    }
    
    // also track which options the user specified which we don't know about:
    // help diagnose user config coding errors.
    var unused = [];

    for (var key in asciimath.config) {
      if (key in config) {
        if (asciimath.config[key] != null) {
          config[key] = asciimath.config[key];
        }
      } else {
      // Old versions use the "decimal" option, which will get reported as "unused",
      // requiring those old codes to be upgraded. We no longer take that obsolete
      // option into account. See issue 384.
        unused.push(key);
      }
    }

    // report any unknown user option entries:
    if (unused.length) {
      var msg = "ASCIImath: user config object contains these unknown options:\n" +
        "  {" + unused.join(",") + "}\n" +
        "Please remove these from your `asciimath.config` object.";
      if (typeof console !== "undefined" && typeof console.error === "function") {
        console.error(msg);
      } else {
        throw new Error(msg);
      }
    }
  }
  config = asciimath.config = config;

  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


  /////////////////////////////////////////////////
  // === ASCIIMATH->MATHJAX COMMENTED SECTION 1 ===
  /////////////////////////////////////////////////

  var noMathML = false;
  var translated = false;


  // Add a stylesheet, replacing any previous custom stylesheet (adapted from TW)
  function setStylesheet(s) {
    var id = "AMMLcustomStyleSheet";
    var n = document.getElementById(id);
    if (document.createStyleSheet) {
    // Test for IE's non-standard createStyleSheet method
      if (n) {
        n.parentNode.removeChild(n);
      }
      // This failed without the &nbsp;
      document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeEnd", "&nbsp;<style id='" + id + "'>" + s + "</style>");
    } else {
      if (n) {
        n.replaceChild(document.createTextNode(s), n.firstChild);
      } else {
        n = document.createElement("style");
        n.type = "text/css";
        n.id = id;
        n.appendChild(document.createTextNode(s));
        document.getElementsByTagName("head")[0].appendChild(n);
      }
    }
  }

  setStylesheet([
    "#AMMLcloseDiv {font-size:0.8em; padding-top:1em; color:#014}",
    "#AMMLwarningBox {position:absolute; width:100%; top:0; left:0;" +
  " z-index:200; text-align:center; font-size:1em; font-weight:bold;" +
  " padding:0.5em 0 0.5em 0; color:#ffc; background:#c30}"
  ].join("\n"));

  function init() {
    var msg;
    var warnings = new Array();
    if (document.getElementById == null) {
      alert("This webpage requires a recent browser such as Mozilla Firefox");
      return false;
    }
    if (config.checkForMathML) {
      msg = checkMathML();
      if (msg && typeof msg !== "boolean") {
        warnings.push(msg);
      }
      noMathML = !!msg;
    }
    if (warnings.length > 0) {
      displayWarnings(warnings);
    }
    if (!noMathML) {
      initSymbols();
    }
    return true;
  }

  function checkMathML() {
    var noML = false;

    //noML = true; // uncomment to check
    if (noML && config.notifyIfNoMathML) {
      var msg = "To view the ASCIIMathML notation use Internet Explorer + MathPlayer or Mozilla Firefox 2.0 or later.";
      if (config.alertIfNoMathML) {
        alert(msg);
        return true;
      }
      return msg;
    }
    return noML;
  }

  function hideWarning() {
    var body = document.getElementsByTagName("body")[0];
    body.removeChild(document.getElementById("AMMLwarningBox"));
    body.onclick = null;
  }

  function displayWarnings(warnings) {
    var i;
    var frag;
    var nd = createElementXHTML("div");
    var body = document.getElementsByTagName("body")[0];
    body.onclick = hideWarning;
    nd.id = "AMMLwarningBox";
    for (i = 0; i < warnings.length; i++) {
      frag = createElementXHTML("div");
      frag.appendChild(document.createTextNode(warnings[i]));
      frag.style.paddingBottom = "1.0em";
      nd.appendChild(frag);
    }
    nd.appendChild(createElementXHTML("p"));
    nd.appendChild(document.createTextNode("For instructions see the "));
    var an = createElementXHTML("a");
    an.appendChild(document.createTextNode("ASCIIMathML"));
    an.setAttribute("href", "http://www.chapman.edu/~jipsen/asciimath.html");
    nd.appendChild(an);
    nd.appendChild(document.createTextNode(" homepage"));
    an = createElementXHTML("div");
    an.id = "AMMLcloseDiv";
    an.appendChild(document.createTextNode("(click anywhere to close this warning)"));
    nd.appendChild(an);
    var body = document.getElementsByTagName("body")[0];
    body.insertBefore(nd, body.childNodes[0]);
  }

  function translate(spanclassAM) {
    if (!translated) {
    // run this only once
      translated = true;
      var body = document.getElementsByTagName("body")[0];
      var processN = document.getElementById(config.AMdocumentId);
      if (config.translateASCIIMath) {
        AMprocessNode(processN != null ? processN : body, false, spanclassAM);
      }
    }
  }

  function createElementXHTML(t) {
    return document.createElement(t);
  }


  /////////////////////////////////////////////////////
  // === END ASCIIMATH->MATHJAX COMMENTED SECTION 1 ===
  /////////////////////////////////////////////////////

  function newcommand(oldstr, newstr) {
    AMsymbols.push({ input: oldstr, tag: "mo", output: newstr, tex: null, ttype: DEFINITION });
    refreshSymbols(); // this may be a problem if many symbols are defined!
  }

  function newsymbol(symbolobj) {
    AMsymbols.push(symbolobj);
    refreshSymbols();
  }

  // character lists for Mozilla/Netscape fonts
  var AMcal = [
    "\uD835\uDC9C",
    "\u212C",
    "\uD835\uDC9E",
    "\uD835\uDC9F",
    "\u2130",
    "\u2131",
    "\uD835\uDCA2",
    "\u210B",
    "\u2110",
    "\uD835\uDCA5",
    "\uD835\uDCA6",
    "\u2112",
    "\u2133",
    "\uD835\uDCA9",
    "\uD835\uDCAA",
    "\uD835\uDCAB",
    "\uD835\uDCAC",
    "\u211B",
    "\uD835\uDCAE",
    "\uD835\uDCAF",
    "\uD835\uDCB0",
    "\uD835\uDCB1",
    "\uD835\uDCB2",
    "\uD835\uDCB3",
    "\uD835\uDCB4",
    "\uD835\uDCB5",
    "\uD835\uDCB6",
    "\uD835\uDCB7",
    "\uD835\uDCB8",
    "\uD835\uDCB9",
    "\u212F",
    "\uD835\uDCBB",
    "\u210A",
    "\uD835\uDCBD",
    "\uD835\uDCBE",
    "\uD835\uDCBF",
    "\uD835\uDCC0",
    "\uD835\uDCC1",
    "\uD835\uDCC2",
    "\uD835\uDCC3",
    "\u2134",
    "\uD835\uDCC5",
    "\uD835\uDCC6",
    "\uD835\uDCC7",
    "\uD835\uDCC8",
    "\uD835\uDCC9",
    "\uD835\uDCCA",
    "\uD835\uDCCB",
    "\uD835\uDCCC",
    "\uD835\uDCCD",
    "\uD835\uDCCE",
    "\uD835\uDCCF"
  ];

  var AMfrk = [
    "\uD835\uDD04",
    "\uD835\uDD05",
    "\u212D",
    "\uD835\uDD07",
    "\uD835\uDD08",
    "\uD835\uDD09",
    "\uD835\uDD0A",
    "\u210C",
    "\u2111",
    "\uD835\uDD0D",
    "\uD835\uDD0E",
    "\uD835\uDD0F",
    "\uD835\uDD10",
    "\uD835\uDD11",
    "\uD835\uDD12",
    "\uD835\uDD13",
    "\uD835\uDD14",
    "\u211C",
    "\uD835\uDD16",
    "\uD835\uDD17",
    "\uD835\uDD18",
    "\uD835\uDD19",
    "\uD835\uDD1A",
    "\uD835\uDD1B",
    "\uD835\uDD1C",
    "\u2128",
    "\uD835\uDD1E",
    "\uD835\uDD1F",
    "\uD835\uDD20",
    "\uD835\uDD21",
    "\uD835\uDD22",
    "\uD835\uDD23",
    "\uD835\uDD24",
    "\uD835\uDD25",
    "\uD835\uDD26",
    "\uD835\uDD27",
    "\uD835\uDD28",
    "\uD835\uDD29",
    "\uD835\uDD2A",
    "\uD835\uDD2B",
    "\uD835\uDD2C",
    "\uD835\uDD2D",
    "\uD835\uDD2E",
    "\uD835\uDD2F",
    "\uD835\uDD30",
    "\uD835\uDD31",
    "\uD835\uDD32",
    "\uD835\uDD33",
    "\uD835\uDD34",
    "\uD835\uDD35",
    "\uD835\uDD36",
    "\uD835\uDD37"
  ];

  var AMbbb = [
    "\uD835\uDD38",
    "\uD835\uDD39",
    "\u2102",
    "\uD835\uDD3B",
    "\uD835\uDD3C",
    "\uD835\uDD3D",
    "\uD835\uDD3E",
    "\u210D",
    "\uD835\uDD40",
    "\uD835\uDD41",
    "\uD835\uDD42",
    "\uD835\uDD43",
    "\uD835\uDD44",
    "\u2115",
    "\uD835\uDD46",
    "\u2119",
    "\u211A",
    "\u211D",
    "\uD835\uDD4A",
    "\uD835\uDD4B",
    "\uD835\uDD4C",
    "\uD835\uDD4D",
    "\uD835\uDD4E",
    "\uD835\uDD4F",
    "\uD835\uDD50",
    "\u2124",
    "\uD835\uDD52",
    "\uD835\uDD53",
    "\uD835\uDD54",
    "\uD835\uDD55",
    "\uD835\uDD56",
    "\uD835\uDD57",
    "\uD835\uDD58",
    "\uD835\uDD59",
    "\uD835\uDD5A",
    "\uD835\uDD5B",
    "\uD835\uDD5C",
    "\uD835\uDD5D",
    "\uD835\uDD5E",
    "\uD835\uDD5F",
    "\uD835\uDD60",
    "\uD835\uDD61",
    "\uD835\uDD62",
    "\uD835\uDD63",
    "\uD835\uDD64",
    "\uD835\uDD65",
    "\uD835\uDD66",
    "\uD835\uDD67",
    "\uD835\uDD68",
    "\uD835\uDD69",
    "\uD835\uDD6A",
    "\uD835\uDD6B"
  ];

  /*
var AMcal = [
  0xef35,
  0x212c,
  0xef36,
  0xef37,
  0x2130,
  0x2131,
  0xef38,
  0x210b,
  0x2110,
  0xef39,
  0xef3a,
  0x2112,
  0x2133,
  0xef3b,
  0xef3c,
  0xef3d,
  0xef3e,
  0x211b,
  0xef3f,
  0xef40,
  0xef41,
  0xef42,
  0xef43,
  0xef44,
  0xef45,
  0xef46,
];
var AMfrk = [
  0xef5d,
  0xef5e,
  0x212d,
  0xef5f,
  0xef60,
  0xef61,
  0xef62,
  0x210c,
  0x2111,
  0xef63,
  0xef64,
  0xef65,
  0xef66,
  0xef67,
  0xef68,
  0xef69,
  0xef6a,
  0x211c,
  0xef6b,
  0xef6c,
  0xef6d,
  0xef6e,
  0xef6f,
  0xef70,
  0xef71,
  0x2128,
];
var AMbbb = [
  0xef8c,
  0xef8d,
  0x2102,
  0xef8e,
  0xef8f,
  0xef90,
  0xef91,
  0x210d,
  0xef92,
  0xef93,
  0xef94,
  0xef95,
  0xef96,
  0x2115,
  0xef97,
  0x2119,
  0x211a,
  0x211d,
  0xef98,
  0xef99,
  0xef9a,
  0xef9b,
  0xef9c,
  0xef9d,
  0xef9e,
  0x2124,
];
*/

  var CONST = 0;
  var UNARY = 1;
  var BINARY = 2;
  var INFIX = 3;
  var LEFTBRACKET = 4;
  var RIGHTBRACKET = 5;
  var SPACE = 6;
  var UNDEROVER = 7;
  var DEFINITION = 8;
  var LEFTRIGHT = 9;
  var TEXT = 10;
  var BIG = 11;
  var LONG = 12;
  var STRETCHY = 13;
  var MATRIX = 14;
  var UNARYUNDEROVER = 15; // token types

  var AMquote = { input: '"', tag: "mtext", output: "mbox", tex: null, ttype: TEXT };
  var AMvar = { input: "#", tag: "mtext", output: "mathit", tex: null, ttype: TEXT };
  var AMunit = { input: "`", tag: "mtext", output: "mbox", tex: null, ttype: TEXT };

  var AMsymbols = [
  //some greek symbols
    { input: "alpha", tag: "mi", output: "\u03B1", tex: null, ttype: CONST },
    { input: "beta", tag: "mi", output: "\u03B2", tex: null, ttype: CONST },
    { input: "chi", tag: "mi", output: "\u03C7", tex: null, ttype: CONST },
    { input: "delta", tag: "mi", output: "\u03B4", tex: null, ttype: CONST },
    { input: "Delta", tag: "mo", output: "\u0394", tex: null, ttype: CONST },
    { input: "epsi", tag: "mi", output: "\u03B5", tex: "epsilon", ttype: CONST },
    { input: "varepsilon", tag: "mi", output: "\u025B", tex: null, ttype: CONST },
    { input: "eta", tag: "mi", output: "\u03B7", tex: null, ttype: CONST },
    { input: "gamma", tag: "mi", output: "\u03B3", tex: null, ttype: CONST },
    { input: "Gamma", tag: "mo", output: "\u0393", tex: null, ttype: CONST },
    { input: "iota", tag: "mi", output: "\u03B9", tex: null, ttype: CONST },
    { input: "kappa", tag: "mi", output: "\u03BA", tex: null, ttype: CONST },
    { input: "lambda", tag: "mi", output: "\u03BB", tex: null, ttype: CONST },
    { input: "Lambda", tag: "mo", output: "\u039B", tex: null, ttype: CONST },
    { input: "lamda", tag: "mi", output: "lambda", tex: null, ttype: DEFINITION },
    { input: "Lamda", tag: "mo", output: "Lambda", tex: null, ttype: DEFINITION },
    { input: "mu", tag: "mi", output: "\u03BC", tex: null, ttype: CONST },
    { input: "nu", tag: "mi", output: "\u03BD", tex: null, ttype: CONST },
    { input: "omega", tag: "mi", output: "\u03C9", tex: null, ttype: CONST },
    { input: "Omega", tag: "mo", output: "\u03A9", tex: null, ttype: CONST },
    { input: "phi", tag: "mi", output: config.fixphi ? "\u03D5" : "\u03C6", tex: null, ttype: CONST },
    { input: "varphi", tag: "mi", output: config.fixphi ? "\u03C6" : "\u03D5", tex: null, ttype: CONST },
    { input: "Phi", tag: "mo", output: "\u03A6", tex: null, ttype: CONST },
    { input: "pi", tag: "mi", output: "\u03C0", tex: null, ttype: CONST },
    { input: "Pi", tag: "mo", output: "\u03A0", tex: null, ttype: CONST },
    { input: "psi", tag: "mi", output: "\u03C8", tex: null, ttype: CONST },
    { input: "Psi", tag: "mi", output: "\u03A8", tex: null, ttype: CONST },
    { input: "rho", tag: "mi", output: "\u03C1", tex: null, ttype: CONST },
    { input: "sigma", tag: "mi", output: "\u03C3", tex: null, ttype: CONST },
    { input: "Sigma", tag: "mo", output: "\u03A3", tex: null, ttype: CONST },
    { input: "tau", tag: "mi", output: "\u03C4", tex: null, ttype: CONST },
    { input: "theta", tag: "mi", output: "\u03B8", tex: null, ttype: CONST },
    { input: "vartheta", tag: "mi", output: "\u03D1", tex: null, ttype: CONST },
    { input: "Theta", tag: "mo", output: "\u0398", tex: null, ttype: CONST },
    { input: "upsilon", tag: "mi", output: "\u03C5", tex: null, ttype: CONST },
    { input: "xi", tag: "mi", output: "\u03BE", tex: null, ttype: CONST },
    { input: "Xi", tag: "mo", output: "\u039E", tex: null, ttype: CONST },
    { input: "zeta", tag: "mi", output: "\u03B6", tex: null, ttype: CONST },

    //binary operation symbols
    //{ input: "-", tag: "mo", output: "-", tex: null, ttype: CONST },
    { input: "*", tag: "mo", output: "\u22C5", tex: "cdot", ttype: CONST },
    { input: "**", tag: "mo", output: "\u2217", tex: "ast", ttype: CONST },
    { input: "***", tag: "mo", output: "\u22C6", tex: "star", ttype: CONST },
    { input: "//", tag: "mo", output: "/", tex: "/", ttype: CONST, val: true, notexcopy: true },
    { input: "\\\\", tag: "mo", output: "\\", tex: "backslash", ttype: CONST },
    { input: "setminus", tag: "mo", output: "\\", tex: null, ttype: CONST },
    { input: "xx", tag: "mo", output: "\u00D7", tex: "times", ttype: CONST },
    { input: "|><", tag: "mo", output: "\u22C9", tex: "ltimes", ttype: CONST },
    { input: "><|", tag: "mo", output: "\u22CA", tex: "rtimes", ttype: CONST },
    { input: "|><|", tag: "mo", output: "\u22C8", tex: "bowtie", ttype: CONST },
    { input: "-:", tag: "mo", output: "\u00F7", tex: "div", ttype: CONST },
    { input: "divide", tag: "mo", output: "-:", tex: null, ttype: DEFINITION },
    { input: "@", tag: "mo", output: "\u2218", tex: "circ", ttype: CONST },
    { input: "o+", tag: "mo", output: "\u2295", tex: "oplus", ttype: CONST },
    { input: "ox", tag: "mo", output: "\u2297", tex: "otimes", ttype: CONST },
    { input: "o.", tag: "mo", output: "\u2299", tex: "odot", ttype: CONST },
    { input: "sum", tag: "mo", output: "\u2211", tex: null, ttype: UNDEROVER },
    { input: "prod", tag: "mo", output: "\u220F", tex: null, ttype: UNDEROVER },
    { input: "^^", tag: "mo", output: "\u2227", tex: "wedge", ttype: CONST },
    { input: "^^^", tag: "mo", output: "\u22C0", tex: "bigwedge", ttype: UNDEROVER },
    { input: "vv", tag: "mo", output: "\u2228", tex: "vee", ttype: CONST },
    { input: "vvv", tag: "mo", output: "\u22C1", tex: "bigvee", ttype: UNDEROVER },
    { input: "nn", tag: "mo", output: "\u2229", tex: "cap", ttype: CONST },
    { input: "nnn", tag: "mo", output: "\u22C2", tex: "bigcap", ttype: UNDEROVER },
    { input: "uu", tag: "mo", output: "\u222A", tex: "cup", ttype: CONST },
    { input: "uuu", tag: "mo", output: "\u22C3", tex: "bigcup", ttype: UNDEROVER },

    //binary relation symbols
    { input: "!=", tag: "mo", output: "\u2260", tex: "ne", ttype: CONST },
    { input: ":=", tag: "mo", output: ":=", tex: null, ttype: CONST },
    { input: "lt", tag: "mo", output: "<", tex: null, ttype: CONST },
    { input: "<=", tag: "mo", output: "\u2264", tex: "le", ttype: CONST },
    { input: "lt=", tag: "mo", output: "\u2264", tex: "leq", ttype: CONST },
    { input: "gt", tag: "mo", output: ">", tex: null, ttype: CONST },
    { input: "mlt", tag: "mo", output: "\u226A", tex: "ll", ttype: CONST },
    { input: ">=", tag: "mo", output: "\u2265", tex: "ge", ttype: CONST },
    { input: "gt=", tag: "mo", output: "\u2265", tex: "geq", ttype: CONST },
    { input: "mgt", tag: "mo", output: "\u226B", tex: "gg", ttype: CONST },
    { input: "-<", tag: "mo", output: "\u227A", tex: "prec", ttype: CONST },
    { input: "-lt", tag: "mo", output: "\u227A", tex: null, ttype: CONST },
    { input: ">-", tag: "mo", output: "\u227B", tex: "succ", ttype: CONST },
    { input: "-<=", tag: "mo", output: "\u2AAF", tex: "preceq", ttype: CONST },
    { input: ">-=", tag: "mo", output: "\u2AB0", tex: "succeq", ttype: CONST },
    { input: "in", tag: "mo", output: "\u2208", tex: null, ttype: CONST },
    { input: "!in", tag: "mo", output: "\u2209", tex: "notin", ttype: CONST },
    { input: "sub", tag: "mo", output: "\u2282", tex: "subset", ttype: CONST },
    { input: "sup", tag: "mo", output: "\u2283", tex: "supset", ttype: CONST },
    { input: "sube", tag: "mo", output: "\u2286", tex: "subseteq", ttype: CONST },
    { input: "supe", tag: "mo", output: "\u2287", tex: "supseteq", ttype: CONST },
    { input: "-=", tag: "mo", output: "\u2261", tex: "equiv", ttype: CONST },
    { input: "~=", tag: "mo", output: "\u2245", tex: "stackrel{\\sim}{=}", notexcopy: true, ttype: CONST }, // back hack b/c mimetex doesn't support /cong
    { input: "cong", tag: "mo", output: "~=", tex: null, ttype: DEFINITION },
    { input: "~~", tag: "mo", output: "\u2248", tex: "approx", ttype: CONST },
    { input: "prop", tag: "mo", output: "\u221D", tex: "propto", ttype: CONST },

    //logical symbols
    { input: "and", tag: "mtext", output: "and", tex: null, ttype: SPACE },
    { input: "or", tag: "mtext", output: "or", tex: null, ttype: SPACE },
    { input: "not", tag: "mo", output: "\u00AC", tex: "neg", ttype: CONST },
    { input: "=>", tag: "mo", output: "\u21D2", tex: "Rightarrow", ttype: CONST },
    { input: "implies", tag: "mo", output: "=>", tex: null, ttype: DEFINITION },
    { input: "if", tag: "mo", output: "if", tex: null, ttype: SPACE },
    { input: "<=>", tag: "mo", output: "\u21D4", tex: "Leftrightarrow", ttype: CONST },
    { input: "iff", tag: "mo", output: "<=>", tex: null, ttype: DEFINITION },
    { input: "AA", tag: "mo", output: "\u2200", tex: "forall", ttype: CONST },
    { input: "EE", tag: "mo", output: "\u2203", tex: "exists", ttype: CONST },
    { input: "_|_", tag: "mo", output: "\u22A5", tex: "bot", ttype: CONST },
    { input: "TT", tag: "mo", output: "\u22A4", tex: "top", ttype: CONST },
    { input: "|--", tag: "mo", output: "\u22A2", tex: "vdash", ttype: CONST },
    { input: "|==", tag: "mo", output: "\u22A8", tex: "models", ttype: CONST }, // mimetex doesn't support this one

    //grouping brackets
    { input: "(", tag: "mo", output: "(", tex: null, ttype: LEFTBRACKET, val: true },
    { input: ")", tag: "mo", output: ")", tex: null, ttype: RIGHTBRACKET, val: true },
    { input: "[", tag: "mo", output: "[", tex: null, ttype: LEFTBRACKET, val: true },
    { input: "]", tag: "mo", output: "]", tex: null, ttype: RIGHTBRACKET, val: true },
    { input: "left(", tag: "mo", output: "(", tex: "(", notexcopy: true, ttype: LEFTBRACKET, val: true },
    { input: "right)", tag: "mo", output: ")", tex: ")", notexcopy: true, ttype: RIGHTBRACKET, val: true },
    { input: "left[", tag: "mo", output: "[", tex: "[", notexcopy: true, ttype: LEFTBRACKET, val: true },
    { input: "right]", tag: "mo", output: "]", tex: "]", notexcopy: true, ttype: RIGHTBRACKET, val: true },
    { input: "{", tag: "mo", output: "{", tex: "lbrace", ttype: LEFTBRACKET },
    { input: "}", tag: "mo", output: "}", tex: "rbrace", ttype: RIGHTBRACKET },
    { input: "|", tag: "mo", output: "|", tex: null, ttype: LEFTRIGHT, val: true },
    { input: ":|:", tag: "mo", output: "|", tex: "|", ttype: CONST, notexcopy: true, val: true },
    { input: "|:", tag: "mo", output: "|", tex: "|", ttype: LEFTBRACKET, notexcopy: true, val: true },
    { input: ":|", tag: "mo", output: "|", tex: "|", ttype: RIGHTBRACKET, notexcopy: true, val: true },
    //{input:"||", tag:"mo", output:"||", tex:null, ttype:LEFTRIGHT},
    { input: "(:", tag: "mo", output: "\u2329", tex: "langle", ttype: LEFTBRACKET },
    { input: ":)", tag: "mo", output: "\u232A", tex: "rangle", ttype: RIGHTBRACKET },
    { input: "<<", tag: "mo", output: "\u2329", tex: "langle", ttype: LEFTBRACKET },
    { input: ">>", tag: "mo", output: "\u232A", tex: "rangle", ttype: RIGHTBRACKET },
    { input: "{:", tag: "mo", output: "{:", tex: null, ttype: LEFTBRACKET, invisible: true },
    { input: ":}", tag: "mo", output: ":}", tex: null, ttype: RIGHTBRACKET, invisible: true },

    //miscellaneous symbols
    { input: "int", tag: "mo", output: "\u222B", tex: null, ttype: CONST },
    { input: "dx", tag: "mi", output: "{:d x:}", tex: null, ttype: DEFINITION },
    { input: "dy", tag: "mi", output: "{:d y:}", tex: null, ttype: DEFINITION },
    { input: "dz", tag: "mi", output: "{:d z:}", tex: null, ttype: DEFINITION },
    { input: "dt", tag: "mi", output: "{:d t:}", tex: null, ttype: DEFINITION },
    { input: "oint", tag: "mo", output: "\u222E", tex: null, ttype: CONST },
    { input: "del", tag: "mo", output: "\u2202", tex: "partial", ttype: CONST },
    { input: "grad", tag: "mo", output: "\u2207", tex: "nabla", ttype: CONST },
    { input: "+-", tag: "mo", output: "\u00B1", tex: "pm", ttype: CONST },
    { input: "O/", tag: "mo", output: "\u2205", tex: "emptyset", ttype: CONST },
    { input: "oo", tag: "mo", output: "\u221E", tex: "infty", ttype: CONST },
    { input: "aleph", tag: "mo", output: "\u2135", tex: null, ttype: CONST },
    { input: "...", tag: "mo", output: "...", tex: "ldots", ttype: CONST },
    { input: ":.", tag: "mo", output: "\u2234", tex: "therefore", ttype: CONST },
    { input: ":'", tag: "mo", output: "\u2235", tex: "because", ttype: CONST },
    { input: "/_", tag: "mo", output: "\u2220", tex: "angle", ttype: CONST },
    { input: "/_\\", tag: "mo", output: "\u25B3", tex: "triangle", ttype: CONST },
    { input: "'", tag: "mo", output: ["\u2032", "\u2033", "\u2034", "\u2057"], tex: "prime", ttype: CONST, tietoprev: "msup" },
    { input: "tilde", tag: "mover", output: "~", tex: null, ttype: UNARY, acc: true },
    { input: "\\ ", tag: "mo", output: "\u00A0", tex: null, ttype: CONST, val: true },
    { input: "frown", tag: "mo", output: "\u2322", tex: null, ttype: CONST },
    { input: "%", tag: "mo", output: "%", tex: "%", ttype: CONST, notexcopy: true },
    { input: "quad", tag: "mo", output: "\u00A0\u00A0", tex: null, ttype: CONST },
    { input: "qquad", tag: "mo", output: "\u00A0\u00A0\u00A0\u00A0", tex: null, ttype: CONST },
    { input: "cdots", tag: "mo", output: "\u22EF", tex: null, ttype: CONST },
    { input: "vdots", tag: "mo", output: "\u22EE", tex: null, ttype: CONST },
    { input: "ddots", tag: "mo", output: "\u22F1", tex: null, ttype: CONST },
    { input: "diamond", tag: "mo", output: "\u22C4", tex: null, ttype: CONST },
    { input: "square", tag: "mo", output: "\u25A1", tex: "boxempty", ttype: CONST },
    { input: "|__", tag: "mo", output: "\u230A", tex: "lfloor", ttype: CONST },
    { input: "__|", tag: "mo", output: "\u230B", tex: "rfloor", ttype: CONST },
    { input: "|~", tag: "mo", output: "\u2308", tex: "lceil", ttype: CONST },
    { input: "lceiling", tag: "mo", output: "|~", tex: null, ttype: DEFINITION },
    { input: "~|", tag: "mo", output: "\u2309", tex: "rceil", ttype: CONST },
    { input: "rceiling", tag: "mo", output: "~|", tex: null, ttype: DEFINITION },
    { input: "CC", tag: "mo", output: "\u2102", tex: "mathbb{C}", ttype: CONST, notexcopy: true },
    { input: "NN", tag: "mo", output: "\u2115", tex: "mathbb{N}", ttype: CONST, notexcopy: true },
    { input: "QQ", tag: "mo", output: "\u211A", tex: "mathbb{Q}", ttype: CONST, notexcopy: true },
    { input: "RR", tag: "mo", output: "\u211D", tex: "mathbb{R}", ttype: CONST, notexcopy: true },
    { input: "ZZ", tag: "mo", output: "\u2124", tex: "mathbb{Z}", ttype: CONST, notexcopy: true },
    { input: "f", tag: "mi", output: "f", tex: null, ttype: UNARY, func: true, val: true },
    { input: "g", tag: "mi", output: "g", tex: null, ttype: UNARY, func: true, val: true },
    { input: "''", tag: "mo", output: "''", tex: null, val: true },
    { input: "'''", tag: "mo", output: "'''", tex: null, val: true },
    { input: "''''", tag: "mo", output: "''''", tex: null, val: true },

    //standard functions
    { input: "lim", tag: "mo", output: "lim", tex: null, ttype: UNDEROVER },
    { input: "Lim", tag: "mo", output: "Lim", tex: null, ttype: UNDEROVER },
    { input: "sin", tag: "mo", output: "sin", tex: null, ttype: UNARY, func: true },
    { input: "cos", tag: "mo", output: "cos", tex: null, ttype: UNARY, func: true },
    { input: "tan", tag: "mo", output: "tan", tex: null, ttype: UNARY, func: true },
    { input: "sinh", tag: "mo", output: "sinh", tex: null, ttype: UNARY, func: true },
    { input: "cosh", tag: "mo", output: "cosh", tex: null, ttype: UNARY, func: true },
    { input: "tanh", tag: "mo", output: "tanh", tex: null, ttype: UNARY, func: true },
    { input: "cot", tag: "mo", output: "cot", tex: null, ttype: UNARY, func: true },
    { input: "sec", tag: "mo", output: "sec", tex: null, ttype: UNARY, func: true },
    { input: "csc", tag: "mo", output: "csc", tex: null, ttype: UNARY, func: true },
    { input: "arcsin", tag: "mo", output: "arcsin", tex: null, ttype: UNARY, func: true },
    { input: "arccos", tag: "mo", output: "arccos", tex: null, ttype: UNARY, func: true },
    { input: "arctan", tag: "mo", output: "arctan", tex: null, ttype: UNARY, func: true },
    { input: "coth", tag: "mo", output: "coth", tex: null, ttype: UNARY, func: true },
    { input: "sech", tag: "mo", output: "sech", tex: null, ttype: UNARY, func: true },
    { input: "csch", tag: "mo", output: "csch", tex: null, ttype: UNARY, func: true },
    { input: "exp", tag: "mo", output: "exp", tex: null, ttype: UNARY, func: true },
    { input: "abs", tag: "mo", output: "abs", tex: null, ttype: UNARY, notexcopy: true, rewriteleftright: ["|", "|"] },
    { input: "norm", tag: "mo", output: "norm", tex: null, ttype: UNARY, notexcopy: true, rewriteleftright: ["\\|", "\\|"] },
    { input: "floor", tag: "mo", output: "floor", tex: null, ttype: UNARY, notexcopy: true, rewriteleftright: ["\\lfloor", "\\rfloor"] },
    { input: "ceil", tag: "mo", output: "ceil", tex: null, ttype: UNARY, notexcopy: true, rewriteleftright: ["\\lceil", "\\rceil"] },
    { input: "log", tag: "mo", output: "log", tex: null, ttype: UNARY, func: true },
    { input: "ln", tag: "mo", output: "ln", tex: null, ttype: UNARY, func: true },
    { input: "det", tag: "mo", output: "det", tex: null, ttype: UNARY, func: true },
    { input: "dim", tag: "mo", output: "dim", tex: null, ttype: CONST },
    { input: "mod", tag: "mo", output: "mod", tex: "text{mod}", ttype: CONST, notexcopy: true },
    { input: "gcd", tag: "mo", output: "gcd", tex: null, ttype: UNARY, func: true },
    { input: "lcm", tag: "mo", output: "lcm", tex: "text{lcm}", ttype: UNARY, func: true, notexcopy: true },
    { input: "lub", tag: "mo", output: "lub", tex: null, ttype: CONST },
    { input: "glb", tag: "mo", output: "glb", tex: null, ttype: CONST },
    { input: "min", tag: "mo", output: "min", tex: null, ttype: UNDEROVER },
    { input: "max", tag: "mo", output: "max", tex: null, ttype: UNDEROVER },
    { input: "Sin", tag: "mo", output: "Sin", tex: null, ttype: UNARY, func: true },
    { input: "Cos", tag: "mo", output: "Cos", tex: null, ttype: UNARY, func: true },
    { input: "Tan", tag: "mo", output: "Tan", tex: null, ttype: UNARY, func: true },
    { input: "Arcsin", tag: "mo", output: "Arcsin", tex: null, ttype: UNARY, func: true },
    { input: "Arccos", tag: "mo", output: "Arccos", tex: null, ttype: UNARY, func: true },
    { input: "Arctan", tag: "mo", output: "Arctan", tex: null, ttype: UNARY, func: true },
    { input: "Sinh", tag: "mo", output: "Sinh", tex: null, ttype: UNARY, func: true },
    { input: "Cosh", tag: "mo", output: "Cosh", tex: null, ttype: UNARY, func: true },
    { input: "Tanh", tag: "mo", output: "Tanh", tex: null, ttype: UNARY, func: true },
    { input: "Cot", tag: "mo", output: "Cot", tex: null, ttype: UNARY, func: true },
    { input: "Sec", tag: "mo", output: "Sec", tex: null, ttype: UNARY, func: true },
    { input: "Csc", tag: "mo", output: "Csc", tex: null, ttype: UNARY, func: true },
    { input: "Log", tag: "mo", output: "Log", tex: null, ttype: UNARY, func: true },
    { input: "Ln", tag: "mo", output: "Ln", tex: null, ttype: UNARY, func: true },
    { input: "Abs", tag: "mo", output: "abs", tex: null, ttype: UNARY, notexcopy: true, rewriteleftright: ["|", "|"] },

    //arrows
    { input: "uarr", tag: "mo", output: "\u2191", tex: "uparrow", ttype: CONST },
    { input: "darr", tag: "mo", output: "\u2193", tex: "downarrow", ttype: CONST },
    { input: "rarr", tag: "mo", output: "\u2192", tex: "rightarrow", ttype: CONST },
    { input: "->", tag: "mo", output: "\u2192", tex: "to", ttype: CONST },
    { input: ">->", tag: "mo", output: "\u21A3", tex: "rightarrowtail", ttype: CONST },
    { input: "->>", tag: "mo", output: "\u21A0", tex: "twoheadrightarrow", ttype: CONST },
    { input: ">->>", tag: "mo", output: "\u2916", tex: "twoheadrightarrowtail", ttype: CONST },
    { input: "|->", tag: "mo", output: "\u21A6", tex: "mapsto", ttype: CONST },
    { input: "larr", tag: "mo", output: "\u2190", tex: "leftarrow", ttype: CONST },
    { input: "harr", tag: "mo", output: "\u2194", tex: "leftrightarrow", ttype: CONST },
    { input: "rArr", tag: "mo", output: "\u21D2", tex: "Rightarrow", ttype: CONST },
    { input: "lArr", tag: "mo", output: "\u21D0", tex: "Leftarrow", ttype: CONST },
    { input: "hArr", tag: "mo", output: "\u21D4", tex: "Leftrightarrow", ttype: CONST },

    //commands with argument
    { input: "sqrt", tag: "msqrt", output: "sqrt", tex: null, ttype: UNARY },
    { input: "Sqrt", tag: "msqrt", output: "sqrt", tex: null, ttype: UNARY },
    { input: "root", tag: "mroot", output: "root", tex: null, ttype: BINARY },
    { input: "frac", tag: "mfrac", output: "/", tex: null, ttype: BINARY },
    { input: "/", tag: "mfrac", output: "/", tex: null, ttype: INFIX },
    { input: "stackrel", tag: "mover", output: "stackrel", tex: null, ttype: BINARY },
    { input: "overset", tag: "mover", output: "stackrel", tex: null, ttype: BINARY },
    { input: "underset", tag: "munder", output: "stackrel", tex: null, ttype: BINARY },
    { input: "_", tag: "msub", output: "_", tex: null, ttype: INFIX },
    { input: "^", tag: "msup", output: "^", tex: null, ttype: INFIX },
    { input: "hat", tag: "mover", output: "\u005E", tex: null, ttype: UNARY, acc: true },
    { input: "bar", tag: "mover", output: "\u00AF", tex: "overline", ttype: UNARY, acc: true },
    { input: "vec", tag: "mover", output: "\u2192", tex: null, ttype: UNARY, acc: true },
    { input: "dot", tag: "mover", output: ".", tex: null, ttype: UNARY, acc: true },
    { input: "ddot", tag: "mover", output: "..", tex: null, ttype: UNARY, acc: true },
    { input: "overarc", tag: "mover", output: "\u23DC", tex: "stackrel{\\frown}", notexcopy: true, ttype: UNARY, acc: true },
    { input: "overparen", tag: "mover", output: "\u23DC", tex: "stackrel{\\frown}", notexcopy: true, ttype: UNARY, acc: true },
    { input: "ul", tag: "munder", output: "\u0332", tex: "underline", ttype: UNARY, acc: true },
    { input: "ubrace", tag: "munder", output: "\u23DF", tex: "underbrace", ttype: UNARY, acc: true },
    { input: "obrace", tag: "mover", output: "\u23DE", tex: "overbrace", ttype: UNARY, acc: true },
    { input: "text", tag: "mtext", output: "text", tex: null, ttype: TEXT },
    { input: "mbox", tag: "mtext", output: "mbox", tex: null, ttype: TEXT },
    { input: "color", tag: "mstyle", ttype: BINARY },
    { input: "id", tag: "mrow", ttype: BINARY },
    { input: "class", tag: "mrow", ttype: BINARY },
    { input: "cancel", tag: "menclose", output: "cancel", tex: null, ttype: UNARY },
    AMquote,
    AMvar,
    AMunit,
    { input: "bb", tag: "mstyle", atname: "mathvariant", atval: "bold", output: "bb", tex: "mathbf", ttype: UNARY, notexcopy: true },
    { input: "mathbf", tag: "mstyle", atname: "mathvariant", atval: "bold", output: "mathbf", tex: null, ttype: UNARY },
    { input: "sf", tag: "mstyle", atname: "mathvariant", atval: "sans-serif", output: "sf", tex: "mathsf", ttype: UNARY, notexcopy: true },
    { input: "mathsf", tag: "mstyle", atname: "mathvariant", atval: "sans-serif", output: "mathsf", tex: null, ttype: UNARY },
    { input: "bbb", tag: "mstyle", atname: "mathvariant", atval: "double-struck", output: "bbb", tex: "mathbb", ttype: UNARY, notexcopy: true },
    { input: "mathbb", tag: "mstyle", atname: "mathvariant", atval: "double-struck", output: "mathbb", tex: null, ttype: UNARY },
    { input: "cc", tag: "mstyle", atname: "mathvariant", atval: "script", output: "cc", tex: "mathcal", ttype: UNARY, notexcopy: true },
    { input: "mathcal", tag: "mstyle", atname: "mathvariant", atval: "script", output: "mathcal", tex: null, ttype: UNARY },
    { input: "tt", tag: "mstyle", atname: "mathvariant", atval: "monospace", output: "tt", tex: "mathtt", ttype: UNARY, notexcopy: true },
    { input: "mathtt", tag: "mstyle", atname: "mathvariant", atval: "monospace", output: "mathtt", tex: null, ttype: UNARY },
    { input: "fr", tag: "mstyle", atname: "mathvariant", atval: "fraktur", output: "fr", tex: "mathfrak", ttype: UNARY, notexcopy: true },
    { input: "mathfrak", tag: "mstyle", atname: "mathvariant", atval: "fraktur", output: "mathfrak", tex: null, ttype: UNARY }
  ];

  function compareNames(s1, s2) {
    if (s1.input > s2.input) {
      return 1;
    } else if (s1.input < s2.input) {
      return -1;
    } else if (s1.tex) {
      return 1;
    } else {
      return -1;
    }
  }

  var AMnames = []; // list of input symbols

  function initSymbols() {
  // special callback: this is invoked before ASCIImath symbol data is set up
  // but AFTER the ASCIImath configuration has been initialized completely.
  // This is the time where userland code gets to edit the symbol tables...
    if (typeof asciimath.config.preInitSymbols === "function") {
      var data = {
        AMsymbols: AMsymbols,
        asciimath: asciimath
      };
      asciimath.config.preInitSymbols(data);      
      AMsymbols = data.AMsymbols;   // this table may have been patched by the preInitSymbols() callback.
    }

    var symlen = AMsymbols.length;
    for (var i = 0; i < symlen; i++) {
      if (
        AMsymbols[i].tex &&
      !AMsymbols[i].notexcopy
      ) {
        AMsymbols.push({
          input: AMsymbols[i].tex,
          tag: AMsymbols[i].tag,
          output: AMsymbols[i].output,
          ttype: AMsymbols[i].ttype,
          atname: AMsymbols[i].atname,
          atval: AMsymbols[i].atval,
          tex: AMsymbols[i].tex,
          rewriteleftright: AMsymbols[i].rewriteleftright,
          acc: AMsymbols[i].acc || false,
          val: AMsymbols[i].val || false,
          func: AMsymbols[i].func || false,
          tietoprev: AMsymbols[i].tietoprev || false,
          notexcopy: true
        });
      }
    }
    refreshSymbols();
  }

  function refreshSymbols() {
    var i;
    var hashes = {};
    var collisions = [];

    // collision report helper: only produce the top level of the given symbol object.
    function d(o) {
      var rv = {};
      for (var k in o) {
        var i = o[k];
        switch (typeof i) {
        case "object":
          if (i != null) {
            rv[k] = "[...]";
          } else {
            rv[k] = null;
          }
          break;

        case "function":
          continue;

        default:
          rv[k] = i;
          break;
        }
      }
      return rv;
    }

    // collision report helper: check if two objects are exact copies
    function same(o1, o2) {
      var rv = {};
      // collect all keys of `o1` and `o2` both:
      for (var k in o1) {
        rv[k] = true;
      }
      for (var k in o2) {
        rv[k] = true;
      }
      // now check if all keys exist in both objects and have the same value.
      // (Due to the nature of the AMsymbols[] table, we only need to
      // check the top level of both objects, as any complex substructures
      // in any of these will be *references* to the same base item, hence
      // we can get away with comparing substructures using the simple `===`
      // operator:
      for (var k in rv) {
      //var chk = ((k in o1) && (k in o2) && (o1[k] === o2[k]));
      // ==> simplified version:
        var chk = o1[k] === o2[k];
        if (!chk) {
          return false;
        }
      }
      return true;
    }

    for (i = 0; i < AMsymbols.length; i++) {
      var key = "K" + AMsymbols[i].input;
      if (hashes[key]) {
      // check if objects are identical (which is okay as there are synonyms listed
      // in the AMSymbols[] table): if they are, we do not report this as a
      // collision:
        if (!same(AMsymbols[i], hashes[key])) {
          collisions.push([AMsymbols[i], hashes[key]]);
        } else {
        // remove dupe in the list:
          AMsymbols[i] = null;    
        }
      } else {
        hashes[key] = AMsymbols[i];
      }
    }
    AMsymbols = AMsymbols.filter(function (s) {
      return !!s;  // remove the duplicates
    });
  
    AMsymbols.sort(compareNames);
    // construct the AMnames symbol lookup index table after sorting:
    AMnames = [];
    for (i = 0; i < AMsymbols.length; i++) {
      AMnames[i] = AMsymbols[i].input;
    }
  
    if (collisions.length) {
      var msg = "ASCIImath: the symbol table has these colliding entries:\n";
      var lst = [];
      for (i = 0; i < collisions.length; i++) {
        var el = collisions[i];

        lst.push(JSON.stringify(d(el[0])) + " <===> " + JSON.stringify(d(el[1])));
      }
      msg += lst.join("\n");
      if (typeof console !== "undefined" && typeof console.error === "function") {
        console.error(msg);
      }
      throw new Error(msg);
    }
  }

  function AMremoveCharsAndBlanks(str, n) {
  // remove n characters and any following blanks
    var st;
    if (str.charAt(n) === "\\" && str.charAt(n + 1) !== "\\" && str.charAt(n + 1) !== " ") {
      st = str.slice(n + 1);
    } else {
      st = str.slice(n);
    }
    for (var i = 0; i < st.length && st.charCodeAt(i) <= 32; i = i + 1) {}
    return st.slice(i);
  }

  function AMposition(arr, str, n) {
  // return position >=n where str appears or would be inserted
  // assumes arr is sorted
    if (n === 0) {
      var h;
      var m;
      n = -1;
      h = arr.length;
      while (n + 1 < h) {
        m = (n + h) >> 1;
        if (arr[m] < str) {
          n = m;
        } else {
          h = m;
        }
      }
      return h;
    } else {
      for (var i = n; i < arr.length && arr[i] < str; i++) {}
      return i; // i=arr.length || arr[i]>=str
    }
  }

  function AMgetSymbol(str) {
  // return maximal initial substring of str that appears in names
  // return null if there is none
    var k = 0; // new pos
    var j = 0; // old pos
    var mk; // match pos
    var st;
    var tagst;
    var match = "";
    var more = true;
    for (var i = 1; i <= str.length && more; i++) {
      st = str.slice(0, i); // initial substring of length i
      j = k;
      k = AMposition(AMnames, st, j);
      if (k < AMnames.length && str.slice(0, AMnames[k].length) === AMnames[k]) {
        match = AMnames[k];
        mk = k;
        i = match.length;
      }
      more = k < AMnames.length && str.slice(0, AMnames[k].length) >= AMnames[k];
    }
    AMpreviousSymbol = AMcurrentSymbol;
    if (match !== "") {
      AMcurrentSymbol = AMsymbols[mk].ttype;
      // handle case where output depends on repetition of a character, like primes
      if (typeof AMsymbols[mk].output === "object") {
        var nextsym;
        var insym;
        var outsym;
        var symcnt = 1;
        insym = AMsymbols[mk].input;
        nextsym = str.substr(symcnt * AMsymbols[mk].input.length, AMsymbols[mk].input.length);
        while (nextsym === AMsymbols[mk].input) {
          symcnt++;
          insym += nextsym;
          nextsym = str.substr(symcnt * AMsymbols[mk].input.length, AMsymbols[mk].input.length);
        }
        if (symcnt <= AMsymbols[mk].output.length) {
          outsym = AMsymbols[mk].output[symcnt - 1];
        } else {
          outsym = "";
          for (var i = 0; i < symcnt; i++) {
            outsym += AMsymbols[mk].output[0];
          }
        }
        return {
          tag: AMsymbols[mk].tag,
          input: insym,
          output: outsym,
          ttype: AMsymbols[mk].ttype,
          tex: AMsymbols[mk].tex,
          tietoprev: AMsymbols[mk].tietoprev
        };
      }
      return AMsymbols[mk];
    }
    // if str[0] is a digit or `-` return maxsubstring of digits.digits
    AMcurrentSymbol = CONST;
    k = 1;
    st = str.slice(0, 1); // take 1 character
    var integ = true;
    while ("0" <= st && st <= "9" && k <= str.length) {
      st = str.slice(k, k + 1);
      k++;
    }
    if (st === config.decimalsign || st === config.decimalsignAlternative) {
      st = str.slice(k, k + 1);
      if ("0" <= st && st <= "9") {
        integ = false;
        k++;
        while ("0" <= st && st <= "9" && k <= str.length) {
          st = str.slice(k, k + 1);
          k++;
        }
      }
    }
    if ((integ && k > 1) || k > 2) {
      st = str.slice(0, k - 1);
      tagst = "mn";
    } else {
      k = 2;
      st = str.slice(0, 1); // take 1 character
      tagst = ("A" > st || st > "Z") && ("a" > st || st > "z") ? "mo" : "mi";
    }
    if (st === "-" && AMpreviousSymbol === INFIX) {
    // trick "/" into recognizing "-" on second parse
      AMcurrentSymbol = INFIX;
      return { input: st, tag: tagst, output: st, ttype: UNARY, func: true, val: true };
    }
    return { input: st, tag: tagst, output: st, ttype: CONST, val: true }; // added val bit
  }

  function AMremoveBrackets(node) {
    var st;
    if (node.charAt(0) === "{" && node.charAt(node.length - 1) === "}") {
      var leftchop = 0;

      st = node.substr(1, 5);
      if (st === "\\left") {
        st = node.charAt(6);
        if (st === "(" || st === "[" || st === "{") {
          leftchop = 7;
        } else {
          st = node.substr(6, 7);
          if (st === "\\lbrace") {
            leftchop = 13;
          }
        }
      } else {
        st = node.charAt(1);
        if (st === "(" || st === "[") {
          leftchop = 2;
        }
      }
      if (leftchop > 0) {
      //st = node.charAt(node.length-7);
        st = node.substr(node.length - 8);
        if (st === "\\right)}" || st === "\\right]}" || st === "\\right.}") {
          node = "{" + node.substr(leftchop);
          node = node.substr(0, node.length - 8) + "}";
        } else if (st === "\\rbrace}") {
          node = "{" + node.substr(leftchop);
          node = node.substr(0, node.length - 14) + "}";
        }
      }
    }
    return node;
  }

  /*
Parsing ASCII math expressions with the following grammar
v ::= [A-Za-z] | greek letters | numbers | other constant symbols
u ::= sqrt | text | bb | other       unary symbols for font commands
b ::= frac | root | stackrel         binary symbols
l ::= ( | [ | { | (: | {:            left brackets
r ::= ) | ] | } | :) | :}            right brackets
S ::= v | lEr | uS | bSS | -S        Simple expression
I ::= S_S | S^S | S_S^S | S          Intermediate expression
E ::= IE | I/I | I-E | -I/I          Expression
Each terminal symbol is translated into a corresponding mathml node.
*/

  var AMnestingDepth;
  var AMpreviousSymbol;
  var AMcurrentSymbol;

  function AMTgetTeXsymbol(symb) {
    var pre;
    if (symb.val) {
      pre = "";
    } else {
      pre = "\\";
    }
    if (symb.tex == null) {
    // can't remember why this was here.  Breaks /delta /Delta to removed
    //return (pre + (pre === '' ? symb.input : symb.input.toLowerCase()));
      return pre + symb.input;
    } else {
      return pre + symb.tex;
    }
  }

  function AMparseSexpr(str) {
  // parses str and returns [node,tailstr]
  //
  // WARNING: the returned `node` item MAY be NULL.
    var symbol;
    var node;
    var result;
    var i;
    var st;
    var italic;
    var match;
    var space;
    // var rightvert = false;
    var newFrag = "";
    str = AMremoveCharsAndBlanks(str, 0);
    symbol = AMgetSymbol(str); //either a token or a bracket or empty

    if (symbol == null || (symbol.ttype === RIGHTBRACKET && AMnestingDepth > 0)) {
      return [null, str];
    }
    if (symbol.ttype === DEFINITION) {
      str = symbol.output + AMremoveCharsAndBlanks(str, symbol.input.length);
      symbol = AMgetSymbol(str);
    }
    switch (symbol.ttype) {
    case UNDEROVER:
    case CONST:
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      var texsymbol = AMTgetTeXsymbol(symbol);
      if (texsymbol.charAt(0) === "\\" || symbol.tag === "mo") {
        return [texsymbol, str];
      } else {
        return [/^-?[\d.,]+$/.test(texsymbol) ? texsymbol : "{" + texsymbol + "}", str];
      }

    case LEFTBRACKET: //read (expr+)
      AMnestingDepth++;
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      result = AMparseExpr(str, true);
      AMnestingDepth--;
      var leftchop = 0;
      if (result[0].substr(0, 6) === "\\right") {
        st = result[0].charAt(6);
        if (st === ")" || st === "]" || st === "}") {
          leftchop = 6;
        } else if (st === ".") {
          leftchop = 7;
        } else {
          st = result[0].substr(6, 7);
          if (st === "\\rbrace") {
            leftchop = 13;
          }
        }
      }
      if (leftchop > 0) {
        result[0] = result[0].substr(leftchop);
        if (symbol.invisible) {
          node = "{" + result[0] + "}";
        } else {
          node = "{" + AMTgetTeXsymbol(symbol) + result[0] + "}";
        }
      } else {
        if (symbol.invisible) {
          node = "{\\left." + result[0] + "}";
        } else {
          node = "{\\left" + AMTgetTeXsymbol(symbol) + result[0] + "}";
        }
      }
      return [node, result[1]];

    case TEXT:
      if (symbol !== AMquote && symbol !== AMvar && symbol !== AMunit) {
        str = AMremoveCharsAndBlanks(str, symbol.input.length);
      }
      italic = false;
      space = false;
      if (str.charAt(0) === "{") {
        i = str.indexOf("}");
      } else if (str.charAt(0) === "(") {
        i = str.indexOf(")");
      } else if (str.charAt(0) === "[") {
        i = str.indexOf("]");
      } else if (symbol === AMquote) {
        i = 0;
        do {
          i = str.indexOf('"', i + 1);
        } while (str.charAt(i - 1) === "\\" && i !== -1);
        italic = false;
        space = false;
      } else if (symbol === AMvar) {
        match = str.slice(1).match(/[ !@#$%^&*()_\-+=[\]{}|\\'"<>,:;?\/~`]/);
        i = match ? match.index + 1 : -1;
        italic = true;
        space = false;
      } else if (symbol === AMunit) {
        i = str.slice(AMunit.input.length).indexOf(AMunit.input) + 1;
        italic = false;
        space = true;
      } else {
        i = 0;
      }
      if (i === -1) {
        i = str.length;
      }
      st = str.slice(1, i);
      if (st.charAt(0) === " ") {
        newFrag = "\\ ";
      } else if (space) {
        newFrag = "\\,";
      }
      newFrag += italic ? "\\mathit{" + st + "}" : "\\text{" + st + "}";
      if (st.charAt(st.length - 1) === " ") {
        newFrag += "\\ ";
      }
      str = AMremoveCharsAndBlanks(str, i + (italic ? 0 : 1));
      return [newFrag, str];

    case UNARYUNDEROVER:
    case UNARY:
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      result = AMparseSexpr(str);
      if (result[0] == null) {
        return ["{" + AMTgetTeXsymbol(symbol) + "}", str];
      }
      if (symbol.func) {
      // functions hack
        st = str.charAt(0);
        if (
          st === "^" || st === "_" || st === "/" || st === "|" || st === "," ||
        st === "'" || st === "+" || st === "-" ||
        (symbol.input.length === 1 && symbol.input.match(/\w/) && st !== "(")
        ) {
          return ["{" + AMTgetTeXsymbol(symbol) + "}", str];
        } else {
          node = "{" + AMTgetTeXsymbol(symbol) + "{" + result[0] + "}}";
          return [node, result[1]];
        }
      }
      result[0] = AMremoveBrackets(result[0]);
      if (symbol.input === "sqrt") {
      // sqrt
        return ["\\sqrt{" + result[0] + "}", result[1]];
      } else if (symbol.input === "#") {
        return [AMTgetTeXsymbol(symbol) + "{" + result[0] + "}", result[1]];
      } else if (typeof symbol.rewriteleftright !== "undefined") {
      // abs, floor, ceil
        return ["{\\left" + symbol.rewriteleftright[0] + result[0] + "\\right" + symbol.rewriteleftright[1] + "}", result[1]];
      } else if (symbol.input === "cancel") {
      // cancel
        return ["\\cancel{" + result[0] + "}", result[1]];
      } else if (symbol.acc) {
      // accent
        return [AMTgetTeXsymbol(symbol) + "{" + result[0] + "}", result[1]];
      } else {
      // font change command, etc.
        return [AMTgetTeXsymbol(symbol) + "{" + result[0] + "}", result[1]];
      }

    case BINARY:
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      result = AMparseSexpr(str);
      if (result[0] == null) {
        return ["{" + AMTgetTeXsymbol(symbol) + "}", str];
      }
      result[0] = AMremoveBrackets(result[0]);
      var result2 = AMparseSexpr(result[1]);
      if (result2[0] == null) {
        return ["{" + AMTgetTeXsymbol(symbol) + "}", str];
      }
      result2[0] = AMremoveBrackets(result2[0]);
      if (symbol.input === "color") {
        newFrag = "{\\color{" + result[0].replace(/[\{\}]/g, "") + "}" + result2[0] + "}";
      } else if (symbol.input === "root") {
        newFrag = "{\\sqrt[" + result[0] + "]{" + result2[0] + "}}";
      } else {
        newFrag = "{" + AMTgetTeXsymbol(symbol) + "{" + result[0] + "}{" + result2[0] + "}}";
      }
      return [newFrag, result2[1]];

    case INFIX:
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      return [symbol.output, str];

    case SPACE:
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      return ["{\\quad\\text{" + symbol.input + "}\\quad}", str];

    case LEFTRIGHT:
    //if (rightvert) {
    //  return [null, str];
    //} else {
    //  rightvert = true;
    //}
      AMnestingDepth++;
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      result = AMparseExpr(str, false);
      AMnestingDepth--;
      st = result[0].charAt(result[0].length - 1);
      if (st === "|" && str.charAt(0) !== ",") {
      // it's an absolute value subterm
        node = "{\\left|" + result[0] + "}";
        return [node, result[1]];
      } else {
      // the "|" is a \mid so use unicode 2223 (divides) for spacing
        node = "{\\mid}";
        return [node, str];
      }

    default:
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      return ["{" + AMTgetTeXsymbol(symbol) + "}", str];
    }
  }

  function AMparseIexpr(str) {
  // parses str and returns [nodestr,tailstr]
    var symbol;
    var sym1;
    var sym2;
    var node;
    var result;
    var dofunc = false;
    str = AMremoveCharsAndBlanks(str, 0);
    sym1 = AMgetSymbol(str);
    result = AMparseSexpr(str);
    if (result[0] == null) {
    // show box in place of missing argument
      result[0] = "{}";
    }
    node = result[0];
    str = result[1];
    symbol = AMgetSymbol(str);
    if (symbol.ttype === INFIX && symbol.input !== "/") {
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      // if (symbol.input === "/") result = AMparseIexpr(str); else ...
      result = AMparseSexpr(str);
      if (result[0] == null) {
      // show box in place of missing argument
        result[0] = "{}";
      } else {
        result[0] = AMremoveBrackets(result[0]);
      }
      str = result[1];
      //if (symbol.input === "/") {
      //  node = AMremoveBrackets(node);
      //}
      if (symbol.input === "_") {
        sym2 = AMgetSymbol(str);
        if (sym2.input === "^") {
          str = AMremoveCharsAndBlanks(str, sym2.input.length);
          var res2 = AMparseSexpr(str);
          if (res2[0] == null) {
          // show box in place of missing argument
            res2[0] = "{}";
          }
          res2[0] = AMremoveBrackets(res2[0]);
          str = res2[1];
          node = "{" + node;
          node += "_{" + result[0] + "}";
          node += "^{" + res2[0] + "}";
          node += "}";
        } else {
          node += "_{" + result[0] + "}";
        }
      } else {
      //must be ^
      //node = '{'+node+'}^{'+result[0]+'}';
        node = node + "^{" + result[0] + "}";
      }
      sym2 = AMgetSymbol(str);
      dofunc = true;
    }
    if (symbol.tietoprev) {
    // connect in any primes
    //node = node + "\\" + symbol.tex;
      result = AMparseSexpr(str);
      if (result[0] == null) {
      // show box in place of missing argument
        result[0] = "{}";
      }
      str = result[1];
      // symbol.tietoprev === "msup" ==>
      node = node + "^{" + result[0] + "}";
      sym2 = AMgetSymbol(str);
      dofunc = true;
    }
    if (dofunc && sym1.func) {
      if (sym2.ttype !== INFIX && sym2.ttype !== RIGHTBRACKET &&
        sym2.input !== "+" && sym2.input !== "-" &&
        (sym1.input.length > 1 || sym2.ttype === LEFTBRACKET)
      ) {
        result = AMparseIexpr(str);
        node = "{" + node + result[0] + "}";
        str = result[1];
      }
    }

    return [node, str];
  }

  function AMparseExpr(str, rightbracket) {
    var symbol;
    var node;
    var result;
    var i;
    var nodeList = [];
    var newFrag = "";
    var addedright = false;
    do {
      str = AMremoveCharsAndBlanks(str, 0);
      result = AMparseIexpr(str);
      node = result[0];
      str = result[1];
      symbol = AMgetSymbol(str);
      if (symbol.ttype === INFIX && symbol.input === "/") {
        str = AMremoveCharsAndBlanks(str, symbol.input.length);
        result = AMparseIexpr(str);
        result[0] = AMremoveBrackets(result[0]);
        str = result[1];
        node = AMremoveBrackets(node);
        node = "\\frac" + "{" + node + "}";
        node += "{" + result[0] + "}";
        newFrag += node;
        symbol = AMgetSymbol(str);
      } else if (typeof node !== "undefined") {
      // this stricter conditional helped us find bugs in the parse routines
      // as it caused MJ to output literal "null" in rare circumstances.
      // That bug has been fixed but we keep this strict check, rather than
      // unifying it to the `node != null` check used everywhere else in the
      // code, so that we can catch regressions earlier and easier.
        newFrag += node;
      }
    } while (((
      symbol.ttype !== RIGHTBRACKET &&
        (symbol.ttype !== LEFTRIGHT || rightbracket)
    ) ||
      AMnestingDepth === 0
    ) &&
    symbol != null && symbol.output !== ""
    );
    if (symbol.ttype === RIGHTBRACKET || symbol.ttype === LEFTRIGHT) {
    //if (AMnestingDepth > 0) {
    //  AMnestingDepth--;
    //}
      var len = newFrag.length;
      if (len > 2 && newFrag.charAt(0) === "{" && newFrag.indexOf(",") > 0) {
      // could be matrix (total rewrite from .js)
        var right = newFrag.charAt(len - 2);
        if (right === ")" || right === "]") {
          var left = newFrag.charAt(6);
          if (
            (left === "(" && right === ")" && symbol.output !== "}") ||
          (left === "[" && right === "]")
          ) {
            var mxout = "";
            var pos = new Array(); // position of commas
            pos.push(0);
            var matrix = true;
            var mxnestingd = 0;
            var subpos = [];
            subpos[0] = [0];
            var lastsubposstart = 0;
            var mxanynestingd = 0;
            var columnaligns = "";
            for (i = 1; i < len - 1; i++) {
              if (newFrag.charAt(i) === left) {
                mxnestingd++;
              }
              if (newFrag.charAt(i) === right) {
                mxnestingd--;
                if (mxnestingd === 0 && newFrag.charAt(i + 2) === "," && newFrag.charAt(i + 3) === "{") {
                  pos.push(i + 2);
                  lastsubposstart = i + 2;
                  subpos[lastsubposstart] = [i + 2];
                }
              }
              if (newFrag.charAt(i) === "[" || newFrag.charAt(i) === "(" || newFrag.charAt(i) === "{") {
                mxanynestingd++;
              }
              if (newFrag.charAt(i) === "]" || newFrag.charAt(i) === ")" || newFrag.charAt(i) === "}") {
                mxanynestingd--;
              }
              if (newFrag.charAt(i) === "," && mxanynestingd === 1) {
                subpos[lastsubposstart].push(i);
              }
              if (mxanynestingd < 0) {
              // happens at the end of the row
                if (lastsubposstart === i + 1) {
                // if at end of row, skip to next row
                  i++;
                } else {
                // misformed something - abandon treating as a matrix
                  matrix = false;
                }
              }
            }

            pos.push(len);
            var lastmxsubcnt = -1;
            if (mxnestingd === 0 && pos.length > 0 && matrix) {
              for (i = 0; i < pos.length - 1; i++) {
                if (i > 0) {
                  mxout += "\\\\";
                }
                if (i === 0) {
                //var subarr = newFrag.substr(pos[i]+7,pos[i+1]-pos[i]-15).split(',');
                  if (subpos[pos[i]].length === 1) {
                    var subarr = [newFrag.substr(pos[i] + 7, pos[i + 1] - pos[i] - 15)];
                  } else {
                    var subarr = [newFrag.substring(pos[i] + 7, subpos[pos[i]][1])];
                    for (var j = 2; j < subpos[pos[i]].length; j++) {
                      subarr.push(newFrag.substring(subpos[pos[i]][j - 1] + 1, subpos[pos[i]][j]));
                    }
                    subarr.push(newFrag.substring(subpos[pos[i]][subpos[pos[i]].length - 1] + 1, pos[i + 1] - 8));
                  }
                } else {
                //var subarr = newFrag.substr(pos[i]+8,pos[i+1]-pos[i]-16).split(',');
                  if (subpos[pos[i]].length === 1) {
                    var subarr = [newFrag.substr(pos[i] + 8, pos[i + 1] - pos[i] - 16)];
                  } else {
                    var subarr = [newFrag.substring(pos[i] + 8, subpos[pos[i]][1])];
                    for (var j = 2; j < subpos[pos[i]].length; j++) {
                      subarr.push(newFrag.substring(subpos[pos[i]][j - 1] + 1, subpos[pos[i]][j]));
                    }
                    subarr.push(newFrag.substring(subpos[pos[i]][subpos[pos[i]].length - 1] + 1, pos[i + 1] - 8));
                  }
                }
                for (j = subarr.length - 1; j >= 0; j--) {
                  if (subarr[j] === "{\\mid}") {
                    if (i === 0) {
                      columnaligns = "|" + columnaligns;
                    }
                    subarr.splice(j, 1);
                  } else if (i === 0) {
                    columnaligns = "c" + columnaligns;
                  }
                }
                if (lastmxsubcnt > 0 && subarr.length !== lastmxsubcnt) {
                  matrix = false;
                } else if (lastmxsubcnt === -1) {
                  lastmxsubcnt = subarr.length;
                }
                mxout += subarr.join("&");
              }
            }
            mxout = "\\begin{array}{" + columnaligns + "} " + mxout + "\\end{array}";

            if (matrix) {
              newFrag = mxout;
            }
          }
        }
      }

      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      if (!symbol.invisible) {
        node = "\\right" + AMTgetTeXsymbol(symbol);
        newFrag += node;
        addedright = true;
      } else {
        newFrag += "\\right.";
        addedright = true;
      }
    }
    if (AMnestingDepth > 0 && !addedright) {
      newFrag += "\\right."; // adjust for non-matching left brackets
    // TODO: adjust for non-matching right brackets
    }

    return [newFrag, str];
  }

  function AMTparseAMtoTeX(str) {
    AMnestingDepth = 0;
    // some basic cleanup for dealing with stuff editors like TinyMCE adds
    str = str.replace(/(&nbsp;|\u00a0|&#160;)/g, "");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&lt;/g, "<");
    if (str.match(/\S/) == null) {
      return "";
    }
    return AMparseExpr(str.replace(/^\s+/g, ""), false)[0];
  }

  function parseMath(str) {
    var input = str;
    //DLMOD to remove &nbsp;, which editor adds on multiple spaces
    str = str.replace(/(&nbsp;|\u00a0|&#160;)/g, "");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&lt;/g, "<");
    if (str.match(/\S/) == null) {
      return document.createTextNode(" ");
    }
    var texstring = AMTparseAMtoTeX(str);
    if (config.mathbg === "dark") {
      texstring = "\\reverse " + texstring;
    }
    if (config.mathcolor !== "") {
      texstring = "\\" + config.mathcolor + texstring;
    }
    if (config.displaystyle) {
      texstring = "\\displaystyle" + texstring;
    } else {
      texstring = "\\textstyle" + texstring;
    }
    texstring = texstring.replace(/\$/g, "\\$");

    if (config.debug) {
      console.info("ASCIImath: ", input, " ==> ", texstring);
    }

    var node = createElementXHTML("img");
    if (typeof encodeURIComponent === "function") {
      texstring = encodeURIComponent(texstring);
    } else {
      texstring = escape(texstring);
    }
    node.src = config.AMTcgiloc + "?" + texstring;
    node.style.verticalAlign = "middle";
    if (config.showasciiformulaonhover) {
    // fixed by djhsu so newline does not show in Gecko
      node.setAttribute("title", str.replace(/\s+/g, " "));
    }

    var snode = createElementXHTML("span");
    snode.appendChild(node); //chg
    return snode;
  }

  /////////////////////////////////////////////////
  // === ASCIIMATH->MATHJAX COMMENTED SECTION 2 ===
  /////////////////////////////////////////////////

  function strarr2docFrag(arr, linebreaks) {
    var newFrag = document.createDocumentFragment();
    var expr = false;
    for (var i = 0; i < arr.length; i++) {
      if (expr) {
        newFrag.appendChild(parseMath(arr[i]));
      } else {
        var arri = linebreaks ? arr[i].split("\n\n") : [arr[i]];
        newFrag.appendChild(createElementXHTML("span")
        .appendChild(document.createTextNode(arri[0])));
        for (var j = 1; j < arri.length; j++) {
          newFrag.appendChild(createElementXHTML("p"));
          newFrag.appendChild(createElementXHTML("span")
          .appendChild(document.createTextNode(arri[j])));
        }
      }
      expr = !expr;
    }
    return newFrag;
  }

  function AMautomathrec(str) {
  // formula is a space (or start of str) followed by a maximal sequence
  // of *two* or more tokens, possibly separated by runs of digits and/or space.
  // tokens are single letters (except a, A, I) and ASCIIMathML tokens
    var texcommand = "\\\\[a-zA-Z]+|\\\\\\s|";
    var ambigAMtoken = "\\b(?:oo|lim|ln|int|oint|del|grad|aleph|prod|prop|sinh|cosh|tanh|cos|sec|pi|tt|fr|sf|sube|supe|sub|sup|det|mod|gcd|lcm|min|max|vec|ddot|ul|chi|eta|nu|mu)(?![a-z])|";
    var englishAMtoken = "\\b(?:sum|ox|log|sin|tan|dim|hat|bar|dot)(?![a-z])|";
    var secondenglishAMtoken = "|\\bI\\b|\\bin\\b|\\btext\\b"; // took if and or not out
    var simpleAMtoken = "NN|ZZ|QQ|RR|CC|TT|AA|EE|sqrt|dx|dy|dz|dt|xx|vv|uu|nn|bb|cc|csc|cot|alpha|beta|delta|Delta|epsilon|gamma|Gamma|kappa|lambda|Lambda|omega|phi|Phi|Pi|psi|Psi|rho|sigma|Sigma|tau|theta|Theta|xi|Xi|zeta"; // uuu nnn?
    var letter = "[a-zA-HJ-Z](?=(?:[^a-zA-Z]|$|" + ambigAMtoken + englishAMtoken + simpleAMtoken + "))|";
    var token = letter + texcommand + "\\d+|[-()[\\]{}+=*&^_%\\@/<>,\\|!:;'~]|\\.(?!(?:\x20|$))|" + ambigAMtoken + englishAMtoken + simpleAMtoken;
    var re = new RegExp("(^|\\s)(((" + token + ")\\s?)((" + token + secondenglishAMtoken + ")\\s?)+)([,.?]?(?=\\s|$))", "g");
    str = str.replace(re, " `$2`$7");
    var arr = str.split(config.AMdelimiter1);
    var re1 = new RegExp("(^|\\s)([b-zB-HJ-Z+*<>]|" + texcommand + ambigAMtoken + simpleAMtoken + ")(\\s|\\n|$)", "g");
    var re2 = new RegExp("(^|\\s)([a-z]|" + texcommand + ambigAMtoken + simpleAMtoken + ")([,.])", "g"); // removed |\d+ for now
    for (var i = 0; i < arr.length; i++) {
    // single nonenglish tokens
      if (i % 2 === 0) {
        arr[i] = arr[i].replace(re1, " `$2`$3");
        arr[i] = arr[i].replace(re2, " `$2`$3");
        arr[i] = arr[i].replace(/([{}[\]])/, "`$1`");
      }
    }
    str = arr.join(config.AMdelimiter1);
    str = str.replace(/((^|\s)\([a-zA-Z]{2,}.*?)\)`/g, "$1`)");        // fix parentheses
    str = str.replace(/`(\((a\s|in\s))(.*?[a-zA-Z]{2,}\))/g, "$1`$3"); // fix parentheses
    str = str.replace(/\sin`/g, "` in");
    str = str.replace(/`(\(\w\)[,.]?(\s|\n|$))/g, "$1`");
    str = str.replace(/`([0-9.]+|e.g|i.e)`(\.?)/gi, "$1$2");
    str = str.replace(/`([0-9.]+:)`/g, "$1");
    return str;
  }

  function processNodeR(n, linebreaks) {
    var mtch;
    var str;
    var arr;
    var frg;
    var i;
    if (n.childNodes.length === 0) {
      if (
        (n.nodeType !== 8 || linebreaks) &&
        n.parentNode.nodeName !== "form" &&
        n.parentNode.nodeName !== "FORM" &&
        n.parentNode.nodeName !== "textarea" &&
        n.parentNode.nodeName !== "TEXTAREA"
        // &&
        // n.parentNode.nodeName !== "pre" &&
        // n.parentNode.nodeName !== "PRE"
      ) {
        str = n.nodeValue;
        if (!(str == null)) {
          str = str.replace(/\r\n\r\n/g, "\n\n");
          if (config.doubleblankmathdelimiter) {
            str = str.replace(/\x20\x20\./g, " " + config.AMdelimiter1 + ".");
            str = str.replace(/\x20\x20,/g, " " + config.AMdelimiter1 + ",");
            str = str.replace(/\x20\x20/g, " " + config.AMdelimiter1 + " ");
          }
          str = str.replace(/\x20+/g, " ");
          str = str.replace(/\s*\r\n/g, " ");
          mtch = false;
          if (config.AMusedelimiter2) {
            str = str.replace(new RegExp(config.AMescape2, "g"), function () {
              mtch = true;
              return "AMescape2";
            });
          }
          str = str.replace(new RegExp(config.AMescape1, "g"), function () {
            mtch = true;
            return "AMescape1";
          });
          if (config.AMusedelimiter2) {
            str = str.replace(new RegExp(config.AMdelimiter2regexp, "g"), config.AMdelimiter1);
          }
          str = str.replace(/\\?end{?a?math}?/i, function () {
            config.automathrecognize = false;
            mtch = true;
            return "";
          });
          str = str.replace(/amath\b|\\begin{a?math}/i, function () {
            config.automathrecognize = true;
            mtch = true;
            return "";
          });
          arr = str.split(config.AMdelimiter1);
          if (config.automathrecognize) {
            for (i = 0; i < arr.length; i++) {
              if (i % 2 === 0) {
                arr[i] = AMautomathrec(arr[i]);
              }
            }
          }
          str = arr.join(config.AMdelimiter1);
          arr = str.split(config.AMdelimiter1);

          // this is a problem ************
          for (i = 0; i < arr.length; i++) {
            if (config.AMusedelimiter2) {
              arr[i] = arr[i].replace(/AMescape2/g, config.AMdelimiter2);
            }
            arr[i] = arr[i].replace(/AMescape1/g, config.AMdelimiter1);
          }
          if (arr.length > 1 || mtch) {
            if (!noMathML) {
              frg = strarr2docFrag(arr, n.nodeType === 8);
              var len = frg.childNodes.length;
              n.parentNode.replaceChild(frg, n);
              return len - 1;
            } else {
              return 0;
            }
          }
        }
      } else {
        return 0;
      }
    } else if (n.nodeName !== "math") {
      for (i = 0; i < n.childNodes.length; i++) {
        i += processNodeR(n.childNodes[i], linebreaks);
      }
    }
    return 0;
  }

  function AMprocessNode(n, linebreaks, spanclassAM) {
    var frag;
    var st;
    if (spanclassAM != null) {
      frag = document.getElementsByTagName("span");
      for (var i = 0; i < frag.length; i++) {
        if (frag[i].className === "AM") {
          processNodeR(frag[i], linebreaks);
        }
      }
    } else {
      try {
        st = n.innerHTML; // look for AMdelimiter on page
      } catch (err) {}
      if (
        st == null ||
      /amath\b|\\begin{a?math}/i.test(st) ||
      st.indexOf(config.AMdelimiter1 + " ") !== -1 ||
      st.slice(-1) === config.AMdelimiter1 ||
      //st.slice(-1) === config.AMdelimiter2 ||
      st.indexOf(config.AMdelimiter1 + "<") !== -1 ||
      st.indexOf(config.AMdelimiter1 + "\n") !== -1
      ) {
        processNodeR(n, linebreaks);
      }
    }
  }

  function generic() {
    if (!init()) {
      return;
    }
    if (config.translateOnLoad) {
      translate();
    }
  }

  // setup onload function
  if (typeof window.addEventListener !== "undefined") {
  //.. gecko, safari, konqueror and standard
    window.addEventListener("load", generic, false);
  } else if (typeof document.addEventListener !== "undefined") {
  //.. opera 7
    document.addEventListener("load", generic, false);
  } else if (typeof window.attachEvent !== "undefined") {
  //.. win/ie
    window.attachEvent("onload", generic);
  } else {
  //.. mac/ie5 and anything else that gets this far
  //if there's an existing onload function
    if (typeof window.onload === "function") {
    //store it
      var existing = onload;
      //add new onload handler
      window.onload = function () {
      //call existing onload function
        existing();
        //call generic onload function
        generic();
      };
    } else {
      window.onload = generic;
    }
  }

  /////////////////////////////////////////////////////
  // === END ASCIIMATH->MATHJAX COMMENTED SECTION 2 ===
  /////////////////////////////////////////////////////


  // also expose some functions to outside
  asciimath.newcommand = newcommand;
  asciimath.newsymbol = newsymbol;
  asciimath.AMprocessNode = AMprocessNode;
  asciimath.parseMath = parseMath;
  asciimath.AMTparseAMtoTeX = AMTparseAMtoTeX;
  asciimath.translate = translate;
  asciimath.init = init;

  return asciimath;
})(asciimath);

/////////////////////////////////////////////////////
// ================ END ASCIIMATH ===================
/////////////////////////////////////////////////////

