import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Classroom, Course } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../../components/common';

interface ClassroomCardProps {
  classroom: Classroom;
  assignedCourses?: Course[];
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({
  classroom,
  assignedCourses = [],
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
              {classroom.code} • {classroom.rows} Filas × {classroom.columns} Columnas
            </Text>
          </View>
          <Badge label={`${classroom.totalSeats} Pupitres`} variant="primary" />
        </View>

        {/* Sección: Clases / Cursos asignados a esta aula física */}
        <View
          style={[
            styles.coursesSection,
            { backgroundColor: themeColors.surfaceVariant },
          ]}
        >
          <Text style={[styles.coursesLabel, { color: themeColors.textMuted }]}>
            📚 Clases en esta aula ({assignedCourses.length}):
          </Text>
          {assignedCourses.length > 0 ? (
            <View style={styles.coursesChipsRow}>
              {assignedCourses.map((course) => (
                <View
                  key={course.id}
                  style={[
                    styles.courseChip,
                    {
                      backgroundColor: themeColors.surface,
                      borderColor: course.color,
                    },
                  ]}
                >
                  <View
                    style={[styles.chipDot, { backgroundColor: course.color }]}
                  />
                  <Text
                    style={[styles.courseChipText, { color: themeColors.text }]}
                    numberOfLines={1}
                  >
                    {course.code} • {course.name}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text
              style={[
                styles.noCoursesAssigned,
                { color: themeColors.textLight },
              ]}
            >
              Ningún curso asignado a esta aula todavía.
            </Text>
          )}
        </View>

        <View
          style={[
            styles.footerRow,
            { borderTopColor: themeColors.border },
          ]}
        >
          <Text style={[styles.tapHint, { color: themeColors.primary }]}>
            👁️ Toca para ver distribución de pupitres
          </Text>

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
    marginBottom: 8,
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
    fontWeight: '500',
    marginTop: 2,
  },
  coursesSection: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
  },
  coursesLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  coursesChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  courseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    maxWidth: '100%',
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  courseChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  noCoursesAssigned: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  tapHint: {
    fontSize: 11,
    fontWeight: '600',
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
