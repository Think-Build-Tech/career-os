import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Metric, PrimaryButton, ProgressBar, Screen, SectionLabel, Tag, TopBar } from '../../components/ui';
import { colors, type } from '../../lib/theme';

export default function HomeScreen() {
  return (
    <Screen>
      <TopBar />

      <View style={styles.hero}>
        <Text style={styles.heroKicker}>01 / YOUR CAREER OPERATING SYSTEM</Text>
        <Text style={styles.heroTitle}>MAKE YOUR NEXT MOVE.</Text>
        <Text style={styles.heroBody}>A sharper way to discover, prepare for, and land the right opportunity.</Text>
        <View style={styles.heroRule} />
        <View style={styles.heroMeta}><Text style={styles.heroMetaText}>PROFILE READINESS</Text><Text style={styles.heroMetaValue}>94%</Text></View>
        <ProgressBar value={94} color={colors.blue} />
      </View>

      <View style={styles.metricsRow}>
        <Metric value="06" label="INTERVIEWS" />
        <Metric value="12" label="SAVED ROLES" accent={colors.ink} />
        <Metric value="03" label="ACTIVE APPS" accent={colors.green} />
      </View>

      <SectionLabel index="02" action="SEE ALL">RECOMMENDED FOR YOU</SectionLabel>
      <Pressable onPress={() => router.push({ pathname: '/opportunities/[id]', params: { id: 'backend-engineer' } })}>
        <Card style={styles.recommendation}>
          <View style={styles.cardTopLine}><Tag>98% MATCH</Tag><Text style={styles.cardCode}>OPP-0241</Text></View>
          <Text style={styles.jobTitle}>Backend Engineer</Text>
          <Text style={styles.company}>Microsoft · Hyderabad / Remote</Text>
          <View style={styles.tagRow}><Tag tone="muted">FULL-TIME</Tag><Tag tone="muted">3–5 YEARS</Tag><Tag tone="muted">₹18–24 LPA</Tag></View>
          <View style={styles.cardFooter}><Text style={styles.footerHint}>Your profile is ready for this role.</Text><Text style={styles.openArrow}>↗</Text></View>
        </Card>
      </Pressable>

      <SectionLabel index="03">APPLICATION MOMENTUM</SectionLabel>
      <Card>
        <View style={styles.momentumHead}><View><Text style={styles.momentumTitle}>Keep the pipeline moving.</Text><Text style={styles.momentumBody}>You have 2 next actions this week.</Text></View><Text style={styles.momentumNumber}>02</Text></View>
        <View style={styles.actionRow}><View style={styles.actionNumber}><Text style={styles.actionNumberText}>01</Text></View><View style={styles.actionCopy}><Text style={styles.actionTitle}>Complete technical assessment</Text><Text style={styles.actionSub}>Razorpay · Backend Engineer</Text></View><Text style={styles.actionArrow}>→</Text></View>
        <View style={styles.actionRow}><View style={styles.actionNumber}><Text style={styles.actionNumberText}>02</Text></View><View style={styles.actionCopy}><Text style={styles.actionTitle}>Send a follow-up note</Text><Text style={styles.actionSub}>Microsoft · Recruiter screen</Text></View><Text style={styles.actionArrow}>→</Text></View>
      </Card>

      <PrimaryButton onPress={() => router.push('/opportunities')}>EXPLORE OPPORTUNITIES</PrimaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.ink, padding: 18, borderRadius: 4, gap: 12 },
  heroKicker: { ...type.label, color: '#8FA5B5', fontSize: 8 },
  heroTitle: { ...type.display, color: colors.white, fontSize: 29, lineHeight: 31, maxWidth: 260 },
  heroBody: { ...type.body, color: '#C3D0D8', fontSize: 12, lineHeight: 18, maxWidth: 280 },
  heroRule: { height: 1, backgroundColor: '#31404B', marginTop: 6 },
  heroMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  heroMetaText: { ...type.label, color: '#8FA5B5', fontSize: 8 },
  heroMetaValue: { ...type.heading, color: '#65B7FF', fontSize: 14 },
  metricsRow: { flexDirection: 'row', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 14, borderRadius: 4 },
  cardTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardCode: { ...type.label, color: colors.muted, fontSize: 8 },
  recommendation: { gap: 9 },
  jobTitle: { ...type.heading, color: colors.ink, fontSize: 22, marginTop: 2 },
  company: { ...type.body, color: colors.muted, fontSize: 11 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 3 },
  cardFooter: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, marginTop: 2, flexDirection: 'row', justifyContent: 'space-between' },
  footerHint: { ...type.body, color: colors.muted, fontSize: 10 },
  openArrow: { color: colors.blue, fontSize: 17, fontWeight: '800' },
  momentumHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 13 },
  momentumTitle: { ...type.heading, color: colors.ink, fontSize: 16 },
  momentumBody: { ...type.body, color: colors.muted, fontSize: 11, marginTop: 4 },
  momentumNumber: { ...type.display, color: colors.blue, fontSize: 30 },
  actionRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.line, paddingVertical: 12, gap: 10 },
  actionNumber: { width: 27, height: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blueWash, borderRadius: 3 },
  actionNumberText: { ...type.label, color: colors.blueDark, fontSize: 8 },
  actionCopy: { flex: 1 },
  actionTitle: { ...type.heading, color: colors.ink, fontSize: 11 },
  actionSub: { ...type.body, color: colors.muted, fontSize: 9, marginTop: 2 },
  actionArrow: { color: colors.blue, fontSize: 17 },
});
