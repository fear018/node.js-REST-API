class HttpError extends Error {
  constructor(message = "Internal error", code = 500) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

module.exports = {
  HttpError,
};
