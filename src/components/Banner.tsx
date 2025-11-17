'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Banner() {
    const cover = '/img/banner.jpg'
    const [index, setIndex] = useState(0)
    const router = useRouter()
    const { data: session } = useSession()

    return (
        <div
            className="relative w-full h-[calc(95vh-54px)] flex-none overflow-hidden"
        >
            <Image
                src={cover}
                alt="banner"
                fill
                priority
                className="object-cover"
            />

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
                {/* Headline */}
                <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md">
                    Inventory Management
                </h1>

                {/* Subheadline */}
                <h3 className="mt-4 text-lg md:text-2xl font-serif text-white drop-shadow-sm max-w-4xl">
                    View Products & Make Transaction Request 
                </h3>
            </div>

            <button
                className="absolute bottom-4 right-4 z-30 bg-white text-cyan-600 border border-cyan-600 font-semibold py-3 px-5 rounded hover:bg-cyan-600 hover:text-white"
                onClick={(e) => { e.stopPropagation(); router.push('/product') }}
                aria-label="View Product"
            >
                View Product
            </button>
        </div>
    )
}
