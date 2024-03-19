import { algebraPoolABI } from '@/abis';
import Loader from '@/components/common/Loader';
import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from '@/components/ui/credenza';
import { Input } from '@/components/ui/input';
import { useTransitionAwait } from '@/hooks/common/useTransactionAwait';
import { useState } from 'react';
import { Address, useContractWrite, usePrepareContractWrite } from 'wagmi';

type ManageFunctions = 'setFee' | 'setCommunityFee' | 'setTickSpacing';

interface IManagePoolSettingsModal {
    title: string;
    functionName: ManageFunctions;
    children: React.ReactNode;
    poolId: Address;
}

const ManagePoolSettingsModal = ({
    title,
    functionName,
    children,
    poolId,
}: IManagePoolSettingsModal) => {
    const [value, setValue] = useState<string>('');

    const { config } = usePrepareContractWrite({
        address: poolId,
        abi: algebraPoolABI,
        functionName,
    });

    const { data, write } = useContractWrite(config);

    const { isLoading } = useTransitionAwait(data?.hash, title);

    return (
        <Credenza>
            <CredenzaTrigger asChild>{children}</CredenzaTrigger>
            <CredenzaContent className="bg-white !rounded-3xl">
                <CredenzaHeader>
                    <CredenzaTitle>{title}</CredenzaTitle>
                </CredenzaHeader>
                <CredenzaBody className="flex flex-col gap-4">
                    <Input
                        type="number"
                        required
                        value={value}
                        placeholder="Enter amount"
                        onChange={(e) => {
                            setValue(value === '.' ? '0.' : e.target.value);
                        }}
                    />
                    <button
                        disabled={!value || isLoading}
                        onClick={() => write && write()}
                        className="flex justify-center w-full p-2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 disabled:bg-blue-400"
                    >
                        {isLoading ? (
                            <Loader color="currentColor" />
                        ) : (
                            'Confirm'
                        )}
                    </button>
                </CredenzaBody>
            </CredenzaContent>
        </Credenza>
    );
};

export default ManagePoolSettingsModal;
