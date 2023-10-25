// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { classNames, UniqueComponentId } from "primereact/utils";
import { type ReactNode, useState } from "react";
import { Avatar } from "primereact/avatar";
import { InputMask } from "primereact/inputmask";
import { formatDate } from "libs/utils.ts";
import { useMountEffect } from "primereact/hooks";
import { InputText } from "primereact/inputtext";
import { getImageUrlOnServer } from "libs/file-utils.ts";

interface ProfileDialogProps {
  title?: string;
  content?: ReactNode;
  visible: boolean;
  setVisible: (value: boolean) => void;
  loggedUser?: UsuarioData;
}

export default function ProfileDialog({
  title = "Perfil",
  content,
  visible,
  setVisible,
  loggedUser,
}: ProfileDialogProps) {
  const [usuario, setUsuario] = useState<UsuarioData>();
  const id = UniqueComponentId();

  useMountEffect(() => {
    setUsuario(loggedUser);
  });

  const header = (
    <>
      {/* CATEGORIA */}
      <div>
        <span style={{ margin: "0.5rem" }}>{title}</span>{" "}
        {usuario?.tipo === "C"
          ? "Condômino"
          : usuario?.tipo === "S"
          ? "Síndico"
          : usuario?.tipo === "P"
          ? "Profissional"
          : usuario?.tipo === "A"
          ? "Administrador"
          : ""}
      </div>
      <hr />
      {/* NOME TEMPLATE */}
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
            size="xlarge"
            shape="circle"
            icon="pi pi-user"
            pt={{ image: { width: 32 } }}
          />
        </div>
        <div>
          {/* NOME */}
          <div>
            <span style={{ marginLeft: ".5em", verticalAlign: "middle" }}>
              Nome: {usuario?.nome}
            </span>
          </div>
          {/* EMAIL */}
          <div>
            <span
              className="text-color-secondary text-sm"
              style={{ marginLeft: ".5em", verticalAlign: "middle" }}
            >
              E-mail: {usuario?.email}
            </span>
          </div>
        </div>
      </div>
      <hr />
      {/* CPF */}
      <div>
        CPF:{"  "}
        <InputMask
          id="cpf"
          mask="999.999.999-99"
          placeholder="000.000.000-00"
          value={usuario?.cpf}
          pt={{
            root: {
              className: classNames("border-none", "p-0"),
            },
          }}
        ></InputMask>
      </div>
      <hr />
      {/* CONTATO */}
      <div>
        Contato:{" "}
        <InputMask
          id="telefone"
          mask={
            usuario?.contato.length === 11 ? "(99)99999-9999" : "(99)9999-9999"
          }
          placeholder="(00)00000-0000"
          value={usuario?.contato}
          pt={{
            root: {
              className: classNames("border-none", "p-0"),
            },
          }}
        ></InputMask>
      </div>
      <hr />
      {/* STATUS */}
      <div>
        {usuario?.tipo === "C" ? "Proprietário: " : ""}
        {usuario?.tipo === "C" && (
          <i
            className={classNames("pi", {
              "text-green-500 pi-check-circle": usuario?.proprietario,
              "text-pink-500 pi-times-circle": !usuario?.proprietario,
            })}
          ></i>
        )}
        Ativo:{" "}
        <i
          className={classNames("pi", {
            "text-green-500 pi-check-circle": usuario?.ativo,
            "text-pink-500 pi-times-circle": !usuario?.ativo,
          })}
        ></i>
      </div>
      <hr />
      {/* ENTRADA/SAIDA */}
      <div>
        Data entrada:{" "}
        <InputMask
          id="telefone"
          mask={"99/99/9999"}
          placeholder="00/00/0000"
          value={
            usuario?.dataEntrada
              ? formatDate(usuario?.dataEntrada, "DD/MM/YYYY")
              : undefined
          }
          pt={{
            root: {
              className: classNames("border-none", "p-0"),
            },
          }}
        ></InputMask>
        {/* {usuario?.dataEntrada ? formatDate(usuario?.dataEntrada) : undefined} */}
      </div>
      <hr />
      <div>
        Data saída:{" "}
        <InputMask
          id="telefone"
          mask={"99/99/9999"}
          placeholder="00/00/0000"
          value={
            usuario?.dataSaida
              ? formatDate(usuario?.dataSaida, "DD/MM/YYYY")
              : undefined
          }
          pt={{
            root: {
              className: classNames("border-none", "p-0"),
            },
          }}
        ></InputMask>
        {/* {usuario?.dataSaida ? formatDate(usuario?.dataSaida) : undefined} */}
      </div>
      <hr />
      {/* OBSERVACAO */}
      <div>
        Observacao:{" "}
        <InputText
          type="text"
          value={usuario?.observacao}
          pt={{
            root: {
              className: classNames("border-none", "p-0"),
            },
          }}
        ></InputText>
        {/* {usuario?.observacao} */}
      </div>
      <hr />
    </>
  );

  const body = (
    <>
      <>
        <hr />
        {content}
        <span
          className="text-color-secondary text-xs"
          style={{ verticalAlign: "middle" }}
        >
          Last IP: {usuario?.lastIP} | Last Login:{" "}
          {loggedUser?.lastLogin &&
            new Date(+loggedUser?.lastLogin).toLocaleString()}
        </span>
        <br />
        {/* ID */}
        <span
          className="text-color-secondary text-xs"
          style={{ verticalAlign: "middle" }}
        >
          IDX: [ {usuario?.id}/{usuario?.uuid}/T: {usuario?.tipo?.toUpperCase()}{" "}
          ]
        </span>
      </>
    </>
  );

  const footerContent = (
    <>
      <hr />
      <Button
        label={"Fechar"}
        icon="pi pi-times"
        onClick={() => {
          setVisible(false);
        }}
        severity="danger"
        className="align-left mr-4"
        pt={{
          root: { style: { margin: "0" } },
        }}
        size="small"
        raised
      />

      <Button
        label={"Salvar"}
        icon="pi pi-check"
        onClick={() => {
          setVisible(false);
        }}
        className="align-right"
        size="small"
        raised
        autoFocus
      />
    </>
  );

  return (
    <div className="card flex justify-content-center">
      <Dialog
        id={id}
        header={header}
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        footer={footerContent}
        contentStyle={{ width: "auto", padding: "0 1.5rem" }}
        headerStyle={{ width: "auto", padding: "1.5rem 1.5rem 0rem" }}
        // style={{ width: '50vw' }}
        // breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <p className="m-0">{body}</p>
      </Dialog>
    </div>
  );
}
