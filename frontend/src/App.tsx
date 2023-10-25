// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { Route, Router, Switch } from "wouter";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { navigate, useLocationProperty } from "wouter/use-location";

import "./App.css";
import { NotFound404 } from "pages/_404.tsx";
import { CondominosAdd } from "pages/condominos/add.tsx";
import { CondominosList } from "pages/condominos/list.tsx";
import { MensagensList } from "pages/mensagens/list.tsx";
import { Dashboard } from "pages/dashboard/Dashboard.tsx";
import { CondominiosAdd } from "pages/condominio/add.tsx";
import { CondominiosList } from "pages/condominio/list.tsx";
import { EnderecosList } from "pages/endereco/list.tsx";
import { EnderecosAdd } from "pages/endereco/add.tsx";
import { UnidadesAdd } from "pages/unidades/add.tsx";
import { UnidadesList } from "pages/unidades/list.tsx";
import { SindicosAdd } from "pages/sindico/add.tsx";
import { SindicosList } from "pages/sindico/list.tsx";
import { LoginDemo3 } from "pages/auth/login.tsx";
import { useEffect, useState } from "react";
import AuthService from "@/services/auth.service.ts";
import { FinanceirosList } from "pages/financeiro/list.tsx";
import { addLocale } from "primereact/api";

import customLocale from "./assets/pt.json";
import { FinanceiroReport } from "pages/relatorios/financeiro/financeiro_report.tsx";
import { CondominoReport } from "pages/relatorios/condomino/condomino_report.tsx";
import { UnidadeReport } from "pages/relatorios/unidade/unidade_report.tsx";

history.replaceState(0, "", "/sgco/app/#/"); // url defaults to `/sgco/app/#/`

dayjs.extend(customParseFormat);

function App() {
  // returns the current hash location in a normalized form
  // excluding the leading '#' symbol
  const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";

  const hashNavigate = (to: string | URL) => {
    navigate("#" + to.toString());
  };

  const useHashLocation = (): [string, (to: string) => void] => {
    const location = useLocationProperty(hashLocation);
    return [location, hashNavigate];
  };

  const [loggedInUser, setLoggedInUser] = useState<UsuarioData>();

  addLocale("pt", customLocale.pt);

  useEffect(() => {
    const userStr = localStorage.getItem(AuthService.USER_KEY);
    if (userStr) {
      setLoggedInUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <>
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/">
            {() => (!loggedInUser ? <LoginDemo3 /> : <Dashboard title={""} />)}
          </Route>
          <Route path="/dashboard">{() => <Dashboard />}</Route>
          <Route path="/about" component={About} />
          <Route path="/mensagens/list" component={MensagensList} />
          <Route path="/condominos/list" component={CondominosList} />
          <Route path="/condominos/add/:id">
            {(params) => <CondominosAdd id={params.id} />}
          </Route>
          <Route path="/condominos/add">
            <CondominosAdd id={null} />
          </Route>
          <Route path="/condominios/list" component={CondominiosList} />
          <Route path="/condominios/add/:id">
            {(params) => <CondominiosAdd id={params.id} />}
          </Route>
          <Route path="/condominios/add">
            <CondominiosAdd id={null} />
          </Route>
          <Route path="/enderecos/list" component={EnderecosList} />
          <Route path="/enderecos/add/:id">
            {(params) => <EnderecosAdd id={params.id} />}
          </Route>
          <Route path="/enderecos/add">
            <EnderecosAdd id={null} />
          </Route>
          <Route path="/enderecos/list" component={EnderecosList} />
          <Route path="/enderecos/add/:id">
            {(params) => <EnderecosAdd id={params.id} />}
          </Route>
          <Route path="/enderecos/add">
            <EnderecosAdd id={null} />
          </Route>
          <Route path="/mensalidades/list">{() => <FinanceirosList />}</Route>
          <Route path="/receitas/list">
            {() => <FinanceirosList tipo={"RECEITA"} />}
          </Route>
          <Route path="/despesas/list">
            {() => <FinanceirosList tipo={"DESPESA"} />}
          </Route>
          <Route path="/enderecos/add/:id">
            {(params) => <EnderecosAdd id={params.id} />}
          </Route>
          <Route path="/unidades/list" component={UnidadesList} />
          <Route path="/unidades/add/:id">
            {(params) => <UnidadesAdd id={params.id} />}
          </Route>
          <Route path="/unidades/add">
            <UnidadesAdd id={null} />
          </Route>
          <Route path="/sindicos/list" component={SindicosList} />
          <Route path="/sindicos/add/:id">
            {(params) => <SindicosAdd id={params.id} />}
          </Route>
          <Route path="/sindicos/add">
            <SindicosAdd id={null} />
          </Route>
          <Route path="/login" component={LoginDemo3} />
          <Route path="/relatorios/financeiro">
            <FinanceiroReport />
          </Route>
          <Route path="/relatorios/condominos">
            <CondominoReport />
          </Route>
          <Route path="/relatorios/unidades">
            <UnidadeReport />
          </Route>
          <Route component={NotFound404}></Route>
        </Switch>
      </Router>
    </>
  );
}

const About = () => <div>Your About component content</div>;
export default App;
