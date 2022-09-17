module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    settings: {
        node: {
            tryExtensions: ['.js', '.json', '.node', '.ts', '.d.ts']
        }
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:node/recommended',
        'prettier'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    rules: {
        '@typescript-eslint/no-empty-interface': 'off',
        'node/no-extraneous-import': 'off',
        'node/no-unpublished-import': 'off',
        'node/no-unsupported-features/es-syntax': [
            'error',
            {
                ignores: ['modules']
            }
        ]
    }
};
