import Image from 'next/image'
import TopMenuItem from './TopMenuItem'
import { getServerSession } from 'next-auth'
import { authOptions } from '../app/api/auth/[...nextauth]/authOptions'
import getUserRole from '../libs/getUserRole'
// import { Link } from '@mui/material'
import Link from 'next/link'
import SignOutButton from './SignOutButton'

export default async function TopMenu() {

    const session = await getServerSession(authOptions)
    const userRole = session?.user?.token ? await getUserRole(session.user.token) : null
    const isAdmin = userRole === 'admin'
    return (
        <div className="w-full bg-white relative">
            <div className="w-full flex items-center justify-between px-6 py-3 max-w-[1920px] mx-auto">
                {/* Left side - Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center mr-8">
                        <Image
                            src="/img/logo.png"
                            alt="logo"
                            width={100}
                            height={20}
                            className="object-contain"
                            priority
                        />
                    </Link>
                    
                    {/* Navigation Links */}
                    <nav className="flex items-center gap-6">
                        <Link 
                            href="/product" 
                            className="text-[#232f3e] text-sm font-normal hover:text-[#ff9900] transition-colors"
                        >
                            Products
                        </Link>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <Link 
                            href="/request" 
                            className="text-[#232f3e] text-sm font-normal hover:text-[#ff9900] transition-colors"
                        >
                            Request
                        </Link>
                    </nav>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-4">
                    {
                        isAdmin && (
                            <Link 
                                href="/product/manage" 
                                className="text-[#232f3e] text-sm font-normal hover:text-[#ff9900] transition-colors"
                            >
                                Add Product
                            </Link>
                        )
                    }
                    {
                        session ? (
                            <SignOutButton userName={session.user?.name || 'User'} />
                        ) : (
                            <>
                                <Link 
                                    href="/login" 
                                    className="text-[#232f3e] text-sm font-normal hover:text-[#ff9900] transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link 
                                    href="/register" 
                                    className="bg-[#232f3e] text-white px-4 py-2 rounded-full text-sm font-normal hover:bg-[#37475a] transition-colors"
                                >
                                    Create account
                                </Link>
                            </>
                        )
                    }
                </div>
            </div>
            {/* Bottom border line - AWS style */}
            <div className="h-[2px] bg-[#146eb4] w-full"></div>
        </div>
    )
}