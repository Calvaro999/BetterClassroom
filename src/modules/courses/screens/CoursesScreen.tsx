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
import {
  Header,
  Button,
  FloatingActionButton,
  FolderFilterBar,
  TexturedBackground,
} from '../../../components/common';
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
    folders,
    addCourse,
    updateCourse,
    deleteCourse,
    themeColors,
  } = useApp();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

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

  // Filtrar cursos por carpeta seleccionada
  const filteredCourses = selectedFolderId
    ? courses.filter((c) => c.folderId === selectedFolderId)
    : courses;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <TexturedBackground />

      <Header
        title="Cursos y Materias"
        subtitle={`${filteredCourses.length} de ${courses.length} materias`}
      />

      {/* Barra de Filtro de Carpetas */}
      <FolderFilterBar
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
      />

      <FlatList
        data={filteredCourses}
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
              {selectedFolderId
                ? 'No hay cursos en esta carpeta'
                : 'No hay cursos registrados'}
            </Text>
            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
              {selectedFolderId
                ? 'Edita un curso para asignarlo a esta carpeta o crea uno nuevo con el botón +'
                : 'Toca el botón circular + para crear tu primer curso.'}
            </Text>
          </View>
        }
      />

      {/* Botón Circular Flotante (FAB) con '+' */}
      <FloatingActionButton
        onPress={() => {
          setEditingCourse(null);
          setModalVisible(true);
        }}
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
    position: 'relative',
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
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
