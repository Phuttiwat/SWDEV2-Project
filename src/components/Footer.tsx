import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
    return (
        <footer className="w-full bg-[#232f3e] text-white mt-auto">
            <div className="w-full max-w-[1920px] mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center mb-4">
                            <Image
                                src="/img/logo.png"
                                alt="logo"
                                width={100}
                                height={20}
                                className="object-contain brightness-0 invert"
                                priority
                            />
                        </Link>
                        <p className="text-gray-300 text-sm max-w-md">
                            Inventory Management System - Efficiently manage your products and handle transaction requests with ease.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    href="/product" 
                                    className="text-gray-300 text-sm hover:text-[#ff9900] transition-colors"
                                >
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/request" 
                                    className="text-gray-300 text-sm hover:text-[#ff9900] transition-colors"
                                >
                                    Request
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm">Contact</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>Email: support@inventory.com</li>
                            <li>Phone: +66 XX XXX XXXX</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 border-t border-gray-600">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-xs">
                            © {new Date().getFullYear()} Inventory Management System. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link 
                                href="#" 
                                className="text-gray-400 text-xs hover:text-[#ff9900] transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link 
                                href="#" 
                                className="text-gray-400 text-xs hover:text-[#ff9900] transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

