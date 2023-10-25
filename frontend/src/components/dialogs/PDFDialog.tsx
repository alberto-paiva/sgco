import { Dialog } from "primereact/dialog";
import { Margin, Resolution, usePDF } from "react-to-pdf";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { sleep } from "libs/utils.ts";
import { type ReactNode } from "react";

interface ExportPDFDialogProps {
  data: ReactNode;
  title: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
}

export default function ExportPDFDialog({
  data,
  title,
  visible,
  setVisible,
}: ExportPDFDialogProps) {
  const { toPDF, targetRef } = usePDF({
    method: "save",
    filename: title + String(new Date().toISOString()) + ".pdf",
    page: { margin: Margin.MEDIUM },
    resolution: Resolution.MEDIUM,
  });

  const footerContent = (
    <>
      <Divider />

      <Button
        label={"Fechar"}
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

      <Button
        label={"Salvar"}
        severity={"success"}
        icon="pi pi-check"
        onClick={() => {
          toPDF();
          sleep(500).then(() => {
            setVisible(false);
          });
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
        // header="Header"
        visible={visible}
        footer={footerContent}
        maximized={true}
        contentStyle={{ width: "auto", padding: "0 1.5rem" }}
        headerStyle={{ width: "auto", padding: "1.5rem 1.5rem 0rem" }}
        onHide={() => {
          setVisible(false);
        }}
      >
        <div ref={targetRef} className="m-0">
          {/* {JSON.stringify(data as [], null, 3)} */}
          {data}
        </div>
      </Dialog>
    </div>
  );
}
