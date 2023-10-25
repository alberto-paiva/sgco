// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import ErrorDialog from "components/dialogs/ErrorDialog";
import { formatSize } from "libs/utils";
import { Avatar } from "primereact/avatar";
import React, {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface FileProps {
  name?: string;
  size?: string;
  type?: string;
  ext?: string;
}

interface PhotoUploaderProps {
  label?: string;
  buttonLabel?: string;
  selectedImage?: File;
  disabled?: boolean;

  setSelectedImage: (imageFile: File | undefined) => void;
}

const validFileTypes = ["image/png", "image/jpeg", "image/jpg"];

const PhotoUploader = ({
  label = "Selecionar",
  selectedImage,
  disabled,
  setSelectedImage,
}: PhotoUploaderProps) => {
  const fileUploadRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | undefined>();
  const [fileInfo, setFileInfo] = useState<FileProps>({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (!disabled) {
      fileUploadRef.current?.click();
    }
  }

  const getExtension = (filename: string) => {
    return filename.split(".").pop();
  };

  const updateFileInfo = useCallback(
    (fileUploaded: File) => {
      const fileInfoProps: FileProps = {
        name: fileUploaded.name,
        size: formatSize(fileUploaded.size || 0),
        type: fileUploaded.type,
        ext: getExtension(fileUploaded.name),
      };
      setFileInfo(fileInfoProps);
      setFile(fileUploaded);
      setSelectedImage(fileUploaded);
    },
    [setSelectedImage],
  );

  const isValidFileUploaded = (fileSelected: File) => {
    const fileType = fileSelected.type;
    return validFileTypes.includes(fileType);
  };

  const handleChange = (e: HTMLInputElement) => {
    if (e.files && e.files.length > 0) {
      const fileUploaded = e.files[0];
      if (isValidFileUploaded(fileUploaded)) {
        try {
          updateFileInfo(fileUploaded);
        } catch (err) {
          console.log(err);
        }
      } else {
        setShowErrorDialog(true);
      }
    }
  };

  useEffect(() => {
    if (selectedImage) {
      setFile(selectedImage);
      updateFileInfo(selectedImage);
    }
  }, [setFile, selectedImage, updateFileInfo]);

  return (
    <>
      <label htmlFor="photo-uploader">{label}</label>
      <div className="flex align-items-center gap-2">
        <input
          id="photo-uploader"
          type="file"
          ref={fileUploadRef}
          accept={validFileTypes.join()}
          onInput={(e: FormEvent<HTMLInputElement>) => {
            handleChange(e.target as HTMLInputElement);
          }}
          style={{ display: "none" }}
        />

        {file ? (
          <>
            <div>
              <Avatar
                imageAlt={fileInfo?.name}
                image={URL.createObjectURL(file)}
                className="p-mr-2"
                style={{ verticalAlign: "middle" }}
                size="xlarge"
                shape="circle"
                icon="pi pi-user"
                pt={{ image: { width: 32 } }}
                onClick={handleClick}
              />
            </div>
            <div>
              <div>
                <span style={{ marginLeft: ".5em", verticalAlign: "middle" }}>
                  {fileInfo?.name}
                </span>
              </div>
              <div>
                <span
                  className="text-color-secondary text-sm"
                  style={{ marginLeft: ".5em", verticalAlign: "middle" }}
                >
                  {`${fileInfo?.size} / 30 MB`}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div>
            <Avatar
              imageAlt="Avatar"
              className="p-mr-2"
              style={{ verticalAlign: "middle" }}
              size="xlarge"
              shape="circle"
              icon="pi pi-user"
              pt={{ image: { width: 32 } }}
              onClick={handleClick}
            />
          </div>
        )}
      </div>
      {showErrorDialog && (
        <ErrorDialog
          title="Arquivo Inválido!"
          content={
            <>
              <div>
                O arquivo que você selecionou possui uma extensão inválida!
              </div>
              <pre>Extensão selecionada: {fileInfo?.ext}</pre>
              <pre>Formatos aceitos: png, jpeg ou jpg.</pre>
            </>
          }
          showYes={false}
          labelNo={"Fechar"}
          visible={showErrorDialog}
          setVisible={(prev) => {
            setShowErrorDialog(prev);
          }}
        />
      )}
    </>
  );
};

export default PhotoUploader;
