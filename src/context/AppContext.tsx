import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Classroom, Course, SeatAssignment, Folder } from '../types';
import { lightColors, darkColors, AppThemeColors } from '../theme/colors';

interface AppContextType {
  classrooms: Classroom[];
  courses: Course[];
  assignments: SeatAssignment[];
  folders: Folder[];
  isDarkMode: boolean;
  themeColors: AppThemeColors;
  toggleDarkMode: () => void;
  addClassroom: (classroom: Omit<Classroom, 'id' | 'createdAt'>) => void;
  updateClassroom: (id: string, updates: Partial<Classroom>) => void;
  deleteClassroom: (id: string) => void;
  addCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addFolder: (name: string) => void;
  deleteFolder: (id: string) => void;
  assignSeat: (assignment: Omit<SeatAssignment, 'id' | 'assignedAt'>) => void;
  unassignSeatByPosition: (courseId: string, classroomId: string, seatNumber: number) => void;
  getClassroomById: (id: string) => Classroom | undefined;
  getCourseById: (id: string) => Course | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'folder-1',
    name: 'Grado Superior DAM',
    color: '#9F1239',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'folder-2',
    name: 'Turno de Tarde',
    color: '#881337',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: 'room-1',
    name: 'Aula Magna',
    code: 'A-101',
    rows: 4,
    columns: 5,
    totalSeats: 20,
    color: '#9F1239',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'room-2',
    name: 'Laboratorio de Software',
    code: 'LAB-2',
    rows: 3,
    columns: 6,
    totalSeats: 18,
    color: '#881337',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    name: 'Desarrollo Móvil React Native',
    code: 'RN-101',
    teacher: 'Prof. Matías',
    schedule: 'Lunes y Miércoles 16:00',
    classroomId: 'room-1',
    folderId: 'folder-1',
    color: '#9F1239',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'course-2',
    name: 'Bases de Datos',
    code: 'BD-202',
    teacher: 'Prof. Álvaro',
    schedule: 'Martes y Jueves 18:00',
    classroomId: 'room-2',
    folderId: 'folder-1',
    color: '#BE123C',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_ASSIGNMENTS: SeatAssignment[] = [
  {
    id: 'assign-1',
    courseId: 'course-1',
    classroomId: 'room-1',
    seatNumber: 1,
    row: 1,
    column: 1,
    studentName: 'Carlos García',
    gender: 'Masculino',
    assignedAt: new Date().toISOString(),
  },
  {
    id: 'assign-2',
    courseId: 'course-1',
    classroomId: 'room-1',
    seatNumber: 2,
    row: 1,
    column: 2,
    studentName: 'Ana Rodríguez',
    gender: 'Femenino',
    assignedAt: new Date().toISOString(),
  },
  {
    id: 'assign-3',
    courseId: 'course-1',
    classroomId: 'room-1',
    seatNumber: 6,
    row: 2,
    column: 1,
    studentName: 'David López',
    gender: 'Masculino',
    assignedAt: new Date().toISOString(),
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(INITIAL_CLASSROOMS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
  const [assignments, setAssignments] = useState<SeatAssignment[]>(INITIAL_ASSIGNMENTS);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const themeColors = isDarkMode ? darkColors : lightColors;

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Carpetas
  const addFolder = (name: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: name.trim(),
      color: '#9F1239',
      createdAt: new Date().toISOString(),
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  const deleteFolder = (id: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    setCourses((prev) =>
      prev.map((c) => (c.folderId === id ? { ...c, folderId: undefined } : c))
    );
  };

  // Gestión de Aulas
  const addClassroom = (classroomData: Omit<Classroom, 'id' | 'createdAt'>) => {
    const newClassroom: Classroom = {
      ...classroomData,
      totalSeats: classroomData.rows * classroomData.columns,
      id: `room-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setClassrooms((prev) => [newClassroom, ...prev]);
  };

  const updateClassroom = (id: string, updates: Partial<Classroom>) => {
    setClassrooms((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newRows = updates.rows ?? item.rows;
        const newCols = updates.columns ?? item.columns;
        return {
          ...item,
          ...updates,
          rows: newRows,
          columns: newCols,
          totalSeats: newRows * newCols,
        };
      })
    );
  };

  const deleteClassroom = (id: string) => {
    setClassrooms((prev) => prev.filter((item) => item.id !== id));
    setAssignments((prev) => prev.filter((item) => item.classroomId !== id));
    setCourses((prev) =>
      prev.map((c) => (c.classroomId === id ? { ...c, classroomId: undefined } : c))
    );
  };

  // Gestión de Cursos
  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCourses((prev) => [newCourse, ...prev]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((item) => item.id !== id));
    setAssignments((prev) => prev.filter((item) => item.courseId !== id));
  };

  // Asignaciones
  const assignSeat = (assignmentData: Omit<SeatAssignment, 'id' | 'assignedAt'>) => {
    const filtered = assignments.filter(
      (a) =>
        !(
          a.courseId === assignmentData.courseId &&
          a.classroomId === assignmentData.classroomId &&
          a.seatNumber === assignmentData.seatNumber
        )
    );
    const newAssignment: SeatAssignment = {
      ...assignmentData,
      id: `assign-${Date.now()}`,
      assignedAt: new Date().toISOString(),
    };
    setAssignments([...filtered, newAssignment]);
  };

  const unassignSeatByPosition = (
    courseId: string,
    classroomId: string,
    seatNumber: number
  ) => {
    setAssignments((prev) =>
      prev.filter(
        (a) =>
          !(
            a.courseId === courseId &&
            a.classroomId === classroomId &&
            a.seatNumber === seatNumber
          )
      )
    );
  };

  const getClassroomById = (id: string) => classrooms.find((c) => c.id === id);
  const getCourseById = (id: string) => courses.find((c) => c.id === id);

  return (
    <AppContext.Provider
      value={{
        classrooms,
        courses,
        assignments,
        folders,
        isDarkMode,
        themeColors,
        toggleDarkMode,
        addClassroom,
        updateClassroom,
        deleteClassroom,
        addCourse,
        updateCourse,
        deleteCourse,
        addFolder,
        deleteFolder,
        assignSeat,
        unassignSeatByPosition,
        getClassroomById,
        getCourseById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser utilizado dentro de un AppProvider');
  }
  return context;
};
