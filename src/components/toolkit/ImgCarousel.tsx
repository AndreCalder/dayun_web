"use client"

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'

function ImgCarousel({
    img_links
}: Readonly<{
    img_links: Array<string>
}>) {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
    const startXRef = useRef<number | null>(null);
    const startYRef = useRef<number | null>(null);
    const [images, setImages] = useState<Array<React.ReactNode>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const moveLeft = () => {
        console.log("Moving left", currentImageIndex, img_links.length);
        if (currentImageIndex === img_links.length - 1) {
            setCurrentImageIndex(0);
        } else {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    }

    const moveRight = () => {
        console.log("Moving right", currentImageIndex, img_links.length);
        if (currentImageIndex === 0) {
            setCurrentImageIndex(img_links.length - 1);
        } else {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    }
    const handleStart = (clientX: number) => {
        startXRef.current = clientX;
    };

    const handleEnd = (clientX: number) => {
        if (startXRef.current !== null) {
            const endX = clientX;
            const diffX = endX - startXRef.current;
            if (diffX > 50) {
                moveRight();
            } else if (diffX < -50) {
                moveLeft();
            }
            startXRef.current = null;
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
    const handleMouseUp = (e: React.MouseEvent) => handleEnd(e.clientX);


    // Touch event handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        handleStart(touch.clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touch = e.changedTouches[0];
        handleEnd(touch.clientX);
    };

    const finishLoading = () => {
        console.log(loading);
        console.log("Finished loading");
        if (loading) {
            setLoading(false);
        }
    }

    return (
        <>
            {
                loading &&
                <div className='h-full w-full flex justify-center items-center z-50 absolute top-0 left-0 right-0 bottom-0'>
                    <Image
                        src="/Tetera.gif" // Relative path to the gif in your public folder
                        alt="Loading GIF"
                        width={200} // Provide the width
                        height={200} // Provide the height
                        priority={true} // Preload the GIF if needed
                    />
                </div>
            }
            <div className='flex h-full w-lvw overflow-y-hidden overflow-x-auto whitespace-nowrap'>
                <ArrowLeft className='absolute top-1/2 left-0 ml-2 transform -translate-y-1/2 cursor-pointer text-white' onClick={() => {
                    moveLeft();
                }} />
                {
                    <div className="h-full w-[100vw] flex-shrink-0 overflow-hidden" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                        <Image alt={`Cover`} onLoadingComplete={() => finishLoading()} priority={true} src={img_links[currentImageIndex]} className='h-full w-full object-cover' width={0} height={0} sizes='100vw' style={{ width: "100vw", height: "100%" }} draggable={false} />
                    </div>
                }
                <ArrowRight className='absolute top-1/2 right-0 mr-2 transform -translate-y-1/2 cursor-pointer text-white' onClick={() => {
                    moveRight();
                }} />
            </div>


        </>
    )
}

export default ImgCarousel