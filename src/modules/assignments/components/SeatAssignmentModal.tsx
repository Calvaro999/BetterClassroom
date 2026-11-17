import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SeatAssignment, Gender } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { Button, Input } from '../../../components/common';

interface SeatAssignmentModalProps {
  visible: boolean;
  seatNumber: number | null;
  row: number | null;
  col: number | null;
  currentAssignment?: SeatAssignment;
  classroomName: string;
  courseName: string;
  onClose: () => void;
  onSave: (studentName: string, gender: Gender) => void;
  onUnassign: () => void;
}

export const SeatAssignmentModal: React.FC<SeatAssignmentModalProps> = ({
  visible,
  seatNumber,
  row,
  col,
  currentAssignment,
  classroomName,
  courseName,
  onClose,
  onSave,
  onUnassign,
}) => {
  const { themeColors } = useApp();
  const [studentName, setStudentName] = useState('');
  const [gender, setGender] = useState<Gender>('Masculino');

  useEffect(() => {
    if (currentAssignment) {
      setStudentName(currentAssignment.studentName || '');
      setGender(currentAssignment.gender || 'Masculino');
    } else {
      setStudentName('');
      setGender('Masculino');
    }
  }, [currentAssignment, visible]);

  const handleSave = () => {
    if (!studentName.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el nombre del alumno');
      return;
    }
    onSave(studentName.trim(), gender);
    onClose();
  };

  const handleUnassignConfirm = () => {
    Alert.alert(
      'Liberar Pupitre',
      `¿Deseas desocupar el pupitre #${seatNumber} de ${currentAssignment?.studentName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Liberar',
          style: 'destructive',
          onPress: () => {
            onUnassign();
            onClose();
          },
        },
      ]
    );
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
            <View>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                {currentAssignment ? 'Editar Alumno' : 'Asignar a Pupitre'}
              </Text>
              <Text style={[styles.seatMeta, { color: themeColors.primary }]}>
                Pupitre #{seatNumber} • Fila {row}, Columna {col}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: themeColors.textMuted }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.contextInfo,
              {
                backgroundColor: themeColors.surfaceVariant,
                borderBottomColor: themeColors.border,
              },
            ]}
          >
            <Text style={[styles.contextText, { color: themeColors.textMuted }]}>
              Curso: <Text style={{ color: themeColors.text, fontWeight: '700' }}>{courseName}</Text> • Aula: <Text style={{ color: themeColors.text, fontWeight: '700' }}>{classroomName}</Text>
            </Text>
          </View>

          <View style={styles.body}>
            <Input
              label="Nombre del Alumno"
              placeholder="Ej: Marcos Fernández..."
              value={studentName}
              onChangeText={setStudentName}
            />

            <Text style={[styles.genderLabel, { color: themeColors.text }]}>
              Género
            </Text>
            <View style={styles.genderRow}>
              {(['Masculino', 'Femenino', 'Otro'] as Gender[]).map((g) => {
                const isSelected = gender === g;
                const icon = g === 'Masculino' ? '👨' : g === 'Femenino' ? '👩' : '🧑';
                return (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderChip,
                      {
                        backgroundColor: isSelected
                          ? themeColors.primaryLight
                          : themeColors.surfaceVariant,
                        borderColor: isSelected
                          ? themeColors.primary
                          : themeColors.border,
                      },
                    ]}
                    onPress={() => setGender(g)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.genderChipIcon}>{icon}</Text>
                    <Text
                      style={[
                        styles.genderChipText,
                        {
                          color: isSelected
                            ? themeColors.primaryDark
                            : themeColors.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.footer}>
            {currentAssignment ? (
              <Button
                title="Liberar"
                variant="danger"
                onPress={handleUnassignConfirm}
                style={styles.actionBtn}
              />
            ) : null}
            <Button
              title={currentAssignment ? 'Actualizar' : 'Asignar Pupitre'}
              variant="primary"
              onPress={handleSave}
              style={styles.actionBtn}
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
  seatMeta: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
  },
  contextInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  contextText: {
    fontSize: 13,
  },
  body: {
    padding: 20,
  },
  genderLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  genderChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 6,
  },
  genderChipIcon: {
    fontSize: 16,
  },
  genderChipText: {
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },
});
