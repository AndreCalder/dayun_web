"use client"

import { uploadImage } from '@/app/actions';
import { getMerchItem, updateMerchItem } from '@/app/api';
import CardComponent from '@/components/toolkit/CardComponent';
import Modal from '@/components/toolkit/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MerchType } from '@/lib/definitions';
import { X } from 'lucide-react';
import React, { useEffect } from 'react'
import { set } from 'react-hook-form';
import { toast } from 'sonner';

type paramsType = {
    id: string;
};

function MerchItem({
    params,
    searchParams,
}: {
    params: paramsType;
    searchParams: { [key: string]: string | string[] | undefined };
}) {

    const [merchItem, setMerchItem] = React.useState<MerchType | null>(null);
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [imageFiles, setImageFiles] = React.useState<Array<File>>([]);
    const [imagePreviews, setImagePreviews] = React.useState<Array<string>>([]);
    const [currImage, setCurrImage] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(true);

    const getMerchItemData = async () => {
        let res = await getMerchItem(params.id);

        if (res.status == 200) {
            setMerchItem(res.data);
        } else {
            toast.error("Error al obtener la información");
        }
    };

    const removeImage = (index: number) => {
        let newImages = []
        if (merchItem) {
            if((index <= currImage) && (currImage > 0)){
                setCurrImage(currImage - 1);
            }
            newImages = merchItem.image_urls.filter((url, i) => i !== index);
            setMerchItem({ ...merchItem, image_urls: newImages })
        }
    }

    const removePreviewImage = (index: number) => {
        let newImageFiles = []
        let newImagePreviews = []

        if (merchItem) {
            newImageFiles = imageFiles.filter((url, i) => i !== index);
            newImagePreviews = imagePreviews.filter((url, i) => i !== index);

            setImageFiles(newImageFiles);
            setImagePreviews(newImagePreviews);
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setImageFiles([...imageFiles, file as File]);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews([...imagePreviews, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitImages = async () => {
        if (imageFiles.length == 0) {
            toast.error("Favor de llenar todos los datos");
        } else {
            let imageUploadPromises = imageFiles.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                return uploadImage(formData);
            }
            );

            let imageResults: Array<string> = [];

            let imageResponses = await Promise.all(imageUploadPromises);

            imageResponses.forEach((response) => {
                if (response) {
                    imageResults.push(response);
                }
            });

            setMerchItem(merchItem ? { ...merchItem, image_urls: [...merchItem.image_urls, ...imageResults] } : null);
            toast.success("Imágenes subidas correctamente");
            setModalOpen(false);
        }
    }

    const submitData = async () => {
        if (merchItem?.name === "" || merchItem?.price === 0 || merchItem?.description === "" || merchItem?.image_urls.length == 0) {
            toast.error("Favor de llenar todos los datos");
        } else {
            if (merchItem != undefined && merchItem._id != undefined) {

                //Removing id from payload
                delete merchItem._id;
                let updateRes = await updateMerchItem(params.id, merchItem);

                if (updateRes.status == 200) {
                    toast.success('Cambios Guardados! :)')
                } else {
                    toast.error('Error al guardar los cambios :/')
                }
            }
        }
    }

    useEffect(() => {
        getMerchItemData();
    }, []);

    return (
        <>
            <Modal title="Agregar Imágenes" open={modalOpen} setOpen={setModalOpen}>
                <div className="grid w-full max-w-sm items-center gap-1.5 py-2">
                    <Label htmlFor="picture">Imágenes</Label>
                    <Input id="picture" type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
                {imagePreviews.length > 0 &&
                    <>

                        <div className="w-full flex overflow-x-auto gap-2.5">
                            {
                                imagePreviews.map((image, index) => {
                                    return (
                                        <div key={index} className='cursor-pointer w-24 h-24 overflow-hidden rounded-lg relative'>
                                            <div className="cursor-pointer bg-primary w-fit p-2 absolute top-0 right-0 rounded-full" onClick={() => removePreviewImage(index)}>
                                                <X className="text-white" size={12} />
                                            </div>
                                            <img className='w-full h-full object-cover' src={image} alt='img' />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </>
                }
                <div className="w-full flex justify-end">
                    <Button onClick={() => submitImages()}>Subir Imágenes</Button>
                </div>
            </Modal>
            <div className="w-full py-4 flex items-center justify-between">
                <h1 className='text-lg font-semibold text-center'>Información del producto</h1>
            </div>
            <CardComponent
            >
                <div className="py-5 gap-5">
                    <div className="flex flex-col gap-5">
                        <p className="font-semibold">Imágenes:</p>
                        <div className="w-fit">
                            <Button onClick={() => setModalOpen(true)}>Agregar Imágenes</Button>
                        </div>
                        <div className="w-full flex justify-center">
                            <div className='w-full h-[20rem] overflow-hidden rounded-lg border-[1px]'>
                                {
                                    merchItem?.image_urls[currImage] ?
                                    <img src={merchItem?.image_urls[currImage]} alt="imagen" className="w-full h-full object-cover" />
                                    :
                                    <p></p>
                                }
                            </div>
                        </div>
                        <div className="flex gap-5">
                            {
                                merchItem?.image_urls.map((url, index) => {
                                    return (
                                        <div key={`img_${index}`} className="h-20 w-20 overflow-hidden rounded-lg relative">
                                            <div className="cursor-pointer bg-primary w-fit p-2 absolute top-0 right-0 rounded-full" onClick={() => removeImage(index)}>
                                                <X className="text-white" size={12} />
                                            </div>
                                            <img key={index} src={url} alt="imagen" className="cursor-pointer w-full h-full object-cover" onClick={() => setCurrImage(index)} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 5">
                        <div className="col-span-2 md:col-span-1">
                            <Label htmlFor="title">Nombre</Label>
                            <Input id="title" type="text" value={merchItem?.name} onChange={(e) => setMerchItem(merchItem ? { ...merchItem, name: e.target.value } : null)} />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Label htmlFor="title">Precio</Label>
                            <Input id="title" type="number" value={merchItem?.price} onChange={(e) => setMerchItem(merchItem ? { ...merchItem, price: parseFloat(e.target.value) } : null)} />
                        </div>
                    </div>
                    <div className="w-full items-center gap-1.5 py-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea className='w-full' id="description" value={merchItem?.description} onChange={(e) => setMerchItem(merchItem ? { ...merchItem, description: e.target.value } : null)} />
                    </div>
                    <div className="w-full flex justify-end py-2">
                        <Button onClick={() => submitData()}>Guardar</Button>
                    </div>
                </div>
            </CardComponent>
        </>

    )
}

export default MerchItem