export interface Property {
  id: string;
  cep: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  area: string;
  /** Id do tipo (ex: "casa"), não o rótulo. */
  type: string;
  /** Nome do proprietário. */
  property: string;
  phone: string;
  venalValue?: string;
  /** Legado: a lista trata como transação, mas o save da calculadora grava a base. */
  propertyValue?: string;
  itbiValue?: string;
}

export type NewProperty = Omit<
  Property,
  "id" | "venalValue" | "propertyValue" | "itbiValue"
>;
