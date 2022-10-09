import { jest } from "@jest/globals";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { COOKIE_ACCESS_TOKEN } from "src/const.js";
import { configureHttpClient } from "src/core/functions/configure-http-client.js";
import { CookieService } from "src/core/services/cookie.service.js";
import {
  ApiResponse,
  getDefaultApiResponseObj,
  HttpClient,
  retryPromise,
} from "src/core/services/http-client.js";
import { LONG_EXPIRY_JWT_TOKEN } from "../../utils/const.js";
import { navigatorOnline } from "../../utils/spy-on/navigator.spy.js";

const mock = new MockAdapter(axios);
const request = {
  success: {
    url: "/api/test-api",
    responseBody: {
      message: "Success",
    },
  },
  badRequest: {
    url: "/api/400-response",
    responseBody: {},
  },
  badRequestWithResponse: {
    url: "/api/400-response-with-body",
    responseBody: {
      message: "This is test error message",
    },
  },
  withAuth: {
    url: "/api/with-auth",
    responseBody: {},
  },
  badRequestWithMultipleResponseMessage: {
    url: "/api/400-response-with-multiple-message",
    responseBody: {
      message: ["This is test error message", "This is another test error message"],
    },
  },
};

configureHttpClient();

describe("HttpClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();
    navigatorOnline(true);
    configureHttpClient();
  });

  afterEach(() => {
    configureHttpClient();
  });

  it("Should return ApiResponse.status 200 when success api response", async () => {
    mock.onGet(request.success.url).replyOnce(200, request.success.responseBody);
    const apiResponse = await HttpClient.get<Record<string, any>>(request.success.url);
    expect(apiResponse.status).toEqual(200);
  });

  it("Should return ApiResponse.status 0 when internet not available", async () => {
    navigatorOnline(false);
    mock.onGet(request.success.url).replyOnce(200, request.success.responseBody);
    const apiResponse = await HttpClient.get(request.success.url);
    expect(apiResponse.status).toEqual(0);
  });

  it("Should return ApiResponse.status 400 when api will return 400 status and data should be null", async () => {
    mock.onGet(request.badRequest.url).replyOnce(400, request.badRequest.responseBody);
    const apiResponse = await HttpClient.get(request.badRequest.url);
    expect(apiResponse.status).toEqual(400);
    expect(apiResponse.data).toStrictEqual(null);
  });

  it("Should return response body in ApiResponse.data when HttpClientOptions.sendResponseWhenError true", async () => {
    mock
      .onGet(request.badRequestWithResponse.url)
      .replyOnce(400, request.badRequestWithResponse.responseBody);
    const apiResponse = await HttpClient.get(request.badRequestWithResponse.url, {
      sendResponseWhenError: true,
    });
    expect(apiResponse.status).toEqual(400);
    expect(apiResponse.data).toStrictEqual(request.badRequestWithResponse.responseBody);
  });

  it("Should set Authentication Header when HttpClientOptions.isAuth true", async () => {
    mock
      .onGet(request.badRequestWithResponse.url)
      .replyOnce(400, request.badRequestWithResponse.responseBody);
    window.document.cookie = `${COOKIE_ACCESS_TOKEN}=${LONG_EXPIRY_JWT_TOKEN}`;
    const apiResponse = await HttpClient.get(request.success.url, { isAuth: true });
    expect(apiResponse.response?.config.headers?.Authorization).toEqual(
      `Bearer ${LONG_EXPIRY_JWT_TOKEN}`,
    );
  });

  it("Should return 401 status response when HttpClient.handleRefreshTokenFlow undefined and 401 server response", async () => {
    mock.onGet(request.success.url).reply(401, request.success.responseBody);
    CookieService.set(COOKIE_ACCESS_TOKEN, LONG_EXPIRY_JWT_TOKEN);
    HttpClient.handleRefreshTokenFlow = undefined;
    const apiResponse = await HttpClient.get(request.success.url, { isAuth: true });
    expect(apiResponse.status).toBe(401);
  });

  it("Should call HttpClient.handleRefreshTokenFlow token when 401 server response", async () => {
    mock.onGet(request.success.url).reply(401, request.success.responseBody);
    window.document.cookie = `${COOKIE_ACCESS_TOKEN}=${LONG_EXPIRY_JWT_TOKEN}`;
    const mockFn = jest.fn<() => Promise<ApiResponse<unknown>>>(() => {
      return Promise.resolve(getDefaultApiResponseObj());
    });
    HttpClient.handleRefreshTokenFlow = mockFn;
    await HttpClient.get(request.success.url, { isAuth: true });
    expect(mockFn).toBeCalled();
  });

  it("Should retryPromise retry number of specified times", async () => {
    const obj = {
      promiseFn: () => {
        return new Promise((resolve, reject) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject();
        });
      },
    };
    const maxRetries = 3;
    const spyPromiseFn = jest.spyOn(obj, "promiseFn");
    try {
      await retryPromise(obj.promiseFn, 100, maxRetries);
    } catch {}
    expect(spyPromiseFn).toBeCalledTimes(maxRetries);
  });

  it("Should return message when api will return message", async () => {
    mock.onGet(request.success.url).replyOnce(200, request.success.responseBody);
    const apiResponse = await HttpClient.get<Record<string, any>>(request.success.url);
    expect(apiResponse.message).toEqual([request.success.responseBody.message]);
  });

  it("Should return multiple error message when api will return", async () => {
    mock
      .onGet(request.badRequestWithMultipleResponseMessage.url)
      .replyOnce(400, request.badRequestWithMultipleResponseMessage.responseBody);
    const apiResponse = await HttpClient.get(request.badRequestWithMultipleResponseMessage.url);
    expect(apiResponse.status).toEqual(400);
    expect(JSON.stringify(apiResponse.message)).toStrictEqual(
      JSON.stringify(request.badRequestWithMultipleResponseMessage.responseBody.message),
    );
  });
});
