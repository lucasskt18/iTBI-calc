import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

interface CalculatorVenalITBIProps {
  initialValorVenal?: string;
  initialValorTransacao?: string;
  initialAliquota?: string;
  onSave?: (result: {
    valorVenal: number;
    baseCalculo: number;
    itbi: number;
  }) => void;
}

const CalculatorITBI: React.FC<CalculatorVenalITBIProps> = ({
  initialValorVenal = "",
  initialValorTransacao = "",
  initialAliquota = "",
}) => {
  const [valorVenal, setValorVenal] = useState(initialValorVenal);
  const [valorTransacao, setValorTransacao] = useState(initialValorTransacao);
  const [aliquota, setAliquota] = useState(initialAliquota);
  const [resultado, setResultado] = useState<null | {
    valorVenal: number;
    valorTransacao: number;
    baseCalculo: number;
    itbi: number;
  }>(null);

  function moedaParaNumero(valor: string) {
    // Remove tudo que não for número
    let v = valor.replace(/\D/g, "");
    // Divide por 100 para ter os centavos
    return parseFloat((parseInt(v, 10) / 100).toFixed(2));
  }

  const handleCalcular = () => {
    const vVenal = moedaParaNumero(valorVenal) || 0;
    const vTrans = moedaParaNumero(valorTransacao) || 0;
    const aliq = (parseFloat(aliquota.replace(",", ".")) || 0) / 100;

    const baseCalculo = Math.max(vVenal, vTrans);
    const itbi = baseCalculo * aliq;

    setResultado({
      valorVenal: vVenal,
      valorTransacao: vTrans,
      baseCalculo,
      itbi,
    });
  };

  // Função utilitária para formatar como moeda BRL
  function formatarMoeda(valor: string) {
    // Remove tudo que não for número
    let v = valor.replace(/\D/g, "");
    // Divide por 100 para ter os centavos
    v = (parseInt(v, 10) / 100).toFixed(2);
    // Formata para moeda BRL
    return Number(v).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Valor de Transação (R$)"
        placeholderTextColor="#8F94FB"
        keyboardType="numeric"
        value={valorTransacao}
        onChangeText={(text) => setValorTransacao(formatarMoeda(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor Venal (R$)"
        placeholderTextColor="#8F94FB"
        keyboardType="numeric"
        value={valorVenal}
        onChangeText={(text) => setValorVenal(formatarMoeda(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Alíquota (%)"
        placeholderTextColor="#8F94FB"
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
            Valor Venal: R${" "}
            {resultado.valorVenal.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text style={styles.resultText}>
            Valor de Transação: R${" "}
            {resultado.valorTransacao.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text style={styles.resultText}>
            ITBI: R${" "}
            {resultado.itbi.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1A1A2E",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#252544",
    color: "#FFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4E54C8",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    backgroundColor: "#252544",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    width: "100%",
  },
  resultText: {
    color: "#8F94FB",
    fontSize: 16,
    marginBottom: 8,
  },
});

export default CalculatorITBI;
