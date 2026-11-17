import React, { useState, useEffect } from 'react';
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
import { useApp } from '../../../context/AppContext';
import { Button, Input } from '../../../components/common';

interface CourseModalProps {
  visible: boolean;
  classrooms: Classroom[];
  onClose: () => void;
  onSubmit: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  initialCourse?: Course | null;
}

const PRESET_COLORS = [
  '#9F1239', // Granate
  '#881337', // Granate profundo
  '#BE123C', // Granate vivo
  '#475569', // Pizarra
  '#0F766E', // Verde oscuro
  '#1E40AF', // Azul marino
];

export const CourseModal: React.FC<CourseModalProps> = ({
  visible,
  classrooms,
  onClose,
  onSubmit,
  initialCourse,
}) => {
  const { themeColors, folders } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [teacher, setTeacher] = useState('');
  const [schedule, setSchedule] = useState('');
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | undefined>(undefined);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  // Sincronizar todos los datos cuando se edita un curso
  useEffect(() => {
    if (initialCourse) {
      setName(initialCourse.name || '');
      setCode(initialCourse.code || '');
      setTeacher(initialCourse.teacher || '');
      setSchedule(initialCourse.schedule || '');
      setSelectedClassroomId(initialCourse.classroomId);
      setSelectedFolderId(initialCourse.folderId);
      setSelectedColor(initialCourse.color || PRESET_COLORS[0]);
    } else {
      setName('');
      setCode('');
      setTeacher('');
      setSchedule('');
      setSelectedClassroomId(classrooms[0] ? classrooms[0].id : undefined);
      setSelectedFolderId(folders[0] ? folders[0].id : undefined);
      setSelectedColor(PRESET_COLORS[0]);
    }
  }, [initialCourse, visible, classrooms, folders]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el nombre del curso');
      return;
    }
    if (!code.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el código del curso');
      return;
    }
    if (!teacher.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el nombre del docente');
      return;
    }

    onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      teacher: teacher.trim(),
      schedule: schedule.trim() || 'Horario por definir',
      classroomId: selectedClassroomId,
      folderId: selectedFolderId,
      color: selectedColor,
    });

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: themeColors.surface },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: themeColors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              {initialCourse ? 'Editar Curso' : 'Nuevo Curso'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: themeColors.textMuted }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Input
              label="Nombre del Curso / Asignatura"
              placeholder="Ej: Desarrollo React Native"
              value={name}
              onChangeText={setName}
            />

            <Input
              label="Código del Curso"
              placeholder="Ej: RN-101"
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
              placeholder="Ej: Lunes y Miércoles 16:00"
              value={schedule}
              onChangeText={setSchedule}
            />

            {/* Selector de Carpeta Organizadora */}
            <Text style={[styles.sectionLabel, { color: themeColors.text }]}>
              📁 Carpeta Organizadora
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.folderRow}
            >
              <TouchableOpacity
                style={[
                  styles.folderOption,
                  {
                    backgroundColor:
                      selectedFolderId === undefined
                        ? themeColors.primaryLight
                        : themeColors.surfaceVariant,
                    borderColor:
                      selectedFolderId === undefined
                        ? themeColors.primary
                        : themeColors.border,
                  },
                ]}
                onPress={() => setSelectedFolderId(undefined)}
              >
                <Text
                  style={{
                    color:
                      selectedFolderId === undefined
                        ? themeColors.primaryDark
                        : themeColors.text,
                    fontWeight: selectedFolderId === undefined ? '700' : '500',
                    fontSize: 12,
                  }}
                >
                  Sin Carpeta
                </Text>
              </TouchableOpacity>

              {folders.map((f) => {
                const isSelected = selectedFolderId === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={[
                      styles.folderOption,
                      {
                        backgroundColor: isSelected
                          ? themeColors.primaryLight
                          : themeColors.surfaceVariant,
                        borderColor: isSelected
                          ? themeColors.primary
                          : themeColors.border,
                      },
                    ]}
                    onPress={() => setSelectedFolderId(f.id)}
                  >
                    <Text
                      style={{
                        color: isSelected
                          ? themeColors.primaryDark
                          : themeColors.text,
                        fontWeight: isSelected ? '700' : '500',
                        fontSize: 12,
                      }}
                    >
                      📁 {f.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={[styles.sectionLabel, { color: themeColors.text }]}>
              Aula Asignada
            </Text>
            {classrooms.length === 0 ? (
              <View
                style={[
                  styles.noClassroomsWarning,
                  { backgroundColor: themeColors.surfaceVariant },
                ]}
              >
                <Text
                  style={[styles.warningText, { color: themeColors.textMuted }]}
                >
                  No hay aulas creadas aún. Podrás vincular una más tarde.
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
                        {
                          backgroundColor: isSelected
                            ? themeColors.primaryLight
                            : themeColors.surfaceVariant,
                          borderColor: isSelected
                            ? themeColors.primary
                            : themeColors.border,
                        },
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
                            {
                              color: isSelected
                                ? themeColors.primaryDark
                                : themeColors.text,
                            },
                          ]}
                        >
                          {room.name} ({room.code})
                        </Text>
                        <Text
                          style={[
                            styles.roomSeats,
                            { color: themeColors.textMuted },
                          ]}
                        >
                          {room.totalSeats} pupitres
                        </Text>
                      </View>
                      {isSelected ? (
                        <Text
                          style={[
                            styles.checkIcon,
                            { color: themeColors.primary },
                          ]}
                        >
                          ✓
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <Text style={[styles.sectionLabel, { color: themeColors.text }]}>
              Color Distintivo
            </Text>
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
  },
  formScroll: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },
  folderRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  folderOption: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  noClassroomsWarning: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 12,
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
  },
  roomSeats: {
    fontSize: 11,
    marginTop: 1,
  },
  checkIcon: {
    fontSize: 16,
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
    borderColor: '#0F172A',
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
