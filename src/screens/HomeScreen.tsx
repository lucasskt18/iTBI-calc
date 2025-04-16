import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  RegisterProperty: undefined;
  CalculateITBI: undefined;
  ListProperties: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const MenuItem = ({ title, icon, color, onPress }: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.card, { backgroundColor: color }]}
  >
    <Icon name={icon} type="font-awesome-5" color="#FFF" size={24} />
    <Text style={styles.cardText}>{title}</Text>
  </TouchableOpacity>
);

const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 2;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      <View style={styles.header}>
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: '50%', height: 100, resizeMode: "contain" }}
        />
        <Text style={styles.headerTitle}>Cálculo de ITBI</Text>
        <Text style={styles.headerSubtitle}>Selecione uma opção</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.grid}>
          <MenuItem
            title="Cadastrar Imóvel"
            icon="home"
            color="#FF6B6B"
            onPress={() => navigation.navigate("RegisterProperty")}
          />
          <MenuItem
            title="Calcular ITBI"
            icon="calculator"
            color="#4E54C8"
            onPress={() => navigation.navigate("CalculateITBI")}
          />
          <MenuItem
            title="Consultar Imóveis"
            icon="list"
            color="#00B4DB"
            onPress={() => navigation.navigate("ListProperties")}
          />
          <MenuItem
            title="Relatórios"
            icon="chart-bar"
            color="#11998e"
            onPress={() => {}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
  },
  header: {
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    marginTop: 40,
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#8F94FB",
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
  },
  card: {
    width: cardWidth,
    height: 160,
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
});
