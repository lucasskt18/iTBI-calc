import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Icon } from '@rneui/themed';
import { colors, radii } from '../theme';

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    confirmColor?: string;
}

export default function ConfirmationModal({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = "Excluir",
    confirmColor = colors.danger,
}: ConfirmationModalProps) {
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
                            name="exclamation-circle"
                            type="font-awesome-5"
                            color={colors.danger}
                            size={50}
                            solid
                        />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                        >
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton, { backgroundColor: confirmColor }]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.buttonText}>{confirmLabel}</Text>
                        </TouchableOpacity>
                    </View>
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
    modalContainer: {
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 24,
        width: '85%',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: colors.muted,
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: radii.sm,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
    },
    confirmButton: {
        backgroundColor: colors.danger,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
    cancelButtonText: {
        color: colors.muted,
    },
}); 