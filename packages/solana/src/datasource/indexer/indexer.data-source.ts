import {
  Asset,
  DataSource,
  Coin,
  FeeOptions,
  GasFeeSpeed,
  Transaction,
  Injectable,
  Chain,
  TransactionsFilter,
  BalanceFilter,
  Balance,
  FeeData,
  NumberIsh,
} from '@xdefi-tech/chains-core';
import { Observable } from 'rxjs';

import { ChainMsg } from '../../msg';

import { getBalance, getTransactions, getFees } from './queries';

const DEFAULT_FEE = 5000;

@Injectable()
export class IndexerDataSource extends DataSource {
  constructor(manifest: Chain.Manifest) {
    super(manifest);
  }

  async getBalance(_filter: BalanceFilter): Promise<Coin[]> {
    const { address } = _filter;
    const { data } = await getBalance(address);
    // cut off balances without asset
    const balances = data.solana.balances.filter(
      (b: any) => b.asset.symbol && b.asset.id
    );

    return balances.map((balance: any): Coin => {
      const { asset, amount } = balance;

      return new Coin(
        new Asset({
          id: asset.id,
          chainId: this.manifest.chainId,
          name: asset.name,
          symbol: asset.symbol,
          icon: asset.image,
          native: !Boolean(asset.contract),
          address: asset.contract,
          price: asset.price?.amount,
          decimals: asset.price?.scalingFactor,
        }),
        amount.value
      );
    });
  }

  async subscribeBalance(
    _filter: BalanceFilter
  ): Promise<Observable<Balance[]>> {
    throw new Error('Method not implemented.');
  }

  async getTransactions(filter: TransactionsFilter): Promise<Transaction[]> {
    const { address } = filter;
    const { data } = await getTransactions(address, {}, {});

    return data.solana.transactions.map((transaction: any) => {
      return Transaction.fromData(transaction);
    });
  }

  async subscribeTransactions(
    _filter: TransactionsFilter
  ): Promise<Observable<Transaction>> {
    throw new Error('Method not implemented.');
  }

  async estimateFee(msgs: ChainMsg[], speed: GasFeeSpeed): Promise<FeeData[]> {
    const feeOptions = await this.gasFeeOptions();
    if (!feeOptions) {
      return [];
    }

    return msgs.map(() => ({
      gasLimit: 0,
      gasPrice: feeOptions[speed] as NumberIsh,
    }));
  }

  async gasFeeOptions(): Promise<FeeOptions | null> {
    const { data } = await getFees();
    if (!data.solana.fee) {
      return null;
    }
    return {
      [GasFeeSpeed.high]: data.solana.fee.high || DEFAULT_FEE,
      [GasFeeSpeed.medium]: data.solana.fee.medium || DEFAULT_FEE,
      [GasFeeSpeed.low]: data.solana.fee.low || DEFAULT_FEE,
    };
  }

  async getNonce(_address: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
