export function formatStoredMoney(value?: string): string {
  if (!value) return "-";
  const amount = Number(value);
  if (Number.isNaN(amount)) return "-";
  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatStoredPercent(value?: string): string {
  if (!value) return "-";
  const amount = Number(value.replace(",", "."));
  if (Number.isNaN(amount)) return "-";
  return `${amount.toLocaleString("pt-BR", {
    maximumFractionDigits: 4,
  })}%`;
}

export function formatNumberToCurrencyInput(value?: string): string {
  if (!value) return "";
  const amount = Number(value);
  if (Number.isNaN(amount)) return "";
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return parseFloat((parseInt(digits, 10) / 100).toFixed(2));
}

export function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return (parseInt(digits, 10) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function parsePercentInput(value: string): number {
  const amount = parseFloat(value.replace("%", "").replace(",", ".").trim());
  return Number.isNaN(amount) ? 0 : amount;
}
