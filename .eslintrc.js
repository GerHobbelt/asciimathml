module.exports = {
    "root": true,
    "extends": "eslint:recommended",
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
        "no-console": "off",
        "no-useless-escape": "off",
        "no-empty": "off",
        "no-unused-vars": "off",
        
        "no-redeclare": "warn",
    },
};