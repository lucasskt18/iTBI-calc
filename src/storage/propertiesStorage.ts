import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPropertyTypeId } from "../constants/propertyTypes";
import { NewProperty, Property } from "../types/property";

const STORAGE_KEY = "properties";

function asString(value: unknown): string {
  if (value == null) return "";
  return String(value);
}

function asOptionalString(value: unknown): string | undefined {
  const text = asString(value).trim();
  return text ? text : undefined;
}

/**
 * Normaliza registros antigos.
 * `propertyValue` no legado era a base de cálculo, não a transação —
 * por isso não é copiado para transactionValue.
 */
export function normalizeProperty(raw: Record<string, unknown>): Property {
  return {
    id: asString(raw.id),
    cep: asString(raw.cep),
    address: asString(raw.address),
    neighborhood: asString(raw.neighborhood),
    city: asString(raw.city),
    state: asString(raw.state),
    area: asString(raw.area),
    type: getPropertyTypeId(asString(raw.type)),
    property: asString(raw.property),
    phone: asString(raw.phone || raw.telefone || raw.propertyPhone),
    transactionValue: asOptionalString(raw.transactionValue),
    venalValue: asOptionalString(raw.venalValue),
    aliquota: asOptionalString(raw.aliquota),
    baseCalculo:
      asOptionalString(raw.baseCalculo) || asOptionalString(raw.propertyValue),
    itbiValue: asOptionalString(raw.itbiValue),
  };
}

async function readRawList(): Promise<unknown[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  const parsed = JSON.parse(stored);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeList(properties: Property[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

export async function listProperties(): Promise<Property[]> {
  const rawList = await readRawList();
  const properties = rawList
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map(normalizeProperty);

  await writeList(properties);
  return properties;
}

export async function getProperty(id: string): Promise<Property | null> {
  const properties = await listProperties();
  return properties.find((item) => item.id === id) ?? null;
}

export async function createProperty(input: NewProperty): Promise<Property> {
  const properties = await listProperties();
  const property: Property = {
    ...input,
    id: Date.now().toString(),
    type: getPropertyTypeId(input.type),
  };

  await writeList([...properties, property]);
  return property;
}

export async function updateProperty(
  id: string,
  patch: Partial<Property>
): Promise<Property> {
  const properties = await listProperties();
  const index = properties.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error("Imóvel não encontrado");
  }

  const updated: Property = {
    ...properties[index],
    ...patch,
    id,
    type: getPropertyTypeId(patch.type ?? properties[index].type),
  };

  properties[index] = updated;
  await writeList(properties);
  return updated;
}

export async function removeProperty(id: string): Promise<void> {
  const properties = await listProperties();
  await writeList(properties.filter((item) => item.id !== id));
}
