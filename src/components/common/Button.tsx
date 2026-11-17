import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useApp } from '../../context/AppContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const { themeColors } = useApp();

  const getContainerStyle = () => {
    const base: ViewStyle[] = [styles.button, styles[`size_${size}`]];
    if (variant === 'primary') base.push({ backgroundColor: themeColors.primary });
    if (variant === 'secondary') base.push({ backgroundColor: themeColors.primaryDark });
    if (variant === 'danger') base.push({ backgroundColor: themeColors.danger });
    if (variant === 'success') base.push({ backgroundColor: themeColors.success });
    if (variant === 'outline') {
      base.push({
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: themeColors.primary,
      });
    }
    if (disabled || loading) base.push(styles.btnDisabled);
    if (style) base.push(style);
    return base;
  };

  const getTextStyle = () => {
    const base: TextStyle[] = [styles.text, styles[`textSize_${size}`]];
    if (variant === 'outline') base.push({ color: themeColors.primary });
    else base.push({ color: '#FFFFFF' });
    if (disabled) base.push({ color: themeColors.textMuted });
    if (textStyle) base.push(textStyle);
    return base;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? themeColors.primary : '#FFFFFF'}
        />
      ) : (
        <>
          {icon ? icon : null}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  size_sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  size_md: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  size_lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  textSize_sm: {
    fontSize: 13,
  },
  textSize_md: {
    fontSize: 15,
  },
  textSize_lg: {
    fontSize: 17,
  },
});
