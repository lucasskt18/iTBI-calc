import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';

interface FormErrors {
  propertyValue?: string;
  propertyType?: string;
  location?: string;
}

export default function CalculateITBIScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    propertyValue: '',
    propertyType: '',
    location: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<number | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.propertyValue.trim()) {
      newErrors.propertyValue = 'Valor do imóvel é obrigatório';
      isValid = false;
    } else if (isNaN(Number(formData.propertyValue)) || Number(formData.propertyValue) <= 0) {
      newErrors.propertyValue = 'Valor deve ser um número válido';
      isValid = false;
    }

    if (!formData.propertyType.trim()) {
      newErrors.propertyType = 'Tipo do imóvel é obrigatório';
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Localização é obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateITBI = () => {
    if (!validateForm()) {
      setErrorMessage('Por favor, preencha todos os campos corretamente.');
      setShowErrorModal(true);
      return;
    }

    const value = parseFloat(formData.propertyValue);
    // Taxa exemplo de 2% do valor do imóvel
    const itbi = value * 0.02;
    setResult(itbi);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFormData({
      propertyValue: '',
      propertyType: '',
      location: '',
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
        <Text style={styles.headerSubtitle}>Informe os dados para o cálculo</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <View>
            <View style={[styles.inputGroup, errors.propertyValue && styles.inputError]}>
              <Icon name="dollar-sign" type="font-awesome-5" color="#8F94FB" size={20} />
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
            {renderError('propertyValue')}
          </View>

          <View>
            <View style={[styles.inputGroup, errors.propertyType && styles.inputError]}>
              <Icon name="building" type="font-awesome-5" color="#8F94FB" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Tipo do Imóvel"
                placeholderTextColor="#8F94FB"
                value={formData.propertyType}
                onChangeText={(text) => {
                  setFormData({ ...formData, propertyType: text });
                  if (errors.propertyType) {
                    setErrors({ ...errors, propertyType: undefined });
                  }
                }}
              />
            </View>
            {renderError('propertyType')}
          </View>

          <View>
            <View style={[styles.inputGroup, errors.location && styles.inputError]}>
              <Icon name="map-marker-alt" type="font-awesome-5" color="#8F94FB" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Localização"
                placeholderTextColor="#8F94FB"
                value={formData.location}
                onChangeText={(text) => {
                  setFormData({ ...formData, location: text });
                  if (errors.location) {
                    setErrors({ ...errors, location: undefined });
                  }
                }}
              />
            </View>
            {renderError('location')}
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={calculateITBI}>
            <Text style={styles.calculateButtonText}>Calcular ITBI</Text>
          </TouchableOpacity>

          {result !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Valor do ITBI:</Text>
              <Text style={styles.resultValue}>
                R$ {result.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

      <SuccessModal
        visible={showSuccessModal}
        title="Cálculo Realizado"
        message={result ? `Valor do ITBI: R$ ${result.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        
Taxa aplicada: 2% do valor do imóvel` : ''}
        onClose={handleCloseSuccessModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    marginLeft: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8F94FB',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252544',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 15,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    padding: 0,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
  calculateButton: {
    backgroundColor: '#4E54C8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  calculateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#252544',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  resultLabel: {
    color: '#8F94FB',
    fontSize: 16,
    marginBottom: 8,
  },
  resultValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultInfo: {
    color: '#8F94FB',
    fontSize: 14,
    opacity: 0.8,
  },
}); 