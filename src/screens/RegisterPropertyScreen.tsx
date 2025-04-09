import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';

interface Property {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
}

export default function RegisterPropertyScreen() {
  const navigation = useNavigation();
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState({
    street: '',
    number: '',
    neighborhood: '',
    city: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      street: '',
      number: '',
      neighborhood: '',
      city: ''
    };

    if (!street.trim()) {
      newErrors.street = 'O nome da rua é obrigatório';
      isValid = false;
    }

    if (!number.trim()) {
      newErrors.number = 'O número é obrigatório';
      isValid = false;
    }

    if (!neighborhood.trim()) {
      newErrors.neighborhood = 'O bairro é obrigatório';
      isValid = false;
    }

    if (!city.trim()) {
      newErrors.city = 'A cidade é obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert(
        'Campos Obrigatórios',
        'Por favor, preencha todos os campos obrigatórios.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const newProperty: Property = {
        id: Date.now().toString(),
        street,
        number,
        neighborhood,
        city,
      };

      // Recuperar propriedades existentes
      const existingProperties = await AsyncStorage.getItem('properties');
      const properties: Property[] = existingProperties 
        ? JSON.parse(existingProperties) 
        : [];

      // Adicionar nova propriedade
      properties.push(newProperty);

      // Salvar no AsyncStorage
      await AsyncStorage.setItem('properties', JSON.stringify(properties));

      // Voltar para a tela inicial
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar propriedade:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao salvar o imóvel. Tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Cadastro de Imóvel</Text>
          <Text style={styles.subtitle}>Preencha os dados do imóvel</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Rua</Text>
            <Input
              placeholder="Digite o nome da rua"
              value={street}
              onChangeText={(text) => {
                setStreet(text);
                setErrors(prev => ({ ...prev, street: '' }));
              }}
              containerStyle={styles.input}
              inputStyle={styles.inputText}
              errorMessage={errors.street}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Número</Text>
            <Input
              placeholder="Digite o número"
              value={number}
              onChangeText={(text) => {
                setNumber(text);
                setErrors(prev => ({ ...prev, number: '' }));
              }}
              keyboardType="numeric"
              containerStyle={styles.input}
              inputStyle={styles.inputText}
              errorMessage={errors.number}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bairro</Text>
            <Input
              placeholder="Digite o bairro"
              value={neighborhood}
              onChangeText={(text) => {
                setNeighborhood(text);
                setErrors(prev => ({ ...prev, neighborhood: '' }));
              }}
              containerStyle={styles.input}
              inputStyle={styles.inputText}
              errorMessage={errors.neighborhood}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cidade</Text>
            <Input
              placeholder="Digite a cidade"
              value={city}
              onChangeText={(text) => {
                setCity(text);
                setErrors(prev => ({ ...prev, city: '' }));
              }}
              containerStyle={styles.input}
              inputStyle={styles.inputText}
              errorMessage={errors.city}
            />
          </View>

          <Button
            title="Cadastrar Imóvel"
            onPress={handleRegister}
            buttonStyle={styles.registerButton}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonText}
          />
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
  registerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
}); 