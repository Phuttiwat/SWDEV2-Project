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
            {/* Left side - Logo, Request, and Products */}
            <div className="flex items-center gap-4 pl-8">
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
                <TopMenuItem title='Request' pageRef='/request' />
                <TopMenuItem title='Products' pageRef='/product' />
            </div>

            {/* Right side - Sign-In, Register, My Request, Add Product */}
            <div className="flex items-center gap-4 ml-auto pr-8">
                {
                    session ? (
                        <Link href="/api/auth/signout" className="bg-red-500 px-4 py-2 rounded text-center hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md">
                            <div className="font-semibold text-white">Sign-Out of {session.user?.name}</div>
                        </Link>
                    ) : (
                        <>
                                <Link href="/api/auth/signin" className="bg-green-500 px-4 py-2 rounded text-center hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md">
                                <div className="font-semibold text-white">Sign-In</div>
                            </Link>
                            <Link href="/register" className="bg-blue-500 px-4 py-2 rounded text-center hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md">
                                <div className="font-semibold text-white">Register</div>
                            </Link>
                        </>
                    )
                }
                {
                    isAdmin && (
                        <Link href="/product/add" className="bg-green-50 px-4 py-2 rounded text-center hover:bg-green-100 transition-all duration-200 border border-green-200 hover:border-green-300 hover:shadow-sm">
                            <div className="font-semibold text-green-700">Add Product</div>
                        </Link>
                    )
                }
            </div>
        </div>
    )
}