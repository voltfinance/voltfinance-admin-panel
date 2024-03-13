import { eternalFarmingABI } from "@/abis"
import Loader from "@/components/common/Loader"
import { ALGEBRA_ETERNAL_FARMING } from "@/constants/addresses"
import { useAlgebraPoolPlugin } from "@/generated"
import { useTransitionAwait } from "@/hooks/common/useTransactionAwait"
import { PartialIncentiveKey } from "@/types/incentive-key"
import { IRewards } from "@/types/rewards"
import { useContractWrite, usePrepareContractWrite } from "wagmi"

interface ICreateFarmButton {
    hasSecondReward: boolean;
    incentiveKey: PartialIncentiveKey;
    rewards: IRewards
}

const CreateFarmButton = ({ 
    hasSecondReward, 
    incentiveKey: { rewardToken, bonusRewardToken, pool, nonce },
    rewards: { reward, rewardRate, bonusReward, bonusRewardRate }
}: ICreateFarmButton) => {

    const { data: plugin } = useAlgebraPoolPlugin({
        address: pool
    })

    const isKeyReady = rewardToken && pool && plugin && nonce !== undefined && ( hasSecondReward ? Boolean(bonusRewardToken) : true )

    const areRewardsReady = reward && rewardRate && (hasSecondReward ? Boolean(bonusReward && bonusRewardRate) : true)

    const { config } = usePrepareContractWrite({
        address: ALGEBRA_ETERNAL_FARMING,
        abi: eternalFarmingABI,
        functionName: 'createEternalFarming',
        args: isKeyReady && areRewardsReady ? [
            { 
                rewardToken,
                bonusRewardToken: bonusRewardToken || '0x0000000000000000000000000000000000000000',
                pool,
                nonce: BigInt(nonce)
            },
            {
                reward,
                rewardRate,
                bonusReward: bonusReward || 0n,
                bonusRewardRate: bonusRewardRate || 0n,
                minimalPositionWidth: 0
            },
            plugin
        ] : undefined
    })

    const { data, write: onCreate } = useContractWrite(config)

    const { isLoading } = useTransitionAwait(data?.hash, `Create Farm`)

    const isDisabled = !isKeyReady || !areRewardsReady || !onCreate || isLoading

    return <button disabled={isDisabled} onClick={() => onCreate && onCreate()} type={'submit'} className="py-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed">{
        isLoading ? <Loader /> : 'Create Farm'
    }</button>
}

export default CreateFarmButton