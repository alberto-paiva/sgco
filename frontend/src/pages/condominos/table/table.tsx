import {
  condominoCpfTemplate,
  condominoContatoTemplate,
  condominoStatusTemplate,
  condominoUnidadeTemplate,
  useExportHeader,
  condominoNomeTemplate,
} from "pages/condominos/table/table-options.tsx";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, type DataTableValueArray } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { useLocation } from "wouter";
import AuthService from "@/services/auth.service.ts";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { CondominoService } from "libs/api/condomino-api.ts";

interface CondominosTableProps {
  condominos: CondominoData[] | null;
  loading: boolean;
  loadingMessage: string | null;

  reload: (value: boolean) => void;

  exportSelectedBloco: (value?: string) => void;
}

export function CondominosTable({
  condominos,
  loading,
  loadingMessage,
  reload,
  exportSelectedBloco,
}: CondominosTableProps) {
  const dt = useRef<DataTable<DataTableValueArray>>(null);
  const toast = useRef<Toast>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCondomino, setSelectedCondomino] = useState<CondominoData>();
  const [selectedBloco, setSelectedBloco] = useState<BlocoLabelsData>();

  const [, navigate] = useLocation();

  const showModalEdit = (user?: CondominoData) => {
    setShowEditModal(true);
    setSelectedCondomino(user);
  };

  const showModalDelete = (user: CondominoData) => {
    setShowDeleteModal(true);
    setSelectedCondomino(user);
  };

  function deleteCondomino() {
    const _condomino = { ...selectedCondomino };

    if (_condomino.id) {
      CondominoService.getInstance()
        .deleteCondomino(_condomino.id)
        .then(() => {
          setShowDeleteModal(false);
          setSelectedCondomino(undefined);
          toast.current?.show({
            severity: "success",
            summary: "Successo",
            detail: "Condômino Excluido",
            life: 3000,
          });
        });
    }

    console.log("condomino excluido:\n", JSON.stringify(_condomino, null, 4));
  }

  const deleteCondominoDialogFooter = (
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
        onClick={deleteCondomino}
      />
    </>
  );

  useEffect(() => {
    reload(showEditModal);
  }, [reload, showEditModal]);

  useEffect(() => {
    reload(showDeleteModal);
  }, [reload, showDeleteModal]);

  useEffect(() => {
    setSelectedBloco(selectedBloco);
    exportSelectedBloco(selectedBloco?.label);
  }, [exportSelectedBloco, selectedBloco, setSelectedBloco]);

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
        <Toast ref={toast} />
        <DataTable
          value={condominos ?? undefined}
          ref={dt}
          dataKey={"id"}
          header={useExportHeader({ dt, showModalEdit, setSelectedBloco })}
          columnResizeMode="expand"
          resizableColumns
          showGridlines
          stripedRows
          size="small"
          selectionMode={"single"}
          dragSelection={true}
          selection={selectedCondomino}
          showSelectAll={true}
          paginator
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registro(s)"
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          onSelectionChange={(e) => {
            setSelectedCondomino(e.value as CondominoData);
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
            body={condominoNomeTemplate}
          ></Column>
          <Column
            field="cpf"
            header="CPF"
            bodyClassName="text-center"
            style={{ maxWidth: "8.5rem" }}
            body={condominoCpfTemplate}
          ></Column>
          <Column
            field="telefone"
            header="Contato"
            bodyClassName="text-center"
            style={{ maxWidth: "8.5rem" }}
            body={condominoContatoTemplate}
          ></Column>
          <Column
            field="proprietario"
            header="Proprietário"
            dataType="boolean"
            sortable
            bodyClassName="text-center"
            style={{ minWidth: "1rem" }}
            body={condominoStatusTemplate}
          />
          <Column
            field="unidadeId"
            header="Unidade"
            bodyClassName="text-center text-color-secondary text-sm"
            style={{ minWidth: "1rem" }}
            body={condominoUnidadeTemplate}
          />
          <Column
            header="Ações"
            bodyClassName="text-center"
            body={(data: CondominoData) => (
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
                    navigate("/condominos/add/" + data.id, { replace: true });
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
        {showDeleteModal && selectedCondomino && (
          <>
            {/* Delete Financeiro Dialog */}
            <Dialog
              visible={showDeleteModal}
              style={{ width: "450px" }}
              header="Confirmação"
              modal
              footer={deleteCondominoDialogFooter}
              onHide={() => {
                setShowDeleteModal(false);
              }}
            >
              <div className="flex align-items-center justify-content-center">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {selectedCondomino && (
                  <span>
                    Você tem certeza que deseja excluir o item{" "}
                    <b>{selectedCondomino.nome}</b>?
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
