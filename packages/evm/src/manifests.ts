import { Chain } from '@xdefi-tech/chains-core';

export enum EVMChains {
  ethereum = 'ethereum',
  binancesmartchain = 'binancesmartchain',
  polygon = 'polygon',
  avalanche = 'avalanche',
  fantom = 'fantom',
  arbitrum = 'arbitrum',
  aurora = 'aurora',
}

export const EVM_MANIFESTS: { [key in EVMChains]: Chain.Manifest } = {
  [EVMChains.ethereum]: {
    name: 'Ethereum',
    description: '',
    rpcURL: 'https://ethereum-mainnet.xdefiservices.com',
    chainSymbol: 'ETH',
    blockExplorerURL: 'https://etherscan.io',
    chainId: '1',
    chain: 'ethereum',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
  [EVMChains.binancesmartchain]: {
    name: 'BNB Smart Chain',
    description: '',
    rpcURL: 'https://bsc-dataseed1.defibit.io',
    chainSymbol: 'BNB',
    blockExplorerURL: 'https://bscscan.com',
    chainId: '56',
    chain: 'binancesmartchain',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
  [EVMChains.polygon]: {
    name: 'Polygon',
    description: '',
    rpcURL: 'https://polygon-mainnet.xdefiservices.com',
    chainSymbol: 'MATIC',
    blockExplorerURL: 'https://polygonscan.com',
    chainId: '137',
    chain: 'polygon',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
  [EVMChains.avalanche]: {
    name: 'Avalanche',
    description: '',
    rpcURL: 'https://avax-rpcs.xdefiservices.com',
    chainSymbol: 'AVAX',
    blockExplorerURL: 'https://snowtrace.io',
    chainId: '43114',
    chain: 'avalanche',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
  [EVMChains.fantom]: {
    name: 'Fantom',
    description: '',
    rpcURL: 'https://fantom-mainnet.xdefiservices.com',
    chainSymbol: 'FTM',
    blockExplorerURL: 'https://ftmscan.com',
    chainId: '250',
    chain: 'fantom',
    decimals: 18,
    feeGasStep: {
      high: 3,
      medium: 3,
      low: 3,
    },
  },
  [EVMChains.arbitrum]: {
    name: 'Arbitrum',
    description: '',
    rpcURL: 'https://arbitrum-rpcs.xdefiservices.com',
    chainSymbol: 'ETH',
    blockExplorerURL: 'https://arbiscan.io',
    chainId: '42161',
    chain: 'arbitrum',
    decimals: 18,
    feeGasStep: {
      high: 1,
      medium: 1,
      low: 1,
    },
  },
  [EVMChains.aurora]: {
    name: 'Aurora',
    description: '',
    rpcURL: 'https://aurora-rpc.xdefiservices.com',
    chainSymbol: 'ETH',
    blockExplorerURL: 'https://aurorascan.dev',
    chainId: '1313161554',
    chain: 'aurora',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
};
