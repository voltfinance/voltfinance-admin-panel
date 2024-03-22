import DataWithCopyButton from '@/components/common/DataWithCopyButton';
import Loader from '@/components/common/Loader';
import ManagePluginConfigModal from '@/components/modals/ManagePluginConfigModal';
import { Switch } from '@/components/ui/switch';
import {
    useAlgebraPoolGlobalState,
    useAlgebraPoolPlugin,
    usePrepareAlgebraPoolSetPluginConfig,
} from '@/generated';
import { useTransitionAwait } from '@/hooks/common/useTransactionAwait';
import { PluginFlags } from '@/types/pool-plugin-flags';
import { useEffect, useState } from 'react';
import { Address, useContractWrite } from 'wagmi';
interface IManagePlugins {
    poolId: Address;
}

const ManagePlugins = ({ poolId }: IManagePlugins) => {
    const [flags, setFlags] = useState<PluginFlags>();
    const [pluginConfig, setPluginConfig] = useState<number>();

    const { data: pluginId } = useAlgebraPoolPlugin({
        address: poolId,
    });

    const { data: globalState } = useAlgebraPoolGlobalState({
        address: poolId,
    });

    const { config: preparedPluginConfig } =
        usePrepareAlgebraPoolSetPluginConfig({
            address: poolId,
            args: pluginConfig ? [pluginConfig] : undefined,
        });

    const { data: setPluginConfigHash, write } =
        useContractWrite(preparedPluginConfig);

    const { isLoading } = useTransitionAwait(
        setPluginConfigHash?.hash,
        'Set Plugin'
    );

    useEffect(() => {
        if (!globalState) return;
        const tempPluginConfig = globalState[3];

        setFlags({
            BEFORE_SWAP_FLAG: tempPluginConfig & 1,
            AFTER_SWAP_FLAG: (tempPluginConfig >> 1) & 1,
            BEFORE_POSITION_MODIFY_FLAG: (tempPluginConfig >> 2) & 1,
            AFTER_POSITION_MODIFY_FLAG: (tempPluginConfig >> 3) & 1,
            BEFORE_FLASH_FLAG: (tempPluginConfig >> 4) & 1,
            AFTER_FLASH_FLAG: (tempPluginConfig >> 5) & 1,
            AFTER_INIT_FLAG: (tempPluginConfig >> 6) & 1,
            DYNAMIC_FEE_FLAG: (tempPluginConfig >> 7) & 1,
        });
        setPluginConfig(tempPluginConfig);
    }, [globalState]);

    useEffect(() => {
        if (!flags) return;

        let updatedPluginConfig = 0;
        updatedPluginConfig |= flags.BEFORE_SWAP_FLAG;
        updatedPluginConfig |= flags.AFTER_SWAP_FLAG << 1;
        updatedPluginConfig |= flags.BEFORE_POSITION_MODIFY_FLAG << 2;
        updatedPluginConfig |= flags.AFTER_POSITION_MODIFY_FLAG << 3;
        updatedPluginConfig |= flags.BEFORE_FLASH_FLAG << 4;
        updatedPluginConfig |= flags.AFTER_FLASH_FLAG << 5;
        updatedPluginConfig |= flags.AFTER_INIT_FLAG << 6;
        updatedPluginConfig |= flags.DYNAMIC_FEE_FLAG << 7;

        setPluginConfig(updatedPluginConfig);
    }, [flags]);

    const handleCheckFlag = (flag: keyof PluginFlags) => {
        if (!flags) return;
        setFlags((prev) => {
            if (!prev) return;
            const updatedFlags = { ...prev };

            if (flag === 'DYNAMIC_FEE_FLAG') {
                updatedFlags.DYNAMIC_FEE_FLAG = prev.DYNAMIC_FEE_FLAG ? 0 : 1;
                updatedFlags.BEFORE_SWAP_FLAG = prev.DYNAMIC_FEE_FLAG ? 0 : 1;
            } else {
                updatedFlags[flag] = prev[flag] ? 0 : 1;
            }
            return updatedFlags;
        });
    };

    const handleConfirm = () => {
        if (!flags || isLoading) return;
        write?.();
    };

    return (
        <div className="flex flex-col text-left p-4 border rounded-xl">
            <div className="font-bold mb-4">Manage Plugins</div>
            {pluginId && flags && (
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="font-semibold text-sm">
                            Current Plugin address
                        </p>
                        <DataWithCopyButton data={pluginId} />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">
                            Plugin Config (uint8)
                        </p>
                        <p>{pluginConfig}</p>
                    </div>
                    <hr />
                    <div className="flex items-center justify-between">
                        <label htmlFor="farmingsPlugin">
                            <p className="font-semibold text-sm">
                                On-chain farmings Plugin
                            </p>
                            <p>AFTER_SWAP_FLAG = {flags.AFTER_SWAP_FLAG}</p>
                        </label>
                        <Switch
                            id="farmingsPlugin"
                            checked={Boolean(flags.AFTER_SWAP_FLAG)}
                            onCheckedChange={() =>
                                handleCheckFlag('AFTER_SWAP_FLAG')
                            }
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="oraclePlugin">
                            <p className="font-semibold text-sm">
                                TWAP Oracle Plugin
                            </p>
                            <p>BEFORE_SWAP_FLAG = {flags.BEFORE_SWAP_FLAG}</p>
                        </label>
                        <Switch
                            id="oraclePlugin"
                            checked={Boolean(flags.BEFORE_SWAP_FLAG)}
                            onCheckedChange={() =>
                                handleCheckFlag('BEFORE_SWAP_FLAG')
                            }
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="dynamicFeePlugin">
                            <p className="font-semibold text-sm">
                                Dynamic Fees Plugin
                            </p>
                            <p>BEFORE_SWAP_FLAG = {flags.BEFORE_SWAP_FLAG}</p>
                            <p>DYNAMIC_FEE = {flags.DYNAMIC_FEE_FLAG}</p>
                        </label>
                        <Switch
                            id="dynamicFeePlugin"
                            checked={Boolean(
                                flags.DYNAMIC_FEE_FLAG && flags.BEFORE_SWAP_FLAG
                            )}
                            onCheckedChange={() => {
                                handleCheckFlag('DYNAMIC_FEE_FLAG');
                            }}
                        />
                    </div>
                    <button
                        disabled={isLoading}
                        onClick={handleConfirm}
                        className="flex items-center justify-center py-2 px-4 w-full mt-auto bg-blue-500 text-white font-bold rounded-xl disabled:bg-blue-400 hover:bg-blue-400"
                    >
                        {isLoading ? <Loader /> : 'Confirm'}
                    </button>
                </div>
            )}
            {flags && pluginConfig !== undefined && (
                <ManagePluginConfigModal
                    pluginConfig={pluginConfig}
                    onChange={handleCheckFlag}
                    onConfirm={handleConfirm}
                    isLoading={isLoading}
                    title="Custom Hooks Settings"
                    flags={flags}
                >
                    <button className="py-2 px-4 w-full mt-auto border border-blue-500 text-blue-500 bg-white font-bold rounded-xl hover:bg-blue-500 hover:text-white">
                        Custom Hooks Settings
                    </button>
                </ManagePluginConfigModal>
            )}
        </div>
    );
};

export default ManagePlugins;
