'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Banner() {
    const covers = ['/img/cover.jpg', '/img/cover2.jpg', '/img/cover3.jpg', '/img/cover4.jpg']
    const [index, setIndex] = useState(0)
    const router = useRouter()
    const { data: session } = useSession()

    return (
        <div
            // ปรับเป็น w-full, ใช้ min-h, ห้าม shrink ใน flex, ซ่อน overflow
            className="relative w-full min-h-[60vh] flex-none overflow-hidden"
            onClick={() => setIndex(index + 1)}
        >
            {/* Next/Image with fill ต้องมี parent position:relative (เราใส่แล้ว) */}
            <Image
                src={covers[index % covers.length]}
                alt="banner"
                fill
                priority
                className="object-cover"
            />

            {/* ข้อความ: ใช้ absolute + flex centering แทน top:250px */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md">
                    where every event finds its venue
                </h1>
                <h3 className="mt-4 text-lg md:text-2xl font-serif text-white drop-shadow-sm max-w-4xl">
                    Finding the perfect venue has never been easier. Whether it's a wedding, corporate event,
                    or private party, we connect people to the perfect place.
                </h3>
            </div>

            {/* welcome text */}
            {session && (
                <div className="absolute top-4 right-4 z-30 font-semibold text-cyan-600 text-xl bg-white/80 rounded px-3 py-1">
                    Welcome {session.user?.name}
                </div>
            )}

            {/* button */}
            <button
                className="absolute bottom-4 right-4 z-30 bg-white text-cyan-600 border border-cyan-600 font-semibold py-3 px-5 rounded hover:bg-cyan-600 hover:text-white"
                onClick={(e) => { e.stopPropagation(); router.push('/product') }}
            >
                Select Product
            </button>
        </div>
    )
}
