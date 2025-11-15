import Image from 'next/image'
import TopMenuItem from './TopMenuItem'
import { getServerSession } from 'next-auth'
import { authOptions } from '../app/api/auth/[...nextauth]/authOptions'
import getUserRole from '../libs/getUserRole'
// import { Link } from '@mui/material'
import Link from 'next/link'

export default async function TopMenu() {

    const session = await getServerSession(authOptions)
    const userRole = session?.user?.token ? await getUserRole(session.user.token) : null
    const isAdmin = userRole === 'admin'
    return (
        <div className="w-full flex items-center py-2 bg-white border-b">
            {/* Left side - Sign-In and My Booking */}
            <div className="flex items-center gap-4 pl-8">
                {
                    session ? <Link href="/api/auth/signout">
                        <div className="px-2 text-amber-700 underline cursor-pointer hover:text-amber-900">
                            Sign-Out of {session.user?.name}</div></Link>
                        : <>
                            <Link href="/api/auth/signin">
                                <div className="px-2 text-amber-700 underline cursor-pointer hover:text-amber-900">
                                    Sign-In</div>
                            </Link>
                            <Link href="/register">
                                <div className="px-2 text-amber-700 underline cursor-pointer hover:text-amber-900">
                                    Register</div>
                            </Link>
                        </>
                }
                <Link href="/myrequest">
                    <div className="px-2 text-amber-700 underline cursor-pointer hover:text-amber-900">
                        {isAdmin ? 'All Requests' : 'My Request'}
                    </div>
                </Link>
                {
                    isAdmin && <Link href="/product/add">
                        <div className="px-2 text-amber-700 underline cursor-pointer hover:text-amber-900">
                            Add Product</div>
                    </Link>
                }
            </div>

            {/* Right side - Booking menu and Logo */}
            <div className="flex items-center gap-4 ml-auto pr-8">
                {!isAdmin && <TopMenuItem title='Request' pageRef='/request' />}
                <Link href="/">
                    <div className="relative bg-amber-50 px-4 py-2 rounded cursor-pointer">
                        <Image
                            src={'/img/logo.png'}
                            className="h-12 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-200"
                            alt='logo'
                            width={0}
                            height={0}
                            sizes='100px'
                        />
                    </div>
                </Link>
            </div>
        </div>
    )
}