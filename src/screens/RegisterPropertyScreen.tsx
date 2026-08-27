import React, { useState } from "react";
import {
  View,
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
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import SuccessModal from "../components/SuccessModal";
import SelectModal from "../components/SelectModal";
import ErrorModal from "../components/ErrorModal";
import SelectField from "../components/SelectField";
import { TIPOS_IMOVEIS } from "../constants/propertyTypes";
import { createProperty } from "../storage/propertiesStorage";
import { digitsOnlyCep, fetchAddressByCep } from "../services/viaCep";
import { colors } from "../theme";
import { formStyles as styles } from "../theme/forms";

interface FormErrors {
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  area?: string;
  property?: string;
  type?: string;
  cep?: string;
  phone?: string;
}

export default function RegisterPropertyScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    cep: "",
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    area: "",
    type: "",
    property: "",
    phone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

    if (!formData.type.trim()) {
      newErrors.type = "Tipo do imóvel é obrigatório";
      isValid = false;
    }

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

    if (!formData.property || !formData.property.trim()) {
      newErrors.property = "Proprietário é obrigatório";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
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
      await createProperty(formData);
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
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <BackButton />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastrar Imóvel</Text>
        <Text style={styles.headerSubtitle}>Preencha os dados do imóvel</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <View>
              <SelectField
                value={formData.type}
                placeholder="Tipo do Imóvel"
                icon="home"
                options={TIPOS_IMOVEIS}
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
                  color={colors.muted}
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="CEP"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  maxLength={8}
                  value={formData.cep}
                  onChangeText={handleCepChange}
                />
              </View>
              {errors.cep && <Text style={styles.errorText}>{errors.cep}</Text>}
            </View>

            <View>
              <View
                style={[styles.inputGroup, errors.address && styles.inputError]}
              >
                <Icon
                  name="road"
                  type="font-awesome-5"
                  color={colors.muted}
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Rua"
                  placeholderTextColor={colors.muted}
                  value={formData.address}
                  editable={true}
                  maxLength={30}
                  onChangeText={(text) =>
                    setFormData({ ...formData, address: text })
                  }
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
                  color={colors.muted}
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Bairro"
                  placeholderTextColor={colors.muted}
                  value={formData.neighborhood}
                  editable={true}
                  maxLength={30}
                  onChangeText={(text) =>
                    setFormData({ ...formData, neighborhood: text })
                  }
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
                  color={colors.muted}
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Cidade"
                  placeholderTextColor={colors.muted}
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
                  color={colors.muted}
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Estado"
                  placeholderTextColor={colors.muted}
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
                  color={colors.muted}
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Área (m²)"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  value={formData.area}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");
                    setFormData({ ...formData, area: numericValue });

                    if (!numericValue.trim()) {
                      setErrors({ ...errors, area: "Área é obrigatória" });
                    } else if (
                      isNaN(Number(numericValue)) ||
                      Number(numericValue) <= 0
                    ) {
                      setErrors({
                        ...errors,
                        area: "Área deve ser um número válido",
                      });
                    } else if (errors.area) {
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
                  color={colors.muted}
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Proprietário"
                  placeholderTextColor={colors.muted}
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
                  color={colors.muted}
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Telefone do Proprietário"
                  placeholderTextColor={colors.muted}
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

                    if (errors.phone) {
                      setErrors({ ...errors, phone: undefined });
                    }
                  }}
                />
              </View>
              {renderError("phone")}
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Cadastrar Imóvel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccessModal}
        title="Sucesso"
        message="Imóvel cadastrado com sucesso!"
        onClose={handleCloseSuccessModal}
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
