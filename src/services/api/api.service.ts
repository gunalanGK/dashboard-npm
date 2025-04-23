"use client";

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import Cookies from "js-cookie";
import Config from "@/config/index";
import { Constants, AuthRoutes, AccessTokenRevokeMessage } from "@/constants";
import { ObjectKeyAny, ObjectKeyString } from "@/types/common";
import amplifyService from "@/services/aws/aws-services";

import { CustomGet } from "../lodash.service";

import {
  deleteCookies,
  getCookie,
  mainNavigation,
  setCookie,
} from "../common.service";

import { handleSignOut } from "../aws/aws-helpers";
import { ErrorMessage } from "@/utils/errorMessage";

/**
 * <---------------- Import Ends Here ---------------->
 */

const { unAuthorizedErrorCode, commonHeader } = Constants;

const loginBaseUrl: string = `${process.env.NEXT_PUBLIC_DOMAIN_URL}`;

const headers: {
  headers: {
    withCredentials: boolean;
    "Cache-Control": string;
  };
} = {
  headers: {
    withCredentials: true,
    "Cache-Control": "no-cache",
  },
};

const cookies: { [key: string]: any } = Cookies.get();

let accessToken: string = "";

if (typeof cookies === "object" && Object.entries(cookies).length) {
  Object?.entries(cookies)?.forEach(([key, value]) => {
    if (key.endsWith("accessToken")) {
      accessToken = value;
    }
  });
}

let url = "";
if (typeof window !== "undefined") {
  url = window.location.href;
}

const checkNavigate = (errorCode: number, errMsg: string) => {
  const isAccessRevoked = errMsg === AccessTokenRevokeMessage;
  if (isAccessRevoked || (errorCode === unAuthorizedErrorCode && !isOpenPage)) {
    isAccessRevoked ? deleteCookies() : null;
    mainNavigation(loginBaseUrl, AuthRoutes.login);
  }
};

const isOpenPage: boolean =
  url.includes("invite-user") ||
  url.includes("mailOpened") ||
  url.includes("/email?");

// axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  async (req: any) => {
    const tenantId =
      window.location.pathname
        .split("/")
        .find((mapData: string) => parseInt(mapData)) ??
      getCookie(Constants.workspaceId)[1];
    if (!req.headers["x-tenant-id"]) {
      req.headers["x-tenant-id"] = tenantId ? tenantId.toString() : "";
    }
    const accessToken: [string, string] = getCookie("accessToken");
    req["headers"]["authorization"] = `${accessToken[1]}`;
    return {
      ...req,
    };
  },
  (error: AxiosError) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const url: string = CustomGet(error.config, "url", "");
    const splitUrl: string[] = url.split("/");
    if (
      ((error.response?.data as ObjectKeyAny)?.message ?? "") ===
        ErrorMessage.jwtExpired ||
      ((error.response?.data as ObjectKeyAny)?.message ?? "") ===
        ErrorMessage.notLogin
    ) {
      const count = getCookie("count");
      if (count[1] === "1") {
        await handleSignOut();
        setCookie("count", "0", 0);
        if (!window.location.href.includes("auth/"))
          window.location.pathname = AuthRoutes.login;
      }
      await amplifyService.fetchAuthSession();
      if (!window.location.href.includes("auth/")) {
        setCookie("count", "1", 1);
        window.location.reload();
      }
    }
    if (error.response?.status === 401 && !splitUrl.includes("validate-user")) {
      window.location.reload();
    }
    return Promise.reject(error.response);
  }
);

