import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SeatAssignment } from '../../../types';
import { colors } from '../../../theme';
import { Button, Input, Badge } from '../../../components/common';

interface SeatAssignmentModalProps {
  visible: boolean;
  seatNumber: number | null;
  row: number | null;
  col: number | null;
  currentAssignment?: SeatAssignment;
  classroomName: string;
  courseName: string;
  onClose: () => void;
  onSave: (studentName: string, studentId: string, notes: string) => void;
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
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (currentAssignment) {
      setStudentName(currentAssignment.studentName);
      setStudentId(currentAssignment.studentId || '');
      setNotes(currentAssignment.notes || '');
    } else {
      setStudentName('');
      setStudentId('');
      setNotes('');
    }
  }, [currentAssignment, visible]);

  const handleSave = () => {
    if (!studentName.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el nombre del alumno');
      return;
    }
    onSave(studentName.trim(), studentId.trim(), notes.trim());
    onClose();
  };

  const handleUnassignConfirm = () => {
    Alert.alert(
      'Liberar Asiento',
      `¿Deseas desocupar el asiento #${seatNumber} de ${currentAssignment?.studentName}?`,
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
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                {currentAssignment ? 'Editar Asignación' : 'Asignar Asiento'}
              </Text>
              <Text style={styles.seatMeta}>
                Asiento #{seatNumber} • Fila {row}, Columna {col}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contextInfo}>
            <Text style={styles.contextLabel}>Curso:</Text>
            <Text style={styles.contextValue}>{courseName}</Text>
            <Text style={[styles.contextLabel, { marginTop: 4 }]}>Aula:</Text>
            <Text style={styles.contextValue}>{classroomName}</Text>
          </View>

          <View style={styles.body}>
            <Input
              label="Nombre del Alumno"
              placeholder="Ej: Laura Gómez..."
              value={studentName}
              onChangeText={setStudentName}
            />

            <Input
              label="Matrícula / ID del Alumno (Opcional)"
              placeholder="Ej: ALU-2024-05"
              value={studentId}
              onChangeText={setStudentId}
            />

            <Input
              label="Notas u Observaciones (Opcional)"
              placeholder="Ej: Necesita estar cerca de la pizarra..."
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <View style={styles.footer}>
            {currentAssignment ? (
              <Button
                title="Liberar Asiento"
                variant="danger"
                onPress={handleUnassignConfirm}
                style={styles.actionBtn}
              />
            ) : null}
            <Button
              title={currentAssignment ? 'Actualizar' : 'Asignar Alumno'}
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
    backgroundColor: colors.surface,
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
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  seatMeta: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: colors.textMuted,
  },
  contextInfo: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contextLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  contextValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    padding: 20,
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
