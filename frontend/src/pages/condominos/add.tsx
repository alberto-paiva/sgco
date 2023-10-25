// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT
import { DefaultLayout } from "@/layouts/DefaultLayout";
import {
  formatDate,
  generateUUID,
  IMAGE_UPLOAD_BASE_URL,
  isValidCPF,
  randomString,
  sleep,
} from "@/libs/utils";
import PhotoUploader from "components/PhotoUploader/PhotoUploader.tsx";
import { useDataReducer } from "libs/data-utils.ts";
import { createFileFromUrl, fileExistsOnServer } from "libs/file-utils.ts";
import { Button } from "primereact/button";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import {
  InputSwitch,
  type InputSwitchChangeEvent,
} from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { type Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { type CondominoFormInputs, initialFormState } from "./utils/form-hooks";
import { CondominoService } from "libs/api/condomino-api.ts";
import { FileUploadService } from "libs/api/file-upload-api.ts";
import { UnidadeService } from "libs/api/unidade-api.ts";
import AuthService from "@/services/auth.service.ts";

interface AddEditCondominoProps {
  id: string | null;
  title?: string;
}

export function CondominosAdd({ id, title }: AddEditCondominoProps) {
  const condominoDataReducer = useDataReducer<CondominoData>();
  const blocosDataReducer = useDataReducer<BlocoLabelsData>();
  const unidadesDataReducer = useDataReducer<ApartamentoData>();

  // State for user image
  const [condominoImage, setCondominoImage] = useState<File | undefined>();

  const [formInputs, setFormInputs] =
    useState<CondominoFormInputs>(initialFormState);

  const toast = useRef<Toast | null>(null);

  const [, navigate] = useLocation();

  const isReadOnly = AuthService.userIsCondomino();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CondominoFormInputs>({
    mode: "onChange",
    defaultValues: formInputs,
    values: formInputs,
  });

  const requiredFieldError = "Este campo é obrigatório.";

  const getFormErrorMessage = (
    name: keyof FieldErrors<CondominoFormInputs>,
  ) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : null;
  };

  const showSuccessToast = () => {
    toast.current?.show({
      severity: "success",
      summary: "Sucesso",
      detail: "Operação realizada com sucesso!",
    });
  };

  const handleFormSubmit = (data: CondominoFormInputs) => {
    console.log("Form Data:", data);

    const verifiedUuid = formInputs.uuid ?? generateUUID();

    const _condomino: CondominoData = {
      id: condominoDataReducer.state.data?.id,
      uuid: verifiedUuid,
      nome: data.nome,
      email: data.email,
      cpf: data.cpf,
      contato: data.contato,
      proprietario: data.proprietario,
      dataEntrada: formatDate(data.dataEntrada),
      dataSaida: data.dataSaida ? formatDate(data.dataSaida) : undefined,
      observacao: data.observacao,
      tipo: data?.tipo,
      idUnidade: data.idUnidade,
    };

    try {
      if (data.imagemPerfil) {
        const image = data.imagemPerfil as unknown as File;

        if (
          !fileExistsOnServer(
            `${IMAGE_UPLOAD_BASE_URL}${data.uuid}/${image.name}`,
          )
        ) {
          const myRenamedFile = new File(
            [image],
            randomString() +
              "_" +
              Date.now() +
              "." +
              image.name.split(".").pop(),
          );

          _condomino.imagemPerfil = myRenamedFile.name;

          try {
            const fileModel: FileModel = {
              path: "images",
              file: myRenamedFile,
              foderName: data.uuid,
            };

            const uploadStatus =
              FileUploadService.getInstance().fileUpload(fileModel);

            uploadStatus.then(console.log);
          } catch (error) {
            console.log("file_upload_error: ", error);
          }
        }
      }

      console.log("onSubmit_condomino: ", JSON.stringify(_condomino, null, 4));

      CondominoService.getInstance()
        .addUpdateCondomino(_condomino)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      showSuccessToast();
    } catch (e) {
      console.log("ERRORS: :-(\n\n" + JSON.stringify(errors));
    } finally {
      sleep(100).then(() => {
        // reset();
        navigate("/condominos/list", { replace: true });
      });
    }
  };

  useEffect(() => {
    const fetchCondominoData = async () => {
      condominoDataReducer.dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response = id
          ? await CondominoService.getInstance().getCondominoById(id)
          : null;
        condominoDataReducer.dispatch({
          type: "FETCH_DATA_SUCCESS",
          payload: response,
        });
      } catch (error) {
        condominoDataReducer.dispatch({
          type: "FETCH_DATA_FAILURE",
          payload: `error fetching data: ${error}`,
        });
      }
    };

    const fetchBlocoData = async () => {
      blocosDataReducer.dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response = await UnidadeService.getInstance().getNomeBlocos();
        blocosDataReducer.dispatch({
          type: "FETCH_DATA_ARRAY_SUCCESS",
          payload: response,
        });
      } catch (error) {
        blocosDataReducer.dispatch({
          type: "FETCH_DATA_FAILURE",
          payload: `error fetching data: ${error}`,
        });
      }
    };

    fetchCondominoData().then((r) => r);
    fetchBlocoData().then((r) => r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load user image from URL (if available)
  useEffect(() => {
    const makeProfileImage = async () => {
      const condominoProfileImage =
        condominoDataReducer.state.data?.imagemPerfil;

      if (condominoProfileImage) {
        try {
          const foto = await createFileFromUrl(
            `${IMAGE_UPLOAD_BASE_URL}${condominoDataReducer.state.data?.uuid}/${condominoProfileImage}`,
          );
          setCondominoImage(foto);
        } catch (error) {
          console.error("Error loading condomino image:", error);
        }
      }
    };

    // Populate form fields with condominoData when available
    if (condominoDataReducer.state.data) {
      makeProfileImage().then((r) => r);

      setFormInputs({
        uuid: condominoDataReducer.state.data.uuid ?? generateUUID(),
        nome: condominoDataReducer.state.data.nome || "",
        email: condominoDataReducer.state.data.email ?? undefined,
        cpf: condominoDataReducer.state.data.cpf ?? undefined,
        contato: condominoDataReducer.state.data.contato || "",
        proprietario: condominoDataReducer.state.data.proprietario || false,
        dataEntrada: condominoDataReducer.state.data.dataEntrada
          ? formatDate(
              condominoDataReducer.state.data.dataEntrada,
              "DD/MM/YYYY",
            )
          : "",
        dataSaida: condominoDataReducer.state.data.dataSaida
          ? formatDate(condominoDataReducer.state.data.dataSaida, "DD/MM/YYYY")
          : undefined,
        observacao: condominoDataReducer.state.data.observacao ?? "",
        tipo: "C",
        imagemPerfil: condominoDataReducer.state.data.imagemPerfil ?? undefined,
        idUnidade: condominoDataReducer.state.data.idUnidade ?? undefined,
        bloco: condominoDataReducer.state.data.bloco ?? "",
        numero: condominoDataReducer.state.data.numero ?? undefined,
        observacaoUnidade:
          condominoDataReducer.state.data.observacaoUnidade ?? undefined,
        idCondominio: condominoDataReducer.state.data.idCondominio ?? undefined,
      });
    }
  }, [condominoDataReducer.state.data]);

  useEffect(() => {
    const fetchData = async () => {
      unidadesDataReducer.dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response =
          await UnidadeService.getInstance().getApartamentosPorBlocos(
            formInputs.bloco,
          );
        console.log("unidadesDataReducer: ", response);
        unidadesDataReducer.dispatch({
          type: "FETCH_DATA_ARRAY_SUCCESS",
          payload: response,
        });
      } catch (error) {
        unidadesDataReducer.dispatch({
          type: "FETCH_DATA_FAILURE",
          payload: `error fetching data: ${error}`,
        });
      }
    };

    fetchData().then((r) => r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formInputs.bloco, blocosDataReducer.state.loading]);

  return (
    <DefaultLayout title={title ?? `${id ? "Editar" : "Adicionar"} Condômino`}>
      <div className="card">
        <div>
          {condominoDataReducer.state.loading ? (
            <p>Loading...</p>
          ) : condominoDataReducer.state.error ? (
            <p>{condominoDataReducer.state.error}</p>
          ) : (
            <div>
              <form id="form1" onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="pt-4">
                  <div className="formgrid grid">
                    {/* NOME */}
                    <div className="field col-12 md:col-6">
                      <label htmlFor="nome">Nome</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-user" />
                        <Controller
                          name="nome"
                          control={control}
                          defaultValue={formInputs.nome}
                          rules={{ required: requiredFieldError }}
                          render={({ field, fieldState }) => (
                            <InputText
                              {...field}
                              id={field.name}
                              type="text"
                              className={classNames("p-inputtext-sm w-full", {
                                "p-invalid": fieldState.error,
                              })}
                              value={field.value}
                              onInput={(
                                e: React.FormEvent<HTMLInputElement>,
                              ) => {
                                field.onChange(e.currentTarget.value);
                                setFormInputs({
                                  ...formInputs,
                                  nome: e.currentTarget.value,
                                });
                              }}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("nome")}
                    </div>
                    {/* E-MAIL */}
                    <div className="field col-12 md:col-6">
                      <label htmlFor="email">Email</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-at" />
                        <Controller
                          name="email"
                          control={control}
                          defaultValue={formInputs.email}
                          rules={{
                            // required: requiredFielError,
                            pattern: {
                              value:
                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, // Email pattern
                              message: "Endereço de email inválido",
                            },
                          }}
                          render={({ field, fieldState }) => (
                            <InputText
                              {...field}
                              id="email"
                              type="text"
                              className={classNames("p-inputtext-sm w-full", {
                                "p-invalid": fieldState.error,
                              })}
                              value={field.value}
                              onInput={(
                                e: React.FormEvent<HTMLInputElement>,
                              ) => {
                                field.onChange(e.currentTarget.value);
                                setFormInputs({
                                  ...formInputs,
                                  email: e.currentTarget.value,
                                });
                              }}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("email")}
                    </div>
                    {/* CPF */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="cpf">CPF</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-id-card" />
                        <Controller
                          name="cpf"
                          control={control}
                          defaultValue={formInputs.cpf}
                          rules={{
                            validate: (value) =>
                              (value ? isValidCPF(value) : true) ||
                              "CPF inválido",
                          }}
                          render={({ field, fieldState }) => (
                            <InputMask
                              {...field}
                              id="cpf"
                              mask="999.999.999-99"
                              placeholder="000.000.000-00"
                              autoClear={false}
                              unmask
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
                              value={field.value}
                              onInput={(
                                e: React.FormEvent<HTMLInputElement>,
                              ) => {
                                field.onChange(e.currentTarget.value);
                                setFormInputs({
                                  ...formInputs,
                                  cpf: e.currentTarget.value,
                                });
                              }}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("cpf")}
                    </div>
                    {/* CONTATO */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="contato">Contato</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-phone" />
                        <Controller
                          name="contato"
                          control={control}
                          defaultValue={formInputs.contato}
                          rules={{
                            //  validate: (value) => validatePhoneNumber(value, false) || 'Contato inválido',
                            // /[0-9]{10,11}/g
                            pattern: {
                              // value: /^(0[0-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, // DD/MM/YYYY
                              value: /^[0-9]{10,11}$/, // DDMMYYYY
                              message: "Contato inválido",
                            },
                            required: requiredFieldError,
                          }}
                          render={({ field, fieldState }) => (
                            <InputMask
                              {...field}
                              id="contato"
                              // mask={formInputs.contato.length === 10 ? '(99)9999-9999' : '(99)99999-9999'}
                              mask={"(99)9999-9999?9"}
                              placeholder="(00)0000-00000"
                              autoClear={true}
                              unmask
                              pt={{
                                root: {
                                  className: classNames(
                                    "p-inputtext-sm",
                                    "w-full",
                                    {
                                      "p-invalid": fieldState.error,
                                    },
                                  ),
                                },
                              }}
                              value={field.value}
                              onInput={(
                                e: React.FormEvent<HTMLInputElement>,
                              ) => {
                                field.onChange(e.currentTarget.value);
                                setFormInputs({
                                  ...formInputs,
                                  contato: e.currentTarget.value,
                                });
                              }}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("contato")}
                    </div>
                    {/* ENTRADA */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="dataEntrada">Data Entrada</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-calendar" />
                        <Controller
                          name="dataEntrada"
                          control={control}
                          defaultValue={formInputs.dataEntrada}
                          rules={{
                            required: requiredFieldError,
                            pattern: {
                              value:
                                /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, // DD/MM/YYYY
                              // value: 	/^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])\d{4}$/, // DDMMYYYY
                              message: "Formato de data inválido",
                            },
                          }}
                          render={({ field, fieldState }) => (
                            <InputMask
                              {...field}
                              id="dataEntrada"
                              mask="99/99/9999"
                              placeholder="DD/MM/YYYY"
                              slotChar="DD/MM/YYYY"
                              autoClear={true}
                              unmask={false}
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
                              value={field.value}
                              onInput={(
                                e: React.FormEvent<HTMLInputElement>,
                              ) => {
                                field.onChange(e.currentTarget.value);
                                setFormInputs({
                                  ...formInputs,
                                  dataEntrada: e.currentTarget.value,
                                });
                              }}
                              disabled={isReadOnly}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("dataEntrada")}
                    </div>
                    {/* SAIDA */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="dataSaida">Data Saída</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-calendar" />
                        <Controller
                          name="dataSaida"
                          control={control}
                          defaultValue={formInputs.dataSaida}
                          rules={{
                            // required: requiredFielError,
                            pattern: {
                              value:
                                /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, // DD/MM/YYYY
                              // value: /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])\d{4}$/, // DDMMYYYY
                              message: "Formato de data inválido",
                            },
                          }}
                          render={({ field, fieldState }) => (
                            <InputMask
                              {...field}
                              id="dataSaida"
                              mask="99/99/9999"
                              placeholder="DD/MM/YYYY"
                              slotChar="DD/MM/YYYY"
                              autoClear={true}
                              unmask={false}
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
                              value={field.value}
                              onInput={(
                                e: React.FormEvent<HTMLInputElement>,
                              ) => {
                                field.onChange(e.currentTarget.value);
                                setFormInputs({
                                  ...formInputs,
                                  dataSaida: e.currentTarget.value,
                                });
                              }}
                              disabled={isReadOnly}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("dataSaida")}
                    </div>
                    {/* BLOCO */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="bloco">Bloco</label>
                      <Controller
                        name="bloco"
                        control={control}
                        defaultValue={formInputs.bloco}
                        rules={{ required: requiredFieldError }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            {...field}
                            id="bloco"
                            options={blocosDataReducer.state.dataArray?.map(
                              (e) => e.label,
                            )}
                            optionLabel=""
                            placeholder="Selecione"
                            className={classNames("p-inputtext-sm w-full", {
                              "p-invalid": fieldState.error,
                            })}
                            emptyMessage={
                              !blocosDataReducer.state.dataArray
                                ? "Sem resultados"
                                : "Selecione o bloco!"
                            }
                            value={field.value}
                            onChange={(e: DropdownChangeEvent) => {
                              field.onChange(e.value);
                              setFormInputs({ ...formInputs, bloco: e.value });
                            }}
                            disabled={isReadOnly}
                          />
                        )}
                      />
                      {getFormErrorMessage("bloco")}
                    </div>
                    {/* APARTAMENTO */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="idUnidade">Apartamento</label>
                      <Controller
                        name="idUnidade"
                        control={control}
                        defaultValue={formInputs.idUnidade}
                        rules={{ required: requiredFieldError }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            id="idUnidade"
                            options={unidadesDataReducer.state.dataArray ?? []}
                            defaultValue={field.value}
                            optionLabel="label"
                            placeholder="Selecione"
                            className={classNames("p-inputtext-sm w-full", {
                              "p-invalid": fieldState.error,
                            })}
                            emptyMessage={
                              !unidadesDataReducer.state.dataArray?.length
                                ? `Sem resultados`
                                : "Selecione a unidade!"
                            }
                            disabled={!formInputs.bloco || isReadOnly}
                            tooltip={`${
                              formInputs.bloco
                                ? ""
                                : "Selecione primeiro o bloco!"
                            }`}
                            tooltipOptions={{
                              position: "bottom",
                              showOnDisabled: true,
                            }}
                            value={field.value}
                            onChange={(e: DropdownChangeEvent) => {
                              field.onChange(e.value);
                              setFormInputs({
                                ...formInputs,
                                idUnidade: e.value,
                              });
                            }}
                          />
                        )}
                      />
                      {getFormErrorMessage("idUnidade")}
                    </div>
                    {/* PROPRIETRIO */}
                    <div className="field col-12 md:col-6">
                      <label htmlFor="proprietario">É proprietário?</label>
                      <div>
                        <Controller
                          name="proprietario"
                          control={control}
                          defaultValue={formInputs.proprietario}
                          render={({ field, fieldState }) => (
                            <InputSwitch
                              id="proprietario"
                              className={classNames("p-inputtext-sm", {
                                "p-invalid": fieldState.error,
                              })}
                              checked={field.value}
                              onChange={(e: InputSwitchChangeEvent) => {
                                field.onChange(e.value);
                                setFormInputs({
                                  ...formInputs,
                                  proprietario: e.value ?? false,
                                });
                              }}
                              disabled={isReadOnly}
                            />
                          )}
                        />
                      </div>
                      {getFormErrorMessage("proprietario")}
                    </div>
                    {/* FOTO */}
                    <div className="field col-12">
                      <Controller
                        name="imagemPerfil"
                        control={control}
                        defaultValue={formInputs.imagemPerfil}
                        render={({ field }) => (
                          <PhotoUploader
                            label={`Foto${
                              isReadOnly
                                ? ""
                                : " (Clique na imagem para selecionar)"
                            }`}
                            disabled={isReadOnly}
                            selectedImage={condominoImage}
                            setSelectedImage={(imagePath: File | undefined) => {
                              field.onChange(imagePath);
                              setCondominoImage(imagePath);
                            }}
                          />
                        )}
                      />
                      {getFormErrorMessage("imagemPerfil")}
                    </div>
                    {/* OBSERVACOES */}
                    <div className="field col-12">
                      <label htmlFor="observacoes">Observações</label>
                      <Controller
                        name="observacao"
                        control={control}
                        defaultValue={formInputs.observacao}
                        render={({ field, fieldState }) => (
                          <InputTextarea
                            id="observacoes"
                            rows={4}
                            autoResize
                            pt={{
                              root: {
                                className: classNames("p-inputtext-sm w-full", {
                                  "p-invalid": fieldState.error,
                                }),
                              },
                            }}
                            value={field.value}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>,
                            ) => {
                              field.onChange(e.currentTarget.value);
                              setFormInputs({
                                ...formInputs,
                                observacao: e.currentTarget.value,
                              });
                            }}
                          />
                        )}
                      />
                      {getFormErrorMessage("observacao")}
                    </div>
                  </div>
                </div>
                <div className="flex align-items-center justify-content-end gap-2">
                  <Button label="Submit" type="submit" icon="pi pi-check" />
                  <Button
                    label="Resetar"
                    type="button"
                    severity="secondary"
                    icon="pi pi-refresh"
                    onClick={() => {
                      reset(initialFormState);
                      setCondominoImage(undefined);
                    }}
                  />
                  <Button
                    label="Cancelar"
                    type="button"
                    severity="danger"
                    icon="pi pi-times"
                    onClick={async () => {
                      await sleep(100).then(() => {
                        navigate("/condominos/list", { replace: true });
                      });
                    }}
                  />{" "}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
