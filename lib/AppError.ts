export class AppError extends Error {
  constructor(
    message: string,
    public code: string = "INTERNAL_ERROR",
    public status: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, "NOT_FOUND", 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, "BAD_REQUEST", 400);
  }
}