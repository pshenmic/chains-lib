import App from '@ledgerhq/hw-app-btc';
import Transport from '@ledgerhq/hw-transport-webhid';
import { Signer, SignerDecorator } from '@xdefi-tech/chains-core';
import * as UTXOLib from 'bitcoinjs-lib';

import { ChainMsg } from '../msg';
import { UTXO } from '../datasource';

export type Signature = {
  v: number;
  r: string;
  s: string;
};

@SignerDecorator(Signer.SignerType.LEDGER)
export class LedgerSigner extends Signer.Provider {
  verifyAddress(address: string): boolean {
    try {
      UTXOLib.address.toOutputScript(address);
      return true;
    } catch (err) {
      return false;
    }
  }

  async getAddress(
    derivation: string,
    type: 'legacy' | 'p2sh' | 'bech32' | 'bech32m' | 'cashaddr' = 'legacy'
  ): Promise<string> {
    const transport = await Transport.create();
    const app = new App({ transport, currency: 'bitcoin' });

    const address = await app.getWalletPublicKey(derivation, { format: type });
    transport.close();

    return address.bitcoinAddress;
  }

  async sign(derivation: string, msg: ChainMsg) {
    const transport = await Transport.create();
    const app = new App({ transport, currency: 'bitcoin' });
    const { inputs, outputs, compiledMemo, from } = await msg.buildTx();
    const psbt = new UTXOLib.Psbt({ network: UTXOLib.networks.bitcoin });
    psbt.addInputs(
      inputs.map((utxo: UTXO) => ({
        hash: utxo.hash,
        index: utxo.index,
        witnessUtxo: utxo.witnessUtxo,
      }))
    );

    // psbt add outputs from accumulative outputs
    outputs.forEach((output: UTXOLib.PsbtTxOutput) => {
      if (!output.address) {
        //an empty address means this is the change address
        output.address = from;
      }
      if (!output.script) {
        psbt.addOutput(output);
      } else {
        //we need to add the compiled memo this way to
        //avoid dust error tx when accumulating memo output with 0 value
        if (compiledMemo) {
          psbt.addOutput({ script: compiledMemo, value: 0 });
        }
      }
    });
    const result = await app.signMessage(derivation, psbt.toHex());
    await transport.close();

    const v = result['v'] + 27 + 4;

    const signature = Buffer.from(
      v.toString(16) + result['r'] + result['s'],
      'hex'
    ).toString('base64');
    msg.sign(signature);
  }
}

export default LedgerSigner;
