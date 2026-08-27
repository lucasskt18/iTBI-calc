import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Icon } from '@rneui/themed';
import { colors, radii } from '../theme';

interface SuccessModalProps {
    visible: boolean;
    title: string;
    message: string | React.ReactNode;
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
                            color={colors.success}
                            size={50}
                            solid
                        />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    
                    {typeof message === "string" ? (
                        <Text style={styles.message}>{message}</Text>
                    ) : (
                        <View>{message}</View>
                    )}

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
    button: {
        backgroundColor: colors.accent,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: radii.md,
        width: '100%',
    },
    buttonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
});