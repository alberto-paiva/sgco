// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponseTransformer,
} from "axios";

export const baseUrl = "http://localhost/sgco";
export const baseApi = "/api.php/records";

// Default JSON Transformer for request data
const customTransformRequest: AxiosResponseTransformer = (
  reqData,
  reqHeaders,
) => {
  if (reqData) {
    reqHeaders["Content-Type"] = "application/json";
    return JSON.stringify(reqData);
  }
  return reqData;
};

const baseConfig: Partial<AxiosRequestConfig> = {
  method: "GET",
  maxBodyLength: Infinity,
  baseURL: baseUrl,
  headers: { "content-type": "application/octet-stream" },
  responseType: "json",
  transformRequest: [customTransformRequest],
  transformResponse: [
    (response) => {
      const hasRecordsKey = Object.prototype.hasOwnProperty.call(
        JSON.parse(response),
        "records",
      );
      return hasRecordsKey
        ? JSON.parse(response).records
        : JSON.parse(response);
    },
  ],
};

export const apiInstance: AxiosInstance = axios.create(baseConfig);
