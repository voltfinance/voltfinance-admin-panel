import FarmList from '@/components/farms/FarmList';
import PageContainer from '../../components/common/PageContainer';
import { Link } from 'react-router-dom';

const FarmsPage = () => {
    return (
        <PageContainer>
            <div className="flex justify-between w-full mb-4">
                <div className="font-bold text-2xl">Farms</div>
                <Link
                    to={'/new-farm'}
                    className="py-2 px-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400"
                >
                    + New Farm
                </Link>
            </div>

            <FarmList />
        </PageContainer>
    );
};

export default FarmsPage;
