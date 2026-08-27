import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "@rneui/themed";
import { colors, radii } from "../theme";

interface Option {
  id: string;
  nome: string;
  sigla?: string;
  aliquot?: string;
}

interface SelectFieldProps {
  value: string;
  placeholder: string;
  icon: string;
  options: Option[];
  error?: boolean;
  onPress: () => void;
}

export default function SelectField({
  value,
  placeholder,
  icon,
  options,
  error,
  onPress,
}: SelectFieldProps) {
  const selectedOption = options.find(
    (option) =>
      option.id === value ||
      option.sigla === value ||
      option.nome.toLowerCase() === value.toLowerCase()
  );

  return (
    <View style={[styles.inputGroup, error && styles.inputError]}>
      <Icon name={icon} type="font-awesome-5" color={colors.muted} size={16} />
      <TouchableOpacity style={styles.selector} onPress={onPress}>
        <Text style={[styles.selectorText, !value && styles.placeholderText]}>
          {selectedOption
            ? selectedOption.nome || selectedOption.sigla
            : placeholder}
        </Text>
      </TouchableOpacity>
      <Icon
        name="chevron-down"
        type="font-awesome-5"
        color={colors.muted}
        size={12}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  inputError: {
    borderColor: colors.danger,
  },
  selector: {
    flex: 1,
    minHeight: 24,
    justifyContent: "center",
  },
  selectorText: {
    color: colors.text,
    fontSize: 16,
  },
  placeholderText: {
    color: colors.muted,
  },
});
