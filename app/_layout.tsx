import tamaguiConfig from '@/tamagui.config';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TamaguiProvider, Theme } from 'tamagui';
import { AuthProvider } from '../components/hooks/useAuth';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/Inter.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <AuthProvider>
      <TamaguiProvider config={tamaguiConfig}>
        <ThemeProvider value={DarkTheme}>
          <Theme name="dark_blue">
            <RootLayoutNav />
          </Theme>
        </ThemeProvider>
      </TamaguiProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  return <Slot />;
}
