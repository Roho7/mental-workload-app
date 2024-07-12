import { TaskProvider } from '@/components/hooks/useTasks';
import tamaguiConfig from '@/tamagui.config';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { EventProvider } from 'react-native-outside-press';
import { TamaguiProvider, Theme } from 'tamagui';
import { AuthProvider } from '../components/hooks/useAuth';
export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require('../assets/fonts/Inter.ttf'),
    InterBold: require('../assets/fonts/Inter.ttf'),
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
          <Theme name='dark_blue'>
            <TaskProvider>
              <RootLayoutNav />
            </TaskProvider>
          </Theme>
        </ThemeProvider>
      </TamaguiProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  return (
    <EventProvider>
      <Slot />
    </EventProvider>
  );
}
