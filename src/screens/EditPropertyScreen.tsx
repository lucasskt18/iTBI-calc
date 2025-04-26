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
  Alert,
  Modal,
} from "react-native";
import { Icon } from "@rneui/themed";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "../components/BackButton";
import SuccessModal from "../components/SuccessModal";
import SelectField from "../components/SelectField";
import SelectModal from "../components/SelectModal";
import ErrorModal from "../components/ErrorModal";
import {
  ESTADOS_BRASILEIROS,
  TIPOS_IMOVEIS,
} from "../../src/screens/RegisterPropertyScreen";

interface FormErrors {
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  area?: string;
  property?: string;
  type?: string;
  telefone?: string;
}

interface Property {
  id: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  area: string;
  property: string;
  type: string;
  telefone: string;
}


type RootStackParamList = {
  EditProperty: {
    propertyId: string;
  };
};

type EditPropertyScreenRouteProp = RouteProp<
  RootStackParamList,
  "EditProperty"
>;

export default function EditPropertyScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditPropertyScreenRouteProp>();
  const propertyId = route.params.propertyId;

  const [formData, setFormData] = useState<Property>({
    id: "",
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    area: "",
    property: "",
    type: "",
    telefone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadProperty();
  }, []);

  const loadProperty = async () => {
    try {
      const storedProperties = await AsyncStorage.getItem("properties");
      if (storedProperties) {
        const properties = JSON.parse(storedProperties);
        const property = properties.find((p: Property) => p.id === propertyId);
        if (property) {
          setFormData(property);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar imóvel:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do imóvel.");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

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


    if (!formData.type.trim()) {
      newErrors.type = "Tipo do imóvel é obrigatório";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Erro", "Por favor, corrija os erros no formulário.");
      return;
    }

    try {
      const storedProperties = await AsyncStorage.getItem("properties");
      const properties = storedProperties ? JSON.parse(storedProperties) : [];

      const updatedProperties = properties.map((property: Property) =>
        property.id === propertyId ? formData : property
      );

      await AsyncStorage.setItem(
        "properties",
        JSON.stringify(updatedProperties)
      );
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao atualizar o imóvel.");
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

  const handleSave = async () => {
    if (!validateForm()) {
      setErrorMessage("Preencha todos os campos corretamente.");
      setShowErrorModal(true);
      return;
    }

    try {
      const storedProperties = await AsyncStorage.getItem("properties");
      if (!storedProperties) {
        setErrorMessage("Erro ao carregar os dados do imóvel");
        setShowErrorModal(true);
        return;
      }

      const properties = JSON.parse(storedProperties);
      const propertyIndex = properties.findIndex(
        (p: Property) => p.id === route.params?.propertyId
      );

      if (propertyIndex === -1) {
        setErrorMessage("Imóvel não encontrado");
        setShowErrorModal(true);
        return;
      }

      properties[propertyIndex] = {
        ...properties[propertyIndex],
        ...formData,
      };

      await AsyncStorage.setItem("properties", JSON.stringify(properties));
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

      <ScrollView style={styles.content}>
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
              options={ESTADOS_BRASILEIROS.map(({ id, nome, sigla }) => ({ id, nome, sigla }))}
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


          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
            <Text style={styles.submitButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SuccessModal
        visible={showSuccessModal}
        title="Sucesso"
        message="Imóvel atualizado com sucesso!"
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
});
