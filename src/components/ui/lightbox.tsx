"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";

interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    currentIndex: number;
    onNavigate: (index: number) => void;
    swipeText: string;
}

export function Lightbox({
    isOpen,
    onClose,
    images,
    currentIndex,
    onNavigate,
    swipeText,
}: LightboxProps) {
    const startXRef = useRef<number | null>(null);
    const [showSwipeText, setShowSwipeText] = useState(true);

    const moveLeft = () => {
        onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
    };

    const moveRight = () => {
        onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
    };

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

    // Hide swipe text after 5 seconds when lightbox opens
    useEffect(() => {
        if (isOpen) {
            setShowSwipeText(true);
            const timer = setTimeout(() => {
                setShowSwipeText(false);
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case "Escape":
                    onClose();
                    break;
                case "ArrowLeft":
                    onNavigate(
                        currentIndex > 0 ? currentIndex - 1 : images.length - 1
                    );
                    break;
                case "ArrowRight":
                    onNavigate(
                        currentIndex < images.length - 1 ? currentIndex + 1 : 0
                    );
                    break;
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            {/* Close button (X) */}
            <button
                onClick={onClose}
                className="fixed top-6 right-8 z-50 p-3 text-black hover:bg-black/10 rounded-full transition-colors"
                aria-label="Close"
            >
                <X size={36} />
            </button>

            {/* Navigation arrows - hidden on mobile */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={() =>
                            onNavigate(
                                currentIndex > 0
                                    ? currentIndex - 1
                                    : images.length - 1
                            )
                        }
                        className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-50 p-3 text-black hover:bg-black/10 rounded-full transition-colors"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={48} />
                    </button>
                    <button
                        onClick={() =>
                            onNavigate(
                                currentIndex < images.length - 1
                                    ? currentIndex + 1
                                    : 0
                            )
                        }
                        className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-50 p-3 text-black hover:bg-black/10 rounded-full transition-colors"
                        aria-label="Next image"
                    >
                        <ChevronRight size={48} />
                    </button>
                </>
            )}

            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
                {/* Image with swipe functionality */}
                <div
                    className="relative w-full h-full flex items-center justify-center"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <img
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain select-none"
                        draggable={false}
                    />
                    {showSwipeText && (
                        <div className="absolute lg:hidden bottom-12 left-0 right-0 flex justify-center items-center">
                            <div className="flex gap-x-2 items-center w-fit animate-pulse-scale">
                                <ArrowLeft className="h-4 w-4 text-black" />
                                <p className="text-black text-sm">{swipeText}</p>
                                <ArrowRight className="h-4 w-4 text-black" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
