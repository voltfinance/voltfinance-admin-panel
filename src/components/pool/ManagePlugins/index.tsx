import DataWithCopyButton from '@/components/common/DataWithCopyButton';
import { useAlgebraPoolPlugin } from '@/generated';
import { Address } from 'wagmi';
interface IManagePlugins {
    poolId: Address;
}
const ManagePlugins = ({ poolId }: IManagePlugins) => {
    const { data: pluginId } = useAlgebraPoolPlugin({
        address: poolId,
    });

    return (
        <div className="flex flex-col text-left p-4 border rounded-xl">
            <div className="font-bold mb-4">Manage Plugins</div>
            {pluginId && (
                <div>
                    <p className="font-semibold text-sm">
                        Current Plugin address
                    </p>
                    <DataWithCopyButton data={pluginId} />
                </div>
            )}
        </div>
    );
};

export default ManagePlugins;
