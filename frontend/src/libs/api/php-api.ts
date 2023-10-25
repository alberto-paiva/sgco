import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosResponseTransformer,
} from "axios";

type FetchResponse<T> = AxiosResponse<T>;

type IndexFunction<T> = (
  baseUrl: string,
  config?: AxiosRequestConfig,
) => {
  list: (
    table: string,
    conditions?: Record<string, string | string[]>,
  ) => Promise<FetchResponse<T>>;
  read: (
    table: string,
    idOrList: string | string[],
    conditions?: Record<string, string | string[]>,
  ) => Promise<FetchResponse<T>>;
  create: (table: string, data: unknown) => Promise<FetchResponse<T>>;
  update: (
    table: string,
    idOrList: string | string[],
    data: unknown,
  ) => Promise<FetchResponse<T>>;
  delete: (
    table: string,
    idOrList: string | string[],
  ) => Promise<FetchResponse<T>>;
  register: (username: string, password: string) => Promise<FetchResponse<T>>;
  login: (username: string, password: string) => Promise<FetchResponse<T>>;
  logout: () => Promise<FetchResponse<T>>;
  password: (
    username: string,
    password: string,
    newPassword: string,
  ) => Promise<FetchResponse<T>>;
  me: () => Promise<FetchResponse<T>>;
};

const castArray = <T>(a: T | T[]): T[] => (Array.isArray(a) ? a : [a]);

const prefix = (p: string) => (s: string) => p + s;

const join =
  (d = ",") =>
  <T>(a: T | T[]): string =>
    castArray(a).join(d);

// const mapN = <T>(a: T | T[], ...f: Array<(arg: T | T[]) => T | T[]>) =>
//   f.reduce((acc, v) => castArray(acc).map(v), a);
const mapN =
  <T>(a: T | T[]) =>
  (...f: Array<(arr: T) => T>) =>
    f.reduce((acc, v) => castArray(acc).map(v), a);

const pcaJoin = (key: string, a: string | string[]) =>
  mapN(castArray(a))(join(), prefix(key + "="));

const push = <T>(a: T[], ...v: T[]): T[] => {
  a.push(...v);
  return a;
};

const query = (conditions: Record<string, string | string[]>) =>
  "?" +
  Object.keys(conditions)
    .reduce<string[]>(
      (acc, key) => push(acc, ...dispatch(key, castArray(conditions[key]))),
      [],
    )
    .join("&");

