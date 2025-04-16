import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import ErrorModal from "../components/ErrorModal";
import SuccessModal from "../components/SuccessModal";
import SelectField from "../components/SelectField";
import SelectModal from "../components/SelectModal";
import { ESTADOS_BRASILEIROS } from "../screens/RegisterPropertyScreen";

interface FormErrors {
  state?: string;
  aliquot?: string | number;
  propertyValue?: string | number;
}

export default function CalculateITBIScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    state: "",
    aliquot: "",
    propertyValue: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<number | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [aliquota, setAliquota] = useState<number | null>(null);
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      aliquot: undefined,
    };
    let isValid = true;

    if (!formData.state.trim()) {
      newErrors.state = "Estado é obrigatório";
      isValid = false;
    }

    if (!formData.aliquot.trim()) {
      newErrors.aliquot = "Alíquota é obrigatória"; // Validação da alíquota
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateITBI = () => {
    if (!validateForm()) {
      setErrorMessage("Por favor, preencha todos os campos corretamente.");
      setShowErrorModal(true);
      return;
    }

    const value = parseFloat(formData.propertyValue);

    if (!aliquota) {
      setErrorMessage("Selecione um estado para calcular a alíquota.");
      setShowErrorModal(true);
      return;
    }

    const itbi = (value * aliquota) / 100; // Calcula o ITBI com base na alíquota
    setResult(itbi);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFormData({
      state: "",
      aliquot: "",
      propertyValue: "",
    });
    setResult(null);
  };

  const renderError = (field: keyof FormErrors) => {
    return errors[field] ? (
      <Text style={styles.errorText}>{errors[field]}</Text>
    ) : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      <BackButton />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calcular ITBI</Text>
        <Text style={styles.headerSubtitle}>
          Informe os dados para o cálculo
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <View>
            <SelectField
              value={formData.state}
              placeholder="Estado"
              icon="flag"
              options={ESTADOS_BRASILEIROS.map((estado) => ({
                ...estado,
                aliquot: estado.aliquot.toString(),
              }))}
              error={!!errors.state}
              onPress={() => setShowStateModal(true)}
            />
            {renderError("state")}
          </View>

          <View>
            <View
              style={[
              styles.inputGroup,
              ...(errors.aliquot ? [styles.inputError] : []),
              ]}
            >
              <Icon
              name="percent"
              type="font-awesome-5"
              color="#8F94FB"
              size={20}
              />
              <TextInput
              style={styles.input}
              placeholder="Alíquota"
              placeholderTextColor="#8F94FB"
              value={aliquota !== null ? aliquota.toString() : ""}
              editable={false}
              />
            </View>
            {renderError("propertyValue")}
          </View>

          {/* <View>
            <View
              style={[
                styles.inputGroup,
                ...(errors.propertyValue ? [styles.inputError] : []),
              ]}
            >
              <Icon
                name="dollar-sign"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <TextInput
                style={styles.input}
                placeholder="Valor do Imóvel"
                placeholderTextColor="#8F94FB"
                keyboardType="numeric"
                value={formData.propertyValue}
                onChangeText={(text) => {
                  setFormData({ ...formData, propertyValue: text });
                  if (errors.propertyValue) {
                    setErrors({ ...errors, propertyValue: undefined });
                  }
                }}
              />
            </View>
            {renderError("propertyValue")}
          </View> */}

          {/* <View>
            <View
              style={[
                styles.inputGroup,
                ...(errors.propertyValue ? [styles.inputError] : []),
              ]}
            >
              <Icon
                name="receipt"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <TextInput
                style={styles.input}
                placeholder="Valor Venal"
                placeholderTextColor="#8F94FB"
                keyboardType="numeric"
                value={formData.propertyValue}
                onChangeText={(text) => {
                  setFormData({ ...formData, propertyValue: text });
                  if (errors.propertyValue) {
                    setErrors({ ...errors, propertyValue: undefined });
                  }
                }}
              />
            </View>
            {renderError("propertyValue")}
          </View> */}

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={calculateITBI}
          >
            <Text style={styles.calculateButtonText}>Calcular ITBI</Text>
          </TouchableOpacity>

          {result !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Valor do ITBI:</Text>
              <Text style={styles.resultValue}>
                R${" "}
                {result.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.resultInfo}>
                Taxa aplicada: 2% do valor do imóvel
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <ErrorModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />

      <SelectModal
        visible={showStateModal}
        title="Selecione o Estado"
        options={ESTADOS_BRASILEIROS}
        onSelect={(estado) => {
          setFormData({ ...formData, state: estado.sigla ?? "" }); // Atualiza o estado selecionado
          if ("aliquota" in estado && typeof estado.aliquota === "number") {
            setAliquota(estado.aliquota); // Atualiza a alíquota com base no estado
          } else {
            setAliquota(null); // Define como null caso a alíquota não esteja disponível
          }
          setShowStateModal(false); // Fecha o modal
        }}
        onClose={() => setShowStateModal(false)}
      />

      <SuccessModal
        visible={showSuccessModal}
        title="Cálculo Realizado"
        message={
          result
            ? `Valor do ITBI: R$ ${result.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
        
        Taxa aplicada: 2% do valor do imóvel`
            : ""
        }
        onClose={handleCloseSuccessModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    marginLeft: 50,
  },
  headerTitle: {
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
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252544",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 15,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    padding: 0,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
  calculateButton: {
    backgroundColor: "#4E54C8",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  calculateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    backgroundColor: "#252544",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  resultLabel: {
    color: "#8F94FB",
    fontSize: 16,
    marginBottom: 8,
  },
  resultValue: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultInfo: {
    color: "#8F94FB",
    fontSize: 14,
    opacity: 0.8,
  },
});
