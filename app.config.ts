import 'dotenv/config';
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
      bundleIdentifier: 'com.bandnol.Bandnol20',
      supportsTablet: false,
    },
    android: {
      package: 'com.bandnol.Bandnol',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      useNextNotificationsApi: true,
      notification: {
        icon: './assets/notification-icon.png',
        color: '#FB4932',
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
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
            extraMavenRepos: [
              'https://devrepo.kakao.com/nexus/content/groups/public/',
            ],
          },
        },
      ],
      [
        '@react-native-kakao/core',
        {
          nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY,
          android: {
            authCodeHandlerActivity: true,
          },
          ios: {
            handleKakaoOpenUrl: true,
          },
        },
      ],
      [
        'expo-notifications',
        {
          mode:
            process.env.EAS_BUILD_PROFILE === 'production'
              ? 'production'
              : 'development',
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
