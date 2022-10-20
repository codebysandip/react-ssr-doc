import { AxiosError, AxiosResponse } from "axios";
import { COOKIE_ACCESS_TOKEN, INTERNET_NOT_AVAILABLE } from "src/const.js";
import { CommonService } from "../services/common.service.js";
import { CookieService } from "../services/cookie.service.js";
import { HttpClient } from "../services/http-client.js";

export function getAxiosResponseFromResponse(response: AxiosResponse<any> | AxiosError<any>) {
  let resp: AxiosResponse | undefined;
  if (!(response as AxiosError).isAxiosError) {
    resp = response as AxiosResponse<any>;
  } else {
    resp = (response as AxiosError<any>).response;
  }
  return resp;
}

export function configureHttpClient() {
  HttpClient.getStatusCode = (response: AxiosResponse<any> | AxiosError<any>) => {
    const resp = getAxiosResponseFromResponse(response);
    return resp?.data.status || resp?.status || 0;
  };

  /**
   * To process message by your own replace this function code
   * with your own code
   */
  HttpClient.processMessage = (response: AxiosResponse<any> | AxiosError<any>) => {
    const resp = getAxiosResponseFromResponse(response);

    const data: any = resp?.data;
    let message: string[] = [];
    const status: number = (data && data.statusCode) || resp?.status;

    if (status < 400) {
      const successMessage = data && data.message;
      if (typeof successMessage === "string") {
        message.push(successMessage);
      }
    } else {
      const errorMessage = data && data.message;
      if (typeof errorMessage === "string") {
        message.push(errorMessage);
      } else if (Array.isArray(errorMessage) && typeof errorMessage[0] === "string") {
        message = errorMessage;
      }
    }
    return message;
  };
  /**
   * Replace this function body with your own code if api return different type of response
   * While replacing remember that this function will get called for success as well as error response
   * @param response AjaxResponse<any> | AjaxError
   * @returns Api Response
   */
  HttpClient.processData = (response: AxiosResponse<any> | AxiosError<any>) => {
    const resp = getAxiosResponseFromResponse(response);

    const data: any = resp?.data;
    // can check instanceOf to know response type
    // some api send data in response and data field contain actual data
    return data?.data || data;
  };

  HttpClient.getErrorCode = (response: AxiosResponse<any> | AxiosError<any>) => {
    const resp = getAxiosResponseFromResponse(response);
    const data: any = resp?.data;
    return data?.errorCode || -1;
  };

  HttpClient.getStatusCode = (response: AxiosResponse<any> | AxiosError<any>) => {
    const resp = getAxiosResponseFromResponse(response);
    return resp?.data?.status || resp?.status || 0;
  };

  HttpClient.onResponse = (apiResponse, options) => {
    if (apiResponse.isError && apiResponse.message.length && options.showNotificationMessage) {
      CommonService.toast({
        type: "error",
        message: apiResponse.message[0],
      });
    }
  };

  HttpClient.getAuthToken = (options) => {
    return CookieService.get(COOKIE_ACCESS_TOKEN, options.nodeReqObj) || "";
  };

  HttpClient.getAuthHeader = (token) => {
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  HttpClient.internetNotAvailableMsg = INTERNET_NOT_AVAILABLE;

  HttpClient.setUrl = (url) => {
    return `${process.env.IS_SERVER ? `http://localhost:${process.env.PORT || 5000}` : ""}${url}`;
  };
}
