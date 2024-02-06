import App from '@ledgerhq/hw-app-eth';
import Transport from '@ledgerhq/hw-transport';
import { Signer, SignerDecorator } from '@xdefi-tech/chains-core';
import { utils } from 'ethers';

import { ChainMsg } from '../msg';

@SignerDecorator(Signer.SignerType.LEDGER)
export class LedgerSigner extends Signer.Provider {
  verifyAddress(address: string): boolean {
    return utils.isAddress(address);
  }

  async getPrivateKey(_derivation: string) {
    throw new Error('Cannot extract private key from Ledger device');
  }

  async getAddress(derivation: string): Promise<string> {
    const transport = await Transport.create();
    try {
      const app = new App(transport);
      const address = await app.getAddress(derivation);

      return address.address;
    } finally {
      transport.close();
    }
  }

  async sign(msg: ChainMsg, derivation: string): Promise<void> {
    const transport = await Transport.create();
    try {
      const app = new App(transport);
      const txData = await msg.buildTx();
      const unsignedTx = {
        to: txData.to,
        from: txData.from,
        chainId: parseInt(txData.chainId),
        nonce: Number(txData.nonce),
        gasLimit: txData.gasLimit,
        value: txData.value,
        ...(txData.maxPriorityFeePerGas && {
          maxPriorityFeePerGas: txData.maxPriorityFeePerGas,
        }),
        ...(txData.maxFeePerGas && { maxFeePerGas: txData.maxFeePerGas }),
        ...(txData.gasPrice && { gasPrice: txData.gasPrice }),
        data: txData.data,
        type: txData.type,
      };

      const rawTx = utils
        .hexlify(Buffer.from(JSON.stringify(unsignedTx)))
        .slice(2);
      const signature = await app.signTransaction(derivation, rawTx);
      const signedTransaction = utils.hexlify(
        Buffer.from(JSON.stringify({ ...unsignedTx, ...signature }))
      );
      msg.sign('0x' + signedTransaction);
    } finally {
      transport.close();
    }
  }
}

export default LedgerSigner;
