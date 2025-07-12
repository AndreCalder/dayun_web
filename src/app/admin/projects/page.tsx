"use client";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { uploadImage } from "@/app/actions";
import CardComponent from "@/components/toolkit/CardComponent";
import { CardAction, ProjectType } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import Modal from "@/components/toolkit/Modal";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { toast } from "sonner";
import {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
} from "@/app/api";
import { Trash2, Edit, X } from "lucide-react";

function Projects() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [galleryFiles, setGalleryFiles] = useState<Array<File>>([]);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [galleryPreviews, setGalleryPreviews] = useState<Array<string>>([]);
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [editingProject, setEditingProject] = useState<ProjectType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleGalleryUpload = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files || []);
        setGalleryFiles(prevFiles => [...prevFiles, ...files]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryPreviews(prevPreviews => [
                    ...prevPreviews,
                    reader.result as string,
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeGalleryImage = (
        event: React.MouseEvent<HTMLDivElement>,
        index: number
    ) => {
        event.stopPropagation();
        setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
        setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
        if (editingProject) {
            setEditingProject({
                ...editingProject,
                gallery:
                    editingProject?.gallery?.filter((_, i) => i !== index) || [],
            });
        }
    };

    const submitData = async () => {
        setIsSubmitting(true);
        if (title === "" || galleryFiles.length === 0) {
            toast.error("Favor de llenar todos los datos requeridos");
        } else {
            let galleryUrls: string[] = [];

            // Upload gallery images
            if (galleryFiles.length > 0) {
                let galleryUploadPromises = galleryFiles.map(
                    async (file) => {
                        const formData = new FormData();
                        formData.append("file", file);
                        return uploadImage(formData);
                    }
                );

                let galleryResponses = await Promise.all(
                    galleryUploadPromises
                );
                galleryUrls = galleryResponses.filter(
                    (url) => url
                ) as string[];
            }

            let payload: ProjectType = {
                title: title,
                description: description,
                gallery: galleryUrls,
            };
            let creationRes = await createProject(payload);
            if (creationRes.status == 200) {
                toast.success("Proyecto registrado!");
                setModalOpen(false);
                resetForm();
                getProjectsData();
            } else {
                toast.error("Error al crear el proyecto");
            }
        }
        setIsSubmitting(false);
    };

    const openEditModal = async (project: ProjectType) => {
        setEditingProject(project);
        setTitle(project.title);
        setDescription(project.description || "");
        setGalleryPreviews(project.gallery || []);
        setEditModalOpen(true);
    };

    const submitEdit = async () => {
        setIsSubmitting(true);
        if (!editingProject || title === "") {
            toast.error("Favor de llenar todos los datos");
            return;
        }

        let galleryUrls: string[] = [...(editingProject.gallery || [])];

        if (galleryFiles.length > 0) {
            let galleryUploadPromises = galleryFiles.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                return uploadImage(formData);
            });

            let galleryResponses = await Promise.all(galleryUploadPromises);
            const newUrls = galleryResponses.filter((url) => url) as string[];
            galleryUrls = [...galleryUrls, ...newUrls];
        }

        let payload: ProjectType = {
            project_id: editingProject._id?.$oid,
            title: title,
            description: description,
            gallery: galleryUrls,
        };

        let updateRes = await updateProject(payload);
        if (updateRes.status == 200) {
            toast.success("Proyecto actualizado!");
            setEditModalOpen(false);
            resetForm();
            getProjectsData();
        } else {
            toast.error("Error al actualizar el proyecto");
        }
        setIsSubmitting(false);
    };

    const handleDeleteProject = async (projectId: string) => {
        try {
            let deleteRes = await deleteProject(projectId);
            if (deleteRes.status == 200) {
                toast.success("Proyecto eliminado!");
                getProjectsData();
            } else {
                toast.error("Error al eliminar el proyecto");
            }
        } catch (error) {
            toast.error("Error al eliminar el proyecto");
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setGalleryFiles([]);
        setGalleryPreviews([]);
        setEditingProject(null);
    };

    const getProjectsData = async () => {
        try {
            let projectsRes = await getProjects();
            if (projectsRes.status === 200) {
                setProjects(projectsRes.data.projects);
            } else {
                toast.error("Error al obtener los proyectos");
            }
        } catch (error) {
            toast.error("Error al obtener los proyectos");
        }
    };

    useEffect(() => {
        getProjectsData();
    }, []);

    return (
        <>
            {/* Registration Modal */}
            <Modal
                title="Registro de Proyecto"
                open={modalOpen}
                setOpen={setModalOpen}
            >
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                        className="w-full"
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                        className="w-full"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción del proyecto..."
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="gallery">Galería de Imágenes</Label>
                    <Input
                        className="w-full"
                        id="gallery"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                    />
                </div>
                {galleryPreviews.length > 0 && (
                    <div className="w-full flex overflow-x-auto gap-2.5">
                        {galleryPreviews.map((image, index) => (
                            <div
                                key={index}
                                className="cursor-pointer w-24 h-24 overflow-hidden rounded-lg relative"
                            >
                                <div
                                    className="cursor-pointer bg-primary w-fit p-2 absolute top-0 right-0 rounded-full"
                                    onClick={(e) =>
                                        removeGalleryImage(e, index)
                                    }
                                >
                                    <X className="text-white" size={12} />
                                </div>
                                <img
                                    className="w-full h-full object-cover"
                                    src={image}
                                    alt="gallery"
                                />
                            </div>
                        ))}
                    </div>
                )}
                <DialogFooter>
                    <Button
                        className=""
                        onClick={() => submitData()}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Registrando..." : "Registrar"}
                    </Button>
                </DialogFooter>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Editar Proyecto"
                open={editModalOpen}
                setOpen={setEditModalOpen}
            >
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="edit-title">Título</Label>
                    <Input
                        className="w-full"
                        id="edit-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="edit-description">Descripción</Label>
                    <Textarea
                        className="w-full"
                        id="edit-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción del proyecto..."
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="edit-gallery">
                        Agregar imágenes a la galería
                    </Label>
                    <Input
                        className="w-full"
                        id="edit-gallery"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                    />
                </div>
                {galleryPreviews.length > 0 && (
                    <div className="w-full flex overflow-x-auto gap-2.5">
                        {galleryPreviews.map((image, index) => (
                            <div
                                key={index}
                                className="cursor-pointer w-24 h-24 overflow-hidden rounded-lg relative"
                            >
                                <div
                                    className="cursor-pointer bg-primary w-fit p-2 absolute top-0 right-0 rounded-full"
                                    onClick={(e) =>
                                        removeGalleryImage(e, index)
                                    }
                                >
                                    <X className="text-white" size={12} />
                                </div>
                                <img
                                    className="w-full h-full object-cover"
                                    src={image}
                                    alt="gallery"
                                />
                            </div>
                        ))}
                    </div>
                )}
                <DialogFooter>
                    <Button
                        className=""
                        onClick={() => submitEdit()}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Actualizando..." : "Actualizar"}
                    </Button>
                </DialogFooter>
            </Modal>

            <div className="w-full py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-left">Proyectos</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestiona tu colección de proyectos. Puedes agregar nuevos
                        proyectos, editar los existentes y sus imágenes o eliminar
                        los que ya no necesites.
                    </p>
                </div>
                <Button onClick={() => setModalOpen(true)}>Agregar Proyecto</Button>
            </div>
            <CardComponent>
                {projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No hay proyectos registrados. Agrega tu primer proyecto.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
                        {projects.map((project, index) => (
                            <div key={index} className="relative group">
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative">
                                        <div className="aspect-square overflow-hidden">
                                            <Image
                                                src={project.gallery[0] || ""}
                                                alt={project.title}
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() =>
                                                    openEditModal(project)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDeleteProject(
                                                        project._id?.$oid || ""
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {project.gallery &&
                                            project.gallery.length > 1 && (
                                                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                                    {project.gallery.length}{" "}
                                                    imágenes
                                                </div>
                                            )}
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <h3 className="font-semibold text-lg truncate">
                                            {project.title}
                                        </h3>
                                        {project.description && (
                                            <p className="text-sm text-gray-600 line-clamp-3">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </CardComponent>
        </>
    );
}

export default Projects; 