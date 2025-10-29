'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./banner.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Banner() {
    const covers = ['/img/cover.jpg', '/img/cover2.jpg', '/img/cover3.jpg', '/img/cover4.jpg']
    const [index, setIndex] = useState(0)
    const router = useRouter()
    const {data: session} = useSession()
    return(
        <div className={styles.banner} onClick={()=>{setIndex(index + 1)}}>
            <Image src={covers[index % covers.length]} 
            alt='banner'
            fill={true}
            priority
            className="object-cover"
            />
            <div className={styles.bannerText}>
                <h1 className="text-4xl font-bold">where every event finds its venue</h1>
                <h3 className="text-xl font-serif">Finding the perfect venue has never been easier. Whether it's a wedding, corporate event, or private party, we connect people to the perfect place.</h3>
            </div>
            {
                session ? <div className="z-30 absolute top-2 right-4 font-semibold text-cyan-600 text-xl">
                    Welcome {session.user?.name}</div> 
                    : null
            }
            <button className="bg-white text-cyan-600 border-cyan-600 font-semibold !py-3 !px-5 rounded z-30 absolute bottom-4 right-4 hover:bg-cyan-600 hover:text-white hover:border-transparent flex items-center"
            onClick={(e)=> { e.stopPropagation(); router.push('/venue')}}>
                Select Venue
            </button>
        </div>
    );
}