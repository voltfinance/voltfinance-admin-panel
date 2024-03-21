import {
    useAlgebraBasePluginFeeConfig,
    useAlgebraPoolPlugin,
    usePluginFactoryDefaultFeeConfiguration,
} from '@/generated';
import { FeeConfiguration } from '@/types/pool-settings';
import { Address } from 'wagmi';

const initialFee = {
    alpha1: 0,
    alpha2: 0,
    beta1: 0,
    beta2: 0,
    gamma1: 0,
    gamma2: 0,
    baseFee: 0,
};
export function usePluginFactoryFeeConfiguration(): FeeConfiguration {
    const { data: defaultFeeConfiguration } =
        usePluginFactoryDefaultFeeConfiguration();

    if (!defaultFeeConfiguration) {
        return initialFee;
    }
    return {
        alpha1: defaultFeeConfiguration[0],
        alpha2: defaultFeeConfiguration[1],
        beta1: defaultFeeConfiguration[2],
        beta2: defaultFeeConfiguration[3],
        gamma1: defaultFeeConfiguration[4],
        gamma2: defaultFeeConfiguration[5],
        baseFee: defaultFeeConfiguration[6],
    };
}

export function useBasePluginFeeConfiguration({
    poolId,
}: {
    poolId: Address;
}): FeeConfiguration {
    const { data: pluginId } = useAlgebraPoolPlugin({
        address: poolId,
    });

    const { data: defaultFeeConfiguration } = useAlgebraBasePluginFeeConfig({
        address: pluginId,
    });

    if (!defaultFeeConfiguration) {
        return initialFee;
    }
    return {
        alpha1: defaultFeeConfiguration[0],
        alpha2: defaultFeeConfiguration[1],
        beta1: defaultFeeConfiguration[2],
        beta2: defaultFeeConfiguration[3],
        gamma1: defaultFeeConfiguration[4],
        gamma2: defaultFeeConfiguration[5],
        baseFee: defaultFeeConfiguration[6],
    };
}
