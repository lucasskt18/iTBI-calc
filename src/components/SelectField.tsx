import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Icon } from '@rneui/themed';

interface Option {
    id: string;
    nome: string;
    sigla?: string;
}

interface SelectFieldProps {
    value: string;
    placeholder: string;
    icon: string;
    options: Option[];
    error?: boolean;
    onPress: () => void;
}

export default function SelectField({
    value,
    placeholder,
    icon,
    options,
    error,
    onPress,
}: SelectFieldProps) {
    const selectedOption = options.find(option =>
        option.id === value || option.sigla === value
    );

    return (
        <View style={[styles.inputGroup, error && styles.inputError]}>
            <Icon name={icon} type="font-awesome-5" color="#8F94FB" size={20} />
            <TouchableOpacity
                style={styles.selector}
                onPress={onPress}
            >
                <Text style={[styles.selectorText, !value && styles.placeholderText]}>
                    {selectedOption ? (selectedOption.nome || selectedOption.sigla) : placeholder}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
    selector: {
        flex: 1,
        height: 24,
        justifyContent: 'center',
    },
    selectorText: {
        color: '#FFF',
        fontSize: 16,
        height: 24,
    },
    placeholderText: {
        color: '#8F94FB',
    },
}); 