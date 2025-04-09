import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const handleRegister = async () => {
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
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Input
          placeholder="Rua"
          value={street}
          onChangeText={setStreet}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Número"
          value={number}
          onChangeText={setNumber}
          keyboardType="numeric"
          containerStyle={styles.input}
        />
        <Input
          placeholder="Bairro"
          value={neighborhood}
          onChangeText={setNeighborhood}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Cidade"
          value={city}
          onChangeText={setCity}
          containerStyle={styles.input}
        />

        <Button
          title="Cadastrar"
          onPress={handleRegister}
          buttonStyle={styles.registerButton}
          containerStyle={styles.buttonContainer}
        />
      </View>

      <Button
        title="Voltar"
        onPress={() => navigation.goBack()}
        type="clear"
        containerStyle={styles.backButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 10,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
}); 