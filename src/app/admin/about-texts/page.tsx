"use client";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import CardComponent from "@/components/toolkit/CardComponent";
import { AboutTextType } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import Modal from "@/components/toolkit/Modal";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    createAboutText,
    getAboutTexts,
    updateAboutText,
    deleteAboutText,
} from "@/app/api";
import { Trash2, Edit, Plus } from "lucide-react";

function AboutTexts() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [key, setKey] = useState<string>("");
    const [textEnUs, setTextEnUs] = useState<string>("");
    const [textEs, setTextEs] = useState<string>("");
    const [aboutTexts, setAboutTexts] = useState<AboutTextType[]>([]);
    const [editingText, setEditingText] = useState<AboutTextType | null>(null);

    const submitData = async () => {
        if (key === "" || textEnUs === "" || textEs === "") {
            toast.error("Por favor, llena todos los campos");
        } else {
            let payload: AboutTextType = {
                key: key,
                texts: {
                    "en-us": textEnUs,
                    es: textEs,
                },
            };
            let creationRes = await createAboutText(payload);
            if (creationRes.status == 200) {
                toast.success("Texto registrado!");
                setModalOpen(false);
                resetForm();
                getAboutTextsData();
            } else {
                toast.error(
                    creationRes.data?.error || "Error al crear el texto"
                );
            }
        }
    };

    const submitEditData = async () => {
        if (!editingText || key === "" || textEnUs === "" || textEs === "") {
            toast.error("Por favor, llena todos los campos");
        } else {
            let payload: AboutTextType = {
                key: key,
                texts: {
                    "en-us": textEnUs,
                    es: textEs,
                },
            };
            let updateRes = await updateAboutText(
                editingText._id?.$oid || "",
                payload
            );
            if (updateRes.status == 200) {
                toast.success("Texto actualizado!");
                setEditModalOpen(false);
                resetForm();
                getAboutTextsData();
            } else {
                toast.error(
                    updateRes.data?.error || "Error al actualizar el texto"
                );
            }
        }
    };

    const openEditModal = async (text: AboutTextType) => {
        setEditingText(text);
        setKey(text.key);
        setTextEnUs(text.texts["en-us"] || "");
        setTextEs(text.texts["es"] || "");
        setEditModalOpen(true);
    };

    const handleDeleteText = async (textId: string) => {
        try {
            let deleteRes = await deleteAboutText(textId);
            if (deleteRes.status == 200) {
                toast.success("Texto eliminado!");
                getAboutTextsData();
            } else {
                toast.error("Error al eliminar el texto");
            }
        } catch (error) {
            toast.error("Error al eliminar el texto");
        }
    };

    const resetForm = () => {
        setKey("");
        setTextEnUs("");
        setTextEs("");
        setEditingText(null);
    };

    const getAboutTextsData = async () => {
        try {
            let textsRes = await getAboutTexts();
            if (
                textsRes.status === 200 &&
                textsRes.data &&
                textsRes.data.texts
            ) {
                setAboutTexts(textsRes.data.texts);
            } else {
                console.warn("No about texts data found in response");
                setAboutTexts([]);
                toast.error("Error al obtener los textos");
            }
        } catch (error) {
            console.error("Error fetching about texts:", error);
            setAboutTexts([]);
            toast.error("Error al obtener los textos");
        }
    };

    useEffect(() => {
        getAboutTextsData();
    }, []);

    return (
        <>
            {/* Registration Modal */}
            <Modal
                title="Registro de Texto About"
                open={modalOpen}
                setOpen={setModalOpen}
            >
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="key">
                        Key (identificador único, ej: title, t1, t2, email)
                    </Label>
                    <Input
                        id="key"
                        type="text"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="title"
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="textEnUs">Texto en Inglés (en-us)</Label>
                    <Textarea
                        id="textEnUs"
                        value={textEnUs}
                        onChange={(e) => setTextEnUs(e.target.value)}
                        placeholder="Enter English text here..."
                        rows={5}
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="textEs">Texto en Español (es)</Label>
                    <Textarea
                        id="textEs"
                        value={textEs}
                        onChange={(e) => setTextEs(e.target.value)}
                        placeholder="Ingresa el texto en español aquí..."
                        rows={5}
                    />
                </div>
                <DialogFooter>
                    <Button className="" onClick={() => submitData()}>
                        Registrar
                    </Button>
                </DialogFooter>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Editar Texto About"
                open={editModalOpen}
                setOpen={setEditModalOpen}
            >
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="editKey">
                        Key (identificador único, ej: title, t1, t2, email)
                    </Label>
                    <Input
                        id="editKey"
                        type="text"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="title"
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="editTextEnUs">Texto en Inglés (en-us)</Label>
                    <Textarea
                        id="editTextEnUs"
                        value={textEnUs}
                        onChange={(e) => setTextEnUs(e.target.value)}
                        placeholder="Enter English text here..."
                        rows={5}
                    />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-full items-center gap-1.5 py-2">
                    <Label htmlFor="editTextEs">Texto en Español (es)</Label>
                    <Textarea
                        id="editTextEs"
                        value={textEs}
                        onChange={(e) => setTextEs(e.target.value)}
                        placeholder="Ingresa el texto en español aquí..."
                        rows={5}
                    />
                </div>
                <DialogFooter>
                    <Button className="" onClick={() => submitEditData()}>
                        Actualizar
                    </Button>
                </DialogFooter>
            </Modal>

            <div className="w-full py-4 flex items-center justify-between flex-wrap">
                <div className="w-full lg:flex-1">
                    <h1 className="text-lg font-semibold text-left">
                        Textos de About
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestiona los textos de la página About. Los textos se
                        almacenan en inglés (en-us) y español (es). Usa keys
                        como: title, t1, t2, t3, email, here.
                    </p>
                </div>
                <div className="w-full lg:flex-1 flex justify-center lg:justify-end items-center py-2 lg:py-0">
                    <Button
                        onClick={() => {
                            resetForm();
                            setModalOpen(true);
                        }}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Texto
                    </Button>
                </div>
            </div>
            <CardComponent>
                {aboutTexts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No hay textos registrados. Agrega tu primer texto.
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        {aboutTexts
                            .sort((a, b) => a.key.localeCompare(b.key))
                            .map((text, index) => (
                                <Card
                                    key={index}
                                    className="p-6 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2">
                                                {text.key}
                                            </h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditModal(text)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDeleteText(
                                                        text._id?.$oid || ""
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Inglés (en-us):
                                            </Label>
                                            <p className="mt-1 text-sm whitespace-pre-wrap">
                                                {text.texts["en-us"] || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Español (es):
                                            </Label>
                                            <p className="mt-1 text-sm whitespace-pre-wrap">
                                                {text.texts["es"] || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                    </div>
                )}
            </CardComponent>
        </>
    );
}

export default AboutTexts;

