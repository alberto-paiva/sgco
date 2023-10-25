// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { sleep } from "@/libs/utils";
import logo from "assets/images/preact.svg";
import ProfileDialog from "components/dialogs/ProfileDialog.tsx";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import AuthService from "@/services/auth.service.ts";
import { type MenuItem } from "primereact/menuitem";
import { Avatar } from "primereact/avatar";
import { getImageUrlOnServer } from "libs/file-utils.ts";

interface AppNavbarProps {
  title?: string;
  profileSidebarVisible?: boolean;
  onMenuToggle: () => void;
  showProfileSidebar: () => void;
  loggedUser?: UsuarioData;
}

export function AppNavbar({
  title = "SGCO",
  profileSidebarVisible,
  onMenuToggle,
  showProfileSidebar,
  loggedUser,
}: AppNavbarProps) {
  const [usuario, setUsuario] = useState<UsuarioData>();
  const [showProfile, setShowProfile] = useState<boolean>(false);
  // const [showConfig, setShowConfig] = useState<boolean>(false);
  const [, navigate] = useLocation();

  const settingsMenuRef = useRef<Menu>(null);

  useEffect(() => {
    if (loggedUser) {
      setUsuario(loggedUser);
    }
  }, [loggedUser]);

  const toggleSettingsMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    settingsMenuRef.current?.toggle(event);
  };

  const settingsMenuItems: MenuItem[] = [
    {
      label: "Opções",
      template: (_item, _options) => {
        return (
          <div className="flex align-items-center gap-2">
            {/* IMAGE */}
            <div>
              <Avatar
                // imageAlt={rowData.nome}
                image={
                  usuario?.imagemPerfil &&
                  getImageUrlOnServer(usuario?.imagemPerfil, usuario?.uuid)
                }
                imageAlt="Avatar"
                className="text-blue-700 p-mr-2"
                style={{
                  verticalAlign: "middle",
                  fontSize: "1.5rem",
                  margin: "0.5rem",
                }}
                size="normal"
                shape="circle"
                icon="pi pi-user"
                pt={{ image: { width: 32 } }}
              />
            </div>
            <div>
              {/* NOME */}
              <div>
                <span
                  className="text-color-secondary text-xs"
                  style={{ marginLeft: ".5em", verticalAlign: "middle" }}
                >
                  {usuario?.nome}
                </span>
              </div>
              {/* EMAIL */}
              <div>
                <span
                  className="text-color-secondary text-xs"
                  style={{ marginLeft: ".5em", verticalAlign: "middle" }}
                >
                  {usuario?.email}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      separator: true,
    },
    {
      label: "Perfil",
      icon: "pi pi-user",
      command: () => {
        setShowProfile((prev) => !prev);
      },
    },
    {
      separator: true,
    },
    {
      label: "Sair",
      icon: "pi pi-sign-out",
      command: () => {
        AuthService.logout().then(() => {
          sleep(500).then(() => {
            navigate("/login", { replace: true });
          });
        });
      },
    },
  ];

  return (
    <div className="layout-topbar">
      <a
        className="layout-topbar-logo"
        onClick={() => {
          navigate("/", { replace: true });
        }}
      >
        <img src={logo} width="47.22px" height="35px" alt="logo" />
        <span>{title}</span>
      </a>

      <Button
        type="button"
        icon={"pi pi-bars"}
        rounded
        text
        raised
        pt={{
          root: { style: { fontSize: "0.75rem", margin: "0.4rem" } },
        }}
        // className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      ></Button>
      <Button
        type="button"
        icon={"pi pi-ellipsis-v"}
        rounded
        text
        raised
        pt={{
          root: { style: { fontSize: "0.75rem", margin: "0.4rem" } },
        }}
        aria-label={"Profile"}
        className="layout-topbar-menu-button"
        onClick={() => {
          showProfileSidebar();
          setShowProfile((prev) => !prev);
        }}
      ></Button>
      <div
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": profileSidebarVisible,
        })}
      >
        <Button
          type="button"
          icon={"pi pi-calendar"}
          rounded
          text
          raised
          pt={{
            root: { style: { fontSize: "0.75rem", margin: "0.4rem" } },
          }}
          aria-label={"Calendar"}
          // className="p-link layout-topbar-button"
        ></Button>
        <Menu ref={settingsMenuRef} model={settingsMenuItems} popup />
        <Button
          type="button"
          // label="Options"
          icon="pi pi-cog"
          rounded
          text
          raised
          pt={{
            root: { style: { fontSize: "0.75rem", margin: "0.4rem" } },
          }}
          aria-label={"Settings"}
          onClick={toggleSettingsMenu}
        />
      </div>
      {showProfile && (
        <ProfileDialog
          title="Perfil"
          content={<pre>Informações do Usuário</pre>}
          visible={showProfile}
          setVisible={(prev) => {
            setShowProfile(prev);
          }}
          loggedUser={usuario}
        />
      )}
    </div>
  );
}
