import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { AuthProvider, useAuth, LoginScreen } from './src/modules/auth';
import { ClassroomsScreen } from './src/modules/classrooms';
import { CoursesScreen } from './src/modules/courses';
import { AssignmentsScreen } from './src/modules/assignments';
import { TabBar } from './src/components/common';
import { ActiveTab } from './src/types';

const TABS: ActiveTab[] = ['classrooms', 'courses', 'assignments'];

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('classrooms');
  const [selectedCourseForAssignment, setSelectedCourseForAssignment] = useState<string | undefined>(undefined);
  const { classrooms, courses, assignments, themeColors, isDarkMode } = useApp();
  const { width } = useWindowDimensions();

  const scrollViewRef = useRef<any>(null);

  // Navegar a asignaciones desde la tarjeta de un curso
  const handleNavigateToAssignments = (courseId: string) => {
    setSelectedCourseForAssignment(courseId);
    setActiveTab('assignments');
    scrollViewRef.current?.scrollTo({ x: 2 * width, animated: true });
  };

  // Cuando se pulsa en el menú inferior
  const handleTabPress = (tab: ActiveTab) => {
    setActiveTab(tab);
    const index = TABS.indexOf(tab);
    if (index !== -1) {
      scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    }
  };

  // Cuando se desliza el dedo horizontalmente
  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / width);
    if (pageIndex >= 0 && pageIndex < TABS.length) {
      setActiveTab(TABS[pageIndex]);
    }
  };

  // Limitador superior seguro
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

      {/* Contenedor deslizante entre pestañas */}
      <View
        style={[
          styles.contentContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          style={styles.pagerScrollView}
        >
          {/* Pantalla 1: Aulas */}
          <View style={{ width, height: '100%' }}>
            <ClassroomsScreen />
          </View>

          {/* Pantalla 2: Cursos */}
          <View style={{ width, height: '100%' }}>
            <CoursesScreen onNavigateToAssignments={handleNavigateToAssignments} />
          </View>

          {/* Pantalla 3: Asignaciones */}
          <View style={{ width, height: '100%' }}>
            <AssignmentsScreen initialCourseId={selectedCourseForAssignment} />
          </View>
        </ScrollView>
      </View>

      {/* Menú inferior Granate */}
      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabPress}
        classroomCount={classrooms.length}
        courseCount={courses.length}
        assignmentCount={assignments.length}
      />
    </SafeAreaView>
  );
};

// Componente que decide si mostrar Login o la App según la sesión
const RootNavigator: React.FC = () => {
  const { user, isGuest, isLoading } = useAuth();
  const { themeColors } = useApp();

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  // Si no ha iniciado sesión ni ha entrado como invitado, muestra pantalla de Login
  if (!user && !isGuest) {
    return <LoginScreen />;
  }

  return <MainApp />;
};

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
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
  pagerScrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
