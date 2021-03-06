import { AnyAction } from "redux";

export enum governmentActions {
  SET_GOVT_PARAMETER = "SET_GOVT_PARAMETER",
  MULTI_SET_GOVT_PARAMETERS = "MULTI_SET_GOVT_PARAMETERS",
  ADD_GOVERNMENT_DATA = "ADD_GOVERNMENT_DATA",
}

export const setGovernmentParameter = (paramName: string, paramValue: any): AnyAction => {
  return {
    type: governmentActions.SET_GOVT_PARAMETER,
    paramName,
    paramValue,
  };
};

export const multiSetGovtParameters = (paramsObj: object): AnyAction => {
  return {
    type: governmentActions.MULTI_SET_GOVT_PARAMETERS,
    params: paramsObj,
  };
};

export const addGovernmentData = (governmentDataKey: string, governmentDataValue: string): AnyAction => {
  return {
    type: governmentActions.ADD_GOVERNMENT_DATA,
    data: {
      key: governmentDataKey,
      value: governmentDataValue,
    },
  };
};
