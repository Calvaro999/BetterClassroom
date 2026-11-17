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
import { Classroom, Course, SeatAssignment, Gender } from '../../../types';
import { Header, Button, Badge } from '../../../components/common';
import { SeatGrid } from '../../classrooms/components/SeatGrid';
import { SeatAssignmentModal } from '../components/SeatAssignmentModal';
import { OccupancySummary } from '../components/OccupancySummary';
import { StudentVisualList } from '../components/StudentVisualList';

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
    themeColors,
  } = useApp();

  // Si se pasó un ID inicial lo selecciona, sino muestra la lista de cursos primero
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    initialCourseId || null
  );

  // Modo de vista dentro del curso: 'map' (Mapa visual) o 'students' (Lista visual de alumnos)
  const [viewMode, setViewMode] = useState<'map' | 'students'>('map');

  // Estado del modal de pupitre
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSeat, setActiveSeat] = useState<{
    seatNumber: number;
    row: number;
    col: number;
    assignment?: SeatAssignment;
  } | null>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || null;
  const selectedClassroom = selectedCourse
    ? classrooms.find((cl) => cl.id === selectedCourse.classroomId) || null
    : null;

  // Asignaciones para el curso y aula seleccionada
  const currentAssignments =
    selectedCourse && selectedClassroom
      ? assignments.filter(
          (a) =>
            a.courseId === selectedCourse.id &&
            a.classroomId === selectedClassroom.id
        )
      : [];

  const handleSeatClick = (
    seatNumber: number,
    row: number,
    col: number,
    assignment?: SeatAssignment
  ) => {
    setActiveSeat({ seatNumber, row, col, assignment });
    setModalVisible(true);
  };

  const handleSaveAssignment = (studentName: string, gender: Gender) => {
    if (!activeSeat || !selectedCourse || !selectedClassroom) return;

    assignSeat({
      courseId: selectedCourse.id,
      classroomId: selectedClassroom.id,
      seatNumber: activeSeat.seatNumber,
      row: activeSeat.row,
      column: activeSeat.col,
      studentName,
      gender,
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

  // VISTA 1: Selector de Curso inicial (No muestra el mapa de golpe)
  if (!selectedCourse) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themeColors.background },
        ]}
      >
        <Header
          title="Asignación de Clases"
          subtitle="Selecciona un curso para ver su aula y pupitres"
        />

        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const linkedRoom = classrooms.find(
              (c) => c.id === item.classroomId
            );
            const courseAssignments = assignments.filter(
              (a) => a.courseId === item.id
            );

            return (
              <TouchableOpacity
                style={[
                  styles.courseCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border,
                  },
                ]}
                onPress={() => setSelectedCourseId(item.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.courseColorBar, { backgroundColor: item.color }]}
                />
                <View style={styles.courseCardBody}>
                  <View style={styles.courseCardHeader}>
                    <View style={styles.courseMainInfo}>
                      <Text
                        style={[styles.courseName, { color: themeColors.text }]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.courseCode,
                          { color: themeColors.textMuted },
                        ]}
                      >
                        {item.code} • 👨‍🏫 {item.teacher}
                      </Text>
                    </View>
                    <Text style={[styles.arrow, { color: themeColors.primary }]}>
                      Entrar →
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.courseFooter,
                      { borderTopColor: themeColors.border },
                    ]}
                  >
                    {linkedRoom ? (
                      <Badge
                        label={`🏛️ ${linkedRoom.name} (${linkedRoom.totalSeats} pupitres)`}
                        variant="primary"
                      />
                    ) : (
                      <Badge label="⚠️ Sin Aula Asignada" variant="neutral" />
                    )}

                    <Text
                      style={[
                        styles.occupancyBadge,
                        { color: themeColors.textMuted },
                      ]}
                    >
                      {courseAssignments.length} alumnos asignados
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📚</Text>
              <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
                No hay cursos disponibles
              </Text>
              <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
                Crea primero un curso en la pestaña "Cursos" para empezar.
              </Text>
            </View>
          }
        />
      </View>
    );
  }

  // VISTA 2: Si el curso seleccionado no tiene aula
  if (!selectedClassroom) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themeColors.background },
        ]}
      >
        <Header
          title={selectedCourse.name}
          subtitle="Curso sin aula física"
          rightActionText="← Volver"
          onRightActionPress={() => setSelectedCourseId(null)}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🏛️</Text>
          <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
            Este curso no tiene aula asignada
          </Text>
          <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
            Ve a la pestaña "Cursos", edita "{selectedCourse.name}" y selecciónale
            un aula física con pupitres.
          </Text>
          <Button
            title="Volver a Seleccionar Curso"
            onPress={() => setSelectedCourseId(null)}
          />
        </View>
      </View>
    );
  }

  // VISTA 3: Aula interactiva del curso seleccionado
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Header
        title={selectedCourse.name}
        subtitle={`Aula: ${selectedClassroom.name} (${selectedClassroom.code})`}
        rightActionText="← Cursos"
        onRightActionPress={() => setSelectedCourseId(null)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Barra de progreso de ocupación */}
        <OccupancySummary
          totalSeats={selectedClassroom.totalSeats}
          occupiedSeats={currentAssignments.length}
        />

        {/* Selector de modo: Mapa de Pupitres o Lista de Alumnos */}
        <View
          style={[
            styles.modeSwitch,
            {
              backgroundColor: themeColors.surfaceVariant,
              borderColor: themeColors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.modeBtn,
              viewMode === 'map'
                ? { backgroundColor: themeColors.surface }
                : null,
            ]}
            onPress={() => setViewMode('map')}
          >
            <Text
              style={[
                styles.modeBtnText,
                {
                  color:
                    viewMode === 'map'
                      ? themeColors.primary
                      : themeColors.textMuted,
                  fontWeight: viewMode === 'map' ? '700' : '500',
                },
              ]}
            >
              🏛️ Mapa del Aula
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeBtn,
              viewMode === 'students'
                ? { backgroundColor: themeColors.surface }
                : null,
            ]}
            onPress={() => setViewMode('students')}
          >
            <Text
              style={[
                styles.modeBtnText,
                {
                  color:
                    viewMode === 'students'
                      ? themeColors.primary
                      : themeColors.textMuted,
                  fontWeight: viewMode === 'students' ? '700' : '500',
                },
              ]}
            >
              👥 Alumnos ({currentAssignments.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Renderizado condicional según modo */}
        {viewMode === 'map' ? (
          <View style={styles.gridSection}>
            <SeatGrid
              classroom={selectedClassroom}
              assignments={currentAssignments}
              selectedSeatNumber={activeSeat?.seatNumber}
              onSelectSeat={handleSeatClick}
            />
          </View>
        ) : (
          <StudentVisualList
            assignments={currentAssignments}
            course={selectedCourse}
            onSelectStudent={(assignment) => {
              handleSeatClick(
                assignment.seatNumber,
                assignment.row,
                assignment.column,
                assignment
              );
            }}
          />
        )}
      </ScrollView>

      {/* Modal para asignar o editar alumno en pupitre */}
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
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  courseCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  courseColorBar: {
    width: 6,
  },
  courseCardBody: {
    flex: 1,
    padding: 14,
  },
  courseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseMainInfo: {
    flex: 1,
    marginRight: 8,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '700',
  },
  courseCode: {
    fontSize: 12,
    marginTop: 2,
  },
  arrow: {
    fontSize: 14,
    fontWeight: '700',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  occupancyBadge: {
    fontSize: 12,
  },
  modeSwitch: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
    marginBottom: 16,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeBtnText: {
    fontSize: 13,
  },
  gridSection: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
});
