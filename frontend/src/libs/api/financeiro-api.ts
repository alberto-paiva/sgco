import { APIError } from "libs/errors.ts";
import { apiInstance, baseApi } from "libs/api/base-api.ts";
import { type AxiosResponse } from "axios";

// import phpApi from "libs/api/php-api.ts";

export class FinanceiroService {
  private static instance: FinanceiroService | null = null;

  private constructor() {
    // Private constructor to prevent external instantiation.
  }

  public static getInstance(): FinanceiroService {
    if (!FinanceiroService.instance) {
      FinanceiroService.instance = new FinanceiroService();
    }
    return FinanceiroService.instance;
  }

  getAllFinanceiroData = async (
    anoCalendario?: string,
  ): Promise<FinanceiroData[]> => {
    const request: AxiosResponse<FinanceiroData[]> = await apiInstance({
      method: "GET",
      url: anoCalendario
        ? `${baseApi}/financeiro?filter=anoCalendario,eq,${anoCalendario}`
        : `${baseApi}/financeiro?page=0,100`,
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

  getFinanceiroByID = async (id: string | number): Promise<FinanceiroData> => {
    const request: AxiosResponse<FinanceiroData> = await apiInstance({
      method: "GET",
      url: `${baseApi}/financeiro/${id}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao localizar os dados.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  getFinanceiroByStatus = async (
    status: "PENDENTE" | "PAGO",
    anoCalendario?: string,
  ): Promise<FinanceiroData[]> => {
    const request: AxiosResponse<FinanceiroData[]> = await apiInstance({
      method: "GET",
      url: anoCalendario
        ? `${baseApi}/financeiro?filter=status,eq,${status}&filter=anoCalendario,eq,${anoCalendario}`
        : `${baseApi}/financeiro?filter=status,eq,${status}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao localizar os dados.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  getFinanceiroByTipo = async (
    tipo: "RECEITA" | "DESPESA",
    anoCalendario?: string,
  ): Promise<FinanceiroData[]> => {
    const request: AxiosResponse<FinanceiroData[]> = await apiInstance({
      method: "GET",
      url: anoCalendario
        ? `${baseApi}/financeiro?filter=tipo,eq,${tipo}&filter=anoCalendario,eq,${anoCalendario}`
        : `${baseApi}/financeiro?filter=tipo,eq,${tipo}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao localizar os dados.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  getFinanceiroMensalidade = async (
    idUnidade?: string | number,
    anoCalendario?: string,
    perPage?: PerPage,
  ): Promise<FinanceiroData[]> => {
    const _perPage: string = perPage
      ? `page=${perPage.start},${perPage.end}`
      : "page=0,100";
    const request: AxiosResponse<FinanceiroData[]> = await apiInstance({
      method: "GET",
      url: anoCalendario
        ? `${baseApi}/financeiro?filter=idUnidade,eq,${idUnidade}&filter=anoCalendario,eq,${anoCalendario}`
        : idUnidade
        ? `${baseApi}/financeiro?filter=idUnidade,eq,${idUnidade}&${_perPage}`
        : `${baseApi}/mensalidade?${_perPage}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao localizar os dados.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  getFinanceiroByUnidade = async (
    idUnidade?: string | number,
    anoCalendario?: string,
  ): Promise<FinanceiroData[]> => {
    const request: AxiosResponse<FinanceiroData[]> = await apiInstance({
      method: "GET",
      url: anoCalendario
        ? `${baseApi}/financeiro?filter=idUnidade,eq,${idUnidade}&filter=anoCalendario,eq,${anoCalendario}`
        : `${baseApi}/financeiro?filter=idUnidade,eq,${idUnidade}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (request.status !== 200) {
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao localizar os dados.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  addUpdateFinanceiro = async (
    financeiro: FinanceiroData,
  ): Promise<FinanceiroData> => {
    const request: AxiosResponse<FinanceiroData> = await apiInstance({
      method: financeiro.id ? "PUT" : "POST",
      url: financeiro.id
        ? `${baseApi}/financeiro/${financeiro.id}`
        : `${baseApi}/financeiro`,
      params: {}, // headers: { 'content-type': 'multipart/form-data' },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: financeiro,
    });

    if (request.status !== 200) {
      console.log(request.status);
      console.log(request);
      throw new APIError({
        name: "GET_ERROR",
        message: `Ocorreu um erro ao ${
          financeiro.id ? "atualizar" : "salvar"
        } o Financeiro.`,
        cause: request.statusText,
        details: {
          errorCode: request.status,
          additionalInfo: "Failed to fetch data",
        },
      });
    }

    return request.data;
  };

  deleteFinanceiro = async (
    financeiroID: number | string | number[] | string[],
  ) =>
    await apiInstance({
      method: "DELETE",
      url: `${baseApi}/financeiro/${financeiroID}`,
      params: {}, // headers: { 'content-type': 'multipart/form-data' },
      headers: { "Content-Type": "application/json" },
    });
}
