class ErrorBase<T extends string> extends Error {
  readonly name: T;

  readonly cause?: string | never;

  readonly details?: Record<string, string | number | never>;

  constructor({
    name,
    message,
    cause,
    details,
  }: {
    name: T;
    message: string;
    cause?: string | never;
    details?: Record<string, string | number | never>;
  }) {
    super(message);
    this.name = name;
    this.cause = cause;
    this.details = details;
    Object.setPrototypeOf(this, ErrorBase.prototype);
  }

  toString(): string {
    let errorString = `${this.name}: ${this.message}`;
    if (this.cause) {
      errorString += `\nCaused by: ${this.cause.toString()}`;
    }
    if (this.details) {
      errorString += `\nDetails: ${JSON.stringify(this.details, null, 2)}`;
    }
    return errorString;
  }

  toJSON(): {
    name: T;
    cause: string | never | undefined;
    details: Record<string, string | number | never> | undefined;
    message: string;
  } {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      details: this.details,
    };
  }
}

type APIErrorName =
  | "GET_ERROR"
  | "CREATE_ERROR"
  | "UPDATE_ERROR"
  | "DELETE_ERROR"
  | "API_LIMIT_REACHED ";

type FileErrorName =
  | "GET_FILE_ERROR"
  | "CREATE_FILE_ERROR"
  | "EXPORT_FILE_ERROR"
  | "FILE_LIMIT_REACHED ";

export class APIError extends ErrorBase<APIErrorName> {}

export class FileError extends ErrorBase<FileErrorName> {}
