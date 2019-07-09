/* global $, asciimath */

var unittests = [
  //single symbol output
  { input: "!=", output: "<mo>≠</mo>", TeXoutput: "\\ne" },
  { input: "!in", output: "<mo>∉</mo>", TeXoutput: "\\notin" },
  { input: "'", output: "<mo>′</mo>", TeXoutput: "\\prime" },
  { input: "(", output: "<mrow><mo>(</mo><mo></mo></mrow>", TeXoutput: "{(}" },
  { input: "(:", output: "<mrow><mo>〈</mo><mo></mo></mrow>", TeXoutput: "{\\langle}" },
  { input: ")", output: "<mo>)</mo>", TeXoutput: "{)}" },
  { input: "*", output: "<mo>⋅</mo>", TeXoutput: "\\cdot" },
  { input: "**", output: "<mo>∗</mo>", TeXoutput: "\\ast" },
  { input: "***", output: "<mo>⋆</mo>", TeXoutput: "\\star" },
  { input: "+-", output: "<mo>±</mo>", TeXoutput: "\\pm" },
  { input: "-", output: "<mo>-</mo>", TeXoutput: "-" },
  { input: "-:", output: "<mo>÷</mo>", TeXoutput: "\\div" },
  { input: "-<", output: "<mo>≺</mo>", TeXoutput: "\\prec" },
  { input: "-<=", output: "<mo>⪯</mo>", TeXoutput: "\\preceq" },
  { input: "-=", output: "<mo>≡</mo>", TeXoutput: "\\equiv" },
  { input: "->", output: "<mo>→</mo>", TeXoutput: "\\to" },
  { input: "->>", output: "<mo>↠</mo>", TeXoutput: "\\twoheadrightarrow" },
  { input: "-lt", output: "<mo>≺</mo>", TeXoutput: "\\-lt" },
  { input: "...", output: "<mo>...</mo>", TeXoutput: "\\ldots" },
  { input: "/", output: "<mo>/</mo>", TeXoutput: "/" },
  { input: "//", output: "<mo>/</mo>", TeXoutput: "/" },
  { input: "/_", output: "<mo>∠</mo>", TeXoutput: "\\angle" },
  { input: "/_\\", output: "<mo>△</mo>", TeXoutput: "\\triangle" },
  { input: ":)", output: "<mo>〉</mo>", TeXoutput: "{\\rangle}" },
  { input: ":.", output: "<mo>∴</mo>", TeXoutput: "\\therefore" },
  { input: ":=", output: "<mo>:=</mo>", TeXoutput: "\\:=" },
  { input: ":}", output: "<mo>:}</mo>", TeXoutput: "{\\:}}" },
  { input: "<<", output: "<mrow><mo>〈</mo><mo></mo></mrow>", TeXoutput: "{\\langle}" },
  { input: "<=", output: "<mo>≤</mo>", TeXoutput: "\\le" },
  { input: "<=>", output: "<mo>⇔</mo>", TeXoutput: "\\Leftrightarrow" },
  { input: "=>", output: "<mo>⇒</mo>", TeXoutput: "\\Rightarrow" },
  { input: ">-", output: "<mo>≻</mo>", TeXoutput: "\\succ" },
  { input: ">-=", output: "<mo>⪰</mo>", TeXoutput: "\\succeq" },
  { input: ">->", output: "<mo>↣</mo>", TeXoutput: "\\rightarrowtail" },
  { input: ">->>", output: "<mo>⤖</mo>", TeXoutput: "\\twoheadrightarrowtail" },
  { input: "><|", output: "<mo>⋊</mo>", TeXoutput: "\\rtimes" },
  { input: ">=", output: "<mo>≥</mo>", TeXoutput: "\\ge" },
  { input: ">>", output: "<mo>〉</mo>", TeXoutput: "{\\rangle}" },
  { input: "@", output: "<mo>∘</mo>", TeXoutput: "\\circ" },
  { input: "AA", output: "<mo>∀</mo>", TeXoutput: "\\forall" },
  { input: "CC", output: "<mo>ℂ</mo>", TeXoutput: "\\mathbb{C}" },
  { input: "Delta", output: "<mo>Δ</mo>", TeXoutput: "\\Delta" },
  { input: "EE", output: "<mo>∃</mo>", TeXoutput: "\\exists" },
  { input: "Gamma", output: "<mo>Γ</mo>", TeXoutput: "\\Gamma" },
  { input: "Lambda", output: "<mo>Λ</mo>", TeXoutput: "\\Lambda" },
  { input: "Lamda", output: "<mo>Λ</mo>", TeXoutput: "\\Lambda" },
  { input: "Leftarrow", output: "<mo>⇐</mo>", TeXoutput: "\\Leftarrow" },
  { input: "Leftrightarrow", output: "<mo>⇔</mo>", TeXoutput: "\\Leftrightarrow" },
  { input: "Lim", output: "<mo>Lim</mo>", TeXoutput: "\\Lim" },
  { input: "NN", output: "<mo>ℕ</mo>", TeXoutput: "\\mathbb{N}" },
  { input: "O/", output: "<mo>∅</mo>", TeXoutput: "\\emptyset" },
  { input: "Omega", output: "<mo>Ω</mo>", TeXoutput: "\\Omega" },
  { input: "Phi", output: "<mo>Φ</mo>", TeXoutput: "\\Phi" },
  { input: "Pi", output: "<mo>Π</mo>", TeXoutput: "\\Pi" },
  { input: "Psi", output: "<mi>Ψ</mi>", TeXoutput: "\\Psi" },
  { input: "QQ", output: "<mo>ℚ</mo>", TeXoutput: "\\mathbb{Q}" },
  { input: "RR", output: "<mo>ℝ</mo>", TeXoutput: "\\mathbb{R}" },
  { input: "Rightarrow", output: "<mo>⇒</mo>", TeXoutput: "\\Rightarrow" },
  { input: "Sigma", output: "<mo>Σ</mo>", TeXoutput: "\\Sigma" },
  { input: "TT", output: "<mo>⊤</mo>", TeXoutput: "\\top" },
  { input: "Theta", output: "<mo>Θ</mo>", TeXoutput: "\\Theta" },
  { input: "Xi", output: "<mo>Ξ</mo>", TeXoutput: "\\Xi" },
  { input: "ZZ", output: "<mo>ℤ</mo>", TeXoutput: "\\mathbb{Z}" },
  { input: "[", output: "<mrow><mo>[</mo><mo></mo></mrow>", TeXoutput: "{[}" },
  { input: "\\ ", output: "<mo>&nbsp;</mo>", TeXoutput: "\\ " },
  { input: "\\\\", output: "<mo>\\</mo>", TeXoutput: "\\backslash" },
  { input: "]", output: "<mo>]</mo>", TeXoutput: "{]}" },
  { input: "^", output: "<mo>^</mo>", TeXoutput: "^" },
  { input: "^^", output: "<mo>∧</mo>", TeXoutput: "\\wedge" },
  { input: "^^^", output: "<mo>⋀</mo>", TeXoutput: "\\bigwedge" },
  { input: "_", output: "<mo>_</mo>", TeXoutput: "_" },
  { input: "__|", output: "<mo>⌋</mo>", TeXoutput: "\\rfloor" },
  { input: "_|_", output: "<mo>⊥</mo>", TeXoutput: "\\bot" },
  { input: "abs", output: "<mrow><mo>|</mo><mo></mo><mo>|</mo></mrow>", TeXoutput: "{\\left|\\right|}" },
  { input: "aleph", output: "<mo>ℵ</mo>", TeXoutput: "\\aleph" },
  { input: "alpha", output: "<mi>α</mi>", TeXoutput: "\\alpha" },
  { input: "and", output: '<mrow><mspace width="1ex"></mspace><mtext>and</mtext><mspace width="1ex"></mspace></mrow>', TeXoutput: "{\\quad\\text{and}\\quad}" },
  { input: "angle", output: "<mo>∠</mo>", TeXoutput: "\\angle" },
  { input: "approx", output: "<mo>≈</mo>", TeXoutput: "\\approx" },
  { input: "arccos", output: "<mrow><mo>arccos</mo><mo></mo></mrow>", TeXoutput: "{\\arccos{}}" },
  { input: "arcsin", output: "<mrow><mo>arcsin</mo><mo></mo></mrow>", TeXoutput: "{\\arcsin{}}" },
  { input: "arctan", output: "<mrow><mo>arctan</mo><mo></mo></mrow>", TeXoutput: "{\\arctan{}}" },
  { input: "ast", output: "<mo>∗</mo>", TeXoutput: "\\ast" },
  { input: "backslash", output: "<mo>\\</mo>", TeXoutput: "\\backslash" },
  { input: "bar", output: "<mover><mo></mo><mo>¯</mo></mover>", TeXoutput: "\\overline{}" },
  { input: "bb", output: '<mstyle mathvariant="bold"><mo></mo></mstyle>', TeXoutput: "\\mathbf{}" },
  { input: "bbb", output: '<mstyle mathvariant="double-struck"><mo></mo></mstyle>', TeXoutput: "\\mathbb{}" },
  { input: "beta", output: "<mi>β</mi>", TeXoutput: "\\beta" },
  { input: "bigcap", output: "<mo>⋂</mo>", TeXoutput: "\\bigcap" },
  { input: "bigcup", output: "<mo>⋃</mo>", TeXoutput: "\\bigcup" },
  { input: "bigvee", output: "<mo>⋁</mo>", TeXoutput: "\\bigvee" },
  { input: "bigwedge", output: "<mo>⋀</mo>", TeXoutput: "\\bigwedge" },
  { input: "bot", output: "<mo>⊥</mo>", TeXoutput: "\\bot" },
  { input: "bowtie", output: "<mo>⋈</mo>", TeXoutput: "\\bowtie" },
  { input: "cap", output: "<mo>∩</mo>", TeXoutput: "\\cap" },
  { input: "cdot", output: "<mo>⋅</mo>", TeXoutput: "\\cdot" },
  { input: "cdots", output: "<mo>⋯</mo>", TeXoutput: "\\cdots" },
  { input: "ceil", output: "<mrow><mo>⌈</mo><mo></mo><mo>⌉</mo></mrow>", TeXoutput: "{\\left\\lceil\\right\\rceil}" },
  { input: "chi", output: "<mi>χ</mi>", TeXoutput: "\\chi" },
  { input: "circ", output: "<mo>∘</mo>", TeXoutput: "\\circ" },
  { input: "cong", output: "<mo>≅</mo>", TeXoutput: "\\stackrel{\\sim}{=}" },
  { input: "cos", output: "<mrow><mo>cos</mo><mo></mo></mrow>", TeXoutput: "{\\cos{}}" },
  { input: "cosh", output: "<mrow><mo>cosh</mo><mo></mo></mrow>", TeXoutput: "{\\cosh{}}" },
  { input: "cot", output: "<mrow><mo>cot</mo><mo></mo></mrow>", TeXoutput: "{\\cot{}}" },
  { input: "coth", output: "<mrow><mo>coth</mo><mo></mo></mrow>", TeXoutput: "{\\coth{}}" },
  { input: "csc", output: "<mrow><mo>csc</mo><mo></mo></mrow>", TeXoutput: "{\\csc{}}" },
  { input: "csch", output: "<mrow><mo>csch</mo><mo></mo></mrow>", TeXoutput: "{\\csch{}}" },
  { input: "cup", output: "<mo>∪</mo>", TeXoutput: "\\cup" },
  { input: "darr", output: "<mo>↓</mo>", TeXoutput: "\\downarrow" },
  { input: "ddot", output: "<mover><mo></mo><mo>..</mo></mover>", TeXoutput: "\\ddot{}" },
  { input: "ddots", output: "<mo>⋱</mo>", TeXoutput: "\\ddots" },
  { input: "del", output: "<mo>∂</mo>", TeXoutput: "\\partial" },
  { input: "delta", output: "<mi>δ</mi>", TeXoutput: "\\delta" },
  { input: "det", output: "<mrow><mo>det</mo><mo></mo></mrow>", TeXoutput: "{\\det{}}" },
  { input: "diamond", output: "<mo>⋄</mo>", TeXoutput: "\\diamond" },
  { input: "dim", output: "<mo>dim</mo>", TeXoutput: "\\dim" },
  { input: "div", output: "<mo>÷</mo>", TeXoutput: "\\div" },
  { input: "divide", output: "<mo>÷</mo>", TeXoutput: "\\div" },
  { input: "dot", output: "<mover><mo></mo><mo>.</mo></mover>", TeXoutput: "\\dot{}" },
  { input: "downarrow", output: "<mo>↓</mo>", TeXoutput: "\\downarrow" },
  { input: "dt", output: "<mrow><mi>d</mi><mi>t</mi></mrow>", TeXoutput: "\\pm" },
  { input: "dx", output: "<mrow><mi>d</mi><mi>x</mi></mrow>", TeXoutput: "\\pm" },
  { input: "dy", output: "<mrow><mi>d</mi><mi>y</mi></mrow>", TeXoutput: "\\pm" },
  { input: "dz", output: "<mrow><mi>d</mi><mi>z</mi></mrow>", TeXoutput: "\\pm" },
  { input: "emptyset", output: "<mo>∅</mo>", TeXoutput: "\\emptyset" },
  { input: "epsi", output: "<mi>ε</mi>", TeXoutput: "\\epsilon" },
  { input: "epsilon", output: "<mi>ε</mi>", TeXoutput: "\\epsilon" },
  { input: "equiv", output: "<mo>≡</mo>", TeXoutput: "\\equiv" },
  { input: "eta", output: "<mi>η</mi>", TeXoutput: "\\eta" },
  { input: "exists", output: "<mo>∃</mo>", TeXoutput: "\\exists" },
  { input: "exp", output: "<mrow><mo>exp</mo><mo></mo></mrow>", TeXoutput: "{\\exp{}}" },
  { input: "f", output: "<mi>f</mi>", TeXoutput: "{f}" },
  { input: "floor", output: "<mrow><mo>⌊</mo><mo></mo><mo>⌋</mo></mrow>", TeXoutput: "\\pm" },
  { input: "forall", output: "<mo>∀</mo>", TeXoutput: "\\forall" },
  { input: "frown", output: "<mo>⌢</mo>", TeXoutput: "\\frown" },
  { input: "g", output: "<mi>g</mi>", TeXoutput: "{g}" },
  { input: "gamma", output: "<mi>γ</mi>", TeXoutput: "\\gamma" },
  { input: "gcd", output: "<mrow><mo>gcd</mo><mo></mo></mrow>", TeXoutput: "{\\gcd{}}" },
  { input: "ge", output: "<mo>≥</mo>", TeXoutput: "\\ge" },
  { input: "geq", output: "<mo>≥</mo>", TeXoutput: "\\geq" },
  { input: "glb", output: "<mo>glb</mo>", TeXoutput: "\\glb" },
  { input: "grad", output: "<mo>∇</mo>", TeXoutput: "\\nabla" },
  { input: "gt", output: "<mo>&gt;</mo>", TeXoutput: "\\gt" },
  { input: "mgt", output: "<mo>≫</mo>", TeXoutput: "\\gg" },
  { input: "gt=", output: "<mo>≥</mo>", TeXoutput: "\\geq" },
  { input: "hArr", output: "<mo>⇔</mo>", TeXoutput: "\\Leftrightarrow" },
  { input: "harr", output: "<mo>↔</mo>", TeXoutput: "\\leftrightarrow" },
  { input: "hat", output: "<mover><mo></mo><mo>^</mo></mover>", TeXoutput: "\\hat{}" },
  { input: "if", output: '<mrow><mspace width="1ex"></mspace><mo>if</mo><mspace width="1ex"></mspace></mrow>', TeXoutput: "\\pm" },
  { input: "iff", output: "<mo>⇔</mo>", TeXoutput: "\\Leftrightarrow" },
  { input: "implies", output: "<mo>⇒</mo>", TeXoutput: "\\Rightarrow" },
  { input: "in", output: "<mo>∈</mo>", TeXoutput: "\\in" },
  { input: "infty", output: "<mo>∞</mo>", TeXoutput: "\\infty" },
  { input: "int", output: "<mo>∫</mo>", TeXoutput: "\\int" },
  { input: "iota", output: "<mi>ι</mi>", TeXoutput: "\\iota" },
  { input: "kappa", output: "<mi>κ</mi>", TeXoutput: "\\kappa" },
  { input: "lArr", output: "<mo>⇐</mo>", TeXoutput: "\\Leftarrow" },
  { input: "lambda", output: "<mi>λ</mi>", TeXoutput: "\\lambda" },
  { input: "lamda", output: "<mi>λ</mi>", TeXoutput: "\\lambda" },
  { input: "langle", output: "<mrow><mo>〈</mo><mo></mo></mrow>", TeXoutput: "{\\langle}" },
  { input: "larr", output: "<mo>←</mo>", TeXoutput: "\\leftarrow" },
  { input: "lceiling", output: "<mo>⌈</mo>", TeXoutput: "\\lceil" },
  { input: "lcm", output: "<mrow><mo>lcm</mo><mo></mo></mrow>", TeXoutput: "\\pm" },
  { input: "ldots", output: "<mo>...</mo>", TeXoutput: "\\ldots" },
  { input: "le", output: "<mo>≤</mo>", TeXoutput: "\\le" },
  { input: "leftarrow", output: "<mo>←</mo>", TeXoutput: "\\leftarrow" },
  { input: "leftrightarrow", output: "<mo>↔</mo>", TeXoutput: "\\leftrightarrow" },
  { input: "leq", output: "<mo>≤</mo>", TeXoutput: "\\leq" },
  { input: "lfloor", output: "<mo>⌊</mo>", TeXoutput: "\\lfloor" },
  { input: "lim", output: "<mo>lim</mo>", TeXoutput: "\\lim" },
  { input: "ln", output: "<mrow><mo>ln</mo><mo></mo></mrow>", TeXoutput: "{\\ln{}}" },
  { input: "log", output: "<mrow><mo>log</mo><mo></mo></mrow>", TeXoutput: "{\\log{}}" },
  { input: "lt", output: "<mo>&lt;</mo>", TeXoutput: "\\lt" },
  { input: "mlt", output: "<mo>≪</mo>", TeXoutput: "\\ll" },
  { input: "lt=", output: "<mo>≤</mo>", TeXoutput: "\\leq" },
  { input: "ltimes", output: "<mo>⋉</mo>", TeXoutput: "\\ltimes" },
  { input: "lub", output: "<mo>lub</mo>", TeXoutput: "\\lub" },
  { input: "mapsto", output: "<mo>↦</mo>", TeXoutput: "\\mapsto" },
  { input: "max", output: "<mo>max</mo>", TeXoutput: "\\max" },
  { input: "min", output: "<mo>min</mo>", TeXoutput: "\\min" },
  { input: "mod", output: "<mo>mod</mo>", TeXoutput: "\\text{mod}" },
  { input: "models", output: "<mo>⊨</mo>", TeXoutput: "\\models" },
  { input: "mu", output: "<mi>μ</mi>", TeXoutput: "\\mu" },
  { input: "nabla", output: "<mo>∇</mo>", TeXoutput: "\\nabla" },
  { input: "ne", output: "<mo>≠</mo>", TeXoutput: "\\ne" },
  { input: "neg", output: "<mo>¬</mo>", TeXoutput: "\\neg" },
  { input: "nn", output: "<mo>∩</mo>", TeXoutput: "\\cap" },
  { input: "nnn", output: "<mo>⋂</mo>", TeXoutput: "\\bigcap" },
  { input: "norm", output: "<mrow><mo>∥</mo><mo></mo><mo>∥</mo></mrow>", TeXoutput: "\\pm" },
  { input: "not", output: "<mo>¬</mo>", TeXoutput: "\\pm" },
  { input: "notin", output: "<mo>∉</mo>", TeXoutput: "\\pm" },
  { input: "nu", output: "<mi>ν</mi>", TeXoutput: "\\pm" },
  { input: "o+", output: "<mo>⊕</mo>", TeXoutput: "\\pm" },
  { input: "o.", output: "<mo>⊙</mo>", TeXoutput: "\\pm" },
  { input: "obrace", output: "<mover><mo></mo><mo>⏞</mo></mover>", TeXoutput: "\\pm" },
  { input: "odot", output: "<mo>⊙</mo>", TeXoutput: "\\pm" },
  { input: "oint", output: "<mo>∮</mo>", TeXoutput: "\\pm" },
  { input: "omega", output: "<mi>ω</mi>", TeXoutput: "\\pm" },
  { input: "oo", output: "<mo>∞</mo>", TeXoutput: "\\pm" },
  { input: "oplus", output: "<mo>⊕</mo>", TeXoutput: "\\pm" },
  { input: "or", output: '<mrow><mspace width="1ex"></mspace><mtext>or</mtext><mspace width="1ex"></mspace></mrow>', TeXoutput: "\\pm" },
  { input: "otimes", output: "<mo>⊗</mo>", TeXoutput: "\\pm" },
  { input: "overbrace", output: "<mover><mo></mo><mo>⏞</mo></mover>", TeXoutput: "\\pm" },
  { input: "overline", output: "<mover><mo></mo><mo>¯</mo></mover>", TeXoutput: "\\pm" },
  { input: "ox", output: "<mo>⊗</mo>", TeXoutput: "\\pm" },
  { input: "partial", output: "<mo>∂</mo>", TeXoutput: "\\pm" },
  { input: "phi", output: "<mi>ϕ</mi>", TeXoutput: "\\pm" },
  { input: "pi", output: "<mi>π</mi>", TeXoutput: "\\pm" },
  { input: "pm", output: "<mo>±</mo>", TeXoutput: "\\pm" },
  { input: "prec", output: "<mo>≺</mo>", TeXoutput: "\\pm" },
  { input: "preceq", output: "<mo>⪯</mo>", TeXoutput: "\\pm" },
  { input: "prime", output: "<mo>′</mo>", TeXoutput: "\\pm" },
  { input: "prod", output: "<mo>∏</mo>", TeXoutput: "\\pm" },
  { input: "prop", output: "<mo>∝</mo>", TeXoutput: "\\pm" },
  { input: "propto", output: "<mo>∝</mo>", TeXoutput: "\\pm" },
  { input: "psi", output: "<mi>ψ</mi>", TeXoutput: "\\pm" },
  { input: "qquad", output: "<mo>&nbsp;&nbsp;&nbsp;&nbsp;</mo>", TeXoutput: "\\pm" },
  { input: "quad", output: "<mo>&nbsp;&nbsp;</mo>", TeXoutput: "\\pm" },
  { input: "rArr", output: "<mo>⇒</mo>", TeXoutput: "\\pm" },
  { input: "rangle", output: "<mo>〉</mo>", TeXoutput: "\\pm" },
  { input: "rarr", output: "<mo>→</mo>", TeXoutput: "\\pm" },
  { input: "rceiling", output: "<mo>⌉</mo>", TeXoutput: "\\pm" },
  { input: "rfloor", output: "<mo>⌋</mo>", TeXoutput: "\\pm" },
  { input: "rho", output: "<mi>ρ</mi>", TeXoutput: "\\pm" },
  { input: "rightarrow", output: "<mo>→</mo>", TeXoutput: "\\pm" },
  { input: "rightarrowtail", output: "<mo>↣</mo>", TeXoutput: "\\pm" },
  { input: "root", output: "<mroot><mo></mo><mo></mo></mroot>", TeXoutput: "\\pm" },
  { input: "rtimes", output: "<mo>⋊</mo>", TeXoutput: "\\pm" },
  { input: "sec", output: "<mrow><mo>sec</mo><mo></mo></mrow>", TeXoutput: "\\pm" },
  { input: "sech", output: "<mrow><mo>sech</mo><mo></mo></mrow>", TeXoutput: "\\pm" },
  { input: "setminus", output: "<mo>\\</mo>", TeXoutput: "\\pm" },
  { input: "sigma", output: "<mi>σ</mi>", TeXoutput: "\\pm" },
  { input: "sin", output: "<mrow><mo>sin</mo><mo></mo></mrow>", TeXoutput: "\\pm" },
  { input: "sinh", output: "<mrow><mo>sinh</mo><mo></mo></mrow>", TeXoutput: "\\pm" },
  { input: "sqrt", output: "<msqrt><mo></mo></msqrt>", TeXoutput: "\\pm" },
  { input: "square", output: "<mo>□</mo>", TeXoutput: "\\pm" },
  { input: "stackrel", output: "<mover><mo></mo><mo></mo></mover>", TeXoutput: "\\pm" },
  { input: "star", output: "<mo>⋆</mo>", TeXoutput: "\\pm" },
  { input: "sub", output: "<mo>⊂</mo>", TeXoutput: "\\pm" },
  { input: "sube", output: "<mo>⊆</mo>", TeXoutput: "\\pm" },
  { input: "subset", output: "<mo>⊂</mo>", TeXoutput: "\\pm" },
  { input: "subseteq", output: "<mo>⊆</mo>", TeXoutput: "\\pm" },
  { input: "succ", output: "<mo>≻</mo>", TeXoutput: "\\pm" },
  { input: "succeq", output: "<mo>⪰</mo>", TeXoutput: "\\pm" },
  { input: "sum", output: "<mo>∑</mo>", TeXoutput: "\\pm" },
  { input: "sup", output: "<mo>⊃</mo>", TeXoutput: "\\pm" },
  { input: "supe", output: "<mo>⊇</mo>", TeXoutput: "\\pm" },
  { input: "supset", output: "<mo>⊃</mo>", TeXoutput: "\\pm" },
  { input: "supseteq", output: "<mo>⊇</mo>", TeXoutput: "\\pm" },
  { input: "tan", output: "<mrow><mo>tan</mo><mo></mo></mrow>", TeXoutput: "\\pm" },
  { input: "tanh", output: "<mrow><mo>tanh</mo><mo></mo></mrow>", TeXoutput: "\\pm" },
  { input: "tau", output: "<mi>τ</mi>", TeXoutput: "\\pm" },
  { input: "therefore", output: "<mo>∴</mo>", TeXoutput: "\\pm" },
  { input: "theta", output: "<mi>θ</mi>", TeXoutput: "\\pm" },
  { input: "tilde", output: "<mover><mo></mo><mo>~</mo></mover>", TeXoutput: "\\pm" },
  { input: "times", output: "<mo>×</mo>", TeXoutput: "\\pm" },
  { input: "to", output: "<mo>→</mo>", TeXoutput: "\\pm" },
  { input: "top", output: "<mo>⊤</mo>", TeXoutput: "\\pm" },
  { input: "triangle", output: "<mo>△</mo>", TeXoutput: "\\pm" },
  { input: "twoheadrightarrow", output: "<mo>↠</mo>", TeXoutput: "\\pm" },
  { input: "twoheadrightarrowtail", output: "<mo>⤖</mo>", TeXoutput: "\\pm" },
  { input: "uarr", output: "<mo>↑</mo>", TeXoutput: "\\pm" },
  { input: "ubrace", output: "<munder><mo></mo><mo>⏟</mo></munder>", TeXoutput: "\\pm" },
  { input: "ul", output: "<munder><mo></mo><mo>̲</mo></munder>", TeXoutput: "\\pm" },
  { input: "underbrace", output: "<munder><mo></mo><mo>⏟</mo></munder>", TeXoutput: "\\pm" },
  { input: "underline", output: "<munder><mo></mo><mo>̲</mo></munder>", TeXoutput: "\\pm" },
  { input: "underset", output: "<munder><mo></mo><mo></mo></munder>", TeXoutput: "\\pm" },
  { input: "uparrow", output: "<mo>↑</mo>", TeXoutput: "\\pm" },
  { input: "upsilon", output: "<mi>υ</mi>", TeXoutput: "\\pm" },
  { input: "uu", output: "<mo>∪</mo>", TeXoutput: "\\pm" },
  { input: "uuu", output: "<mo>⋃</mo>", TeXoutput: "\\pm" },
  { input: "varepsilon", output: "<mi>ɛ</mi>", TeXoutput: "\\pm" },
  { input: "varphi", output: "<mi>φ</mi>", TeXoutput: "\\pm" },
  { input: "vartheta", output: "<mi>ϑ</mi>", TeXoutput: "\\pm" },
  { input: "vdash", output: "<mo>⊢</mo>", TeXoutput: "\\pm" },
  { input: "vdots", output: "<mo>⋮</mo>", TeXoutput: "\\pm" },
  { input: "vec", output: "<mover><mo></mo><mo>→</mo></mover>", TeXoutput: "\\pm" },
  { input: "vee", output: "<mo>∨</mo>", TeXoutput: "\\pm" },
  { input: "vv", output: "<mo>∨</mo>", TeXoutput: "\\pm" },
  { input: "vvv", output: "<mo>⋁</mo>", TeXoutput: "\\pm" },
  { input: "wedge", output: "<mo>∧</mo>", TeXoutput: "\\pm" },
  { input: "xi", output: "<mi>ξ</mi>", TeXoutput: "\\pm" },
  { input: "xx", output: "<mo>×</mo>", TeXoutput: "\\pm" },
  { input: "zeta", output: "<mi>ζ</mi>", TeXoutput: "\\pm" },
  { input: "{", output: "<mrow><mo>{</mo><mo></mo></mrow>", TeXoutput: "\\pm" },
  { input: "|", output: "<mrow><mo>∣</mo></mrow>", TeXoutput: "\\pm" },
  { input: "|--", output: "<mo>⊢</mo>", TeXoutput: "\\pm" },
  { input: "|->", output: "<mo>↦</mo>", TeXoutput: "\\pm" },
  { input: "|==", output: "<mo>⊨</mo>", TeXoutput: "\\pm" },
  { input: "|><", output: "<mo>⋉</mo>", TeXoutput: "\\pm" },
  { input: "|><|", output: "<mo>⋈</mo>", TeXoutput: "\\pm" },
  { input: "|__", output: "<mo>⌊</mo>", TeXoutput: "\\pm" },
  { input: "|~", output: "<mo>⌈</mo>", TeXoutput: "\\pm" },
  { input: "}", output: "<mo>}</mo>", TeXoutput: "\\pm" },
  { input: "~=", output: "<mo>≅</mo>", TeXoutput: "\\pm" },
  { input: "~|", output: "<mo>⌉</mo>", TeXoutput: "\\pm" },
  { input: "~~", output: "<mo>≈</mo>", TeXoutput: "\\pm" },

  //unary, binary, and accents
  {
    input: "f(x)/g(x)",
    output: "<mfrac><mrow><mi>f</mi><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mrow><mi>g</mi><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow></mfrac>",
    TeXoutput: "\\pm"
  },
  {
    input: "sin(x)/2",
    output: "<mfrac><mrow><mo>sin</mo><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>2</mn></mfrac>",
    TeXoutput: "\\pm"
  },
  { input: "cosx/2", output: "<mfrac><mrow><mo>cos</mo><mi>x</mi></mrow><mn>2</mn></mfrac>", TeXoutput: "\\pm" },
  { input: "absx", output: "<mrow><mo>|</mo><mi>x</mi><mo>|</mo></mrow>", TeXoutput: "\\pm" },
  { input: "norm x", output: "<mrow><mo>∥</mo><mi>x</mi><mo>∥</mo></mrow>", TeXoutput: "\\pm" },
  { input: "floor x/2", output: "<mfrac><mrow><mo>⌊</mo><mi>x</mi><mo>⌋</mo></mrow><mn>2</mn></mfrac>", TeXoutput: "\\pm" },
  { input: "ceil 5.2", output: "<mrow><mo>⌈</mo><mn>5.2</mn><mo>⌉</mo></mrow>", TeXoutput: "\\pm" },
  { input: "min_x 3", output: "<munder><mo>min</mo><mi>x</mi></munder><mn>3</mn>", TeXoutput: "\\pm" },
  { input: "sqrt4", output: "<msqrt><mn>4</mn></msqrt>", TeXoutput: "\\pm" },
  { input: "sqrt(x+1)", output: "<msqrt><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow></msqrt>", TeXoutput: "\\pm" },
  { input: "root(3)(x)", output: "<mroot><mrow><mi>x</mi></mrow><mrow><mn>3</mn></mrow></mroot>", TeXoutput: "\\pm" },
  { input: "root3x", output: "<mroot><mi>x</mi><mn>3</mn></mroot>", TeXoutput: "\\pm" },
  { input: "stackrel3=", output: "<mover><mo>=</mo><mn>3</mn></mover>", TeXoutput: "\\pm" },
  { input: "stackrel(3)(=)", output: "<mover><mrow><mo>=</mo></mrow><mrow><mn>3</mn></mrow></mover>", TeXoutput: "\\pm" },
  { input: "overset(k)(=)", output: "<mover><mrow><mo>=</mo></mrow><mrow><mi>k</mi></mrow></mover>", TeXoutput: "\\pm" },
  { input: "underset(k)(=)", output: "<munder><mrow><mo>=</mo></mrow><mrow><mi>k</mi></mrow></munder>", TeXoutput: "\\pm" },
  { input: "tilde x", output: "<mover><mi>x</mi><mo>~</mo></mover>", TeXoutput: "\\pm" },
  { input: "hat x", output: "<mover><mi>x</mi><mo>^</mo></mover>", TeXoutput: "\\pm" },
  { input: "hat(xy)", output: "<mover><mrow><mi>x</mi><mi>y</mi></mrow><mo>^</mo></mover>", TeXoutput: "\\pm" },
  { input: "bar x", output: "<mover><mi>x</mi><mo>¯</mo></mover>", TeXoutput: "\\pm" },
  { input: "vec x", output: '<mover><mi>x</mi><mo stretchy="false">→</mo></mover>', TeXoutput: "\\pm" },
  { input: "vec(xy)", output: "<mover><mrow><mi>x</mi><mi>y</mi></mrow><mo>→</mo></mover>", TeXoutput: "\\pm" },
  { input: "dot x", output: "<mover><mi>x</mi><mo>.</mo></mover>", TeXoutput: "\\pm" },
  { input: "ddot x", output: "<mover><mi>x</mi><mo>..</mo></mover>", TeXoutput: "\\pm" },
  { input: "ul x", output: "<munder><mi>x</mi><mo>̲</mo></munder>", TeXoutput: "\\pm" },
  { input: "ubrace(x+1)", output: "<munder><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mo>⏟</mo></munder>", TeXoutput: "\\pm" },
  { input: "obrace(x+1)", output: "<mover><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mo>⏞</mo></mover>", TeXoutput: "\\pm" },
  { input: "mbox(hi)", output: "<mrow><mtext>hi</mtext></mrow>", TeXoutput: "\\pm" },
  { input: "text(hi)", output: "<mrow><mtext>hi</mtext></mrow>", TeXoutput: "\\pm" },
  { input: '"hi"', output: "<mrow><mtext>hi</mtext></mrow>", TeXoutput: "\\pm" },
  { input: "cancel(x)", output: '<menclose notation="updiagonalstrike"><mrow><mi>x</mi></mrow></menclose>', TeXoutput: "\\pm" },

  //font and color
  { input: "color(red)(x)", output: '<mstyle mathcolor="red"><mrow><mi>x</mi></mrow></mstyle>', TeXoutput: "\\pm" },
  { input: "bb(x)", output: '<mstyle mathvariant="bold"><mrow><mi>x</mi></mrow></mstyle>', TeXoutput: "\\pm" },
  { input: "sf(x)", output: '<mstyle mathvariant="sans-serif"><mrow><mi>x</mi></mrow></mstyle>', TeXoutput: "\\pm" },
  { input: "bbb(x)", output: '<mstyle mathvariant="double-struck"><mrow>𝕩</mrow></mstyle>', TeXoutput: "\\pm" },
  { input: "cc(x)", output: '<mstyle mathvariant="script"><mrow>𝓍</mrow></mstyle>', TeXoutput: "\\pm" },
  { input: "tt(x)", output: '<mstyle mathvariant="monospace"><mrow><mi>x</mi></mrow></mstyle>', TeXoutput: "\\pm" },
  { input: "fr(x)", output: '<mstyle mathvariant="fraktur"><mrow>𝔵</mrow></mstyle>', TeXoutput: "\\pm" },

  //basics
  { input: "x", output: "<mi>x</mi>", TeXoutput: "\\pm" },
  { input: "2", output: "<mn>2</mn>", TeXoutput: "\\pm" },
  { input: "x^2", output: "<msup><mi>x</mi><mn>2</mn></msup>", TeXoutput: "\\pm" },
  { input: "x_2", output: "<msub><mi>x</mi><mn>2</mn></msub>", TeXoutput: "\\pm" },
  { input: "x_2^3", output: "<mrow><msubsup><mi>x</mi><mn>2</mn><mn>3</mn></msubsup></mrow>", TeXoutput: "\\pm" },
  { input: "2/3", output: "<mfrac><mn>2</mn><mn>3</mn></mfrac>", TeXoutput: "\\pm" },
  { input: "-2/3", output: "<mo>-</mo><mfrac><mn>2</mn><mn>3</mn></mfrac>", TeXoutput: "\\pm" },
  { input: "2-3", output: "<mn>2</mn><mo>-</mo><mn>3</mn>", TeXoutput: "\\pm" },
  { input: "(2+3)", output: "<mrow><mo>(</mo><mn>2</mn><mo>+</mo><mn>3</mn><mo>)</mo></mrow>", TeXoutput: "\\pm" },

  //braces
  {
    input: "2+(3/4+1)",
    output: "<mn>2</mn><mo>+</mo><mrow><mo>(</mo><mfrac><mn>3</mn><mn>4</mn></mfrac><mo>+</mo><mn>1</mn><mo>)</mo></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: "2+[3/4+1]",
    output: "<mn>2</mn><mo>+</mo><mrow><mo>[</mo><mfrac><mn>3</mn><mn>4</mn></mfrac><mo>+</mo><mn>1</mn><mo>]</mo></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: "2+|3/4+1|",
    output: "<mn>2</mn><mo>+</mo><mrow><mo>|</mo><mfrac><mn>3</mn><mn>4</mn></mfrac><mo>+</mo><mn>1</mn><mo>|</mo></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: "[2/3,4)",
    output: "<mrow><mo>[</mo><mfrac><mn>2</mn><mn>3</mn></mfrac><mo>,</mo><mn>4</mn><mo>)</mo></mrow>",
    TeXoutput: "\\pm"
  },
  { input: "{:2,3:}", output: "<mrow><mn>2</mn><mo>,</mo><mn>3</mn></mrow>", TeXoutput: "\\pm" },
  { input: "<<2,3>>", output: "<mrow><mo>〈</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>〉</mo></mrow>", TeXoutput: "\\pm" },
  { input: "(:2,3:)", output: "<mrow><mo>〈</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>〉</mo></mrow>", TeXoutput: "\\pm" },

  //matrices and arrays
  {
    input: "[(2,3),(4,5)]",
    output: '<mrow><mo>[</mo><mtable columnlines="none none"><mtr><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd></mtr><mtr><mtd><mn>4</mn></mtd><mtd><mn>5</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "[(2,3,4,5)]",
    output: '<mrow><mo>[</mo><mtable columnlines="none none none none"><mtr><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd><mtd><mn>5</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "((1),(2))",
    output: '<mrow><mo>(</mo><mtable columnlines="none"><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr></mtable><mo>)</mo></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "{(1,if,x ge 3),(2,if,x gt 3):}",
    output:
      '<mrow><mo>{</mo><mtable columnlines="none none none" columnalign="left"><mtr><mtd><mn>1</mn></mtd><mtd><mrow><mspace width="1ex"></mspace><mo>if</mo><mspace width="1ex"></mspace></mrow></mtd><mtd><mi>x</mi><mo>≥</mo><mn>3</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd><mtd><mrow><mspace width="1ex"></mspace><mo>if</mo><mspace width="1ex"></mspace></mrow></mtd><mtd><mi>x</mi><mo>&gt;</mo><mn>3</mn></mtd></mtr></mtable></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "[(1,2,|,3),(4,5,|,6)]",
    output: '<mrow><mo>[</mo><mtable columnlines="none solid none"><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd></mtr><mtr><mtd><mn>4</mn></mtd><mtd><mn>5</mn></mtd><mtd><mn>6</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
    TeXoutput: "\\pm"
  },

  //from the existing demos
  {
    input: "int_2^3 3dx",
    output: "<mrow><msubsup><mo>∫</mo><mn>2</mn><mn>3</mn></msubsup></mrow><mn>3</mn><mrow><mi>d</mi><mi>x</mi></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: "sum_(n=1)^3 n",
    output: "<mrow><munderover><mo>∑</mo><mrow><mi>n</mi><mo>=</mo><mn>1</mn></mrow><mn>3</mn></munderover></mrow><mi>n</mi>",
    TeXoutput: "\\pm"
  },
  {
    input: "lim_(h->0)(f(x+h)-f(x))/h",
    output:
      "<munder><mo>lim</mo><mrow><mi>h</mi><mo>→</mo><mn>0</mn></mrow></munder><mfrac><mrow><mrow><mi>f</mi><mrow><mo>(</mo><mi>x</mi><mo>+</mo><mi>h</mi><mo>)</mo></mrow></mrow><mo>-</mo><mrow><mi>f</mi><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow></mrow><mi>h</mi></mfrac>",
    TeXoutput: "\\pm"
  },
  {
    input: "sin^-1(x)",
    output: "<mrow><msup><mo>sin</mo><mrow><mo>-</mo><mn>1</mn></mrow></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: "f(x)=sum_(n=0)^oo(f^((n))(a))/(n!)(x-a)^n",
    output:
      "<mrow><mi>f</mi><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mo>=</mo><mrow><munderover><mo>∑</mo><mrow><mi>n</mi><mo>=</mo><mn>0</mn></mrow><mo>∞</mo></munderover></mrow><mfrac><mrow><mrow><msup><mi>f</mi><mrow><mrow><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></msup><mrow><mo>(</mo><mi>a</mi><mo>)</mo></mrow></mrow></mrow><mrow><mi>n</mi><mo>!</mo></mrow></mfrac><msup><mrow><mo>(</mo><mi>x</mi><mo>-</mo><mi>a</mi><mo>)</mo></mrow><mi>n</mi></msup>",
    TeXoutput: "\\pm"
  },
  {
    input: "f(x)=\\sum_{n=0}^\\infty\\frac{f^{(n)}(a)}{n!}(x-a)^n",
    output:
      "<mrow><mi>f</mi><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mo>=</mo><mrow><munderover><mo>∑</mo><mrow><mi>n</mi><mo>=</mo><mn>0</mn></mrow><mo>∞</mo></munderover></mrow><mfrac><mrow><mrow><msup><mi>f</mi><mrow><mrow><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></msup><mrow><mo>(</mo><mi>a</mi><mo>)</mo></mrow></mrow></mrow><mrow><mi>n</mi><mo>!</mo></mrow></mfrac><msup><mrow><mo>(</mo><mi>x</mi><mo>-</mo><mi>a</mi><mo>)</mo></mrow><mi>n</mi></msup>",
    TeXoutput: "\\pm"
  },
  {
    input: "(a,b]={x in RR | a < x <= b}",
    output: "<mrow><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>]</mo></mrow><mo>=</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mo>ℝ</mo><mrow><mo>∣</mo></mrow><mi>a</mi><mo>&lt;</mo><mi>x</mi><mo>≤</mo><mi>b</mi><mo>}</mo></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: "abc-123.45^-1.1",
    output: "<mi>a</mi><mi>b</mi><mi>c</mi><mo>-</mo><msup><mn>123.45</mn><mrow><mo>-</mo><mn>1.1</mn></mrow></msup>",
    TeXoutput: "\\pm"
  },
  {
    input: 'stackrel"def"= or \\stackrel{\\Delta}{=}',
    output: '<mover><mo>=</mo><mrow><mtext>def</mtext></mrow></mover><mrow><mspace width="1ex"></mspace><mtext>or</mtext><mspace width="1ex"></mspace></mrow><mover><mrow><mo>=</mo></mrow><mrow><mo>Δ</mo></mrow></mover>',
    TeXoutput: "\\pm"
  },
  {
    input: "{::}_(\\ 92)^238U",
    output: "<mrow><msubsup><mrow></mrow><mrow><mo>&nbsp;</mo><mn>92</mn></mrow><mn>238</mn></msubsup></mrow><mi>U</mi>",
    TeXoutput: "\\pm"
  },
  {
    input: "(cancel((x+1))(x-2))/(cancel((x+1))(x+3))",
    output:
      '<mfrac><mrow><menclose notation="updiagonalstrike"><mrow><mrow><mo>(</mo><mi>x</mi><mo>+</mo><mn>1</mn><mo>)</mo></mrow></mrow></menclose><mrow><mo>(</mo><mi>x</mi><mo>-</mo><mn>2</mn><mo>)</mo></mrow></mrow><mrow><menclose notation="updiagonalstrike"><mrow><mrow><mo>(</mo><mi>x</mi><mo>+</mo><mn>1</mn><mo>)</mo></mrow></mrow></menclose><mrow><mo>(</mo><mi>x</mi><mo>+</mo><mn>3</mn><mo>)</mo></mrow></mrow></mfrac>',
    TeXoutput: "\\pm"
  },
  { input: "a//b", output: "<mi>a</mi><mo>/</mo><mi>b</mi>", TeXoutput: "\\pm" },
  {
    input: "int_1^3 2x dx = x^2|_1^3",
    output: "<mrow><msubsup><mo>∫</mo><mn>1</mn><mn>3</mn></msubsup></mrow><mn>2</mn><mi>x</mi><mrow><mi>d</mi><mi>x</mi></mrow><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup><mrow><msubsup><mrow><mo>∣</mo></mrow><mn>1</mn><mn>3</mn></msubsup></mrow>",
    TeXoutput: "\\pm"
  },

  //from issue 15 tests
  {
    input: "log_2(x)/5",
    output: "<mfrac><mrow><msub><mo>log</mo><mn>2</mn></msub><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>5</mn></mfrac>",
    TeXoutput: "\\pm"
  },
  {
    input: "log_2(x)+5",
    output: "<mrow><msub><mo>log</mo><mn>2</mn></msub><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mo>+</mo><mn>5</mn>",
    TeXoutput: "\\pm"
  },
  {
    input: "log_sqrt(5)3/5",
    output: "<mfrac><mrow><msub><mo>log</mo><msqrt><mrow><mn>5</mn></mrow></msqrt></msub><mn>3</mn></mrow><mn>5</mn></mfrac>",
    TeXoutput: "\\pm"
  },
  {
    input: "log_2^5(x)+5",
    output: "<mrow><mrow><msubsup><mo>log</mo><mn>2</mn><mn>5</mn></msubsup></mrow><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mo>+</mo><mn>5</mn>",
    TeXoutput: "\\pm"
  },
  { input: "2^f_2-3", output: "<msup><mn>2</mn><mi>f</mi></msup><mo>_</mo><mn>2</mn><mo>-</mo><mn>3</mn>", TeXoutput: "\\pm" },
  {
    input: "f_3(x)/5",
    output: "<mfrac><mrow><msub><mi>f</mi><mn>3</mn></msub><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>5</mn></mfrac>",
    TeXoutput: "\\pm"
  },
  {
    input: "2^(f_3(x)/5)",
    output: "<msup><mn>2</mn><mrow><mfrac><mrow><msub><mi>f</mi><mn>3</mn></msub><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>5</mn></mfrac></mrow></msup>",
    TeXoutput: "\\pm"
  },
  {
    input: "log_3x^2/5",
    output: "<mfrac><mrow><msub><mo>log</mo><mn>3</mn></msub><msup><mi>x</mi><mn>2</mn></msup></mrow><mn>5</mn></mfrac>",
    TeXoutput: "\\pm"
  },
  {
    input: "log_3x_0/5",
    output: "<mfrac><mrow><msub><mo>log</mo><mn>3</mn></msub><msub><mi>x</mi><mn>0</mn></msub></mrow><mn>5</mn></mfrac>",
    TeXoutput: "\\pm"
  },
  {
    input: "sin^2(x)/5",
    output: "<mfrac><mrow><msup><mo>sin</mo><mn>2</mn></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>5</mn></mfrac>",
    TeXoutput: "\\pm"
  },

  //spaces can be used to break tokens
  { input: "3+ -4", output: "<mn>3</mn><mo>+</mo><mo>-</mo><mn>4</mn>", TeXoutput: "\\pm" },
  { input: "3+-4", output: "<mn>3</mn><mo>±</mo><mn>4</mn>", TeXoutput: "\\pm" },

  //decimal place (if used as decimal separator) keeps token, but commas do not
  { input: "3^5.234", output: "<msup><mn>3</mn><mn>5.234</mn></msup>", TeXoutput: "\\pm" },
  { input: "3^5,233", output: "<msup><mn>3</mn><mn>5</mn></msup><mo>,</mo><mn>233</mn>", TeXoutput: "\\pm" },

  //check I/I grammar
  { input: "(x+1)/4", output: "<mfrac><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mn>4</mn></mfrac>", TeXoutput: "\\pm" },
  { input: "sqrtx/4", output: "<mfrac><msqrt><mi>x</mi></msqrt><mn>4</mn></mfrac>", TeXoutput: "\\pm" },
  {
    input: "root(3)(5)/4",
    output: "<mfrac><mroot><mrow><mn>5</mn></mrow><mrow><mn>3</mn></mrow></mroot><mn>4</mn></mfrac>",
    TeXoutput: "\\pm"
  },
  { input: "3^2/4^2", output: "<mfrac><msup><mn>3</mn><mn>2</mn></msup><msup><mn>4</mn><mn>2</mn></msup></mfrac>", TeXoutput: "\\pm" },
  { input: "3_2/4_2", output: "<mfrac><msub><mn>3</mn><mn>2</mn></msub><msub><mn>4</mn><mn>2</mn></msub></mfrac>", TeXoutput: "\\pm" },
  { input: "3^2/4^2", output: "<mfrac><msup><mn>3</mn><mn>2</mn></msup><msup><mn>4</mn><mn>2</mn></msup></mfrac>", TeXoutput: "\\pm" },
  { input: "3_2/4_2", output: "<mfrac><msub><mn>3</mn><mn>2</mn></msub><msub><mn>4</mn><mn>2</mn></msub></mfrac>", TeXoutput: "\\pm" },
  {
    input: "3_2^3/4_2",
    output: "<mfrac><mrow><msubsup><mn>3</mn><mn>2</mn><mn>3</mn></msubsup></mrow><msub><mn>4</mn><mn>2</mn></msub></mfrac>",
    TeXoutput: "\\pm"
  },
  {
    input: "vecx/hat3+vecx^2+(vec x)^2 + vec(x^2)",
    output:
      '<mfrac><mover><mi>x</mi><mo stretchy="false">→</mo></mover><mover><mn>3</mn><mo>^</mo></mover></mfrac><mo>+</mo><msup><mover><mi>x</mi><mo stretchy="false">→</mo></mover><mn>2</mn></msup><mo>+</mo><msup><mrow><mo>(</mo><mover><mi>x</mi><mo stretchy="false">→</mo></mover><mo>)</mo></mrow><mn>2</mn></msup><mo>+</mo><mover><mrow><msup><mi>x</mi><mn>2</mn></msup></mrow><mo>→</mo></mover>',
    TeXoutput: "\\pm"
  },
  //negative handling
  { input: "-3-4", output: "<mo>-</mo><mn>3</mn><mo>-</mo><mn>4</mn>", TeXoutput: "\\pm" },
  { input: "(-3,-4)", output: "<mrow><mo>(</mo><mo>-</mo><mn>3</mn><mo>,</mo><mo>-</mo><mn>4</mn><mo>)</mo></mrow>", TeXoutput: "\\pm" },
  {
    input: "-(-2-4)-5",
    output: "<mo>-</mo><mrow><mo>(</mo><mo>-</mo><mn>2</mn><mo>-</mo><mn>4</mn><mo>)</mo></mrow><mo>-</mo><mn>5</mn>",
    TeXoutput: "\\pm"
  },
  {
    input: "2_-4^-5",
    output: "<mrow><msubsup><mn>2</mn><mrow><mo>-</mo><mn>4</mn></mrow><mrow><mo>-</mo><mn>5</mn></mrow></msubsup></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: "int_-sqrt(3)^4",
    output: "<mrow><msubsup><mo>∫</mo><mrow><mo>-</mo><msqrt><mrow><mn>3</mn></mrow></msqrt></mrow><mn>4</mn></msubsup></mrow>",
    TeXoutput: "\\pm"
  },
  { input: "-2/-3", output: "<mo>-</mo><mfrac><mn>2</mn><mrow><mo>-</mo><mn>3</mn></mrow></mfrac>", TeXoutput: "\\pm" },
  { input: "(-2)/-3", output: "<mfrac><mrow><mo>-</mo><mn>2</mn></mrow><mrow><mo>-</mo><mn>3</mn></mrow></mfrac>", TeXoutput: "\\pm" },
  {
    input: "-2/3-3/4",
    output: "<mo>-</mo><mfrac><mn>2</mn><mn>3</mn></mfrac><mo>-</mo><mfrac><mn>3</mn><mn>4</mn></mfrac>",
    TeXoutput: "\\pm"
  },
  { input: "-2^2", output: "<mo>-</mo><msup><mn>2</mn><mn>2</mn></msup>", TeXoutput: "\\pm" },
  {
    input: "-(x+1)/-(x+3)",
    output: "<mo>-</mo><mfrac><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mrow><mo>-</mo><mrow><mo>(</mo><mi>x</mi><mo>+</mo><mn>3</mn><mo>)</mo></mrow></mrow></mfrac>",
    TeXoutput: "\\pm"
  },

  //issue 40
  { input: "{:{:x:}:}", output: "<mrow><mrow><mi>x</mi></mrow></mrow>", TeXoutput: "\\pm" },
  { input: "{:1+{:x:}+3:}", output: "<mrow><mn>1</mn><mo>+</mo><mrow><mi>x</mi></mrow><mo>+</mo><mn>3</mn></mrow>", TeXoutput: "\\pm" },

  //issue37
  { input: "(:2,3]", output: "<mrow><mo>〈</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>]</mo></mrow>", TeXoutput: "\\pm" },
  { input: "[2,3rangle", output: "<mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>〉</mo></mrow>", TeXoutput: "\\pm" },
  { input: "2,3)", output: "<mn>2</mn><mo>,</mo><mn>3</mn><mo>)</mo>", TeXoutput: "\\pm" },
  { input: "(2,3", output: "<mrow><mo>(</mo><mn>2</mn><mo>,</mo><mn>3</mn></mrow>", TeXoutput: "\\pm" },

  //issue42
  {
    input: "[(1,2,3,|,4),(5,6,7, |,8)]",
    output:
      '<mrow><mo>[</mo><mtable columnlines="none none solid none"><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd></mtr><mtr><mtd><mn>5</mn></mtd><mtd><mn>6</mn></mtd><mtd><mn>7</mn></mtd><mtd><mn>8</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "[(1,2,3, | ,4,5),(5,6,7, | ,8,9)]",
    output:
      '<mrow><mo>[</mo><mtable columnlines="none none solid none none"><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd><mtd><mn>5</mn></mtd></mtr><mtr><mtd><mn>5</mn></mtd><mtd><mn>6</mn></mtd><mtd><mn>7</mn></mtd><mtd><mn>8</mn></mtd><mtd><mn>9</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "[(1,|,2,3,4),(5,|,6,7,8)]",
    output:
      '<mrow><mo>[</mo><mtable columnlines="solid none none none"><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd></mtr><mtr><mtd><mn>5</mn></mtd><mtd><mn>6</mn></mtd><mtd><mn>7</mn></mtd><mtd><mn>8</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "[(1,|,3,|,4),(5,|,7,|,8)]",
    output: '<mrow><mo>[</mo><mtable columnlines="solid solid none"><mtr><mtd><mn>1</mn></mtd><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd></mtr><mtr><mtd><mn>5</mn></mtd><mtd><mn>7</mn></mtd><mtd><mn>8</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "[(2,|x|,5),(3,|y|,4)]",
    output:
      '<mrow><mo>[</mo><mtable columnlines="none none none"><mtr><mtd><mn>2</mn></mtd><mtd><mrow><mo>|</mo><mi>x</mi><mo>|</mo></mrow></mtd><mtd><mn>5</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd><mtd><mrow><mo>|</mo><mi>y</mi><mo>|</mo></mrow></mtd><mtd><mn>4</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "[(1,|,2,|x|,5),(3,|,4,|y|,7)]",
    output:
      '<mrow><mo>[</mo><mtable columnlines="solid none none none"><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mrow><mo>|</mo><mi>x</mi><mo>|</mo></mrow></mtd><mtd><mn>5</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd><mtd><mrow><mo>|</mo><mi>y</mi><mo>|</mo></mrow></mtd><mtd><mn>7</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "[(1,2,3,|,4),(5,6,7,8,9)]",
    output:
      '<mrow><mo>[</mo><mtable columnlines="none none solid none"><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd></mtr><mtr><mtd><mn>5</mn></mtd><mtd><mn>6</mn></mtd><mtd><mn>7</mn></mtd><mtd><mn>8</mn></mtd><mtd><mn>9</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "[(1,2,3,|,4),(5,6,7,8)]",
    output:
      "<mrow><mo>[</mo><mrow><mo>(</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mrow><mo>∣</mo></mrow><mo>,</mo><mn>4</mn><mo>)</mo></mrow><mo>,</mo><mrow><mo>(</mo><mn>5</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>)</mo></mrow><mo>]</mo></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: "[(1,2,3,4,5),(5,6,7,|,9)]",
    output:
      '<mrow><mo>[</mo><mtable columnlines="none none none none none"><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd><mtd><mn>5</mn></mtd></mtr><mtr><mtd><mn>5</mn></mtd><mtd><mn>6</mn></mtd><mtd><mn>7</mn></mtd><mtd><mn>9</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "[(1,2,3,4),(5,6,7,|,9)]",
    output:
      "<mrow><mo>[</mo><mrow><mo>(</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>4</mn><mo>)</mo></mrow><mo>,</mo><mrow><mo>(</mo><mn>5</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>7</mn><mo>,</mo><mrow><mo>∣</mo></mrow><mo>,</mo><mn>9</mn><mo>)</mo></mrow><mo>]</mo></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: "[(1,2,3,|),(5,6,7,|)]",
    output:
      '<mrow><mo>[</mo><mtable columnlines="none none solid none"><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd><mtd></mtd></mtr><mtr><mtd><mn>5</mn></mtd><mtd><mn>6</mn></mtd><mtd><mn>7</mn></mtd><mtd></mtd></mtr></mtable><mo>]</mo></mrow>',
    TeXoutput: "\\pm"
  },
  {
    input: "|x/2+3|,|x-4/5|",
    output: "<mrow><mo>|</mo><mfrac><mi>x</mi><mn>2</mn></mfrac><mo>+</mo><mn>3</mn><mo>|</mo></mrow><mo>,</mo><mrow><mo>|</mo><mi>x</mi><mo>-</mo><mfrac><mn>4</mn><mn>5</mn></mfrac><mo>|</mo></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: "int_2^4 2x dx = x^2|_2^4",
    output: "<mrow><msubsup><mo>∫</mo><mn>2</mn><mn>4</mn></msubsup></mrow><mn>2</mn><mi>x</mi><mrow><mi>d</mi><mi>x</mi></mrow><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup><mrow><msubsup><mrow><mo>∣</mo></mrow><mn>2</mn><mn>4</mn></msubsup></mrow>",
    TeXoutput: "\\pm"
  },

  //issue74
  {
    input: "3+sin(x)/5-2Sin(x)",
    output: "<mn>3</mn><mo>+</mo><mfrac><mrow><mo>sin</mo><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>5</mn></mfrac><mo>-</mo><mn>2</mn><mrow><mo>Sin</mo><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: '5+sin(x)+Sin(x)+"test Since"',
    output: "<mn>5</mn><mo>+</mo><mrow><mo>sin</mo><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mo>Sin</mo><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mtext>test Since</mtext></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: "Log(x)/3 +log(x)/3",
    output: "<mfrac><mrow><mo>Log</mo><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>3</mn></mfrac><mo>+</mo><mfrac><mrow><mo>log</mo><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>3</mn></mfrac>",
    TeXoutput: "\\pm"
  },
  {
    input: "Abs(3) + abs(3)",
    output: "<mrow><mo>|</mo><mrow><mn>3</mn></mrow><mo>|</mo></mrow><mo>+</mo><mrow><mo>|</mo><mrow><mn>3</mn></mrow><mo>|</mo></mrow>",
    TeXoutput: "\\pm"
  },

  //issue86
  {
    input: "3 + id(hi)(x^2)+class(red)(4)",
    output: '<mn>3</mn><mo>+</mo><mrow id="hi"><mrow><msup><mi>x</mi><mn>2</mn></msup></mrow></mrow><mo>+</mo><mrow class="red"><mrow><mn>4</mn></mrow></mrow>',
    TeXoutput: "\\pm"
  },

  //issue88
  {
    input: '3+"hi there"+5"whee"-4',
    output: "<mn>3</mn><mo>+</mo><mrow><mtext>hi there</mtext></mrow><mo>+</mo><mn>5</mn><mrow><mtext>whee</mtext></mrow><mo>-</mo><mn>4</mn>",
    TeXoutput: "\\pm"
  },
  {
    input: '3+"hi \\"there\\"" +5"whee"-4',
    output: '<mn>3</mn><mo>+</mo><mrow><mtext>hi "there"</mtext></mrow><mo>+</mo><mn>5</mn><mrow><mtext>whee</mtext></mrow><mo>-</mo><mn>4</mn>',
    TeXoutput: "\\pm"
  },
  { input: '3+"hi there+5', output: "<mn>3</mn><mo>+</mo><mrow><mtext>hi there+5</mtext></mrow>", TeXoutput: "\\pm" },
  { input: '3+"hi \\"there\\" - 4', output: '<mn>3</mn><mo>+</mo><mrow><mtext>hi "there" - 4</mtext></mrow>', TeXoutput: "\\pm" },
  {
    input: "3+f'(x)+f''+f^2+f_2+(x+2)'(x)+3^f'",
    output:
      "<mn>3</mn><mo>+</mo><mrow><msup><mi>f</mi><mo>′</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mo>+</mo><msup><mi>f</mi><mo>″</mo></msup><mo>+</mo><msup><mi>f</mi><mn>2</mn></msup><mo>+</mo><msub><mi>f</mi><mn>2</mn></msub><mo>+</mo><msup><mrow><mo>(</mo><mi>x</mi><mo>+</mo><mn>2</mn><mo>)</mo></mrow><mo>′</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>+</mo><msup><msup><mn>3</mn><mi>f</mi></msup><mo>′</mo></msup>",
    TeXoutput: "\\pm"
  },
  {
    input: "p'(x)+p''(x)+p'''(x)+p''''(x)+p'''''(x)+f'''(x)",
    output:
      "<msup><mi>p</mi><mo>′</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>+</mo><msup><mi>p</mi><mo>″</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>+</mo><msup><mi>p</mi><mo>‴</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>+</mo><msup><mi>p</mi><mo>⁗</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>+</mo><msup><mi>p</mi><mo>′′′′′</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>+</mo><mrow><msup><mi>f</mi><mo>‴</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow>",
    TeXoutput: "\\pm"
  },
  { input: "g''", output: "<msup><mi>g</mi><mo>″</mo></msup>", TeXoutput: "\\pm" },
  {
    input: "fprimeprime(x)",
    output: "<mrow><msup><mi>f</mi><mo>″</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow>",
    TeXoutput: "\\pm"
  },
  {
    input: "f'''(x)/3",
    output: "<mfrac><mrow><msup><mi>f</mi><mo>‴</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>3</mn></mfrac>",
    TeXoutput: "\\pm"
  },
  {
    input: "f^2(x)/3 + f(x)/3 + f'(x)/3+sin'(x)/2 + k'(x)/3+k^2(x)/3",
    output:
      "<mfrac><mrow><msup><mi>f</mi><mn>2</mn></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>3</mn></mfrac><mo>+</mo><mfrac><mrow><mi>f</mi><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>3</mn></mfrac><mo>+</mo><mfrac><mrow><msup><mi>f</mi><mo>′</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>3</mn></mfrac><mo>+</mo><mfrac><mrow><msup><mo>sin</mo><mo>′</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>2</mn></mfrac><mo>+</mo><msup><mi>k</mi><mo>′</mo></msup><mfrac><mrow><mi>x</mi></mrow><mn>3</mn></mfrac><mo>+</mo><msup><mi>k</mi><mn>2</mn></msup><mfrac><mrow><mi>x</mi></mrow><mn>3</mn></mfrac>",
    TeXoutput: "\\pm"
  },
  {
    input: "f'/3 - f'+2/3 + f'+/3 + f_2'(x)/3 + f_2'/3 + f_2'+/3 + f'+3",
    output:
      "<mfrac><msup><mi>f</mi><mo>′</mo></msup><mn>3</mn></mfrac><mo>-</mo><msup><mi>f</mi><mo>′</mo></msup><mo>+</mo><mfrac><mn>2</mn><mn>3</mn></mfrac><mo>+</mo><msup><mi>f</mi><mo>′</mo></msup><mfrac><mo>+</mo><mn>3</mn></mfrac><mo>+</mo><mfrac><mrow><msup><msub><mi>f</mi><mn>2</mn></msub><mo>′</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>3</mn></mfrac><mo>+</mo><mfrac><msup><msub><mi>f</mi><mn>2</mn></msub><mo>′</mo></msup><mn>3</mn></mfrac><mo>+</mo><msup><msub><mi>f</mi><mn>2</mn></msub><mo>′</mo></msup><mfrac><mo>+</mo><mn>3</mn></mfrac><mo>+</mo><msup><mi>f</mi><mo>′</mo></msup><mo>+</mo><mn>3</mn>",
    TeXoutput: "\\pm"
  },
  {
    input: "sin+3 - sin^2+3",
    output: "<mo>sin</mo><mo>+</mo><mn>3</mn><mo>-</mo><msup><mo>sin</mo><mn>2</mn></msup><mo>+</mo><mn>3</mn>",
    TeXoutput: "\\pm"
  },
  {
    input: "3^sin(x) + 3^sin^2(x) + 4^f'(x)",
    output:
      "<msup><mn>3</mn><mrow><mo>sin</mo><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow></msup><mo>+</mo><msup><mn>3</mn><mo>sin</mo></msup><mo>^</mo><mn>2</mn><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>+</mo><msup><msup><mn>4</mn><mi>f</mi></msup><mo>′</mo></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow>",
    comment: "this isn't ideal, but best we can do without totally mangling the grammar",
    TeXoutput: "\\pm"
  },

  //issue 94
  {
    input: "f^2(x)/5",
    output: "<mfrac><mrow><msup><mi>f</mi><mn>2</mn></msup><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mn>5</mn></mfrac>",
    TeXoutput: "\\pm"
  },
  { input: "f^2x/5", output: "<msup><mi>f</mi><mn>2</mn></msup><mfrac><mi>x</mi><mn>5</mn></mfrac>", TeXoutput: "\\pm" },
  {
    input: "1/f^2x^2",
    output: "<mfrac><mn>1</mn><msup><mi>f</mi><mn>2</mn></msup></mfrac><msup><mi>x</mi><mn>2</mn></msup>",
    TeXoutput: "\\pm"
  },
  { input: "1/fx^2", output: "<mfrac><mn>1</mn><mi>f</mi></mfrac><msup><mi>x</mi><mn>2</mn></msup>", TeXoutput: "\\pm" },
  { input: "f'(x)/5", output: "<mi>f</mi><mo>′</mo><mfrac><mrow><mi>x</mi></mrow><mn>5</mn></mfrac>", TeXoutput: "\\pm" },

  //overparen
  { input: "overparen(AB)", output: "<mover><mrow><mi>A</mi><mi>B</mi></mrow><mo>⏜</mo></mover>", TeXoutput: "\\pm" },
  { input: "overarc(AB)", output: "<mover><mrow><mi>A</mi><mi>B</mi></mrow><mo>⏜</mo></mover>", TeXoutput: "\\pm" },

  //bad/incomplete input
  { input: "3/", output: "<mfrac><mn>3</mn><mo></mo></mfrac>", TeXoutput: "\\pm" },
  { input: "2^", output: "<msup><mn>2</mn><mo></mo></msup>", TeXoutput: "\\pm" },
  { input: "2^+3", output: "<msup><mn>2</mn><mo>+</mo></msup><mn>3</mn>", TeXoutput: "\\pm" },
  { input: "/4", output: "<mo>/</mo><mn>4</mn>", TeXoutput: "\\pm" },
  {
    input: "2^- +3",
    output: "<msup><mn>2</mn><mo>-</mo></msup><mo>+</mo><mn>3</mn>",
    comment: "changed w issue 88 - maybe better now?",
    TeXoutput: "\\pm"
  },
  {
    input: "lim_(x rarr 2^-) f(x)",
    output: "<munder><mo>lim</mo><mrow><mi>x</mi><mo>→</mo><msup><mn>2</mn><mo>-</mo></msup></mrow></munder><mrow><mi>f</mi><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow>",
    TeXoutput: "\\pm"
  },
];

