// Copyright 2023 Alberto L. Paiva.
// SPDX-License-Identifier: MIT

import { formatDate, generateUUID } from "@/libs/utils";
import { useEffect, useState } from "react";

export interface CondominioFormInputs {
  uuid: string;
  nome: string;
  email?: string;
  cnpj?: string;
  contato?: string;
  dataAbertura?: string;
  dataEncerramento?: string;
  imagemPerfil?: string;
  observacao?: string;
  idEndereco?: number;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  pais?: string;
}

export const initialFormState: CondominioFormInputs = {
  uuid: generateUUID(),
  nome: "",
  email: "",
  cnpj: undefined,
  contato: undefined,
  dataAbertura: "",
  dataEncerramento: undefined,
  imagemPerfil: undefined,
  observacao: undefined,
  idEndereco: undefined,
  rua: undefined,
  numero: undefined,
  complemento: undefined,
  bairro: undefined,
  cidade: undefined,
  uf: undefined,
  cep: undefined,
  pais: undefined,
};

const useFormInputs = (initialState: CondominioData | null) => {
  const [formInputs, setFormInputs] = useState<CondominioFormInputs>(
    initialState ?? initialFormState,
  );

  const resetCondominioForm = () => {
    setFormInputs(initialFormState);
  };

  useEffect(() => {
    setFormInputs({
      uuid: initialFormState?.uuid ?? generateUUID(),
      nome: initialState?.nome ?? "",
      email: initialState?.email ?? undefined,
      cnpj: initialState?.cnpj ?? undefined,
      contato: initialState?.contato ?? "",
      dataAbertura: initialState?.dataAbertura
        ? formatDate(initialState?.dataAbertura, "DD/MM/YYYY")
        : "",
      dataEncerramento: initialState?.dataEncerramento
        ? formatDate(initialState?.dataEncerramento, "DD/MM/YYYY")
        : undefined,
      imagemPerfil: initialState?.imagemPerfil ?? undefined,
      observacao: initialState?.observacao ?? "",
      idEndereco: initialState?.idEndereco ?? undefined,
      rua: initialState?.rua ?? undefined,
      numero: initialState?.numero ?? undefined,
      complemento: initialState?.complemento ?? undefined,
      bairro: initialState?.bairro ?? undefined,
      cidade: initialState?.cidade ?? undefined,
      uf: initialState?.uf ?? undefined,
      cep: initialState?.cep ?? undefined,
      pais: initialState?.pais ?? undefined,
    });
  }, [initialState]);

  return {
    formInputs,
    setFormInputs,
    resetForm: resetCondominioForm,
  };
};

export default useFormInputs;
