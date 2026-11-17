# Sistema de Asignación de Aulas, Clases y Asientos (React Native)

Aplicación móvil desarrollada en **React Native + TypeScript** con arquitectura modular por capas para la gestión académica de aulas físicas, cursos/asignaturas y asignación interactiva de asientos a alumnos.

---

## 🏗️ Arquitectura Modular del Proyecto

La estructura del proyecto está organizada en módulos independientes para facilitar su extensión y mantenimiento:

```
├── App.tsx                     # Punto de entrada de la aplicación y navegación principal
├── src/
│   ├── theme/                  # Paleta de colores, espaciados y tipografía centralizada
│   │   ├── colors.ts
│   │   └── index.ts
│   ├── types/                  # Modelos e interfaces de dominio (Classroom, Course, SeatAssignment)
│   │   └── index.ts
│   ├── context/                # Estado global y lógica de negocio reactiva
│   │   └── AppContext.tsx
│   ├── components/common/      # Componentes de UI reutilizables
│   │   ├── Header.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── TabBar.tsx
│   │   └── index.ts
│   └── modules/                # Módulos funcionales de la aplicación
│       ├── classrooms/         # MÓDULO 1: Gestión de Aulas y Salones
│       │   ├── components/
│       │   │   ├── ClassroomCard.tsx
│       │   │   ├── ClassroomModal.tsx
│       │   │   └── SeatGrid.tsx         # Mapa visual interactivo de asientos (filas x columnas)
│       │   ├── screens/
│       │   │   └── ClassroomsScreen.tsx
│       │   └── index.ts
│       ├── courses/            # MÓDULO 2: Gestión de Cursos y Clases
│       │   ├── components/
│       │   │   ├── CourseCard.tsx
│       │   │   └── CourseModal.tsx      # Formulario con vinculación de aula
│       │   ├── screens/
│       │   │   └── CoursesScreen.tsx
│       │   └── index.ts
│       └── assignments/        # MÓDULO 3: Asignación Interactiva de Asientos
│           ├── components/
│           │   ├── SeatAssignmentModal.tsx  # Asignación de estudiante a asiento
│           │   └── OccupancySummary.tsx     # Métricas y barra de porcentaje de ocupación
│           ├── screens/
│           │   └── AssignmentsScreen.tsx    # Vista completa interactiva de asignaciones
│           └── index.ts
```

---

## 🚀 Características Principales

1. **Gestión de Aulas / Salones:**
   - Creación y edición de aulas con nombre, código y descripción.
   - Definición dinámica de filas y columnas (cálculo automático del total de asientos).
   - Paleta de color distintiva para cada aula.
   - Visor previo de la distribución de asientos con indicador de pizarra.

2. **Gestión de Cursos / Asignaturas:**
   - Creación de cursos con profesor, horario y código.
   - Vinculación directa con el aula física asignada.
   - Botón directo para saltar a la gestión de asientos de ese curso.

3. **Asignación de Asientos:**
   - Selector rápido entre los cursos creados.
   - Resumen en tiempo real de asientos libres, ocupados y porcentaje de ocupación.
   - Mapa interactivo de asientos:
     - Asiento libre (Gris) -> Al tocar, abre el modal para asignar alumno (Nombre, Matrícula, Notas).
     - Asiento ocupado (Rojo) -> Muestra la inicial del alumno y permite ver detalles o liberar el asiento.
     - Asiento seleccionado (Azul).
   - Lista detallada de alumnos asignados por número de asiento y fila/columna.

---

## 🛠️ Ejecución Local

Para ejecutar el proyecto en tu entorno de desarrollo:

```bash
# Iniciar con Expo
npx expo start

# Para abrir en Android
npx expo start --android

# Para abrir en navegador web
npx expo start --web
```
