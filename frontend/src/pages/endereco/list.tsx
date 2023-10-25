// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { DefaultLayout } from "@/layouts/DefaultLayout";
import { useDataReducer } from "@/libs/data-utils";
import { type FunctionComponent, useEffect, useState } from "react";
import { type RouteComponentProps } from "wouter";
import { EnderecoService } from "libs/api/endereco-api.ts";
import { EnderecoTable } from "pages/endereco/table/table.tsx";
import { sleep } from "libs/utils.ts";

interface EnderecoListProps extends RouteComponentProps {
  title?: string;
}

export const EnderecosList: FunctionComponent<EnderecoListProps> = ({
  title = "Enderecos",
}: EnderecoListProps) => {
  const [selectedEndereco] = useState<string>();
  const { state, dispatch } = useDataReducer<EnderecoData>();

  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response = await EnderecoService.getInstance().getAllEnderecos();
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
  }, [dispatch, selectedEndereco, reload]);

  return (
    <DefaultLayout title={title}>
      <>
        <div>
          <EnderecoTable
            enderecos={state.dataArray}
            loading={state.loading}
            loadingMessage={state.error}
            reload={(value) => {
              sleep(1000).then(() => {
                setReload(value);
              });
            }}
          />
        </div>
      </>
    </DefaultLayout>
  );
};
