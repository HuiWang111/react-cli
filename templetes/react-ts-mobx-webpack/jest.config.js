module.exports = {
    roots: [
        '<rootDir>/src'
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'json',
        'node'
    ],
    moduleNameMapper: {
        "\\.(s?css|less)$": "identity-obj-proxy"
    },
    moduleDirectories: ['node_modules', 'src']
}