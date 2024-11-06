import { defineChain } from 'viem'
import { configureChains, createConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { publicProvider } from 'wagmi/providers/public'

const fuseChain = defineChain({
    id: 122,
    network: 'Fuse',
    name: 'Fuse',
    nativeCurrency: { name: 'Fuse', symbol: 'FUSE', decimals: 18 },
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
        name: 'Fusescan',
        url: 'https://explorer.fuse.io',
      },
      default: {
        name: 'Fusescan',
        url: 'https://explorer.fuse.io',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 16146628,
      },
    },
  }) 

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [fuseChain],
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