import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Alert,
} from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Course } from '../../../types';
import { Header, Button } from '../../../components/common';
import { CourseCard } from '../components/CourseCard';
import { CourseModal } from '../components/CourseModal';

interface CoursesScreenProps {
  onNavigateToAssignments?: (courseId: string) => void;
}

export const CoursesScreen: React.FC<CoursesScreenProps> = ({
  onNavigateToAssignments,
}) => {
  const {
    courses,
    classrooms,
    addCourse,
    updateCourse,
    deleteCourse,
    themeColors,
  } = useApp();

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

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setModalVisible(true);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Header
        title="Cursos y Materias"
        subtitle={`${courses.length} materias registradas`}
        rightActionText="+ Nuevo Curso"
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
              onPress={() => handleEdit(item)}
              onEdit={() => handleEdit(item)}
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
            <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
              No hay cursos registrados
            </Text>
            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
              Crea tu primer curso y vincúlalo a una de tus aulas.
            </Text>
            <Button
              title="Crear Nuevo Curso"
              onPress={() => {
                setEditingCourse(null);
                setModalVisible(true);
              }}
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
          if (editingCourse) {
            updateCourse(editingCourse.id, data);
          } else {
            addCourse(data);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
});
