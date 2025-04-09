import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import { Card, Button } from '@rneui/themed';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';

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

  const handleClearHistory = () => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja apagar todos os imóveis cadastrados? Esta ação não poderá ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('properties');
              setProperties([]);
            } catch (error) {
              console.error('Erro ao limpar histórico:', error);
              Alert.alert(
                'Erro',
                'Ocorreu um erro ao tentar limpar o histórico. Tente novamente.'
              );
            }
          }
        }
      ]
    );
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.street}, {item.number}</Text>
      </View>
      <Card.Divider />
      <View style={styles.propertyInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Bairro:</Text>
          <Text style={styles.value}>{item.neighborhood}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Cidade:</Text>
          <Text style={styles.value}>{item.city}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Imóveis Cadastrados</Text>
        <Text style={styles.subtitle}>
          {properties.length} {properties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
        </Text>
        {properties.length > 0 && (
          <Button
            title="Limpar Histórico"
            onPress={handleClearHistory}
            buttonStyle={styles.clearButton}
            titleStyle={styles.clearButtonText}
            type="outline"
          />
        )}
      </View>

      <View style={styles.content}>
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
            <Text style={styles.emptySubtext}>
              Cadastre um novo imóvel para começar.
            </Text>
          </View>
        )}
      </View>
      <BackButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  propertyInfo: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: 70,
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  clearButton: {
    marginTop: 10,
    borderColor: '#fff',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 