import { Button } from "primereact/button";
import { type DataTable, type DataTableValueArray } from "primereact/datatable";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";
import { Toolbar } from "primereact/toolbar";
import { formatDate } from "libs/utils.ts";
import React from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import AuthService from "@/services/auth.service.ts";

export const tituloTemplate = (rowData: FinanceiroData) => {
  return (
    <>
      <div className="flex align-items-center gap-2">
        <InputText
          id="titulo_table"
          type="text"
          value={rowData.titulo}
          disabled
          readOnly
          pt={{
            root: {
              className: classNames("border-none", "p-0"),
            },
          }}
        />
      </div>
    </>
  );
};

export const valorTemplate = (rowData: FinanceiroData) => {
  return (
    <>
      <div className="flex gap-2">
        <InputNumber
          id="valor"
          value={rowData.valor}
          mode="currency"
          currency="BRL"
          locale="pt-BR"
          minFractionDigits={2}
          disabled
          readOnly
          pt={{
            root: {
              className: classNames("border-none", "p-0"),
            },
            input: {
              root: { className: classNames("border-none", "p-0") },
            },
          }}
        />
      </div>
      {/* <div className="flex gap-2">{formatBrazilianCurrency(rowData.valor)}</div> */}
    </>
  );
};

export const dataVencimentoTemplate = (rowData: FinanceiroData) => {
  return (
    <>
      <div>
        <InputMask
          id="dataVencimento"
          mask={"99/99/9999"}
          placeholder="00/00/0000"
          value={
            rowData?.dataVencimento
              ? formatDate(rowData?.dataVencimento, "DD/MM/YYYY")
              : undefined
          }
          disabled
          readOnly
          pt={{
            root: {
              className: classNames("border-none", "p-0"),
            },
          }}
        ></InputMask>
        {/* {usuario?.dataEntrada ? formatDate(usuario?.dataEntrada) : undefined} */}
      </div>
    </>
  );
};

export const dataPagamentoTemplate = (rowData: FinanceiroData) => {
  return (
    <>
      <div>
        <InputMask
          id="dataPagamento"
          mask={"99/99/9999"}
          placeholder="00/00/0000"
          value={
            rowData?.dataPagamento
              ? formatDate(rowData?.dataPagamento, "DD/MM/YYYY")
              : undefined
          }
          disabled
          readOnly
          pt={{
            root: {
              className: classNames("border-none", "p-0"),
            },
          }}
        ></InputMask>
        {/* {usuario?.dataEntrada ? formatDate(usuario?.dataEntrada) : undefined} */}
      </div>
    </>
  );
};

export const statusTemplate = (rowData: FinanceiroData) => {
  return (
    <>
      <Tag
        severity={
          rowData.statusFinanceiro === "PAGO"
            ? "success"
            : rowData.statusFinanceiro === "PENDENTE"
            ? "danger"
            : "warning"
        }
        rounded
      >
        <div className="flex align-items-center gap-2">
          <i
            className={classNames("pi", "text-xs", {
              "pi-check-circle": rowData.statusFinanceiro === "PAGO",
              "pi-times-circle": rowData.statusFinanceiro === "PENDENTE",
              "pi-eye": rowData.statusFinanceiro === "ANALISE",
            })}
          ></i>
          <span className="text-xs"> {rowData.statusFinanceiro}</span>
        </div>
      </Tag>
    </>
  );
};

export const tipoTemplate = (rowData: FinanceiroData) => {
  return (
    <>
      <div className="flex gap-2">{rowData.tipo}</div>
    </>
  );
};

export const observacaoTemplate = (rowData: FinanceiroData) => {
  return (
    <>
      <div className="flex gap-2">{rowData.observacao}</div>
    </>
  );
};

export const unidadeTemplate = (rowData: FinanceiroData) => {
  return (
    <>
      <div className="flex gap-2">{rowData.idUnidade}</div>
    </>
  );
};

export const financeiroTableToolbar = (
  selectedData: unknown,
  dt: React.RefObject<DataTable<DataTableValueArray>>,
  openNew: () => void,
  confirmDeleteSelected: () => void,
) => {
  const leftToolbarTemplate = () => {
    return (
      <>
        <div className="my-2">
          {AuthService.userIsCondomino() ? null : (
            <>
              <Button
                label="Novo"
                icon="pi pi-plus"
                severity="success"
                size="small"
                rounded
                className=" mr-2"
                onClick={openNew}
              />

              <Button
                label="Excluir"
                icon="pi pi-trash"
                severity="danger"
                size="small"
                rounded
                disabled={
                  !selectedData || !(selectedData as FinanceiroData[]).length
                }
                onClick={confirmDeleteSelected}
              />
            </>
          )}
        </div>
      </>
    );
  };

  const rightToolbarTemplate = () => {
    const exportFinanceiroCSV = () => {
      dt.current?.exportCSV({
        selectionOnly: !((selectedData as FinanceiroData[]).length > 1),
      });
    };
    return (
      <>
        <Button
          label="Exportar CSV"
          icon="pi pi-upload"
          severity="help"
          size="small"
          rounded
          onClick={() => {
            exportFinanceiroCSV();
          }}
        />
      </>
    );
  };

  return (
    <Toolbar
      className="mb-4"
      start={leftToolbarTemplate}
      end={rightToolbarTemplate}
    ></Toolbar>
  );
};
