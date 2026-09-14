module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.json'],
          alias: {
            '@app':        './app',
            '@components': './components',
            '@store':      './store',
            '@hooks':      './hooks',
            '@theme':      './theme',
            '@services':   './services',
            '@constants':  './constants',
            '@assets':     './assets',
            '@lib':        './lib',
          },
        },
      ],
    ],
  };
};
