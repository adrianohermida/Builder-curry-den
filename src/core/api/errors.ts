/**
 * API Error Classes
 *
 * Custom error classes for handling different types of API errors
 * with proper typing and error context.
 */

import type { ApiErrorResponse } from "./types";

/**
 * Base API Error class
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: any;
  public readonly timestamp?: string;
  public readonly path?: string;

  constructor(
    message: string,
    status: number = 500,
    response?: string | ApiErrorResponse,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;

    if (typeof response === "string") {
      this.details = response;
    } else if (response) {
      this.code = response.code;
      this.details = response.details;
      this.timestamp = response.timestamp;
      this.path = response.path;
    }

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Get error as plain object for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      path: this.path,
      stack: this.stack,
    };
  }
}

/**
 * Network Error - for connection issues
 */
export class NetworkError extends ApiError {
  constructor(message: string = "Network connection failed") {
    super(message, 0);
    this.name = "NetworkError";
  }
}

/**
 * Timeout Error - for request timeouts
 */
export class TimeoutError extends ApiError {
  constructor(message: string = "Request timeout") {
    super(message, 408);
    this.name = "TimeoutError";
  }
}

/**
 * Authentication Error - for 401 errors
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = "Authentication required") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

/**
 * Authorization Error - for 403 errors
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = "Access forbidden") {
    super(message, 403);
    this.name = "AuthorizationError";
  }
}

/**
 * Not Found Error - for 404 errors
 */
export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

/**
 * Validation Error - for 400/422 errors
 */
export class ValidationError extends ApiError {
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(
    message: string = "Validation failed",
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message, 422);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }

  /**
   * Get error as plain object for logging
   */
  toJSON() {
    return {
      ...super.toJSON(),
      fieldErrors: this.fieldErrors,
    };
  }
}

/**
 * Conflict Error - for 409 errors
 */
export class ConflictError extends ApiError {
  constructor(message: string = "Resource conflict") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

/**
 * Rate Limit Error - for 429 errors
 */
export class RateLimitError extends ApiError {
  public readonly retryAfter?: number;

  constructor(message: string = "Rate limit exceeded", retryAfter?: number) {
    super(message, 429);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }

  /**
   * Get error as plain object for logging
   */
  toJSON() {
    return {
      ...super.toJSON(),
      retryAfter: this.retryAfter,
    };
  }
}

/**
 * Server Error - for 5xx errors
 */
export class ServerError extends ApiError {
  constructor(message: string = "Internal server error") {
    super(message, 500);
    this.name = "ServerError";
  }
}

/**
 * Service Unavailable Error - for 503 errors
 */
export class ServiceUnavailableError extends ApiError {
  constructor(message: string = "Service temporarily unavailable") {
    super(message, 503);
    this.name = "ServiceUnavailableError";
  }
}

/**
 * Parse Error - for response parsing issues
 */
export class ParseError extends ApiError {
  constructor(message: string = "Failed to parse response") {
    super(message, 0);
    this.name = "ParseError";
  }
}

/**
 * Create appropriate error instance based on status code
 */
export function createApiError(
  status: number,
  message?: string,
  response?: string | ApiErrorResponse,
): ApiError {
  switch (status) {
    case 400:
      return new ValidationError(message || "Bad request", undefined);
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new AuthorizationError(message);
    case 404:
      return new NotFoundError(message);
    case 409:
      return new ConflictError(message);
    case 422:
      return new ValidationError(message);
    case 429:
      return new RateLimitError(message);
    case 500:
      return new ServerError(message);
    case 503:
      return new ServiceUnavailableError(message);
    default:
      if (status >= 400 && status < 500) {
        return new ApiError(message || "Client error", status, response);
      } else if (status >= 500) {
        return new ServerError(message || "Server error");
      } else {
        return new ApiError(message || "Unknown error", status, response);
      }
  }
}

/**
 * Check if error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Check if error is an authentication error
 */
export function isAuthenticationError(
  error: unknown,
): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

/**
 * Check if error is an authorization error
 */
export function isAuthorizationError(
  error: unknown,
): error is AuthorizationError {
  return error instanceof AuthorizationError;
}

/**
 * Check if error is retryable (network or 5xx errors)
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return true;
  }

  if (error instanceof ApiError && error.status >= 500) {
    return true;
  }

  if (error instanceof RateLimitError) {
    return true;
  }

  return false;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return "Dados inválidos. Verifique os campos preenchidos.";
  }

  if (error instanceof AuthenticationError) {
    return "Sua sessão expirou. Faça login novamente.";
  }

  if (error instanceof AuthorizationError) {
    return "Você não tem permissão para realizar esta ação.";
  }

  if (error instanceof NotFoundError) {
    return "O item solicitado não foi encontrado.";
  }

  if (error instanceof ConflictError) {
    return "Este item já existe ou foi modificado por outro usuário.";
  }

  if (error instanceof RateLimitError) {
    return "Muitas tentativas. Aguarde um momento antes de tentar novamente.";
  }

  if (error instanceof NetworkError) {
    return "Erro de conexão. Verifique sua internet e tente novamente.";
  }

  if (error instanceof TimeoutError) {
    return "A operação demorou muito para responder. Tente novamente.";
  }

  if (error instanceof ServerError) {
    return "Erro interno do servidor. Nossa equipe foi notificada.";
  }

  if (error instanceof ServiceUnavailableError) {
    return "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";
  }

  if (error instanceof ApiError) {
    return error.message || "Ocorreu um erro inesperado.";
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}
