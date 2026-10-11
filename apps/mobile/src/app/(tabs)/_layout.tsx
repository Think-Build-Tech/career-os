import { Tabs } from 'expo-router';
import { colors, type } from '../../lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 68,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: colors.line,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: { ...type.label, fontSize: 8 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'HOME', tabBarLabel: 'HOME' }} />
      <Tabs.Screen name="opportunities" options={{ title: 'OPPS', tabBarLabel: 'OPPS' }} />
      <Tabs.Screen name="applications" options={{ title: 'PIPELINE', tabBarLabel: 'PIPELINE' }} />
      <Tabs.Screen name="passport" options={{ title: 'PASSPORT', tabBarLabel: 'PASSPORT' }} />
      <Tabs.Screen name="profile" options={{ title: 'PROFILE', tabBarLabel: 'PROFILE' }} />
    </Tabs>
  );
}
