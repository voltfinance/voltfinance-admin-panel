import DataWithCopyButton from '@/components/common/DataWithCopyButton';
import DeactivatePoolModal from '@/components/modals/pool/DeactivatePoolModal';
import ManagePoolSettingsModal from '@/components/modals/pool/ManagePoolSettingsModal';
import { ALGEBRA_STUB_PLUGIN } from '@/constants/addresses';
import { useAlgebraPoolPlugin } from '@/generated';
import { usePluginFlags } from '@/hooks/pools/usePluginFlags';
import { usePool } from '@/hooks/pools/usePool';
import { Address } from 'wagmi';

interface IPoolSettings {
    poolId: Address;
}

const PoolSettings = ({ poolId }: IPoolSettings) => {
    const flags = usePluginFlags(poolId);

    const { data: pluginId } = useAlgebraPoolPlugin({
        address: poolId,
    });

    const isPluginStub = pluginId === ALGEBRA_STUB_PLUGIN;

    const isDynamicFeeDisabled =
        flags?.DYNAMIC_FEE_FLAG === 1 && flags?.BEFORE_SWAP_FLAG === 1;

    const isSwapDisabled =
        flags?.AFTER_SWAP_FLAG === 1 || flags?.BEFORE_SWAP_FLAG === 1;

    const isMintBurnDisabled = flags?.BEFORE_POSITION_MODIFY_FLAG === 1;

    const isFlashesDisabled =
        flags?.AFTER_FLASH_FLAG === 1 || flags?.BEFORE_FLASH_FLAG === 1;

    const [, pool] = usePool(poolId);

    return (
        <div className="flex flex-col gap-4 text-left p-4 border rounded-xl">
            <div className="font-bold">Pool Settings</div>
            <div>
                <p className="font-semibold text-sm">Pool address</p>
                <DataWithCopyButton data={poolId} />
            </div>
            {isPluginStub && (
                <>
                    <div>
                        <p className="font-semibold text-sm">Swap status</p>
                        {isSwapDisabled ? (
                            <p className="text-red-600">Disabled</p>
                        ) : (
                            <p className="text-green-600">Enabled</p>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-sm">
                            Mint / Burn status
                        </p>
                        {isMintBurnDisabled ? (
                            <p className="text-red-600">Disabled</p>
                        ) : (
                            <p className="text-green-600">Enabled</p>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Flash status</p>
                        {isFlashesDisabled ? (
                            <p className="text-red-600">Disabled</p>
                        ) : (
                            <p className="text-green-600">Enabled</p>
                        )}
                    </div>
                </>
            )}
            <div className="flex gap-4 mt-auto">
                <ManagePoolSettingsModal
                    poolId={poolId}
                    functionName="setCommunityFee"
                    title="Community Fee"
                >
                    <button className="py-2 px-4 w-1/2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400">
                        Community Fee
                    </button>
                </ManagePoolSettingsModal>
                {isDynamicFeeDisabled ? (
                    <ManagePoolSettingsModal
                        poolId={poolId}
                        isDynamicFee={true}
                        title="Dynamic Fee"
                    >
                        <button className="py-2 px-4 w-1/2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400">
                            Dynamic Fee
                        </button>
                    </ManagePoolSettingsModal>
                ) : (
                    <ManagePoolSettingsModal
                        poolId={poolId}
                        functionName="setFee"
                        title="Fee"
                    >
                        <button className="py-2 px-4 w-1/2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400">
                            Fee
                        </button>
                    </ManagePoolSettingsModal>
                )}
                <ManagePoolSettingsModal
                    poolId={poolId}
                    functionName="setTickSpacing"
                    title="Tick Spacing"
                >
                    <button className="py-2 px-4 w-1/2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400">
                        Tick Spacing
                    </button>
                </ManagePoolSettingsModal>
            </div>
            {!isPluginStub && (
                <DeactivatePoolModal
                    poolId={poolId}
                    title={`Deactivate Pool ${pool?.token0.symbol} / ${pool?.token1.symbol}`}
                >
                    <button className="flex justify-center w-full py-2 px-4 border border-red-200 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white">
                        Deactivate
                    </button>
                </DeactivatePoolModal>
            )}
        </div>
    );
};

export default PoolSettings;
