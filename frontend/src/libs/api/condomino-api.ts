import { type AxiosResponse } from "axios";
import { APIError } from "libs/errors.ts";
import { apiInstance, baseApi } from "libs/api/base-api.ts";

export class CondominoService {
  private static instance: CondominoService | null = null;

  private constructor() {
    // Private constructor to prevent external instantiation.
  }

  public static getInstance(): CondominoService {
    if (!CondominoService.instance) {
      CondominoService.instance = new CondominoService();
    }
    return CondominoService.instance;
  }

  getAllCondominos = async (
    bloco?: string,
    perPage?: PerPage,
  ): Promise<CondominoData[]> => {
    const _perPage: string = perPage
      ? `page=${perPage.start},${perPage.end}`
      : "page=0,100";
    const request: AxiosResponse<CondominoData[]> = await apiInstance({
      method: "GET",
      url: bloco
        ? `${baseApi}/condominocompleto?filter=bloco,eq,${bloco}&${_perPage}`
        : `${baseApi}/condominocompleto?${_perPage}`,
      params: {},
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: "Ocorreu um erro ao carregar a lista de Condôminos.",
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }
    return request.data;
  };

  getCondominoById = async (id: string | number): Promise<CondominoData> => {
    const request: AxiosResponse<CondominoData> = await apiInstance({
      method: "GET",
      url: `${baseApi}/condominocompleto/${id}`,
      params: {},
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: "Ocorreu um erro ao carregar o Condômino.",
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  addUpdateCondomino = async (
    condomino: CondominoData,
  ): Promise<CondominoData> => {
    const request: AxiosResponse<CondominoData> = await apiInstance({
      method: condomino.id ? "PUT" : "POST",
      url: condomino.id
        ? `${baseApi}/condomino/${condomino.id}`
        : `${baseApi}/condomino`,
      params: {}, // headers: { 'content-type': 'multipart/form-data' },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: condomino,
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao ${
          condomino.id ? "atualizar" : "salvar"
        } o Condômino.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  deleteCondomino = (condominoID: number | string) =>
    apiInstance({
      method: "DELETE",
      url: `${baseApi}/condomino/${condominoID}`,
      params: {}, // headers: { 'content-type': 'multipart/form-data' },
      headers: { "Content-Type": "application/json" },
    });
}
