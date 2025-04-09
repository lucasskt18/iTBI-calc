import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Button, Card } from '@rneui/themed';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Property {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
}

export default function ListPropertiesScreen() {
  const navigation = useNavigation();
  const [properties, setProperties] = useState<Property[]>([]);

  // Carrega os imóveis quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      loadProperties();
    }, [])
  );

  const loadProperties = async () => {
    try {
      const storedProperties = await AsyncStorage.getItem('properties');
      if (storedProperties) {
        setProperties(JSON.parse(storedProperties));
      }
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    }
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <Card containerStyle={styles.card}>
      <Card.Title>{`${item.street}, ${item.number}`}</Card.Title>
      <Card.Divider />
      <View style={styles.propertyInfo}>
        <Text style={styles.label}>Bairro:</Text>
        <Text style={styles.value}>{item.neighborhood}</Text>
      </View>
      <View style={styles.propertyInfo}>
        <Text style={styles.label}>Cidade:</Text>
        <Text style={styles.value}>{item.city}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {properties.length > 0 ? (
        <FlatList
          data={properties}
          renderItem={renderProperty}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum imóvel cadastrado ainda.
          </Text>
        </View>
      )}

      <Button
        title="Voltar"
        onPress={() => navigation.goBack()}
        type="clear"
        containerStyle={styles.backButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80, // Espaço para o botão voltar
  },
  card: {
    borderRadius: 10,
    marginBottom: 10,
  },
  propertyInfo: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
    color: '#666',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 