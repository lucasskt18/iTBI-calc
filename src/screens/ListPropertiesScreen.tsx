import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Icon } from "@rneui/themed";
import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BackButton from "../components/BackButton";
import ScreenShell from "../components/ScreenShell";
import ConfirmationModal from "../components/ConfirmationModal";
import CalculatorITBI from "../components/CalculatorITBI";
import { getPropertyTypeLabel } from "../constants/propertyTypes";
import {
  listProperties,
  removeProperty,
  updateProperty,
} from "../storage/propertiesStorage";
import { Property } from "../types/property";
import { formatNumberToCurrencyInput, formatStoredMoney, formatStoredPercent } from "../utils/formatCurrency";
import type { RootStackParamList } from "../navigation/types";
import { colors, radii } from "../theme";
import { useScreenInsets } from "../hooks/useScreenInsets";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function ListPropertiesScreen() {
  const navigation = useNavigation<NavigationProps>();
  const insets = useScreenInsets();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadProperties();
    }, [])
  );

  const loadProperties = async () => {
    try {
      const storedProperties = await listProperties();
      setProperties(storedProperties);
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de imóveis.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = (id: string) => {
    setPropertyToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      await removeProperty(propertyToDelete);
      setProperties((current) =>
        current.filter((prop) => prop.id !== propertyToDelete)
      );
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o imóvel.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  const handleEditProperty = (id: string) => {
    navigation.navigate("EditProperty", { propertyId: id });
  };

  const renderProperty = ({ item }: { item: Property }) => {
    const handleSaveCalculation = async (result: {
      valorVenal: number;
      valorTransacao: number;
      aliquotaPercent: number;
      baseCalculo: number;
      itbi: number;
    }) => {
      try {
        const updated = await updateProperty(item.id, {
          venalValue: result.valorVenal.toString(),
          transactionValue: result.valorTransacao.toString(),
          aliquota: result.aliquotaPercent.toString(),
          baseCalculo: result.baseCalculo.toString(),
          itbiValue: result.itbi.toString(),
        });
        setProperties((current) =>
          current.map((prop) => (prop.id === item.id ? updated : prop))
        );
        setShowCalculator(null);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível salvar o cálculo de ITBI.");
      }
    };

    return (
      <View style={styles.propertyCard}>
        <View style={styles.propertyHeader}>
          <Icon name="home" type="font-awesome-5" color={colors.accent} size={16} />
          <Text style={styles.propertyType}>
            {getPropertyTypeLabel(item.type)}
          </Text>
        </View>

        <View style={styles.propertyInfo}>
          <Text style={styles.propertyAddress}>
            {item.address}, {item.neighborhood}
          </Text>
          <Text style={styles.propertyLocation}>
            {item.city}, {item.state}
          </Text>
          <Text style={styles.propertyArea}>Área: {item.area} m²</Text>
          <Text style={styles.propertyOwner}>CEP: {item.cep}</Text>
          <Text style={styles.propertyOwner}>
            Proprietário: {item.property}
          </Text>
          <Text style={styles.propertyPhone}>Telefone: {item.phone}</Text>
          <View style={styles.propertyInfo}>
            <Text style={styles.titleAvaliations}>Avaliação do Imóvel</Text>
            <Text style={styles.propertyOwner}>
              Valor de Transação: R$ {formatStoredMoney(item.transactionValue)}
            </Text>
            <Text style={styles.propertyOwner}>
              Valor Venal: R$ {formatStoredMoney(item.venalValue)}
            </Text>
            <Text style={styles.propertyOwner}>
              Base de cálculo: R$ {formatStoredMoney(item.baseCalculo)}
            </Text>
            <Text style={styles.propertyOwner}>
              Alíquota: {formatStoredPercent(item.aliquota)}
            </Text>
            <Text style={styles.propertyOwner}>
              ITBI: R$ {formatStoredMoney(item.itbiValue)}
            </Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditProperty(item.id)}
          >
            <Icon name="edit" type="font-awesome-5" color="#FFF" size={14} />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteProperty(item.id)}
          >
            <Icon
              name="trash-alt"
              type="font-awesome-5"
              color="#FFF"
              size={14}
            />
            <Text style={styles.actionButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.actionButton, styles.calcButton]}
          onPress={() => setShowCalculator(item.id)}
        >
          <Icon
            name="calculator"
            type="font-awesome-5"
            color="#FFF"
            size={14}
          />
          <Text style={styles.actionButtonText}>Calcular ITBI</Text>
        </TouchableOpacity>
        {showCalculator === item.id && (
          <View style={{ marginTop: 16 }}>
            <CalculatorITBI
              initialValorTransacao={formatNumberToCurrencyInput(
                item.transactionValue
              )}
              initialValorVenal={formatNumberToCurrencyInput(item.venalValue)}
              initialAliquota={item.aliquota ?? ""}
              hasSavedCalculation={!!item.itbiValue}
              onSave={handleSaveCalculation}
            />
            <TouchableOpacity
              style={[styles.actionButton, styles.closeCalcButton]}
              onPress={() => {
                setShowCalculator(null);
              }}
            >
              <Text style={styles.actionButtonText}>Fechar Cálculo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenShell>
      <BackButton />

      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Imóveis Cadastrados</Text>
          <Text style={styles.headerSubtitle}>
            {properties.length} {properties.length === 1 ? "imóvel" : "imóveis"}{" "}
            encontrados
          </Text>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {loading ? (
            <View style={styles.centerContent}>
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : properties.length === 0 ? (
            <View style={styles.centerContent}>
              <Icon name="home" type="font-awesome-5" color={colors.accent} size={44} />
              <Text style={styles.emptyText}>Nenhum imóvel cadastrado</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("RegisterProperty")}
              >
                <Text style={styles.addButtonText}>Cadastrar Novo Imóvel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={properties}
              renderItem={renderProperty}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: insets.scrollBottom },
              ]}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
            />
          )}
        </KeyboardAvoidingView>
      </View>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este imóvel?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingRight: 24,
    paddingLeft: 72,
    paddingTop: 8,
    paddingBottom: 8,
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
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  propertyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  propertyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  propertyType: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  propertyInfo: {
    gap: 6,
  },
  propertyAddress: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  propertyLocation: {
    color: colors.muted,
    fontSize: 14,
  },
  propertyArea: {
    color: colors.muted,
    fontSize: 14,
  },
  propertyOwner: {
    color: colors.muted,
    fontSize: 14,
  },
  propertyPhone: {
    color: colors.muted,
    fontSize: 14,
  },
  titleAvaliations: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 4,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: radii.sm,
  },
  editButton: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deleteButton: {
    backgroundColor: "rgba(225, 90, 90, 0.16)",
  },
  calcButton: {
    backgroundColor: colors.accent,
    marginTop: 10,
  },
  closeCalcButton: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 16,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 16,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: radii.md,
    marginTop: 8,
  },
  addButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
});
