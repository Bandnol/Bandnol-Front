module.exports = function (api) {
  api.cache(true);
  process.env.EXPO_ROUTER_APP_ROOT = '../../app';
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
        },
      ],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