function htmlEntities(str) {
  return String(str)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
}

$(function () {
  setTimeout(runTests, 100);
  //setTimeout(generateSymbolTests, 100);
});
function runTests() {
  $("#maketest").on("click", function () {
    var txt = $("#newtest").val();
    var out = $(asciimath.parseMath(txt))
    .find("mstyle")
    .html()
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
    var outstr = '{input: "' + txt.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '", output:"' + out + '"},\n';
    $("#newtestout").text($("#newtestout").text() + outstr);
  });
  var res;
  var tr;
  var td;
  var code;
  var tbody = document.getElementById("testout");
  for (var i = 0; i < unittests.length; i++) {
    res = asciimath.parseMath(unittests[i].input);
    tr = document.createElement("tr");

    td = document.createElement("td");
    td.appendChild(document.createTextNode(unittests[i].input));
    tr.appendChild(td);

    td = document.createElement("td");
    td.appendChild(res);
    tr.appendChild(td);
    var outhtml = $(res)
    .find("mstyle")
    .html();
    var TeXimgSupport = false;
    // add support for ASCIIMathTeXImg.js testing:
    if (outhtml == null && asciimath.AMTparseAMtoTeX) {
      outhtml = asciimath.AMTparseAMtoTeX(unittests[i].input);
      TeXimgSupport = true;
    }

    td = document.createElement("td");
    code = document.createElement("code");
    code.appendChild(document.createTextNode(outhtml));
    td.appendChild(code);
    tr.appendChild(td);

    td = document.createElement("td");
    code = document.createElement("code");
    code.appendChild(document.createTextNode(!TeXimgSupport ? unittests[i].output : unittests[i].TeXoutput));
    td.appendChild(code);
    tr.appendChild(td);

    if ((!TeXimgSupport ? unittests[i].output === outhtml : unittests[i].TeXoutput === outhtml)) {
      tr.className = "success";
    } else {
      tr.className = "failed";
    }
    tbody.appendChild(tr);
  }
}

function generateSymbolTests() {
  var outhtml;
  var res;
  var outstr;
  for (var i = 0; i < asciimath.AMnames.length; i++) {
    res = asciimath.parseMath(asciimath.AMnames[i]);
    outhtml = $(res)
    .find("mstyle")
    .html()
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
    outstr += '{input: "' + asciimath.AMnames[i].replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '", output:"' + outhtml + '"},\n';
  }
  $("#newtestout").text(outstr);
}
