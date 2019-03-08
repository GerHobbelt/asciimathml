module.exports = {
    "root": true,
    "extends": [
        "eslint:recommended",
        // "eslint-config-semistandard"
        // "airbnb"
    ],
    "env": { 
        "es6": false,
        "browser": true,
        "node": true, 
    }, 
    "plugins": [
        "no-mixed-operators"
    ],
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
        "no-tabs": "warn",
        "quotes": ["warn", "double", "avoid-escape"],
        "indent": ["warn", 2, {
            SwitchCase: 0,
            VariableDeclarator: { "var": 2, "let": 2, "const": 3 },
            outerIIFEBody: 0,
            MemberExpression: 0,
            FunctionDeclaration: {
                "body": 1, 
                "parameters": 2
            },
            FunctionExpression: {
                "body": 1, 
                "parameters": 2
            },
            CallExpression: {
                "arguments": 1
            },
        }],
        // "max-len": "off",                 // disables line length check
        "max-len": ["warn", {"code": 250, "ignoreUrls": true}],
        "curly": ["warn", "all"],        // wrap all if/else statements in {...} curly braces
        "eqeqeq": ["warn", "always", {"null": "ignore"}],
    
        // disallow use of comma operator
        'no-sequences': 'error',

        "max-statements-per-line": ["warn", { "max": 1 }],
        // "one-var-declaration-per-line": ["warn", "always"],
        "one-var": ["error", { 
            var: "never", 
            let: "never", 
            const: "never" 
        }],    // break up var decls into multiple stmts: one per var.
        "nonblock-statement-body-position": ["error", "below"],
        "no-console": "off",
        "no-useless-escape": "off",
        "no-empty": "off",
        "no-unused-vars": "off",

        "no-mixed-spaces-and-tabs": ["warn", true], 
        "no-func-assign": 1,
        "no-undef": 1,
        // "no-extra-parens": 1,
        "no-extra-parens": ["warn", "all", { "nestedBinaryExpressions": false }],
        // ["warn", "all",
        //     { 
        //         "conditionalAssign": false,
        //         "returnAssign": false,
        //         "nestedBinaryExpressions": false,
        //         "ignoreJSX": "all",
        //         "enforceForArrowConditionals": false,
        //         "functions": false 
        //     }
        // ],
        
        "no-mixed-operators": "off",
        "no-mixed-operators/no-mixed-operators": "warn",

        "space-before-function-paren": ["error", {"anonymous": "always", "named": "never", "asyncArrow": "always"}],
        "no-confusing-arrow": ["warn", {"allowParens": true}],
        "space-unary-ops": ["warn", {"words": true, "nonwords": false}],

        "no-redeclare": "warn",

        "func-call-spacing": ["warn", "never"],
        "multiline-ternary": ["warn", "always-multiline"],
    },
};