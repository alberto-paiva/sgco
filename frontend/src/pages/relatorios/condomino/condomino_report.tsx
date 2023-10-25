import { useEffect, useRef, useState } from "react";
import { useDataReducer } from "libs/data-utils.ts";
import { DefaultLayout } from "layouts/DefaultLayout.tsx";
import { Button } from "primereact/button";
import { useReactToPrint } from "react-to-print";
import { generateUUID } from "libs/utils.ts";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import AuthService from "@/services/auth.service.ts";
import { UsuarioService } from "libs/api/usuario-api.ts";
import { Avatar } from "primereact/avatar";
import { getImageUrlOnServer } from "libs/file-utils.ts";
import { InputMask } from "primereact/inputmask";

export const CondominoReport = () => {
  const { state, dispatch } = useDataReducer<UsuarioData>();

  const [condominos, setCondominos] = useState<UsuarioData[]>([]);

  const componentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_DATA_REQUEST" });
      try {
        let response: UsuarioData[] = [];

        if (!AuthService.userIsCondomino()) {
          response =
            await UsuarioService.getInstance().getAllUsuariosCondominos();
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
  }, []);

  useEffect(() => {
    setCondominos(state.dataArray ?? []);
  }, [condominos, state]);

  const makeUnidadeLabelById = (id?: number) => {
    let condomino = null;
    for (let i = 0; i < condominos?.length; i++) {
      if (condominos[i].id === id) {
        condomino = condominos[i];
        break;
      }
    }
    return condomino
      ? `Bl.${condomino?.numero} - Ap.${condomino?.bloco}. ${condomino?.nomeCondominio}.`
      : "";
  };

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
        <div ref={componentRef} style={{ width: "100%", height: "100%" }}>
          <div>
            {condominos.length ? (
              <div className="ml-4 mr-4">
                <div className="formgrid grid">
                  {condominos?.map((c) => {
                    return (
                      <>
                        <section
                          key={generateUUID()}
                          className="card noborder mt-2"
                        >
                          {/* Nome */}
                          <div className="field col-12">
                            <div className="flex align-items-center gap-2">
                              <div>
                                <Avatar
                                  imageAlt={c.nome}
                                  image={
                                    c.imagemPerfil && c.uuid
                                      ? getImageUrlOnServer(
                                          c.imagemPerfil,
                                          c.uuid,
                                        )
                                      : ""
                                  }
                                  className="p-mr-2"
                                  style={{ verticalAlign: "middle" }}
                                  size="large"
                                  shape="circle"
                                  icon="pi pi-user"
                                  pt={{ image: { width: 32 } }}
                                />
                              </div>
                              <div>
                                <div>
                                  <span
                                    style={{
                                      marginLeft: ".5em",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    {c.nome}
                                  </span>
                                </div>
                                <div>
                                  <span
                                    className="text-color-secondary text-sm"
                                    style={{
                                      marginLeft: ".5em",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    {c.email}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* CPF/CONTATO */}
                          <div className="field col-12">
                            <div className="formgrid grid">
                              {/* CPF */}
                              <div className="col-6">
                                <label htmlFor="cpf">CPF</label>
                                <InputMask
                                  id="cpf"
                                  value={c.cpf}
                                  mask="999.999.999-99"
                                  placeholder="000.000.000-00"
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
                                <label htmlFor="contato">Contato</label>
                                <InputMask
                                  id="contato"
                                  value={c.contato}
                                  mask={
                                    c.contato.length === 11
                                      ? "(99)99999-9999"
                                      : "(99)9999-9999"
                                  }
                                  placeholder="(00)00000-0000"
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
                          {/* ENTRADA/SAIDA */}
                          <div className="field col-12">
                            <div className="formgrid grid">
                              {/* DATA ENTRADA */}
                              <div className="col-6">
                                <label htmlFor="dataEntrada">Entrada</label>

                                <Calendar
                                  id="dataEntrada"
                                  value={new Date(Date.parse(c.dataEntrada))}
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
                              {/* DATA SAIDA */}
                              <div className="col-6">
                                <label htmlFor="dataSaida">Saída</label>
                                <Calendar
                                  id="dataSaida"
                                  value={
                                    c.dataSaida
                                      ? new Date(Date.parse(c.dataSaida))
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
                          {/* STATUS/UNIDADE */}
                          <div className="field col-12">
                            <div className="formgrid grid">
                              {/* STATUS */}
                              <div className="col-6">
                                <label htmlFor="proprietario">
                                  Proprietário
                                </label>
                                <i
                                  className={classNames("pi", {
                                    "text-green-500 pi-check-circle":
                                      c.proprietario,
                                    "text-pink-500 pi-times-circle":
                                      !c.proprietario,
                                  })}
                                ></i>
                              </div>
                              {/* UNIDADE */}
                              <div className="col-6">
                                <label htmlFor="statusFinanceiro">Status</label>
                                <InputText
                                  id="status"
                                  type="text"
                                  value={makeUnidadeLabelById(c.id)}
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
                          {/* OBSERVACOES */}
                          <div className="field col-12">
                            <label htmlFor="observacao">Observações</label>
                            <InputTextarea
                              id="observacao"
                              value={c.observacao}
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
