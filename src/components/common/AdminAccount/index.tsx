import { useAlgebraFactoryHasRoleOrOwner } from "@/generated"
import { useAccount } from "wagmi"

const ADMIN_ROLE_CONSTANT = '0xa777c10270ee0b99d2c737c09ff865ed48064b252418bbd31d39c8b88ea12219'

const AdminAccount = () => {

    const { address: account } = useAccount()

    const { data: isAdmin, isLoading } = useAlgebraFactoryHasRoleOrOwner({
        args: account ? [
            ADMIN_ROLE_CONSTANT,
            account
        ] : undefined
    })

    if (!account) return

    return !isAdmin && !isLoading && <div className="fixed top-0 left-0 right-0 text-white text-center bg-red-500">
        Connect admin account
    </div>

}

export default AdminAccount