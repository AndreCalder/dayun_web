"use client";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { uploadImage } from "@/app/actions";
import CardComponent from "@/components/toolkit/CardComponent";
import { CardAction, CoverType } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import Modal from "@/components/toolkit/Modal";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import { createCover, getCovers } from "@/app/api";
import { Trash2 } from "lucide-react";

function Covers() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File>();
    const [name, setName] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [covers, setCovers] = useState<CoverType[]>([]);

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
        if (name === "" || imageFile == null) {
            toast.error("Favor de llenar todos los datos");
        } else {
            const formData = new FormData();
            formData.append("file", imageFile as File);

            let url = await uploadImage(formData);
            if (url) {
                let payload: CoverType = {
                    title: name,
                    img_url: url,
                };
                let creationRes = await createCover(payload);
                if (creationRes.status == 200) {
                    toast.success("Portada registrada!");
                    setModalOpen(false);
                    // Reset form
                    setName("");
                    setImageFile(undefined);
                    setImagePreview(null);
                    // Refresh covers data
                    getCoversData();
                } else {
                    toast.error("Error al crear la portada");
                }
            } else {
                toast.error("Hubo un problema al subir la imagen");
            }
        }
    };

    const getCoversData = async () => {
        try {
            let coversRes = await getCovers();
            if (
                coversRes.status === 200 &&
                coversRes.data &&
                coversRes.data.covers
            ) {
                setCovers(coversRes.data.covers);
            } else {
                console.warn("No covers data found in response");
                setCovers([]);
                toast.error("Error al obtener las portadas");
            }
        } catch (error) {
            console.error("Error fetching covers:", error);
            setCovers([]);
            toast.error("Error al obtener las portadas");
        }
    };

    const handleDeleteCover = (coverId: string) => {
        // TODO: Implement delete functionality
        console.log("Delete cover with ID:", coverId);
    };

    useEffect(() => {
        getCoversData();
    }, []);

    return (
        <>
            <Modal
                title="Registro de Portada"
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
                            alt="Cover Preview"
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button className="" onClick={() => submitData()}>
                        Registrar
                    </Button>
                </DialogFooter>
            </Modal>
            <div className="w-full py-4 flex items-center justify-between flex-wrap">
                <div className="w-full lg:flex-1">
                    <h1 className="text-lg font-semibold text-left">
                        Portadas
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 pr-5">
                        Gestiona las portadas de tu sitio. Puedes agregar nuevas
                        portadas o eliminar las que ya no necesites.
                    </p>
                </div>
                <div className="w-full lg:flex-1 flex justify-center lg:justify-end items-center py-2 lg:py-0">
                    <Button onClick={() => setModalOpen(true)}>
                        Agregar Portada
                    </Button>
                </div>
            </div>
            <CardComponent>
                {covers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No hay portadas registradas. Agrega tu primera portada.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
                        {covers.map((cover, index) => (
                            <div key={index} className="relative group">
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative">
                                        <div className="aspect-square overflow-hidden">
                                            <Image
                                                src={cover.img_url}
                                                alt={cover.title}
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            onClick={() =>
                                                handleDeleteCover(
                                                    cover._id?.$oid || ""
                                                )
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg truncate">
                                            {cover.title}
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

export default Covers;
