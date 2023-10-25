import { useEffect, useRef, useState } from "react";
import { FinanceiroService } from "libs/api/financeiro-api.ts";
import { useDataReducer } from "libs/data-utils.ts";
import { DefaultLayout } from "layouts/DefaultLayout.tsx";
import { Button } from "primereact/button";
import { useReactToPrint } from "react-to-print";
import { generateUUID, getCurrentYear, makeYearArray } from "libs/utils.ts";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import jscrudapi from "js-crud-api";
import AuthService, { API_URL, UsuarioField } from "@/services/auth.service.ts";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";

export const FinanceiroReport = () => {
  const { state, dispatch } = useDataReducer<FinanceiroData>();

  const [financeiros, setFinanceiros] = useState<FinanceiroData[]>([]);
  const [unidades, setUnidades] = useState<UnidadeData[]>([]);

  const [anoCalendario, setAnoCalendario] = useState<string>();

  const componentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        const unidadeID = AuthService.getCurrentUserField(
          UsuarioField.IdUnidade,
        );

        let response: FinanceiroData[] = [];

        if (AuthService.userIsCondomino()) {
          if (unidadeID) {
            response =
              await FinanceiroService.getInstance().getFinanceiroByUnidade(
                unidadeID as number,
                anoCalendario,
              );
          }
        } else if (!AuthService.userIsCondomino()) {
          response =
            await FinanceiroService.getInstance().getAllFinanceiroData(
              anoCalendario,
            );
        } else {
          response = [];
        }

        dispatch({ type: "FETCH_DATA_ARRAY_SUCCESS", payload: response });
      } catch (error) {
        dispatch({
          type: "FETCH_DATA_FAILURE",
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          payload: "error fetching data: " + error,
        });
      }
    };
    fetchData().then((r) => r);
  }, [anoCalendario]);

  useEffect(() => {
    setFinanceiros(state.dataArray ?? []);
  }, [financeiros, state]);

  useEffect(() => {
    const jca = jscrudapi<UnidadeData>(API_URL);
    const getUnidades = async () => {
      const response = await jca.list("unidadescompletas");
      setUnidades(response.records);
    };

    getUnidades().then((r) => r);
  }, []);

  useEffect(() => {
    setAnoCalendario(getCurrentYear());
  }, []);

  const makeUnidadeLabelById = (id?: number) => {
    let unidade = null;
    for (let i = 0; i < unidades?.length; i++) {
      if (unidades[i].id === id) {
        unidade = unidades[i];
        break;
      }
    }
    return unidade
      ? `${unidade?.nomeCondominio}. Bl.${unidade?.numero} - Ap.${unidade?.bloco}`
      : "";
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "RelatórioFinanceiro.pdf",
    copyStyles: true,
    onAfterPrint: () => {
      console.log("Printed PDF successfully!");
    },
  });

  return (
    <>
      <DefaultLayout>
        <div className="card md:justify-content-start md:align-items-center">
          <h5 className="m-0">Ano Calendário {anoCalendario}</h5>
          <hr />
          <div>
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
          </div>
        </div>
        <div ref={componentRef} style={{ width: "100%", height: "100%" }}>
          <div>
            {financeiros.length ? (
              <div className="ml-4 mr-4 ">
                <div className="formgrid grid">
                  {financeiros?.map((f) => {
                    return (
                      <>
                        <section
                          key={generateUUID()}
                          className="card noborder mt-2"
                        >
                          {/* TITULO */}
                          <div className="field col-12">
                            <label htmlFor="titulo">Título</label>
                            <InputText
                              id="titulo"
                              type="text"
                              value={f.titulo}
                              readOnly
                              pt={{
                                root: {
                                  className: classNames(
                                    "p-inputtext-sm",
                                    "w-full",
                                  ),
                                },
                              }}
                            />
                          </div>
                          {/* */}
                          <div className="field col-12">
                            <div className="formgrid grid">
                              {/* VALOR */}
                              <div className="col-6">
                                <label htmlFor="valor">Valor</label>
                                <InputNumber
                                  id="valor"
                                  value={f.valor}
                                  mode="currency"
                                  currency="BRL"
                                  locale="pt-BR"
                                  minFractionDigits={2}
                                  readOnly
                                  pt={{
                                    root: {
                                      className: classNames(
                                        "p-inputtext-sm",
                                        "w-full",
                                      ),
                                    },
                                  }}
                                />
                              </div>
                              {/* DATA VENCIMENTO */}
                              <div className="col-3">
                                <label htmlFor="dataVencimento">
                                  Vencimento
                                </label>

                                <Calendar
                                  id="dataVencimento"
                                  value={new Date(Date.parse(f.dataVencimento))}
                                  mask="99/99/9999"
                                  placeholder="DD/MM/YYYY"
                                  dateFormat="dd/mm/yy"
                                  locale="pt"
                                  readOnlyInput
                                  disabled
                                  pt={{
                                    input: {
                                      root: {
                                        className: classNames(
                                          "p-inputtext-sm",
                                          "w-full",
                                        ),
                                      },
                                    },
                                  }}
                                />
                              </div>
                              {/* DATA PAGAMENTO */}
                              <div className="col-3">
                                <label htmlFor="dataPagamento">Pagamento</label>
                                <Calendar
                                  id="dataPagamento"
                                  value={
                                    f.dataPagamento
                                      ? new Date(Date.parse(f.dataPagamento))
                                      : undefined
                                  }
                                  mask="99/99/9999"
                                  placeholder="DD/MM/YYYY"
                                  dateFormat="dd/mm/yy"
                                  locale="pt"
                                  readOnlyInput
                                  disabled
                                  pt={{
                                    input: {
                                      root: {
                                        className: classNames(
                                          "p-inputtext-sm",
                                          "w-full",
                                        ),
                                      },
                                    },
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          {/* STATUS/TIPO */}
                          <div className="field col-12">
                            <div className="formgrid grid">
                              {/* TIPO */}
                              <div className="col-6">
                                <label htmlFor="tipo">Tipo</label>
                                <InputText
                                  id="tipo"
                                  type="text"
                                  value={f.tipo}
                                  readOnly
                                  pt={{
                                    root: {
                                      className: classNames(
                                        "p-inputtext-sm",
                                        "w-full",
                                      ),
                                    },
                                  }}
                                />
                              </div>
                              {/* STATUS */}
                              <div className="col-6">
                                <label htmlFor="statusFinanceiro">Status</label>
                                <InputText
                                  id="status"
                                  type="text"
                                  value={f.statusFinanceiro}
                                  readOnly
                                  pt={{
                                    root: {
                                      className: classNames(
                                        "p-inputtext-sm",
                                        "w-full",
                                      ),
                                    },
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          {/* UNIDADE */}
                          <div className="field col-12">
                            <div>
                              <label htmlFor="idUnidade">Unidade</label>
                              <InputText
                                id="idUnidade"
                                type="text"
                                value={makeUnidadeLabelById(f?.idUnidade)}
                                readOnly
                                pt={{
                                  root: {
                                    className: classNames(
                                      "p-inputtext-sm",
                                      "w-full",
                                    ),
                                  },
                                }}
                              />
                            </div>
                          </div>
                          {/* COMPROVANTE */}
                          <div className="field col-12">
                            <div>
                              <label htmlFor="comprovante">Comprovante</label>
                              <InputText
                                id="comprovante"
                                type="text"
                                value={f.comprovante}
                                readOnly
                                pt={{
                                  root: {
                                    className: classNames(
                                      "p-inputtext-sm",
                                      "w-full",
                                    ),
                                  },
                                }}
                              />
                            </div>
                          </div>
                          {/* OBSERVACOES */}
                          <div className="field col-12">
                            <label htmlFor="observacao">Observações</label>
                            <InputTextarea
                              id="observacao"
                              value={f.observacao}
                              rows={3}
                              cols={20}
                              autoResize
                              readOnly
                              pt={{
                                root: {
                                  className: classNames(
                                    "p-inputtext-sm",
                                    "w-full",
                                  ),
                                },
                              }}
                            />
                          </div>
                        </section>
                        <div className="page-break"></div>
                      </>
                    );
                  })}
                </div>
                <div className="flex align-items-center justify-content-start gap-2 mb-4 hide-print">
                  <Button
                    label="Imprimir"
                    className="hide-print"
                    onClick={handlePrint}
                  ></Button>
                  {/* <Button label="Salvar" type="submit" icon="pi pi-check" /> */}
                </div>
              </div>
            ) : (
              <div className="ml-4 mr-4 cent">
                <div className="formgrid grid">
                  <div className="card md:justify-content-start md:align-items-center">
                    <h5 className="m-0">
                      <div className="cent">
                        Sem registros para o ano de {anoCalendario}
                      </div>
                    </h5>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};
