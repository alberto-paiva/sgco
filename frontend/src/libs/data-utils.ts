import { useReducer } from "react";

export const useDataReducer = <T>() => {
  interface State<T> {
    data: T | null;
    dataArray: T[] | null;
    loading: boolean;
    error: string;
  }

  type Action =
    | { type: "FETCH_DATA_REQUEST" }
    | { type: "FETCH_DATA_SUCCESS"; payload: T | null }
    | { type: "FETCH_DATA_ARRAY_SUCCESS"; payload: T[] | null }
    | { type: "FETCH_DATA_FAILURE"; payload: string };

  const initialState: State<T> = {
    data: null,
    dataArray: null,
    loading: false,
    error: "",
  };

  const reducer = (state: State<T>, action: Action): State<T> => {
    switch (action.type) {
      case "FETCH_DATA_REQUEST":
        return { ...state, loading: true };
      case "FETCH_DATA_SUCCESS":
        return { ...state, data: action.payload, loading: false };
      case "FETCH_DATA_ARRAY_SUCCESS":
        return { ...state, dataArray: action.payload, loading: false };
      case "FETCH_DATA_FAILURE":
        return { ...state, error: action.payload, loading: false };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch };
};
