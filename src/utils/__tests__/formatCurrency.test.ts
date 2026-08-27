import { describe, expect, it } from "@jest/globals";
import {
  parseCurrencyInput,
  parsePercentInput,
  formatStoredMoney,
  formatStoredPercent,
} from "../formatCurrency";

describe("parseCurrencyInput", () => {
  it("interpreta apenas dígitos como valor em centavos", () => {
    expect(parseCurrencyInput("R$ 1.500,00")).toBe(1500);
    expect(parseCurrencyInput("")).toBe(0);
  });
});

describe("parsePercentInput", () => {
  it("aceita vírgula e símbolo de percentual", () => {
    expect(parsePercentInput("2,5")).toBe(2.5);
    expect(parsePercentInput("3%")).toBe(3);
    expect(parsePercentInput("")).toBe(0);
  });
});

describe("formatStoredMoney", () => {
  it("mostra hífen quando não há valor", () => {
    expect(formatStoredMoney()).toBe("-");
    expect(formatStoredMoney("")).toBe("-");
  });

  it("formata número com duas casas", () => {
    expect(formatStoredMoney("4000")).toContain("4");
  });
});

describe("formatStoredPercent", () => {
  it("mostra hífen quando vazio", () => {
    expect(formatStoredPercent()).toBe("-");
  });

  it("acrescenta o símbolo de percentual", () => {
    expect(formatStoredPercent("2")).toContain("%");
  });
});
