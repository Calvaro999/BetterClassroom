import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Folder, Course, Classroom, SeatAssignment } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../../components/common';

interface FolderAccordionItemProps {
  folder: Folder | { id: string; name: string; isDefault?: boolean };
  courses: Course[];
  classrooms: Classroom[];
  assignments: SeatAssignment[];
  isExpanded: boolean;
  onToggle: () => void;
  onSelectCourse: (courseId: string) => void;
  onDeleteFolder?: () => void;
}

export const FolderAccordionItem: React.FC<FolderAccordionItemProps> = ({
  folder,
  courses,
  classrooms,
  assignments,
  isExpanded,
  onToggle,
  onSelectCourse,
  onDeleteFolder,
}) => {
  const { themeColors } = useApp();
  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const chevronRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View
      style={[
        styles.folderCard,
        {
          backgroundColor: themeColors.surface,
          borderColor: isExpanded ? themeColors.primary : themeColors.border,
        },
      ]}
    >
      {/* Cabecera de la Carpeta (Tocar para desplegar) */}
      <TouchableOpacity
        style={[
          styles.folderHeader,
          isExpanded
            ? { backgroundColor: themeColors.primaryLight }
            : null,
        ]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.folderIcon}>{isExpanded ? '📂' : '📁'}</Text>
          <View style={styles.folderTitles}>
            <Text
              style={[
                styles.folderName,
                {
                  color: isExpanded
                    ? themeColors.primaryDark
                    : themeColors.text,
                },
              ]}
            >
              {folder.name}
            </Text>
            <Text style={[styles.folderCount, { color: themeColors.textMuted }]}>
              {courses.length} {courses.length === 1 ? 'clase / curso' : 'clases / cursos'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {onDeleteFolder ? (
            <TouchableOpacity
              onPress={onDeleteFolder}
              style={styles.deleteBtn}
              activeOpacity={0.7}
            >
              <Text style={[styles.deleteText, { color: themeColors.danger }]}>
                Eliminar
              </Text>
            </TouchableOpacity>
          ) : null}

          <Animated.Text
            style={[
              styles.chevron,
              {
                color: isExpanded ? themeColors.primary : themeColors.textMuted,
                transform: [{ rotate: chevronRotate }],
              },
            ]}
          >
            ▶
          </Animated.Text>
        </View>
      </TouchableOpacity>

      {/* Contenido Desplegable: Lista de Cursos dentro de la carpeta */}
      {isExpanded && (
        <View
          style={[
            styles.folderBody,
            { borderTopColor: themeColors.border },
          ]}
        >
          {courses.length === 0 ? (
            <View style={styles.emptyFolder}>
              <Text
                style={[
                  styles.emptyFolderText,
                  { color: themeColors.textMuted },
                ]}
              >
                No hay clases asignadas a esta carpeta todavía. Ve a "Cursos",
                edita un curso y selecciona esta carpeta.
              </Text>
            </View>
          ) : (
            courses.map((course) => {
              const classroom = classrooms.find(
                (c) => c.id === course.classroomId
              );
              const courseAssignments = assignments.filter(
                (a) => a.courseId === course.id
              );

              return (
                <TouchableOpacity
                  key={course.id}
                  style={[
                    styles.classCard,
                    {
                      backgroundColor: themeColors.surfaceVariant,
                      borderColor: themeColors.border,
                    },
                  ]}
                  onPress={() => onSelectCourse(course.id)}
                  activeOpacity={0.75}
                >
                  <View
                    style={[
                      styles.classColorStrip,
                      { backgroundColor: course.color },
                    ]}
                  />

                  <View style={styles.classInfo}>
                    <View style={styles.classTopRow}>
                      <Text
                        style={[styles.className, { color: themeColors.text }]}
                      >
                        {course.name}
                      </Text>
                      <Text
                        style={[
                          styles.classCode,
                          { color: themeColors.textMuted },
                        ]}
                      >
                        {course.code}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.classTeacher,
                        { color: themeColors.textMuted },
                      ]}
                    >
                      👨‍🏫 {course.teacher} • 🕒 {course.schedule}
                    </Text>

                    <View style={styles.classFooter}>
                      {classroom ? (
                        <Badge
                          label={`🏛️ ${classroom.name} (${classroom.totalSeats} pupitres)`}
                          variant="primary"
                        />
                      ) : (
                        <Badge label="⚠️ Sin Aula Asignada" variant="neutral" />
                      )}

                      <View
                        style={[
                          styles.enterBtn,
                          { backgroundColor: themeColors.primary },
                        ]}
                      >
                        <Text style={styles.enterBtnText}>
                          Ver Aula ({courseAssignments.length}) →
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  folderCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  folderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  folderIcon: {
    fontSize: 26,
  },
  folderTitles: {
    flex: 1,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '700',
  },
  folderCount: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 14,
    fontWeight: '700',
  },
  folderBody: {
    padding: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  emptyFolder: {
    padding: 16,
    alignItems: 'center',
  },
  emptyFolderText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  classCard: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  classColorStrip: {
    width: 6,
  },
  classInfo: {
    flex: 1,
    padding: 12,
  },
  classTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  className: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  classCode: {
    fontSize: 11,
    fontWeight: '600',
  },
  classTeacher: {
    fontSize: 12,
    marginBottom: 10,
  },
  classFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  enterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  enterBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
