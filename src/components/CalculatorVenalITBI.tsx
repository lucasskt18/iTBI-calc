import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { calcularValorVenal, calcularITBI } from '../utils/calculeteITBI';

interface CalculatorVenalITBIProps {
    initialAreaConstruida?: string;
    initialValorM2Construcao?: string;
    initialAreaTerreno?: string;
    initialValorM2Terreno?: string;
    initialFatorCorrecao?: string;
    initialValorTransacao?: string;
    initialAliquota?: string;
    onSave?: (result: {
        valorVenal: number;
        baseCalculo: number;
        itbi: number;
    }) => void;
}

const CalculatorVenalITBI: React.FC<CalculatorVenalITBIProps> = ({
    initialAreaConstruida = '',
    initialValorM2Construcao = '',
    initialAreaTerreno = '',
    initialValorM2Terreno = '',
    initialFatorCorrecao = '1',
    initialValorTransacao = '',
    initialAliquota = '',
    onSave,
}) => {
    const [areaConstruida, setAreaConstruida] = useState(initialAreaConstruida);
    const [valorM2Construcao, setValorM2Construcao] = useState(initialValorM2Construcao);
    const [areaTerreno, setAreaTerreno] = useState(initialAreaTerreno);
    const [valorM2Terreno, setValorM2Terreno] = useState(initialValorM2Terreno);
    const [fatorCorrecao, setFatorCorrecao] = useState(initialFatorCorrecao);
    const [valorTransacao, setValorTransacao] = useState(initialValorTransacao);
    const [aliquota, setAliquota] = useState(initialAliquota);
    const [resultado, setResultado] = useState<null | {
        valorVenal: number;
        baseCalculo: number;
        itbi: number;
    }>(null);

    const handleCalcular = () => {
        // Conversão dos valores para número
        const areaC = parseFloat(areaConstruida.replace(',', '.')) || 0;
        const vM2C = parseFloat(valorM2Construcao.replace(',', '.')) || 0;
        const areaT = parseFloat(areaTerreno.replace(',', '.')) || 0;
        const vM2T = parseFloat(valorM2Terreno.replace(',', '.')) || 0;
        const fator = parseFloat(fatorCorrecao.replace(',', '.')) || 1;
        const vTrans = parseFloat(valorTransacao.replace(',', '.')) || 0;
        const aliq = (parseFloat(aliquota.replace(',', '.')) || 0) / 100;

        const valorVenal = calcularValorVenal(areaC, vM2C, areaT, vM2T, fator);
        const { baseCalculo, itbi } = calcularITBI(valorVenal, vTrans, aliq);

        setResultado({ valorVenal, baseCalculo, itbi });
        if (onSave) {
            onSave({ valorVenal, baseCalculo, itbi });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Cálculo Valor Venal e ITBI</Text>
            <TextInput
                style={styles.input}
                placeholder="Área construída (m²)"
                keyboardType="numeric"
                value={areaConstruida}
                onChangeText={setAreaConstruida}
            />
            <TextInput
                style={styles.input}
                placeholder="Valor m² construção"
                keyboardType="numeric"
                value={valorM2Construcao}
                onChangeText={setValorM2Construcao}
            />
            <TextInput
                style={styles.input}
                placeholder="Área do terreno (m²)"
                keyboardType="numeric"
                value={areaTerreno}
                onChangeText={setAreaTerreno}
            />
            <TextInput
                style={styles.input}
                placeholder="Valor m² terreno"
                keyboardType="numeric"
                value={valorM2Terreno}
                onChangeText={setValorM2Terreno}
            />
            <TextInput
                style={styles.input}
                placeholder="Fator de correção (ex: 1.0)"
                keyboardType="numeric"
                value={fatorCorrecao}
                onChangeText={setFatorCorrecao}
            />
            <TextInput
                style={styles.input}
                placeholder="Valor de Transação (R$)"
                keyboardType="numeric"
                value={valorTransacao}
                onChangeText={setValorTransacao}
            />
            <TextInput
                style={styles.input}
                placeholder="Alíquota (%)"
                keyboardType="numeric"
                value={aliquota}
                onChangeText={setAliquota}
            />
            <TouchableOpacity style={styles.button} onPress={handleCalcular}>
                <Text style={styles.buttonText}>Calcular</Text>
            </TouchableOpacity>
            {resultado && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>
                        Valor Venal: R$ {resultado.valorVenal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                    <Text style={styles.resultText}>
                        Base de Cálculo: R$ {resultado.baseCalculo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                    <Text style={styles.resultText}>
                        ITBI: R$ {resultado.itbi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#1A1A2E',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: '#252544',
        color: '#FFF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4E54C8',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultContainer: {
        backgroundColor: '#252544',
        borderRadius: 10,
        padding: 20,
        marginTop: 20,
        width: '100%',
    },
    resultText: {
        color: '#8F94FB',
        fontSize: 16,
        marginBottom: 8,
    },
});

export default CalculatorVenalITBI; 