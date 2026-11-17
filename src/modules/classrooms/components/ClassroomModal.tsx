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
import { Classroom } from '../../../types';
import { colors } from '../../../theme';
import { Button, Input } from '../../../components/common';

interface ClassroomModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (classroom: Omit<Classroom, 'id' | 'createdAt'>) => void;
  initialClassroom?: Classroom | null;
}

const PRESET_COLORS = [
  '#2563EB', // Azul
  '#10B981', // Verde
  '#7C3AED', // Violeta
  '#F59E0B', // Ámbar
  '#EC4899', // Rosa
  '#06B6D4', // Cian
];

export const ClassroomModal: React.FC<ClassroomModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialClassroom,
}) => {
  const [name, setName] = useState(initialClassroom?.name || '');
  const [code, setCode] = useState(initialClassroom?.code || '');
  const [rows, setRows] = useState(
    initialClassroom ? String(initialClassroom.rows) : '5'
  );
  const [columns, setColumns] = useState(
    initialClassroom ? String(initialClassroom.columns) : '6'
  );
  const [description, setDescription] = useState(
    initialClassroom?.description || ''
  );
  const [selectedColor, setSelectedColor] = useState(
    initialClassroom?.color || PRESET_COLORS[0]
  );

  const resetForm = () => {
    setName('');
    setCode('');
    setRows('5');
    setColumns('6');
    setDescription('');
    setSelectedColor(PRESET_COLORS[0]);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el nombre del aula');
      return;
    }
    if (!code.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el código del aula');
      return;
    }

    const numRows = parseInt(rows, 10);
    const numCols = parseInt(columns, 10);

    if (isNaN(numRows) || numRows < 1 || numRows > 20) {
      Alert.alert('Error', 'El número de filas debe ser entre 1 y 20');
      return;
    }
    if (isNaN(numCols) || numCols < 1 || numCols > 20) {
      Alert.alert('Error', 'El número de columnas debe ser entre 1 y 20');
      return;
    }

    const totalSeats = numRows * numCols;

    onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      rows: numRows,
      columns: numCols,
      totalSeats,
      description: description.trim(),
      color: selectedColor,
    });

    resetForm();
    onClose();
  };

  const calculatedSeats =
    (parseInt(rows, 10) || 0) * (parseInt(columns, 10) || 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {initialClassroom ? 'Editar Aula / Salón' : 'Nueva Aula / Salón'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Input
              label="Nombre del Aula"
              placeholder="Ej: Aula Magna, Lab 102..."
              value={name}
              onChangeText={setName}
            />

            <Input
              label="Código Identificador"
              placeholder="Ej: A-101, LAB-B"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
            />

            <View style={styles.dimensionsRow}>
              <View style={styles.halfInput}>
                <Input
                  label="Filas de Asientos"
                  placeholder="5"
                  keyboardType="numeric"
                  value={rows}
                  onChangeText={setRows}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="Columnas"
                  placeholder="6"
                  keyboardType="numeric"
                  value={columns}
                  onChangeText={setColumns}
                />
              </View>
            </View>

            {/* Resumen de capacidad calculada */}
            <View style={styles.capacityCard}>
              <Text style={styles.capacityLabel}>Capacidad Total de Asientos:</Text>
              <Text style={styles.capacityValue}>
                {calculatedSeats} {calculatedSeats === 1 ? 'asiento' : 'asientos'}
              </Text>
            </View>

            <Input
              label="Descripción o Equipamiento (Opcional)"
              placeholder="Ej: Proyector, 24 ordenadores, aire acondicionado..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

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
              title={initialClassroom ? 'Guardar Cambios' : 'Crear Aula'}
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
  dimensionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  capacityCard: {
    backgroundColor: colors.surfaceVariant,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  capacityValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
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