const nonMultipleConditions = ["include", "exclude", "page", "size"];
const dispatch = (key: string, a: string | string[]) =>
  key === "join"
    ? pcaJoin(key, a)
    : nonMultipleConditions.includes(key)
    ? [key + "=" + castArray(a).join(",")]
    : castArray(a).map((v) => {
        console.log(
          "dispatch: ",
          key + "=" + (Array.isArray(v) ? castArray(v).join(",") : v),
          "v:",
          v,
        );
        return key + "=" + (Array.isArray(v) ? castArray(v).join(",") : v);
      });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const index: IndexFunction<T> = <T>(
  baseUrl: string,
  config: Partial<AxiosRequestConfig> = {},
) => {
  const headers: Record<string, string> = {};
  const params: Record<string, unknown> = {};
  const url = (parts: string[]): string => [baseUrl, ...parts].join("/");

  const _customTransformRequest: AxiosResponseTransformer = (
    reqData,
    reqHeaders,
  ) => {
    if (reqData) {
      reqHeaders["Content-Type"] = "application/json";
      return JSON.stringify(reqData);
    }
    return reqData;
  };

  const _baseConfig = (
    method: string,
    body: unknown,
  ): Partial<AxiosRequestConfig> => {
    const requestConfig: Partial<AxiosRequestConfig> = {
      method,
      maxBodyLength: Infinity,
      ...config,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      responseType: config.responseType ?? "json",
      transformRequest: [_customTransformRequest],
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

    if (config.headers) {
      requestConfig.headers = { ...config.headers };
    }

    if (headers) {
      requestConfig.headers = { ...headers };
    }

    if (config.params) {
      requestConfig.params = { ...config.params };
    }

    if (params) {
      requestConfig.params = { ...params };
    }

    if (body) {
      requestConfig.data =
        body instanceof FormData ? body : JSON.stringify(body);
    }

    return requestConfig;
  };

  const _fetch = async (
    method: string,
    body: unknown,
    parts: string[],
  ): Promise<FetchResponse<T>> => {
    try {
      const conf = { url: url(parts) };
      const apiInstance = axios.create(_baseConfig(method, body));
      const response = await apiInstance(conf);
      const data = response;
      return response.status === 200 || response.status === 201
        ? data
        : await Promise.reject(data);
    } catch (e) {
      return await Promise.reject(
        e.code ? e : { code: -1, message: e.message },
      );
    }
  };

  const _readOrList = ([part1, conditions]: [
    string[],
    Record<string, string | string[]>,
  ]) =>
    _fetch(
      "GET",
      null,
      ["records", ...part1].concat(conditions ? [query(conditions)] : []),
    );

  return {
    list: (
      table: string,
      conditions: Record<string, string | string[]> = {},
    ): Promise<FetchResponse<T>> => _readOrList([[table], conditions]),
    read: (
      table: string,
      idOrList: string | string[],
      conditions: Record<string, string | string[]> = {},
    ): Promise<FetchResponse<T>> =>
      _readOrList(
        idOrList
          ? [[table, join()(idOrList)], conditions]
          : [[table], conditions],
      ),
    create: (table: string, data: unknown): Promise<FetchResponse<T>> =>
      _fetch("POST", data, ["records", table]),
    update: (
      table: string,
      idOrList: string | string[],
      data: unknown,
    ): Promise<FetchResponse<T>> =>
      _fetch("PUT", data, ["records", table, join()(idOrList)]),
    delete: (
      table: string,
      idOrList: string | string[],
    ): Promise<FetchResponse<T>> =>
      _fetch("DELETE", null, ["records", table, join()(idOrList)]),
    register: (username: string, password: string): Promise<FetchResponse<T>> =>
      _fetch("POST", { username, password }, ["register"]),
    login: (username: string, password: string): Promise<FetchResponse<T>> =>
      _fetch("POST", { username, password }, ["login"]),
    logout: (): Promise<FetchResponse<T>> => _fetch("POST", {}, ["logout"]),
    password: (
      username: string,
      password: string,
      newPassword: string,
    ): Promise<FetchResponse<T>> =>
      _fetch("POST", { username, password, newPassword }, ["password"]),
    me: (): Promise<FetchResponse<T>> => _fetch("GET", null, ["me"]),
  };
};

export default index;

// import axios, {
//   type AxiosInstance,
//   type AxiosRequestConfig,
//   type AxiosResponse,
//   type AxiosResponseTransformer,
// } from "axios";
//
// type FetchResponse<T> = AxiosResponse<T>;
//
// type IndexFunction<T> = (
//   baseUrl: string,
//   config?: AxiosRequestConfig,
// ) => {
//   list: (
//     table: string,
//     conditions?: Record<string, unknown>,
//   ) => Promise<FetchResponse<T>>;
//   read: (
//     table: string,
//     idOrList: string | string[],
//     conditions?: Record<string, unknown>,
//   ) => Promise<FetchResponse<T>>;
//   create: (table: string, data: unknown) => Promise<FetchResponse<T>>;
//   update: (
//     table: string,
//     idOrList: string | string[],
//     data: unknown,
//   ) => Promise<FetchResponse<T>>;
//   delete: (
//     table: string,
//     idOrList: string | string[],
//   ) => Promise<FetchResponse<T>>;
//   register: (username: string, password: string) => Promise<FetchResponse<T>>;
//   login: (username: string, password: string) => Promise<FetchResponse<T>>;
//   logout: () => Promise<FetchResponse<T>>;
//   password: (
//     username: string,
//     password: string,
//     newPassword: string,
//   ) => Promise<FetchResponse<T>>;
//   me: () => Promise<FetchResponse<T>>;
// };
//
// const castArray = <T>(a: T | T[]): T[] => (Array.isArray(a) ? a : [a]);
//
// const join =
//   (d = ",") =>
//   <T>(a: T | T[]): string =>
//     castArray(a).join(d);
//
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-expect-error
// const index: IndexFunction<T> = <T>(
//   baseUrl: string,
//   config: Partial<AxiosRequestConfig> = {},
// ) => {
//   const headers: Record<string, string> = {};
//   const params: Record<string, unknown> = {};
//   const url = (parts: string[]): string => [baseUrl, ...parts].join("/");
//
//   // Default JSON Transformer for request data
//   const _customTransformRequest: AxiosResponseTransformer = (
//     reqData,
//     reqHeaders,
//   ) => {
//     if (reqData) {
//       reqHeaders["Content-Type"] = "application/json";
//       return JSON.stringify(reqData);
//     }
//     return reqData;
//   };
//
//   const _baseConfig = (
//     method: string,
//     body: unknown,
//   ): Partial<AxiosRequestConfig> => {
//     const requestConfig: Partial<AxiosRequestConfig> = {
//       method,
//       maxBodyLength: Infinity,
//       ...config,
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json;charset=UTF-8",
//       },
//       responseType: config.responseType ?? "json",
//       transformRequest: [_customTransformRequest],
//       transformResponse: [
//         (response) => {
//           const hasRecordsKey = Object.prototype.hasOwnProperty.call(
//             JSON.parse(response),
//             "records",
//           );
//           return hasRecordsKey
//             ? JSON.parse(response).records
//             : JSON.parse(response);
//         },
//       ],
//     };
//
//     if (config.headers) {
//       requestConfig.headers = { ...config.headers };
//     }
//
//     if (headers) {
//       requestConfig.headers = { ...headers };
//     }
//
//     if (config.params) {
//       requestConfig.params = { ...config.params };
//     }
//
//     if (params) {
//       requestConfig.params = { ...params };
//     }
//
//     if (body) {
//       requestConfig.data =
//         body instanceof FormData ? body : JSON.stringify(body);
//     }
//
//     return requestConfig;
//   };
//
//   const _fetch = async (
//     method: string,
//     body: unknown,
//     parts: string[],
//   ): Promise<FetchResponse<T>> => {
//     try {
//       const conf = { url: url(parts) };
//       const apiInstance: AxiosInstance = axios.create(
//         _baseConfig(method, body),
//       );
//       const response = await apiInstance(conf);
//       const data = response.data;
//       console.log("php-api: ", data, "\nstatus: ", response.status);
//       return response.status === 200 || response.status === 201
//         ? await Promise.resolve(data)
//         : await Promise.reject(data);
//     } catch (e) {
//       return await Promise.reject(
//         e.code ? e : { code: -1, message: e.message },
//       );
//     }
//   };
//
//   const _readOrList = ([part1, conditions]: [
//     string[],
//     Record<string, unknown>,
//   ]): Promise<FetchResponse<T>> =>
//     _fetch(
//       "GET",
//       null,
//       ["records", ...part1].concat(conditions ? [query(conditions)] : []),
//     );
//
//   const query = (conditions: Record<string, unknown>): string => {
//     const nonMultipleConditions = ["include", "exclude", "page", "size"];
//     const params = Object.keys(conditions).map((key) => {
//       if (key === "join") {
//         return `${key}=${castArray(conditions[key]).join(",")}`;
//       } else if (nonMultipleConditions.includes(key)) {
//         return `${key}=${castArray(conditions[key]).join(",")}`;
//       } else {
//         return `${key}=${
//           Array.isArray(conditions[key])
//             ? castArray(conditions[key]).join(",")
//             : conditions[key]
//         }`;
//       }
//     });
//     return "?" + params.join("&");
//   };
//
//   return {
//     list: (
//       table: string,
//       conditions: Record<string, unknown> = {},
//     ): Promise<FetchResponse<T>> => _readOrList([[table], conditions]),
//     read: (
//       table: string,
//       idOrList: string | string[],
//       conditions: Record<string, unknown> = {},
//     ): Promise<FetchResponse<T>> =>
//       _readOrList(
//         idOrList
//           ? [[table, join()(idOrList)], conditions]
//           : [[table], conditions],
//       ),
//     create: (table: string, data: unknown): Promise<FetchResponse<T>> =>
//       _fetch("POST", data, ["records", table]),
//     update: (
//       table: string,
//       idOrList: string | string[],
//       data: unknown,
//     ): Promise<FetchResponse<T>> =>
//       _fetch("PUT", data, ["records", table, join()(idOrList)]),
//     delete: (
//       table: string,
//       idOrList: string | string[],
//     ): Promise<FetchResponse<T>> =>
//       _fetch("DELETE", null, ["records", table, join()(idOrList)]),
//     register: (username: string, password: string): Promise<FetchResponse<T>> =>
//       _fetch("POST", { username, password }, ["register"]),
//     login: (username: string, password: string): Promise<FetchResponse<T>> =>
//       _fetch("POST", { username, password }, ["login"]),
//     logout: (): Promise<FetchResponse<T>> => _fetch("POST", {}, ["logout"]),
//     password: (
//       username: string,
//       password: string,
//       newPassword: string,
//     ): Promise<FetchResponse<T>> =>
//       _fetch("POST", { username, password, newPassword }, ["password"]),
//     me: (): Promise<FetchResponse<T>> => _fetch("GET", null, ["me"]),
//   };
// };
//
// export default index;
