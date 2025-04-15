import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Icon } from '@rneui/themed';

interface SuccessModalProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

export default function SuccessModal({ visible, title, message, onClose }: SuccessModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <Icon
                            name="check-circle"
                            type="font-awesome-5"
                            color="#4CAF50"
                            size={50}
                            solid
                        />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={onClose}
                    >
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
    modalContainer: {
        backgroundColor: '#252544',
        borderRadius: 20,
        padding: 24,
        width: '85%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#8F94FB',
        marginBottom: 24,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#4E54C8',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
}); 