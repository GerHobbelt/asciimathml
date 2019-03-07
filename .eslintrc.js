module.exports = {
    "root": true,
    "extends": [
        "eslint:recommended",
        // "eslint-config-semistandard"
    ],
    "env": { 
        "es6": false,
        "browser": true,
        "node": true, 
    }, 
    "parserOptions": { 
        "ecmaVersion": 5,
        "sourceType": "script",
        "impliedStrict": true, 
    },
    "globals": {
        "MathJax": true,
        "ActiveXObject": true,
        "cookie": true,
    },
    "rules": {
        "quotes": ["off", "double", "avoid-escape"],
        "indent": ["off", 2],
        "max-len": "off",                 // disables line length check
        // "max-len": ["error", {"code": 80, "ignoreUrls": true}],
        "curly": ["warn", "all"],        // wrap all if/else statements in {...} curly braces
        "eqeqeq": ["warn", "always", {"null": "ignore"}],
        // "max-statements-per-line": ["error", { "max": 1 }],
        // "one-var-declaration-per-line": ["error", "always"],
        // "one-var": ["error", "never"],    // break up var decls into multiple stmts: one per var.
        "nonblock-statement-body-position": ["error", "below"],
        "no-console": "off",
        "no-useless-escape": "off",
        "no-empty": "off",
        "no-unused-vars": "off",

        "no-redeclare": "warn",
    },
};