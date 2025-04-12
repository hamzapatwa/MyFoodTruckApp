import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText, ActivityIndicator, useTheme, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../../services/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';

// Configure Google Sign-In - **REPLACE WITH YOUR ACTUAL WEB CLIENT ID**
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // Get this from Google Cloud Console
  offlineAccess: false,
});

const AuthScreen = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string | null } = {};
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Requires: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation (only if email/password auth is used)
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (isSignUp) {
      if (!passwordRegex.test(password)) {
        newErrors.password = 'Min 8 chars, incl. uppercase, number, special char';
        isValid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  async function handleAuthAction(action: () => Promise<any>) {
    setLoading(true);
    try {
      await action();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  async function signInWithEmail() {
    if (!validate()) return;
    await handleAuthAction(() =>
      supabase.auth.signInWithPassword({ email, password })
    );
  }

  async function signUpWithEmail() {
    if (!validate()) return;
    await handleAuthAction(async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // **REPLACE with your actual deep link or website URL for email confirmation**
          emailRedirectTo: 'myfoodtruckapp://login-callback',
        },
      });
      if (error) throw error;
      if (!data.session && data.user) {
        Alert.alert('Check your email!', 'Please verify your email address to complete registration.');
        setIsSignUp(false); // Switch back to sign-in after successful sign-up request
      }
    });
  }

  async function signInWithGoogle() {
    await handleAuthAction(async () => {
      await GoogleSignin.hasPlayServices();
      const signInResponse = await GoogleSignin.signIn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const idToken = (signInResponse as any).idToken; // Workaround for potential type definition issue
      if (!idToken) throw new Error('Google Sign-In failed: No ID token received.');
      if (!idToken) throw new Error('Google Sign-In failed: No ID token received.');

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });
      if (error) throw error;
    });
  }

  async function signInWithApple() {
    if (Platform.OS !== 'ios') return; // Apple Sign-In is only available on iOS
    await handleAuthAction(async () => {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken } = appleAuthRequestResponse;
      if (!identityToken) throw new Error('Apple Sign-In failed: No identity token received.');

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: identityToken,
      });
      if (error) throw error;
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {isSignUp ? 'Create Account' : 'Sign In'}
      </Text>

      {/* Email Input */}
      <TextInput
        label="Email *"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        error={!!errors.email}
        disabled={loading}
      />
      <HelperText type="error" visible={!!errors.email}>
        {errors.email}
      </HelperText>

      {/* Password Input */}
      <TextInput
        label="Password *"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
        error={!!errors.password}
        disabled={loading}
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>

      {/* Confirm Password Input (Sign Up only) */}
      {isSignUp && (
        <>
          <TextInput
            label="Confirm Password *"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            error={!!errors.confirmPassword}
            disabled={loading}
          />
          <HelperText type="error" visible={!!errors.confirmPassword}>
            {errors.confirmPassword}
          </HelperText>
        </>
      )}

      {/* Loading Indicator or Auth Buttons */}
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={styles.button} />
      ) : (
        <>
          <Button
            mode="contained"
            onPress={isSignUp ? signUpWithEmail : signInWithEmail}
            style={styles.button}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>

          <Divider style={styles.divider} />

          {/* Social Auth Buttons */}
          <Button
            mode="outlined"
            onPress={signInWithGoogle}
            style={styles.socialButton}
            icon={() => <Icon name="google" size={20} color={theme.colors.primary} />}
          >
            Sign In with Google
          </Button>

          {Platform.OS === 'ios' && ( // Only show Apple Sign-In on iOS
            <Button
              mode="outlined"
              onPress={signInWithApple}
              style={styles.socialButton}
              icon={() => <Icon name="apple" size={20} color={theme.colors.primary} />}
            >
              Sign In with Apple
            </Button>
          )}

          <Divider style={styles.divider} />

          {/* Switch between Sign In / Sign Up */}
          <Button
            mode="text"
            onPress={() => {
              setIsSignUp(!isSignUp);
              setErrors({}); // Clear errors when switching mode
            }}
            style={styles.switchButton}
            disabled={loading}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 5,
  },
  button: {
    marginTop: 15,
    paddingVertical: 8,
  },
  socialButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 20,
  },
  switchButton: {
    marginTop: 10,
  },
});

export default AuthScreen;