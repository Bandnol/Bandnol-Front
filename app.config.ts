export default {
  expo: {
    name: 'Bandnol',
    slug: 'bandnol',
    owner: 'bandnol',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'bandnol',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      bundleIdentifier: 'com.bandnol.goBandnolApp20',
      supportsTablet: false,
      icon: './assets/images/Bandnol-logo-2.png',
    },
    android: {
      package: 'com.bandnol.bandnolapp',
      versionCode: 5,
      adaptiveIcon: {
        foregroundImage: './assets/images/Bandnol-logo-2.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    // EAS Update
    updates: {
      url: 'https://u.expo.dev/e22ee9c3-9022-4d36-8e63-d8a411ac0ccd',
    },
    runtimeVersion: '1.0.0',
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: 'e22ee9c3-9022-4d36-8e63-d8a411ac0ccd',
      },
    },
  },
};
