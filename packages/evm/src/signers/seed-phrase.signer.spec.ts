import { Msg } from '@xdefi-tech/chains-core';

import { EvmProvider } from '../chain.provider';
import { IndexerDataSource } from '../datasource';
import { EVM_MANIFESTS } from '../manifests';
import {
  ChainMsg,
  EvmTypedData,
  MsgBody,
  SignatureType,
  TypedDataField,
} from '../msg';

import SeedPhraseSigner from './seed-phrase.signer';

describe('seed-phrase.signer', () => {
  let mnemonic: string;
  let signer: SeedPhraseSigner;
  let provider: EvmProvider;
  let txInput: MsgBody;
  let message: Msg;
  let derivation: string;

  beforeEach(() => {
    mnemonic =
      'question unusual episode tree fresh lawn enforce vocal attitude quarter solution shove early arch topic';
    signer = new SeedPhraseSigner(mnemonic);

    derivation = "m/44'/60'/0'/0/0";

    provider = new EvmProvider(new IndexerDataSource(EVM_MANIFESTS.ethereum));

    txInput = {
      from: '0xAa09Df2673e1ae3fcC8ed875C131b52449CF9581',
      to: '0xAa09Df2673e1ae3fcC8ed875C131b52449CF9581',
      amount: 0.000001,
      nonce: 0,
      decimals: 18,
      chainId: 1,
    };

    message = provider.createMsg(txInput);
  });

  it('should get an address from the private key', async () => {
    expect(await signer.getAddress(derivation)).toBe(txInput.from);
  });

  it('should sign a transaction using a seed phrase', async () => {
    await signer.sign(
      message as ChainMsg,
      derivation,
      SignatureType.Transaction
    );

    expect(message.signedTransaction).toBeTruthy();
  });

  it('should sign a message using a seed phrase', async () => {
    txInput.data = 'test test';
    const chainMsg = provider.createMsg(txInput);
    await signer.sign(
      chainMsg as ChainMsg,
      derivation,
      SignatureType.PersonalSign
    );

    expect(chainMsg.signedTransaction).toBeTruthy();
  });

  it('should sign a typed message using a seed phrase', async () => {
    const record: Record<string, Array<TypedDataField>> = {
      test: [{ name: 'test', type: 'string' }],
    };
    const values: Record<string, any> = {
      test: 'test',
    };

    const testData: EvmTypedData = {
      domain: {},
      fields: record,
      values: values,
    };

    txInput.typedData = testData;
    const chainMsg = provider.createMsg(txInput);

    await signer.sign(
      chainMsg as ChainMsg,
      derivation,
      SignatureType.SignTypedData
    );

    expect(chainMsg.signedTransaction).toEqual(
      '0x41d9578d76d6460e125a783418c644de2663e585d59f507e7a86697a58d9bba24307fdad5f9647dba44b5ed5ac54741b3959fb8838c8a2b33afaa88d8d8c15571b'
    );
  });

  it('should return false when verifing an invalid address', async () => {
    expect(signer.verifyAddress('0xDEADBEEF')).toBe(false);
  });

  it('should validate an address', async () => {
    expect(signer.verifyAddress(txInput.from)).toBe(true);
  });

  it('should get a private key', async () => {
    expect(await signer.getPrivateKey(derivation)).toEqual(
      'd2a6956c6db5563b9755303795cc7e15be20e04c08b1fc8644f197e13190cbad'
    );
  });
});

describe('seed-phase.addressGeneration', () => {
  let derivation: (index: number) => string;
  let seedPhrase: string;
  let signer: SeedPhraseSigner;
  let firstAddress: string;
  let secondAddress: string;

  beforeEach(() => {
    seedPhrase =
      'access before split cram spoon snap secret month sphere fog embark donor';
    derivation = (index) => `m/44'/60'/0'/0/${index}`;
    signer = new SeedPhraseSigner(seedPhrase);

    firstAddress = '0x230e9c3deE180bf702cd40852feF85eb5fa5635B';
    secondAddress = '0x2370aDcbE0d9FBD581a0F881f2278d2EB626E8A8';
  });

  it('should get an address from the seed phrase', async () => {
    expect(await signer.getAddress(derivation(0))).toBe(firstAddress);
  });

  it('should get the second address form the seed phrase', async () => {
    expect(await signer.getAddress(derivation(1))).toBe(secondAddress);
  });
});
