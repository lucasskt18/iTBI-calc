export const TIPOS_IMOVEIS = [
  { id: "casa", nome: "Casa" },
  { id: "apartamento", nome: "Apartamento" },
  { id: "terreno", nome: "Terreno" },
  { id: "galpao", nome: "Galpão" },
  { id: "loja", nome: "Loja" },
  { id: "chácara", nome: "Chácara" },
  { id: "predio", nome: "Prédio Comercial" },
  { id: "sitio", nome: "Sítio" },
  { id: "fazenda", nome: "Fazenda" },
  { id: "outro", nome: "Outro" },
];

export function getPropertyTypeLabel(type: string): string {
  const match = TIPOS_IMOVEIS.find(
    (item) => item.id === type || item.nome.toLowerCase() === type.toLowerCase()
  );
  return match?.nome ?? type;
}

export function getPropertyTypeId(type: string): string {
  const normalized = type.trim().toLowerCase();
  const match = TIPOS_IMOVEIS.find(
    (item) =>
      item.id.toLowerCase() === normalized ||
      item.nome.toLowerCase() === normalized
  );
  return match?.id ?? type;
}
