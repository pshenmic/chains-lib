/**
 * Abstract message class which allows to create chain specific message
 */

export abstract class Msg<OutData = {}, Fee = {}> {
  protected signature: string | undefined;
  constructor(public readonly data: Msg.Data) {}

  public abstract toData(): OutData;
  public abstract fee(): Fee;

  /**
   * Generate rawTransaction from data
   */
  public abstract toHash(): string | undefined;

  /**
  * Assign signature to the message
  */
  public async sign(signature: string): Promise<Msg<OutData>> {
    this.signature = signature;
    return this as Msg<OutData>;
  }

  /**
   * Check is current Msg has signature
   */
  get hasSignature(): boolean {
    return Boolean(this.signature)
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
  export type Data = any;
}
