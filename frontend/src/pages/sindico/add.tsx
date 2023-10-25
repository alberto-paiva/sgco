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
import { initialFormState, type SindicoFormInputs } from "./utils/form-hooks";
import { FileUploadService } from "libs/api/file-upload-api.ts";
import { SindicoService } from "libs/api/sindico-api.ts";
import { EnderecoService } from "libs/api/endereco-api.ts";
import { CondominioService } from "libs/api/condominio-api.ts";
import AuthService from "@/services/auth.service.ts";

interface AddEditSindicoProps {
  id: string | null;
  title?: string;
}

export function SindicosAdd({ id, title }: AddEditSindicoProps) {
  const sindicoDataReducer = useDataReducer<SindicoData>();
  const condominioDataReducer = useDataReducer<CondominioData>();
  const enderecoFormatadoDataReducer = useDataReducer<EnderecoFormatadoData>();

  // State for user image
  const [sindicoImage, setSindicoImage] = useState<File | undefined>();

  const [formInputs, setFormInputs] =
    useState<SindicoFormInputs>(initialFormState);

  const toast = useRef<Toast | null>(null);

  const [, navigate] = useLocation();

  const isReadOnly = AuthService.userIsCondomino();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SindicoFormInputs>({
    mode: "onChange",
    defaultValues: formInputs,
    values: formInputs,
  });

  const requiredFieldError = "Este campo é obrigatório.";

  const getFormErrorMessage = (name: keyof FieldErrors<SindicoFormInputs>) => {
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

  const handleFormSubmit = (data: SindicoFormInputs) => {
    console.log("Form Data:", data);

    const verifiedUuid = formInputs.uuid ?? generateUUID();

    const _sindico: SindicoData = {
      id: sindicoDataReducer.state.data?.id,
      uuid: verifiedUuid,
      nome: data.nome,
      email: data.email,
      cpf: data.cpf,
      contato: data.contato,
      dataEntrada: formatDate(data.dataEntrada),
      dataSaida: data.dataSaida ? formatDate(data.dataSaida) : undefined,
      observacao: data.observacao,
      tipo: data?.tipo,
      ativo: data.ativo,
      idCondominio: data.idCondominio,
      idEndereco: data.idEndereco,
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

          _sindico.imagemPerfil = myRenamedFile.name;

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

      console.log("onSubmit_sindico: ", JSON.stringify(_sindico, null, 4));

      SindicoService.getInstance()
        .addUpdateSindico(_sindico)
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
        navigate("/sindicos/list", { replace: true });
      });
    }
  };

  useEffect(() => {
    const fetchSindicoData = async () => {
      sindicoDataReducer.dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response = id
          ? await SindicoService.getInstance().getSindicoById(id)
          : null;
        sindicoDataReducer.dispatch({
          type: "FETCH_DATA_SUCCESS",
          payload: response,
        });
      } catch (error) {
        sindicoDataReducer.dispatch({
          type: "FETCH_DATA_FAILURE",
          payload: `error fetching data: ${error}`,
        });
      }
    };

    const fetchCondominioData = async () => {
      condominioDataReducer.dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response =
          await CondominioService.getInstance().getAllCondominios();
        condominioDataReducer.dispatch({
          type: "FETCH_DATA_ARRAY_SUCCESS",
          payload: response,
        });
      } catch (error) {
        condominioDataReducer.dispatch({
          type: "FETCH_DATA_FAILURE",
          payload: `error fetching data: ${error}`,
        });
      }
    };

    const fetchEnderecoFormatadoData = async () => {
      enderecoFormatadoDataReducer.dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response =
          await EnderecoService.getInstance().getEnderecoFormatado();
        enderecoFormatadoDataReducer.dispatch({
          type: "FETCH_DATA_ARRAY_SUCCESS",
          payload: response,
        });
      } catch (error) {
        enderecoFormatadoDataReducer.dispatch({
          type: "FETCH_DATA_FAILURE",
          payload: `error fetching data: ${error}`,
        });
      }
    };

    fetchSindicoData().then((r) => r);
    fetchCondominioData().then((r) => r);
    fetchEnderecoFormatadoData().then((r) => r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load user image from URL (if available)
  useEffect(() => {
    const makeProfileImage = async () => {
      const sindicoProfileImage = sindicoDataReducer.state.data?.imagemPerfil;

      if (sindicoProfileImage) {
        try {
          const foto = await createFileFromUrl(
            `${IMAGE_UPLOAD_BASE_URL}${sindicoDataReducer.state.data?.uuid}/${sindicoProfileImage}`,
          );
          setSindicoImage(foto);
        } catch (error) {
          console.error("Error loading sindico image:", error);
        }
      }
    };

    // Populate form fields with condominoData when available
    if (sindicoDataReducer.state.data) {
      makeProfileImage().then((r) => r);

      setFormInputs({
        uuid: sindicoDataReducer.state.data.uuid ?? generateUUID(),
        nome: sindicoDataReducer.state.data.nome || "",
        email: sindicoDataReducer.state.data.email ?? undefined,
        cpf: sindicoDataReducer.state.data.cpf ?? undefined,
        contato: sindicoDataReducer.state.data.contato || "",
        dataEntrada: sindicoDataReducer.state.data.dataEntrada
          ? formatDate(sindicoDataReducer.state.data.dataEntrada, "DD/MM/YYYY")
          : "",
        dataSaida: sindicoDataReducer.state.data.dataSaida
          ? formatDate(sindicoDataReducer.state.data.dataSaida, "DD/MM/YYYY")
          : undefined,
        imagemPerfil: sindicoDataReducer.state.data.imagemPerfil ?? undefined,
        observacao: sindicoDataReducer.state.data.observacao ?? "",
        tipo: "S",
        ativo: sindicoDataReducer.state.data.ativo || false,
        idCondominio: sindicoDataReducer.state.data.idCondominio ?? undefined,
        idEndereco: sindicoDataReducer.state.data.idEndereco ?? undefined,
      });
    }
  }, [sindicoDataReducer.state.data]);

  return (
    <DefaultLayout title={title ?? `${id ? "Editar" : "Adicionar"} Condômino`}>
      <div className="card">
        <div>
          {sindicoDataReducer.state.loading ? (
            <p>Loading...</p>
          ) : sindicoDataReducer.state.error ? (
            <p>{sindicoDataReducer.state.error}</p>
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
                                e.preventDefault();
                                field.onChange(e.currentTarget.value);
                              }}
                              readOnly={isReadOnly}
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
                                e.preventDefault();
                                field.onChange(e.currentTarget.value);
                              }}
                              readOnly={isReadOnly}
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
                                e.preventDefault();
                                field.onChange(e.currentTarget.value);
                              }}
                              readOnly={isReadOnly}
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
                            pattern: {
                              value: /^[0-9]{10,11}$/,
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
                                e.preventDefault();
                                field.onChange(e.currentTarget.value);
                              }}
                              readOnly={isReadOnly}
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
                                e.preventDefault();
                                field.onChange(e.currentTarget.value);
                              }}
                              readOnly={isReadOnly}
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
                                e.preventDefault();
                                field.onChange(e.currentTarget.value);
                              }}
                              readOnly={isReadOnly}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("dataSaida")}
                    </div>
                    {/* CONDOMINIO */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="bloco">Condomínio</label>
                      <Controller
                        name="idCondominio"
                        control={control}
                        defaultValue={formInputs.idCondominio}
                        rules={{ required: requiredFieldError }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            id="idCondominio"
                            options={condominioDataReducer.state.dataArray?.map(
                              (e) => {
                                return { value: e.id, label: e.nome };
                              },
                            )}
                            optionLabel="label"
                            placeholder="Selecione"
                            className={classNames("p-inputtext-sm w-full", {
                              "p-invalid": fieldState.error,
                            })}
                            emptyMessage={
                              !condominioDataReducer.state.dataArray
                                ? "Sem resultados"
                                : "Selecione o condomínio!"
                            }
                            value={field.value}
                            onChange={(e: DropdownChangeEvent) => {
                              e.preventDefault();
                              field.onChange(e.value);
                            }}
                            disabled={isReadOnly}
                          />
                        )}
                      />
                      {getFormErrorMessage("idCondominio")}
                    </div>
                    {/* ENDERECO */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="idEndereco">Endereço</label>
                      <Controller
                        name="idEndereco"
                        control={control}
                        defaultValue={formInputs.idEndereco}
                        rules={{ required: requiredFieldError }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            id="idEndereco"
                            options={enderecoFormatadoDataReducer.state.dataArray?.map(
                              (e) => {
                                return { value: e.id, label: e.endereco };
                              },
                            )}
                            defaultValue={field.value}
                            optionLabel="label"
                            placeholder="Selecione"
                            className={classNames("p-inputtext-sm w-full", {
                              "p-invalid": fieldState.error,
                            })}
                            emptyMessage={
                              !enderecoFormatadoDataReducer.state.dataArray
                                ?.length
                                ? `Sem resultados`
                                : "Selecione o endereço!"
                            }
                            value={field.value}
                            onChange={(e: DropdownChangeEvent) => {
                              e.preventDefault();
                              field.onChange(e.value);
                            }}
                            disabled={isReadOnly}
                          />
                        )}
                      />
                      {getFormErrorMessage("idEndereco")}
                    </div>
                    {/* ATIVO */}
                    <div className="field col-12 md:col-6">
                      <label htmlFor="ativo">Está ativo?</label>
                      <div>
                        <Controller
                          name="ativo"
                          control={control}
                          defaultValue={formInputs.ativo}
                          render={({ field, fieldState }) => (
                            <InputSwitch
                              id="ativo"
                              className={classNames("p-inputtext-sm", {
                                "p-invalid": fieldState.error,
                              })}
                              checked={field.value}
                              onChange={(e: InputSwitchChangeEvent) => {
                                e.preventDefault();
                                field.onChange(e.value);
                              }}
                              disabled={isReadOnly}
                            />
                          )}
                        />
                      </div>
                      {getFormErrorMessage("ativo")}
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
                            selectedImage={sindicoImage}
                            setSelectedImage={(imagePath: File | undefined) => {
                              field.onChange(imagePath);
                              setSindicoImage(imagePath);
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
                              e.preventDefault();
                              field.onChange(e.currentTarget.value);
                            }}
                            readOnly={isReadOnly}
                          />
                        )}
                      />
                      {getFormErrorMessage("observacao")}
                    </div>
                  </div>
                </div>
                <div className="flex align-items-center justify-content-end gap-2">
                  {AuthService.userIsCondomino() ? (
                    <>
                      {" "}
                      <Button
                        label="Retornar"
                        type="button"
                        severity="success"
                        icon="pi pi-arrow-left"
                        onClick={async () => {
                          await sleep(100).then(() => {
                            navigate("/condominios/list", { replace: true });
                          });
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Button label="Submit" type="submit" icon="pi pi-check" />
                      <Button
                        label="Resetar"
                        type="button"
                        severity="secondary"
                        icon="pi pi-refresh"
                        onClick={() => {
                          reset(initialFormState);
                          setSindicoImage(undefined);
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
                    </>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
