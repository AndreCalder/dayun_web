"use client";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { uploadImage } from "@/app/actions";
import CardComponent from "@/components/toolkit/CardComponent";
import { AboutImageType } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import Modal from "@/components/toolkit/Modal";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import { createAboutImage, getAboutImages, deleteAboutImage } from "@/app/api";
import { Trash2, Edit, X } from "lucide-react";

function AboutImages() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File>();
    const [title, setTitle] = useState<string>("");
    const [order, setOrder] = useState<number>(0);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [aboutImages, setAboutImages] = useState<AboutImageType[]>([]);
    const [editingImage, setEditingImage] = useState<AboutImageType | null>(
        null
    );

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

    const submitData = async () => {
        if (title === "" || imageFile == null) {
            toast.error("Favor de llenar todos los datos");
        } else {
            const formData = new FormData();
            formData.append("file", imageFile as File);

            let url = await uploadImage(formData);
            if (url) {
                let payload: AboutImageType = {
                    title: title,
                    img_url: url,
                    order: order,
                };
                let creationRes = await createAboutImage(payload);
                if (creationRes.status == 200) {
                    toast.success("Imagen registrada!");
                    setModalOpen(false);
                    resetForm();
                    getAboutImagesData();
                } else {
                    toast.error("Error al crear la imagen");
                }
            } else {
                toast.error("Hubo un problema al subir la imagen");
            }
        }
    };

    const openEditModal = async (image: AboutImageType) => {
        setEditingImage(image);
        setTitle(image.title);
        setOrder(image.order || 0);
        setImagePreview(image.img_url);
        setEditModalOpen(true);
    };

    const handleDeleteImage = async (imageId: string) => {
        try {
            let deleteRes = await deleteAboutImage(imageId);
            if (deleteRes.status == 200) {
                toast.success("Imagen eliminada!");
                getAboutImagesData();
            } else {
                toast.error("Error al eliminar la imagen");
            }
        } catch (error) {
            toast.error("Error al eliminar la imagen");
        }
    };

    const resetForm = () => {
        setTitle("");
        setOrder(0);
        setImageFile(undefined);
        setImagePreview(null);
        setEditingImage(null);
    };

    const getAboutImagesData = async () => {
        try {
            let imagesRes = await getAboutImages();
            if (
                imagesRes.status === 200 &&
                imagesRes.data &&
                imagesRes.data.images
            ) {
                setAboutImages(imagesRes.data.images);
            } else {
                console.warn("No about images data found in response");
                setAboutImages([]);
                toast.error("Error al obtener las imágenes");
            }
        } catch (error) {
            console.error("Error fetching about images:", error);
            setAboutImages([]);
            toast.error("Error al obtener las imágenes");
        }
    };

    useEffect(() => {
        getAboutImagesData();
    }, []);

    return (
        <>
            {/* Registration Modal */}
            <Modal
                title="Registro de Imagen About"
                open={modalOpen}
                setOpen={setModalOpen}
            >
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="picture">Imagen</Label>
                    <Input
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
                            alt="About Image Preview"
                            width={400}
                            height={200}
                        />
                    </div>
                )}
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="order">Orden</Label>
                    <Input
                        id="order"
                        type="number"
                        value={order}
                        onChange={(e) =>
                            setOrder(parseInt(e.target.value) || 0)
                        }
                        placeholder="0"
                    />
                </div>
                <DialogFooter>
                    <Button className="" onClick={() => submitData()}>
                        Registrar
                    </Button>
                </DialogFooter>
            </Modal>

            <div className="w-full py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-left">
                        Imágenes About
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestiona las imágenes de la sección About. Puedes
                        agregar nuevas imágenes asignándoles un orden, o
                        eliminarlas.
                    </p>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    Agregar Imagen
                </Button>
            </div>
            <CardComponent>
                {aboutImages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No hay imágenes registradas. Agrega tu primera imagen.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
                        {aboutImages
                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                            .map((image, index) => (
                                <div key={index} className="relative group">
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                        <div className="relative">
                                            <div className="aspect-square overflow-hidden">
                                                <Image
                                                    src={image.img_url}
                                                    alt={image.title}
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteImage(
                                                            image._id?.$oid ||
                                                                ""
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                                Orden: {image.order || 0}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg truncate">
                                                {image.title}
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

export default AboutImages;
