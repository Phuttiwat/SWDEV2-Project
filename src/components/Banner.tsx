'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Banner() {
    const cover = '/img/cover.png'
    const [index, setIndex] = useState(0)
    const router = useRouter()
    const { data: session } = useSession()

    return (
        <div
            className="relative w-full min-h-[60vh] flex-none overflow-hidden"
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
                    Inventory & Transaction Management, simplified
                </h1>

                {/* Subheadline */}
                <h3 className="mt-4 text-lg md:text-2xl font-serif text-white drop-shadow-sm max-w-4xl">
                    Track stock, record transactions, and generate reports — all in one place.
                </h3>
            </div>

            {session && (
                <div className="absolute top-4 right-4 z-30 font-semibold text-cyan-600 text-xl bg-white/80 rounded px-3 py-1">
                    Welcome back, {session.user?.name}
                </div>
            )}

            <button
                className="absolute bottom-4 right-4 z-30 bg-white text-cyan-600 border border-cyan-600 font-semibold py-3 px-5 rounded hover:bg-cyan-600 hover:text-white"
                onClick={(e) => { e.stopPropagation(); router.push('/product') }}
                aria-label="View Inventory"
            >
                View Inventory
            </button>
        </div>
    )
}
