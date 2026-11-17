import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Classroom, Course, SeatAssignment } from '../../../types';
import { colors } from '../../../theme';
import { Header, Button, Badge } from '../../../components/common';
import { SeatGrid } from '../../classrooms/components/SeatGrid';
import { SeatAssignmentModal } from '../components/SeatAssignmentModal';
import { OccupancySummary } from '../components/OccupancySummary';

interface AssignmentsScreenProps {
  initialCourseId?: string;
}

export const AssignmentsScreen: React.FC<AssignmentsScreenProps> = ({
  initialCourseId,
}) => {
  const {
    courses,
    classrooms,
    assignments,
    assignSeat,
    unassignSeatByPosition,
  } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || (courses[0]?.id ?? '')
  );

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const selectedClassroom = classrooms.find(
    (cl) => cl.id === selectedCourse?.classroomId
  ) || classrooms[0];

  // Asignaciones del curso y aula actual
  const currentAssignments = assignments.filter(
    (a) =>
      a.courseId === selectedCourse?.id &&
      a.classroomId === selectedClassroom?.id
  );

  // Estado del modal de asignación de asiento
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSeat, setActiveSeat] = useState<{
    seatNumber: number;
    row: number;
    col: number;
    assignment?: SeatAssignment;
  } | null>(null);

  const handleSeatClick = (
    seatNumber: number,
    row: number,
    col: number,
    assignment?: SeatAssignment
  ) => {
    setActiveSeat({ seatNumber, row, col, assignment });
    setModalVisible(true);
  };

  const handleSaveAssignment = (
    studentName: string,
    studentId: string,
    notes: string
  ) => {
    if (!activeSeat || !selectedCourse || !selectedClassroom) return;

    assignSeat({
      courseId: selectedCourse.id,
      classroomId: selectedClassroom.id,
      seatNumber: activeSeat.seatNumber,
      row: activeSeat.row,
      column: activeSeat.col,
      studentName,
      studentId,
      notes,
    });
  };

  const handleUnassignSeat = () => {
    if (!activeSeat || !selectedCourse || !selectedClassroom) return;
    unassignSeatByPosition(
      selectedCourse.id,
      selectedClassroom.id,
      activeSeat.seatNumber
    );
  };

  if (!selectedCourse) {
    return (
      <View style={styles.container}>
        <Header title="Asignación de Asientos" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No hay cursos disponibles</Text>
          <Text style={styles.emptySubtitle}>
            Crea primero un curso en la pestaña "Cursos" para empezar a asignar
            asientos a tus alumnos.
          </Text>
        </View>
      </View>
    );
  }

  if (!selectedClassroom) {
    return (
      <View style={styles.container}>
        <Header title="Asignación de Asientos" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏛️</Text>
          <Text style={styles.emptyTitle}>El curso no tiene aula vinculada</Text>
          <Text style={styles.emptySubtitle}>
            Edita el curso "{selectedCourse.name}" y selecciónale un aula para
            ver la distribución de sus asientos.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Asignación de Asientos"
        subtitle={`${selectedCourse.name} • ${selectedClassroom.name}`}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Selector horizontal de cursos */}
        <Text style={styles.sectionLabel}>Seleccionar Curso:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coursesSelector}
        >
          {courses.map((course) => {
            const isSelected = course.id === selectedCourse.id;
            return (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.courseChip,
                  isSelected ? styles.courseChipActive : null,
                ]}
                onPress={() => setSelectedCourseId(course.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.colorDot, { backgroundColor: course.color }]}
                />
                <Text
                  style={[
                    styles.courseChipText,
                    isSelected ? styles.courseChipTextActive : null,
                  ]}
                >
                  {course.code}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Resumen de ocupación */}
        <OccupancySummary
          totalSeats={selectedClassroom.totalSeats}
          occupiedSeats={currentAssignments.length}
        />

        {/* Mapa Interactivo de Asientos */}
        <View style={styles.mapSection}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Mapa de Asientos del Aula</Text>
            <Text style={styles.mapHint}>Toca un asiento para asignar o ver</Text>
          </View>
          <SeatGrid
            classroom={selectedClassroom}
            assignments={currentAssignments}
            selectedSeatNumber={activeSeat?.seatNumber}
            onSelectSeat={handleSeatClick}
          />
        </View>

        {/* Lista de Alumnos Asignados */}
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>
            Alumnos Asignados ({currentAssignments.length})
          </Text>

          {currentAssignments.length === 0 ? (
            <View style={styles.noStudentsBox}>
              <Text style={styles.noStudentsText}>
                No hay ningún alumno asignado a un asiento aún. Toca cualquier
                asiento en el mapa de arriba para asignarlo.
              </Text>
            </View>
          ) : (
            currentAssignments.map((assignment) => (
              <TouchableOpacity
                key={assignment.id}
                style={styles.studentItem}
                onPress={() =>
                  handleSeatClick(
                    assignment.seatNumber,
                    assignment.row,
                    assignment.column,
                    assignment
                  )
                }
              >
                <View style={styles.seatBadge}>
                  <Text style={styles.seatBadgeText}>
                    #{assignment.seatNumber}
                  </Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>
                    {assignment.studentName}
                  </Text>
                  <Text style={styles.studentMeta}>
                    Fila {assignment.row}, Col {assignment.column}
                    {assignment.studentId ? ` • ID: ${assignment.studentId}` : ''}
                  </Text>
                </View>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal para asignar alumno a asiento */}
      <SeatAssignmentModal
        visible={modalVisible}
        seatNumber={activeSeat?.seatNumber ?? null}
        row={activeSeat?.row ?? null}
        col={activeSeat?.col ?? null}
        currentAssignment={activeSeat?.assignment}
        classroomName={selectedClassroom.name}
        courseName={selectedCourse.name}
        onClose={() => {
          setModalVisible(false);
          setActiveSeat(null);
        }}
        onSave={handleSaveAssignment}
        onUnassign={handleUnassignSeat}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  coursesSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  courseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  courseChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  courseChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  courseChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  mapSection: {
    marginBottom: 20,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  mapHint: {
    fontSize: 11,
    color: colors.textMuted,
  },
  listSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  noStudentsBox: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  noStudentsText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  seatBadge: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  seatBadgeText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  studentMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 18,
    color: colors.textLight,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
