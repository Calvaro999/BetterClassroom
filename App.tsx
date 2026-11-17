import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { ClassroomsScreen } from './src/modules/classrooms';
import { CoursesScreen } from './src/modules/courses';
import { AssignmentsScreen } from './src/modules/assignments';
import { TabBar } from './src/components/common';
import { ActiveTab } from './src/types';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('classrooms');
  const [selectedCourseForAssignment, setSelectedCourseForAssignment] = useState<string | undefined>(undefined);
  const { classrooms, courses, assignments, themeColors, isDarkMode } = useApp();

  const handleNavigateToAssignments = (courseId: string) => {
    setSelectedCourseForAssignment(courseId);
    setActiveTab('assignments');
  };

  // Limitador superior seguro para evitar que la barra de estado corte el contenido
  const topSafePadding =
    Platform.OS === 'android'
      ? (RNStatusBar.currentHeight ? RNStatusBar.currentHeight + 6 : 36)
      : Platform.OS === 'ios'
      ? 44
      : 10;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: themeColors.surface,
          paddingTop: topSafePadding,
        },
      ]}
    >
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <View
        style={[
          styles.contentContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        {activeTab === 'classrooms' && <ClassroomsScreen />}
        {activeTab === 'courses' && (
          <CoursesScreen onNavigateToAssignments={handleNavigateToAssignments} />
        )}
        {activeTab === 'assignments' && (
          <AssignmentsScreen initialCourseId={selectedCourseForAssignment} />
        )}
      </View>

      <TabBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
        classroomCount={classrooms.length}
        courseCount={courses.length}
        assignmentCount={assignments.length}
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
