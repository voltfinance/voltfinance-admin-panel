import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from '@/components/ui/credenza';
import { Input } from '@/components/ui/input';
import { ALGEBRA_FACTORY } from '@/constants/addresses';
import {
    useAlgebraFactorySetDefaultCommunityFee,
    useAlgebraPoolSetTickSpacing,
    usePluginFactorySetDefaultFeeConfiguration,
} from '@/generated';
import { useState } from 'react';

interface IPoolsDefaultSettingsModal {
    title: string;
    children: React.ReactNode;
}

enum SettingsKeys {
    COMMUNITY_FEE = 'Community Fee',
    FEE = 'Fee',
    TICK_SPACING = 'Tick Spacing',
}

type Settings = Record<SettingsKeys, number | null>;

const PoolsDefaultSettingsModal = ({
    title,
    children,
}: IPoolsDefaultSettingsModal) => {
    const [settingsData, setSettingsData] = useState<Settings>({
        [SettingsKeys.COMMUNITY_FEE]: null,
        [SettingsKeys.FEE]: null,
        [SettingsKeys.TICK_SPACING]: null,
    });

    const { write: setTickSpacing } = useAlgebraPoolSetTickSpacing({
        address: settingsData[SettingsKeys.TICK_SPACING]
            ? ALGEBRA_FACTORY
            : undefined,
        args: [settingsData[SettingsKeys.TICK_SPACING] || 0],
    });

    const { write: setDefaultFeeConfiguration } =
        usePluginFactorySetDefaultFeeConfiguration({
            address: settingsData[SettingsKeys.FEE]
                ? ALGEBRA_FACTORY
                : undefined,
            args: [
                {
                    alpha1: 0,
                    alpha2: 0,
                    beta1: 0,
                    beta2: 0,
                    gamma1: 0,
                    gamma2: 0,
                    baseFee: 0,
                },
            ],
        });

    const { write: setDefaultCommunityFee } =
        useAlgebraFactorySetDefaultCommunityFee({
            address: settingsData[SettingsKeys.COMMUNITY_FEE]
                ? ALGEBRA_FACTORY
                : undefined,
            args: [settingsData[SettingsKeys.COMMUNITY_FEE] || 0],
        });

    const handleSubmit = (e: React.FormEvent, key: SettingsKeys) => {
        e.preventDefault();
        switch (key) {
            case SettingsKeys.COMMUNITY_FEE:
                console.log('Com fee');
                setDefaultCommunityFee();
                break;
            case SettingsKeys.FEE:
                console.log('Fee');
                setDefaultFeeConfiguration();
                break;
            case SettingsKeys.TICK_SPACING:
                console.log('Tick Spacing');
                setTickSpacing();
                break;
            default:
                break;
        }
    };

    return (
        <Credenza>
            <CredenzaTrigger asChild>{children}</CredenzaTrigger>
            <CredenzaContent className="bg-white !rounded-3xl w-[400px]">
                <CredenzaHeader>
                    <CredenzaTitle>{title}</CredenzaTitle>
                </CredenzaHeader>
                <CredenzaBody className="flex flex-col gap-4">
                    <form className="flex flex-col gap-4 items-center">
                        {Object.keys(settingsData).map((key) => (
                            <label
                                className="flex flex-col gap-2 mb-2 w-full "
                                key={key}
                            >
                                {key}
                                <Input
                                    key={key}
                                    onChange={(e) =>
                                        setSettingsData({
                                            ...settingsData,
                                            [key]: e.target.value,
                                        })
                                    }
                                    value={
                                        settingsData[key as SettingsKeys] || ''
                                    }
                                    type={'number'}
                                />
                                <button
                                    onClick={(e) =>
                                        handleSubmit(e, key as SettingsKeys)
                                    }
                                    className="flex justify-center w-full p-2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 disabled:bg-blue-400"
                                >
                                    Confirm
                                </button>
                            </label>
                        ))}
                    </form>
                </CredenzaBody>
            </CredenzaContent>
        </Credenza>
    );
};

export default PoolsDefaultSettingsModal;
