export type ItbiCalculation = {
  valorVenal: number;
  valorTransacao: number;
  aliquotaPercent: number;
  baseCalculo: number;
  itbi: number;
};

/**
 * Estima valor venal a partir de áreas e valores de m².
 * Ainda não entra na UI: o cadastro só tem uma área.
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
 * ITBI = max(venal, transação) × (alíquota% / 100).
 * `aliquotaPercent` é o número que o usuário digita (ex: 2 para 2%).
 */
export function calcularITBI(
  valorVenal: number,
  valorTransacao: number,
  aliquotaPercent: number
): ItbiCalculation {
  const aliquotaDecimal = aliquotaPercent / 100;
  const baseCalculo = Math.max(valorVenal, valorTransacao);
  const itbi = baseCalculo * aliquotaDecimal;

  return {
    valorVenal,
    valorTransacao,
    aliquotaPercent,
    baseCalculo,
    itbi,
  };
}
