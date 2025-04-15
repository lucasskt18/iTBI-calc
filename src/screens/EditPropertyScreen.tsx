import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';
import SuccessModal from '../components/SuccessModal';

interface FormErrors {
    address?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    area?: string;
    value?: string;
    type?: string;
}

interface Property {
    id: string;
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    area: string;
    value: string;
    type: string;
}

const ESTADOS_BRASILEIROS = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' },
];

type RootStackParamList = {
    EditProperty: {
        propertyId: string;
    };
};

type EditPropertyScreenRouteProp = RouteProp<RootStackParamList, 'EditProperty'>;

export default function EditPropertyScreen() {
    const navigation = useNavigation();
    const route = useRoute<EditPropertyScreenRouteProp>();
    const propertyId = route.params.propertyId;

    const [formData, setFormData] = useState<Property>({
        id: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        area: '',
        value: '',
        type: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showStateModal, setShowStateModal] = useState(false);

    useEffect(() => {
        loadProperty();
    }, []);

    const loadProperty = async () => {
        try {
            const storedProperties = await AsyncStorage.getItem('properties');
            if (storedProperties) {
                const properties = JSON.parse(storedProperties);
                const property = properties.find((p: Property) => p.id === propertyId);
                if (property) {
                    setFormData(property);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar imóvel:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do imóvel.');
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        if (!formData.address.trim()) {
            newErrors.address = 'Endereço é obrigatório';
            isValid = false;
        }

        if (!formData.neighborhood.trim()) {
            newErrors.neighborhood = 'Bairro é obrigatório';
            isValid = false;
        }

        if (!formData.city.trim()) {
            newErrors.city = 'Cidade é obrigatória';
            isValid = false;
        }

        if (!formData.state.trim()) {
            newErrors.state = 'Estado é obrigatório';
            isValid = false;
        }

        if (!formData.area.trim()) {
            newErrors.area = 'Área é obrigatória';
            isValid = false;
        } else if (isNaN(Number(formData.area)) || Number(formData.area) <= 0) {
            newErrors.area = 'Área deve ser um número válido';
            isValid = false;
        }

        if (!formData.value.trim()) {
            newErrors.value = 'Valor é obrigatório';
            isValid = false;
        } else if (isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
            newErrors.value = 'Valor deve ser um número válido';
            isValid = false;
        }

        if (!formData.type.trim()) {
            newErrors.type = 'Tipo do imóvel é obrigatório';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Erro', 'Por favor, corrija os erros no formulário.');
            return;
        }

        try {
            const storedProperties = await AsyncStorage.getItem('properties');
            const properties = storedProperties ? JSON.parse(storedProperties) : [];

            const updatedProperties = properties.map((property: Property) =>
                property.id === propertyId ? formData : property
            );

            await AsyncStorage.setItem('properties', JSON.stringify(updatedProperties));
            setShowSuccessModal(true);
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao atualizar o imóvel.');
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
                        <View style={[styles.inputGroup, errors.address && styles.inputError]}>
                            <Icon name="home" type="font-awesome-5" color="#8F94FB" size={20} />
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
                        {renderError('address')}
                    </View>

                    <View>
                        <View style={[styles.inputGroup, errors.neighborhood && styles.inputError]}>
                            <Icon name="map-marker-alt" type="font-awesome-5" color="#8F94FB" size={20} />
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
                        {renderError('neighborhood')}
                    </View>

                    <View>
                        <View style={[styles.inputGroup, errors.city && styles.inputError]}>
                            <Icon name="city" type="font-awesome-5" color="#8F94FB" size={20} />
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
                        {renderError('city')}
                    </View>

                    <View>
                        <View style={[styles.inputGroup, errors.state && styles.inputError]}>
                            <Icon name="flag" type="font-awesome-5" color="#8F94FB" size={20} />
                            <TouchableOpacity
                                style={styles.stateSelector}
                                onPress={() => setShowStateModal(true)}
                            >
                                <Text style={[styles.stateSelectorText, !formData.state && styles.placeholderText]}>
                                    {formData.state || "Estado"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {renderError('state')}
                    </View>

                    <View>
                        <View style={[styles.inputGroup, errors.area && styles.inputError]}>
                            <Icon name="ruler-combined" type="font-awesome-5" color="#8F94FB" size={20} />
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
                        {renderError('area')}
                    </View>

                    <View>
                        <View style={[styles.inputGroup, errors.value && styles.inputError]}>
                            <Icon name="dollar-sign" type="font-awesome-5" color="#8F94FB" size={20} />
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
                        {renderError('value')}
                    </View>

                    <View>
                        <View style={[styles.inputGroup, errors.type && styles.inputError]}>
                            <Icon name="building" type="font-awesome-5" color="#8F94FB" size={20} />
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
                        {renderError('type')}
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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

            {/* Modal de Seleção de Estado */}
            <Modal
                visible={showStateModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowStateModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione o Estado</Text>
                        <ScrollView style={styles.stateList}>
                            {ESTADOS_BRASILEIROS.map((estado) => (
                                <TouchableOpacity
                                    key={estado.sigla}
                                    style={styles.stateItem}
                                    onPress={() => {
                                        setFormData({ ...formData, state: estado.sigla });
                                        if (errors.state) {
                                            setErrors({ ...errors, state: undefined });
                                        }
                                        setShowStateModal(false);
                                    }}
                                >
                                    <Text style={styles.stateItemText}>
                                        {estado.nome} ({estado.sigla})
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowStateModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    submitButton: {
        backgroundColor: '#4E54C8',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    stateSelector: {
        flex: 1,
        height: 24,
        justifyContent: 'center',
    },
    stateSelectorText: {
        color: '#FFF',
        fontSize: 16,
        height: 24,
    },
    placeholderText: {
        color: '#8F94FB',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#252544',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    stateList: {
        maxHeight: 400,
    },
    stateItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A2E',
    },
    stateItemText: {
        color: '#FFF',
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#4E54C8',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 