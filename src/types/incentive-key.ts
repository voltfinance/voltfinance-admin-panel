import { Address } from 'viem';

export type IncentiveKey = {
    rewardToken: Address;
    bonusRewardToken: Address;
    pool: Address;
    nonce: bigint;
};

export type PartialIncentiveKey = Partial<IncentiveKey>;
