import {
  GoogleOneTapSignIn,
  statusCodes,
  isErrorWithCode,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

// Somewhere in your code
const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleOneTapSignIn.signIn({
      webClientId: config.webClientId,
      iosClientId: config.iosClientId, // only needed if you're not using the Firebase config file
      nonce: 'your_nonce',
    });
    setState({ userInfo });
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.NO_SAVED_CREDENTIAL_FOUND:
          // Android only. No saved credential found, try calling `createAccount`
          break;
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          break;
        case statusCodes.ONE_TAP_START_FAILED:
          // Android and Web only, you probably have hit rate limiting.
          // On Android, you can still call `presentExplicitSignIn` in this case.
          // On the web, user needs to click the `WebGoogleSigninButton` to sign in.
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // Android-only: play services not available or outdated
          break;
        default:
        // something else happened
      }
    } else {
      // an error that's not related to google sign in occurred
    }
  }
};
