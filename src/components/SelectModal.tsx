import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { colors, radii } from '../theme';

interface Option {
    id: string;
    nome: string;
    sigla?: string;
}

interface SelectModalProps {
    visible: boolean;
    title: string;
    options: Option[];
    onSelect: (option: Option) => void;
    onClose: () => void;
}

export default function SelectModal({
    visible,
    title,
    options,
    onSelect,
    onClose,
}: SelectModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <ScrollView style={styles.optionsList}>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={styles.optionItem}
                                onPress={() => onSelect(option)}
                            >
                                <Text style={styles.optionText}>
                                    {option.sigla ? `${option.nome} (${option.sigla})` : option.nome}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.overlay,
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
    },
    optionsList: {
        maxHeight: 400,
    },
    optionItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    optionText: {
        color: colors.text,
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: colors.accent,
        padding: 14,
        borderRadius: radii.sm,
        marginTop: 16,
        alignItems: 'center',
    },
    closeButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
}); 