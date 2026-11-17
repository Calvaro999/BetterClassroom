import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
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
  const { themeColors } = useApp();

  const tabs: { key: ActiveTab; label: string; icon: string; count: number }[] = [
    { key: 'classrooms', label: 'Aulas', icon: '🏛️', count: classroomCount },
    { key: 'courses', label: 'Cursos', icon: '📚', count: courseCount },
    { key: 'assignments', label: 'Asignaciones', icon: '🪑', count: assignmentCount },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.surface,
          borderTopColor: themeColors.border,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              isActive
                ? { backgroundColor: themeColors.primaryLight }
                : null,
            ]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text
              style={[
                styles.label,
                { color: isActive ? themeColors.primaryDark : themeColors.textMuted },
                isActive ? styles.labelActive : null,
              ]}
            >
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View
                style={[
                  styles.pill,
                  {
                    backgroundColor: isActive
                      ? themeColors.primary
                      : themeColors.surfaceVariant,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    {
                      color: isActive ? '#FFFFFF' : themeColors.textMuted,
                    },
                  ]}
                >
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
    borderTopWidth: 1,
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
    borderRadius: 10,
    position: 'relative',
  },
  icon: {
    fontSize: 18,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '700',
  },
  pill: {
    position: 'absolute',
    top: 2,
    right: 14,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
