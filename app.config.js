export default {
  expo: {
    name: 'Serotonin',
    slug: 'serotonin',
    description: 'A mental workload tracker',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    build: {
      production: {
        env: {
          FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
          FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
          FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
          FIREBASE_STORAGE_BUCKET:
            process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
          FIREBASE_MESSAGING_SENDER_ID:
            process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
          FIREBASE_MEASUREMENT_ID:
            process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
          GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
        },
      },
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      googleServicesFile: process.env.GOOGLE_SERVICES_INFOPLIST,
      supportsTablet: true,
      bundleIdentifier: 'serotonin.app',
    },
    android: {
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'serotonin.app',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      '@react-native-google-signin/google-signin',
      '@react-native-firebase/app',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
      'expo-router',
      [
        'expo-font',
        {
          font: ['./assets/fonts/Inter.ttf'],
        },
      ],
      'expo-secure-store',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: 'fe31e56e-4ad3-4645-a4e8-ac0a28a86f50',
      },
    },
  },
};
