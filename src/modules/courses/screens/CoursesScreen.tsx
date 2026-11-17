import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Alert,
} from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Course, ActiveTab } from '../../../types';
import { colors } from '../../../theme';
import { Header, Button } from '../../../components/common';
import { CourseCard } from '../components/CourseCard';
import { CourseModal } from '../components/CourseModal';

interface CoursesScreenProps {
  onNavigateToAssignments?: (courseId: string) => void;
}

export const CoursesScreen: React.FC<CoursesScreenProps> = ({
  onNavigateToAssignments,
}) => {
  const { courses, classrooms, addCourse, deleteCourse } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleDelete = (course: Course) => {
    Alert.alert(
      'Eliminar Curso',
      `¿Deseas eliminar el curso "${course.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteCourse(course.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Cursos y Clases"
        subtitle={`${courses.length} materias registradas`}
        rightActionText="+ Crear Curso"
        onRightActionPress={() => {
          setEditingCourse(null);
          setModalVisible(true);
        }}
      />

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const assignedClassroom = classrooms.find(
            (c) => c.id === item.classroomId
          );
          return (
            <CourseCard
              course={item}
              classroom={assignedClassroom}
              onPress={() => {
                setEditingCourse(item);
                setModalVisible(true);
              }}
              onDelete={() => handleDelete(item)}
              onManageSeats={() => {
                if (onNavigateToAssignments) {
                  onNavigateToAssignments(item.id);
                }
              }}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>No hay cursos registrados</Text>
            <Text style={styles.emptyText}>
              Crea tu primer curso y asígnalo a una de tus aulas con asientos.
            </Text>
            <Button
              title="Crear Nuevo Curso"
              onPress={() => {
                setEditingCourse(null);
                setModalVisible(true);
              }}
              style={styles.emptyBtn}
            />
          </View>
        }
      />

      <CourseModal
        visible={modalVisible}
        classrooms={classrooms}
        initialCourse={editingCourse}
        onClose={() => {
          setModalVisible(false);
          setEditingCourse(null);
        }}
        onSubmit={(data) => {
          addCourse(data);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyBtn: {
    paddingHorizontal: 24,
  },
});
