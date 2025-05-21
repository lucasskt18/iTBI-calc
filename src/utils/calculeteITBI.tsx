type FormData = {
  propertyValue: string;
  venalValue: string;
};

const formatValue = (value: string) => {
  return parseFloat(value.replace(/\./g, "").replace(",", "."));
};

const calculateITBI = (
  formData: FormData,
  aliquot: number,
  validateForm: () => boolean,
  setErrorMessage: (message: string) => void,
  setShowErrorModal: (show: boolean) => void,
  setResult: (result: number) => void,
  setShowSuccessModal: (show: boolean) => void
) => {
  if (!validateForm()) {
    setErrorMessage("Por favor, preencha todos os campos corretamente.");
    setShowErrorModal(true);
    return;
  }

  const propertyValue = formatValue(formData.propertyValue);
  const venalValue = formatValue(formData.venalValue);

  let itbi = 0;

  if (propertyValue > venalValue) {
    itbi = (propertyValue * aliquot) / 100;
  } else {
    itbi = (venalValue * aliquot) / 100;
  }

  setResult(itbi);
  setShowSuccessModal(true);
};

/**
 * Calcula o Valor Venal do imóvel.
 * @param areaConstruida Área construída em m²
 * @param valorM2Construcao Valor do m² da construção
 * @param areaTerreno Área do terreno em m²
 * @param valorM2Terreno Valor do m² do terreno
 * @param fatorCorrecao Fator de correção (ex: 1.0, 0.95, 1.1)
 * @returns Valor Venal calculado
 */
export function calcularValorVenal(
  areaConstruida: number,
  valorM2Construcao: number,
  areaTerreno: number,
  valorM2Terreno: number,
  fatorCorrecao: number = 1
): number {
  const valorConstruido = areaConstruida * valorM2Construcao;
  const valorTerreno = areaTerreno * valorM2Terreno;
  return (valorConstruido + valorTerreno) * fatorCorrecao;
}

/**
 * Calcula o ITBI com base no maior valor entre Valor Venal e Valor de Transação.
 * @param valorVenal Valor Venal do imóvel
 * @param valorTransacao Valor de Transação (compra/venda)
 * @param aliquota Alíquota do ITBI (ex: 0.03 para 3%)
 * @returns Valor do ITBI
 */
export function calcularITBI(
  valorVenal: number,
  valorTransacao: number,
  aliquota: number
): { baseCalculo: number; itbi: number } {
  const baseCalculo = Math.max(valorVenal, valorTransacao);
  const itbi = baseCalculo * aliquota;
  return { baseCalculo, itbi };
}

export default calculateITBI;
