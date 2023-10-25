// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { DefaultLayout } from "@/layouts/DefaultLayout";
import { useDataReducer } from "@/libs/data-utils";
import { type FunctionComponent, useEffect, useState } from "react";
import { type RouteComponentProps } from "wouter";
import { CondominosTable } from "./table/table";
import { CondominoService } from "libs/api/condomino-api.ts";
import AuthService, { UsuarioField } from "@/services/auth.service.ts";
import { sleep } from "libs/utils.ts";

interface CondominosListProps extends RouteComponentProps {
  title?: string;
}

export const CondominosList: FunctionComponent<CondominosListProps> = ({
  title = "Condominos",
}: CondominosListProps) => {
  const [selectedBloco, setSelectedBloco] = useState<string>();
  const [reload, setReload] = useState<boolean>(false);
  const { state, dispatch } = useDataReducer<CondominoData>();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const condominoID = AuthService.getCurrentUserField(
          UsuarioField.IdPessoa,
        );
        let response: CondominoData[] = [];

        if (AuthService.userIsCondomino()) {
          if (condominoID) {
            response = [
              await CondominoService.getInstance().getCondominoById(
                condominoID as number,
              ),
            ];
          }
        } else if (!AuthService.userIsCondomino()) {
          response =
            await CondominoService.getInstance().getAllCondominos(
              selectedBloco,
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
  }, [dispatch, selectedBloco, reload]);

  return (
    <DefaultLayout title={title}>
      <>
        <div>
          <CondominosTable
            condominos={state.dataArray}
            loading={state.loading}
            loadingMessage={state.error}
            reload={(value) => {
              sleep(1000).then(() => {
                setReload(value);
              });
            }}
            exportSelectedBloco={(bloco) => {
              setSelectedBloco(bloco);
            }}
          />
        </div>
      </>
    </DefaultLayout>
  );
};
