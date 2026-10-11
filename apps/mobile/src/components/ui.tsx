import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, type } from '../lib/theme';

export function Screen({ children, contentStyle }: { children: ReactNode; contentStyle?: StyleProp<ViewStyle> }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function TopBar({ eyebrow = 'CAREEROS / 01', title = 'CAREER HQ', right = 'AK' }: { eyebrow?: string; title?: string; right?: string }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandMark}><Text style={styles.brandMarkText}>C</Text></View>
      <View style={styles.brandCopy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.brandTitle}>{title}</Text>
      </View>
      <View style={styles.avatar}><Text style={styles.avatarText}>{right}</Text></View>
    </View>
  );
}

export function BackBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.backBar}>
      <Pressable onPress={onBack} style={styles.backButton} accessibilityLabel="Go back">
        <Text style={styles.backArrow}>‹</Text>
      </Pressable>
      <Text style={styles.backTitle}>{title}</Text>
    </View>
  );
}

export function SectionLabel({ index, children, action }: { index: string; children: string; action?: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={styles.sectionIndex}>{index}</Text>
      <Text style={styles.sectionLabel}>{children}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

export function Card({ children, style, dark = false }: { children: ReactNode; style?: StyleProp<ViewStyle>; dark?: boolean }) {
  return <View style={[styles.card, dark && styles.darkCard, style]}>{children}</View>;
}

export function Tag({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'orange' | 'dark' | 'muted' }) {
  const toneStyles = {
    blue: [styles.tagBlue, styles.tagBlueText],
    green: [styles.tagGreen, styles.tagGreenText],
    orange: [styles.tagOrange, styles.tagOrangeText],
    dark: [styles.tagDark, styles.tagDarkText],
    muted: [styles.tagMuted, styles.tagMutedText],
  } as const;
  const [background, textStyle] = toneStyles[tone];
  return <Text style={[styles.tag, background, textStyle]}>{children}</Text>;
}

export function PrimaryButton({ children, onPress, compact = false }: { children: string; onPress?: () => void; compact?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, compact && styles.compactButton, pressed && styles.pressed]}>
      <Text style={styles.primaryButtonText}>{children}</Text>
      <Text style={styles.primaryButtonArrow}>→</Text>
    </Pressable>
  );
}

export function OutlineButton({ children, onPress }: { children: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}>
      <Text style={styles.outlineButtonText}>{children}</Text>
    </Pressable>
  );
}

export function ProgressBar({ value, color = colors.blue }: { value: number; color?: string }) {
  return <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(value, 100)}%`, backgroundColor: color }]} /></View>;
}

export function SearchField({ placeholder, ...props }: TextInputProps & { placeholder: string }) {
  return (
    <View style={styles.searchWrap}>
      <Text style={styles.searchIcon}>⌕</Text>
      <TextInput placeholder={placeholder} placeholderTextColor={colors.muted} style={styles.searchInput} {...props} />
      <Text style={styles.searchFilter}>☷</Text>
    </View>
  );
}

export function Metric({ value, label, accent = colors.blue }: { value: string; label: string; accent?: string }) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, { color: accent }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: 18, paddingBottom: 30, gap: 18 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingTop: 8, paddingBottom: 6 },
  brandMark: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue, borderRadius: 3 },
  brandMarkText: { color: colors.white, fontSize: 19, fontWeight: '900' },
  brandCopy: { flex: 1, marginLeft: 9 },
  eyebrow: { ...type.label, color: colors.muted, fontSize: 8 },
  brandTitle: { ...type.heading, color: colors.ink, fontSize: 14, marginTop: 2 },
  avatar: { width: 31, height: 31, borderRadius: 16, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  backBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  backButton: { width: 34, height: 34, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderRadius: 17 },
  backArrow: { color: colors.ink, fontSize: 28, lineHeight: 28, marginTop: -3 },
  backTitle: { ...type.heading, color: colors.ink, fontSize: 16 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 2 },
  sectionIndex: { ...type.label, fontSize: 9, color: colors.blue },
  sectionLabel: { ...type.label, fontSize: 10, color: colors.ink, flex: 1 },
  sectionAction: { ...type.label, color: colors.blue, fontSize: 8 },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 4, padding: 15 },
  darkCard: { backgroundColor: colors.ink, borderColor: colors.ink },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 2, overflow: 'hidden', ...type.label, fontSize: 8 },
  tagBlue: { backgroundColor: colors.blueWash }, tagBlueText: { color: colors.blueDark },
  tagGreen: { backgroundColor: colors.greenWash }, tagGreenText: { color: colors.green },
  tagOrange: { backgroundColor: colors.orangeWash }, tagOrangeText: { color: colors.orange },
  tagDark: { backgroundColor: colors.ink }, tagDarkText: { color: colors.white },
  tagMuted: { backgroundColor: colors.paper }, tagMutedText: { color: colors.muted },
  primaryButton: { minHeight: 48, paddingHorizontal: 14, backgroundColor: colors.blue, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 3, gap: 10 },
  compactButton: { minHeight: 38, paddingHorizontal: 12 },
  primaryButtonText: { ...type.label, color: colors.white, fontSize: 10 },
  primaryButtonArrow: { color: colors.white, fontSize: 17, fontWeight: '800' },
  outlineButton: { minHeight: 44, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderRadius: 3 },
  outlineButtonText: { ...type.label, color: colors.ink, fontSize: 9 },
  pressed: { opacity: 0.74 },
  progressTrack: { height: 5, backgroundColor: colors.paper, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  searchWrap: { height: 44, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 3, backgroundColor: colors.white, paddingHorizontal: 11 },
  searchIcon: { fontSize: 20, color: colors.muted, marginRight: 7, marginTop: -3 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 12, paddingVertical: 0 },
  searchFilter: { color: colors.blue, fontSize: 20 },
  metric: { flex: 1, paddingRight: 8 },
  metricValue: { ...type.display, fontSize: 24 },
  metricLabel: { ...type.label, color: colors.muted, fontSize: 8, marginTop: 3 },
});
