import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, type DataTableValueArray } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { useLocation } from "wouter";
import {
  sindicoCondominioTemplate,
  sindicoContatoTemplate,
  sindicoCpfTemplate,
  sindicoNomeTemplate,
  sindicoStatusTemplate,
  useExportHeader,
} from "pages/sindico/table/table-options.tsx";
import AuthService from "@/services/auth.service.ts";
import { Toast } from "primereact/toast";
import { SindicoService } from "libs/api/sindico-api.ts";
import { Dialog } from "primereact/dialog";

interface SindicosTableProps {
  sindicos: SindicoData[] | null;
  loading: boolean;
  loadingMessage: string | null;

  reload: (value: boolean) => void;

  exportSelectedCondominio: (value?: string) => void;
}

export function SindicoTable({
  sindicos,
  loading,
  loadingMessage,
  reload,
  exportSelectedCondominio,
}: SindicosTableProps) {
  const sindicodt = useRef<DataTable<DataTableValueArray>>(null);
  const toast = useRef<Toast>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedSindico, setSelectedSindico] = useState<SindicoData>();
  const [selectedCondominio, setSelectedCondominio] =
    useState<CondominioData>();

  const [fireReload, setFireReload] = useState(false);

  const [, navigate] = useLocation();

  const showModalEdit = (sindico?: SindicoData) => {
    setShowEditModal(true);
    setSelectedSindico(sindico);
  };

  const showModalDelete = (sindico: SindicoData) => {
    setShowDeleteModal(true);
    setSelectedSindico(sindico);
  };

  const deleteSindico = () => {
    const _sindico = { ...selectedSindico };

    if (_sindico.id) {
      SindicoService.getInstance()
        .deleteSindico(_sindico.id)
        .then(() => {
          setShowDeleteModal(false);
          toast.current?.show({
            severity: "success",
            summary: "Successo",
            detail: "Síndico Excluido",
            life: 3000,
          });
        });
    }

    console.log("sindico excluido:\n", JSON.stringify(_sindico, null, 4));
    setFireReload((prev) => !prev);
  };

  const deleteSindicoDialogFooter = (
    <>
      <Button
        label="Não"
        icon="pi pi-times"
        severity="info"
        onClick={() => {
          setShowDeleteModal(false);
          toast.current?.show({
            severity: "info",
            summary: "Cancelado",
            detail: "Ação cancelada!",
            life: 3000,
          });
        }}
      />
      <Button
        label="Sim"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSindico}
      />
    </>
  );

  useEffect(() => {
    reload(fireReload);
  }, [fireReload, setFireReload, reload]);

  useEffect(() => {
    reload(showEditModal);
  }, [reload, showEditModal]);

  useEffect(() => {
    reload(showDeleteModal);
  }, [reload, showDeleteModal]);

  useEffect(() => {
    setSelectedCondominio(selectedCondominio);
    exportSelectedCondominio(selectedCondominio?.id?.toString());
  }, [exportSelectedCondominio, selectedCondominio, setSelectedCondominio]);

  return (
    <>
      <div className="card">
        {loading ? (
          <div className="spinner-wrapper">
            {loadingMessage}
            <ProgressSpinner
              aria-label="Loading"
              style={{ width: "40px", height: "40px", position: "absolute" }}
              pt={{
                spinner: { style: { animationDuration: ".5s" } },
                circle: {
                  style: {
                    stroke: "#2E0357",
                    strokeWidth: 2,
                    animation: "none",
                  },
                },
              }}
            />
          </div>
        ) : null}
        <DataTable
          value={sindicos ?? undefined}
          ref={sindicodt}
          dataKey={"id"}
          header={useExportHeader({
            dt: sindicodt,
            showModalEdit,
            setSelectedCondominio,
          })}
          columnResizeMode="expand"
          resizableColumns
          showGridlines
          stripedRows
          size="small"
          selectionMode={"single"}
          dragSelection={true}
          selection={selectedSindico}
          showSelectAll={true}
          paginator
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registro(s)"
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          onSelectionChange={(e) => {
            setSelectedSindico(e.value as SindicoData);
          }}
        >
          <Column
            selectionMode={"multiple"}
            headerStyle={{ width: "3rem" }}
          ></Column>

          <Column
            field="id"
            header="ID"
            sortable
            bodyClassName="text-center text-color-secondary text-sm"
            style={{ maxWidth: "4rem" }}
          />
          <Column
            field="nome"
            header="Nome"
            sortable
            style={{ minWidth: "14rem" }}
            body={sindicoNomeTemplate}
          ></Column>
          <Column
            field="cpf"
            header="CPF"
            bodyClassName="text-center"
            style={{ maxWidth: "8.5rem" }}
            body={sindicoCpfTemplate}
          ></Column>
          <Column
            field="telefone"
            header="Contato"
            bodyClassName="text-center"
            style={{ maxWidth: "8.5rem" }}
            body={sindicoContatoTemplate}
          ></Column>
          <Column
            field="ativo"
            header="Ativo"
            dataType="boolean"
            sortable
            bodyClassName="text-center"
            style={{ minWidth: "1rem" }}
            body={sindicoStatusTemplate}
          />
          <Column
            field="condominioID"
            header="Condomínio"
            bodyClassName="text-center text-color-secondary text-sm"
            style={{ minWidth: "1rem" }}
            body={sindicoCondominioTemplate}
          />
          <Column
            header="Ações"
            bodyClassName="text-center"
            body={(data: SindicoData) => (
              <span className="p-buttonset">
                <Button
                  className="mr-2"
                  pt={{
                    root: { style: { fontSize: "0.75rem", padding: "0.4rem" } },
                  }}
                  label={
                    AuthService.userIsCondomino() ? "Visualizar" : "Editar"
                  }
                  icon="pi pi-pencil"
                  size="small"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    // showModalEdit(data);
                    navigate("/sindicos/add/" + data.id, { replace: true });
                  }}
                />
                {!AuthService.userIsCondomino() ? (
                  <Button
                    pt={{
                      root: {
                        style: { fontSize: "0.75rem", padding: "0.4rem" },
                      },
                    }}
                    label="Excluir"
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      showModalDelete(data);
                    }}
                  />
                ) : null}
              </span>
            )}
          />
        </DataTable>
        <Toast ref={toast} />
        {showDeleteModal && selectedSindico && (
          <>
            {/* Delete Financeiro Dialog */}
            <Dialog
              visible={showDeleteModal}
              style={{ width: "450px" }}
              header="Confirmação"
              modal
              footer={deleteSindicoDialogFooter}
              onHide={() => {
                setShowDeleteModal(false);
              }}
            >
              <div className="flex align-items-center justify-content-center">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {selectedSindico && (
                  <span>
                    Você tem certeza que deseja excluir o item{" "}
                    <b>{selectedSindico.nome}</b>?
                  </span>
                )}
              </div>
            </Dialog>
          </>
        )}
      </div>
    </>
  );
}
