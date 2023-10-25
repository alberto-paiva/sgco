import { DefaultLayout } from "layouts/DefaultLayout";
import { useEffect, useState } from "react";
import AuthService, { API_URL, UsuarioField } from "@/services/auth.service.ts";
import jscrudapi from "js-crud-api";
import { Clock } from "components/Clock.tsx";

interface HomeProps {
  title?: string;
}

export const Dashboard = ({ title = "Dashboard" }: HomeProps) => {
  const [user, setUser] = useState<UsuarioData>();
  const [userCount, setUserCount] = useState<number>(0);
  const [receitas, setReceitas] = useState<FinanceiroData[]>([]);
  const [despesas, setDespesas] = useState<FinanceiroData[]>([]);
  const [apartamentos, setApartamentos] = useState<UnidadeData[]>([]);
  const [condominios, setCondominios] = useState<CondominioData[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem(AuthService.USER_KEY);
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const userLimited = user?.tipo === "C" || user?.tipo === undefined;

  const userIdUnidade = AuthService.getCurrentUserField(UsuarioField.IdUnidade);

  const userIdCondominio = AuthService.getCurrentUserField(
    UsuarioField.IdCondominio,
  );

  useEffect(() => {
    const jca = jscrudapi(API_URL);
    const getUsuarios = async () => {
      const response = await jca.list("usuario");
      setUserCount(response.records.length);
    };

    const getReceitas = async () => {
      const response = await jca.list("financeiro", {
        filter: ["tipo,eq,RECEITA", `idUnidade,eq,${userIdUnidade}`],
      });
      setReceitas(response.records);
    };

    const getDespesas = async () => {
      const response = await jca.list("financeiro", {
        filter: userLimited
          ? ["tipo,eq,DESPESA", `idUnidade,eq,${userIdUnidade}`]
          : "tipo,eq,DESPESA",
      });
      setDespesas(response.records);
    };

    const getApartamentos = async () => {
      const response = await jca.list("apartamentosformatados", {
        filter: userLimited ? `value,eq,${userIdUnidade}` : "",
      });
      setApartamentos(response.records);
    };

    const getCondominios = async () => {
      console.log(user);
      const response = await jca.list("condominiocompleto", {
        filter: userLimited ? `id,eq,${userIdCondominio}` : "",
      });
      setCondominios(response.records);
    };

    getUsuarios().then((r) => r);
    getReceitas().then((r) => r);
    getDespesas().then((r) => r);
    getApartamentos().then((r) => r);
    getCondominios().then((r) => r);
  }, []);

  return (
    <>
      <DefaultLayout title={title}>
        <div className="card">
          <div className="surface-0 text-center">
            <div className="mb-1 font-bold text-3xl">
              <span className="text-900">Olá, </span>
              <span className="text-blue-600">{user?.nome}</span>
            </div>
            <div className="mt-2 mb-6 font-semibold">
              <span>
                <Clock />
              </span>
            </div>
            <div className="grid">
              <div className="col-12 md:col-4 mb-4 px-5">
                <span
                  className="p-3 shadow-2 mb-3 inline-block"
                  style={{ borderRadius: "10px" }}
                >
                  <i className="pi pi-desktop text-4xl text-blue-500"></i>
                </span>
                <div className="text-900 text-xl mb-3 font-medium">
                  Último Acesso
                </div>
                <span className="text-700 line-height-3">
                  {user?.lastLogin
                    ? String(new Date(+user?.lastLogin).toLocaleString())
                    : "-"}
                </span>
              </div>
              <div className="col-12 md:col-4 mb-4 px-5">
                <span
                  className="p-3 shadow-2 mb-3 inline-block"
                  style={{ borderRadius: "10px" }}
                >
                  <i className="pi pi-user text-4xl text-blue-500"></i>
                </span>
                <div className="text-900 text-xl mb-3 font-medium">
                  {userLimited ? "Usuário Logado" : "Usuários"}
                </div>
                <span className="text-700 line-height-3">
                  {userLimited ? "" : userCount}
                  {userLimited ? (
                    <>
                      <i className="pi text-green-500 pi-check-circle"></i>
                    </>
                  ) : null}
                </span>
              </div>
              <div className="col-12 md:col-4 mb-4 px-5">
                <span
                  className="p-3 shadow-2 mb-3 inline-block"
                  style={{ borderRadius: "10px" }}
                >
                  <i className="pi pi-arrow-circle-up text-4xl text-blue-500"></i>
                </span>
                <div className="text-900 text-xl mb-3 font-medium">
                  {userLimited ? "Valores a Receber" : "Receitas"}
                </div>
                <span className="text-700 line-height-3">
                  {receitas.length}
                </span>
              </div>
              <div className="col-12 md:col-4 mb-4 px-5">
                <span
                  className="p-3 shadow-2 mb-3 inline-block"
                  style={{ borderRadius: "10px" }}
                >
                  <i className="pi pi-arrow-circle-down text-4xl text-blue-500"></i>
                </span>
                <div className="text-900 text-xl mb-3 font-medium">
                  Despesas
                </div>
                <span className="text-700 line-height-3">
                  {despesas.length}
                </span>
              </div>
              <div className="col-12 md:col-4 mb-4 px-5">
                <span
                  className="p-3 shadow-2 mb-3 inline-block"
                  style={{ borderRadius: "10px" }}
                >
                  <i className="pi pi-building text-4xl text-blue-500"></i>
                </span>
                <div className="text-900 text-xl mb-3 font-medium">
                  Condomínios
                </div>
                <span className="text-700 line-height-3">
                  {condominios.length}
                </span>
              </div>
              <div className="col-12 md:col-4 md:mb-4 mb-0 px-3">
                <span
                  className="p-3 shadow-2 mb-3 inline-block"
                  style={{ borderRadius: "10px" }}
                >
                  <i className="pi pi-table text-4xl text-blue-500"></i>
                </span>
                <div className="text-900 text-xl mb-3 font-medium">
                  Apartamentos
                </div>
                <span className="text-700 line-height-3">
                  {apartamentos.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};
