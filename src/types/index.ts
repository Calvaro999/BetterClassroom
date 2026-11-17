export interface Classroom {
  id: string;
  name: string;             // Ej: "Aula 101 - Laboratorio Informática"
  code: string;             // Ej: "A-101"
  rows: number;             // Filas de asientos
  columns: number;          // Columnas de asientos
  totalSeats: number;       // Calculado (rows * columns) o capacidad directa
  description?: string;
  color: string;            // Distintivo visual
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;             // Ej: "Desarrollo Móvil React Native"
  code: string;             // Ej: "DAM-202"
  teacher: string;          // Ej: "Prof. Matías"
  schedule: string;         // Ej: "Lun y Mié 16:00 - 18:00"
  classroomId?: string;     // Aula física asignada
  color: string;
  createdAt: string;
}

export interface SeatAssignment {
  id: string;
  courseId: string;
  classroomId: string;
  seatNumber: number;       // Número de asiento (1 a totalSeats)
  row: number;              // Fila (0-indexed o 1-indexed)
  column: number;           // Columna
  studentName: string;      // Nombre del alumno asignado
  studentId?: string;       // DNI o matrícula del alumno
  notes?: string;
  assignedAt: string;
}

export type ActiveTab = 'classrooms' | 'courses' | 'assignments';
