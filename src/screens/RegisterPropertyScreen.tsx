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
  // Alert,
  // Modal,
} from "react-native";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "../components/BackButton";
import SuccessModal from "../components/SuccessModal";
import SelectField from "../components/SelectField";
import SelectModal from "../components/SelectModal";
import ErrorModal from "../components/ErrorModal";

interface FormErrors {
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  area?: string;
  property?: string;
  type?: string;
  cpf?: string;
}

export const ESTADOS_BRASILEIROS = [
  { id: "AC", nome: "Acre", sigla: "AC", aliquot: 2.0 },
  { id: "AL", nome: "Alagoas", sigla: "AL", aliquot: 2.5 },
  { id: "AP", nome: "Amapá", sigla: "AP", aliquot: 3.0 },
  { id: "AM", nome: "Amazonas", sigla: "AM", aliquot: 2.8 },
  { id: "BA", nome: "Bahia", sigla: "BA", aliquot: 2.2 },
  { id: "CE", nome: "Ceará", sigla: "CE", aliquot: 2.7 },
  { id: "DF", nome: "Distrito Federal", sigla: "DF", aliquot: 3.5 },
  { id: "ES", nome: "Espírito Santo", sigla: "ES", aliquot: 2.4 },
  { id: "GO", nome: "Goiás", sigla: "GO", aliquot: 2.6 },
  { id: "MA", nome: "Maranhão", sigla: "MA", aliquot: 2.3 },
  { id: "MT", nome: "Mato Grosso", sigla: "MT", aliquot: 3.0 },
  { id: "MS", nome: "Mato Grosso do Sul", sigla: "MS", aliquot: 2.9 },
  { id: "MG", nome: "Minas Gerais", sigla: "MG", aliquot: 2.1 },
  { id: "PA", nome: "Pará", sigla: "PA", aliquot: 2.8 },
  { id: "PB", nome: "Paraíba", sigla: "PB", aliquot: 2.5 },
  { id: "PR", nome: "Paraná", sigla: "PR", aliquot: 2.0 },
  { id: "PE", nome: "Pernambuco", sigla: "PE", aliquot: 2.6 },
  { id: "PI", nome: "Piauí", sigla: "PI", aliquot: 2.4 },
  { id: "RJ", nome: "Rio de Janeiro", sigla: "RJ", aliquot: 3.0 },
  { id: "RN", nome: "Rio Grande do Norte", sigla: "RN", aliquot: 2.7 },
  { id: "RS", nome: "Rio Grande do Sul", sigla: "RS", aliquot: 2.3 },
  { id: "RO", nome: "Rondônia", sigla: "RO", aliquot: 2.9 },
  { id: "RR", nome: "Roraima", sigla: "RR", aliquot: 2.8 },
  { id: "SC", nome: "Santa Catarina", sigla: "SC", aliquot: 2.2 },
  { id: "SP", nome: "São Paulo", sigla: "SP", aliquot: 3.2 },
  { id: "SE", nome: "Sergipe", sigla: "SE", aliquot: 2.5 },
  { id: "TO", nome: "Tocantins", sigla: "TO", aliquot: 2.6 },
];

export const TIPOS_IMOVEIS = [
  { id: "casa", nome: "Casa" },
  { id: "apartamento", nome: "Apartamento" },
  { id: "terreno", nome: "Terreno" },
  { id: "sala_comercial", nome: "Sala Comercial" },
  { id: "loja", nome: "Loja" },
  { id: "chácara", nome: "Chácara" },
  { id: "predio", nome: "Prédio Comercial" },
  { id: "sitio", nome: "Sítio" },
  { id: "fazenda", nome: "Fazenda" },
  { id: "outro", nome: "Outro" },
];

