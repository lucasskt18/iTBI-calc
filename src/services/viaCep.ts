import axios from "axios";

export type ViaCepAddress = {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
};

export class ViaCepError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ViaCepError";
  }
}

export function digitsOnlyCep(cep: string): string {
  return cep.replace(/\D/g, "").slice(0, 8);
}

export async function fetchAddressByCep(cep: string): Promise<ViaCepAddress> {
  const cleanCep = digitsOnlyCep(cep);
  if (cleanCep.length !== 8) {
    throw new ViaCepError("CEP deve ter 8 dígitos.");
  }

  try {
    const response = await axios.get(
      `https://viacep.com.br/ws/${cleanCep}/json/`
    );

    if (response.data?.erro) {
      throw new ViaCepError("CEP inválido.");
    }

    return {
      address: response.data.logradouro || "",
      neighborhood: response.data.bairro || "",
      city: response.data.localidade || "",
      state: response.data.uf || "",
    };
  } catch (error) {
    if (error instanceof ViaCepError) {
      throw error;
    }
    throw new ViaCepError("Erro ao buscar o endereço. Verifique o CEP.");
  }
}
