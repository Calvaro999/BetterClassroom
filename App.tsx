import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { ClassroomsScreen } from './src/modules/classrooms';
import { CoursesScreen } from './src/modules/courses';
import { AssignmentsScreen } from './src/modules/assignments';
import { TabBar } from './src/components/common';
import { ActiveTab } from './src/types';
import { colors } from './src/theme';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('classrooms');
  const [selectedCourseForAssignment, setSelectedCourseForAssignment] = useState<string | undefined>(undefined);
  const { classrooms, courses, assignments } = useApp();

  const handleNavigateToAssignments = (courseId: string) => {
    setSelectedCourseForAssignment(courseId);
    setActiveTab('assignments');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.contentContainer}>
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
    backgroundColor: colors.surface,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
