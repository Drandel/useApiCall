import { use, useReducer } from "react";

const DEFAULT_STATE = {
  loading: false,
  data: null,
  error: null,
};

const CALL_STATES = {
  FETCHING: "FETCHING",
  RECEIVED: "RECEIVED",
  ERROR: "ERROR",
};

function apiCallReducer(state, action) {
  const { type, data, error } = action;
  switch (type) {
    case CALL_STATES.FETCHING:
      return {
        ...state,
        loading: true,
        data: null,
        error: null,
      };
    case CALL_STATES.RECEIVED:
      return {
        ...state,
        loading: false,
        data,
        error: null,
      };
    case CALL_STATES.ERROR:
      return {
        ...state,
        loading: false,
        error,
      };
    default:
      return state;
  }
}

function useAPICallHook(
  callFn,
  fetchingCallback = () => {},
  responseCallback = () => {},
  errorCallback = () => {}
) {
  const [state, dispatch] = useReducer(apiCallReducer, DEFAULT_STATE);
  const { isLoading, data, error } = state;

  const call = async (...callArgs) => {
    dispatch({ type: CALL_STATES.FETCHING });
    fetchingCallback(...callArgs);
    let response = null;
    try {
      const response = await callFn(...callArgs);
      dispatch({ type: CALL_STATES.RECEIVED, data: response });
      responseCallback(response);
    } catch (e) {
      dispatch({ type: CALL_STATES.ERROR, e });
      errorCallback(e);
    }
    return response;
  };
  return { isLoading, data, error, call };
}

export default function useAPICall(callFn) {
  return useAPICallHook(callFn);
}

export function useAPICallWithSideEffects(
  callFn,
  fetchingCallbackFn,
  responseCallbackFn,
  errorCallbackFn
) {
  return useAPICallHook(
    callFn,
    fetchingCallbackFn,
    responseCallbackFn,
    errorCallbackFn
  );
}
