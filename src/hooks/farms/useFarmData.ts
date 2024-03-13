import { useAlgebraPoolToken0, useAlgebraPoolToken1 } from "@/generated";
import { FarmingFieldsFragment } from "@/graphql/generated/graphql";
import { formatUnits } from "viem";
import { useToken } from "wagmi";

export function useFarmData (farm: FarmingFieldsFragment | null | undefined) {

    const { pool, rewardToken, bonusRewardToken, reward, rewardRate, bonusReward, bonusRewardRate, nonce } = farm || {}

    const { data: _token0 } = useAlgebraPoolToken0({
        address: pool
    })

    const { data: _token1 } = useAlgebraPoolToken1({
        address: pool
    })

    const { data: token0 } = useToken({
        address: _token0
    })

    const { data: token1 } = useToken({
        address: _token1
    })

    const { data: _rewardToken } = useToken({
        address: rewardToken
    })

    const { data: _bonusRewardToken } = useToken({
        address: bonusRewardToken
    })

    const formattedReward = _rewardToken ? Number(formatUnits(BigInt(reward), _rewardToken.decimals)).toFixed(3) : undefined
    const formattedBonusReward = _bonusRewardToken ? Number(formatUnits(BigInt(bonusReward), _bonusRewardToken.decimals)).toFixed(3) : undefined

    const formattedRewardRate = _rewardToken ? Number(formatUnits(BigInt(rewardRate), _rewardToken.decimals)) : undefined
    const formattedBonusRewardRate = _bonusRewardToken ? Number(formatUnits(BigInt(bonusRewardRate), _bonusRewardToken.decimals)) : undefined

    const rewardRates: [ { value: bigint, decimals: number }, { value: bigint, decimals: number } ] = [{value: BigInt(rewardRate), decimals: _rewardToken?.decimals || 0 }, { value: BigInt(bonusRewardRate), decimals: _bonusRewardToken?.decimals || 0 }]

    return {
        token0,
        token1,
        pool,
        rewardToken: _rewardToken,
        bonusRewardToken: _bonusRewardToken,
        reward: formattedReward,
        bonusReward: formattedBonusReward,
        rewardRate: formattedRewardRate,
        bonusRewardRate: formattedBonusRewardRate,
        nonce,
        rewardRates
    }

}