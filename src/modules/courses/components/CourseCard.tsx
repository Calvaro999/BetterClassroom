import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Course, Classroom } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../../components/common';

interface CourseCardProps {
  course: Course;
  classroom?: Classroom;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onManageSeats?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  classroom,
  onPress,
  onEdit,
  onDelete,
  onManageSeats,
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
      <View style={[styles.colorBar, { backgroundColor: course.color }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleInfo}>
            <Text style={[styles.name, { color: themeColors.text }]}>
              {course.name}
            </Text>
            <Text style={[styles.code, { color: themeColors.textMuted }]}>
              {course.code}
            </Text>
          </View>
          {classroom ? (
            <Badge label={`Aula: ${classroom.code}`} variant="primary" />
          ) : (
            <Badge label="Sin Aula" variant="neutral" />
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={[styles.detailText, { color: themeColors.text }]}>
            👨‍🏫 {course.teacher}
          </Text>
          <Text style={[styles.detailText, { color: themeColors.textMuted }]}>
            🕒 {course.schedule}
          </Text>
        </View>

        <View
          style={[
            styles.footerRow,
            { borderTopColor: themeColors.border },
          ]}
        >
          {onManageSeats && (
            <TouchableOpacity
              style={[
                styles.actionSeatBtn,
                { backgroundColor: themeColors.primaryLight },
              ]}
              onPress={onManageSeats}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.actionSeatText,
                  { color: themeColors.primaryDark },
                ]}
              >
                🪑 Ver Clase y Asientos
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.rightActions}>
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
    marginBottom: 6,
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
  detailsContainer: {
    gap: 4,
    marginVertical: 6,
  },
  detailText: {
    fontSize: 13,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 1,
  },
  actionSeatBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  actionSeatText: {
    fontSize: 12,
    fontWeight: '700',
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 6,
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
