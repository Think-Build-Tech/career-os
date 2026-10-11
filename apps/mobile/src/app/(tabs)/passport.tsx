import { StyleSheet, Text, View } from 'react-native';
import { Card, OutlineButton, ProgressBar, Screen, SectionLabel, Tag, TopBar } from '../../components/ui';
import { colors, type } from '../../lib/theme';

export default function PassportScreen() {
  return (
    <Screen>
      <TopBar eyebrow="CAREEROS / 04" title="PASSPORT" />
      <View style={styles.heading}><Text style={styles.kicker}>YOUR CAREER IDENTITY</Text><Text style={styles.title}>Show the signal.</Text><Text style={styles.body}>One living profile for every opportunity you pursue.</Text></View>
      <Card dark style={styles.passportCard}><View style={styles.passportTop}><View style={styles.passportAvatar}><Text style={styles.passportInitials}>AK</Text></View><View><Text style={styles.passportName}>Atharva Kulkarni</Text><Text style={styles.passportRole}>Backend Engineer · Pune, IN</Text></View></View><View style={styles.passportRule} /><Text style={styles.passportQuote}>“Building reliable systems for people who are going somewhere.”</Text><View style={styles.passportFooter}><Text style={styles.passportMeta}>LAST UPDATED 2 DAYS AGO</Text><Text style={styles.passportMeta}>PUBLIC ↗</Text></View></Card>
      <SectionLabel index="01" action="EDIT">PROFILE READINESS</SectionLabel>
      <Card><View style={styles.readinessHead}><View><Text style={styles.readinessValue}>94%</Text><Text style={styles.readinessText}>Strong signal for engineering roles.</Text></View><Tag tone="green">READY TO APPLY</Tag></View><ProgressBar value={94} color={colors.green} /><View style={styles.readinessGrid}><Text style={styles.check}>✓ Skills</Text><Text style={styles.check}>✓ Experience</Text><Text style={styles.check}>✓ Projects</Text><Text style={styles.pending}>○ Preferences</Text></View></Card>
      <SectionLabel index="02">CORE SIGNALS</SectionLabel>
      <Card><Text style={styles.cardHeading}>Skills that travel with you.</Text><View style={styles.tagGrid}><Tag>PYTHON</Tag><Tag>NODE.JS</Tag><Tag>POSTGRESQL</Tag><Tag tone="muted">AWS</Tag><Tag tone="muted">SYSTEM DESIGN</Tag><Tag tone="muted">REST APIS</Tag></View></Card>
      <OutlineButton>PREVIEW PUBLIC PASSPORT</OutlineButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 6 },
  kicker: { ...type.label, color: colors.blue, fontSize: 8 },
  title: { ...type.display, color: colors.ink, fontSize: 28 },
  body: { ...type.body, color: colors.muted, fontSize: 12 },
  passportCard: { gap: 15 },
  passportTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  passportAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  passportInitials: { color: colors.white, fontSize: 15, fontWeight: '900' },
  passportName: { ...type.heading, color: colors.white, fontSize: 16 },
  passportRole: { ...type.body, color: '#A9BBC5', fontSize: 10, marginTop: 3 },
  passportRule: { height: 1, backgroundColor: '#34434D' },
  passportQuote: { ...type.body, color: '#D5E0E5', fontSize: 12, lineHeight: 18 },
  passportFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  passportMeta: { ...type.label, color: '#88A0AF', fontSize: 8 },
  readinessHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  readinessValue: { ...type.display, color: colors.green, fontSize: 32 },
  readinessText: { ...type.body, color: colors.muted, fontSize: 10, marginTop: 2 },
  readinessGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 13 },
  check: { ...type.body, color: colors.green, fontSize: 10, width: '46%' },
  pending: { ...type.body, color: colors.muted, fontSize: 10, width: '46%' },
  cardHeading: { ...type.heading, color: colors.ink, fontSize: 15, marginBottom: 12 },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
