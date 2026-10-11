import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, type } from '../lib/theme';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Navigation */}
      <View style={styles.top}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.close,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.closeText}>×</Text>
        </Pressable>

        <Text style={styles.topLabel}>
          CAREEROS / ACCESS
        </Text>

        <View style={styles.topDot} />
      </View>

      {/* Main Content */}
      <View style={styles.body}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>C</Text>
        </View>

        <Text style={styles.kicker}>
          STUDENT ACCESS AUTHENTICATION
        </Text>

        <Text style={styles.title}>
          Welcome back.
        </Text>

        <Text style={styles.subtitle}>
          Access your career workspace and keep moving with intent.
        </Text>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>
              INSTITUTIONAL EMAIL
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="you@university.edu"
              placeholderTextColor="#98A2B3"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              PASSWORD
            </Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••••"
              placeholderTextColor="#98A2B3"
              style={styles.input}
            />
          </View>

          <Pressable
            onPress={() => router.replace('/')}
            style={({ pressed }) => [
              styles.signIn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.signInText}>
              SIGN IN
            </Text>

            <Text style={styles.signInArrow}>
              →
            </Text>
          </Pressable>

          <Pressable>
            <Text style={styles.forgot}>
              FORGOT PASSWORD?
            </Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />

          <Text style={styles.or}>
            OR
          </Text>

          <View style={styles.dividerLine} />
        </View>

        {/* SSO */}
        <Pressable
          onPress={() => router.replace('/')}
          style={({ pressed }) => [
            styles.sso,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.ssoText}>
            CONTINUE WITH INSTITUTION SSO
          </Text>

          <Text style={styles.ssoArrow}>
            ↗
          </Text>
        </Pressable>

        <Text style={styles.legal}>
          By continuing, you agree to the CareerOS Terms and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* ---------------- TOP BAR ---------------- */

  top: {
    height: 58,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,

    backgroundColor: '#FFFFFF',

    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF2',
  },

  close: {
    width: 30,
    height: 30,

    borderWidth: 1,
    borderColor: '#D5DDE5',
    borderRadius: 15,

    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'center',
  },

  closeText: {
    color: '#18212A',
    fontSize: 22,
    lineHeight: 22,
    marginTop: -2,
    fontWeight: '400',
  },

  topLabel: {
    ...type.label,

    flex: 1,

    color: '#687684',
    fontSize: 8,
  },

  topDot: {
    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: colors.blue,
  },

  /* ---------------- BODY ---------------- */

  body: {
    flex: 1,

    paddingHorizontal: 24,
    paddingTop: 50,

    gap: 13,

    backgroundColor: '#FFFFFF',
  },

  /* ---------------- BRAND ---------------- */

  logo: {
    width: 44,
    height: 44,

    backgroundColor: colors.blue,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 4,

    marginBottom: 12,
  },

  logoText: {
    color: '#FFFFFF',

    fontSize: 27,

    fontWeight: '900',
  },

  kicker: {
    ...type.label,

    color: '#2878D7',

    fontSize: 8,
  },

  title: {
    ...type.display,

    color: '#111827',

    fontSize: 35,

    marginTop: 2,
  },

  subtitle: {
    ...type.body,

    color: '#667085',

    fontSize: 12,

    lineHeight: 18,

    maxWidth: 300,
  },

  /* ---------------- FORM ---------------- */

  form: {
    gap: 13,

    marginTop: 13,
  },

  field: {
    gap: 7,
  },

  label: {
    ...type.label,

    color: '#667085',

    fontSize: 8,
  },

  input: {
    height: 47,

    borderWidth: 1,
    borderColor: '#D6DEE6',

    color: '#111827',

    backgroundColor: '#F8FAFC',

    paddingHorizontal: 12,

    borderRadius: 3,

    fontSize: 12,
  },

  /* ---------------- PRIMARY BUTTON ---------------- */

  signIn: {
    height: 48,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 12,

    backgroundColor: colors.blue,

    borderRadius: 3,

    marginTop: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 2,
  },

  signInText: {
    ...type.label,

    color: '#FFFFFF',

    fontSize: 10,
  },

  signInArrow: {
    color: '#FFFFFF',

    fontSize: 17,

    fontWeight: '800',
  },

  forgot: {
    ...type.label,

    color: colors.blue,

    fontSize: 8,

    textAlign: 'center',

    marginTop: 1,
  },

  /* ---------------- DIVIDER ---------------- */

  divider: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    marginVertical: 13,
  },

  dividerLine: {
    flex: 1,

    height: 1,

    backgroundColor: '#E4E9EF',
  },

  or: {
    ...type.label,

    color: '#98A2B3',

    fontSize: 8,
  },

  /* ---------------- SSO ---------------- */

  sso: {
    height: 46,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    borderWidth: 1,
    borderColor: '#D6DEE6',

    borderRadius: 3,

    paddingHorizontal: 13,

    backgroundColor: '#FFFFFF',
  },

  ssoText: {
    ...type.label,

    color: '#28323C',

    fontSize: 9,
  },

  ssoArrow: {
    color: colors.blue,

    fontSize: 18,
  },

  /* ---------------- FOOTER ---------------- */

  legal: {
    ...type.body,

    color: '#98A2B3',

    fontSize: 9,

    lineHeight: 14,

    textAlign: 'center',

    marginTop: 'auto',

    paddingBottom: 20,
  },

  pressed: {
    opacity: 0.65,
  },
});