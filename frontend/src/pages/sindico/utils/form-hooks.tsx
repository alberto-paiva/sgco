// Copyright 2023 Alberto L. Paiva.
// SPDX-License-Identifier: MIT

import { formatDate, generateUUID } from "@/libs/utils";
import { useEffect, useState } from "react";

export interface SindicoFormInputs {
  id?: number;
  uuid: string;
  nome: string;
  email?: string;
  cpf?: string;
  contato: string;
  dataEntrada: string;
  dataSaida?: string;
  imagemPerfil?: string;
  observacao?: string;
  tipo?: "S";
  ativo: boolean;
  idCondominio?: number;
  idEndereco?: number;
}

export const initialFormState: SindicoFormInputs = {
  nome: "",
  uuid: generateUUID(),
  email: "",
  cpf: undefined,
  contato: "",
  dataEntrada: "",
  dataSaida: undefined,
  imagemPerfil: undefined,
  observacao: undefined,
  tipo: "S",
  ativo: true,
  idCondominio: undefined,
  idEndereco: undefined,
};

const useFormInputs = (initialState: SindicoData | null) => {
  const [formInputs, setFormInputs] = useState<SindicoFormInputs>(
    initialState ?? initialFormState,
  );

  const resetSindicoForm = () => {
    setFormInputs(initialFormState);
  };

  useEffect(() => {
    setFormInputs({
      uuid: initialFormState?.uuid ?? generateUUID(),
      nome: initialState?.nome ?? "",
      email: initialState?.email ?? undefined,
      cpf: initialState?.cpf ?? undefined,
      contato: initialState?.contato ?? "",
      dataEntrada: initialState?.dataEntrada
        ? formatDate(initialState?.dataEntrada, "DD/MM/YYYY")
        : "",
      dataSaida: initialState?.dataSaida
        ? formatDate(initialState?.dataSaida, "DD/MM/YYYY")
        : undefined,
      imagemPerfil: initialState?.imagemPerfil ?? undefined,
      observacao: initialState?.observacao ?? "",
      tipo: "S",
      ativo: initialState?.ativo ?? false,
      idCondominio: initialState?.idCondominio ?? undefined,
      idEndereco: initialState?.idEndereco ?? undefined,
    });
  }, [initialState]);

  return {
    formInputs,
    setFormInputs,
    resetSindicoForm,
  };
};

export default useFormInputs;
