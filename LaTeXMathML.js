/*
LaTeXMathML.js
==============

This file is a quick hack to use the same service as ASCIIMathTeXImg
for rendering every TeX chunk we find in the page.

You should use MathJax if you want a more complete and/or offline/server-less
render option for TeX content.


This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or (at
your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License (at http://www.gnu.org/copyleft/gpl.html)
for more details.

LaTeXMathML.js (ctd)
==============

The instructions for use are the same as for the original
ASCIIMathML.js, except that of course the line you add to your
file should be
<script type="text/javascript" src="LaTeXMathML.js"></script>
Or use absolute path names if the file is not in the same folder
as your (X)HTML page.
*/

var asciimath = (function (asciimath) {
  var config = {
    AMTcgiloc: "",                 // set to the URL of your LaTeX renderer, e.g.
                                   // http://www.imathas.com/cgi-bin/mimetex.cgi
    debug: false,                  // true: print some progress and diagnostics info lines in the console
    translateOnLoad: true,         // set to `false` to do call translators from js,
                                   // set to `true` to autotranslate
    displaystyle: true,            // puts limits above and below large operators
    showasciiformulaonhover: true, // helps students learn ASCIIMath
  };

  // set up global var and mix config object:
  asciimath = asciimath || {};
  if (asciimath.config) {
    // special callback: this is invoked before any ASCIImath data is set up;
    // not even the configuration settings have been initialized!
    if (typeof asciimath.config.preInitConfig === "function") {
      var data = {
        defaultConfig: config,
        asciimath: asciimath,
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
        switch (key) {
        case "preInitConfig":
        case "preInitSymbols":
          // okay
          break;

        default:          
          // Old versions use the "decimal" option, which will get reported as "unused",
          // requiring those old codes to be upgraded. We no longer take that obsolete
          // option into account. See issue 384.
          unused.push(key);
          break;
        }
      }
    }

    // report any unknown user option entries?
    // 
    // NO. This is a quick-hack file and does NOT carry all ASCIImath config options,
    // hence we cannot reasonably check the config set the same way the other ASCIImath
    // library versions do.
    // 
//     if (unused.length) {
//       var msg = `
// ASCIImath: user config object contains these unknown options:
//   {${unused.join(",")}}
// Please remove these from your 'asciimath.config' object.
//         `.trim();
//       if (typeof console !== "undefined" && typeof console.error === "function") {
//         console.error(msg);
//       } else {
//         throw new Error(msg);
//       }
//     }
  }
  config = asciimath.config = config;

  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


  function createElementXHTML(t) {
    return document.createElement(t);
  }

  function LMparseMath(str) {
    var input = str;
    //DLMOD to remove &nbsp;, which editor adds on multiple spaces
    str = str.replace(/(&nbsp;|\u00a0|&#160;)/g, "");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&lt;/g, "<");
    if (str.match(/\S/) == null) {
      return document.createTextNode(" ");
    }
    var texstring = str;
    if (config.displaystyle) {
      texstring = "\\displaystyle{" + texstring + "}";
    } else {
      texstring = "\\textstyle{" + texstring + "}";
    }
    texstring = texstring.replace(/\$/g, "\\$");

    if (config.debug) {
      console.info("ASCIImath: ", str, " ==> ", texstring);
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

  function LMstrarr2docFrag(arr, linebreaks) {
    var newFrag = document.createDocumentFragment();
    var expr = false;
    for (var i = 0; i < arr.length; i++) {
      if (expr) {
        newFrag.appendChild(LMparseMath(arr[i]));
      } else {
        var arri = linebreaks ? arr[i].split("\n\n") : [arr[i]];
        newFrag.appendChild(createElementXHTML("span").appendChild(document.createTextNode(arri[0])));
        for (var j = 1; j < arri.length; j++) {
          newFrag.appendChild(createElementXHTML("p"));
          newFrag.appendChild(createElementXHTML("span").appendChild(document.createTextNode(arri[j])));
        }
      }
      expr = !expr;
    }
    return newFrag;
  }

  function LMprocessNodeR(n, linebreaks) {
    var mtch;
    var str;
    var arr;
    var frg;
    var i;
    if (n.childNodes.length == 0) {
      if (
        (n.nodeType !== 8 || linebreaks) &&
        n.parentNode.nodeName !== "form" &&
        n.parentNode.nodeName !== "FORM" &&
        n.parentNode.nodeName !== "textarea" &&
        n.parentNode.nodeName !== "TEXTAREA" &&
        n.parentNode.nodeName !== "pre" &&
        n.parentNode.nodeName !== "PRE"
      ) {
        str = n.nodeValue;
        if (!(str == null)) {
          str = str.replace(/\r\n\r\n/g, "\n\n");
          str = str.replace(/\x20+/g, " ");
          str = str.replace(/\s*\r\n/g, " ");
          // DELIMITERS:
          mtch = str.indexOf("$") == -1 ? false : true;
          str = str.replace(/([^\\])\$/g, "$1 $");
          str = str.replace(/^\$/, " $"); // in case \$ at start of string
          arr = str.split(" $");
          for (i = 0; i < arr.length; i++) {
            arr[i] = arr[i].replace(/\\\$/g, "$");
          }
          if (arr.length > 1 || mtch) {
              frg = LMstrarr2docFrag(arr, n.nodeType == 8);
              var len = frg.childNodes.length;
              n.parentNode.replaceChild(frg, n);
              return len - 1;
          }
        }
      } else {
        return 0;
      }
    } else if (n.nodeName != "math") {
      for (i = 0; i < n.childNodes.length; i++) {
        i += LMprocessNodeR(n.childNodes[i], linebreaks);
      }
    }
    return 0;
  }

  function LMprocessNode(n, linebreaks) {
    var st;
      try {
        st = n.innerHTML; // look for AMdelimiter on page
      } catch (err) {}
      // DELIMITERS:
      if (st == null || st.indexOf("$") != -1) {
        LMprocessNodeR(n, linebreaks);
      }
  }

  var LMtranslated = false;

  function translate() {
    if (!LMtranslated) {
      // run this only once
      LMtranslated = true;
      var LMbody = document.getElementsByTagName("body")[0];
      LMprocessNode(LMbody, false);
    }
  }

  function LatexToMathML() {
    throw new Error("LatexToMathML API is not supported");
  }

  // GO1.1 Generic onload by Brothercake
  // http://www.brothercake.com/
  //onload function (replaces the onload="translate()" in the <body> tag)
  function generic() {
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

  //expose LatexToMathML function
  asciimath.LatexToMathML = LatexToMathML;

  // also expose some functions to outside
  asciimath.AMprocessNode = LMprocessNode;
  asciimath.parseMath = LMparseMath;
  asciimath.translate = translate;

  return asciimath;
})(asciimath);

