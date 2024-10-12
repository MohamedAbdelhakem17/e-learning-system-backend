class AppError extends Error {
  constructor(statusCode, statusText, message) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}

module.exports = AppError;
