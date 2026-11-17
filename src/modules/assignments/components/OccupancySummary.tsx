import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../../context/AppContext';

interface OccupancySummaryProps {
  totalSeats: number;
  occupiedSeats: number;
}

export const OccupancySummary: React.FC<OccupancySummaryProps> = ({
  totalSeats,
  occupiedSeats,
}) => {
  const { themeColors } = useApp();
  const freeSeats = Math.max(0, totalSeats - occupiedSeats);
  const percentage = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Ocupación del Aula
        </Text>
        <Text style={[styles.percentage, { color: themeColors.primary }]}>
          {percentage}%
        </Text>
      </View>

      <View
        style={[
          styles.progressBarBg,
          { backgroundColor: themeColors.surfaceVariant },
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            { width: `${percentage}%`, backgroundColor: themeColors.primary },
          ]}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statDotOccupied, { color: themeColors.danger }]}>
            ●
          </Text>
          <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>
            Ocupados:
          </Text>
          <Text style={[styles.statValue, { color: themeColors.text }]}>
            {occupiedSeats}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statDotFree, { color: themeColors.success }]}>
            ●
          </Text>
          <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>
            Libres:
          </Text>
          <Text style={[styles.statValue, { color: themeColors.text }]}>
            {freeSeats}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>
            Total:
          </Text>
          <Text style={[styles.statValue, { color: themeColors.text }]}>
            {totalSeats}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
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
  },
  percentage: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
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
    fontSize: 14,
  },
  statDotFree: {
    fontSize: 14,
  },
  statLabel: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
  },
});
