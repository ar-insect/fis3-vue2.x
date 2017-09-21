
module.exports = {
    envs: ['browser', 'es6', 'node'],
    'parserOptions': {
        'ecmaVersion': 6,
        'sourceType': 'module',
        'ecmaFeatures': {
            'experimentalObjectRestSpread': true,
        },
    },
    rules: {
        'semi': [1],
        'no-undef': [2],
        'no-use-before-define': [1],
        'no-unused-vars': [1],
        'no-eval': [1],
    },
};
