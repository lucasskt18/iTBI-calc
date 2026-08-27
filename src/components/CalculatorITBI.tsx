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
import { colors, radii } from "../theme";

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
        placeholderTextColor={colors.muted}
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
        placeholderTextColor={colors.muted}
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
        placeholderTextColor={colors.muted}
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
        confirmColor={colors.accent}
        onConfirm={handleConfirmOverwrite}
        onCancel={() => setShowOverwriteModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    padding: 16,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    width: "100%",
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
    fontSize: 16,
  },
  disclaimer: {
    width: "100%",
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  errorText: {
    width: "100%",
    color: colors.danger,
    fontSize: 13,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    borderRadius: radii.sm,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderColor: "transparent",
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  resultContainer: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 16,
    gap: 8,
    width: "100%",
  },
  resultText: {
    color: colors.muted,
    fontSize: 15,
  },
  resultHighlight: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "700",
  },
  previewHint: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
});

export default CalculatorITBI;
