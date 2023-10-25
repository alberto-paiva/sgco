import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, type DataTableValueArray } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { useLocation } from "wouter";
import { generateUUID } from "libs/utils.ts";
import {
  bairroTemplate,
  cepTemplate,
  complementoTemplate,
  logradouroTemplate,
  municipioTemplate,
  paisTemplate,
  ufTemplate,
  useExportHeader,
} from "pages/endereco/table/table-options.tsx";
import { Toast } from "primereact/toast";
import { EnderecoService } from "libs/api/endereco-api.ts";
import { Dialog } from "primereact/dialog";

interface EnderecoTableProps {
  enderecos: EnderecoData[] | null;
  loading: boolean;
  loadingMessage: string | null;

  reload: (value: boolean) => void;
}

export function EnderecoTable({
  enderecos,
  loading,
  loadingMessage,
  reload,
}: EnderecoTableProps) {
  const dt = useRef<DataTable<DataTableValueArray>>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedEndereco, setSelectedEndereco] = useState<EnderecoData>();

  const toast = useRef<Toast>(null);

  const [fireReload, setFireReload] = useState(false);

  const [, navigate] = useLocation();

  const showModalEdit = (endereco?: EnderecoData) => {
    setShowEditModal(true);
    setSelectedEndereco(endereco);
  };

  const showModalDelete = (condition: boolean) => {
    setShowDeleteModal(condition);
  };

  const deleteEndereco = (endereco: EnderecoData) => {
    if (endereco?.id) {
      EnderecoService.getInstance()
        .deleteEndereco(endereco.id)
        .then(() => {
          showModalDelete(false);
          toast.current?.show({
            severity: "success",
            summary: "Successo",
            detail: "Endereco excluido com sucesso!",
            life: 2000,
          });
        })
        .catch((err) => {
          toast.current?.show({
            severity: "error",
            summary: "Erro",
            detail: `Endereco não foi excluido! Provavelmente está em uso! ${err.message}`,
            life: 2000,
          });
        });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Endereco não foi excluido!",
        life: 2000,
      });
    }

    console.log("financeiro excluido:\n", JSON.stringify(endereco, null, 4));
    setFireReload((prev) => !prev);
  };

  const deleteEnderecoDialogFooter = (endereco: EnderecoData) => (
    <>
      <Button
        label="Não"
        icon="pi pi-times"
        severity="info"
        onClick={() => {
          showModalDelete(false);
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
        onClick={() => {
          deleteEndereco(endereco);
        }}
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
          value={enderecos ?? undefined}
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
          selection={selectedEndereco}
          showSelectAll={true}
          paginator
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registro(s)"
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          onSelectionChange={(e) => {
            setSelectedEndereco(e.value as EnderecoData);
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
            field="logradouro"
            header="Logradouro"
            sortable
            style={{ minWidth: "14rem" }}
            body={logradouroTemplate}
          ></Column>
          <Column
            field="complemento"
            header="Complemento"
            bodyClassName="text-center"
            style={{ maxWidth: "10.5rem" }}
            body={complementoTemplate}
          ></Column>
          <Column
            field="Bairro"
            header="Bairro"
            bodyClassName="text-center"
            style={{ maxWidth: "8.5rem" }}
            body={bairroTemplate}
          ></Column>
          <Column
            field="cidade"
            header="Município"
            bodyClassName="text-color-secondary text-sm"
            style={{ minWidth: "1rem" }}
            body={municipioTemplate}
          />
          <Column
            field="uf"
            header="UF"
            bodyClassName="text-color-secondary text-sm"
            style={{ minWidth: "1rem" }}
            body={ufTemplate}
          />
          <Column
            field="cep"
            header="CEP"
            bodyClassName="text-color-secondary text-sm"
            style={{ minWidth: "1rem" }}
            body={cepTemplate}
          />
          <Column
            field="pais"
            header="País"
            bodyClassName="text-color-secondary text-sm"
            style={{ minWidth: "1rem" }}
            body={paisTemplate}
          />
          <Column
            key={generateUUID()}
            header="Ações"
            bodyClassName="text-center"
            body={(data: EnderecoData) => (
              <>
                {/* Delete Financeiro Dialog */}
                <Dialog
                  visible={showDeleteModal}
                  style={{ width: "450px" }}
                  header="Confirmação"
                  modal
                  footer={deleteEnderecoDialogFooter(data)}
                  onHide={() => {
                    setShowDeleteModal(false);
                  }}
                >
                  <div className="flex align-items-center justify-content-center">
                    <i
                      className="pi pi-exclamation-triangle mr-3"
                      style={{ fontSize: "2rem" }}
                    />
                    {data && (
                      <span>
                        Você tem certeza que deseja excluir o endereço:{"\n"}
                        <b>{data.rua + ", " + data.numero}</b>?
                      </span>
                    )}
                  </div>
                </Dialog>
                <span className="p-buttonset">
                  <Button
                    className="mr-2"
                    pt={{
                      root: {
                        style: { fontSize: "0.75rem", padding: "0.4rem" },
                      },
                    }}
                    label="Editar"
                    icon="pi pi-pencil"
                    size="small"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      navigate("/enderecos/add/" + data.id, { replace: true });
                    }}
                  />
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
                    onClick={() => {
                      showModalDelete(true);
                    }}
                  />
                </span>
              </>
            )}
          />
        </DataTable>
      </div>
    </>
  );
}
