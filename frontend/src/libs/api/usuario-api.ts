import { type AxiosResponse } from "axios";
import { APIError } from "libs/errors.ts";
import { apiInstance, baseApi } from "libs/api/base-api.ts";

export class UsuarioService {
  private static instance: UsuarioService | null = null;

  private constructor() {
    // Private constructor to prevent external instantiation.
  }

  public static getInstance(): UsuarioService {
    if (!UsuarioService.instance) {
      UsuarioService.instance = new UsuarioService();
    }
    return UsuarioService.instance;
  }

  getAllUsuariosCondominos = async (): Promise<UsuarioData[]> => {
    const request: AxiosResponse<UsuarioData[]> = await apiInstance({
      method: "GET",
      url: `${baseApi}/usuarioscondominos`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao carregar os dados.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  getAllUsuariosSindicos = async (): Promise<UsuarioData[]> => {
    const request: AxiosResponse<UsuarioData[]> = await apiInstance({
      method: "GET",
      url: `${baseApi}/usuariossindicos?page=0,100`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao carregar os dados.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };
}
