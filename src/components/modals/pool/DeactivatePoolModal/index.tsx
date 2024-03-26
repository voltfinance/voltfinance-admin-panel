import DataWithCopyButton from '@/components/common/DataWithCopyButton';
import Loader from '@/components/common/Loader';
import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from '@/components/ui/credenza';
import { ALGEBRA_STUB_PLUGIN } from '@/constants/addresses';
import { usePrepareAlgebraPoolSetPlugin } from '@/generated';
import { useTransitionAwait } from '@/hooks/common/useTransactionAwait';
import { Address, useContractWrite } from 'wagmi';

interface IDeactivatePoolModal {
    title: string;
    children: React.ReactNode;
    poolId: Address;
}

const DeactivatePoolModal = ({
    title,
    children,
    poolId,
}: IDeactivatePoolModal) => {
    const { config } = usePrepareAlgebraPoolSetPlugin({
        address: poolId,
        args: [ALGEBRA_STUB_PLUGIN],
    });

    const { data, write } = useContractWrite(config);

    const { isLoading } = useTransitionAwait(data?.hash, title);

    const handleConfirm = () => {
        write?.();
    };
    return (
        <Credenza>
            <CredenzaTrigger asChild>{children}</CredenzaTrigger>
            <CredenzaContent className="bg-white !rounded-3xl">
                <CredenzaHeader>
                    <CredenzaTitle>{title}</CredenzaTitle>
                </CredenzaHeader>
                <CredenzaBody className={'flex flex-col gap-4'}>
                    <div>
                        <p className="font-semibold text-sm">Pool address</p>
                        <DataWithCopyButton data={poolId} />
                    </div>
                    <hr />
                    <div>
                        This will change current plugin address to stub plugin
                        address.
                    </div>
                    <button
                        disabled={isLoading}
                        onClick={handleConfirm}
                        className="flex items-center justify-center mt-2 py-2 px-4 w-full bg-red-500 text-white font-bold rounded-xl disabled:bg-red-400 hover:bg-red-400"
                    >
                        {isLoading ? <Loader /> : 'Confirm'}
                    </button>
                </CredenzaBody>
            </CredenzaContent>
        </Credenza>
    );
};

export default DeactivatePoolModal;
