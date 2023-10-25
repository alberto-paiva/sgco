// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { UniqueComponentId } from "primereact/utils";
import { type ReactNode } from "react";

interface ErrorDialogProps {
  title?: string;
  content?: ReactNode;
  labelYes?: string;
  labelNo?: string;
  showYes?: boolean;
  showNo?: boolean;
  visible: boolean;
  setVisible: (value: boolean) => void;
}

export default function ErrorDialog({
  title = "ERRO",
  content,
  labelYes = "Sim",
  labelNo = "Não",
  showYes = true,
  showNo = true,
  visible,
  setVisible,
}: ErrorDialogProps) {
  const id = UniqueComponentId();

  const header = (
    <>
      <i
        className="pi pi-exclamation-triangle text-red-700 pr-2"
        style={{ fontSize: "1.5rem" }}
      ></i>
      <span>{title}</span>
    </>
  );

  const body = (
    <>
      <Divider />
      {content}
    </>
  );

  const footerContent = (
    <>
      <Divider />
      {showNo && (
        <Button
          label={labelNo}
          icon="pi pi-times"
          onClick={() => {
            setVisible(false);
          }}
          severity="danger"
          className="align-left"
          pt={{
            root: { style: { margin: "0" } },
          }}
          size="small"
          raised
        />
      )}
      {showYes && (
        <Button
          label={labelYes}
          icon="pi pi-check"
          onClick={() => {
            setVisible(false);
          }}
          className="align-right"
          size="small"
          raised
          autoFocus
        />
      )}
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
