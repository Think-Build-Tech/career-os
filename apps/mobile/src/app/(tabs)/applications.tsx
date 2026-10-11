import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, ProgressBar, Screen, SectionLabel, Tag, TopBar } from '../../components/ui';
import { colors, type } from '../../lib/theme';

const applications = [
  { company: 'Microsoft', role: 'Backend Engineer', stage: 'RECRUITER SCREEN', progress: 25, tone: 'blue' as const, date: 'Applied Oct 14' },
  { company: 'Razorpay', role: 'Backend Engineer', stage: 'TECHNICAL ROUND', progress: 52, tone: 'green' as const, date: 'Applied Oct 10' },
  { company: 'TCS Digital', role: 'Graduate Software Engineer', stage: 'OFFER DISCUSSION', progress: 86, tone: 'orange' as const, date: 'Applied Sep 28' },
];

export default function ApplicationsScreen() {
  return (
    <Screen>
      <TopBar eyebrow="CAREEROS / 03" title="APPLICATIONS" />
      <View style={styles.heading}><Text style={styles.kicker}>YOUR PIPELINE</Text><Text style={styles.title}>Move with intent.</Text><Text style={styles.body}>Every application, one clear next action.</Text></View>
      <Card dark style={styles.summary}><View><Text style={styles.summaryLabel}>ACTIVE APPLICATIONS</Text><Text style={styles.summaryNumber}>04</Text></View><View style={styles.summaryRight}><Text style={styles.summaryLabel}>NEXT MILESTONE</Text><Text style={styles.summaryNext}>Technical round</Text><Text style={styles.summarySub}>Razorpay · due in 2 days</Text></View></Card>
      <SectionLabel index="01" action="SEE ARCHIVE">ACTIVE APPLICATIONS</SectionLabel>
      {applications.map((application) => (
        <Pressable key={application.company} onPress={() => router.push({ pathname: '/opportunities/[id]', params: { id: application.role === 'Backend Engineer' ? 'backend-engineer' : 'product-analyst' } })}>
          <Card style={styles.application}>
            <View style={styles.applicationTop}><View style={styles.companyMark}><Text style={styles.companyMarkText}>{application.company.slice(0, 1)}</Text></View><View style={styles.applicationCopy}><Text style={styles.companyName}>{application.company}</Text><Text style={styles.role}>{application.role}</Text></View><Tag tone={application.tone}>{application.stage}</Tag></View>
            <View style={styles.progressMeta}><Text style={styles.progressText}>{application.date}</Text><Text style={styles.progressPercent}>{application.progress}%</Text></View>
            <ProgressBar value={application.progress} color={application.tone === 'green' ? colors.green : application.tone === 'orange' ? colors.orange : colors.blue} />
            <View style={styles.applicationFooter}><Text style={styles.nextAction}>{application.progress > 75 ? 'Prepare for final conversation' : 'View next action'}</Text><Text style={styles.arrow}>→</Text></View>
          </Card>
        </Pressable>
      ))}
      <SectionLabel index="02">PIPELINE HEALTH</SectionLabel>
      <Card><View style={styles.healthRow}><Text style={styles.healthLabel}>RESPONSE RATE</Text><Text style={styles.healthValue}>67%</Text></View><ProgressBar value={67} color={colors.green} /><Text style={styles.healthCaption}>Up 12% from your previous cycle.</Text></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 6 },
  kicker: { ...type.label, color: colors.blue, fontSize: 8 },
  title: { ...type.display, color: colors.ink, fontSize: 28 },
  body: { ...type.body, color: colors.muted, fontSize: 12 },
  summary: { flexDirection: 'row', justifyContent: 'space-between', minHeight: 126 },
  summaryLabel: { ...type.label, color: '#88A0AF', fontSize: 8 },
  summaryNumber: { ...type.display, color: colors.white, fontSize: 46, lineHeight: 52, marginTop: 5 },
  summaryRight: { justifyContent: 'flex-end', alignItems: 'flex-end' },
  summaryNext: { ...type.heading, color: colors.white, fontSize: 14, marginTop: 7 },
  summarySub: { ...type.body, color: '#A9BBC5', fontSize: 10, marginTop: 3 },
  application: { gap: 11 },
  applicationTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  companyMark: { width: 34, height: 34, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', borderRadius: 3 },
  companyMarkText: { color: colors.white, fontWeight: '900', fontSize: 17 },
  applicationCopy: { flex: 1 },
  companyName: { ...type.heading, color: colors.ink, fontSize: 13 },
  role: { ...type.body, color: colors.muted, fontSize: 10, marginTop: 2 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { ...type.body, color: colors.muted, fontSize: 9 },
  progressPercent: { ...type.label, color: colors.ink, fontSize: 9 },
  applicationFooter: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 9, flexDirection: 'row', justifyContent: 'space-between' },
  nextAction: { ...type.label, color: colors.blue, fontSize: 8 },
  arrow: { color: colors.blue, fontSize: 16 },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  healthLabel: { ...type.label, color: colors.muted, fontSize: 8 },
  healthValue: { ...type.heading, color: colors.green, fontSize: 17 },
  healthCaption: { ...type.body, color: colors.muted, fontSize: 10, marginTop: 8 },
});
