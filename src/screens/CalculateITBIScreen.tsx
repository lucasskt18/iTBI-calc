import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';

export default function CalculateITBIScreen() {
  const navigation = useNavigation();
  const [propertyValue, setPropertyValue] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [errors, setErrors] = useState({
    propertyValue: '',
    taxRate: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      propertyValue: '',
      taxRate: ''
    };

    if (!propertyValue.trim()) {
      newErrors.propertyValue = 'O valor do imóvel é obrigatório';
      isValid = false;
    }

    if (!taxRate.trim()) {
      newErrors.taxRate = 'A alíquota é obrigatória';
      isValid = false;
    } else {
      const rate = parseFloat(taxRate);
      if (isNaN(rate) || rate <= 0 || rate > 100) {
        newErrors.taxRate = 'A alíquota deve ser um número entre 0 e 100';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateITBI = () => {
    if (!validateForm()) {
      Alert.alert(
        'Campos Inválidos',
        'Por favor, preencha todos os campos corretamente.',
        [{ text: 'OK' }]
      );
      return;
    }

    const value = parseFloat(propertyValue.replace(/[^0-9.]/g, ''));
    const rate = parseFloat(taxRate) / 100;
    const itbi = value * rate;
    setResult(itbi);
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handlePropertyValueChange = (text: string) => {
    const formattedValue = formatCurrency(text);
    setPropertyValue(formattedValue);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Cálculo de ITBI</Text>
          <Text style={styles.subtitle}>Informe os valores para calcular</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Valor do Imóvel</Text>
            <Input
              placeholder="Digite o valor do imóvel"
              value={propertyValue}
              onChangeText={(text) => {
                handlePropertyValueChange(text);
                setErrors(prev => ({ ...prev, propertyValue: '' }));
              }}
              keyboardType="numeric"
              containerStyle={styles.input}
              inputStyle={styles.inputText}
              errorMessage={errors.propertyValue}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Alíquota (%)</Text>
            <Input
              placeholder="Digite a alíquota (ex: 2.5)"
              value={taxRate}
              onChangeText={(text) => {
                setTaxRate(text);
                setErrors(prev => ({ ...prev, taxRate: '' }));
              }}
              keyboardType="numeric"
              containerStyle={styles.input}
              inputStyle={styles.inputText}
              errorMessage={errors.taxRate}
            />
          </View>

          <Button
            title="Calcular ITBI"
            onPress={calculateITBI}
            buttonStyle={styles.calculateButton}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonText}
          />

          {result !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Resultado do Cálculo</Text>
              <Text style={styles.resultLabel}>Valor do ITBI:</Text>
              <Text style={styles.resultValue}>
                {result.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <BackButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  form: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 100,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 10,
  },
  input: {
    paddingHorizontal: 0,
  },
  inputText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 30,
    borderRadius: 10,
  },
  calculateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
}); 