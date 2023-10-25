import { type AxiosResponse } from "axios";
import { APIError } from "libs/errors.ts";
import { apiInstance, baseApi } from "libs/api/base-api.ts";

export class SindicoService {
  private static instance: SindicoService | null = null;

  private constructor() {
    // Private constructor to prevent external instantiation.
  }

  public static getInstance(): SindicoService {
    if (!SindicoService.instance) {
      SindicoService.instance = new SindicoService();
    }
    return SindicoService.instance;
  }

  getAllSindicos = async (
    condominioId?: string | number,
    onlyActives?: number,
    perPage?: PerPage,
  ): Promise<SindicoData[]> => {
    const _perPage: string = perPage
      ? `page=${perPage.start},${perPage.end}`
      : "page=0,100";
    const request: AxiosResponse<SindicoData[]> = await apiInstance({
      method: "GET",
      url: condominioId
        ? // filter=idCondominio,eq,${condominioId}&filter=ativo,eq,${onlyActives}&${_perPage}
          `${baseApi}/sindicoscompleto?filter=idCondominio,eq,${condominioId}&filter=ativo,eq,${onlyActives}&${_perPage}`
        : // ? `${baseApi}/sindicoscompleto?filter=idCondominio,eq,${condominioId}&${_perPage}`
          `${baseApi}/sindicoscompleto?${_perPage}`,
      params: {},
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: "Ocorreu um erro ao carregar a lista de Síndicos.",
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }
    return request.data;
  };

  getSindicoById = async (id: string): Promise<SindicoData> => {
    const request: AxiosResponse<SindicoData> = await apiInstance({
      method: "GET",
      url: `${baseApi}/sindicoscompleto/${id}`,
      params: {},
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: "Ocorreu um erro ao carregar o Síndico.",
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  addUpdateSindico = async (sindico: SindicoData): Promise<SindicoData> => {
    const request: AxiosResponse<SindicoData> = await apiInstance({
      method: sindico.id ? "PUT" : "POST",
      url: sindico.id
        ? `${baseApi}/sindico/${sindico.id}`
        : `${baseApi}/sindico`,
      params: {}, // headers: { 'content-type': 'multipart/form-data' },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: sindico,
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao ${
          sindico.id ? "atualizar" : "salvar"
        } o Síndico.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  deleteSindico = (sindicoID: number | string) =>
    apiInstance({
      method: "DELETE",
      url: `${baseApi}/sindico/${sindicoID}`,
      params: {}, // headers: { 'content-type': 'multipart/form-data' },
      headers: { "Content-Type": "application/json" },
    });
}