export const getCall: any = async (
  endpoint: string,
  params: object | string | null
) => {
  try {
    const response = await axios.get(`${Config.apiUrl}${endpoint}`, {
      headers: commonHeader,
      params,
    });
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const notificaitonGetCall: any = async (
  endpoint: string,
  params: object | string | null
) => {
  try {
    const response = await axios.get(
      `${Config.notificationApiUrl}${endpoint}`,
      {
        headers: commonHeader,
        params,
      }
    );
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const notificaitonPostCall: any = async (
  endpoint: string,
  payload: unknown,
  config: AxiosRequestConfig
) => {
  try {
    const response = await axios.post(
      `${Config.notificationApiUrl}${endpoint}`,
      payload,
      {
        ...config,
        ...headers,
      }
    );
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const notificaitonPutCall: any = async (
  endpoint: string,
  payload: unknown,
  config: AxiosRequestConfig
) => {
  try {
    const response = await axios.put(
      `${Config.notificationApiUrl}${endpoint}`,
      payload,
      {
        ...config,
        ...headers,
      }
    );
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const notificationDeleteCall: any = async (
  endpoint: string,
  payload: any,
  params: unknown
) => {
  try {
    const response = await axios.delete(
      `${Config.notificationApiUrl}${endpoint}`,
      {
        params,
        data: { ...payload },
      }
    );
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const postCall: any = async (
  endpoint: string,
  payload: unknown,
  config: AxiosRequestConfig
) => {
  try {
    const response = await axios.post(`${Config.apiUrl}${endpoint}`, payload, {
      ...config,
      ...headers,
    });
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const putCall: any = async (
  endpoint: string,
  payload: unknown,
  config: AxiosRequestConfig
) => {
  try {
    const response = await axios.put(`${Config.apiUrl}${endpoint}`, payload, {
      ...config,
      ...headers,
    });
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const patchCall: any = async (
  endpoint: string,
  payload: unknown,
  config: AxiosRequestConfig
) => {
  try {
    const response = await axios.patch(`${Config.apiUrl}${endpoint}`, payload, {
      ...config,
      ...headers,
    });
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const deleteCall: any = async (endpoint: string, params: unknown) => {
  try {
    const response = await axios.delete(`${Config.apiUrl}${endpoint}`, {
      params,
    });
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const clientApiPostCall: any = async (
  endpoint: string,
  payload: unknown,
  config: AxiosRequestConfig
) => {
  try {
    const response = await axios.post(
      `${Config.clientApiUrl}${endpoint}`,
      payload,
      {
        ...config,
        ...headers,
      }
    );
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const clientApiGetCall: any = async (
  endpoint: string,
  params: object | string | null,
  optionalHeaders: ObjectKeyString = {}
) => {
  try {
    const response = await axios.get(`${Config.clientApiUrl}${endpoint}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        ...optionalHeaders,
      },
      params,
    });
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const clientApiPutCall: any = async (
  endpoint: string,
  payload: unknown,
  config: AxiosRequestConfig
) => {
  try {
    const response = await axios.put(
      `${Config.clientApiUrl}${endpoint}`,
      payload,
      {
        ...config,
        ...headers,
      }
    );
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const clientApiPatchCall: any = async (
  endpoint: string,
  payload: unknown,
  config: AxiosRequestConfig
) => {
  try {
    const response = await axios.patch(
      `${Config.clientApiUrl}${endpoint}`,
      payload,
      {
        ...config,
        ...headers,
      }
    );
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const clientApiDeleteCall: any = async (
  endpoint: string,
  payload: any,
  params: unknown
) => {
  try {
    const response = await axios.delete(`${Config.clientApiUrl}${endpoint}`, {
      params,
      data: { ...payload },
    });
    return response;
  } catch (err) {
    const apiErrorCode: number = CustomGet(err, "data.apiErrorCode", 0);
    checkNavigate(apiErrorCode, CustomGet(err, "data.message", ""));
    return err;
  }
};

export const getAuthHeaders = () => {
  const tenantId =
    window.location.pathname
      .split("/")
      .find((mapData: string) => parseInt(mapData)) ??
    getCookie(Constants.workspaceId)[1];

  const accessToken: [string, string] = getCookie("accessToken");

  return {
    ["x-tenant-id"]: tenantId ? tenantId.toString() : "",
    ["authorization"]: `${accessToken[1]}`,
  };
};
