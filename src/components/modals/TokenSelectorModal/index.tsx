import { TokenSelector } from '@/components/common/TokenSelector';
import {
    Credenza,
    CredenzaBody,
    CredenzaClose,
    CredenzaContent,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from '@/components/ui/credenza';
import { Currency } from '@cryptoalgebra/fuse-sdk';

interface ITokenSelectorModal {
    isOpen: boolean;
    setIsOpen: (state: boolean) => void;
    onSelect: (currency: Currency) => void;
    otherCurrency?: Currency | null | undefined;
    children: React.ReactNode;
}

const TokenSelectorModal = ({ isOpen, setIsOpen, onSelect, otherCurrency, children }: ITokenSelectorModal) => {
    return (
        <Credenza open={isOpen}>
            <CredenzaTrigger asChild>{children}</CredenzaTrigger>
            <CredenzaContent
                className="bg-white !rounded-3xl"
                onInteractOutside={() => setIsOpen(false)}
                onEscapeKeyDown={() => setIsOpen(false)}
            >
                <CredenzaHeader>
                    <CredenzaTitle>Select a token</CredenzaTitle>
                </CredenzaHeader>
                <CredenzaBody>
                    <TokenSelector onSelect={onSelect} otherCurrency={otherCurrency} />
                </CredenzaBody>
                <CredenzaClose asChild>
                    <button
                        className="absolute right-4 top-4 rounded-sm opacity-70"
                        onClick={() => setIsOpen(false)}
                        style={{ zIndex: 999 }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                        >
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </button>
                </CredenzaClose>
            </CredenzaContent>
        </Credenza>
    );
};

export default TokenSelectorModal;
