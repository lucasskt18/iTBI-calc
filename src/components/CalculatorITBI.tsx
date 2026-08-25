import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ConfirmationModal from "./ConfirmationModal";
import { calcularITBI, ItbiCalculation } from "../utils/calculateITBI";
import {
  formatCurrencyInput,
  parseCurrencyInput,
  parsePercentInput,
} from "../utils/formatCurrency";

export type CalculationResult = ItbiCalculation;

interface CalculatorVenalITBIProps {
  initialValorVenal?: string;
  initialValorTransacao?: string;
  initialAliquota?: string;
  hasSavedCalculation?: boolean;
  onSave?: (result: CalculationResult) => void;
}

const DEFAULT_ALIQUOTA = "2";

const CalculatorITBI: React.FC<CalculatorVenalITBIProps> = ({
  initialValorVenal = "",
  initialValorTransacao = "",
  initialAliquota = "",
  hasSavedCalculation = false,
  onSave,
}) => {
  const [valorVenal, setValorVenal] = useState(initialValorVenal);
  const [valorTransacao, setValorTransacao] = useState(initialValorTransacao);
  const [aliquota, setAliquota] = useState(initialAliquota || DEFAULT_ALIQUOTA);
  const [resultado, setResultado] = useState<CalculationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);

  const invalidateResult = () => {
    if (resultado) setResultado(null);
    if (errorMessage) setErrorMessage("");
  };

  const computeFromFields = (): CalculationResult | null => {
    const vVenal = parseCurrencyInput(valorVenal);
    const vTrans = parseCurrencyInput(valorTransacao);
    const aliquotaPercent = parsePercentInput(aliquota);

    if (vVenal <= 0 && vTrans <= 0) {
      setErrorMessage("Informe o valor de transação e/ou o valor venal.");
      return null;
    }

    if (aliquotaPercent <= 0) {
      setErrorMessage("Informe uma alíquota maior que zero.");
      return null;
    }

    setErrorMessage("");
    return calcularITBI(vVenal, vTrans, aliquotaPercent);
  };

  const handleCalcular = () => {
    const calculation = computeFromFields();
    if (calculation) {
      setResultado(calculation);
    }
  };

  const persist = (calculation: CalculationResult) => {
    onSave?.(calculation);
  };

  const handleSave = () => {
    if (!resultado) {
      setErrorMessage("Calcule o ITBI antes de salvar.");
      return;
    }

    if (hasSavedCalculation) {
      setShowOverwriteModal(true);
      return;
    }

    persist(resultado);
  };

  const handleConfirmOverwrite = () => {
    setShowOverwriteModal(false);
    if (resultado) persist(resultado);
  };

  const saveDisabled = !resultado;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Valor de Transação (R$)"
        placeholderTextColor="#8F94FB"
        keyboardType="numeric"
        value={valorTransacao}
        onChangeText={(text) => {
          setValorTransacao(formatCurrencyInput(text));
          invalidateResult();
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor Venal (R$)"
        placeholderTextColor="#8F94FB"
        keyboardType="numeric"
        value={valorVenal}
        onChangeText={(text) => {
          setValorVenal(formatCurrencyInput(text));
          invalidateResult();
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Alíquota (%)"
        placeholderTextColor="#8F94FB"
        keyboardType="numeric"
        value={aliquota}
        onChangeText={(text) => {
          setAliquota(text);
          invalidateResult();
        }}
      />
      <Text style={styles.disclaimer}>
        Estimativa. A alíquota do ITBI é definida pelo município; o padrão 2% é
        só um ponto de partida editável.
      </Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleCalcular}>
        <Text style={styles.buttonText}>Calcular</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.saveButton, saveDisabled && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saveDisabled}
      >
        <Text style={styles.buttonText}>Salvar no imóvel</Text>
      </TouchableOpacity>

      {resultado && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Valor de Transação: R${" "}
            {resultado.valorTransacao.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text style={styles.resultText}>
            Valor Venal: R${" "}
            {resultado.valorVenal.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text style={styles.resultText}>
            Alíquota: {resultado.aliquotaPercent.toLocaleString("pt-BR")}%
          </Text>
          <Text style={styles.resultText}>
            Base de cálculo: R${" "}
            {resultado.baseCalculo.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text style={styles.resultHighlight}>
            ITBI: R${" "}
            {resultado.itbi.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text style={styles.previewHint}>
            Isto ainda é uma prévia. Toque em Salvar no imóvel para gravar.
          </Text>
        </View>
      )}

      <ConfirmationModal
        visible={showOverwriteModal}
        title="Substituir cálculo?"
        message="Este imóvel já tem um ITBI salvo. Deseja substituir pelos valores atuais?"
        confirmLabel="Substituir"
        confirmColor="#4E54C8"
        onConfirm={handleConfirmOverwrite}
        onCancel={() => setShowOverwriteModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A2E",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
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
  disclaimer: {
    width: "100%",
    color: "#8F94FB",
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.85,
    marginBottom: 8,
  },
  errorText: {
    width: "100%",
    color: "#FF6B6B",
    fontSize: 13,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#4E54C8",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#11998e",
  },
  buttonDisabled: {
    opacity: 0.45,
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
    gap: 10,
    width: "100%",
  },
  resultText: {
    color: "#8F94FB",
    fontSize: 16,
  },
  resultHighlight: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  previewHint: {
    color: "#8F94FB",
    fontSize: 12,
    marginTop: 4,
    opacity: 0.85,
  },
});

export default CalculatorITBI;
