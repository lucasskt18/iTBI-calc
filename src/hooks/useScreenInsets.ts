import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Insets that work on iOS and Android, including gesture navigation. */
export function useScreenInsets() {
  const insets = useSafeAreaInsets();

  return {
    top: insets.top,
    bottom: Math.max(insets.bottom, 12),
    backButtonTop: insets.top + 8,
    footerPadding: Math.max(insets.bottom, 12) + 12,
    scrollBottom: Math.max(insets.bottom, 16) + 24,
  };
}
