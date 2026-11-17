export interface Folder {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface Classroom {
  id: string;
  name: string;             // Ej: "Aula Magna"
  code: string;             // Ej: "A-101"
  rows: number;             // Filas de pupitres
  columns: number;          // Columnas de pupitres
  totalSeats: number;       // rows * columns
  color: string;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;             // Ej: "React Native"
  code: string;             // Ej: "RN-101"
  teacher: string;          // Ej: "Prof. Matías"
  schedule: string;         // Ej: "Lunes 16:00"
  classroomId?: string;     // Aula vinculada
  folderId?: string;        // Carpeta organizadora
  color: string;
  createdAt: string;
}

export type Gender = 'Masculino' | 'Femenino' | 'Otro';

export interface SeatAssignment {
  id: string;
  courseId: string;
  classroomId: string;
  seatNumber: number;
  row: number;
  column: number;
  studentName: string;
  gender: Gender;
  assignedAt: string;
}

export type ActiveTab = 'classrooms' | 'courses' | 'assignments';
