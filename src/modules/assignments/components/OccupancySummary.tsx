import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme';

interface OccupancySummaryProps {
  totalSeats: number;
  occupiedSeats: number;
}

export const OccupancySummary: React.FC<OccupancySummaryProps> = ({
  totalSeats,
  occupiedSeats,
}) => {
  const freeSeats = Math.max(0, totalSeats - occupiedSeats);
  const percentage = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Ocupación del Aula</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statDotOccupied}>●</Text>
          <Text style={styles.statLabel}>Ocupados:</Text>
          <Text style={styles.statValue}>{occupiedSeats}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statDotFree}>●</Text>
          <Text style={styles.statLabel}>Libres:</Text>
          <Text style={styles.statValue}>{freeSeats}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total:</Text>
          <Text style={styles.statValue}>{totalSeats}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDotOccupied: {
    color: colors.danger,
    fontSize: 14,
  },
  statDotFree: {
    color: colors.success,
    fontSize: 14,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
});
