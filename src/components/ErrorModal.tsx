import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { colors, radii } from '../theme';

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
                        color={colors.danger}
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
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 24,
        width: '85%',
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        marginTop: 8,
    },
    message: {
        fontSize: 15,
        color: colors.muted,
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 22,
    },
    button: {
        backgroundColor: colors.accent,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: radii.sm,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
}); 