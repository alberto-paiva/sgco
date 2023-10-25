// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT
import { DefaultLayout } from "@/layouts/DefaultLayout";
import { sleep } from "@/libs/utils";
import { useDataReducer } from "libs/data-utils.ts";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { type Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { type EnderecoFormInputs, initialFormState } from "./utils/form-hooks";
import { EnderecoService } from "libs/api/endereco-api.ts";
import { CEPService } from "libs/api/cep-api.ts";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { getUFKeys } from "libs/braziliam-ufs.ts";

interface AddEditEnderecoState {
  id: string | null;
  title?: string;
}

export function EnderecosAdd({ id, title }: AddEditEnderecoState) {
  const enderecosDataReducer = useDataReducer<EnderecoData>();

  const [formInputs, setFormInputs] =
    useState<EnderecoFormInputs>(initialFormState);

  const toast = useRef<Toast | null>(null);

  const [, navigate] = useLocation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnderecoFormInputs>({
    mode: "onChange",
    defaultValues: formInputs,
    values: formInputs,
  });

  const requiredFieldError = "Este campo é obrigatório.";

  const getFormErrorMessage = (name: keyof FieldErrors<EnderecoFormInputs>) => {
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

  const handleFormSubmit = (data: EnderecoFormInputs) => {
    console.log("Form Data:", data);

    const _endereco: EnderecoData = {
      id: enderecosDataReducer.state.data?.id,
      rua: data?.rua,
      numero: data?.numero,
      complemento: data?.complemento,
      bairro: data?.bairro,
      cidade: data?.cidade,
      uf: data?.uf,
      cep: data?.cep,
      pais: data?.pais,
    };

    try {
      console.log("onSubmit_condominio: ", JSON.stringify(_endereco, null, 4));

      EnderecoService.getInstance()
        .addUpdateEndereco(_endereco)
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
        navigate("/enderecos/list", { replace: true });
      });
    }
  };

  useEffect(() => {
    const fetchEnderecoData = async () => {
      enderecosDataReducer.dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response = await EnderecoService.getInstance().getEnderecoByID(
          id ?? "",
        );
        enderecosDataReducer.dispatch({
          type: "FETCH_DATA_SUCCESS",
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
  }, []);

  const getCEPFromApi = (cep?: string) => {
    try {
      CEPService.getInstance()
        .getCep(cep ?? "")
        .then((data) => {
          setFormInputs({
            ...formInputs,
            rua: data?.logradouro ?? formInputs.rua,
            complemento: data?.complemento
              ? data?.complemento + " | " + formInputs.complemento
              : formInputs.complemento,
            bairro: data?.bairro ?? formInputs.bairro,
            cidade: data?.localidade ?? formInputs.cidade,
            uf: data?.uf ?? formInputs.uf,
          });
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // Populate form fields with enderecoData when available
    if (enderecosDataReducer.state.data) {
      setFormInputs({
        rua: enderecosDataReducer.state.data.rua ?? undefined,
        numero: enderecosDataReducer.state.data.numero ?? undefined,
        complemento: enderecosDataReducer.state.data.complemento ?? undefined,
        bairro: enderecosDataReducer.state.data.bairro ?? undefined,
        cidade: enderecosDataReducer.state.data.cidade ?? undefined,
        uf: enderecosDataReducer.state.data.uf ?? undefined,
        cep: enderecosDataReducer.state.data.cep ?? undefined,
        pais: enderecosDataReducer.state.data.pais ?? undefined,
      });
      // setSelectedCEP(enderecosDataReducer.state.data.cep);
    }
  }, [enderecosDataReducer.state.data]);

  return (
    <DefaultLayout title={title ?? `${id ? "Editar" : "Adicionar"} Condômino`}>
      <div className="card">
        <div>
          {enderecosDataReducer.state.loading ? (
            <p>Loading...</p>
          ) : enderecosDataReducer.state.error ? (
            <p>{enderecosDataReducer.state.error}</p>
          ) : (
            <div>
              <form id="form1" onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="pt-4">
                  <div className="formgrid grid">
                    {/* RUA */}
                    <div className="field col-12 md:col-4">
                      <label htmlFor="rua">Rua</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-user" />
                        <Controller
                          name="rua"
                          control={control}
                          defaultValue={formInputs.rua}
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
                                  rua: e.currentTarget.value,
                                });
                              }}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("rua")}
                    </div>
                    {/* NUMERO */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="numero">Número</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-at" />
                        <Controller
                          name="numero"
                          control={control}
                          defaultValue={formInputs.numero}
                          rules={{ required: requiredFieldError }}
                          render={({ field, fieldState }) => (
                            <InputText
                              {...field}
                              id="numero"
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
                                  numero: e.currentTarget.value,
                                });
                              }}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("numero")}
                    </div>
                    {/* COMPLEMENTO */}
                    <div className="field col-12 md:col-4">
                      <label htmlFor="complemento">Complemento</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-id-card" />
                        <Controller
                          name="complemento"
                          control={control}
                          defaultValue={formInputs.complemento}
                          render={({ field, fieldState }) => (
                            <InputText
                              {...field}
                              id="complemento"
                              type="text"
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
                                  complemento: e.currentTarget.value,
                                });
                              }}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("complemento")}
                    </div>
                    {/* BAIRRO */}
                    <div className="field col-12 md:col-4">
                      <label htmlFor="bairro">Bairro</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-phone" />
                        <Controller
                          name="bairro"
                          control={control}
                          defaultValue={formInputs.bairro}
                          rules={{ required: requiredFieldError }}
                          render={({ field, fieldState }) => (
                            <InputText
                              {...field}
                              id="bairro"
                              type="text"
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
                                  bairro: e.currentTarget.value,
                                });
                              }}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("bairro")}
                    </div>
                    {/* MUNICIPIO */}
                    <div className="field col-12 md:col-4">
                      <label htmlFor="cidade">Município</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-calendar" />
                        <Controller
                          name="cidade"
                          control={control}
                          defaultValue={formInputs.cidade}
                          rules={{ required: requiredFieldError }}
                          render={({ field, fieldState }) => (
                            <InputText
                              {...field}
                              id="cidade"
                              type={"text"}
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
                                  cidade: e.currentTarget.value,
                                });
                              }}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("cidade")}
                    </div>
                    {/* UF */}
                    <div className="field col-12 md:col-3">
                      <label htmlFor="uf">UF</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-calendar" />
                        <Controller
                          name="uf"
                          control={control}
                          render={({ field, fieldState }) => (
                            <>
                              <Dropdown
                                id="uf"
                                value={field.value}
                                options={getUFKeys()}
                                optionLabel={""}
                                placeholder="Selecione o estado"
                                className={classNames("p-inputtext-sm w-full", {
                                  "p-invalid": fieldState.error,
                                })}
                                emptyMessage={
                                  !getUFKeys()
                                    ? "Sem resultados"
                                    : "Selecione o estado!"
                                }
                                onChange={(e: DropdownChangeEvent) => {
                                  field.onChange(e.value);
                                  setFormInputs({
                                    ...formInputs,
                                    uf: e.value,
                                  });
                                }}
                              />
                            </>
                          )}
                        />
                      </span>
                      {getFormErrorMessage("uf")}
                    </div>
                    {/* CEP */}
                    <div className="field col-12 md:col-4">
                      <label htmlFor="cep">CEP</label>
                      <div className="p-inputgroup flex-1">
                        <Controller
                          name="cep"
                          control={control}
                          defaultValue={formInputs.cep}
                          // rules={{ required: requiredFieldError }}
                          render={({ field, fieldState }) => (
                            <>
                              <InputText
                                {...field}
                                id="cep"
                                type={"text"}
                                value={field.value}
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
                                  field.onChange(e.currentTarget.value);
                                  setFormInputs({
                                    ...formInputs,
                                    cep: e.currentTarget.value,
                                  });
                                }}
                                onBlur={(
                                  e: React.FocusEvent<HTMLInputElement>,
                                ) => {
                                  e.preventDefault();
                                  getCEPFromApi(formInputs.cep);
                                }}
                              />
                              <Button
                                icon="pi pi-search"
                                className="p-button-warning"
                                onClick={(
                                  e: React.MouseEvent<HTMLButtonElement>,
                                ) => {
                                  e.preventDefault();
                                  getCEPFromApi(formInputs.cep);
                                }}
                              />
                            </>
                          )}
                        />
                      </div>
                      {getFormErrorMessage("cep")}
                    </div>
                    {/* PAIS */}
                    {/* TODO: MAKE CEP INTERNET AUTOFILL HERE! */}
                    <div className="field col-12 md:col-4">
                      <label htmlFor="pais">País</label>
                      <Controller
                        name="pais"
                        control={control}
                        defaultValue={formInputs.pais}
                        render={({ field, fieldState }) => (
                          <InputText
                            {...field}
                            id="pais"
                            type={"text"}
                            value={field.value}
                            pt={{
                              root: {
                                className: classNames("p-inputtext-sm w-full", {
                                  "p-invalid": fieldState.error,
                                }),
                              },
                            }}
                            onInput={(e: React.FormEvent<HTMLInputElement>) => {
                              field.onChange(e.currentTarget.value);
                              setFormInputs({
                                ...formInputs,
                                pais: e.currentTarget.value,
                              });
                            }}
                          />
                        )}
                      />
                      {getFormErrorMessage("pais")}
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
                    }}
                  />
                  <Button
                    label="Cancelar"
                    type="button"
                    severity="danger"
                    icon="pi pi-times"
                    onClick={async () => {
                      await sleep(100).then(() => {
                        navigate("/enderecos/list", { replace: true });
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
