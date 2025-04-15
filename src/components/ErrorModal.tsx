import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Icon } from '@rneui/themed';

interface ErrorModalProps {
    visible: boolean;
    onClose: () => void;
    message?: string;
}

export default function ErrorModal({ visible, onClose, message = 'Por favor, corrija os erros no formulário.' }: ErrorModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Icon
                        name="exclamation-circle"
                        type="font-awesome-5"
                        color="#FF6B6B"
                        size={50}
                        solid
                    />

                    <Text style={styles.title}>Erro</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#252544',
        borderRadius: 16,
        padding: 24,
        width: '85%',
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 8,
    },
    message: {
        fontSize: 16,
        color: '#8F94FB',
        textAlign: 'center',
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#4E54C8',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
}); 