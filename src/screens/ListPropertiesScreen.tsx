import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';
import ConfirmationModal from '../components/ConfirmationModal';

type RootStackParamList = {
  EditProperty: {
    propertyId: string;
  };
};

type NavigationProps = NavigationProp<RootStackParamList>;

interface Property {
  id: string;
  address: string;
  neighborhood: string;
  city: string;
  value: string;
  type: string;
}

export default function ListPropertiesScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const storedProperties = await AsyncStorage.getItem('properties');
      if (storedProperties) {
        setProperties(JSON.parse(storedProperties));
      }
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de imóveis.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = (id: string) => {
    setPropertyToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      const updatedProperties = properties.filter(prop => prop.id !== propertyToDelete);
      await AsyncStorage.setItem('properties', JSON.stringify(updatedProperties));
      setProperties(updatedProperties);
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o imóvel.');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  const handleEditProperty = (id: string) => {
    navigation.navigate('EditProperty', { propertyId: id });
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <View style={styles.propertyCard}>
      <View style={styles.propertyHeader}>
        <Icon name="home" type="font-awesome-5" color="#8F94FB" size={20} />
        <Text style={styles.propertyType}>{item.type}</Text>
      </View>

      <View style={styles.propertyInfo}>
        <Text style={styles.propertyAddress}>{item.address}</Text>
        <Text style={styles.propertyLocation}>
          {item.neighborhood}, {item.city}
        </Text>
        <Text style={styles.propertyValue}>
          R$ {parseFloat(item.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditProperty(item.id)}
        >
          <Icon name="edit" type="font-awesome-5" color="#FFF" size={14} />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProperty(item.id)}
        >
          <Icon name="trash-alt" type="font-awesome-5" color="#FFF" size={14} />
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      <BackButton />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Imóveis Cadastrados</Text>
        <Text style={styles.headerSubtitle}>
          {properties.length} {properties.length === 1 ? 'imóvel' : 'imóveis'} encontrados
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : properties.length === 0 ? (
        <View style={styles.centerContent}>
          <Icon name="home" type="font-awesome-5" color="#8F94FB" size={50} />
          <Text style={styles.emptyText}>Nenhum imóvel cadastrado</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('RegisterProperty' as never)}
          >
            <Text style={styles.addButtonText}>Cadastrar Novo Imóvel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={renderProperty}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <ConfirmationModal
        visible={showDeleteModal}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este imóvel?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
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
  listContent: {
    padding: 20,
    gap: 20,
  },
  propertyCard: {
    backgroundColor: '#252544',
    borderRadius: 12,
    padding: 20,
  },
  propertyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  propertyType: {
    color: '#8F94FB',
    fontSize: 14,
    fontWeight: '500',
  },
  propertyInfo: {
    gap: 8,
  },
  propertyAddress: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  propertyLocation: {
    color: '#8F94FB',
    fontSize: 14,
  },
  propertyValue: {
    color: '#4E54C8',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#4E54C8',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    color: '#8F94FB',
    fontSize: 16,
  },
  emptyText: {
    color: '#8F94FB',
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4E54C8',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 