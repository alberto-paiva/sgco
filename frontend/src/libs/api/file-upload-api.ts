import { type AxiosResponse } from "axios";
import { apiInstance } from "libs/api/base-api.ts";

export class FileUploadService {
  private static instance: FileUploadService | null = null;

  private constructor() {
    // Private constructor to prevent external instantiation.
  }

  public static getInstance(): FileUploadService {
    if (!FileUploadService.instance) {
      FileUploadService.instance = new FileUploadService();
    }
    return FileUploadService.instance;
  }

  async fileUpload(fileModel: FileModel): Promise<never> {
    try {
      const formData: FormData = new FormData();
      formData.append("_method", "post");
      formData.append(
        "filepath",
        `uploads/${fileModel.path}/${fileModel.foderName}/`,
      );
      formData.append("file", fileModel.file);
      // formData.append("filename", fileModel.fileName);

      // for (const key of formData.entries()) {
      //   console.log(key[0], " - ", key[1]);
      // }

      console.log("formData: ", ...formData);

      // new Response(formData).text().then(console.log);

      const response: AxiosResponse<never> = await apiInstance({
        method: "POST",
        url: "http://localhost/sgco/api.php/fileupload",
        data: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data;",
          "cache-control": "no-cache",
        },
        // 404 error fixed with: https://github.com/axios/axios/issues/4406#issuecomment-1048693170
        transformRequest: (formData) => formData,
        params: {},
      });

      if (response.status !== 200) {
        throw new Error(
          `Ocorreu um erro no upload do arquivo. Status: ${response.status}`,
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(`Ocorreu um erro no upload do arquivo: ${error.message}`);
    }
  }
}
