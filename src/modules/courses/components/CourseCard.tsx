import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Course, Classroom } from '../../../types';
import { colors } from '../../../theme';
import { Badge } from '../../../components/common';

interface CourseCardProps {
  course: Course;
  classroom?: Classroom;
  onPress: () => void;
  onDelete?: () => void;
  onManageSeats?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  classroom,
  onPress,
  onDelete,
  onManageSeats,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.colorBar, { backgroundColor: course.color }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleInfo}>
            <Text style={styles.name}>{course.name}</Text>
            <Text style={styles.code}>{course.code}</Text>
          </View>
          {classroom ? (
            <Badge label={`Aula: ${classroom.code}`} variant="secondary" />
          ) : (
            <Badge label="Sin Aula Asignada" variant="neutral" />
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>👨‍🏫 {course.teacher}</Text>
          <Text style={styles.detailText}>🕒 {course.schedule}</Text>
        </View>

        <View style={styles.footerRow}>
          {onManageSeats && (
            <TouchableOpacity
              style={styles.actionSeatBtn}
              onPress={onManageSeats}
              activeOpacity={0.7}
            >
              <Text style={styles.actionSeatText}>🪑 Gestionar Asientos</Text>
            </TouchableOpacity>
          )}

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
  detailsContainer: {
    gap: 4,
    marginVertical: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.text,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionSeatBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionSeatText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
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
