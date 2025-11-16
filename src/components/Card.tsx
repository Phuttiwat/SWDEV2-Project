"use client";

import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import { Rating } from "@mui/material";
import { useState, useEffect } from "react";

export default function Card({ 
    venueName, 
    imgSrc, 
    onRatingChange, 
    initialRating = 0,
    actionButtons,
}: {
    venueName: string, 
    imgSrc: string, 
    onRatingChange?: (venueName: string, rating: number) => void, 
    initialRating?: number,
    actionButtons: React.ReactNode
}) {
    const [rating, setRating] = useState<number>(initialRating);

    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
        const newRating = newValue || 0;
        setRating(newRating);
        if (onRatingChange) {
            onRatingChange(venueName, newRating);
        }
    };

    return(
        <InteractiveCard contentName={venueName}>
            <div className='w-full h-[70%] relative rounded-t-lg'>
                <Image src={imgSrc}
                    alt="card"
                    fill={true}
                    className="object-cover rounded-t-lg"
                />
            </div>
            <div className='w-full h-[15%] p-[10px]'>
                {venueName}
            </div>

            <div className='w-full h-[15%] px-4 py-2 flex justify-between items-center'>
                {/* ส่วนของ Rating (อยู่ซ้าย) */}
                <div>
                    {
                        onRatingChange && <Rating
                            id={`${venueName} Rating`}
                            name={`${venueName} Rating`}
                            data-testid={`${venueName} Rating`}
                            value={rating}
                            onChange={handleRatingChange}
                            onClick={(e) => { e.stopPropagation(); }}
                            size="large" 
                        />
                    }
                </div>
                
                <div className="mt-3">{actionButtons}</div>
            </div>
        </InteractiveCard>
    );
}