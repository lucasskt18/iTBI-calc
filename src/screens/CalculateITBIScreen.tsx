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
import { ESTADOS_BRASILEIROS } from "./RegisterPropertyScreen";
import calculateITBI from "../utils/calculeteITBI"; // Import the calculateITBI function

interface ESTADOS_BRASILEIROS {
  id: string;
  nome: string;
  sigla: string;
  aliquot?: number;
}

interface FormErrors {
  state?: string;
  aliquot?: string;
  propertyValue?: string;
  venalValue?: string;
  phone?: string;
}

interface SelectFieldProps {
  value: string;
  placeholder: string;
  icon: string;
  options: Array<{
    id: string;
    nome: string;
    label: string;
    value: number;
    aliquot?: number;
  }>;
  error: boolean;
  onPress: () => void;
  onSelect?: (selectedValue: any) => void; // Add onSelect prop
}

interface SelectModalProps {
  visible: boolean;
  title: string;
  options: Array<{
    id: string;
    nome: string;
    sigla: string;
    aliquot?: number; // Inclua a propriedade aliquot
  }>;
  onSelect: (selectedOption: {
    id: string;
    nome: string;
    sigla: string;
    aliquot?: number;
  }) => void;
  onClose: () => void;
}

export default function CalculateITBIScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    state: "",
    aliquot: "",
    propertyValue: "",
    venalValue: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [aliquot, setAliquot] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.state.trim()) {
      newErrors.state = "Estado é obrigatório";
      isValid = false;
    }

    if (!formData.aliquot.trim()) {
      newErrors.aliquot = "Alíquota é obrigatória";
      isValid = false;
    }

    if (!formData.propertyValue.toString().trim()) {
      newErrors.propertyValue = "Valor do imóvel é obrigatório";
      isValid = false;
    }

    if (!formData.venalValue.toString().trim()) {
      newErrors.venalValue = "Valor venal é obrigatório";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };



  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFormData({
      state: "",
      aliquot: "",
      propertyValue: "",
      venalValue: "",
      phone: "",
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
            <View
              style={[styles.inputGroup, errors.phone && styles.inputError]}
            >
              <Icon
                name="id-card"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <TextInput
                style={styles.input}
                placeholder="Telefone do Proprietário"
                placeholderTextColor="#8F94FB"
                keyboardType="numeric"
                value={formData.phone}
                maxLength={11}
                onChangeText={(text) => {
                  setFormData({ ...formData, phone: text });

                  if (errors.phone) {
                    setErrors({ ...errors, phone: undefined });
                  }
                }}
              />
            </View>
            {renderError("phone")}
          </View>

          <View>
            <SelectField
              value={formData.state}
              placeholder="Estado"
              icon="flag"
              options={ESTADOS_BRASILEIROS.map((estado) => ({
                ...estado,
                aliquot: estado.aliquot?.toString() ?? "0", // Ensure aliquot is handled safely
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
                value={formData.aliquot}
                editable={false}
              />
            </View>
            {renderError("aliquot")}
          </View>

          <View>
            <View
              style={[
                styles.inputGroup,
                errors.propertyValue && styles.inputError,
              ]}
            >
              <Icon
                name="money-bill-wave"
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
          </View>

          <View>
            <View
              style={[
                styles.inputGroup,
                errors.venalValue && styles.inputError,
              ]}
            >
              <Icon
                name="balance-scale"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <TextInput
                style={styles.input}
                placeholder="Valor Venal"
                placeholderTextColor="#8F94FB"
                value={formData.venalValue}
                keyboardType="numeric"
                onChangeText={(text) => {
                  setFormData({ ...formData, venalValue: text });
                  if (errors.venalValue) {
                    setErrors({ ...errors, venalValue: undefined });
                  }
                }}
              />
            </View>
            {renderError("venalValue")}
          </View>

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={() => calculateITBI(formData, aliquot ?? 0, validateForm, setErrorMessage, setShowErrorModal, setResult, setShowSuccessModal)}

          >
            <Text style={styles.calculateButtonText}>Calcular ITBI</Text>
          </TouchableOpacity>
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
          const selectedState = estado as { sigla: string; aliquot?: number }; // Type assertion
          setFormData({
            ...formData,
            state: selectedState.sigla ?? "",
            aliquot: selectedState.aliquot?.toString() ?? "0", // Atualiza a alíquota no formData
          });
          setAliquot(selectedState.aliquot ?? null); // Atualiza o estado aliquot
          setShowStateModal(false); // Fecha o modal após a seleção
        }}
        onClose={() => setShowStateModal(false)}
      />

      <SuccessModal
        visible={showSuccessModal}
        title="Cálculo Realizado"
        message={
          result !== null ? (
            <>
              <Text style={styles.itbiResult}>
                ITBI: R${" "}
                {result.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.aliquotResult}>
                Alíquota: {aliquot?.toString() ?? "0"}%
              </Text>
            </>
          ) : null
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
  itbiResult: {
    color: "#8F94FB",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  aliquotResult: {
    color: "#8F94FB",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
});
