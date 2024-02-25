export default class HttpError extends Error {
  constructor(message = "Not found", options?: ErrorOptions) {
    super(message, options);
  }
}
