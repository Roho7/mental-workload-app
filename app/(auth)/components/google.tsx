import { useAuth } from '@/components/hooks/useAuth';
import { View } from '@/components/Themed';
import { useState } from 'react';

function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  return (
    <View></View>
    // <GoogleSigninButton
    //   size={GoogleSigninButton.Size.Wide}
    //   color={GoogleSigninButton.Color.Dark}
    //   onPress={async () => {
    //     setLoading(true);
    //     try {
    //       await GoogleSignin.hasPlayServices();
    //       const userInfo = await GoogleSignin.signIn();
    //       setUser(userInfo);
    //     } catch (error) {
    //       throw error;
    //     }

    //     setLoading(false);
    //   }}
    //   disabled={loading}
    // />
  );
}

export default GoogleLoginButton;
