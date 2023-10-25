declare module "js-crud-api" {
  import * as jscrudappi from "js-crud-api";
  import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

  const castArray = <T>(a: T | T[]): T[] => (Array.isArray(a) ? a : [a]);

  const prefix = (p: string) => (s: string) => p + s;

  const join =
    (d = ",") =>
    <T>(a: T | T[]): string =>
      castArray(a).join(d);

  const mapN =
    <T>(a: T) =>
    (...f: Array<(arr: T) => T>) =>
      f.reduce((acc, v) => acc.map(v), a);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const pca_join = <T>(key: string, a: T) =>
    mapN(castArray(a))(join(), prefix(key + "="));

  const push = <T>(a: T[], ...v: T[]) => {
    a.push(...v);
    return a;
  };

  const query = (conditions: Record<string, unknown>) =>
    "?" +
    Object.keys(conditions)
      .reduce(
        (acc, key) => push(acc, ...dispatch(key, castArray(conditions[key]))),
        [],
      )
      .join("&");

  const nonMultipleConditions = ["include", "exclude", "page", "size"];

  const dispatch = (key: string, a: unknown) =>
    key === "join"
      ? pca_join(key, a)
      : nonMultipleConditions.includes(key)
      ? [key + "=" + a.join(",")]
      : a.map((v: unknown) => {
          return key + "=" + (v.isArray(v) ? v.join(",") : v);
        });

  // Define a type for the response from the fetch operation
  type FetchResponse<T> = AxiosResponse<T>;

  // Define a type for the configuration object
  interface Config {
    headers: Record<string, string>;
    // Add other properties as needed
  }

  // Define a type for the index function
  type IndexFunction<T> = (
    baseUrl: string,
    config?: Config,
  ) => {
    list: (
      table: string,
      conditions?: Record<string, string | string[]>,
    ) => Promise<FetchResponse<T>>;
    read: (
      table: string,
      ids: string[],
      conditions?: Record<string, string | string[]>,
    ) => Promise<FetchResponse<T>>;
    create: (table: string, data: unknow) => Promise<FetchResponse<T>>;
    update: (
      table: string,
      idOrList: string | string[],
      data: unknow,
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

  // Define the index function
  const index: IndexFunction = (baseUrl, config = {}) => {
    const headers: Record<string, string> = {};

    const _config = (method: string, body: unknow): AxiosRequestConfig => {
      const c = {
        method,
        ...config,
        headers: {
          ...headers,
          ...config.headers,
        },
      };

      console.log(config);

      // todo: manage array of FormData?
      if (body) c.data = body instanceof FormData ? body : JSON.stringify(body);
      return c;
    };

    const url = (parts: string[]): string => [baseUrl, ...parts].join("/");

    const _fetch = async (
      method: string,
      body: unknow,
      parts: string[],
    ): Promise<FetchResponse<T>> => {
      try {
        const response = await axios.request(_config(method, body));
        const data = response.data;
        return response.status === 200 || response.status === 201
          ? await Promise.resolve(data)
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
    ]): Promise<FetchResponse> =>
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
        ids: string[],
        conditions: Record<string, string | string[]> = {},
      ): Promise<FetchResponse<T>> =>
        _readOrList(ids ? [[table, join()(ids)], conditions] : [[table]]),
      create: (table: string, data: unknow): Promise<FetchResponse<T>> =>
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
      register: (
        username: string,
        password: string,
      ): Promise<FetchResponse<T>> =>
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // export default <T>(baseUrl: string, config: Record<string, unknown> = {}) => {
  //   const headers: Record<string, unknown> = {};
  //
  //   const _config = (method: string, body: unknown) => {
  //     const c = {
  //       method,
  //       ...config,
  //       headers: {
  //         ...headers,
  //         ...config.headers,
  //       },
  //     };
  //
  //     if (body) c.body = body instanceof FormData ? body : JSON.stringify(body);
  //     return c;
  //   };
  //
  //   const url = (parts: string[]) => [baseUrl, ...parts].join("/");
  //
  //   const _fetch = async (method: string, body: unknown, parts: string[]) => {
  //     try {
  //       const response = await fetch(url(parts), _config(method, body));
  //       const data = await response.json();
  //       return response.status === 200 || response.ok
  //         ? await Promise.resolve(data)
  //         : await Promise.reject(data);
  //     } catch (e) {
  //       return await Promise.reject(
  //         e.code ? e : { code: -1, message: e.message },
  //       );
  //     }
  //   };
  //
  //   const _readOrList = (args: [string[], Record<string, unknown>]) =>
  //     _fetch(
  //       "GET",
  //       null,
  //       ["records", ...args[0]].concat(args[1] ? [query(args[1])] : []),
  //     );
  //
  //   return {
  //     list: (table: string, conditions: Record<string, unknown> = {}) =>
  //       _readOrList([[table], conditions]),
  //
  //     read: (
  //       table: string,
  //       ids: string[],
  //       conditions: Record<string, unknown> = {},
  //     ) => _readOrList(ids ? [[table, join()(ids)], conditions] : [[table]]),
  //
  //     create: (table: string, data: unknown) =>
  //       _fetch("POST", data, ["records", table]),
  //
  //     update: (table: string, idOrList: string | string[], data: unknown) => {
  //       console.log("method: PUT\ndata: ", data, "\nparts: ", [
  //         "records",
  //         table,
  //         join(idOrList),
  //       ]);
  //       console.log("TESTE");
  //       return _fetch("PUT", data, ["records", table, join(idOrList)]);
  //     },
  //
  //     delete: (table: string, idOrList: string | string[]) =>
  //       _fetch("DELETE", null, ["records", table, join()(idOrList)]),
  //
  //     register: (username: string, password: string) =>
  //       _fetch("POST", { username, password }, ["register"]),
  //
  //     login: (username: string, password: string) =>
  //       _fetch("POST", { username, password }, ["login"]),
  //
  //     logout: () => _fetch("POST", {}, ["logout"]),
  //
  //     password: (username: string, password: string, newPassword: string) =>
  //       _fetch("POST", { username, password, newPassword }, ["password"]),
  //
  //     me: () => _fetch("GET", null, ["me"]),
  //   };
  // };
}
