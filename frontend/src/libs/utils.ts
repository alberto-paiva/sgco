import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

export const BASE_URL = "/sgco/app/";
export const UPLOAD_BASE_URL = "/sgco/uploads/";
export const IMAGE_UPLOAD_BASE_URL = "/sgco/uploads/images/";
export const FILE_UPLOAD_BASE_URL = "/sgco/uploads/archives/";

/**
 * Generate a random string
 *
 * @see https://dev.to/rahmanfadhil/how-to-generate-unique-id-in-javascript-1b13#comment-1ol48
 *
 */
export const randomString = () =>
  String(Date.now().toString(32) + Math.random().toString(16)).replace(
    /\./g,
    "",
  );

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const formatDate = (value: string, format = "YYYY-MM-DD") => {
  const parseValue = dayjs(value, [
    "DD/MM/YYYY",
    "DDMMYYYY",
    "DD-MM-YYYY",
    "YYYY-MM-DD",
    "YYYYMMDD",
    "YYYY",
  ]);
  return parseValue.format(format);
};

export const validateFileSize = (file: File, maxFileSize?: number) => {
  if (maxFileSize && file.size > maxFileSize) {
    const message = {
      severity: "error",
      summary: `${file.name}: Tamanho inválido!`,
      detail: `Máximo: ${formatSize(maxFileSize)}.`,
    };
    return { message, status: false };
  }
  return { message: null, status: true };
};

export const getCurrentYear = () => String(new Date().getFullYear());

export const makeYearArray = (
  startDate?: number,
  steps?: number,
  up?: boolean,
) => {
  return Array.from({ length: steps ?? 10 }, (_, i) =>
    up
      ? String(startDate ?? new Date().getFullYear() + i)
      : String(startDate ?? new Date().getFullYear() - i),
  );
};

export const formatSize = (bytes: number): string => {
  if (bytes === 0) {
    return "0 B";
  }

  const i = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024));
  const value = Number(bytes / Math.pow(1024, i)).toFixed(2);
  return value + " " + ["B", "kB", "MB", "GB", "TB", "P", "E", "Z", "Y"][i];
};

export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D+/g, "");

  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

  const _cpf = cpf.split("").map((el) => +el);

  const rest = (count: number): number => {
    return (
      ((_cpf
        .slice(0, count - 12)
        .reduce(
          (soma: number, el: number, index: number) =>
            soma + el * (count - index),
          0,
        ) *
        10) %
        11) %
      10
    );
  };

  return rest(10) === _cpf[9] && rest(11) === _cpf[10];
}

export const lengthString = (value: string) =>
  value.replace(/[_\-()]/g, "").length;

export function generateUUID(): string {
  return uuidv4();
}

export function formatCEP(cep?: string): string {
  if (cep && cep.length === 8) {
    // Formatação do CEP: 99999-99. Retorna o valor formatado
    cep = cep.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  return cep ?? "";
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeAll(str: string) {
  const arr = str.split(" ");

  // loop through each element of the array and capitalize the first letter.
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  // Join all the elements of the array back into a string using a blankspace as a separator
  return arr.join(" ");
}

export const formatBrazilianCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};
