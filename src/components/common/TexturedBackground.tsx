import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useApp } from '../../context/AppContext';

export const TexturedBackground: React.FC = () => {
  const { isDarkMode } = useApp();

  // Matriz de filas y columnas de marcas de agua para la textura
  const rows = [0, 1, 2, 3, 4, 5, 6, 7];
  const cols = [0, 1, 2, 3, 4];
  const icons = ['📝', '🪑', '📚', '🏫', '🪑', '📝'];

  return (
    <View style={styles.absoluteContainer} pointerEvents="none">
      {rows.map((r) => (
        <View key={`r-${r}`} style={styles.row}>
          {cols.map((c) => {
            const iconIndex = (r * 5 + c) % icons.length;
            return (
              <Text
                key={`c-${c}`}
                style={[
                  styles.icon,
                  { opacity: isDarkMode ? 0.035 : 0.055 },
                ]}
              >
                {icons[iconIndex]}
              </Text>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-around',
    paddingVertical: 10,
    zIndex: 0,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
  },
});
