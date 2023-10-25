import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { type DataTable, type DataTableValueArray } from "primereact/datatable";
import { useLocation } from "wouter";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { CondominioService } from "libs/api/condominio-api.ts";
import { useDataReducer } from "libs/data-utils.ts";

export const unidadeBlocoTemplate = (rowData: UnidadeData) => {
  return (
    <>
      <div className="flex gap-2">{rowData.bloco}</div>
    </>
  );
};

export const unidadeNumeroTemplate = (rowData: UnidadeData) => {
  return (
    <>
      <div className="flex gap-2">{rowData.numero}</div>
    </>
  );
};

export const unidadeObservacaoTemplate = (rowData: UnidadeData) => {
  return (
    <>
      <div className="flex gap-2">{rowData.observacao}</div>
    </>
  );
};

export const unidadeIdCondominioTemplate = (rowData: UnidadeData) => {
  return (
    <>
      <div className="flex gap-2">{rowData.nomeCondominio}</div>
    </>
  );
};

interface ExportUnidadeHeaderProps {
  dt: React.RefObject<DataTable<DataTableValueArray>>;

  showModalEdit: () => void;

  setSelectedCondominio: (value?: CondominioData) => void;
}

export const useExportHeader = ({
  dt,
  showModalEdit: showEditModal,
  setSelectedCondominio,
}: ExportUnidadeHeaderProps) => {
  const [condominio, setCondominio] = useState<CondominioData>();
  const condominioDataReducer = useDataReducer<CondominioData>();

  const [, navigate] = useLocation();

  const exportCSV = () => {
    dt?.current?.exportCSV({ selectionOnly: false });
  };

  useEffect(() => {
    const fetchCondominioData = async () => {
      condominioDataReducer.dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response =
          await CondominioService.getInstance().getAllCondominios();
        condominioDataReducer.dispatch({
          type: "FETCH_DATA_ARRAY_SUCCESS",
          payload: response,
        });
      } catch (error) {
        condominioDataReducer.dispatch({
          type: "FETCH_DATA_FAILURE",
          payload: `error fetching data: ${error}`,
        });
      }
    };

    fetchCondominioData().then((r) => r);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex align-items-center justify-content-start gap-2">
        <Dropdown
          id="filter-condominio"
          options={condominioDataReducer.state.dataArray ?? []}
          optionLabel="nome"
          placeholder="Selecione o Condomínio!"
          className={classNames("p-inputtext-sm w-full")}
          emptyMessage={
            !condominioDataReducer.state.dataArray
              ? "Sem resultados"
              : "Selecione o condomínio!"
          }
          value={condominio}
          onChange={(e: DropdownChangeEvent) => {
            setCondominio(e.value);
            setSelectedCondominio(e.value);
          }}
          showClear
        />
        <div className="flex align-items-center justify-content-end gap-2">
          <Button
            type="button"
            label="Novo"
            icon="pi pi-plus"
            rounded
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              showEditModal();
              navigate("/unidades/add", { replace: true });
            }}
            data-pr-tooltip="Novo"
            size="small"
          />
          <Button
            type="button"
            icon="pi pi-file"
            severity="info"
            label="CSV"
            rounded
            onClick={() => {
              exportCSV();
            }}
            data-pr-tooltip="CSV"
            size="small"
          />
        </div>
      </div>
    </>
  );
};
