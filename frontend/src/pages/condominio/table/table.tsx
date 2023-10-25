import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, type DataTableValueArray } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { useLocation } from "wouter";
import {
  cnpjFormatTemplate,
  condominioNameTemplate,
  enderecoTemplate,
  phoneFormatTemplate,
  useExportHeader,
} from "pages/condominio/table/table-options.tsx";
import { generateUUID } from "libs/utils.ts";
import AuthService from "@/services/auth.service.ts";
import { CondominioService } from "libs/api/condominio-api.ts";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";

interface CondominiosTableProps {
  condominios: CondominioData[] | null;
  loading: boolean;
  loadingMessage: string | null;

  reload: (value: boolean) => void;
}

export function CondominiosTable({
  condominios,
  loading,
  loadingMessage,
  reload,
}: CondominiosTableProps) {
  const dt = useRef<DataTable<DataTableValueArray>>(null);
  const toast = useRef<Toast>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCondominio, setSelectedCondominio] =
    useState<CondominioData>();
  const [selectedBloco, setSelectedBloco] = useState<BlocoLabelsData>();

  const [fireReload, setFireReload] = useState(false);

  const [, navigate] = useLocation();

  const showModalEdit = (user?: CondominioData) => {
    setShowEditModal(true);
    setSelectedCondominio(user);
  };

  const showModalDelete = (user: CondominioData) => {
    setShowDeleteModal(true);
    setSelectedCondominio(user);
  };

  function deleteCondominio() {
    const _condominio = { ...selectedCondominio };

    if (_condominio.id) {
      CondominioService.getInstance()
        .deleteCondominio(_condominio.id)
        .then(() => {
          setShowDeleteModal(false);
          setSelectedCondominio(undefined);
          toast.current?.show({
            severity: "success",
            summary: "Successo",
            detail: "Condômino Excluido",
            life: 3000,
          });
        });
    }

    console.log("condomino excluido:\n", JSON.stringify(_condominio, null, 4));
    setFireReload((prev) => !prev);
  }

  const deleteCondominioDialogFooter = (
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
        onClick={deleteCondominio}
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
  }, [selectedBloco, setSelectedBloco]);

  useEffect(() => {
    reload(fireReload);
  }, [fireReload, setFireReload, reload]);

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
          value={condominios ?? undefined}
          ref={dt}
          dataKey={"id"}
          header={useExportHeader({ dt, showModalEdit })}
          columnResizeMode="expand"
          resizableColumns
          showGridlines
          stripedRows
          size="small"
          selectionMode={"single"}
          // selectAll={true}
          dragSelection={true}
          selection={selectedCondominio}
          showSelectAll={true}
          paginator
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registro(s)"
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          onSelectionChange={(e) => {
            setSelectedCondominio(e.value as CondominioData);
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
            body={condominioNameTemplate}
          ></Column>
          <Column
            field="cnpj"
            header="CNPJ"
            bodyClassName="text-center"
            style={{ maxWidth: "10.5rem" }}
            body={cnpjFormatTemplate}
          ></Column>
          <Column
            field="telefone"
            header="Contato"
            bodyClassName="text-center"
            style={{ maxWidth: "8.5rem" }}
            body={phoneFormatTemplate}
          ></Column>
          <Column
            field="enderecoId"
            header="Endereço"
            bodyClassName="text-color-secondary text-sm"
            style={{ minWidth: "1rem" }}
            body={enderecoTemplate}
          />
          <Column
            key={generateUUID()}
            header="Ações"
            bodyClassName="text-center"
            body={(data: CondominioData) => (
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
                    navigate("/condominios/add/" + data.id, { replace: true });
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
        {showDeleteModal && selectedCondominio && (
          <>
            {/* Delete Financeiro Dialog */}
            <Dialog
              visible={showDeleteModal}
              style={{ width: "450px" }}
              header="Confirmação"
              modal
              footer={deleteCondominioDialogFooter}
              onHide={() => {
                setShowDeleteModal(false);
              }}
            >
              <div className="flex align-items-center justify-content-center">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {selectedCondominio && (
                  <span>
                    Você tem certeza que deseja excluir o item{" "}
                    <b>{selectedCondominio.nome}</b>?
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
