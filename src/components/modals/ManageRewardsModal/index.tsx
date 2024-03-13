import Loader from "@/components/common/Loader";
import { Credenza, CredenzaBody, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@/components/ui/credenza"
import { ALGEBRA_ETERNAL_FARMING } from "@/constants/addresses";
import { eternalFarmingABI } from "@/generated";
import { useTransitionAwait } from "@/hooks/common/useTransactionAwait";
import { IncentiveKey } from "@/types/incentive-key";
import { useState } from "react";
import { parseUnits } from "viem";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

type ManageFunctions = 'addRewards' | 'setRates' | 'decreaseRewardsAmount'

interface IManageRewardsModal {
    title: string;
    functionName: ManageFunctions;
    incentiveKey: IncentiveKey;
    rewardRates: [{ value: bigint, decimals: number }, { value: bigint, decimals: number }];
    isBonus?: boolean;
    children: React.ReactNode;
}

const ManageRewardsModal = ({ title, functionName, incentiveKey, rewardRates, isBonus = false, children }: IManageRewardsModal) => {

    const [value, setValue] = useState<string>('')

    const args = functionName === 'setRates' ? isBonus ? [rewardRates[0].value, parseUnits(`${Number(value)}`, rewardRates[1].decimals)] : [ parseUnits(`${Number(value)}`, rewardRates[0].decimals), rewardRates[1].value] 
    : isBonus ? [ 0n, parseUnits(`${Number(value)}`, rewardRates[1].decimals) ] : [ parseUnits(`${Number(value)}`, rewardRates[0].decimals), 0n ]

    const { config } = usePrepareContractWrite({
        address: ALGEBRA_ETERNAL_FARMING,
        abi: eternalFarmingABI,
        functionName,
        args: [
            incentiveKey,
            args[0],
            args[1]
        ]
    })

    const { data, write } = useContractWrite(config)

    const { isLoading } = useTransitionAwait(data?.hash, title)

    return <Credenza>
        <CredenzaTrigger asChild>
            {children}
        </CredenzaTrigger>
        <CredenzaContent className="bg-white !rounded-3xl">
            <CredenzaHeader>
                <CredenzaTitle>{title}</CredenzaTitle>
            </CredenzaHeader>
        <CredenzaBody className="flex flex-col gap-4">
            <input 
                required
                autoComplete="off" 
                autoCorrect="off"
                className="w-full h-[42px] px-4 text-[18px] peer border outline-none rounded-2xl bg-inherit"
                pattern="^[0-9]*[.,]?[0-9]*$"
                spellCheck="false"
                inputMode="decimal"
                minLength={1}
                maxLength={100}
                value={value}
                placeholder="Enter amount"
                onChange={(e) => {
                    const value = e.target.value.replace(/,/g, ".")
                    if (value === "" || RegExp(`^\\d*(?:\\\\[.])?\\d*$`).test(value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
                        setValue(value === '.' ? '0.' : value)
                    } 
                }}
            />
            <button disabled={!value || isLoading} onClick={() => write && write()} className="w-full p-2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 disabled:bg-blue-400">
                { isLoading ? <Loader/> : 'Confirm' }
            </button>
        </CredenzaBody>
    </CredenzaContent>
  </Credenza>

}

export default ManageRewardsModal