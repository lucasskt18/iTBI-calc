import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';

export default function CalculateITBIScreen() {
  const navigation = useNavigation();
  const [propertyValue, setPropertyValue] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculateITBI = () => {
    if (!propertyValue || !taxRate) return;

    const value = parseFloat(propertyValue.replace(/[^0-9.]/g, ''));
    const rate = parseFloat(taxRate) / 100;
    const itbi = value * rate;
    setResult(itbi);
  };

  const formatCurrency = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/[^0-9]/g, '');
    
    // Converte para número e formata como moeda
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
        <View style={styles.form}>
          <Input
            placeholder="Valor do Imóvel"
            value={propertyValue}
            onChangeText={handlePropertyValueChange}
            keyboardType="numeric"
            containerStyle={styles.input}
          />
          <Input
            placeholder="Alíquota (%)"
            value={taxRate}
            onChangeText={setTaxRate}
            keyboardType="numeric"
            containerStyle={styles.input}
          />

          <Button
            title="Calcular ITBI"
            onPress={calculateITBI}
            buttonStyle={styles.calculateButton}
            containerStyle={styles.buttonContainer}
          />

          {result !== null && (
            <View style={styles.resultContainer}>
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
  form: {
    padding: 20,
    paddingBottom: 100, // Espaço para o botão voltar
  },
  input: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 10,
  },
  calculateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
  },
  resultContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
}); 