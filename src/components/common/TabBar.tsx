import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
            activeOpacity={0.75}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text
              style={[
                styles.label,
                isActive ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View style={[styles.pill, isActive ? styles.pillActive : null]}>
                <Text style={styles.pillText}>{tab.count}</Text>
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
    backgroundColor: '#881337', // Color Granate elegante en toda la barra inferior
    borderTopWidth: 1,
    borderTopColor: '#701A75',
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 12,
    position: 'relative',
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)', // Realce elegante sobre el fondo granate
  },
  icon: {
    fontSize: 19,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
  },
  labelInactive: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pill: {
    position: 'absolute',
    top: 2,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: '#FFFFFF',
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#881337',
  },
});
