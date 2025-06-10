/**
 * API Client
 *
 * Base HTTP client with request/response interceptors,
 * error handling, and authentication management.
 */

import {
  API_BASE_URLS,
  TIMEOUTS,
  DEFAULT_HEADERS,
  RETRY_CONFIG,
} from "@/config/api";
import { STORAGE_KEYS } from "@/config/environment";
import { ApiError, NetworkError, AuthenticationError } from "./errors";
import type {
  ApiClientConfig,
  ApiResponse,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from "./types";

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || API_BASE_URLS.MAIN;
    this.defaultHeaders = { ...DEFAULT_HEADERS, ...config.headers };
    this.timeout = config.timeout || TIMEOUTS.DEFAULT;

    // Add default interceptors
    this.addDefaultInterceptors();
  }

  /**
   * Add default request and response interceptors
   */
  private addDefaultInterceptors(): void {
    // Request interceptor to add auth token
    this.addRequestInterceptor((config) => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    });

    // Response interceptor for error handling
    this.addResponseInterceptor(
      (response) => response,
      async (error) => {
        if (error.status === 401) {
          // Handle token refresh or redirect to login
          await this.handleUnauthorizedError();
        }
        throw error;
      },
    );
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(
    onFulfilled?: ResponseInterceptor,
    onRejected?: (error: any) => any,
  ): void {
    this.responseInterceptors.push((response) => {
      try {
        return onFulfilled ? onFulfilled(response) : response;
      } catch (error) {
        return onRejected ? onRejected(error) : Promise.reject(error);
      }
    });
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(
    config: RequestConfig,
  ): Promise<RequestConfig> {
    let modifiedConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }

    return modifiedConfig;
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors(
    response: Response,
  ): Promise<Response> {
    let modifiedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }

    return modifiedResponse;
  }

  /**
   * Handle unauthorized errors
   */
  private async handleUnauthorizedError(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    // Redirect to login or trigger re-authentication
    window.location.href = "/login";
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    let lastError: Error;

    // Apply request interceptors
    const requestConfig = await this.applyRequestInterceptors({
      ...config,
      headers: { ...this.defaultHeaders, ...config.headers },
    });

    for (let attempt = 0; attempt <= RETRY_CONFIG.MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...requestConfig,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Apply response interceptors
        const processedResponse =
          await this.applyResponseInterceptors(response);

        if (!processedResponse.ok) {
          throw new ApiError(
            `HTTP ${processedResponse.status}`,
            processedResponse.status,
            await processedResponse.text(),
          );
        }

        const data = await this.parseResponse<T>(processedResponse);

        return {
          data,
          status: processedResponse.status,
          headers: processedResponse.headers,
          config: requestConfig,
        };
      } catch (error) {
        lastError = error as Error;

        if (error instanceof DOMException && error.name === "AbortError") {
          throw new NetworkError("Request timeout");
        }

        if (error instanceof ApiError && error.status === 401) {
          throw new AuthenticationError("Authentication required");
        }

        // Don't retry on client errors (4xx) except 429 (rate limit)
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500 &&
          error.status !== 429
        ) {
          throw error;
        }

        // Wait before retrying
        if (attempt < RETRY_CONFIG.MAX_RETRIES) {
          const delay =
            RETRY_CONFIG.RETRY_DELAY *
            Math.pow(RETRY_CONFIG.RETRY_MULTIPLIER, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json();
    }

    if (contentType?.includes("text/")) {
      return response.text() as unknown as T;
    }

    return response.blob() as unknown as T;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const response = await this.makeRequest<T>(endpoint, {
      ...config,
      method: "GET",
    });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {},
  ): Promise<T> {
    const response = await this.makeRequest<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {},
  ): Promise<T> {
    const response = await this.makeRequest<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {},
  ): Promise<T> {
    const response = await this.makeRequest<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const response = await this.makeRequest<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
    return response.data;
  }

  /**
   * Upload file
   */
  async upload<T>(
    endpoint: string,
    file: File,
    config: RequestConfig = {},
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.makeRequest<T>(endpoint, {
      ...config,
      method: "POST",
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        ...Object.fromEntries(
          Object.entries(config.headers || {}).filter(
            ([key]) => key.toLowerCase() !== "content-type",
          ),
        ),
      },
    });
    return response.data;
  }

  /**
   * Download file
   */
  async download(endpoint: string, config: RequestConfig = {}): Promise<Blob> {
    const response = await this.makeRequest<Blob>(endpoint, {
      ...config,
      method: "GET",
    });
    return response.data;
  }
}

// Default API client instance
export const apiClient = new ApiClient();

// Specialized API clients for different services
export const authApiClient = new ApiClient({
  baseURL: API_BASE_URLS.AUTH,
});

export const storageApiClient = new ApiClient({
  baseURL: API_BASE_URLS.STORAGE,
  timeout: TIMEOUTS.UPLOAD,
});

export const aiApiClient = new ApiClient({
  baseURL: API_BASE_URLS.AI,
  timeout: TIMEOUTS.AI,
});
