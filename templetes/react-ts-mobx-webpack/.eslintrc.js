module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        "eslint:recommended",
        'plugin:react/recommended',
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    plugins: ['@typescript-eslint', 'spellcheck', 'react-hooks'],
    env: {
        browser: true,
        node: true,
        es6: true
    },
    settings: {
        //自动发现React的版本，从而进行规范react代码
        react: {
            pragma: 'React',
            version: 'detect'
        }
    },
    parserOptions: {
        //指定ESLint可以解析JSX语法
        ecmaVersion: 2019,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        'camelcase': ['error', { 'properties': 'always' }],
        '@typescript-eslint/no-explicit-any': 'off',
        'no-implicit-globals': 'error',
        'object-curly-spacing': ['error', 'always'],
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        "prefer-const": ["error", {
            "destructuring": "any",
            "ignoreReadBeforeAssign": false
        }],
        'no-var': 'error',
        '@typescript-eslint/member-delimiter-style': ['error', {
            "multiline": {
                "delimiter": "comma",
                "requireLast": true
            },
            "singleline": {
                "delimiter": "comma",
                "requireLast": true
            },
            "overrides": {
                "interface": {
                    "multiline": {
                        "delimiter": "semi",
                        "requireLast": true
                    }
                }
            }
        }],
        "@typescript-eslint/naming-convention": [
            "error",
            {
                "selector": "interface",
                "format": ["PascalCase"],
                "custom": {
                    "regex": "^I[A-Z]",
                    "match": true
                }
            }
        ],
        "spellcheck/spell-checker": [1,
            {
                "comments": true,
                "strings": true,
                "identifiers": true,
                "lang": "en_US",
                "skipWords": [],
                "skipIfMatch": [
                    "[A-Z]*"
                ],
                "minLength": 3
            }
        ],
        "indent": [2, 4, { "SwitchCase": 1 }],
        'no-debugger': 2,
        'no-dupe-keys': 2, //在创建对象字面量时不允许键重复 {a:1,a:1}
        'no-dupe-args': 2,
        'no-else-return': 2,
        'no-empty': 2,
        'no-nested-ternary': 0, // 禁止使用嵌套的三目运算
        'keyword-spacing': 'error',
        'no-multi-spaces': 'error',
        'block-spacing': 'error',
        'no-whitespace-before-property': 'error',
        'space-before-blocks': 'error',
        'space-infix-ops': 'error',
        'space-unary-ops': 'error',
        'comma-spacing': ["error", { "before": false, "after": true }],
        'key-spacing': ["error", { "beforeColon": false }],
        'arrow-spacing': 'error',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'semi': [2, 'never'],
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off"
    }
}