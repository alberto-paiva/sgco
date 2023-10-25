// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { DefaultLayout } from "@/layouts/DefaultLayout";
import { useDataReducer } from "@/libs/data-utils";
import { type FunctionComponent, useEffect, useState } from "react";
import { type RouteComponentProps } from "wouter";
import { SindicoTable } from "./table/table";
import { SindicoService } from "libs/api/sindico-api.ts";
import AuthService, { UsuarioField } from "@/services/auth.service.ts";
import { sleep } from "libs/utils.ts";

interface SindicosListProps extends RouteComponentProps {
  title?: string;
}

export const SindicosList: FunctionComponent<SindicosListProps> = ({
  title = "Síndicos",
}: SindicosListProps) => {
  const [selectedCondominio, setSelectedCondominio] = useState<string>();
  const { state, dispatch } = useDataReducer<SindicoData>();

  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        // const response =  await SindicoService.getInstance().getAllSindicos(selectedCondominio);
        const condominioID = AuthService.getCurrentUserField(
          UsuarioField.IdCondominio,
        );
        let response: SindicoData[] = [];

        if (AuthService.userIsCondomino()) {
          if (condominioID) {
            response = await SindicoService.getInstance().getAllSindicos(
              condominioID as number,
              1,
            );
          }
        } else if (!AuthService.userIsCondomino()) {
          response =
            await SindicoService.getInstance().getAllSindicos(
              selectedCondominio,
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
  }, [dispatch, selectedCondominio, reload]);

  return (
    <DefaultLayout title={title}>
      <>
        <div>
          <SindicoTable
            sindicos={state.dataArray}
            loading={state.loading}
            loadingMessage={state.error}
            reload={(value) => {
              sleep(1000).then(() => {
                setReload(value);
              });
            }}
            exportSelectedCondominio={(bloco) => {
              setSelectedCondominio(bloco);
            }}
          />
        </div>
      </>
    </DefaultLayout>
  );
};
