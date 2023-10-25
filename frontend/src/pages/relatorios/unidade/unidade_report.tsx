import { useEffect, useRef, useState } from "react";
import { useDataReducer } from "libs/data-utils.ts";
import { DefaultLayout } from "layouts/DefaultLayout.tsx";
import { Button } from "primereact/button";
import { useReactToPrint } from "react-to-print";
import { generateUUID } from "libs/utils.ts";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { InputTextarea } from "primereact/inputtextarea";
import AuthService, { API_URL } from "@/services/auth.service.ts";
import { UnidadeService } from "libs/api/unidade-api.ts";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import jscrudapi from "js-crud-api";

export const UnidadeReport = () => {
  const { state, dispatch } = useDataReducer<UnidadeData>();

  const [unidades, setUnidades] = useState<UnidadeData[]>([]);

  const [condominios, setCondominios] = useState<CondominioDistinctData[]>();
  const [condominio, setCondominio] = useState<CondominioDistinctData>();

  const componentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        let response: UnidadeData[] = [];

        if (!AuthService.userIsCondomino()) {
          response = await UnidadeService.getInstance().getAllUnidades(
            condominio?.id,
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
  }, [condominio]);

  useEffect(() => {
    setUnidades(state.dataArray ?? []);
  }, [unidades, state]);

  useEffect(() => {
    const jca = jscrudapi<CondominioDistinctData>(API_URL);
    const getCondominios = async () => {
      const response = await jca.list("condominiosdistinct");
      setCondominios(response.records);
    };

    getCondominios().then((r) => r);
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "RelatórioCondominos.pdf",
    copyStyles: true,
    onAfterPrint: () => {
      console.log("Printed PDF successfully!");
    },
  });

  return (
    <>
      <DefaultLayout>
        <div className="card md:justify-content-start md:align-items-center">
          <h5 className="m-0">
            {condominio?.nome ? condominio.nome : "Todos os Condomínios"}
          </h5>
          <hr />
          <div>
            <span className="block mt-2 md:mt-0 p-input-icon-left ml-2">
              <i className="pi pi-search" />
              <Dropdown
                id="tipo"
                value={condominio}
                options={condominios}
                optionLabel="nome"
                placeholder="Selecione..."
                emptyMessage={`Sem resultados`}
                pt={{
                  root: {
                    className: classNames("p-inputtext-sm", "w-full"),
                  },
                }}
                onChange={(e: DropdownChangeEvent) => {
                  e.preventDefault();
                  setCondominio(e.value);
                }}
              />
            </span>
          </div>
        </div>
        <div ref={componentRef} style={{ width: "100%", height: "100%" }}>
          <div>
            {unidades.length ? (
              <div className="ml-4 mr-4">
                <div className="formgrid grid">
                  {unidades?.map((u) => {
                    return (
                      <>
                        <section
                          key={generateUUID()}
                          className="card noborder mt-2"
                        >
                          {/* BLOCO/NUMERO */}
                          <div className="field col-12">
                            <div className="formgrid grid">
                              {/* CPF */}
                              <div className="col-6">
                                <label htmlFor="bloco">Bloco</label>
                                <InputText
                                  id="bloco"
                                  value={`Bl.${u.bloco}`}
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
                              {/* CONTATO */}
                              <div className="col-6">
                                <label htmlFor="numero">Apartamento</label>
                                <InputText
                                  id="numero"
                                  value={`Ap.${u.numero}`}
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
                          {/* CONDOMINIO */}
                          <div className="field col-12">
                            <div className="formgrid grid">
                              <label htmlFor="condominio">Condomínio</label>
                              <InputText
                                id="condominio"
                                value={u.nomeCondominio}
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
                              value={u.observacao}
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
                      <div className="cent">Sem registros</div>
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
