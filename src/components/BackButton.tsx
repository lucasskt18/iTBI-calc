import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { colors, radii } from "../theme";

export default function BackButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.goBack()}
      activeOpacity={0.8}
    >
      <Icon name="arrow-left" type="font-awesome-5" color={colors.text} size={16} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 56,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
