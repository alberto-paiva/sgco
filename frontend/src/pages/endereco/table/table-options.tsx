import { formatCEP } from "libs/utils";
import React from "react";
import { Button } from "primereact/button";
import { type DataTable, type DataTableValueArray } from "primereact/datatable";
import { useLocation } from "wouter";

export const logradouroTemplate = (rowData: EnderecoData) => {
  return (
    <>
      <div className="flex  gap-2">
        {rowData.rua}, {rowData.numero}
      </div>
    </>
  );
};

export const complementoTemplate = (rowData: EnderecoData) => {
  return (
    <>
      <div className="flex gap-2">{rowData.complemento}</div>
    </>
  );
};

export const bairroTemplate = (rowData: EnderecoData) => {
  return (
    <>
      <div className="flex gap-2">{rowData.bairro}</div>
    </>
  );
};

export const municipioTemplate = (rowData: EnderecoData) => {
  return (
    <>
      <div className="flex gap-2">{rowData.cidade}</div>
    </>
  );
};

export const ufTemplate = (rowData: EnderecoData) => {
  return (
    <>
      <div className="flex gap-2">{rowData.uf?.toUpperCase()}</div>
    </>
  );
};

export const cepTemplate = (rowData: EnderecoData) => {
  return (
    <>
      <div className="flex gap-2">{formatCEP(rowData.cep)}</div>
    </>
  );
};

export const paisTemplate = (rowData: EnderecoData) => {
  return (
    <>
      <div className="flex gap-2">{rowData.pais}</div>
    </>
  );
};

interface ExportEnderecoHeaderProps {
  dt: React.RefObject<DataTable<DataTableValueArray>>;

  showModalEdit: () => void;
}

export const useExportHeader = ({
  dt,
  showModalEdit: showEditModal,
}: ExportEnderecoHeaderProps) => {
  const [, navigate] = useLocation();

  const exportCSV = () => {
    dt?.current?.exportCSV({ selectionOnly: false });
  };

  return (
    <>
      <div className="flex align-items-center justify-content-start gap-2">
        <Button
          type="button"
          label="Novo"
          icon="pi pi-plus"
          rounded
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            showEditModal();
            navigate("/enderecos/add", { replace: true });
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
    </>
  );
};
