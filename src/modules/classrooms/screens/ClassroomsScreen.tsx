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
import { colors } from '../../../theme';
import { Header, Button } from '../../../components/common';
import { ClassroomCard } from '../components/ClassroomCard';
import { ClassroomModal } from '../components/ClassroomModal';
import { SeatGrid } from '../components/SeatGrid';

export const ClassroomsScreen: React.FC = () => {
  const { classrooms, addClassroom, deleteClassroom, assignments } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  const handleDelete = (classroom: Classroom) => {
    Alert.alert(
      'Eliminar Aula',
      `¿Estás seguro de que deseas eliminar "${classroom.name}"? Se perderán las asignaciones de asientos asociadas.`,
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

  const classroomAssignments = selectedClassroom
    ? assignments.filter((a) => a.classroomId === selectedClassroom.id)
    : [];

  return (
    <View style={styles.container}>
      <Header
        title="Aulas y Salones"
        subtitle={`${classrooms.length} aulas configuradas con asientos`}
        rightActionText="+ Crear Aula"
        onRightActionPress={() => setModalVisible(true)}
      />

      <FlatList
        data={classrooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ClassroomCard
            classroom={item}
            onPress={() => setSelectedClassroom(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏛️</Text>
            <Text style={styles.emptyTitle}>No hay aulas creadas</Text>
            <Text style={styles.emptyText}>
              Crea tu primera aula definiendo las filas y columnas de asientos.
            </Text>
            <Button
              title="Crear Nueva Aula"
              onPress={() => setModalVisible(true)}
              style={styles.emptyBtn}
            />
          </View>
        }
      />

      {/* Modal para crear nueva aula */}
      <ClassroomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(data) => addClassroom(data)}
      />

      {/* Modal visor interactivo de distribución de asientos de un aula */}
      {selectedClassroom && (
        <Modal visible={true} animationType="slide" transparent>
          <View style={styles.previewOverlay}>
            <View style={styles.previewContainer}>
              <View style={styles.previewHeader}>
                <View>
                  <Text style={styles.previewTitle}>
                    {selectedClassroom.name}
                  </Text>
                  <Text style={styles.previewSubtitle}>
                    {selectedClassroom.code} • {selectedClassroom.totalSeats} asientos (
                    {selectedClassroom.rows} filas × {selectedClassroom.columns} columnas)
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedClassroom(null)}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.gridContainer}>
                <SeatGrid
                  classroom={selectedClassroom}
                  assignments={classroomAssignments}
                  readOnly={true}
                />
              </View>

              <View style={styles.previewFooter}>
                <Button
                  title="Cerrar Vista"
                  variant="outline"
                  onPress={() => setSelectedClassroom(null)}
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
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  previewContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  previewSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: colors.textMuted,
  },
  gridContainer: {
    padding: 16,
  },
  previewFooter: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
