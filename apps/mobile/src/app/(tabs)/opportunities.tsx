import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Screen, SearchField, SectionLabel, Tag, TopBar } from '../../components/ui';
import { colors, type } from '../../lib/theme';

const jobs = [
  { id: 'backend-engineer', role: 'Backend Engineer', company: 'Microsoft', location: 'Hyderabad · Remote', match: '98%', salary: '₹18–24 LPA', tone: 'blue' as const, posted: '2h ago' },
  { id: 'product-analyst', role: 'Product Analyst', company: 'Razorpay', location: 'Bengaluru · Hybrid', match: '94%', salary: '₹12–16 LPA', tone: 'green' as const, posted: '5h ago' },
  { id: 'software-engineer', role: 'Software Engineer', company: 'TCS Digital', location: 'Pune · On-site', match: '90%', salary: '₹9–14 LPA', tone: 'orange' as const, posted: '1d ago' },
];

export default function OpportunitiesScreen() {
  return (
    <Screen>
      <TopBar eyebrow="CAREEROS / 02" title="OPPORTUNITIES" />
      <View style={styles.intro}><Text style={styles.kicker}>THE OPEN MARKET</Text><Text style={styles.title}>Find your next room to grow.</Text><Text style={styles.body}>Roles selected around your skills, goals, and readiness.</Text></View>
      <SearchField placeholder="Search role, skill, or company" />
      <View style={styles.filters}><Tag>ALL ROLES</Tag><Tag tone="muted">REMOTE</Tag><Tag tone="muted">MATCH &gt; 90%</Tag><Text style={styles.filterMore}>FILTERS +</Text></View>

      <SectionLabel index="01" action={`${jobs.length} MATCHES`}>CURATED FOR YOU</SectionLabel>
      {jobs.map((job) => (
        <Pressable key={job.id} onPress={() => router.push({ pathname: '/opportunities/[id]', params: { id: job.id } })}>
          <Card style={styles.jobCard}>
            <View style={styles.jobHeader}><Tag tone={job.tone}>{job.match} MATCH</Tag><Text style={styles.posted}>{job.posted}</Text></View>
            <Text style={styles.role}>{job.role}</Text>
            <Text style={styles.company}>{job.company} · {job.location}</Text>
            <View style={styles.detailRow}><Tag tone="muted">FULL-TIME</Tag><Tag tone="muted">{job.salary}</Tag><Text style={styles.arrow}>↗</Text></View>
          </Card>
        </Pressable>
      ))}
      <View style={styles.notice}><Text style={styles.noticeMark}>i</Text><Text style={styles.noticeText}>Your match score is calculated from your passport, preferences, and recent activity.</Text></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 6, paddingVertical: 4 },
  kicker: { ...type.label, color: colors.blue, fontSize: 8 },
  title: { ...type.display, color: colors.ink, fontSize: 27, lineHeight: 30 },
  body: { ...type.body, color: colors.muted, fontSize: 12, lineHeight: 17 },
  filters: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  filterMore: { ...type.label, color: colors.blue, fontSize: 8, marginLeft: 'auto' },
  jobCard: { gap: 8 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  posted: { ...type.body, color: colors.muted, fontSize: 10 },
  role: { ...type.heading, color: colors.ink, fontSize: 18, marginTop: 1 },
  company: { ...type.body, color: colors.muted, fontSize: 11 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, marginTop: 2 },
  arrow: { marginLeft: 'auto', color: colors.blue, fontSize: 19, fontWeight: '800' },
  notice: { flexDirection: 'row', gap: 9, padding: 12, backgroundColor: colors.blueWash, borderRadius: 3 },
  noticeMark: { width: 17, height: 17, textAlign: 'center', lineHeight: 17, borderRadius: 9, color: colors.white, backgroundColor: colors.blue, fontWeight: '900', fontSize: 11 },
  noticeText: { flex: 1, ...type.body, color: colors.blueDark, fontSize: 10, lineHeight: 15 },
});
