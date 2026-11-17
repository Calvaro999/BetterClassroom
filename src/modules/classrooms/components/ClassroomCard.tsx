import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Classroom } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../../components/common';

interface ClassroomCardProps {
  classroom: Classroom;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({
  classroom,
  onPress,
  onEdit,
  onDelete,
}) => {
  const { themeColors } = useApp();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.colorBar, { backgroundColor: classroom.color }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleInfo}>
            <Text style={[styles.name, { color: themeColors.text }]}>
              {classroom.name}
            </Text>
            <Text style={[styles.code, { color: themeColors.textMuted }]}>
              {classroom.code}
            </Text>
          </View>
          <Badge label={`${classroom.totalSeats} Pupitres`} variant="primary" />
        </View>

        <View
          style={[
            styles.footerRow,
            { borderTopColor: themeColors.border },
          ]}
        >
          <View style={styles.specs}>
            <Text style={[styles.specText, { color: themeColors.textMuted }]}>
              📐 {classroom.rows} Filas × {classroom.columns} Columnas
            </Text>
          </View>

          <View style={styles.actions}>
            {onEdit ? (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={onEdit}
                activeOpacity={0.7}
              >
                <Text style={[styles.editText, { color: themeColors.primary }]}>
                  Editar
                </Text>
              </TouchableOpacity>
            ) : null}

            {onDelete ? (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={onDelete}
                activeOpacity={0.7}
              >
                <Text style={[styles.deleteText, { color: themeColors.danger }]}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  colorBar: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleInfo: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  code: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  specs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
