import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Classroom } from '../../../types';
import { colors } from '../../../theme';
import { Badge } from '../../../components/common';

interface ClassroomCardProps {
  classroom: Classroom;
  onPress: () => void;
  onDelete?: () => void;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({
  classroom,
  onPress,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.colorBar, { backgroundColor: classroom.color }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleInfo}>
            <Text style={styles.name}>{classroom.name}</Text>
            <Text style={styles.code}>Cód: {classroom.code}</Text>
          </View>
          <Badge label={`${classroom.totalSeats} Asientos`} variant="primary" />
        </View>

        {classroom.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {classroom.description}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <View style={styles.specs}>
            <Text style={styles.specText}>
              📐 {classroom.rows} Filas × {classroom.columns} Columnas
            </Text>
          </View>

          {onDelete ? (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
    marginBottom: 6,
  },
  titleInfo: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  code: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 10,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  specs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '600',
  },
});
