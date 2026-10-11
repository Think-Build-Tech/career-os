import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackBar, Card, PrimaryButton, ProgressBar, Screen, SectionLabel, Tag } from '../../components/ui';
import { colors, type } from '../../lib/theme';

const roles = {
  'backend-engineer': { role: 'Backend Engineer', company: 'Microsoft', location: 'Hyderabad · Remote', salary: '₹18–24 LPA', match: '98%', team: 'CLOUD + AI', description: 'Build the systems that help millions of people do their best work. You will work across APIs, data, and dependable services with a team that ships with care.' },
  'product-analyst': { role: 'Product Analyst', company: 'Razorpay', location: 'Bengaluru · Hybrid', salary: '₹12–16 LPA', match: '94%', team: 'PRODUCT + DATA', description: 'Turn product questions into decisions. Partner with design, product, and engineering to find the signal inside customer behavior.' },
  'software-engineer': { role: 'Software Engineer', company: 'TCS Digital', location: 'Pune · On-site', salary: '₹9–14 LPA', match: '90%', team: 'PLATFORM', description: 'Help build resilient digital products while growing your engineering fundamentals alongside experienced teams.' },
} as const;

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const job = roles[id as keyof typeof roles] ?? roles['backend-engineer'];

  return (
    <Screen contentStyle={styles.content}>
      <BackBar title="OPPORTUNITY DETAIL" onBack={() => router.back()} />
      <View style={styles.hero}><View style={styles.heroTop}><Tag>{job.match} MATCH</Tag><Text style={styles.code}>OPP-0241</Text></View><Text style={styles.role}>{job.role}</Text><Text style={styles.company}>{job.company} · {job.location}</Text><View style={styles.metaRow}><Tag tone="muted">{job.salary}</Tag><Tag tone="muted">{job.team}</Tag><Text style={styles.posted}>POSTED 2 HOURS AGO</Text></View></View>
      <View style={styles.ctaRow}><View style={styles.ctaCopy}><Text style={styles.ctaLabel}>APPLICATION WINDOW</Text><Text style={styles.ctaValue}>Closes in 12 days</Text></View><PrimaryButton compact onPress={() => router.push('/auth')}>APPLY NOW</PrimaryButton></View>
      <SectionLabel index="01" action="ROLE BRIEF">THE OPPORTUNITY</SectionLabel>
      <Card><Text style={styles.paragraph}>{job.description}</Text><View style={styles.quote}><Text style={styles.quoteMark}>“</Text><Text style={styles.quoteText}>We value clarity, curiosity, and the courage to make the system better.</Text></View></Card>
      <SectionLabel index="02" action="YOUR MATCH">READINESS SIGNAL</SectionLabel>
      <Card><View style={styles.readinessTop}><View><Text style={styles.readinessScore}>{job.match}</Text><Text style={styles.muted}>profile-to-role alignment</Text></View><Tag tone="green">STRONG FIT</Tag></View><ProgressBar value={98} color={colors.blue} /><View style={styles.signalRows}><Signal label="REQUIRED SKILLS" value="7 / 7 matched" /><Signal label="EXPERIENCE BAND" value="Within range" /><Signal label="LOCATION" value="Preference matched" /></View></Card>
      <SectionLabel index="03">WHAT YOU WILL DO</SectionLabel>
      <Card style={styles.listCard}><Bullet text="Design and ship reliable backend services." /><Bullet text="Work with product and engineering partners." /><Bullet text="Raise the quality bar through reviews and tests." /><Bullet text="Learn from production data and customer feedback." /></Card>
      <SectionLabel index="04">HIRING PROCESS</SectionLabel>
      <Card><Step number="01" title="Recruiter screen" detail="30 minutes · completed" done /><Step number="02" title="Technical interview" detail="60 minutes · next" active /><Step number="03" title="Team conversation" detail="45 minutes" /><Step number="04" title="Offer decision" detail="Final stage" /></Card>
      <Pressable onPress={() => router.push('/auth')}><Text style={styles.bottomLink}>SAVE THIS OPPORTUNITY +</Text></Pressable>
    </Screen>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return <View style={styles.signalRow}><Text style={styles.signalLabel}>{label}</Text><Text style={styles.signalValue}>{value} ✓</Text></View>;
}

