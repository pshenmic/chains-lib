import {
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
  Asset,
} from '@xdefi-tech/chains-core';
import { Observable } from 'rxjs';
import TronWeb from 'tronweb';
import axios from 'axios';

import { ChainMsg } from '../../msg';

@Injectable()
export class ChainDataSource extends DataSource {
  declare rpcProvider: any;
  constructor(manifest: Chain.Manifest) {
    super(manifest);
    this.rpcProvider = new TronWeb({
      fullHost: manifest.rpcURL,
    });
  }

  async getBalance(filter: BalanceFilter): Promise<Coin[]> {
    const { address } = filter;
    const nativeBalance = await this.rpcProvider.trx.getBalance(address);

    const coins: Coin[] = [];

    coins.push(
      new Coin(
        new Asset({
          id: this.manifest.name,
          name: this.manifest.name,
          chainId: this.manifest.chainId,
          symbol: this.manifest.chainSymbol,
          native: true,
        }),
        this.rpcProvider.fromSun(nativeBalance)
      )
    );

    return coins;
  }

  async subscribeBalance(
    _filter: BalanceFilter
  ): Promise<Observable<Balance[]>> {
    throw new Error('Method not implemented.');
  }

  async getTransactions(filter: TransactionsFilter): Promise<Transaction[]> {
    const { address } = filter;
    const response = await axios.get(
      `https://api.trongrid.io/v1/accounts/${address}/transactions`
    );

    return response.data.data.map((transaction: any) =>
      Transaction.fromData(transaction)
    );
  }

  async subscribeTransactions(
    _filter: TransactionsFilter
  ): Promise<Observable<Transaction>> {
    throw new Error('Method not implemented.');
  }

  async estimateFee(
    _msgs: ChainMsg[],
    _speed: GasFeeSpeed
  ): Promise<FeeData[]> {
    return [];
  }

  async gasFeeOptions(): Promise<FeeOptions | null> {
    throw new Error('Method not implemented.');
  }

  async getNonce(_address: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
