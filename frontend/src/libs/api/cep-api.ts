import { type AxiosResponse } from "axios";
import { apiInstance } from "libs/api/base-api.ts";
import { APIError } from "libs/errors.ts";

export class CEPService {
  private static instance: CEPService | null = null;

  private constructor() {
    // Private constructor to prevent external instantiation.
  }

  public static getInstance(): CEPService {
    if (!CEPService.instance) {
      CEPService.instance = new CEPService();
    }
    return CEPService.instance;
  }

  getCep = async (cep: string): Promise<EnderecoViaCEPData> => {
    const request: AxiosResponse<EnderecoViaCEPData> = await apiInstance({
      method: "GET",
      // url: `https://viacep.com.br/ws/${cep}/json/`,
      url: `https://opencep.com/v1/${cep}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (request?.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao carregar o CEP informado: [${cep}].`,
        cause: request?.statusText,
        details: {
          errorCode: request?.status ?? -1,
          additionalInfo: "Failed to fetch data",
        },
      });
    }
    return request.data;
  };
}
