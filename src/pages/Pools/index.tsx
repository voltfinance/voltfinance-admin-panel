import PoolsList from '@/components/pools/PoolsList';
import PageContainer from '../../components/common/PageContainer';

const PoolsPage = () => {
    return (
        <PageContainer>
            <div className="flex justify-between w-full mb-4">
                <div className="font-bold text-2xl">Pools</div>
            </div>
            <PoolsList />
        </PageContainer>
    );
};

export default PoolsPage;
