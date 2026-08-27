import { describe, expect, it } from "@jest/globals";
import { calcularITBI, calcularValorVenal } from "../calculateITBI";

describe("calcularITBI", () => {
  it("usa o maior valor entre venal e transação como base", () => {
    const result = calcularITBI(150000, 200000, 2);

    expect(result.baseCalculo).toBe(200000);
    expect(result.itbi).toBe(4000);
    expect(result.aliquotaPercent).toBe(2);
  });

  it("usa o valor venal quando ele é maior", () => {
    const result = calcularITBI(300000, 180000, 3);

    expect(result.baseCalculo).toBe(300000);
    expect(result.itbi).toBe(9000);
  });

  it("aceita valores iguais", () => {
    const result = calcularITBI(100000, 100000, 2);

    expect(result.baseCalculo).toBe(100000);
    expect(result.itbi).toBe(2000);
  });
});

describe("calcularValorVenal", () => {
  it("soma construção e terreno e aplica o fator", () => {
    expect(calcularValorVenal(50, 1000, 100, 200, 1.1)).toBe(77000);
  });
});
