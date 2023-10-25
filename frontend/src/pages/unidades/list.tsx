// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { DefaultLayout } from "@/layouts/DefaultLayout";
import { useDataReducer } from "@/libs/data-utils";
import { type FunctionComponent, useEffect, useState } from "react";
import { type RouteComponentProps } from "wouter";
import { UnidadesTable } from "pages/unidades/table/table.tsx";
import { UnidadeService } from "libs/api/unidade-api.ts";

interface UnidadesListProps extends RouteComponentProps {
  title?: string;
}

export const UnidadesList: FunctionComponent<UnidadesListProps> = ({
  title = "Unidades",
}: UnidadesListProps) => {
  const [selectedCondominio, setSelectedCondominio] = useState<string>();
  const { state, dispatch } = useDataReducer<UnidadeData>();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response =
          await UnidadeService.getInstance().getAllUnidades(selectedCondominio);
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
  }, [dispatch, selectedCondominio]);

  return (
    <DefaultLayout title={title}>
      <>
        <div>
          <UnidadesTable
            unidades={state.dataArray}
            loading={state.loading}
            loadingMessage={state.error}
            reload={(r) => r}
            exportSelectedCondominio={(condominioId) => {
              console.log(condominioId);
              setSelectedCondominio(condominioId);
            }}
          />
        </div>
      </>
    </DefaultLayout>
  );
};
