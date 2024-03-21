import ManagePoolSettingsModal from '@/components/modals/ManagePoolSettingsModal';
import { Address } from 'wagmi';

interface IPoolSettings {
    poolId: Address;
}

const PoolSettings = ({ poolId }: IPoolSettings) => {
    return (
        <div className="flex flex-col gap-4 text-left p-4 border rounded-xl">
            <div className="font-bold mb-4">Pool Settings</div>
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
                <ManagePoolSettingsModal
                    poolId={poolId}
                    functionName="setFee"
                    title="Fee"
                >
                    <button className="py-2 px-4 w-1/2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400">
                        Fee
                    </button>
                </ManagePoolSettingsModal>
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
            <button className="flex justify-center w-full py-2 px-4 border border-red-200 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white">
                Deactivate
            </button>
        </div>
    );
};

export default PoolSettings;
