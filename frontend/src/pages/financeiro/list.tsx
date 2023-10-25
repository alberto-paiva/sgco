// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { DefaultLayout } from "@/layouts/DefaultLayout";
import { useDataReducer } from "@/libs/data-utils";
import { useEffect, useState } from "react";
import { FinanceiroTable } from "pages/financeiro/table/base-table.tsx";
import { FinanceiroService } from "libs/api/financeiro-api.ts";
import AuthService, { UsuarioField } from "@/services/auth.service.ts";
import { sleep } from "libs/utils.ts";

interface FinanceiroListProps {
  title?: string;
  tipo?: "RECEITA" | "DESPESA";
}

export const FinanceirosList = ({
  title = "Financeiro",
  tipo,
}: FinanceiroListProps) => {
  const [selectedFinanceiro] = useState<string>();
  const { state, dispatch } = useDataReducer<FinanceiroData>();
  const [reload, setReload] = useState<boolean>(false);
  const [selectedAnoCalendario, setSelectedAnoCalendario] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const unidadeID = AuthService.getCurrentUserField(
          UsuarioField.IdUnidade,
        );
        let response: FinanceiroData[] = [];

        if (AuthService.userIsCondomino()) {
          if (unidadeID) {
            response =
              await FinanceiroService.getInstance().getFinanceiroMensalidade(
                unidadeID as number,
                selectedAnoCalendario,
              );
          }
        } else if (!AuthService.userIsCondomino()) {
          response = tipo
            ? await FinanceiroService.getInstance().getFinanceiroByTipo(
                tipo,
                selectedAnoCalendario,
              )
            : await FinanceiroService.getInstance().getAllFinanceiroData(
                selectedAnoCalendario,
              );
        } else {
          response = [];
        }

        dispatch({ type: "FETCH_DATA_ARRAY_SUCCESS", payload: response });
      } catch (error) {
        dispatch({
          type: "FETCH_DATA_FAILURE",
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          payload: "error fetching data: " + error,
        });
      }
    };

    fetchData().then((r) => r);
  }, [dispatch, selectedFinanceiro, tipo, reload, selectedAnoCalendario]);

  return (
    <DefaultLayout title={title}>
      <>
        <div>
          <FinanceiroTable
            financeirosData={state.dataArray}
            loading={state.loading}
            loadingMessage={state.error}
            tipo={tipo}
            reload={(value) => {
              sleep(1000).then(() => {
                setReload(value);
              });
            }}
            exportAnoCalendario={(ano) => {
              setSelectedAnoCalendario(ano);
            }}
          />
        </div>
      </>
    </DefaultLayout>
  );
};
