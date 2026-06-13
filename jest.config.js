module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  setupFilesAfterEnv: [],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@walletconnect/react-native-compat)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/__tests__/**',
    '!src/index.ts',
  ],
};
