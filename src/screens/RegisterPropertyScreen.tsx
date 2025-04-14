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
  Alert,
} from "react-native";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "../components/BackButton";
import { Picker } from "@react-native-picker/picker";

interface FormErrors {
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  area?: string;
  value?: string;
  type?: string;
  itemValue?: string;
}

export default function RegisterPropertyScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    area: "",
    value: "",
    type: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [states, setStates] = useState<string[]>([
    "Acre",
    "Alagoas",
    "Amapá",
    "Amazonas",
    "Bahia",
    "Ceará",
    "Distrito Federal",
    "Espírito Santo",
    "Goiás",
    "Maranhão",
    "Mato Grosso",
    "Mato Grosso do Sul",
    "Minas Gerais",
    "Pará",
    "Paraíba",
    "Paraná",
    "Pernambuco",
    "Piauí",
    "Rio de Janeiro",
    "Rio Grande do Norte",
    "Rio Grande do Sul",
    "Rondônia",
    "Roraima",
    "Santa Catarina",
    "São Paulo",
    "Sergipe",
    "Tocantins",
  ]);

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

    if (!formData.value.trim()) {
      newErrors.value = "Valor é obrigatório";
      isValid = false;
    } else if (isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
      newErrors.value = "Valor deve ser um número válido";
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

      Alert.alert("Sucesso", "Imóvel cadastrado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar o imóvel.");
    }
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
                placeholder="Endereço"
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
            <View
              style={[styles.inputGroup, errors.state && styles.inputError]}
            >
              <Icon
                name="flag"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <Picker
                selectedValue={formData.state}
                style={{
                  flex: 1,
                  color: "#8F94FB",
                  fontSize: 20,
                }}
                dropdownIconColor="#8F94FB"
                onValueChange={(itemValue) => {
                  setFormData({ ...formData, state: itemValue });
                  if (errors.state) {
                    setErrors({ ...errors, state: undefined });
                  }
                }}
              >
                <Picker.Item  
                style ={{ color: "#8F94FB" }} // Cor do texto do item inicial
                  label="Selecione um estado"
                  value=""
                  color="#8F94FB" // Cor visível para o item inicial
                />
                {states.map((state) => (
                  <Picker.Item
                    key={state}
                    label={state}
                    value={state}
                    color="#000" // Alterado para preto
                  />
                ))}
              </Picker>
            </View>
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
              style={[styles.inputGroup, errors.value && styles.inputError]}
            >
              <Icon
                name="dollar-sign"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <TextInput
                style={styles.input}
                placeholder="Valor"
                placeholderTextColor="#8F94FB"
                keyboardType="numeric"
                value={formData.value}
                onChangeText={(text) => {
                  setFormData({ ...formData, value: text });
                  if (errors.value) {
                    setErrors({ ...errors, value: undefined });
                  }
                }}
              />
            </View>
            {renderError("value")}
          </View>

          <View>
            <View style={[styles.inputGroup, errors.type && styles.inputError]}>
              <Icon
                name="building"
                type="font-awesome-5"
                color="#8F94FB"
                size={20}
              />
              <TextInput
                style={styles.input}
                placeholder="Tipo do Imóvel"
                placeholderTextColor="#8F94FB"
                value={formData.type}
                onChangeText={(text) => {
                  setFormData({ ...formData, type: text });
                  if (errors.type) {
                    setErrors({ ...errors, type: undefined });
                  }
                }}
              />
            </View>
            {renderError("type")}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Cadastrar Imóvel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingTop: 40,
    marginLeft: 40,
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
});
