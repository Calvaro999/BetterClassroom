import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Classroom, SeatAssignment } from '../../../types';
import { useApp } from '../../../context/AppContext';

interface SeatGridProps {
  classroom: Classroom;
  assignments?: SeatAssignment[];
  selectedSeatNumber?: number | null;
  onSelectSeat?: (seatNumber: number, row: number, col: number, currentAssignment?: SeatAssignment) => void;
  readOnly?: boolean;
}

const AnimatedDesk: React.FC<{
  seatNum: number;
  row: number;
  col: number;
  assignment?: SeatAssignment;
  isSelected: boolean;
  readOnly: boolean;
  onPress: () => void;
}> = ({ seatNum, assignment, isSelected, readOnly, onPress }) => {
  const { themeColors } = useApp();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const isOccupied = Boolean(assignment);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.deskContainer,
          {
            backgroundColor: isSelected
              ? themeColors.primaryLight
              : isOccupied
              ? themeColors.dangerLight
              : themeColors.surfaceVariant,
            borderColor: isSelected
              ? themeColors.primary
              : isOccupied
              ? themeColors.danger
              : themeColors.border,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={readOnly}
        activeOpacity={0.8}
      >
        {/* Respaldo de la silla del pupitre */}
        <View
          style={[
            styles.chairBack,
            {
              backgroundColor: isSelected
                ? themeColors.primary
                : isOccupied
                ? themeColors.danger
                : themeColors.deskChair,
            },
          ]}
        />

        {/* Superficie del pupitre */}
        <View style={styles.deskTop}>
          <Text
            style={[
              styles.seatNumber,
              {
                color: isSelected
                  ? themeColors.primaryDark
                  : isOccupied
                  ? themeColors.danger
                  : themeColors.textMuted,
              },
            ]}
          >
            #{seatNum}
          </Text>

          {isOccupied && assignment ? (
            <View style={styles.studentBadge}>
              <Text style={styles.genderIcon}>
                {assignment.gender === 'Femenino' ? '👩' : '👨'}
              </Text>
              <Text
                style={[
                  styles.studentNameText,
                  { color: themeColors.danger },
                ]}
                numberOfLines={1}
              >
                {assignment.studentName.split(' ')[0]}
              </Text>
            </View>
          ) : (
            <Text style={[styles.freeLabel, { color: themeColors.textLight }]}>
              Libre
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const SeatGrid: React.FC<SeatGridProps> = ({
  classroom,
  assignments = [],
  selectedSeatNumber,
  onSelectSeat,
  readOnly = false,
}) => {
  const { themeColors } = useApp();
  const { rows, columns } = classroom;

  const assignmentMap = new Map<number, SeatAssignment>();
  assignments.forEach((a) => {
    assignmentMap.set(a.seatNumber, a);
  });

  const renderClassroomLayout = () => {
    const gridRows = [];

    for (let r = 1; r <= rows; r++) {
      const rowSeats = [];
      for (let c = 1; c <= columns; c++) {
        const seatNum = (r - 1) * columns + c;
        const assignment = assignmentMap.get(seatNum);
        const isSelected = selectedSeatNumber === seatNum;

        rowSeats.push(
          <AnimatedDesk
            key={`desk-${seatNum}`}
            seatNum={seatNum}
            row={r}
            col={c}
            assignment={assignment}
            isSelected={isSelected}
            readOnly={readOnly}
            onPress={() => {
              if (onSelectSeat) {
                onSelectSeat(seatNum, r, c, assignment);
              }
            }}
          />
        );
      }

      gridRows.push(
        <View key={`row-${r}`} style={styles.rowWrapper}>
          <View
            style={[
              styles.rowIndicator,
              { backgroundColor: themeColors.surfaceVariant },
            ]}
          >
            <Text
              style={[styles.rowIndicatorText, { color: themeColors.textMuted }]}
            >
              F{r}
            </Text>
          </View>
          <View style={styles.rowDesks}>{rowSeats}</View>
        </View>
      );
    }

    return gridRows;
  };

  return (
    <View
      style={[
        styles.classroomRoom,
        {
          backgroundColor: themeColors.surfaceCard,
          borderColor: themeColors.border,
        },
      ]}
    >
      {/* Pizarra tradicional realista */}
      <View style={styles.blackboardFrame}>
        <View style={styles.blackboard}>
          <Text style={styles.blackboardText}>📝 PIZARRA</Text>
        </View>
      </View>

      {/* Mesa del Profesor */}
      <View style={styles.teacherZone}>
        <View
          style={[
            styles.teacherDesk,
            {
              backgroundColor: themeColors.surfaceVariant,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Text style={styles.teacherLaptop}>💻</Text>
          <Text
            style={[styles.teacherDeskText, { color: themeColors.textMuted }]}
          >
            Mesa del Profesor
          </Text>
        </View>
      </View>

      {/* Distribución de pupitres de los alumnos */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollWrapper}
      >
        <View style={styles.roomLayout}>{renderClassroomLayout()}</View>
      </ScrollView>

      {/* Leyenda limpia */}
      <View
        style={[
          styles.legend,
          { borderTopColor: themeColors.border },
        ]}
      >
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              {
                backgroundColor: themeColors.surfaceVariant,
                borderColor: themeColors.border,
              },
            ]}
          />
          <Text style={[styles.legendLabel, { color: themeColors.textMuted }]}>
            Libre
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              {
                backgroundColor: themeColors.dangerLight,
                borderColor: themeColors.danger,
              },
            ]}
          />
          <Text style={[styles.legendLabel, { color: themeColors.textMuted }]}>
            Ocupado
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              {
                backgroundColor: themeColors.primaryLight,
                borderColor: themeColors.primary,
              },
            ]}
          />
          <Text style={[styles.legendLabel, { color: themeColors.textMuted }]}>
            Seleccionado
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  classroomRoom: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
  blackboardFrame: {
    backgroundColor: '#78350F', // Madera
    padding: 4,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  blackboard: {
    backgroundColor: '#064E3B', // Verde pizarra clásico
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blackboardText: {
    color: '#ECFDF5',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 2,
  },
  teacherZone: {
    alignItems: 'center',
    marginBottom: 18,
  },
  teacherDesk: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  teacherLaptop: {
    fontSize: 14,
  },
  teacherDeskText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scrollWrapper: {
    paddingVertical: 4,
    alignItems: 'center',
  },
  roomLayout: {
    gap: 12,
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 26,
    alignItems: 'center',
  },
  rowIndicatorText: {
    fontSize: 10,
    fontWeight: '700',
  },
  rowDesks: {
    flexDirection: 'row',
    gap: 10,
  },
  deskContainer: {
    width: 62,
    height: 56,
    borderRadius: 10,
    borderWidth: 1.5,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chairBack: {
    width: 24,
    height: 4,
    borderRadius: 2,
  },
  deskTop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  seatNumber: {
    fontSize: 11,
    fontWeight: '700',
  },
  studentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    maxWidth: '100%',
  },
  genderIcon: {
    fontSize: 10,
  },
  studentNameText: {
    fontSize: 9,
    fontWeight: '700',
  },
  freeLabel: {
    fontSize: 9,
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
