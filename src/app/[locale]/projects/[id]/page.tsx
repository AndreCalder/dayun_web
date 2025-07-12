"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ProjectType } from "@/lib/definitions";
import { getProject } from "@/app/api";
import { toast } from "sonner";
import { Lightbox } from "@/components/ui/lightbox";

function ProjectDetail() {
    const params = useParams();
    const t = useTranslations("Projects");
    const [project, setProject] = useState<ProjectType | null>(null);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const fetchProject = async () => {
        try {
            const projectId = params.id as string;
            const response = await getProject(projectId);
            if (response.status === 200) {
                setProject(response.data.project);
            } else {
                toast.error("Error al obtener el proyecto");
            }
        } catch (error) {
            console.error("Error fetching project:", error);
            toast.error("Error al obtener el proyecto");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [params.id]);

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    if (loading) {
        return (
            <div className="h-full w-full flex justify-center items-center z-50 absolute top-0 left-0 right-0 bottom-0">
                <Image
                    src="/Tetera.gif" // Relative path to the gif in your public folder
                    alt="Loading GIF"
                    width={200} // Provide the width
                    height={200} // Provide the height
                    priority={true} // Preload the GIF if needed
                />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="h-svh flex items-center justify-center">
                <p className="text-2xl">Proyecto no encontrado</p>
            </div>
        );
    }

    return (
        <div className="h-svh w-full px-5 lg:px-20 pt-20 flex flex-col">
            <div className="container mx-auto overflow-y-scroll">
                <div className="w-full grid grid-cols-2 pb-10">
                    <div className="col-span-2 lg:col-span-1">
                        <h1 className="text-3xl lg:text-5xl font-bold mb-6 text-left tracking-wide">
                            {project.title.toUpperCase()}
                        </h1>

                        {project.description && (
                            <div className="mb-8 text-left">
                                <p className="text-lg text-gray-700 max-w-3xl tracking-wide">
                                    {project.description}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="col-span-2">
                        <div className="w-full flex justify-center mb-10">
                            <p className="text-2xl underline underline-offset-8">
                                {t("gallery")}
                            </p>
                        </div>
                        {project.gallery && project.gallery.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {project.gallery.map((imageUrl, index) => (
                                    <div
                                        key={index}
                                        className="aspect-square cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden shadow-lg"
                                        onClick={() => handleImageClick(index)}
                                    >
                                        <Image
                                            src={imageUrl}
                                            alt={`${project.title} - ${
                                                index + 1
                                            }`}
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <Lightbox
                    isOpen={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                    images={project.gallery || []}
                    currentIndex={currentImageIndex}
                    onNavigate={setCurrentImageIndex}
                    swipeText={t("swipe")}
                />
            </div>
        </div>
    );
}

export default ProjectDetail;
