import {
    useAlgebraBasePluginFeeConfig,
    useAlgebraPoolPlugin,
    usePluginFactoryDefaultFeeConfiguration,
} from '@/generated';
import { FeeConfiguration } from '@/types/pool-settings';
import { useMemo } from 'react';
import { Address } from 'wagmi';


export function usePluginFactoryFeeConfiguration(): FeeConfiguration | undefined {
    const { data: defaultFeeConfiguration } =
        usePluginFactoryDefaultFeeConfiguration();

    return useMemo(() => {
        if (!defaultFeeConfiguration) return;
        return {
            alpha1: defaultFeeConfiguration[0],
            alpha2: defaultFeeConfiguration[1],
            beta1: defaultFeeConfiguration[2],
            beta2: defaultFeeConfiguration[3],
            gamma1: defaultFeeConfiguration[4],
            gamma2: defaultFeeConfiguration[5],
            baseFee: defaultFeeConfiguration[6],
        };
    }, [defaultFeeConfiguration]);
}

export function useBasePluginFeeConfiguration({
    poolId,
}: {
    poolId: Address;
}): FeeConfiguration | undefined {
    const { data: pluginId, isLoading: isLoadingPlugin } = useAlgebraPoolPlugin(
        {
            address: poolId,
        }
    );

    const { data: defaultFeeConfiguration, isLoading: isLoadingFee } =
        useAlgebraBasePluginFeeConfig({
            address: pluginId,
        });

    const isLoading = isLoadingPlugin || isLoadingFee;

    return useMemo(() => {
        if (!defaultFeeConfiguration || isLoading) return;
        return {
            alpha1: defaultFeeConfiguration[0],
            alpha2: defaultFeeConfiguration[1],
            beta1: defaultFeeConfiguration[2],
            beta2: defaultFeeConfiguration[3],
            gamma1: defaultFeeConfiguration[4],
            gamma2: defaultFeeConfiguration[5],
            baseFee: defaultFeeConfiguration[6],
        };
    }, [defaultFeeConfiguration, isLoading]);

    return undefined;
}