export default function RegisterPropertyScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    area: "",
    property: "",
    type: "",
    cpf: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.type.trim()) {
      newErrors.type = "Tipo do imóvel é obrigatório";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Endereço é obrigatório";
      isValid = false;
    }

    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = "Bairro é obrigatório";
      isValid = false;
    }

    if (!formData.city.trim()) {
      newErrors.city = "Cidade é obrigatória";
      isValid = false;
    }

    if (!formData.state.trim()) {
      newErrors.state = "Estado é obrigatório";
      isValid = false;
    }

    if (!formData.area.trim()) {
      newErrors.area = "Área é obrigatória";
      isValid = false;
    } else if (isNaN(Number(formData.area)) || Number(formData.area) <= 0) {
      newErrors.area = "Área deve ser um número válido";
      isValid = false;
    }

    if (!formData.property || !formData.property.trim()) {
      newErrors.property = "Proprietário é obrigatório";
      isValid = false;
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setErrorMessage("Preencha todos os campos corretamente.");
      setShowErrorModal(true);
      return;
    }

    try {
      const newProperty = {
        id: Date.now().toString(),
        ...formData,
      };

      const storedProperties = await AsyncStorage.getItem("properties");
      const properties = storedProperties ? JSON.parse(storedProperties) : [];

      await AsyncStorage.setItem(
        "properties",
        JSON.stringify([...properties, newProperty])
      );
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage("Ocorreu um erro ao salvar o imóvel.");
      setShowErrorModal(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigation.goBack();
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
        <Text style={styles.headerTitle}>Cadastrar Imóvel</Text>
        <Text style={styles.headerSubtitle}>Preencha os dados do imóvel</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <View>
            <SelectField
              value={formData.type}
              placeholder="Tipo do Imóvel"
              icon="building"
              options={TIPOS_IMOVEIS}
              error={!!errors.type}
              onPress={() => setShowTypeModal(true)}
            />
            {renderError("type")}
          </View>
          <View>
            <View
              style={[styles.inputGroup, errors.address && styles.inputError]}
            >
              <Icon
                name="home"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <TextInput
                style={styles.input}
                placeholder="Rua"
                placeholderTextColor="#8F94FB"
                value={formData.address}
                onChangeText={(text) => {
                  setFormData({ ...formData, address: text });
                  if (errors.address) {
                    setErrors({ ...errors, address: undefined });
                  }
                }}
              />
            </View>
            {renderError("address")}
          </View>

          <View>
            <View
              style={[
                styles.inputGroup,
                errors.neighborhood && styles.inputError,
              ]}
            >
              <Icon
                name="map-marker-alt"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <TextInput
                style={styles.input}
                placeholder="Bairro"
                placeholderTextColor="#8F94FB"
                value={formData.neighborhood}
                onChangeText={(text) => {
                  setFormData({ ...formData, neighborhood: text });
                  if (errors.neighborhood) {
                    setErrors({ ...errors, neighborhood: undefined });
                  }
                }}
              />
            </View>
            {renderError("neighborhood")}
          </View>

          <View>
            <View style={[styles.inputGroup, errors.city && styles.inputError]}>
              <Icon
                name="city"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <TextInput
                style={styles.input}
                placeholder="Cidade"
                placeholderTextColor="#8F94FB"
                value={formData.city}
                onChangeText={(text) => {
                  setFormData({ ...formData, city: text });
                  if (errors.city) {
                    setErrors({ ...errors, city: undefined });
                  }
                }}
              />
            </View>
            {renderError("city")}
          </View>

          <View>
            <SelectField
              value={formData.state}
              placeholder="Estado"
              icon="flag"
              options={ESTADOS_BRASILEIROS.map(({ id, nome, sigla, aliquot }) => ({
                id,
                nome,
                sigla,
                aliquot: aliquot.toString(),
              }))}
              error={!!errors.state}
              onPress={() => setShowStateModal(true)}
            />
            {renderError("state")}
          </View>

          <View>
            <View style={[styles.inputGroup, errors.area && styles.inputError]}>
              <Icon
                name="ruler-combined"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <TextInput
                style={styles.input}
                placeholder="Área (m²)"
                placeholderTextColor="#8F94FB"
                keyboardType="numeric"
                value={formData.area}
                onChangeText={(text) => {
                  setFormData({ ...formData, area: text });
                  if (errors.area) {
                    setErrors({ ...errors, area: undefined });
                  }
                }}
              />
            </View>
            {renderError("area")}
          </View>

          <View>
            <View
              style={[styles.inputGroup, errors.cpf && styles.inputError]}
            >
              <Icon
                name="id-card"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <TextInput
                style={styles.input}
                placeholder="CPF do Proprietário"
                placeholderTextColor="#8F94FB"
                keyboardType="numeric" // Define o teclado numérico para CPF
                value={formData.cpf}
                maxLength={11}
                onChangeText={(text) => {
                  setFormData({ ...formData, cpf: text });

                  if (errors.cpf) {
                    setErrors({ ...errors, cpf: undefined });
                  }
                }}
              />
            </View>
            {renderError("cpf")}
          </View>

          <View>
            <View
              style={[styles.inputGroup, errors.property && styles.inputError]}
            >
              <Icon
                name="user"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <TextInput
                style={styles.input}
                placeholder="Proprietário"
                placeholderTextColor="#8F94FB"
                value={formData.property}
                onChangeText={(text) => {
                  setFormData({ ...formData, property: text });

                  if (errors.property) {
                    setErrors({ ...errors, property: undefined });
                  }
                }}
              />
            </View>
            {renderError("property")}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Cadastrar Imóvel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SuccessModal
        visible={showSuccessModal}
        title="Sucesso"
        message="Imóvel cadastrado com sucesso!"
        onClose={handleCloseSuccessModal}
      />

      <SelectModal
        visible={showStateModal}
        title="Selecione o Estado"
        options={ESTADOS_BRASILEIROS}
        onSelect={(estado) => {
          setFormData({ ...formData, state: estado.sigla! });
          if (errors.state) {
            setErrors({ ...errors, state: undefined });
          }
          setShowStateModal(false);
        }}
        onClose={() => setShowStateModal(false)}
      />

      <SelectModal
        visible={showTypeModal}
        title="Selecione o Tipo do Imóvel"
        options={TIPOS_IMOVEIS}
        onSelect={(tipo) => {
          setFormData({ ...formData, type: tipo.id });
          if (errors.type) {
            setErrors({ ...errors, type: undefined });
          }
          setShowTypeModal(false);
        }}
        onClose={() => setShowTypeModal(false)}
      />

      <ErrorModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
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
  submitButton: {
    backgroundColor: "#4E54C8",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  stateSelector: {
    flex: 1,
    height: 24,
    justifyContent: "center",
  },
  stateSelectorText: {
    color: "#FFF",
    fontSize: 16,
    height: 24,
  },
  placeholderText: {
    color: "#8F94FB",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#252544",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  stateList: {
    maxHeight: 400,
  },
  stateItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A2E",
  },
  stateItemText: {
    color: "#FFF",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#4E54C8",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  selector: {
    flex: 1,
    height: 24,
    justifyContent: "center",
  },
  selectorText: {
    color: "#FFF",
    fontSize: 16,
    height: 24,
  },
});
