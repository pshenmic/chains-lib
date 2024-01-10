import { TRON_MANIFEST } from '../manifests';
import { ChainMsg, TokenType } from '../msg';

import { SeedPhraseSigner } from './seed-phrase.signer';

describe('tron seed-phrase.signer', () => {
  const MOCK = {
    seedPhrase:
      'question unusual episode tree fresh lawn enforce vocal attitude quarter solution shove early arch topic',
    deriviationPath: "m/44'/195'/0'/0",
    address: 'TSDmgg8m3AfNniTzz4dyWN44fkGd7otZ4C',
    signature:
      '9c051749bdfb0cc71749ee1bfeff48f7a084a66bf18e62d7eb66238e539d1086',
    recipient: 'TN4JsVEuLVBG9Ru7YSjDxkTdoRTychnJkH',
    contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    decimals: 18,
    tokenId: '10',
  };
  const signer = new SeedPhraseSigner(MOCK.seedPhrase);

  it('should return true for a valid address', () => {
    expect(signer.verifyAddress(MOCK.address, TRON_MANIFEST)).toBe(true);
  });

  it('should return false for an invalid address', () => {
    expect(signer.verifyAddress('invalid-address', TRON_MANIFEST)).toBe(false);
  });

  it('should return the correct address for a valid private key', async () => {
    const address = await signer.getAddress(null, MOCK.deriviationPath);
    expect(address).toBe(MOCK.address);
  });

  it('should throw an error for an invalid private key', async () => {
    await expect(
      signer.getAddress('invalid-private-key', 'no path')
    ).rejects.toThrow('Invalid tron path provided');
  });

  it('should sign a ChainMsg with the private key', async () => {
    const msg = new ChainMsg({
      to: MOCK.recipient,
      from: MOCK.address,
      amount: 0.000001,
    });
    await signer.sign(msg, null, MOCK.deriviationPath, TRON_MANIFEST);
    expect((msg.signedTransaction as any).txID.length).toBe(64);
  });

  it('should throw when signing a TRC10 TX without a token id', async () => {
    const msg = new ChainMsg({
      to: MOCK.recipient,
      from: MOCK.address,
      amount: 0.000001,
      tokenType: TokenType.TRC10,
    });
    await expect(
      signer.sign(msg, null, MOCK.deriviationPath, TRON_MANIFEST)
    ).rejects.toThrow('TRX10 Token ID not provided');
  });

  it('should sign a TRC20 TX with the private key', async () => {
    const msg = new ChainMsg({
      to: MOCK.recipient,
      from: MOCK.address,
      amount: 0.000001,
      contractAddress: MOCK.contractAddress,
      decimals: MOCK.decimals,
      tokenType: TokenType.TRC20,
    });
    await signer.sign(msg, null, MOCK.deriviationPath, TRON_MANIFEST);
    expect((msg.signedTransaction as any).txID.length).toBe(64);
  });

  it('should sign a TRC20 TX with the private key', async () => {
    const msg = new ChainMsg({
      to: MOCK.recipient,
      from: MOCK.address,
      amount: 0.000001,
      contractAddress: MOCK.contractAddress,
      decimals: MOCK.decimals,
      tokenType: TokenType.TRC20,
    });
    await signer.sign(msg, null, MOCK.deriviationPath, TRON_MANIFEST);
    expect((msg.signedTransaction as any).txID.length).toBe(64);
  });

  it('should throw when signing a TRC20 TX without decimals', async () => {
    const msg = new ChainMsg({
      to: MOCK.recipient,
      from: MOCK.address,
      amount: 0.000001,
      contractAddress: MOCK.contractAddress,
      tokenType: TokenType.TRC20,
    });
    await expect(
      signer.sign(msg, null, MOCK.deriviationPath, TRON_MANIFEST)
    ).rejects.toThrow('Token decimals not provided');
  });

  it('should throw when signing a TRC20 TX without a contract address', async () => {
    const msg = new ChainMsg({
      to: MOCK.recipient,
      from: MOCK.address,
      amount: 0.000001,
      tokenType: TokenType.TRC20,
    });
    await expect(
      signer.sign(msg, null, MOCK.deriviationPath, TRON_MANIFEST)
    ).rejects.toThrow('TRC20 Contract Address not provided');
  });
});
