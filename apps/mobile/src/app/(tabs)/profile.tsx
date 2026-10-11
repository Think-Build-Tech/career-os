import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, OutlineButton, Screen, SectionLabel, TopBar } from '../../components/ui';
import { colors, type } from '../../lib/theme';

const links = [
  ['01', 'Account & security', 'Manage your access and preferences'],
  ['02', 'Notifications', 'Your alerts are set to focused'],
  ['03', 'Help center', 'Get unstuck, fast'],
];

export default function ProfileScreen() {
  return (
    <Screen>
      <TopBar eyebrow="CAREEROS / 05" title="PROFILE" />
      <View style={styles.profileHeader}><View style={styles.avatarLarge}><Text style={styles.avatarLargeText}>AK</Text></View><View style={styles.profileCopy}><Text style={styles.name}>Atharva Kulkarni</Text><Text style={styles.email}>atharva.k@example.com</Text><Text style={styles.status}>● ACTIVE SINCE OCT 2025</Text></View></View>
      <Card style={styles.plan}><View><Text style={styles.planLabel}>CAREEROS PLAN</Text><Text style={styles.planName}>Builder</Text></View><Text style={styles.planArrow}>↗</Text></Card>
      <SectionLabel index="01">SETTINGS</SectionLabel>
      <Card style={styles.menuCard}>{links.map(([index, title, subtitle]) => <Pressable key={index} style={styles.menuRow}><Text style={styles.menuIndex}>{index}</Text><View style={styles.menuCopy}><Text style={styles.menuTitle}>{title}</Text><Text style={styles.menuSub}>{subtitle}</Text></View><Text style={styles.menuArrow}>›</Text></Pressable>)}</Card>
      <SectionLabel index="02">ACCESS</SectionLabel>
      <OutlineButton onPress={() => router.push('/auth')}>VIEW SIGN-IN SCREEN</OutlineButton>
      <Text style={styles.version}>CAREEROS MOBILE · v0.1.0</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 10 },
  avatarLarge: { width: 65, height: 65, borderRadius: 33, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  avatarLargeText: { color: colors.white, fontSize: 20, fontWeight: '900' },
  profileCopy: { flex: 1, gap: 3 },
  name: { ...type.heading, color: colors.ink, fontSize: 20 },
  email: { ...type.body, color: colors.muted, fontSize: 11 },
  status: { ...type.label, color: colors.green, fontSize: 8, marginTop: 5 },
  plan: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.blueWash, borderColor: '#C3E2FA' },
  planLabel: { ...type.label, color: colors.blueDark, fontSize: 8 },
  planName: { ...type.heading, color: colors.ink, fontSize: 18, marginTop: 5 },
  planArrow: { color: colors.blue, fontSize: 22 },
  menuCard: { paddingVertical: 0 },
  menuRow: { minHeight: 65, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1, borderBottomColor: colors.line },
  menuRowLast: { borderBottomWidth: 0 },
  menuIndex: { ...type.label, color: colors.blue, fontSize: 9, width: 21 },
  menuCopy: { flex: 1 },
  menuTitle: { ...type.heading, color: colors.ink, fontSize: 12 },
  menuSub: { ...type.body, color: colors.muted, fontSize: 10, marginTop: 3 },
  menuArrow: { color: colors.muted, fontSize: 24, fontWeight: '300' },
  version: { ...type.label, color: colors.muted, fontSize: 8, textAlign: 'center', marginTop: 3 },
});
