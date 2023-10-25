import { APIError } from "libs/errors.ts";
import { type AxiosResponse } from "axios";
import { apiInstance, baseApi } from "libs/api/base-api.ts";

export class CondominioService {
  private static instance: CondominioService | null = null;

  private constructor() {
    // Private constructor to prevent external instantiation.
  }

  public static getInstance(): CondominioService {
    if (!CondominioService.instance) {
      CondominioService.instance = new CondominioService();
    }
    return CondominioService.instance;
  }

  getAllCondominios = async (
    idEndereco?: string,
    perPage?: PerPage,
  ): Promise<CondominioData[]> => {
    const _perPage: string = perPage
      ? `page=${perPage.start},${perPage.end}`
      : "page=0,100";
    const request: AxiosResponse<CondominioData[]> = await apiInstance({
      method: "GET",
      url: idEndereco
        ? `${baseApi}/condominiocompleto?filter=idEndereco,eq,${idEndereco}&${_perPage}`
        : `${baseApi}/condominiocompleto?${_perPage}`,
      params: {},
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: "Ocorreu um erro ao carregar a lista de Condôminios.",
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }
    return request.data;
  };

  getCondominioById = async (id: string | number): Promise<CondominioData> => {
    const request: AxiosResponse<CondominioData> = await apiInstance({
      method: "GET",
      url: `${baseApi}/condominiocompleto/${id}`,
      params: {},
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: "Ocorreu um erro ao carregar o Condôminio.",
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  addUpdateCondominio = async (
    condominio: CondominioData,
  ): Promise<CondominioData> => {
    const request: AxiosResponse<CondominioData> = await apiInstance({
      method: condominio.id ? "PUT" : "POST",
      url: condominio.id
        ? `${baseApi}/condominio/${condominio.id}`
        : `${baseApi}/condominio`,
      params: {}, // headers: { 'content-type': 'multipart/form-data' },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: condominio,
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao ${
          condominio.id ? "atualizar" : "salvar"
        } o Condôminio.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  deleteCondominio = (condominoID: number | string) =>
    apiInstance({
      method: "DELETE",
      url: `${baseApi}/condominio/${condominoID}`,
      params: {}, // headers: { 'content-type': 'multipart/form-data' },
      headers: { "Content-Type": "application/json" },
    });
}
