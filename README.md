# Algebra Admin Panel

To launch the application locally:

```yarn```

```yarn codegen && yarn wagmi-generate```

```yarn dev```

To set up Admin Panel for your DEX:
1. In `.env` update `VITE_INFO_GRAPH` and `VITE_FARMS_GRAPH` with your subgraph endpoints. Update `VITE_INFURA_RPC` with RPC of your chain.
2. Update contract addresses in `src/constants/addresses.ts`
3. Update chain specific details in `src/wagmi.ts` and `src/constants/default-chain-id.ts`

After each contracts change please launch `yarn wagmi-generate` to generate new contract functions 
