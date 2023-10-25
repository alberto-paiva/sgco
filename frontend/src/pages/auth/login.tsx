import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox, type CheckboxChangeEvent } from "primereact/checkbox";
import React, { useState } from "react";

import logo from "@/assets/images/SGCO.2-transparente.png";
import AuthService from "@/services/auth.service.ts";
import { useLocation } from "wouter";
import { sleep } from "libs/utils.ts";
import { classNames } from "primereact/utils";

export function LoginDemo3() {
  const [checked, setChecked] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>();
  const [login, setLogin] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [, navigate] = useLocation();

  function goToHome(result: boolean) {
    function refreshPage() {
      window.location.reload();
    }
    sleep(500).then(() => {
      if (result) navigate("/dashboard", { replace: true });
      refreshPage();
    });
  }

  return (
    <div className="block-content border-round-3xl surface-card shadow-6 m-2 w-full lg:w-30rem md:w-30rem">
      <div className="flex align-items-center justify-content-center gap-2 border-round-3xl surface-card">
        <div className="surface-card p-4 border-round-3xl w-full">
          <div className="text-center mb-5">
            <img src={logo} alt="logo image" height={90} className="mb-1" />
            <div className="text-900 text-3xl font-medium mb-1">Bem vindo!</div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-900 font-medium mb-2"
            >
              Email
            </label>
            <InputText
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Usuário"
              className="w-full mb-3"
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                setLogin(e.currentTarget.value);
              }}
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2"
            >
              Senha
            </label>
            <InputText
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              className="w-full mb-2"
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                setSenha(e.currentTarget.value);
              }}
            />
            <div
              className={classNames({
                "mb-3 text-red-400 text-xs": { statusMessage },
              })}
            ></div>

            <div className="flex align-items-center justify-content-between mb-3">
              <div className="flex align-items-center">
                <Checkbox
                  id="rememberme"
                  onChange={(e: CheckboxChangeEvent) => {
                    setChecked(e.checked ?? false);
                  }}
                  checked={checked}
                  className="mr-2"
                />
                <label htmlFor="rememberme">Lembrar login</label>
              </div>
              <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                Esqueceu sua senha?
              </a>
            </div>
            <div className="flex align-items-center justify-content-center mb-4">
              <div className="flex align-items-center">
                <span className="text-600 font-medium line-height-3 text-xs">
                  <b>*</b> Não possui cadastro?
                </span>
                <a className="font-medium no-underline ml-2 text-blue-500 text-xs cursor-pointer">
                  Solicite aqui seu registro!
                </a>
              </div>
            </div>

            <Button
              label="Entrar"
              icon="pi pi-user"
              className="w-full"
              onClick={() => {
                // AuthService.login("admin2", "admin@admin").then((result) => {
                AuthService.login(login, senha).then((result) => {
                  setStatusMessage(
                    result ? undefined : "Usuário e/ou senha inválidos!",
                  );
                  goToHome(result);
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
