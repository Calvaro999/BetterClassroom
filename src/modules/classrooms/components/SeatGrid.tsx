import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Classroom, SeatAssignment } from '../../../types';
import { colors } from '../../../theme';

interface SeatGridProps {
  classroom: Classroom;
  assignments?: SeatAssignment[];
  selectedSeatNumber?: number | null;
  onSelectSeat?: (seatNumber: number, row: number, col: number, currentAssignment?: SeatAssignment) => void;
  readOnly?: boolean;
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  classroom,
  assignments = [],
  selectedSeatNumber,
  onSelectSeat,
  readOnly = false,
}) => {
  const { rows, columns } = classroom;

  // Mapa de asignaciones por número de asiento para acceso O(1)
  const assignmentMap = new Map<number, SeatAssignment>();
  assignments.forEach((a) => {
    assignmentMap.set(a.seatNumber, a);
  });

  const renderGrid = () => {
    const gridRows = [];

    for (let r = 1; r <= rows; r++) {
      const rowSeats = [];
      for (let c = 1; c <= columns; c++) {
        const seatNum = (r - 1) * columns + c;
        const assignment = assignmentMap.get(seatNum);
        const isOccupied = Boolean(assignment);
        const isSelected = selectedSeatNumber === seatNum;

        let seatBg = colors.surfaceVariant;
        let borderColor = colors.border;
        let textColor = colors.text;

        if (isSelected) {
          seatBg = colors.primary;
          borderColor = colors.primaryDark;
          textColor = colors.white;
        } else if (isOccupied) {
          seatBg = colors.dangerLight;
          borderColor = colors.danger;
          textColor = colors.danger;
        }

        rowSeats.push(
          <TouchableOpacity
            key={`seat-${seatNum}`}
            style={[
              styles.seat,
              { backgroundColor: seatBg, borderColor },
            ]}
            onPress={() => {
              if (!readOnly && onSelectSeat) {
                onSelectSeat(seatNum, r, c, assignment);
              }
            }}
            disabled={readOnly}
            activeOpacity={0.7}
          >
            <Text style={[styles.seatNumber, { color: textColor }]}>
              {seatNum}
            </Text>
            {isOccupied && (
              <Text
                style={styles.studentInitial}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {assignment?.studentName?.charAt(0) || '●'}
              </Text>
            )}
          </TouchableOpacity>
        );
      }

      gridRows.push(
        <View key={`row-${r}`} style={styles.rowContainer}>
          <Text style={styles.rowLabel}>F{r}</Text>
          <View style={styles.seatsRow}>{rowSeats}</View>
        </View>
      );
    }

    return gridRows;
  };

  return (
    <View style={styles.container}>
      {/* Indicador de Pizarra / Frente del aula */}
      <View style={styles.boardIndicator}>
        <View style={styles.boardLine} />
        <Text style={styles.boardText}>PIZARRA / PROFESOR</Text>
        <View style={styles.boardLine} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.gridWrapper}>{renderGrid()}</View>
      </ScrollView>

      {/* Leyenda explicativa */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]} />
          <Text style={styles.legendText}>Libre</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: colors.dangerLight, borderColor: colors.danger }]} />
          <Text style={styles.legendText}>Ocupado</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: colors.primary, borderColor: colors.primaryDark }]} />
          <Text style={styles.legendText}>Seleccionado</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  boardIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  boardLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.borderDark,
  },
  boardText: {
    paddingHorizontal: 12,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  gridWrapper: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    width: 24,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  seatsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  seat: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  studentInitial: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.danger,
    marginTop: -2,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
