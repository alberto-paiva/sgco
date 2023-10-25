import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, type DataTableValueArray } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { useLocation } from "wouter";
import { generateUUID } from "libs/utils.ts";
import {
  unidadeBlocoTemplate,
  unidadeIdCondominioTemplate,
  unidadeNumeroTemplate,
  unidadeObservacaoTemplate,
  useExportHeader,
} from "pages/unidades/table/table-options.tsx";
import { Toast } from "primereact/toast";
import { UnidadeService } from "libs/api/unidade-api.ts";
import { Dialog } from "primereact/dialog";

interface UnidadesTableProps {
  unidades: UnidadeData[] | null;
  loading: boolean;
  loadingMessage: string | null;

  reload: (value: boolean) => void;

  exportSelectedCondominio: (value?: string) => void;
}

export function UnidadesTable({
  unidades,
  loading,
  loadingMessage,
  reload,
  exportSelectedCondominio,
}: UnidadesTableProps) {
  const dt = useRef<DataTable<DataTableValueArray>>(null);
  const toast = useRef<Toast>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedUnidade, setSelectedUnidade] = useState<UnidadeData>();
  const [selectedCondominio, setSelectedCondominio] =
    useState<CondominioData>();

  const [fireReload, setFireReload] = useState(false);

  const [, navigate] = useLocation();

  const showModalEdit = (unidade?: UnidadeData) => {
    setShowEditModal(true);
    setSelectedUnidade(unidade);
  };

  const showModalDelete = (unidade: UnidadeData) => {
    setShowDeleteModal(true);
    setSelectedUnidade(unidade);
  };

  const deleteUnidade = () => {
    const _unidade = { ...selectedUnidade };

    if (_unidade.id) {
      UnidadeService.getInstance()
        .deleteUnidade(_unidade.id)
        .then(() => {
          setShowDeleteModal(false);
          toast.current?.show({
            severity: "success",
            summary: "Successo",
            detail: "Unidade Excluido",
            life: 3000,
          });
        });
    }

    console.log("unidade excluida:\n", JSON.stringify(_unidade, null, 4));
    setFireReload((prev) => !prev);
  };

  const deleteUnidadeDialogFooter = (
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
        onClick={deleteUnidade}
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
          value={unidades ?? undefined}
          ref={dt}
          dataKey={"id"}
          header={useExportHeader({ dt, showModalEdit, setSelectedCondominio })}
          columnResizeMode="expand"
          resizableColumns
          showGridlines
          stripedRows
          size="small"
          selectionMode={"single"}
          // selectAll={true}
          dragSelection={true}
          selection={selectedUnidade}
          showSelectAll={true}
          paginator
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registro(s)"
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          // onValueChange={(value: DataTableRowData<CondominoData[]>[]) => {
          //   console.log("onValueChange: ", value);
          //   setSelectedCondominos(value);
          //   setRenderedItems(value);
          // }}
          onSelectionChange={(e) => {
            // console.log("onSelectionChange: ", e.value as CondominoData);
            setSelectedUnidade(e.value as UnidadeData);
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
            field="bloco"
            header="Bloco"
            sortable
            style={{ minWidth: "14rem" }}
            body={unidadeBlocoTemplate}
          ></Column>
          <Column
            field="numero"
            header="Número"
            bodyClassName="text-center"
            style={{ maxWidth: "10.5rem" }}
            body={unidadeNumeroTemplate}
          ></Column>
          <Column
            field="observacao"
            header="Observação"
            bodyClassName="text-center"
            style={{ maxWidth: "8.5rem" }}
            body={unidadeObservacaoTemplate}
          ></Column>
          <Column
            field="idCondominio"
            header="Condomínio"
            bodyClassName="text-color-secondary text-sm"
            style={{ minWidth: "1rem" }}
            body={unidadeIdCondominioTemplate}
          />
          <Column
            key={generateUUID()}
            header="Ações"
            bodyClassName="text-center"
            body={(data: UnidadeData) => (
              <span className="p-buttonset">
                <Button
                  className="mr-2"
                  pt={{
                    root: { style: { fontSize: "0.75rem", padding: "0.4rem" } },
                  }}
                  label="Editar"
                  icon="pi pi-pencil"
                  size="small"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    // showModalEdit(data);
                    navigate("/unidades/add/" + data.id, { replace: true });
                  }}
                />
                <Button
                  pt={{
                    root: { style: { fontSize: "0.75rem", padding: "0.4rem" } },
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
              </span>
            )}
          />
        </DataTable>
        <Toast ref={toast} />
        {showDeleteModal && selectedUnidade && (
          <>
            {/* Delete Financeiro Dialog */}
            <Dialog
              visible={showDeleteModal}
              style={{ width: "450px" }}
              header="Confirmação"
              modal
              footer={deleteUnidadeDialogFooter}
              onHide={() => {
                setShowDeleteModal(false);
              }}
            >
              <div className="flex align-items-center justify-content-center">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {selectedUnidade && (
                  <span>
                    Você tem certeza que deseja excluir o item{" "}
                    <b>
                      Ap.{selectedUnidade.numero} - Bl.{selectedUnidade.bloco}.{" "}
                      {selectedUnidade.nomeCondominio}
                    </b>
                    ?
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
