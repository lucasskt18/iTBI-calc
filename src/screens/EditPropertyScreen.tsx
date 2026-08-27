import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Icon } from "@rneui/themed";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import SuccessModal from "../components/SuccessModal";
import SelectField from "../components/SelectField";
import SelectModal from "../components/SelectModal";
import ErrorModal from "../components/ErrorModal";
import { TIPOS_IMOVEIS } from "../constants/propertyTypes";
import { getProperty, updateProperty } from "../storage/propertiesStorage";
import { Property } from "../types/property";
import { digitsOnlyCep, fetchAddressByCep } from "../services/viaCep";
import type { RootStackParamList } from "../navigation/types";

interface FormErrors {
  phone?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  area?: string;
  property?: string;
  type?: string;
  cep?: string;
}

type EditPropertyScreenRouteProp = RouteProp<
  RootStackParamList,
  "EditProperty"
>;

const EMPTY_PROPERTY: Property = {
  id: "",
  cep: "",
  address: "",
  neighborhood: "",
  city: "",
  state: "",
  area: "",
  property: "",
  type: "",
  phone: "",
};

export default function EditPropertyScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditPropertyScreenRouteProp>();
  const propertyId = route.params.propertyId;

  const [formData, setFormData] = useState<Property>(EMPTY_PROPERTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadProperty();
  }, []);

  const loadProperty = async () => {
    try {
      const property = await getProperty(propertyId);
      if (property) {
        setFormData(property);
      } else {
        setErrorMessage("Imóvel não encontrado.");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Erro ao carregar imóvel:", error);
      setErrorMessage("Não foi possível carregar os dados do imóvel.");
      setShowErrorModal(true);
    }
  };

  const lookupAddressByCep = async (cep: string) => {
    try {
      const address = await fetchAddressByCep(cep);
      setFormData((current) => ({
        ...current,
        ...address,
      }));
      setErrors((current) => ({
        ...current,
        address: undefined,
        neighborhood: undefined,
        city: undefined,
        state: undefined,
        cep: undefined,
      }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao buscar o endereço. Verifique o CEP."
      );
      setShowErrorModal(true);
    }
  };

  const handleCepChange = (text: string) => {
    const cep = digitsOnlyCep(text);
    setFormData((current) => ({ ...current, cep }));

    if (errors.cep) {
      setErrors((current) => ({ ...current, cep: undefined }));
    }

    if (cep.length === 8) {
      lookupAddressByCep(cep);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.cep.trim()) {
      newErrors.cep = "CEP é obrigatório";
      isValid = false;
    } else if (digitsOnlyCep(formData.cep).length !== 8) {
      newErrors.cep = "CEP deve ter 8 dígitos";
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

    if (!(formData.property ?? "").trim()) {
      newErrors.property = "Proprietário é obrigatório";
      isValid = false;
    }

    if (!(formData.phone ?? "").trim()) {
      newErrors.phone = "Telefone é obrigatório";
      isValid = false;
    }

    if (!formData.type.trim()) {
      newErrors.type = "Tipo do imóvel é obrigatório";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const renderError = (field: keyof FormErrors) => {
    const error = errors[field];
    return error ? <Text style={styles.errorText}>{error}</Text> : null;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setErrorMessage("Preencha todos os campos corretamente.");
      setShowErrorModal(true);
      return;
    }

    try {
      if (!formData.id) {
        setErrorMessage("Imóvel não encontrado");
        setShowErrorModal(true);
        return;
      }

      await updateProperty(propertyId, formData);
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage("Erro ao salvar as alterações. Tente novamente.");
      setShowErrorModal(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      <BackButton />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Editar Imóvel</Text>
        <Text style={styles.headerSubtitle}>Atualize os dados do imóvel</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <View>
              <SelectField
                value={formData.type}
                placeholder="Tipo do Imóvel"
                icon="home"
                options={[...TIPOS_IMOVEIS]}
                error={!!errors.type}
                onPress={() => setShowTypeModal(true)}
              />
              {renderError("type")}
            </View>

            <View>
              <View
                style={[styles.inputGroup, errors.cep && styles.inputError]}
              >
                <Icon
                  name="map-pin"
                  type="font-awesome-5"
                  color="#8F94FB"
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="CEP"
                  placeholderTextColor="#8F94FB"
                  keyboardType="numeric"
                  maxLength={8}
                  value={formData.cep}
                  onChangeText={handleCepChange}
                />
              </View>
              {renderError("cep")}
            </View>

            <View>
              <View
                style={[styles.inputGroup, errors.address && styles.inputError]}
              >
                <Icon
                  name="road"
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
              <View
                style={[styles.inputGroup, errors.city && styles.inputError]}
              >
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
                  editable={false}
                />
              </View>
              {renderError("city")}
            </View>

            <View>
              <View
                style={[styles.inputGroup, errors.state && styles.inputError]}
              >
                <Icon
                  name="flag"
                  type="font-awesome-5"
                  color="#8F94FB"
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Estado"
                  placeholderTextColor="#8F94FB"
                  value={formData.state}
                  editable={false}
                />
              </View>
              {renderError("state")}
            </View>

            <View>
              <View
                style={[styles.inputGroup, errors.area && styles.inputError]}
              >
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
                style={[
                  styles.inputGroup,
                  errors.property && styles.inputError,
                ]}
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

            <View>
              <View
                style={[styles.inputGroup, errors.phone && styles.inputError]}
              >
                <Icon
                  name="phone-alt"
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
                  maxLength={15}
                  onChangeText={(text) => {
                    const formattedPhone = text
                      .replace(/\D/g, "")
                      .replace(/^(\d{2})(\d)/, "($1) $2")
                      .replace(/(\d{5})(\d)/, "$1-$2")
                      .slice(0, 15);

                    setFormData({ ...formData, phone: formattedPhone });
                  }}
                />
              </View>
              {renderError("phone")}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
              <Text style={styles.submitButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccessModal}
        title="Sucesso"
        message="Imóvel atualizado com sucesso!"
        onClose={handleCloseSuccessModal}
      />

      <SelectModal
        visible={showTypeModal}
        title="Selecione o Tipo do Imóvel"
        options={[...TIPOS_IMOVEIS]}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
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
    marginTop: 10,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
