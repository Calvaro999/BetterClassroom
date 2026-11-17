import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Classroom } from '../../../types';
import { Header, Button, FloatingActionButton, TexturedBackground } from '../../../components/common';
import { ClassroomCard } from '../components/ClassroomCard';
import { ClassroomModal } from '../components/ClassroomModal';
import { SeatGrid } from '../components/SeatGrid';

export const ClassroomsScreen: React.FC = () => {
  const {
    classrooms,
    courses,
    addClassroom,
    updateClassroom,
    deleteClassroom,
    assignments,
    themeColors,
  } = useApp();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [viewingClassroom, setViewingClassroom] = useState<Classroom | null>(null);

  const handleDelete = (classroom: Classroom) => {
    Alert.alert(
      'Eliminar Aula',
      `¿Deseas eliminar "${classroom.name}"? Se perderán las asignaciones de asientos asociadas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteClassroom(classroom.id),
        },
      ]
    );
  };

  const handleEdit = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setModalVisible(true);
  };

  const classroomAssignments = viewingClassroom
    ? assignments.filter((a) => a.classroomId === viewingClassroom.id)
    : [];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      {/* Textura de fondo con siluetas de pizarras y sillas */}
      <TexturedBackground />

      <Header
        title="Aulas y Salones"
        subtitle={`${classrooms.length} aulas configuradas`}
      />

      <FlatList
        data={classrooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const assignedCourses = courses.filter((c) => c.classroomId === item.id);
          return (
            <ClassroomCard
              classroom={item}
              assignedCourses={assignedCourses}
              onPress={() => setViewingClassroom(item)}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏛️</Text>
            <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
              No hay aulas creadas
            </Text>
            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
              Toca el botón circular '+' para crear tu primera aula y sus pupitres.
            </Text>
          </View>
        }
      />

      {/* Botón Circular Flotante (FAB) con un '+' */}
      <FloatingActionButton
        onPress={() => {
          setEditingClassroom(null);
          setModalVisible(true);
        }}
      />

      {/* Modal para crear o editar aula y tamaño de pupitres */}
      <ClassroomModal
        visible={modalVisible}
        initialClassroom={editingClassroom}
        onClose={() => {
          setModalVisible(false);
          setEditingClassroom(null);
        }}
        onSubmit={(data) => {
          if (editingClassroom) {
            updateClassroom(editingClassroom.id, data);
          } else {
            addClassroom(data);
          }
        }}
      />

      {/* Visor interactivo del aula y pupitres */}
      {viewingClassroom && (
        <Modal visible={true} animationType="fade" transparent>
          <View style={styles.previewOverlay}>
            <View
              style={[
                styles.previewContainer,
                { backgroundColor: themeColors.surface },
              ]}
            >
              <View
                style={[
                  styles.previewHeader,
                  { borderBottomColor: themeColors.border },
                ]}
              >
                <View>
                  <Text style={[styles.previewTitle, { color: themeColors.text }]}>
                    {viewingClassroom.name}
                  </Text>
                  <Text
                    style={[
                      styles.previewSubtitle,
                      { color: themeColors.textMuted },
                    ]}
                  >
                    {viewingClassroom.code} • {viewingClassroom.totalSeats} pupitres
                    ({viewingClassroom.rows} filas × {viewingClassroom.columns} columnas)
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setViewingClassroom(null)}
                  style={styles.closeBtn}
                >
                  <Text style={[styles.closeText, { color: themeColors.textMuted }]}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.gridContainer}>
                <SeatGrid
                  classroom={viewingClassroom}
                  assignments={classroomAssignments}
                  readOnly={true}
                />
              </View>

              <View style={styles.previewFooter}>
                <Button
                  title="Cerrar Vista"
                  variant="outline"
                  onPress={() => setViewingClassroom(null)}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    paddingBottom: 90, // Espacio suficiente para no tapar el último elemento con el FAB
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
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  previewContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  previewSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
  },
  gridContainer: {
    padding: 16,
  },
  previewFooter: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
