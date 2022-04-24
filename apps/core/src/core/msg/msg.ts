/**
 * Abstract message class which allows to create chain specific message
 */
export abstract class Msg<OutData = {}> {
  protected signature?: string;

  constructor(public readonly data: Msg.Data) {}

  public abstract toData(): OutData;

  /**
   * Assign signature to the message
   *
   * @param signature of the message
   */
  public sign(signature: string): Msg {
    this.signature = signature;
    return this;
  }

  /**
   * Create a new Msg using provided data object
   *
   * @param `data` object represents msg
   */
  public static fromData(data: Msg.Data): Msg {
    return new (this as any)(data);
  }

  /**
   * Convert JSON string to Msg object
   *
   * @param `json` string that represents msg object
   */
  public static fromJson(json: string): Msg {
    const data = JSON.parse(json);
    return this.fromData(data);
  }
}

export namespace Msg {
  export type Data = string | object;
}
