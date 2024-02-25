export default class ValidationError extends Error {
  public fields: Record<string, string[] | undefined>;

  constructor(fields: Record<string, string[] | undefined>, message?: string, options?: ErrorOptions) {
    super("Validation failed!", options);

    this.fields = fields;
  }
}
