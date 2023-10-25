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
import { initialFormState, type UnidadeFormInputs } from "./utils/form-hooks";
import { UnidadeService } from "libs/api/unidade-api.ts";
import { CondominioService } from "libs/api/condominio-api.ts";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";

interface AddEditUnidadeState {
  id: string | null;
  title?: string;
}

export function UnidadesAdd({ id, title }: AddEditUnidadeState) {
  const unidadeDataReducer = useDataReducer<UnidadeData>();
  const condominioDataReducer = useDataReducer<CondominioData>();

  const [formInputs, setFormInputs] =
    useState<UnidadeFormInputs>(initialFormState);

  const toast = useRef<Toast | null>(null);

  const [, navigate] = useLocation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnidadeFormInputs>({
    mode: "onChange",
    defaultValues: formInputs,
    values: formInputs,
  });

  const requiredFieldError = "Este campo é obrigatório.";

  const getFormErrorMessage = (name: keyof FieldErrors<UnidadeFormInputs>) => {
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

  const handleFormSubmit = (data: UnidadeFormInputs) => {
    console.log("Form Data:", data);

    const _unidade: UnidadeData = {
      id: unidadeDataReducer.state.data?.id,
      bloco: data.bloco,
      numero: data.numero,
      observacao: data.observacao,
      idCondominio: data.idCondominio,
    };

    try {
      console.log("onSubmit_unidade: ", JSON.stringify(_unidade, null, 4));

      UnidadeService.getInstance()
        .addUpdateUnidade(_unidade)
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
        navigate("/unidades/list", { replace: true });
      });
    }
  };

  useEffect(() => {
    const fetchUnidadeData = async () => {
      unidadeDataReducer.dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const response = id
          ? await UnidadeService.getInstance().getUnidadeById(id)
          : null;
        unidadeDataReducer.dispatch({
          type: "FETCH_DATA_SUCCESS",
          payload: response,
        });
      } catch (error) {
        unidadeDataReducer.dispatch({
          type: "FETCH_DATA_FAILURE",
          payload: `error fetching data: ${error}`,
        });
      }
    };

    fetchUnidadeData().then((r) => r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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

    fetchCondominioData().then((r) => r);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unidadeDataReducer.state.data]);

  // Load user image from URL (if available)
  useEffect(() => {
    // Populate form fields with condominoData when available
    if (unidadeDataReducer.state.data) {
      // setFormInputs(state.data);

      setFormInputs({
        bloco: unidadeDataReducer.state.data.bloco ?? "",
        numero: unidadeDataReducer.state.data.numero ?? "",
        observacao: unidadeDataReducer.state.data.observacao ?? undefined,
        idCondominio: unidadeDataReducer.state.data.idCondominio ?? undefined,
      });
    }
  }, [unidadeDataReducer.state.data]);

  return (
    <DefaultLayout title={title ?? `${id ? "Editar" : "Adicionar"} Condômino`}>
      <div className="card">
        <div>
          {unidadeDataReducer.state.loading ? (
            <p>Loading...</p>
          ) : unidadeDataReducer.state.error ? (
            <p>{unidadeDataReducer.state.error}</p>
          ) : (
            <div>
              <form id="form1" onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="pt-4">
                  <div className="formgrid grid">
                    {/* BLOCO */}
                    <div className="field col-12 md:col-6">
                      <label htmlFor="bloco">Bloco</label>
                      <span className="p-input-icon-left w-full">
                        <i className="pi pi-user" />
                        <Controller
                          name="bloco"
                          control={control}
                          defaultValue={formInputs.bloco}
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
                                  bloco: e.currentTarget.value,
                                });
                              }}
                            />
                          )}
                        />
                      </span>
                      {getFormErrorMessage("bloco")}
                    </div>
                    {/* E-MAIL */}
                    <div className="field col-12 md:col-6">
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
                    {/* CONDOMINIO */}
                    <div className="field col-12">
                      <label htmlFor="idCondominio">Condomínio</label>
                      <Controller
                        name="idCondominio"
                        control={control}
                        defaultValue={formInputs.idCondominio}
                        rules={{ required: requiredFieldError }}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                              id="idCondominio"
                              value={field.value}
                              options={condominioDataReducer.state.dataArray?.map(
                                (e) => {
                                  return {
                                    value: e.id,
                                    label: `${e.nome}: ${e.rua}, ${e.numero}. ${
                                      e.bairro
                                    }. ${e.cidade}, ${e.uf?.toUpperCase()}. ${
                                      e.pais
                                    }. CEP: ${e.cep}`,
                                  };
                                },
                              )}
                              optionLabel={"label"}
                              placeholder="Selecione o condomínio"
                              className={classNames("p-inputtext-sm w-full", {
                                "p-invalid": fieldState.error,
                              })}
                              emptyMessage={
                                !condominioDataReducer.state.dataArray
                                  ? "Sem resultados"
                                  : "Selecione o condomínio!"
                              }
                              onChange={(e: DropdownChangeEvent) => {
                                field.onChange(e.value);
                                setFormInputs({
                                  ...formInputs,
                                  idCondominio: e.value,
                                });
                              }}
                            />
                          </>
                        )}
                      />
                      {getFormErrorMessage("idCondominio")}
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
                    }}
                  />
                  <Button
                    label="Cancelar"
                    type="button"
                    severity="danger"
                    icon="pi pi-times"
                    onClick={async () => {
                      await sleep(100).then(() => {
                        navigate("/unidades/list", { replace: true });
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
