import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Course, Classroom } from '../../../types';
import { colors } from '../../../theme';
import { Button, Input } from '../../../components/common';

interface CourseModalProps {
  visible: boolean;
  classrooms: Classroom[];
  onClose: () => void;
  onSubmit: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  initialCourse?: Course | null;
}

const PRESET_COLORS = [
  '#7C3AED', // Púrpura
  '#0284C7', // Azul cielo
  '#059669', // Esmeralda
  '#D97706', // Ámbar
  '#DC2626', // Rojo
  '#4F46E5', // Índigo
];

export const CourseModal: React.FC<CourseModalProps> = ({
  visible,
  classrooms,
  onClose,
  onSubmit,
  initialCourse,
}) => {
  const [name, setName] = useState(initialCourse?.name || '');
  const [code, setCode] = useState(initialCourse?.code || '');
  const [teacher, setTeacher] = useState(initialCourse?.teacher || '');
  const [schedule, setSchedule] = useState(initialCourse?.schedule || '');
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | undefined>(
    initialCourse?.classroomId || (classrooms[0] ? classrooms[0].id : undefined)
  );
  const [selectedColor, setSelectedColor] = useState(
    initialCourse?.color || PRESET_COLORS[0]
  );

  const resetForm = () => {
    setName('');
    setCode('');
    setTeacher('');
    setSchedule('');
    setSelectedClassroomId(classrooms[0] ? classrooms[0].id : undefined);
    setSelectedColor(PRESET_COLORS[0]);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el nombre del curso');
      return;
    }
    if (!code.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el código del curso');
      return;
    }
    if (!teacher.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el nombre del profesor');
      return;
    }

    onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      teacher: teacher.trim(),
      schedule: schedule.trim() || 'Horario a definir',
      classroomId: selectedClassroomId,
      color: selectedColor,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {initialCourse ? 'Editar Curso' : 'Nuevo Curso'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Input
              label="Nombre del Curso / Asignatura"
              placeholder="Ej: Desarrollo React Native, Física II..."
              value={name}
              onChangeText={setName}
            />

            <Input
              label="Código del Curso"
              placeholder="Ej: RN-101, FIS-200"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
            />

            <Input
              label="Profesor / Docente"
              placeholder="Ej: Prof. Matías"
              value={teacher}
              onChangeText={setTeacher}
            />

            <Input
              label="Horario y Días"
              placeholder="Ej: Lunes y Miércoles 16:00 - 18:00"
              value={schedule}
              onChangeText={setSchedule}
            />

            {/* Selector de Aula Física */}
            <Text style={styles.sectionLabel}>Asignar Aula Física</Text>
            {classrooms.length === 0 ? (
              <View style={styles.noClassroomsWarning}>
                <Text style={styles.warningText}>
                  ⚠️ No hay aulas creadas aún. Podrás asignar una más adelante.
                </Text>
              </View>
            ) : (
              <View style={styles.classroomSelector}>
                {classrooms.map((room) => {
                  const isSelected = selectedClassroomId === room.id;
                  return (
                    <TouchableOpacity
                      key={room.id}
                      style={[
                        styles.roomOption,
                        isSelected ? styles.roomOptionSelected : null,
                      ]}
                      onPress={() => setSelectedClassroomId(room.id)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[styles.roomDot, { backgroundColor: room.color }]}
                      />
                      <View style={styles.roomInfo}>
                        <Text
                          style={[
                            styles.roomName,
                            isSelected ? styles.roomNameSelected : null,
                          ]}
                        >
                          {room.name} ({room.code})
                        </Text>
                        <Text style={styles.roomSeats}>
                          {room.totalSeats} asientos disponibles
                        </Text>
                      </View>
                      {isSelected ? (
                        <Text style={styles.checkIcon}>✓</Text>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <Text style={styles.sectionLabel}>Color Distintivo</Text>
            <View style={styles.colorsPalette}>
              {PRESET_COLORS.map((col) => (
                <TouchableOpacity
                  key={col}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: col },
                    selectedColor === col ? styles.colorCircleSelected : null,
                  ]}
                  onPress={() => setSelectedColor(col)}
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancelar"
              variant="outline"
              onPress={onClose}
              style={styles.footerBtn}
            />
            <Button
              title={initialCourse ? 'Guardar Cambios' : 'Crear Curso'}
              variant="primary"
              onPress={handleSave}
              style={styles.footerBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: colors.textMuted,
  },
  formScroll: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 4,
  },
  noClassroomsWarning: {
    backgroundColor: colors.warningLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
  classroomSelector: {
    gap: 8,
    marginBottom: 16,
  },
  roomOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceVariant,
  },
  roomOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  roomDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  roomNameSelected: {
    color: colors.primaryDark,
  },
  roomSeats: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  checkIcon: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  colorsPalette: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: colors.text,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  footerBtn: {
    flex: 1,
  },
});
