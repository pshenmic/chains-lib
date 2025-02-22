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

import PrivateKeySigner from './private-key.signer';

describe('private-key.signer', () => {
  let privateKey: string;
  let signer: PrivateKeySigner;
  let provider: EvmProvider;
  let txInput: MsgBody;
  let message: Msg;

  beforeEach(() => {
    privateKey =
      'd2a6956c6db5563b9755303795cc7e15be20e04c08b1fc8644f197e13190cbad';
    signer = new PrivateKeySigner(privateKey);

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
    expect(await signer.getAddress()).toBe(txInput.from);
  });

  it('should sign a transaction using a private key', async () => {
    await signer.sign(message as ChainMsg, '', SignatureType.Transaction);

    expect(message.signedTransaction).toBeTruthy();
  });

  it('should sign a message using a private key', async () => {
    txInput.data = 'test test';
    const chainMsg = provider.createMsg(txInput);
    await signer.sign(chainMsg as ChainMsg, '', SignatureType.PersonalSign);

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

    await signer.sign(chainMsg as ChainMsg, '', SignatureType.SignTypedData);

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
    expect(await signer.getPrivateKey()).toEqual(privateKey);
  });
});
