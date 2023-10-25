// Copyright 2023 Alberto L. Paiva.
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react";

export interface UnidadeFormInputs {
  bloco: string;
  numero: string;
  observacao?: string;
  idCondominio?: number;
}

export const initialFormState: UnidadeFormInputs = {
  bloco: "",
  numero: "",
  observacao: undefined,
  idCondominio: undefined,
};

const useFormInputs = (initialState: UnidadeData | null) => {
  const [formInputs, setFormInputs] = useState<UnidadeFormInputs>(
    initialState ?? initialFormState,
  );

  const resetUnidadeForm = () => {
    setFormInputs(initialFormState);
  };

  useEffect(() => {
    setFormInputs({
      bloco: initialState?.bloco ?? "",
      numero: initialState?.numero ?? "",
      observacao: initialState?.observacao ?? undefined,
      idCondominio: initialState?.idCondominio ?? undefined,
    });
  }, [initialState]);

  return {
    formInputs,
    setFormInputs,
    resetForm: resetUnidadeForm,
  };
};

export default useFormInputs;
