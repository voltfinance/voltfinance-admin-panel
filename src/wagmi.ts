import { defineChain } from 'viem'
import { configureChains, createConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { publicProvider } from 'wagmi/providers/public'

const holeskyChain = defineChain({
    id: 17000,
    network: 'holesky',
    name: 'Holesky',
    nativeCurrency: { name: 'Holesky Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_INFURA_RPC],
      },
      public: {
        http: [import.meta.env.VITE_INFURA_RPC],
      },
    },
    blockExplorers: {
      etherscan: {
        name: 'Etherscan',
        url: 'https://holesky.etherscan.io',
      },
      default: {
        name: 'Etherscan',
        url: 'https://holesky.etherscan.io',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 77,
      },
    },
    testnet: true,
  }) 

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [holeskyChain],
  [
    publicProvider(),
  ],
)

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({ chains, options: { projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID, metadata: { name: 'Algebra Integral Admin Panel', description: 'Admin Panel', url: 'https://admin.algebra.finance', icons: [''] }  } }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})