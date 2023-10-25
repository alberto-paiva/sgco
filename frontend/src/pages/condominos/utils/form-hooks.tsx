// Copyright 2023 Alberto L. Paiva.
// SPDX-License-Identifier: MIT

import { formatDate, generateUUID } from "@/libs/utils";
import { useEffect, useState } from "react";

export interface CondominoFormInputs {
  uuid: string;
  nome: string;
  email?: string;
  cpf?: string;
  contato: string;
  proprietario: boolean;
  dataEntrada: string;
  dataSaida?: string;
  observacao?: string;
  tipo?: "C";
  imagemPerfil?: string;
  idUnidade?: number;
  bloco?: string;
  numero?: string;
  observacaoUnidade?: string;
  idCondominio?: number;
}

export const initialFormState: CondominoFormInputs = {
  nome: "",
  uuid: generateUUID(),
  email: "",
  cpf: undefined,
  contato: "",
  proprietario: false,
  dataEntrada: "",
  dataSaida: undefined,
  observacao: undefined,
  tipo: "C",
  imagemPerfil: undefined,
  idUnidade: undefined,
  bloco: undefined,
  numero: undefined,
  observacaoUnidade: undefined,
  idCondominio: undefined,
};

const useFormInputs = (initialState: CondominoData | null) => {
  const [formInputs, setFormInputs] = useState<CondominoFormInputs>(
    initialState ?? initialFormState,
  );

  const resetForm = () => {
    setFormInputs(initialFormState);
  };

  useEffect(() => {
    setFormInputs({
      uuid: initialFormState?.uuid ?? generateUUID(),
      nome: initialState?.nome ?? "",
      email: initialState?.email ?? undefined,
      cpf: initialState?.cpf ?? undefined,
      contato: initialState?.contato ?? "",
      proprietario: initialState?.proprietario ?? false,
      dataEntrada: initialState?.dataEntrada
        ? formatDate(initialState?.dataEntrada, "DD/MM/YYYY")
        : "",
      dataSaida: initialState?.dataSaida
        ? formatDate(initialState?.dataSaida, "DD/MM/YYYY")
        : undefined,
      observacao: initialState?.observacao ?? "",
      tipo: "C",
      imagemPerfil: initialState?.imagemPerfil ?? undefined,
      idUnidade: initialState?.idUnidade ?? undefined,
      bloco: initialState?.bloco ?? "",
      numero: initialState?.numero ?? undefined,
      observacaoUnidade: initialState?.observacaoUnidade ?? undefined,
      idCondominio: initialState?.idCondominio ?? undefined,
    });
  }, [initialState]);

  return {
    formInputs,
    setFormInputs,
    resetForm,
  };
};

export default useFormInputs;
