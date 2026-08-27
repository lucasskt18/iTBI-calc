import React from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import { colors } from "../theme";

type Props = {
  children: React.ReactNode;
};

export default function ScreenShell({ children }: Props) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
