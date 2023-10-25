import { IMAGE_UPLOAD_BASE_URL } from "libs/utils.ts";

/**
 * Check if image exists in server
 *
 * @see https://stackoverflow.com/a/18837750
 *
 */
export function fileExistsOnServer(imageUrl?: string | URL) {
  if (!imageUrl) return false;

  const http = new XMLHttpRequest();

  http.open("HEAD", imageUrl, false);
  http.send();

  return http.status !== 404;
}

export async function createFileFromUrl(url: string): Promise<File> {
  const response = await fetch(url);
  const data = await response.blob();
  const metadata = { type: data.type };
  const filename = url.replace(/\?.+/, "").split("/").pop() ?? "unknown";
  return new File([data], filename, metadata);
}

export const downloadFile = ({
  data,
  fileName,
  fileType,
}: {
  data: string;
  fileName: string;
  fileType: string;
}): void => {
  const blob = new Blob([data], { type: fileType });

  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

// export interface ImageFromServerProps {
//   imageName: string;
//   uuid: string;
// }
export function getImageUrlOnServer(
  imageName?: string,
  uuid?: string,
): string | undefined {
  if (imageName && uuid) {
    const imageUrl = `${IMAGE_UPLOAD_BASE_URL}${uuid}/${imageName}`;

    if (fileExistsOnServer(imageUrl)) {
      return imageUrl;
    } else {
      return undefined;
    }
  }
  return undefined;
}