function Bullet({ text }: { text: string }) {
  return <View style={styles.bulletRow}><Text style={styles.bullet}>■</Text><Text style={styles.bulletText}>{text}</Text></View>;
}

function Step({ number, title, detail, done = false, active = false }: { number: string; title: string; detail: string; done?: boolean; active?: boolean }) {
  return <View style={styles.step}><View style={[styles.stepNumber, done && styles.stepDone, active && styles.stepActive]}><Text style={[styles.stepNumberText, (done || active) && styles.stepNumberTextActive]}>{done ? '✓' : number}</Text></View><View style={styles.stepCopy}><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepDetail}>{detail}</Text></View><Text style={[styles.stepStatus, done && styles.stepStatusDone, active && styles.stepStatusActive]}>{done ? 'DONE' : active ? 'NEXT' : 'UPCOMING'}</Text></View>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 38 },
  hero: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 4, padding: 16, gap: 9 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  code: { ...type.label, color: colors.muted, fontSize: 8 },
  role: { ...type.display, color: colors.ink, fontSize: 29, lineHeight: 31, marginTop: 3 },
  company: { ...type.body, color: colors.muted, fontSize: 12 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 11, marginTop: 4 },
  posted: { ...type.label, color: colors.muted, fontSize: 8, marginLeft: 'auto' },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ctaCopy: { flex: 1 },
  ctaLabel: { ...type.label, color: colors.muted, fontSize: 8 },
  ctaValue: { ...type.heading, color: colors.ink, fontSize: 12, marginTop: 4 },
  paragraph: { ...type.body, color: colors.inkSoft, fontSize: 12, lineHeight: 19 },
  quote: { flexDirection: 'row', gap: 9, backgroundColor: colors.blueWash, padding: 11, marginTop: 15, borderLeftWidth: 3, borderLeftColor: colors.blue },
  quoteMark: { color: colors.blue, fontSize: 25, lineHeight: 25, fontWeight: '900' },
  quoteText: { flex: 1, ...type.heading, color: colors.blueDark, fontSize: 11, lineHeight: 17 },
  readinessTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  readinessScore: { ...type.display, color: colors.blue, fontSize: 35 },
  muted: { ...type.body, color: colors.muted, fontSize: 10 },
  signalRows: { marginTop: 12 },
  signalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderTopWidth: 1, borderTopColor: colors.line },
  signalLabel: { ...type.label, color: colors.muted, fontSize: 8 },
  signalValue: { ...type.body, color: colors.green, fontSize: 10 },
  listCard: { gap: 14 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bullet: { color: colors.blue, fontSize: 9, marginTop: 3 },
  bulletText: { flex: 1, ...type.body, color: colors.inkSoft, fontSize: 11, lineHeight: 16 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 55, borderBottomWidth: 1, borderBottomColor: colors.line },
  stepNumber: { width: 28, height: 28, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', borderRadius: 3 },
  stepDone: { backgroundColor: colors.greenWash, borderColor: colors.green },
  stepActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  stepNumberText: { ...type.label, color: colors.muted, fontSize: 8 },
  stepNumberTextActive: { color: colors.white },
  stepCopy: { flex: 1 },
  stepTitle: { ...type.heading, color: colors.ink, fontSize: 11 },
  stepDetail: { ...type.body, color: colors.muted, fontSize: 9, marginTop: 3 },
  stepStatus: { ...type.label, color: colors.muted, fontSize: 7 },
  stepStatusDone: { color: colors.green },
  stepStatusActive: { color: colors.blue },
  bottomLink: { ...type.label, color: colors.blue, fontSize: 9, textAlign: 'center', paddingVertical: 6 },
});
