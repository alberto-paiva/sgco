// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { DefaultLayout } from "@/layouts/DefaultLayout";
import { useDataReducer } from "@/libs/data-utils";
import { type FunctionComponent, useEffect, useState } from "react";
import { type RouteComponentProps } from "wouter";
import { CondominiosTable } from "pages/condominio/table/table.tsx";
import { CondominioService } from "libs/api/condominio-api.ts";
import AuthService, { UsuarioField } from "@/services/auth.service.ts";
import { sleep } from "libs/utils.ts";

interface CondominiosListProps extends RouteComponentProps {
  title?: string;
}

export const CondominiosList: FunctionComponent<CondominiosListProps> = ({
  title = "Condomínios",
}: CondominiosListProps) => {
  const [selectedEndereco] = useState<string>();
  const { state, dispatch } = useDataReducer<CondominioData>();

  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const condominioID = AuthService.getCurrentUserField(
          UsuarioField.IdCondominio,
        );
        let response: CondominioData[] = [];

        if (AuthService.userIsCondomino()) {
          if (condominioID) {
            response = [
              await CondominioService.getInstance().getCondominioById(
                condominioID as number,
              ),
            ];
          }
        } else if (!AuthService.userIsCondomino()) {
          response =
            await CondominioService.getInstance().getAllCondominios(
              selectedEndereco,
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
  }, [dispatch, selectedEndereco, reload]);

  return (
    <DefaultLayout title={title}>
      <>
        <div>
          <CondominiosTable
            condominios={state.dataArray}
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
