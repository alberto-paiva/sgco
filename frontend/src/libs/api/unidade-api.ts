import { APIError } from "libs/errors.ts";
import { apiInstance, baseApi } from "libs/api/base-api.ts";
import { type AxiosResponse } from "axios";

export class UnidadeService {
  private static instance: UnidadeService | null = null;

  private constructor() {
    // Private constructor to prevent external instantiation.
  }

  public static getInstance(): UnidadeService {
    if (!UnidadeService.instance) {
      UnidadeService.instance = new UnidadeService();
    }
    return UnidadeService.instance;
  }

  getNomeBlocos = async (): Promise<BlocoLabelsData[]> => {
    const request: AxiosResponse<BlocoLabelsData[]> = await apiInstance({
      method: "GET",
      url: `${baseApi}/unidadeblocosdistinct?page=0,100`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao carregar os nomes dos blocos.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  getApartamentosPorBlocos = async (
    bloco: string | undefined,
  ): Promise<ApartamentoData[]> => {
    const request: AxiosResponse<ApartamentoData[]> = await apiInstance({
      method: "GET",
      url: `${baseApi}/apartamentos${`?filter=bloco,eq,${bloco}`}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao carregar os apartamentos.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  getUnidadesPorBlocos = async (bloco?: string): Promise<UnidadeData[]> => {
    const request: AxiosResponse<UnidadeData[]> = await apiInstance({
      method: "GET",
      url: `${baseApi}/unidade${`?filter=bloco,eq,${bloco}`}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao carregar as unidades.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  getAllUnidades = async (
    idCondominio?: string | number,
    perPage?: PerPage,
  ): Promise<UnidadeData[]> => {
    const _perPage: string = perPage
      ? `page=${perPage.start},${perPage.end}`
      : "page=0,100";
    const request: AxiosResponse<UnidadeData[]> = await apiInstance({
      method: "GET",
      url: idCondominio
        ? `${baseApi}/unidadescompletas?filter=idCondominio,eq,${idCondominio}&${_perPage}`
        : `${baseApi}/unidadescompletas?${_perPage}`,
      params: {},
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: "Ocorreu um erro ao carregar a lista de Unidades.",
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }
    return request.data;
  };

  getUnidadeById = async (id: string): Promise<UnidadeData> => {
    const request: AxiosResponse<UnidadeData> = await apiInstance({
      method: "GET",
      url: `${baseApi}/unidade/${id}`,
      params: {},
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: "Ocorreu um erro ao carregar a Unidade.",
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  addUpdateUnidade = async (unidade: UnidadeData): Promise<UnidadeData> => {
    const request: AxiosResponse<UnidadeData> = await apiInstance({
      method: unidade.id ? "PUT" : "POST",
      url: unidade.id
        ? `${baseApi}/unidade/${unidade.id}`
        : `${baseApi}/unidade`,
      params: {}, // headers: { 'content-type': 'multipart/form-data' },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: unidade,
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao ${
          unidade.id ? "atualizar" : "salvar"
        } a Unidade.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  deleteUnidade = (unidadeID: number | string) =>
    apiInstance({
      method: "DELETE",
      url: `${baseApi}/unidade/${unidadeID}`,
      params: {}, // headers: { 'content-type': 'multipart/form-data' },
      headers: { "Content-Type": "application/json" },
    });
}
