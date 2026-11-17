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
import { Classroom } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { Button, Input } from '../../../components/common';

interface ClassroomModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (classroom: Omit<Classroom, 'id' | 'createdAt'>) => void;
  initialClassroom?: Classroom | null;
}

const PRESET_COLORS = [
  '#9F1239', // Granate principal
  '#881337', // Granate oscuro
  '#BE123C', // Granate vivo
  '#475569', // Pizarra
  '#0F766E', // Verde bosque
  '#1D4ED8', // Azul
];

export const ClassroomModal: React.FC<ClassroomModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialClassroom,
}) => {
  const { themeColors } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [rows, setRows] = useState('4');
  const [columns, setColumns] = useState('5');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  // Sincronizar datos al editar o abrir
  useEffect(() => {
    if (initialClassroom) {
      setName(initialClassroom.name);
      setCode(initialClassroom.code);
      setRows(String(initialClassroom.rows));
      setColumns(String(initialClassroom.columns));
      setSelectedColor(initialClassroom.color || PRESET_COLORS[0]);
    } else {
      setName('');
      setCode('');
      setRows('4');
      setColumns('5');
      setSelectedColor(PRESET_COLORS[0]);
    }
  }, [initialClassroom, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el nombre del aula');
      return;
    }
    if (!code.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el código del aula');
      return;
    }

    const numRows = parseInt(rows, 10);
    const numCols = parseInt(columns, 10);

    if (isNaN(numRows) || numRows < 1 || numRows > 15) {
      Alert.alert('Error', 'Las filas deben ser entre 1 y 15');
      return;
    }
    if (isNaN(numCols) || numCols < 1 || numCols > 15) {
      Alert.alert('Error', 'Las columnas deben ser entre 1 y 15');
      return;
    }

    onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      rows: numRows,
      columns: numCols,
      totalSeats: numRows * numCols,
      color: selectedColor,
    });

    onClose();
  };

  const calculatedSeats =
    (parseInt(rows, 10) || 0) * (parseInt(columns, 10) || 0);

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
              {initialClassroom ? 'Editar Aula y Asientos' : 'Nueva Aula'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: themeColors.textMuted }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Input
              label="Nombre del Aula"
              placeholder="Ej: Aula 1, Salón Principal..."
              value={name}
              onChangeText={setName}
            />

            <Input
              label="Código Identificador"
              placeholder="Ej: A-101"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
            />

            <Text style={[styles.sectionLabel, { color: themeColors.text }]}>
              Tamaño del Aula (Pupitres)
            </Text>
            <View style={styles.dimensionsRow}>
              <View style={styles.halfInput}>
                <Input
                  label="Filas"
                  placeholder="4"
                  keyboardType="numeric"
                  value={rows}
                  onChangeText={setRows}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="Columnas"
                  placeholder="5"
                  keyboardType="numeric"
                  value={columns}
                  onChangeText={setColumns}
                />
              </View>
            </View>

            {/* Resumen de capacidad calculada */}
            <View
              style={[
                styles.capacityCard,
                { backgroundColor: themeColors.surfaceVariant },
              ]}
            >
              <Text
                style={[styles.capacityLabel, { color: themeColors.textMuted }]}
              >
                Capacidad total calculada:
              </Text>
              <Text
                style={[styles.capacityValue, { color: themeColors.primary }]}
              >
                {calculatedSeats} pupitres
              </Text>
            </View>

            <Text style={[styles.sectionLabel, { color: themeColors.text }]}>
              Color del Aula
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
  },
  dimensionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  capacityCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  capacityValue: {
    fontSize: 15,
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
