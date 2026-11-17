import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';
import { ActiveTab } from '../../types';

interface TabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  classroomCount: number;
  courseCount: number;
  assignmentCount: number;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  classroomCount,
  courseCount,
  assignmentCount,
}) => {
  const tabs: { key: ActiveTab; label: string; icon: string; count: number }[] = [
    { key: 'classrooms', label: 'Aulas', icon: '🏛️', count: classroomCount },
    { key: 'courses', label: 'Cursos', icon: '📚', count: courseCount },
    { key: 'assignments', label: 'Asignaciones', icon: '🪑', count: assignmentCount },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive ? styles.tabActive : null]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={[styles.label, isActive ? styles.labelActive : null]}>
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View style={[styles.pill, isActive ? styles.pillActive : null]}>
                <Text style={[styles.pillText, isActive ? styles.pillTextActive : null]}>
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: colors.primaryLight,
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  pill: {
    position: 'absolute',
    top: 2,
    right: 14,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  pillText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
  },
  pillTextActive: {
    color: colors.white,
  },
});
