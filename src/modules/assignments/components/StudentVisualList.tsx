import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { SeatAssignment, Course } from '../../../types';
import { useApp } from '../../../context/AppContext';

interface StudentVisualListProps {
  assignments: SeatAssignment[];
  course: Course;
  onSelectStudent: (assignment: SeatAssignment) => void;
}

export const StudentVisualList: React.FC<StudentVisualListProps> = ({
  assignments,
  course,
  onSelectStudent,
}) => {
  const { themeColors } = useApp();

  if (assignments.length === 0) {
    return (
      <View
        style={[
          styles.emptyBox,
          { backgroundColor: themeColors.surface, borderColor: themeColors.border },
        ]}
      >
        <Text style={styles.emptyEmoji}>👥</Text>
        <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
          No hay alumnos asignados
        </Text>
        <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
          Pasa a la vista de "Mapa del Aula" y toca cualquier pupitre para asignar
          un alumno.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {assignments.map((item) => {
        const isFemale = item.gender === 'Femenino';
        const isMale = item.gender === 'Masculino';
        const genderEmoji = isFemale ? '👩' : isMale ? '👨' : '🧑';

        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.studentCard,
              {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.border,
              },
            ]}
            onPress={() => onSelectStudent(item)}
            activeOpacity={0.7}
          >
            {/* Avatar Visual */}
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: themeColors.primaryLight },
              ]}
            >
              <Text style={styles.avatarEmoji}>{genderEmoji}</Text>
            </View>

            {/* Solo Nombre, Género y Curso */}
            <View style={styles.infoCol}>
              <Text style={[styles.studentName, { color: themeColors.text }]}>
                {item.studentName}
              </Text>
              <View style={styles.detailsRow}>
                <Text
                  style={[
                    styles.tagText,
                    {
                      color: isFemale
                        ? '#DB2777'
                        : isMale
                        ? '#2563EB'
                        : themeColors.textMuted,
                    },
                  ]}
                >
                  {item.gender}
                </Text>
                <Text style={[styles.separator, { color: themeColors.textLight }]}>
                  •
                </Text>
                <Text
                  style={[styles.courseText, { color: themeColors.primaryDark }]}
                  numberOfLines={1}
                >
                  {course.name}
                </Text>
              </View>
            </View>

            {/* Indicador de Pupitre */}
            <View
              style={[
                styles.seatPill,
                { backgroundColor: themeColors.surfaceVariant },
              ]}
            >
              <Text style={[styles.seatPillText, { color: themeColors.text }]}>
                Pupitre #{item.seatNumber}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 8,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  infoCol: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    fontSize: 12,
  },
  courseText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  seatPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  seatPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 32,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
