"use client";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { uploadImage } from "@/app/actions";
import CardComponent from "@/components/toolkit/CardComponent";
import { CardAction, WorkType } from "@/lib/definitions";
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
    createWork,
    getWorks,
    getWork,
    updateWork,
    deleteWork,
} from "@/app/api";
import { Trash2, Edit, X } from "lucide-react";

function Obras() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File>();
    const [galleryFiles, setGalleryFiles] = useState<Array<File>>([]);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [measurements, setMeasurements] = useState<string>("");
    const [material, setMaterial] = useState<string>("");
    const [technique, setTechnique] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<Array<string>>([]);
    const [works, setWorks] = useState<WorkType[]>([]);
    const [editingWork, setEditingWork] = useState<WorkType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryUpload = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files || []);
        setGalleryFiles([...galleryFiles, ...files]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryPreviews([
                    ...galleryPreviews,
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
        if (editingWork) {
            setEditingWork({
                ...editingWork,
                gallery:
                    editingWork?.gallery?.filter((_, i) => i !== index) || [],
            });
        }
    };

    const submitData = async () => {
        setIsSubmitting(true);
        if (title === "" || imageFile == null) {
            toast.error("Favor de llenar todos los datos");
        } else {
            const formData = new FormData();
            formData.append("file", imageFile as File);

            let url = await uploadImage(formData);
            if (url) {
                let galleryUrls: string[] = [];

                // Upload gallery images if any
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

                let payload: WorkType = {
                    title: title,
                    description: description,
                    measurements: measurements,
                    material: material,
                    technique: technique,
                    img_url: url,
                    gallery: galleryUrls,
                };
                let creationRes = await createWork(payload);
                if (creationRes.status == 200) {
                    toast.success("Obra registrada!");
                    setModalOpen(false);
                    resetForm();
                    getWorksData();
                } else {
                    toast.error("Error al crear la publicación");
                }
            } else {
                toast.error("Hubo un problema al subir la imagen");
            }
        }
        setIsSubmitting(false);
    };

    const openEditModal = async (work: WorkType) => {
        setEditingWork(work);
        setTitle(work.title);
        setDescription(work.description || "");
        setMeasurements(work.measurements || "");
        setMaterial(work.material || "");
        setTechnique(work.technique || "");
        setImagePreview(work.img_url);
        setGalleryPreviews(work.gallery || []);
        setEditModalOpen(true);
    };

    const submitEdit = async () => {
        setIsSubmitting(true);
        if (!editingWork || title === "") {
            toast.error("Favor de llenar todos los datos");
            return;
        }

        let galleryUrls: string[] = [...(editingWork.gallery || [])];

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

        let payload: WorkType = {
            work_id: editingWork._id?.$oid,
            title: title,
            description: description,
            measurements: measurements,
            material: material,
            technique: technique,
            img_url: editingWork.img_url,
            gallery: galleryUrls,
        };

        let updateRes = await updateWork(payload);
        if (updateRes.status == 200) {
            toast.success("Obra actualizada!");
            setEditModalOpen(false);
            resetForm();
            getWorksData();
        } else {
            toast.error("Error al actualizar la obra");
        }
        setIsSubmitting(false);
    };

    const handleDeleteWork = async (workId: string) => {
        try {
            let deleteRes = await deleteWork(workId);
            if (deleteRes.status == 200) {
                toast.success("Obra eliminada!");
                getWorksData();
            } else {
                toast.error("Error al eliminar la obra");
            }
        } catch (error) {
            toast.error("Error al eliminar la obra");
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setMeasurements("");
        setMaterial("");
        setTechnique("");
        setImageFile(undefined);
        setImagePreview(null);
        setGalleryFiles([]);
        setGalleryPreviews([]);
        setEditingWork(null);
    };

    const getWorksData = async () => {
        try {
            let worksRes = await getWorks();
            if (worksRes.status === 200) {
                setWorks(worksRes.data.works);
            } else {
                toast.error("Error al obtener las obras");
            }
        } catch (error) {
            toast.error("Error al obtener las obras");
        }
    };

    useEffect(() => {
        getWorksData();
    }, []);

    return (
        <>
            {/* Registration Modal */}
            <Modal
                title="Registro de Obra"
                open={modalOpen}
                setOpen={setModalOpen}
            >
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="picture">Portada</Label>
                    <Input
                        className="w-full"
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>
                {imagePreview && (
                    <div className="w-full flex items-center justify-center py-5">
                        <Image
                            src={imagePreview}
                            alt="Blogpost Cover"
                            width={400}
                            height={200}
                        />
                    </div>
                )}
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="gallery">Galería (opcional)</Label>
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
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="title">Titulo</Label>
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
                        placeholder="Descripción de la obra..."
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="measurements">Medidas</Label>
                    <Input
                        className="w-full"
                        id="measurements"
                        type="text"
                        value={measurements}
                        onChange={(e) => setMeasurements(e.target.value)}
                        placeholder="Ej: 50cm x 70cm"
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                        className="w-full"
                        id="material"
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        placeholder="Ej: Óleo sobre lienzo"
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="technique">Técnica</Label>
                    <Input
                        className="w-full"
                        id="technique"
                        type="text"
                        value={technique}
                        onChange={(e) => setTechnique(e.target.value)}
                        placeholder="Ej: Pintura al óleo"
                    />
                </div>
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
                title="Editar Obra"
                open={editModalOpen}
                setOpen={setEditModalOpen}
            >
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="edit-title">Titulo</Label>
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
                        placeholder="Descripción de la obra..."
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="edit-measurements">Medidas</Label>
                    <Input
                        className="w-full"
                        id="edit-measurements"
                        type="text"
                        value={measurements}
                        onChange={(e) => setMeasurements(e.target.value)}
                        placeholder="Ej: 50cm x 70cm"
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="edit-material">Material</Label>
                    <Input
                        className="w-full"
                        id="edit-material"
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        placeholder="Ej: Óleo sobre lienzo"
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="edit-technique">Técnica</Label>
                    <Input
                        className="w-full"
                        id="edit-technique"
                        type="text"
                        value={technique}
                        onChange={(e) => setTechnique(e.target.value)}
                        placeholder="Ej: Pintura al óleo"
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

            <div className="w-full py-4 flex items-center justify-between flex-wrap">
                <div className="w-full lg:flex-1">
                    <h1 className="text-lg font-semibold text-left">Obras</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestiona tu colección de obras. Puedes agregar nuevas
                        obras, editar las existentes y sus imágenes o eliminar
                        las que ya no necesites.
                    </p>
                </div>
                <div className="w-full lg:flex-1 flex justify-center lg:justify-end items-center py-2 lg:py-0">
                    <Button onClick={() => setModalOpen(true)}>
                        Agregar Obra
                    </Button>
                </div>
            </div>
            <CardComponent>
                {works.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No hay obras registradas. Agrega tu primera obra.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
                        {works.map((work, index) => (
                            <div key={index} className="relative group">
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative">
                                        <div className="aspect-square overflow-hidden">
                                            <Image
                                                src={work.img_url}
                                                alt={work.title}
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
                                                    openEditModal(work)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDeleteWork(
                                                        work._id?.$oid || ""
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {work.gallery &&
                                            work.gallery.length > 0 && (
                                                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                                    {work.gallery.length}{" "}
                                                    imágenes
                                                </div>
                                            )}
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <h3 className="font-semibold text-lg truncate">
                                            {work.title}
                                        </h3>
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

export default Obras;
