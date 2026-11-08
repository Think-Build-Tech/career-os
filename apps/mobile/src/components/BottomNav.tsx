// apps/mobile/src/components/BottomNav.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StudentNavTab } from '../types/student.types';
import { HomeIcon, JobsIcon, AppsIcon, TacieIcon, ProfileIcon } from './Icons';

interface BottomNavProps {
  currentTab: StudentNavTab;
  onSelectTab: (tab: StudentNavTab) => void;
  pendingSlaCount?: number;
  openDrivesCount?: number;
  pendingOffersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  pendingSlaCount = 0,
  openDrivesCount = 0,
  pendingOffersCount = 0,
}) => {
  const tabs: { id: StudentNavTab; label: string; icon: any; badge?: string; badgeColor?: string }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: HomeIcon,
      badge: pendingSlaCount > 0 ? `${pendingSlaCount}` : undefined,
      badgeColor: '#EF4444',
    },
    {
      id: 'jobs',
      label: 'Drives',
      icon: JobsIcon,
      badge: openDrivesCount > 0 ? `${openDrivesCount}` : undefined,
      badgeColor: '#4F46E5',
    },
    {
      id: 'apps',
      label: 'Tracker',
      icon: AppsIcon,
      badge: pendingOffersCount > 0 ? 'Offer' : undefined,
      badgeColor: '#10B981',
    },
    {
      id: 'tacie',
      label: 'TACIE AI',
      icon: TacieIcon,
      badge: 'AI',
      badgeColor: '#8B5CF6',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: ProfileIcon,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const IconComp = tab.icon;
          const activeColor = '#4F46E5';
          const inactiveColor = '#9CA3AF';

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <IconComp size={22} color={isActive ? activeColor : inactiveColor} />
                {tab.badge && (
                  <View style={[styles.badge, { backgroundColor: tab.badgeColor || '#4F46E5' }]}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, isActive ? styles.activeTabLabel : styles.inactiveTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 6,
    paddingTop: 8,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  activeTabButton: {
    backgroundColor: '#EEF2FF',
  },
  iconContainer: {
    position: 'relative',
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
  activeTabLabel: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  inactiveTabLabel: {
    color: '#6B7280',
  },
});
