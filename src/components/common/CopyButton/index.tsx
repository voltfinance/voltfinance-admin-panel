import { Copy } from "lucide-react"
import { useState } from "react"

interface ICopyButton {
    data: string
}

const CopyButton = ({ data }: ICopyButton) => {

    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(data).then(() => {
            setIsCopied(true)
            setTimeout(() => {
                setIsCopied(false)
            }, 3000)
        })
    }

    return <button className="relative inline hover:text-black/50" onClick={handleCopy}>
        <Copy size={14}/>
        { isCopied && <div className="absolute text-xs left-1/2 -top-5 -translate-x-1/2">Copied</div> }
    </button>

}

export default CopyButton
