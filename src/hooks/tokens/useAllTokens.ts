import { TokenFieldsFragment, useAllTokensQuery } from '@/graphql/generated/graphql';
import { useTokensState } from '@/state/tokensStore';
import { useMemo } from 'react';
import { Address } from 'viem';
import { useChainId } from 'wagmi';

export function useAllTokens() {
    const chainId = useChainId();

    const { data: allTokens, loading } = useAllTokensQuery();

    const { importedTokens } = useTokensState();

    const tokensBlackList: Address[] = useMemo(() => [], []);

    const mergedTokens = useMemo(() => {
        if (!allTokens) return [];

        const tokens = new Map<Address, TokenFieldsFragment>();

        for (const token of allTokens.tokens.filter((token) => !tokensBlackList.includes(token.id as Address))) {
            tokens.set(token.id.toLowerCase() as Address, { ...token });
        }

        const _importedTokens = Object.values(importedTokens[chainId] || []);

        for (const token of _importedTokens) {
            tokens.set(token.id.toLowerCase() as Address, {
                ...token,
                derivedMatic: 0,
            });
        }

        return [...tokens].map(([, token]) => ({ ...token }));
    }, [allTokens, importedTokens, tokensBlackList, chainId]);

    return useMemo(
        () => ({
            tokens: mergedTokens,
            isLoading: loading || Boolean(allTokens && !mergedTokens.length),
        }),
        [mergedTokens, allTokens, loading]
    );
}
