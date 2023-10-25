import { type AxiosResponse } from "axios";
import { APIError } from "libs/errors.ts";
import { apiInstance, baseApi } from "libs/api/base-api.ts";

export class EnderecoService {
  private static instance: EnderecoService | null = null;

  private constructor() {
    // Private constructor to prevent external instantiation.
  }

  public static getInstance(): EnderecoService {
    if (!EnderecoService.instance) {
      EnderecoService.instance = new EnderecoService();
    }
    return EnderecoService.instance;
  }

  getAllEnderecos = async (): Promise<EnderecoData[]> => {
    const request: AxiosResponse<EnderecoData[]> = await apiInstance({
      method: "GET",
      url: `${baseApi}/endereco?page=0,100`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao carregar os enderecos.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  getEnderecoFormatado = async (
    id?: string,
    perPage?: PerPage,
  ): Promise<EnderecoFormatadoData[]> => {
    const _perPage: string = perPage
      ? `page=${perPage.start},${perPage.end}`
      : "page=0,100";
    const request: AxiosResponse<EnderecoFormatadoData[]> = await apiInstance({
      method: "GET",
      url: id
        ? `${baseApi}/enderecoformatado?filter=id,eq,${id}&${_perPage}`
        : `${baseApi}/enderecoformatado?${_perPage}`,
      params: {},
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: "Ocorreu um erro ao carregar o(s) endereço(s).",
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }
    return request.data;
  };

  getEnderecoByID = async (id: string): Promise<EnderecoData> => {
    const request: AxiosResponse<EnderecoData> = await apiInstance({
      method: "GET",
      url: `${baseApi}/endereco/${id}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao localizar o endereco.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  getEnderecoByUF = async (uf?: string): Promise<EnderecoData[]> => {
    const request: AxiosResponse<EnderecoData[]> = await apiInstance({
      method: "GET",
      url: `${baseApi}/unidade${`?filter=bloco,eq,${uf}`}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao localizar o endereco.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  addUpdateEndereco = async (endereco: EnderecoData): Promise<EnderecoData> => {
    const request: AxiosResponse<EnderecoData> = await apiInstance({
      method: endereco.id ? "PUT" : "POST",
      url: endereco.id
        ? `${baseApi}/endereco/${endereco.id}`
        : `${baseApi}/endereco`,
      params: {}, // headers: { 'content-type': 'multipart/form-data' },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: endereco,
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao ${
          endereco.id ? "atualizar" : "salvar"
        } o Endereco.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  deleteEndereco = (enderecoID: string | number) =>
    apiInstance({
      method: "DELETE",
      url: `${baseApi}/endereco/${enderecoID}`,
      params: {}, // headers: { 'content-type': 'multipart/form-data' },
      headers: { "Content-Type": "application/json" },
    });
}
