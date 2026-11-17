import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Classroom, Course, SeatAssignment } from '../types';

interface AppContextType {
  classrooms: Classroom[];
  courses: Course[];
  assignments: SeatAssignment[];
  addClassroom: (classroom: Omit<Classroom, 'id' | 'createdAt'>) => void;
  updateClassroom: (id: string, updates: Partial<Classroom>) => void;
  deleteClassroom: (id: string) => void;
  addCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  assignSeat: (assignment: Omit<SeatAssignment, 'id' | 'assignedAt'>) => void;
  unassignSeat: (id: string) => void;
  unassignSeatByPosition: (courseId: string, classroomId: string, seatNumber: number) => void;
  getAssignmentsFor: (courseId: string, classroomId: string) => SeatAssignment[];
  getClassroomById: (id: string) => Classroom | undefined;
  getCourseById: (id: string) => Course | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: 'room-1',
    name: 'Aula Magna',
    code: 'A-101',
    rows: 5,
    columns: 6,
    totalSeats: 30,
    description: 'Aula principal equipada con proyector y climatización',
    color: '#2563EB',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'room-2',
    name: 'Laboratorio de Informática',
    code: 'LAB-2',
    rows: 4,
    columns: 6,
    totalSeats: 24,
    description: 'Laboratorio con ordenadores y conexión de fibra',
    color: '#10B981',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    name: 'Desarrollo Móvil con React Native',
    code: 'RN-101',
    teacher: 'Prof. Matías',
    schedule: 'Lunes y Miércoles 16:00 - 18:00',
    classroomId: 'room-1',
    color: '#7C3AED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'course-2',
    name: 'Bases de Datos Avanzadas',
    code: 'BD-202',
    teacher: 'Prof. Álvaro',
    schedule: 'Martes y Jueves 18:00 - 20:00',
    classroomId: 'room-2',
    color: '#0284C7',
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
    studentId: 'ALU-001',
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
    studentId: 'ALU-002',
    assignedAt: new Date().toISOString(),
  },
  {
    id: 'assign-3',
    courseId: 'course-1',
    classroomId: 'room-1',
    seatNumber: 7,
    row: 2,
    column: 1,
    studentName: 'David López',
    studentId: 'ALU-003',
    assignedAt: new Date().toISOString(),
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(INITIAL_CLASSROOMS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [assignments, setAssignments] = useState<SeatAssignment[]>(INITIAL_ASSIGNMENTS);

  // Funciones de gestión de Aulas / Clases físicas
  const addClassroom = (classroomData: Omit<Classroom, 'id' | 'createdAt'>) => {
    const newClassroom: Classroom = {
      ...classroomData,
      id: `room-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setClassrooms((prev) => [newClassroom, ...prev]);
  };

  const updateClassroom = (id: string, updates: Partial<Classroom>) => {
    setClassrooms((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteClassroom = (id: string) => {
    setClassrooms((prev) => prev.filter((item) => item.id !== id));
    // Limpiar asignaciones asociadas a esta aula
    setAssignments((prev) => prev.filter((item) => item.classroomId !== id));
    // Desvincular de cursos
    setCourses((prev) =>
      prev.map((c) => (c.classroomId === id ? { ...c, classroomId: undefined } : c))
    );
  };

  // Funciones de gestión de Cursos
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
    // Limpiar asignaciones asociadas a este curso
    setAssignments((prev) => prev.filter((item) => item.courseId !== id));
  };

  // Funciones de Asignación de Asientos
  const assignSeat = (assignmentData: Omit<SeatAssignment, 'id' | 'assignedAt'>) => {
    // Si ya existe una asignación en esa posición para este curso y aula, la reemplaza
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

  const unassignSeat = (id: string) => {
    setAssignments((prev) => prev.filter((item) => item.id !== id));
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

  const getAssignmentsFor = (courseId: string, classroomId: string) => {
    return assignments.filter(
      (a) => a.courseId === courseId && a.classroomId === classroomId
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
        addClassroom,
        updateClassroom,
        deleteClassroom,
        addCourse,
        updateCourse,
        deleteCourse,
        assignSeat,
        unassignSeat,
        unassignSeatByPosition,
        getAssignmentsFor,
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
