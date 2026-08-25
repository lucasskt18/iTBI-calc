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
