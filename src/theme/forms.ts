import { StyleSheet } from "react-native";
import { colors, radii } from "./index";

export const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 8,
    marginLeft: 44,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  formContainer: {
    gap: 14,
    paddingBottom: 32,
  },
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
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    padding: 0,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: radii.md,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
