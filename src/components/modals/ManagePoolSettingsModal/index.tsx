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
import {
    useAlgebraPoolGlobalState,
    useAlgebraPoolPlugin,
    useAlgebraPoolTickSpacing,
    usePrepareAlgebraBasePluginChangeFeeConfiguration,
} from '@/generated';
import { useTransitionAwait } from '@/hooks/common/useTransactionAwait';
import { useBasePluginFeeConfiguration } from '@/hooks/pools/useDefaultFeeConfiguration';
import { FeeConfiguration } from '@/types/pool-settings';
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
    const initialFee = useBasePluginFeeConfiguration({ poolId });

    const { data: initialTickSpacing } = useAlgebraPoolTickSpacing({
        address: functionName === 'setTickSpacing' ? poolId : undefined,
    });

    const { data: poolGlobalState } = useAlgebraPoolGlobalState({
        address: functionName === 'setCommunityFee' ? poolId : undefined,
    });

    const initialCommunityFee = poolGlobalState?.[4];

    const [value, setValue] = useState<number>(
        initialTickSpacing || initialCommunityFee || 0
    );
    const [dynamicFee, setDynamicFee] = useState<FeeConfiguration>(initialFee);

    const { data: pluginId } = useAlgebraPoolPlugin({
        address: functionName !== 'setFee' ? poolId : undefined,
    });

    const { config: feeConfig } =
        usePrepareAlgebraBasePluginChangeFeeConfiguration({
            address: pluginId || undefined,
            args: [dynamicFee],
        });

    const { data: feeHash, write: setFeeConfiguration } =
        useContractWrite(feeConfig);

    const { config } = usePrepareContractWrite({
        address: functionName !== 'setFee' ? poolId : undefined,
        abi: algebraPoolABI,
        functionName,
        args: [value],
    });

    const { data, write } = useContractWrite(config);

    const { isLoading } = useTransitionAwait(data?.hash, title);

    const { isLoading: isFeeLoading } = useTransitionAwait(
        feeHash?.hash,
        'Set Fee'
    );

    const handleConfirm = () => {
        if (functionName === 'setFee') {
            console.log(dynamicFee);
            setFeeConfiguration?.();
        } else {
            console.log(value);
            write?.();
        }
    };

    return (
        <Credenza>
            <CredenzaTrigger asChild>{children}</CredenzaTrigger>
            <CredenzaContent className="bg-white !rounded-3xl">
                <CredenzaHeader>
                    <CredenzaTitle>{title}</CredenzaTitle>
                </CredenzaHeader>
                <CredenzaBody
                    className={
                        functionName === 'setFee'
                            ? 'grid grid-cols-2 gap-4'
                            : 'flex flex-col gap-4'
                    }
                >
                    {functionName === 'setFee' ? (
                        Object.entries(dynamicFee).map(([key, feeValue]) => (
                            <label key={key} className="">
                                <h4 className="">{key}</h4>
                                <Input
                                    key={key}
                                    className="w-full"
                                    type="number"
                                    required
                                    value={feeValue}
                                    placeholder="Enter amount"
                                    onChange={(e) => {
                                        setDynamicFee((prev) => ({
                                            ...prev,
                                            [key]: Number(e.target.value),
                                        }));
                                    }}
                                />{' '}
                            </label>
                        ))
                    ) : (
                        <Input
                            type="number"
                            required
                            value={value}
                            placeholder="Enter amount"
                            onChange={(e) => {
                                setValue(Number(e.target.value));
                            }}
                        />
                    )}
                    <button
                        disabled={isLoading || isFeeLoading}
                        onClick={handleConfirm}
                        className="flex col-span-2 justify-center w-full p-2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 disabled:bg-blue-400"
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
