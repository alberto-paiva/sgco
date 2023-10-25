import { getImageUrlOnServer } from "libs/file-utils.ts";
import React from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { type DataTable, type DataTableValueArray } from "primereact/datatable";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";
import { useLocation } from "wouter";
import { EnderecoField } from "components/EnderecoField.tsx";
import AuthService from "@/services/auth.service.ts";

export const condominioNameTemplate = (rowData: CondominioData) => {
  return (
    <>
      <div className="flex align-items-center gap-2">
        <div>
          <Avatar
            imageAlt={rowData.nome}
            image={
              rowData.imagemPerfil
                ? getImageUrlOnServer(rowData.imagemPerfil, rowData.uuid)
                : ""
            }
            className="p-mr-2"
            style={{ verticalAlign: "middle" }}
            size="large"
            shape="circle"
            icon="pi pi-user"
            pt={{ image: { width: 32 } }}
          />
        </div>
        <div>
          <div>
            <span style={{ marginLeft: ".5em", verticalAlign: "middle" }}>
              {rowData.nome}
            </span>
          </div>
          <div>
            <span
              className="text-color-secondary text-sm"
              style={{ marginLeft: ".5em", verticalAlign: "middle" }}
            >
              {rowData.email}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export const cnpjFormatTemplate = (rowData: CondominioData) => {
  return (
    <InputMask
      id="cnpj"
      mask="99.999.999/9999-99"
      placeholder="00.000.000/0000-00"
      value={rowData.cnpj}
      autoClear={false}
      disabled
      readOnly
      unmask
      pt={{
        root: {
          className: classNames("border-none", "pl-0"),
        },
      }}
    ></InputMask>
  );
};

export const phoneFormatTemplate = (rowData: CondominioData) => {
  return (
    <InputMask
      id="telefone"
      mask={rowData.contato?.length === 11 ? "(99)99999-9999" : "(99)9999-9999"}
      placeholder="(00)00000-0000"
      value={rowData.contato}
      autoClear={false}
      disabled
      readOnly
      unmask
      pt={{
        root: {
          className: classNames("border-none", "pl-0"),
        },
      }}
    ></InputMask>
  );
};

export const enderecoTemplate = (rowData: CondominioData) => {
  return (
    <EnderecoField
      inline={false}
      rua={rowData?.rua}
      numero={rowData?.numero}
      complemento={rowData?.complemento}
      bairro={rowData?.bairro}
      cidade={rowData?.cidade}
      uf={rowData?.uf}
      cep={rowData?.cep}
      pais={rowData?.pais}
    />
  );
};

interface ExportCondominioHeaderProps {
  dt: React.RefObject<DataTable<DataTableValueArray>>;

  showModalEdit: () => void;
}

export const useExportHeader = ({
  dt,
  showModalEdit: showEditModal,
}: ExportCondominioHeaderProps) => {
  const [, navigate] = useLocation();

  const exportCSV = () => {
    dt?.current?.exportCSV({ selectionOnly: false });
  };

  return (
    <>
      <div className="flex align-items-center justify-content-start gap-2">
        <div className="flex align-items-center justify-content-end gap-2">
          {AuthService.userIsCondomino() ? null : (
            <Button
              type="button"
              label="Novo"
              icon="pi pi-plus"
              rounded
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                showEditModal();
                navigate("/condominios/add", { replace: true });
              }}
              data-pr-tooltip="Novo"
              size="small"
            />
          )}
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
