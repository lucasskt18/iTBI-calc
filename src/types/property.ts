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
  transactionValue?: string;
  venalValue?: string;
  /** Alíquota em percentual (ex: "2" para 2%). */
  aliquota?: string;
  baseCalculo?: string;
  itbiValue?: string;
}

export type NewProperty = Omit<
  Property,
  | "id"
  | "transactionValue"
  | "venalValue"
  | "aliquota"
  | "baseCalculo"
  | "itbiValue"
>;
