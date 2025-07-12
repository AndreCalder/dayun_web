"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getWorks } from "@/app/api";
import { WorkType } from "@/lib/definitions";
import { Lightbox } from "@/components/ui/lightbox";
import { useTranslations } from "next-intl";

function Works() {
    const t = useTranslations("Works");
    const [works, setWorks] = useState<WorkType[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedWork, setSelectedWork] = useState<WorkType | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImages, setLightboxImages] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const res = await getWorks();
                if (res.data && res.data.works) {
                    setWorks(res.data.works);
                } else {
                    setWorks([]);
                }
            } catch (error) {
                setWorks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchWorks();
    }, []);

    const handleCardClick = (work: WorkType) => {
        setSelectedWork(work);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedWork(null);
    };

    const handleSideImageClick = (imgIdx: number) => {
        if (!selectedWork) return;
        const gallery = selectedWork.gallery || [];
        const images = [selectedWork.img_url, ...gallery.slice(0, 3)];
        setLightboxImages(images);
        setLightboxIndex(imgIdx);
        setLightboxOpen(true);
    };

    const handleLightboxClose = () => {
        setLightboxOpen(false);
    };

    const handleLightboxNavigate = (idx: number) => {
        setLightboxIndex(idx);
    };

    return (
        <div className="min-h-screen bg-[#F6F9FB] px-4 md:px-12 py-16">
            {loading ? (
                <div className="h-full w-full flex justify-center items-center z-50 absolute top-0 left-0 right-0 bottom-0">
                    <Image
                        src="/Tetera.gif"
                        alt="Loading GIF"
                        width={200}
                        height={200}
                        priority={true}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-scroll">
                    {works.map((work, idx) => (
                        <div
                            key={work._id?.$oid || idx}
                            className="flex flex-col items-center p-4 hover:scale-105 transition-all duration-300 cursor-pointer"
                            onClick={() => handleCardClick(work)}
                        >
                            <div className="w-full aspect-square relative mb-4">
                                <Image
                                    src={work.img_url}
                                    alt={work.title}
                                    fill
                                    className="object-cover border border-gray-200"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    priority={idx < 3}
                                />
                            </div>
                            <div className="w-full space-y-2">
                                <h3 className="font-bold text-sm tracking-widest text-left">
                                    {work.title.toUpperCase()}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal */}
            {modalOpen && selectedWork && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-5">
                    {/* Close button */}
                    <div className="w-full flex items-center justify-between py-3">
                        <Image
                            src="/Dayun_Black.svg"
                            alt="Dayun"
                            width={155}
                            height={55}
                        />
                        <button
                            onClick={handleModalClose}
                            className="fixed top-6 right-8 z-50 p-3 text-black hover:bg-black/10 rounded-full transition-colors"
                            aria-label="Close"
                        >
                            <span style={{ fontSize: 32, fontWeight: "bold" }}>
                                ×
                            </span>
                        </button>
                    </div>
                    <div className="flex flex-col md:flex-row justify-start items-center w-full h-svh overflow-hidden">
                        {/* Side images */}
                        <div className="w-full h-fit flex flex-col md:flex-row justify-start items-center">
                            <div className="hidden md:flex md:flex-col h-[stretch] justify-between items-center gap-2 px-4 md:w-1/5 w-fit max-w-xl aspect-square">
                                {[
                                    selectedWork.img_url,
                                    ...(selectedWork.gallery
                                        ? selectedWork.gallery.slice(0, 2)
                                        : []),
                                ].map((img, idx) => (
                                    <div
                                        key={img}
                                        className="relative aspect-square w-44 h-44  overflow-hidden border border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() =>
                                            handleSideImageClick(idx)
                                        }
                                        style={{
                                            backgroundImage: `url(${img})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    ></div>
                                ))}
                            </div>
                            {/* Main image and details */}
                            <div className="flex-1 flex flex-col md:flex-row items-center md:items-start gap-8 overflow-auto">
                                <div
                                    className="relative w-full max-w-xl aspect-square flex-shrink-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${selectedWork.img_url})`,
                                    }}
                                ></div>
                                <div className="flex md:hidden gap-2 p-4 w-full overflow-x-scroll">
                                    {[
                                        selectedWork.img_url,
                                        ...(selectedWork.gallery
                                            ? selectedWork.gallery.slice(0, 3)
                                            : []),
                                    ].map((img, idx) => (
                                        <div
                                            key={img}
                                            className="relative aspect-square w-24 h-24 md:w-full md:h-24  overflow-hidden border border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                                            onClick={() =>
                                                handleSideImageClick(idx)
                                            }
                                        >
                                            <Image
                                                src={img}
                                                alt={
                                                    selectedWork.title +
                                                    " " +
                                                    idx
                                                }
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-1 flex flex-col h-[stretch] justify-between gap-4">
                                    <div className="w-full h-fit flex flex-col gap-y-8">
                                        <div className="w-fit border-b-2 border-black">
                                            <h2 className="text-3xl font-bold tracking-widest mb-2 mr-6">
                                                {selectedWork.title.toUpperCase()}
                                            </h2>
                                        </div>
                                        {selectedWork.description && (
                                            <p className="text-base tracking-wide text-gray-900 mb-4 pr-10">
                                                {selectedWork.description.toUpperCase()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-full h-fit flex flex-col gap-y-2">
                                        <div className="w-fit border-b-2 border-black">
                                            <h2 className="text-lg tracking-wide mb-1 mr-6">
                                                {t(
                                                    "characterstics"
                                                ).toUpperCase()}
                                            </h2>
                                        </div>
                                        <div className="text-sm text-gray-800 space-y-1">
                                            {selectedWork.measurements && (
                                                <div>
                                                    <span className="mr-2">
                                                        {t("measurements")}
                                                    </span>{" "}
                                                    {selectedWork.measurements.toUpperCase()}
                                                </div>
                                            )}
                                            {selectedWork.material && (
                                                <div>
                                                    <span className="mr-2">
                                                        {t("material")}
                                                    </span>{" "}
                                                    {selectedWork.material.toUpperCase()}
                                                </div>
                                            )}
                                            {selectedWork.technique && (
                                                <div>
                                                    <span className="mr-2">
                                                        {t("technique")}
                                                    </span>{" "}
                                                    {selectedWork.technique.toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            <Lightbox
                isOpen={lightboxOpen}
                onClose={handleLightboxClose}
                images={lightboxImages}
                currentIndex={lightboxIndex}
                onNavigate={handleLightboxNavigate}
            />
        </div>
    );
}

export default Works;
