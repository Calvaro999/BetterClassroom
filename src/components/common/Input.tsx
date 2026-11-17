import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useApp } from '../../context/AppContext';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...rest
}) => {
  const { themeColors } = useApp();

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: themeColors.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeColors.surfaceVariant,
            borderColor: themeColors.border,
            color: themeColors.text,
          },
          error ? { borderColor: themeColors.danger, backgroundColor: themeColors.dangerLight } : null,
          style,
        ]}
        placeholderTextColor={themeColors.textLight}
        {...rest}
      />
      {error ? (
        <Text style={[styles.errorText, { color: themeColors.danger }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
