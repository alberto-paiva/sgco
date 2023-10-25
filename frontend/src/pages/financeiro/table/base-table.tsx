import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, type DataTableValueArray } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import {
  capitalize,
  FILE_UPLOAD_BASE_URL,
  formatDate,
  generateUUID,
  getCurrentYear,
  makeYearArray,
  validateFileSize,
} from "libs/utils.ts";
import {
  dataPagamentoTemplate,
  dataVencimentoTemplate,
  financeiroTableToolbar,
  observacaoTemplate,
  statusTemplate,
  tipoTemplate,
  tituloTemplate,
  unidadeTemplate,
  valorTemplate,
} from "pages/financeiro/table/table-options.tsx";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import {
  InputNumber,
  type InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import { FinanceiroService } from "libs/api/financeiro-api.ts";
import jscrudapi from "js-crud-api";
import AuthService, { API_URL } from "@/services/auth.service.ts";
import { Calendar } from "primereact/calendar";
import { FileUpload, type FileUploadSelectEvent } from "primereact/fileupload";
import { Messages } from "primereact/messages";
import { FileUploadService } from "libs/api/file-upload-api.ts";
import { fileExistsOnServer } from "libs/file-utils.ts";
import { ScrollPanel } from "primereact/scrollpanel";

interface FinanceiroTableProps {
  financeirosData: FinanceiroData[] | null;
  loading: boolean;
  loadingMessage: string | null;
  tipo?: "RECEITA" | "DESPESA";

  exportAnoCalendario: (value?: string) => void;
  reload: (value: boolean) => void;
}

export function FinanceiroTable({
  financeirosData,
  loading,
  loadingMessage,
  tipo,
  exportAnoCalendario,
  reload,
}: FinanceiroTableProps) {
  const emptyFinanceiro: FinanceiroData = {
    uuid: generateUUID(),
    titulo: "",
    valor: 0,
    dataVencimento: "",
    tipo,
  };

  const dt = useRef<DataTable<DataTableValueArray>>(null);
  const msgs = useRef<Messages>(null);
  const toast = useRef<Toast>(null);

  const [selectedFinanceiro, setSelectedFinanceiro] =
    useState<FinanceiroData>();

  const [globalFilter, setGlobalFilter] = useState("");

  const [, setSubmitted] = useState(false);

  const [financeiroDialog, setFinanceiroDialog] = useState(false);
  const [deleteFinanceiroDialog, setDeleteFinanceiroDialog] = useState(false);
  const [deleteFinanceirosDialog, setDeleteFinanceirosDialog] = useState(false);

  const [financeiros, setFinanceiros] = useState<FinanceiroData[]>([]);
  const [financeiro, setFinanceiro] = useState<FinanceiroData>(emptyFinanceiro);

  const [unidades, setUnidades] = useState<ApartamentoData[]>([]);

  const [comprovante, setComprovante] = useState<File[] | undefined>();

  const [anoCalendario, setAnoCalendario] = useState<string>();

  const [fireReload, setFireReload] = useState(false);

  const isReadOnly = AuthService.userIsCondomino();

  const {
    control,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm<FinanceiroData>({
    mode: "onChange",
    defaultValues: emptyFinanceiro,
    values: financeiro,
  });
  const getFormErrorMessage = (name: keyof FieldErrors<FinanceiroData>) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : null;
  };

  const requiredFieldError = "Este campo é obrigatório.";

  const openNew = () => {
    setFinanceiro(emptyFinanceiro);
    setSubmitted(false);
    setFinanceiroDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setFinanceiroDialog(false);
  };

  const hideDeleteFinanceiroDialog = () => {
    setDeleteFinanceiroDialog(false);
  };

  const hideDeleteFinanceirosDialog = () => {
    setDeleteFinanceirosDialog(false);
  };

  const editFinanceiro = (data: FinanceiroData) => {
    setFinanceiro(data);
    setFinanceiroDialog(true);
  };

  const confirmDeleteFinanceiro = (data: FinanceiroData) => {
    setFinanceiro(data);
    setDeleteFinanceiroDialog(true);
  };
  const confirmDeleteSelected = () => {
    setDeleteFinanceirosDialog(true);
  };

  const deleteFinanceiro = () => {
    const _financeiro = { ...financeiro };

    if (_financeiro.id) {
      FinanceiroService.getInstance()
        .deleteFinanceiro(_financeiro.id)
        .then(() => {
          setDeleteFinanceiroDialog(false);
          setFinanceiro(emptyFinanceiro);
          toast.current?.show({
            severity: "success",
            summary: "Successo",
            detail: "Financeiro Excluido",
            life: 3000,
          });
        });
    }

    console.log("financeiro excluido:\n", JSON.stringify(_financeiro, null, 4));
    setFireReload((prev) => !prev);
  };

  const deleteSelectedFinanceiros = () => {
    const _financeiros = [...financeiros];

    if (_financeiros) {
      const ids: number[] = [];
      _financeiros.forEach((e) => {
        if (e.id) {
          return ids.push(e.id);
        }
      });
      if (ids.length) {
        FinanceiroService.getInstance()
          .deleteFinanceiro(ids)
          .then(() => {
            setDeleteFinanceirosDialog(false);
            toast.current?.show({
              severity: "success",
              summary: "Successo",
              detail: "Financeiros Excluidos",
              life: 3000,
            });
          });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Seleção vazia!",
          life: 3000,
        });
      }
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Seleção inválida!",
        life: 3000,
      });
    }

    setFireReload((prev) => !prev);
  };

  const saveFinanceiro = (data: FinanceiroData) => {
    const verifiedUuid = financeiro.uuid ?? generateUUID();

    const _financeiros = [...financeiros];
    const vencimento = formatDate(data.dataVencimento);
    const pagamento = data.dataPagamento
      ? formatDate(data.dataPagamento)
      : undefined;
    let _financeiro = {
      ...data,
      id: financeiro?.id,
      uuid: verifiedUuid,
      anoCalendario: getCurrentYear(),
      dataVencimento: vencimento,
      dataPagamento: pagamento,
    };

    try {
      if (comprovante) {
        const renamedFile = new File(
          [comprovante[0]],
          Date.now() + "_" + comprovante[0].name,
        );
        _financeiro = { ..._financeiro, comprovante: renamedFile.name };
        setFinanceiro(_financeiro);

        const fileModel: FileModel = {
          path: "archives",
          file: renamedFile,
          foderName: verifiedUuid,
        };

        const uploadStatus =
          FileUploadService.getInstance().fileUpload(fileModel);

        uploadStatus.then(console.log);
      }
    } catch (error) {
      console.log("file_upload_error: ", error);
    }

    setFinanceiro(_financeiro);

    FinanceiroService.getInstance()
      .addUpdateFinanceiro(_financeiro)
      .then(() => {
        if (financeiro.id) {
          const index = findIndexById(financeiro.id);
          _financeiros[index] = _financeiro;

          toast.current?.show({
            severity: "success",
            summary: "Successful",
            detail: "Financeiro Atualizado",
            life: 3000,
          });
        } else {
          _financeiros.push(_financeiro);
          toast.current?.show({
            severity: "success",
            summary: "Successful",
            detail: "Financeiro Criado",
            life: 3000,
          });
        }

        setFinanceiros(_financeiros);
        setFinanceiroDialog(false);
        setFinanceiro(emptyFinanceiro);
        setSubmitted(true);
      });

    setFireReload((prev) => !prev);
    console.log("financeiro:\n", JSON.stringify(_financeiro, null, 4));
  };

  const findIndexById = (id: number) => {
    let index = -1;
    for (let i = 0; i < financeiros?.length; i++) {
      if (financeiros[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const deleteFinanceiroDialogFooter = (
    <>
      <Button
        label="Não"
        icon="pi pi-times"
        severity="info"
        onClick={() => {
          hideDeleteFinanceiroDialog();
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
        onClick={deleteFinanceiro}
      />
    </>
  );

  const deleteFinanceirosDialogFooter = (
    <>
      <Button
        label="Não"
        icon="pi pi-times"
        severity="info"
        onClick={() => {
          hideDeleteFinanceirosDialog();
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
        onClick={deleteSelectedFinanceiros}
      />
    </>
  );
  const financeiroTableHeader = () => {
    return (
      <div>
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
          <h5 className="m-0">
            Gerenciar {tipo ? capitalize(tipo.toLowerCase()) : "Mensalidade"}s
          </h5>
          <span className="block mt-2 md:mt-0 p-input-icon-left ml-2">
            <i className="pi pi-search" />
            <Dropdown
              id="tipo"
              value={anoCalendario ?? getCurrentYear()}
              options={makeYearArray()}
              optionLabel=""
              placeholder="Selecione..."
              emptyMessage={`Sem resultados`}
              pt={{
                root: {
                  className: classNames("p-inputtext-sm", "w-full"),
                },
              }}
              onChange={(e: DropdownChangeEvent) => {
                e.preventDefault();
                setAnoCalendario(e.value);
              }}
            />
          </span>
          <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              type="search"
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                setGlobalFilter(e.currentTarget.value);
              }}
              placeholder="Pesquisar..."
            />
          </span>
        </div>
        <div></div>
      </div>
    );
  };

  const fileurl = () => (
    <>
      {financeiro.uuid &&
        financeiro.comprovante &&
        fileExistsOnServer(
          `${FILE_UPLOAD_BASE_URL}${financeiro.uuid}/${financeiro.comprovante}`,
        ) && (
          <a
            href={`${FILE_UPLOAD_BASE_URL}${financeiro.uuid}/${financeiro.comprovante}`}
            target={"_blank"}
            rel="noreferrer"
          >
            {financeiro.comprovante}
          </a>
        )}
    </>
  );

  useEffect(() => {
    const jca = jscrudapi<UsuarioData>(API_URL);
    const getUnidades = async () => {
      const response = await jca.list("apartamentosformatados");
      setUnidades(response.records);
    };

    getUnidades().then((r) => r);

    setAnoCalendario(getCurrentYear());
  }, []);

  useEffect(() => {
    reload(fireReload);
  }, [fireReload, setFireReload, reload]);

  useEffect(() => {
    exportAnoCalendario(anoCalendario);
  }, [anoCalendario, setAnoCalendario, exportAnoCalendario]);

  return (
    <>
      <div className="grid">
        <div className="col-12">
          <div className="card">
            {loading ? (
              <div className="spinner-wrapper">
                {loadingMessage}
                <ProgressSpinner
                  aria-label="Loading"
                  style={{
                    width: "40px",
                    height: "40px",
                    position: "absolute",
                  }}
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
            {financeiroTableToolbar(
              selectedFinanceiro,
              dt,
              openNew,
              confirmDeleteSelected,
            )}
            <Toast ref={toast} />
            <DataTable
              value={financeirosData ?? undefined}
              ref={dt}
              dataKey={"id"}
              header={financeiroTableHeader()}
              columnResizeMode="expand"
              resizableColumns
              showGridlines
              stripedRows
              size="small"
              selectionMode={"single"}
              // selectAll={true}
              dragSelection={true}
              selection={selectedFinanceiro}
              showSelectAll={true}
              paginator
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registro(s)"
              globalFilter={globalFilter}
              emptyMessage="Nenhum registro encontrado."
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              tableStyle={{ minWidth: "50rem" }}
              className="datatable-responsive"
              scrollable={true}
              scrollHeight={"400px"}
              onSelectionChange={(e) => {
                setSelectedFinanceiro(e.value as FinanceiroData);
                if (e.value.length > 1) {
                  setFinanceiros(e.value as FinanceiroData[]);
                }
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
                field="titulo"
                header="Título"
                sortable
                style={{ minWidth: "14rem" }}
                bodyClassName="text-color-secondary text-sm"
                body={tituloTemplate}
              ></Column>
              <Column
                field="valor"
                header="Valor"
                bodyClassName="text-center"
                style={{ maxWidth: "6.5rem" }}
                body={valorTemplate}
              ></Column>
              <Column
                field="dataVencimento"
                header="Vencimento"
                bodyClassName="text-center"
                style={{ maxWidth: "8.5rem" }}
                body={dataVencimentoTemplate}
              ></Column>
              <Column
                field="dataPagamento"
                header="Pagamento"
                bodyClassName="text-color-secondary text-sm"
                style={{ maxWidth: "8.5rem" }}
                body={dataPagamentoTemplate}
              />
              <Column
                field="statusFinanceiro"
                header="Status"
                bodyClassName="text-color-secondary text-sm"
                style={{ minWidth: "1rem" }}
                body={statusTemplate}
              />
              {!AuthService.userIsCondomino() && (
                <Column
                  field="tipo"
                  header="Tipo"
                  bodyClassName="text-color-secondary text-sm"
                  style={{ minWidth: "1rem" }}
                  body={tipoTemplate}
                />
              )}
              <Column
                field="observacao"
                header="Observações"
                bodyClassName="text-color-secondary text-sm"
                style={{ minWidth: "1rem" }}
                body={observacaoTemplate}
              />
              <Column
                field="unidade"
                header="Unidade"
                bodyClassName="text-color-secondary text-sm"
                style={{ minWidth: "1rem" }}
                body={unidadeTemplate}
              />
              <Column
                key={generateUUID()}
                header="Ações"
                bodyClassName="text-center"
                body={(rowData: FinanceiroData) => (
                  <span className="p-buttonset">
                    <Button
                      icon={`pi ${
                        AuthService.userIsCondomino() ? "pi-eye" : "pi-pencil"
                      }`}
                      size="small"
                      rounded
                      className="mr-2"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        editFinanceiro(rowData);
                      }}
                    />
                    {!AuthService.userIsCondomino() ? (
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        size="small"
                        rounded
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          confirmDeleteFinanceiro(rowData);
                        }}
                      />
                    ) : null}
                  </span>
                )}
              />
            </DataTable>
            {/* Edit Financeiro Dialog */}
            <div className="card flex justify-content-center">
              <Dialog
                visible={financeiroDialog}
                // style={{ width: "450px" }}
                style={{ width: "50vw", marginLeft: "10%", marginRight: "10%" }}
                breakpoints={{ "960px": "75vw", "641px": "100vw" }}
                contentStyle={{
                  width: "auto",
                  height: "auto",
                  padding: "0 1.5rem",
                }}
                headerStyle={{
                  width: "auto",
                  height: "auto",
                  padding: "1.5rem 1.5rem 0rem",
                }}
                header={
                  isReadOnly && !tipo
                    ? "Informar Pagamento"
                    : financeiro.id
                    ? "Editar"
                    : "Nova " + capitalize(tipo ? tipo.toLowerCase() : "")
                }
                modal
                maximizable
                className="p-fluid"
                onHide={hideDialog}
              >
                <form id="form1" onSubmit={handleSubmit(saveFinanceiro)}>
                  <div className="pt-4 ml-4 mr-4">
                    <div className="formgrid grid">
                      {/* TITULO */}
                      <div className="field col-12">
                        <label htmlFor="titulo">Título</label>
                        <Controller
                          name="titulo"
                          control={control}
                          defaultValue={financeiro.titulo}
                          rules={{ required: requiredFieldError }}
                          render={({ field, fieldState }) => (
                            <InputText
                              {...field}
                              id="titulo"
                              type="text"
                              value={field.value}
                              autoFocus
                              pt={{
                                root: {
                                  className: classNames(
                                    "p-inputtext-sm w-full",
                                    {
                                      "p-invalid": fieldState.error,
                                    },
                                  ),
                                },
                              }}
                              onInput={(
                                e: React.FormEvent<HTMLInputElement>,
                              ) => {
                                e.preventDefault();
                                field.onChange(e);
                              }}
                              disabled={isReadOnly}
                            />
                          )}
                        />
                        {getFormErrorMessage("titulo")}
                      </div>
                      {/* VALOR */}
                      <div className="field col-12">
                        <label htmlFor="valor">Valor</label>
                        <Controller
                          name="valor"
                          control={control}
                          defaultValue={financeiro.valor}
                          rules={{ required: requiredFieldError }}
                          render={({ field, fieldState }) => (
                            <InputNumber
                              id="valor"
                              value={field.value}
                              mode="currency"
                              currency="BRL"
                              locale="pt-BR"
                              minFractionDigits={2}
                              pt={{
                                root: {
                                  className: classNames(
                                    "p-inputtext-sm w-full",
                                    {
                                      "p-invalid": fieldState.error,
                                    },
                                  ),
                                },
                              }}
                              onValueChange={(
                                e: InputNumberValueChangeEvent,
                              ) => {
                                e.preventDefault();
                                field.onChange(e);
                              }}
                              disabled={isReadOnly}
                            />
                          )}
                        />
                        {getFormErrorMessage("valor")}
                      </div>
                      {/* DATA VENCIMENTO */}
                      <div className="field col-12 md:col-6">
                        <label htmlFor="dataVencimento">Vencimento</label>
                        <Controller
                          name="dataVencimento"
                          control={control}
                          defaultValue={formatDate(
                            financeiro.dataVencimento,
                            "DD/MM/YYYY",
                          )}
                          rules={{ required: requiredFieldError }}
                          render={({ field, fieldState }) => (
                            <>
                              <Calendar
                                {...field}
                                id="dataVencimento"
                                value={new Date(Date.parse(field.value))}
                                mask="99/99/9999"
                                placeholder="DD/MM/YYYY"
                                dateFormat="dd/mm/yy"
                                locale="pt"
                                showIcon
                                showButtonBar
                                pt={{
                                  input: {
                                    root: {
                                      className: classNames(
                                        "p-inputtext-sm w-full",
                                        {
                                          "p-invalid": fieldState.error,
                                        },
                                      ),
                                    },
                                  },
                                }}
                                onChange={(e) => {
                                  e.preventDefault();
                                  if (e.value) {
                                    field.onChange(
                                      formatDate(
                                        new Date(e.value).toLocaleDateString(),
                                        "YYYY-MM-DD HH:mm:ss",
                                      ),
                                    );
                                  } else {
                                    field.onChange(e.value);
                                  }
                                }}
                                disabled={isReadOnly}
                              />
                            </>
                          )}
                        />
                        {getFormErrorMessage("dataVencimento")}
                      </div>
                      {/* DATA PAGAMENTO */}
                      <div className="field col-12 md:col-6">
                        <label htmlFor="dataPagamento">Pagamento</label>
                        <Controller
                          name="dataPagamento"
                          control={control}
                          defaultValue={
                            financeiro.dataPagamento
                              ? formatDate(
                                  financeiro.dataPagamento,
                                  "DD/MM/YYYY",
                                )
                              : undefined
                          }
                          render={({ field, fieldState }) => (
                            <>
                              <Calendar
                                {...field}
                                id="dataPagamento"
                                value={
                                  field.value
                                    ? new Date(Date.parse(field.value))
                                    : undefined
                                }
                                mask="99/99/9999"
                                placeholder="DD/MM/YYYY"
                                dateFormat="dd/mm/yy"
                                locale="pt"
                                showIcon
                                showButtonBar
                                pt={{
                                  input: {
                                    root: {
                                      className: classNames(
                                        "p-inputtext-sm w-full",
                                        {
                                          "p-invalid": fieldState.error,
                                        },
                                      ),
                                    },
                                  },
                                }}
                                onChange={(e) => {
                                  e.preventDefault();
                                  if (e.value) {
                                    field.onChange(
                                      formatDate(
                                        new Date(e.value).toLocaleDateString(),
                                        "YYYY-MM-DD HH:mm:ss",
                                      ),
                                    );
                                  } else {
                                    field.onChange(e.value);
                                  }
                                }}
                              />
                            </>
                          )}
                        />
                        {getFormErrorMessage("dataPagamento")}
                      </div>
                      {/* STATUS/TIPO */}
                      <div className="field col-12">
                        <div className="formgrid grid">
                          {/* TIPO */}
                          <div className="col-6">
                            <label htmlFor="tipo">Tipo</label>
                            <Controller
                              name="tipo"
                              control={control}
                              defaultValue={financeiro.tipo}
                              rules={{ required: requiredFieldError }}
                              render={({ field, fieldState }) => (
                                <Dropdown
                                  id="tipo"
                                  value={field.value}
                                  options={["RECEITA", "DESPESA"]}
                                  optionLabel=""
                                  placeholder="Selecione..."
                                  emptyMessage={`Sem resultados`}
                                  pt={{
                                    root: {
                                      className: classNames(
                                        "p-inputtext-sm w-full",
                                        {
                                          "p-invalid": fieldState.error,
                                        },
                                      ),
                                    },
                                  }}
                                  onChange={(e: DropdownChangeEvent) => {
                                    e.preventDefault();
                                    field.onChange(e.value);
                                  }}
                                  disabled
                                />
                              )}
                            />
                            {getFormErrorMessage("tipo")}
                          </div>
                          {/* STATUS */}
                          <div className="col-6">
                            <label htmlFor="statusFinanceiro">Status</label>
                            <Controller
                              name="statusFinanceiro"
                              control={control}
                              defaultValue={financeiro.statusFinanceiro}
                              rules={{ required: requiredFieldError }}
                              render={({ field, fieldState }) => (
                                <Dropdown
                                  id="statusFinanceiro"
                                  value={field.value}
                                  options={["PENDENTE", "PAGO"]}
                                  optionLabel=""
                                  placeholder="Selecione..."
                                  emptyMessage={`Sem resultados`}
                                  pt={{
                                    root: {
                                      className: classNames(
                                        "p-inputtext-sm w-full",
                                        {
                                          "p-invalid": fieldState.error,
                                        },
                                      ),
                                    },
                                  }}
                                  onChange={(e: DropdownChangeEvent) => {
                                    e.preventDefault();
                                    field.onChange(e.value);
                                  }}
                                  disabled={isReadOnly}
                                />
                              )}
                            />
                            {getFormErrorMessage("statusFinanceiro")}
                          </div>
                        </div>
                      </div>
                      <div className="field col-12">
                        <div>
                          <label htmlFor="idUnidade">Unidade</label>
                          <Controller
                            name="idUnidade"
                            control={control}
                            defaultValue={financeiro.idUnidade}
                            render={({ field, fieldState }) => (
                              <Dropdown
                                id="idUnidade"
                                value={field.value}
                                options={unidades}
                                optionLabel="label"
                                placeholder="Selecione..."
                                emptyMessage={`Sem resultados`}
                                pt={{
                                  root: {
                                    className: classNames(
                                      "p-inputtext-sm w-full",
                                      {
                                        "p-invalid": fieldState.error,
                                      },
                                    ),
                                  },
                                }}
                                onChange={(e: DropdownChangeEvent) => {
                                  e.preventDefault();
                                  field.onChange(e.value);
                                }}
                                disabled={isReadOnly}
                              />
                            )}
                          />
                          {getFormErrorMessage("idUnidade")}
                        </div>
                      </div>
                      {/* COMPROVANTE */}
                      <div className="field col-12">
                        <Controller
                          name="comprovante"
                          control={control}
                          defaultValue={financeiro.comprovante}
                          render={({ field, fieldState }) => (
                            <FileUpload
                              {...field}
                              id="comprovante"
                              mode="basic"
                              multiple={false}
                              name="file"
                              url="/api/upload"
                              accept="image/jpeg,image/png,application/pdf"
                              maxFileSize={3 * 1024 * 1024}
                              chooseLabel="Escolha o arquivo! (max. 3MB)"
                              pt={{
                                root: {
                                  className: classNames(
                                    "p-inputtext-sm w-full",
                                    {
                                      "p-invalid": fieldState.error,
                                    },
                                  ),
                                },
                              }}
                              onValidationFail={(file: File) => {
                                console.log("onValidationFail: ", file);
                                const valid = validateFileSize(
                                  file,
                                  3 * 1024 * 1024,
                                );
                                if (!valid.status) {
                                  msgs.current?.show([
                                    {
                                      severity: "error",
                                      summary: valid.message?.summary,
                                      detail: valid.message?.detail,
                                    },
                                  ]);
                                }
                              }}
                              onSelect={(e: FileUploadSelectEvent) => {
                                e.originalEvent.preventDefault();
                                field.onChange(e);
                                setComprovante(e.files);
                              }}
                            />
                          )}
                        />
                        <Messages
                          ref={msgs}
                          id="size-message-error"
                          pt={{
                            wrapper: { className: "p-1" },
                            summary: { className: "text-sm" },
                            detail: { className: "text-sm" },
                          }}
                        />
                        {fileurl()}
                        {getFormErrorMessage("comprovante")}
                      </div>
                      <div className="field col-12">
                        <label htmlFor="observacao">Observações</label>
                        <Controller
                          name="observacao"
                          control={control}
                          defaultValue={financeiro.observacao}
                          render={({ field, fieldState }) => (
                            <InputTextarea
                              id="observacao"
                              value={field.value}
                              rows={3}
                              cols={20}
                              autoResize
                              pt={{
                                root: {
                                  className: classNames(
                                    "p-inputtext-sm w-full",
                                    {
                                      "p-invalid": fieldState.error,
                                    },
                                  ),
                                },
                              }}
                              onInput={(
                                e: React.FormEvent<HTMLTextAreaElement>,
                              ) => {
                                e.preventDefault();
                                field.onChange(e.currentTarget.value);
                              }}
                              disabled={isReadOnly}
                            />
                          )}
                        />
                        {getFormErrorMessage("observacao")}
                      </div>
                      <div className="flex align-items-center justify-content-end gap-2 mb-4">
                        <Button
                          label="Cancelar"
                          severity="danger"
                          icon="pi pi-times"
                          onClick={hideDialog}
                        />
                        <Button
                          label="Salvar"
                          type="submit"
                          icon="pi pi-check"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </Dialog>{" "}
            </div>
            {/* Delete Financeiro Dialog */}
            <Dialog
              visible={deleteFinanceiroDialog}
              style={{ width: "450px" }}
              header="Confirmação"
              modal
              footer={deleteFinanceiroDialogFooter}
              onHide={hideDeleteFinanceiroDialog}
            >
              <div className="flex align-items-center justify-content-center">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {financeiro && (
                  <span>
                    Você tem certeza que deseja excluir o item{" "}
                    <b>{financeiro.titulo}</b>?
                  </span>
                )}
              </div>
            </Dialog>
            {/* Delete Financeiros Dialog */}
            <Dialog
              visible={deleteFinanceirosDialog}
              style={{ width: "450px" }}
              header="Confirmação"
              modal
              footer={deleteFinanceirosDialogFooter}
              onHide={hideDeleteFinanceirosDialog}
            >
              <div className="flex align-items-center justify-content-center">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {financeiro && (
                  <span>
                    Tem certeza que deseja excluir todos os{" "}
                    {financeiros.length ? <b>{financeiros.length}</b> : ""}{" "}
                    itens selecionados?
                    <ScrollPanel style={{ width: "100%", height: "150px" }}>
                      <ul>
                        {financeiros.length &&
                          financeiros.map((f) => {
                            return (
                              <>
                                <li>
                                  <code key={generateUUID()}>{f.titulo}</code>
                                </li>
                              </>
                            );
                          })}
                      </ul>
                    </ScrollPanel>
                  </span>
                )}
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}
