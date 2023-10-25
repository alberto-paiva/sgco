import { getImageUrlOnServer } from "libs/file-utils.ts";
import React, { useState } from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { type DataTable, type DataTableValueArray } from "primereact/datatable";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { useMountEffect } from "primereact/hooks";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";
import { useLocation } from "wouter";
import { CondominioService } from "libs/api/condominio-api.ts";
import AuthService from "@/services/auth.service.ts";

export const sindicoNomeTemplate = (rowData: SindicoData) => {
  return (
    <>
      <div className="flex align-items-center gap-2">
        <div>
          <Avatar
            imageAlt={rowData.nome}
            image={getImageUrlOnServer(rowData.imagemPerfil, rowData.uuid)}
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

export const sindicoStatusTemplate = (rowData: SindicoData) => {
  return (
    <i
      className={classNames("pi", {
        "text-green-500 pi-check-circle": rowData.ativo,
        "text-pink-500 pi-times-circle": !rowData.ativo,
      })}
    ></i>
  );
};

export const sindicoCpfTemplate = (rowData: SindicoData) => {
  return (
    <InputMask
      id="cpf"
      mask="999.999.999-99"
      placeholder="000.000.000-00"
      value={rowData.cpf}
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

export const sindicoContatoTemplate = (rowData: SindicoData) => {
  return (
    <InputMask
      id="telefone"
      mask={rowData.contato.length === 11 ? "(99)99999-9999" : "(99)9999-9999"}
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

export const sindicoCondominioTemplate = (rowData: SindicoData) => {
  return <div>{rowData?.nomeCondominio}</div>;
};

interface ExportCondominoHeaderProps {
  dt: React.RefObject<DataTable<DataTableValueArray>>;

  showModalEdit: () => void;

  setSelectedCondominio: (value?: CondominioData) => void;
}

export const useExportHeader = ({
  dt,
  showModalEdit: showEditModal,
  setSelectedCondominio,
}: ExportCondominoHeaderProps) => {
  const [condominios, setCondominios] = useState<CondominioData[]>([]);
  const [currentSelectedCondominio, setCurrentSelectedCondominio] =
    useState<CondominioData>();
  const [message, setMessage] = useState<string>("");

  const [, navigate] = useLocation();

  const exportCSV = () => {
    dt?.current?.exportCSV({ selectionOnly: false });
  };

  const fetchCondominios = () => {
    setMessage("Carregando...");
    CondominioService.getInstance()
      .getAllCondominios()
      .then((data) => {
        setMessage("");
        setCondominios(data);
      })
      .catch((error: { message: string }) => {
        setMessage("Erro: " + error.message);
        console.log("ERROR: ", message);
      });
  };

  useMountEffect(() => {
    fetchCondominios();
  });

  return (
    <>
      <div className="flex align-items-center justify-content-start gap-2">
        {AuthService.userIsCondomino() ? null : (
          <Dropdown
            id="filter-condominio"
            options={condominios}
            optionLabel="nome"
            placeholder="Selecione o Condomínio!"
            className={classNames("p-inputtext-sm w-full")}
            emptyMessage={
              !condominios ? "Sem resultados" : "Selecione o condominio!"
            }
            value={currentSelectedCondominio}
            onChange={(e: DropdownChangeEvent) => {
              setCurrentSelectedCondominio(e.value);
              setSelectedCondominio(e.value);
            }}
            showClear
          />
        )}
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
                navigate("/sindicos/add", { replace: true });
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
