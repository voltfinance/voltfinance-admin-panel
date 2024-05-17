import Loader from "@/components/common/Loader";
import ManageRateLimitsModal from "@/components/modals/farm/ManageRateLimitsModal";
import ManageWeightsModal from "@/components/modals/farm/ManageWeightsModal.tsx";
import { Switch } from "@/components/ui/switch";
import { ALGEBRA_ETERNAL_FARMING } from "@/constants/addresses";
import { eternalFarmingABI, useAlgebraVirtualPoolDynamicRateActivated, usePrepareEternalFarmingSwitchDynamicRate } from "@/generated";
import { farmsClient } from "@/graphql/clients";
import { useAllDepositsOnFarmingQuery } from "@/graphql/generated/graphql";
import { useTransitionAwait } from "@/hooks/common/useTransactionAwait";
import { IncentiveKey } from "@/types/incentive-key";
import { useEffect } from "react";
import { Address, useContractWrite, usePrepareContractWrite } from "wagmi";

interface IFarmDetails {
    id: string;
    incentiveKey: IncentiveKey;
    isDeactivated: boolean;
    virtualPool: Address;
}

const FarmDetails = ({ id, incentiveKey, isDeactivated, virtualPool }: IFarmDetails) => {
    const { data: deposits } = useAllDepositsOnFarmingQuery({
        skip: !id || isDeactivated,
        client: farmsClient,
        variables: {
            farmId: id || "",
        },
    });

    const depositsOnFarm = deposits ? deposits.deposits.length : 0;

    const { data: isDynamicRateActivated, refetch: refetchDynamicRate } = useAlgebraVirtualPoolDynamicRateActivated({
        address: virtualPool,
    });

    const { config } = usePrepareContractWrite({
        address: ALGEBRA_ETERNAL_FARMING,
        abi: eternalFarmingABI,
        functionName: "deactivateIncentive",
        args: [incentiveKey],
    });

    const { data, write } = useContractWrite(config);

    const { config: switchDynamicRateConfig } = usePrepareEternalFarmingSwitchDynamicRate({
        args: [incentiveKey, !isDynamicRateActivated],
    });

    const { data: dynamicRateData, write: switchDynamicRate } = useContractWrite(switchDynamicRateConfig);

    const { isLoading } = useTransitionAwait(data?.hash, "Deactivate Farm");

    const { isLoading: isLoadingDynamicRate, isSuccess } = useTransitionAwait(dynamicRateData?.hash, "Switch Dynamic Rate");

    const handleSwitchDynamicRate = () => {
        switchDynamicRate?.();
    };

    useEffect(() => {
        if (isSuccess) {
            refetchDynamicRate();
        }
    }, [isSuccess]);

    return (
        <div className="flex flex-col text-left p-4 border rounded-xl">
            <div className="font-bold mb-4">Farm Details</div>
            <div className="flex flex-col gap-4">
                <div>
                    <div className="font-semibold text-sm">Farm ID</div>
                    <div>{id}</div>
                </div>
                <div>
                    <div className="font-semibold text-sm">Deposits</div>
                    <div>{depositsOnFarm}</div>
                </div>
                {!isDeactivated && (
                    <>
                        <div className="flex justify-between items-center">
                            <div>
                                <label>Dynamic Rate</label>
                                <p className={isDynamicRateActivated ? "text-green-600" : "text-red-600"}>
                                    {isDynamicRateActivated ? "Enabled" : "Disabled"}
                                </p>
                            </div>
                            {isLoadingDynamicRate ? (
                                <Loader color="black" />
                            ) : (
                                <Switch checked={isDynamicRateActivated} onCheckedChange={handleSwitchDynamicRate} />
                            )}
                        </div>

                        <div className="w-full flex gap-4 mt-auto">
                            <ManageWeightsModal title="Manage Weights" incentiveKey={incentiveKey} virtualPool={virtualPool}>
                                <button
                                    disabled={isLoading || !write}
                                    className="flex justify-center w-full py-2 px-4 font-bold rounded-xl bg-blue-500 text-white hover:bg-blue-400"
                                >
                                    Manage Weights
                                </button>
                            </ManageWeightsModal>
                            <ManageRateLimitsModal title="Manage Rate Limits" incentiveKey={incentiveKey} virtualPool={virtualPool}>
                                <button
                                    disabled={isLoading || !write}
                                    className="flex justify-center w-full py-2 px-4 font-bold rounded-xl bg-blue-500 text-white hover:bg-blue-400"
                                >
                                    Manage Rate Limits
                                </button>
                            </ManageRateLimitsModal>
                        </div>

                        <button
                            disabled={isLoading || !write}
                            onClick={() => write && write()}
                            className="flex justify-center w-full py-2 px-4 border border-red-200 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white"
                        >
                            {isLoading ? <Loader color="currentColor" /> : "Deactivate"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FarmDetails;
