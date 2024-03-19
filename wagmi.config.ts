import { ContractConfig, defineConfig } from '@wagmi/cli';
import { actions, react } from '@wagmi/cli/plugins';
import {
    algebraFactoryABI,
    algebraPoolABI,
    eternalFarmingABI,
    farmingCenterABI,
    pluginFactoryABI,
} from './src/abis';
import {
    ALGEBRA_FARMING_CENTER,
    ALGEBRA_ETERNAL_FARMING,
    ALGEBRA_FACTORY,
    PLUGIN_FACTORY,
} from './src/constants/addresses';

const contracts: ContractConfig[] = [
    {
        address: ALGEBRA_FARMING_CENTER,
        name: 'FarmingCenter',
        abi: farmingCenterABI,
    },
    {
        address: ALGEBRA_ETERNAL_FARMING,
        name: 'EternalFarming',
        abi: eternalFarmingABI,
    },
    {
        address: ALGEBRA_FACTORY,
        name: 'AlgebraFactory',
        abi: algebraFactoryABI,
    },
    {
        address: PLUGIN_FACTORY,
        name: 'PluginFactory',
        abi: pluginFactoryABI,
    },
    {
        name: 'AlgebraPool',
        abi: algebraPoolABI,
    },
];

export default defineConfig({
    out: 'src/generated.ts',
    contracts,
    plugins: [
        actions({
            watchContractEvent: false,
        }),
        react({
            useContractEvent: false,
            useContractItemEvent: false,
        }),
    ],
});
