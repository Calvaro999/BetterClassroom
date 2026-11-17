import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Classroom, Course, SeatAssignment, Gender, Folder } from '../../../types';
import {
  Header,
  Button,
  Input,
  TexturedBackground,
} from '../../../components/common';
import { SeatGrid } from '../../classrooms/components/SeatGrid';
import { SeatAssignmentModal } from '../components/SeatAssignmentModal';
import { OccupancySummary } from '../components/OccupancySummary';
import { StudentVisualList } from '../components/StudentVisualList';
import { FolderAccordionItem } from '../components/FolderAccordionItem';

interface AssignmentsScreenProps {
  initialCourseId?: string;
}

export const AssignmentsScreen: React.FC<AssignmentsScreenProps> = ({
  initialCourseId,
}) => {
  const {
    courses,
    classrooms,
    folders,
    assignments,
    addFolder,
    deleteFolder,
    assignSeat,
    unassignSeatByPosition,
    themeColors,
  } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    initialCourseId || null
  );

  // Carpetas expandidas/desplegadas (guarda el id de la carpeta abierta)
  const [expandedFolderIds, setExpandedFolderIds] = useState<{ [id: string]: boolean }>({
    'folder-1': true, // Primera carpeta abierta por defecto
  });

  // Modal para crear nueva carpeta
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Modo de vista dentro del curso seleccionado: 'map' o 'students'
  const [viewMode, setViewMode] = useState<'map' | 'students'>('map');

  // Estado del modal de pupitre
  const [seatModalVisible, setSeatModalVisible] = useState(false);
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

  // Asignaciones del curso y aula actual
  const currentAssignments =
    selectedCourse && selectedClassroom
      ? assignments.filter(
          (a) =>
            a.courseId === selectedCourse.id &&
            a.classroomId === selectedClassroom.id
        )
      : [];

  const toggleFolder = (folderId: string) => {
    setExpandedFolderIds((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el nombre de la carpeta');
      return;
    }
    addFolder(newFolderName.trim());
    setNewFolderName('');
    setFolderModalVisible(false);
  };

  const handleDeleteFolder = (folder: Folder) => {
    Alert.alert(
      'Eliminar Carpeta',
      `¿Deseas eliminar la carpeta "${folder.name}"? Los cursos no se borrarán, solo quedarán sin carpeta.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteFolder(folder.id),
        },
      ]
    );
  };

  const handleSeatClick = (
    seatNumber: number,
    row: number,
    col: number,
    assignment?: SeatAssignment
  ) => {
    setActiveSeat({ seatNumber, row, col, assignment });
    setSeatModalVisible(true);
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

  // Cursos que no tienen carpeta asignada
  const uncategorizedCourses = courses.filter((c) => !c.folderId);

  // VISTA 1: Carpetas Desplegables con sus Clases
  if (!selectedCourse) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themeColors.background },
        ]}
      >
        <TexturedBackground />

        <Header
          title="Asignación de Clases"
          subtitle="Toca una carpeta para desplegar y acceder a sus clases"
          rightActionText="+ Carpeta"
          onRightActionPress={() => setFolderModalVisible(true)}
        />

        <ScrollView contentContainerStyle={styles.scrollList}>
          {/* Carpetas creadas por el usuario */}
          {folders.map((folder) => {
            const folderCourses = courses.filter((c) => c.folderId === folder.id);
            const isExpanded = Boolean(expandedFolderIds[folder.id]);

            return (
              <FolderAccordionItem
                key={folder.id}
                folder={folder}
                courses={folderCourses}
                classrooms={classrooms}
                assignments={assignments}
                isExpanded={isExpanded}
                onToggle={() => toggleFolder(folder.id)}
                onSelectCourse={(courseId) => setSelectedCourseId(courseId)}
                onDeleteFolder={() => handleDeleteFolder(folder)}
              />
            );
          })}

          {/* Carpeta para Cursos sin carpeta */}
          {uncategorizedCourses.length > 0 && (
            <FolderAccordionItem
              key="uncategorized"
              folder={{ id: 'uncategorized', name: 'General / Sin Carpeta', isDefault: true }}
              courses={uncategorizedCourses}
              classrooms={classrooms}
              assignments={assignments}
              isExpanded={Boolean(expandedFolderIds['uncategorized'])}
              onToggle={() => toggleFolder('uncategorized')}
              onSelectCourse={(courseId) => setSelectedCourseId(courseId)}
            />
          )}

          {folders.length === 0 && uncategorizedCourses.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📁</Text>
              <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
                No hay carpetas ni cursos
              </Text>
              <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
                Pulsa en "+ Carpeta" para crear tu primera carpeta organizadora.
              </Text>
              <Button
                title="Crear Nueva Carpeta"
                onPress={() => setFolderModalVisible(true)}
              />
            </View>
          )}
        </ScrollView>

        {/* Modal para crear nueva carpeta */}
        <Modal visible={folderModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalBox,
                { backgroundColor: themeColors.surface },
              ]}
            >
              <Text style={[styles.modalBoxTitle, { color: themeColors.text }]}>
                📁 Crear Nueva Carpeta
              </Text>
              <Text
                style={[styles.modalBoxSubtitle, { color: themeColors.textMuted }]}
              >
                Organiza tus asignaturas por grupos, grados o semestres.
              </Text>

              <Input
                label="Nombre de la Carpeta"
                placeholder="Ej: DAM 1º Año, Grado Medio, Tarde..."
                value={newFolderName}
                onChangeText={setNewFolderName}
                autoFocus
              />

              <View style={styles.modalButtons}>
                <Button
                  title="Cancelar"
                  variant="outline"
                  onPress={() => {
                    setNewFolderName('');
                    setFolderModalVisible(false);
                  }}
                  style={styles.modalBtn}
                />
                <Button
                  title="Crear Carpeta"
                  variant="primary"
                  onPress={handleCreateFolder}
                  style={styles.modalBtn}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // VISTA 2: Si el curso seleccionado no tiene aula física
  if (!selectedClassroom) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themeColors.background },
        ]}
      >
        <TexturedBackground />

        <Header
          title={selectedCourse.name}
          subtitle="Curso sin aula física"
          rightActionText="← Carpetas"
          onRightActionPress={() => setSelectedCourseId(null)}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🏛️</Text>
          <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
            Este curso no tiene aula física asignada
          </Text>
          <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
            Ve a la pestaña "Cursos", edita "{selectedCourse.name}" y selecciónale
            un aula física con pupitres.
          </Text>
          <Button
            title="Volver a las Carpetas"
            onPress={() => setSelectedCourseId(null)}
          />
        </View>
      </View>
    );
  }

  // VISTA 3: Aula interactiva de la clase seleccionada
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <TexturedBackground />

      <Header
        title={selectedCourse.name}
        subtitle={`Aula: ${selectedClassroom.name} (${selectedClassroom.code})`}
        rightActionText="← Carpetas"
        onRightActionPress={() => setSelectedCourseId(null)}
      />

      <ScrollView contentContainerStyle={styles.scrollList}>
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

        {/* Renderizado según modo seleccionado */}
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
        visible={seatModalVisible}
        seatNumber={activeSeat?.seatNumber ?? null}
        row={activeSeat?.row ?? null}
        col={activeSeat?.col ?? null}
        currentAssignment={activeSeat?.assignment}
        classroomName={selectedClassroom.name}
        courseName={selectedCourse.name}
        onClose={() => {
          setSeatModalVisible(false);
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
  scrollList: {
    padding: 16,
    paddingBottom: 40,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    maxWidth: 400,
  },
  modalBoxTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalBoxSubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
  },
});
