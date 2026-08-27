import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { colors, radii } from "../theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  title: string;
  subtitle: string;
  icon: string;
  primary?: boolean;
  onPress: () => void;
}

const MenuItem = ({ title, subtitle, icon, primary, onPress }: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={[styles.menuRow, primary && styles.menuRowPrimary]}
  >
    <View style={[styles.iconWrap, primary && styles.iconWrapPrimary]}>
      <Icon
        name={icon}
        type="font-awesome-5"
        color={primary ? colors.text : colors.accent}
        size={18}
      />
    </View>
    <View style={styles.menuCopy}>
      <Text style={[styles.menuTitle, primary && styles.menuTitlePrimary]}>{title}</Text>
      <Text style={[styles.menuSubtitle, primary && styles.menuSubtitlePrimary]}>{subtitle}</Text>
    </View>
    <Icon
      name="chevron-right"
      type="font-awesome-5"
      color={primary ? "rgba(255,255,255,0.7)" : colors.muted}
      size={12}
    />
  </TouchableOpacity>
);

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <LinearGradient
        colors={[colors.bg, "#12151F", colors.bg]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
        />
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>ITBI</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.kicker}>Estimativa municipal</Text>
        <Text style={styles.textFirstCta}>Vai comprar um imóvel?</Text>
        <Text style={styles.textSecondCta}>
          Descubra o valor do seu ITBI de forma rápida, segura e descomplicada.
        </Text>
      </View>

      <View style={styles.content}>
        <MenuItem
          title="Cadastrar Imóvel"
          subtitle="Endereço, área e proprietário"
          icon="home"
          primary
          onPress={() => navigation.navigate("RegisterProperty")}
        />
        <MenuItem
          title="Consultar e calcular"
          subtitle="Lista, edição e ITBI"
          icon="list"
          onPress={() => navigation.navigate("ListProperties")}
        />
        <MenuItem
          title="Sobre o projeto"
          subtitle="Equipe e apresentação"
          icon="info-circle"
          onPress={() => navigation.navigate("AboutUs")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logo: {
    width: 148,
    height: 48,
    resizeMode: "contain",
  },
  headerBadge: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  headerBadgeText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 12,
  },
  kicker: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  textFirstCta: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  textSecondCta: {
    fontSize: 16,
    color: colors.muted,
    lineHeight: 24,
    maxWidth: 320,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 12,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  menuRowPrimary: {
    backgroundColor: colors.accent,
    borderColor: "transparent",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.accentMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapPrimary: {
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  menuCopy: {
    flex: 1,
  },
  menuTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  menuTitlePrimary: {
    color: "#FFF",
  },
  menuSubtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  menuSubtitlePrimary: {
    color: "rgba(255,255,255,0.82)",
  },
});
