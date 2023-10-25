// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT
import { DefaultLayout } from "@/layouts/DefaultLayout";
import {
  formatDate,
  generateUUID,
  IMAGE_UPLOAD_BASE_URL,
  randomString,
  sleep,
} from "@/libs/utils";
import { useDataReducer } from "libs/data-utils.ts";
import { createFileFromUrl, fileExistsOnServer } from "libs/file-utils.ts";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { type Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import { useLocation } from "wouter";
import {
  type CondominioFormInputs,
  initialFormState,
} from "./utils/form-hooks";
import { FileUploadService } from "libs/api/file-upload-api.ts";
import { CondominioService } from "libs/api/condominio-api.ts";
import { EnderecoService } from "libs/api/endereco-api.ts";
import { validCNPJ } from "libs/valid-cnpj.ts";
import { InputMask } from "primereact/inputmask";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import PhotoUploader from "components/PhotoUploader/PhotoUploader.tsx";
import { InputTextarea } from "primereact/inputtextarea";
import AuthService from "@/services/auth.service.ts";

interface AddEditCondominioState {
  id: string | null;
  title?: string;
}

export function CondominiosAdd({ id, title }: AddEditCondominioState) {
  const condominioDataReducer = useDataReducer<CondominioData>();
  const enderecosDataReducer = useDataReducer<EnderecoData>();

  // State for user image
  const [condominioImage, setCondominioImage] = useState<File | undefined>();

  const [formInputs, setFormInputs] =
    useState<CondominioFormInputs>(initialFormState);

  const toast = useRef<Toast | null>(null);

  const [, navigate] = useLocation();

  const isReadOnly = AuthService.userIsCondomino();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CondominioFormInputs>({
    mode: "onChange",
    defaultValues: formInputs,
    values: formInputs,
  });

  const requiredFieldError = "Este campo é obrigatório.";

  const getFormErrorMessage = (
    name: keyof FieldErrors<CondominioFormInputs>,
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

  // const handleFormSubmit2 = (data: CondominioFormInputs) => {
  //   console.log("Form Data:", data);
  //   if (data.idEndereco && data.idEndereco > 9999999999999) {
  //     handleFormSubmit(data);
  //   }
  // };

  const handleFormSubmit = (data: CondominioFormInputs) => {
    console.log("Form Data:", data);

    const verifiedUuid = formInputs.uuid ?? generateUUID();

    const _condominio: CondominioData = {
      id: condominioDataReducer.state.data?.id,
      uuid: verifiedUuid,
      nome: data.nome,
      email: data.email,
      cnpj: data.cnpj,
      contato: data.contato,
      dataAbertura: data.dataAbertura
        ? formatDate(data.dataAbertura)
        : undefined,
      dataEncerramento: data.dataEncerramento
        ? formatDate(data.dataEncerramento)
        : undefined,
      observacao: data.observacao,
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

          _condominio.imagemPerfil = myRenamedFile.name;

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

      console.log(
        "onSubmit_condominio: ",
        JSON.stringify(_condominio, null, 4),
      );

      CondominioService.getInstance()
        .addUpdateCondominio(_condominio)
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
        navigate("/condominios/list", { replace: true });
      });
    }
  };

  useEffect(() => {
    const fetchCondominioData = async () => {
      condominioDataReducer.dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response = id
          ? await CondominioService.getInstance().getCondominioById(id)
          : null;
        condominioDataReducer.dispatch({
          type: "FETCH_DATA_SUCCESS",
          payload: response,
        });
      } catch (error) {
        condominioDataReducer.dispatch({
          type: "FETCH_DATA_FAILURE",
          payload: `error fetching data: ${error}`,
        });
      }
    };

    fetchCondominioData().then((r) => r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchEnderecoData = async () => {
      enderecosDataReducer.dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response = await EnderecoService.getInstance().getAllEnderecos();
        enderecosDataReducer.dispatch({
          type: "FETCH_DATA_ARRAY_SUCCESS",
          payload: response,
        });
      } catch (error) {
        enderecosDataReducer.dispatch({
          type: "FETCH_DATA_FAILURE",
          payload: `error fetching data: ${error}`,
        });
      }
    };

    fetchEnderecoData().then((r) => r);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condominioDataReducer.state.data]);

  // Load user image from URL (if available)
  useEffect(() => {
    const makeProfileImage = async () => {
      const userProfileImage = condominioDataReducer.state.data?.imagemPerfil;

      if (userProfileImage) {
        try {
          const foto = await createFileFromUrl(
            `${IMAGE_UPLOAD_BASE_URL}${condominioDataReducer.state.data?.uuid}/${userProfileImage}`,
          );
          setCondominioImage(foto);
        } catch (error) {
          console.error("Error loading user image:", error);
        }
      }
    };

    // Populate form fields with condominoData when available
    if (condominioDataReducer.state.data) {
      // setFormInputs(state.data);
      makeProfileImage().then((r) => r);

      setFormInputs({
        uuid: condominioDataReducer.state.data.uuid ?? generateUUID(),
        nome: condominioDataReducer.state.data.nome || "",
        email: condominioDataReducer.state.data.email ?? undefined,
        cnpj: condominioDataReducer.state.data.cnpj ?? undefined,
        contato: condominioDataReducer.state.data.contato,
        dataAbertura: condominioDataReducer.state.data.dataAbertura
          ? formatDate(
              condominioDataReducer.state.data.dataAbertura,
              "DD/MM/YYYY",
            )
          : "",
        dataEncerramento: condominioDataReducer.state.data.dataEncerramento
          ? formatDate(
              condominioDataReducer.state.data.dataEncerramento,
              "DD/MM/YYYY",
            )
          : undefined,
        imagemPerfil:
          condominioDataReducer.state.data.imagemPerfil ?? undefined,
        observacao: condominioDataReducer.state.data.observacao ?? "",
        idEndereco: condominioDataReducer.state.data.idEndereco ?? undefined,
        rua: condominioDataReducer.state.data.rua ?? undefined,
        numero: condominioDataReducer.state.data.numero ?? undefined,
        complemento: condominioDataReducer.state.data.complemento ?? undefined,
        bairro: condominioDataReducer.state.data.bairro ?? undefined,
        cidade: condominioDataReducer.state.data.cidade ?? undefined,
        uf: condominioDataReducer.state.data.uf ?? undefined,
        cep: condominioDataReducer.state.data.cep ?? undefined,
        pais: condominioDataReducer.state.data.pais ?? undefined,
      });
    }
  }, [condominioDataReducer.state.data]);

  return (
    <DefaultLayout title={title ?? `${id ? "Editar" : "Adicionar"} Condômino`}>
      <div className="card">
        <div>
          {condominioDataReducer.state.loading ? (
            <p>Loading...</p>
          ) : condominioDataReducer.state.error ? (
            <p>{condominioDataReducer.state.error}</p>
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
                              readOnly={isReadOnly}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("email")}
                    </div>
                    {/* CNPJ */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="cpf">CNPJ</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-id-card" />
                        <Controller
                          name="cnpj"
                          control={control}
                          defaultValue={formInputs.cnpj}
                          rules={{
                            validate: (value) =>
                              (value ? validCNPJ(value) : true) ||
                              "CNPJ inválido",
                          }}
                          render={({ field, fieldState }) => (
                            <InputMask
                              {...field}
                              id="cnpj"
                              mask="99.999.999/9999-99"
                              placeholder="00.000.000/0000-00"
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
                                  cnpj: e.currentTarget.value,
                                });
                              }}
                              readOnly={isReadOnly}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("cnpj")}
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
                              readOnly={isReadOnly}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("contato")}
                    </div>
                    {/* DATA ABERTURA */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="dataAbertura">Data Abertura</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-calendar" />
                        <Controller
                          name="dataAbertura"
                          control={control}
                          defaultValue={formInputs.dataAbertura}
                          rules={{
                            // required: requiredFieldError,
                            pattern: {
                              value:
                                /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, // DD/MM/YYYY
                              message: "Formato de data inválido",
                            },
                          }}
                          render={({ field, fieldState }) => (
                            <InputMask
                              {...field}
                              id="dataAbertura"
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
                                  dataAbertura: e.currentTarget.value,
                                });
                              }}
                              readOnly={isReadOnly}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("dataAbertura")}
                    </div>
                    {/* DATA ENCERRAMENTO */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="dataEncerramento">
                        Data Encerramento
                      </label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-calendar" />
                        <Controller
                          name="dataEncerramento"
                          control={control}
                          defaultValue={formInputs.dataEncerramento}
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
                              id="dataEncerramento"
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
                                  dataEncerramento: e.currentTarget.value,
                                });
                              }}
                              readOnly={isReadOnly}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("dataEncerramento")}
                    </div>
                    {/* ENDERECO */}
                    <div className="field col-12">
                      <label htmlFor="idEndereco">Endereço</label>
                      <Controller
                        name="idEndereco"
                        control={control}
                        defaultValue={formInputs.idEndereco}
                        rules={{ required: requiredFieldError }}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                              id="idEndereco"
                              value={field.value}
                              options={enderecosDataReducer.state.dataArray?.map(
                                (e) => {
                                  return {
                                    value: e.id,
                                    label: `${e.rua}, ${e.numero}${
                                      e.complemento
                                        ? `. (${e.complemento}). `
                                        : ""
                                    } ${e.bairro}. ${
                                      e.cidade
                                    }, ${e.uf?.toUpperCase()}. ${
                                      e.pais
                                    }. CEP: ${e.cep}`,
                                  };
                                },
                              )}
                              optionLabel={"label"}
                              placeholder="Selecione o endereço"
                              className={classNames("p-inputtext-sm w-full", {
                                "p-invalid": fieldState.error,
                              })}
                              emptyMessage={
                                !enderecosDataReducer.state.dataArray
                                  ? "Sem resultados"
                                  : "Selecione o endereço!"
                              }
                              onChange={(e: DropdownChangeEvent) => {
                                field.onChange(e.value);
                                setFormInputs({
                                  ...formInputs,
                                  idEndereco: e.value,
                                });
                              }}
                              readOnly={isReadOnly}
                              disabled={isReadOnly}
                            />
                          </>
                        )}
                      />
                      {getFormErrorMessage("idEndereco")}
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
                            selectedImage={condominioImage}
                            setSelectedImage={(imagePath: File | undefined) => {
                              field.onChange(imagePath);
                              setCondominioImage(imagePath);
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
                          setCondominioImage(undefined);
                        }}
                      />
                      <Button
                        label="Cancelar"
                        type="button"
                        severity="danger"
                        icon="pi pi-times"
                        onClick={async () => {
                          await sleep(100).then(() => {
                            navigate("/condominios/list", { replace: true });
                          });
                        }}
                      />
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
