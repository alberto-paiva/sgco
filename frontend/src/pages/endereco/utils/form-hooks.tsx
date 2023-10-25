// Copyright 2023 Alberto L. Paiva.
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react";

export interface EnderecoFormInputs {
  id?: number;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf?: string;
  cep?: string;
  pais?: string;
}

export const initialFormState: EnderecoFormInputs = {
  rua: "",
  numero: "",
  complemento: undefined,
  bairro: "",
  cidade: "",
  uf: undefined,
  cep: undefined,
  pais: undefined,
};

const useFormInputs = (initialState: EnderecoData | null) => {
  const [formInputs, setFormInputs] = useState<EnderecoFormInputs>(
    initialState ?? initialFormState,
  );

  const resetEnderecoForm = () => {
    setFormInputs(initialFormState);
  };

  useEffect(() => {
    setFormInputs({
      rua: initialState?.rua ?? "",
      numero: initialState?.numero ?? "",
      complemento: initialState?.complemento ?? undefined,
      bairro: initialState?.bairro ?? "",
      cidade: initialState?.cidade ?? "",
      uf: initialState?.uf ?? undefined,
      cep: initialState?.cep ?? undefined,
      pais: initialState?.pais ?? undefined,
    });
  }, [initialState]);

  return {
    formInputs,
    setFormInputs,
    resetForm: resetEnderecoForm,
  };
};

export default useFormInputs;
